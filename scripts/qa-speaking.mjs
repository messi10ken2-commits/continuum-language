// Disposable local end-to-end check; fake AI responses and fake microphone only.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,writeFile,mkdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
process.env.GEMINI_API_KEY='synthetic-browser-key';delete process.env.OPENAI_API_KEY;process.env.NODE_ENV='development';
const realFetch=fetch;
globalThis.fetch=async(input,options)=>{
 if(String(input).startsWith('https://generativelanguage.googleapis.com/')){
  if(String(input).endsWith('/interactions')){const pcm=Buffer.alloc(24000);for(let i=0;i<12000;i++)pcm.writeInt16LE(Math.round(1500*Math.sin(i*.1)),i*2);return Response.json({steps:[{content:[{type:'audio',data:pcm.toString('base64')}]}]});}
  const b=JSON.parse(options.body),system=b.systemInstruction?.parts?.[0]?.text||'';let value;
  if(system.startsWith('Review this')){const c=JSON.parse(b.contents[0].parts[0].text);value={summary:'You ordered clearly and politely.',strengths:['Your request was clear.'],corrections:[],goals:c.goals.map((g,i)=>({achieved:i===0,evidence:i===0?c.messages.find(m=>m.role==='user').text:''})),nextStep:'Ask about an alternative next time.'};}
  else if(system.startsWith('You are a friendly adult'))value={audible:true,transcript:'A coffee, please.',reply:'Of course. Anything else?'};
  else if(!system)value={assessable:true,ratings:[3,3,3,3],evidence:['clear','clear','clear','clear'],feedback:'Clear.',nextStep:'Continue.',strengths:['Polite'],corrections:[],transcript:'A coffee, please.'};
  else value=system.includes('startup availability')?{items:[]}:{reply:'Certainly. Would you like anything else?'};
  return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(value)}]}}]}),{headers:{'content-type':'application/json'}});
 }
 return realFetch(input,options);
};
const {testServer,db}=await import('../test-server.mjs');
const origin='http://127.0.0.1:'+testServer.address().port;
const profile=await mkdtemp(join(tmpdir(),'continuum-speaking-browser-'));
const browser=spawn(process.env.CHROMIUM_BIN||'chromium',['--headless','--no-sandbox','--disable-dev-shm-usage','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--remote-debugging-address=127.0.0.1','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:['ignore','ignore','pipe']});
await mkdir('.media-build/speaking-browser',{recursive:true});
let ws;const exceptions=[];
try{
 const address=await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Browser startup timeout')),15000);let out='';browser.on('error',reject);browser.stderr.on('data',chunk=>{out+=chunk;const m=out.match(/DevTools listening on (ws:\/\/[^\s]+)/);if(m){clearTimeout(timer);resolve(m[1])}})});
 const debug=address.replace(/^ws:/,'http:').split('/devtools/')[0],target=await(await realFetch(debug+'/json/new?'+encodeURIComponent(origin),{method:'PUT'})).json();
 ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 let seq=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text)};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;const timer=setTimeout(()=>reject(Error('CDP timeout')),15000);pending.set(id,m=>{clearTimeout(timer);m.error?reject(Error(m.error.message)):resolve(m.result)});ws.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value};
 const wait=async expression=>{for(let i=0;i<200;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,50))}throw Error('UI timeout '+expression+' '+await evaluate('document.body.innerText.slice(-1500)'))};
 const click=selector=>evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
 const reply=async text=>{await evaluate(`(()=>{const e=document.querySelector('textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(e,${JSON.stringify(text)});e.dispatchEvent(new Event('input',{bubbles:true}));})()`);await click('.conversation-composer .primary')};
 await call('Runtime.enable');await wait("!!document.querySelector('.welcome-page')");
 assert.equal(await evaluate("fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Synthetic Speaking QA',email:'speaking-browser@example.test',password:'synthetic-test-password',adult:true,role:'learner'})}).then(r=>r.status)"),200);
 assert.equal(await evaluate("fetch('/api/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile:{name:'Synthetic Speaking QA',languages:['en','pt'],primaryLanguage:'en',level:'A1',startMode:'manual',goal:'Synthetic QA'}})}).then(r=>r.status)"),200);
 await evaluate("localStorage.setItem('continuumLanguage','en');localStorage.setItem('continuumInterfaceLanguage','en')");await call('Page.reload');await wait("document.querySelectorAll('.app > aside nav button').length>=6");
 await evaluate("document.querySelectorAll('.app > aside nav button')[1].click()");await wait("!!document.querySelector('.speaking-entry')");await click('.speaking-entry .primary');await wait("!!document.querySelector('.speaking-setup')");
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await click('.speaking-consent input');await wait("!document.querySelector('.speaking-setup>.primary').disabled");
 await writeFile('.media-build/speaking-browser/setup-mobile.png',Buffer.from((await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})).data,'base64'));
 assert.equal(await evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'),true);
 await click('.speaking-setup>.primary');await wait("!!document.querySelector('.conversation-thread')");
 await evaluate("document.querySelectorAll('.conversation-modes button')[1].click()");await reply('A coffee and a sandwich, please.');await wait("document.querySelectorAll('.conversation-message').length===3");await reply('No, thank you. Could I have the bill?');await wait("document.querySelectorAll('.conversation-message').length===5");await click('.conversation-bottom .outline-button');await wait("!!document.querySelector('.conversation-review')");
 assert.ok((await evaluate("document.querySelector('.conversation-review').innerText")).includes('A coffee and a sandwich, please.'));
 assert.equal(await evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'),true);
 await evaluate("document.querySelector('.conversation-review').scrollIntoView()");await writeFile('.media-build/speaking-browser/review-mobile.png',Buffer.from((await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})).data,'base64'));
 await click('.speaking-session-head .text-button');await wait("!!document.querySelector('.speaking-setup')");assert.equal(await evaluate("document.querySelectorAll('.speaking-history').length"),1);
 await click('.speaking-history');await wait("!!document.querySelector('.conversation-review')");await click('.speaking-session-head .text-button');await wait("!!document.querySelector('.speaking-setup')");await click('.speaking-setup>.primary');await wait("!!document.querySelector('.conversation-modes')");
 await evaluate("document.querySelectorAll('.conversation-modes button')[0].click()");
 // Keep real browser recording/playback; feed only VAD a short deterministic speech window.
 await evaluate(`(()=>{const original=AnalyserNode.prototype.getByteTimeDomainData,frames=new WeakMap();AnalyserNode.prototype.getByteTimeDomainData=function(data){if(this.fftSize!==1024)return original.call(this,data);const n=frames.get(this)||0;frames.set(this,n+1);for(let i=0;i<data.length;i++)data[i]=n<12?128+Math.round(12*Math.sin(i*.1)):128;};const get=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async c=>{const stream=await get(c);window.__qaMic=stream;return stream;};})()`);
 await click('.voice-main-button');await wait("document.querySelector('.conversation-avatar').classList.contains('listening')");
 await wait("document.querySelectorAll('.conversation-message').length===3");
 assert.ok((await evaluate("document.querySelector('.conversation-message.user').innerText")).includes('voice transcript'));
 await wait("document.querySelector('.voice-main-button').textContent.includes('Pause')");await click('.voice-main-button');
 assert.equal(await evaluate("window.__qaMic.getTracks().every(t=>t.readyState==='ended')"),true);
 assert.equal(await evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'),true);
 await evaluate("window.scrollTo(0,0)");await writeFile('.media-build/speaking-browser/avatar-mobile.png',Buffer.from((await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})).data,'base64'));
 assert.deepEqual(exceptions,[]);
 console.log('PASS: real built frontend, mobile layout, consent, typed multi-turn conversation, review, saved history reopen, natural scoped playback, automatic VAD capture/send/reply and pause releasing the microphone. AI and microphone data are synthetic.');
}finally{ws?.close();browser.kill();globalThis.fetch=realFetch;await new Promise(r=>testServer.close(r));await db.close();await rm(profile,{recursive:true,force:true});}
