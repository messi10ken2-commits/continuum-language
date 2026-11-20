import test from 'node:test';
import assert from 'node:assert/strict';
import {mistakeFeedback} from './mistake-feedback.mjs';
import {getLessonVariant,isCurrentLessonDraft,gradeLesson} from './course.mjs';
import {soundLessons} from './sound-script-course.mjs';
test('the reported Portuguese mistake distinguishes wrong verb from wrong tense',()=>{
 const q=getLessonVariant('pt-a2-v2-lesson-6','v3-feedback-123456789').questions.find(q=>q.prompt.startsWith('Complete with tocar:'));
 assert.match(mistakeFeedback(q,'Ligou'),/past-tense choice is not the main problem/);
 assert.match(mistakeFeedback(q,'tocava'),/imperfect/);
 assert.match(mistakeFeedback(q,'toquei'),/eu form/);
 assert.match(mistakeFeedback(q,'tocar'),/infinitive/);
 assert.equal(mistakeFeedback(q,'tocou'),q.note);
});
test('spelling and word-order explanations identify observable differences',()=>{
 assert.match(mistakeFeedback({type:'text',answer:'papá',note:'Final stress.'},'papa'),/accent/);
 assert.match(mistakeFeedback({type:'text',answer:'She is here',note:'Subject before verb.'},'is She here'),/order differs/);
 assert.match(mistakeFeedback({type:'text',answer:'I have arrived',note:'Perfect auxiliary.'},'I arrived'),/missing “have”/);
});
test('sound revisions replace study advice with listening, and invalidate older saved indices',()=>{
 for(const l of soundLessons.filter(l=>l.exerciseVersion)){
  assert.ok(!l.questions.some(q=>q.prompt.includes('practice sequence')));
  assert.equal(isCurrentLessonDraft(l.id,[],undefined),false);
  assert.equal(isCurrentLessonDraft(l.id,[],l.exerciseVersion),true);
  assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer),l.exerciseVersion).score,100);
  if(l.checkpoint)assert.equal(l.questions.length,4);
  else {const q=l.questions.at(-1);assert.ok(q.audio);const wrong=q.options.findIndex((_,i)=>i!==q.answer);assert.equal(mistakeFeedback(q,wrong),q.mistakeFeedback[q.options[wrong]]);}
 }
});
