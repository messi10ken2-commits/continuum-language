import test from 'node:test';
import assert from 'node:assert/strict';
import {replySpeaking,reviewSpeaking,validateSpeakingReview,transcribeSpeaking,voiceTurnSpeaking} from './speaking-ai.mjs';
import {speakingScenarios} from './speaking-content.mjs';
import {speakingCopy} from './speaking-copy.mjs';
const s={language:'pt',level:'B1',scenario:'cafe',display_language:'fr',messages:[{role:'assistant',text:'Olá!'},{role:'user',text:'Eu quero um café e pão.'},{role:'assistant',text:'Mais alguma coisa?'},{role:'user',text:'A conta, por favor.'}]};
const review={summary:'Vous avez commandé.',strengths:['Demande polie.'],corrections:[{original:'Eu quero um café',improved:'Eu gostaria de um café',explanation:'Une demande plus polie.'}],goals:[{achieved:true,evidence:'Eu quero um café e pão.'},{achieved:false,evidence:''},{achieved:true,evidence:'A conta, por favor.'}],nextStep:'Demandez une alternative.'};
test('feedback quotes actual learner evidence and refuses fabricated corrections or goal claims',()=>{
 assert.equal(validateSpeakingReview(review,s).goals[0].goal,speakingScenarios[0].goals[0]);
 const partial=validateSpeakingReview({...review,corrections:[{...review.corrections[0],original:'Eu querer uma café'}]},s);assert.equal(partial.partial,true);assert.equal(partial.corrections.length,0);
 const unverified=validateSpeakingReview({...review,goals:review.goals.map(g=>({...g,achieved:true,evidence:'fabricated'}))},s);assert.ok(unverified.goals.every(g=>!g.achieved&&!g.assessed));
 assert.throws(()=>validateSpeakingReview({...review,goals:[]},s));
 assert.equal(validateSpeakingReview({...review,corrections:[]},s).corrections.length,0);
});
test('reply and review keep target-language examples separate from display-language coaching',async()=>{
 const requests=[];const request=async(system,context)=>{requests.push({system,context:JSON.parse(context)});return {value:system.startsWith('Review')?review:{reply:'Quer mais alguma coisa?'}}};
 assert.equal(await replySpeaking(s,'A conta, por favor.',{request}),'Quer mais alguma coisa?');
 const r=await reviewSpeaking(s,{request});assert.equal(r.corrections.length,0);assert.equal(r.partial,true,'unverified style suggestions are withheld');
 assert.ok(requests[0].system.includes('Portuguese'));assert.ok(requests[1].system.includes('Français'));assert.ok(requests[1].system.includes('Do not assess pronunciation'));assert.equal(requests[0].context.history[1].text,s.messages[1].text);
 await assert.rejects(()=>replySpeaking(s,'hello',{request:async()=>({value:{reply:''}})}));
});
test('voice uses assessed audio transcript and rejects silence, not a client-supplied transcript',async()=>{
 const audio={audio:'real encoded recording',transcript:'untrusted client words'};
 assert.equal(await transcribeSpeaking(s,audio,{assess:async(task,received)=>{assert.equal(received,audio);assert.equal(task.skill,'Speaking');return {assessable:true,transcript:'Olá, um café por favor.'}}}),'Olá, um café por favor.');
 await assert.rejects(()=>transcribeSpeaking(s,audio,{assess:async()=>({assessable:false,transcript:'invented'})}));
});
test('all scenarios have target-language openings and core UI copy has all five non-English display languages',()=>{
 for(const scenario of speakingScenarios){assert.equal(scenario.goals.length,3);for(const l of ['en','pt','es','ja'])assert.ok(scenario.opening[l].length>5)}
 for(const row of Object.values(speakingCopy))for(const l of ['ja','es','pt','zh','fr'])assert.ok(row[l]?.trim());
});

test('voice conversation uses one audio request for transcription and the next response',async()=>{
 let calls=0;const result=await voiceTurnSpeaking(s,{audio:'real recording'},{env:{GEMINI_API_KEY:'synthetic'},convert:async()=> 'ACTUAL_AUDIO',fetchImpl:async(url,options)=>{calls++;const body=JSON.parse(options.body);assert.equal(body.contents[0].parts[1].inline_data.data,'ACTUAL_AUDIO');assert.ok(body.systemInstruction.parts[0].text.includes('35 words'));return Response.json({candidates:[{content:{parts:[{text:JSON.stringify({audible:true,transcript:'Um café, por favor.',reply:'Claro. Mais alguma coisa?'})}]}}]})}});
 assert.equal(calls,1);assert.equal(result.transcript,'Um café, por favor.');assert.equal(result.reply,'Claro. Mais alguma coisa?');
 await assert.rejects(()=>voiceTurnSpeaking(s,{},{env:{GEMINI_API_KEY:'synthetic'},convert:async()=> 'audio',fetchImpl:async()=>Response.json({candidates:[{content:{parts:[{text:'{"audible":false,"transcript":"","reply":""}'}]}}]})}),e=>e.status===422);
});

test('review repairs incomplete goal arrays once; provider failures do not invent a review',async()=>{
 let calls=0;
 const result=await reviewSpeaking(s,{request:async(system)=>{calls++;assert.ok(system.includes('exactly THREE'));return {value:calls===1?{...review,goals:review.goals.slice(0,1)}:review}}});
 assert.equal(calls,4);assert.equal(result.goals.length,3);
 calls=0;await assert.rejects(()=>reviewSpeaking(s,{request:async()=>{calls++;return {value:{...review,goals:[]}}}}),e=>e.code==='SPEAKING_REVIEW_SCHEMA');assert.equal(calls,2);
 calls=0;await assert.rejects(()=>reviewSpeaking(s,{request:async()=>{calls++;throw Object.assign(Error('quota'),{status:503,providerStatus:429})}}));assert.equal(calls,1);
 calls=0;assert.equal((await reviewSpeaking(s,{request:async()=>{calls++;if(calls===1)throw Object.assign(Error('json'),{code:'PATTERN_INVALID_JSON'});return {value:review}}})).goals.length,3);
});
test('review tolerates smart apostrophes and emoji before evidence but returns saved exact words',()=>{
 const original="🙂 I'm from Japan.",session={...s,messages:[{role:'user',text:original}]};
 const r=validateSpeakingReview({...review,corrections:[{original:'I’m from Japan.',improved:'I am from Japan.',explanation:'An alternative.'}],goals:[{achieved:true,evidence:'I’m from Japan.'},{achieved:false,evidence:''},{achieved:false,evidence:''}]},session);
 assert.equal(r.corrections[0].original,"I'm from Japan.");assert.equal(r.goals[0].evidence,"I'm from Japan.");assert.equal(r.partial,false);
});

test('voice turns prefer the responsive provider, disable extra thinking only on supported models and skip a failed backup on later rallies',async()=>{
 const {SpeechProviderBackoff}=await import('./speech-provider-backoff.mjs');const backoff=new SpeechProviderBackoff(()=>0),calls=[];
 const env={GEMINI_API_KEY:'synthetic-multirally',OPENAI_API_KEY:'rejected-multirally'};
 const fetchImpl=async(url,options)=>{calls.push(url);if(url.includes('openai'))return new Response('{}',{status:401});const body=JSON.parse(options.body);assert.deepEqual(body.generationConfig.thinkingConfig,{thinkingBudget:0});if(calls.length===1)return new Response('{}',{status:503});return Response.json({candidates:[{content:{parts:[{text:JSON.stringify({audible:true,transcript:'Olá!',reply:'Como você está?'})}]}}]});};
 await assert.rejects(voiceTurnSpeaking(s,{}, {env,backoff,convert:async()=>Buffer.alloc(44).toString('base64'),fetchImpl}));
 assert.equal(calls.length,2);assert.ok(calls[0].includes('googleapis'));
 // A fresh Gemini model is available while the rejected OpenAI credential is
 // still cooling down. No extra failed credential call is paid per rally.
 const recovered={...env,GEMINI_VOICE_CONVERSATION_MODEL:'gemini-2.5-flash-lite'};
 for(let i=0;i<4;i++)assert.equal((await voiceTurnSpeaking(s,{}, {env:recovered,backoff,convert:async()=>Buffer.alloc(44).toString('base64'),fetchImpl})).reply,'Como você está?');
 assert.equal(calls.filter(url=>url.includes('openai')).length,1);
});
