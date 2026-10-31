import assert from 'node:assert/strict';
import {premiumCourses} from './premium-courses.mjs';
import {premiumReferenceAudioEndpoint} from './premium-session.mjs';
import {bundledRecording} from './bundled-audio.mjs';
import {languageInfo} from './languages.mjs';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
const post=async(path,data)=>{const r=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});assert.equal(r.status,200);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
try{
 const paid=await post('/api/auth/register',{name:'Reference QA',email:'reference-qa@example.test',password:'synthetic-reference-password',role:'learner',adult:true});
 const free=await post('/api/auth/register',{name:'Free reference QA',email:'free-reference-qa@example.test',password:'synthetic-reference-password',role:'learner',adult:true});
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[paid.data.user.id]);
 let count=0;
 for(const c of premiumCourses.filter(c=>['zh','ko','fr','de','ar','it'].includes(c.language)))for(const [text] of c.breakdown?.examples||[]){
  const endpoint=premiumReferenceAudioEndpoint(c,text);if(!endpoint)continue;
  assert.equal((await fetch(base+endpoint)).status,401);
  assert.equal((await fetch(base+endpoint,{headers:{cookie:free.cookie}})).status,403);
  const r=await fetch(base+endpoint,{headers:{cookie:paid.cookie}});assert.equal(r.status,200,c.id+': '+text);assert.equal(r.headers.get('Cache-Control'),'private, no-store');assert.equal(r.headers.get('X-Audio-Delivery'),'bundled');assert.deepEqual(Buffer.from(await r.arrayBuffer()),bundledRecording(text,languageInfo(c.language).locale).audio);count++;
 }
 const portuguese=await fetch(base+'/api/speech',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:'às vezes',locale:'pt-BR'})});assert.equal(portuguese.status,200);assert.equal(portuguese.headers.get('X-Audio-Delivery'),'bundled');
 assert.ok(count>=150);console.log('PASS: '+count+' exclusive context examples use protected recordings with providers disabled; anonymous/free access rejected; às vezes bundled.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
