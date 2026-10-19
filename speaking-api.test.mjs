import assert from 'node:assert/strict';
const originalFetch=globalThis.fetch;
const old={gemini:process.env.GEMINI_API_KEY,openai:process.env.OPENAI_API_KEY};
process.env.GEMINI_API_KEY='synthetic-test-key';delete process.env.OPENAI_API_KEY;
let calls=0,failProvider=false,blockReply=null;
globalThis.fetch=async(input,options)=>{
 if(String(input).startsWith('https://generativelanguage.googleapis.com/')){
  calls++;if(failProvider)return new Response(JSON.stringify({error:{status:'RESOURCE_EXHAUSTED'}}),{status:429});
  const body=JSON.parse(options.body),system=body.systemInstruction?.parts?.[0]?.text||'',context=body.contents?.[0]?.parts?.[0]?.text||'';
  let value;
  if(system.includes('startup availability'))value={items:[]};
  else if(system.startsWith('Review this')){const c=JSON.parse(context),quotes=c.messages.filter(m=>m.role==='user').map(m=>m.text);value={summary:'A useful conversation.',strengths:['You made a clear request.'],corrections:[],goals:c.goals.map((g,i)=>({achieved:i===0,evidence:i===0?quotes[0]:''})),nextStep:'Practise asking about an alternative.'};}
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
 assert.equal(a.status,200);assert.equal((await call('/speaking?language=en')).status,401);assert.equal((await call('/speaking?language=en','GET',null,teacher.cookie)).status,403);
 const create=language=>call('/speaking','POST',{language,scenario:'cafe',level:'B1',displayLanguage:'ja',aiConsent:true},a.cookie);
 assert.equal((await call('/speaking','POST',{language:'en',scenario:'cafe',level:'B1',displayLanguage:'ja'},a.cookie)).status,400);
 assert.equal((await create('fr')).status,400);
 for(const language of ['en','pt','es','ja']){const r=await create(language);assert.equal(r.status,201,JSON.stringify(r.data));assert.equal(r.data.session.language,language);assert.ok(r.data.session.messages[0].text);}
 const s=(await call('/speaking?language=en','GET',null,a.cookie)).data.sessions[0];
 assert.equal((await call('/speaking/'+s.id,'GET',null,b.cookie)).status,404);
 assert.equal((await call('/speaking?language=en','GET',null,b.cookie)).data.sessions.length,0);
 const post=(body)=>call('/speaking/'+s.id+'/turn','POST',{revision:0,turnKey:'synthetic-turn-0001',aiConsent:true,text:'A coffee, please.',...body},a.cookie);
 const one=await post({});assert.equal(one.status,200,JSON.stringify(one.data));assert.equal(one.data.session.messages.length,3);
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
 const review=await call('/speaking/'+s.id+'/review','POST',{revision:3,aiConsent:true},a.cookie);assert.equal(review.status,200,JSON.stringify(review.data));assert.equal(review.data.session.status,'completed');assert.equal(review.data.session.review.goals[0].evidence,'A coffee, please.');
 const reviewedCalls=calls;assert.equal((await call('/speaking/'+s.id+'/review','POST',{revision:3,aiConsent:true},a.cookie)).status,200);assert.equal(calls,reviewedCalls);
 assert.equal((await post({revision:4,turnKey:'synthetic-after-end-0005'})).status,409);
 // A real encoded PCM input exercises upload limit, decoding and persisted transcript without retaining audio.
 const voice=(await create('en')).data.session;
 const wav=Buffer.alloc(44+32000);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(16000,24);wav.writeUInt32LE(32000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(32000,40);for(let i=0;i<16000;i++)wav.writeInt16LE(Math.round(1000*Math.sin(i*.17)),44+i*2);
 const voiceResult=await call('/speaking/'+voice.id+'/turn','POST',{revision:0,turnKey:'synthetic-voice-turn-0001',aiConsent:true,audio:{audio:'data:audio/wav;base64,'+wav.toString('base64'),seconds:1}},a.cookie);
 assert.equal(voiceResult.status,200,JSON.stringify(voiceResult.data));assert.equal(voiceResult.data.session.messages[1].mode,'voice');
 const stored=await db.query('SELECT * FROM speaking_sessions WHERE id=$1',[voice.id]);assert.ok(!JSON.stringify(stored.rows[0]).includes('base64'));assert.ok(!JSON.stringify(stored.rows[0]).includes('synthetic-test-key'));
 console.log('PASS: AI conversation HTTP auth, four languages, consent, owner isolation, idempotent replies/reviews, provider recovery, concurrent lock, completion rules, actual audio decoding and transcript-only storage.');
}finally{globalThis.fetch=originalFetch;await new Promise(r=>testServer.close(r));await db.close();if(old.gemini)process.env.GEMINI_API_KEY=old.gemini;else delete process.env.GEMINI_API_KEY;if(old.openai)process.env.OPENAI_API_KEY=old.openai;else delete process.env.OPENAI_API_KEY;}
