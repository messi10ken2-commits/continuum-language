import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
after(async()=>{await new Promise(r=>testServer.close(r));await db.close()});
const base=()=>`http://127.0.0.1:${testServer.address().port}`;
async function call(path,method='GET',body,cookie){const r=await fetch(base()+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}}
async function register(email,role){return call('/auth/register','POST',{email,name:role==='teacher'?'Teacher':'Learner',role,password:'a-strong-password',adult:true})}
test('stores only pronunciation metadata and follows learner sharing',async()=>{
 const l=await register('pronunciation-learner@example.com','learner'),t=await register('pronunciation-teacher@example.com','teacher');
 const code=(await call('/share-code','POST',{},l.cookie)).data.code;await call('/teacher/connect','POST',{code},t.cookie);
 const body={lesson:'pronunciation',targetVersion:'pronunciation-model-v1',score:88,durationMs:3400,submissionKey:'pronunciation-test-1'};
 const saved=await call('/pronunciation','POST',body,l.cookie);assert.equal(saved.status,201);assert.equal(saved.data.attempt.score,88);assert.equal('transcript' in saved.data.attempt,false);assert.equal('audio' in saved.data.attempt,false);
 const history=await call('/pronunciation','GET',null,l.cookie);assert.equal(history.data.attempts.length,1);
 const learnerId=(await call('/teacher/learners','GET',null,t.cookie)).data.learners[0].id;
 assert.equal((await call('/teacher/learners/'+learnerId,'GET',null,t.cookie)).data.pronunciation[0].score,88);
 await call('/privacy','PUT',{shareSelfLearning:false},l.cookie);
 assert.deepEqual((await call('/teacher/learners/'+learnerId,'GET',null,t.cookie)).data.pronunciation,[]);
});
test('rejects unsupported targets and forged ranges',async()=>{
 const l=await register('pronunciation-invalid@example.com','learner');
 assert.equal((await call('/pronunciation','POST',{lesson:'cafe',targetVersion:'cafe-model-v1',score:90,durationMs:1000,submissionKey:'pronunciation-test-2'},l.cookie)).status,400);
 assert.equal((await call('/pronunciation','POST',{lesson:'pronunciation',targetVersion:'pronunciation-model-v1',score:101,durationMs:1000,submissionKey:'pronunciation-test-3'},l.cookie)).status,400);
});
