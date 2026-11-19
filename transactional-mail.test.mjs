import test from 'node:test';import assert from 'node:assert/strict';import {PGlite} from '@electric-sql/pglite';
import {sendTransactionalMail,migrateMailOutbox,queueTransactionalMail,drainMailOutbox,mailSettings} from './transactional-mail.mjs';
const smtp={AUTH_MAIL_PROVIDER:'smtp',AUTH_SMTP_HOST:'smtp.example.test',AUTH_SMTP_USER:'synthetic',AUTH_SMTP_PASSWORD:'synthetic-only',AUTH_MAIL_FROM:'support@example.test',MAIL_OUTBOX_KEY:'1'.repeat(64)};
test('SMTP requires TLS, safe recipients and no content/credential logging; webhook refuses redirects',async()=>{
 let config,message,closed=false;await sendTransactionalMail({id:'test-message',to:'learner@example.test',subject:'Reset',text:'synthetic reset link'},{env:smtp,createTransport:options=>{config=options;return {sendMail:async m=>{message=m},close(){closed=true}}}});
 assert.equal(config.secure,true);assert.equal(config.requireTLS,true);assert.equal(config.tls.rejectUnauthorized,true);assert.equal(config.logger,false);assert.equal(config.debug,false);assert.equal(config.disableFileAccess,true);assert.equal(message.to,'learner@example.test');assert.ok(closed);
 await assert.rejects(sendTransactionalMail({to:'one@example.test,two@example.test',subject:'Reset'},{env:smtp}));
 await assert.rejects(sendTransactionalMail({to:'one@example.test',subject:'Reset\r\nBcc:evil@example.test'},{env:smtp}));
 let request;await sendTransactionalMail({to:'one@example.test',subject:'Reset',text:'test'},{env:{AUTH_MAILER_WEBHOOK_URL:'https://mailer.example.test',AUTH_MAILER_WEBHOOK_TOKEN:'synthetic-only'},fetchImpl:async(u,o)=>{request=o;return {ok:true}}});assert.equal(request.redirect,'error');
 assert.equal(mailSettings({}).configured,false);
});
test('encrypted outbox retries without erasing failures, redacts delivered payloads and expires undeliverable addresses',async()=>{
 const db=new PGlite();try{
  await migrateMailOutbox({query:sql=>db.exec(sql)});const message={id:'erasure-synthetic',to:'private@example.test',subject:'Complete',text:'Private receipt'};await queueTransactionalMail(db,message,{env:smtp});await queueTransactionalMail(db,message,{env:smtp});
  const row=(await db.query('SELECT * FROM transactional_mail_outbox')).rows[0];assert.ok(!row.payload.includes(message.to));assert.ok(!row.payload.includes(message.text));
  const failed=await drainMailOutbox(db,{env:smtp,now:new Date(Date.now()+1000),deliver:async()=>{throw Error('test delivery failure')}});assert.equal(failed.failed,1);assert.ok((await db.query('SELECT payload FROM transactional_mail_outbox')).rows[0].payload);
  let delivered;const ok=await drainMailOutbox(db,{env:smtp,now:new Date(Date.now()+3600000),deliver:async m=>delivered=m});assert.equal(ok.delivered,1);assert.equal(delivered.to,message.to);assert.equal((await db.query('SELECT payload FROM transactional_mail_outbox')).rows[0].payload,null);
  await queueTransactionalMail(db,{...message,id:'expired'},{env:smtp});await drainMailOutbox(db,{env:smtp,now:new Date(Date.now()+8*86400000),deliver:()=>assert.fail('expired mail must not be sent')});assert.equal((await db.query("SELECT payload FROM transactional_mail_outbox WHERE id='expired'")).rows[0].payload,null);
 }finally{await db.close()}
});

test('Gmail HTTPS uses server-only OAuth credentials and valid Unicode MIME without SMTP or redirects',async()=>{
 const env={AUTH_MAIL_PROVIDER:'gmail-api',AUTH_MAIL_FROM:'operator@example.test',AUTH_GMAIL_CLIENT_ID:'synthetic-client',AUTH_GMAIL_CLIENT_SECRET:'synthetic-client-secret',AUTH_GMAIL_REFRESH_TOKEN:'synthetic-refresh-token'};
 assert.equal(mailSettings(env).configured,true);assert.equal(mailSettings({...env,AUTH_GMAIL_REFRESH_TOKEN:''}).configured,false);const requests=[];
 await sendTransactionalMail({id:'receipt\r\nBcc:bad@example.test',to:'learner@example.test',subject:'Continuum ご確認',text:'日本語の確認です。\nProof: 0123456789'},{env,fetchImpl:async(url,options)=>{requests.push({url,...options});return Response.json(url.includes('oauth2.')?{access_token:'synthetic-access-token'}:{id:'synthetic-provider-id'})}});
 assert.deepEqual(requests.map(r=>r.url),['https://oauth2.googleapis.com/token','https://gmail.googleapis.com/gmail/v1/users/me/messages/send']);assert.ok(requests.every(r=>r.redirect==='error'&&r.signal));const form=new URLSearchParams(requests[0].body);assert.equal(form.get('grant_type'),'refresh_token');assert.equal(form.get('refresh_token'),env.AUTH_GMAIL_REFRESH_TOKEN);assert.equal(requests[1].headers.Authorization,'Bearer synthetic-access-token');
 const raw=Buffer.from(JSON.parse(requests[1].body).raw,'base64url').toString('utf8');assert.ok(raw.includes('To: learner@example.test\r\n'));assert.ok(raw.includes('\r\nDate: '));assert.ok(!raw.includes('Bcc:'));assert.ok(!raw.includes(env.AUTH_GMAIL_REFRESH_TOKEN));assert.equal(Buffer.from(/Subject: =\?UTF-8\?B\?(.+)\?=/.exec(raw)[1],'base64').toString(),'Continuum ご確認');assert.equal(Buffer.from(raw.split('\r\n\r\n')[1].replace(/\s/g,''),'base64').toString(),'日本語の確認です。\nProof: 0123456789');
});
test('Gmail HTTPS errors fail closed without leaking provider bodies or accepting malformed headers',async()=>{
 const env={AUTH_MAIL_PROVIDER:'gmail-api',AUTH_MAIL_FROM:'operator@example.test',AUTH_GMAIL_CLIENT_ID:'synthetic-client',AUTH_GMAIL_CLIENT_SECRET:'synthetic-secret',AUTH_GMAIL_REFRESH_TOKEN:'synthetic-refresh'};const message={to:'learner@example.test',subject:'Test',text:'Synthetic'};
 let calls=0;await assert.rejects(sendTransactionalMail(message,{env,fetchImpl:async()=>{calls++;return Response.json({error:'synthetic-private-error'},{status:401})}}),/Gmail authorization unavailable/);assert.equal(calls,1);
 await assert.rejects(sendTransactionalMail(message,{env,fetchImpl:async url=>Response.json(url.includes('oauth2.')?{access_token:'invalid\r\nheader'}:{})}),/Invalid Gmail authorization response/);
 await assert.rejects(sendTransactionalMail(message,{env,fetchImpl:async url=>Response.json(url.includes('oauth2.')?{access_token:'synthetic-access-token'}:{error:'synthetic-private-error'},{status:url.includes('oauth2.')?200:429})}),/Gmail delivery unavailable/);
 await assert.rejects(sendTransactionalMail({...message,to:'bad\u0000@example.test'},{env,fetchImpl:async()=>assert.fail('Invalid address must not reach Google')}));
});
