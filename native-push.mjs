import {PushNotifications} from '@capacitor/push-notifications';
import {queueAppDestination,appDestination} from './app-destinations.mjs';
let manager;
export function remotePushManager(){return manager;}
export async function initializeRemotePush({Native,api=fetch,storage=localStorage,plugin=PushNotifications}={}){
 let account,waiting,flight;let transition=Promise.resolve();const native=await Promise.resolve().then(()=>Native?.remoteCapabilities?.()||{push:false}).catch(()=>({push:false}));
 let deviceId=storage.getItem('continuumPushDevice:v1');if(!/^[a-f0-9-]{36}$/i.test(deviceId||'')){deviceId=crypto.randomUUID();storage.setItem('continuumPushDevice:v1',deviceId);}
 const preferences=id=>{try{const value=JSON.parse(storage.getItem('continuumPushCategories:v1:'+id)||'[]');return Array.isArray(value)?value.filter(x=>['classes','messages','learning'].includes(x)):[]}catch{return []}};
 const request=async(method,body)=>{const response=await api('/api/push/devices',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify({deviceId,...body})});if(!response.ok)throw Error('Notification registration failed');};
 const configuration=async()=>{const r=await api('/api/push/config');if(!r.ok)throw Error('Notification configuration unavailable');const settings=await r.json();return {...settings,enabled:!!(native.push&&settings.enabled&&native.bundle===settings.bundle&&native.environment===settings.environment)};};
 await plugin.addListener('registration',async token=>{const pending=waiting;if(!pending||account!==pending.account)return;try{await request('POST',{token:token.value,categories:pending.categories,locale:(document.documentElement.lang||'en').split('-')[0]});if(account!==pending.account)return;storage.setItem('continuumPushCategories:v1:'+account,JSON.stringify(pending.categories));clearTimeout(pending.timer);waiting=null;pending.resolve();}catch(e){clearTimeout(pending.timer);waiting=null;pending.reject(e)}});
 await plugin.addListener('registrationError',()=>{if(waiting){clearTimeout(waiting.timer);waiting.reject(Error('Notification registration failed'));waiting=null;}});
 await plugin.addListener('pushNotificationActionPerformed',event=>{const d=appDestination(event.notification?.data?.destination);if(d)queueAppDestination(d);});
 const enable=async(selected,{prompt=true}={})=>{
  await transition;if(flight)return flight;const owner=account;if(!owner||!selected?.length||selected.some(c=>!['classes','messages','learning'].includes(c)))throw Error('Invalid notification preferences');
  flight=(async()=>{const settings=await configuration();if(!settings.enabled)throw Error('Remote notifications are not configured');let permission=await plugin.checkPermissions();if(permission.receive!=='granted'&&prompt)permission=await plugin.requestPermissions();if(permission.receive!=='granted'||account!==owner)throw Error('Notification permission not granted');
   const registered=new Promise((resolve,reject)=>{waiting={account:owner,categories:[...new Set(selected)],resolve,reject,timer:setTimeout(()=>{waiting=null;reject(Error('Notification registration timed out'))},15000)};});
   try{await plugin.register();await registered;}catch(e){if(waiting){clearTimeout(waiting.timer);waiting.reject(e);waiting=null;}await registered.catch(()=>{});throw e;}
  })();try{await flight}finally{flight=null}
 };
 const cleanup=async()=>{if(waiting){clearTimeout(waiting.timer);waiting.reject(Error('Account changed'));waiting=null;}await plugin.unregister().catch(()=>{});await plugin.removeAllDeliveredNotifications().catch(()=>{});};
 manager={configuration,preferences:()=>preferences(account),enable,disable:async()=>{if(account)storage.removeItem('continuumPushCategories:v1:'+account);try{await request('DELETE',{})}finally{await cleanup()}},accountChanged:id=>{const previous=account;if(previous===id)return;account=id;const prior=flight;if(previous){transition=cleanup().then(()=>prior?.catch(()=>{})).catch(()=>{});}if(id)void transition.then(()=>{if(account!==id)return;const selected=preferences(id);if(selected.length)void enable(selected,{prompt:false}).catch(()=>{});});}};
 return manager;
}
