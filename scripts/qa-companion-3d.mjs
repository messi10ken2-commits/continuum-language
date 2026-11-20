import assert from 'node:assert/strict';
import {mkdir,writeFile,rm} from 'node:fs/promises';
import {createServer} from 'vite';
import {chromium} from 'playwright';
const directory=new URL('../.media-build/immersive/',import.meta.url);await mkdir(directory,{recursive:true});
await writeFile(new URL('companion.jsx',directory),`
import React,{useState}from'react';import{createRoot}from'react-dom/client';import Companion3D from '../../Companion3D.jsx';import '../../companion-3d.css';
const kind=new URLSearchParams(location.search).get('kind')||'capybara';
function Preview(){const [show,setShow]=useState(true),[reacting,setReacting]=useState(false);return <main><button id="toggle" onClick={()=>setShow(v=>!v)}>Toggle companion</button><button id="greet" onClick={()=>setReacting(v=>!v)}>Greet</button><section id="scene" style={{background:'linear-gradient(150deg,#edd8bc,#bdd4ce)',width:'100%',height:420,borderRadius:30,margin:'30px auto',display:'grid',placeItems:'center'}}><div id="host" style={{height:370,width:350}}>{show&&<Companion3D kind={kind} reacting={reacting}><img className="town-companion-sprite" src={'/light-town/'+kind+'.webp'} style={{width:'100%',height:'100%',objectFit:'contain'}}/></Companion3D>}</div></section><div style={{height:'150vh'}}/><p id="bottom">End</p></main>};createRoot(document.getElementById('root')).render(<Preview/>);
`);
const server=await createServer({configFile:false,optimizeDeps:{entries:[new URL('companion.jsx',directory).pathname]},server:{host:'127.0.0.1',port:0,hmr:false},appType:'custom',plugins:[{name:'companion-preview',configureServer(server){server.middlewares.use(async(req,res,next)=>{if(!req.url?.startsWith('/__companion_3d'))return next();res.setHeader('Content-Type','text/html');res.end(await server.transformIndexHtml(req.url,'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:18px;background:#fbf8f1;font-family:system-ui}main{max-width:700px;margin:auto}button{padding:10px;margin:4px}</style></head><body><div id="root"></div><script type="module" src="/.media-build/immersive/companion.jsx"></script></body></html>'))})}}]});
let browser;
try{
 await server.listen();browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:430,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url='http://127.0.0.1:'+server.httpServer.address().port+'/__companion_3d';
 for(const kind of ['capybara','cat','fox','dog','bird','guinea-pig','quokka','panda']){
  await page.goto(url+'?kind='+kind);await page.waitForFunction(()=>document.querySelector('.companion-3d')?.dataset.ready==='true');
  assert.equal(await page.locator('canvas').count(),1);await page.waitForTimeout(250);
  const frames=await page.locator('.companion-3d').getAttribute('data-frames');assert.ok(Number(frames)>1,'real renderer advances frames');
  await page.locator('#greet').click();
  await page.locator('#scene').screenshot({path:new URL(kind+'.png',directory).pathname});
 }
 await page.locator('#bottom').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.companion-3d').dataset.motion==='off');
 const paused=await page.locator('.companion-3d').getAttribute('data-frames');await page.waitForTimeout(250);assert.equal(await page.locator('.companion-3d').getAttribute('data-frames'),paused,'offscreen scenes stop drawing');
 await page.locator('#scene').scrollIntoViewIfNeeded();await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.companion-3d').dataset.motion==='off');
 const staticFrame=await page.locator('.companion-3d').getAttribute('data-frames');await page.waitForTimeout(250);assert.equal(await page.locator('.companion-3d').getAttribute('data-frames'),staticFrame);
 await page.locator('#toggle').click();assert.equal(await page.locator('canvas').count(),0,'unmount removes the renderer');await page.locator('#toggle').click();await page.waitForFunction(()=>document.querySelector('.companion-3d')?.dataset.ready==='true');
 await page.locator('canvas').evaluate(canvas=>canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());await page.waitForFunction(()=>document.querySelector('.companion-3d')?.dataset.ready==='false');
 assert.equal(await page.locator('.town-companion-sprite').evaluate(el=>getComputedStyle(el).visibility),'visible','context loss restores the approved illustration');
 assert.deepEqual(errors,[]);console.log('PASS: eight real WebGL companions, one canvas, interaction, offscreen/reduced-motion suspension, cleanup and context-loss fallback.');
}finally{await browser?.close();await server.close();await rm(new URL('companion.jsx',directory),{force:true})}
