import test from 'node:test';
import assert from 'node:assert/strict';
import {requestPatternBatch} from './pattern-provider.mjs';
const ok=value=>({ok:true,status:200,json:async()=>value});
const gemini=()=>ok({candidates:[{content:{parts:[{text:'{"items":[]}'}]}}]});
const old={...process.env};
test('missing Gemini model discovers supported text model and caches the selection without changing vendor',async()=>{
 process.env.GEMINI_API_KEY='synthetic-model-discovery';process.env.OPENAI_API_KEY='synthetic-other-vendor';process.env.GEMINI_ASSESSMENT_MODEL='retired-flash';const urls=[];
 const fetchImpl=async url=>{urls.push(url);assert.ok(!url.includes('openai.com'));if(url.includes('retired-flash'))return {ok:false,status:404,json:async()=>({error:{code:404}})};if(url.includes('?pageSize'))return ok({models:[{name:'models/gemini-3-flash-image',supportedGenerationMethods:['generateContent']},{name:'models/gemini-3-flash',supportedGenerationMethods:['generateContent']},{name:'models/embedding-model',supportedGenerationMethods:['embedContent']}]});return gemini();};
 const result=await requestPatternBatch('system','synthetic',{fetchImpl});assert.equal(result.model,'gemini-3-flash');assert.equal(result.provider,'Gemini');assert.equal(urls.length,3);
 await requestPatternBatch('system','synthetic',{fetchImpl});assert.equal(urls.length,4);assert.ok(urls.at(-1).includes('gemini-3-flash:generateContent'));
});
test('transient provider overload retries before changing models',async()=>{
 process.env.GEMINI_API_KEY='synthetic-overload';process.env.GEMINI_ASSESSMENT_MODEL='gemini-overload-flash';let calls=0;
 const result=await requestPatternBatch('system','synthetic',{fetchImpl:async url=>{assert.ok(url.includes(':generateContent'));return ++calls===1?{ok:false,status:503,json:async()=>({error:{code:503}})}:gemini();}});
 assert.equal(calls,2);assert.equal(result.provider,'Gemini');assert.equal(result.model,'gemini-overload-flash');
});
test('persistent overload can recover through another available Gemini text model',async()=>{
 process.env.GEMINI_API_KEY='synthetic-switch-overload';process.env.GEMINI_ASSESSMENT_MODEL='gemini-busy-flash';let calls=0;
 const result=await requestPatternBatch('system','synthetic',{fetchImpl:async url=>{calls++;if(url.includes('gemini-busy-flash'))return {ok:false,status:503,json:async()=>({error:{code:503}})};if(url.includes('?pageSize'))return ok({models:[{name:'models/gemini-3-flash',supportedGenerationMethods:['generateContent']}]});return gemini();}});
 assert.equal(calls,4);assert.equal(result.model,'gemini-3-flash');assert.equal(result.provider,'Gemini');
});
test('quota, network, authentication and malformed output return safe actionable failures',async()=>{
 process.env.GEMINI_API_KEY='synthetic-failures';delete process.env.GEMINI_ASSESSMENT_MODEL;
 for(const status of [401,403,429,500])await assert.rejects(requestPatternBatch('system','private learner evidence',{fetchImpl:async()=>({ok:false,status,json:async()=>({error:{code:status}})})}),e=>e.status===503&&/saved results are unchanged/.test(e.message));
 await assert.rejects(requestPatternBatch('system','private',{fetchImpl:async()=>{throw Error('private secret text')}}),e=>e.status===503&&!e.message.includes('secret'));
 await assert.rejects(requestPatternBatch('system','private',{fetchImpl:async()=>ok({candidates:[]})}),e=>/incomplete/.test(e.message));
});
test('OpenAI-only configuration remains supported and does not store learner evidence',async()=>{
 delete process.env.GEMINI_API_KEY;process.env.OPENAI_API_KEY='synthetic-openai';const result=await requestPatternBatch('system','context',{fetchImpl:async(url,init)=>{assert.equal(url,'https://api.openai.com/v1/responses');assert.equal(JSON.parse(init.body).store,false);return ok({output:[{content:[{type:'output_text',text:'{"items":[]}'}]}]});}});assert.equal(result.provider,'OpenAI');
});
test.after(()=>{for(const key of ['GEMINI_API_KEY','GEMINI_ASSESSMENT_MODEL','OPENAI_API_KEY'])if(old[key]===undefined)delete process.env[key];else process.env[key]=old[key];});
