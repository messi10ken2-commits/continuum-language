import {bundledRecording} from './bundled-audio.mjs';
import {languageInfo} from './languages.mjs';
import assert from 'node:assert/strict';
import {premiumCourses,premiumCourseById} from './premium-courses.mjs';
import {exclusiveSession,exclusiveAnswer,exclusiveAnswers,premiumGalleryFrames} from './premium-session.mjs';
import {speechKey,pcmWav} from './speech-service.mjs';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,r,data:r.headers.get('content-type')?.includes('application/json')?await r.json():await r.arrayBuffer(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 const paid=await api('/auth/register','POST',{name:'Gallery QA',email:'gallery-qa@example.test',password:'synthetic-gallery-password',role:'learner',adult:true});
 const id=paid.data.user.id;assert.equal(paid.status,200);await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[id]);
 for(const c of premiumCourses){
  const opened=await api('/billing/courses/'+c.id,'GET',null,paid.cookie);assert.equal(opened.status,200);assert.ok(opened.data.course.questions.every(q=>!('answer'in q)&&!('note'in q)));
  const session=exclusiveSession(opened.data.course,'session-api-shuffle-123456789'),answers=session.questions.map(q=>{const original=c.questions[q._sourceIndex];return typeof original.answer==='number'?q._optionOrder.indexOf(original.answer):original.answer});
  for(const [i,q]of session.questions.entries()){const feedback=await api('/billing/courses/'+c.id+'/answer','POST',{question:q._sourceIndex,answer:exclusiveAnswer(q,answers[i])},paid.cookie);assert.equal(feedback.status,200);assert.equal(feedback.data.correct,true,c.id+':'+i);}
  const submitted=await api('/billing/courses/'+c.id+'/finish','POST',{answers:exclusiveAnswers(session,answers),key:crypto.randomUUID()},paid.cookie);assert.equal(submitted.status,200);assert.equal(submitted.data.correct,c.questions.length);
  if(!c.conversation){const frame=premiumGalleryFrames(c)[0],path='/billing/courses/'+c.id+'/audio?gallery=0';
   if(c.scene==='varieties'&&!frame.audioLocale){assert.equal((await api(path,'GET',null,paid.cookie)).status,404);continue;}
   const locale=frame.audioLocale||languageInfo(c.language).locale,bytes=pcmWav(Buffer.from(Array.from({length:4800},(_,i)=>[0,12,0,244][i%4])));await db.query('INSERT INTO speech_cache(cache_key,audio,provider,model) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[speechKey(frame.text,locale),bytes,'synthetic','gallery-test']);
   const audio=await api(path,'GET',null,paid.cookie);assert.equal(audio.status,200);assert.deepEqual(Buffer.from(audio.data),bundledRecording(frame.text,locale)?.audio||bytes);assert.equal(audio.r.headers.get('cache-control'),'private, no-store');
  }
 }
 for(const archivedId of ['ja-premium-video-v2','ja-premium-video-v3']){const old=premiumCourseById(archivedId),opened=await api('/billing/courses/'+archivedId,'GET',null,paid.cookie);assert.equal(opened.status,200);assert.ok(opened.data.course.questions.every(q=>!('answer' in q)));const answers=old.questions.map(q=>q.answer),result=await api('/billing/courses/'+archivedId+'/finish','POST',{answers,key:crypto.randomUUID()},paid.cookie);assert.equal(result.status,200);assert.equal(result.data.correct,old.questions.length);}
 const summary=(await api('/billing','GET',null,paid.cookie)).data;assert.ok(summary.archivedCourses.some(c=>c.id==='ja-premium-video-v3'));assert.ok(!summary.courses.some(c=>c.id==='ja-premium-video-v3'));assert.equal(summary.progress.find(p=>p.id==='ja-premium-video-v4').total,8);
 for(const value of ['', '-1','nope','1.5','99999'])assert.equal((await api('/billing/courses/en-workplace-diplomacy/audio?gallery='+value,'GET',null,paid.cookie)).status,404);
 await db.query("UPDATE billing_memberships SET status='cancelled',paid_until=NULL WHERE user_id=$1",[id]);assert.equal((await api('/billing/courses/en-workplace-diplomacy/audio?gallery=0','GET',null,paid.cookie)).status,403);
 console.log('PASS: all 36 shuffled courses grade correctly; protected gallery audio uses exact authored text, private caching, strict indexes and regional restrictions.');
}finally{await new Promise(r=>testServer.close(r));await db.close()}
