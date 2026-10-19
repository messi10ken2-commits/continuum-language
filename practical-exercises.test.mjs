import {everydayAdditions} from './everyday-expressions.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,getLessonVariant,gradeLesson,isCurrentLessonDraft} from './course.mjs';
import {answerStep} from './lesson-feedback.mjs';
import scenarios from './practical-scenarios.json' with {type:'json'};
const seed='v3-regression-123456789';
test('all 96 vocabulary/expression revisions keep every taught entry once and add a new practical situation',()=>{
 assert.equal(Object.keys(scenarios).length,96);
 for(const base of lessonList.filter(l=>scenarios[l.id])){
  const l=getLessonVariant(base.id,seed),old=getLessonVariant(base.id,seed.replace('v3','v2'));
  assert.deepEqual(l,getLessonVariant(base.id,seed));assert.ok(l.questions.length<old.questions.length,base.id);
  for(const [i] of (base.expressions||base.vocabulary).slice(0,(base.expressions||base.vocabulary).length-(everydayAdditions.get(base.id)?.length||0)).entries())assert.equal(l.questions.filter(q=>q.coverage.startsWith(`entry:${i}:`)).length,1,base.id);
  assert.ok(l.questions.some(q=>q.coverage==='practical:0'));
  for(const q of l.questions){assert.ok(q.optionsLang);if(q.options)assert.equal(new Set(q.options).size,q.options.length);}
  const answers=l.questions.map(q=>q.answer);
  for(let i=0;i<answers.length;i++)assert.ok(isCurrentLessonDraft(l.id,answers.slice(0,i),seed));
  assert.equal(gradeLesson(l.id,answers,seed).score,100);
 }
});
test('incorrect choice zero is repeated exactly once, correct retry does not inflate score',()=>{
 const q={options:['wrong','right'],answer:1};
 const first=answerStep({},q,0);assert.deepEqual(first,{retry:true,firstChoice:0});
 assert.deepEqual(answerStep({},q,1,true,first.firstChoice),{retry:false,answer:0});
 assert.deepEqual(answerStep({},q,0,true,first.firstChoice),{retry:false,answer:0});
 assert.deepEqual(answerStep({},q,1),{retry:false,answer:1});
});
test('text errors get one retry; checkpoints and level reviews retain test behaviour',()=>{
 const q={type:'text',answer:'meio quilo'};
 const first=answerStep({},q,'um quilo');assert.ok(first.retry);
 assert.deepEqual(answerStep({},q,'meio quilo',true,first.firstChoice),{retry:false,answer:'um quilo'});
 for(const lesson of [{checkpoint:true},{summaryTest:true}])assert.equal(answerStep(lesson,q,'um quilo').retry,false);
});
