import test from 'node:test';import assert from 'node:assert/strict';import {testServer,db} from './test-server.mjs';import {lessonList} from './course.mjs';import {lightActivities,lightVersion} from './light-learning-model.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function account(name,role='learner'){const r=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email:name+'@light.test',password:'SyntheticLightQA2026!',role,adult:true})});assert.ok(r.ok);return r.headers.get('set-cookie').split(';')[0]}
async function req(cookie,path,method='GET',body){const r=await fetch(base+path,{method,headers:{cookie,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()}}
test('guided records resume, isolate accounts, survive new sessions and never grant Standard progress or overwrite Standard drafts',async()=>{try{
 const learner=await account('light-learner'),other=await account('light-other'),teacher=await account('light-teacher','teacher');
 for(const language of ['en','es','pt','ja','zh','ko','fr','de','ar','it']){const lesson=lessonList.find(l=>(l.language||'es')===language&&!l.checkpoint&&!l.summaryTest),path='/api/learning/light/'+lesson.id,activities=lightActivities(lesson),id=crypto.randomUUID(),state={version:lightVersion,steps:[],choice:null,hint:false,checked:false};
  let r=await req(learner,path,'PUT',{id,revision:0,state});assert.equal(r.status,200);assert.equal(r.data.record.revision,1);
  r=await req(learner,path);assert.equal(r.data.record.id,id);assert.equal((await req(other,path)).data.record,null);assert.equal((await req(teacher,path)).status,403);
  const complete={...state,steps:activities.map(a=>({answer:a.type==='observe'?true:['meaning','video'].includes(a.type)?a.meaning:a.model,hint:true}))};
  assert.equal((await req(learner,path,'PUT',{id,revision:0,state:complete})).status,409,'stale revisions cannot replace saved work');
  r=await req(learner,path,'PUT',{id,revision:1,state:complete});assert.equal(r.status,200);assert.ok(r.data.record.completedAt);assert.equal((await req(learner,path,'PUT',{id,revision:2,state})).status,409,'completion evidence is immutable');
  const fresh=await req(learner,path,'PUT',{id:crypto.randomUUID(),revision:0,state});assert.equal(fresh.status,200);
  const bad={...state,steps:[{answer:'unrelated answer',hint:false}]};assert.equal((await req(learner,path,'PUT',{id:crypto.randomUUID(),revision:0,state:bad})).status,400);
 }
 const history=await req(learner,'/api/learning/light');assert.equal(history.data.records.length,20);assert.equal(history.data.records.filter(r=>r.completedAt).length,10);
 const learning=await req(learner,'/api/learning');assert.deepEqual(learning.data.progress,[]);assert.equal((await db.query('SELECT count(*)::int AS n FROM practice_attempts')).rows[0].n,0);assert.equal((await db.query('SELECT count(*)::int AS n FROM lesson_drafts')).rows[0].n,0);
 const checkpoint=lessonList.find(l=>l.checkpoint);assert.equal((await req(learner,'/api/learning/light/'+checkpoint.id,'PUT',{id:crypto.randomUUID(),revision:0,state:{version:lightVersion,steps:[],choice:null,hint:false,checked:false}})).status,400);
 }finally{await new Promise(r=>testServer.close(r));await db.close()}});
