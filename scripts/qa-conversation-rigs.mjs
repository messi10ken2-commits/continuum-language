// Runs the actual React component and bundled GLBs. No accounts or provider calls.
import assert from 'node:assert/strict';
import {mkdir,writeFile,rm} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium,webkit} from 'playwright';
import {CALL_MODELS} from '../companion-call-models.mjs';
const dir=new URL('../.media-build/conversation-rigs/',import.meta.url);await mkdir(dir,{recursive:true});
await writeFile(new URL('entry.jsx',dir),`
import React,{useState}from'react';import{createRoot}from'react-dom/client';import Companion from '../../ConversationCompanion.jsx';import '../../immersive-conversation.css';
const initial=new URLSearchParams(location.search).get('kind')||'capybara';
function Preview(){const[kind,K]=useState(initial),[state,S]=useState('listening'),[level,L]=useState(0),[show,H]=useState(true);return <main><nav>{['capybara','bird','fox','cat','dog','guinea-pig','quokka','panda'].map(k=><button key={k} onClick={()=>K(k)}>{k}</button>)}<button id="speak" onClick={()=>{S('speaking');L(.85)}}>Speak</button><button id="silence" onClick={()=>{S('listening');L(0)}}>Silence</button><button id="think" onClick={()=>S('thinking')}>Think</button><button id="toggle" onClick={()=>H(!show)}>Toggle</button></nav><section id="stage" className="immersive-room-actor" style={{position:'relative',inset:'auto',width:'100%',height:600,background:'#143c30'}}>{show&&<Companion kind={kind} state={state} level={level}/>}</section><div style={{height:'150vh'}}/><p id="bottom">End</p></main>};createRoot(document.getElementById('root')).render(<Preview/>);
`);
const server=await createServer({configFile:false,optimizeDeps:{entries:[new URL('entry.jsx',dir).pathname]},server:{host:'127.0.0.1',port:0,hmr:false},appType:'custom',plugins:[{name:'conversation-rig-qa',configureServer(vite){vite.middlewares.use(async(req,res,next)=>{if(!req.url?.startsWith('/__conversation_rigs'))return next();res.setHeader('Content-Type','text/html');res.end(await vite.transformIndexHtml(req.url,'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;font-family:system-ui}nav{min-height:60px}button{padding:5px}</style></head><body><div id="root"></div><script type="module" src="/.media-build/conversation-rigs/entry.jsx"></script></body></html>'))})}}]});
let browser;
try{
 await server.listen();const base='http://127.0.0.1:'+server.httpServer.address().port+'/__conversation_rigs';
 for(const [name,engine]of Object.entries({chromium,webkit})){
  browser=await engine.launch({headless:true,...(name==='chromium'?{...(process.env.QA_BROWSER_EXECUTABLE?{executablePath:process.env.QA_BROWSER_EXECUTABLE}:{}),args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}: {})});
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],downloads=[];
  page.setDefaultTimeout(30000);page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().endsWith('.glb'))downloads.push(new URL(r.url()).pathname)});
  for(const [kind,model]of Object.entries(CALL_MODELS)){
   downloads.length=0;await page.goto(base+'?kind='+kind);
   await page.waitForFunction(()=>document.querySelector('.call-companion')?.dataset.renderer==='rig3d');
   assert.deepEqual(downloads,[model],'only selected companion downloads');assert.equal(await page.locator('canvas').count(),1);
   assert.equal(await page.locator('.call-companion').getAttribute('data-companion'),kind);
   await page.waitForFunction(()=>Number(document.querySelector('.call-companion-rig').dataset.frames)>3);
   await page.locator('#stage').screenshot({path:new URL(name+'-'+kind+'-listening.png',dir).pathname});
   await page.locator('#speak').click();await page.waitForFunction(()=>Number(document.querySelector('.call-companion-rig').dataset.mouth)>.6);
   await page.locator('#stage').screenshot({path:new URL(name+'-'+kind+'-speaking.png',dir).pathname});
   await page.locator('#silence').click();await page.waitForFunction(()=>Number(document.querySelector('.call-companion-rig').dataset.mouth)===0);
   await page.locator('#think').click();assert.equal(await page.locator('.call-companion').getAttribute('data-state'),'thinking');
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.call-companion').dataset.motion==='off');
   const frames=await page.locator('.call-companion-rig').getAttribute('data-frames');await page.waitForTimeout(150);assert.equal(await page.locator('.call-companion-rig').getAttribute('data-frames'),frames);
   await page.emulateMedia({reducedMotion:'no-preference'});
  }
  // Switching without navigation must replace and dispose the previous canvas.
  await page.getByRole('button',{name:'fox',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.call-companion[data-companion="fox"]')?.dataset.renderer==='rig3d');assert.equal(await page.locator('canvas').count(),1);
  await page.locator('#bottom').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.call-companion').dataset.motion==='off');
  const stopped=await page.locator('.call-companion-rig').getAttribute('data-frames');await page.waitForTimeout(150);assert.equal(await page.locator('.call-companion-rig').getAttribute('data-frames'),stopped);
  await page.locator('#stage').scrollIntoViewIfNeeded();
  await page.locator('canvas').evaluate(c=>c.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
  await page.waitForFunction(()=>document.querySelector('.call-companion').dataset.renderer==='image');
  assert.equal(await page.locator('.call-companion-art').evaluate(img=>getComputedStyle(img).opacity),'1');
  await page.locator('#toggle').click();assert.equal(await page.locator('canvas').count(),0);
  await page.route('**/*.glb',r=>r.fulfill({status:404,body:'unavailable'}));await Promise.all([page.waitForResponse(r=>r.url().endsWith('.glb')&&r.status()===404),page.locator('#toggle').click()]);
  assert.equal(await page.locator('.call-companion').getAttribute('data-renderer'),'image');assert.equal(await page.locator('canvas').count(),0);
  assert.deepEqual(errors,[]);console.log('PASS '+name+': eight species, actual WebGL poses, silence, reduced motion, offscreen, switch, cleanup and network/context fallback');
  await browser.close();browser=null;
 }
}finally{await browser?.close();await server.close();await rm(new URL('entry.jsx',dir),{force:true})}
