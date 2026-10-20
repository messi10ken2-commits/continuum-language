import test from 'node:test';
import assert from 'node:assert/strict';
import {premiumCourses,gradeCourseAnswer} from './premium-courses.mjs';
import {varietyCourses} from './premium-varieties.mjs';
import {academicCourses} from './premium-academic.mjs';
test('Every language adds source-informed regional practice and C1 evidence-focused academic practice',()=>{
 for(const language of ['en','es','pt','ja']){const regional=varietyCourses.find(c=>c.language===language),academic=academicCourses.find(c=>c.language===language);assert.equal(premiumCourses.filter(c=>c.language===language).length,7);assert.equal(regional.questions.length,8);assert.equal(academic.questions.length,8);assert.equal(academic.level,'C1');assert.ok(regional.exampleNote.includes('within every country'));assert.ok(regional.questions.every(q=>!q.audio));assert.ok(academic.reading.length>150);assert.deepEqual(academic.visualData,{daily:72,weekly:68,participants:40});assert.ok(academic.exampleNote.includes('invented'));for(const c of [regional,academic])for(const q of c.questions){assert.ok(q.note.length>25);assert.ok(gradeCourseAnswer(q,q.answer));for(const a of q.acceptedAnswers||[])assert.ok(gradeCourseAnswer(q,a));}}
});
