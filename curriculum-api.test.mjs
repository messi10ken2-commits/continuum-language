import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {lessonList,getLessonVariant} from './course.mjs';
const base='http://127.0.0.1:'+testServer.address().port;let cookie;
async function call(path,method='GET',body){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!cookie)cookie=r.headers.get('set-cookie')?.split(';')[0];return {status:r.status,data};}
try{
 assert.equal((await call('/auth/register','POST',{name:'Curriculum regression',email:'curriculum@example.test',password:'synthetic-test-password',role:'learner',adult:true})).status,200);
 for(const language of ['en','pt','ja']){
  const seed='v1-curriculum-api-123456789',id=`${language}-a1-v2-chapter-1-checkpoint`,l=getLessonVariant(id,seed);
  assert.equal((await call('/learning/'+id,'PUT',{answers:[l.questions[0].answer],seed})).status,200);
  assert.equal((await call('/learning')).data.drafts.find(d=>d.lesson===id).seed,seed);
  const scored=await call('/practice','POST',{lesson:id,answers:l.questions.map(q=>q.answer),seed,submissionKey:crypto.randomUUID()});
  assert.equal(scored.status,201,JSON.stringify(scored.data));assert.equal(scored.data.attempt.score,100);
  for(const lesson of lessonList.filter(l=>l.language===language&&l.productionTask)){
   const response=lesson.skill==='Speaking'?{audio:'data:audio/mp4;base64,'+Buffer.alloc(150,1).toString('base64'),seconds:15}:language==='ja'?'これは保存確認用の回答です。条件を確認してから計画を進めます。':'This is a synthetic response for a curriculum persistence test.';
   const saved=await call('/skills','POST',{task:lesson.productionTask,response,submissionKey:crypto.randomUUID()});assert.equal(saved.status,201,JSON.stringify(saved.data));
   const restored=await call('/skills/'+saved.data.submission.id);assert.equal(restored.status,200);assert.deepEqual(restored.data.submission.response,response);assert.equal(restored.data.submission.task,lesson.productionTask);
  }
 }
 const practice=await call('/practice');assert.equal(practice.data.attempts.length,3);
 const records=await call('/skills');assert.equal(records.data.submissions.length,15);assert.ok(records.data.submissions.every(s=>s.task.includes('-v2-lesson-')));
 console.log('PASS: revised checkpoints save, resume and score; all 15 chapter-specific speaking/writing tasks save and restore with their correct task IDs.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
