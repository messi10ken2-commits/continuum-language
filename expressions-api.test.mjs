import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {expressionLessons} from './curriculum-expressions.mjs';
import {getLesson} from './course.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 const a=await call('/auth/register','POST',{name:'ExpressionLearner',email:'expressions@example.test',password:'synthetic-test-password',role:'learner',adult:true});assert.equal(a.status,200);
 for(const l of [...expressionLessons,...new Set(expressionLessons.map(l=>l.chapter))].map(l=>typeof l==='string'?getLesson(l+'-checkpoint'):l)){
  const answers=l.questions.map(q=>q.answer);
  assert.equal((await call('/learning/'+l.id,'PUT',{answers:answers.slice(0,2)},a.cookie)).status,200);
  const draft=(await call('/learning','GET',null,a.cookie)).data.drafts.find(x=>x.lesson===l.id);assert.deepEqual(draft.answers,answers.slice(0,2));
  const r=await call('/practice','POST',{lesson:l.id,answers,score:0,submissionKey:'test-'+l.id},a.cookie);assert.equal(r.status,201);assert.equal(r.data.attempt.score,100);assert.equal(r.data.attempt.total,l.questions.length);
  const state=(await call('/learning','GET',null,a.cookie)).data;assert.equal(state.drafts.some(x=>x.lesson===l.id),false);assert.equal(state.progress.find(x=>x.lesson===l.id).best,100);
 }
 assert.equal((await call('/learning','GET',null,a.cookie)).data.progress.length,30);
 const t=await call('/auth/register','POST',{name:'ExpressionTeacher',email:'expressionteacher@example.test',password:'synthetic-test-password',role:'teacher',adult:true});
 const share=await call('/share-code','POST',{},a.cookie);assert.equal((await call('/teacher/connect','POST',{code:share.data.code},t.cookie)).status,200);
 const route='/teacher/learners/'+a.data.user.id;assert.equal((await call(route,'GET',null,t.cookie)).data.attempts.length,30);
 assert.equal((await call('/privacy','PUT',{shareSelfLearning:false},a.cookie)).status,200);assert.deepEqual((await call(route,'GET',null,t.cookie)).data.attempts,[]);
 console.log('PASS: all 20 expression lessons + 10 checkpoints persist drafts, grade on server, clear drafts and obey teacher privacy.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
