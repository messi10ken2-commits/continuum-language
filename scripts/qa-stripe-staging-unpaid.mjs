// Safe, end-to-end *unpaid* Checkout smoke test against Railway's isolated Staging.
// This creates synthetic learners and open Stripe test Checkout Sessions, but never
// submits payment data, completes Checkout, or changes a live subscription.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';

const origin='https://unique-contentment-staging.up.railway.app';
const plans=[
 {interval:'month',amount:999,price:'price_1UZTLm9Eu6Fev9ZMTnuYtxdk'},
 {interval:'year',amount:7999,price:'price_1UZTLo9Eu6Fev9ZM5sut42KI'}
];
const request=async(method,path,body,cookie)=>{
 const r=await fetch(origin+path,{
  method,redirect:'manual',signal:AbortSignal.timeout(30000),
  headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},
  ...(body?{body:JSON.stringify(body)}:{})
 });
 let data={};try{data=await r.json()}catch{}
 return {status:r.status,data,cookie:r.headers.get('set-cookie')?.split(';')[0]};
};
const home=await fetch(origin+'/',{signal:AbortSignal.timeout(30000)});
assert.equal(home.status,200,'Staging homepage must be available');
console.log('PASS Staging HTTPS homepage');

for(const plan of plans){
 const suffix=randomUUID().replaceAll('-','').slice(0,16);
 const registration=await request('POST','/api/auth/register',{
  name:'QA Stripe '+suffix,
  email:'stripe-qa-'+suffix+'@example.test',
  password:'QaOnly-'+randomUUID()+'!',
  role:'learner',adult:true
 });
 assert.equal(registration.status,200,'Staging learner registration returned '+registration.status);
 assert.ok(registration.cookie,'Staging auth must establish a session');

 const status=await request('GET','/api/billing',null,registration.cookie);
 assert.equal(status.status,200,'Membership endpoint returned '+status.status);
 assert.equal(status.data.membership?.premium,false,'Free learner must not have premium access');

 const offer=await request('GET','/api/billing/trial-offer?interval='+plan.interval,null,registration.cookie);
 assert.equal(offer.status,200,'Trial offer returned '+offer.status);
 assert.equal(offer.data.offer?.priceId,plan.price);
 assert.equal(offer.data.offer?.amount,plan.amount);
 assert.equal(offer.data.offer?.currency,'usd');
 assert.equal(offer.data.offer?.interval,plan.interval);
 assert.ok(offer.data.offer?.termsVersion,'Trial offer must include displayed renewal terms');
 console.log('PASS '+plan.interval+' price verified through actual Staging API');

 const checkout=await request('POST','/api/billing/checkout',{
  key:randomUUID(),interval:plan.interval,trial:true,consent:true,offer:offer.data.offer
 },registration.cookie);
 assert.equal(checkout.status,200,'Checkout creation returned '+checkout.status);
 const url=new URL(checkout.data.url);
 assert.equal(url.protocol,'https:');
 assert.equal(url.hostname,'checkout.stripe.com');
 assert.ok(url.pathname.startsWith('/c/'),'Must return real Stripe-hosted Checkout');

 const stillFree=await request('GET','/api/billing',null,registration.cookie);
 assert.equal(stillFree.status,200);
 assert.equal(stillFree.data.membership?.premium,false,
  'Uncompleted Checkout must never grant Premium');
 console.log('PASS '+plan.interval+' unpaid, trial Checkout issued; learner remains Free');
}
console.log('PASS end-to-end unpaid Stripe Sandbox smoke checks for month and year');
