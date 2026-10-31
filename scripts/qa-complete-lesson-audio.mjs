import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {lessonList} from '../course.mjs';
import {handleSpeech} from '../speech-api.mjs';
const engines=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const reports=[{language:'es',locale:'es-ES',text:'De vez en cuando cocino con mis amigos.'},{language:'pt',locale:'pt-BR',text:'Às vezes trabalho em casa.'}];
const vite=await createServer({server:{host:'127.0.0.1',port:0},appType:'custom'});
vite.middlewares.use('/__complete-audio-lesson',(req,res)=>{const {language,text}=reports.find(r=>new URL(req.url,'http://localhost').searchParams.get('language')===r.language);const lesson=lessonList.find(l=>(l.language||'es')===language&&[...(l.expressions||[]),...(l.vocabulary||[])].some(e=>e.example===text));assert.ok(lesson);res.setHeader('Content-Type','application/json');res.end(JSON.stringify(lesson));});
vite.middlewares.use('/__complete-audio',async(_req,res)=>{res.setHeader('Content-Type','text/html');res.end(await vite.transformIndexHtml('/__complete-audio','<html><body><div id="root"></div><script type="module" src="/scripts/complete-audio-fixture.jsx"></script></body></html>'));});
await vite.listen();const base='http://127.0.0.1:'+vite.httpServer.address().port;
try{for(const name of (process.env.QA_AUDIO_ENGINES||'chromium,webkit').split(',')){
 const browser=await engines[name].launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
 try{const page=await browser.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/speech',async route=>{const data=route.request().postDataJSON();requests.push(data);let status,headers,body;await handleSpeech({route:'/api/speech',req:{method:'POST'},res:{writeHead:(s,h)=>{status=s;headers=h;},end:b=>body=b},json:async()=>data,pool:{query:()=>assert.fail('No live provider cache for the reported examples')},limited:()=>assert.fail('No provider quota'),synthesize:()=>assert.fail('No live synthesis'),fail:(s,m)=>{throw Error(s+': '+m);}});assert.equal(status,200);assert.equal(headers['X-Audio-Delivery'],'bundled');await route.fulfill({status,headers:Object.fromEntries(Object.entries(headers).map(([key,value])=>[key,String(value)])),body});});
  for(const report of reports){await page.goto(base+'/__complete-audio?language='+report.language);const row=page.locator('.translated-example').filter({hasText:report.text}).first();const button=row.locator('.sentence-play');await button.click();await page.waitForFunction(text=>Array.from(document.querySelectorAll('.translated-example')).some(r=>r.textContent.includes(text)&&r.querySelector('.sentence-play')?.getAttribute('aria-label')==='Stop audio'),report.text);assert.deepEqual(requests.at(-1),{text:report.text,locale:report.locale});assert.equal(await row.locator('.sentence-audio-error').count(),0);await button.click();}
  assert.deepEqual(errors,[]);console.log('PASS '+name+': exact reported Spanish and Portuguese full-sentence buttons play bundled recordings with generation disabled.');
 }finally{await browser.close();}
}}finally{await vite.close();}
