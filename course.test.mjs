import test from 'node:test';
import assert from 'node:assert/strict';
import {levels,chapters,lessonList,getLesson,gradeLesson,summarize,forLesson} from './course.mjs';
import {expressionChapters,expressionLessons,expressionGuidance} from './curriculum-expressions.mjs';
test('Expression curriculum covers every level with distinct phrases and playable checkpoints',()=>{
 assert.equal(expressionChapters.length,10);assert.equal(expressionLessons.length,20);
 const terms=[];
 for(const level of levels){assert.equal(expressionChapters.filter(c=>c.level===level.id).length,2);assert.equal(expressionLessons.filter(l=>l.level===level.id).length,4);}
 for(const l of expressionLessons){
  assert.equal(l.expressions.length,3);assert.equal(l.questions.length,5);assert.ok(l.priority);
  for(const x of l.expressions){for(const key of ['term','type','meaning','register','use','example','translation','pitfall','region'])assert.ok(x[key],`${l.id}: ${key}`);terms.push(x.term);}
  for(const q of l.questions){if(q.type==='text'){assert.ok(q.prompt.includes('___'));assert.ok(q.accepted.includes(q.answer));}else{assert.equal(new Set(q.options).size,3);assert.ok(q.options[q.answer]);}assert.ok(q.note);}
  assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer)).score,100);
  const checkpoint=getLesson(l.chapter+'-checkpoint');assert.ok(checkpoint);assert.equal(checkpoint.questions.length,10);
 }
 assert.equal(new Set(terms).size,60);
 assert.match(expressionGuidance.note,/not measured frequency/);
 assert.match(expressionGuidance.note,/not official CEFR/);
});
test('Every roadmap item is playable and grades right/wrong answers',()=>{
 assert.equal(new Set(lessonList.map(l=>l.id)).size,84);
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

 test('Expanded curriculum has full conjugation tables, vocabulary contexts and recall practice',()=>{
 const grammar=lessonList.filter(l=>l.breakdown),vocab=lessonList.filter(l=>l.vocabulary);
 assert.equal(grammar.length,12);assert.equal(vocab.length,4);
 for(const l of grammar){assert.ok(l.breakdown.steps.length>=3);assert.ok(l.breakdown.pitfall);assert.ok(l.breakdown.examples.length>=2);for(const t of l.breakdown.tables){assert.equal(t.rows.length,6);for(const r of t.rows)assert.equal(r.length,t.headers.length);}assert.ok(l.questions.some(q=>q.type==='text'));}
 for(const l of vocab){assert.equal(l.vocabulary.length,6);assert.ok(l.vocabulary.every(w=>w.term&&w.meaning&&w.phrase&&w.example&&w.translation));}
 });
 test('Written conjugation practice keeps meaningful accents and accepts surrounding space',()=>{
 const l=getLesson('preterite-lab'),answers=l.questions.map(q=>q.answer);
 assert.equal(gradeLesson(l.id,answers).score,100);answers[0]='hable';assert.equal(gradeLesson(l.id,answers).score,75);answers[0]=' HABLÉ ';assert.equal(gradeLesson(l.id,answers).score,100);
 });
