import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {getLessonVariant} from './course.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 const a=await call('/auth/register','POST',{name:'ExpandedExercises',email:'expanded@example.test',password:'synthetic-test-password',role:'learner',adult:true});assert.equal(a.status,200);
 for(const id of ['work-vocabulary','en-a2-v2-lesson-5','pt-a2-v2-lesson-9','ja-b2-v2-lesson-5']){
  const seed='v2-api-test-123456789',l=getLessonVariant(id,seed),answers=l.questions.map(q=>q.answer);
  assert.equal((await call('/learning/'+id,'PUT',{answers:[],seed},a.cookie)).status,200,id+' start');
  assert.equal((await call('/learning/'+id,'PUT',{answers:answers.slice(0,5),seed},a.cookie)).status,200);
  const saved=(await call('/learning','GET',null,a.cookie)).data.drafts.find(d=>d.lesson===id);assert.equal(saved.seed,seed);assert.deepEqual(saved.answers,answers.slice(0,5));
  const r=await call('/practice','POST',{lesson:id,answers,seed,submissionKey:crypto.randomUUID()},a.cookie);assert.equal(r.status,201,JSON.stringify(r.data));assert.equal(r.data.attempt.score,100);assert.equal(r.data.attempt.total,answers.length);
 }
 const old=getLessonVariant('en-a2-v2-lesson-7');assert.equal(old.questions.length,3);assert.equal((await call('/practice','POST',{lesson:old.id,answers:old.questions.map(q=>q.answer),submissionKey:crypto.randomUUID()},a.cookie)).status,201);
 console.log('PASS: long mixed exercises save/reload, grade server-side, retain exact totals and preserve unversioned legacy submissions.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
