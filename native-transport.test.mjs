import test from 'node:test';import assert from 'node:assert/strict';import {createNativeFetch} from './native-transport.mjs';
const origin='https://api.example.test',token='n'.repeat(43);
test('native fetch scopes credentials, saves login tokens only to vault, rewrites media and preserves form data',async()=>{
 let saved,call;const vault={readSession:async()=>({token:saved}),saveSession:async d=>saved=d.token,clearSession:async()=>saved=undefined};
 const fetch=createNativeFetch({origin,vault,allowsAI:()=>true,assetRoots:['companions-3d'],fetchImpl:async(req,options)=>{call={req,options};return Response.json(typeof req!=='string'&&req.url.endsWith('/auth/login')?{user:{id:'same-web-user'},sessionToken:token}:{image:'/companions-3d/capybara.glb'});}});
 const login=await(await fetch('capacitor://localhost/api/auth/login',{method:'POST',body:'{}'})).json();
 assert.equal(saved,token);assert.equal(login.user.id,'same-web-user');assert.equal(login.sessionToken,undefined);
 const form=new FormData();form.append('audio',new Blob(['voice'],{type:'audio/mp4'}),'voice.m4a');
 assert.equal((await(await fetch('capacitor://localhost/api/speaking',{method:'POST',body:form})).json()).image,origin+'/companions-3d/capybara.glb');
 assert.equal(call.options.headers.get('Authorization'),'Bearer '+token);assert.equal(call.options.credentials,'omit');assert.match(call.req.headers.get('content-type'),/multipart/);
 await fetch('https://third-party.example.test/asset');assert.equal(call.req,'https://third-party.example.test/asset');assert.equal(call.options,undefined);
});
test('native AI submission is opt-in before any provider-bound request leaves the device',async()=>{
 let calls=0;const fetch=createNativeFetch({origin,vault:{readSession:async()=>({})},fetchImpl:async()=>{calls++;return Response.json({});}});
 const r=await fetch('capacitor://localhost/api/speaking',{method:'POST',body:'{}'});assert.equal(r.status,403);assert.equal(calls,0);
});
test('session expiration clears Keychain; writes are never retried automatically',async()=>{
 let requests=0,cleared=0,expired=0;const fetch=createNativeFetch({origin,vault:{readSession:async()=>({token}),clearSession:async()=>cleared++},onExpired:()=>expired++,fetchImpl:async()=>{requests++;return Response.json({error:'expired'},{status:401});}});
 await fetch('capacitor://localhost/api/practice',{method:'POST',body:'{}'});assert.equal(requests,1);assert.equal(cleared,1);assert.equal(expired,1);
});
