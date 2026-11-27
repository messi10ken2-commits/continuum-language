import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {build,preview} from 'vite';
import {chromium} from 'playwright';
const dir=new URL('../.media-build/continuum-world-gait/',import.meta.url);
const art=new URL('../.media-build/continuum-world-art/',import.meta.url);
await mkdir(dir,{recursive:true});await mkdir(art,{recursive:true});
await writeFile(new URL('index.html',dir),'<!doctype html><html><style>body{margin:0;background:#e9eeea}canvas{display:block}</style><div id="stage"></div><script type="module" src="./entry.mjs"></script></html>');
await writeFile(new URL('entry.mjs',dir),`
import * as THREE from 'three';
import {worldMeshes,makeWorldPerson} from '../../continuum-world-scenes.mjs';
import {upgradeWorldPeople} from '../../continuum-world-people.mjs';
const scene=new THREE.Scene();scene.background=new THREE.Color(0xe9eeea);
const meshes=worldMeshes({quality:'low'}),controller=new AbortController();
const actors=Array.from({length:8},(_,i)=>{const actor=makeWorldPerson(meshes);actor.variant='traveller';actor.root.position.x=(i-3.5)*1.75;actor.root.rotation.y=Math.PI/2;scene.add(actor.root);return actor;});
const people=upgradeWorldPeople(actors,{signal:controller.signal});
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(2000,450);renderer.setPixelRatio(1);renderer.setClearColor(0xe9eeea);
renderer.outputColorSpace=THREE.SRGBColorSpace;document.getElementById('stage').appendChild(renderer.domElement);
const width=14.5,height=width*450/2000,camera=new THREE.OrthographicCamera(-width/2,width/2,height/2,-height/2,.1,60);
camera.position.set(0,2.35,18);camera.lookAt(0,1.25,0);
scene.add(new THREE.HemisphereLight(0xffffff,0xb3bcae,2.2));const sun=new THREE.DirectionalLight(0xfff5e8,2.4);sun.position.set(-3,8,10);scene.add(sun);
meshes.shape(scene,'box',0xe0e6df,[0,-.035,0],[25,.05,12]);
await people.ready;
if(actors.some(a=>a.root.userData.worldPerson!=='skinned'))throw Error('Gallery requires actual shipped skinned models');
actors.forEach((actor,i)=>{
 const frames=120+Math.round(i*(2.6/4.2)*60/8);
 for(let n=1;n<=frames;n++)actor.animate(n/60,4.2,false);
 const label=meshes.sign(scene,String(i+1),[(i-3.5)*1.75,2.2,0],.45,'#00000000','#354b43');label.scale.y=.18;
});
for(let n=0;n<3;n++){renderer.render(scene,camera);await new Promise(requestAnimationFrame);}
window.galleryReady=true;window.galleryTriangles=renderer.info.render.triangles;
window.galleryCleanup=()=>{controller.abort();people.dispose();meshes.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
`);
await build({configFile:false,build:{outDir:'.media-build/continuum-world-gait/dist',rollupOptions:{input:new URL('index.html',dir).pathname}}});
const server=await preview({configFile:false,build:{outDir:'.media-build/continuum-world-gait/dist'},preview:{host:'127.0.0.1',port:0}});
let browser;
try {
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:2000,height:450}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(/WebGL.*INVALID|GL_INVALID|OUT_OF_MEMORY|THREE.WebGLProgram/i.test(m.text()))errors.push(m.text());});
 await page.goto('http://127.0.0.1:'+server.httpServer.address().port+'/.media-build/continuum-world-gait/index.html');
 await page.waitForFunction(()=>window.galleryReady,null,{timeout:90000});
 const png=Buffer.from((await page.locator('canvas').evaluate(c=>c.toDataURL('image/png'))).split(',')[1],'base64');
 assert.ok(png.length>20000,'real rendered side-view pose evidence');
 assert.ok(await page.evaluate(()=>window.galleryTriangles>50000));
 await writeFile(new URL('running-cycle.png',art),png);assert.deepEqual(errors,[]);
 await page.evaluate(()=>window.galleryCleanup());console.log('PASS eight actual skinned side-view running poses');
}finally{await browser?.close();await new Promise(r=>server.httpServer.close(r));}
