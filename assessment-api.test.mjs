import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {assessmentItems} from './assessment-bank.mjs';
import {migrateAssessments} from './assessment-api.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}}
async function account(name,role='learner'){const r=await call('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-test-password',role,adult:true});assert.equal(r.status,200);return r}
try{
 const a=await account('PlacementOne'),b=await account('PlacementTwo'),t=await account('PlacementTeacher','teacher');
 assert.equal((await call('/assessments')).status,401);
 assert.equal((await call('/assessments','POST',{},t.cookie)).status,403);
 let start=await call('/assessments','POST',{},a.cookie),s=start.data.session;
 assert.equal(start.status,200);assert.equal(s.kind,'placement');assert.equal(s.total,47);assert.equal('answer' in s.question,false);
 assert.equal((await call('/assessments','POST',{},a.cookie)).data.session.id,s.id);
 assert.equal((await call('/assessments/'+s.id,'PUT',{index:0,answer:0},b.cookie)).status,404);
 assert.equal((await call('/assessments/'+s.id,'PUT',{index:0,answer:99},a.cookie)).status,400);
 assert.equal((await call('/assessments/'+s.id,'PUT',{index:2,answer:0},a.cookie)).status,409);
 const keys=assessmentItems(s.form,s.version).map(q=>q.answer);
 for(let index=0;index<47;index++){
  const r=await call('/assessments/'+s.id,'PUT',{index,answer:keys[index]??null,score:0,level:'A1'},a.cookie);assert.equal(r.status,200);s=r.data.session;
  if(index===0){assert.equal((await call('/assessments','GET',null,a.cookie)).data.active.index,1);assert.equal((await call('/assessments','GET',null,a.cookie)).data.history.length,0);assert.equal((await call('/assessments/'+s.id,'PUT',{index:0,answer:keys[0]},a.cookie)).status,200);assert.equal((await call('/assessments/'+s.id,'PUT',{index:0,answer:(keys[0]+1)%4},a.cookie)).status,409);}
 }
 assert.equal(s.result.level,'C1');assert.equal(s.result.correct,45);assert.equal(s.result.overallCefr,null);
 assert.equal((await call('/assessments/'+s.id,'PUT',{index:29,answer:keys[29]},a.cookie)).data.session.id,s.id);
 let history=(await call('/assessments','GET',null,a.cookie)).data;assert.equal(history.history.length,1);assert.equal(history.active,null);
 assert.equal((await call('/assessments','GET',null,b.cookie)).data.history.length,0);
 const learner=a.data.user.id;
 assert.equal((await call('/teacher/learners/'+learner,'GET',null,t.cookie)).status,403);
 const share=await call('/share-code','POST',{},a.cookie);await call('/teacher/connect','POST',{code:share.data.code},t.cookie);
 assert.equal((await call('/teacher/learners/'+learner,'GET',null,t.cookie)).data.assessment.result.level,'C1');
 await call('/privacy','PUT',{shareSelfLearning:false},a.cookie);
 assert.equal((await call('/teacher/learners/'+learner,'GET',null,t.cookie)).data.assessment,null);
 assert.equal((await call('/assessments','GET',null,a.cookie)).data.history.length,1);
 await call('/teacher/learners/'+learner+'/notes','POST',{focus:'Reading',note:'Synthetic class note remains shared.'},t.cookie);
 assert.equal((await call('/teacher/learners/'+learner+'/notes','GET',null,t.cookie)).data.notes.length,1);
 const second=(await call('/assessments','POST',{},a.cookie)).data.session;assert.equal(second.kind,'reassessment');assert.notEqual(second.form,s.form);
 assert.equal((await call('/assessments','GET',null,a.cookie)).data.history[0].result.level,'C1');
 for(let index=0;index<47;index++)assert.equal((await call('/assessments/'+second.id,'PUT',{index,answer:null},a.cookie)).status,200);
 history=(await call('/assessments','GET',null,a.cookie)).data;assert.equal(history.history.length,2);assert.equal(history.history[0].result.level,'Below A1');assert.equal(history.history[1].result.level,'C1');
 await call('/privacy','PUT',{shareSelfLearning:true},a.cookie);
 assert.equal((await call('/teacher/learners/'+learner,'GET',null,t.cookie)).data.assessment.result.level,'Below A1');
 await call('/practice','POST',{lesson:'subjunctive',answers:[1,1,1,1,1]},a.cookie);
 assert.equal((await call('/assessments','GET',null,a.cookie)).data.history[0].result.level,'Below A1');
 await db.exec('ALTER TABLE assessments DROP CONSTRAINT assessments_form_check; ALTER TABLE assessments ADD CONSTRAINT assessments_form_check CHECK(form IN (0,1));');
 await migrateAssessments({query:s=>db.exec(s)});await migrateAssessments({query:s=>db.exec(s)});
 const third=(await call('/assessments','POST',{},a.cookie)).data.session;
 assert.equal(third.form,2);assert.equal(third.total,47);
 assert.equal((await call('/assessments','POST',{},a.cookie)).data.session.id,third.id);
 const thirdKeys=assessmentItems(2,third.version).map(q=>q.answer);
 for(let index=0;index<47;index++)assert.equal((await call('/assessments/'+third.id,'PUT',{index,answer:thirdKeys[index]??null},a.cookie)).status,200);
 const thirdHistory=(await call('/assessments','GET',null,a.cookie)).data.history;
 assert.equal(thirdHistory[0].result.correct,45);assert.equal(thirdHistory.length,3);
 const fourth=(await call('/assessments','POST',{},a.cookie)).data.session;assert.equal(fourth.form,3);
 for(let index=0;index<47;index++)assert.equal((await call('/assessments/'+fourth.id,'PUT',{index,answer:null},a.cookie)).status,200);
 assert.equal((await call('/assessments','POST',{},a.cookie)).data.session.form,0);
 // An existing v2 session remains resumable and keeps its own answer key.
 const oldUser=await account('LegacyPlacement');
 const old=(await db.query("INSERT INTO assessments(user_id,kind,version,form,language) VALUES($1,'placement','en-diagnostic-2',2,'en') RETURNING id",[oldUser.data.user.id])).rows[0];
 const resume=(await call('/assessments?language=en','POST',{},oldUser.cookie)).data.session;assert.equal(resume.id,old.id);assert.equal(resume.version,'en-diagnostic-2');
 const oldKeys=assessmentItems(2,'en-diagnostic-2').map(q=>q.answer);
 for(let index=0;index<47;index++)assert.equal((await call('/assessments/'+old.id+'?language=en','PUT',{index,answer:oldKeys[index]??null},oldUser.cookie)).status,200);
 const afterOld=(await call('/assessments?language=en','POST',{},oldUser.cookie)).data.session;assert.equal(afterOld.version,'en-diagnostic-3');assert.equal(afterOld.form,0);
 console.log('PASS: placement, reassessment downgrade, saved resume, server scoring, retries, ownership, teacher privacy, notes preserved, lesson/assessment separation.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
