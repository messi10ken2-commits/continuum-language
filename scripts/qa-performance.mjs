// Reproducible loopback measurements; disposable test DB, no paid providers.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import {translationSource,protectSource} from '../localization-corpus.mjs';
import {translationRevision,reviewedTranslation} from '../reviewed-interface-copy.mjs';
import {interfaceCopy} from '../interface-copy.mjs';
import sources from '../interface-sources.json' with {type:'json'};
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
process.env.NODE_ENV='development';
const {testServer,db}=await import('../test-server.mjs');
const origin='http://127.0.0.1:'+testServer.address().port;
const stats=values=>{const sorted=[...values].sort((a,b)=>a-b);return {n:values.length,min:sorted[0],median:sorted[Math.floor(sorted.length/2)],p95:sorted[Math.ceil(sorted.length*.95)-1],max:sorted.at(-1)};};
try{
 const r=await fetch(origin+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Performance QA',email:'performance-qa@example.test',password:'synthetic-performance-password',role:'learner',adult:true})});assert.equal(r.status,200);
 const cookie=r.headers.get('set-cookie').split(';')[0];await r.arrayBuffer();
 const approved=sources.map(text=>translationSource(text)).filter(s=>s&&!protectSource(s).values.length&&!reviewedTranslation(s.text,'ja')&&!interfaceCopy[s.text]?.ja).slice(0,16);assert.equal(approved.length,16);
 for(const s of approved){const key=crypto.createHash('sha256').update(JSON.stringify([translationRevision,'ja',s])).digest('hex');await db.query('INSERT INTO interface_translations(cache_key,translated) VALUES($1,$2) ON CONFLICT DO NOTHING',[key,'確認用の保存済み翻訳']);}
 const results={environment:{node:process.version,database:'PGlite 0.5.8, synthetic records',network:'loopback',providers:'disabled'},measurements:{}};
 const cases={health:{path:'/api/health',options:{}},cachedTranslation16:{path:'/api/localization',options:{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({locale:'ja',items:approved.map(s=>({text:s.text}))})}},humanAudio:{path:'/api/speech',options:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'pão',locale:'pt-BR'})}}};
 for(const [name,{path,options}] of Object.entries(cases)){
  const values=[];for(let i=0;i<31;i++){const start=performance.now();const response=await fetch(origin+path,options);assert.equal(response.status,200,name);const bytes=await response.arrayBuffer();assert.ok(bytes.byteLength);if(i)values.push(performance.now()-start);}
  results.measurements[name]=stats(values);
 }
 await writeFile('/tmp/continuum-qa-performance-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await new Promise(resolve=>testServer.close(resolve));await db.close();}
