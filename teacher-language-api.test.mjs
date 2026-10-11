import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {testServer,db} from './test-server.mjs';
import {lessonList} from './course.mjs';
import {skillTasks} from './skills-content.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function account(name,role='learner'){const r=await call('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-test-password',role,adult:true});assert.equal(r.status,200);return {...r,id:r.data.user.id};}
try{
 const learner=await account('ScopedLearner'),other=await account('OtherLearner'),teacher=await account('SpanishTeacher','teacher'),teacher2=await account('JapaneseTeacher','teacher'),legacy=await account('LegacyTeacher','teacher');
 assert.equal((await call('/share-code','POST',{},learner.cookie)).status,400);
 async function connect(t,language){const c=await call('/share-code','POST',{language},learner.cookie);assert.equal(c.status,201);assert.equal((await call('/teacher/connect','POST',{code:c.data.code},t.cookie)).status,200);}
 await connect(teacher,'es');await connect(teacher2,'ja');
 await db.query('INSERT INTO teacher_links(teacher_id,learner_id) VALUES($1,$2)',[legacy.id,learner.id]);
 const samples={};
 for(const language of ['es','ja','pt','en']){
  const lesson=lessonList.find(l=>(l.language||'es')===language),task=skillTasks.find(t=>(t.language||'es')===language&&t.skill==='Writing');
  await db.query("INSERT INTO practice_attempts(user_id,lesson_id,score,total,source) VALUES($1,$2,100,4,'exercise')",[learner.id,lesson.id]);
  await db.query("INSERT INTO pronunciation_attempts(user_id,lesson_id,target_version,score,duration_ms,submission_key) VALUES($1,$2,'v1',90,1000,$3)",[learner.id,lesson.id,crypto.randomUUID()]);
  await db.query('INSERT INTO class_notes(learner_id,teacher_id,focus,note,language) VALUES($1,$2,$3,$4,$5)',[learner.id,teacher.id,language+' focus',language+' private note',language]);
  await db.query("INSERT INTO assessments(user_id,kind,version,form,language,result,completed_at) VALUES($1,'placement','test-fixture',0,$2,$3::jsonb,now())",[learner.id,language,JSON.stringify({language})]);
  const result=await call('/skills','POST',{task:task.id,response:language+' private written response',submissionKey:crypto.randomUUID()},learner.cookie);assert.equal(result.status,201);samples[language]={lesson:lesson.id,task:task.id,submission:result.data.submission.id};
 }
 const learnerPath='/teacher/learners/'+learner.id;
 for(const [t,language] of [[teacher,'es'],[teacher2,'ja']]){
  const record=await call(learnerPath,'GET',null,t.cookie);assert.equal(record.status,200);assert.equal(record.data.assessment.language,language);assert.equal(record.data.assessment.result.language,language);assert.deepEqual(record.data.attempts.map(a=>a.lesson),[samples[language].lesson]);assert.deepEqual(record.data.pronunciation.map(a=>a.lesson),[samples[language].lesson]);
  assert.deepEqual((await call(learnerPath+'/notes','GET',null,t.cookie)).data.notes.map(n=>n.language),[language]);
  assert.deepEqual((await call('/skills/learner/'+learner.id,'GET',null,t.cookie)).data.submissions.map(s=>s.task),[samples[language].task]);
  for(const lang of ['es','ja','pt','en']){
   assert.equal((await call('/skills/'+samples[lang].submission,'GET',null,t.cookie)).status,lang===language?200:403);
   assert.equal((await call('/skills/'+samples[lang].submission+'/review','PUT',{ratings:[3,3,3,3],feedback:'Clear response and useful examples.'},t.cookie)).status,lang===language?200:403);
  }
  const forbidden=language==='es'?'ja':'es';
  assert.equal((await call(learnerPath+'?language='+forbidden,'GET',null,t.cookie)).status,403);
  assert.equal((await call('/skills/learner/'+learner.id+'?language='+forbidden,'GET',null,t.cookie)).status,403);
  assert.equal((await call(learnerPath+'/notes','POST',{language:forbidden,focus:'Writing',note:'A private observation'},t.cookie)).status,403);
 }
 assert.equal((await call(learnerPath,'GET',null,legacy.cookie)).data.attempts.length,0);assert.equal((await call(learnerPath,'GET',null,legacy.cookie)).data.assessment,null);
 assert.equal((await call(learnerPath+'/notes','GET',null,legacy.cookie)).data.notes.length,0);
 assert.equal((await call('/skills/'+samples.es.submission,'GET',null,legacy.cookie)).status,403);
 assert.equal((await call('/learner/teachers/'+teacher.id,'PUT',{languages:['en']},other.cookie)).status,404);
 assert.equal((await call('/learner/teachers/'+teacher.id,'PUT',{languages:['en']},teacher.cookie)).status,403);
 // Additional language comes from a learner-issued code; explicitly selecting it narrows every list.
 await connect(teacher,'en');assert.equal((await call(learnerPath,'GET',null,teacher.cookie)).data.attempts.length,2);
 assert.deepEqual((await call(learnerPath+'?language=en','GET',null,teacher.cookie)).data.attempts.map(a=>a.lesson),[samples.en.lesson]);
 assert.equal((await call('/learner/teachers/'+teacher.id,'PUT',{languages:['en']},learner.cookie)).status,200);
 assert.equal((await call('/skills/'+samples.es.submission,'GET',null,teacher.cookie)).status,403);
 assert.equal((await call('/skills/'+samples.en.submission,'GET',null,learner.cookie)).status,200);
 await call('/privacy','PUT',{shareSelfLearning:false},learner.cookie);
 assert.equal((await call(learnerPath,'GET',null,teacher.cookie)).data.attempts.length,0);
 assert.equal((await call('/skills/'+samples.en.submission,'GET',null,teacher.cookie)).status,403);
 assert.deepEqual((await call(learnerPath+'/notes','GET',null,teacher.cookie)).data.notes.map(n=>n.language),['en']);
 await call('/learner/teachers/'+teacher.id,'PUT',{languages:[]},learner.cookie);
 assert.equal((await call(learnerPath+'/notes','GET',null,teacher.cookie)).data.notes.length,0);
 assert.equal((await call('/practice','GET',null,learner.cookie)).data.attempts.length,4);
 console.log('PASS: per-teacher language isolation across activity, pronunciation, notes, skill lists, direct responses and reviews; legacy links deny by default; learner controls, revocation and privacy preserved.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
