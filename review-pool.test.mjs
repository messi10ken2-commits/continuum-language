import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {getLessonVariant,lessonList} from './course.mjs';
import {missedReviewItems} from './review-pool.mjs';
import {photoInfo,photoFor,questionScene} from './lesson-media.mjs';
test('review captures only missed authored items, across all four languages',()=>{
 for(const id of ['travel-vocabulary','en-a1-v2-lesson-7','pt-a2-v2-lesson-12','ja-a1-v2-lesson-7']){
  const seed='v4-review-unit-123456789',l=getLessonVariant(id,seed),answers=l.questions.map(q=>q.answer);
  assert.equal(missedReviewItems(id,answers,seed).length,0);
  answers[0]=l.questions[0].type==='text'?'wrong':(l.questions[0].answer+1)%l.questions[0].options.length;
  const items=missedReviewItems(id,answers,seed);assert.equal(items.length,1);assert.equal(items[0].language,l.language||'es');assert.ok(items[0].term);assert.ok(items[0].meaning);
 }
 const l=getLessonVariant('pt-a2-v2-lesson-6','v4-review-unit-123456789');assert.equal(missedReviewItems(l.id,l.questions.map(q=>q.type==='text'?'wrong':(q.answer+1)%q.options.length),'v4-review-unit-123456789').length,0);
});
test('context photographs exist, vary within a lesson, and do not depend on answers',()=>{
 const lesson={id:'test',title:'Past events'};
 const photos=new Set();
 for(let i=0;i<20;i++){
  const q={id:'question-'+i,prompt:'You are reading a book. Complete the sentence.',answer:'was'};
  const scene=questionScene(lesson,q),info=photoInfo(scene);photos.add(info.src);
  assert.ok(existsSync('public'+info.src));assert.ok(info.alt);
  assert.equal(photoFor(questionScene(lesson,{...q,answer:'were'})),info.src);
 }
 assert.ok(photos.size>=3);
 for(const lesson of lessonList.filter(l=>!l.conversation)){const info=photoInfo(lesson);assert.ok(existsSync('public'+info.src),lesson.id);}
});
