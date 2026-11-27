import assert from 'node:assert/strict';import{mkdir,writeFile}from'node:fs/promises';import{build}from'vite';import{chromium,webkit}from'playwright';
process.env.CONTINUUM_WORLD_PHASE2_ENABLED='true';process.env.GEMINI_API_KEY='synthetic-world-browser-key';delete process.env.OPENAI_API_KEY;
const realFetch=globalThis.fetch;let calls=0;
globalThis.fetch=async(url,options)=>{
 if(String(url).startsWith('https://generativelanguage.googleapis.com/')){
  calls++;if(String(url).endsWith('/interactions'))return Response.json({steps:[{content:[{type:'audio',data:Buffer.from(Array.from({length:4800},(_,i)=>[0,12,0,244][i%4])).toString('base64')}]}]});
  const b=JSON.parse(options.body),system=b.systemInstruction?.parts?.[0]?.text||'';let c={};try{c=JSON.parse(b.contents?.[0]?.parts?.[0]?.text||'{}');}catch{}let value={items:[]};
  if(system.startsWith('Review this')){const q=c.messages.filter(m=>m.role==='user');value={summary:'相手に伝わる丁寧な質問です。',strengths:['希望を伝えられました。'],corrections:[],goals:c.goals.map((_,i)=>({achieved:i<2,evidence:i<2?q[i]?.text||'':''})),nextStep:'理由も加えてみましょう。',ratings:[3,3,3,3],scoreTurnIds:['L1','L2','L1','L2'],communicationAssessable:true};}
  else if(system.startsWith('You are a supportive'))value={reply:'はい、大丈夫です。ほかにご希望はありますか？'};
  return Response.json({candidates:[{content:{parts:[{text:JSON.stringify(value)}]}}]});
 }return realFetch(url,options);
};
const dir=new URL('../.media-build/world-phase2/',import.meta.url);await mkdir(dir,{recursive:true});
await writeFile(new URL('index.html',dir),'<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="module" src="./entry.jsx"></script></html>');
await writeFile(new URL('entry.jsx',dir),`
import React,{useState}from'react';import{createRoot}from'react-dom/client';import ContinuumWorld from '../../ContinuumWorld.jsx';import Evidence from '../../WorldLearningEvidence.jsx';import PrivacySettings from '../../PrivacySettings.jsx';import{setInterfaceLanguage}from'../../interface-runtime.mjs';import '../../styles.css';
setInterfaceLanguage('en',{persist:false});const user={id:new URLSearchParams(location.search).get('user'),role:'learner'};
function App(){const[world,setWorld]=useState(true);if(location.pathname==='/privacy-settings')return <PrivacySettings/>;return world?<ContinuumWorld user={user} onBack={()=>setWorld(false)}/>:<main><Evidence user={user} language="ja"/><button onClick={()=>setWorld(true)}>Return to World</button></main>;}
createRoot(document.getElementById('root')).render(<App/>);
`);
await build({configFile:false,root:dir.pathname,publicDir:new URL('../public/',import.meta.url).pathname,build:{outDir:new URL('../dist/',import.meta.url).pathname,emptyOutDir:true}});
const {testServer,db}=await import('../test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
let browser,currentPage;const results=[];
async function api(path,body,cookie,method=body?'POST':'GET'){const r=await realFetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 for(const name of ['chromium','webkit'])for(const width of [1280,390]){
  const account=await api('/auth/register',{name:'World '+name+width,email:name+width+'@example.test',password:'synthetic-browser-password',adult:true,role:'learner'});assert.equal(account.status,200);const uid=account.data.user.id;
  await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[uid]);
  browser=await {chromium,webkit}[name].launch({headless:true,...(name==='chromium'?{args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']}: {})});
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});await context.addCookies([{name:'continuum_session',value:account.cookie.split('=')[1],url:base}]);
  await context.addInitScript(()=>{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:()=>Promise.reject(new DOMException('Synthetic microphone denied','NotAllowedError'))}});localStorage.setItem('continuumInterfaceLanguage','en');});
  const page=await context.newPage(),errors=[];currentPage=page;page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(45000);
  await page.goto(base+'/?user='+uid);await page.getByRole('button',{name:'List view',exact:true}).last().click();
  console.log('World UI opened',name,width);const missions=page.getByRole('button',{name:/Missions and NPC memory/});await missions.click();await page.getByRole('button',{name:'Enable NPC memory',exact:true}).click();await page.getByRole('button',{name:'Turn NPC memory off',exact:true}).waitFor();await page.screenshot({path:new URL(name+'-'+width+'-consent.png',dir).pathname});await page.locator('.cw-close').click();
  console.log('Consent enabled',name,width);const cafe=page.locator('.cw-place-list article').filter({hasText:'こもれび珈琲'});await cafe.getByRole('button',{name:'Enter',exact:true}).click();await cafe.getByRole('button',{name:/Talk/}).click();
  const chat=page.locator('.cw-conversation');await chat.getByRole('combobox').first().selectOption('cafe-permission');
  await chat.getByRole('checkbox').first().check();await chat.getByRole('button',{name:'Start conversation',exact:true}).click();await chat.getByRole('textbox').waitFor();
  await chat.getByRole('button',{name:'Speak with microphone',exact:true}).click();await chat.getByRole('alert').waitFor();assert.ok(await chat.getByRole('textbox').isEnabled());await chat.getByRole('alert').getByRole('button',{name:'Close',exact:true}).click();
  for(const text of ['ここに座ってもいいですか。','静かな席がいいです。']){await chat.getByRole('textbox').fill(text);await chat.getByRole('button',{name:'Send reply',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.cw-conversation textarea').disabled);}
  await chat.getByRole('button',{name:'Finish and get feedback',exact:true}).click();await chat.getByText('Saved to Learning Memory. Course progress is unchanged.',{exact:true}).waitFor();await chat.getByRole('button',{name:'Confirm and remember',exact:true}).click();await chat.getByRole('button',{name:'Memory saved',exact:true}).waitFor();await page.screenshot({path:new URL(name+'-'+width+'-review.png',dir).pathname});
  await page.locator('.cw-close').click();await cafe.getByRole('button',{name:/Talk/}).click();await chat.getByRole('checkbox').first().check();await chat.getByRole('button',{name:'Start conversation',exact:true}).click();await page.waitForFunction(()=>document.querySelector('.cw-dialogue')?.textContent.includes('前回'));await page.locator('.cw-close').click();
  await missions.click();await page.getByRole('button',{name:'Delete all NPC memories',exact:true}).click();await page.getByRole('button',{name:'Confirm deletion',exact:true}).click();await page.getByRole('button',{name:'Delete all NPC memories',exact:true}).waitFor({state:'detached'});await page.screenshot({path:new URL(name+'-'+width+'-deleted.png',dir).pathname});await page.locator('.cw-close').click();
  await page.getByRole('button',{name:'Back to Practice Studio',exact:true}).click();await page.locator('.world-learning-evidence blockquote').filter({hasText:'ここに座ってもいいですか。'}).waitFor();await page.screenshot({path:new URL(name+'-'+width+'-learning.png',dir).pathname});
  await page.reload();await page.getByRole('button',{name:'List view',exact:true}).last().click();await missions.click();assert.ok((await page.locator('.cw-progress').innerText()).includes('30'));
  await page.goto(base+'/privacy-settings');await page.getByRole('button',{name:'Turn NPC memory off',exact:true}).click();await page.getByRole('button',{name:'Confirm deletion',exact:true}).click();await page.getByRole('button',{name:'Turn NPC memory off',exact:true}).waitFor({state:'detached'});await page.screenshot({path:new URL(name+'-'+width+'-account-privacy.png',dir).pathname});
  assert.deepEqual(errors,[]);results.push({browser:name,width,missionXP:30,voiceDeniedTextFallback:true,review:true,confirmedMemory:true,revisit:true,deletion:true,learningEvidence:true,reloginPersistence:true,accountPrivacy:true});await browser.close();browser=null;
 }
 await writeFile(new URL('results.json',dir),JSON.stringify({results,syntheticProviderCalls:calls},null,2));console.log('PASS World Phase 2 UI',JSON.stringify(results));
}catch(error){if(currentPage){await currentPage.screenshot({path:new URL('failure.png',dir).pathname,timeout:15000}).catch(()=>{});await writeFile(new URL('failure.txt',dir),await currentPage.locator('body').innerText().catch(()=>''));}throw error;}finally{await browser?.close();globalThis.fetch=realFetch;await new Promise(r=>testServer.close(r));await db.close();}
