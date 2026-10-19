import test from 'node:test';
import assert from 'node:assert/strict';
import {replySpeaking,reviewSpeaking,validateSpeakingReview,transcribeSpeaking} from './speaking-ai.mjs';
import {speakingScenarios} from './speaking-content.mjs';
import {speakingCopy} from './speaking-copy.mjs';
const s={language:'pt',level:'B1',scenario:'cafe',display_language:'fr',messages:[{role:'assistant',text:'Olá!'},{role:'user',text:'Eu quero um café e pão.'},{role:'assistant',text:'Mais alguma coisa?'},{role:'user',text:'A conta, por favor.'}]};
const review={summary:'Vous avez commandé.',strengths:['Demande polie.'],corrections:[{original:'Eu quero um café',improved:'Eu gostaria de um café',explanation:'Une demande plus polie.'}],goals:[{achieved:true,evidence:'Eu quero um café e pão.'},{achieved:false,evidence:''},{achieved:true,evidence:'A conta, por favor.'}],nextStep:'Demandez une alternative.'};
test('feedback quotes actual learner evidence and refuses fabricated corrections or goal claims',()=>{
 assert.equal(validateSpeakingReview(review,s).goals[0].goal,speakingScenarios[0].goals[0]);
 assert.throws(()=>validateSpeakingReview({...review,corrections:[{...review.corrections[0],original:'Eu querer uma café'}]},s));
 assert.throws(()=>validateSpeakingReview({...review,goals:review.goals.map(g=>({...g,achieved:true,evidence:'fabricated'}))},s));
 assert.throws(()=>validateSpeakingReview({...review,goals:[]},s));
 assert.equal(validateSpeakingReview({...review,corrections:[]},s).corrections.length,0);
});
test('reply and review keep target-language examples separate from display-language coaching',async()=>{
 const requests=[];const request=async(system,context)=>{requests.push({system,context:JSON.parse(context)});return {value:system.startsWith('Review')?review:{reply:'Quer mais alguma coisa?'}}};
 assert.equal(await replySpeaking(s,'A conta, por favor.',{request}),'Quer mais alguma coisa?');
 const r=await reviewSpeaking(s,{request});assert.equal(r.corrections[0].improved,'Eu gostaria de um café');
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
