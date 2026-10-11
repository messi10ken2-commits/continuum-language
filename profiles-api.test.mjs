import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function account(name,role='learner'){const r=await call('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-test-password',role,adult:true});assert.equal(r.status,200);return {...r,id:r.data.user.id};}
try{
 const learner=await account('Learner'),teacher=await account('Teacher','teacher'),admin=await account('Reviewer'),other=await account('OtherLearner');
 assert.equal((await call('/profile')).status,401);
 assert.equal((await call('/profile','GET',null,learner.cookie)).data.profile,null);
 const learnerProfile={name:'Learner display',languages:['ja','en'],primaryLanguage:'ja',startMode:'assessment',level:'A1',goal:'Travel'};
 assert.equal((await call('/profile','PUT',{profile:learnerProfile},learner.cookie)).status,200);
 assert.deepEqual((await call('/profile','GET',null,learner.cookie)).data.profile,learnerProfile);
 assert.equal((await call('/profile','PUT',{profile:{...learnerProfile,primaryLanguage:'es'}},learner.cookie)).status,400);
 assert.equal((await call('/admin/teacher-profiles','GET',null,teacher.cookie)).status,403);
 const draft=await call('/profile','PUT',{revision:0,profile:{name:'Teacher',languages:['es']}},teacher.cookie);assert.equal(draft.status,200);assert.equal(draft.data.status,'draft');
 assert.equal((await call('/teachers')).data.teachers.length,0);
 assert.equal((await call('/teachers/'+teacher.id)).status,404);
 assert.equal((await call('/bookmarks/'+teacher.id,'PUT',{},learner.cookie)).status,404);
 const profile={name:'Teacher display',languages:['es','en'],headline:'Thoughtful Spanish and English lessons',bio:'I help adult learners grow in confidence through structured conversation, patient feedback and meaningful practice tailored to their goals.',experience:'I have taught adult learners in online and classroom environments for several years.',approach:'We combine practical situations with a clear explanation and a short review of your personal learning goals.',qualifications:'Language degree; no teaching certificate claimed.',credentialNotes:'Private review-only evidence',spokenLanguages:'Spanish C2, English C1',timezone:'Asia/Kuala_Lumpur',photo:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a7X8AAAAASUVORK5CYII=',video:'https://www.youtube.com/watch?v=abc123'};
 assert.equal((await call('/profile','PUT',{revision:1,submit:true,consent:true,profile:{...profile,video:'javascript:alert(1)'}},teacher.cookie)).status,400);
 assert.equal((await call('/profile','PUT',{revision:1,submit:true,profile},teacher.cookie)).status,400);
 let r=await call('/profile','PUT',{revision:1,submit:true,consent:true,profile},teacher.cookie);assert.equal(r.status,200);assert.equal(r.data.status,'pending');let revision=r.data.revision;
 assert.equal((await call('/teachers')).data.teachers.length,0);
 await db.query('INSERT INTO platform_reviewers(user_id) VALUES($1)',[admin.id]);
 assert.equal((await call('/profile','GET',null,admin.cookie)).data.reviewer,true);
 assert.equal((await call('/admin/teacher-profiles','GET',null,admin.cookie)).data.profiles[0].data.credentialNotes,profile.credentialNotes);
 assert.equal((await call('/admin/teacher-profiles/'+teacher.id,'PUT',{revision,decision:'approved',feedback:'Reviewed',checked:true},teacher.cookie)).status,403);
 assert.equal((await call('/admin/teacher-profiles/'+teacher.id,'PUT',{revision:999,decision:'approved',feedback:'Reviewed',checked:true},admin.cookie)).status,409);
 assert.equal((await call('/admin/teacher-profiles/'+teacher.id,'PUT',{revision,decision:'approved',feedback:'Profile reviewed; ready for publication.',checked:true},admin.cookie)).status,200);
 const list=(await call('/teachers?language=es')).data.teachers;assert.equal(list.length,1);assert.equal(list[0].profile.credentialNotes,undefined);assert.equal(list[0].email,undefined);assert.equal((await call('/teachers?language=ja')).data.teachers.length,0);
 assert.equal((await call('/bookmarks/'+teacher.id,'PUT',{},teacher.cookie)).status,403);
 assert.equal((await call('/bookmarks/'+teacher.id,'PUT',{},learner.cookie)).status,200);
 assert.equal((await call('/bookmarks/'+teacher.id,'PUT',{},learner.cookie)).status,200);
 assert.equal((await call('/bookmarks','GET',null,learner.cookie)).data.teachers.length,1);
 assert.equal((await call('/bookmarks','GET',null,other.cookie)).data.teachers.length,0);
 assert.equal((await db.query('SELECT * FROM teacher_links')).rows.length,0);
 r=await call('/profile','PUT',{revision,profile:{...profile,headline:'Updated teacher headline'}},teacher.cookie);assert.equal(r.status,200);assert.equal(r.data.status,'draft');revision=r.data.revision;
 assert.equal((await call('/teachers')).data.teachers.length,0);assert.equal((await call('/bookmarks','GET',null,learner.cookie)).data.teachers.length,0);
 assert.equal((await call('/profile','PUT',{revision:revision-1,profile},teacher.cookie)).status,409);
 r=await call('/profile','PUT',{revision,profile,submit:true,consent:true},teacher.cookie);assert.equal(r.status,200);revision=r.data.revision;
 assert.equal((await call('/admin/teacher-profiles/'+teacher.id,'PUT',{revision,decision:'changes_requested',feedback:'Please provide a clearer introduction video.'},admin.cookie)).status,200);
 assert.equal((await call('/profile','GET',null,teacher.cookie)).data.status,'changes_requested');
 assert.equal((await db.query('SELECT * FROM teacher_profile_reviews')).rows.length,2);
 assert.equal((await call('/bookmarks/'+teacher.id,'DELETE',null,learner.cookie)).status,200);
 console.log('PASS: learner setup, validation, private teacher drafts, review authorization, optimistic revisions, publication, private-field exclusion, bookmark isolation, re-review and review audit.');
}finally{testServer.closeAllConnections();await new Promise(r=>testServer.close(r));await db.close();}
