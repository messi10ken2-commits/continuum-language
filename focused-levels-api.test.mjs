import assert from 'node:assert/strict';
import {premiumSkillTasks} from './premium-skills.mjs';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 const paid=await api('/auth/register','POST',{name:'Level QA',email:'level-qa@example.test',password:'synthetic-level-qa-password',role:'learner',adult:true});assert.equal(paid.status,200);
 const free=await api('/auth/register','POST',{name:'Free Level QA',email:'free-level-qa@example.test',password:'synthetic-level-qa-password',role:'learner',adult:true});
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[paid.data.user.id]);
 for(const language of ['en','es','pt','ja'])for(const level of ['A1','A2','B1','B2','C1']){
  const id=`focus-${language}-travel-listening-${level.toLowerCase()}`,task=premiumSkillTasks.find(t=>t.id===id);
  const result=await api('/skills/tasks/'+id,'GET',null,paid.cookie);assert.equal(result.status,200);assert.deepEqual(result.data.task,task);
  assert.equal((await api('/skills/tasks/'+id,'GET',null,free.cookie)).status,403);
  assert.equal((await api('/skills/tasks/'+id+'/audio','GET',null,free.cookie)).status,403);
  const body={task:id,response:task.questions.map(q=>q.answer),submissionKey:crypto.randomUUID()};
  const graded=await api('/skills','POST',body,paid.cookie);assert.equal(graded.status,201);assert.equal(graded.data.submission.result.score,100);assert.equal(graded.data.submission.task,id);assert.equal(graded.data.submission.taskInfo.level,level);
  assert.equal((await api('/skills','POST',body,paid.cookie)).status,200,'retries remain idempotent');
 }
 const saved=await api('/skills','GET',null,paid.cookie);assert.equal(saved.data.submissions.length,20);assert.equal(new Set(saved.data.submissions.map(t=>t.task)).size,20);
 assert.equal((await api('/skills/tasks/focus-ja-travel-writing','GET',null,paid.cookie)).status,200);
 console.log('PASS: 20 language/level API paths, correct grading, historical task resolution, idempotency and free access protection.');
}finally{await new Promise(r=>testServer.close(r));await db.close()}
