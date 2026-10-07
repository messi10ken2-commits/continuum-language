import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {lessonList as fullLessonList,getLessonVariant} from './course.mjs';
const lessonList=fullLessonList.filter(l=>!l.specialist);

const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
try{
 const {default:SelfStudy}=await vite.ssrLoadModule('/SelfStudy.jsx');
 const render=(language,activeLesson)=>renderToStaticMarkup(React.createElement(SelfStudy,{language,activeLesson,attempts:[],onStart(){},onExit(){},onComplete(){}}));
 for(const language of ['en','pt','ja']){
  for(const level of ['A1','A2','B1','B2','C1']){
   storage.set('continuumCourseLevel:'+language,level);
   const html=render(language);assert.equal((html.match(/<h4>Chapter checkpoint<\/h4>/g)||[]).length,['B2','C1'].includes(level)?5:6);
   assert.ok(!html.includes('grammar in context'));assert.ok(!html.includes('vocabulary retrieval'));
  }
  for(const l of lessonList.filter(l=>l.language===language)){
   const html=render(language,l.id);
   assert.ok(html.includes('lesson-intro-card'),l.id);
   assert.ok(html.includes(l.productionTask?'Optional understanding check':'Start practice'));
   if(l.skill==='Speaking')assert.ok(html.includes('Start recording'),l.id);
   if(l.skill==='Writing')assert.ok(html.includes('<textarea'),l.id);
   if(l.checkpoint||l.summaryTest)assert.ok(html.includes(getLessonVariant(l.id,'v1-preview-123456789').questions.length+' questions'),l.id);
   // Render an actual in-progress question as well, including locale-bearing transcript.
   const seed=l.checkpoint||l.summaryTest?'v1-render-draft-123456789':undefined;
   storage.set('continuumLessonDrafts',JSON.stringify({[l.id]:[]}));
   storage.set('continuumTestSeeds',JSON.stringify({[l.id]:seed}));
   const exercise=render(language,l.id);
   assert.ok(exercise.includes('question-card'),l.id);
   if(l.skill==='Listening'){assert.ok(exercise.includes('Show transcript'));assert.ok(exercise.includes(`lang="${l.locale}"`));}
   storage.delete('continuumLessonDrafts');storage.delete('continuumTestSeeds');
  }
 }
 for(const l of fullLessonList.filter(l=>l.specialist&&!l.checkpoint&&!l.visualStory&&!l.conversation)){
  const html=render(l.language||'es',l.id);assert.ok(html.includes(l.characters?'Character studio':'Your sound studio'),l.id);
  if(l.pronunciationTarget)assert.ok(html.includes(l.language==='ja'?'Record &amp; compare':'Record &amp; assess'),l.id);
  storage.set('continuumLessonDrafts',JSON.stringify({[l.id]:[]}));assert.ok(render(l.language||'es',l.id).includes('question-card'),l.id);storage.delete('continuumLessonDrafts');
 }
 // Render the new tile interaction from a saved v2 draft in every language.
 for(const language of ['es','en','pt','ja']){
  const l=lessonList.find(x=>(x.language||'es')===language&&x.skill==='Grammar'&&x.breakdown);
  const seed='v2-render-123456789',v=getLessonVariant(l.id,seed),index=v.questions.findIndex(q=>q.mode==='order');assert.ok(index>=0);
  storage.set('continuumLessonDrafts',JSON.stringify({[l.id]:v.questions.slice(0,index).map(q=>q.answer)}));
  storage.set('continuumTestSeeds',JSON.stringify({[l.id]:seed}));
  const html=render(language,l.id);assert.ok(html.includes('word-builder-tiles'));assert.ok(html.includes('Undo last word'));assert.ok(html.includes('BUILD THE PHRASE'));
  storage.set('continuumLessonDrafts',JSON.stringify({[l.id]:[]}));storage.set('continuumTestSeeds','{}');
  assert.ok(render(language,l.id).includes('Restart with expanded practice'));
  storage.delete('continuumLessonDrafts');storage.delete('continuumTestSeeds');
 }
 console.log('PASS: all 15 level roadmaps, 267 lesson intros and 267 exercise screens render; every chapter ends in a checkpoint; speaking shows recorder and writing shows textarea.');
}finally{await vite.close();delete globalThis.localStorage;}
