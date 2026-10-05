import assert from 'node:assert/strict';
import {buildPatternEvidence,questionEvidence,validatePatternAnalysis} from './learning-patterns.mjs';
import {analyzePatterns,handlePatterns} from './patterns-api.mjs';
import {getLessonVariant,lessonList} from './course.mjs';
import {assessmentItems} from './assessment-bank.mjs';
import {testServer,db} from './test-server.mjs';
const base='http://127.0.0.1:'+testServer.address().port;let cookie,user;
async function call(path,method='GET',body){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();if(!cookie)cookie=r.headers.get('set-cookie')?.split(';')[0];return {status:r.status,data};}
try{
 const registered=await call('/auth/register','POST',{name:'Pattern test',email:'patterns@example.test',password:'synthetic-test-password',role:'learner',adult:true});assert.equal(registered.status,200);user=registered.data.user;
 const all=[];
 for(const language of ['es','en','pt','ja']){
  const l=lessonList.find(x=>(x.language||'es')===language&&!x.checkpoint&&!x.summaryTest&&x.questions.length),seed='v1-patterns-123456789';
  const answers=l.questions.map(q=>q.answer);const saved=await call('/practice','POST',{lesson:l.id,answers,submissionKey:crypto.randomUUID()});assert.equal(saved.status,201,JSON.stringify(saved.data));
  const stored=await db.query('SELECT evidence FROM practice_attempts WHERE id=$1',[saved.data.attempt.id]);assert.equal(stored.rows[0].evidence.reduce((s,e)=>s+e.total,0),l.questions.length);
  const good={...saved.data.attempt,evidence:stored.rows[0].evidence};all.push(good);
  const a=buildPatternEvidence({language,attempts:[...all,{id:'low1',lesson:l.id,score:25,total:4,at:'2026-01-01'},{id:'low2',lesson:l.id,score:25,total:4,at:'2026-01-02'}],notes:[{id:'note-'+language,language,focus:'A useful class observation',note:'Please practise longer answers.',at:'2026-01-01'}]});
  assert.equal(a.coverage.lessons,3);assert.equal(a.coverage.classes,1);assert.equal(a.topics.find(t=>t.id==='lesson:'+l.id).recurring,true);assert.equal(a.topics.find(t=>t.kind==='Class observation').score,null);
  const checkpoint=lessonList.find(x=>(x.language||'es')===language&&x.checkpoint),variant=getLessonVariant(checkpoint.id,seed),e=questionEvidence(checkpoint.id,variant.questions.map(q=>q.answer),seed);assert.equal(e.reduce((s,x)=>s+x.correct,0),variant.questions.length);
  const api=await call('/patterns?language='+language);assert.equal(api.status,200,JSON.stringify(api.data));assert.equal(api.data.coverage.lessons,1);assert.ok(api.data.topics.every(t=>t.score===100));
  const version=language+'-diagnostic-2',items=assessmentItems(0,version),test=buildPatternEvidence({language,assessments:[{id:'exam',language,form:0,version,answers:items.map((q,i)=>i===0?null:q.answer),at:'2026-01-01'}]});assert.ok(test.topics.some(t=>t.score<100));
 }
 const id=all[1].lesson;await db.query("INSERT INTO practice_attempts(user_id,lesson_id,score,total,source) SELECT $1,$2,50,4,'exercise' FROM generate_series(1,55)",[user.id,id]);
 const full=(await call('/patterns?language=en')).data;assert.equal(full.coverage.lessons,56);assert.equal(full.topics[0].count,56);assert.equal(full.topics[0].evidence.length,5);
 const emptySpeech=buildPatternEvidence({language:'en',submissions:[{id:'speech',task:'en-skills-a1-speaking',result:{status:'awaiting-review',score:null},at:'2026-01-01'}]});assert.equal(emptySpeech.coverage.skills,1);assert.equal(emptySpeech.topics.length,0);
 assert.equal((await call('/patterns?language=xx')).status,400);
 assert.equal((await call('/patterns?language=en','POST',{consent:false})).status,400);
 const originalGemini=process.env.GEMINI_API_KEY;process.env.GEMINI_API_KEY='synthetic-no-network';
 const topic=full.topics[0],item={topicId:topic.id,summary:'Two or more saved scores show difficulty.',nextStep:'Try the topic in a new situation.',evidenceIds:[topic.evidence[0].id],lessonId:id};
 assert.throws(()=>validatePatternAnalysis({items:[{...item,evidenceIds:['invented']}]},full.topics,'en'));
 assert.throws(()=>validatePatternAnalysis({items:[{...item,lessonId:all[0].lesson}]},full.topics,'en'));
 let calls=0;const report=await analyzePatterns(full.topics,'en',{fetchImpl:async(url,opts)=>{calls++;assert.ok(url.includes('generativelanguage.googleapis.com'));assert.ok(!opts.body.includes('synthetic-test-password'));return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify({items:[item]})}]}}]})}}});assert.equal(report.items.length,1);assert.equal(calls,1);
 const deps={route:'/api/patterns',req:{url:'/api/patterns?language=en',method:'POST'},res:{},pool:{query:(...args)=>db.query(...args)},required:async()=>user,json:async()=>({consent:true}),send:(res,status,data)=>{res.status=status;res.data=data},fail:(status,message)=>{throw Object.assign(Error(message),{status})},limited(){}};
 let analyses=0;await handlePatterns({...deps,analyze:async()=>{analyses++;return report}});assert.equal(deps.res.status,200);
 await handlePatterns({...deps,analyze:async()=>{analyses++;return report}});assert.equal(analyses,1,'cache prevents unnecessary provider calls');
 await handlePatterns({...deps,req:{...deps.req,method:'DELETE'}});
 assert.equal((await call('/patterns?language=en')).data.enabled,false);
 await handlePatterns({...deps,analyze:async()=>{await handlePatterns({...deps,req:{...deps.req,method:'DELETE'}});return report}});assert.equal(deps.res.status,409,'revocation wins an in-flight request');
 assert.equal((await call('/patterns?language=en')).data.analysis,null);
 if(originalGemini===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=originalGemini;
 const learnerCookie=cookie;cookie=null;const teacher=await call('/auth/register','POST',{name:'Teacher test',email:'teacher-patterns@example.test',password:'synthetic-test-password',role:'teacher',adult:true});assert.equal(teacher.status,200);
 assert.equal((await call('/patterns?language=en')).status,403);
 await db.query('INSERT INTO teacher_links(teacher_id,learner_id) VALUES($1,$2)',[teacher.data.user.id,user.id]);
 const note=await call('/teacher/learners/'+user.id+'/notes','POST',{language:'ja',focus:'Particles',note:'Practise distinguishing は and が in introductions.'});assert.equal(note.status,201);assert.equal(note.data.note.language,'ja');cookie=learnerCookie;
 assert.equal((await call('/patterns?language=ja')).data.coverage.classes,1);assert.equal((await call('/patterns?language=en')).data.coverage.classes,0);
 console.log('PASS: four-language isolation, saved question evidence, full history, skipped test answers, unscored speech, validated AI citations, caching, consent revocation race, teacher privacy and language-tagged notes.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
