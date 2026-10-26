// Whole-platform navigation/layout regression sweep; disposable DB, no paid providers.
import assert from 'node:assert/strict';
import {reviewedTranslation} from '../reviewed-interface-copy.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;process.env.NODE_ENV='development';
const {testServer,db}=await import('../test-server.mjs');
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base='http://127.0.0.1:'+testServer.address().port,results=[];let browser;
try{
 const r=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Platform QA',email:'platform@example.test',password:'synthetic-platform-password',role:'learner',adult:true})});assert.ok(r.ok);const {user}=await r.json(),cookie=r.headers.get('set-cookie').split(';')[0];
 const profile=await fetch(base+'/api/profile',{method:'PUT',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({profile:{name:user.name,languages:['es','en','ja','pt'],primaryLanguage:'ja',level:'A1',startMode:'manual',goal:'Synthetic QA'}})});assert.ok(profile.ok);
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox']});await mkdir('.media-build/platform',{recursive:true});
 for(const layout of ['photo','illustrated'])for(const locale of ['en','ja','es','pt','zh','fr']){
 await fetch(base+'/api/interface-language',{method:'PUT',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({language:locale})});
 const context=await browser.newContext({viewport:{width:390,height:844}});await context.addCookies([{name:'continuum_session',value:cookie.split('=')[1],url:base}]);await context.addInitScript(({id,layout,locale})=>{localStorage.setItem('continuumJourneyLayout:'+id,layout);localStorage.setItem('continuumInterfaceLanguage',locale);localStorage.setItem('continuumLanguage','ja')},{id:user.id,layout,locale});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(12000);await page.goto(base);await page.locator('.mobile-nav button').first().waitFor();
 for(const width of [320,390,768,1440]){
 await page.setViewportSize({width,height:844});
 for(let tab=0;tab<5;tab++){
 const started=Date.now();await page.locator(width<=900?'.mobile-nav button':'.app>aside nav button').nth(tab).click();await page.waitForTimeout(100);
 const state=await page.evaluate(()=>({page:document.querySelector('.app')?.dataset.page,overflow:document.documentElement.scrollWidth-innerWidth,broken:[...document.images].filter(i=>i.getBoundingClientRect().width&&i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),garbled:document.body.innerText.includes('\ufffd'),controls:[...document.querySelectorAll('button,select')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'&&(r.x< -1||r.right>innerWidth+1)&&!(()=>{for(let p=e.parentElement;p;p=p.parentElement)if(['auto','scroll'].includes(getComputedStyle(p).overflowX)&&p.scrollWidth>p.clientWidth)return true;return !!e.closest('.approved-map-scroll,.journey-map,.rpg-viewport,.approved-map-canvas')})()}).map(e=>({text:(e.textContent||'').trim().slice(0,70),class:e.className}))}));
 if(layout==='illustrated'&&tab===3){for(const source of ['Upcoming','Past classes'])assert.ok((await page.locator('.class-tabs').innerText()).includes(locale==='en'?source:reviewedTranslation(source,locale)),locale+' '+source);}
 const clipped=await page.locator('.illustrated-metrics').evaluateAll(groups=>groups.flatMap(g=>[...g.querySelectorAll('b,small,progress')].filter(e=>{const card=e.closest('.illustrated-metrics>div'),r=e.getBoundingClientRect(),c=card.getBoundingClientRect();return r.left<c.left-1||r.right>c.right+1||e.scrollWidth>e.clientWidth+1}).map(e=>e.textContent)));
 assert.deepEqual(clipped,[],layout+' '+locale+' '+width+' metric content must fit its card');
 results.push({layout,locale,width,tab,ms:Date.now()-started,...state});
 if(width===320&&locale==='ja')await page.screenshot({path:`.media-build/platform/${layout}-${tab}.png`,fullPage:true});
 }
 }
 assert.deepEqual(errors,[],layout+' '+locale);await context.close();console.log('CHECKED',layout,locale);
 }
 await writeFile('/tmp/platform-layout-results.json',JSON.stringify(results,null,2));
 const failures=results.filter(r=>r.overflow>1||r.broken.length||r.garbled||r.controls.length);console.log(JSON.stringify({screens:results.length,failures},null,2));assert.equal(failures.length,0,'layout/image/text failures');
}finally{await browser?.close();await new Promise(r=>testServer.close(r));await db.close()}
