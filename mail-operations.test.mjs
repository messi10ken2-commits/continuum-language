import test from 'node:test';import assert from 'node:assert/strict';import {drainMailOutbox} from './transactional-mail.mjs';
import {MailDeliveryError} from './mail-diagnostics.mjs';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
test('owner inbox check requires authentication, fresh password, encrypted worker and a code available only in the email',async()=>{
 const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
 const keys=['CONTINUUM_OWNER_USER_ID','AUTH_MAIL_PROVIDER','AUTH_SMTP_HOST','AUTH_SMTP_USER','AUTH_SMTP_PASSWORD','AUTH_MAIL_FROM','AUTH_MAIL_TEST_RECIPIENT','MAIL_OUTBOX_KEY','READINESS_MAINTENANCE_ENABLED'],before=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 const api=async(path,method='GET',body,user)=>{const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',Connection:'close',...(user?{cookie:user.cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}};
 const register=async name=>api('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-mail-password',role:'learner',adult:true});
 try{
 const owner=await register('mail-owner'),other=await register('mail-other');process.env.CONTINUUM_OWNER_USER_ID=owner.data.user.id;
 assert.equal((await api('/owner/mail')).status,401);assert.equal((await api('/owner/mail','GET',null,other)).status,403);assert.equal((await api('/owner/mail','GET',null,owner)).data.testEnabled,false);
 assert.equal((await api('/owner/mail/test','POST',{password:'incorrect'},owner)).status,401);
 assert.equal((await api('/owner/mail/test','POST',{password:'synthetic-mail-password'},owner)).status,503);
 Object.assign(process.env,{AUTH_MAIL_PROVIDER:'smtp',AUTH_SMTP_HOST:'smtp.example.test',AUTH_SMTP_USER:'fixture',AUTH_SMTP_PASSWORD:'synthetic-not-a-secret',AUTH_MAIL_FROM:'fixture@example.test',AUTH_MAIL_TEST_RECIPIENT:'inbox@example.test',MAIL_OUTBOX_KEY:'a5'.repeat(32),READINESS_MAINTENANCE_ENABLED:'true'});
 const queued=await api('/owner/mail/test','POST',{password:'synthetic-mail-password',to:'unapproved@example.test'},owner);assert.equal(queued.status,200);assert.equal(queued.data.status,'queued');assert.equal(queued.data.code,undefined);
 const encrypted=(await db.query('SELECT * FROM transactional_mail_outbox')).rows[0];assert.ok(!encrypted.payload.includes('inbox@example.test'));
 const query=async(sql,args)=>{const r=await db.query(sql,args);return {...r,rowCount:r.affectedRows||r.rows.length||0}};let message;
 await drainMailOutbox({query},{deliver:async()=>{throw new MailDeliveryError('GMAIL_OAUTH_INVALID_GRANT',400)}});
 const diagnostic=await api('/owner/mail','GET',null,owner);assert.equal(diagnostic.data.checks[0].lastErrorCode,'GMAIL_OAUTH_INVALID_GRANT');assert.equal(diagnostic.data.checks[0].lastErrorStatus,400);assert.equal(diagnostic.data.checks[0].attempts,1);assert.ok(diagnostic.data.checks[0].nextAttemptAt);assert.ok(!JSON.stringify(diagnostic.data).includes('synthetic-not-a-secret'));
 const sent=await drainMailOutbox({query},{now:new Date(Date.now()+180000),deliver:async value=>{message=value;return {providerMessageId:'19abc123'}}});assert.equal(sent.delivered,1);assert.equal(message.to,'inbox@example.test');assert.equal((await db.query('SELECT payload FROM transactional_mail_outbox')).rows[0].payload,null);
 const status=await api('/owner/mail','GET',null,owner);assert.equal(status.data.checks[0].providerStatus,'delivered');assert.equal(status.data.checks[0].confirmedAt,null,'SMTP success is not inbox proof');
 assert.equal(status.data.checks[0].lastErrorCode,null);assert.equal(status.data.checks[0].providerMessageId,'19abc123');assert.ok(status.data.checks[0].providerAcceptedAt);
 const code=/Inbox verification code: ([A-F0-9]{10})/.exec(message.text)[1];assert.ok(!JSON.stringify(status.data).includes(code));
 assert.equal((await api('/owner/mail/confirm','POST',{id:queued.data.id,code:'0000000000'},owner)).status,400);
 assert.equal((await api('/owner/mail/confirm','POST',{id:queued.data.id,code},other)).status,403);
 assert.equal((await api('/owner/mail/confirm','POST',{id:queued.data.id,code},owner)).data.inboxConfirmed,true);
 assert.equal((await api('/owner/mail/confirm','POST',{id:queued.data.id,code},owner)).status,400,'one use');
 }finally{for(const [k,v]of Object.entries(before))if(v===undefined)delete process.env[k];else process.env[k]=v;await new Promise(r=>testServer.close(r));await db.close()}
});
