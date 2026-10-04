import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {assessmentItems} from './assessment-bank.mjs';
import {getLessonVariant} from './course.mjs';
const base='http://127.0.0.1:'+testServer.address().port;let cookie;
async function call(path,method='GET',body){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!cookie)cookie=r.headers.get('set-cookie')?.split(';')[0];return {status:r.status,data};}
try{
 assert.equal((await call('/auth/register','POST',{name:'Multilingual Test',email:'multi@example.test',password:'synthetic-test-password',role:'learner',adult:true})).status,200);
 const sessions={};
 for(const lang of ['es','ja','pt','en']){const r=await call('/assessments?language='+lang,'POST',{});assert.equal(r.status,200,JSON.stringify(r.data));sessions[lang]=r.data.session;assert.ok(sessions[lang].version.startsWith(lang));}
 assert.equal(new Set(Object.values(sessions).map(s=>s.id)).size,4);
 assert.equal((await call('/assessments/'+sessions.ja.id+'?language=pt','PUT',{index:0,answer:0})).status,404);
 for(const lang of ['ja','pt','en']){
 let s=sessions[lang];const items=assessmentItems(s.form,s.version);
 for(let index=0;index<45;index++){const r=await call('/assessments/'+s.id+'?language='+lang,'PUT',{index,answer:items[index].answer});assert.equal(r.status,200,JSON.stringify(r.data));s=r.data.session;}
 assert.equal(s.question.task.language,lang);
 const writing=await call('/skills','POST',{task:s.question.task.id,assessment:s.id,response:lang==='ja'?'これはテスト用の回答です。比較できる資料を集めてから判断するべきです。':'This is a synthetic test response with a specific recommendation and further evidence.',submissionKey:'multi-writing-'+lang+'-123456789'});assert.equal(writing.status,201,JSON.stringify(writing.data));
 const next=await call('/assessments/'+s.id+'?language='+lang,'PUT',{index:45,answer:{sampleId:writing.data.submission.id}});assert.equal(next.status,200);assert.equal(next.data.session.question.task.language,lang);
 const finish=await call('/assessments/'+s.id+'?language='+lang,'PUT',{index:46,answer:null});assert.equal(finish.status,200);assert.equal(finish.data.session.result.language,lang);assert.equal(finish.data.session.result.level,'C1');
 const history=await call('/assessments?language='+lang);assert.equal(history.data.history.length,1);assert.equal(history.data.history[0].result.productions.length,1);
 const id=lang+'-a1-core-checkpoint',seed='v1-multi-save-123456789',lesson=getLessonVariant(id,seed);
 assert.equal((await call('/learning/'+id,'PUT',{answers:[lesson.questions[0].answer],seed})).status,200);
 assert.equal((await call('/learning')).data.drafts.find(d=>d.lesson===id).seed,seed);
 const completed=await call('/practice','POST',{lesson:id,answers:lesson.questions.map(q=>q.answer),seed,submissionKey:'lesson-'+lang+'-123456789'});assert.equal(completed.status,201);assert.equal(completed.data.attempt.score,100);
 }
 const spanish=await call('/assessments');assert.equal(spanish.data.history.length,0);assert.equal(spanish.data.active.id,sessions.es.id);assert.equal(spanish.data.active.index,0);
 const p=await call('/practice');assert.equal(p.data.attempts.length,3);assert.equal(new Set(p.data.attempts.map(a=>a.lesson.slice(0,2))).size,3);
 console.log('PASS: four simultaneous independent language tests; writing attached to correct test; server scoring; language-isolated histories; saved multilingual drafts and lessons; Spanish active test preserved.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
