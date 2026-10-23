// Built UI, real Premium endpoints and disposable PGlite. No production writes.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {premiumCourses} from '../premium-courses.mjs';
import {exclusiveSession,premiumGalleryFrames} from '../premium-session.mjs';
import {speechKey,pcmWav} from '../speech-service.mjs';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('../test-server.mjs');
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,cookie){const r=await fetch(origin+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});assert.ok(r.ok,path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
function tileOrder(q){const visit=(picked,remaining)=>{if(!remaining.length)return picked;for(const i of remaining){const next=[...picked,i],text=next.map(j=>q.tokens[j]).join(q.separator??' ');if(q.answer.startsWith(text)){const found=visit(next,remaining.filter(j=>j!==i));if(found)return found;}}return null};return visit([],q.tokens.map((_,i)=>i));}
try{
 const person=await api('/auth/register','POST',{name:'Exclusive Browser QA',email:'exclusive-browser@example.test',password:'synthetic-test-password',role:'learner',adult:true});
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[person.data.user.id]);
 await api('/profile','PUT',{profile:{name:'Exclusive Browser QA',languages:['en','es','pt','ja'],primaryLanguage:'en',level:'B1',startMode:'manual',goal:'Synthetic QA'}},person.cookie);
 await mkdir('.media-build/exclusive-session',{recursive:true});
 for(const name of (process.env.QA_BROWSERS||'chromium').split(',')){
  const browser=await ({chromium,webkit}[name]).launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
  try{for(const language of ['en','es','pt','ja']){
   const course=premiumCourses.find(c=>c.id===language+'-premium-travel-v1'),frames=premiumGalleryFrames(course),locale={en:'en-US',es:'es-ES',pt:'pt-BR',ja:'ja-JP'}[language];
   const pcm=pcmWav(Buffer.alloc(4800));await db.query('INSERT INTO speech_cache(cache_key,audio,provider,model) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[speechKey(frames[1].text,locale),pcm,'synthetic','browser-gallery']);
   const context=await browser.newContext({viewport:{width:1280,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await context.addCookies([{name:'continuum_session',value:person.cookie.split('=')[1],url:origin}]);await page.addInitScript(language=>{localStorage.setItem('continuumLanguage',language);localStorage.setItem('continuumInterfaceLanguage','en')},language);
   const open=async()=>{await page.locator('.app>aside nav button').filter({hasText:/^Practice Studio$/}).evaluate(b=>b.click());await page.locator('.studio-menu button').filter({hasText:'Exclusive courses'}).click();await page.locator('.membership-courses article').filter({has:page.locator('h3',{hasText:course.title})}).locator('button.primary').click()};
   await page.goto(origin);await open();await page.locator('.premium-gallery').waitFor();assert.equal(await page.locator('.premium-gallery .visual-steps>button').count(),frames.length);
   await page.locator('.premium-gallery .visual-steps>button').nth(1).click();assert.equal(await page.locator('.premium-gallery .visual-target').innerText(),frames[1].text);
   const audio=page.waitForResponse(r=>r.url().includes('/audio?gallery=1'));await page.locator('.premium-gallery .sentence-play').click();assert.equal((await audio).status(),200);
   await page.locator('.lesson-begin button').click();await page.locator('.question-card').waitFor();
   const storageKey=`continuum-exclusive:${person.data.user.id}:${course.id}:${course.contentVersion||1}`;
   const saved=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),storageKey);assert.ok(saved.shuffleSeed);const session=exclusiveSession(course,saved.shuffleSeed);
   const answer=async(q,wrong=false)=>{if(q.type==='reorder'){const sequence=tileOrder(q);assert.ok(sequence);for(const i of wrong?[...sequence].reverse():sequence)await page.locator('.word-builder-tiles>button').nth(i).click();}else if(['typing','cloze'].includes(q.type))await page.locator('#written-answer').fill(wrong?'incorrect':q.answer);else{const correct=q._optionOrder.indexOf(course.questions[q._sourceIndex].answer);await page.locator('.answers .answer-with-audio>button').nth(wrong?(correct+1)%q.options.length:correct).click();}};
   for(const [i,q] of session.questions.entries()){
    if(i===1){await page.reload();await open();await page.locator('.question-card').waitFor();assert.equal((await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),storageKey)).shuffleSeed,saved.shuffleSeed);}
    await page.setViewportSize({width:i%2?390:1280,height:900});
    assert.equal(await page.locator('.question-card>h1').innerText(),q.prompt);
    const before=await page.locator('.question-card>h1').innerText();await page.locator('[aria-label="Correct-answer sound effects"]').click();assert.equal(await page.locator('.question-card>h1').innerText(),before);
    await answer(q,i===0);await page.locator('.question-card>.primary').click();await page.locator(i===0?'.feedback.retry':'.feedback.good').waitFor();
    await page.locator('.question-card>.primary').click();await page.waitForFunction(({i,total})=>!document.querySelector('.feedback')&&(i===total-1?!!document.querySelector('.retry-notice'):Number(document.querySelector('.practice-top>span')?.textContent.split('/')[0])===i+2),{i,total:session.questions.length});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'No overflow');
   }
   await answer(session.questions[0]);await page.locator('.question-card>.primary').click();await page.locator('.feedback.good').waitFor();await page.locator('.question-card>.primary').click();await page.locator('.result-card').waitFor();
   const result=await db.query('SELECT correct,total FROM premium_course_attempts WHERE user_id=$1 AND client_key=$2',[person.data.user.id,saved.key]);assert.equal(result.rows[0].correct,course.questions.length-1);assert.equal(result.rows[0].total,course.questions.length);
   await page.locator('.result-card .text-button').click();await page.locator('.question-card').waitFor();const next=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),storageKey);assert.notEqual(next.shuffleSeed,saved.shuffleSeed);
   await page.screenshot({path:`.media-build/exclusive-session/${name}-${language}.png`});assert.deepEqual(errors,[]);await context.close();console.log(`PASS ${name} ${language}: full shuffled course, gallery audio, reload/resume, rerender stability, deferred retry, canonical score, fresh retry seed, desktop/mobile`);
  }}finally{await browser.close()}
 }
}finally{await new Promise(r=>testServer.close(r));await db.close()}
