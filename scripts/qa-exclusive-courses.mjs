// Synthetic local browser QA; no production services, payments or AI calls.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {premiumCourses} from '../premium-courses.mjs';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
process.env.BILLING_ENABLED='false';delete process.env.STRIPE_SECRET_KEY;delete process.env.STRIPE_WEBHOOK_SECRET;
const {testServer,db}=await import('../test-server.mjs');
const origin='http://127.0.0.1:'+testServer.address().port;
const registered=await fetch(origin+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Exclusive QA',email:'exclusive-qa@example.test',password:'synthetic-qa-password',role:'learner',adult:true})});
assert.equal(registered.status,200);
const premium={...(await registered.json()).user,cookie:registered.headers.get('set-cookie').split(';')[0]};
const configured=await fetch(origin+'/api/profile',{method:'PUT',headers:{'Content-Type':'application/json',cookie:premium.cookie},body:JSON.stringify({profile:{name:'Exclusive QA',languages:['en','es','pt','ja'],primaryLanguage:'en',level:'B1',startMode:'manual',goal:'Synthetic exclusive-course QA'}})});assert.equal(configured.status,200);
await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[premium.id]);
const profile=await mkdtemp(join(tmpdir(),'continuum-billing-browser-'));const browser=spawn(process.env.CHROMIUM_BIN||'chromium',['--headless','--no-sandbox','--disable-dev-shm-usage','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});let ws;const exceptions=[];
try{
 const address=await new Promise((resolve,reject)=>{let s='';const timer=setTimeout(()=>reject(Error('Browser startup timeout')),15000);browser.on('error',reject);browser.stderr.on('data',b=>{s+=b;const m=s.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(m){clearTimeout(timer);resolve(m[1])}})});
 const debug=address.replace(/^ws:/,'http:').split('/devtools/')[0],target=await(await fetch(debug+'/json/new?'+encodeURIComponent(origin),{method:'PUT'})).json();ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j});let seq=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text)};
 const call=(method,params={})=>new Promise((r,j)=>{const id=++seq,t=setTimeout(()=>j(Error('CDP timeout')),15000);pending.set(id,m=>{clearTimeout(t);m.error?j(Error(m.error.message)):r(m.result)});ws.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true,userGesture:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value};
 const wait=async expression=>{for(let i=0;i<200;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,50))}throw Error('UI timeout '+expression+' '+await evaluate('document.body.innerText.slice(-1800)'))};
 const click=(scope,label)=>evaluate(`(()=>{const b=[...document.querySelectorAll(${JSON.stringify(scope+' button')})].find(b=>b.textContent.trim()===${JSON.stringify(label)});if(!b)throw Error('Missing button '+${JSON.stringify(label)});b.click()})()`);
 await call('Runtime.enable');await call('Network.enable');await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 const sign=async p=>{await call('Network.setCookie',{name:'continuum_session',value:p.cookie.split('=')[1],url:origin,httpOnly:true,sameSite:'Lax'});await call('Page.navigate',{url:origin+'/?billing=success'});await wait("!!document.querySelector('.membership-panel h2')");};
 await sign(premium);
 await click('.membership-panel','Open Practice Studio');await wait("!!document.querySelector('.studio-menu')");
 await evaluate("[...document.querySelectorAll('.studio-menu button')].find(b=>b.querySelector('strong').textContent==='Exclusive courses').click()");await wait("!!document.querySelector('.membership-courses')");
 const open=async course=>{const changed=await evaluate(`(()=>{const s=document.querySelector('.language-picker select');if(s.value===${JSON.stringify(course.language)})return false;s.value=${JSON.stringify(course.language)};s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);if(changed){await click('.app>aside nav','Practice Studio');await wait("!!document.querySelector('.studio-menu')");await evaluate("[...document.querySelectorAll('.studio-menu button')].find(b=>b.querySelector('strong').textContent==='Exclusive courses').click()");}await wait(`!![...document.querySelectorAll('.membership-courses article')].find(a=>a.querySelector('h3')?.textContent===${JSON.stringify(course.title)})`);await evaluate(`[...document.querySelectorAll('.membership-courses article')].find(a=>a.querySelector('h3')?.textContent===${JSON.stringify(course.title)}).querySelector('.primary').click()`);await wait("!!document.querySelector('.lesson-intro-card')||!!document.querySelector('.question-card')");};
 const submit=async(q,wrong=false)=>{
  if(q.type==='reorder'){for(const idx of q.tokens.map((_,j)=>j).reverse())await evaluate(`document.querySelectorAll('.word-builder-tiles button')[${idx}].click()`);}
  else if(typeof q.answer==='string')await evaluate(`(()=>{const el=document.querySelector('#written-answer');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(q.answer)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  else await evaluate(`document.querySelectorAll('.answers .answer-with-audio>button')[${wrong?(q.answer+1)%q.options.length:q.answer}].click()`);
  await click('.question-card','Check answer');await wait("!!document.querySelector('.feedback')");
 };
 for(const language of ['en','es','pt','ja']){
  const course=premiumCourses.find(c=>c.language===language&&c.scene==='varieties');await open(course);
  assert.ok(await evaluate("!!document.querySelector('.lesson-reference table')"));
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),true,language+' intro overflows');
  if(language==='es')assert.ok(await evaluate("document.querySelector('.lesson-reference').textContent.includes('tenés')&&document.querySelector('.lesson-reference').textContent.includes('vení')"));
  await click('.lesson-begin','Start practice');await wait("!!document.querySelector('.question-card')");
  assert.ok(await evaluate(`document.querySelector('.question-card').textContent.includes(${JSON.stringify(language==='ja'?'Osaka native speaker':'not an authenticated regional recording')})`));
  assert.equal(await evaluate("document.querySelectorAll('.audio-transcript').length"),language==='ja'?0:1);
  if(language!=='ja')assert.equal(await evaluate("document.querySelector('.audio-transcript').open"),false);
  if(language!=='es'){await click('.practice-top','Save & exit');await wait("!!document.querySelector('.membership-courses')");continue;}
  await evaluate("window.__tts=[];window.__fetch=window.fetch;window.fetch=(input,options)=>String(input).includes('/audio?question=')?(window.__tts.push(String(input)),Promise.resolve(Response.json({error:'Synthetic regional audio unavailable'},{status:503}))):window.__fetch(input,options)");
  await evaluate("document.querySelector('.question-card .sentence-play').click()");await wait("!!document.querySelector('.sentence-audio-error')");assert.equal(await evaluate("document.querySelector('.sentence-audio-error').textContent.includes('Use device voice instead')"),false);assert.equal(await evaluate('window.__tts.length'),1);await evaluate('window.fetch=window.__fetch');
  for(let i=0;i<course.questions.length;i++){
   await wait(`document.querySelector('.practice-top').textContent.includes(${JSON.stringify((i+1)+'/'+course.questions.length)})`);
   await submit(course.questions[i],i===0);
   await evaluate("document.querySelector('.question-card>.primary').click()");
   if(i===0){await wait("!document.querySelector('.feedback')");await click('.practice-top','Save & exit');await wait("!!document.querySelector('.membership-courses')");await open(course);assert.equal(await evaluate("!!document.querySelector('.lesson-intro-card')"),false,'resume must restore practice');}
  }
  await wait("!!document.querySelector('.retry-notice')");await submit(course.questions[0]);await click('.question-card','Finish & save');await wait("!!document.querySelector('.result-card')");assert.ok(await evaluate("document.querySelector('.result-card h1').textContent.includes('88%')"),'retry must retain first-response score');
  assert.equal((await db.query('SELECT correct,total FROM premium_course_attempts WHERE user_id=$1 AND course_id=$2',[premium.id,course.id])).rows[0].correct,7);
  await click('.result-card','Try again');await wait("!!document.querySelector('.question-card')");
  for(let i=0;i<course.questions.length;i++){await wait(`document.querySelector('.practice-top').textContent.includes(${JSON.stringify((i+1)+'/'+course.questions.length)})`);await submit(course.questions[i]);await evaluate("document.querySelector('.question-card>.primary').click()");}
  await wait("!!document.querySelector('.result-card')");assert.ok(await evaluate("document.querySelector('.result-card h1').textContent.includes('100%')"));assert.deepEqual((await db.query('SELECT correct FROM premium_course_attempts WHERE user_id=$1 AND course_id=$2 ORDER BY correct',[premium.id,course.id])).rows.map(r=>r.correct),[7,8],'Try again must create a new attempt');
  await click('.result-card','Back to courses');await wait("!!document.querySelector('.membership-courses')");
 }
 for(const course of premiumCourses.filter(c=>c.conversation)){
  await open(course);await click('.lesson-begin','Start practice');await wait("!!document.querySelector('.question-card')");
  assert.ok(await evaluate("!!document.querySelector('.question-card .conversation-video')"),course.id);
  if(course.conversation.provider==='youtube')assert.ok(await evaluate(`document.querySelector('.question-card iframe').src.includes(${JSON.stringify(course.conversation.youtubeId)})`));
  else assert.ok(await evaluate(`!!document.querySelector('.question-card a[href="${course.conversation.source}"]')`));
  assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth+1'),true,course.id);
  if(course.questions[0].videoCue){
   const inspectClip=async q=>{
    const src=new URL(await evaluate("document.querySelector('.question-card iframe').src"));
    assert.equal(src.searchParams.get('start'),String(q.videoCue.start));
    assert.equal(src.searchParams.get('end'),String(q.videoCue.end));
    assert.equal(src.searchParams.get('autoplay'),'1');
   };
   await inspectClip(course.questions[0]);
   await click('.question-card .conversation-tools','Watch full video (optional)');
   assert.equal(new URL(await evaluate("document.querySelector('.question-card iframe').src")).searchParams.has('start'),false);
   await evaluate("document.querySelector('.question-card .conversation-tools button').click()");await inspectClip(course.questions[0]);
   // Walk every timed question: the assigned window must update on each turn.
   for(let i=0;i<course.questions.length;i++){
    await inspectClip(course.questions[i]);await submit(course.questions[i]);
    if(i<course.questions.length-1){await evaluate("document.querySelector('.question-card>.primary').click()");await wait(`document.querySelector('.practice-top').textContent.includes(${JSON.stringify((i+2)+'/'+course.questions.length)})`);}
   }
  }else await submit(course.questions[0]);
  await click('.practice-top','Save & exit');await wait("!!document.querySelector('.membership-courses')");
 }
 assert.deepEqual(exceptions,[]);
 console.log('PASS: mobile regional courses use the regular intro, tables, question controls, hidden transcripts and review flow; vos practice resumes, saves 7/8 after retry, and unavailable regional audio never offers a device substitute. All four languages render without overflow.');
}finally{ws?.close();const exited=new Promise(r=>browser.once('exit',r));browser.kill();await Promise.race([exited,new Promise(r=>setTimeout(r,3000))]);await new Promise(r=>testServer.close(r));await db.close();await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:150});}
