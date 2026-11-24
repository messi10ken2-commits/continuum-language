// Explicit, owner-authorized erasure. Never enabled by deployment alone.
import {createHash,randomUUID} from 'node:crypto';
import {isPlatformOwner} from './profiles-api.mjs';
import {passwordMatches} from './password-security.mjs';
import {outboxReady,queueTransactionalMail} from './transactional-mail.mjs';
import manifest from './account-erasure-schema.json' with {type:'json'};
import {recordErasureJournal} from './erasure-journal.mjs';
const failure=(status,message)=>{throw Object.assign(Error(message),{status})};
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const safe=value=>{if(!/^[a-z_]+$/.test(value))throw Error('Unexpected database identifier');return '"'+value+'"'};
export function erasurePolicy(env=process.env){
 const days=Number(env.ACCOUNT_DELETION_PROCESSING_DAYS),retentionDays=Number(env.ACCOUNT_DELETION_RETENTION_DAYS),backupDays=Number(env.ACCOUNT_DELETION_BACKUP_DAYS),version=env.ACCOUNT_DELETION_POLICY_VERSION;
 const configured=!!(env.ACCOUNT_DELETION_POLICY_PUBLISHED==='true'&&version&&/^[A-Za-z0-9._-]{1,80}$/.test(version)&&Number.isInteger(days)&&days>=1&&days<=90&&Number.isInteger(retentionDays)&&retentionDays>=1&&retentionDays<=3650&&Number.isInteger(backupDays)&&backupDays>=1&&backupDays<=365);
 return {configured,enabled:configured&&env.ACCOUNT_DELETION_ENABLED==='true'&&outboxReady(env)&&env.READINESS_MAINTENANCE_ENABLED==='true',version,days:configured?days:null,retentionDays,backupDays};
}
export async function migrateAccountErasure(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS account_deletion_requests(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid UNIQUE REFERENCES users(id) ON DELETE SET NULL,ticket_id uuid REFERENCES support_tickets(id) ON DELETE SET NULL,status text NOT NULL DEFAULT 'requested',policy_version text,processing_days integer,requested_at timestamptz NOT NULL DEFAULT now(),completed_at timestamptz,receipt_id uuid);
 CREATE TABLE IF NOT EXISTS account_erasure_receipts(id uuid PRIMARY KEY,request_id uuid NOT NULL UNIQUE,actor_id uuid REFERENCES users(id) ON DELETE SET NULL,policy_version text NOT NULL,completed_at timestamptz NOT NULL DEFAULT now(),retained_until timestamptz NOT NULL,backup_expiry timestamptz NOT NULL,placeholder_id uuid,counts jsonb NOT NULL,notification_id text NOT NULL);
 INSERT INTO account_deletion_requests(user_id,ticket_id,requested_at) SELECT user_id,id,created_at FROM support_tickets WHERE category='account' AND client_key='account-deletion-'||user_id::text ON CONFLICT(user_id) DO NOTHING;
 `)}
const schemaSQL=`SELECT tc.table_name,kcu.column_name,rc.delete_rule FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON tc.constraint_name=kcu.constraint_name AND tc.constraint_schema=kcu.constraint_schema JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name=tc.constraint_name AND ccu.constraint_schema=tc.constraint_schema JOIN information_schema.referential_constraints rc ON rc.constraint_name=tc.constraint_name AND rc.constraint_schema=tc.constraint_schema WHERE tc.constraint_type='FOREIGN KEY' AND ccu.table_name='users' AND tc.table_schema='public' ORDER BY tc.table_name,kcu.column_name`;
export async function erasurePreview(c,requestId,{env=process.env}={}){
 const request=(await c.query('SELECT r.*,u.email,u.name,u.role,u.system_actor FROM account_deletion_requests r LEFT JOIN users u ON u.id=r.user_id WHERE r.id=$1',[requestId])).rows[0];if(!request)failure(404,'Deletion request not found.');
 if(request.status==='completed')return {completed:true,receiptId:request.receipt_id};
 if(!request.user_id||request.system_actor||isPlatformOwner({id:request.user_id,role:request.role}))failure(409,'This account cannot be erased through this workflow.');
 const schema=(await c.query(schemaSQL)).rows,expected=new Map(manifest.map(row=>[row.table_name+'.'+row.column_name,row]));
 const actual=new Set(schema.map(row=>row.table_name+'.'+row.column_name));
 const missing=manifest.filter(row=>!actual.has(row.table_name+'.'+row.column_name)).map(row=>'missing:'+row.table_name+'.'+row.column_name);
 const unknown=schema.filter(row=>!expected.has(row.table_name+'.'+row.column_name)||expected.get(row.table_name+'.'+row.column_name).delete_rule!==row.delete_rule).map(row=>row.table_name+'.'+row.column_name).concat(missing);
 const counts={};for(const row of schema){const result=await c.query(`SELECT count(*)::int AS n FROM ${safe(row.table_name)} WHERE ${safe(row.column_name)}=$1`,[request.user_id]);counts[row.table_name+'.'+row.column_name]=result.rows[0].n;}
 const legacyAudio=(await c.query('SELECT count(*)::int AS n FROM speech_cache WHERE owner_id IS NULL')).rows[0].n;
 const policy=erasurePolicy(env),fingerprint=digest({requestId,userId:request.user_id,identity:digest([request.email,request.name,request.role]),schema,counts,legacyAudio,policy});
 return {requestId,userId:request.user_id,name:request.name,email:request.email,role:request.role,counts,legacyAudio,unknownSchema:unknown,policy:{configured:policy.configured,enabled:policy.enabled,version:policy.version,processingDays:policy.days,retentionDays:policy.retentionDays,backupDays:policy.backupDays},fingerprint};
}
async function transaction(pool,work){const c=await pool.connect();try{await c.query('BEGIN');const value=await work(c);await c.query('COMMIT');return value}catch(error){await c.query('ROLLBACK');throw error}finally{c.release()}}
export async function fulfilAccountErasure(pool,requestId,actor,input,{env=process.env,journal=recordErasureJournal}={}){
 if(!isPlatformOwner(actor))failure(403,'Platform owner only.');
 const policy=erasurePolicy(env);if(!policy.enabled)failure(503,'Erasure policy and encrypted completion delivery must be configured first.');
 if(input.confirm!==requestId||!['externalDataHandled','backupsPolicyApplied','retentionApproved','sharedHistoryApproved','notificationAddressVerified','userNotifiedOfPolicy'].every(key=>input[key]===true))failure(400,'Confirm the request and all fulfilment checks.');
 let journalRecord;
 const result=await transaction(pool,async c=>{
  const request=(await c.query('SELECT * FROM account_deletion_requests WHERE id=$1 FOR UPDATE',[requestId])).rows[0];if(!request)failure(404,'Deletion request not found.');
  if(request.status==='completed')return {completed:true,receiptId:request.receipt_id};
  await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[request.user_id]);
  const preview=await erasurePreview(c,requestId,{env});if(preview.unknownSchema.length)failure(409,'The erasure schema changed and needs review.');
  if(preview.fingerprint!==input.fingerprint||policy.version!==input.policyVersion)failure(409,'The deletion preview changed. Refresh it before confirming.');
  if(preview.legacyAudio&&input.clearLegacySharedAudioCache!==true)failure(409,'Legacy unowned audio requires an explicitly approved shared cache purge.');
  const id=request.user_id,placeholder=randomUUID(),receiptId=randomUUID();
  journalRecord={format:1,phase:'prepared',requestId,userId:id,receiptId,policyVersion:policy.version,createdAt:new Date().toISOString()};
  await journal(journalRecord,{env});
  // A new non-login service actor preserves only approved shared-class/financial structure.
  // The original account ID, identity, password and owned data are actually deleted.
  const needsPlaceholder=manifest.some(row=>row.strategy==='retain'&&preview.counts[row.table_name+'.'+row.column_name]>0);
  if(needsPlaceholder)await c.query("INSERT INTO users(id,email,name,role,password_hash,system_actor,share_self_learning) VALUES($1,$2,'Deleted account',$3,'!no-login',true,false)",[placeholder,'deleted-'+placeholder+'@continuum.invalid',preview.role]);
  const threadWhere='thread_id IN (SELECT id FROM class_threads WHERE teacher_id=$1 OR learner_id=$1)';
  await c.query(`DELETE FROM class_messages WHERE author_id=$1 OR ${threadWhere}`,[id]);
  await c.query(`DELETE FROM class_reads WHERE user_id=$1 OR ${threadWhere}`,[id]);
  await c.query("UPDATE class_events SET detail='{}',assignment_id=NULL WHERE actor_id=$1 OR thread_id IN (SELECT id FROM class_threads WHERE teacher_id=$1 OR learner_id=$1)",[id]);
  await c.query('UPDATE class_bookings SET slot_id=NULL WHERE slot_id IN (SELECT id FROM class_availability WHERE teacher_id=$1)',[id]);
  await c.query('DELETE FROM class_assignments WHERE learner_id=$1 OR teacher_id=$1',[id]);
  await c.query("UPDATE class_bookings SET topic='',meeting_url='',proposed_timezone='UTC',change_reason='Account deleted',client_key='erased:'||id::text,input_hash='',status=CASE WHEN status IN ('requested','confirmed') AND ends_at>now() THEN 'cancelled' ELSE status END,updated_at=now(),revision=revision+1 WHERE learner_id=$1 OR teacher_id=$1 OR proposed_by=$1",[id]);
  await c.query('DELETE FROM support_reads WHERE user_id=$1 OR ticket_id IN (SELECT id FROM support_tickets WHERE user_id=$1)',[id]);
  await c.query('DELETE FROM support_messages WHERE author_id=$1 OR ticket_id IN (SELECT id FROM support_tickets WHERE user_id=$1)',[id]);
  await c.query('DELETE FROM support_tickets WHERE user_id=$1',[id]);
  await c.query("UPDATE premium_invitations SET recipient_email='',label='',hint='',active=false,code_hash='erased:'||id::text WHERE lower(recipient_email)=lower($1) OR redeemed_by=$2 OR created_by=$2",[preview.email,id]);
  await c.query("UPDATE owner_events SET detail='{}',target=$2 WHERE target=$1 OR actor_id=$3",[id,placeholder,id]);
  await c.query("UPDATE teacher_profile_reviews SET feedback='' WHERE reviewer_id=$1",[id]);
  await c.query("UPDATE billing_blocks SET reason='Retained transaction review' WHERE user_id=$1",[id]);
  await c.query("UPDATE premium_class_tickets SET state='revoked' WHERE user_id=$1 AND state IN ('available','reserved')",[id]);
  // Explicit manifest strategies, never a blanket DELETE across an unknown schema.
  for(const row of manifest.filter(row=>row.strategy==='delete'))await c.query(`DELETE FROM ${safe(row.table_name)} WHERE ${safe(row.column_name)}=$1`,[id]);
  for(const row of manifest.filter(row=>row.strategy==='retain'))await c.query(`UPDATE ${safe(row.table_name)} SET ${safe(row.column_name)}=$2 WHERE ${safe(row.column_name)}=$1`,[id,placeholder]);
  if(preview.legacyAudio)await c.query('DELETE FROM speech_cache WHERE owner_id IS NULL');
  const now=new Date(),retainedUntil=new Date(now.getTime()+policy.retentionDays*86400000),backupExpiry=new Date(now.getTime()+policy.backupDays*86400000),notificationId='account-erasure-'+receiptId;
  await queueTransactionalMail(c,{id:notificationId,to:preview.email,template:'continuum-account-deleted',subject:'Your Continuum account deletion is complete',text:'Your Continuum account and personal learning content have been deleted. Approved shared class history and required transaction records remain under a non-login Deleted account record according to the approved retention policy. Retention review date: '+retainedUntil.toISOString()+'. Backups expire under the configured policy by '+backupExpiry.toISOString()+'. Store subscriptions must be managed separately in your store account. Receipt: '+receiptId},{env});
  await c.query('INSERT INTO account_erasure_receipts(id,request_id,actor_id,policy_version,retained_until,backup_expiry,placeholder_id,counts,notification_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)',[receiptId,requestId,actor.id,policy.version,retainedUntil,backupExpiry,needsPlaceholder?placeholder:null,JSON.stringify(preview.counts),notificationId]);
  await c.query("UPDATE account_deletion_requests SET status='completed',completed_at=now(),receipt_id=$2 WHERE id=$1",[requestId,receiptId]);
  await c.query('DELETE FROM users WHERE id=$1',[id]);
  await c.query("INSERT INTO owner_events(actor_id,kind,target,detail) VALUES($1,'account_erased',$2,$3::jsonb)",[actor.id,receiptId,JSON.stringify({receiptId,policyVersion:policy.version})]);
  return {completed:true,receiptId,notification:'queued',retainedUntil,backupExpiry};
 });
 if(journalRecord){try{await journal({...journalRecord,phase:'committed'},{env})}catch{console.warn('ERASURE_JOURNAL_COMMIT_PENDING');return {...result,journal:'pending'}}}
 return result;
}
export async function handleErasureOwner({route,req,res,pool,required,json,send,fail,limited}){
 if(!route.startsWith('/api/owner/deletion-requests'))return false;
 const actor=await required(req);if(!isPlatformOwner(actor))fail(403,'Platform owner only.');
 if(route==='/api/owner/deletion-requests'&&req.method==='GET'){const rows=(await pool.query('SELECT r.id,r.status,r.requested_at AS "requestedAt",r.completed_at AS "completedAt",r.receipt_id AS "receiptId",u.name,u.email,m.status AS "notificationStatus",m.attempts AS "notificationAttempts",e.retained_until AS "retentionReviewAt",e.backup_expiry AS "backupExpiry" FROM account_deletion_requests r LEFT JOIN users u ON u.id=r.user_id LEFT JOIN account_erasure_receipts e ON e.id=r.receipt_id LEFT JOIN transactional_mail_outbox m ON m.id=e.notification_id ORDER BY r.requested_at DESC LIMIT 100')).rows;send(res,200,{requests:rows,policy:erasurePolicy()});return true;}
 const match=route.match(/^\/api\/owner\/deletion-requests\/([a-f0-9-]{36})\/(preview|fulfil)$/);if(!match)fail(404,'Deletion endpoint not found.');
 if(match[2]==='preview'&&req.method==='GET'){send(res,200,await erasurePreview(pool,match[1]));return true;}
 if(match[2]!=='fulfil'||req.method!=='POST')fail(405,'Use GET for preview or POST for fulfilment.');
 limited(req,'owner-account-erasure',6);const input=await json(req),owner=(await pool.query('SELECT password_hash FROM users WHERE id=$1',[actor.id])).rows[0];if(!await passwordMatches(input.password,owner?.password_hash))fail(401,'Email or password is incorrect.');
 send(res,200,await fulfilAccountErasure(pool,match[1],actor,input));return true;
}
