import test from 'node:test';
import assert from 'node:assert/strict';
import {assessmentItems,gradeAssessment,publicAssessment} from './assessment-bank.mjs';
for(const form of [0,1]){
 test(`form ${form}: balanced bank, unique items and options`,()=>{const items=assessmentItems(form);assert.equal(items.length,30);assert.equal(new Set(items.map(q=>q.id)).size,30);for(const q of items){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);}});
 test(`form ${form}: scoring extremes and scoped report`,()=>{const items=assessmentItems(form);assert.equal(gradeAssessment(form,items.map(q=>q.answer)).level,'C1');const zero=gradeAssessment(form,items.map(()=>null));assert.equal(zero.level,'Below A1');assert.equal(zero.correct,0);assert.equal(zero.overallCefr,null);assert.equal(zero.skipped,30);});
 test(`form ${form}: no jumping over failed lower bands`,()=>{const items=assessmentItems(form);assert.equal(gradeAssessment(form,items.map(q=>q.level==='A2'?null:q.answer)).level,'A1');});
 test(`form ${form}: exact threshold and skill balance`,()=>{const items=assessmentItems(form),a=items.map((q,i)=>i%3===2?null:q.answer);assert.equal(gradeAssessment(form,a).level,'C1');a[0]=null;assert.equal(gradeAssessment(form,a).level,'Below A1');});
 test(`form ${form}: invalid answers and incomplete tests rejected`,()=>{assert.throws(()=>gradeAssessment(form,[]));assert.throws(()=>gradeAssessment(form,Array(30).fill(9)));assert.throws(()=>gradeAssessment(form,Array(30).fill('0')));});
 test(`form ${form}: public session has no answer key`,()=>{const r=publicAssessment({id:'test',form,answers:[],result:null});assert.equal('answer' in r.question,false);assert.equal('level' in r.question,false);assert.equal('answers' in r,false);});
}
test('alternate forms contain different passages',()=>{assert.notEqual(assessmentItems(0)[0].passage,assessmentItems(1)[0].passage);});
for(const form of [0,1])test(`new form ${form}: listening is separately scored and productive tasks stay ungraded`,()=>{
 const version='es-diagnostic-2',items=assessmentItems(form,version);assert.equal(items.length,45);assert.equal(items.filter(q=>q.skill==='Listening').length,15);
 const answers=items.map(q=>q.skill==='Listening'?null:q.answer),r=gradeAssessment(form,answers,version);assert.equal(r.level,'C1');assert.equal(r.skills.find(s=>s.name==='Listening').level,'Below A1');assert.equal(r.overallCefr,null);
 const s=publicAssessment({id:'example',version,form,answers});assert.equal(s.total,47);assert.equal(s.question.skill,'Writing');assert.equal(s.question.task.model,undefined);assert.equal(s.question.task.questions,undefined);
});

test('third form: balanced new content, stable resume and scoring',()=>{
 const version='es-diagnostic-2',items=assessmentItems(2,version);
 assert.equal(items.length,45);
 assert.equal(new Set(items.map(q=>q.id)).size,45);
 for(const level of ['A1','A2','B1','B2','C1'])for(const skill of ['Reading','Language use','Listening'])assert.equal(items.filter(q=>q.level===level&&q.skill===skill).length,3);
 for(const q of items){assert.equal(new Set(q.options).size,4);assert.ok(q.options[q.answer]);}
 assert.equal(gradeAssessment(2,items.map(q=>q.answer),version).level,'C1');
 assert.equal(gradeAssessment(2,items.map(()=>null),version).level,'Below A1');
 const row={id:'resume',version,form:2,answers:items.slice(0,12).map(q=>q.answer)};
 assert.deepEqual(publicAssessment(row),publicAssessment(JSON.parse(JSON.stringify(row))));
 assert.equal('answer' in publicAssessment(row).question,false);
 for(const form of [0,1]){
  const old=assessmentItems(form,version);
  assert.notEqual(items[0].passage,old[0].passage);
  assert.notEqual(items[30].audio,old[30].audio);
 }
 for(let band=0;band<5;band++){
  const levels=['A1','A2','B1','B2','C1'];
  const answers=items.map(q=>levels.indexOf(q.level)<=band?q.answer:null);
  const writing=publicAssessment({id:'task',version,form:2,answers});
  const speaking=publicAssessment({id:'task',version,form:2,answers:[...answers,null]});
  assert.equal(writing.question.skill,'Writing');assert.equal(speaking.question.skill,'Speaking');
  assert.notEqual(writing.question.prompt,speaking.question.prompt);
  assert.equal(writing.question.task.level,levels[band]);
 }
});
