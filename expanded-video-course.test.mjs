import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,chapters,gradeLesson,getLesson} from './course.mjs';
import {premiumCourses,gradeCourseAnswer,premiumCourseById} from './premium-courses.mjs';
const added=['zh','ko','fr','de','ar','it'];
for(const language of added)test(`${language}: video lessons cover every level and a separate exclusive source`,()=>{
 const ordinary=lessonList.filter(l=>l.language===language&&l.id.includes('-conversation-v2-')&&l.curriculumVersion===3);
 assert.deepEqual(ordinary.map(l=>l.level),['A1','A2','B1','B2','C1']);
 const exclusive=premiumCourses.filter(c=>c.language===language&&c.id.includes('-exclusive-video-v2-'));
 assert.equal(exclusive.length,1);assert.equal(new Set([...ordinary,...exclusive].map(l=>l.conversation.youtubeId)).size,6);
 for(const l of ordinary){assert.ok(chapters.some(c=>c.id===l.chapter&&c.specialist));assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer)).score,100);}
 for(const l of [...ordinary,...exclusive]){assert.match(l.conversation.youtubeId,/^[\w-]{11}$/);assert.ok(l.conversation.watchTasks.length>=3);assert.ok(l.conversation.levelNote.includes('not an official CEFR'));assert.equal(l.questions.length,6);for(const q of l.questions){assert.ok(q.video);assert.equal(new Set(q.options).size,q.options.length);assert.equal(q.sourceReference.kind,'analysis-assisted');assert.equal(q.videoCue.precision,'analysis-assisted');assert.ok(Number.isInteger(q.videoCue.start)&&q.videoCue.start>=0);assert.ok(q.videoCue.end>q.videoCue.start);assert.ok(q.videoCue.evidence.includes('not independently verified'));assert.equal(q.videoCue.label,q.prompt);}}
 for(const l of [...ordinary,...exclusive]){assert.equal(l.contentVersion,2);const oldId=l.id.replace('-v2-','-v1-');const old=getLesson(oldId)||premiumCourseById(oldId);assert.ok(old,oldId);assert.equal(old.contentVersion,1);assert.equal(old.questions[0].videoCue,undefined);assert.equal(old.conversation.youtubeId,l.conversation.youtubeId);assert.notEqual(old.questions[0].prompt,l.questions[0].prompt);if(ordinary.includes(l))assert.equal(l.chapter,old.chapter);}
 for(const q of exclusive[0].questions)assert.ok(gradeCourseAnswer(q,q.answer));
});
test('all ten languages have independent register courses with varied practice',()=>{
 for(const language of ['en','es','pt','ja',...added]){
  const cs=premiumCourses.filter(c=>c.language===language&&c.title==='Choose register with care');assert.equal(cs.length,1);
  const c=cs[0];assert.ok(c.examples.length>=4);assert.equal(c.questions.length,8);assert.ok(new Set(c.questions.map(q=>q.type)).size>=4);for(const q of c.questions)assert.ok(gradeCourseAnswer(q,q.answer));
 }
 const ja=premiumCourses.find(c=>c.id==='ja-exclusive-v1-register').questions.find(q=>q.type==='reorder');assert.ok(ja.tokens.length>2);assert.equal(ja.separator,'');
});
