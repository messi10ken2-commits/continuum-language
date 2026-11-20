import assert from 'node:assert/strict';
import {test} from 'node:test';
import {lessonList,getLessonVariant,hasExpandedExercises,isCurrentLessonDraft,gradeLesson} from './course.mjs';
test('every current lesson accepts start and each saved answer, then grades completion',()=>{
 for(const base of lessonList){
  const seed=base.exerciseVersion||(base.checkpoint||base.summaryTest?'v1-regression-123456789':hasExpandedExercises(base.id)?'v2-regression-123456789':undefined);
  const l=getLessonVariant(base.id,seed),answers=l.questions.map(q=>q.answer);
  for(let i=0;i<answers.length;i++)assert.ok(isCurrentLessonDraft(l.id,answers.slice(0,i),seed),`${l.id} answer ${i}`);
  assert.equal(gradeLesson(l.id,answers,seed).score,100,l.id);
  assert.equal(isCurrentLessonDraft(l.id,answers,seed),false,l.id+' full submission is not a draft');
  if(base.exerciseVersion)assert.equal(isCurrentLessonDraft(l.id,[],undefined),false,l.id+' old video version');
 }
});
