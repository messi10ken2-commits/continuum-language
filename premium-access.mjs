import crypto from 'node:crypto';
import {isPlatformOwner} from './profiles-api.mjs';
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const email=value=>typeof value==='string'?value.trim().toLowerCase():'';
export function invitationDigest(value){if(typeof value!=='string'||value.length>120)return null;const normalized=value.normalize('NFKC').toUpperCase().replace(/[\s-]/g,'');return /^CONT[0-9A-F]{24}$/.test(normalized)?crypto.createHash('sha256').update(normalized).digest('hex'):null;}
export async function migratePremiumAccess(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS owner_membership_preview(user_id uuid PRIMARY KEY REFERENCES users(id),mode text NOT NULL CHECK(mode IN ('free','premium')),updated_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS premium_invitations(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),code_hash text NOT NULL UNIQUE,hint text NOT NULL,recipient_email text NOT NULL,label text NOT NULL,created_by uuid NOT NULL REFERENCES users(id),created_at timestamptz NOT NULL DEFAULT now(),claim_expires_at timestamptz NOT NULL,duration_days integer NOT NULL CHECK(duration_days BETWEEN 1 AND 365),include_ticket boolean NOT NULL DEFAULT false,active boolean NOT NULL DEFAULT true,redeemed_by uuid REFERENCES users(id),redeemed_at timestamptz,access_until timestamptz);
 CREATE TABLE IF NOT EXISTS premium_access_events(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),actor_id uuid NOT NULL REFERENCES users(id),invitation_id uuid REFERENCES premium_invitations(id),kind text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
 ALTER TABLE premium_invitations ALTER COLUMN claim_expires_at DROP NOT NULL;
 ALTER TABLE premium_invitations ALTER COLUMN duration_days DROP NOT NULL;
 `);}
export async function premiumAccess(c,userId){const preview=(await c.query('SELECT u.id,u.role,p.mode FROM users u LEFT JOIN owner_membership_preview p ON p.user_id=u.id WHERE u.id=$1',[userId])).rows[0];const grant=(await c.query('SELECT max(access_until) AS until,bool_or(access_until IS NULL) AS permanent,count(*) AS grants FROM premium_invitations WHERE redeemed_by=$1 AND active AND (access_until IS NULL OR access_until>now())',[userId])).rows[0];return {previewMode:isPlatformOwner(preview)?preview.mode||null:null,testerUntil:grant?.until||null,testerPermanent:!!grant?.permanent,testerActive:Number(grant?.grants)>0};}
const publicInvite=r=>({id:r.id,hint:r.hint,email:r.recipient_email,label:r.label,createdAt:r.created_at,claimExpiresAt:r.claim_expires_at,durationDays:r.duration_days,includeTicket:r.include_ticket,active:r.active,redeemed:!!r.redeemed_by,redeemedAt:r.redeemed_at,accessUntil:r.access_until});
async function audit(c,user,kind,invitation=null){await c.query('INSERT INTO premium_access_events(actor_id,invitation_id,kind) VALUES($1,$2,$3)',[user.id,invitation,kind]);}
export async function handlePremiumAccess({route,req,res,pool,user,json,send,fail,limited,transaction}){
 if(!route.startsWith('/api/billing/access'))return false;
 if(user.role!=='learner')fail(403,'Learner membership only');
 if(route==='/api/billing/access'&&req.method==='GET'){send(res,200,{owner:isPlatformOwner(user),...await premiumAccess(pool,user.id)});return true;}
 if(route==='/api/billing/access/preview'&&req.method==='POST'){
  if(!isPlatformOwner(user))fail(403,'Platform owner only');const d=await json(req);if(!['actual','free','premium'].includes(d.mode)||d.userId!==undefined)fail(400,'Choose your own preview mode');
  await transaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);if(d.mode==='actual')await c.query('DELETE FROM owner_membership_preview WHERE user_id=$1',[user.id]);else await c.query('INSERT INTO owner_membership_preview(user_id,mode) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET mode=EXCLUDED.mode,updated_at=now()',[user.id,d.mode]);await audit(c,user,'preview_'+d.mode);});send(res,200,{ok:true,owner:true,...await premiumAccess(pool,user.id)});return true;
 }
 if(route==='/api/billing/access/redeem'&&req.method==='POST'){
  limited(req,'premium-invitation-redeem',20);const d=await json(req),hash=invitationDigest(d.code);if(!hash)fail(400,'This invitation cannot be used. Check the code or contact the administrator.');
  const access=await transaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);const r=(await c.query('SELECT * FROM premium_invitations WHERE code_hash=$1 FOR UPDATE',[hash])).rows[0];
   if(!r||!r.active||r.recipient_email!==email(user.email)||r.redeemed_by&&r.redeemed_by!==user.id)fail(400,'This invitation cannot be used. Check the code or contact the administrator.');
   if(r.redeemed_by){if(r.access_until&&Date.parse(r.access_until)<=Date.now())fail(410,'This invitation has already been used and its Premium access has ended.');return r;}
   if(r.claim_expires_at&&Date.parse(r.claim_expires_at)<=Date.now())fail(410,'This invitation has expired. Ask the administrator for a new code.');
   if((await c.query('SELECT 1 FROM billing_blocks WHERE user_id=$1 AND blocked LIMIT 1',[user.id])).rows.length)fail(409,'Payment review must be resolved before using an invitation.');
   const updated=(await c.query('UPDATE premium_invitations SET redeemed_by=$2,redeemed_at=now(),access_until=now()+$3::int*interval \'1 day\' WHERE id=$1 RETURNING *',[r.id,user.id,r.duration_days])).rows[0];
   if(r.include_ticket){const g=await c.query('INSERT INTO premium_ticket_grants(user_id,invoice_id) VALUES($1,$2) ON CONFLICT(user_id) DO NOTHING RETURNING user_id',[user.id,'invitation:'+r.id]);if(g.rows.length)await c.query('INSERT INTO premium_class_tickets(user_id,number) VALUES($1,1) ON CONFLICT DO NOTHING',[user.id]);}
   await audit(c,user,'invitation_redeemed',r.id);return updated;
  });send(res,200,{ok:true,accessUntil:access.access_until,includeTicket:access.include_ticket});return true;
 }
 if(route==='/api/billing/access/invitations'){
  if(!isPlatformOwner(user))fail(403,'Platform owner only');
  if(req.method==='GET'){const rows=await pool.query('SELECT * FROM premium_invitations ORDER BY created_at DESC,id DESC LIMIT 100');send(res,200,{invitations:rows.rows.map(publicInvite),events:(await pool.query('SELECT id,kind,created_at AS at FROM premium_access_events ORDER BY created_at DESC LIMIT 30')).rows});return true;}
  if(req.method==='POST'){limited(req,'premium-invitation-admin',30);const d=await json(req),recipient=email(d.email);if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)||recipient.length>254||typeof d.label!=='string'||!d.label.trim()||d.label.trim().length>120||(d.durationDays!==null&&(!Number.isInteger(d.durationDays)||d.durationDays<1||d.durationDays>365))||(d.claimDays!==null&&(!Number.isInteger(d.claimDays)||d.claimDays<1||d.claimDays>180))||typeof d.includeTicket!=='boolean')fail(400,'Enter a recipient email, label and valid invitation dates.');
   const token=crypto.randomBytes(12).toString('hex').toUpperCase(),code='CONT-'+token.match(/.{6}/g).join('-');const row=await transaction(pool,async c=>{const r=(await c.query('INSERT INTO premium_invitations(code_hash,hint,recipient_email,label,created_by,claim_expires_at,duration_days,include_ticket) VALUES($1,$2,$3,$4,$5,now()+$6::int*interval \'1 day\',$7,$8) RETURNING *',[invitationDigest(code),token.slice(-6),recipient,d.label.trim(),user.id,d.claimDays,d.durationDays,d.includeTicket])).rows[0];await audit(c,user,'invitation_created',r.id);return r;});send(res,201,{invitation:publicInvite(row),code});return true;
  }
 }
 const revoke=route.match(/^\/api\/billing\/access\/invitations\/([a-f0-9-]{36})\/revoke$/);
 if(revoke&&req.method==='POST'){
  if(!isPlatformOwner(user))fail(403,'Platform owner only');if(!uuid.test(revoke[1]))fail(400,'Invalid invitation');await transaction(pool,async c=>{const r=(await c.query('SELECT * FROM premium_invitations WHERE id=$1 FOR UPDATE',[revoke[1]])).rows[0];if(!r)fail(404,'Invitation not found');if(!r.active)return;await c.query('UPDATE premium_invitations SET active=false WHERE id=$1',[r.id]);if(r.redeemed_by)await c.query("UPDATE premium_class_tickets SET state='revoked' WHERE user_id=$1 AND state='available' AND EXISTS(SELECT 1 FROM premium_ticket_grants WHERE user_id=$1 AND invoice_id=$2)",[r.redeemed_by,'invitation:'+r.id]);await audit(c,user,'invitation_revoked',r.id);});send(res,200,{ok:true});return true;
 }
 fail(404,'Invitation endpoint not found');
}
