import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {build,preview} from 'vite';
import {chromium} from 'playwright';
const compare=process.argv.includes('--compare'),dir=new URL('../.media-build/world-flow/',import.meta.url);
await mkdir(dir,{recursive:true});
if(compare){
 const before=new URL('../.media-build/world-flow-before/',import.meta.url);await mkdir(before,{recursive:true});
 const names=execFileSync('git',['ls-tree','--name-only','71fc5e590b8037ec4431f1bfaabf3e034d7bb508'],{encoding:'utf8'}).trim().split('\n').filter(n=>/^continuum-world.*\.mjs$/.test(n)&&!n.endsWith('.test.mjs')||n==='companion-call-models.mjs');
 for(const name of names)await writeFile(new URL(name,before),execFileSync('git',['show','71fc5e590b8037ec4431f1bfaabf3e034d7bb508:'+name]));
}
await writeFile(new URL('index.html',dir),'<!doctype html><html><style>html,body,#world{margin:0;width:100%;height:100%;overflow:hidden}canvas{display:block;width:100%;height:100%}</style><div id="world" tabindex="0"></div><script type="module" src="./entry.mjs"></script></html>');
await writeFile(new URL('entry.mjs',dir),`
import * as current from '../../continuum-world-engine.mjs';
${compare?"import * as before from '../world-flow-before/continuum-world-engine.mjs';":""}
import {worldScenes,restoreWorldState} from '../../continuum-world-model.mjs';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {startWorldMusic} from '../../continuum-world-music.mjs';
window.runFlow=async(mode,quality)=>{
 const api=${compare?"mode==='before'?before:current":"current"},session=mode==='after'?api.createWorldSession():null;
 const parse=GLTFLoader.prototype.parseAsync;let decodes=0;GLTFLoader.prototype.parseAsync=function(...args){decodes++;return parse.apply(this,args);};
 const host=document.getElementById('world'),canvases=new Set(),entries=[];let instance,controller,recovering=false;
 try{
  for(const scene of ['outdoors','tokyo_cafe','outdoors','tokyo_konbini','outdoors']){
   if(instance){instance.setActive(false);if(session)session.retire(instance);else{controller.abort();instance.dispose();}}
   controller=new AbortController();const settings={...restoreWorldState(),scene,quality,time:'day'},started=performance.now();
   instance=await api.createWorldEngine(host,{session,capture:true,initial:{...settings,position:worldScenes[scene].spawn,yaw:0},kind:'capybara',input:()=>({x:0,z:0}),options:()=>settings,signal:controller.signal,onSnapshot:()=>{},onFailure:r=>{if(!recovering)throw Error(r);}});
   session?.releaseRetired();instance.setActive(true);canvases.add(host.querySelector('.cw-canvas'));
   await new Promise((resolve,reject)=>{const start=performance.now();const check=()=>{if(Number(host.dataset.peopleLoaded)>0&&host.dataset.peopleLoaded===host.dataset.peopleTotal&&Number(host.dataset.worldFrames)>=3)return resolve();if(performance.now()-start>60000)return reject(Error('World entry timed out'));requestAnimationFrame(check);};check();});
   entries.push({scene,readyMs:performance.now()-started,mountMs:Number(host.dataset.mountMs)});instance.setActive(false);
  }
  if(session&&quality==='auto'){
   const oldEnvironment=session.environment(()=>{throw Error('Expected a cached environment');});
   recovering=true;const canvas=host.querySelector('.cw-canvas'),extension=canvas.getContext('webgl2').getExtension('WEBGL_lose_context');
   if(!extension)throw Error('Context-loss extension unavailable');
   await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Context loss timed out')),10000);canvas.addEventListener('webglcontextlost',()=>{clearTimeout(timeout);resolve();},{once:true});extension.loseContext();});
   controller.abort();instance.dispose();controller=new AbortController();const settings={...restoreWorldState(),quality,time:'day'};
   instance=await api.createWorldEngine(host,{session,capture:true,initial:settings,kind:'capybara',input:()=>({x:0,z:0}),options:()=>settings,signal:controller.signal,onSnapshot:()=>{},onFailure:r=>{throw Error(r);}});
   if(session.environment(()=>{throw Error('Expected a rebuilt environment');})===oldEnvironment)throw Error('Lost GPU environment was reused');
   if(session.people.decodes!==2)throw Error('Context recovery decoded people again');
   if(session.rendererCreates!==2||host.querySelector('.cw-canvas')===canvas)throw Error('Lost renderer was reused');
   const rendered=host.querySelector('.cw-canvas'),probe=document.createElement('canvas');probe.width=probe.height=32;const ctx=probe.getContext('2d');ctx.drawImage(rendered,0,0,32,32);const pixels=ctx.getImageData(0,0,32,32).data,colors=new Set();for(let i=0;i<pixels.length;i+=4)colors.add(pixels[i]+','+pixels[i+1]+','+pixels[i+2]);if(colors.size<16)throw Error('Recovered context did not render the scene');
   recovering=false;
  }
  return {mode,quality,entries,decodes,contexts:canvases.size};
 }finally{controller?.abort();instance?.dispose();session?.dispose();GLTFLoader.prototype.parseAsync=parse;}
};
window.renderMusic=async(level)=>{
 const context=new OfflineAudioContext(1,32000*8,32000),master=context.createGain();master.gain.value=level;master.connect(context.destination);
 let time=0,tick;const proxy=new Proxy(context,{get(target,key){if(key==='currentTime')return time;const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;}});
 const score=startWorldMusic(proxy,master,{setInterval:fn=>{tick=fn;return 1;},clearInterval:()=>{}});score.setActive(true);
 for(time=.1;time<8;time+=.1)tick();const rendered=await context.startRendering(),samples=rendered.getChannelData(0);let peak=0,power=0;for(const value of samples){peak=Math.max(peak,Math.abs(value));power+=value*value;}score.dispose();return {peak,rms:Math.sqrt(power/samples.length)};
};window.flowReady=true;
`);
await build({configFile:false,build:{outDir:'.media-build/world-flow/dist',rollupOptions:{input:new URL('index.html',dir).pathname}}});
const server=await preview({configFile:false,build:{outDir:'.media-build/world-flow/dist'},preview:{host:'127.0.0.1',port:0}});
let browser;const results=[];
try{
 browser=await chromium.launch({executablePath:process.env.QA_BROWSER_EXECUTABLE,headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const quality of (process.env.QA_WORLD_FLOW_QUALITIES||'low,auto').split(','))for(const mode of compare?['before','after']:['after']){
  const page=await browser.newPage({viewport:{width:quality==='low'?390:1280,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.httpServer.address().port+'/.media-build/world-flow/index.html');await page.waitForFunction(()=>window.flowReady);
  const result=await page.evaluate(({mode,quality})=>window.runFlow(mode,quality),{mode,quality});
  if(mode==='after'){assert.equal(result.contexts,1);assert.equal(result.decodes,2);}
  if(!results.length){
   const normal=await page.evaluate(()=>window.renderMusic(.1)),ducked=await page.evaluate(()=>window.renderMusic(.01));
   assert.ok(normal.peak<.2&&normal.rms>.001,'real instrumental samples are audible and do not clip');
   assert.ok(Math.abs(ducked.rms/normal.rms-.1)<.001,'20 dB lower during NPC interaction');
   console.log('PASS real Web Audio music',JSON.stringify({normal,ducked}));
  }
  assert.deepEqual(errors,[]);results.push(result);console.log('PASS scene flow',JSON.stringify(result));await page.close();
 }
 await writeFile(new URL('results.json',dir),JSON.stringify(results,null,2));
}finally{await browser?.close();await new Promise(r=>server.httpServer.close(r));}
