import assert from 'node:assert/strict';
import {premiumSkillTasks} from './premium-skills.mjs';
delete process.env.OPENAI_API_KEY;delete process.env.GEMINI_API_KEY;
const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
function recordedFixture(){
 const wav=Buffer.alloc(44+32000*3);
 wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);
 wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
 wav.writeUInt32LE(16000,24);wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
 wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);
 for(let i=44;i<wav.length;i+=2)wav.writeInt16LE(Math.round(2000*Math.sin(i/16)),i);
 return {audio:'data:audio/wav;base64,'+wav.toString('base64'),seconds:3};
}
try{
 const paid=await api('/auth/register','POST',{name:'Level QA',email:'level-qa@example.test',password:'synthetic-level-qa-password',role:'learner',adult:true});assert.equal(paid.status,200);
 const free=await api('/auth/register','POST',{name:'Free Level QA',email:'free-level-qa@example.test',password:'synthetic-level-qa-password',role:'learner',adult:true});
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[paid.data.user.id]);
 for(const language of ['en','es','pt','ja'])for(const level of ['A1','A2','B1','B2','C1']){
  const id=`focus-${language}-travel-listening-${level.toLowerCase()}`,task=premiumSkillTasks.find(t=>t.id===id);
  const result=await api('/skills/tasks/'+id,'GET',null,paid.cookie);assert.equal(result.status,200);assert.deepEqual(result.data.task,task);
  assert.equal((await api('/skills/tasks/'+id,'GET',null,free.cookie)).status,403);
  assert.equal((await api('/skills/tasks/'+id+'/audio','GET',null,free.cookie)).status,403);
  const body={task:id,response:task.questions.map(q=>q.answer),submissionKey:crypto.randomUUID()};
  const graded=await api('/skills','POST',body,paid.cookie);assert.equal(graded.status,201);assert.equal(graded.data.submission.result.score,100);assert.equal(graded.data.submission.task,id);assert.equal(graded.data.submission.taskInfo.level,level);
  assert.equal((await api('/skills','POST',body,paid.cookie)).status,200,'retries remain idempotent');
 }
 const saved=await api('/skills','GET',null,paid.cookie);assert.equal(saved.data.submissions.length,20);assert.equal(new Set(saved.data.submissions.map(t=>t.task)).size,20);
 assert.equal((await api('/skills/tasks/focus-ja-travel-writing','GET',null,paid.cookie)).status,200);
 const transcripts={en:'I went to the market yesterday.',es:'Ayer fui al mercado.',pt:'Ontem fui ao mercado.',ja:'昨日、市場に行きました。',it:'Ieri sono andato al mercato.'};
 const originalFetch=globalThis.fetch;
 let language,assessable=true,assessments=0,verifications=0;
 process.env.OPENAI_API_KEY='test-focused-speaking';
 globalThis.fetch=async(url,options)=>{
  if(String(url).endsWith('/v1/chat/completions')){
   const body=JSON.parse(options.body),transcript=transcripts[language];
   assert.equal(body.messages[1].content[1].input_audio.format,'wav');
   assessments++;
   return Response.json({choices:[{message:{content:JSON.stringify({
    assessable,ratings:[3,3,3,3],evidence:['Task','Flow','Language','Register'],feedback:'Short account.',nextStep:'Add a detail.',
    strengths:[],corrections:language==='it'?[]:[{original:transcript,improved:transcript,explanation:'Optional rewording.'}],transcript,
    cefr:{level:'A1',confidence:'low',limitations:'Short sample.',evidence:[{quote:transcript,reason:'Describes a past activity.'}]},
    pronunciation:{assessable,ratings:[3,3,3,3],evidence:['Clear sounds','Steady timing','Clear phrasing','Intelligible'],feedback:'Clear.'}
   })}}]});
  }
  if(String(url)==='https://api.openai.com/v1/responses'){
   verifications++;
   return language==='pt'?new Response(null,{status:503}):Response.json({output_text:JSON.stringify({checks:[{index:0,originalAcceptable:true,kind:'style'}]})});
  }
  return originalFetch(url,options);
 };
 try{
  const recording=recordedFixture();
  for(language of Object.keys(transcripts)){
   const task=premiumSkillTasks.find(t=>t.language===language&&t.skill==='Speaking'&&t.level==='A1');
   const saved=await api('/skills','POST',{task:task.id,response:recording,submissionKey:crypto.randomUUID()},paid.cookie);
   assert.equal(saved.status,201);
   const submission=saved.data.submission,recordPath='/skills/'+submission.id;
   if(language==='pt'){
    const old={evaluationVersion:'skill-evidence-v3',status:'ai-reviewed',assessable:true,partial:true,score:null,communicationScore:null,ratings:[]};
    await db.query('UPDATE skill_submissions SET result=$2::jsonb WHERE id=$1',[submission.id,JSON.stringify({...submission.result,...old,aiAssessment:old})]);
    const previous=await api(recordPath,'GET',null,paid.cookie);
    assert.equal(previous.data.submission.result.aiAssessment.retryAssessment,true);
    assert.equal((await api(recordPath+'/assess','POST',{},paid.cookie)).status,400);
   }
   const assessed=await api(recordPath+'/assess','POST',{aiConsent:true},paid.cookie);
   assert.equal(assessed.status,200,JSON.stringify(assessed.data));
   const result=assessed.data.result.aiAssessment;
   assert.equal(result.score,75,language);
   assert.equal(result.communicationScore,75,language);
   assert.equal(result.pronunciation.score,75,language);
   assert.equal(result.cefr.level,null,'a short sample can earn a task score without a CEFR estimate');
   assert.deepEqual(result.corrections,[]);
   assert.equal(result.partial,language!=='it');
   assert.equal(result.retryAssessment,undefined);
   const cached=await api(recordPath+'/assess','POST',{aiConsent:true},paid.cookie);
   assert.equal(cached.data.result.aiAssessment.score,75);
  }
  assert.equal(assessments,5,'cached results do not repeat the provider call');
  assert.equal(verifications,4);
  language='en';assessable=false;
  const task=premiumSkillTasks.find(t=>t.language===language&&t.skill==='Speaking'&&t.level==='A1');
  const saved=await api('/skills','POST',{task:task.id,response:recording,submissionKey:crypto.randomUUID()},paid.cookie);
  const assessed=await api('/skills/'+saved.data.submission.id+'/assess','POST',{aiConsent:true},paid.cookie);
  assert.equal(assessed.status,200);
  assert.equal(assessed.data.result.aiAssessment.score,null);
  assert.equal(assessed.data.result.aiAssessment.retryAssessment,true);
  assessable=true;
  const retried=await api('/skills/'+saved.data.submission.id+'/assess','POST',{aiConsent:true},paid.cookie);
  assert.equal(retried.data.result.aiAssessment.score,75);
  assert.equal(retried.data.result.aiAssessment.retryAssessment,undefined);
 }finally{globalThis.fetch=originalFetch;delete process.env.OPENAI_API_KEY;}
 console.log('PASS: 20 language/level API paths, correct grading, historical task resolution, access protection, and speaking score recovery across five languages.');
}finally{await new Promise(r=>testServer.close(r));await db.close()}
