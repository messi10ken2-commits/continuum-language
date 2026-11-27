import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {build,preview} from 'vite';
import {chromium} from 'playwright';
const dir=new URL('../.media-build/world-characters/',import.meta.url);
await mkdir(dir,{recursive:true});
await writeFile(new URL('index.html',dir),'<!doctype html><html><style>body{margin:0;background:#e9eeea}canvas{display:block}</style><script type="module" src="./entry.mjs"></script></html>');
await writeFile(new URL('entry.mjs',dir),`
import * as THREE from 'three';
import {worldMeshes,makeWorldPerson,makeWorldCompanion} from '../../continuum-world-scenes.mjs';
import {upgradeWorldPeople} from '../../continuum-world-people.mjs';
import {makeWorldSurfaces} from '../../continuum-world-materials.mjs';
// Exercise the cached alpha path that previously turned foliage into gray cards.
for(let i=0;i<2;i++){const surfaces=makeWorldSurfaces(()=>{}),leaves=surfaces.texture('leaves');if(leaves.image.getContext('2d').getImageData(0,0,1,1).data[3]!==0)throw Error('Cached foliage lost transparency');surfaces.dispose();}
const meshes=worldMeshes({quality:'auto'}),scene=new THREE.Scene(),renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
renderer.setSize(1280,760);renderer.setPixelRatio(1);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;scene.background=new THREE.Color(0xe2e8e7);document.body.append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xf5f9ff,0x786656,2));const sun=new THREE.DirectionalLight(0xffead7,3);sun.position.set(-3,5,4);scene.add(sun);
const camera=new THREE.PerspectiveCamera(40,1280/760,.1,50);
meshes.shape(scene,'box',0xaebbb6,[0,-.05,0],[25,.08,25]);
const animals=['capybara','fox','cat','dog','bird','guinea-pig','quokka','panda'].map((kind,i)=>{const a=makeWorldCompanion(meshes,kind);a.root.position.set((i%4-1.5)*1.3,0,i<4?1.2:-.8);a.root.rotation.y=-.12;scene.add(a.root);return a;});
const people=['traveller','resident'].map((variant,i)=>{const a=makeWorldPerson(meshes);a.variant=variant;a.root.position.x=(i-.5)*1.1;scene.add(a.root);return a;});
const manager=upgradeWorldPeople(people,{physical:true,fabric:meshes.surface('fabric',3)});await manager.ready;
if(people.some(a=>a.root.userData.worldPerson!=='skinned'))throw Error('Character art requires shipped rigs');
window.characterShot=(mode,time=2.0,reduced=false)=>{
 animals.forEach(a=>a.root.visible=mode==='companions');people.forEach(a=>a.root.visible=mode!=='companions');
 camera.position.set(0,mode==='companions'?3.1:1.6,mode==='companions'?7.3:4.6);camera.lookAt(0,mode==='companions'?.32:.95,0);
 animals.forEach(a=>{for(let n=1;n<=144;n++)a.animate(time+n/60,mode==='companions'?0:1.2,reduced,.2);});
 people.forEach((a,i)=>{a.root.rotation.y=mode==='people-back'?Math.PI:0;for(let n=1;n<=144;n++)a.animate(time+n/60,mode==='people-walk'?1.3:0,reduced);});
 renderer.render(scene,camera);return renderer.info.render.triangles;
};window.characterReady=true;
window.characterCleanup=()=>{manager.dispose();meshes.dispose();renderer.dispose();renderer.forceContextLoss();};
`);
await build({configFile:false,build:{outDir:'.media-build/world-characters/dist',rollupOptions:{input:new URL('index.html',dir).pathname}}});
const server=await preview({configFile:false,build:{outDir:'.media-build/world-characters/dist'},preview:{host:'127.0.0.1',port:0}});
let browser;
try{
 browser=await chromium.launch({executablePath:process.env.QA_BROWSER_EXECUTABLE,headless:true,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1280,height:760}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/GL_INVALID|OUT_OF_MEMORY|THREE.WebGLProgram/i.test(m.text()))errors.push(m.text());});
 await page.goto('http://127.0.0.1:'+server.httpServer.address().port+'/.media-build/world-characters/index.html');
 await page.waitForFunction(()=>window.characterReady,null,{timeout:90000});
 for(const mode of ['companions','people-front','people-back','people-walk']){
  const triangles=await page.evaluate(mode=>window.characterShot(mode),mode);assert.ok(triangles>1000);
  const png=Buffer.from((await page.locator('canvas').evaluate(c=>c.toDataURL('image/png'))).split(',')[1],'base64');
  assert.ok(png.length>30000);await writeFile(new URL(mode+'.png',dir),png);console.log('PASS rendered '+mode);
 }
 assert.deepEqual(errors,[]);await page.evaluate(()=>window.characterCleanup());
}finally{await browser?.close();await new Promise(r=>server.httpServer.close(r));}
