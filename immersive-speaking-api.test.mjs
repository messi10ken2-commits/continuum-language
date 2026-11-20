import assert from 'node:assert/strict';
import {test} from 'node:test';
import {scenarioById} from './speaking-content.mjs';
const originalFetch=globalThis.fetch,previousKey=process.env.GEMINI_API_KEY;process.env.GEMINI_API_KEY='synthetic-immersion-no-provider-call';
let externalCalls=0;
globalThis.fetch=(input,options)=>{if(!String(input).startsWith('http://127.0.0.1:')){externalCalls++;throw Error('No external provider call is allowed in this test')}return originalFetch(input,options)};
const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
async function account(name){const r=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email:name+'@immersive-speaking.test',password:'SyntheticImmersionSpeaking2026!',role:'learner',adult:true})});assert.ok(r.ok);return r.headers.get('set-cookie').split(';')[0]}
async function call(cookie,path,method='GET',body){const r=await fetch(base+'/api'+path,{method,headers:{cookie,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()}}
test('chapter conversations validate canonical language/level, preserve free limits, isolate accounts and retry idempotently',async()=>{try{
 const a=await account('chapter-speaker-a'),b=await account('chapter-speaker-b'),startKey=crypto.randomUUID(),input={language:'ja',level:'B1',scenario:'ja-immersive-market-v1',displayLanguage:'en',aiConsent:true,prefetchAudio:false,startKey};
 assert.equal((await call(a,'/speaking','POST',{...input,language:'en'})).status,400);
 assert.equal((await call(a,'/speaking','POST',{...input,level:'C1'})).status,400);
 const first=await call(a,'/speaking','POST',input);assert.equal(first.status,201);assert.equal(first.data.session.messages[0].text,scenarioById(input.scenario).opening.ja);
 const retry=await call(a,'/speaking','POST',input);assert.equal(retry.status,201);assert.equal(retry.data.session.id,first.data.session.id);
 assert.equal((await call(b,'/speaking/'+first.data.session.id)).status,404);
 await db.query('UPDATE speaking_sessions SET messages=$2::jsonb WHERE id=$1',[first.data.session.id,JSON.stringify([...first.data.session.messages,{role:'user',text:'静かな活動を提案します。',mode:'text'}])]);
 const different={...input,scenario:'ja-immersive-library-v1',startKey:crypto.randomUUID()};
 const denied=await call(a,'/speaking','POST',different);assert.equal(denied.status,429);assert.ok(!denied.data.session,'must not silently return a conversation from another chapter');
 const own=await call(b,'/speaking','POST',different);assert.equal(own.status,201);assert.equal(own.data.session.scenario,different.scenario);assert.notEqual(own.data.session.id,first.data.session.id);
 assert.equal((await call(a,'/speaking','POST',{...different,startKey})).status,409,'a saved start key is bound to its original chapter');
 assert.equal((await db.query('SELECT count(*)::int AS n FROM speaking_sessions')).rows[0].n,2);
 assert.equal(externalCalls,0,'opening and rejected/retried starts must not call a provider');
}finally{testServer.close();await db.close();globalThis.fetch=originalFetch;if(previousKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=previousKey}});
