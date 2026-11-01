// The real review UI with synthetic saved conversations and controlled responses.
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const engines=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const vite=await createServer({server:{host:'127.0.0.1',port:0},appType:'custom'});
vite.middlewares.use('/__communication-review',async(req,res)=>{res.setHeader('Content-Type','text/html');res.end(await vite.transformIndexHtml('/__communication-review','<html><body><div id="root"></div><script type="module" src="/scripts/communication-review-fixture.jsx"></script></body></html>'));});
await vite.listen();const origin='http://127.0.0.1:'+vite.httpServer.address().port;
const review={summary:'Your conversation is saved. Some language feedback could not be independently verified.',strengths:['Polite requests.'],goals:[{goal:'Order a drink',achieved:true,evidence:'A coffee, please.'},{goal:'Ask about an option',achieved:false,evidence:''},{goal:'Finish politely',achieved:false,evidence:''}],corrections:[],partial:true,communicationScore:null,nextStep:'Try another conversation.',pronunciation:{assessable:true,score:75,ratings:[3,3,3,3],evidence:['Clear speech.'],feedback:'Clear.'}};
const saved={id:'00000000-0000-4000-8000-000000000111',language:'en',level:'B1',scenario:'cafe',status:'completed',revision:4,at:'2026-11-01T00:00:00.000Z',messages:[{role:'assistant',text:'What would you like?'},{role:'user',text:'A coffee, please.',mode:'voice'},{role:'assistant',text:'Anything else?'},{role:'user',text:'No, thank you.',mode:'voice'}],review};
try{for(const name of (process.env.QA_AUDIO_ENGINES||'chromium,webkit').split(',')){
 const browser=await engines[name].launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));let pending=null,calls=0;
  await page.route('**/api/speaking**',async route=>{
   const url=new URL(route.request().url());
   if(route.request().method()==='POST'&&url.pathname.endsWith('/review')){calls++;const data=route.request().postDataJSON();assert.equal(data.refreshScores,true,'Retry must request score-only reassessment');pending=route;return;}
   const body=url.pathname==='/api/speaking'?{available:true,premium:true,sessions:[saved]}:{session:saved};
   await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)});
  });
  const open=async()=>{pending=null;await page.goto(origin+'/__communication-review');await page.locator('details.learning-log-group > summary').click();await page.locator('.speaking-history').click();await page.locator('.conversation-review').waitFor();await page.locator('.speaking-consent input').check();};
  const begin=async()=>{await page.locator('.conversation-review .text-button').click();await page.locator('.conversation-review [role="status"]').waitFor();assert.match(await page.locator('.conversation-review [role="status"]').innerText(),/Calculating communication score/);assert.equal(await page.locator('.conversation-thinking').count(),0,'No misleading full-review spinner');assert.equal(await page.locator('.conversation-review .text-button').isDisabled(),true);assert.match(await page.locator('.skill-acoustic').innerText(),/75%/);for(let i=0;i<100&&!pending;i++)await new Promise(r=>setTimeout(r,20));assert.ok(pending);};
  const complete=async()=>{await pending.fulfill({status:200,contentType:'application/json',body:JSON.stringify({session:{...saved,revision:5,review:{...review,communicationScore:81,communicationStatus:'scored',score:80}}})});pending=null;await page.waitForFunction(()=>document.querySelector('.conversation-review')?.textContent.includes('Communication score: 81%'));assert.equal(await page.locator('.conversation-review [role="status"]').count(),0);assert.match(await page.locator('.skill-acoustic').innerText(),/75%/);};
  await open();await begin();await complete();assert.equal(calls,1);
  // Provider failure leaves the saved review and pronunciation visible. The
  // explicit retry remains score-only and can recover without another full review.
  await open();await begin();await pending.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Your conversation is saved, but the review could not be created. Please try creating the review again.'})});pending=null;
  await page.locator('.auth-error').waitFor();assert.equal(await page.locator('.conversation-review [role="status"]').count(),0);assert.equal(await page.locator('.auth-error button').isEnabled(),true);assert.match(await page.locator('.skill-acoustic').innerText(),/75%/);
  await page.locator('.auth-error button').click();await page.locator('.conversation-review [role="status"]').waitFor();for(let i=0;i<100&&!pending;i++)await new Promise(r=>setTimeout(r,20));await complete();assert.equal(calls,3);
  // Advance the browser clock rather than spending forty seconds on a deliberately
  // stalled provider. Timeout must release all busy controls and keep the review.
  await open();await page.clock.install();await begin();await page.clock.runFor(40050);await page.locator('.auth-error').waitFor();assert.equal(await page.locator('.conversation-review [role="status"]').count(),0);assert.equal(await page.locator('.auth-error button').isEnabled(),true);assert.match(await page.locator('.skill-acoustic').innerText(),/75%/);assert.deepEqual(errors,[]);
  console.log('PASS '+name+': score-only reassessment, one clear progress state, preserved saved review/pronunciation, provider failure/retry and bounded timeout on mobile.');
 }finally{await browser.close();}
}}finally{await vite.close();}
