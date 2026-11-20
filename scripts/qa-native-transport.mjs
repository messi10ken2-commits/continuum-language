// Real loopback HTTPS transport test; ephemeral certificates and synthetic data only.
import assert from 'node:assert/strict';import https from 'node:https';import {execFileSync} from 'node:child_process';import {readFile,mkdtemp,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import {join} from 'node:path';import {chromium,webkit} from 'playwright';
const policy=(await readFile('native-policy.mjs','utf8')).replaceAll('export ','');
const transport=(await readFile('native-transport.mjs','utf8')).replace(/^import .*\n/,'').replaceAll('export ','');
const directory=await mkdtemp(join(tmpdir(),'native-http-test-')),cert=join(directory,'cert.pem'),key=join(directory,'key.pem');
execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-days','1','-keyout',key,'-out',cert,'-subj','/CN=localhost','-addext','subjectAltName=IP:127.0.0.1,DNS:localhost'],{stdio:'ignore'});
const options={key:await readFile(key),cert:await readFile(cert)};const requests=[];let foreignHits=0;
const foreign=https.createServer(options,(req,res)=>{foreignHits++;res.end('unexpected redirect')});
await new Promise(r=>foreign.listen(0,'127.0.0.1',r));const foreignOrigin='https://127.0.0.1:'+foreign.address().port;
const server=https.createServer(options,async(req,res)=>{
 const path=new URL(req.url,'https://127.0.0.1').pathname;
 if(!path.startsWith('/api/')){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!doctype html><title>Synthetic native transport</title>');return}
 const chunks=[];for await(const chunk of req)chunks.push(chunk);
 requests.push({path,method:req.method,headers:req.headers,body:Buffer.concat(chunks).toString('utf8')});
 if(path==='/api/redirect'){res.writeHead(302,{Location:foreignOrigin+'/collect'});res.end();return}
 const body=JSON.stringify(path==='/api/auth/login'?{user:{id:'synthetic-user'},sessionToken:'n'.repeat(43)}:{ok:true,user:{id:'synthetic-user'}});
 res.writeHead(200,{'Content-Type':'application/json','Content-Length':Buffer.byteLength(body)});res.end(body);
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='https://127.0.0.1:'+server.address().port;
try{
 for(const [name,engine] of Object.entries({chromium,webkit})){
  requests.length=0;foreignHits=0;const browser=await engine.launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
  try{
   // Trust bypass is confined to this browser fixture; the shipping app has none.
   const context=await browser.newContext({ignoreHTTPSErrors:true}),page=await context.newPage();
   await page.goto(origin);await page.addScriptTag({content:policy+'\n'+transport});
   const state=await page.evaluate(async()=>{
    let token;const vault={readSession:async()=>({token}),saveSession:async data=>{token=data.token},clearSession:async()=>{token=undefined}};
    const api=createNativeFetch({origin:location.origin,fetchImpl:fetch.bind(window),vault,allowsAI:()=>true});
    const login=await(await api('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'synthetic@example.test',password:'synthetic-password'})})).json();
    await api('/api/auth/me');
    const form=new FormData();form.append('audio',new Blob(['synthetic-audio'],{type:'audio/webm'}),'synthetic.webm');await api('/api/speaking',{method:'POST',body:form});
    let redirectBlocked=false;try{await api('/api/redirect')}catch{redirectBlocked=true}
    return {token,exposedToken:'sessionToken' in login,redirectBlocked};
   });
   assert.equal(state.token,'n'.repeat(43));assert.equal(state.exposedToken,false);assert.equal(state.redirectBlocked,true);assert.equal(foreignHits,0);
   const login=requests.find(r=>r.path==='/api/auth/login');assert.equal(login.method,'POST');assert.equal(JSON.parse(login.body).email,'synthetic@example.test');
   const me=requests.find(r=>r.path==='/api/auth/me');assert.equal(me.headers.authorization,'Bearer '+'n'.repeat(43));
   const audio=requests.find(r=>r.path==='/api/speaking');assert.match(audio.headers['content-type'],/multipart\/form-data; boundary=/);assert.ok(audio.body.includes('synthetic-audio'));
   console.log('PASS '+name+': real HTTPS JSON/FormData delivery, token stripping, bearer continuity and blocked cross-origin redirect');
  }finally{await browser.close()}
 }
}finally{for(const item of [server,foreign]){item.closeAllConnections();await new Promise(r=>item.close(r))}await rm(directory,{recursive:true,force:true})}
