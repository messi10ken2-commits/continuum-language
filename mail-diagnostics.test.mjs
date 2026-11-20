import test from 'node:test';
import assert from 'node:assert/strict';
import {PGlite} from '@electric-sql/pglite';
import {MailDeliveryError,gmailFailure,mailFailure} from './mail-diagnostics.mjs';
import {checkGmailAuthorization,mailAuthorizationStatus,migrateMailOutbox,queueTransactionalMail,drainMailOutbox} from './transactional-mail.mjs';
const env={AUTH_MAIL_PROVIDER:'gmail-api',AUTH_MAIL_FROM:'operator@example.test',AUTH_GMAIL_CLIENT_ID:'synthetic-client',AUTH_GMAIL_CLIENT_SECRET:'PRIVATE-CLIENT-SECRET',AUTH_GMAIL_REFRESH_TOKEN:'PRIVATE-REFRESH-TOKEN',MAIL_OUTBOX_KEY:'a5'.repeat(32)};
test('Google failures expose fixed categories and HTTP status without retaining response descriptions or credentials',async()=>{
 for(const [stage,status,body,code] of [
  ['authorization',400,{error:'invalid_grant',error_description:env.AUTH_GMAIL_REFRESH_TOKEN},'GMAIL_OAUTH_INVALID_GRANT'],
  ['authorization',401,{error:'invalid_client',error_description:env.AUTH_GMAIL_CLIENT_SECRET},'GMAIL_OAUTH_INVALID_CLIENT'],
  ['send',403,{error:{message:env.AUTH_GMAIL_CLIENT_SECRET,details:[{reason:'SERVICE_DISABLED'}]}},'GMAIL_API_DISABLED'],
  ['send',403,{error:{errors:[{reason:'insufficientPermissions',message:env.AUTH_GMAIL_REFRESH_TOKEN}]}},'GMAIL_INSUFFICIENT_SCOPE'],
  ['send',403,{error:{errors:[{reason:'domainPolicy'}]}},'GMAIL_DOMAIN_POLICY'],
  ['send',429,{error:{message:env.AUTH_GMAIL_REFRESH_TOKEN}},'GMAIL_RATE_LIMITED'],
  ['send',503,{error:{message:env.AUTH_GMAIL_CLIENT_SECRET}},'GMAIL_SERVICE_UNAVAILABLE'],
  ['authorization',400,{error:'__proto__',error_description:env.AUTH_GMAIL_REFRESH_TOKEN},'GMAIL_OAUTH_REJECTED']
 ]){
  const error=await gmailFailure(Response.json(body,{status}),stage);
  assert.deepEqual(mailFailure(error),{code,httpStatus:status});
  for(const secret of [env.AUTH_GMAIL_REFRESH_TOKEN,env.AUTH_GMAIL_CLIENT_SECRET])assert.ok(!JSON.stringify(error).includes(secret)&&!error.stack.includes(secret));
 }
 assert.equal(mailFailure(new Error(env.AUTH_GMAIL_CLIENT_SECRET)).code,'MAIL_DELIVERY_FAILED');
});
test('authorization probe renews only a token, sends no email, and exposes no token in its result',async()=>{
 const urls=[];
 const result=await checkGmailAuthorization({env,fetchImpl:async url=>{urls.push(url);return Response.json({access_token:'PRIVATE-ACCESS-TOKEN'})}});
 assert.equal(result.state,'authorized');assert.deepEqual(urls,['https://oauth2.googleapis.com/token']);assert.ok(!JSON.stringify(result).includes('PRIVATE-'));
 const failed=await checkGmailAuthorization({env,fetchImpl:async()=>Response.json({error:'invalid_grant',error_description:env.AUTH_GMAIL_REFRESH_TOKEN},{status:400})});
 assert.equal(failed.code,'GMAIL_OAUTH_INVALID_GRANT');assert.equal(failed.httpStatus,400);assert.deepEqual(mailAuthorizationStatus(),failed);assert.ok(!JSON.stringify(failed).includes('PRIVATE-'));
});
test('outbox preserves safe retry diagnostics, expires ciphertext and clears failures only after provider acceptance',async()=>{
 const db=new PGlite();try{
  const pool={query:sql=>db.exec(sql)};await migrateMailOutbox(pool);await migrateMailOutbox(pool);
  const message={id:'safe-mail-check',to:'private-inbox@example.test',subject:'Private subject',text:'PRIVATE-INBOX-CODE'};
  await queueTransactionalMail(db,message,{env});
  const now=new Date(Date.now()+1000);
  const failed=await drainMailOutbox(db,{env,now,deliver:async()=>{throw new MailDeliveryError('GMAIL_API_DISABLED',403)}});
  assert.deepEqual(failed.failures,{GMAIL_API_DISABLED:1});
  const row=(await db.query('SELECT * FROM transactional_mail_outbox')).rows[0];assert.equal(row.last_error_code,'GMAIL_API_DISABLED');assert.equal(row.last_error_status,403);assert.equal(row.attempts,1);assert.ok(row.payload&&+row.next_attempt_at>+now);
  assert.ok(!JSON.stringify(row).includes(message.to)&&!JSON.stringify(row).includes(message.text));
  const sent=await drainMailOutbox(db,{env,now:new Date(+now+180000),deliver:async()=>({providerMessageId:'19abc123'})});assert.equal(sent.delivered,1);
  const accepted=(await db.query('SELECT * FROM transactional_mail_outbox')).rows[0];assert.equal(accepted.payload,null);assert.equal(accepted.last_error_code,null);assert.equal(accepted.last_error_status,null);assert.equal(accepted.provider_message_id,'19abc123');assert.equal(accepted.attempts,2);
  await queueTransactionalMail(db,{...message,id:'wrong-key'},{env});
  const wrong=await drainMailOutbox(db,{env:{...env,MAIL_OUTBOX_KEY:'b6'.repeat(32)},deliver:async()=>assert.fail('Corrupt ciphertext must never reach the provider')});assert.deepEqual(wrong.failures,{MAIL_OUTBOX_DECRYPTION_FAILED:1});
  await drainMailOutbox(db,{env,now:new Date(Date.now()+8*86400000),deliver:async()=>assert.fail('Expired payload must not be sent')});
  const expired=(await db.query("SELECT * FROM transactional_mail_outbox WHERE id='wrong-key'")).rows[0];assert.equal(expired.status,'expired');assert.equal(expired.payload,null);assert.equal(expired.last_error_code,'MAIL_OUTBOX_DECRYPTION_FAILED');
 }finally{await db.close()}
});
