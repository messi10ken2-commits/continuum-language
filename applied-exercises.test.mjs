import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,getLesson,getLessonVariant,gradeLesson,isCurrentLessonDraft,isCorrect,hasExpandedExercises} from './course.mjs';
import {appliedQuestionBank,appliedScenarios,appliedListening,appliedCommunication,hasAppliedPractice} from './applied-exercises.mjs';
import {allowedSpeech} from './speech-api.mjs';
import {translationSource,protectSource} from './localization-corpus.mjs';
const affected=lessonList.filter(l=>hasExpandedExercises(l.id)&&hasAppliedPractice(l));
const seed='v5-practical-123456789';

test('new scenarios cover every ordinary grammar, listening and communication lesson in all four languages',()=>{
 assert.equal(affected.length,128);assert.equal(appliedQuestionBank.length,204);
 for(const l of affected){if(l.skill==='Grammar')assert.ok(appliedScenarios[l.id],l.id);if(l.skill==='Listening')assert.ok(appliedListening[l.id],l.id);if(['Speaking','Reading','Writing'].includes(l.skill))assert.ok(appliedCommunication[l.id],l.id);}
 const ids=new Set();for(const q of appliedQuestionBank){assert.ok(!ids.has(q.id),q.id);ids.add(q.id);assert.ok(q.note?.length>30,q.id);const l=getLesson(q.sourceLesson);assert.ok(l,q.id);const lang=l.language||'es';assert.ok(translationSource(q.prompt,lang),q.id);assert.ok(translationSource(q.note,lang),q.id);
  if(q.type==='text'){assert.ok(q.accepted.includes(q.answer));assert.ok(q.answer.length<=150);assert.doesNotMatch(q.answer,/\+|gerund|infinitive|participle/i);}else{assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3,q.id);assert.ok(Number.isInteger(q.answer));}
  if(q.audio)assert.ok(allowedSpeech(q.audio,q.audioLocale),q.id);
  for(const field of ['prompt','note']){const source=translationSource(q[field],lang),p=protectSource(source);assert.equal(p.restore(p.text),q[field]);}
 }
});

test('saved v5 runs reproduce and grade exactly while historical v4 runs still resolve',()=>{
 for(const base of lessonList.filter(l=>hasExpandedExercises(l.id))){
  const l=getLessonVariant(base.id,seed);assert.deepEqual(l,getLessonVariant(base.id,seed),base.id);
  assert.ok(l.questions.length);assert.equal(gradeLesson(base.id,l.questions.map(q=>q.answer),seed).score,100,base.id);
  for(let i=0;i<l.questions.length;i++)assert.ok(isCurrentLessonDraft(base.id,l.questions.slice(0,i).map(q=>q.answer),seed),base.id);
  for(const q of l.questions)for(const answer of q.accepted||[])assert.ok(isCorrect(q,answer));
  const oldSeed='v4-practical-123456789',old=getLessonVariant(base.id,oldSeed);assert.equal(gradeLesson(base.id,old.questions.map(q=>q.answer),oldSeed).score,100);
 }
});

test('practice rotates actual tasks, preserves taught entries and every grammar table row',()=>{
 for(const base of affected){const selected=new Set();
  for(let run=0;run<8;run++){
   const l=getLessonVariant(base.id,'v5-viewpoint-'+run+'-123456789');selected.add(l.questions.map(q=>q.id).sort().join('|'));
   if(base.skill==='Listening'){assert.equal(l.questions.length,4);assert.equal(new Set(l.questions.map(q=>q.audio)).size,4);assert.ok(l.questions.every(q=>q.audio));assert.ok(l.questions.some(q=>q.type==='text'));assert.ok(new Set(l.questions.map(q=>q.viewpoint)).size>=3);}
   if(base.skill==='Grammar'){
    const old=getLessonVariant(base.id,'v4-practical-123456789');const rows=new Set(old.questions.flatMap(q=>/^table:\d+:\d+/.exec(q.coverage||'')?.[0]||[]));
    for(const row of rows)assert.ok(l.questions.some(q=>q.coverage?.startsWith(row+':')),base.id+': '+row);
    assert.ok(l.questions.some(q=>q.viewpoint==='situational-choice'));assert.ok(l.questions.some(q=>q.type==='text'));
   }
   if(!['Vocabulary','Expressions'].includes(base.skill)&&(base.vocabulary||base.expressions)){const entries=base.vocabulary||base.expressions||[];for(let i=0;i<entries.length;i++)assert.ok(l.questions.some(q=>q.coverage?.startsWith('entry:'+i+':')),base.id+': entry '+i);}
  }
  if(base.skill==='Listening'||base.skill==='Grammar'&&base.breakdown?.tables?.length)assert.ok(selected.size>1,base.id+' must vary content, not only option order');
 }
});
