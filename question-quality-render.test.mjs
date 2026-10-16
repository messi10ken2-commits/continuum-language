import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:SelfStudy}=await vite.ssrLoadModule('/SelfStudy.jsx');
 const {getLessonVariant}=await vite.ssrLoadModule('/course.mjs');
 const {setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');
 for(const [id,coverage] of [['en-b2-v2-lesson-3','table:0:0:1'],['en-c1-v2-lesson-5','application:3']]){
  let seed,lesson,index;
  for(let i=0;i<30;i++){seed='v6-render-quality-'+i+'-123456789';lesson=getLessonVariant(id,seed);index=lesson.questions.findIndex(q=>q.coverage===coverage);if(index>=0)break;}
  assert.ok(index>=0);const q=lesson.questions[index];
  store.set('continuumTestSeeds',JSON.stringify({[id]:seed}));store.set('continuumLessonDrafts',JSON.stringify({[id]:lesson.questions.slice(0,index).map(q=>q.answer)}));
  for(const locale of ['en','ja','es','pt','zh','fr']){
   setInterfaceLanguage(locale,{persist:false});const html=renderToStaticMarkup(React.createElement(SelfStudy,{language:'en',activeLesson:id,attempts:[],onStart(){},onExit(){},onComplete(){}}));
   const expected=renderToStaticMarkup(React.createElement('h1',null,q.promptTranslations[locale]));assert.ok(html.includes(expected),locale+': '+id);assert.ok(!html.includes('Complete with should:'));assert.ok(!html.includes('Complete this part of the lesson'));
  }
 }
 console.log('PASS: both reported question patterns render clearly in all six interface languages without giving the required answer.');
}finally{await vite.close();}
