// Default-off APNs registration and outbox. Device tokens never leave encrypted storage.
import {createHash,createHmac,randomBytes,randomUUID,createCipheriv,createDecipheriv,createPrivateKey,sign} from 'node:crypto';
import http2 from 'node:http2';
import {messagesBlocked} from './class-safety.mjs';
import {appDestination} from './app-destinations.mjs';
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const categories=new Set(['classes','messages','learning']);
const fail=(status,message)=>{throw Object.assign(Error(message),{status})};
export function pushSettings(env=process.env){
 const environment=env.APNS_ENVIRONMENT||'Sandbox',isolated=env.RAILWAY_ENVIRONMENT_NAME?['staging','billing-staging'].includes(env.RAILWAY_ENVIRONMENT_NAME.toLowerCase()):env.NODE_ENV!=='production';
 const configured=/^[a-f0-9]{64}$/i.test(env.PUSH_TOKEN_KEY||'')&&/^[A-Za-z0-9.-]{3,180}$/.test(env.APNS_BUNDLE_ID||'')&&['Sandbox','Production'].includes(environment)&&(environment==='Production'||isolated);
 const signing=!!(env.APNS_KEY_ID&&/^[A-Z0-9]{10}$/.test(env.APNS_TEAM_ID||'')&&env.APNS_PRIVATE_KEY);
 return {configured,registrationEnabled:configured&&env.PUSH_REGISTRATION_ENABLED==='true',deliveryEnabled:configured&&signing&&env.PUSH_REGISTRATION_ENABLED==='true'&&env.PUSH_DELIVERY_ENABLED==='true',environment,bundle:env.APNS_BUNDLE_ID};
}
const key=env=>{if(!/^[a-f0-9]{64}$/i.test(env.PUSH_TOKEN_KEY||''))throw Error('Push encryption is not configured');return Buffer.from(env.PUSH_TOKEN_KEY,'hex')};
const hmac=(value,env)=>createHmac('sha256',key(env)).update(value).digest('hex');
export function encryptPushToken(token,id,env=process.env){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key(env),iv);cipher.setAAD(Buffer.from(id));const data=Buffer.concat([cipher.update(token,'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),data]).toString('base64')}
function decryptToken(value,id,env){const b=Buffer.from(value,'base64'),cipher=createDecipheriv('aes-256-gcm',key(env),b.subarray(0,12));cipher.setAAD(Buffer.from(id));cipher.setAuthTag(b.subarray(12,28));return Buffer.concat([cipher.update(b.subarray(28)),cipher.final()]).toString('utf8')}
export async function migratePush(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS push_devices(id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,session_hash text NOT NULL REFERENCES sessions(token_hash) ON DELETE CASCADE,device_ref text UNIQUE NOT NULL,token_hash text UNIQUE NOT NULL,token_cipher text NOT NULL,bundle text NOT NULL,environment text NOT NULL,categories text[] NOT NULL,locale text NOT NULL DEFAULT 'en',updated_at timestamptz NOT NULL DEFAULT now());
 CREATE INDEX IF NOT EXISTS push_device_owner ON push_devices(user_id);
 CREATE TABLE IF NOT EXISTS push_outbox(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),device_id uuid NOT NULL REFERENCES push_devices(id) ON DELETE CASCADE,user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,dedup_key text NOT NULL UNIQUE,category text NOT NULL,destination jsonb NOT NULL,status text NOT NULL DEFAULT 'pending',attempts integer NOT NULL DEFAULT 0,next_attempt_at timestamptz NOT NULL DEFAULT now(),lease_until timestamptz,expires_at timestamptz NOT NULL,source_booking uuid REFERENCES class_bookings(id) ON DELETE CASCADE,source_revision integer,created_at timestamptz NOT NULL DEFAULT now(),delivered_at timestamptz);
 CREATE INDEX IF NOT EXISTS push_due ON push_outbox(status,next_attempt_at);
 `)}
export async function handlePush({route,req,res,pool,required,json,send,limited,env=process.env}){
 if(!['/api/push/config','/api/push/devices'].includes(route))return false;
 const user=await required(req),settings=pushSettings(env);
 if(route==='/api/push/config'&&req.method==='GET'){send(res,200,{enabled:settings.registrationEnabled,deliveryEnabled:settings.deliveryEnabled,bundle:settings.registrationEnabled?settings.bundle:null,environment:settings.registrationEnabled?settings.environment:null,categories:[...categories]});return true;}
 if(route!=='/api/push/devices'||!['POST','DELETE'].includes(req.method))fail(405,'Use POST or DELETE.');
 const bearer=/^Bearer ([A-Za-z0-9_-]{43})$/.exec(req.headers.authorization||'');if(!bearer)fail(403,'Native bearer session required.');
 limited(req,'push-registration',60);const d=await json(req);if(!uuid.test(d.deviceId||''))fail(400,'Invalid notification device.');
 if(req.method==='DELETE'){if(/^[a-f0-9]{64}$/i.test(env.PUSH_TOKEN_KEY||''))await pool.query('DELETE FROM push_devices WHERE user_id=$1 AND device_ref=$2',[user.id,hmac('device:'+d.deviceId,env)]);send(res,200,{removed:true});return true;}
 if(!settings.registrationEnabled)fail(503,'Remote notifications are not configured.');
 const ref=hmac('device:'+d.deviceId,env),sessionHash=createHash('sha256').update(bearer[1]).digest('hex');
 if(typeof d.token!=='string'||! /^[a-f0-9]{64,512}$/i.test(d.token)||d.token.length%2||!Array.isArray(d.categories)||!d.categories.length||d.categories.length>3||d.categories.some(c=>!categories.has(c)))fail(400,'Invalid notification registration.');
 if(!['en','ja','es','pt','zh','fr','ko','id','ru','ar'].includes(d.locale||'en'))fail(400,'Invalid notification language.');
 // The session FK revokes delivery atomically on logout, reset and account erasure.
 let id=randomUUID();const token=d.token.toLowerCase(),tokenHash=hmac(settings.bundle+':'+settings.environment+':'+token,env);
 const client=await pool.connect();try{await client.query('BEGIN');await client.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);
  await client.query('DELETE FROM push_devices WHERE session_hash IN (SELECT token_hash FROM sessions WHERE expires_at<=now())');
  const old=(await client.query('SELECT id,user_id FROM push_devices WHERE device_ref=$1 FOR UPDATE',[ref])).rows[0];if(old?.user_id===user.id)id=old.id;
  const count=(await client.query('SELECT count(*)::int AS n FROM push_devices WHERE user_id=$1 AND device_ref<>$2 AND token_hash<>$3',[user.id,ref,tokenHash])).rows[0].n;if(count>=10)fail(429,'Too many notification devices.');
  await client.query('DELETE FROM push_devices WHERE (device_ref=$1 OR token_hash=$2) AND id<>$3',[ref,tokenHash,id]);
  await client.query('INSERT INTO push_devices(id,user_id,session_hash,device_ref,token_hash,token_cipher,bundle,environment,categories,locale) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(device_ref) DO UPDATE SET user_id=EXCLUDED.user_id,session_hash=EXCLUDED.session_hash,token_hash=EXCLUDED.token_hash,token_cipher=EXCLUDED.token_cipher,bundle=EXCLUDED.bundle,environment=EXCLUDED.environment,categories=EXCLUDED.categories,locale=EXCLUDED.locale,updated_at=now()',[id,user.id,sessionHash,ref,tokenHash,encryptPushToken(token,id,env),settings.bundle,settings.environment,[...new Set(d.categories)],d.locale||'en']);
  await client.query('COMMIT');}catch(e){await client.query('ROLLBACK');throw e}finally{client.release()}
 send(res,200,{registered:true});return true;
}
export async function queueUserPush(c,userId,{category,destination,dedupKey,expiresAt=new Date(Date.now()+86400000),bookingId=null,bookingRevision=null},{env=process.env}={}){
 const d=appDestination(destination);if(!pushSettings(env).deliveryEnabled)return 0;
 if(!categories.has(category)||!d||typeof dedupKey!=='string'||dedupKey.length>200||!Number.isFinite(+expiresAt)||+expiresAt<=Date.now()||+expiresAt>Date.now()+86400000+1000)throw Error('Invalid notification intent');
 const result=await c.query(`INSERT INTO push_outbox(device_id,user_id,dedup_key,category,destination,expires_at,source_booking,source_revision) SELECT d.id,d.user_id,$2||':'||d.id::text,$3,$4::jsonb,$5,$6,$7 FROM push_devices d JOIN sessions s ON s.token_hash=d.session_hash WHERE d.user_id=$1 AND s.expires_at>now() AND $3=ANY(d.categories) ON CONFLICT(dedup_key) DO NOTHING RETURNING id`,[userId,dedupKey,category,JSON.stringify(d),expiresAt,bookingId,bookingRevision]);return result.rows.length;
}
export async function queueThreadPush(c,threadId,actorId,kind,eventId,{env=process.env}={}){
 if(!pushSettings(env).deliveryEnabled)return;
 const row=(await c.query('SELECT teacher_id,learner_id,language FROM class_threads WHERE id=$1',[threadId])).rows[0];if(!row)return;
 const category=kind==='message'?'messages':kind.includes('assignment')?'learning':'classes';
 for(const id of [row.teacher_id,row.learner_id].filter(id=>id!==actorId))await queueUserPush(c,id,{category,destination:{section:'classes',threadId,language:row.language},dedupKey:'class:'+eventId},{env});
}
let jwtCache;
export function apnsProviderToken(env=process.env,now=Date.now()){
 const fingerprint=createHash('sha256').update([env.APNS_TEAM_ID,env.APNS_KEY_ID,env.APNS_PRIVATE_KEY].join('|')).digest('hex');if(jwtCache?.fingerprint===fingerprint&&now>=jwtCache.at&&now-jwtCache.at<50*60000)return jwtCache.value;
 const privateKey=createPrivateKey(env.APNS_PRIVATE_KEY);if(privateKey.asymmetricKeyType!=='ec'||privateKey.asymmetricKeyDetails?.namedCurve!=='prime256v1')throw Error('APNs requires a P-256 signing key');
 const enc=x=>Buffer.from(JSON.stringify(x)).toString('base64url'),header=enc({alg:'ES256',kid:env.APNS_KEY_ID}),body=enc({iss:env.APNS_TEAM_ID,iat:Math.floor(now/1000)}),part=header+'.'+body;
 const value=part+'.'+sign('sha256',Buffer.from(part),{key:privateKey,dsaEncoding:'ieee-p1363'}).toString('base64url');jwtCache={fingerprint,at:now,value};return value;
}
const bodies={classes:{en:'Your class schedule has an update.',ja:'クラスの予定に更新があります。',es:'Hay una actualización en tus clases.',pt:'Há uma atualização nas suas aulas.',zh:'您的课程安排有更新。',fr:'Votre planning de cours a été mis à jour.',ko:'수업 일정이 업데이트되었습니다.',id:'Ada pembaruan jadwal kelas Anda.',ru:'Расписание занятий обновлено.',ar:'هناك تحديث في جدول دروسك.'},messages:{en:'You have a new class message.',ja:'クラスの新しいメッセージがあります。',es:'Tienes un nuevo mensaje de clase.',pt:'Você tem uma nova mensagem da aula.',zh:'您有一条新的课程消息。',fr:'Vous avez un nouveau message de cours.',ko:'새 수업 메시지가 있습니다.',id:'Ada pesan kelas baru.',ru:'У вас новое сообщение о занятии.',ar:'لديك رسالة جديدة تتعلق بالدرس.'},learning:{en:'Your class practice has an update.',ja:'クラスの練習課題に更新があります。',es:'Hay una actualización en tus ejercicios de clase.',pt:'Há uma atualização nos exercícios da sua aula.',zh:'您的课程练习有更新。',fr:'Vos exercices de cours ont une mise à jour.',ko:'수업 연습 과제가 업데이트되었습니다.',id:'Ada pembaruan latihan kelas Anda.',ru:'Обновлены задания к вашему занятию.',ar:'هناك تحديث في تدريبات درسك.'}};
export function pushPayload(row){const destination=appDestination(row.destination);if(!destination||!bodies[row.category])throw Error('Invalid queued notification');return {aps:{alert:{title:'Continuum',body:bodies[row.category][row.locale]||bodies[row.category].en},sound:'default'},destination};}
let connection,connectionOrigin;
export async function sendAPNs(token,payload,{id,expiresAt,env=process.env}={}){
 const settings=pushSettings(env);if(!settings.deliveryEnabled)throw Error('APNs delivery is not enabled');
 const origin=settings.environment==='Production'?'https://api.push.apple.com':'https://api.sandbox.push.apple.com';
 if(!connection||connection.closed||connection.destroyed||connectionOrigin!==origin){connection?.destroy();connection=http2.connect(origin,{minVersion:'TLSv1.2',rejectUnauthorized:true});connectionOrigin=origin;connection.on('error',()=>{});connection.unref();}
 const data=JSON.stringify(payload);if(Buffer.byteLength(data)>4096)throw Error('APNs payload exceeds limit');
 return new Promise((resolve,reject)=>{let result='',status;const request=connection.request({':method':'POST',':path':'/3/device/'+token,authorization:'bearer '+apnsProviderToken(env),'apns-topic':settings.bundle,'apns-push-type':'alert','apns-priority':'10','apns-expiration':String(Math.floor(+expiresAt/1000)),'apns-id':id,'apns-collapse-id':id});
  request.setEncoding('utf8');request.setTimeout(10000,()=>{request.close();reject(Error('APNs request timed out'))});request.on('response',h=>status=Number(h[':status']));request.on('data',b=>{result+=b;if(result.length>8192){request.close();reject(Error('Invalid APNs response'))}});request.on('error',reject);request.on('end',()=>{let reason;try{reason=JSON.parse(result).reason}catch{}resolve({status,reason})});request.end(data);
 });
}
export async function drainPushOutbox(pool,{env=process.env,deliver=sendAPNs,now=new Date(),limit=10}={}){
 await pool.query('DELETE FROM push_devices WHERE session_hash IN (SELECT token_hash FROM sessions WHERE expires_at<=$1)',[now]);
 await pool.query("DELETE FROM push_outbox WHERE status<>'pending' AND created_at<$1::timestamptz-interval '7 days'",[now]);
 await pool.query("UPDATE push_outbox SET status='expired',destination='{}',lease_until=NULL WHERE status='pending' AND expires_at<=$1",[now]);
 if(!pushSettings(env).deliveryEnabled)return {delivered:0,failed:0};
 const due=(await pool.query("UPDATE push_outbox SET lease_until=$1::timestamptz+interval '5 minutes' WHERE id IN (SELECT id FROM push_outbox WHERE status='pending' AND expires_at>$1 AND next_attempt_at<=$1 AND (lease_until IS NULL OR lease_until<$1) ORDER BY created_at LIMIT $2 FOR UPDATE SKIP LOCKED) RETURNING *",[now,Math.min(10,Math.max(1,limit))])).rows;
 let delivered=0,failed=0;
 for(const job of due){try{const device=(await pool.query('SELECT d.* FROM push_devices d JOIN sessions s ON s.token_hash=d.session_hash WHERE d.id=$1 AND d.user_id=$2 AND s.expires_at>$3',[job.device_id,job.user_id,now])).rows[0];if(!device)continue;
   if(!device.categories.includes(job.category)){await pool.query("UPDATE push_outbox SET status='cancelled',destination='{}',lease_until=NULL WHERE id=$1",[job.id]);continue;}
   if(job.destination?.threadId){const thread=(await pool.query('SELECT teacher_id,learner_id FROM class_threads WHERE id=$1',[job.destination.threadId])).rows[0];if(!thread||![thread.teacher_id,thread.learner_id].includes(job.user_id)||job.category==='messages'&&await messagesBlocked(pool,thread.teacher_id,thread.learner_id)){await pool.query("UPDATE push_outbox SET status='cancelled',destination='{}',lease_until=NULL WHERE id=$1",[job.id]);continue;}}
   if(device.bundle!==pushSettings(env).bundle||device.environment!==pushSettings(env).environment)throw Error('Push configuration changed');
   if(job.source_booking){const b=(await pool.query('SELECT status,revision FROM class_bookings WHERE id=$1',[job.source_booking])).rows[0];if(!b||b.status!=='confirmed'||b.revision!==job.source_revision){await pool.query("UPDATE push_outbox SET status='cancelled',destination='{}',lease_until=NULL WHERE id=$1",[job.id]);continue;}}
   const result=await deliver(decryptToken(device.token_cipher,device.id,env),pushPayload({...job,locale:device.locale}),{id:job.id,expiresAt:job.expires_at,env});
   if(result.status===200){await pool.query("UPDATE push_outbox SET status='delivered',destination='{}',delivered_at=$2,lease_until=NULL,attempts=attempts+1 WHERE id=$1",[job.id,now]);delivered++;}
   else if(result.status===410||result.status===400&&['BadDeviceToken','DeviceTokenNotForTopic','Unregistered'].includes(result.reason))await pool.query('DELETE FROM push_devices WHERE id=$1',[device.id]);
   else{if(result.reason==='ExpiredProviderToken')jwtCache=undefined;throw Error('APNs delivery unavailable');}
  }catch{failed++;const attempts=job.attempts+1;await pool.query('UPDATE push_outbox SET attempts=$2,lease_until=NULL,next_attempt_at=$3 WHERE id=$1',[job.id,attempts,new Date(+now+Math.min(3600000,30000*2**Math.min(attempts,7)))]);}}
 return {delivered,failed};
}
export async function queueClassReminders(pool,{env=process.env,now=new Date()}={}){
 if(!pushSettings(env).deliveryEnabled)return 0;
 const rows=(await pool.query("SELECT id,teacher_id,learner_id,language,revision,starts_at FROM class_bookings WHERE status='confirmed' AND starts_at>$1 AND starts_at<=$2 ORDER BY starts_at LIMIT 100",[now,new Date(+now+30*60000)])).rows;let queued=0;
 for(const b of rows)for(const user of [b.teacher_id,b.learner_id])queued+=await queueUserPush(pool,user,{category:'classes',destination:{section:'classes',bookingId:b.id,language:b.language},dedupKey:'reminder:'+b.id+':'+b.revision,bookingId:b.id,bookingRevision:b.revision,expiresAt:new Date(b.starts_at)},{env});return queued;
}
