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
