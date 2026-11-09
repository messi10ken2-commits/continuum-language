import {dynamicTranslationSources} from './translation-test-fixtures.mjs';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {request} from 'node:http';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
process.env.NODE_ENV='development';
const {testServer,db}=await import('./test-server.mjs');
const base='http://127.0.0.1:'+testServer.address().port;
try{
 const malformedURL=await new Promise((resolve,reject)=>{
  const req=request({hostname:'127.0.0.1',port:testServer.address().port,path:'http://[invalid]/'},res=>{
   res.resume();
   res.on('end',()=>resolve(res.statusCode));
  });
  req.on('error',reject);
  req.end();
 });
 assert.equal(malformedURL,400);
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
 const headers={cookie,'Content-Type':'application/json'};
 const importHistory=body=>fetch(base+'/api/practice/import',{method:'POST',headers,body:JSON.stringify(body)});
 assert.equal((await importHistory({attempts:[null]})).status,400);
 const attempts=Array.from({length:2000},(_,i)=>({score:i%101,total:5,at:new Date(1700000000000+i*1000).toISOString()}));
 const imported=await importHistory({attempts});
 assert.equal(imported.status,200);
 assert.deepEqual(await imported.json(),{imported:2000});
 const history=await (await fetch(base+'/api/practice',{headers})).json();
 assert.equal(history.attempts.length,50);
 assert.equal(history.attempts[0].lesson,'subjunctive');
 assert.equal(history.attempts[0].score,1999%101);
 assert.equal(new Date(history.attempts[0].at).toISOString(),attempts.at(-1).at);
 assert.equal((await importHistory({attempts})).status,409);
 const tooLarge='{"attempts":"'+ 'あ'.repeat(100_001)+'"}';
 const oversized=await fetch(base+'/api/practice/import',{method:'POST',headers,body:tooLarge});
 assert.equal(oversized.status,413);
 const stream=new ReadableStream({start(controller){
  controller.enqueue(Buffer.from(tooLarge.slice(0,60_000)));
  controller.enqueue(Buffer.from(tooLarge.slice(60_000)));
  controller.close();
 }});
 assert.equal((await fetch(base+'/api/practice/import',{method:'POST',headers,body:stream,duplex:'half'})).status,413);
 const health=await fetch(base+'/api/health');
 assert.equal(health.headers.get('x-content-type-options'),'nosniff');
 assert.equal(health.headers.get('x-frame-options'),'DENY');
 assert.equal(health.headers.get('referrer-policy'),'strict-origin-when-cross-origin');
 assert.deepEqual(await health.json(),{ok:true});
 const index=await (await fetch(base)).text();
 const asset=index.match(/src="(\/assets\/[^"]+\.js)"/)[1];
 const compressed=await fetch(base+asset,{method:'HEAD',headers:{'Accept-Encoding':'gzip'}});
 const identity=await fetch(base+asset,{method:'HEAD',headers:{'Accept-Encoding':'gzip;q=0, *;q=1'}});
 assert.equal(compressed.headers.get('content-encoding'),'gzip');
 assert.equal(compressed.headers.get('vary'),'Accept-Encoding');
 assert.equal(identity.headers.get('content-encoding'),null);
 assert.ok(Number(compressed.headers.get('content-length'))<Number(identity.headers.get('content-length')));
 assert.deepEqual(await (await fetch(base+asset)).arrayBuffer(),await (await fetch(base+asset,{headers:{'Accept-Encoding':'identity'}})).arrayBuffer());
 const ad='/membership/premium-promotion-v2.mp4';
 const expected=await readFile(new URL('./dist'+ad,import.meta.url));
 const probe=await fetch(base+ad,{headers:{Range:'bytes=0-1'}});
 assert.equal(probe.status,206);
 assert.equal(probe.headers.get('content-range'),`bytes 0-1/${expected.length}`);
 assert.equal(probe.headers.get('content-type'),'video/mp4');
 assert.deepEqual(Buffer.from(await probe.arrayBuffer()),expected.subarray(0,2));
 const head=await fetch(base+ad,{method:'HEAD'});
 assert.equal(Number(head.headers.get('content-length')),expected.length);
 assert.equal((await head.arrayBuffer()).byteLength,0);
 const suffix=await fetch(base+ad,{headers:{Range:'bytes=-5'}});
 assert.deepEqual(Buffer.from(await suffix.arrayBuffer()),expected.subarray(-5));
 assert.equal((await fetch(base+ad,{headers:{Range:'bytes=-0'}})).status,416);
 const unavailable=await fetch(base+'/api/localization',{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({locale:'ja',items:[{text:dynamicTranslationSources[0]}]})});
 assert.equal(unavailable.status,503);assert.match((await unavailable.json()).error,/Original text is still available/);
 console.log('PASS: malformed JSON and origins are rejected, valid origin works, authentication limits remain enforced, and bulk import, byte limits, headers and MP4 ranges are verified.');
}finally{await new Promise(resolve=>testServer.close(resolve));await db.close();}
