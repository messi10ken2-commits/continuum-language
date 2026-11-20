import assert from 'node:assert/strict';
import {test} from 'node:test';
import {replySpeaking,voiceTurnSpeaking} from './speaking-ai.mjs';
import {scenarioById} from './speaking-content.mjs';
const scenario='ja-immersive-tourism-v1',session={language:'ja',level:'B2',scenario,messages:[{role:'assistant',text:'どんな案がよいと思いますか。'},{role:'user',text:'住民の休息と観光客の聞きやすさを両方考えたいです。'}]};
function checkSource(context){const evidence=context.fictionalSourceEvidence;assert.equal(evidence.article.length,6);assert.equal(evidence.interviewUpdate.length,6);assert.deepEqual([...evidence.article,...evidence.interviewUpdate],scenarioById(scenario).evidence);assert.match(context.sourceInstruction,/interview updates/)}
test('text roleplay distinguishes authored article facts from interview updates without changing target-language replies',async()=>{
 const reply=await replySpeaking(session,'受信機を試してから決めませんか。',{request:async(system,context)=>{assert.match(system,/Japanese/);assert.match(system,/untrusted learner speech/);checkSource(JSON.parse(context));return {value:{reply:'試用する人は、どのように選びましょうか。'}}}});
 assert.equal(reply,'試用する人は、どのように選びましょうか。');
});
test('voice roleplay sends the same labeled source context in one mocked multimodal request',async()=>{
 let calls=0;
 const reply=await voiceTurnSpeaking(session,{}, {env:{GEMINI_API_KEY:'synthetic-immersion-unit-test'},convert:async()=>Buffer.alloc(48).toString('base64'),fetchImpl:async(_url,options)=>{
  calls++;const data=JSON.parse(options.body);checkSource(JSON.parse(data.contents[0].parts[0].text));assert.match(data.systemInstruction.parts[0].text,/distinguish the article/);
  return Response.json({candidates:[{content:{parts:[{text:JSON.stringify({audible:true,transcript:'受信機を試しましょう。',reply:'どんな人に試してもらいますか。'})}]}}]});
 }});
 assert.equal(calls,1);assert.equal(reply.transcript,'受信機を試しましょう。');assert.equal(reply.reply,'どんな人に試してもらいますか。');
});
