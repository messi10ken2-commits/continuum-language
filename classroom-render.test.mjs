import assert from 'node:assert/strict';import fs from 'node:fs';
import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {createServer} from 'vite';import {parse} from '@babel/parser';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {AssignmentCard,BookingCard,SharedClassNoteEditor,AssignmentBuilder,classroomLabel}=await vite.ssrLoadModule('/ClassWorkspace.jsx');const {t,setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');const {classroomCopy,classroomTerms}=await vite.ssrLoadModule('/classroom-copy.mjs');
 const copyKeys=new Set(Object.keys(classroomCopy));function strings(n){if(n?.type==='StringLiteral'&&n.value)copyKeys.add(n.value);if(n?.type==='ConditionalExpression'){strings(n.consequent);strings(n.alternate)}}function walk(n){if(!n||typeof n!=='object')return;if(n.type==='CallExpression'&&n.callee.name==='t')strings(n.arguments[0]);for(const v of Object.values(n))if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v)}walk(parse(fs.readFileSync('ClassWorkspace.jsx','utf8'),{sourceType:'module',plugins:['jsx']}));
 const user={id:'learner',role:'learner'},teacher={id:'teacher',role:'teacher'},thread={id:'thread',teacherId:'teacher',learnerId:'learner',teacher:'A Teacher',learner:'A Learner',language:'en',active:true};
 for(const display of ['en','ja','es','pt','zh','fr']){
  setInterfaceLanguage(display,{persist:false});if(display!=='en')for(const key of copyKeys)if(classroomTerms.has(key))assert.equal(classroomLabel(key),classroomCopy[key][display]);else if(t(key)===key)assert.equal(classroomCopy[key]?.[display],key,display+': '+key);
  const a={id:'assignment',...thread,title:'Past perfect',instructions:'Tell a story using I had already left.',lessonId:'en-b1-v2-lesson-6',lessonTitle:'An earlier past',status:'reviewed',response:'I had already left. <script>untrusted()</script>',feedback:'Good contrast: I had left / I left.',revision:2};
  for(const person of [user,teacher]){
   const html=renderToStaticMarkup(React.createElement(AssignmentCard,{assignment:a,user:person,zone:'Asia/Kuala_Lumpur',onPractice(){},onChanged(){}}));assert.ok(html.includes('I had already left.'));assert.ok(!html.includes('<script>untrusted'));assert.ok(html.includes('&lt;script&gt;untrusted'));assert.ok(html.includes(a.instructions));assert.ok(html.includes(a.feedback));
   const b={id:'booking',...thread,topic:'A class topic',startsAt:'2026-10-20T12:00:00Z',endsAt:'2026-10-20T12:50:00Z',status:'confirmed',proposedBy:'learner',meetingUrl:'https://meet.google.com/abc-defg-hij'};const card=renderToStaticMarkup(React.createElement(BookingCard,{booking:b,user:person,zone:'Asia/Kuala_Lumpur',onChanged(){},onOpen(){},onReschedule(){}}));assert.ok(card.includes('https://meet.google.com/abc-defg-hij'));assert.ok(card.includes('noopener noreferrer'));assert.equal(card.includes(t('Propose a new time')),person.role==='learner');
  }
  for(const language of ['en','es','pt','ja']){const html=renderToStaticMarkup(React.createElement(AssignmentBuilder,{thread:{...thread,language},user:teacher,zone:'Asia/Kuala_Lumpur',onChanged(){}}));assert.ok(html.includes('class-form'));assert.ok(html.includes('<select'));}
  assert.ok(renderToStaticMarkup(React.createElement(SharedClassNoteEditor,{note:{id:'note',focus:'Focus',note:'Actual shared words',revision:0},onChanged(){}})).includes('Actual shared words'));
 }
 console.log('PASS: six display languages have complete classroom UI copy, four teaching languages have assignment lesson selectors, user content stays unchanged and escaped, meeting links use safe new tabs.');
}finally{await vite.close()}
