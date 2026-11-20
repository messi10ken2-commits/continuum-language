import assert from 'node:assert/strict';
import {lessonList} from '../course.mjs';
import {journeyChapters} from '../journey-model.mjs';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('../test-server.mjs'),{chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base='http://127.0.0.1:'+testServer.address().port;let browser;
try{
 const r=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Map Progress QA',email:'map-progress@example.test',password:'synthetic-map-password',role:'learner',adult:true})});assert.ok(r.ok);const {user}=await r.json(),cookie=r.headers.get('set-cookie').split(';')[0];
 assert.ok((await fetch(base+'/api/profile',{method:'PUT',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({profile:{name:user.name,languages:['es','en','pt','ja'],primaryLanguage:'es',level:'A2',startMode:'manual',goal:'Synthetic QA'}})})).ok);
 for(const l of lessonList)await db.query("INSERT INTO practice_attempts(user_id,lesson_id,score,total,source,created_at) VALUES($1,$2,100,5,'exercise',now()-interval '1 day')",[user.id,l.id]);
 const id=lessonList[0].id;await db.query("INSERT INTO practice_attempts(user_id,lesson_id,score,total,source) SELECT $1,$2,0,5,'exercise' FROM generate_series(1,65)",[user.id,id]);
 const recent=await(await fetch(base+'/api/practice',{headers:{cookie}})).json();assert.equal(recent.attempts.length,50);assert.ok(recent.attempts.every(a=>a.score===0));
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox']});const context=await browser.newContext({viewport:{width:390,height:844}});await context.addCookies([{name:'continuum_session',value:cookie.split('=')[1],url:base}]);await context.addInitScript(id=>{localStorage.setItem('continuumJourneyLayout:'+id,'illustrated');localStorage.setItem('continuumInterfaceLanguage','en')},user.id);const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
 for(const language of ['es','en','pt','ja']){
 await page.goto(base);await page.locator('.illustrated-header').waitFor();await page.locator('.illustrated-header select[aria-label="Learning language"]').selectOption(language);
 for(const level of ['A1','A2','B1','B2','C1']){
 await page.locator('.mobile-nav button').first().click();await page.locator('.approved-map-levels button').filter({hasText:new RegExp('^'+level+'$')}).click();await page.locator('.approved-map-node').first().waitFor();const map=await page.locator('.approved-map-node>small').allTextContents();const expected=journeyChapters(language,level).map(c=>c.lessons.length+'/'+c.lessons.length);assert.deepEqual(map.map(x=>x.split(' · ')[0]),expected,language+' '+level+' map');
 await page.locator('.mobile-nav button').nth(1).click();await page.locator('.approved-course-levels button').filter({hasText:new RegExp('^'+level+'$')}).click();assert.deepEqual(await page.locator('.approved-course-chapter>summary>strong').allTextContents(),expected,language+' '+level+' Learn');
 }
 }
 // Failed requests must show retry instead of misleading zero completion counts.
 await page.route('**/api/learning',route=>route.fulfill({status:503,json:{error:'Synthetic outage'}}));await page.locator('.mobile-nav button').first().click();await page.locator('.approved-map-panel [role=alert]').waitFor();assert.equal(await page.locator('.approved-map-node').count(),0);await page.unroute('**/api/learning');await page.locator('.approved-map-panel').getByRole('button',{name:'Try again',exact:true}).click();await page.locator('.approved-map-node').first().waitFor();assert.deepEqual(errors,[]);console.log('PASS map/Learn parity across four languages × five levels with 65 newer failed attempts; reload/navigation, best-score retention, outage and retry.');await context.close();
}finally{await browser?.close();await new Promise(r=>testServer.close(r));await db.close()}
