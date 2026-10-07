import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {lessonList,getLessonVariant,gradeLesson} from './course.mjs';
import {hasLessonMedia,visualFrames,themeFor,mediaThemes} from './lesson-media.mjs';
import manifest from './lesson-video-manifest.json' with {type:'json'};
import {handleLessonMedia,videoRange} from './lesson-media-api.mjs';
const call=(id,headers={},method='GET')=>{let status,response,body;assert.ok(handleLessonMedia({method,headers},{writeHead:(s,h)=>{status=s;response=h},end:b=>body=b},`/api/lesson-video/visual-v1/${id}.mp4`));return {status,headers:response,body};};
test('every regular lesson has a matching playable video, complete transcript and valid theme',()=>{
 const lessons=lessonList.filter(hasLessonMedia);assert.equal(lessons.length,269);assert.equal(Object.keys(manifest).length,lessons.length);
 for(const l of lessons){const m=manifest[l.id],frames=visualFrames(l);assert.ok(m,l.id);assert.equal(m.duration,frames.length*6);assert.ok(mediaThemes[themeFor(l)]);assert.ok(frames.every(f=>f.text&&f.meaning));
 const r=call(l.id);assert.equal(r.status,200);assert.equal(r.headers['Content-Type'],'video/mp4');assert.equal(r.body.length,m.bytes);assert.equal(createHash('sha256').update(r.body).digest('hex'),m.sha256);assert.equal(r.body.toString('ascii',4,8),'ftyp');}
});
test('video ranges support Safari probing, seeking, suffixes, HEAD and conditional caching',()=>{
 const id='en-visual-v1-cafe',full=call(id),range=call(id,{range:'bytes=0-1'});assert.equal(range.status,206);assert.deepEqual(range.body,full.body.subarray(0,2));
 const tail=call(id,{range:'bytes=-32'});assert.deepEqual(tail.body,full.body.subarray(-32));assert.equal(call(id,{range:'bytes=99999999-'}).status,416);assert.equal(call(id,{range:'bytes=3-1'}).status,416);
 assert.equal(call(id,{},'HEAD').body,undefined);assert.equal(call(id,{'if-none-match':full.headers.ETag}).status,304);assert.equal(call(id,{},'POST').status,405);assert.equal(call('missing').status,404);
 assert.equal(videoRange('bytes=-0',100),null);assert.equal(videoRange('bytes=0-2,4-6',100),null);
});
test('new stories and checkpoints are gradable in all four languages without changing old draft IDs',()=>{
 for(const lang of ['es','en','pt','ja']){const stories=lessonList.filter(l=>l.language===lang&&l.visualStory);assert.equal(stories.length,5);
 for(const l of stories){assert.equal(l.questions.length,8);assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer)).score,100);const id=l.id+'-checkpoint';for(const seed of ['v1-visual-check-12345','v1-visual-check-67890']){const v=getLessonVariant(id,seed);assert.equal(v.questions.length,4);assert.equal(gradeLesson(id,v.questions.map(q=>q.answer),seed).score,100);}}}
 assert.ok(getLessonVariant('subjunctive'));assert.ok(getLessonVariant('ja-script-v1-hiragana-0'));
});
