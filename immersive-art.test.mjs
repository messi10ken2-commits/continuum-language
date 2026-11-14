import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {lessonList} from './course.mjs';
import {immersiveSceneArt} from './immersive/scene-art.mjs';
test('all added chapter lessons have existing, mode-appropriate still artwork independent of answers',()=>{
 for(const lesson of lessonList.filter(l=>l.immersive))for(const layout of ['photo','illustrated']){
  const src=immersiveSceneArt(lesson,layout);
  assert.ok(existsSync(new URL('./public'+src,import.meta.url)),lesson.id+': '+src);
  assert.equal(src.startsWith('/illustrated-lessons/'),layout==='illustrated');
  assert.ok(!src.includes('/light-town/'));
  assert.equal(immersiveSceneArt({...lesson,questions:[],title:'unrelated question',example:'different answer'},layout),src);
 }
});
