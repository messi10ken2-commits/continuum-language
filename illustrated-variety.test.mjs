import test from 'node:test';import assert from 'node:assert/strict';import {existsSync} from 'node:fs';
import {illustratedHero,illustratedLanguages,illustratedLessonArt,regionalHeaderScenes} from './illustrated-art.mjs';
import {journeyChapters,journeyLevels} from './journey-model.mjs';
test('every additional language has separate contextual header scenes rather than repeated panoramas',()=>{
 for(const language of ['zh','ko','fr','de','ar','it']){
  const sources=Object.keys(regionalHeaderScenes).map(section=>illustratedHero(language,section));
  assert.equal(new Set(sources).size,sources.length);
  for(const src of sources){assert.ok(existsSync('public'+src),src);assert.ok(src.startsWith('/illustrated-lessons/'+language+'-'));}
 }
});
test('every visible course list avoids repeated neighbouring illustrations in all ten languages',()=>{
 for(const language of illustratedLanguages)for(const level of journeyLevels){
  const lessons=journeyChapters(language,level).flatMap(c=>c.lessons),recent=[],sources=new Set();
  for(const lesson of lessons){const art=illustratedLessonArt(lesson);assert.ok(existsSync('public'+art.src),art.src);assert.ok(!recent.slice(-2).includes(art.src),language+' '+level+' '+lesson.id+' repeats a nearby image');recent.push(art.src);sources.add(art.src);}
  assert.ok(sources.size>=6,language+' '+level+' needs varied scenes');
 }
});
test('Practice Studio uses the same six distinct card-image slots for every learning language',async()=>{
 const React=await import('react'),{renderToStaticMarkup}=await import('react-dom/server'),{createServer}=await import('vite');
 const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{const {illustratedScene}=await vite.ssrLoadModule('/JourneyLayout.jsx');
 const slots=['conversation','pronunciation','review','focus','classes','courses'];
 const expected=slots.map(slot=>illustratedScene('en',slot));
 assert.equal(new Set(expected).size,6);
 for(const language of illustratedLanguages){const images=slots.map(slot=>illustratedScene(language,slot));assert.equal(new Set(images).size,6);for(const src of images){assert.ok(existsSync('public'+src));assert.ok(!src.includes('country-worlds'));}if(language!=='ja')assert.deepEqual(images,expected);}
 }finally{await vite.close();}
});
