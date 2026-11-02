import test from 'node:test';import assert from 'node:assert/strict';
import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {createServer} from 'vite';
test('audio transport uses an icon and accessible playback label in both sizes',async()=>{
 const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{const {default:Audio}=await vite.ssrLoadModule('/SentenceAudio.jsx');for(const compact of [true,false]){const html=renderToStaticMarkup(React.createElement(Audio,{text:'Buenos días',lang:'es-ES',compact}));assert.match(html,/aria-label="Listen to this text"/);assert.match(html,/lucide-play/);assert.doesNotMatch(html,/<span>Listen<\/span>/);}}finally{await vite.close()}
});
test('Photo account renders actual identity, flags, course-level steps and saved languages without invented scores',async()=>{
 const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{const {default:Settings}=await vite.ssrLoadModule('/AccountSettings.jsx');const {JourneyLayoutContext}=await vite.ssrLoadModule('/JourneyLayout.jsx');const {ActivityContext}=await vite.ssrLoadModule('/LearningActivity.jsx');const user={id:'qa',role:'learner',name:'QA learner',email:'qa@example.test'};
 const render=language=>renderToStaticMarkup(React.createElement(JourneyLayoutContext.Provider,{value:{layout:'photo'}},React.createElement(ActivityContext.Provider,{value:{data:{studyDays:9,studyMs:6300000}}},React.createElement(Settings,{user,language,learnerProfile:{languages:['es','ja'],primaryLanguage:'es',level:'B1'},onProfile(){}}))));
 const html=render('es');assert.match(html,/qa@example.test/);assert.match(html,/🇪🇸/);assert.equal((html.match(/class="filled"/g)||[]).length,3);assert.match(html,/1.8/);assert.match(html,/hours studied/);assert.match(html,/🇯🇵/);assert.equal((render('ja').match(/class="filled"/g)||[]).length,0,'a Spanish profile must not establish a Japanese level');
 }finally{await vite.close()}
});
