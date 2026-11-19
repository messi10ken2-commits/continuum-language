import test from 'node:test';import assert from 'node:assert/strict';
import {initializeRemotePush} from './native-push.mjs';import {consumeAppDestination,clearAppDestination} from './app-destinations.mjs';
const fixture=async(enabled=true)=>{
 const data=new Map(),handlers=new Map(),calls=[],requests=[];let token='ab'.repeat(32);let permission='prompt';
 const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const plugin={addListener:async(k,fn)=>handlers.set(k,fn),checkPermissions:async()=>({receive:permission}),requestPermissions:async()=>{calls.push('prompt');permission='granted';return {receive:permission}},register:async()=>{calls.push('register');queueMicrotask(()=>handlers.get('registration')({value:token}))},unregister:async()=>{calls.push('unregister')},removeAllDeliveredNotifications:async()=>{calls.push('clear')}};
 const api=async(path,options={})=>{requests.push({path,...options});return Response.json(path.endsWith('/config')?{enabled,bundle:'fixture.app',environment:'Sandbox'}:{ok:true})};
 const manager=await initializeRemotePush({Native:{remoteCapabilities:async()=>({push:enabled,bundle:'fixture.app',environment:'Sandbox'})},storage,plugin,api});
 return {manager,data,calls,requests,handlers,rotate:value=>token=value};
};
test('remote push requires explicit opt-in, persists no raw token and rebinds only prior preferences without prompting',async()=>{
 const prior=globalThis.document;globalThis.document={documentElement:{lang:'ja'}};try{
 const f=await fixture();f.manager.accountChanged('alice');await new Promise(r=>setImmediate(r));assert.deepEqual(f.calls,[]);
 await f.manager.enable(['classes','messages']);assert.deepEqual(f.calls,['prompt','register']);assert.equal(f.requests.at(-1).body.includes('ab'.repeat(32)),true);assert.ok(!JSON.stringify([...f.data]).includes('ab'.repeat(32)));assert.deepEqual(f.manager.preferences(),['classes','messages']);
 f.rotate('cd'.repeat(32));await f.manager.enable(['learning']);assert.ok(f.requests.at(-1).body.includes('cd'.repeat(32)));
 f.manager.accountChanged(undefined);await new Promise(r=>setImmediate(r));assert.ok(f.calls.includes('unregister'));assert.ok(f.calls.includes('clear'));
 f.manager.accountChanged('bob');await new Promise(r=>setImmediate(r));assert.deepEqual(f.manager.preferences(),[]);assert.equal(f.calls.filter(x=>x==='prompt').length,1);
 f.manager.accountChanged('alice');await new Promise(r=>setImmediate(r));await new Promise(r=>setImmediate(r));assert.equal(f.calls.filter(x=>x==='register').length,3);assert.equal(f.calls.filter(x=>x==='prompt').length,1);
 await f.manager.disable();assert.deepEqual(f.manager.preferences(),[]);assert.equal(f.requests.at(-1).method,'DELETE');
 clearAppDestination();await f.handlers.get('pushNotificationActionPerformed')({notification:{data:{destination:{section:'classes'}}}});assert.deepEqual(consumeAppDestination(),{section:'classes'});await f.handlers.get('pushNotificationActionPerformed')({notification:{data:{destination:{section:'admin'}}}});assert.equal(consumeAppDestination(),null);
 }finally{globalThis.document=prior;clearAppDestination()}
});
test('unconfigured builds never prompt or register, including missing native capability bridge',async()=>{const f=await fixture(false);f.manager.accountChanged('alice');await assert.rejects(f.manager.enable(['classes']),/not configured/);assert.deepEqual(f.calls,[]);});
