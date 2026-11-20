import {bundledRecording} from './bundled-audio.mjs';
// Actual HTTP routes and isolated PostgreSQL-compatible storage; no paid providers.
import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {lessonList,getLessonVariant} from './course.mjs';
import {assessmentItems} from './assessment-bank.mjs';
import {languageInfo} from './languages.mjs';
import {speechKey,pcmWav} from './speech-service.mjs';
const base='http://127.0.0.1:'+testServer.address().port,added=['zh','ko','fr','de','ar','it'];
async function call(path,method='GET',body,person){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(person?{cookie:person.cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});const bytes=Buffer.from(await r.arrayBuffer());return {status:r.status,data:r.headers.get('content-type')?.includes('json')?JSON.parse(bytes):bytes,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function account(name,role='learner'){const r=await call('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-expansion-password',role,adult:true});assert.equal(r.status,200);return {id:r.data.user.id,cookie:r.cookie};}
try{
 const learner=await account('ExpansionLearner'),other=await account('ExpansionOther'),teacher=await account('ExpansionTeacher','teacher');
 assert.equal((await call('/profile','PUT',{profile:{name:'ExpansionLearner',languages:added,primaryLanguage:'zh',level:'A1',startMode:'manual',goal:'Synthetic expansion verification'}},learner)).status,200);
 for(const language of added){
  const id=`${language}-a1-core-v3-lesson-7`,seed='v8-expansion-api-123456789',lesson=getLessonVariant(id,seed),answers=lesson.questions.map(q=>q.answer);
  assert.equal((await call('/learning/'+id,'PUT',{answers:[],seed},learner)).status,200);
  assert.equal((await call('/learning/'+id,'PUT',{answers:answers.slice(0,3),seed},learner)).status,200);
  assert.deepEqual((await call('/learning','GET',null,learner)).data.drafts.find(d=>d.lesson===id).answers,answers.slice(0,3));
  assert.ok(!(await call('/learning','GET',null,other)).data.drafts.some(d=>d.lesson===id));
  const key=crypto.randomUUID(),body={lesson:id,answers,seed,submissionKey:key};
  const completed=await call('/practice','POST',body,learner);assert.equal(completed.status,201);assert.equal(completed.data.attempt.score,100);assert.equal((await call('/practice','POST',body,learner)).data.attempt.id,completed.data.attempt.id);
  const start=await call('/assessments?language='+language,'POST',{},learner);assert.equal(start.status,200);let session=start.data.session;assert.equal(session.version,language+'-diagnostic-4');const items=assessmentItems(session.form,session.version);
  assert.equal((await call('/assessments/'+session.id+'?language='+language,'PUT',{index:0,answer:items[0].answer},other)).status,404);
  assert.equal((await call('/assessments/'+session.id+'?language=en','PUT',{index:0,answer:items[0].answer},learner)).status,404);
  for(let index=0;index<47;index++){const r=await call('/assessments/'+session.id+'?language='+language,'PUT',{index,answer:index<45?items[index].answer:null},learner);assert.equal(r.status,200,JSON.stringify(r.data));session=r.data.session;}
  assert.equal(session.result.level,'C1');assert.equal(session.result.correct,45);assert.equal((await call('/assessments?language='+language,'GET',null,learner)).data.history.length,1);
  const task=`${language}-skills-a1-writing`,response=lessonList.find(l=>l.language===language&&!l.checkpoint).example.repeat(3);
  const submission=await call('/skills','POST',{task,response,submissionKey:crypto.randomUUID()},learner);assert.equal(submission.status,201,JSON.stringify(submission.data));
  assert.equal((await call('/skills/'+submission.data.submission.id,'GET',null,other)).status,403);
  assert.equal((await call('/skills/tasks/focus-'+language+'-travel-listening-a1','GET',null,learner)).status,403);
  const text=lessonList.find(l=>l.language===language&&l.skill==='Listening').example,locale=languageInfo(language).locale,bytes=pcmWav(Buffer.from(Array.from({length:4800},(_,i)=>[0,12,0,244][i%4])));
  await db.query('INSERT INTO speech_cache(cache_key,audio,provider,model) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[speechKey(text,locale),bytes,'synthetic','expansion-test']);
  const speech=await call('/speech','POST',{text,locale},learner);assert.equal(speech.status,200);assert.deepEqual(speech.data,bundledRecording(text,locale)?.audio||bytes);
 }
 const code=await call('/share-code','POST',{language:'zh'},learner);assert.equal(code.status,201);assert.equal((await call('/teacher/connect','POST',{code:code.data.code},teacher)).status,200);
 const shared=await call('/teacher/learners/'+learner.id,'GET',null,teacher);assert.equal(shared.status,200);assert.ok(shared.data.attempts.every(a=>a.lesson.startsWith('zh-')));assert.equal(shared.data.attempts.length,1);
 assert.equal((await call('/teacher/learners/'+learner.id+'?language=ar','GET',null,teacher)).status,403);
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[learner.id]);
 for(const language of added){const task=await call('/skills/tasks/focus-'+language+'-travel-listening-a1','GET',null,learner);assert.equal(task.status,200);assert.equal(task.data.task.language,language);assert.equal(task.data.task.locale,languageInfo(language).locale);}
 console.log('PASS: six-language profiles, saved exercises, server grading/idempotency, 282 placement answers, workshop and account isolation, teacher language scope, paid access and native-locale cached audio.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
