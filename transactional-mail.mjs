import nodemailer from 'nodemailer';
import {createCipheriv,createDecipheriv,randomBytes,randomUUID} from 'node:crypto';
export function mailSettings(env=process.env){
 const provider=env.AUTH_MAIL_PROVIDER||(env.AUTH_MAILER_WEBHOOK_URL?'webhook':'smtp');
 const configured=provider==='webhook'?!!(env.AUTH_MAILER_WEBHOOK_URL&&env.AUTH_MAILER_WEBHOOK_TOKEN):provider==='smtp'&&!!(env.AUTH_SMTP_HOST&&env.AUTH_SMTP_USER&&env.AUTH_SMTP_PASSWORD&&env.AUTH_MAIL_FROM);
 return {provider,configured};
}
const address=value=>typeof value==='string'&&value.length<=254&&/^[^\s@<>\r\n,;]+@[^\s@<>\r\n,;]+$/.test(value);
export async function sendTransactionalMail(message,{env=process.env,createTransport=nodemailer.createTransport,fetchImpl=fetch}={}){
 const settings=mailSettings(env);if(!settings.configured||!address(message.to)||/[\r\n]/.test(message.subject||''))throw Error('Mail delivery is not configured or message is invalid');
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
export async function migrateMailOutbox(pool){await pool.query(`CREATE TABLE IF NOT EXISTS transactional_mail_outbox(id text PRIMARY KEY,payload text,status text NOT NULL DEFAULT 'pending',attempts integer NOT NULL DEFAULT 0,next_attempt_at timestamptz NOT NULL DEFAULT now(),lease_until timestamptz,expires_at timestamptz NOT NULL DEFAULT now()+interval '7 days',created_at timestamptz NOT NULL DEFAULT now(),delivered_at timestamptz);CREATE INDEX IF NOT EXISTS transactional_mail_due ON transactional_mail_outbox(status,next_attempt_at);`)}
export async function queueTransactionalMail(c,message,{env=process.env,expiresAt=new Date(Date.now()+7*86400000)}={}){
 if(!(expiresAt instanceof Date)||!Number.isFinite(+expiresAt)||+expiresAt<=Date.now()||+expiresAt>Date.now()+7*86400000+1000)throw Error('Invalid mail expiry');
 const id=message.id||randomUUID();const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(env),iv);cipher.setAAD(Buffer.from(id));const bytes=Buffer.concat([cipher.update(JSON.stringify({...message,id}),'utf8'),cipher.final()]);
 const payload=Buffer.concat([iv,cipher.getAuthTag(),bytes]).toString('base64');await c.query('INSERT INTO transactional_mail_outbox(id,payload,expires_at) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',[id,payload,expiresAt]);return id;
}
export async function drainMailOutbox(pool,{env=process.env,deliver=sendTransactionalMail,limit=5,now=new Date()}={}){
 if(!outboxReady(env))return {delivered:0,failed:0};
 await pool.query("UPDATE transactional_mail_outbox SET payload=NULL,status='expired',lease_until=NULL WHERE expires_at<=$1 AND status='pending'",[now]);
 const due=(await pool.query("UPDATE transactional_mail_outbox SET lease_until=$1::timestamptz+interval '2 minutes' WHERE id IN (SELECT id FROM transactional_mail_outbox WHERE status='pending' AND expires_at>$1 AND next_attempt_at<=$1 AND (lease_until IS NULL OR lease_until<$1) ORDER BY created_at LIMIT $2 FOR UPDATE SKIP LOCKED) RETURNING *",[now,Math.min(20,limit)])).rows;
 let delivered=0,failed=0;
 for(const item of due){try{
  const bytes=Buffer.from(item.payload,'base64'),decipher=createDecipheriv('aes-256-gcm',key(env),bytes.subarray(0,12));decipher.setAAD(Buffer.from(item.id));decipher.setAuthTag(bytes.subarray(12,28));const message=JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString('utf8'));
  await deliver(message,{env});await pool.query("UPDATE transactional_mail_outbox SET status='delivered',payload=NULL,delivered_at=$2,lease_until=NULL,attempts=attempts+1 WHERE id=$1",[item.id,now]);delivered++;
 }catch{failed++;const attempts=item.attempts+1;await pool.query("UPDATE transactional_mail_outbox SET attempts=$2,next_attempt_at=$3,lease_until=NULL WHERE id=$1",[item.id,attempts,new Date(now.getTime()+Math.min(6*3600000,60000*2**Math.min(attempts,9)))]);}}
 return {delivered,failed};
}
