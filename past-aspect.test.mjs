import test from 'node:test';
import assert from 'node:assert/strict';
import {pastAspectLessons} from './past-aspect-lessons.mjs';
import {getLesson,getLessonVariant,isCorrect,gradeLesson,chapters} from './course.mjs';
test('both comparison lessons are reachable, complete and accept overlapping forms',()=>{
 for(const l of pastAspectLessons){
  assert.ok(getLesson(l.id));assert.ok(chapters.some(c=>c.id===l.chapter));assert.equal(l.questions.length,14);
  const q=l.questions.find(q=>q.accepted?.length===2);assert.ok(q);
  for(const answer of q.accepted)assert.ok(isCorrect(q,answer));
  assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer),l.exerciseVersion).score,100);
  assert.equal(getLessonVariant(l.id,l.exerciseVersion).questions,l.questions);
 }
 assert.match(getLesson('pt-a2-v2-lesson-6').explanation,/both describe ongoing/);
});

test('comparison precedes each checkpoint and revised checks assess all three lessons',async()=>{
 const {lessonList,isCurrentLessonDraft}=await import('./course.mjs');
 for(const comparison of pastAspectLessons){
  const units=lessonList.filter(l=>l.chapter===comparison.chapter);
  assert.equal(units[2].id,comparison.id);
  const checkpoint=units[3];assert.ok(checkpoint.checkpoint);
  const revised=getLessonVariant(checkpoint.id,checkpoint.exerciseVersion);
  const additions=revised.questions.filter(q=>q.sourceLesson===comparison.id);
  assert.equal(additions.length,4);
  assert.ok(revised.questions.length>additions.length);
  const overlap=additions.find(q=>q.accepted?.length===2);
  for(const answer of overlap.accepted)assert.ok(isCorrect(overlap,answer));
  assert.equal(gradeLesson(checkpoint.id,revised.questions.map(q=>q.answer),checkpoint.exerciseVersion).score,100);
  assert.equal(isCurrentLessonDraft(checkpoint.id,[],checkpoint.exerciseVersion),true);
  assert.equal(isCurrentLessonDraft(checkpoint.id,[],'v1-previous-checkpoint'),false);
 }
});
