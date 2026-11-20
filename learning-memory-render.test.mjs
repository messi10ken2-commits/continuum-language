import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {lessonList} from './course.mjs';
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {default:Overview}=await vite.ssrLoadModule('/LanguageOverview.jsx');
 for(const language of ['es','ja','pt','en']){
  const lesson=lessonList.find(l=>(l.language||'es')===language&&!l.checkpoint&&!l.summaryTest),props={language,user:null,attempts:[{id:'new',lesson:lesson.id,score:75,total:4,at:'2026-10-05'},{id:'old',lesson:lesson.id,score:50,total:4,at:'2026-10-01'}],notes:[{id:'note',focus:'Speaking in context',note:'Try a new situation.',at:'2026-10-02',language}],onNavigate(){},onPractice(){}};
  for(const memory of [false,true]){const html=renderToStaticMarkup(React.createElement(Overview,{...props,memory}));for(const marker of ['connected-memory-hero','Recurring patterns','record-score-ring','75%'])assert.ok(html.includes(marker),language+' '+marker);if(memory){for(const marker of ['Earliest saved','Latest saved','50%','record-timeline','Speaking in context'])assert.ok(html.includes(marker));assert.equal((html.match(/class="record-timeline"/g)||[]).length,1);assert.ok(!html.includes('What you have practised'));assert.ok(html.includes(lesson.skill));assert.ok(html.includes(new Date('2026-10-05').toLocaleDateString())&&html.includes(new Date('2026-10-01').toLocaleDateString()));assert.equal((html.match(/class="learning-log-entry"/g)||[]).length,3);}}
  const empty=renderToStaticMarkup(React.createElement(Overview,{...props,attempts:[],notes:[],memory:true}));assert.ok(empty.includes('Your learning timeline will grow with your activity.'));assert.ok(!empty.includes('100%'));
 }
 console.log('PASS: all four languages share record hero, score rings, lesson detail, earliest/latest scores, class timeline, recurring patterns and honest empty states.');
}finally{await vite.close();}
