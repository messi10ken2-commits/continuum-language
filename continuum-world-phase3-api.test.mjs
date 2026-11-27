import assert from 'node:assert/strict';import crypto from 'node:crypto';
process.env.CONTINUUM_WORLD_PHASE2_ENABLED='true';process.env.GEMINI_API_KEY='synthetic-phase3';delete process.env.OPENAI_API_KEY;
const realFetch=globalThis.fetch;let context;
globalThis.fetch=async(url,options)=>{
 if(!String(url).startsWith('https://generativelanguage.googleapis.com/'))return realFetch(url,options);
 const b=JSON.parse(options.body),system=b.systemInstruction?.parts?.[0]?.text||'',c=JSON.parse(b.contents?.[0]?.parts?.[0]?.text||'{}');let value={items:[]};
 if(system.startsWith('Review this')){const q=c.messages.filter(m=>m.role==='user');value={summary:'希望と理由を伝えられました。',strengths:['場面に合う会話'],corrections:[],goals:c.goals.map((_,i)=>({achieved:i<2,evidence:i<2?q[i]?.text||'':''})),nextStep:'別の言い方も試しましょう。',ratings:[3,3,3,3],scoreTurnIds:['L1','L2','L1','L2'],communicationAssessable:true};}
 else if(system.startsWith('You are a supportive')){context=c.worldContext;value={reply:'はい。ご希望をもう少し教えていただけますか。'};}
 return Response.json({candidates:[{content:{parts:[{text:JSON.stringify(value)}]}}]});
};
const {testServer,db}=await import('./test-server.mjs'),base='http://127.0.0.1:'+testServer.address().port;
const api=async(path,method='GET',body,cookie)=>{const r=await realFetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return{status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};};
try{
 const reg=async name=>api('/auth/register','POST',{email:name+'@example.test',name,password:'synthetic-phase3-password',adult:true,role:'learner'});
 const a=await reg('phase3-owner'),b=await reg('phase3-other');
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[a.data.user.id]);
 const call=(path,method='GET',body)=>api(path,method,body,a.cookie),profile=async()=>(await call('/world/profile')).data;
 assert.equal((await api('/world/travel','POST',{district:'osaka',accessible:true})).status,401);
 assert.equal((await call('/world/travel','POST',{district:'osaka',accessible:true})).status,409);
 assert.equal((await call('/world/journey-choice','PUT',{choiceId:'reading',optionId:'travel'})).status,409);
 const visit=async(missionId,accessible=true,scene,position,time='auto')=>call('/world/visits','POST',{startKey:crypto.randomUUID(),missionId,level:'B1',classContext:false,accessible,scene,position,time});
 assert.equal((await visit('book-find')).status,409);assert.equal((await visit('station-ticket')).status,409);
 await call('/world/settings','PUT',{onboarded:true,aiConsent:true,classContext:false,level:'B1'});
 let total=0;
 for(const id of ['cafe-order','shop-buy','station-route','park-meet','book-find','music-rehearse','asahi-plan','station-journey','osaka-order','osaka-culture']){
  const p=await profile();assert.equal(p.missions.find(m=>m.id===id).locked,false,id);
  const v=await visit(id,true,undefined,undefined,id==='station-journey'?'night':'auto');assert.equal(v.status,201,JSON.stringify(v.data));
  let r=await call('/speaking','POST',{...v.data,language:'ja',level:'B1',displayLanguage:'en',aiConsent:true});assert.equal(r.status,201,JSON.stringify(r.data));let session=r.data.session;if(id==='station-journey')assert.ok(session.messages[0].text.startsWith('こんばんは。'));
  for(const text of ['おすすめについて教えていただけますか。','静かな場所で楽しみたいです。']){r=await call('/speaking/'+session.id+'/turn','POST',{text,revision:session.revision,turnKey:crypto.randomUUID(),aiConsent:true});assert.equal(r.status,200,JSON.stringify(r.data));session=r.data.session;}
  if(id==='station-journey')assert.equal(context.scene.period,'evening');if(id==='music-rehearse')assert.ok(context.scene.playerChoices.includes('旅や街の文化を知りたい'));
  assert.equal(context.memories.length,0);assert.ok(context.scene.mission===id);assert.ok(!JSON.stringify(context).includes('phase3-other'));
  r=await call('/speaking/'+session.id+'/review','POST',{revision:session.revision,aiConsent:true});assert.equal(r.status,200,JSON.stringify(r.data));total+=80;
  const after=await profile();assert.equal(after.xp,total);assert.equal(after.records.length,total/80);assert.equal(after.consent.enabled,false);assert.equal(after.memories.length,0);
  await call('/speaking/'+session.id+'/review','POST',{revision:r.data.session.revision,aiConsent:true});assert.equal((await profile()).xp,total,'repeat review remains idempotent');
  if(id==='station-route'){assert.equal((await profile()).journey.places.find(l=>l.id==='tokyo_station_hall').unlocked,true);assert.equal((await visit('station-ticket',false,'outdoors',{x:0,z:-26.5})).status,409);assert.equal((await visit('station-ticket',false,'tokyo_station_hall',{x:0,z:-2.4})).status,201);}
  if(id==='book-find'){assert.equal((await call('/world/journey-choice','PUT',{choiceId:'reading',optionId:'travel'})).status,200);assert.equal((await call('/world/journey-choice','PUT',{choiceId:'reading',optionId:'private address'})).status,409);assert.equal((await profile()).journey.choices.find(c=>c.id==='reading').selected,'travel');}
 }
 const p=await profile();assert.ok(p.journey.places.every(x=>x.unlocked));assert.equal(p.achievements.length,10);assert.equal(p.xp,800);
 assert.equal((await call('/world/travel','POST',{district:'osaka',scene:'outdoors',position:{x:0,z:0}})).status,409);
 const trip=await call('/world/travel','POST',{district:'osaka',scene:'tokyo_station_hall',position:{x:0,z:-2.4}});assert.equal(trip.status,200);assert.equal(trip.data.scene,'osaka');
 assert.equal((await call('/world/travel','POST',{district:'tokyo',scene:'osaka_arcade',position:{x:0,z:-2.4}})).status,200);
 const login=await api('/auth/login','POST',{email:'phase3-owner@example.test',password:'synthetic-phase3-password'});assert.equal(login.status,200);const relog=(await api('/world/profile','GET',null,login.cookie)).data;assert.equal(relog.xp,800);assert.equal(relog.journey.choices.find(c=>c.id==='reading').selected,'travel');
 const other=(await api('/world/profile','GET',null,b.cookie)).data;assert.equal(other.xp,0);assert.equal(other.journey.choices.find(c=>c.id==='reading').selected,null);assert.equal(other.journey.districts.find(d=>d.id==='osaka').unlocked,false);
 assert.equal((await api('/world/travel','POST',{district:'osaka',accessible:true},b.cookie)).status,409);
 console.log('PASS Phase 3: all mission awards earned through real server reviews; locks, fictional choices, persistence, physical travel, ownership and memory-off Learning Memory.');
}finally{globalThis.fetch=realFetch;await new Promise(r=>testServer.close(r));await db.close();}
