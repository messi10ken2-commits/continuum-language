import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';

const base='http://127.0.0.1:'+testServer.address().port;
let cookie;
async function call(path,method='GET',body){
 const response=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
 const data=await response.json();
 if(!cookie)cookie=response.headers.get('set-cookie')?.split(';')[0];
 return {status:response.status,data};
}

try{
 assert.equal((await call('/preferences')).status,401);
 const registered=await call('/auth/register','POST',{name:'Base Language Test',email:'base-language@example.test',password:'synthetic-test-password',role:'learner',adult:true,baseLanguage:'fr'});
 assert.equal(registered.status,200);
 assert.equal(registered.data.user.baseLanguage,'fr');
 assert.equal((await call('/auth/me')).data.user.baseLanguage,'fr');
 assert.equal((await call('/preferences','PUT',{baseLanguage:'klingon'})).status,400);
 assert.equal((await call('/preferences','PUT',{baseLanguage:'ja'})).status,200);
 assert.equal((await call('/preferences')).data.baseLanguage,'ja');
 assert.equal((await call('/auth/me')).data.user.baseLanguage,'ja');
 await call('/auth/logout','POST');cookie=undefined;
 assert.equal((await call('/preferences')).status,401);
 const login=await call('/auth/login','POST',{email:'base-language@example.test',password:'synthetic-test-password'});
 assert.equal(login.status,200);
 assert.equal(login.data.user.baseLanguage,'ja');
 for(const baseLanguage of ['en','es','pt','fr','zh','ja']){
  assert.equal((await call('/preferences','PUT',{baseLanguage})).status,200);
  assert.equal((await call('/preferences')).data.baseLanguage,baseLanguage);
 }
 await call('/auth/logout','POST');cookie=undefined;
 const teacher=await call('/auth/register','POST',{name:'Teacher Base Language',email:'base-teacher@example.test',password:'synthetic-teacher-password',role:'teacher',adult:true,baseLanguage:'pt'});
 assert.equal(teacher.status,200);
 assert.equal(teacher.data.user.baseLanguage,'pt');
 assert.equal((await call('/preferences','PUT',{baseLanguage:'zh'})).status,200);
 assert.equal((await call('/auth/me')).data.user.role,'teacher');
 await call('/auth/logout','POST');cookie=undefined;
 assert.equal((await call('/auth/login','POST',{email:'base-language@example.test',password:'synthetic-test-password'})).data.user.baseLanguage,'ja');
 console.log('PASS: base language is validated, saved to the account, and restored through the session independently of course data.');
}finally{
 await new Promise(resolve=>testServer.close(resolve));
 await db.close();
}
