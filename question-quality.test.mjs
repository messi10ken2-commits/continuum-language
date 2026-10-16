import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,getLessonVariant,gradeLesson,validAnswer,hasExpandedExercises,isCorrect} from './course.mjs';
import {qualityQuestionBank} from './question-quality.mjs';
import {translationSource} from './localization-corpus.mjs';
import {questionText,setInterfaceLanguage} from './interface-runtime.mjs';
test('every replacement is explicit and has five reviewed instruction translations and public sources',()=>{
 let count=0;
 for(const l of lessonList)for(const q of qualityQuestionBank(l)){
  if(!q.qualityVersion)continue;count++;assert.ok(!q.prompt.startsWith('Complete this part'));
  for(const locale of ['ja','es','pt','zh','fr']){assert.ok(q.promptTranslations[locale]);assert.notEqual(q.promptTranslations[locale],q.prompt);setInterfaceLanguage(locale,{persist:false});assert.equal(questionText(q,l.language||'es'),q.promptTranslations[locale]);}
  assert.ok(translationSource(q.prompt,l.language||'es'),l.id+': '+q.prompt);assert.ok(isCorrect(q,q.answer));
 }
 assert.ok(count>500);setInterfaceLanguage('en',{persist:false});
});
test('reported condition and leaked modal are practical clozes, with legitimate alternatives',()=>{
 const condition=qualityQuestionBank(lessonList.find(l=>l.id==='en-b2-v2-lesson-3')).find(q=>q.coverage==='table:0:0:1');assert.equal(condition.answer,'fall');assert.ok(isCorrect(condition,'drop'));assert.ok(isCorrect(condition,'decrease'));assert.match(condition.prompt,/If prices ____, we will move/);assert.match(condition.promptTranslations.ja,/価格が下がる可能性/);
 const should=qualityQuestionBank(lessonList.find(l=>l.id==='en-c1-v2-lesson-5')).find(q=>q.coverage==='application:3');assert.equal(should.answer,'should');assert.ok(!/should/i.test(should.prompt));assert.ok(isCorrect(should,'ought to'));assert.ok(!isCorrect(should,'must'));
});
test('v6 drafts are deterministic and grade fully while v5 runs retain original answers',()=>{
 for(const l of lessonList){if(!hasExpandedExercises(l.id))continue;
  const seed='v6-quality-test-123456789',v=getLessonVariant(l.id,seed),again=getLessonVariant(l.id,seed);assert.deepEqual(v,again);
  const answers=v.questions.map(q=>q.answer);assert.ok(v.questions.every((q,i)=>validAnswer(q,answers[i])));assert.equal(gradeLesson(l.id,answers,seed).score,100);
  const oldSeed='v5-quality-test-123456789',old=getLessonVariant(l.id,oldSeed);assert.equal(gradeLesson(l.id,old.questions.map(q=>q.answer),oldSeed).score,100);
 }
});
test('no single required auxiliary or linker is given away by Complete with in new runs',()=>{
 for(const l of lessonList)for(const q of qualityQuestionBank(l)){
  if(q.type!=='text')continue;
  const m=/^Complete(?: [^:\n]+)? with ([^:]+):/i.exec(q.prompt);
  if(m)assert.notEqual(m[1].toLowerCase(),String(q.answer).toLowerCase(),l.id+': '+q.prompt);
 }
});
