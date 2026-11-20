import test from 'node:test';
import assert from 'node:assert/strict';
import {requestConversation} from './conversation-provider.mjs';
import {reviewSpeaking,voiceTurnSpeaking} from './speaking-ai.mjs';
import {assessmentItems,assessmentFormCount} from './assessment-bank.mjs';
import {allowedSpeech} from './speech-api.mjs';
import {speechParts} from './sentence-audio.mjs';
const response=value=>Response.json({output_text:JSON.stringify(value)});
test('all current and historical placement listening clips are authorized without authorizing private text',()=>{
 let clips=0;for(const language of ['en','ja','es','pt'])for(let form=0;form<assessmentFormCount;form++)for(const version of [1,2,3,4]){
  let questions;try{questions=assessmentItems(form,`${language}-diagnostic-${version}`)}catch{continue}
  for(const q of questions)if(q.audio){clips++;for(const part of speechParts(q.audio,q.locale,q.locale))assert.ok(allowedSpeech(part.text,part.lang),q.id);}
 }
 assert.ok(clips>480);assert.equal(allowedSpeech('my private conversation 893402','en-US'),false);
});
test('conversation falls back on rate limit and skips the cooling provider on the next request',async()=>{
 const calls=[],env={OPENAI_API_KEY:'synthetic-fallback',GEMINI_API_KEY:'synthetic-fallback'};
 const fetchImpl=async(url,options)=>{calls.push(url);assert.ok(options.signal);if(url.includes('openai'))return new Response('{}',{status:429});return Response.json({candidates:[{content:{parts:[{text:'{"reply":"Olá!"}'}]}}]});};
 assert.equal((await requestConversation('system','context',{env,fetchImpl})).value.reply,'Olá!');
 await requestConversation('system','context',{env,fetchImpl});assert.equal(calls.filter(x=>x.includes('openai')).length,1);assert.equal(calls.length,3);
});
test('review can use working OpenAI even if Gemini is configured but unavailable',async()=>{
 const session={language:'en',display_language:'en',level:'B2',scenario:'directions',messages:[{role:'user',text:'Where is the station?'},{role:'user',text:'Thank you, I understand.'}]};
 const value={summary:'Clear requests.',strengths:['Polite questions'],corrections:[],goals:[{achieved:true,evidence:'Where is the station?'},{achieved:false,evidence:''},{achieved:false,evidence:''}],nextStep:'Ask a follow-up.'};
 const result=await reviewSpeaking(session,{request:(system,context)=>requestConversation(system,context,{env:{OPENAI_API_KEY:'synthetic-review',GEMINI_API_KEY:'synthetic-disabled'},fetchImpl:async url=>{assert.ok(url.includes('openai'));return response(value)}})});
 assert.equal(result.summary,value.summary);assert.equal(result.pronunciation.assessable,false);
});
test('provider failures produce retryable errors and never invent a completed review',async()=>{
 await assert.rejects(requestConversation('system','context',{env:{OPENAI_API_KEY:'synthetic-unavailable'},fetchImpl:async()=>new Response('{}',{status:503})}),e=>e.status===503&&e.code==='CONVERSATION_PROVIDER_BUSY');
});
test('broken optional pronunciation does not discard an otherwise valid voice reply',async()=>{
 const result=await voiceTurnSpeaking({language:'en',level:'B1',scenario:'directions',display_language:'en',messages:[]},{},{env:{OPENAI_API_KEY:'synthetic-voice'},convert:async()=>Buffer.alloc(44).toString('base64'),fetchImpl:async()=>Response.json({choices:[{message:{content:JSON.stringify({audible:true,transcript:'Where is the station?',reply:'Turn left.',pronunciation:{ratings:[]}})}}]})});
 assert.equal(result.reply,'Turn left.');assert.equal(result.speechEvidence,undefined);
});
test('missing communication ratings are repaired from verified words and included with pronunciation',async()=>{
 const session={language:'en',display_language:'en',level:'B2',scenario:'directions',messages:[{role:'user',text:'Where is the station?'},{role:'user',text:'Thank you, I understand.'}]};
 const base={summary:'Clear requests.',strengths:['Polite questions'],corrections:[],goals:[{achieved:true,evidence:'Where is the station?'},{achieved:false,evidence:''},{achieved:false,evidence:''}],nextStep:'Ask a follow-up.'};let calls=0;session.messages.forEach(m=>Object.assign(m,{mode:'voice',speechEvidence:{version:'skill-evidence-v3',seconds:10,pronunciation:{assessable:true,ratings:[3,3,3,3],evidence:['a','b','c','d']}}}));
 const r=await reviewSpeaking(session,{request:async()=>({value:++calls===1?base:{ratings:[3,3,3,3],scoreEvidence:['Where is the station?','Thank you, I understand.','the station','I understand.']}})});
 assert.equal(calls,2);assert.equal(r.communicationScore,75);assert.equal(r.score,75);assert.equal(r.pronunciation.assessable,true);
 const bad=await reviewSpeaking(session,{request:async()=>({value:++calls===3?base:{ratings:[4,4,4,4],scoreEvidence:['invented','invented','invented','invented']}})});assert.equal(bad.communicationScore,null);
});
test('review provider fallback shares one deadline instead of restarting a full timeout for every provider',async()=>{
 let time=0,calls=0;await assert.rejects(requestConversation('Review deadline QA','Synthetic',{env:{OPENAI_API_KEY:'synthetic-review-deadline',GEMINI_API_KEY:'synthetic-review-deadline'},deadline:8000,now:()=>time,fetchImpl:async()=>{calls++;time=9000;return new Response('{}',{status:503});}}),e=>e.status===503);assert.equal(calls,1);
});
