// Real built interface + disposable users/database; no production writes or AI usage.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {reviewedTranslation} from '../reviewed-interface-copy.mjs';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('../test-server.mjs'),{chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base='http://127.0.0.1:'+testServer.address().port;let browser;
async function api(path,method,body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});assert.ok(r.ok,path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 const people={};for(const role of ['learner','teacher']){const a=await api('/auth/register','POST',{name:'Display QA '+role,email:'display-'+role+'@example.test',password:'synthetic-display-password',role,adult:true});people[role]={user:a.data.user,cookie:a.cookie};if(role==='learner')await api('/profile','PUT',{profile:{name:a.data.user.name,languages:['en','es','pt','ja'],primaryLanguage:'en',level:'A1',startMode:'manual',goal:'Synthetic QA'}},a.cookie);}
 await mkdir('.media-build/display-languages',{recursive:true});
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox']});
 for(const locale of (process.env.QA_DISPLAY_LOCALES||'ko,id,ru,ar').split(','))for(const layout of ['photo','illustrated'])for(const role of ['learner','teacher']){
 const {user,cookie}=people[role];await api('/interface-language','PUT',{language:locale},cookie);
 const context=await browser.newContext({viewport:{width:390,height:900},hasTouch:true});await context.addCookies([{name:'continuum_session',value:cookie.split('=')[1],url:base}]);await context.addInitScript(({id,layout,locale})=>{localStorage.setItem('continuumJourneyLayout:'+id,layout);localStorage.setItem('continuumInterfaceLanguage',locale);localStorage.setItem('continuumLanguage','en')},{id:user.id,layout,locale});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.locator('.mobile-nav button').first().waitFor();await page.waitForFunction(l=>document.documentElement.lang===l,locale);assert.equal(await page.locator('html').getAttribute('dir'),locale==='ar'?'rtl':'ltr');
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),locale+' '+layout+' '+role+' overflow '+width);if(locale==='ar'&&width===1440){const aside=await page.locator('.app>aside').boundingBox();if(aside)assert.ok(aside.x>1000,'RTL sidebar is on the right');}}
 await page.setViewportSize({width:390,height:900});
 if(role==='learner'){
 for(const index of [0,1,2,3,4]){await page.locator('.mobile-nav button').nth(index).click();await page.waitForTimeout(150);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),locale+' '+layout+' page '+index);}
 await page.locator('.account-settings .setting-row').evaluateAll(es=>es.forEach(e=>e.open=true));const picker=page.locator('.account-settings .interface-picker select');await picker.waitFor();assert.equal(await picker.inputValue(),locale);assert.equal(await picker.locator('option').count(),10);assert.ok((await page.locator('.account-settings').innerText()).includes(reviewedTranslation('Display language',locale)));
 await page.screenshot({path:'.media-build/display-languages/'+locale+'-'+layout+'-account.png',fullPage:true});
 await picker.selectOption('en');await page.waitForFunction(()=>document.documentElement.dir==='ltr'&&document.documentElement.lang==='en');assert.equal((await api('/interface-language','GET',null,cookie)).data.language,'en');await picker.selectOption(locale);await page.waitForFunction(l=>document.documentElement.lang===l,locale);await page.reload();await page.waitForFunction(l=>document.documentElement.lang===l,locale);assert.equal(await page.locator('html').getAttribute('dir'),locale==='ar'?'rtl':'ltr');
 if(layout==='photo'){await page.locator('.mobile-nav button').nth(1).click();const lesson=page.locator('[data-lesson-id]').first();await lesson.evaluate(e=>{const d=e.closest('details');if(d)d.open=true});await lesson.click();await page.locator('.lesson-begin .primary,.question-card').first().waitFor();if(await page.locator('.lesson-begin .primary').count())await page.locator('.lesson-begin .primary').click();await page.locator('.question-card').waitFor();assert.ok(await page.locator('.question-card [lang^="en"]').count()>0,'learning text has its own language');for(const e of await page.locator('.question-card [lang^="en"]').all())assert.equal(await e.evaluate(n=>getComputedStyle(n).direction),'ltr','English learning examples stay LTR');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'.media-build/display-languages/'+locale+'-lesson.png'});}

 }else{await page.screenshot({path:'.media-build/display-languages/'+locale+'-'+layout+'-teacher.png',fullPage:true});}
 assert.deepEqual(errors,[]);await context.close();console.log('PASS',locale,layout,role,'responsive navigation, direction and saved preference');
 }
}finally{await browser?.close();await new Promise(r=>testServer.close(r));await db.close();}
