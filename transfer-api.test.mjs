import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {getLessonVariant,gradeLesson} from './course.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
let cookie;
async function call(path,method='GET',body){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];return {status:r.status,data:await r.json()};}
try{
 assert.equal((await call('/auth/register','POST',{name:'Transfer Test',email:'transfer@example.test',password:'synthetic-test-password',role:'learner',adult:true})).status,200);
 for(const id of ['a1-hello-checkpoint','b2-summary-test']){
  const seed='v1-integration-test-123456789',l=getLessonVariant(id,seed),answers=l.questions.map(q=>q.answer);
  assert.equal((await call('/learning/'+id,'PUT',{answers:answers.slice(0,2),seed})).status,200);
  const draft=(await call('/learning')).data.drafts.find(d=>d.lesson===id);assert.equal(draft.seed,seed);assert.deepEqual(draft.answers,answers.slice(0,2));
  const replay=getLessonVariant(id,draft.seed);assert.deepEqual(replay.questions,l.questions);
  const key='transfer-'+id+'-123456789';const saved=await call('/practice','POST',{lesson:id,answers,seed,submissionKey:key});assert.equal(saved.status,201);assert.equal(saved.data.attempt.score,100);assert.equal(saved.data.attempt.total,l.questions.length);
  assert.equal((await call('/practice','POST',{lesson:id,answers,seed,submissionKey:key})).data.attempt.id,saved.data.attempt.id);
  assert.equal((await call('/learning')).data.drafts.length,0);
  const row=await db.query('SELECT variant_seed FROM practice_attempts WHERE id=$1',[saved.data.attempt.id]);assert.equal(row.rows[0].variant_seed,seed);
 }
 assert.equal((await call('/learning/a1-hello-checkpoint','PUT',{answers:[],seed:'broken'})).status,400);
 assert.equal((await call('/practice','POST',{lesson:'a1-hello-checkpoint',answers:[0],seed:'v1-integration-test-123456789'})).status,400);
 assert.equal((await call('/practice','POST',{lesson:'subjunctive',answers:[1,1,1,1,1]})).data.attempt.score,100);
 console.log('PASS: randomized tests saved, resumed, graded server-side, idempotent; legacy lessons intact.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
