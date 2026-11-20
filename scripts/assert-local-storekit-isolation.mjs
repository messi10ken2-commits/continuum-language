// Fixed loopback fixture only: local purchases must not grant server membership.
import assert from 'node:assert/strict';import https from 'node:https';import {readFile} from 'node:fs/promises';
const ca=await readFile('/tmp/continuum-root.crt');
function api(path,{body,cookie}={}){return new Promise((resolve,reject)=>{
 const request=https.request({hostname:'127.0.0.1',port:9443,path:'/api'+path,method:body?'POST':'GET',ca,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})}},response=>{let data='';response.setEncoding('utf8');response.on('data',chunk=>data+=chunk);response.on('end',()=>{try{assert.equal(response.statusCode,200);resolve({data:JSON.parse(data),cookie:response.headers['set-cookie']?.[0].split(';')[0]})}catch(error){reject(error)}})});
 request.on('error',reject);request.setTimeout(15000,()=>request.destroy(Error('Fixture timeout')));request.end(body?JSON.stringify(body):undefined);
})}
const login=await api('/auth/login',{body:{email:'store-demo@example.test',password:'store-demo-fixture-123'}});assert.ok(login.cookie);
const {data}=await api('/billing',{cookie:login.cookie});assert.equal(data.membership.premium,false);assert.equal(data.membership.tier,'free');console.log('PASS: actual local StoreKit purchases did not grant server Premium.');
