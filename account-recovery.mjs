import {mailSettings,outboxReady,queueTransactionalMail} from './transactional-mail.mjs';
import crypto from 'node:crypto';import {passwordHash} from './password-security.mjs';import {billingTransaction} from './billing-api.mjs';
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
export async function migrateAccountRecovery(pool){await pool.query(`CREATE TABLE IF NOT EXISTS account_recovery_tokens(token_hash text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at timestamptz NOT NULL,used_at timestamptz);CREATE INDEX IF NOT EXISTS account_recovery_expiry ON account_recovery_tokens(expires_at);`);}
export async function deliverRecovery(email,token,{pool}={}){
 const origin=new URL(process.env.AUTH_RECOVERY_PUBLIC_ORIGIN||'https://continuum-language-production.up.railway.app');if(origin.protocol!=='https:'||origin.pathname!=='/'||origin.username||origin.password||origin.search||origin.hash)throw Error('Recovery origin requires HTTPS');
 const url=new URL(origin);url.searchParams.set('reset_token',token);
 if(!pool||!outboxReady()||process.env.READINESS_MAINTENANCE_ENABLED!=='true')throw Error('Recovery delivery worker is not configured');
 await queueTransactionalMail(pool,{id:'recovery-'+hash(token),to:email,template:'continuum-password-reset',resetURL:url.href,expiresMinutes:30,subject:'Reset your Continuum password',text:'Use this link within 30 minutes to reset your Continuum password: '+url.href+'\nThis link expires 30 minutes after your request. If you did not request this, ignore this email.'},{expiresAt:new Date(Date.now()+30*60000)});
}
export async function handleAccountRecovery({route,req,res,pool,json,send,fail,authLimited,clientAddress,deliver=deliverRecovery}){
 if(!['/api/auth/recovery','/api/auth/reset'].includes(route)||req.method!=='POST')return false;
 await authLimited('recovery-ip',clientAddress(req),6);const data=await json(req);
 if(route==='/api/auth/recovery'){
  if(!mailSettings().configured||(deliver===deliverRecovery&&(!outboxReady()||process.env.READINESS_MAINTENANCE_ENABLED!=='true')))fail(503,'Password recovery delivery is not configured. Contact Continuum Support.');
  const email=String(data.email||'').trim().toLowerCase();if(email.length>254||!/^\S+@\S+\.\S+$/.test(email))fail(400,'Enter a valid email');
  await authLimited('recovery-account',hash(email),3);
  const user=(await pool.query('SELECT id FROM users WHERE email=$1',[email])).rows[0];
  if(user){const token=crypto.randomBytes(32).toString('base64url');try{await billingTransaction(pool,async c=>{await c.query("INSERT INTO account_recovery_tokens(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '30 minutes')",[hash(token),user.id]);await deliver(email,token,{pool:c});})}catch{console.warn('Password recovery delivery unavailable');}}
  send(res,200,{accepted:true});return true;
 }
 if(typeof data.token!=='string'||!/^[A-Za-z0-9_-]{43}$/.test(data.token)||typeof data.password!=='string'||data.password.length<12||data.password.length>128)fail(400,'Use a valid recovery link and a password of 12–128 characters');
 const password=await passwordHash(data.password);
 await billingTransaction(pool,async c=>{
  const row=(await c.query('SELECT user_id FROM account_recovery_tokens WHERE token_hash=$1 AND expires_at>now() AND used_at IS NULL FOR UPDATE',[hash(data.token)])).rows[0];if(!row)fail(400,'Recovery link is invalid or expired');
  await c.query('UPDATE users SET password_hash=$2 WHERE id=$1',[row.user_id,password]);
  await c.query('UPDATE account_recovery_tokens SET used_at=now() WHERE user_id=$1',[row.user_id]);
  await c.query('DELETE FROM sessions WHERE user_id=$1',[row.user_id]);
 });send(res,200,{reset:true});return true;
}
