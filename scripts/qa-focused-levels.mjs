// Built frontend + disposable PGlite; no production accounts or paid providers.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;process.env.NODE_ENV='development';
const {testServer,db}=await import('../test-server.mjs'),{chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright'),base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});assert.ok(r.ok,path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 await mkdir('.media-build/focused-levels',{recursive:true});
 const p=await api('/auth/register','POST',{name:'Focused QA',email:'focus-browser@example.test',password:'synthetic-focus-qa-password',role:'learner',adult:true});
 await api('/profile','PUT',{profile:{name:p.data.user.name,languages:['en','es','pt','ja'],primaryLanguage:'en',level:'A1',startMode:'manual',goal:'Synthetic QA',dailyGoal:10}},p.cookie);
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[p.data.user.id]);
 for(const engine of (process.env.QA_BROWSERS||'chromium').split(',')){
 const browser=await({chromium,webkit}[engine]).launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
 try{const context=await browser.newContext({viewport:{width:390,height:900}});await context.addCookies([{name:'continuum_session',value:p.cookie.split('=')[1],url:base}]);await context.addInitScript(()=>{localStorage.setItem('continuumInterfaceLanguage','en');localStorage.setItem('continuumLanguage','en')});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);await page.goto(base);await page.locator('.unified-learning-record').waitFor();
 const nav=label=>page.locator('.mobile-nav button').filter({hasText:new RegExp('^'+label+'$')}).click();
 for(const style of ['photo','illustrated']){
 if(style==='illustrated'){await nav('Overview');await page.getByLabel('World style',{exact:true}).first().selectOption(style);await page.locator('.approved-illustrated').waitFor()}
 const studio=async()=>{await nav('Practice');await page.locator('.studio-menu').waitFor()};
 const section=title=>page.locator('.studio-menu>button').filter({has:page.locator('strong',{hasText:new RegExp('^'+(style==='illustrated'?({'Vocabulary review':'Vocabulary & expressions','Focused practice':'Listening & video'}[title]||title):title)+'$')})}).click();
 const back=()=>page.getByRole('button',{name:'Back to Practice Studio',exact:true}).click();
 for(const language of ['en','es','pt','ja']){
  if(style==='photo'){await page.getByLabel('Learning language',{exact:true}).selectOption(language);await nav('Overview');await page.locator('.unified-learning-record').waitFor();assert.equal(await page.locator('.journey-map,.journey-visual').count(),0)}else{await nav('Overview');await page.locator('.approved-illustrated').waitFor();await page.locator('.illustrated-header select[aria-label="Learning language"]').selectOption(language)}
  await studio();
  for(const title of ['Vocabulary review','Exclusive courses','Focused practice']){
   await section(title);assert.equal(await page.locator('.studio-menu').count(),0);const b=await page.locator('.practice-studio').boundingBox(),pane={y:style==='photo'?await page.locator('main>header').evaluate(e=>e.getBoundingClientRect().bottom):0,height:900};assert.ok(b.y>=pane.y-1&&b.y<pane.y+100,`${style} ${title}: destination is at visible top, got ${b.y}, pane ${pane.y}`);assert.equal(await page.locator('.practice-studio').evaluate(e=>e===document.activeElement),true);await back();await page.locator('.studio-menu').waitFor();
  }
  await section('Focused practice');
  const signatures=[];
  for(const level of ['A1','A2','B1','B2','C1']){
   await page.getByLabel('Practice level',{exact:true}).selectOption(level);await page.locator('.skills-cards article').first().waitFor();const buttons=page.locator('.skills-cards article').first().locator('button');await page.waitForFunction(level=>[...document.querySelectorAll('.skills-cards article:first-child button')].filter(b=>b.textContent.includes('· '+level)).length===4,level);assert.equal(await buttons.count(),5);
   await buttons.filter({hasText:'Travel problem-solving'}).click();await page.locator('.skills-options').first().waitFor();await page.getByText('Show transcript for practice',{exact:true}).click();const text=await page.locator('.skills-workshop [lang]').first().innerText();signatures.push(text);assert.ok(await page.locator('.skills-workshop>.panel>.eyebrow').innerText().then(t=>t.includes(level)));
   await page.getByRole('button',{name:'← All skill workshops',exact:true}).click();
   await page.locator('.skills-cards article').nth(1).getByRole('button',{name:'Travel problem-solving · '+level,exact:true}).click();await page.locator('.skills-production').waitFor();assert.ok((await page.locator('.skills-production').innerText()).includes(level+' task'));await page.getByRole('button',{name:'← All skill workshops',exact:true}).click();
  }
  assert.equal(new Set(signatures).size,5,language+' '+style+' listening content must change at every level');
  if(language==='en'){await page.screenshot({path:`.media-build/focused-levels/${engine}-${style}-focus.png`});await page.setViewportSize({width:1280,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.setViewportSize({width:390,height:900})}
 }
 if(style==='photo'){await nav('Account');assert.equal(await page.locator('.journey-visual').count(),0)}
 }
 assert.deepEqual(errors,[]);await context.close();console.log('PASS '+engine+': both layouts, four languages × five levels, actual transcripts/prompts/ranges, direct review/course/focus entry, keyboard focus, Back, photo map/banner removal and RPG preservation.');
 }finally{await browser.close()}
 }
}finally{await new Promise(r=>testServer.close(r));await db.close()}
