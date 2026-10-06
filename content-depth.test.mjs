import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList} from './course.mjs';
import {assessmentItems,gradeAssessment,publicAssessment,assessmentFormCount} from './assessment-bank.mjs';
const bands=['A1','A2','B1','B2','C1'];
for(const lang of ['en','pt','ja'])test(`${lang}: all 56 normal lessons have substantive references`,()=>{
 const lessons=lessonList.filter(l=>l.language===lang&&!l.checkpoint&&!l.summaryTest);assert.equal(lessons.length,56);
 for(const l of lessons){
  if(l.skill==='Grammar'){assert.ok(l.breakdown.steps.length>=4,l.id);assert.ok(l.breakdown.tables.length>=1,l.id);assert.ok(l.breakdown.examples.length>=3,l.id);for(const t of l.breakdown.tables){assert.ok(t.rows.length>=3,l.id);for(const r of t.rows)assert.equal(r.length,t.headers.length,l.id);}}
  else if(l.skill==='Expressions'){assert.equal(l.expressions.length,4,l.id);assert.equal(new Set(l.expressions.map(x=>x.term)).size,4);for(const e of l.expressions)for(const key of ['meaning','example','translation','use','pitfall','register'])assert.ok(e[key],l.id+' '+key);}
  else {assert.ok(l.vocabulary.length>=(l.skill==='Vocabulary'?6:4),l.id);assert.equal(new Set(l.vocabulary.map(x=>x.term)).size,l.vocabulary.length);for(const w of l.vocabulary)for(const key of ['meaning','phrase','example','translation'])assert.ok(w[key],l.id+' '+key);}
 }
});
for(const lang of ['es','en','pt','ja'])test(`${lang}: four balanced forms, distinct contexts, deterministic grading and no answer leakage`,()=>{
 assert.equal(assessmentFormCount,4);const version=lang+'-diagnostic-3',readings=new Set(),audios=new Set(),use=new Set(),prompts=new Set();
 for(let form=0;form<4;form++){
  const items=assessmentItems(form,version);assert.equal(items.length,45);assert.deepEqual(items,assessmentItems(form,version));assert.equal(new Set(items.map(x=>x.id)).size,45);
  for(const band of bands){for(const skill of ['Reading','Language use','Listening'])assert.equal(items.filter(x=>x.level===band&&x.skill===skill).length,3);const r=items.find(x=>x.level===band&&x.skill==='Reading').passage,a=items.find(x=>x.level===band&&x.skill==='Listening').audio;assert.ok(!readings.has(r));readings.add(r);assert.ok(!audios.has(a));audios.add(a);assert.notEqual(r,a);}
  for(const q of items){assert.equal(q.options.length,4,q.id);assert.equal(new Set(q.options).size,4,q.id);assert.ok(q.options[q.answer]);if(q.skill==='Language use'){const signature=q.prompt+'|'+q.options[q.answer];assert.ok(!use.has(signature),q.id);use.add(signature);}}
  const keys=items.map(q=>q.answer);assert.equal(gradeAssessment(form,keys,version).level,'C1');assert.equal(gradeAssessment(form,keys,version).correct,45);assert.equal(gradeAssessment(form,items.map(()=>null),version).level,'Below A1');
  for(let i=0;i<47;i++){const row={id:'test',form,version,answers:[...keys,null].slice(0,i)};const q=publicAssessment(row).question;assert.ok(q);assert.ok(!('answer'in q));assert.ok(!('level'in q));if(q.task){assert.ok(!('model'in q.task));assert.ok(!prompts.has(q.prompt));prompts.add(q.prompt);}}
 }
 assert.equal(readings.size,20);assert.equal(audios.size,20);assert.equal(use.size,60);assert.equal(prompts.size,8);
 assert.throws(()=>assessmentItems(4,version));assert.throws(()=>assessmentItems(3,lang+'-diagnostic-2'));
});
