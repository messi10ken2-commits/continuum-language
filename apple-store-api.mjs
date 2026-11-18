// Default-off App Store Server API/Notifications V2 integration. No client entitlement grants.
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {AppStoreServerAPIClient,Environment,SignedDataVerifier} from '@apple/app-store-server-library';
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const transactionID=/^[0-9]{1,32}$/;
const failure=(status,message)=>{throw Object.assign(Error(message),{status})};
export function appleStoreSettings(env=process.env){
 const environment=env.APPLE_STORE_ENVIRONMENT||'Sandbox',railway=env.RAILWAY_ENVIRONMENT_NAME?.toLowerCase();
 const isolated=railway?['staging','billing-staging'].includes(railway):env.NODE_ENV!=='production';
 const appAppleId=Number(env.APPLE_STORE_APP_ID);
 const configured=!!(env.APPLE_STORE_BUNDLE_ID&&env.APPLE_STORE_ISSUER_ID&&env.APPLE_STORE_KEY_ID&&env.APPLE_STORE_PRIVATE_KEY&&env.APPLE_STORE_PRODUCT_IDS&&
  ['Production','Sandbox'].includes(environment)&&(environment!=='Production'||Number.isSafeInteger(appAppleId)&&appAppleId>0));
 const enabled=configured&&env.APPLE_STORE_SERVER_ENABLED==='true'&&(environment==='Production'?env.APPLE_STORE_LIVE_APPROVED==='true':isolated);
 return {enabled,configured,environment,appAppleId,bundle:env.APPLE_STORE_BUNDLE_ID,products:new Set((env.APPLE_STORE_PRODUCT_IDS||'').split(',').map(x=>x.trim()).filter(Boolean))};
}
export async function migrateAppleStore(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS apple_store_subscriptions(original_id text PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,environment text NOT NULL,product_id text NOT NULL,transaction_id text NOT NULL,access_until timestamptz NOT NULL,revoked boolean NOT NULL DEFAULT false,cancel_at_period_end boolean NOT NULL DEFAULT false,verified_at timestamptz NOT NULL);
 CREATE INDEX IF NOT EXISTS apple_store_subscriptions_user ON apple_store_subscriptions(user_id,access_until DESC);
 CREATE TABLE IF NOT EXISTS apple_store_notifications(notification_id text PRIMARY KEY,type text NOT NULL,payload_hash text NOT NULL,processed_at timestamptz NOT NULL DEFAULT now());
 `)}
class BoundedAppleClient extends AppStoreServerAPIClient{
 constructor(env,settings){super(env.APPLE_STORE_PRIVATE_KEY,env.APPLE_STORE_KEY_ID,env.APPLE_STORE_ISSUER_ID,settings.bundle,settings.environment);this.apiOrigin=settings.environment==='Production'?'https://api.storekit.itunes.apple.com':'https://api.storekit-sandbox.itunes.apple.com';}
 makeFetchRequest(path,parameters,method,body,headers){return fetch(this.apiOrigin+path+(parameters.size?'?'+parameters:''),{method,body,headers,redirect:'error',signal:AbortSignal.timeout(12000)});}
}
let cached;
export function appleStoreServices(env=process.env){
 const settings=appleStoreSettings(env);if(!settings.enabled)failure(503,'Apple store verification is not configured.');
 const fingerprint=createHash('sha256').update(JSON.stringify([settings.environment,settings.bundle,settings.appAppleId,env.APPLE_STORE_KEY_ID,env.APPLE_STORE_ISSUER_ID,env.APPLE_STORE_PRIVATE_KEY])).digest('hex');
 if(cached?.fingerprint===fingerprint)return cached.services;
 const root=readFileSync(new URL('./certificates/apple/AppleRootCA-G3.pem',import.meta.url));
 const services={settings,client:new BoundedAppleClient(env,settings),verifier:new SignedDataVerifier([root],true,settings.environment,settings.bundle,settings.environment==='Production'?settings.appAppleId:undefined)};
 cached={fingerprint,services};return services;
}
export async function appleStoreAccess(db,userId){
 const s=appleStoreSettings();if(!s.enabled)return null;
 const row=(await db.query('SELECT access_until,cancel_at_period_end FROM apple_store_subscriptions WHERE user_id=$1 AND environment=$2 AND NOT revoked AND access_until>now() ORDER BY access_until DESC LIMIT 1',[userId,s.environment])).rows[0];
 return row?{...row,provider:'apple',source:s.environment==='Production'?'apple':'apple_sandbox'}:null;
}
export async function verifiedAppleState(transactionId,userId,services){
 if(!transactionID.test(transactionId||'')||!uuid.test(userId||''))failure(400,'Enter a valid store transaction.');
 const {settings:s,client,verifier}=services;
 const data=await client.getAllSubscriptionStatuses(transactionId);
 if(data.bundleId!==s.bundle||data.environment!==s.environment||(s.environment==='Production'&&data.appAppleId!==s.appAppleId))failure(422,'The store response does not match this app.');
 const states=[];
 for(const item of (data.data||[]).flatMap(group=>group.lastTransactions||[])){
  const tx=await verifier.verifyAndDecodeTransaction(item.signedTransactionInfo);
  if(tx.bundleId!==s.bundle||tx.environment!==s.environment||!s.products.has(tx.productId))continue;
  if(tx.appAccountToken?.toLowerCase()!==userId.toLowerCase())continue;
  if(tx.type!=='Auto-Renewable Subscription'||tx.inAppOwnershipType!=='PURCHASED'||!transactionID.test(tx.originalTransactionId||'')||!transactionID.test(tx.transactionId||''))failure(422,'Unsupported store entitlement.');
  let renewal;
  if(item.signedRenewalInfo){renewal=await verifier.verifyAndDecodeRenewalInfo(item.signedRenewalInfo);if(renewal.originalTransactionId!==tx.originalTransactionId||renewal.environment!==s.environment||renewal.productId!==tx.productId)failure(422,'The renewal does not match this transaction.');}
  const revoked=!!tx.revocationDate||!!tx.isUpgraded||item.status===5;
  const expiry=revoked?0:(item.status===1?tx.expiresDate:item.status===4?renewal?.gracePeriodExpiresDate:0);
  if(expiry!==undefined&&!Number.isSafeInteger(expiry))failure(422,'Invalid store expiry.');
  states.push({originalId:tx.originalTransactionId,transactionId:tx.transactionId,productId:tx.productId,accessUntil:new Date(expiry||0),revoked,cancelAtPeriodEnd:renewal?.autoRenewStatus===0});
 }
 if(!states.length)failure(422,'This purchase is not linked to this Continuum account.');
 return states;
}
async function saveStates(c,userId,states,settings,checkedAt){
 for(const state of states){
  const r=await c.query(`INSERT INTO apple_store_subscriptions(original_id,user_id,environment,product_id,transaction_id,access_until,revoked,cancel_at_period_end,verified_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
   ON CONFLICT(original_id) DO UPDATE SET product_id=EXCLUDED.product_id,transaction_id=EXCLUDED.transaction_id,access_until=EXCLUDED.access_until,revoked=EXCLUDED.revoked,cancel_at_period_end=EXCLUDED.cancel_at_period_end,verified_at=EXCLUDED.verified_at
   WHERE apple_store_subscriptions.user_id=EXCLUDED.user_id AND apple_store_subscriptions.environment=EXCLUDED.environment AND apple_store_subscriptions.verified_at<=EXCLUDED.verified_at RETURNING user_id`,[state.originalId,userId,settings.environment,state.productId,state.transactionId,state.accessUntil,state.revoked,state.cancelAtPeriodEnd,checkedAt]);
  if(!r.rowCount){const old=(await c.query('SELECT user_id,environment FROM apple_store_subscriptions WHERE original_id=$1',[state.originalId])).rows[0];if(old?.user_id!==userId||old.environment!==settings.environment)failure(409,'This purchase belongs to another account or environment.');}
 }
}
async function transaction(pool,work){const c=await pool.connect();try{await c.query('BEGIN');const r=await work(c);await c.query('COMMIT');return r}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}}
export async function reconcileApplePurchase(pool,userId,id,{services=appleStoreServices(),checkedAt=new Date(),notification}={}){
 const states=await verifiedAppleState(id,userId,services);
 return transaction(pool,async c=>{
  // All refreshes for one account serialize; early requests cannot overwrite later observations.
  const user=(await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[userId])).rows[0];if(!user)failure(404,'Account not found.');
  if(notification){const inserted=await c.query('INSERT INTO apple_store_notifications(notification_id,type,payload_hash) VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING notification_id',[notification.id,notification.type,notification.hash]);if(!inserted.rowCount)return {duplicate:true};}
  await saveStates(c,userId,states,services.settings,checkedAt);return {verified:true};
 });
}
export async function handleAppleNotifications({route,req,res,pool,json,send,fail,services}){
 if(route!=='/api/billing/apple/notifications')return false;
 if(!appleStoreSettings().enabled)fail(404,'Apple notifications are disabled.');
 if(req.method!=='POST')fail(405,'Use POST.');
 const data=await json(req);if(typeof data.signedPayload!=='string'||data.signedPayload.length>200000)fail(400,'Invalid store notification.');
 services??=appleStoreServices();let notice,tx;
 try{notice=await services.verifier.verifyAndDecodeNotification(data.signedPayload);if(!uuid.test(notice.notificationUUID||''))throw Error('Invalid identifier');
  if(notice.notificationType==='TEST'){send(res,200,{received:true,test:true});return true;}
  tx=await services.verifier.verifyAndDecodeTransaction(notice.data?.signedTransactionInfo);
 }catch{fail(400,'Store notification signature is invalid.');}
 if(tx.bundleId!==services.settings.bundle||tx.environment!==services.settings.environment||!services.settings.products.has(tx.productId)||!uuid.test(tx.appAccountToken||''))fail(422,'Store notification does not match this app.');
 const notification={id:notice.notificationUUID,type:String(notice.notificationType),hash:createHash('sha256').update(data.signedPayload).digest('hex')};
 if((await pool.query('SELECT 1 FROM apple_store_notifications WHERE notification_id=$1',[notification.id])).rows.length){send(res,200,{received:true,duplicate:true});return true;}
 const user=(await pool.query('SELECT id FROM users WHERE id=$1',[tx.appAccountToken.toLowerCase()])).rows[0];
 if(!user){send(res,200,{received:true,ignored:true});return true;}
 // Refresh current status rather than applying potentially out-of-order notification claims.
 try{await reconcileApplePurchase(pool,user.id,tx.originalTransactionId,{services,notification});}catch(e){if(e.status)throw e;fail(503,'Store reconciliation is temporarily unavailable.');}
 send(res,200,{received:true});return true;
}
export async function handleAppleStore({route,req,res,pool,required,json,send,fail,limited,services}){
 if(route!=='/api/billing/apple')return false;
 const user=await required(req,'learner'),settings=appleStoreSettings();
 if(req.method==='GET'){send(res,200,{enabled:settings.enabled,environment:settings.enabled?settings.environment:null,appleAccountToken:user.id,purchasesEnabled:false});return true;}
 if(!settings.enabled)fail(404,'Apple store verification is disabled.');
 if(req.method!=='POST')fail(405,'Use GET or POST.');limited(req,'apple-store-restore',16);
 const data=await json(req);try{await reconcileApplePurchase(pool,user.id,data.transactionId,{services:services||appleStoreServices()});}catch(e){if(e.status)throw e;fail(503,'Store reconciliation is temporarily unavailable.');}
 const access=await appleStoreAccess(pool,user.id);send(res,200,{verified:true,active:!!access,accessUntil:access?.access_until||null});return true;
}
export async function reconcileAppleDue(pool,{services,limit=20}={}){
 if(!appleStoreSettings().enabled)return {checked:0,failed:0};services??=appleStoreServices();
 const rows=(await pool.query("SELECT user_id,original_id FROM apple_store_subscriptions WHERE environment=$1 AND verified_at<now()-interval '6 hours' ORDER BY verified_at LIMIT $2",[services.settings.environment,Math.min(20,limit)])).rows;
 let checked=0,failed=0;for(const row of rows){try{await reconcileApplePurchase(pool,row.user_id,row.original_id,{services});checked++}catch{failed++}}
 return {checked,failed};
}
