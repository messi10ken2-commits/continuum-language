import {translationRevision} from './reviewed-interface-copy.mjs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {testServer,db} from './test-server.mjs';
import {translationSource} from './localization-corpus.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function account(name,role){const r=await call('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-test-password',role,adult:true});assert.equal(r.status,200);return r;}
try{
 const a=await account('LocaleLearner','learner'),b=await account('LocaleTeacher','teacher');
 assert.equal((await call('/interface-language')).status,401);
 assert.equal((await call('/interface-language','GET',null,a.cookie)).data.language,null);
 for(const language of ['en','ja','es','pt','zh','fr']){assert.equal((await call('/interface-language','PUT',{language},a.cookie)).status,200);assert.equal((await call('/interface-language','GET',null,a.cookie)).data.language,language);}
 assert.equal((await call('/interface-language','GET',null,b.cookie)).data.language,null);
 assert.equal((await call('/interface-language','PUT',{language:'ja'},b.cookie)).status,200);
 assert.equal((await call('/interface-language','PUT',{language:'ko'},a.cookie)).status,400);
 assert.equal((await call('/profile','GET',null,a.cookie)).data.profile,null,'interface preference must not create a learning profile');
 assert.equal((await call('/localization','POST',{locale:'ja',items:[{text:'Sign in'}]})).status,401);
 let r=await call('/localization','POST',{locale:'ja',items:[{text:'Sign in'}]},a.cookie);assert.equal(r.status,200);assert.equal(r.data.translations[0].text,'ログイン');
 assert.equal((await call('/localization','POST',{locale:'ja',items:[{text:'Translate private learner data not in this course'}]},a.cookie)).status,400);
 const text='A little practice. A bigger world.',source=translationSource(text);
 const cacheKey=crypto.createHash('sha256').update(JSON.stringify([translationRevision,'ja',source])).digest('hex');
 // Use an uncatalogued-in-core but approved UI string to test persisted cache.
 const text2='Read the complete video transcript',s2=translationSource(text2);assert.ok(s2);
 const key2=crypto.createHash('sha256').update(JSON.stringify([translationRevision,'ja',s2])).digest('hex');
 await db.query('INSERT INTO interface_translations(cache_key,translated) VALUES($1,$2)',[key2,'動画の全文スクリプトを読む']);
 r=await call('/localization','POST',{locale:'ja',items:[{text:text2}]},a.cookie);assert.equal(r.status,200);assert.equal(r.data.translations[0].text,'動画の全文スクリプトを読む');
 assert.equal((await call('/interface-language','GET',null,a.cookie)).data.language,'fr');
 console.log('PASS: six saved interface languages, learner/teacher isolation, authentication, source allowlist, persisted translation cache, unchanged learning profile.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
