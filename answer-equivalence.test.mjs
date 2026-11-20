import test from 'node:test';
import assert from 'node:assert/strict';
import {equivalentAnswer,expandContractions} from './answer-equivalence.mjs';
import {getLessonVariant,isCorrect,gradeLesson,lessonList,hasExpandedExercises} from './course.mjs';
const q=answer=>({type:'text',answer,prompt:'Complete the sentence.'});
test('unambiguous contractions and full forms grade identically in both directions',()=>{
 for(const [a,b] of [["I'm from",'I am from'],["You're welcome",'You are welcome'],["I've finished",'I have finished'],["We won't go",'We will not go'],["They aren't ready",'They are not ready'],["She'll arrive",'She will arrive'],["I can't swim",'I cannot swim'],["I'd like",'I would like'],["She's from",'She is from'],["He's been here",'He has been here']]){assert.ok(isCorrect(q(a),b));assert.ok(isCorrect(q(b),a));}
 assert.ok(isCorrect(q("I'm from"),'I AM FROM.'));assert.ok(isCorrect(q('I am from'),'I’m from'));
});
test('form-specific instructions and meaning distinctions remain strict',()=>{
 for(const prompt of ['Make negative without a contraction.','Do not contract the answer.','Write the full form.','Write the contraction of I am.'])assert.ok(!equivalentAnswer({...q("I'm"),prompt},'I am'));
 for(const [correct,wrong] of [["He's happy",'He has happy'],["I'd left",'I would left'],['I am from','I is from'],['I have arrived','I had arrived'],['avó','avo'],['sí','si'],['foi','fui'],['です','だ']])assert.ok(!isCorrect(q(correct),wrong));
 assert.ok(!isCorrect({...q("I'm"),answerMatch:'exact'},'I am'));
});
test('reported saved exercise accepts I am from through actual lesson grading',()=>{
 const id='en-a1-v2-lesson-1',seed='v4-alternative-answer-123456789',l=getLessonVariant(id,seed),i=l.questions.findIndex(q=>q.type==='text'&&q.answer==="I'm from");assert.ok(i>=0);
 const answers=l.questions.map(q=>q.answer);answers[i]='I am from';assert.equal(gradeLesson(id,answers,seed).score,100);
});
test('all expanded English written exercises preserve their answer key and accept safe expansions unless form-specific',()=>{
 let variants=0;
 for(const l of lessonList.filter(l=>l.language==='en'&&hasExpandedExercises(l.id)))for(const v of [2,3,4,5])for(const item of getLessonVariant(l.id,`v${v}-equivalence-scan-123456789`).questions){if(item.type!=='text')continue;assert.ok(isCorrect(item,item.answer));const expanded=expandContractions(item.answer);if(expanded!==String(item.answer).toLowerCase()&&isCorrect(item,expanded))variants++;}
 assert.ok(variants>50);
});
