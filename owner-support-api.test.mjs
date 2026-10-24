import assert from 'node:assert/strict';
import {platformFeatures,controlledFeatures} from './platform-controls.mjs';
import {migrateOwner} from './owner-api.mjs';
import {migrateSupport} from './support-api.mjs';
import {premiumCourses} from './premium-courses.mjs';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;delete process.env.STRIPE_SECRET_KEY;
const {testServer,db}=await import('./test-server.mjs');const base='http://127.0.0.1:'+testServer.address().port,realFetch=globalThis.fetch;
async function api(path,method='GET',body,person){const r=await realFetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(person?{cookie:person.cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function register(name,role='learner'){const r=await api('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-owner-password',role,adult:true});assert.equal(r.status,200);return {...r.data.user,cookie:r.cookie};}
try{
 const owner=await register('Owner'),learner=await register('Learner'),teacher=await register('Teacher','teacher'),other=await register('Other'),reviewer=await register('Reviewer');process.env.CONTINUUM_OWNER_USER_ID=owner.id;
 await db.query('INSERT INTO platform_reviewers(user_id) VALUES($1)',[reviewer.id]);
 await db.query("INSERT INTO owner_membership_preview(user_id,mode) VALUES($1,'premium')",[owner.id]);
 await db.query("INSERT INTO billing_memberships(user_id,customer_id,status,paid_until,price_id,cancel_at_period_end) VALUES($1,'cus_owner_qa','active',now()+interval '1 day','price_owner_month',true)",[learner.id]);
 await db.query("INSERT INTO premium_invitations(code_hash,hint,recipient_email,label,created_by,claim_expires_at,duration_days,redeemed_by,redeemed_at,access_until) VALUES('owner-invite-sentinel','test',$1,'Synthetic teacher grant',$2,NULL,NULL,$3,now(),NULL)",[teacher.email,owner.id,teacher.id]);
 process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID='price_owner_month';
 // Owner data is not granted to teachers, learners or delegated profile reviewers.
 for(const path of ['/owner/overview','/owner/users','/owner/settings','/owner/catalog','/owner/audit','/owner/users/'+learner.id]){
  assert.equal((await api(path)).status,401,path);for(const p of [learner,teacher,reviewer])assert.equal((await api(path,'GET',null,p)).status,403,path);
  assert.equal((await api(path,'GET',null,owner)).status,200,path);
 }
 const directory=(await api('/owner/users','GET',null,owner)).data;
 assert.equal(directory.total,5);assert.equal(directory.users.find(u=>u.id===owner.id).tier,'free','owner preview is never a subscription');assert.equal(directory.users.find(u=>u.id===learner.id).tier,'premium');assert.equal(directory.users.find(u=>u.id===learner.id).interval,'month');assert.equal(directory.users.find(u=>u.id===teacher.id).source,'invitation');
 assert.ok(!JSON.stringify(directory).includes('password_hash'));assert.ok(!JSON.stringify(directory).includes('cus_owner_qa'));
 assert.equal((await api('/owner/users?role=teacher&plan=premium','GET',null,owner)).data.total,1);
 assert.equal((await api('/owner/users?q='+encodeURIComponent("' OR true --"),'GET',null,owner)).data.total,0);
 const details=(await api('/owner/users/'+learner.id,'GET',null,owner)).data;assert.equal(details.membership.premium,true);assert.equal(details.membership.cancelAtPeriodEnd,true);
 assert.equal((await api('/owner/users/'+owner.id,'GET',null,owner)).data.membership.premium,false);
 await db.query("INSERT INTO billing_blocks(charge_id,user_id,blocked,reason) VALUES('charge_owner_qa',$1,true,'Synthetic review')",[learner.id]);
 assert.equal((await api('/owner/users?plan=free','GET',null,owner)).data.users.find(u=>u.id===learner.id).tier,'free');await db.query("DELETE FROM billing_blocks WHERE charge_id='charge_owner_qa'");
 assert.equal((await api('/owner/users?role=admin','GET',null,owner)).status,400);
 // Provider refresh is read-only externally and is audited atomically.
 assert.equal((await api('/owner/users/'+learner.id+'/sync','POST',{},owner)).status,503);
 process.env.STRIPE_SECRET_KEY='sk_test_owner_synthetic';let stripeReads=0;
 globalThis.fetch=async(url,options)=>{if(String(url).startsWith('https://api.stripe.com/')){assert.equal(options.method,'GET');stripeReads++;return Response.json({object:'list',has_more:false,data:[{id:'sub_owner_qa',status:'active',created:100,items:{data:[{price:{id:'price_owner_month'},current_period_end:Math.floor(Date.now()/1000)+86400}]},latest_invoice:{id:'in_owner_qa',status:'paid',amount_paid:1234,currency:'usd'},cancel_at_period_end:true}]});}return realFetch(url,options)};
 assert.equal((await api('/owner/users/'+learner.id+'/sync','POST',{},owner)).status,200);assert.equal(stripeReads,1);globalThis.fetch=realFetch;delete process.env.STRIPE_SECRET_KEY;
 // Additive migrations are repeatable and preserve existing membership data.
 await migrateOwner({query:sql=>db.exec(sql)});await migrateSupport({query:sql=>db.exec(sql)});assert.equal((await api('/owner/users/'+learner.id,'GET',null,owner)).data.membership.premium,true);
 const settings=async key=>(await api('/owner/settings','GET',null,owner)).data.features.find(f=>f.key===key);
 const change=async(key,enabled)=>{const f=await settings(key);const r=await api('/owner/settings','PUT',{key,enabled,revision:f.revision,reason:'Synthetic maintenance test'},owner);assert.equal(r.status,200);return f;};
 const routes={registration:['/auth/register','POST',{}],selfStudy:['/learning/introductions','PUT',{answers:[]}],assessments:['/assessments?language=en','POST',{}],aiConversation:['/speaking','POST',{}],exclusiveCourses:['/billing/courses/en-workplace-diplomacy','GET'],review:['/review?language=en','GET'],focusedPractice:['/skills','POST',{task:'focus-en-interview-speaking'}],bookings:['/classroom/bookings','POST',{}],teacherApplications:['/profile','PUT',{}],teacherDirectory:['/teachers','GET'],studioAudio:['/speech','POST',{}],checkout:['/billing/checkout','POST',{}]};
 for(const f of platformFeatures){const before=await change(f.key,false),[path,method,data]=routes[f.key];const who=f.key==='teacherApplications'?teacher:learner;assert.equal((await api(path,method,data,who)).status,503,f.key);
  assert.equal((await api('/health')).status,200);assert.equal((await api('/auth/me','GET',null,who)).status,200);assert.equal((await api('/support','GET',null,who)).status,200);
  assert.equal((await api('/owner/settings','PUT',{key:f.key,enabled:true,revision:before.revision,reason:'Stale change'},owner)).status,409);
  assert.equal((await api('/owner/settings','PUT',{key:f.key,enabled:true,revision:(await settings(f.key)).revision,reason:'Forbidden change'},reviewer)).status,403);
  if(f.key==='focusedPractice')assert.notEqual((await api('/skills','POST',{task:'writing-a1'},learner)).status,503,'focused practice does not gate core skill tasks');
  if(f.key==='selfStudy'){assert.equal((await api('/learning/introductions','PUT',{answers:[]},owner)).status,200);assert.equal((await api('/practice','GET',null,learner)).status,200);}
  if(f.key==='teacherApplications')assert.equal((await api('/profile','PUT',{profile:{name:'Learner',languages:['en'],primaryLanguage:'en',startMode:'manual',level:'A1',goal:'Test'}},learner)).status,200);
  if(f.key==='exclusiveCourses'){assert.equal((await api('/billing/courses/en-workplace-diplomacy/audio?gallery=0','GET',null,learner)).status,503);const c=premiumCourses.find(c=>c.id==='en-workplace-diplomacy');assert.equal((await api('/billing/courses/'+c.id+'/finish','POST',{answers:c.questions.map(q=>q.answer),key:crypto.randomUUID()},learner)).status,200);}
  await change(f.key,true);
 }
 assert.ok(controlledFeatures('/api/billing/webhook','POST').length===0);assert.deepEqual(controlledFeatures('/api/billing/portal','POST'),[]);assert.deepEqual(controlledFeatures('/api/classroom/bookings/abc/status','PUT'),[]);assert.deepEqual(controlledFeatures('/api/billing/courses/test/audio','GET').sort(),['exclusiveCourses','studioAudio']);
 // Private two-way contact conversations, ownership, idempotency and read cursors.
 const created={subject:'Subscription question',category:'billing',body:'Please explain my plan. <script>not executable</script>',key:crypto.randomUUID()};
 const a=await api('/support','POST',created,learner);assert.equal(a.status,201);const id=a.data.id;assert.equal((await api('/support','POST',created,learner)).data.id,id);assert.equal((await api('/support','POST',{...created,body:'Changed'},learner)).status,409);
 const teacherTicket=await api('/support','POST',{subject:'Teacher schedule help',category:'teaching',body:'I need help with availability.',key:crypto.randomUUID()},teacher);assert.equal(teacherTicket.status,201);
 assert.equal((await api('/support','GET',null,learner)).data.total,1);assert.equal((await api('/support?role=teacher','GET',null,owner)).data.total,1);assert.equal((await api('/support/'+id,'GET',null,other)).status,404);assert.equal((await api('/support/'+id+'/read','POST',{lastSeq:999999},other)).status,404);
 assert.equal((await api('/support/summary','GET',null,owner)).data.unread,2);
 let thread=(await api('/support/'+id,'GET',null,owner)).data;const firstSeq=thread.messages.at(-1).seq;
 const reply={body:'Your plan details are available in Account.',key:crypto.randomUUID(),revision:thread.ticket.revision};assert.equal((await api('/support/'+id+'/messages','POST',reply,owner)).status,200);assert.equal((await api('/support/'+id+'/messages','POST',reply,owner)).status,200);assert.equal((await api('/support/'+id+'/messages','POST',{...reply,body:'Different'},owner)).status,409);
 thread=(await api('/support/'+id,'GET',null,learner)).data;assert.equal(thread.messages.length,2);assert.equal(thread.ticket.status,'waiting');assert.equal((await api('/support/'+id,'PUT',{status:'resolved',revision:thread.ticket.revision},learner)).status,403);
 const follow=await api('/support/'+id+'/messages','POST',{body:'Thank you. One more question.',key:crypto.randomUUID(),revision:thread.ticket.revision},learner);assert.equal(follow.status,200);
 await api('/support/'+id+'/read','POST',{lastSeq:firstSeq},owner);assert.equal((await api('/support/summary','GET',null,owner)).data.unread,2,'new unseen message is not swallowed by an older read cursor');
 thread=(await api('/support/'+id,'GET',null,owner)).data;await api('/support/'+id+'/read','POST',{lastSeq:thread.messages.at(-1).seq},owner);assert.equal((await api('/support/summary','GET',null,owner)).data.unread,1);
 const raceBody={body:'A single retried message.',key:crypto.randomUUID(),revision:thread.ticket.revision};const race=await Promise.all([api('/support/'+id+'/messages','POST',raceBody,learner),api('/support/'+id+'/messages','POST',raceBody,learner)]);assert.deepEqual(race.map(r=>r.status),[200,200]);
 thread=(await api('/support/'+id,'GET',null,owner)).data;assert.equal(thread.messages.length,4);assert.equal((await api('/support/'+id,'PUT',{status:'resolved',revision:thread.ticket.revision},owner)).status,200);
 thread=(await api('/support/'+id,'GET',null,learner)).data;assert.equal((await api('/support/'+id+'/messages','POST',{body:'Reopening with a new detail.',key:crypto.randomUUID(),revision:thread.ticket.revision},learner)).status,200);thread=(await api('/support/'+id,'GET',null,owner)).data;assert.equal(thread.ticket.status,'open');
 for(let i=0;i<48;i++){const r=await api('/support/'+id+'/messages','POST',{body:'History message '+i,key:crypto.randomUUID(),revision:thread.ticket.revision},learner);assert.equal(r.status,200);thread.ticket.revision++;}
 thread=(await api('/support/'+id,'GET',null,owner)).data;assert.equal(thread.messages.length,50);assert.ok(thread.nextBefore);const older=(await api('/support/'+id+'?before='+thread.nextBefore,'GET',null,owner)).data;assert.equal(older.messages.length,3);assert.ok(!older.messages.some(m=>thread.messages.some(n=>m.id===n.id)));
 const audit=(await api('/owner/audit','GET',null,owner)).data.events;assert.ok(audit.some(e=>e.kind==='support_replied'));assert.ok(audit.some(e=>e.kind==='subscription_synced'));assert.ok(audit.some(e=>e.kind==='service_paused'));assert.ok(!JSON.stringify(audit).includes('not executable'));
 const summary=(await api('/owner/overview','GET',null,owner)).data;assert.equal(summary.contacts.reduce((n,r)=>n+r.count,0),2);assert.equal(summary.accounts.reduce((n,r)=>n+r.count,0),5);
 console.log('PASS: strict owner/reviewer isolation; actual learner/teacher plans; read-only Stripe synchronization; all 12 service controls; additive migration; private support, read races, duplicate protection, reopening, pagination and audit.');
}finally{globalThis.fetch=realFetch;delete process.env.CONTINUUM_OWNER_USER_ID;delete process.env.STRIPE_SECRET_KEY;delete process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID;await new Promise(r=>testServer.close(r));await db.close()}
