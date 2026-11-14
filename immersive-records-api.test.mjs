import assert from 'node:assert/strict';
import {test} from 'node:test';
import {testServer,db} from './test-server.mjs';
import {getLesson} from './course.mjs';
import {lightActivities,lightLessonVersion} from './light-learning-model.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function account(name){const r=await fetch(base+'/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,email:name+'@immersion.test',password:'SyntheticImmersionQA2026!',role:'learner',adult:true})});assert.ok(r.ok);return r.headers.get('set-cookie').split(';')[0]}
async function call(cookie,path,method='GET',body){const response=await fetch(base+'/api'+path,{method,headers:{cookie,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()}}
test('real saved immersion records preserve first attempts, isolate accounts and update Learning Memory without Standard mastery',async()=>{try{
 const owner=await account('immersion-owner'),other=await account('immersion-other'),lesson=getLesson('es-immersive-market-v1-reading'),activities=lightActivities(lesson),id=crypto.randomUUID();
 const blank={version:lightLessonVersion,round:0,steps:[],choice:null,hint:false,checked:false};
 let saved=await call(owner,'/learning/light/'+lesson.id,'PUT',{id,revision:0,state:blank});assert.equal(saved.status,200);
 const steps=activities.map((a,i)=>({answer:a.meaning,hint:false,missed:i<2}));
 saved=await call(owner,'/learning/light/'+lesson.id,'PUT',{id,revision:1,state:{...blank,steps,passed:true}});
 assert.equal(saved.status,200);assert.ok(saved.data.record.completedAt);assert.equal(saved.data.record.state.passed,false,'server calculates first-attempt pass instead of accepting the supplied flag');
 assert.equal((await call(other,'/learning/light/'+lesson.id)).data.record,null);
 assert.equal((await call(owner,'/learning/light/progress')).data.completed.length,0,'failed first-attempt result grants no reward');
 const report=await call(owner,'/patterns?language=es');assert.equal(report.status,200);assert.equal(report.data.coverage.lessons,1);assert.equal(report.data.topics[0].score,67);
 assert.ok(report.data.topics[0].evidence[0].text.includes('original incorrect wording was not retained'));
 assert.equal((await call(owner,'/patterns?language=en')).data.coverage.lessons,0);
 assert.equal((await call(other,'/patterns?language=es')).data.coverage.lessons,0);
 assert.equal((await call(owner,'/learning')).data.progress.length,0);
 assert.equal((await db.query('SELECT count(*)::int AS n FROM practice_attempts')).rows[0].n,0);
 assert.equal((await db.query('SELECT count(*)::int AS n FROM lesson_drafts')).rows[0].n,0);
 const corrected=steps.map(s=>({...s,missed:false}));
 assert.equal((await call(owner,'/learning/light/'+lesson.id,'PUT',{id,revision:2,state:{...blank,steps:corrected}})).status,409,'completed first-attempt evidence is immutable');
 const replay=await call(owner,'/learning/light/'+lesson.id,'PUT',{id:crypto.randomUUID(),revision:0,state:{...blank,steps:corrected}});assert.equal(replay.status,200);assert.equal(replay.data.record.state.passed,true);
 assert.equal((await call(owner,'/learning/light/progress')).data.completed.length,1);
 const changed=await call(owner,'/patterns?language=es');assert.notEqual(changed.data.revision,report.data.revision,'new evidence invalidates the calculated report fingerprint');
 assert.equal(changed.data.coverage.lessons,2);
 assert.equal((await call(owner,'/learning/light/'+lesson.id,'PUT',{id:crypto.randomUUID(),revision:0,state:{...blank,version:'light-v5',steps:corrected}})).status,400,'new chapter IDs cannot be submitted with legacy grading');
 console.log('PASS: real in-memory PostgreSQL, first-attempt scoring, immutable history, cross-account/language isolation, reward gating and Learning Memory cache invalidation.');
}finally{testServer.close();await db.close()}});
