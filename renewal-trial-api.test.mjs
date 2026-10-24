import assert from 'node:assert/strict';
import Stripe from 'stripe';
import {premiumCourses} from './premium-courses.mjs';
const originalFetch=globalThis.fetch;
Object.assign(process.env,{STRIPE_SECRET_KEY:'sk_test_synthetic_billing',STRIPE_WEBHOOK_SECRET:'whsec_synthetic_billing',STRIPE_PREMIUM_MONTHLY_PRICE_ID:'price_premium_month',BILLING_PUBLIC_URL:'https://example.test',BILLING_ENABLED:'true'});
const customers=new Map(),subscriptions=new Map(),sessions=new Map(),idem=new Map(),invoices=new Map(),charges=new Map();let calls=0,createCalls=0,failCheckout=false,lastCheckout;
globalThis.fetch=async(input,options)=>{
 const u=new URL(String(input));if(u.hostname!=='api.stripe.com')return originalFetch(input,options);calls++;
 const form=new URLSearchParams(options.body?.toString()||''),path=u.pathname,header=new Headers(options.headers),key=header.get('Idempotency-Key');
 if(path==='/v1/customers'){const user=form.get('metadata[continuum_user]');if(!customers.has(user))customers.set(user,'cus_'+customers.size);return Response.json({id:customers.get(user),object:'customer'});}
 if(path.startsWith('/v1/prices/'))return Response.json({id:'price_premium_month',object:'price',active:true,type:'recurring',unit_amount:990,currency:'usd',recurring:{interval:'month'},livemode:false});
 if(path==='/v1/subscriptions')return Response.json({object:'list',data:subscriptions.get(u.searchParams.get('customer'))||[],has_more:false});
 if(path==='/v1/checkout/sessions'&&options.method==='POST'){lastCheckout=form;
  if(failCheckout){failCheckout=false;return Response.json({error:{type:'invalid_request_error',message:'synthetic outage'}},{status:400});}
  if(!idem.has(key)){const id='cs_test_'+sessions.size;const session={id,object:'checkout.session',status:'open',customer:form.get('customer'),url:'https://checkout.stripe.com/c/pay/'+id};sessions.set(id,session);idem.set(key,session);createCalls++;}return Response.json(idem.get(key));
 }
 if(path.startsWith('/v1/checkout/sessions/'))return Response.json(sessions.get(path.split('/').at(-1)));
 if(path.startsWith('/v1/subscriptions/')){const sub=[...subscriptions.values()].flat().find(s=>s.id===path.split('/').at(-1));if(options.method==='POST')sub.cancel_at_period_end=form.get('cancel_at_period_end')==='true';return Response.json(sub);}
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
 const a=await register('RenewalLearner'),b=await register('RenewalOther'),teacher=await register('RenewalTeacher','teacher');
 assert.equal((await api('/billing/trial-offer?interval=month')).status,401);assert.equal((await api('/billing/trial-offer?interval=month','GET',null,teacher.cookie)).status,403);
 const offer=(await api('/billing/trial-offer?interval=month','GET',null,a.cookie)).data.offer;assert.equal(offer.amount,990);assert.equal(offer.currency,'usd');
 const body={key:crypto.randomUUID(),interval:'month',trial:true,consent:true,offer};
 assert.equal((await api('/billing/checkout','POST',{...body,consent:false},a.cookie)).status,400);assert.equal(customers.size,0);
 assert.equal((await api('/billing/checkout','POST',{...body,offer:{...offer,amount:1}},a.cookie)).status,409);
 const checkouts=await Promise.all([api('/billing/checkout','POST',body,a.cookie),api('/billing/checkout','POST',body,a.cookie)]);assert.ok(checkouts.every(r=>r.status===200));assert.equal(checkouts[0].data.url,checkouts[1].data.url);assert.equal(createCalls,1);
 assert.equal(lastCheckout.get('subscription_data[trial_period_days]'),'3');assert.equal(lastCheckout.get('payment_method_collection'),'always');assert.equal(lastCheckout.get('subscription_data[trial_settings][end_behavior][missing_payment_method]'),'cancel');assert.ok(lastCheckout.get('custom_text[submit][message]').includes('automatic recurring charges'));
 const consent=(await db.query('SELECT * FROM billing_checkout_requests WHERE user_id=$1',[a.id])).rows[0];assert.equal(consent.trial,true);assert.ok(consent.consent_at);assert.equal(consent.offer.amount,990);assert.equal((await api('/billing','GET',null,a.cookie)).data.membership.premium,false,'opening checkout alone grants no trial');
 const customer=customers.get(a.id),now=Math.floor(Date.now()/1000),sub={id:'sub_trial_synthetic',customer,status:'trialing',created:now,trial_start:now,trial_end:now+259200,metadata:{continuum_trial:offer.termsVersion,checkout_request:consent.id},latest_invoice:{id:'in_trial_zero',status:'paid',amount_paid:0,currency:'usd'},items:{data:[{price:{id:'price_premium_month'},current_period_end:now+259200}]},cancel_at_period_end:false};subscriptions.set(customer,[sub]);
 await webhook('customer.subscription.created',{customer});let r=await api('/billing','GET',null,a.cookie);assert.equal(r.data.membership.premium,true);assert.equal(r.data.membership.trialKind,'subscription');assert.equal(r.data.tickets.length,0);
 assert.equal((await api('/billing/cancel-trial','POST',{confirm:true},b.cookie)).status,404);assert.equal((await api('/billing/cancel-trial','POST',{confirm:false},a.cookie)).status,400);
 process.env.BILLING_ENABLED='false';r=await api('/billing/cancel-trial','POST',{confirm:true},a.cookie);assert.equal(r.status,200);assert.equal(r.data.membership.cancelAtPeriodEnd,true);assert.equal(r.data.membership.premium,true);process.env.BILLING_ENABLED='true';
 assert.equal((await api('/billing/checkout','POST',body,a.cookie)).status,409,'one trial only');sub.status='canceled';await webhook('customer.subscription.deleted',{customer});assert.equal((await api('/billing','GET',null,a.cookie)).data.membership.premium,false,'immediate cancellation revokes trial access');
 sub.status='past_due';await webhook('invoice.payment_failed',{customer});assert.equal((await api('/billing','GET',null,a.cookie)).data.membership.premium,false,'failed renewal does not grant paid access');
 sub.status='active';sub.cancel_at_period_end=false;sub.latest_invoice={id:'in_trial_paid',status:'paid',amount_paid:990,currency:'usd'};sub.items.data[0].current_period_end=now+86400*30;await webhook('invoice.paid',{customer});r=await api('/billing','GET',null,a.cookie);assert.equal(r.data.membership.source,'subscription');assert.equal(r.data.tickets.length,1,'ticket only after real paid invoice');
 sub.status='canceled';await webhook('customer.subscription.deleted',{customer});sessions.get('cs_test_0').status='complete';assert.equal((await api('/billing/checkout','POST',{key:crypto.randomUUID(),interval:'month'},a.cookie)).status,200,'completed trial checkout does not block a later paid subscription');assert.equal(lastCheckout.get('subscription_data[trial_period_days]'),null);
 await db.query('INSERT INTO premium_trials(user_id) VALUES($1)',[b.id]);assert.equal((await api('/billing/checkout','POST',body,b.cookie)).status,409,'earlier cardless trial cannot be enrolled in a second trial');assert.equal((await api('/billing','GET',null,b.cookie)).data.membership.trialKind,'cardless');
 console.log('PASS: explicit price/renewal consent, stale-price rejection, one durable checkout, payment collection, no access before confirmation, zero-ticket trial, cancellation while sales paused, failed payment, paid conversion and grandfathered cardless trial isolation. No real payments.');
}finally{globalThis.fetch=originalFetch;await new Promise(r=>testServer.close(r));await db.close()}
