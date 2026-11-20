import test from 'node:test';
import assert from 'node:assert/strict';
import {buildLessonSuggestion,suggestionDraft} from './lesson-suggestions.mjs';
const now=Date.parse('2026-09-27T08:00:00Z');
const note={focus:'Conjunction',note:'Correct usage of expressions like Si bien es cierto, aunque etc',at:'2026-09-26T06:00:00Z'};
const attempt=(lesson,score,extra={})=>({lesson,score,total:4,at:'2026-09-26T07:00:00Z',...extra});
const build=x=>buildLessonSuggestion({now,...x});
test('Screenshot note gives a concrete concession task, not typed Po or unrelated checkpoint score',()=>{
 const p=build({notes:[note],attempts:[attempt('b1-choice-checkpoint',100)]});
 assert.equal(p.lessonId,'speaker-stance');assert.equal(p.mode,'check');
 assert.ok(p.steps.some(s=>s.text.includes('Si bien es cierto que')));
 assert.match(p.progress,/No shared result/);assert.doesNotMatch(p.progress,/100%/);
});
test('Relevant results change scaffolding, never infer CEFR mastery',()=>{
 for(const [score,mode] of [[40,'rebuild'],[67,'guided'],[100,'transfer']]){
  const p=build({notes:[note],attempts:[attempt('speaker-stance',score)]});
  assert.equal(p.mode,mode);assert.match(p.progress,new RegExp(score+'%'));
 }
});
test('Hidden progress is ignored even if stale client data remains',()=>{
 const p=build({notes:[note],sharing:{selfLearning:false},attempts:[attempt('speaker-stance',10)]});
 assert.equal(p.mode,'check');assert.match(p.progress,/private/);assert.doesNotMatch(JSON.stringify(p),/10%/);
 assert.equal(build({sharing:{selfLearning:false},attempts:[attempt('porpara',10)]}).lessonId,null);
});
test('Sorts saved notes and lesson attempts; reports relevant trend only',()=>{
 const p=build({notes:[{focus:'Airport',note:'Gate changes',at:'2026-09-20'},note],attempts:[attempt('speaker-stance',40,{at:'2026-09-21'}),attempt('airport',100),attempt('speaker-stance',75)]});
 assert.equal(p.lessonId,'speaker-stance');assert.equal(p.mode,'guided');assert.match(p.progress,/40% → latest: 75%/);
});
test('Imported, old and undated results do not drive difficulty',()=>{
 for(const extra of [{source:'imported'},{at:'2026-01-01'},{at:null}]){
  assert.equal(build({notes:[note],attempts:[attempt('speaker-stance',100,extra)]}).mode,'check');
 }
});
test('No note: targets lowest latest result, not worst historical or checkpoint',()=>{
 const p=build({attempts:[attempt('porpara',20,{at:'2026-09-20'}),attempt('porpara',100),attempt('airport',65),attempt('b1-choice-checkpoint',0)]});
 assert.equal(p.lessonId,'airport');assert.equal(p.source,'progress');
});
test('Unknown note uses an honest diagnostic and retains actual evidence',()=>{
 const p=build({notes:[{focus:'Turn-taking',note:'Interrupts before a partner finishes.',at:'2026-09-27'}],attempts:[attempt('airport',20)]});
 assert.equal(p.lessonId,null);assert.match(p.reason,/does not confidently match/);assert.match(p.saved.note,/Interrupts/);
});
test('Boundary matching prevents partial input from selecting porpara',()=>{
 assert.equal(build({notes:[{focus:'Po',note:'Something to follow up'}]}).lessonId,null);
});
test('No data never invents a score or topic',()=>{
 const p=build({});assert.equal(p.lessonId,null);assert.equal(p.mode,'check');assert.match(p.reason,/Save a specific/);
});
test('Draft explicitly describes a proposed plan, not an observation; fits note size limit',()=>{
 const p=build({notes:[note],attempts:[attempt('speaker-stance',80)]});
 const draft=suggestionDraft(p);assert.match(draft,/proposed, not a completed observation/);assert.ok(draft.length<3000);
});
