import assert from 'node:assert/strict';import crypto from 'node:crypto';
process.env.CONTINUUM_WORLD_PHASE2_ENABLED='true';process.env.GEMINI_API_KEY='synthetic-world-key';delete process.env.OPENAI_API_KEY;
const realFetch=globalThis.fetch;let lastContext,lastVoiceContext,blockReply,providerStarted,releaseBlocked,blockSpeech,speechStarted,releaseSpeech;const sessionIds=[];
globalThis.fetch=async(url,options)=>{
 if(String(url).startsWith('https://generativelanguage.googleapis.com/')){
  if(String(url).endsWith('/interactions')){speechStarted?.();if(blockSpeech)await blockSpeech;return Response.json({steps:[{content:[{type:'audio',data:Buffer.from(Array.from({length:4800},(_,i)=>[0,12,0,244][i%4])).toString('base64')}]}]});}
  const b=JSON.parse(options.body),system=b.systemInstruction?.parts?.[0]?.text||'',context=b.contents?.[0]?.parts?.[0]?.text||'{}';let value={items:[]};
  if(system.startsWith('Translate the supplied Japanese NPC line'))value={translation:'You may use that seat.'};
  else if(system.startsWith('Review this')){const c=JSON.parse(context),q=c.messages.filter(m=>m.role==='user');value={summary:'許可を丁寧に尋ねられました。',strengths:['状況に合う質問です。'],corrections:[],goals:c.goals.map((_,i)=>({achieved:i<2,evidence:i<2?q[i]?.text||'':''})),nextStep:'おすすめも聞いてみましょう。',ratings:[3,3,3,3],scoreTurnIds:['L1','L2','L1','L2'],communicationAssessable:true};}
  else if(system.startsWith('You are a friendly adult')){lastVoiceContext=JSON.parse(context);value={audible:true,transcript:'カードで払えますか。',reply:'はい、カードでお支払いいただけます。'};}
  else if(system.startsWith('You are a supportive')){lastContext=JSON.parse(context);providerStarted?.();if(blockReply)await blockReply;value={reply:'はい、窓際の席をお使いください。何になさいますか？'};}
  return Response.json({candidates:[{content:{parts:[{text:JSON.stringify(value)}]}}]});
 }
 return realFetch(url,options);
};
const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,cookie){const r=await realFetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return{status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 const reg=(name,role='learner')=>api('/auth/register','POST',{email:name+'@example.test',name,password:'synthetic-world-password',adult:true,role});
 const a=await reg('world-owner'),b=await reg('world-other'),teacher=await reg('world-teacher','teacher'),wrong=await reg('world-wrong-teacher','teacher');const uid=a.data.user.id;
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[uid]);
 assert.equal((await api('/world/profile')).status,401);assert.equal((await api('/world/profile','GET',null,teacher.cookie)).status,403);
 let p=(await api('/world/profile','GET',null,a.cookie)).data;assert.equal(p.consent.enabled,false);assert.equal(p.missions.filter(m=>m.type==='main').length,10);assert.equal(p.missions.filter(m=>m.type==='side').length,14);assert.equal(p.missions.filter(m=>m.type==='daily').length,2);
 assert.deepEqual(p.settings,{onboarded:false,aiConsent:false,classContext:false,level:'auto'});
 assert.equal((await api('/world/settings','PUT',{onboarded:true,aiConsent:'yes',classContext:true,level:'B2'},a.cookie)).status,400);
 const settings={onboarded:true,aiConsent:true,classContext:true,level:'B2'};
 assert.deepEqual((await api('/world/settings','PUT',settings,a.cookie)).data.settings,settings);
 assert.deepEqual((await api('/world/profile','GET',null,a.cookie)).data.settings,settings);
 assert.equal((await api('/world/profile','GET',null,b.cookie)).data.settings.aiConsent,false);
 const note=(await db.query("INSERT INTO class_notes(learner_id,teacher_id,language,focus,note) VALUES($1,$2,'ja','〜てもいいですか','許可を尋ねる場面で使います。') RETURNING id",[uid,teacher.data.user.id])).rows[0];
 await db.query("INSERT INTO teacher_links(teacher_id,learner_id,languages) VALUES($1,$2,ARRAY['ja']),($3,$2,ARRAY['es'])",[teacher.data.user.id,uid,wrong.data.user.id]);
 const visit=async(extra={})=>{const startKey=crypto.randomUUID();return api('/world/visits','POST',{startKey,missionId:'cafe-permission',level:'A1',classContext:true,scene:'tokyo_cafe',position:{x:0,z:-2.4},...extra},a.cookie);};
 assert.equal((await visit({scene:'outdoors',position:{x:0,z:0}})).status,409);
 assert.equal((await api('/speaking','POST',{startKey:crypto.randomUUID(),scenario:'world-cafe-permission',language:'ja',level:'A1',displayLanguage:'ja',aiConsent:true},a.cookie)).status,409);
 await api('/world/memory-consent','PUT',{enabled:true,version:p.consent.version},a.cookie);
 const make=async()=>{const v=await visit();assert.equal(v.status,201,JSON.stringify(v.data));const r=await api('/speaking','POST',{...v.data,language:'ja',level:'A1',displayLanguage:'ja',aiConsent:true},a.cookie);assert.equal(r.status,201,JSON.stringify(r.data));sessionIds.push(r.data.session.id);return r.data.session;};
 let s=await make();
 assert.equal((await api('/world/translation','POST',{sessionId:s.id,index:0,locale:'en',aiConsent:true},b.cookie)).status,404);
 assert.equal((await api('/world/translation','POST',{sessionId:s.id,index:0,locale:'en',aiConsent:false},a.cookie)).status,400);
 assert.equal((await api('/world/translation','POST',{sessionId:s.id,index:0,locale:'en',aiConsent:true},a.cookie)).data.translation,'You may use that seat.');
 await db.query("UPDATE world_profiles SET translation_requests=60 WHERE user_id=$1",[uid]);
 assert.equal((await api('/world/translation','POST',{sessionId:s.id,index:0,locale:'en',aiConsent:true},a.cookie)).status,429);
 await db.query("UPDATE world_profiles SET translation_day=(now() AT TIME ZONE 'UTC')::date-1 WHERE user_id=$1",[uid]);
 assert.equal((await api('/world/translation','POST',{sessionId:s.id,index:0,locale:'en',aiConsent:true},a.cookie)).status,200);

 const turn=async(text,key=crypto.randomUUID())=>{const r=await api('/speaking/'+s.id+'/turn','POST',{text,turnKey:key,revision:s.revision,aiConsent:true},a.cookie);if(r.status===200)s=r.data.session;return r;};
 const key=crypto.randomUUID();assert.equal((await turn('ここに座ってもいいですか。',key)).status,200);assert.ok(JSON.stringify(lastContext.worldContext.classLearning).includes('〜てもいいですか'));
 const count=s.messages.length;assert.equal((await turn('ここに座ってもいいですか。',key)).status,200);assert.equal(s.messages.length,count);
 await turn('静かな席がいいです。');const reviewed=await api('/speaking/'+s.id+'/review','POST',{revision:s.revision,aiConsent:true},a.cookie);assert.equal(reviewed.status,200,JSON.stringify(reviewed.data));s=reviewed.data.session;
 p=(await api('/world/profile','GET',null,a.cookie)).data;assert.equal(p.xp,30);assert.equal(p.records.length,1);assert.ok(p.records[0].detail.includes('ここに座ってもいいですか。'));assert.ok(p.records[0].evidence.classNoteIds.includes(note.id));
 await api('/speaking/'+s.id+'/review','POST',{revision:s.revision,aiConsent:true},a.cookie);assert.equal((await api('/world/profile','GET',null,a.cookie)).data.xp,30);
 assert.equal((await api('/world/npc-memories','POST',{sessionId:s.id,version:p.consent.version,confirm:true},b.cookie)).status,409);
 const mem=await api('/world/npc-memories','POST',{sessionId:s.id,version:p.consent.version,confirm:true},a.cookie);assert.equal(mem.status,201,JSON.stringify(mem.data));assert.ok(!mem.data.memory.summary.includes('ここに座って'));assert.equal((await api('/world/profile','GET',null,b.cookie)).data.memories.length,0);
 const oldSession=s.id;s=await make();assert.ok(s.messages[0].text.includes('前回'));await turn('おすすめは何ですか。');assert.equal(lastContext.worldContext.memories.length,1);
 let release;blockReply=new Promise(r=>{release=r;releaseBlocked=r;});const started=new Promise(r=>providerStarted=r);const inFlight=turn('お茶はありますか。');await started;
 blockSpeech=new Promise(r=>releaseSpeech=r);const audioStarted=new Promise(r=>speechStarted=r);const audioPending=realFetch(base+'/api/speaking/'+s.id+'/audio/0',{headers:{cookie:a.cookie}}).then(async r=>({status:r.status,bytes:await r.arrayBuffer()}));await audioStarted;
 assert.equal((await api('/world/npc-memories/'+mem.data.memory.id,'DELETE',null,a.cookie)).status,200);release();releaseSpeech();assert.equal((await inFlight).status,409);assert.equal((await audioPending).status,410);assert.equal((await db.query('SELECT count(*)::int n FROM speech_cache WHERE owner_id=$1',[uid])).rows[0].n,0);blockReply=null;providerStarted=null;blockSpeech=null;speechStarted=null;
 p=(await api('/world/profile','GET',null,a.cookie)).data;assert.equal((await api('/world/npc-memories','POST',{sessionId:oldSession,version:p.consent.version,confirm:true},a.cookie)).status,409,'deleted memories cannot be restored from stale sessions');
 assert.equal((await turn('お茶はありますか。')).status,200);assert.equal(lastContext.worldContext.memories.length,0);assert.equal(lastContext.history.length,0,'revoked memory does not leak through old assistant history');
 await api('/world/memory-consent','PUT',{enabled:false,version:p.consent.version},a.cookie);p=(await api('/world/profile','GET',null,a.cookie)).data;assert.equal(p.memories.length,0);assert.equal(p.consent.enabled,false);
 assert.equal((await db.query('SELECT count(*)::int n FROM practice_attempts WHERE user_id=$1',[uid])).rows[0].n,0);
 const patterns=await api('/patterns?language=ja','GET',null,a.cookie);assert.equal(patterns.status,200);assert.equal(patterns.data.coverage.world,1);assert.ok(patterns.data.topics.some(t=>t.kind==='World practice'&&t.evidence.some(e=>e.text.includes('ここに座ってもいいですか。'))));assert.ok(!(await api('/patterns?language=en','GET',null,a.cookie)).data.topics.some(t=>t.kind==='World practice'));
 const shared=await api('/teacher/learners/'+uid+'?language=ja','GET',null,teacher.cookie);assert.equal(shared.status,200);assert.equal(shared.data.worldRecords.length,1);assert.ok(!JSON.stringify(shared.data).includes('memorySuggestion'));
 const denied=await api('/teacher/learners/'+uid+'?language=ja','GET',null,wrong.cookie);assert.equal(denied.status,403);
 await db.query('UPDATE users SET share_self_learning=false WHERE id=$1',[uid]);assert.equal((await api('/teacher/learners/'+uid+'?language=ja','GET',null,teacher.cookie)).data.worldRecords.length,0);
 // The same server pathway supports all four NPCs and real audio transport.
 const locations=[['cafe-recommend','A2'],['shop-payment','B1'],['station-check','B2'],['park-weather','C1']];let voiceSession;
 for(const [missionId,level]of locations){const v=await visit({missionId,level,accessible:true,classContext:false});assert.equal(v.status,201);const r=await api('/speaking','POST',{...v.data,language:'ja',level,displayLanguage:'ja',aiConsent:true},a.cookie);assert.equal(r.status,201,JSON.stringify(r.data));assert.equal(r.data.session.level,level);sessionIds.push(r.data.session.id);if(missionId==='shop-payment')voiceSession=r.data.session;}
 const wav=Buffer.alloc(44+32000);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(16000,24);wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(32000,40);for(let i=0;i<16000;i++)wav.writeInt16LE(Math.round(1000*Math.sin(i*.17)),44+i*2);
 const voiceReply=await api('/speaking/'+voiceSession.id+'/turn','POST',{revision:0,turnKey:crypto.randomUUID(),aiConsent:true,audio:{audio:'data:audio/wav;base64,'+wav.toString('base64'),seconds:1}},a.cookie);assert.equal(voiceReply.status,200,JSON.stringify(voiceReply.data));assert.equal(lastVoiceContext.worldContext.npc.name,'蓮');assert.equal(lastVoiceContext.worldContext.memories.length,0);assert.ok(!JSON.stringify((await db.query('SELECT * FROM speaking_sessions WHERE id=$1',[voiceSession.id])).rows[0]).includes('base64'));
 // Exercise the five-item cap and physical expiry cleanup, including private TTS.
 p=(await api('/world/profile','GET',null,a.cookie)).data;await api('/world/memory-consent','PUT',{enabled:true,version:p.consent.version},a.cookie);
 s=await make();await turn('この席を使ってもいいですか。');await turn('静かな場所がいいです。');assert.equal((await api('/speaking/'+s.id+'/review','POST',{revision:s.revision,aiConsent:true},a.cookie)).status,200);
 p=(await api('/world/profile','GET',null,a.cookie)).data;
 for(const id of sessionIds.slice(0,5))await db.query("INSERT INTO world_npc_memories(user_id,npc_id,summary,session_id,memory_version,created_at) VALUES($1,'aoi','前回は街についてお話ししました。',$2,$3,now()-interval '1 hour')",[uid,id,p.consent.version]);
 assert.equal((await api('/world/npc-memories','POST',{sessionId:s.id,version:p.consent.version,confirm:true},a.cookie)).status,201);
 p=(await api('/world/profile','GET',null,a.cookie)).data;assert.equal(p.memories.length,5);
 await db.query("UPDATE world_npc_memories SET expires_at=now()-interval '1 minute' WHERE id=$1",[p.memories[0].id]);
 await db.query("INSERT INTO speech_cache(cache_key,audio,provider,model,owner_id) VALUES('world-expiry-test',$1,'synthetic','synthetic',$2)",[Buffer.from('synthetic'),uid]);
 p=(await api('/world/profile','GET',null,a.cookie)).data;assert.equal(p.memories.length,4);assert.equal((await db.query('SELECT count(*)::int n FROM speech_cache WHERE owner_id=$1',[uid])).rows[0].n,0);
 // Free users share the existing allowance; resuming cannot silently re-enable class context.
 const free=await reg('world-free-note-choice');const freeVisit=async(classContext)=>api('/world/visits','POST',{startKey:crypto.randomUUID(),missionId:'cafe-permission',level:'A1',classContext,accessible:true},free.cookie);
 const fv=await freeVisit(true),fs=(await api('/speaking','POST',{...fv.data,language:'ja',level:'A1',displayLanguage:'ja',aiConsent:true},free.cookie)).data.session;assert.equal(fs.worldClassContext,true);
 let ft=await api('/speaking/'+fs.id+'/turn','POST',{text:'この席に座ってもいいですか。',turnKey:crypto.randomUUID(),revision:0,aiConsent:true},free.cookie);assert.equal(ft.status,200);
 const changed=await freeVisit(false);assert.equal((await api('/speaking','POST',{...changed.data,language:'ja',level:'A1',displayLanguage:'ja',aiConsent:true},free.cookie)).status,409);
 assert.equal((await api('/speaking?language=ja','GET',null,free.cookie)).data.sessions.length,0);assert.equal((await api('/speaking?language=ja&world=true','GET',null,free.cookie)).data.sessions.length,1);
 ft=await api('/speaking/'+fs.id+'/turn','POST',{text:'静かな席がいいです。',turnKey:crypto.randomUUID(),revision:ft.data.session.revision,aiConsent:true},free.cookie);assert.equal(ft.status,200);assert.equal((await api('/speaking/'+fs.id+'/review','POST',{revision:ft.data.session.revision,aiConsent:true},free.cookie)).status,200);
 const freeProfile=(await api('/world/profile','GET',null,free.cookie)).data;assert.equal(freeProfile.consent.enabled,false);assert.equal(freeProfile.xp,30);assert.equal(freeProfile.memories.length,0);
 process.env.CONTINUUM_WORLD_PHASE2_ENABLED='false';const privateSettings=(await api('/privacy/settings','GET',null,a.cookie)).data;assert.equal(privateSettings.worldNpcMemory.memories.length,4);assert.equal((await api('/world/npc-memories','DELETE',null,a.cookie)).status,200);const privacyAfter=(await api('/privacy/settings','GET',null,a.cookie)).data;assert.equal(privacyAfter.worldNpcMemory.memories.length,0);assert.equal((await api('/world/memory-consent','PUT',{enabled:false,version:privacyAfter.worldNpcMemory.version},a.cookie)).status,200);assert.equal((await api('/world/profile','GET',null,a.cookie)).data.enabled,false);assert.equal((await api('/world/learning?language=ja','GET',null,a.cookie)).data.records.length,2);
 console.log('PASS World E2E: class→NPC→verified Learning Memory; missions/XP idempotence; consent, revocation race, deletion, ownership and teacher language/sharing scope.');
}finally{releaseBlocked?.();releaseSpeech?.();globalThis.fetch=realFetch;await new Promise(r=>testServer.close(r));await db.close();}
