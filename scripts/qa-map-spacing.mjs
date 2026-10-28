import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {createServer} from 'vite';import {journeyChapters} from '../journey-model.mjs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const vite=await createServer({server:{host:'127.0.0.1',port:0},appType:'custom'});
vite.middlewares.use('/api/learning',(req,res)=>{const query=new URL(req.headers.referer).searchParams,chapters=journeyChapters(query.get('language'),query.get('level'));res.setHeader('Content-Type','application/json');res.end(JSON.stringify({progress:chapters.slice(0,4).flatMap(c=>c.lessons.map(l=>({lesson:l.id,best:100})))}));});
vite.middlewares.use('/__map-spacing',async(req,res)=>{res.setHeader('Content-Type','text/html');res.end(await vite.transformIndexHtml('/__map-spacing','<html><head><style>body{margin:0;padding:28px}#root{max-width:1100px;margin:auto}</style></head><body><div id="root"></div><script type="module" src="/scripts/map-spacing-fixture.jsx"></script></body></html>'));});await vite.listen();
const base='http://127.0.0.1:'+vite.httpServer.address().port;let browser;
try{
 await fs.mkdir('.media-build/map-spacing',{recursive:true});browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});
 for(const language of ['en','es','pt','ja'])for(const level of ['A1','A2'])for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:900});await page.goto(base+'/__map-spacing?language='+language+'&level='+level);await page.locator('.approved-map-node').first().waitFor();const expected=journeyChapters(language,level);assert.equal(await page.locator('.approved-map-node').count(),expected.length);
  const layout=await page.locator('.approved-map-canvas').evaluate(canvas=>{const r=canvas.getBoundingClientRect(),nodes=[...canvas.querySelectorAll('.approved-map-node')].map(e=>{const a=e.getBoundingClientRect();return {x:a.x-r.x,y:a.y-r.y,w:a.width,h:a.height}});return {w:r.width,h:r.height,nodes};});
  for(const n of layout.nodes)assert.ok(n.x>=-1&&n.y>=-1&&n.x+n.w<=layout.w+1&&n.y+n.h<=layout.h+1,language+level+' node clipped at '+width);
  for(let i=0;i<layout.nodes.length;i++)for(let j=i+1;j<layout.nodes.length;j++){const a=layout.nodes[i],b=layout.nodes[j];assert.ok(a.x+a.w<=b.x+1||b.x+b.w<=a.x+1||a.y+a.h<=b.y+1||b.y+b.h<=a.y+1,language+level+' overlapping labels at '+width+': '+JSON.stringify({a,b}));}
  assert.ok(Math.max(...layout.nodes.map(n=>n.y+n.h))>layout.h*.65);
  await page.screenshot({path:'.media-build/map-spacing/'+language+'-'+level+'-'+width+'-normal.png'});
  // Keyboard selection does not need the node already on screen. The map
  // itself must reveal it, including at either zoom limit, without page jumps.
  for(const index of [0,Math.floor(expected.length/2),expected.length-1]){
   await page.locator('.approved-map-node').nth(index).evaluate(e=>e.click());
   await page.waitForFunction(()=>{const v=document.querySelector('.approved-map-scroll').getBoundingClientRect(),n=document.querySelector('.approved-map-node[aria-pressed="true"]').getBoundingClientRect();return n.left>=v.left-1&&n.right<=v.right+1&&n.top>=v.top-1&&n.bottom<=v.bottom+1});
  }
  for(const label of ['Zoom in','Zoom out']){const button=page.getByRole('button',{name:label});while(await button.isEnabled())await button.click();await page.waitForFunction(()=>{const v=document.querySelector('.approved-map-scroll').getBoundingClientRect(),n=document.querySelector('.approved-map-node[aria-pressed="true"]').getBoundingClientRect();return n.left>=v.left-1&&n.right<=v.right+1&&n.top>=v.top-1&&n.bottom<=v.bottom+1});}
  await page.screenshot({path:'.media-build/map-spacing/'+language+'-'+level+'-'+width+'.png'});console.log('PASS map spacing, bounds, selection and zoom',language,level,width);
 }
 assert.deepEqual(errors,[]);
}finally{await browser?.close();await vite.close();}
