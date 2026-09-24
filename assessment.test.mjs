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
