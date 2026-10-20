import test from 'node:test';
import assert from 'node:assert/strict';
import {premiumCourses,validCourseAnswer,gradeCourseAnswer} from './premium-courses.mjs';
import {premiumSkillSummary,premiumSkillTasks} from './premium-skills.mjs';
test('Premium lessons combine listening, dictation, cloze, ordering and contextual choices',()=>{
 for(const c of premiumCourses){assert.ok(c.questions.length>=6);if(!c.conversation)assert.equal(new Set(c.questions.map(q=>q.type||'choice')).size,5);for(const q of c.questions){assert.ok(validCourseAnswer(q,q.answer));assert.ok(gradeCourseAnswer(q,q.answer));if(typeof q.answer==='string'){assert.ok(gradeCourseAnswer(q,' '+q.answer.toUpperCase()+' '));assert.ok(!gradeCourseAnswer(q,'unrelated response'));assert.ok(!validCourseAnswer(q,0));}else assert.ok(!validCourseAnswer(q,'0'));}const reorder=c.questions.find(q=>q.type==='reorder');if(reorder)assert.equal([...reorder.tokens].reverse().join(reorder.separator??' '),reorder.answer);}
});
test('Each language and skill offers exactly four Premium scenes; old shopping records still resolve',()=>{for(const language of ['en','es','pt','ja'])for(const skill of ['Listening','Writing','Speaking']){assert.deepEqual(premiumSkillSummary.filter(t=>t.language===language&&t.skill===skill).map(t=>t.scene).sort(),['interview','living','travel','work']);assert.ok(premiumSkillTasks.find(t=>t.id===`focus-${language}-shopping-${skill.toLowerCase()}`));}});

test('Five courses per language include one source-grounded video lesson with explicit timing',()=>{for(const language of ['en','es','pt','ja']){const courses=premiumCourses.filter(c=>c.language===language);assert.equal(courses.length,5);const videos=courses.filter(c=>c.conversation);assert.equal(videos.length,1);for(const q of videos[0].questions){assert.ok(q.videoCue.evidence);assert.ok(q.videoCue.end>q.videoCue.start);}}});

test('Contextually correct cloze alternatives are accepted without relaxing unrelated answers',()=>{for(const c of premiumCourses)for(const q of c.questions){for(const answer of q.acceptedAnswers||[])assert.equal(gradeCourseAnswer(q,answer),true);if(q.acceptedAnswers?.length)assert.equal(gradeCourseAnswer(q,'unrelated'),false);}});
