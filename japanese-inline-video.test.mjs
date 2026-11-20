import test from 'node:test';import assert from 'node:assert/strict';
import {premiumCourses,premiumCourseById} from './premium-courses.mjs';
import {premiumVideoSources} from './premium-video-lessons.mjs';
import {reviewedVideoCue} from './conversation-cues.mjs';
test('advanced Japanese scenes preserve both earlier courses without transferring scores',()=>{
 const next=premiumCourses.find(c=>c.id==='ja-premium-video-v4'),basic=premiumCourseById('ja-premium-video-v3'),old=premiumCourseById('ja-premium-video-v2');
 assert.equal(next.level,'B2');assert.equal(next.conversation.youtubeId,'uJb7K2ZT50I');assert.equal(next.questions.length,8);assert.equal(basic.conversation.youtubeId,'n6ciMT6KhVo');assert.equal(old.conversation.provider,'publisher');assert.equal(basic.questions.length,8);assert.equal(old.questions.length,8);assert.equal(premiumCourses.length,100);
 assert.ok(!premiumVideoSources.some(c=>[basic.id,old.id].includes(c.id)));
 for(const q of next.questions){const cue=reviewedVideoCue(q);assert.ok(cue);assert.ok(cue.start>=43&&cue.end<=112);assert.match(cue.evidence,/caption/);assert.ok(q.options[q.answer]);}
 assert.equal(new Set(next.questions.map(q=>q.answer)).size,3);
 assert.notDeepEqual(next.questions,basic.questions);
});
