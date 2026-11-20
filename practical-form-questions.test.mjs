import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,getLessonVariant,gradeLesson,isCurrentLessonDraft,isCorrect} from './course.mjs';
import {hasExpandedExercises} from './exercise-variants.mjs';
import {practicalFormQuestions} from './practical-form-questions.mjs';
import {allowedSpeech} from './speech-api.mjs';
const seed='v4-practical-audit-123456789';
test('all current expanded exercises use concrete answers rather than typed notation',()=>{
 for(const l of lessonList.filter(l=>hasExpandedExercises(l.id))){
  const current=getLessonVariant(l.id,seed);
  for(const q of current.questions){
   if(q.type==='text')assert.doesNotMatch(q.answer,/\+|〜|～|→| \/ |gerund|infinitive|participle/i,`${l.id}: ${q.coverage}`);
   else assert.doesNotMatch(q.options[q.answer],/\+.*(?:verb|subject|ing)/i,`${l.id}: ${q.coverage}`);
  }
 }
});
test('each authored replacement is reachable, saves and grades, including accepted alternatives',()=>{
 for(const [id,changes] of Object.entries(practicalFormQuestions)){
  const l=getLessonVariant(id,seed);
  for(const [coverage,replacement] of Object.entries(changes)){
   const found=l.questions.filter(q=>q.coverage===coverage);
   assert.equal(found.length,Array.isArray(replacement)?replacement.length:1,id+coverage);
   for(const q of found){
    for(const answer of q.accepted||[])assert.ok(isCorrect(q,answer));
    if(q.audio)assert.ok(allowedSpeech(q.audio,q.audioLocale));
   }
  }
  const answers=l.questions.map(q=>q.answer);
  for(let i=0;i<answers.length;i++)assert.ok(isCurrentLessonDraft(id,answers.slice(0,i),seed));
  assert.equal(gradeLesson(id,answers,seed).score,100);
  assert.deepEqual(getLessonVariant(id,seed),l);
 }
});
test('historical attempts retain their version while new Portuguese practice uses an actual sentence',()=>{
 const id='pt-a2-v2-lesson-12';
 assert.ok(getLessonVariant(id,'v2-history-123456789').questions.some(q=>q.answer==='acabar + gerund'));
 const q=getLessonVariant(id,seed).questions.find(q=>q.coverage==='entry:3:context');
 assert.equal(q.answer,'acabamos pedindo');
 assert.ok(isCorrect(q,'Acabamos pedindo'));
 assert.ok(!isCorrect(q,'acabar + gerund'));
});
