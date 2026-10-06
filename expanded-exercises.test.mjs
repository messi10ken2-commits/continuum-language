import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList as fullLessonList,getLesson,getLessonVariant,gradeLesson,isCorrect} from './course.mjs';
const lessonList=fullLessonList.filter(l=>!l.specialist);

const seed='v2-regression-123456789';
for(const lang of ['es','en','pt','ja'])test(`${lang}: complete reference coverage, varied tasks, deterministic and gradable`,()=>{
 const ls=lessonList.filter(l=>(l.language||'es')===lang&&!l.checkpoint&&!l.summaryTest);assert.equal(ls.length,56);
 for(const base of ls){const l=getLessonVariant(base.id,seed);assert.ok(l.questions.length>base.questions.length,base.id);assert.deepEqual(l,getLessonVariant(base.id,seed));assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer),seed).score,100);
  assert.equal(getLessonVariant(base.id).questions,base.questions);assert.equal(gradeLesson(base.id,base.questions.map(q=>q.answer)).score,100);
  const entries=base.vocabulary||base.expressions;for(let i=0;i<(entries?.length||0);i++)for(const stage of ['context','recall','combination'])assert.ok(l.questions.some(q=>q.coverage===`entry:${i}:${stage}`),base.id+' '+i+' '+stage);
  if(base.skill==='Grammar'&&base.breakdown)for(let ti=0;ti<base.breakdown.tables.length;ti++)for(let ri=0;ri<base.breakdown.tables[ti].rows.length;ri++)assert.ok(l.questions.some(q=>q.coverage.startsWith(`table:${ti}:${ri}:`)),base.id+' table row '+ri);
  assert.ok(new Set(l.questions.map(q=>q.mode||q.type||'choice')).size>=2,base.id);
  for(const q of l.questions){assert.ok(q.note);if(q.type==='text'){assert.ok(q.answer.length<=150,q.id);assert.ok(q.accepted.includes(q.answer));assert.ok(!isCorrect(q,'wrong answer'));}else assert.equal(new Set(q.options).size,q.options.length);if(q.tokens){assert.equal([...q.tokens.join('')].sort().join(''),[...q.answer.replaceAll(q.joiner||'\u0000','')].sort().join(''));assert.ok(q.tokens.length>=2);}}
 }
});
test('historical tests still use v1 and modern normal lessons use v2',()=>{const l=lessonList.find(l=>l.checkpoint);assert.deepEqual(getLessonVariant(l.id,'v1-history-123456789'),getLessonVariant(l.id,'v1-history-123456789'));assert.throws(()=>getLessonVariant(l.id,seed));assert.throws(()=>getLessonVariant('en-a1-v2-lesson-2','v9-history-123456789'));});
