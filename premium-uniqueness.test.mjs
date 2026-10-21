import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,getLesson} from './course.mjs';
import {premiumCourses} from './premium-courses.mjs';
const media=c=>c?.youtubeId?'youtube:'+c.youtubeId:c?.src||c?.source;
const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();
const signature=q=>JSON.stringify([normalize(q.context||q.audio),q.options?.map(normalize),q.answer]);
test('Every Premium video source is distinct from ordinary lessons and other Premium video courses',()=>{
 const ordinary=new Set(lessonList.map(l=>media(getLesson(l.id)?.conversation)).filter(Boolean));const seen=new Set();
 for(const c of premiumCourses.filter(c=>c.conversation)){const id=media(c.conversation);assert.ok(id);assert.ok(!ordinary.has(id),c.id+' reuses a normal lesson video');assert.ok(!seen.has(id),c.id+' repeats a Premium video');seen.add(id);assert.equal(c.contentVersion,3);assert.ok(c.id.endsWith('video-v2'));}
 assert.equal(seen.size,4);
});
test('Premium exercises do not duplicate complete normal-lesson exercises',()=>{
 const normal=new Set(lessonList.flatMap(l=>getLesson(l.id)?.questions||[]).filter(q=>q.context||q.audio||q.options?.length).map(signature));
 for(const c of premiumCourses)for(const q of c.questions)if(q.context||q.audio||q.options?.length)assert.ok(!normal.has(signature(q)),c.id+': '+q.prompt);
});
test('Known inaccurate Kansai synthesis is removed and human pronunciation sources are visible',()=>{
 const c=premiumCourses.find(c=>c.language==='ja'&&c.scene==='varieties');assert.ok(!c.questions.some(q=>q.audioLocale==='ja-JP-kansai'||q.audioKind==='regional-synthesis'));
 assert.ok(c.nativeReferences.some(s=>s.label.includes('おおきに')));assert.ok(c.nativeReferences.some(s=>s.label.includes('なんぼ')));assert.ok(c.nativeReferences.every(s=>new URL(s.url).hostname==='www.sbs.com.au'));
 assert.equal(c.questions[0].nativeReference,c.nativeReferences[0]);
});
