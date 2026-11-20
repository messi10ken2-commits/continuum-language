import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {lessonList} from './course.mjs';
import {translationRevision} from './reviewed-interface-copy.mjs';
import {translationKey} from './localization-corpus.mjs';
const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const locales=['ja','es','pt','zh','fr'];
const videos=['es','pt','ja','en'].map(language=>lessonList.find(l=>l.conversation&&(l.language||'es')===language));
const cache=locales.flatMap(locale=>videos.flatMap(l=>l.questions[0].options.map((o,i)=>[locale+':'+translationKey(o),locale+' translated video option '+i])));
store.set('continuumInterfaceTranslations:'+translationRevision,JSON.stringify(cache));
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:SelfStudy}=await vite.ssrLoadModule('/SelfStudy.jsx');
 const {setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');
 const {reviewedComprehensionOptions}=await vite.ssrLoadModule('/reviewed-comprehension-options.mjs');
 const esc=text=>renderToStaticMarkup(React.createElement('span',null,text)).slice(6,-7);
 const render=l=>{store.set('continuumLessonDrafts',JSON.stringify({[l.id]:[]}));store.set('continuumTestSeeds',JSON.stringify({[l.id]:l.exerciseVersion}));return renderToStaticMarkup(React.createElement(SelfStudy,{language:l.language||'es',activeLesson:l.id,attempts:[],onExit(){},onStart(){},onComplete(){}}));};
 for(const locale of locales){setInterfaceLanguage(locale,{persist:false});for(const language of ['es','pt','ja','en']){
  const visual=lessonList.find(l=>l.id===language+'-visual-v1-meeting');const html=render(visual);for(const o of visual.questions[0].options)assert.ok(html.includes(esc(reviewedComprehensionOptions[locale][o])),locale+': '+o);assert.ok(html.includes(visual.questions[0].audio));
 }
 for(const video of videos){const html=render(video);for(let i=0;i<3;i++)assert.ok(html.includes(locale+' translated video option '+i),locale+': '+video.id);}
 }
 console.log('PASS: visual and video comprehension options render in five display languages across four learning languages; target audio remains unchanged.');
}finally{await vite.close();}
