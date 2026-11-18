import test from 'node:test';import assert from 'node:assert/strict';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
test('chat blocks apply in both directions, survive reconnection and cannot be removed by the other person',async()=>{
 const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
 const request=async(path,method='GET',body,cookie)=>{const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
 try{
  const people={};for(const role of ['learner','teacher','outsider'])people[role]=await request('/auth/register','POST',{name:'Safety '+role,email:role+'@safety.example.test',password:'safety-password-123',adult:true,role:role==='teacher'?'teacher':'learner'});
  const learner=people.learner,teacher=people.teacher;
  const code=(await request('/share-code','POST',{language:'en'},learner.cookie)).data.code;await request('/teacher/connect','POST',{code},teacher.cookie);
  const id=(await request('/classroom/threads','POST',{otherId:teacher.data.user.id,language:'en'},learner.cookie)).data.threadId;
  const path='/classroom/threads/'+id;
  assert.equal((await request(path+'/messages','POST',{body:'Saved before block',clientKey:crypto.randomUUID()},teacher.cookie)).status,200);
  assert.equal((await request(path+'/safety','PUT',{blocked:true},people.outsider.cookie)).status,404);
  assert.equal((await request(path+'/safety','PUT',{blocked:true},learner.cookie)).data.blocked,true);
  for(const person of [learner,teacher])assert.equal((await request(path+'/messages','POST',{body:'Must not be delivered',clientKey:crypto.randomUUID()},person.cookie)).status,403);
  assert.equal((await request(path+'/safety','PUT',{blocked:false},teacher.cookie)).data.blocked,true);
  const history=(await request(path+'/messages','GET',null,learner.cookie)).data;assert.equal(history.blocked,true);assert.equal(history.messages.length,1);
  assert.equal((await request('/classroom','GET',null,learner.cookie)).data.connections.length,1,'message blocks do not change learning access');
  assert.equal((await request(path+'/safety','PUT',{blocked:false},learner.cookie)).data.blocked,false);
  assert.equal((await request(path+'/messages','POST',{body:'Allowed after unblock',clientKey:crypto.randomUUID()},teacher.cookie)).status,200);
 }finally{await new Promise(r=>testServer.close(r));await db.close();}
});
