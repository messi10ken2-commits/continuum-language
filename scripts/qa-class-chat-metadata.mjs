// Exercise saved messages in the real app; synthetic accounts, no production writes.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('../test-server.mjs');
const {chromium,webkit}=await import('playwright');
const base='http://127.0.0.1:'+testServer.address().port,engine=process.env.QA_BROWSER||'chromium';
let browser;
async function api(path,method,body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:body?JSON.stringify(body):undefined});assert.ok(r.ok,path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 await mkdir('.media-build/class-chat',{recursive:true});
 const people={};
 for(const role of ['learner','teacher']){
  people[role]=await api('/auth/register','POST',{name:'Chat '+role,email:'chat-'+role+'@example.test',password:'synthetic-chat-password',role,adult:true});
  const {data,cookie}=people[role];
  if(role==='learner')await api('/profile','PUT',{profile:{name:data.user.name,languages:['en'],primaryLanguage:'en',level:'A1',startMode:'manual',goal:'QA'}},cookie);
  else await db.query("INSERT INTO teacher_profiles(user_id,data,status) VALUES($1,$2,'approved')",[data.user.id,{name:data.user.name,languages:['en'],timezone:'Asia/Kuala_Lumpur'}]);
 }
 const code=(await api('/share-code','POST',{language:'en'},people.learner.cookie)).data.code;
 await api('/teacher/connect','POST',{code},people.teacher.cookie);
 await api('/classroom/threads','POST',{otherId:people.teacher.data.user.id,language:'en'},people.learner.cookie);
 const thread=(await api('/classroom','GET',null,people.learner.cookie)).data.threads[0];assert.ok(thread);
 for(const role of ['learner','teacher'])await api('/classroom/threads/'+thread.id+'/messages','POST',{body:'Saved message from '+role,clientKey:crypto.randomUUID()},people[role].cookie);
 await db.query("INSERT INTO class_messages(thread_id,author_id,kind,body) VALUES($1,$2,'update','The meeting link has been updated.')",[thread.id,people.teacher.data.user.id]);
 browser=await ({chromium,webkit}[engine]).launch({headless:true,...(engine==='chromium'?{args:['--no-sandbox']}: {})});
 for(const layout of ['photo','illustrated'])for(const role of ['learner','teacher']){
  const person=people[role],id=person.data.user.id;
  const context=await browser.newContext({viewport:{width:390,height:844},timezoneId:'Asia/Kuala_Lumpur'});
  await context.addCookies([{name:'continuum_session',value:person.cookie.split('=')[1],url:base}]);
  await context.addInitScript(({id,layout})=>{localStorage.setItem('continuumInterfaceLanguage','en');localStorage.setItem('continuumLanguage','en');localStorage.setItem('continuumJourneyLayout:'+id,layout);localStorage.setItem('continuumClassTimezone:'+id,'Asia/Kuala_Lumpur')},{id,layout});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  async function openChat(){await page.goto(base);await page.locator('.app>aside nav button').filter({hasText:'My classes'}).click();await page.locator('.class-tabs button').filter({hasText:/^Messages/}).click();await page.locator('.class-conversation').first().click();await page.locator('.class-message.own').first().waitFor();}
  await openChat();
  const body='New saved '+layout+' '+role;
  await page.locator('.class-chat-compose textarea').fill(body);await page.locator('.class-chat-compose .primary').click();
  await page.locator('.class-message.own').filter({hasText:body}).waitFor();
  const records=(await api('/classroom/threads/'+thread.id+'/messages','GET',null,person.cookie)).data.messages;
  const saved=records.find(m=>m.body===body);assert.equal(saved.authorId,id);assert.ok(Number.isFinite(Date.parse(saved.at)));
  await openChat();
  const message=page.locator('.class-message.own').filter({hasText:body});await message.waitFor();
  assert.match(await message.locator('small').innerText(),/^You · .+GMT\+8$/);
  const texts=await page.locator('.class-message small').allTextContents();assert.ok(texts.some(s=>s.startsWith('Chat '+(role==='learner'?'teacher':'learner')+' · ')));
  for(const width of [320,390,1280]){
   await page.setViewportSize({width,height:900});
   const checks=await page.locator('.class-message').evaluateAll(es=>es.map(e=>{
    const small=e.querySelector('small'),style=getComputedStyle(small),bubble=getComputedStyle(e);
    const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number),luminance=rgb=>rgb.map(n=>{n/=255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4}).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
    const a=luminance(rgb(style.color)),b=luminance(rgb(bubble.backgroundColor));
    return {text:small.textContent,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),opacity:style.opacity,display:style.display};
   }));
   for(const check of checks){assert.ok(check.contrast>=4.5,JSON.stringify({engine,layout,role,width,...check}));assert.equal(check.opacity,'1');assert.notEqual(check.display,'none');}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  }
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'.media-build/class-chat/'+engine+'-'+layout+'-'+role+'.png',fullPage:true});
  assert.deepEqual(errors,[]);await context.close();console.log('PASS',engine,layout,role,'sent message persists; You, sender names and timestamps remain readable at 320/390/1280px');
 }
}finally{await browser?.close();await new Promise(r=>testServer.close(r));await db.close();}
