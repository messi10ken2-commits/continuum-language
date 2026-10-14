// Local QA only: real built frontend, disposable PGlite accounts, no AI keys.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {lessonList,getLessonVariant} from '../course.mjs';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
process.env.NODE_ENV='development';
const {testServer,db}=await import('../test-server.mjs');
const origin='http://127.0.0.1:'+testServer.address().port;
const profile=await mkdtemp(join(tmpdir(),'continuum-qa-browser-'));
const browser=spawn(process.env.CHROMIUM_BIN||'chromium',['--headless','--no-sandbox','--disable-dev-shm-usage','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});
let ws;const results={environment:{browser:'local headless Chromium',database:'disposable PGlite',providers:'disabled'},navigationMs:[],combinations:[],screens:[],exceptions:[]};
try{
 const address=await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error('Chromium startup timeout')),15000);let output='';
  browser.on('error',reject);browser.stderr.on('data',chunk=>{output+=chunk;const match=output.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(match){clearTimeout(timer);resolve(match[1]);}});
 });
 const debug=address.replace(/^ws:/,'http:').split('/devtools/')[0];
 const target=await (await fetch(debug+'/json/new?'+encodeURIComponent(origin),{method:'PUT'})).json();
 ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 let sequence=0;const pending=new Map();
 ws.onmessage=event=>{const message=JSON.parse(event.data);if(message.id){pending.get(message.id)?.(message);pending.delete(message.id);}if(message.method==='Runtime.exceptionThrown')results.exceptions.push(message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;const timer=setTimeout(()=>reject(Error('CDP timeout '+method)),15000);pending.set(id,message=>{clearTimeout(timer);message.error?reject(Error(message.error.message)):resolve(message.result);});ws.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
 const wait=async expression=>{for(let i=0;i<150;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,50));}throw Error('UI timeout '+expression+' '+await evaluate('document.body.innerText.slice(0,800)'));};
 const select=async(selector,value)=>evaluate(`(()=>{const s=document.querySelector(${JSON.stringify(selector)});if(!s)throw Error('select missing');s.value=${JSON.stringify(value)};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 const nav=async index=>evaluate(`document.querySelectorAll('.app > aside nav button')[${index}].click()`);
 await call('Runtime.enable');await wait("!!document.querySelector('.welcome-page')");
 await evaluate("localStorage.setItem('continuumInterfaceLanguage','en')");
 const credentials={name:'QA Learner',email:'qa-browser@example.test',password:'synthetic-qa-password',role:'learner',adult:true};
 assert.equal(await evaluate(`fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify(credentials)})}).then(r=>r.status)`),200);
 assert.equal(await evaluate(`fetch('/api/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile:{name:'QA Learner',languages:['es','pt','ja','en'],primaryLanguage:'es',startMode:'manual',level:'A1',goal:'Synthetic QA'}})}).then(r=>r.status)`),200);
 // Record an authentic lesson to detect account-history leakage after logout.
 assert.equal(await evaluate("fetch('/api/practice',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lesson:'subjunctive',answers:[1,1,1,1,1],submissionKey:'qa-browser-history-001'})}).then(r=>r.status)"),201);
 await evaluate("fetch('/api/auth/logout',{method:'POST'})");await call('Page.reload');await wait("!!document.querySelector('.welcome-page')");
 await evaluate("window.__realFetch=window.fetch;window.fetch=(input,options)=>String(input)==='/api/practice'&&(!options?.method||options.method==='GET')?new Promise((resolve,reject)=>window.__realFetch(input,options).then(response=>{window.__releasePractice=()=>resolve(response)},reject)):window.__realFetch(input,options)");
 await evaluate("document.querySelector('.welcome-actions button').click()");await wait("!!document.getElementById('account-email')");
 await evaluate(`(()=>{for(const [id,value] of Object.entries({'account-email':${JSON.stringify(credentials.email)},'account-password':${JSON.stringify(credentials.password)}})){const s=document.getElementById(id);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(s,value);s.dispatchEvent(new Event('input',{bubbles:true}));}document.querySelector('.account-box form').requestSubmit();})()`);
 await wait("!!window.__releasePractice&&!!document.querySelector('.account-panels')");
 await evaluate("[...document.querySelectorAll('.account-panels button')].find(b=>b.textContent==='Sign out').click()");await wait("!!document.querySelector('.welcome-page')");
 await evaluate("window.__releasePractice();window.fetch=window.__realFetch");await new Promise(r=>setTimeout(r,200));
 const leaked=await evaluate("JSON.parse(localStorage.getItem('continuumPracticeHistory')||'[]')");
 assert.equal(leaked.length,0,'delayed account history must not become guest/device history');results.logoutRace='pass';
 // API-assisted login; navigation and language switching use the actual UI.
 assert.equal(await evaluate(`fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(${JSON.stringify(credentials)})}).then(r=>r.status)`),200);
 await call('Page.reload');await wait("!!document.querySelector('.language-picker select')");
 for(const base of ['en','ja','es','pt','zh','fr']){
  await nav(5);await wait("!!document.querySelector('.interface-picker select')");await select('.interface-picker select',base);await wait(`document.documentElement.lang===${JSON.stringify(base==='zh'?'zh-Hans':base)}&&!document.querySelector('.interface-picker select').disabled`);
  for(const target of ['es','ja','pt','en']){
   const start=performance.now();await select('.language-picker select',target);await wait("!!document.querySelector('.study-page')");results.navigationMs.push(performance.now()-start);
   assert.equal(await evaluate("document.querySelector('.language-picker select').value"),target);
   assert.equal(await evaluate('document.documentElement.lang'),base==='zh'?'zh-Hans':base);
   results.combinations.push({base,target});
  }
 }
 // Ambiguous Spanish "He" must use Spanish for answer audio, not English.
 const seed='v5-qa-audio-123456789',audioLesson=lessonList.find(l=>l.id==='b2-idioms-pressure');
 const audioVariant=getLessonVariant(audioLesson.id,seed),audioIndex=audioVariant.questions.findIndex(q=>q.options?.some(o=>/^He\b/.test(o)));
 assert.ok(audioIndex>=0);
 await evaluate(`fetch('/api/learning/${audioLesson.id}',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({seed:${JSON.stringify(seed)},answers:${JSON.stringify(audioVariant.questions.slice(0,audioIndex).map(q=>q.answer))}})}).then(r=>{if(!r.ok)throw Error('audio draft failed')})`);
 await evaluate("localStorage.setItem('continuumLanguage','es');localStorage.setItem('continuumCourseLevel','B2')");
 await call('Page.reload');await wait("!!document.querySelector('.language-picker select')");await nav(1);
 await wait(`!!document.querySelector('[data-lesson-id="${audioLesson.id}"]')`);await evaluate(`document.querySelector('[data-lesson-id="${audioLesson.id}"]').click()`);await wait("!!document.querySelector('.question-card .answer-copy')");
 await evaluate("window.__speechRequests=[];window.__realFetch=window.fetch;window.fetch=(input,options)=>String(input)==='/api/speech'?(window.__speechRequests.push(JSON.parse(options.body)),Promise.resolve(Response.json({error:'Synthetic unavailable provider'},{status:503}))):window.__realFetch(input,options)");
 await evaluate("[...document.querySelectorAll('.answer-with-audio')].find(e=>/^He\\b/.test(e.querySelector('.answer-copy').textContent)).querySelector('.sentence-play').click()");
 await wait("window.__speechRequests.length>0");assert.equal(await evaluate('window.__speechRequests[0].locale'),'es-ES');results.spanishAnswerAudio='pass';await evaluate('window.fetch=window.__realFetch');
 await nav(5);await wait("!!document.querySelector('.interface-picker select')");
 await nav(5);await select('.interface-picker select','en');await wait("document.documentElement.lang==='en'");
 for(const width of [1440,390,320]){
  await call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});
  for(const tab of [0,1,2,3,4,5]){
   await nav(tab);await new Promise(r=>setTimeout(r,100));
   const state=await evaluate("({width:innerWidth,scroll:document.documentElement.scrollWidth,text:document.querySelector('.content')?.innerText.length,alerts:[...document.querySelectorAll('[role=alert]')].map(x=>x.innerText)})");results.screens.push({tab,...state});assert.ok(state.text>0);
  }
 }
 await call('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
 results.completedLessons=[];
 for(const language of ['es','ja','pt','en']){
  await nav(1);await select('.language-picker select',language);await wait("!!document.querySelector('.level-roadmap button')");await evaluate("document.querySelector('.level-roadmap button').click()");
  const lesson=lessonList.find(l=>(l.language||'es')===language&&l.level==='A1'&&!l.checkpoint&&!l.summaryTest&&!l.productionTask&&!l.conversation);
  await wait(`!!document.querySelector('[data-lesson-id="${lesson.id}"]')`);await evaluate(`document.querySelector('[data-lesson-id="${lesson.id}"]').click()`);await wait("!!document.querySelector('.lesson-begin button')");
  await evaluate("document.querySelector('.lesson-begin button').click()");await wait("!!document.querySelector('.question-card')");
  const draft=await evaluate(`fetch('/api/learning').then(r=>r.json()).then(d=>d.drafts.find(x=>x.lesson===${JSON.stringify(lesson.id)}))`);assert.ok(draft);
  const variant=getLessonVariant(lesson.id,draft.seed);
  for(let index=0;index<variant.questions.length;index++){
   const q=variant.questions[index];
   if(q.mode==='order'){
    const arrange=(remaining,used=[])=>{
     if(used.length===q.tokens.length)return remaining===''?used:null;
     const seen=new Set();for(let tile=0;tile<q.tokens.length;tile++){
      const token=q.tokens[tile];if(used.includes(tile)||seen.has(token)||!remaining.startsWith(token))continue;seen.add(token);
      let rest=remaining.slice(token.length);if(q.joiner&&rest){if(!rest.startsWith(q.joiner))continue;rest=rest.slice(q.joiner.length);}
      const order=arrange(rest,[...used,tile]);if(order)return order;
     }return null;
    };
    const order=arrange(q.answer);assert.ok(order,lesson.id+': cannot reconstruct '+q.answer);
    for(const tile of order)await evaluate(`document.querySelectorAll('.word-builder-tiles button')[${tile}].click()`);
   }else if(q.type==='text')await evaluate(`(()=>{const input=document.getElementById('written-answer');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(q.answer)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
   else await evaluate(`document.querySelectorAll('.answers .answer-with-audio > button')[${q.answer}].click()`);
   await evaluate("document.querySelector('.question-card > .primary').click()");await wait("!!document.querySelector('.feedback')");assert.equal(await evaluate("!!document.querySelector('.feedback.good')"),true,lesson.id+': answer '+index);
   await evaluate("document.querySelector('.question-card > .primary').click()");
   if(index===variant.questions.length-1)await wait("!!document.querySelector('.result-card')");else await wait(`Number(document.querySelector('.practice-top > span')?.textContent.split('/')[0])===${index+2}&&!document.querySelector('.feedback')`);
  }
  const attempt=await evaluate(`fetch('/api/practice').then(r=>r.json()).then(d=>d.attempts.find(x=>x.lesson===${JSON.stringify(lesson.id)}))`);assert.equal(attempt.score,100);results.completedLessons.push({language,lesson:lesson.id,questions:variant.questions.length,score:attempt.score});
  await evaluate("document.querySelector('.result-card .text-button').click()");await wait("!!document.querySelector('.question-card')");await nav(1);
 }
 await nav(1);await select('.language-picker select','ja');await wait("!!document.querySelector('.study-hero .primary')");
 await evaluate("document.querySelector('.study-hero .primary').click()");await wait("!!document.querySelector('.study-lesson')");
 const retained=await evaluate("document.body.innerText");assert.match(retained,/[ぁ-ゖァ-ヺ]/u);results.japaneseLesson='pass';
 await evaluate("document.querySelector('.visual-photo-button,.page-scene-button').click()");await wait("!!document.querySelector('dialog[open]')");
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await wait("!document.querySelector('dialog[open]')");results.imageModalKeyboard='pass';
 results.audioMetadata=await evaluate(`(async()=>{const results=[];for(const [text,locale] of [['あ','ja-JP'],['ちゃ','ja-JP'],['カ','ja-JP'],['pão','pt-BR'],['mão','pt-BR'],['perro','es-ES'],['rojo','es-ES'],['papá','es-ES'],['papa','es-ES']]){const start=performance.now(),response=await fetch('/api/speech',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,locale})});if(!response.ok)throw Error('native audio failed '+text);const url=URL.createObjectURL(await response.blob());try{const audio=new Audio();await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('audio metadata timeout')),5000);audio.onloadedmetadata=()=>{clearTimeout(timer);resolve();};audio.onerror=()=>{clearTimeout(timer);reject(Error('audio decode failed'));};audio.src=url;audio.load();});results.push({text,locale,duration:audio.duration,metadataMs:performance.now()-start,source:response.headers.get('X-Audio-Source')});audio.removeAttribute('src');audio.load();}finally{URL.revokeObjectURL(url);}}return results;})()`);
 assert.ok(results.audioMetadata.every(x=>Number.isFinite(x.duration)&&x.duration>0&&x.source==='Human recording'));
 await evaluate("fetch('/api/auth/logout',{method:'POST'})");
 const teacher=await evaluate("fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'QA Teacher',email:'qa-teacher@example.test',password:'synthetic-qa-password',role:'teacher',adult:true})}).then(r=>r.json())");
 assert.equal(teacher.user.role,'teacher');
 await db.query("INSERT INTO teacher_profiles(user_id,data,status) VALUES($1,$2,'approved')",[teacher.user.id,{name:'QA Teacher',languages:['es']}]);
 await call('Page.reload');await wait("document.querySelectorAll('.app > aside nav button').length===5");
 results.teacherScreens=[];for(let tab=0;tab<5;tab++){await nav(tab);await new Promise(r=>setTimeout(r,100));const content=await evaluate("document.querySelector('.content')?.innerText");assert.ok(content.length>0);results.teacherScreens.push(tab);}
 await evaluate("document.querySelector('.app > aside nav button').focus()");await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',unmodifiedText:'\r',windowsVirtualKeyCode:13});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await wait("document.querySelector('.app > aside nav button').classList.contains('active')");results.navigationKeyboard='pass';
 const stats=values=>{const sorted=[...values].sort((a,b)=>a-b);return {n:sorted.length,min:sorted[0],median:sorted[Math.floor(sorted.length/2)],p95:sorted[Math.ceil(sorted.length*.95)-1],max:sorted.at(-1)};};
 results.navigationStats=stats(results.navigationMs);assert.deepEqual(results.exceptions,[]);
 await writeFile('/tmp/continuum-qa-browser-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify({logoutRace:results.logoutRace,combinations:results.combinations.length,screens:results.screens.length,navigation:results.navigationStats,exceptions:results.exceptions}));
}finally{
 ws?.close();if(browser.exitCode===null){const exited=new Promise(r=>browser.once('exit',r));browser.kill('SIGTERM');await exited;}
 await rm(profile,{recursive:true,force:true});await new Promise(r=>testServer.close(r));await db.close();
}
