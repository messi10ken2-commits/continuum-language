import test from 'node:test';import assert from 'node:assert/strict';import {handleAccountRecovery} from './account-recovery.mjs';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
test('recovery never exposes account existence or tokens; reset is single-use and revokes old sessions',async()=>{
 const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
 const saved={url:process.env.AUTH_MAILER_WEBHOOK_URL,key:process.env.AUTH_MAILER_WEBHOOK_TOKEN};
 try{
  const email='recover@example.test',password='original-native-password';
  const register=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Recovery learner',email,password,role:'learner',adult:true})});const cookie=register.headers.get('set-cookie').split(';')[0];assert.equal(register.status,200);
  let delivered,body;process.env.AUTH_MAILER_WEBHOOK_URL='https://mailer.example.test';process.env.AUTH_MAILER_WEBHOOK_TOKEN='test-only';
  const pool={query:(...args)=>db.query(...args),connect:async()=>({query:(...args)=>db.query(...args),release(){}})};
  const args={route:'/api/auth/recovery',req:{method:'POST'},res:{},pool,json:async()=>({email}),send:(_r,s,d)=>{assert.equal(s,200);body=d},fail:(s,m)=>{throw Object.assign(Error(m),{status:s})},authLimited:async()=>{},clientAddress:()=> 'test',deliver:async(address,token)=>{assert.equal(address,email);delivered=token;}};
  await handleAccountRecovery(args);assert.deepEqual(body,{accepted:true});assert.ok(!JSON.stringify(body).includes(delivered));
  const stored=(await db.query('SELECT token_hash FROM account_recovery_tokens')).rows[0].token_hash;assert.notEqual(stored,delivered);
  await handleAccountRecovery({...args,json:async()=>({email:'missing@example.test'})});assert.deepEqual(body,{accepted:true});
  const reset=()=>fetch(base+'/api/auth/reset',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:delivered,password:'new-native-password-123'})});
  assert.equal((await reset()).status,200);assert.equal((await reset()).status,400);
  assert.equal((await(await fetch(base+'/api/auth/me',{headers:{cookie}})).json()).user,null);
  const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password:'new-native-password-123'})});assert.equal(login.status,200);
 }finally{
  if(saved.url===undefined)delete process.env.AUTH_MAILER_WEBHOOK_URL;else process.env.AUTH_MAILER_WEBHOOK_URL=saved.url;
  if(saved.key===undefined)delete process.env.AUTH_MAILER_WEBHOOK_TOKEN;else process.env.AUTH_MAILER_WEBHOOK_TOKEN=saved.key;
  await new Promise(r=>testServer.close(r));await db.close();
 }
});
