import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {build,preview} from 'vite';
import {chromium,webkit} from 'playwright';
import {worldLocations,worldScenes,isWorldWalkable,worldInteraction} from '../continuum-world-model.mjs';
import {worldMissions,availableWorldMissions,worldMission} from '../continuum-world-missions.mjs';
import {worldStory} from '../continuum-world-story.mjs';
const dir=new URL('../.media-build/world-phase3/',import.meta.url);await mkdir(dir,{recursive:true});
await writeFile(new URL('index.html',dir),'<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="module" src="./entry.jsx"></script></html>');
await writeFile(new URL('entry.jsx',dir),`
import React from 'react';import{createRoot}from'react-dom/client';import World from '../../ContinuumWorld.jsx';import{setInterfaceLanguage}from'../../interface-runtime.mjs';import '../../styles.css';
const p=new URLSearchParams(location.search);setInterfaceLanguage(p.get('locale')||'en',{persist:false});const user={id:'phase3-ui',role:'learner'};
const key='continuumWorld:tokyo:v1:'+user.id;if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({scene:'outdoors',quality:'low',music:false,reduced:true,time:'day'}));
if(p.get('wall')==='true')localStorage.setItem(key,JSON.stringify({...JSON.parse(localStorage.getItem(key)),scene:'outdoors',position:{x:7.3,z:-4.8},yaw:-.7,time:'day'}));
createRoot(document.getElementById('root')).render(<World user={user} onBack={()=>{}}/>);
`);
await build({configFile:false,build:{outDir:'.media-build/world-phase3/dist',rollupOptions:{input:new URL('index.html',dir).pathname}}});
const server=await preview({configFile:false,build:{outDir:'.media-build/world-phase3/dist'},preview:{host:'127.0.0.1',port:0}});
const base='http://127.0.0.1:'+server.httpServer.address().port+'/.media-build/world-phase3/index.html';
let browser,page;const results=[];
try{
 for(const name of (process.env.QA_BROWSERS||'chromium,webkit').split(','))for(const width of (process.env.QA_WORLD_WIDTHS||'390,1280').split(',').map(Number)){
  browser=await({chromium,webkit})[name].launch({headless:true,...(name==='chromium'?{executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']}:{} )});
  const ctx=await browser.newContext({viewport:{width,height:844},hasTouch:width===390});page=await ctx.newPage();page.setDefaultTimeout(90000);
  let travelCalls=0;let awards=[{mission_id:'cafe-order'},{mission_id:'shop-buy'}],choices={},lastMission;const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/**',async route=>{
   const request=route.request(),path=new URL(request.url()).pathname,d=request.method()==='GET'?{}:request.postDataJSON()||{};let value={};
   if(path==='/api/adventure')value={companion:'capybara'};
   else if(path==='/api/world/profile')value={enabled:true,available:true,level:'B1',settings:{onboarded:true,aiConsent:true,classContext:false,level:'auto'},consent:{enabled:false,version:0},missions:availableWorldMissions(awards),journey:worldStory(awards,choices),xp:awards.length*80,achievements:awards.map(a=>a.mission_id),memories:[],records:[]};
   else if(path==='/api/world/journey-choice'){choices[d.choiceId]=d.optionId;value={saved:true};}
   else if(path==='/api/world/travel'){travelCalls++;assert.ok(d.accessible===true||(isWorldWalkable(d.scene,d.position)&&worldInteraction(d.scene,d.position)?.district===d.district),'travel must originate from the matching train doorway');value={scene:d.district==='osaka'?'osaka':'outdoors',position:worldScenes[d.district==='osaka'?'osaka':'outdoors'].spawn,yaw:d.district==='osaka'?-.55:0};}
   else if(path==='/api/world/visits'){lastMission=d.missionId;value={startKey:d.startKey,scenario:'world-'+d.missionId};}
   else if(path==='/api/speaking'&&request.method()==='GET')value={sessions:[]};
   else if(path==='/api/speaking'&&request.method()==='POST'){const place=worldLocations.find(l=>l.id===worldMission(lastMission).location);value={session:{id:crypto.randomUUID(),scenario:'world-'+lastMission,level:'B1',language:'ja',revision:0,messages:[{role:'assistant',text:place.npc.line}]}};}
   await route.fulfill({json:value});
  });
  const ready=async()=>{await page.waitForFunction(()=>document.querySelector('.cw-renderer')?.dataset.active==='true'&&document.querySelector('.cw-renderer')?.dataset.peopleLoaded===document.querySelector('.cw-renderer')?.dataset.peopleTotal);};
  const list=async()=>{if(await page.getByRole('button',{name:'List view',exact:true}).count())await page.getByRole('button',{name:'List view',exact:true}).click();};
  const graphics=async()=>{if(await page.getByRole('button',{name:'3D view',exact:true}).count())await page.getByRole('button',{name:'3D view',exact:true}).click();await ready();};
  const noOverflow=async()=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.goto(base);await ready();await list();
  for(const id of ['tokyo_station_hall','tokyo_bookshop','tokyo_music','tokyo_asahi']){
   const place=worldLocations.find(l=>l.id===id),card=page.locator('.cw-place-list article').filter({has:page.getByRole('heading',{name:place.title,exact:true})});
   assert.equal(await card.getByRole('button',{name:'Locked',exact:true}).isDisabled(),true,id);
  }
  awards=worldMissions.filter(m=>m.type==='main').map(m=>({mission_id:m.id,day:'once'}));await page.reload();await ready();
  let canvas=await page.locator('.cw-canvas').elementHandle();const rooms=[];
  async function room(place){
   await list();await page.locator('.cw-place-list article').filter({has:page.getByRole('heading',{name:place.title,exact:true})}).getByRole('button',{name:'Enter',exact:true}).click();await graphics();
   await page.waitForFunction(id=>document.querySelector('.cw-world').dataset.scene===id,place.id);
   await page.locator('.cw-renderer').focus();await page.keyboard.down('KeyW');try{await page.waitForFunction(()=>JSON.parse(document.querySelector('.cw-renderer').dataset.position).z< -2.05,null,{timeout:25000});}finally{await page.keyboard.up('KeyW');}
   await page.getByRole('button',{name:'Talk',exact:true}).click();await page.locator('.cw-dialogue').waitFor();
   assert.equal(await page.locator('.cw-conversation').getAttribute('data-npc'),place.npc.id);await page.getByRole('button',{name:'Continue exploring',exact:true}).click();
   console.log('PASS room',name,width,place.id);await noOverflow();await page.screenshot({path:new URL(name+'-'+width+'-'+place.id+'.png',dir).pathname});
   assert.equal(await canvas.evaluate(c=>c===document.querySelector('.cw-canvas')),true,'buildings keep one renderer');
   assert.equal(await page.locator('.cw-renderer').getAttribute('data-people-decodes'),'2');rooms.push(await page.locator('.cw-renderer').evaluate((e,id)=>({id,mountMs:Number(e.dataset.mountMs),fps:Number(e.dataset.fps),drawCalls:Number(e.dataset.drawCalls),triangles:Number(e.dataset.triangles),rendererCreates:Number(e.dataset.rendererCreates),peopleDecodes:Number(e.dataset.peopleDecodes),heap:performance.memory?.usedJSHeapSize||null}),place.id));
   await page.getByRole('button',{name:'Leave',exact:true}).click();await ready();
  }
  for(const place of worldLocations.filter(l=>['tokyo_station_hall','tokyo_bookshop','tokyo_music','tokyo_asahi'].includes(l.id)))await room(place);
  await list();await page.getByRole('button',{name:/Missions and NPC memory/}).click();
  await page.getByLabel('Choose your reading interest',{exact:true}).selectOption('travel');await page.waitForFunction(()=>!document.querySelector('select[aria-label="Choose your reading interest"]').disabled);
  await page.getByRole('button',{name:'Close',exact:true}).click();await page.reload();await ready();canvas=await page.locator('.cw-canvas').elementHandle();await list();await page.getByRole('button',{name:/Missions and NPC memory/}).click();
  assert.equal(await page.getByLabel('Choose your reading interest',{exact:true}).inputValue(),'travel');
  await page.getByRole('button',{name:'Close',exact:true}).click();
  await page.locator('.cw-place-list article').filter({has:page.getByRole('heading',{name:'Asahi station concourse',exact:true})}).getByRole('button',{name:'Enter',exact:true}).click();await graphics();
  async function walk(key,axis,value,greater){
   await page.locator('.cw-renderer').focus();await page.keyboard.down(key);
   try{await page.waitForFunction(({axis,value,greater})=>{const p=JSON.parse(document.querySelector('.cw-renderer').dataset.position);return greater?p[axis]>value:p[axis]<value;},{axis,value,greater},{timeout:25000});}catch(error){console.log('Walk failed',key,await page.locator('.cw-renderer').getAttribute('data-position'));throw error;}finally{await page.keyboard.up(key);await page.waitForTimeout(350);}
  }
  await walk('KeyD','x',4.65,true);await walk('KeyW','z',-11.7,false);await walk('KeyD','x',7.95,true);
  await page.screenshot({path:new URL(name+'-'+width+'-shinkansen-platform.png',dir).pathname});
  await walk('KeyW','z',-15.6,false);
  await page.screenshot({path:new URL(name+'-'+width+'-shinkansen-boarding.png',dir).pathname});
  await page.getByRole('button',{name:'Board Shinkansen',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.cw-world')?.dataset.scene==='osaka');

  await graphics();assert.equal(await page.locator('.cw-world').getAttribute('data-scene'),'osaka');await page.reload();await ready();canvas=await page.locator('.cw-canvas').elementHandle();assert.equal(await page.getByLabel('Destination',{exact:true}).inputValue(),'osaka_takoyaki');await page.screenshot({path:new URL(name+'-'+width+'-osaka-day.png',dir).pathname});
  for(const place of worldLocations.filter(l=>l.district==='osaka'))await room(place);
  await page.getByRole('button',{name:'World settings',exact:true}).click();await page.getByLabel('Time of day',{exact:true}).selectOption('night');await page.getByRole('button',{name:'Close',exact:true}).click();await ready();
  await page.screenshot({path:new URL(name+'-'+width+'-osaka-night.png',dir).pathname});
  // Reproduce the reported 8/10 arrival state. Returning must never depend
  // on completing the two Osaka activities or the new optional station task.
  awards=awards.filter(a=>!['osaka-order','osaka-culture'].includes(a.mission_id));
  await page.reload();await ready();
  await page.getByRole('button',{name:/Missions and NPC memory/}).click();
  const before=travelCalls;
  await page.locator('.cw-journey article').filter({has:page.getByText('Tokyo · Komorebi Street',{exact:true})}).getByRole('button',{name:'Travel',exact:true}).click();
  await page.locator('.cw-journey').waitFor({state:'detached'});
  assert.equal(travelCalls,before,'street Travel guides to the station without sending an invalid request');
  assert.equal(await page.getByLabel('Destination',{exact:true}).inputValue(),'osaka_station_hall');
  // Walk along the bank, around the station footprint and through its door.
  await walk('KeyA','x',9.1,false);await walk('KeyS','z',20.4,true);await walk('KeyD','x',16.9,true);
  await page.getByRole('button',{name:'Enter',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.cw-world')?.dataset.scene==='osaka_station_hall');await ready();
  await walk('KeyD','x',4.65,true);await walk('KeyW','z',-11.7,false);await walk('KeyD','x',7.95,true);await walk('KeyW','z',-15.6,false);
  await page.reload();await ready();assert.equal(await page.locator('.cw-world').getAttribute('data-scene'),'osaka_station_hall');
  await page.screenshot({path:new URL(name+'-'+width+'-osaka-return-boarding.png',dir).pathname});
  await page.getByRole('button',{name:'Board Shinkansen',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.cw-world')?.dataset.scene==='outdoors');await ready();
  assert.equal(await page.getByLabel('Destination',{exact:true}).inputValue(),'tokyo_cafe');
  // Accessible travel remains available in both directions, independent of 3D.
  await list();await page.getByRole('button',{name:/Missions and NPC memory/}).click();
  await page.locator('.cw-journey article').filter({has:page.getByText('Osaka · Akari Canal',{exact:true})}).getByRole('button',{name:'Travel',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.cw-world')?.dataset.scene==='osaka');
  await page.getByRole('button',{name:/Missions and NPC memory/}).click();
  await page.locator('.cw-journey article').filter({has:page.getByText('Tokyo · Komorebi Street',{exact:true})}).getByRole('button',{name:'Travel',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('.cw-world')?.dataset.scene==='outdoors');await graphics();
  await page.goto(base+'?wall=true');await ready();assert.ok(await page.locator('.cw-renderer').evaluate(e=>Math.abs(JSON.parse(e.dataset.position).x-7.3)<.01));
  for(let n=0;n<3;n++){await page.screenshot({path:new URL(name+'-'+width+'-wall-angle-'+n+'.png',dir).pathname});const box=await page.locator('.cw-renderer').boundingBox();await page.mouse.move(box.x+box.width*.55,box.y+box.height*.42);await page.mouse.down();await page.mouse.move(box.x+box.width*.55+22,box.y+box.height*.42,{steps:8});await page.mouse.up();}
  for(const locale of ['ja','ar']){await page.goto(base+'?locale='+locale);await ready();await noOverflow();await page.evaluate(()=>document.documentElement.style.fontSize='200%');await noOverflow();await page.screenshot({path:new URL(name+'-'+width+'-'+locale+'-large.png',dir).pathname});await page.locator('.cw-missions-button').click();await page.locator('.cw-journey').waitFor();await noOverflow();assert.ok(await page.locator('.cw-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth+2),'journey panel fits at large text');await page.screenshot({path:new URL(name+'-'+width+'-'+locale+'-journey.png',dir).pathname});}
  assert.deepEqual(errors,[]);results.push({browser:name,width,rooms,lockedBeforeAwards:true,storyChoicePersisted:true,osakaRoundTrip:true,physicalOsakaReturnAtEightMissions:true,returnReloadPersisted:true,accessibleRoundTrip:true,rendererReuse:true,locales:['ja','ar']});console.log('PASS Phase 3 UI',name,width);await browser.close();browser=null;
 }
 await writeFile(new URL('results.json',dir),JSON.stringify(results,null,2));
}catch(e){await page?.screenshot({path:new URL('failure.png',dir).pathname}).catch(()=>{});console.error(await page?.locator('body').innerText().catch(()=>''));throw e;}finally{await browser?.close();await new Promise(r=>server.httpServer.close(r));}
