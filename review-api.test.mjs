import {listeningReviewQuestion} from './review-listening.mjs';
import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {getLessonVariant} from './course.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 const register=async(name,role='learner')=>call('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-test-password',role,adult:true});
 const a=await register('review-owner'),b=await register('review-other'),t=await register('review-teacher','teacher');
 assert.equal(a.status,200);assert.equal((await call('/review?language=pt')).status,401);assert.equal((await call('/review?language=pt','GET',null,t.cookie)).status,403);
 const id='pt-a2-v2-lesson-12',seed='v4-review-api-123456789',l=getLessonVariant(id,seed),answers=l.questions.map(q=>q.answer);answers[0]='wrong';
 const draft={answers:answers.slice(0,1),seed};
 assert.equal((await call('/learning/'+id,'PUT',draft,a.cookie)).status,200);
 assert.equal((await call('/learning/'+id,'PUT',draft,a.cookie)).status,200);
 let pool=await call('/review?language=pt','GET',null,a.cookie);assert.equal(pool.status,200,JSON.stringify(pool.data));assert.equal(pool.data.items.length,1);const item=pool.data.items[0];assert.equal(item.misses,1);
 assert.equal((await call('/review?language=es','GET',null,a.cookie)).data.items.length,0);
 assert.equal((await call('/review?language=pt','GET',null,b.cookie)).data.items.length,0);
 const key=crypto.randomUUID(),correct={answer:item.question.answer,submissionKey:key};
 assert.equal((await call('/review/'+item.id+'/check','POST',correct,b.cookie)).status,404);
 let check=await call('/review/'+item.id+'/check','POST',correct,a.cookie);assert.equal(check.status,200,JSON.stringify(check.data));assert.equal(check.data.strength,1);assert.ok(check.data.correct);assert.ok(new Date(check.data.dueAt)>new Date());
 const repeat=await call('/review/'+item.id+'/check','POST',correct,a.cookie);assert.deepEqual(repeat.data,check.data);
 const submission={lesson:id,answers,seed,submissionKey:crypto.randomUUID()};assert.equal((await call('/practice','POST',submission,a.cookie)).status,201);
 pool=await call('/review?language=pt','GET',null,a.cookie);assert.equal(pool.data.items.length,1);assert.equal(pool.data.items[0].misses,1);assert.equal(pool.data.items[0].strength,1);
 const listening=listeningReviewQuestion(item);assert.ok(listening);const listeningKey=crypto.randomUUID();
 const listeningResult=await call('/review/'+item.id+'/check','POST',{answer:listening.answer,mode:'listening',submissionKey:listeningKey},a.cookie);assert.equal(listeningResult.status,200);assert.equal(listeningResult.data.correct,true);assert.equal(listeningResult.data.mode,'listening');
 assert.equal((await call('/review/'+item.id+'/check','POST',{answer:listening.answer,mode:'listening',submissionKey:crypto.randomUUID()},b.cookie)).status,404);
 assert.equal((await call('/review/'+item.id+'/check','POST',{answer:listening.answer,mode:'context',submissionKey:listeningKey},a.cookie)).status,409);
 const endDraft=await call('/learning/'+id,'PUT',{answers,seed},a.cookie);assert.equal(endDraft.status,200);const resumed=await call('/learning','GET',null,a.cookie);assert.deepEqual(resumed.data.drafts.find(d=>d.lesson===id).answers,answers);
 const q=item.question,wrong=q.type==='text'?'wrong':(q.answer+1)%q.options.length;
 check=await call('/review/'+item.id+'/check','POST',{answer:wrong,submissionKey:crypto.randomUUID()},a.cookie);assert.equal(check.data.strength,0);assert.equal(check.data.correct,false);
 // Reconstruct historical evidence that predates the review feature.
 await db.query('DELETE FROM review_items WHERE user_id=$1',[a.data.user.id]);
 await db.query('DELETE FROM review_ingested WHERE user_id=$1',[a.data.user.id]);
 pool=await call('/review?language=pt','GET',null,a.cookie);assert.equal(pool.data.items.length,1);
 console.log('PASS: automatic draft capture, completion deduplication, historical catch-up, language/account isolation, teacher denial, server grading and idempotent scheduling');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
