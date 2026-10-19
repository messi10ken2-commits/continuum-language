import test from 'node:test';import assert from 'node:assert/strict';
import {assessSkill} from './ai-assessment.mjs';
import {productionSkillEvidence,conversationPronunciation,skillEvidenceVersion} from './skill-evidence.mjs';
import {voiceTurnSpeaking,validateSpeakingReview} from './speaking-ai.mjs';
import {lessonList,getLessonVariant} from './course.mjs';
const sample='I had planned to visit my family before starting the new job, but the train was cancelled. I called them and arranged another visit for the following weekend.';
const cefr={level:'B1',confidence:'medium',limitations:'One short narrative cannot establish performance across all situations.',evidence:[{quote:'I had planned to visit my family',reason:'Sequences past events.'},{quote:'the train was cancelled',reason:'Explains a practical problem.'}]};
const pronunciation={assessable:true,ratings:[1,1,1,1],evidence:['Several sounds need repetition.','Word timing is uneven.','Phrasing needs clearer boundaries.','Listener effort is frequent.'],feedback:'Practise short phrase groups.'};
const value={assessable:true,ratings:[4,4,4,4],evidence:['Task addressed.','Connected narrative.','Appropriate verbs.','Suitable tone.'],feedback:'Useful account.',nextStep:'Develop the reason.',strengths:['Clear sequence.'],corrections:[],transcript:sample,cefr,pronunciation};
function wav(seconds){const b=Buffer.alloc(44+32000*seconds);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(16000,24);b.writeUInt32LE(32000,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(b.length-44,40);return b.toString('base64');}
const respond=v=>async(url,options)=>({ok:true,json:async()=>url.includes('/responses')?{output_text:JSON.stringify(v)}:{choices:[{message:{content:JSON.stringify(v)}}]}});
test('independent skill estimate is neither the C1 task nor a percentage conversion',async()=>{process.env.OPENAI_API_KEY='test';try{
 const result=await assessSkill({skill:'Writing',level:'C1',language:'en',prompt:'Explain a journey.'},sample,{fetchImpl:respond({...value,ratings:[2,2,2,2],pronunciation:{...pronunciation,assessable:false}})});
 assert.equal(result.score,50);assert.equal(result.cefr.level,'B1');assert.equal(result.pronunciation,null);assert.equal(result.evaluationVersion,skillEvidenceVersion);
 const missing=await assessSkill({skill:'Writing',level:'C1',language:'en',prompt:'Explain a journey.'},sample,{fetchImpl:respond({...value,cefr:{...cefr,level:'C1',evidence:[{quote:'invented high-level language',reason:'Not actually written.'}]}})});assert.equal(missing.cefr.level,null);
 assert.equal(productionSkillEvidence({score:50,status:'ai-reviewed',method:'openai-writing-rubric-v2'},{level:'C1'}).level,null);
}finally{delete process.env.OPENAI_API_KEY;}});
test('speaking sends real audio, combines 80/20, and bases CEFR on verified evidence',async()=>{process.env.OPENAI_API_KEY='test';try{
 const result=await assessSkill({skill:'Speaking',level:'C1',language:'en',prompt:'Explain a journey.'},{audio:'saved recording',seconds:999},{convert:async()=>wav(20),fetchImpl:async(url,options)=>{const body=JSON.parse(options.body);assert.ok(body.messages[1].content.some(c=>c.type==='input_audio'));assert.ok(body.messages[0].content.includes('Never copy the task difficulty'));return respond(value)(url,options)}});
 assert.equal(result.audioSeconds,20);assert.equal(result.communicationScore,100);assert.equal(result.pronunciation.score,25);assert.equal(result.score,85);assert.equal(result.cefr.level,'B1');
 const short=await assessSkill({skill:'Speaking',level:'C1',language:'en',prompt:'Explain.'},{audio:'clip'},{convert:async()=>wav(3),fetchImpl:respond(value)});assert.equal(short.cefr.level,null);
}finally{delete process.env.OPENAI_API_KEY;}});
test('conversation pronunciation is audio-only; old and typed turns cannot fabricate it',async()=>{
 const session={language:'en',display_language:'en',scenario:'cafe',level:'B1',messages:[{role:'assistant',text:'What would you like?'}]};
 const turn=await voiceTurnSpeaking(session,{audio:'clip'},{env:{OPENAI_API_KEY:'test'},convert:async()=>wav(10),fetchImpl:respond({audible:true,transcript:sample,reply:'Would you like anything else?',pronunciation})});assert.equal(turn.speechEvidence.seconds,10);assert.equal(turn.speechEvidence.pronunciation.score,25);assert.ok(!('audio' in turn.speechEvidence));
 const messages=[{role:'user',text:sample,mode:'voice',speechEvidence:turn.speechEvidence},{role:'user',text:'A sandwich, please.',mode:'voice',speechEvidence:turn.speechEvidence},{role:'user',mode:'text',speechEvidence:turn.speechEvidence}];
 assert.equal(conversationPronunciation(messages).clips,2);assert.equal(conversationPronunciation(messages).score,25);assert.equal(conversationPronunciation([{role:'user',mode:'text',text:sample}]).score,null);assert.equal(conversationPronunciation([{role:'user',mode:'voice',text:sample}]).score,null);
 const review={summary:'Useful order.',strengths:[],corrections:[],goals:[{achieved:false,evidence:''},{achieved:false,evidence:''},{achieved:false,evidence:''}],nextStep:'Ask a follow-up.',ratings:[4,4,4,4],scoreEvidence:[sample,sample,sample,sample]};const scored=validateSpeakingReview(review,{...session,messages});assert.equal(scored.score,85);assert.equal(scored.communicationScore,100);
});
test('all expression watch-outs are entry-specific; feedback no longer repeats an unrelated shared warning',()=>{
 let count=0;for(const l of lessonList.filter(l=>l.expressions)){count+=l.expressions.length;assert.equal(new Set(l.expressions.map(x=>x.pitfall)).size,l.expressions.length,l.id);for(const e of l.expressions)assert.ok(e.pitfall);}
 assert.equal(count,380);
 const l=lessonList.find(l=>l.id==='en-b2-v2-lesson-9');const keep=l.expressions.find(x=>x.term==='keep up with'),spread=l.expressions.find(x=>x.term==='spread too thin');assert.match(keep.pitfall,/with before/);assert.match(spread.pitfall,/resources are divided/);assert.ok(!spread.pitfall.includes('under control'));
 for(const v of [3,6,7])for(const q of getLessonVariant(l.id,`v${v}-watchout-regression-123456789`).questions.filter(q=>q.coverage?.startsWith('entry:2:')))assert.ok(!q.note.includes('Under pressure describes demands; under control'));
});
