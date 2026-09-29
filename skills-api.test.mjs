import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {assessmentItems,publicAssessment} from './assessment-bank.mjs';
import {skillTasks} from './skills-content.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}}
async function account(name,role='learner'){const r=await call('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-test-password',role,adult:true});assert.equal(r.status,200);return r;}
try{
 const a=await account('SkillsOne'),b=await account('SkillsTwo'),t=await account('SkillsTeacher','teacher');
 assert.equal((await call('/skills')).status,401);
 for(const task of skillTasks){let response=task.skill==='Listening'?task.questions.map(q=>q.answer):task.skill==='Writing'?'Hola, me gustaría cambiar la clase al lunes. ¿Sería posible?':{audio:'data:audio/webm;base64,'+Buffer.alloc(150,1).toString('base64'),seconds:15};const body={task:task.id,response,submissionKey:crypto.randomUUID()};const r=await call('/skills','POST',body,a.cookie);assert.equal(r.status,201,JSON.stringify(r.data));if(task.skill==='Listening')assert.equal(typeof r.data.submission.result.score,'number');else assert.equal(r.data.submission.result.score,null);assert.equal((await call('/skills','POST',body,a.cookie)).data.submission.id,r.data.submission.id);if(task.skill==='Writing'){
 assert.equal((await call('/skills/'+r.data.submission.id,'GET',null,b.cookie)).status,403);
 assert.equal((await call('/skills/'+r.data.submission.id+'/review','PUT',{ratings:[4,4,4,4],feedback:'Very clear response.'},a.cookie)).status,403);
 }}
 const list=await call('/skills','GET',null,a.cookie);assert.equal(list.data.submissions.length,15);assert.ok(list.data.submissions.every(s=>!('response' in s)));
 // Safari codec metadata and absent speech recognition must not prevent saving audio.
 const speaking=skillTasks.find(t=>t.skill==='Speaking');
 for(const mime of ['audio/mp4;codecs="mp4a.40.2"','audio/webm;codecs=opus','audio/mp4']){
 const response={audio:'data:'+mime+';base64,'+Buffer.alloc(150,1).toString('base64'),seconds:12};
 const saved=await call('/skills','POST',{task:speaking.id,response,submissionKey:crypto.randomUUID()},a.cookie);
 assert.equal(saved.status,201,JSON.stringify(saved.data));
 assert.equal(saved.data.submission.result.score,null);
 const restored=await call('/skills/'+saved.data.submission.id,'GET',null,a.cookie);
 assert.deepEqual(restored.data.submission.response,response);
 assert.ok((await call('/skills','GET',null,a.cookie)).data.submissions.some(s=>s.id===saved.data.submission.id));
 }
 const writing=list.data.submissions.find(s=>s.task.endsWith('writing'));
 assert.equal((await call('/skills/ai-status','GET',null,a.cookie)).data.available,false);
 assert.equal((await call('/skills/'+writing.id+'/assess','POST',{aiConsent:true},b.cookie)).status,403);
 assert.equal((await call('/skills/'+writing.id+'/assess','POST',{},a.cookie)).status,400);
 assert.equal((await call('/skills/'+writing.id+'/assess','POST',{aiConsent:true},a.cookie)).status,503);
 assert.equal((await call('/skills/'+writing.id,'GET',null,a.cookie)).status,200);
 // Successful AI assessment persists and retries reuse it without another provider charge.
 const originalFetch=globalThis.fetch;let providerCalls=0;
 process.env.OPENAI_API_KEY='isolated-test-key';
 globalThis.fetch=async(url,options)=>String(url).startsWith('https://api.openai.com/')?(providerCalls++,{ok:true,json:async()=>({output_text:JSON.stringify({assessable:true,ratings:[3,3,3,3],evidence:['a','b','c','d'],feedback:'Clear request.',nextStep:'Add a reason.',strengths:['Clear'],corrections:[],transcript:''})})}):originalFetch(url,options);
 try{
  const ai=await call('/skills/'+writing.id+'/assess','POST',{aiConsent:true},a.cookie);assert.equal(ai.status,200);assert.equal(ai.data.result.aiAssessment.score,75);
  assert.equal((await call('/skills/'+writing.id+'/assess','POST',{aiConsent:true},a.cookie)).status,200);assert.equal(providerCalls,1);
 }finally{globalThis.fetch=originalFetch;delete process.env.OPENAI_API_KEY;}


 assert.equal((await call('/skills/learner/'+a.data.user.id,'GET',null,t.cookie)).status,403);
 const share=await call('/share-code','POST',{},a.cookie);await call('/teacher/connect','POST',{code:share.data.code},t.cookie);
 assert.equal((await call('/skills/'+writing.id,'GET',null,t.cookie)).status,200);
 let r=await call('/skills/'+writing.id+'/review','PUT',{ratings:[3,3,2,3],feedback:'Your request is clear. Add a reason for the change.'},t.cookie);assert.equal(r.status,200);assert.equal(r.data.result.score,69);
 assert.equal((await call('/skills/'+writing.id+'/review','PUT',{ratings:[9,3,2,3],feedback:'invalid rating'},t.cookie)).status,400);
 await call('/privacy','PUT',{shareSelfLearning:false},a.cookie);
 assert.equal((await call('/skills/'+writing.id,'GET',null,t.cookie)).status,403);
 assert.equal((await call('/skills/learner/'+a.data.user.id,'GET',null,t.cookie)).status,403);
 assert.equal((await call('/skills/'+writing.id+'/review','PUT',{ratings:[4,4,4,4],feedback:'Unauthorized review'},t.cookie)).status,403);
 assert.equal((await call('/skills/'+writing.id,'GET',null,a.cookie)).status,200);
 let session=(await call('/assessments','POST',{},a.cookie)).data.session;
 const items=assessmentItems(session.form,session.version);assert.equal(items.length,45);
 for(let i=0;i<45;i++){const r=await call('/assessments/'+session.id,'PUT',{index:i,answer:items[i].answer},a.cookie);assert.equal(r.status,200,JSON.stringify(r.data));session=r.data.session;if(i===30){assert.equal(session.question.skill,'Listening');assert.ok(session.question.audio);assert.equal(session.question.answer,undefined);}}
 assert.equal(session.question.skill,'Writing');assert.equal(session.question.task.model,undefined);
 assert.equal(session.question.task.questions,undefined);
 assert.equal((await call('/assessments/'+session.id,'PUT',{index:45,answer:{sampleId:writing.id}},a.cookie)).status,400);
 const sw=await call('/skills','POST',{task:session.question.task.id,assessment:session.id,response:'Estimados señores: conviene comparar varios centros antes de atribuir el cambio a una sola medida.',submissionKey:crypto.randomUUID()},a.cookie);assert.equal(sw.status,201,JSON.stringify(sw.data));
 session=(await call('/assessments/'+session.id,'PUT',{index:45,answer:{sampleId:sw.data.submission.id}},a.cookie)).data.session;assert.equal(session.question.skill,'Speaking');
 assert.equal((await call('/skills','GET',null,a.cookie)).data.submissions[0].assessment,session.id);
 const sp=await call('/skills','POST',{task:session.question.task.id,assessment:session.id,response:{audio:'data:audio/mp4;base64,'+Buffer.alloc(150,1).toString('base64'),seconds:30},submissionKey:crypto.randomUUID()},a.cookie);assert.equal(sp.status,201);
 session=(await call('/assessments/'+session.id,'PUT',{index:46,answer:{sampleId:sp.data.submission.id}},a.cookie)).data.session;assert.equal(session.result.level,'C1');assert.equal(session.result.correct,45);assert.equal(session.result.productiveStatus.Speaking,'pending');assert.equal(session.result.overallCefr,null);
 assert.equal((await call('/assessments/'+session.id,'PUT',{index:46,answer:{sampleId:sp.data.submission.id}},a.cookie)).status,200);
 await call('/privacy','PUT',{shareSelfLearning:true},a.cookie);
 await call('/skills/'+sp.data.submission.id+'/review','PUT',{ratings:[3,3,3,3],feedback:'Clear structure; expand the counterargument with an example.'},t.cookie);
 const history=(await call('/assessments','GET',null,a.cookie)).data.history[0];assert.equal(history.result.productions.find(p=>p.task.endsWith('speaking')).result.score,75);
 const teacher=(await call('/teacher/learners/'+a.data.user.id,'GET',null,t.cookie)).data;assert.equal(teacher.assessment.result.productions.length,2);
 // Older, already-started tests remain completable with their original 30-question bank.
 const legacy=await db.query("INSERT INTO assessments(user_id,kind,version,form) VALUES($1,'placement','es-diagnostic-1',0) RETURNING *",[b.data.user.id]);assert.equal(publicAssessment(legacy.rows[0]).total,30);
 for(const [i,q] of assessmentItems(0).entries())assert.equal((await call('/assessments/'+legacy.rows[0].id,'PUT',{index:i,answer:q.answer},b.cookie)).status,200);
 console.log('PASS: 15 skill lessons, server listening scores, productive submissions, teacher rubric, privacy and ownership, 47-step test, retries, version-1 resume.');
}finally{await new Promise(r=>testServer.close(r));await db.close()}
