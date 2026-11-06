import test from 'node:test';import assert from 'node:assert/strict';import {testServer,db} from './test-server.mjs';import {lessonList} from './course.mjs';import {lightActivities,lightVersion,priorLightVersion,legacyLightVersion,legacyLightActivities,v2LightActivities} from './light-learning-model.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function account(name,role='learner'){const r=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email:name+'@light.test',password:'SyntheticLightQA2026!',role,adult:true})});assert.ok(r.ok);return r.headers.get('set-cookie').split(';')[0]}
async function req(cookie,path,method='GET',body){const r=await fetch(base+path,{method,headers:{cookie,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()}}
test('guided records resume, isolate accounts, survive new sessions and never grant Standard progress or overwrite Standard drafts',async()=>{try{
 const learner=await account('light-learner'),other=await account('light-other'),teacher=await account('light-teacher','teacher');
 for(const language of ['en','es','pt','ja','zh','ko','fr','de','ar','it']){const lesson=lessonList.find(l=>(l.language||'es')===language&&!l.checkpoint&&!l.summaryTest),path='/api/learning/light/'+lesson.id,activities=lightActivities(lesson),id=crypto.randomUUID(),state={version:lightVersion,round:0,steps:[],choice:null,hint:false,checked:false};
  let r=await req(learner,path,'PUT',{id,revision:0,state});assert.equal(r.status,200);assert.equal(r.data.record.revision,1);
  r=await req(learner,path);assert.equal(r.data.record.id,id);assert.equal((await req(other,path)).data.record,null);assert.equal((await req(teacher,path)).status,403);
  const complete={...state,steps:activities.map(a=>({answer:a.type==='observe'?true:['meaning','video','recall','translate','listen','context','confirm','video-confirm'].includes(a.type)?a.meaning:a.model,hint:true}))};
  assert.equal((await req(learner,path,'PUT',{id,revision:0,state:complete})).status,409,'stale revisions cannot replace saved work');
  r=await req(learner,path,'PUT',{id,revision:1,state:complete});assert.equal(r.status,200);assert.ok(r.data.record.completedAt);assert.equal((await req(learner,path,'PUT',{id,revision:2,state})).status,409,'completion evidence is immutable');
  const fresh=await req(learner,path,'PUT',{id:crypto.randomUUID(),revision:0,state});assert.equal(fresh.status,200);
  const bad={...state,steps:[{answer:'unrelated answer',hint:false}]};assert.equal((await req(learner,path,'PUT',{id:crypto.randomUUID(),revision:0,state:bad})).status,400);
 }
 const history=await req(learner,'/api/learning/light');assert.equal(history.data.records.length,20);assert.equal(history.data.records.filter(r=>r.completedAt).length,10);
 const lesson=lessonList.find(l=>(l.language||'es')==='es'&&!l.checkpoint&&!l.summaryTest);
 const townPath='/api/learning/light/'+lesson.id,round=1,id=crypto.randomUUID();
 const state={version:lightVersion,round,steps:[],choice:null,hint:false,checked:false};
 const answers=lightActivities(lesson,round).map(a=>({answer:a.type==='observe'?true:a.type==='build'?a.model:a.meaning,hint:false,missed:false}));
 const townCookie=await account('town-replay');
 assert.equal((await req(townCookie,townPath,'PUT',{id,revision:0,state:{...state,missed:true}})).status,200);
 assert.equal((await req(townCookie,townPath,'PUT',{id,revision:1,state:{...state,steps:answers}})).status,409);
 const recorded=answers.map((step,i)=>i===2||i===0?{...step,missed:true}:step);
 assert.equal((await req(townCookie,townPath,'PUT',{id,revision:1,state:{...state,steps:recorded}})).status,200);
 assert.equal((await req(townCookie,townPath,'PUT',{id:crypto.randomUUID(),revision:0,state:{...state,steps:answers}})).status,200);
 const awards=(await req(townCookie,'/api/learning/light/progress')).data.completed;
 assert.equal(awards.length,1);
 assert.equal(awards[0].id,id);
 assert.ok(Number.isFinite(Date.parse(awards[0].completedAt)));
 assert.equal(awards[0].materials,recorded.length===6?28:20);
 const route=await req(learner,'/api/learning/light/progress');assert.equal(route.status,200);assert.equal(route.data.completed.length,10);assert.equal((await req(other,'/api/learning/light/progress')).data.completed.length,0);
 const replayLesson=lessonList.find(l=>l.id==='introductions'),oldState={version:legacyLightVersion,steps:legacyLightActivities(replayLesson).map(a=>({answer:a.type==='observe'?true:['meaning','video'].includes(a.type)?a.meaning:a.model,hint:false})),choice:null,hint:false,checked:false};assert.equal((await req(learner,'/api/learning/light/introductions','PUT',{id:crypto.randomUUID(),revision:0,state:oldState})).status,200);assert.equal((await req(learner,'/api/learning/light/progress')).data.completed.length,10,'old records preserved without misrepresenting new route completion');
 const filtered=await req(learner,'/api/learning/light/introductions?round=0&version='+lightVersion);assert.equal(filtered.data.record.state.version,lightVersion);
 const learning=await req(learner,'/api/learning');assert.deepEqual(learning.data.progress,[]);assert.equal((await db.query('SELECT count(*)::int AS n FROM practice_attempts')).rows[0].n,0);assert.equal((await db.query('SELECT count(*)::int AS n FROM lesson_drafts')).rows[0].n,0);
 const v2={version:priorLightVersion,round:0,steps:v2LightActivities(replayLesson).map(a=>({answer:a.type==='observe'?true:['meaning','video','recall'].includes(a.type)?a.meaning:a.model,hint:false})),choice:null,hint:false,checked:false};assert.equal((await req(learner,'/api/learning/light/introductions','PUT',{id:crypto.randomUUID(),revision:0,state:v2})).status,200);const retained=(await req(learner,'/api/learning/light/progress')).data.completed;assert.equal(retained.length,10);assert.equal(retained.find(r=>r.lesson==='introductions').xp,60,'progress uses maximum earned XP, not a sum across versions');
 const last=await req(learner,'/api/learning/light/introductions?round=0&version='+lightVersion),cross={...last.data.record.state,round:1};assert.equal((await req(learner,'/api/learning/light/introductions','PUT',{id:last.data.record.id,revision:last.data.record.revision,state:cross})).status,409,'a record cannot be moved between rounds');
 const second={version:lightVersion,round:1,steps:lightActivities(replayLesson,1).map(a=>({answer:a.type==='observe'?true:['meaning','video','recall','translate','listen','context','confirm','video-confirm'].includes(a.type)?a.meaning:a.model,hint:false})),choice:null,hint:false,checked:false};
 for(let i=0;i<51;i++)assert.equal((await req(learner,'/api/learning/light/introductions','PUT',{id:crypto.randomUUID(),revision:0,state:second})).status,200);
 assert.equal((await req(learner,'/api/learning/light')).data.records.length,50);const afterReplay=(await req(learner,'/api/learning/light/progress')).data.completed;assert.equal(afterReplay.length,11,'route progress survives 50-row history and replays do not multiply XP');assert.ok(afterReplay.some(r=>r.lesson==='introductions'&&r.round===0));assert.equal((await req(learner,'/api/learning/light/introductions?round=1&version='+lightVersion)).data.record.state.round,1);
 const checkpoint=lessonList.find(l=>l.checkpoint);assert.equal((await req(learner,'/api/learning/light/'+checkpoint.id,'PUT',{id:crypto.randomUUID(),revision:0,state:{version:lightVersion,round:0,steps:[],choice:null,hint:false,checked:false}})).status,400);
 }finally{await new Promise(r=>testServer.close(r));await db.close()}});
