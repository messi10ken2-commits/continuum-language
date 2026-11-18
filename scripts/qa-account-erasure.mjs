// Disposable synthetic database only. No mail transport is contacted.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
process.env.NODE_ENV='development';
for(const key of ['OPENAI_API_KEY','GEMINI_API_KEY','READINESS_MAINTENANCE_ENABLED','ACCOUNT_DELETION_ENABLED'])delete process.env[key];
const {testServer,db}=await import('../test-server.mjs');
const {chromium,webkit}=await import('playwright');
const origin='http://127.0.0.1:'+testServer.address().port,password='synthetic-browser-erasure-password';
async function api(path,method='GET',body,user){
 const r=await fetch(origin+'/api'+path,{method,headers:{'Content-Type':'application/json',Connection:'close',...(user?{Cookie:user.cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
 assert.ok(r.ok,path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};
}
async function register(name){const r=await api('/auth/register','POST',{name,email:name+'@example.test',password,role:'learner',adult:true});return {...r.data.user,cookie:r.cookie}}
try{
 const owner=await register('synthetic-browser-owner');process.env.CONTINUUM_OWNER_USER_ID=owner.id;
 await api('/profile','PUT',{profile:{name:owner.name,languages:['en'],primaryLanguage:'en',level:'A1',startMode:'manual',goal:'Synthetic QA'}},owner);
 await mkdir('.media-build/account-erasure',{recursive:true});
 for(const engine of (process.env.QA_BROWSERS||'chromium,webkit').split(',')){
  delete process.env.ACCOUNT_DELETION_ENABLED;
  const learner=await register('synthetic-delete-'+engine);await api('/account/deletion-request','POST',{password,confirm:true},learner);
  const browser=await ({chromium,webkit}[engine]).launch({headless:true,args:engine==='chromium'?['--no-sandbox']:[]});
  try{
   const context=await browser.newContext({viewport:{width:1280,height:900}});
   await context.addCookies([{name:'continuum_session',value:owner.cookie.split('=')[1],url:origin}]);
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>localStorage.setItem('continuumInterfaceLanguage','en'));await page.goto(origin);await page.locator('.app>aside nav').waitFor();
   await page.locator('.app>aside nav button').filter({hasText:/^Admin$/}).click();
   await page.locator('.ops-tabs button').filter({hasText:/^Account deletion$/}).click();
   const section=page.locator('.owner-console section').filter({has:page.locator('h2',{hasText:/^Account deletion$/})});
   const row=section.locator('tbody tr').filter({hasText:learner.email});
   await row.getByRole('button',{name:'Preview',exact:true}).click();
   const form=section.locator('form');await form.getByText('Execution is disabled.',{exact:false}).waitFor();
   const apply=form.getByRole('button',{name:'Delete this account and its personal data',exact:true});
   assert.equal(await apply.isDisabled(),true);
   Object.assign(process.env,{ACCOUNT_DELETION_ENABLED:'true',ACCOUNT_DELETION_POLICY_PUBLISHED:'true',ACCOUNT_DELETION_POLICY_VERSION:'synthetic-browser-v1',ACCOUNT_DELETION_PROCESSING_DAYS:'7',ACCOUNT_DELETION_RETENTION_DAYS:'30',ACCOUNT_DELETION_BACKUP_DAYS:'14',AUTH_MAIL_PROVIDER:'smtp',AUTH_SMTP_HOST:'smtp.example.test',AUTH_SMTP_USER:'synthetic',AUTH_SMTP_PASSWORD:'not-a-real-secret',AUTH_MAIL_FROM:'synthetic@example.test',MAIL_OUTBOX_KEY:'ac'.repeat(32),READINESS_MAINTENANCE_ENABLED:'true'});
   await row.getByRole('button',{name:'Preview',exact:true}).click();await form.getByText('Policy: synthetic-browser-v1',{exact:false}).waitFor();
   assert.equal(await apply.isDisabled(),true);
   for(const checkbox of await form.locator('input[type=checkbox]').all())await checkbox.check();
   await form.getByLabel('Type DELETE to confirm').fill('DELETE');
   await form.getByLabel('Confirm your password').fill('incorrect-synthetic-password');await apply.click();
   await section.locator('[role=alert]').filter({hasText:'Email or password is incorrect.'}).waitFor();
   assert.equal(await form.getByLabel('Confirm your password').inputValue(),'');
   assert.equal((await db.query('SELECT id FROM users WHERE id=$1',[learner.id])).rows.length,1);
   await form.getByLabel('Confirm your password').fill(password);await apply.click();
   await section.locator('[role=status]').filter({hasText:'Account deleted. Completion email queued.'}).waitFor();
   assert.equal((await db.query('SELECT id FROM users WHERE id=$1',[learner.id])).rows.length,0);
   assert.equal((await db.query('SELECT status FROM transactional_mail_outbox ORDER BY created_at DESC LIMIT 1')).rows[0].status,'pending');
   for(const width of [1280,390]){
    await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:'.media-build/account-erasure/'+engine+'-'+width+'.png'});
   }
   assert.deepEqual(errors,[]);
   console.log('PASS '+engine+': disabled gate, preview, explicit checks, failed password preserves account, synthetic erasure, encrypted notice queued, desktop/mobile fit');
  }finally{await browser.close()}
 }
}finally{delete process.env.READINESS_MAINTENANCE_ENABLED;await new Promise(r=>testServer.close(r));await db.close()}
