import test from 'node:test';
import assert from 'node:assert/strict';
import {levels,chapters,lessonList,getLesson,gradeLesson,summarize,forLesson} from './course.mjs';
test('Every roadmap item is playable and grades right/wrong answers',()=>{
 assert.equal(new Set(lessonList.map(l=>l.id)).size,30);
 for(const l of lessonList){
  assert.ok(levels.some(x=>x.id===l.level));assert.ok(chapters.some(x=>x.id===l.chapter));
  assert.ok(l.questions.length>=3);
  assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer)).score,100);
  assert.equal(gradeLesson(l.id,l.questions.map(q=>q.type==='text'?'wrong':(q.answer+1)%q.options.length)).score,0);
  assert.throws(()=>gradeLesson(l.id,[]));
  assert.throws(()=>gradeLesson(l.id,l.questions.map(()=>null)));
 }
});
test('Each chapter has two lessons and a checkpoint covering both',()=>{
 for(const c of chapters){const units=lessonList.filter(l=>l.chapter===c.id);assert.equal(units.length,3);assert.equal(units.find(x=>x.checkpoint).questions.length,units.filter(x=>!x.checkpoint).reduce((n,x)=>n+x.questions.length,0));}
});
test('Legacy results stay attached to subjunctive, not other lessons',()=>{
 assert.equal(gradeLesson('subjunctive',[1,1,1,1,1]).score,100);
 const records=[{lesson:'porpara',score:50},{score:100},{lesson:'porpara',score:75}];
 assert.deepEqual(summarize(records),[{lesson:'porpara',best:75,latest:50,count:2},{lesson:'subjunctive',best:100,latest:100,count:1}]);
 assert.equal(forLesson(records).length,1);
 assert.throws(()=>gradeLesson('missing',[1,1,1]));
});
test('Written answers accept capitalization and surrounding spaces',()=>{
 const l=getLesson('travel-message'),answers=l.questions.map(q=>q.type==='text'?' A. ':q.answer);assert.equal(gradeLesson(l.id,answers).score,100);
});
