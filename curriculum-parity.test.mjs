import test from 'node:test';
import assert from 'node:assert/strict';
import {chapters as fullChapters,lessonList as fullLessonList,getLesson,getLessonVariant,gradeLesson} from './course.mjs';
const lessonList=fullLessonList.filter(l=>!l.specialist);
const chapters=fullChapters.filter(c=>!c.specialist);

import {legacyInternationalLessons,legacyInternationalChapters,legacyInternationalTransfer,buildInternationalCourse} from './international-course.mjs';
import {getSkillTask} from './skills-content.mjs';
import {languageInfo} from './languages.mjs';
const languages=['en','pt','ja'],bands=['A1','A2','B1','B2','C1'];
const spanish=chapters.filter(c=>!c.language),spanishLessons=lessonList.filter(l=>!l.language);
const normalized=s=>s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const fingerprint=q=>JSON.stringify([q.prompt,q.options,q.answer,q.audio||'']);
for(const language of languages){
 test(`${language}: each level exactly follows Spanish chapter kinds and lesson roles, with one final checkpoint`,()=>{
  for(const level of bands){
   const expected=spanish.filter(c=>c.level===level),actual=chapters.filter(c=>c.level===level&&c.language===language);
   assert.equal(actual.length,expected.length);
   assert.equal(actual.at(-1).summaryTest,true);
   for(let i=0;i<expected.length;i++){
    const source=expected[i],chapter=actual[i],units=lessonList.filter(l=>l.chapter===chapter.id),original=spanishLessons.filter(l=>l.chapter===source.id);
    assert.equal(chapter.kind,source.kind);
    assert.deepEqual(units.map(l=>l.skill),original.map(l=>l.skill));
    if(chapter.summaryTest){assert.equal(units.length,1);assert.equal(units[0].passScore,85);continue;}
    assert.equal(chapter.sourceChapter,source.id);
    assert.equal(units.length,3);assert.equal(units[2].checkpoint,true);assert.ok(units.slice(0,2).every(l=>!l.checkpoint));
    assert.deepEqual(new Set(units[2].questions.map(q=>q.sourceLesson)),new Set(units.slice(0,2).map(l=>l.id)));
   }
  }
 });
 test(`${language}: learning content is unique beyond IDs/titles, and tests use unseen sentences`,()=>{
  const learning=lessonList.filter(l=>l.language===language&&!l.checkpoint&&!l.summaryTest);
  assert.equal(learning.length,56);
  for(const key of ['explanation','example'])assert.equal(new Set(learning.map(l=>normalized(l[key]))).size,learning.length,`reused ${key}`);
  assert.equal(new Set(learning.map(l=>JSON.stringify(l.questions.map(fingerprint)))).size,learning.length);
  const learningContexts=new Set(learning.map(l=>normalized(l.example)));
  for(const l of lessonList.filter(l=>l.language===language&&l.checkpoint)){
   for(const q of l.questions){assert.ok(!learningContexts.has(normalized(q.context)),`${l.id} repeats a learning example`);assert.ok(getLesson(q.sourceLesson));assert.equal(new Set(q.options).size,q.options.length);}
  }
 });
 test(`${language}: listening has playable target-language audio and production uses actual recorded/written tasks`,()=>{
  for(const l of lessonList.filter(l=>l.language===language&&!l.checkpoint&&!l.summaryTest)){
   if(l.skill==='Listening')for(const q of l.questions){assert.ok(q.audio);assert.equal(q.audioLocale,languageInfo(language).locale);assert.ok(!q.prompt.includes(q.audio));}
   if(l.skill==='Speaking'||l.skill==='Writing'){const task=getSkillTask(l.productionTask);assert.equal(task.lessonId,l.id);assert.equal(task.skill,l.skill);assert.equal(task.locale,l.locale);assert.ok(task.prompt.includes(languageInfo(language).name));}
   if(l.skill==='Pronunciation'){assert.ok(l.speak);assert.equal(l.pronunciationTarget,l.example);}
  }
 });
 test(`${language}: summaries use only current chapters, match Spanish question counts and replay deterministically`,()=>{
  for(const level of bands){
   const summary=lessonList.find(l=>l.language===language&&l.level===level&&l.summaryTest),seed='v1-parity-test-123456789';
   const variant=getLessonVariant(summary.id,seed),sources=chapters.filter(c=>c.language===language&&c.level===level&&!c.summaryTest);
   assert.equal(variant.questions.length,sources.length*3);
   assert.deepEqual(getLessonVariant(summary.id,seed),variant);
   assert.equal(new Set(variant.questions.map(q=>q.topic)).size,sources.length);
   assert.ok(variant.questions.every(q=>getLesson(q.sourceLesson)?.curriculumVersion===2));
   assert.equal(gradeLesson(summary.id,variant.questions.map(q=>q.answer),seed).score,100);
  }
 });
}
test('Historical lesson IDs and unseeded answers retain their exact content without appearing in the roadmap',()=>{
 for(const old of legacyInternationalLessons){assert.deepEqual(getLesson(old.id),old);assert.ok(!lessonList.some(l=>l.id===old.id));assert.equal(gradeLesson(old.id,old.questions.map(q=>q.answer)).score,100);}
});
test('Historical seeded drafts retain the pre-repair selection algorithm, including legacy summary coverage',()=>{
 const seed='v1-history-test-123456789';
 for(const old of legacyInternationalLessons.filter(l=>l.checkpoint||l.summaryTest)){
  let state=2166136261;for(const c of seed+old.id){state^=c.charCodeAt(0);state=Math.imul(state,16777619)>>>0;}
  const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
  const shuffle=xs=>{const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const groups=old.summaryTest?legacyInternationalChapters.filter(c=>c.level===old.level&&c.language===old.language&&!c.summaryTest):legacyInternationalChapters.filter(c=>c.id===old.chapter);
  const chosen=groups.flatMap(c=>shuffle(legacyInternationalTransfer[c.id]).slice(0,old.summaryTest?7:4).map(q=>({...q,topic:c.title})));
  const expected=shuffle(chosen).map(q=>{const order=shuffle(q.options.map((_,i)=>i));return {...q,options:order.map(i=>q.options[i]),answer:order.indexOf(q.answer)};});
  assert.deepEqual(getLessonVariant(old.id,seed).questions,expected);
 }
});
test('No visible orphan lessons, legacy chapters or duplicate IDs',()=>{
 assert.equal(new Set(lessonList.map(l=>l.id)).size,lessonList.length);
 assert.equal(new Set(chapters.map(c=>c.id)).size,chapters.length);
 assert.ok(chapters.every(c=>!c.legacy));
 assert.ok(lessonList.every(l=>chapters.some(c=>c.id===l.chapter)));
});
test('Missing authored slots fail closed rather than silently cloning a lesson',()=>{
 assert.throws(()=>buildInternationalCourse(spanish,spanishLessons.filter(l=>l.id!==spanishLessons[0].id)),/does not match/);
});

test('Repaired checkpoint retakes change actual tasks, not just IDs or answer order',()=>{
 for(const l of lessonList.filter(l=>l.curriculumVersion===2&&l.checkpoint)){
  const selections=new Set(Array.from({length:10},(_,i)=>{const v=getLessonVariant(l.id,`v1-selection-test-123456-${i}`);assert.equal(v.questions.length,4);assert.equal(new Set(v.questions.map(q=>q.sourceLesson)).size,2);return v.questions.map(q=>q.id).sort().join(',');}));
  assert.ok(selections.size>1,l.id);
 }
});
