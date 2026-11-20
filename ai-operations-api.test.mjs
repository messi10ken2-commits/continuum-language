import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {estimateUSD,readProviderUsage,modelRate} from './ai-metering.mjs';
import {utcDay} from './ai-operations.mjs';
import {lessonList} from './course.mjs';
import {skillTasks} from './skills-content.mjs';

test('cost estimates separate cached, audio and unknown usage',()=>{
 const usage=readProviderUsage('openai',{usage:{prompt_tokens:1000,completion_tokens:50,prompt_tokens_details:{audio_tokens:100},completion_tokens_details:{audio_tokens:0}}},{audioIn:true});
 assert.equal(estimateUSD(usage,modelRate('openai','gpt-audio-1.5')),.00595);
 assert.equal(estimateUSD({...usage,audioInput:undefined},modelRate('openai','gpt-audio-1.5')),null);
 assert.equal(estimateUSD(usage,modelRate('openai','unconfigured')),null);
 const cached=readProviderUsage('gemini',{usageMetadata:{promptTokenCount:100,candidatesTokenCount:20,thoughtsTokenCount:10,cachedContentTokenCount:50}});
 assert.equal(cached.output,30);
 assert.ok(Math.abs(estimateUSD(cached,modelRate('gemini','gemini-2.5-flash'))-.0000915)<1e-10);
 assert.equal(utcDay(new Date('2026-11-09T00:00:00+08:00')),'2026-11-08');
});

test('live routes share quota across languages, roll back failures, and restrict the cost dashboard',async()=>{
 delete process.env.GEMINI_API_KEY;
 process.env.OPENAI_API_KEY='test-ai-operations';
 process.env.AI_ALERT_EVALUATION_USD='0.00001';
 const {testServer,db}=await import('./test-server.mjs');
 const base='http://127.0.0.1:'+testServer.address().port;
 const fetchReal=globalThis.fetch;
 let failNext=false,unassessable=false,providerCalls=0,slow=false,startPending,allowFinish;
 let requestNumber=0;
 globalThis.fetch=async(url,options)=>{
  if(!String(url).startsWith('https://api.openai.com/'))return fetchReal(url,options);
  providerCalls++;
  if(slow){slow=false;startPending();await new Promise(resolve=>{allowFinish=resolve;});}
  const body=JSON.parse(options.body);
  const usage={input_tokens:1000,output_tokens:50};
  if(failNext){failNext=false;return Response.json({usage},{status:503});}
  const evaluation={assessable:!unassessable,ratings:[3,3,3,3],evidence:['Task','Flow','Language','Register'],feedback:'Clear response.',nextStep:'Add a detail.',strengths:[],corrections:[],transcript:'I went home.',
   cefr:{level:null,confidence:'low',limitations:'Short sample.',evidence:[]},
   pronunciation:{assessable:true,ratings:[3,3,3,3],evidence:['Clear articulation','Steady rhythm','Natural phrasing','Intelligible'],feedback:'Clear.'}};
  if(body.text?.format?.type==='json_object')return Response.json({usage,output_text:JSON.stringify({reply:'What did you do next?'})});
  if(String(url).endsWith('/chat/completions'))return Response.json({usage:{prompt_tokens:1000,completion_tokens:50,prompt_tokens_details:{audio_tokens:100}},choices:[{message:{content:JSON.stringify(evaluation)}}]});
  return Response.json({usage,output_text:JSON.stringify(evaluation)});
 };
 async function api(path,account,body){
  const result=await fetchReal(base+'/api'+path,{method:body?'POST':'GET',headers:{'content-type':'application/json',cookie:account?.cookie??'','x-forwarded-for':'198.51.100.'+(++requestNumber%240+1)},...(body?{body:JSON.stringify(body)}:{})});
  return {status:result.status,data:await result.json(),cookie:result.headers.get('set-cookie')?.split(';')[0]};
 }
 async function register(name){
  const r=await api('/auth/register',null,{name,email:name+'@example.test',password:'synthetic-long-test-password',role:'learner',adult:true});
  assert.equal(r.status,200);return {id:r.data.user.id,cookie:r.cookie};
 }
 const task=(lang,skill)=>skillTasks.find(t=>(t.language||'es')===lang&&t.level==='A1'&&t.skill===skill&&!t.lessonId);
 function audio(){
  const wav=Buffer.alloc(44+32000);
  wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);
  wav.writeUInt16LE(1,22);wav.writeUInt32LE(16000,24);wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);
  wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);
  for(let i=44;i<wav.length;i+=2)wav.writeInt16LE(Math.round(2000*Math.sin(i/16)),i);
  return {audio:'data:audio/wav;base64,'+wav.toString('base64'),seconds:1};
 }
 async function save(account,selected){
  const r=await api('/skills',account,{task:selected.id,response:selected.skill==='Writing'?'This is a private synthetic test response.':audio(),submissionKey:randomUUID()});
  assert.equal(r.status,201,JSON.stringify(r.data));return r.data.submission.id;
 }
 const assess=(account,id,key=randomUUID())=>api('/skills/'+id+'/assess',account,{aiConsent:true,assessmentKey:key});
 const focusedUsage=async account=>(await api('/skills/ai-usage',account)).data.usage;
 const speakingUsage=async account=>(await api('/speaking/usage',account)).data.usage;
 const start=(account,language='en',startKey=randomUUID())=>api('/speaking',account,{language,level:'A1',scenario:'cafe',displayLanguage:'en',aiConsent:true,startKey});
 const turn=(account,id,key=randomUUID())=>api('/speaking/'+id+'/turn',account,{text:'One coffee, please.',aiConsent:true,revision:0,turnKey:key});
 try{
  const free=await register('FreeQuota'),premium=await register('PremiumQuota'),owner=await register('OwnerQuota');
  process.env.CONTINUUM_OWNER_USER_ID=owner.id;
  await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[premium.id]);
  const trial=await register('TrialQuota');
  await db.query("INSERT INTO premium_trials(user_id,ends_at) VALUES($1,now()+interval '1 day')",[trial.id]);
  assert.equal((await focusedUsage(trial)).limit,15);
  assert.equal((await speakingUsage(trial)).limit,15);

  const writing=await save(free,task('en','Writing')),speaking=await save(free,task('pt','Speaking'));
  const extra=await save(free,task('ja','Writing'));
  failNext=true;
  assert.equal((await assess(free,writing)).status,502);
  assert.equal((await focusedUsage(free)).used,0);
  assert.equal((await focusedUsage(free)).reserved,0);
  assert.equal((await assess(free,writing)).status,200);

  unassessable=true;
  const replayKey=randomUUID();
  assert.equal((await assess(free,speaking,replayKey)).status,200);
  assert.equal((await focusedUsage(free)).used,1);
  const beforeRetry=providerCalls;
  assert.equal((await assess(free,speaking,replayKey)).status,200);
  assert.equal(providerCalls,beforeRetry,'lost response does not regenerate unscored result with the same key');
  unassessable=false;

  slow=true;
  const pending=new Promise(resolve=>{startPending=resolve;});
  const inFlight=assess(free,speaking);
  await pending;
  assert.equal((await focusedUsage(free)).reserved,1);
  try{
   assert.equal((await assess(free,speaking)).status,409);
   assert.equal((await assess(free,extra)).status,409);
  }finally{allowFinish();}
  assert.equal((await inFlight).status,200);
  const beforeCap=providerCalls;
  assert.equal((await assess(free,extra)).status,429);
  assert.equal((await assess(free,writing)).status,200);
  assert.equal(providerCalls,beforeCap,'quota and cached paths stop before the provider');
  assert.equal((await focusedUsage(free)).used,2);

  const normal=lessonList.find(l=>l.productionTask&&skillTasks.find(t=>t.id===l.productionTask)?.skill==='Writing');
  assert.equal((await assess(free,await save(free,skillTasks.find(t=>t.id===normal.productionTask)))).status,200);
  assert.equal((await focusedUsage(free)).used,2);
  await db.query("UPDATE ai_operations SET day=day-1 WHERE user_id=$1 AND bucket='focused'",[free.id]);
  assert.equal((await focusedUsage(free)).used,0);
  assert.equal((await assess(free,extra)).status,200);

  for(let i=0;i<15;i++)assert.equal((await assess(premium,await save(premium,task(['en','pt','ja'][i%3],'Writing')))).status,200);
  const p16=await save(premium,task('es','Writing'));
  assert.equal((await assess(premium,p16)).status,429);
  assert.equal((await focusedUsage(premium)).used,15);

  const freeSession=(await start(free)).data.session;
  assert.equal(freeSession.budget.maxTurns,12);
  assert.equal(freeSession.budget.limitSeconds,420);
  assert.equal((await turn(free,freeSession.id)).status,200);
  assert.equal((await start(free,'pt')).data.session.id,freeSession.id);

  const startKey=randomUUID(),first=(await start(premium,'en',startKey)).data.session;
  assert.equal((await start(premium,'en',startKey)).data.session.id,first.id);
  assert.equal(first.budget.maxTurns,48);
  assert.equal(first.budget.limitSeconds,1800);
  const sessions=[first.id];
  for(let i=1;i<15;i++){const r=await start(premium,['en','pt','ja'][i%3]);assert.equal(r.status,201);sessions.push(r.data.session.id);}
  assert.equal((await start(premium,'it')).status,429);
  assert.equal((await speakingUsage(premium)).reserved,15);
  failNext=true;
  assert.equal((await turn(premium,first.id)).status,503);
  assert.equal((await speakingUsage(premium)).remaining,1);
  const turnKey=randomUUID();
  assert.equal((await turn(premium,first.id,turnKey)).status,200);
  assert.equal((await turn(premium,first.id,turnKey)).status,200);
  for(const id of sessions.slice(1))assert.equal((await turn(premium,id)).status,200);
  assert.equal((await speakingUsage(premium)).used,15);
  assert.equal((await start(premium,'it')).status,429);
  await db.query("UPDATE ai_operations SET day=day-1 WHERE user_id=$1 AND bucket='conversation'",[premium.id]);
  assert.equal((await speakingUsage(premium)).used,0);
  assert.equal((await start(premium,'it')).status,201);

  assert.equal((await api('/owner/ai-usage?days=7',free)).status,403);
  const stats=await api('/owner/ai-usage?days=7',owner);
  assert.equal(stats.status,200,JSON.stringify(stats.data));
  assert.ok(stats.data.tiers.free.cost>0);
  assert.ok(stats.data.tiers.premium.cost>0);
  assert.equal(stats.data.features['focused-writing'].used,17);
  assert.equal(stats.data.features['focused-speaking'].used,1);
  assert.ok(stats.data.features.conversation.used>=16);
  assert.ok(stats.data.alerts.some(item=>item.kind==='High evaluation cost'));
  assert.ok(!JSON.stringify(stats.data).includes('private synthetic'));
  const alert=stats.data.alerts.find(item=>item.kind==='High evaluation cost');
  assert.equal((await api('/owner/ai-usage/resolve',owner,{key:alert.key})).status,200);
  const after=await api('/owner/ai-usage?days=7',owner);
  assert.ok(after.data.alerts.find(item=>item.key===alert.key).resolvedAt);
  const calls=await db.query('SELECT success,estimated_usd,usage FROM ai_provider_calls');
  assert.ok(calls.rows.some(row=>!row.success&&Number(row.estimated_usd)>0),'failed paid calls still contribute estimated cost');
  assert.ok(calls.rows.some(row=>row.usage.audioInput===100));
 }finally{
  globalThis.fetch=fetchReal;
  delete process.env.OPENAI_API_KEY;
  delete process.env.CONTINUUM_OWNER_USER_ID;
  delete process.env.AI_ALERT_EVALUATION_USD;
  await new Promise(resolve=>testServer.close(resolve));
  await db.close();
 }
});
