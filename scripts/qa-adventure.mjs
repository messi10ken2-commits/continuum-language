// Built frontend + disposable accounts/database. No production writes or AI calls.
import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('../test-server.mjs'),{chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');const base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method,body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(body)});assert.ok(r.ok,path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
let browser;try{
 await mkdir('.media-build/lesson-clarity',{recursive:true});const learner=await api('/auth/register','POST',{name:'Clarity Learner',email:'clarity-learner@example.test',password:'synthetic-clarity-password',role:'learner',adult:true});const lid=learner.data.user.id;
 await db.query("INSERT INTO practice_attempts(user_id,lesson_id,score,total,source) VALUES($1,'ja-a1-v2-lesson-1',80,5,'exercise')",[lid]);
 await api('/profile','PUT',{profile:{name:'Clarity Learner',languages:['es','ja'],primaryLanguage:'es',level:'A2',startMode:'manual',goal:'Synthetic QA'}},learner.cookie);
 const teacher=await api('/auth/register','POST',{name:'QA Teacher',email:'approved-teacher@example.test',password:'synthetic-teacher-password',role:'teacher',adult:true});
 await db.query("INSERT INTO teacher_profiles(user_id,data,status) VALUES($1,$2,'approved')",[teacher.data.user.id,{name:'QA Teacher',languages:['ja']}]);
 const share=await api('/share-code','POST',{language:'ja'},learner.cookie);await api('/teacher/connect','POST',{code:share.data.code},teacher.cookie);
 const thread=(await db.query("INSERT INTO class_threads(teacher_id,learner_id,language) VALUES($1,$2,'ja') RETURNING id",[teacher.data.user.id,lid])).rows[0].id;
 await db.query("INSERT INTO class_bookings(thread_id,teacher_id,learner_id,language,starts_at,ends_at,proposed_timezone,proposed_by,status,topic,client_key,input_hash) VALUES($1,$2,$3,'ja',now()+interval '1 day',now()+interval '1 day 30 minutes','UTC',$3,'confirmed','Japanese conversation','approved-qa-booking','synthetic')",[thread,teacher.data.user.id,lid]);
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox']});
 for(const layout of ['illustrated','photo']){
  await api('/interface-language','PUT',{language:'en'},learner.cookie);
  const context=await browser.newContext({viewport:{width:390,height:900}});await context.addCookies([{name:'continuum_session',value:learner.cookie.split('=')[1],url:base}]);await context.addInitScript(({id,layout})=>{localStorage.setItem('continuumInterfaceLanguage','en');localStorage.setItem('continuumLanguage','ja');localStorage.setItem('continuumJourneyLayout:'+id,layout);localStorage.setItem('continuumRPG:'+id,JSON.stringify({motion:false}))},{id:lid,layout});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);
  await page.locator('.mobile-nav button').first().waitFor();
  if(layout==='illustrated'){
   await page.locator('.adventure-hub').waitFor();await page.getByRole('button',{name:'Choose your companion',exact:true}).click();await Promise.all([page.waitForResponse(r=>r.url().includes('/api/adventure')&&r.request().method()==='PUT'),page.getByRole('button',{name:'Fox',exact:true}).click()]);
   await page.getByRole('button',{name:'Listen and discover',exact:true}).click();await page.locator('.selected-quest').waitFor();await page.reload();await page.locator('.selected-quest').waitFor();assert.equal(await page.locator('.quest-choices').count(),0);
  }

  for(const width of [390,320,768,1440]){await page.setViewportSize({width,height:900});
   for(const [index,name] of [[0,'overview'],[1,'learn'],[2,'studio'],[3,'classes'],[4,'account']]){await page.locator(width<=900?'.mobile-nav button':'.app>aside nav button').nth(index).click().catch(async()=>{await page.locator('.app>aside nav button').nth(index).click()});await page.waitForTimeout(150);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),layout+name+width);if(layout==='illustrated')assert.equal(await page.locator('.approved-illustrated').count(),1);if(width===390)await page.screenshot({path:'.media-build/lesson-clarity/approved-'+layout+'-'+name+'.png',fullPage:true});}
  }
  await page.setViewportSize({width:390,height:900});await page.locator('.mobile-nav button').nth(0).click();if(layout==='illustrated'){await page.getByRole('button',{name:/Level test/}).first().click();await page.locator('.illustrated-assessment-intro').waitFor();await page.screenshot({path:'.media-build/lesson-clarity/approved-test.png',fullPage:true});await page.locator('.mobile-nav button').first().click();await page.getByRole('button',{name:/Learning memory/}).first().click();await page.locator('.approved-memory').waitFor();await page.screenshot({path:'.media-build/lesson-clarity/approved-memory.png',fullPage:true});}
  if(layout==='illustrated'){
 await page.locator('.mobile-nav button').nth(1).click();await page.locator('.approved-course').waitFor();await page.locator('[data-lesson-id]').first().click();await page.locator('.lesson-intro-card').waitFor();await page.screenshot({path:'.media-build/lesson-clarity/approved-lesson-intro.png',fullPage:true});assert.equal(await page.locator('.lesson-intro-card .illustrated-lesson-reference').count(),1);await page.locator('.lesson-begin .primary').click();await page.locator('.question-card').waitFor();await page.screenshot({path:'.media-build/lesson-clarity/approved-lesson-question.png',fullPage:true});assert.equal(await page.locator('.mobile-nav').isVisible(),false);assert.ok(await page.locator('.page-scene img').first().evaluate(e=>e.complete&&e.naturalWidth>0));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.locator('.practice-top .back').click();await page.locator('.approved-course').waitFor();
 await page.locator('.mobile-nav button').nth(2).click();await page.locator('.studio-menu button').nth(2).click();await page.waitForTimeout(150);assert.ok(await page.locator('.practice-studio').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<120));
 }
 if(layout==='illustrated'){
 await page.locator('.mobile-nav button').nth(3).click();await page.locator('.approved-class-person').waitFor();assert.ok(await page.getByRole('button',{name:'Message teacher',exact:true}).isVisible());await page.getByRole('button',{name:'Message teacher',exact:true}).click();await page.locator('.class-chat').waitFor();assert.ok(await page.locator('.class-tabs button').filter({hasText:'Messages'}).evaluate(e=>e.classList.contains('selected')));
 const result={language:'ja',level:'B1',courseLevel:'B1',correct:34,total:45,method:'ja-diagnostic-4',skills:[{name:'Listening',correct:9,total:15,level:'A2'},{name:'Reading',correct:12,total:15,level:'B1'},{name:'Language use',correct:13,total:15,level:'B2'}],bands:[]};
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[lid]);
 await db.query("INSERT INTO assessments(user_id,kind,version,form,language,result,completed_at) VALUES($1,'placement','ja-diagnostic-4',0,'ja',$2,now())",[lid,result]);
 await page.reload();await page.locator('.mobile-nav button').first().click();await page.getByRole('button',{name:/Level test/}).first().click();await page.locator('.illustrated-skill-row').first().waitFor();assert.equal(await page.locator('.illustrated-skill-row').count(),4);assert.equal(await page.locator('.illustrated-skill-row progress').first().getAttribute('value'),'60');await page.screenshot({path:'.media-build/lesson-clarity/approved-report.png',fullPage:true});await page.getByRole('button',{name:'Review assessment details',exact:true}).click();await page.locator('.illustrated-full-report').waitFor();
 }
 assert.deepEqual(errors,[]);await context.close();console.log('PASS approved navigation widths and overflow',layout);
 }
}finally{await browser?.close();await new Promise(r=>testServer.close(r));await db.close();}
