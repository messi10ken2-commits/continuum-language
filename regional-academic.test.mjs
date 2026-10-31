import test from 'node:test';
import assert from 'node:assert/strict';
import {premiumCourses,gradeCourseAnswer} from './premium-courses.mjs';
import {varietyCourses} from './premium-varieties.mjs';
import {academicCourses} from './premium-academic.mjs';
test('Every language adds source-informed regional practice and C1 evidence-focused academic practice',()=>{
 for(const language of ['en','es','pt','ja']){const regional=varietyCourses.find(c=>c.language===language),academic=academicCourses.find(c=>c.language===language);assert.equal(premiumCourses.filter(c=>c.language===language).length,10);assert.equal(regional.questions.length,8);assert.equal(academic.questions.length,8);assert.equal(academic.level,'C1');assert.ok(regional.exampleNote.includes('within every country'));assert.equal(regional.questions.filter(q=>q.audio).length,language==='ja'?0:2);assert.ok(regional.questions.filter(q=>q.audio).every(q=>q.type==='listening'&&q.audioLocale&&q.audioKind==='regional-synthesis'&&q.listeningTarget==='meaning'&&!q.context));assert.ok(regional.breakdown.tables.length);assert.ok(academic.reading.length>150);assert.deepEqual(academic.visualData,{daily:72,weekly:68,participants:40});assert.ok(academic.exampleNote.includes('invented'));for(const c of [regional,academic])for(const q of c.questions){assert.ok(q.note.length>25);assert.ok(gradeCourseAnswer(q,q.answer));for(const a of q.acceptedAnswers||[])assert.ok(gradeCourseAnswer(q,a));}}
});

test('Río de la Plata voseo tables and exercises cover indicative and affirmative commands',()=>{
 const c=varietyCourses.find(c=>c.language==='es');
 assert.deepEqual(c.breakdown.tables[0].rows.find(r=>r[0]==='tener'),['tener','tienes','tenés']);
 assert.deepEqual(c.breakdown.tables[1].rows.find(r=>r[0]==='venir'),['venir','ven','vení']);
 assert.deepEqual(c.breakdown.tables[1].rows.find(r=>r[0]==='ir'),['ir','ve','andá']);
 assert.equal(c.questions[0].audioLocale,'es-AR');assert.equal(c.questions[4].audioLocale,'es-MX');
 assert.ok(gradeCourseAnswer(c.questions[5],'tenés'));assert.ok(!gradeCourseAnswer(c.questions[5],'tienes'));
 assert.match(c.breakdown.steps.join(' '),/Negative commands and subjunctives vary/);
});
