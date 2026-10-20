import assert from 'node:assert/strict';
import Stripe from 'stripe';
import {premiumCourses} from './premium-courses.mjs';
const originalFetch=globalThis.fetch;
Object.assign(process.env,{STRIPE_SECRET_KEY:'sk_test_synthetic_billing',STRIPE_WEBHOOK_SECRET:'whsec_synthetic_billing',STRIPE_PREMIUM_MONTHLY_PRICE_ID:'price_premium_month',BILLING_PUBLIC_URL:'https://example.test',BILLING_ENABLED:'true'});
const customers=new Map(),subscriptions=new Map(),sessions=new Map(),idem=new Map(),invoices=new Map(),charges=new Map();let calls=0,createCalls=0,failCheckout=false;
globalThis.fetch=async(input,options)=>{
 const u=new URL(String(input));if(u.hostname!=='api.stripe.com')return originalFetch(input,options);calls++;
 const form=new URLSearchParams(options.body?.toString()||''),path=u.pathname,header=new Headers(options.headers),key=header.get('Idempotency-Key');
 if(path==='/v1/customers'){const user=form.get('metadata[continuum_user]');if(!customers.has(user))customers.set(user,'cus_'+customers.size);return Response.json({id:customers.get(user),object:'customer'});}
 if(path.startsWith('/v1/prices/'))return Response.json({id:'price_premium_month',object:'price',active:true,type:'recurring',unit_amount:990,currency:'usd',recurring:{interval:'month'},livemode:false});
 if(path==='/v1/subscriptions')return Response.json({object:'list',data:subscriptions.get(u.searchParams.get('customer'))||[],has_more:false});
 if(path==='/v1/checkout/sessions'&&options.method==='POST'){
  if(failCheckout){failCheckout=false;return Response.json({error:{type:'invalid_request_error',message:'synthetic outage'}},{status:400});}
  if(!idem.has(key)){const id='cs_test_'+sessions.size;const session={id,object:'checkout.session',status:'open',customer:form.get('customer'),url:'https://checkout.stripe.com/c/pay/'+id};sessions.set(id,session);idem.set(key,session);createCalls++;}return Response.json(idem.get(key));
 }
 if(path.startsWith('/v1/checkout/sessions/'))return Response.json(sessions.get(path.split('/').at(-1)));
 if(path==='/v1/billing_portal/sessions')return Response.json({id:'bps_test',url:'https://billing.stripe.com/p/session/test'});
 if(path.startsWith('/v1/invoices/'))return Response.json(invoices.get(path.split('/').at(-1)));
 if(path.startsWith('/v1/charges/'))return Response.json(charges.get(path.split('/').at(-1)));
 if(path==='/v1/invoice_payments')return Response.json({object:'list',data:[{invoice:'in_first'}],has_more:false});
 throw Error('Unexpected synthetic Stripe endpoint '+path);
};
const {testServer,db}=await import('./test-server.mjs');const base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,cookie){const r=await originalFetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function register(name,role='learner'){const r=await api('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-password-123',role,adult:true});assert.equal(r.status,200);return {...r.data.user,cookie:r.cookie};}
let eventN=0;
async function webhook(type,object,eventId='evt_'+ ++eventN,signature=true){const payload=JSON.stringify({id:eventId,object:'event',type,livemode:false,created:Math.floor(Date.now()/1000),data:{object}});const sig=Stripe.webhooks.generateTestHeaderString({payload,secret:process.env.STRIPE_WEBHOOK_SECRET,timestamp:Math.floor(Date.now()/1000)});const r=await originalFetch(base+'/api/billing/webhook',{method:'POST',headers:{'Content-Type':'application/json','Stripe-Signature':signature?sig:'bad'},body:payload});return {status:r.status,data:await r.json()};}
function paid(customer,invoiceId='in_first',status='active'){const invoice={id:invoiceId,status:'paid',amount_paid:990,currency:'usd'};invoices.set(invoiceId,invoice);const sub={id:'sub_'+customer,customer,status,created:100,latest_invoice:invoice,items:{data:[{price:{id:'price_premium_month'},current_period_end:Math.floor(Date.now()/1000)+86400*30}]},cancel_at_period_end:false};subscriptions.set(customer,[sub]);return sub;}
try{
 const a=await register('BillingOwner'),b=await register('BillingOther'),teacher=await register('BillingTeacher','teacher');process.env.CONTINUUM_OWNER_USER_ID=a.id;
 assert.equal((await api('/billing')).status,401);assert.equal((await api('/billing/admin','GET',null,b.cookie)).status,403);
 let r=await api('/billing','GET',null,a.cookie);assert.equal(r.data.membership.tier,'free');assert.equal(r.data.tickets.length,0);assert.equal((await api('/billing/courses/en-workplace-diplomacy','GET',null,a.cookie)).status,403);
 assert.equal((await webhook('invoice.paid',{},'evt_bad',false)).status,400);
 // Checkout is durable and serialized: two different browser keys cannot open two purchases.
 const checkout=()=>api('/billing/checkout','POST',{key:crypto.randomUUID(),interval:'month'},a.cookie);
 const cs=await Promise.all([checkout(),checkout()]);assert.ok(cs.every(x=>x.status===200),JSON.stringify(cs));assert.equal(createCalls,1);assert.equal(cs[0].data.url,cs[1].data.url);
 // A success redirect is not evidence of a payment.
 assert.equal((await api('/billing','GET',null,a.cookie)).data.membership.premium,false);
 const customer=customers.get(a.id),sub=paid(customer);assert.equal((await webhook('invoice.paid',{id:'in_first',customer},'evt_paid')).status,200);
 r=await api('/billing','GET',null,a.cookie);assert.equal(r.data.membership.premium,true);assert.equal(r.data.tickets.filter(t=>t.state==='available').length,3);
 await webhook('invoice.paid',{id:'in_first',customer},'evt_paid');paid(customer,'in_second');await webhook('invoice.paid',{id:'in_second',customer});assert.equal((await api('/billing','GET',null,a.cookie)).data.tickets.length,3);
 assert.equal((await checkout()).status,409);
 const open=await api('/billing/courses/en-workplace-diplomacy','GET',null,a.cookie);assert.equal(open.status,200);assert.ok(!Object.hasOwn(open.data.course.questions[0],'answer'));assert.ok(!Object.hasOwn(open.data.course.questions[0],'note'));
 const correct=premiumCourses[0].questions.map(q=>q.answer);const result=await api('/billing/courses/en-workplace-diplomacy/finish','POST',{answers:correct,key:crypto.randomUUID()},a.cookie);assert.equal(result.data.correct,6);
 // Real slot reservation consumes exactly one ticket and cancellation returns it.
 await db.query("INSERT INTO teacher_profiles(user_id,status,data) VALUES($1,'approved',$2)",[teacher.id,JSON.stringify({languages:['en']})]);await db.query('INSERT INTO teacher_links(teacher_id,learner_id,languages) VALUES($1,$2,$3)',[teacher.id,a.id,['en']]);
 assert.equal((await api('/billing/admin','PUT',{teacherId:teacher.id,enabled:true},a.cookie)).status,200);
 const thread=(await api('/classroom/threads','POST',{otherId:teacher.id,language:'en'},a.cookie)).data.threadId;
 const start=new Date(Date.now()+86400000);start.setUTCSeconds(0,0);const end=new Date(+start+50*60000);const slot=(await db.query('INSERT INTO class_availability(teacher_id,starts_at,ends_at,timezone,client_key) VALUES($1,$2,$3,$4,$5) RETURNING id',[teacher.id,start,end,'UTC','billing-slot-one'])).rows[0];
 const bookingBody={threadId:thread,slotId:slot.id,topic:'Premium test class',clientKey:'billing-booking-0001',usePremiumTicket:true};const booking=await api('/classroom/bookings','POST',bookingBody,a.cookie);assert.equal(booking.status,201,JSON.stringify(booking));assert.equal(booking.data.booking.premiumTicket,true);
 assert.equal((await api('/classroom/bookings','POST',bookingBody,a.cookie)).status,201);
 r=await api('/billing','GET',null,a.cookie);assert.equal(r.data.tickets.filter(t=>t.state==='reserved').length,1);
 const cancel=await api('/classroom/bookings/'+booking.data.booking.id+'/status','PUT',{revision:0,status:'cancelled',reason:'Synthetic cancellation'},a.cookie);assert.equal(cancel.status,200,JSON.stringify(cancel));assert.equal((await api('/billing','GET',null,a.cookie)).data.tickets.filter(t=>t.state==='available').length,3);
 // Concurrent reservations cannot overspend the final ticket; rescheduling moves it.
 const extra=[];for(let i=2;i<=6;i++){const begin=new Date(+start+i*86400000),finish=new Date(+begin+50*60000);extra.push((await db.query('INSERT INTO class_availability(teacher_id,starts_at,ends_at,timezone,client_key) VALUES($1,$2,$3,$4,$5) RETURNING id',[teacher.id,begin,finish,'UTC','billing-extra-'+i])).rows[0]);}
 const book=(slot,i,more={})=>api('/classroom/bookings','POST',{threadId:thread,slotId:slot.id,topic:'Premium reservation',clientKey:'billing-extra-booking-'+i,usePremiumTicket:true,...more},a.cookie);
 const first=await book(extra[0],1),second=await book(extra[1],2);assert.equal(first.status,201);assert.equal(second.status,201);
 const race=await Promise.all([book(extra[2],3),book(extra[3],4)]);assert.equal(race.filter(x=>x.status===201).length,1);assert.equal(race.filter(x=>x.status===409).length,1);
 assert.equal((await api('/billing','GET',null,a.cookie)).data.tickets.filter(t=>t.state==='reserved').length,3);
 await db.query("UPDATE class_availability SET ends_at=starts_at+interval '90 minutes' WHERE id=$1",[extra[4].id]);assert.equal((await book(extra[4],50,{replacesId:first.data.booking.id,usePremiumTicket:false})).status,400);assert.equal((await db.query('SELECT status FROM class_bookings WHERE id=$1',[first.data.booking.id])).rows[0].status,'confirmed');await db.query("UPDATE class_availability SET ends_at=starts_at+interval '50 minutes' WHERE id=$1",[extra[4].id]);
 const moved=await book(extra[4],5,{replacesId:first.data.booking.id,usePremiumTicket:false});assert.equal(moved.status,201,JSON.stringify(moved));assert.equal(moved.data.booking.premiumTicket,true);assert.equal((await db.query('SELECT count(*)::int AS n FROM premium_class_tickets WHERE booking_id=$1',[first.data.booking.id])).rows[0].n,0);
 await db.query("UPDATE class_bookings SET starts_at=now()-interval '1 hour' WHERE id=$1",[moved.data.booking.id]);
 const finished=await api('/classroom/bookings/'+moved.data.booking.id+'/status','PUT',{revision:0,status:'completed'},teacher.cookie);assert.equal(finished.status,200,JSON.stringify(finished));assert.equal((await api('/billing','GET',null,a.cookie)).data.tickets.filter(t=>t.state==='used').length,1);
 // Ad-free is a server entitlement; client flags cannot request it.
 await api('/billing/admin','PUT',{ad:{title:'Test campaign',body:'First-party test',url:'https://example.test',enabled:true}},a.cookie);
 assert.equal((await api('/billing','GET',null,a.cookie)).data.ad,null);assert.equal((await api('/billing','GET',null,b.cookie)).data.ad.title,'Test campaign');
 // Fresh Stripe state wins even if an old event arrives after cancellation.
 subscriptions.get(customer)[0].status='canceled';await webhook('customer.subscription.deleted',{customer});await webhook('invoice.paid',{customer},'evt_old_invoice');assert.equal((await api('/billing','GET',null,a.cookie)).data.membership.premium,false);
 paid(customer,'in_rejoin');await webhook('invoice.paid',{customer});assert.equal((await api('/billing','GET',null,a.cookie)).data.tickets.length,3);
 // Full refunds remove unused benefits and do not allow them to be re-granted.
 charges.set('ch_test',{id:'ch_test',customer,payment_intent:'pi_test',invoice:'in_first',refunded:true});assert.equal((await webhook('charge.refunded',{id:'ch_test',customer})).status,200);r=await api('/billing','GET',null,a.cookie);assert.equal(r.data.membership.premium,false);assert.equal(r.data.tickets.filter(t=>t.state==='revoked').length,2);await webhook('invoice.paid',{customer});assert.equal((await api('/billing','GET',null,a.cookie)).data.membership.premium,false);
 // Turning off new sales must not prevent a customer from cancelling in Stripe.
 process.env.BILLING_ENABLED='false';assert.equal((await checkout()).status,503);assert.equal((await api('/billing/portal','POST',{},a.cookie)).status,200);
 // Stripe failure persists a retryable checkout intent, never a phantom membership.
 process.env.BILLING_ENABLED='true';failCheckout=true;const failed=await api('/billing/checkout','POST',{key:crypto.randomUUID(),interval:'month'},b.cookie);assert.equal(failed.status,503);const recovered=await api('/billing/checkout','POST',{key:crypto.randomUUID(),interval:'month'},b.cookie);assert.equal(recovered.status,200);assert.equal((await db.query('SELECT count(*)::int AS n FROM billing_checkout_requests WHERE user_id=$1 AND active',[b.id])).rows[0].n,1);
 console.log('PASS: signed raw webhooks, duplicate/out-of-order events, durable Checkout, server entitlements, course gates, first-payment tickets, real slot redemption/cancellation, ads, refund revocation, owner isolation and portal cancellation while sales are disabled. No real Stripe requests or charges.');
}finally{globalThis.fetch=originalFetch;await new Promise(r=>testServer.close(r));await db.close()}
