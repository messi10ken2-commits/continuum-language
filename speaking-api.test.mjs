import assert from 'node:assert/strict';
const originalFetch=globalThis.fetch;
const old={gemini:process.env.GEMINI_API_KEY,openai:process.env.OPENAI_API_KEY};
process.env.GEMINI_API_KEY='synthetic-test-key';delete process.env.OPENAI_API_KEY;
let calls=0,failProvider=false,blockReply=null,scoreEnabled=false;
globalThis.fetch=async(input,options)=>{
 if(String(input).startsWith('https://generativelanguage.googleapis.com/')){
  calls++;if(failProvider)return new Response(JSON.stringify({error:{status:'RESOURCE_EXHAUSTED'}}),{status:429});
  if(String(input).endsWith('/interactions'))return Response.json({steps:[{content:[{type:'audio',data:Buffer.from(Array.from({length:4800},(_,i)=>[0,12,0,244][i%4])).toString('base64')}]}]});
  const body=JSON.parse(options.body),system=body.systemInstruction?.parts?.[0]?.text||'',context=body.contents?.[0]?.parts?.[0]?.text||'';
  let value;
  if(system.includes('startup availability'))value={items:[]};
  else if(system.startsWith('Review this')){const c=JSON.parse(context),quotes=c.messages.filter(m=>m.role==='user').map(m=>m.text);value={summary:'A useful conversation.',strengths:['You made a clear request.'],corrections:[{original:quotes[0],improved:'Could I have a coffee, please?',explanation:'A polite request.'}],goals:c.goals.map((g,i)=>({achieved:i===0,evidence:i===0?quotes[0]:''})),nextStep:'Practise asking about an alternative.'};}
  else if(system.startsWith('Assess practical communication')&&scoreEnabled){const c=JSON.parse(context);value={ratings:[3,3,3,3],scoreTurnIds:[c.learnerTurns[0].id,c.learnerTurns[1].id,c.learnerTurns[0].id,c.learnerTurns[1].id]};}
  else if(system.startsWith('You are a friendly adult'))value={audible:true,transcript:'A coffee, please.',reply:'Of course. Anything else?'};
  else if(!system){value={assessable:true,ratings:[3,3,3,3],evidence:['clear','clear','clear','clear'],feedback:'Clear.',nextStep:'Continue.',strengths:['Polite.'],corrections:[],transcript:'A coffee, please.'};}
  else {if(blockReply)await blockReply;value={reply:'Certainly. Would you like anything else?'};}
  return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify(value)}]}}]}),{headers:{'content-type':'application/json'}});
 }
 return originalFetch(input,options);
};
const {testServer,db}=await import('./test-server.mjs');
const base='http://127.0.0.1:'+testServer.address().port;
async function call(path,method='GET',body,cookie){const r=await originalFetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 const register=(name,role='learner')=>call('/auth/register','POST',{name,email:name+'@example.test',password:'synthetic-test-password',role,adult:true});
 const a=await register('speaking-owner'),b=await register('speaking-other'),teacher=await register('speaking-teacher','teacher');
 await db.query("INSERT INTO billing_memberships(user_id,status,paid_until) VALUES($1,'active',now()+interval '1 day')",[a.data.user.id]);
 assert.equal(a.status,200);assert.equal((await call('/speaking?language=en')).status,401);assert.equal((await call('/speaking?language=en','GET',null,teacher.cookie)).status,403);
 const create=(language,extra={})=>call('/speaking','POST',{language,scenario:'cafe',level:'B1',displayLanguage:'ja',aiConsent:true,...extra},a.cookie);
 assert.equal((await call('/speaking','POST',{language:'en',scenario:'cafe',level:'B1',displayLanguage:'ja'},a.cookie)).status,400);
 assert.equal((await create('xx')).status,400);
 for(const language of ['en','pt','es','ja']){const r=await create(language);assert.equal(r.status,201,JSON.stringify(r.data));assert.equal(r.data.session.language,language);assert.ok(r.data.session.messages[0].text);}
 const s=(await call('/speaking?language=en','GET',null,a.cookie)).data.sessions[0];
 assert.equal((await call('/speaking/'+s.id,'GET',null,b.cookie)).status,404);
 assert.equal((await call('/speaking?language=en','GET',null,b.cookie)).data.sessions.length,0);
 // Dynamic TTS is authorized from server-owned assistant text, never arbitrary input.
 const audioURL=base+'/api/speaking/'+s.id+'/audio/0';
 assert.equal((await originalFetch(audioURL)).status,401);
 assert.equal((await originalFetch(audioURL,{headers:{cookie:b.cookie}})).status,404);
 const clip=await originalFetch(audioURL,{headers:{cookie:a.cookie}});assert.equal(clip.status,200);assert.equal(clip.headers.get('cache-control'),'private, no-store');assert.ok(clip.headers.get('content-type').startsWith('audio/'));assert.equal(Buffer.from(await clip.arrayBuffer()).toString('ascii',0,4),'RIFF');
 const generations=calls;assert.equal((await originalFetch(audioURL,{headers:{cookie:a.cookie}})).status,200);assert.equal(calls,generations);
 const device=await originalFetch(audioURL+'?format=text',{headers:{cookie:a.cookie}});assert.equal((await device.json()).text,s.messages[0].text);assert.equal(calls,generations);
 assert.equal((await originalFetch(base+'/api/speaking/'+s.id+'/audio/999',{headers:{cookie:a.cookie}})).status,404);

 const post=(body)=>call('/speaking/'+s.id+'/turn','POST',{revision:0,turnKey:'synthetic-turn-0001',aiConsent:true,text:'A coffee, please.',...body},a.cookie);
 const one=await post({});assert.equal(one.status,200,JSON.stringify(one.data));assert.equal(one.data.session.messages.length,3);
 assert.equal((await originalFetch(base+'/api/speaking/'+s.id+'/audio/1',{headers:{cookie:a.cookie}})).status,404);
 const n=calls;assert.deepEqual((await post({})).data,one.data);assert.equal(calls,n,'network retry must not pay for another reply');
 assert.equal((await post({text:'Different content.'})).status,409);
 assert.equal((await post({turnKey:'synthetic-stale-0002'})).status,409);
 assert.equal((await call('/speaking/'+s.id+'/review','POST',{revision:1,aiConsent:true},a.cookie)).status,400);
 failProvider=true;assert.equal((await post({revision:1,turnKey:'synthetic-turn-0002',text:'No, thank you.'})).status,503);failProvider=false;
 assert.equal((await call('/speaking/'+s.id,'GET',null,a.cookie)).data.session.messages.length,3);
 const two=await post({revision:1,turnKey:'synthetic-turn-0002',text:'No, thank you.'});assert.equal(two.status,200,JSON.stringify(two.data));
 let unlock;blockReply=new Promise(r=>unlock=r);
 const three=post({revision:2,turnKey:'synthetic-turn-0003',text:'How much is it?'});
 for(let i=0;i<100;i++){const row=await db.query('SELECT lease_token FROM speaking_sessions WHERE id=$1',[s.id]);if(row.rows[0].lease_token)break;await new Promise(r=>setTimeout(r,5));}
 assert.equal((await post({revision:2,turnKey:'synthetic-concurrent-0004',text:'A cake too.'})).status,409);unlock();blockReply=null;assert.equal((await three).status,200);
 failProvider=true;const failedReview=await call('/speaking/'+s.id+'/review','POST',{revision:3,aiConsent:true},a.cookie);assert.equal(failedReview.status,503);assert.ok(failedReview.data.error.startsWith('Your conversation is saved'));failProvider=false;
 const beforeRetry=(await call('/speaking/'+s.id,'GET',null,a.cookie)).data.session;assert.equal(beforeRetry.status,'active');assert.equal(beforeRetry.revision,3);assert.equal(beforeRetry.review,null);assert.equal(beforeRetry.messages.length,7);
 const review=await call('/speaking/'+s.id+'/review','POST',{revision:3,aiConsent:true},a.cookie);assert.equal(review.status,200,JSON.stringify(review.data));assert.equal(review.data.session.status,'completed');assert.equal(review.data.session.review.goals[0].evidence,'A coffee, please.');
 const correctionAudio=await originalFetch(base+'/api/speaking/'+s.id+'/audio/review/0?format=text',{headers:{cookie:a.cookie}});assert.equal(correctionAudio.status,404,'unverified politeness changes must not be played as corrections');
 assert.equal((await originalFetch(base+'/api/speaking/'+s.id+'/audio/review/0',{headers:{cookie:b.cookie}})).status,404);
 const reviewedCalls=calls;assert.equal((await call('/speaking/'+s.id+'/review','POST',{revision:3,aiConsent:true},a.cookie)).status,200);assert.equal(calls,reviewedCalls);
 assert.equal((await post({revision:4,turnKey:'synthetic-after-end-0005'})).status,409);
 // Missing scores can be explicitly refreshed without reopening completed turns.
 scoreEnabled=true;const beforeScoreCalls=calls;
 const refresh=await call('/speaking/'+s.id+'/review','POST',{revision:4,aiConsent:true,refreshScores:true},a.cookie);assert.equal(refresh.status,200);assert.equal(refresh.data.session.status,'completed');assert.equal(refresh.data.session.messages.length,7);assert.equal(refresh.data.session.revision,5);assert.equal(refresh.data.session.review.communicationScore,75);assert.equal(calls,beforeScoreCalls+1,'Score-only refresh must not regenerate feedback or audit corrections');assert.equal(refresh.data.session.review.summary,review.data.session.review.summary);assert.deepEqual(refresh.data.session.review.goals,review.data.session.review.goals);const once=calls;const repeated=await call('/speaking/'+s.id+'/review','POST',{revision:4,aiConsent:true,refreshScores:true},a.cookie);assert.equal(repeated.data.session.review.communicationScore,75);assert.equal(calls,once,'A network retry must reuse the completed score');
 assert.equal((await call('/speaking/'+s.id+'/review','POST',{revision:5,aiConsent:false,refreshScores:true},a.cookie)).status,400);
 assert.equal((await call('/speaking/'+s.id+'/review','POST',{revision:5,aiConsent:true,refreshScores:true},b.cookie)).status,404);
 // A real encoded PCM input exercises upload limit, decoding and persisted transcript without retaining audio.
 const voice=(await create('en')).data.session;
 const wav=Buffer.alloc(44+32000);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(16000,24);wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(32000,40);for(let i=0;i<16000;i++)wav.writeInt16LE(Math.round(1000*Math.sin(i*.17)),44+i*2);
 const voiceResult=await call('/speaking/'+voice.id+'/turn','POST',{revision:0,turnKey:'synthetic-voice-turn-0001',aiConsent:true,prefetchAudio:true,audio:{audio:'data:audio/wav;base64,'+wav.toString('base64'),seconds:1}},a.cookie);
 assert.equal(voiceResult.status,200,JSON.stringify(voiceResult.data));assert.equal(voiceResult.data.session.messages[1].mode,'voice');
 const {speechKey}=await import('./speech-service.mjs');const {conversationPartner}=await import('./conversation-partners.mjs');const audioKey=speechKey(voiceResult.data.session.messages.at(-1).text,'en-US',conversationPartner('en',voice.scenario).voice);let warmed=false;for(let i=0;i<100;i++){const cache=await db.query('SELECT cache_key FROM speech_cache WHERE cache_key=$1',[audioKey]);if(cache.rows.length){warmed=true;break}await new Promise(r=>setTimeout(r,10))}assert.ok(warmed,'voice reply prefetch uses the private playback cache');const providerCalls=calls;const prefetched=await originalFetch(base+'/api/speaking/'+voice.id+'/audio/2',{headers:{cookie:a.cookie}});assert.equal(prefetched.status,200);await prefetched.arrayBuffer();assert.equal(calls,providerCalls,'cached playback must not generate a second clip');
 const stored=await db.query('SELECT * FROM speaking_sessions WHERE id=$1',[voice.id]);assert.ok(!JSON.stringify(stored.rows[0]).includes('base64'));assert.ok(!JSON.stringify(stored.rows[0]).includes('synthetic-test-key'));
 const opening=(await create('fr',{prefetchAudio:true})).data.session;
 const openingKey=speechKey(opening.messages[0].text,'fr-FR',conversationPartner('fr',opening.scenario).voice);
 let openingWarmed=false;for(let i=0;i<100;i++){if((await db.query('SELECT cache_key FROM speech_cache WHERE cache_key=$1',[openingKey])).rows.length){openingWarmed=true;break}await new Promise(r=>setTimeout(r,10));}
 assert.ok(openingWarmed,'natural opening is prepared while the learner starts voice mode');
 const beforeOpening=calls,openingAudio=await originalFetch(base+'/api/speaking/'+opening.id+'/audio/0',{headers:{cookie:a.cookie}});assert.equal(openingAudio.status,200);await openingAudio.arrayBuffer();assert.equal(calls,beforeOpening,'prepared opening is reused');assert.equal(openingAudio.headers.get('Cache-Control'),'private, no-store');
 console.log('PASS: AI conversation HTTP auth, four languages, consent, owner isolation, idempotent replies/reviews, provider recovery, concurrent lock, completion rules, actual audio decoding and transcript-only storage.');
}finally{globalThis.fetch=originalFetch;await new Promise(r=>testServer.close(r));await db.close();if(old.gemini)process.env.GEMINI_API_KEY=old.gemini;else delete process.env.GEMINI_API_KEY;if(old.openai)process.env.OPENAI_API_KEY=old.openai;else delete process.env.OPENAI_API_KEY;}
