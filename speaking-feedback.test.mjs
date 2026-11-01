import test from 'node:test';
import assert from 'node:assert/strict';
import {verifySpeakingFeedback,refreshSpeakingFeedback,speakingFeedbackVersion} from './speaking-feedback.mjs';
import {safeSavedCorrections} from './correction-integrity.mjs';
import {speakingGoal} from './speaking-goal.mjs';
import {reviewSpeaking} from './speaking-ai.mjs';
const messages=[{role:'user',text:'Sí, me gustaría pagar con tarjeta.'},{role:'assistant',text:'Claro.'},{role:'user',text:'¿Tienes algo como paella?'}];
const session={language:'es',level:'B1',scenario:'cafe',display_language:'en',messages,review:{communicationScore:75,score:75,pronunciation:{score:75,assessable:true},summary:'Saved.',partial:true,strengths:[],corrections:[],goals:[{achieved:true},{achieved:true},{achieved:true}],nextStep:'Review your saved transcript with the lesson material or a teacher.'}};
const c={original:messages[1+1].text,improved:'¿Tenéis algún plato parecido a la paella?',explanation:'An optional way to ask about a similar dish.'};
const check={index:0,originalAcceptable:true,replacementCorrect:true,meaningPreserved:true,confidence:'high',kind:'style',replacementNatural:true};
test('natural alternatives require an independent naturalness and meaning check and never label valid language as an error',async()=>{
 const r=await verifySpeakingFeedback([c],{session,request:async()=>({value:{checks:[check]}})});assert.equal(r.corrections.length,0);assert.equal(r.naturalAlternatives[0].kind,'alternative');assert.equal(r.status,'ready');
 for(const change of [{replacementNatural:false},{meaningPreserved:false},{confidence:'low'},{kind:'error'}]){
 const bad=await verifySpeakingFeedback([c],{session,request:async()=>({value:{checks:[{...check,...change}]}})});assert.equal(bad.naturalAlternatives.length+bad.corrections.length,0);
 }
 const saved=safeSavedCorrections({...session.review,naturalAlternatives:[...r.naturalAlternatives,{...c,kind:'alternative'}]},'es');assert.equal(saved.naturalAlternatives.length,1);
});
test('saved-review feedback refresh uses learner IDs, preserves scores/audio and produces a scenario goal even after all goals are achieved',async()=>{
 let calls=0;const r=await refreshSpeakingFeedback(session,{request:async(system,context,options)=>{calls++;assert.ok(options.deadline>Date.now());if(calls===1)return {value:{suggestions:[{turnId:'L2',improved:c.improved,explanation:c.explanation}]}};return {value:{checks:[check]}};}});
 assert.equal(calls,2);assert.equal(r.feedbackIntegrity,speakingFeedbackVersion);assert.equal(r.feedbackStatus,'ready');assert.equal(r.naturalAlternatives[0].original,messages[2].text);assert.equal(r.communicationScore,75);assert.deepEqual(r.pronunciation,session.review.pronunciation);assert.equal(r.nextSpeakingGoal.stretch,true);assert.ok(r.nextSpeakingGoal.goal.includes('Order'));assert.ok(!r.nextStep.includes('teacher'));
 const incomplete={...session,review:{...session.review,goals:[{achieved:true},{achieved:false},{achieved:true}]}};assert.match(speakingGoal(incomplete).goal,/ingredient|alternative/);assert.equal(speakingGoal(incomplete).stretch,false);
});
test('fabricated turn references and unavailable audits preserve existing review without inventing suggestions',async()=>{
 for(const mode of ['fabricated','audit-failed']){let calls=0;const r=await refreshSpeakingFeedback(session,{request:async()=>{calls++;if(calls===1)return {value:{suggestions:[{turnId:mode==='fabricated'?'A1':'L2',improved:c.improved,explanation:c.explanation}]}};throw Error('timeout');}});assert.equal(r.feedbackStatus,'unavailable');assert.equal(r.communicationScore,75);assert.deepEqual(r.corrections,[]);assert.ok(r.nextSpeakingGoal.goal);}
});
test('full review keeps a verified optional alternative and an actionable goal independently from rejected suggestions',async()=>{
 const r=await reviewSpeaking(session,{request:async system=>system.startsWith('Review this')?{value:{summary:'Clear requests.',strengths:[],corrections:[{...c,kind:'alternative'}],goals:[{achieved:true,evidence:messages[0].text},{achieved:true,evidence:messages[2].text},{achieved:false,evidence:''}],nextStep:'Ask for the bill.',ratings:[3,3,3,3],scoreTurnIds:['L1','L2','L1','L2']}}:{value:{checks:[check]}}});
 assert.equal(r.naturalAlternatives.length,1);assert.equal(r.corrections.length,0);assert.equal(r.feedbackStatus,'ready');assert.match(r.nextSpeakingGoal.goal,/bill/);assert.equal(r.communicationScore,75);
});
