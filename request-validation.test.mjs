import {dynamicTranslationSources} from './translation-test-fixtures.mjs';
import assert from 'node:assert/strict';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
process.env.NODE_ENV='development';
const {testServer,db}=await import('./test-server.mjs');
const base='http://127.0.0.1:'+testServer.address().port;
try{
 for(const body of ['null','[]','true','42','"text"','{broken']){
  const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body});
  assert.equal(r.status,400,body);assert.match((await r.json()).error,/JSON/);
 }
 for(const origin of ['not-an-origin','null','https://other.example.test']){
  const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'});
  assert.equal(r.status,403,origin);assert.equal((await r.json()).error,'Invalid request origin');
 }
 const allowed=await fetch(base+'/api/auth/login',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:'{}'});
 assert.equal(allowed.status,401);
 // Reset this synthetic database budget before the boundary check.
 await db.query('DELETE FROM auth_rate_limits');
 for(let i=0;i<13;i++){
  const r=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json','X-Forwarded-For':'192.0.2.'+(i+1),'X-Real-IP':'192.0.2.'+(i+1)},body:'{}'});
  assert.equal(r.status,i<12?401:429);
  if(i===12)assert.ok(Number(r.headers.get('retry-after'))>0);
 }
 const registration=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Validation QA',email:'validation-qa@example.test',password:'synthetic-validation-password',role:'learner',adult:true})});assert.equal(registration.status,200);
 const cookie=registration.headers.get('set-cookie').split(';')[0];
 const unavailable=await fetch(base+'/api/localization',{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({locale:'ja',items:[{text:dynamicTranslationSources[0]}]})});
 assert.equal(unavailable.status,503);assert.match((await unavailable.json()).error,/Original text is still available/);
 console.log('PASS: malformed JSON and origins are rejected, valid origin works and authentication rate limits remain enforced.');
}finally{await new Promise(resolve=>testServer.close(resolve));await db.close();}
