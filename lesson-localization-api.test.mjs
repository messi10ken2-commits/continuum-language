import test from 'node:test';import assert from 'node:assert/strict';import {testServer,db} from './test-server.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
test('reported lesson content uses authenticated localization in all nine locales without requiring a live provider',async()=>{
 try{const response=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Lesson copy QA',email:'lesson-copy-qa@example.test',password:'SyntheticLessonCopy2026!',role:'learner',adult:true})});assert.ok(response.ok);const cookie=response.headers.get('set-cookie').split(';')[0];
 const examples=['Ask someone to open a heavy door.','That suits my schedule. Everyday conversational Spanish. The subject is the proposed time, not the speaker.'];
 for(const locale of ['ja','es','pt','zh','fr','ko','id','ru','ar']){const r=await fetch(base+'/api/localization',{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({locale,items:examples.map(text=>({text,language:'es'}))})});assert.equal(r.status,200,locale);const body=await r.json();assert.equal(body.translations.length,2);for(let i=0;i<2;i++)assert.notEqual(body.translations[i].text,examples[i],locale);}
 const denied=await fetch(base+'/api/localization',{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify({locale:'ja',items:[{text:'Private learner response '+crypto.randomUUID(),language:'es'}]})});assert.equal(denied.status,400,'unpublished/private text must remain rejected');
 }finally{await new Promise(resolve=>testServer.close(resolve));await db.close()}
});
