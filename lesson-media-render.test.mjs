import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {visualLessons} from './visual-course.mjs';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
try{
 const {default:SelfStudy}=await vite.ssrLoadModule('/SelfStudy.jsx');
 for(const l of visualLessons.filter(x=>!x.checkpoint)){
  const render=()=>renderToStaticMarkup(React.createElement(SelfStudy,{language:l.language,activeLesson:l.id,attempts:[],onStart(){},onExit(){},onComplete(){}}));
  const intro=render();assert.ok(intro.includes('Enlarge lesson image'));assert.ok(intro.includes('Visual learning format'));assert.ok(intro.includes('Think first'));assert.ok(intro.includes('8 questions'));
  storage.set('continuumLessonDrafts',JSON.stringify({[l.id]:[]}));const quiz=render();assert.ok(quiz.includes('question-card'));assert.ok(quiz.includes('visual-practice-photo'));assert.ok(quiz.includes('Show transcript'));assert.ok(!quiz.includes('visual-focus'));storage.clear();
 }
 console.log('PASS: 20 new visual intros and exercise screens; lesson recap does not leak into the exercise answer area.');
}finally{await vite.close();delete globalThis.localStorage;}
