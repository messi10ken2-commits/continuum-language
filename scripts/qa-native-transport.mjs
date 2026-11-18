// Exercise the real browser Request/body/redirect implementation with synthetic responses.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium,webkit} from 'playwright';
const policy=(await readFile('native-policy.mjs','utf8')).replaceAll('export ','');
const transport=(await readFile('native-transport.mjs','utf8')).replace(/^import .*\n/,'').replaceAll('export ','');
for(const [name,engine] of Object.entries({chromium,webkit})){
 const browser=await engine.launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
 try{
  const page=await browser.newPage();const requests=[];
  await page.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(url.hostname!=='native-fixture.example.test')throw Error('Credential-bearing redirect escaped');
   if(!url.pathname.startsWith('/api/'))return route.fulfill({contentType:'text/html',body:'<!doctype html><title>Synthetic native transport</title>'});
   requests.push({path:url.pathname,method:request.method(),headers:request.headers(),body:request.postData()});
   if(url.pathname==='/api/redirect')return route.fulfill({status:302,headers:{Location:'https://foreign.example.test/collect'}});
   return route.fulfill({contentType:'application/json',body:JSON.stringify(url.pathname==='/api/auth/login'?{user:{id:'synthetic-user'},sessionToken:'n'.repeat(43)}:{ok:true,user:{id:'synthetic-user'}})});
  });
  await page.goto('https://native-fixture.example.test');await page.addScriptTag({content:policy+'\n'+transport});
  const state=await page.evaluate(async()=>{
   let token;const vault={readSession:async()=>({token}),saveSession:async data=>{token=data.token},clearSession:async()=>{token=undefined}};
   const api=createNativeFetch({origin:location.origin,fetchImpl:fetch.bind(window),vault,allowsAI:()=>true});
   const login=await (await api('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'synthetic@example.test',password:'synthetic-password'})})).json();
   await api('/api/auth/me');
   const form=new FormData();form.append('audio',new Blob(['synthetic-audio'],{type:'audio/webm'}),'synthetic.webm');
   await api('/api/speaking',{method:'POST',body:form});
   let redirectBlocked=false;try{await api('/api/redirect')}catch{redirectBlocked=true}
   return {token,exposedToken:'sessionToken' in login,redirectBlocked};
  });
  assert.equal(state.token,'n'.repeat(43));assert.equal(state.exposedToken,false);assert.equal(state.redirectBlocked,true);
  const login=requests.find(r=>r.path==='/api/auth/login');assert.equal(login.method,'POST');assert.equal(JSON.parse(login.body).email,'synthetic@example.test');
  const me=requests.find(r=>r.path==='/api/auth/me');assert.equal(me.headers.authorization,'Bearer '+'n'.repeat(43));
  const audio=requests.find(r=>r.path==='/api/speaking');assert.match(audio.headers['content-type'],/multipart\/form-data; boundary=/);assert.ok(audio.body.includes('synthetic-audio'));
  console.log('PASS '+name+': actual JSON/FormData upload, secure session response stripping, bearer continuity and blocked cross-origin redirect');
 }finally{await browser.close()}
}
