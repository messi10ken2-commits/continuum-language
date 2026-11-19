// Owner-only evidence of inbox arrival. SMTP acceptance alone is not delivery proof.
import {createHash,randomBytes,randomUUID,timingSafeEqual} from 'node:crypto';
import {isPlatformOwner} from './profiles-api.mjs';
import {passwordMatches} from './password-security.mjs';
import {mailSettings,outboxReady,queueTransactionalMail} from './transactional-mail.mjs';
const hash=value=>createHash('sha256').update(value).digest();
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export async function migrateMailOperations(pool){await pool.query(`CREATE TABLE IF NOT EXISTS mail_delivery_checks(id uuid PRIMARY KEY,owner_id uuid REFERENCES users(id) ON DELETE SET NULL,code_hash text NOT NULL,outbox_id text NOT NULL,attempts integer NOT NULL DEFAULT 0,created_at timestamptz NOT NULL DEFAULT now(),expires_at timestamptz NOT NULL,confirmed_at timestamptz);`)}
export function mailOperationStatus(env=process.env){const settings=mailSettings(env);const recipient=env.AUTH_MAIL_TEST_RECIPIENT||env.AUTH_MAIL_FROM;return {provider:settings.provider,transportConfigured:settings.configured,outboxConfigured:outboxReady(env),workerEnabled:env.READINESS_MAINTENANCE_ENABLED==='true',from:env.AUTH_MAIL_FROM||null,testRecipient:recipient||null,testEnabled:outboxReady(env)&&env.READINESS_MAINTENANCE_ENABLED==='true'&&typeof recipient==='string'&&/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(recipient)};}
export async function handleMailOperations({route,req,res,pool,required,json,send,fail,limited,env=process.env}){
 if(!route.startsWith('/api/owner/mail'))return false;const owner=await required(req);if(!isPlatformOwner(owner))fail(403,'Platform owner only.');
 if(route==='/api/owner/mail'&&req.method==='GET'){const rows=(await pool.query('SELECT c.id,c.created_at AS "createdAt",c.expires_at AS "expiresAt",c.confirmed_at AS "confirmedAt",m.status AS "providerStatus",m.attempts FROM mail_delivery_checks c LEFT JOIN transactional_mail_outbox m ON m.id=c.outbox_id WHERE c.owner_id=$1 ORDER BY c.created_at DESC LIMIT 20',[owner.id])).rows;send(res,200,{...mailOperationStatus(env),checks:rows});return true;}
 if(route==='/api/owner/mail/test'&&req.method==='POST'){
  limited(req,'owner-mail-test',3);const input=await json(req),record=(await pool.query('SELECT password_hash FROM users WHERE id=$1',[owner.id])).rows[0];if(!await passwordMatches(input.password,record?.password_hash))fail(401,'Email or password is incorrect.');
  const status=mailOperationStatus(env);if(!status.testEnabled)fail(503,'Configure secure mail delivery and the encrypted worker first.');
  const id=randomUUID(),code=randomBytes(5).toString('hex').toUpperCase(),outboxId='mail-check-'+id,expires=new Date(Date.now()+30*60000),c=await pool.connect();
  try{await c.query('BEGIN');await c.query('INSERT INTO mail_delivery_checks(id,owner_id,code_hash,outbox_id,expires_at) VALUES($1,$2,$3,$4,$5)',[id,owner.id,hash(id+':'+code).toString('hex'),outboxId,expires]);await queueTransactionalMail(c,{id:outboxId,to:status.testRecipient,subject:'Continuum delivery check',text:'This is the delivery test you requested for Continuum.\n\nInbox verification code: '+code+'\n\nEnter this code only in Continuum Administration > Email. It expires in 30 minutes. It is not a password or an account recovery code.\nReference: '+id},{env,expiresAt:expires});await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
  send(res,200,{id,status:'queued',expiresAt:expires});return true;
 }
 if(route==='/api/owner/mail/confirm'&&req.method==='POST'){
  limited(req,'owner-mail-confirm',10);const d=await json(req);if(!uuid.test(d.id||'')||typeof d.code!=='string'||! /^[A-F0-9]{10}$/i.test(d.code.trim()))fail(400,'Use the code from the test email.');
  const row=(await pool.query('UPDATE mail_delivery_checks SET attempts=attempts+1 WHERE id=$1 AND owner_id=$2 AND expires_at>now() AND attempts<5 AND confirmed_at IS NULL RETURNING code_hash',[d.id,owner.id])).rows[0];
  if(!row||!timingSafeEqual(Buffer.from(row.code_hash,'hex'),hash(d.id+':'+d.code.trim().toUpperCase())))fail(400,'The inbox code is invalid or expired.');
  await pool.query('UPDATE mail_delivery_checks SET confirmed_at=now() WHERE id=$1 AND owner_id=$2',[d.id,owner.id]);send(res,200,{inboxConfirmed:true});return true;
 }
 fail(405,'Use the documented email operation.');
}
