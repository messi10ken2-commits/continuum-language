import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {expandedVideoLessons} from './expanded-video-course.mjs';
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {default:SelfStudy}=await vite.ssrLoadModule('/SelfStudy.jsx');
 const {JourneyLayoutContext}=await vite.ssrLoadModule('/JourneyLayout.jsx');
 for(const layout of ['photo','illustrated'])for(const lesson of expandedVideoLessons){
  const render=()=>renderToStaticMarkup(React.createElement(JourneyLayoutContext.Provider,{value:{layout}},React.createElement(SelfStudy,{language:lesson.language,activeLesson:lesson.id,attempts:[],onStart(){},onExit(){},onComplete(){}})));
  const intro=render();assert.ok(intro.includes('External video is paused for privacy'),lesson.id);assert.ok(intro.includes(lesson.conversation.youtubeId));assert.ok(intro.includes('Your listening guide'));
  storage.set('continuumLessonDrafts',JSON.stringify({[lesson.id]:[]}));storage.set('continuumTestSeeds',JSON.stringify({[lesson.id]:lesson.exerciseVersion}));
  const exercise=render();assert.ok(exercise.includes('question-card'));assert.ok(exercise.includes('Source-focus check:'));assert.ok(!exercise.includes('official episode transcript'));assert.ok(exercise.includes('Check answer'));
  storage.clear();
 }
 console.log('PASS: all 30 video lessons render introductions and questions in both layouts with consent and accurate source labels.');
}finally{await vite.close();}
