import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {testServer,db} from './test-server.mjs';
import {classPractice} from './class-practice.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,person){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(person?{cookie:person.cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
const ok=(r,status=200)=>{assert.equal(r.status,status,JSON.stringify(r.data));return r.data};
const key=()=>crypto.randomUUID();
const when=hours=>new Date(Date.now()+hours*3600000).toISOString();
try{
 async function account(name,role='learner'){const r=await call('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-test-password',role,adult:true});ok(r);return {...r,id:r.data.user.id,role};}
 const l=await account('CycleLearner'),l2=await account('SecondLearner'),t=await account('CycleTeacher','teacher'),t2=await account('OtherTeacher','teacher'),stranger=await account('UnconnectedTeacher','teacher'),owner=await account('CycleOwner');process.env.CONTINUUM_OWNER_USER_ID=owner.id;
 const path='/classroom';
 assert.equal((await call(path)).status,401);
 async function connect(teacher,learner,language){const code=ok(await call('/share-code','POST',{language},learner),201).code;ok(await call('/teacher/connect','POST',{code},teacher));}
 await connect(t,l,'en');await connect(t,l,'pt');await connect(t,l2,'en');await connect(t2,l,'en');
 const init=(teacher,learner,language)=>call(path+'/threads','POST',{otherId:teacher.id,language},learner);
 const en=ok(await init(t,l,'en')).threadId,pt=ok(await init(t,l,'pt')).threadId,en2=ok(await init(t,l2,'en')).threadId,other=ok(await init(t2,l,'en')).threadId;
 assert.equal(ok(await init(t,l,'en')).threadId,en);
 assert.equal((await init(stranger,l,'en')).status,403);assert.equal((await init(t,l,'ja')).status,403);
 let data=ok(await call(path+'?language=en','GET',null,t));assert.equal(data.connections.length,2);assert.ok(data.threads.every(x=>x.language==='en'));assert.equal(data.rules.paymentsEnabled,false);
 const message={body:'Hello!\nCould we practise the past perfect? <script>never HTML</script>',clientKey:key()};ok(await call(path+'/threads/'+en+'/messages','POST',message,l));ok(await call(path+'/threads/'+en+'/messages','POST',message,l));assert.equal(ok(await call(path+'/threads/'+en+'/messages','GET',null,t)).messages.length,1);assert.equal((await call(path+'/threads/'+en+'/messages','POST',{...message,body:'changed'},l)).status,409);
 assert.equal((await call(path+'/threads/'+en+'/messages','GET',null,t2)).status,404);assert.equal((await call(path+'/threads/'+en+'/messages','GET',null,l2)).status,404);assert.equal((await call(path+'/threads/'+pt+'/messages','GET',null,t2)).status,404);
 assert.equal(ok(await call(path+'/summary','GET',null,t)).unread,1);ok(await call(path+'/threads/'+en+'/read','POST',{},t));assert.equal(ok(await call(path+'/summary','GET',null,t)).unread,0);
 function proposal(threadId,hours=2){return {threadId,startsAt:when(hours),duration:50,timezone:'Asia/Kuala_Lumpur',topic:'Past perfect in conversation',clientKey:key()};}
 let p=proposal(en),b=ok(await call(path+'/bookings','POST',p,l),201).booking;assert.equal(ok(await call(path+'/bookings','POST',p,l),201).booking.id,b.id);assert.equal((await call(path+'/bookings','POST',{...p,topic:'other'},l)).status,409);
 assert.equal((await call(path+'/bookings','POST',{...proposal(en),priceMinor:1000},l)).status,400);
 const status=(b,next,person,extra={})=>call(path+'/bookings/'+b.id+'/status','PUT',{status:next,revision:b.revision,...extra},person);
 assert.equal((await status(b,'confirmed',l)).status,409);b=ok(await status(b,'confirmed',t)).booking;assert.equal(b.status,'confirmed');assert.match(b.meetingUrl,/^https:\/\/meet\.jit\.si\/Continuum-[a-f0-9-]{36}$/);const autoRoom=b.meetingUrl;assert.equal(ok(await call(path+'/bookings/'+b.id,'GET',null,l)).booking.meetingUrl,autoRoom);
 assert.equal((await call(path+'/bookings/'+b.id+'/meeting','PUT',{revision:b.revision,meetingUrl:'https://meet.google.com/abc-defg-hij'},l)).status,403);
 assert.equal((await call(path+'/bookings/'+b.id+'/meeting','PUT',{revision:b.revision,meetingUrl:'javascript:alert(1)'},t)).status,400);
 b=ok(await call(path+'/bookings/'+b.id+'/meeting','PUT',{revision:b.revision,meetingUrl:'https://meet.google.com/abc-defg-hij'},t)).booking;
 assert.equal((await call(path+'/bookings/'+b.id+'/meeting','PUT',{revision:b.revision,automatic:true},l)).status,403);
 const legacy=ok(await call(path+'/bookings','POST',proposal(en,15),l),201).booking;let legacyConfirmed=ok(await status(legacy,'confirmed',t)).booking;await db.query("UPDATE class_bookings SET meeting_url='' WHERE id=$1",[legacy.id]);legacyConfirmed=ok(await call(path+'/bookings/'+legacy.id+'/meeting','PUT',{revision:legacyConfirmed.revision,automatic:true},t)).booking;assert.match(legacyConfirmed.meetingUrl,/^https:\/\/meet\.jit\.si\/Continuum-/);assert.notEqual(legacyConfirmed.meetingUrl,autoRoom);
 assert.equal(ok(await call(path+'/bookings/'+b.id,'GET',null,l)).booking.meetingUrl,'https://meet.google.com/abc-defg-hij');assert.equal((await call(path+'/bookings/'+b.id,'GET',null,t2)).status,404);
 assert.equal((await call(path+'/bookings','POST',{...proposal(en2),startsAt:b.startsAt},t)).status,403);assert.equal((await call(path+'/bookings','POST',{...proposal(other),startsAt:b.startsAt},l)).status,409);
 // Two accepted proposals cannot double-book a teacher even when confirmed together.
 const stamp=when(5),raceA=ok(await call(path+'/bookings','POST',{...proposal(en,5),startsAt:stamp},l),201).booking,raceB=ok(await call(path+'/bookings','POST',{...proposal(en2,5),startsAt:stamp},l2),201).booking;
 const raced=await Promise.all([status(raceA,'confirmed',t),status(raceB,'confirmed',t)]);assert.deepEqual(raced.map(r=>r.status).sort(),[200,409]);
 assert.equal((await call(path+'/bookings','POST',proposal(en,12),t)).status,403);assert.equal((await call(path+'/bookings','POST',{...proposal(en,12),replacesId:b.id},t)).status,403);
 // A reschedule keeps the original until the recipient accepts the new time.
 const replacement=ok(await call(path+'/bookings','POST',{...proposal(en,3),replacesId:b.id},l),201).booking;assert.equal(ok(await call(path+'/bookings/'+b.id,'GET',null,l)).booking.status,'confirmed');const moved=ok(await status(replacement,'confirmed',t)).booking;assert.equal(ok(await call(path+'/bookings/'+b.id,'GET',null,l)).booking.status,'cancelled');
 assert.notEqual(moved.meetingUrl,autoRoom);assert.equal((await status(moved,'completed',t)).status,409);
 await db.query("UPDATE class_bookings SET starts_at=now()-interval '1 hour',ends_at=now()-interval '10 minutes' WHERE id=$1",[moved.id]);const done=ok(await status(moved,'completed',t)).booking;assert.equal(done.status,'completed');
 const noteBody={bookingId:done.id,focus:'Past perfect',note:'Practise describing what had happened before a later event.',clientKey:key()};const note=ok(await call(path+'/threads/'+en+'/notes','POST',noteBody,t)).note;assert.equal(ok(await call(path+'/threads/'+en+'/notes','POST',noteBody,t)).note.id,note.id);assert.equal((await call(path+'/threads/'+en+'/notes','POST',noteBody,l)).status,403);
 ok(await call(path+'/notes/'+note.id,'PUT',{revision:note.revision,focus:'Past perfect',note:'Use had plus the past participle when the earlier event matters.'},t));assert.equal((await call(path+'/notes/'+note.id,'PUT',{revision:0,focus:'Past perfect',note:'stale edit'},t)).status,409);assert.equal((await call(path+'/notes/'+note.id,'PUT',{revision:1,focus:'Past perfect',note:'someone else edit'},t2)).status,404);
 const assignmentBody={threadId:en,bookingId:done.id,title:'Past perfect',instructions:'Explain what you had done before you moved. Practise the past perfect tense.',clientKey:key()};let assignment=ok(await call(path+'/assignments','POST',assignmentBody,t),201).assignment;assert.equal(assignment.lessonId,'en-b1-v2-lesson-6');assert.equal(ok(await call(path+'/assignments','POST',assignmentBody,t),201).assignment.id,assignment.id);assert.equal((await call(path+'/assignments','POST',{...assignmentBody,clientKey:key()},l)).status,403);
 assert.equal((await call(path+'/assignments','POST',{...assignmentBody,clientKey:key(),lessonId:'pt-a2-v2-lesson-1'},t)).status,400);
 const savedNotes=ok(await call('/notes','GET',null,l)).notes;assert.equal(classPractice(savedNotes,'en').lesson.id,'en-b1-v2-lesson-6');
 const result=await db.query("INSERT INTO practice_attempts(user_id,lesson_id,score,total,source) VALUES($1,$2,90,10,'exercise') RETURNING id",[l.id,assignment.lessonId]);
 assert.equal((await call(path+'/assignments/'+assignment.id+'/submit','PUT',{revision:0,response:'I had studied English before I moved.'},l2)).status,404);
 assignment=ok(await call(path+'/assignments/'+assignment.id+'/submit','PUT',{revision:0,response:'I had studied English before I moved.',practiceAttemptId:result.rows[0].id},l)).assignment;assert.equal(assignment.status,'submitted');assert.equal(assignment.practice.score,90);
 ok(await call('/privacy','PUT',{shareSelfLearning:false},l));const hidden=ok(await call(path,'GET',null,t)).assignments[0];assert.equal(hidden.practice,null);assert.equal(hidden.response,'I had studied English before I moved.');assert.ok(!JSON.stringify(hidden).includes('"score":90'));
 assert.equal((await call(path+'/assignments/'+assignment.id+'/review','PUT',{revision:1,feedback:'Great use of the earlier past event.'},t2)).status,404);assignment=ok(await call(path+'/assignments/'+assignment.id+'/review','PUT',{revision:1,feedback:'Clear sequence. Add one more example using had already finished.'},t)).assignment;assert.equal(assignment.status,'reviewed');assert.equal(ok(await call(path,'GET',null,l)).assignments[0].feedback,assignment.feedback);
 // An approved directory contact requires explicit language-specific consent.
 await db.query("INSERT INTO teacher_profiles(user_id,data,status) VALUES($1,$2::jsonb,'approved')",[stranger.id,JSON.stringify({languages:['ja'],name:'A reviewed teacher'})]);assert.equal((await call(path+'/connect','POST',{teacherId:stranger.id,language:'ja'},l)).status,400);ok(await call(path+'/connect','POST',{teacherId:stranger.id,language:'ja',consent:true},l));assert.equal((await call(path+'/connect','POST',{teacherId:stranger.id,language:'en',consent:true},l)).status,404);
 assert.equal((await call(path+'/admin','GET',null,l)).status,403);const admin=ok(await call(path+'/admin','GET',null,owner));assert.equal(admin.rules.paymentsEnabled,false);assert.ok(admin.bookings.every(b=>!b.meetingUrl));assert.ok(admin.events.some(e=>e.kind==='assignment_reviewed'));
 const cancellable=ok(await call(path+'/bookings','POST',proposal(en,9),l),201).booking;ok(await call(path+'/admin/bookings/'+cancellable.id+'/cancel','POST',{reason:'Pilot session rescheduled by support.'},owner));assert.equal(ok(await call(path+'/bookings/'+cancellable.id,'GET',null,l)).booking.status,'cancelled');
 const revoked=ok(await call(path+'/bookings','POST',proposal(en,10),l),201).booking;ok(await call('/learner/teachers/'+t.id,'PUT',{languages:['pt']},l));assert.equal(ok(await call(path+'/bookings/'+revoked.id,'GET',null,l)).booking.status,'cancelled');assert.equal((await call(path+'/threads/'+en+'/messages','GET',null,t)).status,403);assert.equal((await call(path+'/threads/'+en+'/messages','POST',{body:'no access',clientKey:key()},l)).status,403);assert.equal(ok(await call(path+'/threads/'+en+'/messages','GET',null,l)).active,false);assert.ok(ok(await call(path,'GET',null,t)).assignments.every(a=>a.language!=='en'||a.learnerId!==l.id));
 assert.equal((await call(path+'/bookings/------------------------------------','GET',null,l)).status,404);
 console.log('PASS: teacher/learner language scope, private chat, unread state, idempotency, mutual scheduling, conflict races, rescheduling, meeting links, class notes, assignment → practice → submission → feedback, privacy revocation, pilot admin cancellation and audit. All data is disposable.');
}finally{delete process.env.CONTINUUM_OWNER_USER_ID;await new Promise(r=>testServer.close(r));await db.close();}
