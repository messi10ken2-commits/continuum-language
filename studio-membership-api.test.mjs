import {skillTasks} from './skills-content.mjs';
import {premiumCourses} from './premium-courses.mjs';
import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function account(name,role='learner'){const r=await api('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-studio-password',role,adult:true});assert.equal(r.status,200);return {...r.data.user,cookie:r.cookie};}
try{
 const learner=await account('StudioLearner'),teacher=await account('StudioTeacher','teacher'),stranger=await account('StudioStranger','teacher');
 await db.query("INSERT INTO teacher_links(teacher_id,learner_id,languages) VALUES($1,$2,ARRAY['en'])",[teacher.id,learner.id]);
 await db.query("INSERT INTO assessments(user_id,kind,version,form,language,result,completed_at) VALUES($1,'placement','fixture',0,'en',$2::jsonb,now())",[learner.id,JSON.stringify({level:'B1',language:'en',skills:[{name:'Listening',level:'A2'}],bands:[{level:'B1'}]})]);
 const task=skillTasks.find(t=>t.language==='en'&&t.skill==='Writing');const assessment=(await db.query('SELECT id FROM assessments WHERE user_id=$1',[learner.id])).rows[0].id;
 const saved=(await db.query("INSERT INTO skill_submissions(user_id,task_id,assessment_id,response,result,submission_key) VALUES($1,$2,$3,$4::jsonb,$5::jsonb,$6) RETURNING id",[learner.id,task.id,assessment,JSON.stringify('A synthetic response for assessment.'),JSON.stringify({status:'ai-reviewed',score:72,feedback:'A clear response.',criteria:['Structure'],ratings:[3],nextStep:'Private tailored advice',cefr:{level:'B1'}}),crypto.randomUUID()])).rows[0];
 const path='/teacher/learners/'+learner.id+'?language=en';
 let r=await api(path,'GET',null,teacher.cookie);assert.equal(r.status,200);assert.equal(r.data.membership.tier,'free');assert.ok(!r.data.assessment.result.skills);assert.equal((await api('/skills/'+saved.id,'GET',null,teacher.cookie)).data.submission.result.reviewTier,'basic');
 assert.equal((await api(path,'GET',null,stranger.cookie)).status,403);
 const billing=await api('/billing','GET',null,learner.cookie);assert.equal(billing.data.courses.length,90);assert.equal(billing.data.videoSources.length,5);assert.ok(!JSON.stringify(billing.data.videoSources).includes('"answer"'));
 for(const lang of ['en','es','pt','ja'])assert.equal(billing.data.courses.filter(c=>c.language===lang).length,9);
 for(const c of billing.data.courses)assert.equal((await api('/billing/courses/'+c.id,'GET',null,learner.cookie)).status,403);
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[learner.id]);
 r=await api(path,'GET',null,teacher.cookie);assert.equal(r.data.membership.tier,'premium');assert.ok(r.data.assessment.result.skills);assert.deepEqual((await api('/skills/'+saved.id,'GET',null,teacher.cookie)).data.submission.result.criteria,['Structure']);assert.equal((await api('/teacher/learners','GET',null,teacher.cookie)).data.learners[0].membership.tier,'premium');assert.ok(!JSON.stringify(r.data.membership).includes('customer'));
 // The owner's private preview must never mislabel the learner in a teacher's view.
 process.env.CONTINUUM_OWNER_USER_ID=learner.id;await api('/billing/access/preview','POST',{mode:'free'},learner.cookie);assert.equal((await api('/billing','GET',null,learner.cookie)).data.membership.premium,false);assert.equal((await api(path,'GET',null,teacher.cookie)).data.membership.tier,'premium');
 await api('/billing/access/preview','POST',{mode:'actual'},learner.cookie);
 for(const c of premiumCourses){for(const [i,q] of c.questions.entries()){const r=await api('/billing/courses/'+c.id+'/answer','POST',{question:i,answer:q.answer},learner.cookie);assert.equal(r.status,200,c.id);assert.equal(r.data.correct,true,c.id+':'+i);}const r=await api('/billing/courses/'+c.id+'/finish','POST',{answers:c.questions.map(q=>q.answer),key:crypto.randomUUID()},learner.cookie);assert.equal(r.status,200,c.id);assert.equal(r.data.correct,c.questions.length);}
 const course=billing.data.courses.find(c=>c.id==='ja-premium-housing-v1');const opened=await api('/billing/courses/'+course.id,'GET',null,learner.cookie);assert.equal(opened.data.course.questions.length,8);assert.ok(opened.data.course.questions.every(q=>!('answer' in q)&&!('acceptedAnswers' in q)&&!('note' in q)));
 const q=opened.data.course.questions[3];const ordered=[...q.tokens].reverse().join(q.separator);assert.equal((await api('/billing/courses/'+course.id+'/answer','POST',{question:3,answer:ordered},learner.cookie)).data.correct,true);
 await db.query("UPDATE billing_memberships SET status='cancelled' WHERE user_id=$1",[learner.id]);assert.equal((await api(path,'GET',null,teacher.cookie)).data.membership.tier,'free');assert.ok(!(await api(path,'GET',null,teacher.cookie)).data.assessment.result.skills);
 console.log('PASS: 28 gated courses, free video previews, server grading, actual teacher-visible membership, downgrade projection and teacher isolation. Synthetic accounts only.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
