// Real UI/auth/routing over ephemeral HTTPS; synthetic accounts, no production traffic.
import assert from 'node:assert/strict';import https from 'node:https';import {execFileSync} from 'node:child_process';import {readFile,mkdtemp,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {chromium,webkit} from 'playwright';
process.env.NODE_ENV='development';delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('../test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
const directory=await mkdtemp(join(tmpdir(),'continuum-links-')),cert=join(directory,'cert.pem'),key=join(directory,'key.pem');
execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-keyout',key,'-out',cert,'-subj','/CN=localhost','-addext','subjectAltName=IP:127.0.0.1,DNS:localhost'],{stdio:'ignore'});
const server=https.createServer({key:await readFile(key),cert:await readFile(cert)},(req,res)=>testServer.emit('request',req,res));await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='https://127.0.0.1:'+server.address().port;
try{
 for(const [name,engine]of Object.entries({chromium,webkit})){
  const email='links-'+name+'@example.test',password='synthetic-links-password';const registered=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Link demo',email,password,role:'learner',adult:true})});assert.equal(registered.status,200);const cookie=registered.headers.get('set-cookie').split(';')[0];
  const profile=await fetch(base+'/api/profile',{method:'PUT',headers:{'Content-Type':'application/json',cookie},body:JSON.stringify({profile:{name:'Link demo',languages:['es','ja'],primaryLanguage:'es',level:'A1',startMode:'manual',goal:'Everyday communication'}})});assert.equal(profile.status,200);
  const browser=await engine.launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});try{const context=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844}}),page=await context.newPage();
   await page.goto(origin+'/app/practice?language=ja');await page.getByRole('button',{name:'Already a member? Sign in',exact:true}).click();await page.getByLabel('Email',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill(password);await page.getByRole('button',{name:'Sign in',exact:true}).last().click();
   await page.locator('.app[data-page="Practice Studio"]').waitFor({timeout:60000});assert.equal(await page.evaluate(()=>localStorage.getItem('continuumLanguage')),'ja');
   await page.goto(origin+'/app/classes');await page.locator('.app[data-page="My classes"]').waitFor({timeout:60000});await page.locator('.class-workspace').waitFor();assert.equal(await page.getByText('Class not found',{exact:true}).count(),0);
   await page.goto(origin+'/app/classes?bookingId=aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa');await page.getByText('Class not found',{exact:true}).waitFor({timeout:60000});
   console.log('PASS '+name+': HTTPS fallback preserves typed destination through sign-in, opens classes and rejects inaccessible booking');
  }finally{await browser.close()}
 }
}finally{server.closeAllConnections();await new Promise(r=>server.close(r));testServer.closeAllConnections();await new Promise(r=>testServer.close(r));await db.close();await rm(directory,{recursive:true,force:true})}
