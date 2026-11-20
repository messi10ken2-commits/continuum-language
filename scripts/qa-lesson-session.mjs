// Optional browser QA: PLAYWRIGHT_MODULE points to an installed Playwright module.
// Uses the built frontend and a disposable database; never production accounts.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {lessonList,getLessonVariant,hasExpandedExercises} from '../course.mjs';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('../test-server.mjs');
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin='http://127.0.0.1:'+testServer.address().port;
async function api(path,method,body,cookie){const r=await fetch(origin+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(body)});assert.ok(r.ok,path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 await mkdir('.media-build/lesson-session',{recursive:true});
 const person=await api('/auth/register','POST',{name:'Browser Session',email:'browser-session@example.test',password:'synthetic-test-password',role:'learner',adult:true});
 for(const name of (process.env.QA_BROWSERS||'chromium').split(',')){
  const browser=await ({chromium,webkit}[name]).launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
  try{for(const language of ['en','es','pt','ja'])for(const width of [1280,390]){
   const seed='v8-browser-scroll-123456789',base=lessonList.find(l=>(l.language||'es')===language&&l.level==='A1'&&hasExpandedExercises(l.id)&&/vocab|expression/i.test(l.skill)&&getLessonVariant(l.id,seed).questions.every(q=>q.mode!=='order'));
   const variant=getLessonVariant(base.id,seed);
   await api('/profile','PUT',{profile:{name:'Browser Session',languages:[language],primaryLanguage:language,level:'A1',startMode:'manual',goal:'Browser session QA'}},person.cookie);
   await api('/learning/'+base.id,'PUT',{answers:[],seed},person.cookie);
   const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await context.addCookies([{name:'continuum_session',value:person.cookie.split('=')[1],url:origin}]);
   await page.addInitScript(language=>{localStorage.setItem('continuumLanguage',language);localStorage.setItem('continuumInterfaceLanguage','en')},language);
   await page.goto(origin);await page.locator('.app>aside nav button').filter({hasText:/^Learn$/}).evaluate(b=>b.click());
   await page.locator(`[data-lesson-id="${base.id}"]`).click();await page.locator('.question-card').waitFor();
   for(let i=0;i<3;i++){
    const q=variant.questions[i];if(q.type==='text')await page.locator('#written-answer').fill(i===0?'incorrect':q.answer);else await page.locator('.answers .answer-with-audio>button').nth(i===0?(q.answer+1)%q.options.length:q.answer).click();
    await page.locator('.question-card>.primary').click();await page.locator('.feedback').waitFor();
    await page.evaluate(()=>window.scrollTo({top:document.querySelector('.question-card').getBoundingClientRect().top+scrollY+100,behavior:'instant'}));
    // Programmatic click simulates Continue while scrolled through long feedback.
    await page.locator('.question-card>.primary').evaluate(b=>b.click());
    await page.waitForFunction(i=>Number(document.querySelector('.practice-top>span')?.textContent.split('/')[0])===i+2&&!document.querySelector('.feedback'),i);
    assert.ok(await page.evaluate(()=>{const r=document.querySelector('.question-card').getBoundingClientRect();return scrollY>0&&r.top>=0&&r.top<innerHeight*.5}),`${name} ${language} ${width} Continue`);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No horizontal overflow');
   }
   await page.screenshot({path:`.media-build/lesson-session/${name}-${language}-${width}.png`});assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${name} ${language} ${width}: correct/incorrect Continue, stable v8 questions, visible question, no overflow`);
  }}finally{await browser.close()}
 }
}finally{await new Promise(r=>testServer.close(r));await db.close()}
