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
