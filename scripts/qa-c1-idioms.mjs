// Hydrate the real lesson players and both maps without production writes or AI calls.
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {createServer} from 'vite';
import {pcmWav} from '../speech-service.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const vite=await createServer({server:{host:'127.0.0.1',port:0},appType:'custom'});
vite.middlewares.use('/api/learning',(req,res)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({progress:[]}));});
vite.middlewares.use('/__c1-idioms',async(req,res)=>{res.setHeader('Content-Type','text/html');res.end(await vite.transformIndexHtml('/__c1-idioms','<html><head><style>body{margin:0;padding:16px}#root{max-width:1200px;margin:auto}</style></head><body><div id="root"></div><script type="module" src="/scripts/c1-idioms-fixture.jsx"></script></body></html>'));});await vite.listen();
const base='http://127.0.0.1:'+vite.httpServer.address().port;let browser;
try{
 await fs.mkdir('.media-build/c1-idioms',{recursive:true});browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage(),errors=[],audioRequests=[];page.on('pageerror',e=>errors.push(e.message));
 const wave=pcmWav(Buffer.alloc(16000));
 await page.route('**/api/speech',async route=>{audioRequests.push(route.request().postDataJSON());await route.fulfill({status:200,contentType:'audio/wav',body:wave});});
 await page.route('**/api/billing/courses/**/audio?**',route=>route.fulfill({status:200,contentType:'audio/wav',body:wave}));
 for(const language of ['en','es','pt','ja']){
  for(const width of [390,1280]){
   await page.setViewportSize({width,height:900});
   for(const mode of ['illustrated-map','photo-map']){
    await page.goto(base+'/__c1-idioms?language='+language+'&mode='+mode);const selector=mode==='illustrated-map'?'.approved-map-node':'.journey-node';
    await page.locator(selector).first().waitFor();assert.equal(await page.locator(selector).count(),9);
    const label=language==='ja'?'Idioms and proverbs':'Everyday idioms',node=page.locator(selector).filter({hasText:label});assert.equal(await node.count(),1);await node.scrollIntoViewIfNeeded();await node.click();
    const panel=page.locator(mode==='illustrated-map'?'.approved-map-chapter':'.journey-map-selection');await panel.waitFor();
    await panel.locator('summary').click();assert.equal(await panel.locator('details button').count(),3);
    await page.screenshot({path:'.media-build/c1-idioms/'+language+'-'+mode+'-'+width+'.png'});
    await panel.locator('details button').first().click();assert.ok((await page.evaluate(()=>window.__started)).includes('c1-everyday-idioms'));
   }
  }
  await page.setViewportSize({width:390,height:844});
  for(const part of [1,2]){
   await page.goto(base+'/__c1-idioms?language='+language+'&mode=core&part='+part);await page.locator('.lesson-intro-card').waitFor();assert.equal(await page.locator('.expression-grid article').count(),5);
   await page.screenshot({path:'.media-build/c1-idioms/'+language+'-lesson-'+part+'.png',fullPage:true});
   const audio=page.locator('.expression-grid article').first().locator('button').first();await Promise.all([page.waitForResponse(r=>r.url().endsWith('/api/speech')&&r.status()===200),audio.click()]);
   await page.getByRole('button',{name:/^Start practice/}).click();await page.locator('.question-card').waitFor();
   await page.goto(base+'/__c1-idioms?language='+language+'&mode=exclusive&part='+part);await page.locator('.lesson-intro-card').waitFor();assert.equal(await page.locator('.premium-gallery').count(),1);await page.getByRole('button',{name:/^Start practice/}).click();await page.locator('.question-card').waitFor();
  }
  console.log('PASS C1 core/exclusive players, audio controls and both map layouts',language);
 }
 assert.deepEqual(errors,[]);assert.ok(audioRequests.length>=8);for(const language of ['en-US','es-ES','pt-BR','ja-JP'])assert.ok(audioRequests.some(r=>r.locale===language),language);
}finally{await browser?.close();await vite.close();}
