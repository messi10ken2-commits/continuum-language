import test from 'node:test';
import assert from 'node:assert/strict';
import {classPractice,matchClassLesson} from './class-practice.mjs';
import {buildLessonSuggestion} from './lesson-suggestions.mjs';
const note=(language,focus,body='')=>({language,focus,note:body});
test('screenshot assignment opens the indicative past perfect, shared by learner and teacher suggestions',()=>{
 for(const [language,id] of [['es','pluperfect-lab'],['en','en-b1-v2-lesson-6'],['pt','pt-b1-v2-lesson-6']]){
  const n=note(language,'Practice plan: Past perfect tense.','10 min · Practise the past perfect past tense form to be able to produce it naturally');
  assert.equal(classPractice([n],language).lesson.id,id);
  assert.equal(buildLessonSuggestion({notes:[n],language}).lessonId,id);
 }
});
test('body text and multilingual names identify the teaching target',()=>{
 for(const [language,text,id] of [['es','pluscuamperfecto','pluperfect-lab'],['pt','mais-que-perfeito','pt-b1-v2-lesson-6'],['en','過去完了','en-b1-v2-lesson-6'],['ja','て形','ja-a2-v2-lesson-5']])assert.equal(matchClassLesson(note(language,'Practice plan',text),language).id,id);
});
test('specific tenses take precedence over broad substrings',()=>{
 assert.equal(matchClassLesson(note('es','Past perfect subjunctive'),'es').id,'past-perfect-subjunctive-lab');
 assert.equal(matchClassLesson(note('en','Present perfect continuous'),'en').id,'en-b2-v2-lesson-5');
 assert.equal(matchClassLesson(note('es','Imperfect subjunctive'),'es').id,'imperfect-subjunctive-lab');
});
test('unsupported concepts, unknown notes and other languages do not fall back to unrelated lessons',()=>{
 assert.equal(matchClassLesson(note('ja','Past perfect'),'ja'),null);
 assert.equal(matchClassLesson(note('es','quantum teleportation'),'es'),null);
 assert.equal(matchClassLesson(note('es','Past perfect'),'en'),null);
 assert.equal(classPractice([], 'es').lesson,null);
});
test('latest note in the selected language wins, regardless of input order',()=>{
 const old={...note('es','Subjunctive'),at:'2026-10-01'},latest={...note('es','Past perfect'),at:'2026-10-11'},other={...note('en','Past simple'),at:'2026-10-12'};
 assert.equal(classPractice([old,other,latest],'es').lesson.id,'pluperfect-lab');
 assert.equal(classPractice([old,{...latest,focus:'Unknown topic'}],'es').lesson,null);
});
test('exact lesson titles and existing concession mapping remain available',()=>{
 assert.equal(matchClassLesson(note('en','Order at a café'),'en').title,'Order at a café');
 assert.equal(matchClassLesson(note('es','Conjunction','Correct usage of Si bien es cierto, aunque'),'es').id,'speaker-stance');
});

test('a teacher-selected lesson overrides text matching but cannot cross the shared language',()=>{
 const note={language:'en',focus:'Past perfect',note:'Use earlier past events.',lessonId:'en-a2-v2-lesson-1'};
 assert.equal(classPractice([note],'en').lesson.id,'en-a2-v2-lesson-1');
 assert.equal(classPractice([{...note,lessonId:'pt-a2-v2-lesson-1'}],'en').lesson,null);
});
