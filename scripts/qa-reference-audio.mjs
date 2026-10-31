import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {premiumCourses} from '../premium-courses.mjs';
import {premiumGalleryFrames,premiumReferenceAudioEndpoint} from '../premium-session.mjs';
import {bundledRecording} from '../bundled-audio.mjs';
const engines=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const course=premiumCourses.find(c=>c.language==='it'&&c.examples?.some(s=>s.includes('acqua in bocca')));
assert.ok(course);
const visible={...course,questions:course.questions.map(({answer,acceptedAnswers,note,...q})=>q)};
const vite=await createServer({server:{host:'127.0.0.1',port:0},appType:'custom'});
vite.middlewares.use('/__reference-course',(_req,res)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(visible));});
vite.middlewares.use('/__reference-audio',async(_req,res)=>{res.setHeader('Content-Type','text/html');res.end(await vite.transformIndexHtml('/__reference-audio','<html><body><div id="root"></div><script type="module" src="/scripts/reference-audio-fixture.jsx"></script></body></html>'));});
await vite.listen();const base='http://127.0.0.1:'+vite.httpServer.address().port;
try{for(const name of (process.env.QA_AUDIO_ENGINES||'chromium,webkit').split(',')){
 const browser=await engines[name].launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
 try{
  const page=await browser.newPage(),errors=[],requested=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/speech',async route=>{errors.push('Private context incorrectly sent to public speech');await route.abort();});
  await page.route('**/api/billing/courses/**/audio?*',async route=>{const url=new URL(route.request().url()),index=Number(url.searchParams.get('gallery')),frame=premiumGalleryFrames(course)[index];assert.ok(frame);requested.push(url.pathname+url.search);const clip=bundledRecording(frame.text,'it-IT');assert.ok(clip);await route.fulfill({status:200,headers:{'Content-Type':'audio/mpeg','X-Audio-Source':'AI-generated studio voice','X-Audio-Delivery':'bundled'},body:clip.audio});});
  await page.goto(base+'/__reference-audio');await page.getByText('Start practice',{exact:true}).waitFor();
  const details=page.locator('details.illustrated-lesson-reference');if(await details.count())await details.locator('summary').click();
  for(const text of course.examples){const row=page.locator('.translated-example').filter({hasText:text}).first();const button=row.locator('.sentence-play');await button.click();await page.waitForFunction(text=>Array.from(document.querySelectorAll('.translated-example')).some(r=>r.textContent.includes(text)&&r.querySelector('.sentence-play')?.getAttribute('aria-label')==='Stop audio'),text);assert.equal(requested.at(-1),premiumReferenceAudioEndpoint(course,text));assert.equal(await row.locator('.sentence-audio-error').count(),0);await button.click();}
  assert.deepEqual(errors,[]);console.log('PASS '+name+': all '+course.examples.length+' Italian context examples play bundled audio through protected course endpoints.');
 }finally{await browser.close();}
}}finally{await vite.close();}
