// Runs against the isolated local development app and creates a synthetic account.
// Requires Chromium; no browser automation dependency is installed in production.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {translate} from '../base-language.mjs';

const origin='http://127.0.0.1:3000';
assert.equal((await (await fetch(origin+'/api/health')).json()).ok,true);
const profile=await mkdtemp(join(tmpdir(),'continuum-i18n-browser-'));
const browser=spawn(process.env.CHROMIUM_BIN||'chromium',[
 '--headless','--no-sandbox','--disable-dev-shm-usage',
 '--remote-debugging-address=127.0.0.1','--remote-debugging-port=0',
 '--user-data-dir='+profile,'about:blank'
],{stdio:['ignore','ignore','pipe']});
let ws;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
try{
 const address=await new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(Error('Chromium startup timed out')),15000);
  let output='';
  browser.once('error',error=>{clearTimeout(timer);reject(error)});
  browser.stderr.on('data',chunk=>{
   output+=chunk;
   const match=output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
   if(match){clearTimeout(timer);resolve(match[1]);}
  });
 });
 const debugOrigin=address.replace(/^ws:/,'http:').split('/devtools/')[0];
 const target=await (await fetch(debugOrigin+'/json/new?'+encodeURIComponent(origin),{method:'PUT'})).json();
 ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
 let sequence=0;const pending=new Map(),exceptions=[];
 ws.addEventListener('message',event=>{
  const message=JSON.parse(event.data);
  if(message.id){pending.get(message.id)?.(message);pending.delete(message.id);}
  if(message.method==='Runtime.exceptionThrown')exceptions.push(message.params.exceptionDetails.text);
 });
 const call=(method,params={})=>new Promise((resolve,reject)=>{
  const id=++sequence;
  const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout: '+method))},15000);
  pending.set(id,message=>{clearTimeout(timer);message.error?reject(Error(message.error.message)):resolve(message.result)});
  ws.send(JSON.stringify({id,method,params}));
 });
 const evaluate=async expression=>{
  const result=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(result.exceptionDetails)throw Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);
  return result.result.value;
 };
 const wait=async expression=>{
  for(let attempt=0;attempt<100;attempt++){if(await evaluate(expression))return;await sleep(100);}
  const page=await evaluate("({lang:document.documentElement.lang,text:document.body.textContent.slice(0,1200)})");
  throw Error('UI timeout: '+expression+' '+JSON.stringify({page,exceptions}));
 };
 const clickText=async text=>evaluate(`(()=>{const button=[...document.querySelectorAll('button')].find(b=>b.textContent.trim()===${JSON.stringify(text)});if(!button)throw Error('Button not found');button.click()})()`);
 const select=async(selector,value)=>evaluate(`(()=>{const s=document.querySelector(${JSON.stringify(selector)});if(!s)throw Error('Select not found');s.value=${JSON.stringify(value)};s.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 const fill=async values=>evaluate(`(()=>{for(const [id,value] of Object.entries(${JSON.stringify(values)})){const input=document.getElementById(id);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));}})()`);
 await call('Runtime.enable');
 await wait("!!document.querySelector('.welcome-page')");
 await select('.entry-content select','ja');
 await wait("document.documentElement.lang==='ja-JP'");
 await clickText(translate('ja','welcome.signIn'));
 await clickText(translate('ja','auth.register'));
 const credentials={'account-email':`browser-${crypto.randomUUID()}@example.test`,'account-password':'synthetic-browser-test-password'};
 await fill({'account-name':'Browser validation',...credentials});
 await evaluate("document.querySelector('.adult-check input').click();document.querySelector('button.primary.wide').click()");
 await wait(`document.querySelector('.profile-editor h1')?.textContent===${JSON.stringify(translate('ja','profile.title'))}`);
 const onboarding=await evaluate("({lang:document.documentElement.lang,title:document.querySelector('.profile-editor h1')?.textContent})");
 assert.equal(onboarding.title,translate('ja','profile.title'),JSON.stringify(onboarding));
 await evaluate("document.querySelectorAll('.profile-languages input')[1].click()");
 await select('.profile-fields select','ja');
 await evaluate("document.querySelector('.profile-actions .primary').click()");
 await wait("!document.querySelector('.profile-editor')&&!!document.querySelector('.content > .language-picker select')");
 await clickText(translate('ja','nav.account'));
 await wait("!!document.querySelector('.language-settings select')");

 // Simulated outage must leave both the visible and stored preference intact.
 await evaluate(`window.__realFetch=window.fetch;window.fetch=(input,options)=>String(input)==='/api/preferences'&&options?.method==='PUT'?Promise.resolve(new Response(JSON.stringify({error:'Synthetic save failure'}),{status:503,headers:{'Content-Type':'application/json'}})):window.__realFetch(input,options)`);
 await select('.language-settings select','fr');
 await wait("document.querySelector('.auth-error')?.textContent==='Synthetic save failure'");
 assert.equal(await evaluate('document.documentElement.lang'),'ja-JP');
 assert.equal(await evaluate("document.querySelector('.language-settings select').value"),'ja');
 assert.equal(await evaluate("fetch('/api/preferences').then(r=>r.json()).then(d=>d.baseLanguage)"),'ja');
 await evaluate('window.fetch=window.__realFetch');

 await select('.language-settings select','fr');
 await wait("document.documentElement.lang==='fr-FR'");
 assert.equal(await evaluate("document.querySelector('.auth-success').textContent"),translate('fr','settings.saved'));
 assert.equal(await evaluate("document.querySelector('.content > .language-picker select').value"),'ja');
 await call('Page.reload',{ignoreCache:true});
 await wait("document.documentElement.lang==='fr-FR'&&!!document.querySelector('.content > .language-picker select')");
 assert.equal(await evaluate("document.querySelector('.content > .language-picker select').value"),'ja');
 await clickText(translate('fr','nav.account'));
 await wait("!!document.querySelector('.language-settings select')");

 // Delay a successful response, then log out. It belongs to the old account.
 await evaluate(`window.__realFetch=window.fetch;window.fetch=(input,options)=>String(input)==='/api/preferences'&&options?.method==='PUT'?new Promise((resolve,reject)=>{window.__realFetch(input,options).then(response=>{window.__releasePreference=()=>resolve(response)},reject)}):window.__realFetch(input,options)`);
 await select('.language-settings select','es');
 await wait("typeof window.__releasePreference==='function'");
 await clickText(translate('fr','account.signOut'));
 await wait("!!document.querySelector('.welcome-page')");
 await evaluate('window.__releasePreference();window.fetch=window.__realFetch');
 await sleep(100);
 assert.equal(await evaluate('document.documentElement.lang'),'fr-FR');
 await clickText(translate('fr','welcome.signIn'));
 await fill(credentials);
 await evaluate("document.querySelector('button.primary.wide').click()");
 await wait("document.documentElement.lang==='es-ES'&&!!document.querySelector('.language-settings select')");
 assert.equal(await evaluate("document.querySelector('.content > .language-picker select').value"),'ja');
 await select('.language-settings select','ja');
 await wait("document.documentElement.lang==='ja-JP'");
 await select('.content > .language-picker select','es');
 await wait("!!document.querySelector('.level-roadmap')");
 await evaluate("document.querySelector('.level-roadmap button').click()");
 await evaluate("document.querySelector('[data-lesson-id=food-vocabulary]').click()");
 await wait("!!document.querySelector('.lesson-intro-card')");
 assert.ok(await evaluate("document.querySelector('.vocabulary-grid').textContent.includes('パン')"));
 assert.ok(await evaluate("document.querySelector('.vocabulary-grid').textContent.includes('Quisiera una barra de pan.')"));
 await evaluate("document.querySelector('.lesson-begin button').click()");
 await wait("!!document.querySelector('.question-card')");
 for(let step=0;step<180;step++){
  if(await evaluate("!!document.querySelector('.result-card')"))break;
  await evaluate(`(()=>{const card=document.querySelector('.question-card');if(!card||card.querySelector('.feedback'))return;card.querySelector('.answers button:not([disabled])')?.click();const input=card.querySelector('input');if(input){Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'test');input.dispatchEvent(new Event('input',{bubbles:true}));}card.querySelectorAll('.word-builder-tiles button:not([disabled])').forEach(button=>button.click());})()`);
  await sleep(60);
  await evaluate("document.querySelector('.question-card button.primary.wide:not([disabled])')?.click()");
  await sleep(100);
 }
 await wait("!!document.querySelector('.result-card')");
 assert.ok(await evaluate(`document.querySelector('.result-card').textContent.includes(${JSON.stringify(translate('ja','result.exerciseSaved'))})`));
 assert.ok(await evaluate("fetch('/api/practice').then(r=>r.json()).then(d=>d.attempts.some(a=>a.lesson==='food-vocabulary'))"));
 assert.deepEqual(exceptions,[],'Uncaught browser exceptions');
 console.log('PASS: registration, onboarding, failed save, localized success, reload, logout race, login persistence, independent target and complete exercise/save flow.');
}finally{
 ws?.close();
 const exited=new Promise(resolve=>browser.once('exit',resolve));
 browser.kill('SIGTERM');
 await Promise.race([exited,sleep(3000)]);
 if(browser.exitCode===null&&browser.signalCode===null){browser.kill('SIGKILL');await Promise.race([exited,sleep(1000)]);}
 await rm(profile,{recursive:true,force:true});
}
