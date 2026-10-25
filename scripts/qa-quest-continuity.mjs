import assert from 'node:assert/strict';import {mkdir} from 'node:fs/promises';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;process.env.NODE_ENV='development';
const {testServer,db}=await import('../test-server.mjs');const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');const base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method,body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify(body)});assert.ok(r.ok,path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
let browser;try{
 const p=await api('/auth/register','POST',{name:'Layout QA',email:'layout@example.test',password:'synthetic-layout-password',role:'learner',adult:true});await api('/profile','PUT',{profile:{name:'Layout QA',languages:['en','ja'],primaryLanguage:'en',level:'A1',startMode:'manual',goal:'Travel',dailyGoal:10}},p.cookie);
 browser=await chromium.launch({headless:true,executablePath:process.env.QA_BROWSER_EXECUTABLE,args:['--no-sandbox']});const context=await browser.newContext({viewport:{width:1440,height:1000}});await context.addCookies([{name:'continuum_session',value:p.cookie.split('=')[1],url:base}]);await context.addInitScript(()=>localStorage.setItem('continuumInterfaceLanguage','en'));const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await mkdir('.media-build/reference',{recursive:true});await page.goto(base+'/?open=account');await page.locator('.account-settings').waitFor();await page.locator('.settings-premium').waitFor();
 for(const width of [390,1440]){await page.setViewportSize({width,height:1000});assert.ok(await page.locator('.settings-group').count());const banner=await page.locator('.settings-premium').boundingBox();assert.ok(banner.height<240&&banner.width<=width&&banner.x>=0,'banner must remain a compact in-flow row');await page.screenshot({path:'.media-build/reference/account-photo-'+width+'.png',fullPage:true});}
 const style=page.locator('.account-settings details').filter({has:page.locator('summary',{hasText:'World style'})});await style.locator('summary').click();await style.locator('select').selectOption('illustrated');await page.locator('.rpg-window-open').waitFor();assert.equal(await page.locator('.account-settings').count(),1);
 await page.locator('.app>aside nav button').filter({hasText:/^Overview$/}).click();
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:1000});
  for(const [label,tab] of [['Learn','Learn'],['Practice','Practice Studio'],['Memory','Learning memory'],['Classes','My classes'],['Level test','Level test']]){
   await page.locator('.rpg-dock button').filter({hasText:new RegExp('^'+label+'$')}).click();
   await page.locator('.app.quest-continuity.rpg-window-open').waitFor();
   assert.equal(await page.locator('.app').getAttribute('data-page'),tab);
   assert.ok(await page.locator('.rpg-hud').isVisible(),'world header remains visible');
   assert.ok(await page.locator('.rpg-dock').isVisible(),'quest navigation remains visible');
   assert.equal(await page.locator('.mobile-nav').isVisible(),false,'no photo navigation');
   const main=await page.locator('.app>main').boundingBox(),dock=await page.locator('.rpg-dock').boundingBox();
   assert.ok(main.x>=0&&main.x+main.width<=width+1&&main.y+main.height<=dock.y+2,'content fits above navigation');
   await page.screenshot({path:'.media-build/reference/quest-'+tab.replaceAll(' ','-')+'-'+width+'.png'});
  }
  await page.locator('.rpg-status-strip button').click();
  await page.locator('.rpg-journal').waitFor();
  assert.equal(await page.locator('.app').getAttribute('data-page'),'Overview','journal returns to map and stays open');
  await page.locator('.rpg-journal .rpg-close').click();
  await page.locator('.rpg-dock button').filter({hasText:/^World map$/}).click();
  await page.locator('.rpg-world-open').waitFor();
  assert.ok(await page.locator('.rpg-train').evaluate(e=>e.complete&&e.naturalWidth>0));
  assert.match(await page.locator('.rpg-train').evaluate(e=>getComputedStyle(e).offsetPath),/path/);
  await page.screenshot({path:'.media-build/reference/quest-map-'+width+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('PASS: Account retained; all five quest destinations retain HUD and dock at 390/1440px; painted train loaded; no page errors.');
}finally{await browser?.close();await new Promise(r=>testServer.close(r));await db.close();}
