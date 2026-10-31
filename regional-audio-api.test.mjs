import {bundledRecording} from './bundled-audio.mjs';
import {expandedRegionalCourses} from './expanded-regional-courses.mjs';
import {regionalAudioPairs} from './regional-audio-pairs.mjs';
import assert from 'node:assert/strict';
import {varietyCourses} from './premium-varieties.mjs';
import {speechKey,pcmWav} from './speech-service.mjs';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('./test-server.mjs');
const base='http://127.0.0.1:'+testServer.address().port;
async function register(name){const r=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email:name+'@example.test',password:'synthetic-regional-password',role:'learner',adult:true})});assert.equal(r.status,200);return {cookie:r.headers.get('set-cookie').split(';')[0],...(await r.json()).user};}
try{
 const paid=await register('RegionalPaid'),free=await register('RegionalFree');
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[paid.id]);
 for(const course of [...varietyCourses,...expandedRegionalCourses]){
  const response=await fetch(base+'/api/billing/courses/'+course.id,{headers:{cookie:paid.cookie}});assert.equal(response.status,200);const {course:visible}=await response.json();assert.ok(visible.breakdown.tables.length);assert.ok(visible.questions.every(q=>!('answer'in q)&&!('note'in q)));
  if(course.language==='ja'){for(const index of [0,4])assert.equal((await fetch(base+'/api/billing/courses/'+course.id+'/audio?question='+index,{headers:{cookie:paid.cookie}})).status,404);}
  for(const [index,q] of course.questions.entries())if(q.audio){
   const pcm=Buffer.alloc(4800,index+course.language.charCodeAt(0)),audio=pcmWav(Buffer.from(Array.from({length:4800},(_,i)=>[0,12,0,244][i%4])));
   await db.query('INSERT INTO speech_cache(cache_key,audio,provider,model) VALUES($1,$2,$3,$4)',[speechKey(q.audio,q.audioLocale),audio,'synthetic-test','locale-sentinel']);
   const endpoint=base+'/api/billing/courses/'+course.id+'/audio?question='+index+'&locale=en-US';
   assert.equal((await fetch(endpoint)).status,401);assert.equal((await fetch(endpoint,{headers:{cookie:free.cookie}})).status,403);
   const r=await fetch(endpoint,{headers:{cookie:paid.cookie}});assert.equal(r.status,200);assert.equal(r.headers.get('x-audio-locale'),q.audioLocale);assert.equal(r.headers.get('x-audio-source'),'AI-generated studio voice');assert.equal(r.headers.get('cache-control'),'private, no-store');assert.deepEqual(Buffer.from(await r.arrayBuffer()),bundledRecording(q.audio,q.audioLocale)?.audio||audio);
  }
 }
 for(const course of [...varietyCourses,...expandedRegionalCourses])for(const [i,pair] of regionalAudioPairs[course.language].entries())for(const [j,v] of pair.variants.entries()){
 const endpoint=base+'/api/billing/courses/'+course.id+'/audio?comparison='+i+'&variant='+j;
 if(!v.locale){assert.equal((await fetch(endpoint,{headers:{cookie:paid.cookie}})).status,404);continue;}
 const bytes=pcmWav(Buffer.from(Array.from({length:4800},(_,i)=>[0,12,0,244][i%4])));await db.query('INSERT INTO speech_cache(cache_key,audio,provider,model) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[speechKey(v.text,v.locale),bytes,'synthetic-test','pair-locale-sentinel']);
 assert.equal((await fetch(endpoint,{headers:{cookie:free.cookie}})).status,403);const r=await fetch(endpoint+'&locale=ja-JP-kansai',{headers:{cookie:paid.cookie}});assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'private, no-store');if(r.headers.get('x-audio-locale'))assert.equal(r.headers.get('x-audio-locale'),v.locale);
 }
 assert.equal((await fetch(base+'/api/billing/courses/en-premium-varieties-v1/audio?comparison=0&variant=9',{headers:{cookie:paid.cookie}})).status,404);
 console.log('PASS: Regional listening clips use authored locales and isolated cache keys, retain Premium authorization and truthful synthesis labels, and ignore client locale overrides. Removed Kansai clips return 404 instead of stale synthesis. No provider calls.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
