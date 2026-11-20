import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,chapters,getLessonVariant,gradeLesson,validAnswer} from './course.mjs';
import {soundLessons} from './sound-script-course.mjs';
test('Every language has four complete pronunciation studios with recordable targets',()=>{
 for(const lang of ['es','en','pt','ja']){
 const lessons=soundLessons.filter(l=>(l.language||'es')===lang&&l.skill==='Pronunciation');
 assert.equal(lessons.length,4);
 for(const l of lessons){assert.ok(l.pronunciationTarget&&l.speak);assert.equal(l.soundGuide.pairs.length,3);assert.ok(l.questions.length>=8);assert.ok(l.questions.some(q=>q.audio));assert.ok(l.questions.some(q=>q.type==='text'));}
 }
});
test('All specialist answers are valid, full marks are attainable, and IDs are unique',()=>{
 assert.equal(new Set(lessonList.map(l=>l.id)).size,lessonList.length);
 for(const l of soundLessons){assert.ok(chapters.some(c=>c.id===l.chapter));assert.ok(l.questions.every(q=>validAnswer(q,q.answer)));assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer)).score,100);for(const q of l.questions.filter(q=>q.options))assert.equal(new Set(q.options).size,q.options.length);}
});
test('Both kana alphabets cover 46 basic and 25 voiced characters, with reading recall and listening',()=>{
 for(const script of ['hiragana','katakana']){
 const lessons=soundLessons.filter(l=>l.id.startsWith('ja-script-v1-'+script));
 assert.deepEqual(lessons.map(l=>l.characters.length),[25,21,25]);
 for(const l of lessons){assert.ok(l.questions.some(q=>q.audio));for(const x of l.characters)assert.ok(l.questions.some(q=>q.type==='text'&&q.prompt.includes(x.glyph)));}
 }
 assert.equal(soundLessons.filter(l=>l.characters&&l.id.includes('combinations')).length,2);
 assert.equal(soundLessons.find(l=>l.id==='ja-script-v1-kanji').characters.length,12);
 assert.ok(soundLessons.filter(l=>l.characters).every(l=>l.language==='ja'));
});
test('Specialist checkpoint variants cover both lessons and legacy summaries exclude new chapters',()=>{
 for(const l of soundLessons.filter(l=>l.checkpoint))for(const seed of ['v1-sound-test-123456789','v1-sound-test-987654321']){
 const v=getLessonVariant(l.id,seed);assert.equal(v.questions.length,4);assert.equal(new Set(v.questions.map(q=>q.sourceLesson)).size,2);assert.equal(gradeLesson(l.id,v.questions.map(q=>q.answer),seed).score,100);
 }
 for(const l of lessonList.filter(l=>l.summaryTest)){
 const v=getLessonVariant(l.id,'v1-sound-test-123456789');assert.ok(v.questions.every(q=>!q.sourceLesson?.includes('-sound-v1-')));
 }
});
