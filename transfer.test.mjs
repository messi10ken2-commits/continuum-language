import test from 'node:test';
import assert from 'node:assert/strict';
import {chapters,lessonList,getLesson,getLessonVariant,gradeLesson} from './course.mjs';
import {transferBank} from './transfer-bank.mjs';
const seed='v1-1234567890-abcdef';
test('Every chapter has original application items with valid choices',()=>{
 const practice=new Set(lessonList.filter(l=>!l.checkpoint&&!l.summaryTest).flatMap(l=>l.questions.map(q=>q.prompt)));
 assert.equal(Object.keys(transferBank).length,28);
 for(const c of chapters.filter(c=>!c.summaryTest)){
  const pool=transferBank[c.id];assert.equal(pool.length,6,c.id);
  for(const q of pool){assert.ok(!practice.has(q.prompt),q.prompt);assert.equal(new Set(q.options).size,3);assert.ok(q.note);}
  const test=getLessonVariant(c.id+'-checkpoint',seed);assert.equal(test.questions.length,4);
  assert.equal(gradeLesson(test.id,test.questions.map(q=>q.answer),seed).score,100);
  assert.equal(gradeLesson(test.id,test.questions.map(q=>(q.answer+1)%3),seed).score,0);
 }
});
test('Retakes vary selection/order and saved seeds reproduce exact questions',()=>{
 for(const l of lessonList.filter(l=>l.checkpoint||l.summaryTest)){
  const a=getLessonVariant(l.id,seed),b=getLessonVariant(l.id,'v1-another-attempt-23456789');
  assert.deepEqual(a,getLessonVariant(l.id,seed));assert.notDeepEqual(a.questions,b.questions);
  assert.equal(new Set(a.questions.map(q=>q.prompt)).size,a.questions.length);
  if(l.summaryTest){for(const c of chapters.filter(c=>c.level===l.level&&!c.summaryTest))assert.equal(a.questions.filter(q=>q.topic===c.title).length,3);assert.equal(a.passScore,85);}
 }
});
test('Legacy drafts and ordinary lessons keep exact scoring; invalid seeds rejected',()=>{
 for(const l of lessonList)assert.equal(getLessonVariant(l.id,null),getLesson(l.id));
 assert.equal(gradeLesson('subjunctive',[1,1,1,1,1]).score,100);
 assert.throws(()=>getLessonVariant('a1-hello-checkpoint','v2-not-supported'));
 assert.throws(()=>getLessonVariant('subjunctive',seed));
});
