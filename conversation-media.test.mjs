import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {lessonList,gradeLesson} from './course.mjs';
import {conversationLessons} from './conversation-course.mjs';
import {questionScene,photoFor} from './lesson-media.mjs';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
try{
 const {default:SelfStudy}=await vite.ssrLoadModule('/SelfStudy.jsx');
 for(const l of lessonList){
  const props={language:l.language||'es',activeLesson:l.id,attempts:[],onStart(){},onExit(){},onComplete(){}};
  const render=()=>renderToStaticMarkup(React.createElement(SelfStudy,props));
  const intro=render();assert.ok(intro.includes(l.conversation?.provider==='youtube'?'class="conversation-embed"':l.conversation?'poster="/lesson-media/voa-':'<img'),l.id+' intro image');
  storage.set('continuumLessonDrafts',JSON.stringify({[l.id]:[]}));
  const exercise=render();assert.ok(exercise.includes(l.conversation?'Conversation video:':'Enlarge page image'),l.id+' practice visual');
  assert.ok(!exercise.includes('visual-focus'),l.id+' no recap answers in exercise');storage.clear();
 }
 for(const l of conversationLessons){
  assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer)).score,100);
  assert.ok(l.questions.every(q=>q.video&&!q.audio));
  if(l.conversation.provider==='youtube'){
   assert.match(l.conversation.youtubeId,/^[A-Za-z0-9_-]{11}$/);
   assert.equal(l.conversation.source,`https://www.youtube.com/watch?v=${l.conversation.youtubeId}`);
   assert.ok(l.conversation.phrases.length>=4);
   assert.ok(l.questions.every(q=>q.languagePractice));
   const {default:Player}=await vite.ssrLoadModule('/ConversationVideo.jsx');
   const markup=renderToStaticMarkup(React.createElement(Player,{lesson:l}));
   assert.ok(markup.includes('strict-origin-when-cross-origin'));
   assert.ok(markup.includes('Open original video'));
   assert.ok(markup.includes('not a transcript'));
   assert.ok(!markup.includes('autoplay'));
   assert.ok(!markup.includes('Read the dialogue transcript'));
  }else{
   assert.ok(l.conversation.transcript.length>5);
   assert.ok(l.conversation.src.startsWith('https://voa-video-ns.akamaized.net/'));
  }
 }
 assert.deepEqual([...new Set(conversationLessons.map(l=>l.language))].sort(),['en','es','ja','pt']);
 const lesson={title:'Past tense'};
 assert.equal(photoFor(questionScene(lesson,{prompt:'At the airport',options:['food','work'],answer:0})),photoFor(questionScene(lesson,{prompt:'At the airport',options:['food','work'],answer:1})));
 console.log(`PASS: images on introductions and exercises for all ${lessonList.length} activities; real-conversation grading and no answer-dependent photos.`);
}finally{await vite.close();delete globalThis.localStorage;}
