import test from 'node:test';import assert from 'node:assert/strict';
import {lessonList,getLessonVariant,hasExpandedExercises} from './course.mjs';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
test('native and web share accounts/progress; bearer isolation, logout and deletion requests are enforced',async()=>{
 const {testServer,db}=await import('./test-server.mjs');const base='http://127.0.0.1:'+testServer.address().port;
 const password='native-test-password-123',email='native-session@example.test';
 async function request(path,method='GET',body,headers={}){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...headers},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
 try{
  const web=await request('/auth/register','POST',{name:'Shared learner',email,password,role:'learner',adult:true});assert.equal(web.status,200);assert.equal(web.data.sessionToken,undefined);
  const native={'Origin':'capacitor://localhost','X-Continuum-Client':'ios'};
  const login=await request('/auth/login','POST',{email,password},native);assert.equal(login.status,200);assert.equal(login.data.user.id,web.data.user.id);assert.match(login.data.sessionToken,/^[A-Za-z0-9_-]{43}$/);
  native.Authorization='Bearer '+login.data.sessionToken;
  assert.equal((await request('/auth/me','GET',null,native)).data.user.id,web.data.user.id);
  const baseLesson=lessonList.find(l=>!l.checkpoint&&!l.summaryTest),seed=baseLesson.exerciseVersion||(hasExpandedExercises(baseLesson.id)?'v2-native-progress-123456789':undefined);
  const lesson=getLessonVariant(baseLesson.id,seed),submission={lesson:lesson.id,seed,answers:lesson.questions.map(q=>q.answer),submissionKey:'native-shared-progress-123'};
  const completed=await request('/practice','POST',submission,native);assert.equal(completed.status,201);
  assert.equal((await request('/practice','POST',submission,native)).data.attempt.id,completed.data.attempt.id,'a retried submission is idempotent');
  const history=(await request('/practice','GET',null,{Cookie:web.cookie})).data.attempts;assert.equal(history.length,1);assert.equal(history[0].id,completed.data.attempt.id);
  const bad=await request('/privacy','PUT',{shareSelfLearning:false},{Origin:'capacitor://localhost',Cookie:web.cookie});assert.equal(bad.status,403);
  assert.equal((await request('/privacy','PUT',{shareSelfLearning:false},{Origin:'https://evil.test',Authorization:native.Authorization})).status,403);
  assert.equal((await request('/account/deletion-request','POST',{password:'incorrect',confirm:true},native)).status,401);
  const deletion=await request('/account/deletion-request','POST',{password,confirm:true},native);assert.equal(deletion.status,200);assert.equal(deletion.data.status,'awaiting_operator_fulfilment');
  assert.equal((await request('/account/deletion-request','POST',{password,confirm:true},native)).data.ticketId,deletion.data.ticketId);
  assert.equal((await db.query("SELECT count(*)::int AS n FROM support_tickets WHERE user_id=$1 AND category='account'",[web.data.user.id])).rows[0].n,1);
  assert.equal((await request('/auth/logout','POST',{},native)).status,200);assert.equal((await request('/auth/me','GET',null,native)).data.user,null);
  assert.equal((await request('/auth/me','GET',null,{Cookie:web.cookie})).data.user.id,web.data.user.id,'native logout does not revoke the separate web session');
 }finally{await new Promise(r=>testServer.close(r));await db.close();}
});
