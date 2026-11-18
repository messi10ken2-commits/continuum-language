import test from 'node:test';import assert from 'node:assert/strict';import {randomUUID,X509Certificate} from 'node:crypto';import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';import {SignedDataVerifier} from '@apple/app-store-server-library';
import {syntheticAppleSigner} from './test-fixtures/apple-signing.mjs';
import {appleStoreSettings,migrateAppleStore,verifiedAppleState,reconcileApplePurchase,handleAppleNotifications,appleStoreAccess,appleStoreServices} from './apple-store-api.mjs';
const fail=(status,message)=>{throw Object.assign(Error(message),{status})};
const env={NODE_ENV:'test',APPLE_STORE_SERVER_ENABLED:'true',APPLE_STORE_ENVIRONMENT:'Sandbox',APPLE_STORE_BUNDLE_ID:'com.continuum.synthetic',APPLE_STORE_ISSUER_ID:'test-issuer',APPLE_STORE_KEY_ID:'test-key',APPLE_STORE_PRIVATE_KEY:'never-used-test-key',APPLE_STORE_PRODUCT_IDS:'com.continuum.premium.monthly'};
test('store gates require explicit production approval and keep Sandbox off Production',()=>{
 assert.equal(appleStoreSettings({}).enabled,false);assert.equal(appleStoreSettings({...env,NODE_ENV:'production',RAILWAY_ENVIRONMENT_NAME:'production'}).enabled,false);
 assert.equal(appleStoreSettings({...env,APPLE_STORE_ENVIRONMENT:'Production',APPLE_STORE_APP_ID:'42'}).enabled,false);
 assert.equal(appleStoreSettings({...env,APPLE_STORE_ENVIRONMENT:'Production',APPLE_STORE_APP_ID:'42',APPLE_STORE_LIVE_APPROVED:'true'}).enabled,true);
 const root=new X509Certificate(readFileSync(new URL('./certificates/apple/AppleRootCA-G3.pem',import.meta.url)));assert.equal(root.fingerprint256,'63:34:3A:BF:B8:9A:6A:03:EB:B5:7E:9B:3F:5F:A7:BE:7C:4F:5C:75:6F:30:17:B3:A8:C4:88:C3:65:3E:91:79');
 assert.ok(appleStoreServices(env).verifier instanceof SignedDataVerifier);
});
test('real certificate/JWS verification, ownership, grace, cancellation, refunds and duplicate/out-of-order notifications',async()=>{
 const previous={};for(const [k,v]of Object.entries(env)){previous[k]=process.env[k];process.env[k]=v;}
 const db=new PGlite();const query=async(sql,args)=>{const r=await db.query(sql,args);return {...r,rowCount:r.affectedRows||r.rows.length||0}};let gate=Promise.resolve();const pool={query,connect:async()=>{const prior=gate;let release;gate=new Promise(r=>release=r);await prior;return {query,release}}};
 try{
  await db.exec('CREATE TABLE users(id uuid PRIMARY KEY);');await migrateAppleStore({query:sql=>db.exec(sql)});
  const user=randomUUID(),other=randomUUID();await query('INSERT INTO users VALUES($1),($2)',[user,other]);
  const signer=syntheticAppleSigner(),settings=appleStoreSettings(env),verifier=new SignedDataVerifier(signer.roots,false,'Sandbox',settings.bundle);
  const base={bundleId:settings.bundle,environment:'Sandbox',appAccountToken:user,productId:'com.continuum.premium.monthly',originalTransactionId:'1001',transactionId:'1002',type:'Auto-Renewable Subscription',inAppOwnershipType:'PURCHASED',expiresDate:Date.now()+3600000,signedDate:Date.now()};
  let tx={...base},renewal={environment:'Sandbox',originalTransactionId:'1001',productId:base.productId,autoRenewStatus:1,signedDate:Date.now()},status=1,calls=0;
  const services={settings,verifier,client:{async getAllSubscriptionStatuses(){calls++;return {bundleId:settings.bundle,environment:'Sandbox',data:[{lastTransactions:[{status,signedTransactionInfo:signer.jws(tx),signedRenewalInfo:signer.jws(renewal)}]}]}}}};
  const valid=signer.jws(tx);assert.equal((await verifier.verifyAndDecodeTransaction(valid)).transactionId,'1002');
  const parts=valid.split('.');parts[1]=Buffer.from(JSON.stringify({...tx,appAccountToken:other})).toString('base64url');await assert.rejects(verifier.verifyAndDecodeTransaction(parts.join('.')));
  await assert.rejects(verifiedAppleState('1002',other,services),e=>e.status===422);
  await reconcileApplePurchase(pool,user,'1002',{services,checkedAt:new Date('2026-11-18T00:00:00Z')});assert.ok(await appleStoreAccess(pool,user));assert.equal(await appleStoreAccess(pool,other),null);
  renewal.autoRenewStatus=0;await reconcileApplePurchase(pool,user,'1002',{services,checkedAt:new Date('2026-11-18T00:01:00Z')});assert.equal((await appleStoreAccess(pool,user)).cancel_at_period_end,true);
  status=4;tx.expiresDate=Date.now()-1000;renewal.gracePeriodExpiresDate=Date.now()+600000;await reconcileApplePurchase(pool,user,'1002',{services,checkedAt:new Date('2026-11-18T00:02:00Z')});assert.ok(await appleStoreAccess(pool,user));
  const notice={notificationType:'REFUND',notificationUUID:randomUUID(),signedDate:Date.now(),data:{bundleId:settings.bundle,environment:'Sandbox',signedTransactionInfo:signer.jws(tx)}};
  status=5;tx.revocationDate=Date.now();let sent;
  const args={route:'/api/billing/apple/notifications',req:{method:'POST'},res:{},pool,services,json:async()=>({signedPayload:signer.jws(notice)}),send:(_r,_s,data)=>sent=data,fail};
  await handleAppleNotifications(args);assert.equal(await appleStoreAccess(pool,user),null);const count=calls;
  await handleAppleNotifications(args);assert.equal(sent.duplicate,true);assert.equal(calls,count);
  await handleAppleNotifications({...args,json:async()=>({signedPayload:signer.jws({...notice,notificationUUID:randomUUID(),notificationType:'DID_RENEW',signedDate:Date.now()-60000})})});assert.equal(await appleStoreAccess(pool,user),null,'an old notification cannot restore a refunded purchase');
  // A delayed earlier refresh cannot overwrite the newer refund observation.
  tx={...base};status=1;await reconcileApplePurchase(pool,user,'1002',{services,checkedAt:new Date('2026-11-18T00:00:00Z')});assert.equal(await appleStoreAccess(pool,user),null);
  await assert.rejects(handleAppleNotifications({...args,json:async()=>({signedPayload:'bad.signature.value'})}),e=>e.status===400);
  assert.equal((await query('SELECT count(*)::int AS n FROM apple_store_notifications')).rows[0].n,2);
 }finally{await db.close();for(const [k,v]of Object.entries(previous)){if(v===undefined)delete process.env[k];else process.env[k]=v;}}
});
