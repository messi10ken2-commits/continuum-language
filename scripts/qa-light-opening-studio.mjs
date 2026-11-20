// Real components, disposable guest state and synthetic membership; no production writes.
import assert from 'node:assert/strict';
import {mkdir,writeFile,rm} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium,webkit} from 'playwright';
const directory=new URL('../.media-build/light-opening-studio/',import.meta.url);
await mkdir(directory,{recursive:true});
await writeFile(new URL('entry.jsx',directory),`
import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import PracticeStudio from '../../PracticeStudio.jsx';
import SelfStudy from '../../SelfStudy.jsx';
import {JourneyLayoutContext} from '../../JourneyLayout.jsx';
import {setInterfaceLanguage} from '../../interface-runtime.mjs';
import '../../journey.css';import '../../illustrated-world.css';
import '../../styles.css';import '../../features.css';import '../../rpg-world.css';
import '../../reference-layout.css';import '../../quest-continuity.css';
import '../../approved-illustrated.css';import '../../continuum-ui.css';
const p=new URLSearchParams(location.search),layout=p.get('layout')||'illustrated';
setInterfaceLanguage(p.get('locale')||'en');
function Harness(){
 const [activeLesson,setLesson]=useState(null);
 return <JourneyLayoutContext.Provider value={{layout}}><div className={'app continuum-ui ui-'+layout}><main style={{gridColumn:'1/-1'}}><div className="content">
 {p.has('studio')?<PracticeStudio language="es" user={null} onSpeaking={()=>{}} onAccount={()=>{}}/>:
 <SelfStudy language="es" user={null} attempts={[]} activeLesson={activeLesson} onStart={setLesson} onExit={()=>setLesson(null)} onComplete={()=>{}}/>}
 </div></main></div></JourneyLayoutContext.Provider>;
}
createRoot(document.getElementById('root')).render(<Harness/>);
`);
const server=await createServer({configFile:false,server:{host:'127.0.0.1',port:0,hmr:false},appType:'custom',plugins:[{
 name:'light-opening-studio-harness',configureServer(server){server.middlewares.use(async(req,res,next)=>{
  if(!req.url?.startsWith('/__opening_studio'))return next();
  try{res.setHeader('Content-Type','text/html');res.end(await server.transformIndexHtml(req.url,'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/.media-build/light-opening-studio/entry.jsx"></script></body></html>'))}catch(e){next(e)}
 });}
}]});
let browser;
try{
 await server.listen();const base='http://127.0.0.1:'+server.httpServer.address().port;
 for(const engine of (process.env.QA_WEBKIT_ONLY?[webkit]:[chromium,webkit])){
  browser=await engine.launch({headless:true,...(engine===chromium?{executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox']}:{} )});
  const context=await browser.newContext({viewport:{width:390,height:844}});
  await context.route('**/api/**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(r.request().url().includes('/billing')?{membership:{premium:false,adFree:false,tier:'free'}}:{})}));
  await context.addInitScript(()=>{
   localStorage.setItem('continuumLearningMode:guest:es','light');
   sessionStorage.setItem('continuumWordTownOpeningSeen','1');
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  // A previous session marker must not suppress a fresh Light entry.
  await page.goto(base+'/__opening_studio');
  const video=page.locator('.town-opening video');await video.waitFor();
  await page.waitForFunction(()=>{const v=document.querySelector('.town-opening video');return v&&!v.paused&&v.currentTime>0});
  assert.ok(await video.evaluate(v=>v.muted&&v.playsInline&&v.videoWidth>0));
  // Keep capture outside WebKit's timing-sensitive media completion check.
  if(engine===chromium)await page.screenshot({path:new URL(engine.name()+'-opening.png',directory).pathname});
  const naturalVideo=engine===chromium||process.platform==='darwin';
  if(naturalVideo)await page.locator('.town-opening').waitFor({state:'detached'}).catch(async error=>{
   console.log('OPENING_MEDIA_STATE',await video.evaluate(v=>({time:v.currentTime,duration:v.duration,paused:v.paused,ended:v.ended,ready:v.readyState,network:v.networkState,error:v.error?.message,visibility:document.visibilityState,buffered:Array.from({length:v.buffered.length},(_,i)=>[v.buffered.start(i),v.buffered.end(i)])})));
   throw error;
  });
  else{
   // Linux WebKit's fully buffered H264 fixture stalls at ~0.167s in CI.
   // Assert a recoverable UI here; macOS WebKit must pass natural completion.
   await Promise.race([page.locator('.town-opening').waitFor({state:'detached'}),page.getByRole('button',{name:'Try again',exact:true}).waitFor()]);
   if(await page.locator('.town-opening').count())await page.locator('.town-opening-continue').click();
  }
  // Returning from a lesson does not repeat the opening; an explicit mode switch does.
  await page.locator('.town-mission .town-cta').click();
  await page.locator('.light-game').waitFor();
  await page.getByRole('button',{name:'Save & exit',exact:true}).click();
  await page.locator('.town-scene').waitFor();assert.equal(await page.locator('.town-opening').count(),0);
  await page.getByRole('combobox',{name:'Learning mode',exact:true}).selectOption('standard');
  await page.getByRole('button',{name:'Light',exact:true}).click();
  await video.waitFor();await page.locator('.town-opening-continue').click();
  assert.equal(await page.locator('.town-opening').count(),0);
  assert.equal(await page.locator('.town-opening-frame>[inert]').count(),0);
  // Browser/OS autoplay rejection leaves a working manual playback action.
  await page.addInitScript(()=>{const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){if(!window.__manualAllowed){this.autoplay=false;this.pause();return Promise.reject(new DOMException('Autoplay blocked','NotAllowedError'));}return play.call(this)}});
  await page.reload();await page.locator('.town-opening-play').waitFor();
  await page.evaluate(()=>{window.__manualAllowed=true});await page.locator('.town-opening-play').click();
  await page.waitForFunction(()=>document.querySelector('.town-opening video')?.currentTime>0);
  await page.locator('.town-opening-continue').click();
  // Failed media stays recoverable instead of being silently marked seen.
  await page.route('**/*word-town-opening*',r=>r.request().resourceType()==='media'?r.abort():r.continue());await page.reload();
  await page.getByRole('button',{name:'Try again',exact:true}).waitFor();
  await page.unroute('**/*word-town-opening*');await page.evaluate(()=>{window.__manualAllowed=true});
  await page.getByRole('button',{name:'Try again',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.town-opening video')?.currentTime>0);
  await page.locator('.town-opening-continue').click();
  await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.locator('.town-scene').waitFor();
  assert.equal(await page.locator('.town-opening').count(),0);
  for(const layout of ['illustrated','photo'])for(const locale of ['en','ja','es','pt','zh','fr','ko','id','ru','ar']){
   await page.goto(base+'/__opening_studio?studio&layout='+layout+'&locale='+locale);
   await page.locator('.studio-choice-premium').waitFor();
   await page.evaluate(()=>document.fonts.ready);
   for(const width of [320,390,768,1440]){
    await page.setViewportSize({width,height:900});
    const failures=await page.locator('.studio-choice').evaluateAll(cards=>cards.flatMap(card=>{
     const elements=[...card.querySelectorAll(':scope>strong,:scope>.studio-choice-description,:scope>.studio-choice-premium,:scope>.illustrated-card-action')];
     const bounds=card.getBoundingClientRect(),issues=[];
     for(let i=0;i<elements.length;i++){
      const a=elements[i].getBoundingClientRect();
      if(a.left<bounds.left-1||a.right>bounds.right+1||a.bottom>bounds.bottom+1)issues.push('outside '+elements[i].className);
      for(let j=i+1;j<elements.length;j++){const b=elements[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)issues.push('overlap '+elements[i].className+' / '+elements[j].className)}
     }
     return issues;
    }));
    assert.deepEqual(failures,[],engine.name()+' '+layout+' '+locale+' '+width);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),layout+' '+locale+' overflow');
    if(width===390&&locale==='en')await page.locator('.studio-review').screenshot({path:new URL(engine.name()+'-'+layout+'-review.png',directory).pathname});
   }
  }
  assert.deepEqual(errors,[]);await context.close();await browser.close();browser=null;
  console.log('PASS',engine.name(),'natural video completion:',naturalVideo,'Light entry/recovery/reduced motion; free studio cards in 10 locales, 4 widths and 2 layouts');
 }
}catch(error){
 const page=browser?.contexts()[0]?.pages()[0];
 if(page){await page.screenshot({path:new URL('failure.png',directory).pathname,fullPage:true}).catch(()=>{});await writeFile(new URL('failure.html',directory),await page.content().catch(()=>''))}
 throw error;
}finally{await browser?.close();await server.close();await rm(new URL('entry.jsx',directory),{force:true});}
