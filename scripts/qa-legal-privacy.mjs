// Real built UI and account APIs, disposable DB; external video network is stubbed.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {exclusiveSession} from '../premium-session.mjs';
import {premiumVideoCourses} from '../premium-video-lessons.mjs';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;delete process.env.STRIPE_SECRET_KEY;
const {testServer,db}=await import('../test-server.mjs');
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,person){const r=await fetch(origin+'/api'+path,{method,headers:{'Content-Type':'application/json',...(person?{cookie:person.cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});assert.ok(r.ok,path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function person(name,role='learner'){const r=await api('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-privacy-browser-password',role,adult:true});return {...r.data.user,cookie:r.cookie};}
try{
 const learner=await person('LegalLearner'),teacher=await person('LegalTeacher','teacher');
 await api('/profile','PUT',{profile:{name:learner.name,languages:['en'],primaryLanguage:'en',level:'A1',startMode:'manual',goal:'Synthetic privacy QA'}},learner);
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[learner.id]);
 await mkdir('.media-build/legal-privacy',{recursive:true});
 for(const name of (process.env.QA_BROWSERS||'chromium,webkit').split(',')){
  await api('/privacy','PUT',{shareSelfLearning:true},learner);
  const browser=await ({chromium,webkit}[name]).launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
  try{
   const publicContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),publicPage=await publicContext.newPage();
   for(const path of ['/terms','/privacy','/help']){const r=await publicPage.goto(origin+path);assert.equal(r.status(),200);assert.ok(await publicPage.locator('h1').innerText());assert.ok(await publicPage.locator('a[href="mailto:continuum.language@gmail.com"]').count());assert.ok(await publicPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await publicPage.screenshot({path:`.media-build/legal-privacy/${name}-${path.slice(1)}.png`});}
   await publicPage.getByLabel('Search help').fill('subscriptions');await publicPage.locator('.public-search button').click();await publicPage.locator('h2').filter({hasText:'Subscriptions and billing'}).waitFor();assert.equal(await publicPage.locator('.public-section h2').count(),2);
   await publicContext.close();
   const context=await browser.newContext({viewport:{width:1280,height:900}});await context.addCookies([{name:'continuum_session',value:learner.cookie.split('=')[1],url:origin}]);
   await context.addInitScript(()=>{localStorage.setItem('continuumLanguage','en');localStorage.setItem('continuumInterfaceLanguage','en')});
   const page=await context.newPage(),settings=await context.newPage(),errors=[],external=[];
   for(const p of [page,settings])p.on('pageerror',e=>errors.push(e.message));
   await context.route('https://www.youtube-nocookie.com/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Synthetic external player</title>'}));
   context.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url())});
   await page.goto(origin+'/?open=account');await page.locator('.account-page').waitFor();assert.equal(await page.locator('.policy-links a').filter({hasText:'Privacy Settings'}).count(),1);
   const course=premiumVideoCourses.find(c=>c.language==='en');
   await page.locator('.app>aside nav button').filter({hasText:/^Practice Studio$/}).click();await page.locator('.studio-menu button').filter({hasText:'Exclusive courses'}).click();await page.locator('.membership-courses article').filter({has:page.locator('h3',{hasText:course.title})}).locator('button.primary').click();
   await page.locator('.external-media-placeholder').first().waitFor();assert.equal(await page.locator('iframe,video').count(),0);assert.deepEqual(external,[],'no external fonts/player before permission');
   await settings.goto(origin+'/privacy-settings');await settings.locator('#teacher-sharing').waitFor();assert.equal(await settings.locator('#external-media').isChecked(),false);
   await settings.locator('.public-actions button').filter({hasText:'Allow optional services'}).click();await page.bringToFront();await page.locator('iframe').waitFor();assert.ok((await page.locator('iframe').getAttribute('src')).startsWith('https://www.youtube-nocookie.com/embed/'));
   await page.locator('.lesson-begin button').click();await page.locator('.question-card').waitFor();const draftKey=`continuum-exclusive:${learner.id}:${course.id}:${course.contentVersion||1}`;await page.waitForFunction(key=>!!JSON.parse(sessionStorage.getItem(key)||'null')?.shuffleSeed,draftKey);const draft=await page.evaluate(key=>JSON.parse(sessionStorage.getItem(key)),draftKey),active=exclusiveSession(course,draft.shuffleSeed).questions[0];const cue=active.videoCue;if(cue){const u=new URL(await page.locator('.question-card iframe').getAttribute('src'));assert.equal(u.searchParams.get('start'),String(cue.start));assert.equal(u.searchParams.get('end'),String(cue.end));assert.equal(u.searchParams.get('autoplay'),'1');}
   await settings.bringToFront();await settings.locator('.public-actions button').filter({hasText:'Reject optional services'}).click();await page.bringToFront();await page.waitForFunction(()=>!document.querySelector('iframe'));await page.locator('.external-media-placeholder').waitFor();
   // Consent stays rejected after reload. The lesson draft and question are preserved.
   await settings.reload();await settings.locator('#teacher-sharing').waitFor();assert.equal(await settings.locator('#external-media').isChecked(),false);
   const accountPage=await context.newPage();await accountPage.goto(origin+'/?open=account');await accountPage.locator('.privacy-switch[aria-checked="true"]').waitFor();await settings.bringToFront();await settings.locator('#teacher-sharing').click();await settings.getByRole('status').filter({hasText:'Your account privacy choice was saved.'}).waitFor();assert.equal(await settings.locator('#teacher-sharing').isChecked(),false);assert.equal((await api('/privacy','GET',null,learner)).data.shareSelfLearning,false);await accountPage.bringToFront();await accountPage.locator('.privacy-switch[aria-checked="false"]').waitFor();await accountPage.close();
   await db.query("INSERT INTO learning_pattern_reports(user_id,language,enabled,report) VALUES($1,'en',true,'{}') ON CONFLICT(user_id,language) DO UPDATE SET enabled=true,report='{}'",[learner.id]);await settings.reload();await settings.locator('.public-patterns button').waitFor();await settings.locator('.public-patterns button').click();await settings.waitForFunction(()=>document.querySelector('.public-patterns')?.textContent.includes('English · Not enabled'));assert.equal((await api('/privacy/settings','GET',null,learner)).data.patterns.find(p=>p.language==='en').enabled,false);
   for(const width of [1280,390]){await settings.setViewportSize({width,height:900});assert.ok(await settings.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await settings.screenshot({path:`.media-build/legal-privacy/${name}-settings-${width}.png`});}
   const teacherContext=await browser.newContext({viewport:{width:390,height:844}});await teacherContext.addCookies([{name:'continuum_session',value:teacher.cookie.split('=')[1],url:origin}]);const tp=await teacherContext.newPage();await tp.goto(origin+'/privacy-settings');await tp.locator('.public-section').filter({hasText:'Learners control which self-study records'}).waitFor();assert.equal(await tp.locator('#teacher-sharing').count(),0);await tp.goto(origin+'/?open=support');await tp.locator('.ops-support').waitFor();await teacherContext.close();
   await context.clearCookies();await settings.goto(origin+'/privacy-settings');await settings.getByRole('link',{name:'Sign in to your account'}).waitFor();assert.equal(await settings.locator('#teacher-sharing').count(),0);await settings.goto(origin+'/?open=support');await settings.locator('.entry-shell .policy-links a').filter({hasText:'Help'}).waitFor();
   assert.deepEqual(errors,[]);assert.ok(external.some(x=>x.startsWith('https://www.youtube-nocookie.com/')));assert.ok(!external.some(x=>/fonts.googleapis|fonts.gstatic/.test(x)));await context.close();
   console.log(`PASS ${name}: public no-JS terms/privacy/help/contact and search; account links; no external requests before consent; approved timed video; cross-tab revocation and reload; real sharing/report controls; teacher/signed-out boundaries; desktop/mobile`);
  }finally{await browser.close()}
 }
}finally{await new Promise(r=>testServer.close(r));await db.close()}
