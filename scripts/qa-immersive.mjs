// Real lesson components and native source imports; provider calls are mocked.
// This verifies UI/state/audio sequencing, not acoustic pronunciation quality.
import assert from 'node:assert/strict';
import {mkdir,writeFile,rm} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium,webkit} from 'playwright';
import {getLesson} from '../course.mjs';
import {lightActivities} from '../light-learning-model.mjs';
import {loadImmersiveUnit,loadImmersivePack} from '../immersive/loader.mjs';
const directory=new URL('../.media-build/immersive-ui/',import.meta.url);await mkdir(directory,{recursive:true});
await writeFile(new URL('entry.jsx',directory),`
import React from 'react';import{createRoot}from'react-dom/client';
import LightLesson from '../../LightLesson.jsx';import{LessonPlayer}from'../../SelfStudy.jsx';
import{LanguageContext}from'../../LanguageContext.jsx';import{getLesson}from'../../course.mjs';
import{setInterfaceLanguage}from'../../interface-runtime.mjs';
import{useActivityTracker}from'../../LearningActivity.jsx';
import '../../styles.css';import '../../features.css';import '../../continuum-ui.css';
import '../../light-learning.css';import '../../light-motion.css';
const p=new URLSearchParams(location.search),language=p.get('language')||'en',key=p.get('key')||'market',stage=p.get('stage')||'reading';
setInterfaceLanguage(p.get('display')||'en',{persist:false});
const lesson=getLesson(language+'-immersive-'+key+'-v1-'+stage),user=p.has('live')?{id:'synthetic-immersive-browser',role:'learner'}:null;
const complete=async result=>({id:'synthetic-completion',...result});
const props={lesson,language,user,autoStart:true,lightAutoStart:true,initialAnswers:[],onDraft:async()=>{},onComplete:complete,onExit:()=>{},onStandard:()=>{}};
function App(){useActivityTracker(user);return <LanguageContext.Provider value={language}><div className="app continuum-ui"><main style={{width:'100%',maxWidth:760,margin:'auto'}}>{p.get('mode')==='standard'?<LessonPlayer {...props}/>:<LightLesson {...props}/>}</main></div></LanguageContext.Provider>}
createRoot(document.getElementById('root')).render(<App/>);
`);
const server=await createServer({configFile:false,optimizeDeps:{entries:[new URL('entry.jsx',directory).pathname]},server:{host:'127.0.0.1',port:0,hmr:false},appType:'custom',plugins:[{name:'immersion-ui',configureServer(server){server.middlewares.use(async(req,res,next)=>{if(!req.url?.startsWith('/__immersive'))return next();res.setHeader('Content-Type','text/html');res.end(await server.transformIndexHtml(req.url,'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}*{box-sizing:border-box}#root{padding:10px 8px 80px}</style></head><body><div id="root"></div><script type="module" src="/.media-build/immersive-ui/entry.jsx"></script></body></html>'))})}}]});
const languages=['en','es','pt','ja','zh','ko','fr','de','ar','it'];
let browser,diagnostics=[];
try{
 await server.listen();const base='http://127.0.0.1:'+server.httpServer.address().port+'/__immersive';
 for(const [engineName,engine]of Object.entries({chromium,webkit})){
  browser=await engine.launch({headless:true,args:engineName==='chromium'?['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']:[]});
  const context=await browser.newContext({viewport:{width:390,height:844}}),audioRequests=[],speakingStarts=[],adventureRequests=[],activityPings=[],errors=diagnostics=[];
  await context.addInitScript(()=>{
   localStorage.clear();localStorage.setItem('continuumCorrectSound','off');
   window.Audio=class extends EventTarget{
    constructor(src){super();this.src=src;this.paused=true;this.currentTime=0;this.playbackRate=1;}
    get currentTime(){return (this.elapsed||0)+(this.paused?0:(Date.now()-this.started)/1000)}
    set currentTime(value){this.elapsed=value;this.started=Date.now()}
    async play(){this.started=Date.now();this.paused=false;this.onplaying?.();if(!window.__holdStudioAudio)this.timer=setTimeout(()=>{if(!this.paused){this.currentTime=1;this.onended?.()}},90)}
    pause(){this.elapsed=this.currentTime;this.paused=true;clearTimeout(this.timer);this.onpause?.()}
    removeAttribute(){}load(){}
   };
  });
  await context.route('**/api/**',async route=>{
   const request=route.request(),url=new URL(request.url()),path=url.pathname;
   const json=data=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
   if(path==='/api/activity/heartbeat'){activityPings.push(request.postDataJSON());return json({ok:true})}
   if(path.startsWith('/api/immersive/content/'))return json({units:await loadImmersivePack(path.split('/').at(-1))});
   if(path.startsWith('/api/immersive/audio/')){audioRequests.push(path);return route.fulfill({status:200,contentType:'audio/wav',headers:{'X-Audio-Source':'AI-generated studio voice'},body:Buffer.from('synthetic-browser-sequencing-fixture')})}
   if(path==='/api/adventure'){adventureRequests.push(url.search);return json({companion:'fox'})}
   if(path.startsWith('/api/learning/light'))return json(path.endsWith('/progress')?{completed:[],placements:[]}:{record:null});
   if(path==='/api/speaking/usage')return json({usage:null});
   if(path==='/api/speaking'&&request.method()==='GET')return json({available:true,premium:true,sessions:[]});
   if(path==='/api/speaking'&&request.method()==='POST'){
    const data=request.postDataJSON();speakingStarts.push(data);
    return json({session:{id:'00000000-0000-4000-8000-000000000444',language:data.language,level:data.level,scenario:data.scenario,status:'active',revision:0,at:'2026-11-14T12:00:00Z',messages:[{role:'assistant',text:'Which proposal would you support?',mode:'text'}],budget:{maxTurns:30,limitSeconds:420,usedSeconds:0}}});
   }
   if(path.endsWith('/activity'))return json({budget:{maxTurns:30,limitSeconds:420,usedSeconds:0}});
   return route.fulfill({status:503,contentType:'application/json',body:'{}'});
  });
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(/same key|unique.*key/i.test(message.text()))errors.push(message.text())});
  // A failed native import must leave answers disabled and offer a recovery.
  let rejected=false;
  await page.route('**/immersive/ar.mjs*',async route=>{if(!rejected){rejected=true;await route.abort()}else await route.continue()});
  await page.goto(base+'?language=ar');
  await page.locator('.immersive-material-error').waitFor();
  assert.ok(await page.locator('.light-game-choices button').first().isDisabled());
  await page.locator('.immersive-material-error button').click();
  await page.locator('.immersive-excerpt').waitFor();
  assert.ok(await page.locator('.light-game-choices button').first().isEnabled());
  await page.unroute('**/immersive/ar.mjs*');
  for(const language of languages)for(const stage of ['reading','listening','roleplay','checkpoint']){
   await page.goto(base+'?language='+language+'&stage='+stage);
   await page.locator('.immersive-material').waitFor();
   await page.locator('.light-game-choices button:not([disabled])').first().waitFor();
   assert.equal(await page.locator('.immersive-scene .town-companion').count(),1,language+'/'+stage);
   assert.equal(await page.locator('.town-listen-stage').count(),0,'no duplicate old scene');
   assert.equal(await page.locator('.town-question-card').count(),1);
   const unit=await loadImmersiveUnit(language,'market');
   if(stage==='reading')assert.equal((await page.locator('.immersive-excerpt').innerText()).trim(),unit.reading[0].text);
   if(stage==='listening')assert.equal(await page.locator('.immersive-source > details').first().getAttribute('open'),null,'transcript starts hidden');
   if(stage==='roleplay')assert.equal((await page.locator('.immersive-dialogue-line').innerText()).trim(),unit.questions.roleplay[0].sceneLine);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),language+' has no horizontal overflow');
   assert.equal(audioRequests.length,0,'navigation alone must not generate audio');
  }
  // Progress through all six distinct source windows in one mounted Light lesson.
  await page.goto(base+'?language=pt&key=tourism');
  const lesson=getLesson('pt-immersive-tourism-v1-reading'),activities=lightActivities(lesson);
  for(const [i,a]of activities.entries()){
   await page.locator('.light-game-choices button:not([disabled])').first().waitFor();
   assert.equal(await page.locator('.immersive-source-head span').innerText(),'Part '+(i+1)+' of 6');
   await page.locator('.light-game-choices button').nth(a.options.indexOf(a.meaning)).click();
   await page.locator('.light-game-footer .town-cta').click();
   await page.locator('.town-question-card[data-feedback="correct"]').waitFor();
   assert.equal(await page.locator('.immersive-scene').count(),1);
   await page.locator('.light-game-footer .town-cta').click();
  }
  await page.locator('.town-result').waitFor();assert.match(await page.locator('.town-result').innerText(),/6\/6/);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('continuumLightV5:guest:pt-immersive-tourism-v1-reading')));
  assert.equal(saved.state.steps.length,6);assert.ok(saved.completedAt);
  // Full audio walks each canonical part once; guided dialogue asks one turn.
  await page.goto(base+'?language=ja&stage=listening');await page.locator('.immersive-material').waitFor();
  await page.locator('.immersive-audio .text-button').click();await page.locator('.immersive-audio .sentence-play').click();
  await page.waitForFunction(()=>!document.querySelector('.immersive-audio .sentence-play')?.disabled);
  for(let i=0;i<100&&audioRequests.length<6;i++)await page.waitForTimeout(30);
  assert.deepEqual(audioRequests.splice(0),Array.from({length:6},(_,i)=>'/api/immersive/audio/ja-immersive-market-v1-listening/listening/'+i));
  await page.goto(base+'?language=ja&stage=roleplay');await page.locator('.immersive-material').waitFor();
  await page.locator('.immersive-audio .sentence-play').click();await page.waitForTimeout(350);
  assert.deepEqual(audioRequests.splice(0),['/api/immersive/audio/ja-immersive-market-v1-roleplay/roleplay/0']);
  // Standard retains the full source and an independent draft when switching.
  await page.goto(base+'?language=en&mode=standard&live=1');await page.locator('.immersive-reading').first().waitFor();
  assert.equal(await page.locator('.immersive-source > .immersive-reading > p').count(),6);
  await page.locator('.standard-lesson-pane .answers button').nth(getLesson('en-immersive-market-v1-reading').questions[0].answer).click();
  await page.locator('.standard-lesson-pane .question-card > .primary').click();
  await page.locator('.standard-lesson-pane .feedback.good').waitFor();
  await page.locator('.standard-lesson-pane .question-card > .primary').click();
  await page.waitForFunction(()=>document.querySelector('.standard-lesson-pane .immersive-source-head span')?.textContent==='Part 2 of 6');
  assert.equal(adventureRequests.length,1,'Standard companion selection is fetched once across consecutive questions');
  await page.locator('.standard-lesson-pane .practice-top select').selectOption('light');
  await page.locator('.light-lesson-pane .immersive-excerpt').waitFor();
  assert.equal(await page.locator('.light-lesson-pane .immersive-scene').count(),1);
  await page.locator('.light-lesson-pane .lesson-mode-compact select').selectOption('standard');
  await page.locator('.standard-lesson-pane:visible .immersive-source-head span').waitFor();
  assert.equal(await page.locator('.standard-lesson-pane .immersive-source-head span').innerText(),'Part 2 of 6');
  // Long detached narration remains study activity beyond the 90-second idle
  // cutoff, without creating a second activity timer or extra heartbeat stream.
  await page.goto(base+'?language=en');
  const timingPage=await context.newPage();timingPage.on('pageerror',e=>errors.push(e.message));
  await timingPage.clock.install();await timingPage.goto(base+'?language=en&mode=standard&live=1');await timingPage.bringToFront();await timingPage.locator('.immersive-reading').first().waitFor();
  await timingPage.evaluate(()=>{window.__holdStudioAudio=true});
  await timingPage.locator('.immersive-audio .sentence-play').click();
  await timingPage.waitForFunction(()=>document.querySelector('.immersive-audio .sentence-play')?.getAttribute('aria-label')==='Stop audio');
  await timingPage.waitForTimeout(40);
  await Promise.all([timingPage.waitForResponse(r=>r.url().endsWith('/api/activity/heartbeat')),timingPage.clock.fastForward(95000)]);
  assert.equal(activityPings.at(-1).active,true,'foreground narration remains active after 90 seconds without input');
  await timingPage.locator('.immersive-audio .sentence-play').click();await timingPage.waitForTimeout(40);
  await Promise.all([timingPage.waitForResponse(r=>r.url().endsWith('/api/activity/heartbeat')),timingPage.clock.fastForward(95000)]);
  assert.equal(activityPings.at(-1).active,false,'stopped and idle narration does not inflate study time');
  await timingPage.close();audioRequests.length=0;
  // Live room uses the chapter scenario/level and suspends its underlying scene.
  adventureRequests.length=0;await page.goto(base+'?language=en&key=tourism&stage=roleplay&live=1');
  await page.locator('.immersive-live .outline-button').click();
  const dialog=page.locator('dialog[open]');await dialog.waitFor();
  await dialog.locator('.speaking-setup select').waitFor();assert.equal(await dialog.locator('.speaking-setup select').inputValue(),'B2');assert.ok(await dialog.locator('.speaking-setup select').isDisabled());
  await dialog.locator('.speaking-consent input').check();await dialog.locator('.speaking-setup > .primary').click();
  await dialog.locator('.voice-stage .companion-3d').waitFor();
  assert.equal(speakingStarts.at(-1).scenario,'en-immersive-tourism-v1');assert.equal(speakingStarts.at(-1).language,'en');assert.equal(speakingStarts.at(-1).level,'B2');
  assert.equal(await page.locator('.immersive-scene').getAttribute('inert'),'');
  assert.equal(adventureRequests.length,1,'Light material reuses the parent companion selection');
  if(engineName==='chromium')await page.waitForFunction(()=>document.querySelector('dialog .companion-3d')?.dataset.ready==='true');
  await page.screenshot({path:new URL(engineName+'-live-room.png',directory).pathname,fullPage:false});
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog')?.open);
  assert.equal(await page.locator('dialog canvas').count(),0,'closing unmounts the live renderer');
  await page.goto(base+'?language=ar&display=ar');await page.locator('.immersive-excerpt').waitFor();
  assert.equal(await page.locator('html').getAttribute('dir'),'rtl');assert.equal(await page.locator('.immersive-excerpt').getAttribute('dir'),'auto');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:new URL(engineName+'-arabic-phone.png',directory).pathname,fullPage:true});
  await page.setViewportSize({width:1280,height:900});await page.goto(base+'?language=en&key=heat&mode=standard');await page.locator('.immersive-reading').first().waitFor();
  await page.screenshot({path:new URL(engineName+'-c1-desktop.png',directory).pathname,fullPage:true});
  assert.deepEqual(errors,[]);console.log('PASS '+engineName+': forty native Light stages, failed-load recovery, full six-question save, ordered audio, current dialogue turn, Standard/Light draft preservation, embedded chapter conversation, modal cleanup and Arabic phone layout.');
  await context.close();await browser.close();browser=null;
 }
}catch(error){if(browser){let i=0;for(const context of browser.contexts())for(const page of context.pages()){await page.screenshot({path:new URL('failure-'+i+'.png',directory).pathname,fullPage:true}).catch(()=>{});await writeFile(new URL('failure-'+i+'.txt',directory),(await page.locator('body').innerText().catch(()=>String(error)))+'\nBrowser errors:\n'+JSON.stringify(diagnostics,null,2));i++}}throw error
}finally{await browser?.close();await server.close();await rm(new URL('entry.jsx',directory),{force:true})}
