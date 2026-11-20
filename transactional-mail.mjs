import nodemailer from 'nodemailer';
import {createCipheriv,createDecipheriv,randomBytes,randomUUID,createHash} from 'node:crypto';
import {MailDeliveryError,mailFailure,gmailFailure} from './mail-diagnostics.mjs';
export function mailSettings(env=process.env){
 const provider=env.AUTH_MAIL_PROVIDER||(env.AUTH_MAILER_WEBHOOK_URL?'webhook':'smtp');
 let webhook=false;try{const u=new URL(env.AUTH_MAILER_WEBHOOK_URL);webhook=u.protocol==='https:'&&!u.username&&!u.password&&!u.hash&&!!env.AUTH_MAILER_WEBHOOK_TOKEN}catch{}
 const gmail=provider==='gmail-api'&&address(env.AUTH_MAIL_FROM)&&!!(env.AUTH_GMAIL_CLIENT_ID&&env.AUTH_GMAIL_CLIENT_SECRET&&env.AUTH_GMAIL_REFRESH_TOKEN);
 const configured=provider==='gmail-api'?gmail:provider==='webhook'?webhook:provider==='smtp'&&!!(env.AUTH_SMTP_HOST&&/^[A-Za-z0-9.-]+$/.test(env.AUTH_SMTP_HOST)&&env.AUTH_SMTP_USER&&env.AUTH_SMTP_PASSWORD&&address(env.AUTH_MAIL_FROM)&&[465,587].includes(Number(env.AUTH_SMTP_PORT||465)));
 return {provider,configured};
}
const address=value=>typeof value==='string'&&value.length<=254&&/^[^\s@<>\x00-\x1f\x7f,;]+@[^\s@<>\x00-\x1f\x7f,;]+$/.test(value);
async function gmailFetch(url,options,fetchImpl){
 try{return await fetchImpl(url,options)}catch(error){throw new MailDeliveryError(['TimeoutError','AbortError'].includes(error?.name)?'MAIL_TIMEOUT':'MAIL_NETWORK_ERROR')}
}
async function gmailAuthorization(env,fetchImpl){
 const auth=await gmailFetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.AUTH_GMAIL_CLIENT_ID,client_secret:env.AUTH_GMAIL_CLIENT_SECRET,refresh_token:env.AUTH_GMAIL_REFRESH_TOKEN,grant_type:'refresh_token'}).toString(),redirect:'error',signal:AbortSignal.timeout(10000)},fetchImpl);
 if(!auth.ok)throw await gmailFailure(auth,'authorization');
 const credentials=await auth.json().catch(()=>null);
 if(typeof credentials?.access_token!=='string'||credentials.access_token.length>4096||! /^[A-Za-z0-9._~+\/-]+=*$/.test(credentials.access_token))throw new MailDeliveryError('GMAIL_INVALID_AUTH_RESPONSE',null,'Invalid Gmail authorization response');
 return credentials.access_token;
}
let authorizationCheck={state:'not_checked',checkedAt:null,code:null,httpStatus:null};
export const mailAuthorizationStatus=()=>({...authorizationCheck});
export async function checkGmailAuthorization({env=process.env,fetchImpl=fetch}={}){
 if(mailSettings(env).provider!=='gmail-api'||!mailSettings(env).configured)return {state:'not_configured',checkedAt:null,code:null,httpStatus:null};
 authorizationCheck={state:'checking',checkedAt:null,code:null,httpStatus:null};
 try{await gmailAuthorization(env,fetchImpl);authorizationCheck={state:'authorized',checkedAt:new Date().toISOString(),code:null,httpStatus:null}}
 catch(error){authorizationCheck={state:'failed',checkedAt:new Date().toISOString(),...mailFailure(error)}}
 return mailAuthorizationStatus();
}
export async function sendTransactionalMail(message,{env=process.env,createTransport=nodemailer.createTransport,fetchImpl=fetch}={}){
 const settings=mailSettings(env);if(!settings.configured||!address(message.to)||/[\r\n]/.test(message.subject||''))throw Error('Mail delivery is not configured or message is invalid');
 if(settings.provider==='gmail-api'){
  const token=await gmailAuthorization(env,fetchImpl);
  const id=createHash('sha256').update(message.id||randomUUID()).digest('hex'),subject=Buffer.from(String(message.subject||'Continuum'),'utf8').toString('base64'),body=Buffer.from(String(message.text||''),'utf8').toString('base64').match(/.{1,76}/g)?.join('\r\n')||'';
  const mime=['From: Continuum <'+env.AUTH_MAIL_FROM+'>','To: '+message.to,'Date: '+new Date().toUTCString(),'Subject: =?UTF-8?B?'+subject+'?=','Message-ID: <'+id+'@continuum.invalid>','MIME-Version: 1.0','Content-Type: text/plain; charset=UTF-8','Content-Transfer-Encoding: base64','',''+body,''].join('\r\n');
  const sent=await gmailFetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({raw:Buffer.from(mime,'utf8').toString('base64url')}),redirect:'error',signal:AbortSignal.timeout(10000)},fetchImpl);
  if(!sent.ok)throw await gmailFailure(sent,'send');
  const receipt=await sent.json().catch(()=>null);
  return {providerMessageId:typeof receipt?.id==='string'&&/^[a-f0-9]{1,64}$/i.test(receipt.id)?receipt.id:null};
 }
 if(settings.provider==='webhook'){
  const url=new URL(env.AUTH_MAILER_WEBHOOK_URL);if(url.protocol!=='https:'||url.username||url.password||url.hash)throw Error('Mail delivery requires HTTPS');
  const response=await fetchImpl(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+env.AUTH_MAILER_WEBHOOK_TOKEN,'Idempotency-Key':message.id||randomUUID()},body:JSON.stringify(message),redirect:'error',signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Mail delivery unavailable');return;
 }
 const port=Number(env.AUTH_SMTP_PORT||465);if(![465,587].includes(port)||!address(env.AUTH_MAIL_FROM)||!/^[A-Za-z0-9.-]+$/.test(env.AUTH_SMTP_HOST))throw Error('Invalid secure SMTP configuration');
 const transport=createTransport({host:env.AUTH_SMTP_HOST,port,secure:port===465,requireTLS:true,auth:{user:env.AUTH_SMTP_USER,pass:env.AUTH_SMTP_PASSWORD},tls:{minVersion:'TLSv1.2',rejectUnauthorized:true},connectionTimeout:10000,greetingTimeout:10000,socketTimeout:10000,dnsTimeout:10000,logger:false,debug:false,disableFileAccess:true,disableUrlAccess:true});
 try{await transport.sendMail({from:{name:'Continuum',address:env.AUTH_MAIL_FROM},to:message.to,subject:message.subject,text:message.text,messageId:message.id?'<'+message.id+'@continuum.invalid>':undefined,disableFileAccess:true,disableUrlAccess:true})}finally{transport.close()}
}
function key(env){if(!/^[a-f0-9]{64}$/i.test(env.MAIL_OUTBOX_KEY||''))throw Error('Encrypted mail outbox is not configured');return Buffer.from(env.MAIL_OUTBOX_KEY,'hex')}
export const outboxReady=(env=process.env)=>mailSettings(env).configured&&/^[a-f0-9]{64}$/i.test(env.MAIL_OUTBOX_KEY||'');
export async function migrateMailOutbox(pool){await pool.query(`CREATE TABLE IF NOT EXISTS transactional_mail_outbox(id text PRIMARY KEY,payload text,status text NOT NULL DEFAULT 'pending',attempts integer NOT NULL DEFAULT 0,next_attempt_at timestamptz NOT NULL DEFAULT now(),lease_until timestamptz,expires_at timestamptz NOT NULL DEFAULT now()+interval '7 days',created_at timestamptz NOT NULL DEFAULT now(),delivered_at timestamptz);CREATE INDEX IF NOT EXISTS transactional_mail_due ON transactional_mail_outbox(status,next_attempt_at);ALTER TABLE transactional_mail_outbox ADD COLUMN IF NOT EXISTS last_error_code text;ALTER TABLE transactional_mail_outbox ADD COLUMN IF NOT EXISTS last_error_status integer;ALTER TABLE transactional_mail_outbox ADD COLUMN IF NOT EXISTS last_attempt_at timestamptz;ALTER TABLE transactional_mail_outbox ADD COLUMN IF NOT EXISTS provider_message_id text;`)}
export async function queueTransactionalMail(c,message,{env=process.env,expiresAt=new Date(Date.now()+7*86400000)}={}){
 if(!(expiresAt instanceof Date)||!Number.isFinite(+expiresAt)||+expiresAt<=Date.now()||+expiresAt>Date.now()+7*86400000+1000)throw Error('Invalid mail expiry');
 const id=message.id||randomUUID();const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(env),iv);cipher.setAAD(Buffer.from(id));const bytes=Buffer.concat([cipher.update(JSON.stringify({...message,id}),'utf8'),cipher.final()]);
 const payload=Buffer.concat([iv,cipher.getAuthTag(),bytes]).toString('base64');await c.query('INSERT INTO transactional_mail_outbox(id,payload,expires_at) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[id,payload,expiresAt]);return id;
}
export async function drainMailOutbox(pool,{env=process.env,deliver=sendTransactionalMail,limit=5,now=new Date()}={}){
 if(!outboxReady(env))return {delivered:0,failed:0};
 await pool.query("UPDATE transactional_mail_outbox SET payload=NULL,status='expired',lease_until=NULL WHERE expires_at<=$1 AND status='pending'",[now]);
 const due=(await pool.query("UPDATE transactional_mail_outbox SET lease_until=$1::timestamptz+interval '2 minutes' WHERE id IN (SELECT id FROM transactional_mail_outbox WHERE status='pending' AND expires_at>$1 AND next_attempt_at<=$1 AND (lease_until IS NULL OR lease_until<$1) ORDER BY created_at LIMIT $2 FOR UPDATE SKIP LOCKED) RETURNING *",[now,Math.min(20,limit)])).rows;
 let delivered=0,failed=0;const failures={};
 for(const item of due){try{
  let message;try{
  const bytes=Buffer.from(item.payload,'base64'),decipher=createDecipheriv('aes-256-gcm',key(env),bytes.subarray(0,12));decipher.setAAD(Buffer.from(item.id));decipher.setAuthTag(bytes.subarray(12,28));message=JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString('utf8'));
  }catch{throw new MailDeliveryError('MAIL_OUTBOX_DECRYPTION_FAILED')}
  const receipt=await deliver(message,{env});await pool.query("UPDATE transactional_mail_outbox SET status='delivered',payload=NULL,delivered_at=$2,lease_until=NULL,attempts=attempts+1,last_attempt_at=$2,last_error_code=NULL,last_error_status=NULL,provider_message_id=$3 WHERE id=$1",[item.id,now,receipt?.providerMessageId||null]);delivered++;
 }catch(error){failed++;const diagnostic=mailFailure(error);failures[diagnostic.code]=(failures[diagnostic.code]||0)+1;const attempts=item.attempts+1;await pool.query("UPDATE transactional_mail_outbox SET attempts=$2,next_attempt_at=$3,lease_until=NULL,last_error_code=$4,last_error_status=$5,last_attempt_at=$6 WHERE id=$1",[item.id,attempts,new Date(now.getTime()+Math.min(6*3600000,60000*2**Math.min(attempts,9))),diagnostic.code,diagnostic.httpStatus,now]);}}
 return {delivered,failed,failures};
}
