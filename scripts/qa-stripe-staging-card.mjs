// Sandbox-only test card validation of the real Continuum/Staging hosted Checkout.
// This test does not enter a real payment card or use a live Stripe account.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {chromium} from 'playwright';

const origin='https://unique-contentment-staging.up.railway.app';
const request=async(method,path,body,cookie)=>{
 const r=await fetch(origin+path,{method,redirect:'manual',signal:AbortSignal.timeout(30000),
  headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},
  ...(body?{body:JSON.stringify(body)}:{})});
 let data={};try{data=await r.json()}catch{}
 return {status:r.status,data,cookie:r.headers.get('set-cookie')?.split(';')[0]};
};
const id=randomUUID().replaceAll('-','').slice(0,15);
const reg=await request('POST','/api/auth/register',{
 name:'QA Sandbox Trial '+id,email:'continuum-sandbox-card-'+id+'@example.test',
 password:'QaOnly-'+randomUUID()+'!',role:'learner',adult:true
});
assert.equal(reg.status,200,'Sandbox user registration failed '+reg.status);
assert.ok(reg.cookie,'Sandbox auth cookie missing');
const offer=await request('GET','/api/billing/trial-offer?interval=month',null,reg.cookie);
assert.equal(offer.status,200,'Monthly trial offer failed '+offer.status);
assert.equal(offer.data.offer?.priceId,'price_1UZTLm9Eu6Fev9ZMTnuYtxdk');
assert.equal(offer.data.offer?.amount,999);
const checkout=await request('POST','/api/billing/checkout',{
 key:randomUUID(),interval:'month',trial:true,consent:true,offer:offer.data.offer
},reg.cookie);
assert.equal(checkout.status,200,'Sandbox Checkout creation failed '+checkout.status);
const url=new URL(checkout.data.url);
assert.equal(url.hostname,'checkout.stripe.com');
assert.ok(url.pathname.startsWith('/c/'),'Sandbox must redirect to a hosted Checkout Session');
console.log('PASS sandbox Checkout issued through actual Staging API');

const browser=await chromium.launch({headless:true,args:['--disable-dev-shm-usage','--no-sandbox']});
try {
 const page=await browser.newPage({viewport:{width:1140,height:900}});
 await page.goto(url.toString(),{waitUntil:'domcontentloaded',timeout:50000});
 await page.waitForTimeout(2500);

 const describeForms=async()=>{
  for(const frame of page.frames()){
   const info=await frame.locator('input').evaluateAll(nodes=>nodes.map(n=>({
    name:n.getAttribute('name'),type:n.getAttribute('type'),
    placeholder:n.getAttribute('placeholder'),autocomplete:n.getAttribute('autocomplete'),
    label:n.getAttribute('aria-label')
   })).slice(0,15)).catch(()=>[]);
   console.log('form frame',frame.url().split('/').slice(0,3).join('/'),JSON.stringify(info));
  }
 };

 const fill=async(selectors,value,description)=>{
  for(let tries=0;tries<18;tries++){
   for(const frame of page.frames()){
    for(const css of selectors){
     const locator=frame.locator(css).first();
     if((await locator.count().catch(()=>0))>0&&await locator.isVisible().catch(()=>false)){
      await locator.fill(value,{timeout:8000});
      console.log('Filled sandbox '+description);return;
     }
    }
   }
   await page.waitForTimeout(500);
  }
  await describeForms();
  throw Error('Could not find sandbox '+description+' field');
 };

 // Stripe Checkout may render payment fields in a secure payment-element iframe.
 await fill(["input[autocomplete='cc-number']","input[name='cardNumber']",
  "input[name='number']","input[placeholder*='1234 1234']",
  "input[data-elements-stable-field-name='cardNumber']"],'4242424242424242','test card number');
 await fill(["input[autocomplete='cc-exp']","input[name='cardExpiry']",
  "input[name='expiry']","input[placeholder*='MM / YY']",
  "input[data-elements-stable-field-name='cardExpiry']"],'1234','test expiry');
 await fill(["input[autocomplete='cc-csc']","input[name='cardCvc']",
  "input[name='cvc']","input[placeholder='CVC']",
  "input[data-elements-stable-field-name='cardCvc']"],'123','test CVC');

 // Checkout occasionally needs a postal code in addition to the card fields.
 for(const frame of page.frames()){
  for(const css of ["input[autocomplete='postal-code']","input[name='postalCode']"]){
   const field=frame.locator(css).first();
   if((await field.count().catch(()=>0))&&await field.isVisible().catch(()=>false)){
    await field.fill('10001');break;
   }
  }
 }
 const submit=page.getByRole('button',{name:/Start trial|Start free trial|Subscribe|Pay|Confirm|Begin trial|Start subscription/i}).last();
 if(!await submit.count()){await describeForms();throw Error('Stripe trial submission button not found');}
 await submit.click({timeout:15000});
 console.log('Submitted Stripe SANDBOX test card only');

 await page.waitForURL(u=>u.hostname==='unique-contentment-staging.up.railway.app',
  {timeout:60000}).catch(()=>{});
 let premium=false;
 for(let retries=0;retries<18;retries++){
  const state=await request('GET','/api/billing',null,reg.cookie);
  if(state.status===200&&state.data.membership?.premium){
   premium=true;
   console.log('PASS premium enabled by signed webhook / subscription synchronization');
   break;
  }
  await page.waitForTimeout(2500);
 }
 assert.ok(premium,'Premium entitlement did not become active after sandbox Checkout');

 // Stop future billing in this disposable test, preserving the trial until its end.
 const canceled=await request('POST','/api/billing/cancel-trial',{confirm:true},reg.cookie);
 assert.equal(canceled.status,200,'Trial cancellation returned '+canceled.status);
 console.log('PASS sandbox trial renewal canceled before charge');
} finally {await browser.close();}
console.log('PASS full hosted sandbox trial checkout, entitlement, and cancellation');
