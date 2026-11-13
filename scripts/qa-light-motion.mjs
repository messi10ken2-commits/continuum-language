// Exercise the real Light components in a disposable browser harness.
import assert from 'node:assert/strict';
import {mkdir,writeFile,rm} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {getLesson} from '../course.mjs';
import {lightActivities,lightLessonVersion} from '../light-learning-model.mjs';
const directory=new URL('../.media-build/light-motion/',import.meta.url);
await mkdir(directory,{recursive:true});
await writeFile(new URL('entry.jsx',directory),`
import React from 'react';
import {createRoot} from 'react-dom/client';
import {TownScene,TownRewardScene} from '../../LightTown.jsx';
import LightLesson from '../../LightLesson.jsx';
import {getLesson} from '../../course.mjs';
import {townRewardAt} from '../../light-town.mjs';
import '../../light-learning.css';
import '../../light-motion.css';
const params=new URLSearchParams(location.search);
const language=params.get('language')||'es';
const kind=params.get('kind')||'capybara';
const collection=Array.from({length:7},(_,i)=>townRewardAt(i));
createRoot(document.getElementById('root')).render(
 <div className="app continuum-ui"><main className="light-town" style={{width:'100%',maxWidth:620,margin:'auto'}}>
  <section id="town"><TownScene language={language} kind={kind} collection={collection}
   places={[{id:'next',status:'current',label:'Next lesson',onOpen:()=>{}}]}/></section>
  <section id="lesson"><LightLesson lesson={getLesson('introductions')} user={null} autoStart onExit={()=>{}} onStandard={()=>{}}/></section>
  <section id="reward"><TownRewardScene language={language} kind={kind}
   item={collection[6]} collection={collection} placements={[]}/></section>
 </main></div>
);
`);
const server=await createServer({
 configFile:false,server:{host:'127.0.0.1',port:0,hmr:false},appType:'custom',
 plugins:[{name:'light-motion-harness',configureServer(server){
  server.middlewares.use(async(req,res,next)=>{
   if(!req.url?.startsWith('/__light_motion'))return next();
   try{
    const html=await server.transformIndexHtml(req.url,
     '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}*{box-sizing:border-box}#lesson,#reward{margin-top:20px}#root{padding:10px}button{font:inherit}</style></head><body><div id="root"></div><script type="module" src="/.media-build/light-motion/entry.jsx"></script></body></html>');
    res.setHeader('Content-Type','text/html');
    res.end(html);
   }catch(error){next(error)}
  });
 }}]
});
let browser;
try{
 await server.listen();
 const base='http://127.0.0.1:'+server.httpServer.address().port;
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:390,height:844}});
 await context.route('**/api/**',route=>route.fulfill({status:503,contentType:'application/json',body:'{}'}));
 const page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const scene=page.locator('#town .town-scene');
 for(const language of ['en','es','pt','ja','zh','ko','fr','de','ar','it']){
  await page.goto(base+'/__light_motion?language='+language);
  await scene.waitFor();
  await page.waitForFunction(()=>document.querySelector('#town .town-scene')?.dataset.motion==='on');
  assert.equal(await page.locator('#town .town-decoration').count(),7,language);
  const button=page.locator('#town .town-companion');
  await button.focus();
  await page.keyboard.press('Enter');
  assert.equal(await button.getAttribute('data-reacting'),'true');
  await page.waitForFunction(()=>document.querySelector('#town .town-companion')?.dataset.reacting==='false');
 }
 for(const kind of ['bird','fox','cat','dog','capybara','guinea-pig','quokka','panda']){
  await page.goto(base+'/__light_motion?kind='+kind);
  await page.locator('#town .town-companion[data-companion="'+kind+'"]').click();
  assert.equal(await page.locator('#town .town-companion').getAttribute('data-reacting'),'true');
 }
 const box=await scene.boundingBox();
 await page.mouse.move(box.x+box.width*.8,box.y+box.height*.3);
 await page.waitForFunction(()=>Math.abs(Number(document.querySelector('#town .town-scene').style.getPropertyValue('--light-pointer-x')))>0.1);
 await page.locator('#reward').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('#town .town-scene').dataset.motion==='off');
 assert.equal(await scene.evaluate(el=>el.style.getPropertyValue('--light-pointer-x')),'');
 const card=page.locator('#lesson .town-question-card');
 const stage=page.locator('#lesson .town-listen-stage');
 await stage.scrollIntoViewIfNeeded();
 const cardBefore=await card.boundingBox();
 const stageBox=await stage.boundingBox();
 await page.mouse.move(stageBox.x+stageBox.width*.8,stageBox.y+stageBox.height*.4);
 await page.waitForTimeout(320);
 const cardAfter=await card.boundingBox();
 assert.ok(Math.abs(cardBefore.x-cardAfter.x)<.5&&Math.abs(cardBefore.y-cardAfter.y)<.5,'scene parallax must not move answers');
 const first=lightActivities(getLesson('introductions'),0,lightLessonVersion)[0];
 if(first.type==='build'){
  const used=new Set();
  for(const token of first.model.split(first.joiner)){
   const index=first.tokens.findIndex((value,index)=>value===token&&!used.has(index));
   assert.ok(index>=0);
   used.add(index);
   await page.locator('#lesson .word-builder-tiles button').nth(index).click();
  }
 }else{
  await page.locator('#lesson .light-game-choices button').nth(first.options.indexOf(first.meaning)).click();
 }
 await page.locator('#lesson .light-game-footer .town-cta').click();
 await page.locator('#lesson .town-question-card[data-feedback="correct"]').waitFor();
 assert.equal(await page.locator('#lesson .town-companion-sprite').getAttribute('data-celebrate'),'true');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.waitForFunction(()=>document.querySelector('#lesson .town-listen-stage').dataset.motion==='off');
 const animations=await stage.evaluate(el=>el.getAnimations({subtree:true}).filter(a=>a.playState==='running').length);
 assert.equal(animations,0,'reduced motion must disable companion and speech loops');
 await page.locator('#reward').scrollIntoViewIfNeeded();
 assert.equal(await page.locator('#reward .town-reward-flight').evaluate(el=>getComputedStyle(el).display),'none');
 assert.equal(await page.locator('#reward .town-decoration[data-new="true"]').count(),1);
 assert.deepEqual(errors,[]);
 console.log('PASS: ten language maps, eight tap/keyboard reactions, stable question controls, off-screen suspension and reduced-motion reward visibility.');
 await context.close();
}finally{
 await browser?.close();
 await server.close();
 await rm(new URL('entry.jsx',directory),{force:true});
}
