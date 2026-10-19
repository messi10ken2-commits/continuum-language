import test from 'node:test';import assert from 'node:assert/strict';
import {getLessonVariant,getLesson,isCurrentLessonDraft,gradeLesson,isCorrect} from './course.mjs';
import {everydayAdditions} from './everyday-expressions.mjs';
import {lessonPosition,endReviewIndices} from './lesson-review-flow.mjs';
import {listeningReviewQuestion} from './review-listening.mjs';
import {reviewCandidate} from './review-pool.mjs';
import {translationSource,protectSource} from './localization-corpus.mjs';
const seed='v7-everyday-review-123456789';
test('80 practical expressions across four languages and five levels are taught, tested and reviewable without changing old seeds',()=>{
 assert.equal(everydayAdditions.size,40);let total=0;
 for(const[id,entries]of everydayAdditions){const old=getLessonVariant(id,'v6-everyday-review-123456789'),lesson=getLessonVariant(id,seed),language=lesson.language||'es';assert.equal(lesson.questions.length,old.questions.length+4);assert.deepEqual(lesson.questions.slice(0,old.questions.length).map(q=>q.prompt),old.questions.map(q=>q.prompt));assert.equal(gradeLesson(id,lesson.questions.map(q=>q.answer),seed).score,100);
  for(const x of entries){total++;assert.ok(x.register&&x.pitfall&&x.translation);assert.ok((lesson.expressions||lesson.vocabulary).some(e=>e.term===x.term));const qs=lesson.questions.filter(q=>q.id?.includes('-everyday-')&&reviewCandidate(id,q)?.term===x.term);assert.equal(qs.length,2);for(const q of qs){assert.ok(translationSource(q.prompt,language),q.prompt);assert.ok(isCorrect(q,q.answer));const source=translationSource(q.prompt,language);if(!q.audio)assert.ok(protectSource(source).values.some(v=>v.includes('____')||v===x.example),q.prompt);}}
 }
 assert.equal(total,80);
});
test('misses return only after every original question; checkpoints never retry; first scores and end-review drafts are preserved',()=>{
 const l=getLessonVariant('en-a1-v2-lesson-9',seed),a=l.questions.map(q=>q.answer);a[0]='wrong';a[3]=l.questions[3].type==='text'?'wrong':(l.questions[3].answer+1)%l.questions[3].options.length;
 assert.equal(lessonPosition(l,a.slice(0,1)).index,1);assert.equal(lessonPosition(l,a.slice(0,1)).reviewing,false);
 assert.deepEqual(endReviewIndices(l,a),[0,3]);assert.equal(lessonPosition(l,a,0).index,0);assert.equal(lessonPosition(l,a,1).index,3);assert.ok(isCurrentLessonDraft(l.id,a,seed));assert.equal(isCurrentLessonDraft(l.id,l.questions.map(q=>q.answer),seed),false);
 const before=gradeLesson(l.id,a,seed);assert.ok(before.score<100);assert.deepEqual(gradeLesson(l.id,a,seed),before);assert.deepEqual(endReviewIndices({...l,checkpoint:true},a),[]);
});
test('dictation uses real target language, rejects formulas, and keeps accents meaningful',()=>{
 for(const language of ['en','es','pt','ja']){const q=listeningReviewQuestion({language,example:({en:'I am from Japan.',es:'¡Qué guay!',pt:'Valeu pela ajuda!',ja:'またね。'})[language]});assert.ok(q.audioLocale);assert.ok(isCorrect(q,q.answer));assert.ok(!isCorrect(q,'wrong'));}
 assert.equal(listeningReviewQuestion({term:'acabar + gerund'}),null);assert.equal(listeningReviewQuestion({example:'a'.repeat(151)}),null);
});
