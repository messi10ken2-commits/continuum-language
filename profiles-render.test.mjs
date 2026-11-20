import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {Welcome,ProfileEditor,TeacherCard}=await vite.ssrLoadModule('/Profiles.jsx');
 const render=(component,props)=>renderToStaticMarkup(React.createElement(component,props));
 const welcome=render(Welcome,{});assert.match(welcome,/I want to learn/);assert.match(welcome,/I want to teach/);assert.match(welcome,/Already a member/);
 for(const startMode of ['manual','assessment']){const html=render(ProfileEditor,{user:{name:'Test learner',role:'learner'},record:{profile:{name:'Test learner',languages:['ja'],primaryLanguage:'ja',level:'B2',startMode,goal:''}}});assert.match(html,/Japanese/);assert.match(html,startMode==='manual'?/Save &amp; start learning/:/Save &amp; take placement test/);assert.doesNotMatch(html,/Teaching experience/);}
 const teacher=render(ProfileEditor,{user:{name:'Test teacher',role:'teacher'},record:{}});for(const text of ['Profile photo','Teaching experience','Private notes','Submit for review','Save draft'])assert.ok(teacher.includes(text));
 const card=render(TeacherCard,{teacher:{id:'test',profile:{name:'Test',languages:['es'],bio:'Hello',credentialNotes:'NEVER PUBLIC',video:'https://youtu.be/example'}}});assert.doesNotMatch(card,/NEVER PUBLIC/);assert.match(card,/Spanish/);
 console.log('PASS: role selection, learner manual/assessment routes, teacher application fields and public profile rendering.');
}finally{await vite.close()}
