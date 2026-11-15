// Real lesson components and native source imports; provider calls are mocked.
// This verifies UI/state/audio sequencing, not acoustic pronunciation quality.
import assert from 'node:assert/strict';
import {mkdir,writeFile,rm} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium,webkit} from 'playwright';
import {getLesson,getLessonVariant} from '../course.mjs';
import {immersiveSceneArt} from '../immersive/scene-art.mjs';
import {translationKey} from '../localization-corpus.mjs';
import {lightActivities} from '../light-learning-model.mjs';
import {loadImmersiveUnit,loadImmersivePack} from '../immersive/loader.mjs';
const directory=new URL('../.media-build/immersive-ui/',import.meta.url);await mkdir(directory,{recursive:true});
await writeFile(new URL('entry.jsx',directory),`
import React from 'react';import{createRoot}from'react-dom/client';
import LightLesson from '../../LightLesson.jsx';import{LessonPlayer}from'../../SelfStudy.jsx';
import{LanguageContext}from'../../LanguageContext.jsx';import{getLesson,chapters,lessonList}from'../../course.mjs';
import{JourneyLayoutContext}from'../../JourneyLayout.jsx';
import Passport from '../../Passport.jsx';
import{setInterfaceLanguage,bindInterfaceAccount}from'../../interface-runtime.mjs';
import{useActivityTracker,useStudyActivity}from'../../LearningActivity.jsx';
import SentenceAudio from '../../SentenceAudio.jsx';
import '../../styles.css';import '../../features.css';import '../../continuum-ui.css';
import '../../light-learning.css';import '../../light-motion.css';
const p=new URLSearchParams(location.search),language=p.get('language')||'en',key=p.get('key')||'market',stage=p.get('stage')||'reading';
setInterfaceLanguage(p.get('display')||'en',{persist:false});
const lesson=p.has('legacy')?lessonList.find(l=>l.language==='en'&&!l.immersive&&l.level==='B1'&&l.expressions?.length):getLesson(language+'-immersive-'+key+'-v1-'+stage),user=p.has('live')||p.has('display')?{id:'synthetic-immersive-browser',role:'learner'}:null;
const complete=async result=>({id:'synthetic-completion',...result});
const props={lesson,language,user,autoStart:true,lightAutoStart:true,initialAnswers:p.has('intro')?undefined:[],initialSeed:p.get('seed')||undefined,onDraft:async(_answers,seed)=>{window.__draftSeed=seed},onComplete:complete,onExit:()=>{},onStandard:()=>{}};
function AudioSwap(){const[part,setPart]=React.useState(0);useStudyActivity(true);return <section className="audio-swap-fixture"><SentenceAudio text={part?'A different narrated example.':'The first narrated example.'} lang="en-US" audioEndpoint={'/api/immersive/audio/en-immersive-market-v1-reading/reading/'+part}/><button onClick={()=>setPart(1)}>Change narration text</button></section>}
function App(){useActivityTracker(user);React.useEffect(()=>{if(user)void bindInterfaceAccount(user)},[]);return <JourneyLayoutContext.Provider value={{layout:p.get('layout')||'photo'}}><LanguageContext.Provider value={language}>{p.has('audioSwap')?<AudioSwap/>:p.has('passport')?<Passport language={language} stamps={[{id:'chapter:'+lesson.chapter,kind:'chapter',title:chapters.find(c=>c.id===lesson.chapter).title,at:'2026-11-14T12:00:00Z'}]}/>:<div className="app continuum-ui"><main style={{width:'100%',maxWidth:760,margin:'auto'}}>{p.get('mode')==='standard'?<LessonPlayer {...props}/>:<LightLesson {...props}/>}</main></div>}</LanguageContext.Provider></JourneyLayoutContext.Provider>}
createRoot(document.getElementById('root')).render(<App/>);
`);
const server=await createServer({configFile:false,optimizeDeps:{entries:[new URL('entry.jsx',directory).pathname]},server:{host:'127.0.0.1',port:0,hmr:false},appType:'custom',plugins:[{name:'immersion-ui',configureServer(server){server.middlewares.use(async(req,res,next)=>{if(!req.url?.startsWith('/__immersive'))return next();res.setHeader('Content-Type','text/html');res.end(await server.transformIndexHtml(req.url,'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}*{box-sizing:border-box}#root{padding:10px 8px 80px}</style></head><body><div id="root"></div><script type="module" src="/.media-build/immersive-ui/entry.jsx"></script></body></html>'))})}}]});
const languages=['en','es','pt','ja','zh','ko','fr','de','ar','it'];
const liveOnly=process.argv.includes('--live-only');
let browser,diagnostics=[],pendingRequests=new Map();
// Lessons assert their own visible readiness; unrelated media must not hold
// navigation open after the document and requested lesson are available.
const navigate=(page,url)=>page.goto(url,{waitUntil:'domcontentloaded'});
try{
 await server.listen();const base='http://127.0.0.1:'+server.httpServer.address().port+'/__immersive';
 for(const [engineName,engine]of Object.entries({chromium,webkit})){
  browser=await engine.launch({headless:true,args:engineName==='chromium'?['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']:[]});
  const context=await browser.newContext({viewport:{width:390,height:844}}),audioRequests=[],speakingStarts=[],speakingTurns=[],adventureRequests=[],activityPings=[],lightRecords=new Map(),errors=diagnostics=[];
  pendingRequests=new Map();
  context.on('request',r=>pendingRequests.set(r,{url:r.url(),type:r.resourceType(),at:Date.now()}));
  context.on('requestfinished',r=>pendingRequests.delete(r));context.on('requestfailed',r=>pendingRequests.delete(r));
  const initializeBrowser=()=>{
   localStorage.clear();localStorage.setItem('continuumCorrectSound','off');
   window.Audio=class extends EventTarget{
    constructor(src){super();this.src=src;this.paused=true;this.currentTime=0;this.playbackRate=1;}
    get currentTime(){return (this.elapsed||0)+(this.paused?0:(Date.now()-this.started)/1000)}
    set currentTime(value){this.elapsed=value;this.started=Date.now()}
    async play(){this.started=Date.now();this.paused=false;this.onplaying?.();if(!window.__holdStudioAudio)this.timer=setTimeout(()=>{if(!this.paused){this.currentTime=1;this.onended?.()}},90)}
    pause(){this.elapsed=this.currentTime;this.paused=true;clearTimeout(this.timer);this.onpause?.()}
    removeAttribute(){}load(){}
   };
  };
  await context.addInitScript(initializeBrowser);
  let liveSession=null,failNextTurn=true;
  const apiRoute=async route=>{
   const request=route.request(),url=new URL(request.url()),path=url.pathname;
   const json=data=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
   if(path==='/api/interface-language')return json({language:new URL(request.headers().referer).searchParams.get('display')||'en'});
   if(path==='/api/localization'){
    const data=request.postDataJSON(),q=getLesson('ar-immersive-market-v1-reading').questions[0];
    const translated=new Map([[q.prompt,'ما الهدف من الاقتراح؟'],[q.options[0],'نقل جميع الأكشاك الاثني عشر إلى الحديقة.'],[q.options[1],'تحويل السوق إلى فعالية مسائية دائمة.'],[q.options[2],'تجربة تمديد ساعات العمل لمدة ستة أسابيع.']]);
    if(data.locale==='ja'){
     const archive=getLesson('en-immersive-archives-v1-reading').questions[0];
     translated.clear();translated.set(archive.prompt,'公開事業では、どの区別を重視すべきですか。');
     archive.options.forEach((text,i)=>translated.set(text,[
      '検索しやすくなれば、欠けていた歴史的経験も必ず反映される。',
      '残された寄贈資料の一部も、デジタル化すれば完全な記録と見なせる。',
      '検索のしやすさが向上しても、資料がすべての人を等しく代表するとは限らない。'][i]));
     translated.set(archive.note,'資料へのアクセスと、その資料が誰を代表するかは別の問題です。');
    }
    return json({translations:data.items.filter(i=>translated.has(i.text)).map(i=>({id:translationKey(i.text,i.language||''),text:translated.get(i.text)}))});
   }
   if(path==='/api/activity/heartbeat'){activityPings.push(request.postDataJSON());return json({ok:true})}
   if(path.startsWith('/api/immersive/content/'))return json({units:await loadImmersivePack(path.split('/').at(-1))});
   if(path.startsWith('/api/immersive/audio/')){audioRequests.push(path);return route.fulfill({status:200,contentType:'audio/wav',headers:{'X-Audio-Source':'AI-generated studio voice'},body:Buffer.from('synthetic-browser-sequencing-fixture')})}
   if(path==='/api/adventure'){adventureRequests.push(url.search);return json({companion:new URL(request.headers().referer).searchParams.get('kind')||'fox'})}
   if(path.startsWith('/api/learning/light')){
    if(path.endsWith('/progress'))return json({completed:[],placements:[]});
    if(request.method()==='PUT'){
     const data=request.postDataJSON(),at=new Date().toISOString();
     const record={id:data.id,revision:data.revision+1,state:data.state,at,completedAt:data.state.steps.length===6?at:null};
     lightRecords.set(path,record);return json({record});
    }
    return json({record:lightRecords.get(path)||null});
   }
   if(path==='/api/speaking/usage')return json({usage:null});
   if(path==='/api/speaking'&&request.method()==='GET')return json({available:true,premium:true,sessions:[]});
   if(path==='/api/speaking'&&request.method()==='POST'){
    const data=request.postDataJSON();speakingStarts.push(data);
    liveSession={id:'00000000-0000-4000-8000-000000000444',language:data.language,level:data.level,scenario:data.scenario,status:'active',revision:0,at:'2026-11-14T12:00:00Z',messages:[{role:'assistant',text:data.language==='ar'?'ما الاقتراح الذي تؤيده؟':'Which proposal would you support?',mode:'text'}],budget:{maxTurns:30,limitSeconds:420,usedSeconds:0}};return json({session:liveSession});
   }
   if(path.endsWith('/turn')){
    const data=request.postDataJSON();speakingTurns.push(data);
    if(failNextTurn){failNextTurn=false;return route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'A reply is still being prepared. Please wait.'})})}
    assert.equal(data.revision,liveSession.revision);
    liveSession={...liveSession,revision:liveSession.revision+1,messages:[...liveSession.messages,{role:'user',text:data.text,mode:'text'},{role:'assistant',text:'Let us review that proposal. '+(liveSession.revision+1),mode:'text'}]};return json({session:liveSession});
   }
   if(path.endsWith('/review')){liveSession={...liveSession,review:{reviewTier:'basic',summary:'Your practice is saved.',strengths:['You explained your proposal.'],score:82}};return json({session:liveSession})}
   if(path.endsWith('/activity'))return json({budget:{maxTurns:30,limitSeconds:420,usedSeconds:0}});
   return route.fulfill({status:503,contentType:'application/json',body:'{}'});
  };
  await context.route('**/api/**',apiRoute);
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',message=>{if(/same key|unique.*key/i.test(message.text()))errors.push(message.text())});
  if(!liveOnly){
  // A failed native import must leave answers disabled and offer a recovery.
  let rejected=false;
  await page.route('**/immersive/ar.mjs*',async route=>{if(!rejected){rejected=true;await route.abort()}else await route.continue()});
  await navigate(page,base+'?language=ar');
  await page.locator('.immersive-material-error').waitFor();
  assert.ok(await page.locator('.light-game-choices button').first().isDisabled());
  await page.locator('.immersive-material-error button').click();
  await page.locator('.immersive-excerpt').waitFor();
  assert.ok(await page.locator('.light-game-choices button').first().isEnabled());
  await page.unroute('**/immersive/ar.mjs*');
  for(const language of languages)for(const stage of ['reading','listening','roleplay','checkpoint']){
   await navigate(page,base+'?language='+language+'&stage='+stage);
   await page.locator('.immersive-material').waitFor();
   await page.locator('.light-game-choices button:not([disabled])').first().waitFor();
   assert.equal(await page.locator('.immersive-scene .town-companion').count(),1,language+'/'+stage);
   assert.equal(await page.locator('.town-listen-stage').count(),1,'one approved cafe scene');
   assert.equal(await page.locator('.town-question-card').count(),1);
   const unit=await loadImmersiveUnit(language,'market');
   if(stage==='reading')assert.equal((await page.locator('.immersive-excerpt').innerText()).trim(),unit.reading[0].text);
   if(stage==='listening')assert.equal(await page.locator('.immersive-source > details').first().getAttribute('open'),null,'transcript starts hidden');
   if(stage==='roleplay')assert.equal((await page.locator('.immersive-dialogue-line').innerText()).trim(),unit.questions.roleplay[0].sceneLine);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),language+' has no horizontal overflow');
   assert.equal(audioRequests.length,0,'navigation alone must not generate audio');
  }
  // Progress through all six distinct source windows in one mounted Light lesson.
  await navigate(page,base+'?language=pt&key=tourism');
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
  await navigate(page,base+'?language=ja&stage=listening');await page.locator('.immersive-material').waitFor();
  await page.locator('.immersive-audio .text-button').click();await page.locator('.immersive-audio .sentence-play').click();
  await page.waitForFunction(()=>!document.querySelector('.immersive-audio .sentence-play')?.disabled);
  for(let i=0;i<100&&audioRequests.length<6;i++)await page.waitForTimeout(30);
  assert.deepEqual(audioRequests.splice(0),Array.from({length:6},(_,i)=>'/api/immersive/audio/ja-immersive-market-v1-listening/listening/'+i));
  await navigate(page,base+'?language=ja&stage=roleplay');await page.locator('.immersive-material').waitFor();
  await page.locator('.immersive-audio .sentence-play').click();await page.waitForTimeout(350);
  assert.deepEqual(audioRequests.splice(0),['/api/immersive/audio/ja-immersive-market-v1-roleplay/roleplay/0']);
  // Standard retains the full source and an independent draft when switching.
  await navigate(page,base+'?language=en&mode=standard&live=1');await page.locator('.immersive-reading').first().waitFor();
  assert.equal(await page.locator('.immersive-source > .immersive-reading > p').count(),6);
  await page.locator('.standard-lesson-pane .answers button').nth(getLesson('en-immersive-market-v1-reading').questions[0].answer).click();
  await page.locator('.standard-lesson-pane .question-card > .primary').click();
  await page.locator('.standard-lesson-pane .feedback.good').waitFor();
  await page.locator('.standard-lesson-pane .question-card > .primary').click();
  await page.waitForFunction(()=>document.querySelector('.standard-lesson-pane .immersive-source-head span')?.textContent==='Part 2 of 6');
  assert.equal(adventureRequests.length,0,'Standard reading does not request an unused companion');
  await page.locator('.standard-lesson-pane .practice-top select').selectOption('light');
  await page.locator('.light-lesson-pane .immersive-excerpt').waitFor();
  assert.equal(await page.locator('.light-lesson-pane .immersive-scene').count(),1);
  await page.locator('.light-lesson-pane .lesson-mode-compact select').selectOption('standard');
  await page.locator('.standard-lesson-pane:visible .immersive-source-head span').waitFor();
  assert.equal(await page.locator('.standard-lesson-pane .immersive-source-head span').innerText(),'Part 2 of 6');
  // Every learning language uses still art in both standard styles and both source stages.
  for(const language of languages)for(const stage of ['reading','listening'])for(const layout of ['photo','illustrated']){
   await navigate(page,base+'?language='+language+'&key=archives&stage='+stage+'&mode=standard&layout='+layout);
   const art=page.locator('.immersive-static-scene .visual-practice-photo');await art.waitFor();
   await art.evaluate(img=>img.complete&&img.naturalWidth?Promise.resolve():new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Scene image failed'))}));
   assert.equal(await art.getAttribute('src'),immersiveSceneArt(getLesson(language+'-immersive-archives-v1-'+stage),layout));
   assert.equal(await page.locator('.immersive-static-scene .town-companion,canvas').count(),0,'standard uses appropriate still images without procedural avatars');
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   if(language==='en'&&stage==='reading')await page.screenshot({path:new URL(engineName+'-standard-'+layout+'.png',directory).pathname,fullPage:false});
  }
  await navigate(page,base+'?language=en&key=tourism&stage=roleplay&mode=standard&live=1');
  await page.locator('.immersive-live .outline-button').waitFor();
  assert.equal(await page.locator('.immersive-static-scene').count(),0,'speaking entry has no unrelated large still image');
  await navigate(page,base+'?language=en&legacy=1&live=1&kind=capybara');
  await page.locator('.town-listen-stage .town-companion[data-companion=capybara]').waitFor();
  assert.equal(await page.locator('.town-listen-stage>img').getAttribute('src'),'/light-town/cafe.webp');
  assert.equal(await page.locator('.town-companion-sprite').getAttribute('src'),'/light-town/capybara.webp');
  assert.equal(await page.locator('canvas').count(),0);
  await page.screenshot({path:new URL(engineName+'-restored-light.png',directory).pathname,fullPage:false});
  // Standard checkpoint retakes carry their authored revision in the seed.
  await navigate(page,base+'?language=en&stage=checkpoint&mode=standard&intro=1');
  await page.getByRole('button',{name:'Start practice',exact:false}).click();
  await page.locator('.standard-lesson-pane .immersive-source-head span').waitFor();
  const checkpointSeed=await page.evaluate(()=>window.__draftSeed);assert.match(checkpointSeed,/^v1-immersive-v1-/);
  const checkpoint=getLessonVariant('en-immersive-market-v1-checkpoint',checkpointSeed);
  assert.equal(await page.locator('.standard-lesson-pane .immersive-source-head span').innerText(),'Part '+(checkpoint.questions[0].immersiveSource.part+1)+' of 6');
  await navigate(page,base+'?language=en&stage=checkpoint&mode=standard&seed='+checkpointSeed);
  await page.locator('.standard-lesson-pane .immersive-source-head span').waitFor();
  assert.equal(await page.locator('.standard-lesson-pane .immersive-source-head span').innerText(),'Part '+(checkpoint.questions[0].immersiveSource.part+1)+' of 6');
  // Long detached narration remains study activity beyond the 90-second idle
  // cutoff, without creating a second activity timer or extra heartbeat stream.
  await navigate(page,base+'?language=en');
  // Page.clock controls its entire BrowserContext. Keep time travel out of
  // the real-time conversation/viewport/screenshot checks that follow.
  const timingContext=await browser.newContext({viewport:{width:390,height:844}});
  await timingContext.addInitScript(initializeBrowser);await timingContext.route('**/api/**',apiRoute);
  const timingPage=await timingContext.newPage();timingPage.on('pageerror',e=>errors.push(e.message));
  await timingPage.clock.install();await navigate(timingPage,base+'?language=en&mode=standard&live=1');await timingPage.bringToFront();await timingPage.locator('.immersive-reading').first().waitFor();
  await timingPage.evaluate(()=>{window.__holdStudioAudio=true});
  await timingPage.locator('.immersive-audio .sentence-play').click();
  await timingPage.waitForFunction(()=>document.querySelector('.immersive-audio .sentence-play')?.getAttribute('aria-label')==='Stop audio');
  await timingPage.waitForTimeout(40);
  await Promise.all([timingPage.waitForResponse(r=>r.url().endsWith('/api/activity/heartbeat')),timingPage.clock.fastForward(95000)]);
  assert.equal(activityPings.at(-1).active,true,'foreground narration remains active after 90 seconds without input');
  await timingPage.locator('.immersive-audio .sentence-play').click();await timingPage.waitForTimeout(40);
  await Promise.all([timingPage.waitForResponse(r=>r.url().endsWith('/api/activity/heartbeat')),timingPage.clock.fastForward(95000)]);
  assert.equal(activityPings.at(-1).active,false,'stopped and idle narration does not inflate study time');
  // Updating a persistent SentenceAudio source must release its audible owner.
  await navigate(timingPage,base+'?language=en&live=1&audioSwap=1');await timingPage.bringToFront();
  await timingPage.locator('.audio-swap-fixture .sentence-play').waitFor();
  await timingPage.evaluate(()=>{window.__holdStudioAudio=true});
  await timingPage.locator('.audio-swap-fixture .sentence-play').click();
  await timingPage.waitForFunction(()=>document.querySelector('.audio-swap-fixture .sentence-play')?.getAttribute('aria-label')==='Stop audio');
  await timingPage.getByRole('button',{name:'Change narration text',exact:true}).click();
  await timingPage.waitForFunction(()=>document.querySelector('.audio-swap-fixture .sentence-play')?.getAttribute('aria-label')==='Listen to this text');
  await timingPage.waitForTimeout(40);
  await Promise.all([timingPage.waitForResponse(r=>r.url().endsWith('/api/activity/heartbeat')),timingPage.clock.fastForward(95000)]);
  assert.equal(activityPings.at(-1).active,false,'a replaced narration source cannot leave an audible study owner behind');
  await timingContext.close();await page.bringToFront();audioRequests.length=0;
  }
  // Live room uses the chapter scenario/level and suspends its underlying scene.
  adventureRequests.length=0;await navigate(page,base+'?language=en&key=tourism&stage=roleplay&live=1');
  await page.locator('.immersive-live .outline-button').click();
  const dialog=page.locator('dialog.immersive-live-panel[open]');await dialog.waitFor();
  const bounds=await dialog.boundingBox(),viewport=page.viewportSize();
  assert.ok(bounds.x<=1&&bounds.y<=1&&Math.abs(bounds.width-viewport.width)<=1&&Math.abs(bounds.height-viewport.height)<=1,'live room fills the viewport');
  assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden','background scrolling is locked');
  await dialog.getByRole('button',{name:'Close live conversation',exact:true}).waitFor();
  assert.ok((await dialog.locator('h1').innerText()).includes('B2'));
  await dialog.locator('.speaking-consent input').check();await dialog.locator('.room-start-button').click();
  await dialog.locator('.immersive-room-actor .town-companion-sprite').waitFor();
  await dialog.getByText('Which proposal would you support?',{exact:true}).waitFor();
  assert.equal(await dialog.locator('canvas').count(),0,'the approved companion stays in use');
  assert.equal(await dialog.locator('.immersive-live-caption').count(),0,'no transcript is repeated over the companion');
  assert.equal(await dialog.getByText('Which proposal would you support?',{exact:true}).count(),1,'one visible transcript channel');
  assert.equal(await dialog.locator('.voice-preferences').count(),0,'voice settings are not in the main scene');
  const actor=await dialog.locator('.immersive-room-actor').boundingBox(),chat=await dialog.locator('.immersive-room-chat').boundingBox(),controls=await dialog.locator('.immersive-room-controls').boundingBox();
  assert.ok(actor.height>200&&actor.y+actor.height<=chat.y+1&&chat.y+chat.height<=controls.y+1,'actor, chat and controls have distinct viewport regions');
  assert.ok(controls.y+controls.height<=viewport.height+1,'controls remain in view');
  assert.ok(await dialog.evaluate(el=>el.scrollHeight<=el.clientHeight+1),'conversation fits without scrolling the whole dialog');
  await dialog.getByRole('button',{name:'Conversation settings',exact:true}).click();
  await dialog.locator('.voice-preferences select').first().waitFor();
  await page.keyboard.press('Escape');assert.ok(await dialog.isVisible(),'Escape closes settings before the live room');
  assert.equal(await dialog.locator('.immersive-room-settings').count(),0);
  assert.equal(speakingStarts.at(-1).scenario,'en-immersive-tourism-v1');assert.equal(speakingStarts.at(-1).language,'en');assert.equal(speakingStarts.at(-1).level,'B2');
  assert.equal(await page.locator('.immersive-scene').getAttribute('inert'),'');
  assert.equal(adventureRequests.length,1,'Light material reuses the parent companion selection');
  await page.screenshot({path:new URL(engineName+'-live-room.png',directory).pathname,fullPage:false});
  await page.setViewportSize({width:1280,height:900});
  await page.waitForFunction(()=>document.querySelector('.immersive-conversation-room').getBoundingClientRect().height===innerHeight);
  await page.screenshot({path:new URL(engineName+'-live-room-desktop.png',directory).pathname,fullPage:false});
  await page.setViewportSize({width:390,height:600});
  await dialog.getByRole('button',{name:'Text chat',exact:true}).click();
  const reply=dialog.locator('#immersive-reply');await reply.fill('I would support a small trial.');
  const inputBox=await reply.boundingBox();assert.ok(inputBox.y+inputBox.height<=600,'the input fits a shorter viewport');
  await reply.press('Enter');await dialog.locator('[role=alert]').waitFor();
  assert.equal(await reply.inputValue(),'I would support a small trial.','a failed send preserves the draft');
  await page.waitForFunction(()=>!document.querySelector('#immersive-reply').disabled);
  await reply.press('Enter');await dialog.getByText('Let us review that proposal. 1',{exact:true}).waitFor();
  assert.equal(speakingTurns.length,2);assert.equal(speakingTurns[0].turnKey,speakingTurns[1].turnKey,'retry keeps the idempotency key');
  assert.equal(await dialog.getByText('I would support a small trial.',{exact:true}).count(),1);
  assert.equal(await dialog.getByText('Which proposal would you support?',{exact:true}).count(),1);
  await reply.fill('We should review the results next month.');await reply.press('Enter');
  await dialog.getByText('Let us review that proposal. 2',{exact:true}).waitFor();
  assert.ok(await dialog.getByRole('button',{name:'Finish and get review',exact:true}).isEnabled());
  // Keep functional layout checks independent of optional capture tooling:
  // headless capture stalls after input in this fixture; initial/desktop/RTL
  // viewport captures remain required below and above.
  const textControls=await dialog.locator('.immersive-room-controls').boundingBox();
  assert.ok(textControls.y+textControls.height<=600,'text controls stay in the short viewport after replies');
  assert.ok(await dialog.evaluate(el=>el.scrollHeight<=el.clientHeight+1),'typed replies do not overflow the dialog');
  await reply.blur();
  await page.setViewportSize({width:390,height:844});
  await dialog.getByRole('button',{name:'Finish and get review',exact:true}).click();
  await dialog.locator('.conversation-review').waitFor();

  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('dialog.immersive-live-panel')?.open);
  assert.equal(await page.locator('dialog canvas').count(),0,'closing unmounts the live renderer');
  assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden','closing restores background scrolling');
  await page.locator('.immersive-live .outline-button').click();
  await dialog.getByRole('button',{name:'Close live conversation',exact:true}).click();
  await page.waitForFunction(()=>!document.querySelector('dialog.immersive-live-panel')?.open);
  assert.equal(await page.locator('dialog canvas').count(),0,'the persistent close control also cleans up');
  await navigate(page,base+'?language=en&key=archives&stage=reading&mode=standard&display=ja');
  await page.waitForFunction(()=>document.querySelector('.immersive-reading'));
  assert.ok((await page.locator('.lesson-context > b').innerText()).includes('デジタル資料館'),'Japanese display translates the English course heading');
  assert.ok((await page.locator('.immersive-reading').first().innerText()).includes('archive'),'English learning passage stays English');
  assert.equal(await page.locator('.lesson-context .lesson-translation').count(),0,'bundled headings need no translation request');
  await page.screenshot({path:new URL(engineName+'-japanese-heading.png',directory).pathname,fullPage:false});
  await navigate(page,base+'?language=ar&display=ar');await page.locator('.immersive-excerpt').waitFor();
  await page.waitForFunction(()=>!document.querySelector('.lesson-translation'));assert.equal((await page.locator('.town-question-card .question-prompt h1').innerText()).trim(),'ما الهدف من الاقتراح؟');assert.equal(await page.locator('html').getAttribute('dir'),'rtl');assert.equal(await page.locator('.immersive-excerpt').getAttribute('dir'),'auto');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:new URL(engineName+'-arabic-phone.png',directory).pathname,fullPage:true});
  await navigate(page,base+'?language=ar&key=tourism&stage=roleplay&live=1&display=ar');
  await page.locator('.immersive-live .outline-button').click();
  await dialog.locator('.speaking-consent input').check();await dialog.locator('.room-start-button').click();
  await dialog.getByText('ما الاقتراح الذي تؤيده؟',{exact:true}).waitFor();
  assert.equal(await dialog.getByText('ما الاقتراح الذي تؤيده؟',{exact:true}).count(),1);
  assert.equal(await dialog.locator('.conversation-message p').getAttribute('dir'),'auto');
  await dialog.getByRole('button',{name:'إعدادات المحادثة',exact:true}).waitFor();
  const rtlStatus=await dialog.locator('.room-voice-status').boundingBox(),rtlClose=await dialog.locator('.immersive-close').boundingBox();
  assert.ok(rtlStatus.x>=rtlClose.x+rtlClose.width,'RTL status reserves space for the close button');
  await page.screenshot({path:new URL(engineName+'-live-arabic.png',directory).pathname,fullPage:false});
  await page.keyboard.press('Escape');
  if(!liveOnly){
  await page.setViewportSize({width:1280,height:900});await navigate(page,base+'?language=en&key=heat&mode=standard');await page.locator('.immersive-reading').first().waitFor();
  await page.screenshot({path:new URL(engineName+'-c1-desktop.png',directory).pathname,fullPage:true});
  await page.setViewportSize({width:390,height:844});await navigate(page,base+'?language=ja&passport=1');
  const earnedStamp=page.locator('.passport-stamp:not([disabled])');assert.equal(await earnedStamp.count(),1);await earnedStamp.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const image=document.querySelector('.passport-stamp:not([disabled])>img');return image?.complete&&image.naturalWidth>0});
  assert.match(await earnedStamp.locator('img').getAttribute('src'),/^\/passport-stamps\/ja-/);
  await earnedStamp.click();await page.locator('.passport-dialog[open] img').waitFor();
  assert.equal(await page.locator('.passport-dialog .passport-scenery').count(),0,'new artwork is not mislabeled as a photograph');
  const stampFrame=await page.locator('.passport-dialog').boundingBox(),stampImage=await page.locator('.passport-dialog img').boundingBox();
  assert.ok(stampImage.x>=stampFrame.x&&stampImage.x+stampImage.width<=stampFrame.x+stampFrame.width,'the full illustrated stamp fits the phone dialog');

  await page.screenshot({path:new URL(engineName+'-immersion-stamp.png',directory).pathname,fullPage:false});
  await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('.passport-dialog').open);
  }
  assert.deepEqual(errors,[]);console.log('PASS '+engineName+(liveOnly?': focused conversation, retry, review, viewport and RTL.':': forty native Light stages, failed-load recovery, full six-question save, ordered audio, current dialogue turn, Standard/Light draft preservation, embedded chapter conversation, modal cleanup and Arabic phone layout.'));
  await context.close();await browser.close();browser=null;
 }
}catch(error){console.error('Pending browser requests:',JSON.stringify([...pendingRequests.values()].map(r=>({...r,ageMs:Date.now()-r.at})),null,2));if(browser){let i=0;for(const context of browser.contexts())for(const page of context.pages()){await page.screenshot({path:new URL('failure-'+i+'.png',directory).pathname,fullPage:true}).catch(()=>{});await writeFile(new URL('failure-'+i+'.txt',directory),(await page.locator('body').innerText().catch(()=>String(error)))+'\nBrowser errors:\n'+JSON.stringify(diagnostics,null,2));i++}}throw error
}finally{await browser?.close();await server.close();await rm(new URL('entry.jsx',directory),{force:true})}
