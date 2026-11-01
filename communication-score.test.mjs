import test from 'node:test';
import assert from 'node:assert/strict';
import {validateCommunication,communicationFields,hasVerifiedCommunication,assessCommunication} from './communication-score.mjs';
import {reviewSpeaking,reassessCommunicationSpeaking} from './speaking-ai.mjs';
import {safeSavedCorrections} from './correction-integrity.mjs';
const session={language:'en',level:'B1',scenario:'cafe',display_language:'en',messages:[{role:'assistant',text:'Welcome. What would you like?'},{role:'user',text:'Could I have a coffee, please?'},{role:'assistant',text:'Anything else?'},{role:'user',text:'Yes, a sandwich too. How much is that?'}]};
const score={ratings:[3,4,2,3],scoreTurnIds:['L1','L2','L2','L1']};
const feedback={summary:'Clear requests.',strengths:['Polite questions.'],corrections:[],goals:[{achieved:true,evidence:session.messages[1].text},{achieved:false,evidence:''},{achieved:false,evidence:''}],nextStep:'Ask about alternatives.'};
test('turn IDs ground every criterion in the exact saved learner words, never an assistant reply',()=>{
 const a=validateCommunication(score,session);assert.equal(a.status,'scored');assert.equal(a.score,75);assert.equal(a.evidence[0],session.messages[1].text);assert.equal(a.evidence[1],session.messages[3].text);
 for(const invalid of ['assistant-0','L0','L3','invented'])assert.equal(validateCommunication({...score,scoreTurnIds:[invalid,'L2','L2','L1']},session).score,null);
 assert.equal(validateCommunication({...score,ratings:[3,4,2,99]},session).score,null);
 assert.equal(validateCommunication({ratings:[3,4,2,3],scoreEvidence:['invented','invented','invented','invented']},session).score,null);
 assert.equal(validateCommunication({...score,communicationAssessable:false},session).status,'insufficient');
});
test('rejecting a proposed correction or goal claim does not erase the separately grounded communication score',async()=>{
 let calls=0;
 const r=await reviewSpeaking(session,{request:async(system)=>{calls++;if(system.startsWith('Review this'))return {value:{...feedback,...score,corrections:[{original:session.messages[1].text,improved:'Give me a coffee.',explanation:'Use this.'}],goals:feedback.goals.map(g=>({...g,achieved:true,evidence:'invented'}))}};return {value:{checks:[]}};}});
 assert.equal(calls,2);assert.equal(r.communicationScore,75);assert.equal(r.partial,true);assert.deepEqual(r.corrections,[]);assert.equal(hasVerifiedCommunication(r),true);assert.equal(safeSavedCorrections(r,'en').communicationScore,75);
 const raw={...r,corrections:[{original:'invented',improved:'invented',explanation:'invented'}]};assert.equal(safeSavedCorrections(raw,'en').communicationScore,75);assert.deepEqual(safeSavedCorrections(raw,'en').corrections,[]);
 assert.equal(safeSavedCorrections({...raw,communicationIntegrity:null},'en').communicationScore,null,'Legacy/unmarked scores are not promoted to independently verified scores');
});
test('communication-only reassessment makes one focused call and preserves existing review content',async()=>{
 let calls=0;const existing={...feedback,communicationScore:null,partial:true,corrections:[]};
 const r=await reassessCommunicationSpeaking({...session,review:existing},{request:async(system,context,options)=>{calls++;assert.ok(system.startsWith('Assess practical communication'));assert.ok(!system.startsWith('Review this'));const data=JSON.parse(context);assert.equal(data.learnerTurns[0].text,session.messages[1].text);assert.ok(options.deadline>Date.now());return {value:score};}});
 assert.equal(calls,1);assert.equal(r.communicationScore,75);assert.equal(r.summary,existing.summary);assert.deepEqual(r.goals,existing.goals);assert.equal(r.score,null,'No combined audio score without recorded pronunciation evidence');
});
test('too little learner evidence avoids provider calls and an unavailable provider never fabricates a score',async()=>{
 const short={...session,messages:session.messages.slice(0,2)};
 const empty=await assessCommunication(short,{request:()=>assert.fail('No assessment request for insufficient learner evidence')});assert.equal(empty.status,'insufficient');assert.equal(empty.score,null);
 const failed=await assessCommunication(session,{request:async()=>{throw Error('provider unavailable')}});assert.equal(failed.status,'unavailable');assert.equal(failed.score,null);assert.deepEqual(failed.ratings,[]);
});
test('correction auditing and score repair run concurrently under one review deadline',async()=>{
 let auditing=false,release;
 const r=await reviewSpeaking(session,{request:async(system,context,options)=>{
  assert.ok(options.deadline>Date.now());
  if(system.startsWith('Review this'))return {value:{...feedback,corrections:[{original:session.messages[1].text,improved:'Give me coffee.',explanation:'Changed.'}]}};
  if(system.startsWith('Independently audit')){auditing=true;await new Promise(r=>release=r);return {value:{checks:[]}};}
  assert.ok(auditing);release();return {value:score};
 }});
 assert.equal(r.communicationScore,75);assert.equal(r.corrections.length,0);assert.equal(r.partial,true);
});
test('provider delays cannot create a score without four real ratings and saved learner evidence',()=>{
 const r=communicationFields(validateCommunication(null,session),session);assert.equal(r.communicationScore,null);assert.equal(hasVerifiedCommunication(r),false);
});
