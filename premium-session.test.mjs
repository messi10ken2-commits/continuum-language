import test from 'node:test';
import assert from 'node:assert/strict';
import {premiumCourses,gradeCourseAnswer} from './premium-courses.mjs';
import {exclusiveSession,exclusiveAnswer,exclusiveAnswers,premiumGalleryFrames} from './premium-session.mjs';
test('all exclusive courses shuffle deterministically while server grading keeps original associations',()=>{
 for(const course of premiumCourses){
  const view=exclusiveSession(course,'exclusive-session-fixture-123456789');assert.deepEqual(view,exclusiveSession(course,'exclusive-session-fixture-123456789'));
  assert.notDeepEqual(view.questions.map(q=>q._sourceIndex),course.questions.map((q,i)=>i),course.id);
  assert.deepEqual(view.questions.map(q=>q._sourceIndex).sort((a,b)=>a-b),course.questions.map((q,i)=>i));
  const answers=view.questions.map(q=>typeof q.answer==='number'?q._optionOrder.indexOf(course.questions[q._sourceIndex].answer):q.answer);
  view.questions.forEach((q,i)=>assert.ok(gradeCourseAnswer(course.questions[q._sourceIndex],exclusiveAnswer(q,answers[i]))));
  assert.deepEqual(exclusiveAnswers(view,answers),course.questions.map(q=>q.answer));
  const again=exclusiveSession(course,'another-exclusive-session-123456789');assert.notDeepEqual(view.questions.map(q=>[q._sourceIndex,q._optionOrder,q.tokens]),again.questions.map(q=>[q._sourceIndex,q._optionOrder,q.tokens]));
  assert.deepEqual(exclusiveSession(course,null).questions.map(q=>q._sourceIndex),course.questions.map((q,i)=>i),'legacy drafts keep identity mapping');
  assert.deepEqual(exclusiveSession({...course,preserveQuestionOrder:true},'ordered-session').questions.map(q=>q._sourceIndex),course.questions.map((q,i)=>i));
 }
});
test('the gallery reads only authored teaching material, never grading answers or feedback',()=>{
 for(const course of premiumCourses){const frames=premiumGalleryFrames(course);assert.equal(new Set(frames.map(f=>f.text)).size,frames.length);if(!course.conversation)assert.ok(frames.length>=2,course.id);assert.deepEqual(frames,premiumGalleryFrames({...course,questions:[]}));assert.deepEqual(frames,premiumGalleryFrames({...course,questions:course.questions.map(()=>({answer:'secret sentinel',note:'private feedback'}))}));}
});
