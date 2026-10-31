// Real built app, disposable data, no provider calls or production accounts.
import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
import {languages} from '../languages.mjs';import {premiumCourseSummary} from '../premium-courses.mjs';
import {interfaceCopy} from '../interface-copy.mjs';import {reviewedTranslation} from '../reviewed-interface-copy.mjs';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('../test-server.mjs'),{chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),base='http://127.0.0.1:'+testServer.address().port;
const copy=(source,locale)=>locale==='en'?source:reviewedTranslation(source,locale)||interfaceCopy[source]?.[locale]||source;
async function api(path,method,body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(body)});const data=await r.json();assert.ok(r.ok,path+' '+r.status);return {data,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
let browser,page;const errors=[];
try{
 await mkdir('.media-build/language-records',{recursive:true});const learner=await api('/auth/register','POST',{name:'Language Record QA',email:'language-record-qa@example.test',password:'synthetic-record-password',role:'learner',adult:true}),id=learner.data.user.id,cookie=learner.cookie;
 await api('/profile','PUT',{profile:{name:'Language Record QA',languages:languages.map(l=>l.id),primaryLanguage:'es',level:'A1',startMode:'manual',goal:'Synthetic language-history QA'}},cookie);
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[id]);
 const counts={};for(const [index,language] of languages.entries()){const count=language.id==='ar'?0:index+1;counts[language.id]=count;if(count)await db.query(`INSERT INTO skill_submissions(user_id,task_id,response,result,submission_key) SELECT $1,$2,'"Original learner evidence"'::jsonb,'{"status":"pending"}'::jsonb,$3||n FROM generate_series(1,$4) n`,[id,(language.id==='es'?'':language.id+'-')+'skills-a1-writing','browser-'+language.id+'-',count]);}
 await db.query(`INSERT INTO skill_submissions(user_id,task_id,response,result,submission_key) VALUES($1,'focus-fr-work-writing-b2','"Original Premium evidence"'::jsonb,'{"status":"pending"}'::jsonb,'browser-fr-premium')`,[id]);counts.fr++;
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const layout of ['photo','illustrated']){
  await api('/interface-language','PUT',{language:'en'},cookie);
  const context=await browser.newContext({viewport:{width:390,height:900},reducedMotion:'reduce'});await context.addCookies([{name:'continuum_session',value:cookie.split('=')[1],url:base}]);
  await context.addInitScript(({id,layout})=>{localStorage.setItem('continuumInterfaceLanguage','en');localStorage.setItem('continuumLanguage','es');localStorage.setItem('continuumJourneyLayout:'+id,layout);},{id,layout});
  page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.locator('.mobile-nav button').first().waitFor({state:'attached'});
  let width=390;const nav=()=>page.locator(width<=900?'.mobile-nav button':'.app>aside nav button');
  for(const viewport of [390,1280]){width=viewport;await page.setViewportSize({width,height:900});
   for(const language of languages){await nav().nth(0).click();await page.locator('.learner-shortcuts').waitFor();await page.getByRole('combobox',{name:'Learning language',exact:true}).selectOption(language.id);await nav().nth(0).click();await page.locator('.learner-shortcuts').waitFor();await page.locator('.learner-shortcuts button').first().click();await page.locator('.skills-record').waitFor({state:'attached'});
    if(layout==='illustrated')await page.locator('.approved-record-disclosure').filter({has:page.locator('.skills-record')}).evaluate(e=>e.open=true);
    await page.waitForFunction(n=>document.querySelector('.skills-record .learning-log-group>summary')?.textContent.trim().endsWith('· '+n),counts[language.id]);
    await page.locator('.skills-record .learning-log-group>summary').click();assert.equal(await page.locator('.skills-history>button').count(),counts[language.id]);
    if(language.id==='ar')assert.ok(await page.getByText('No submissions yet. Complete a skill workshop or submit a test response.',{exact:true}).count());
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),layout+' '+language.id+' record overflow');
   }
  }
  console.log('PASS records: ten learning languages, correct counts and lists, empty language, phone/desktop',layout);
  for(const [index,locale] of ['ja','es','pt','zh','fr','ko','id','ru','ar'].entries()){
   width=index%2?1280:390;await page.setViewportSize({width,height:900});await api('/interface-language','PUT',{language:locale},cookie);await page.reload();await page.waitForFunction(l=>document.documentElement.lang===(l==='zh'?'zh-Hans':l),locale);await page.locator('.mobile-nav button').first().waitFor({state:'attached'});
   for(const language of ['zh','ko','fr','de','ar','it']){
    await nav().nth(0).click();await page.locator('.learner-shortcuts').waitFor();await page.getByRole('combobox',{name:copy('Learning language',locale),exact:true}).selectOption(language);await nav().nth(2).click();await page.locator('.studio-menu button').filter({hasText:copy('Exclusive courses',locale)}).click();await page.locator('.membership-courses article').first().waitFor();
    const expected=premiumCourseSummary.filter(c=>c.language===language);assert.equal(await page.locator('.membership-courses article').count(),expected.length);
    assert.deepEqual(await page.locator('.membership-courses article h3').allTextContents(),expected.map(c=>copy(c.title,locale)));assert.deepEqual(await page.locator('.membership-courses article>p').allTextContents(),expected.map(c=>copy(c.description,locale)));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),layout+' '+locale+' '+language+' cards overflow');
   }
   if(locale==='ja'){await page.locator('.membership-courses article').filter({hasText:'第一印象にとらわれずに聞く'}).screenshot({path:'.media-build/language-records/'+layout+'-ja-course-card.png'});}
  }
  console.log('PASS cards: six new learning languages ×nine display languages, no provider needed',layout);await context.close();page=null;
 }
 assert.deepEqual(errors,[]);
}catch(error){console.error('Language record QA failure',JSON.stringify({url:page?.url(),errors,body:await page?.locator('body').innerText().catch(()=>null)}));await page?.screenshot({path:'.media-build/language-records/failure.png',fullPage:true}).catch(()=>{});throw error;}finally{await browser?.close();await new Promise(r=>testServer.close(r));await db.close();}
