import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {Welcome,ProfileEditor}=await vite.ssrLoadModule('/Profiles.jsx');
 const {Account}=await vite.ssrLoadModule('/main.jsx');
 const {default:LessonReference}=await vite.ssrLoadModule('/LessonReference.jsx');
 const {InterfaceLanguagePicker}=await vite.ssrLoadModule('/InterfaceLanguage.jsx');
 const {setInterfaceLanguage}=await vite.ssrLoadModule('/interface-runtime.mjs');
 const {interfaceCopy}=await vite.ssrLoadModule('/interface-copy.mjs');
 const {reviewedTranslation}=await vite.ssrLoadModule('/reviewed-interface-copy.mjs');
 const render=(Component,props)=>renderToStaticMarkup(React.createElement(Component,props));
 for(const locale of ['en','ja','es','pt','zh','fr']){
  setInterfaceLanguage(locale);const text=key=>locale==='en'?key:(reviewedTranslation(key,locale)||interfaceCopy[key][locale]);
  const welcome=render(Welcome,{});assert.ok(welcome.includes(text('I want to learn')));assert.ok(welcome.includes(text('I want to teach')));assert.ok(!welcome.includes('Explore lessons first'));
  const account=render(Account,{user:null,initialMode:'register',deviceHistory:[]});assert.ok(account.includes(text('Create account')));assert.ok(account.includes(text('Email')));assert.ok(account.includes('value="learner"'));assert.ok(account.includes('value="teacher"'));assert.ok(account.includes('minLength="12"')||account.includes('minlength="12"'));
  const profile=render(ProfileEditor,{user:{name:'Ken',role:'learner'},record:{}});assert.ok(profile.includes(text('Make this journey yours')));assert.ok(profile.includes(text('I’ll choose my level')));assert.ok(profile.includes('Ken'));
  const picker=render(InterfaceLanguagePicker,{});assert.equal((picker.match(/<option/g)||[]).length,6);assert.ok(picker.includes(text('Display language')));
  const lesson={id:'test',language:'en',locale:'en-US',vocabulary:[{term:'reservation',meaning:'booking',phrase:'make a reservation',example:'I have a reservation.',translation:'A room has been booked.'}]};
  const html=render(LessonReference,{lesson});for(const target of ['reservation','make a reservation','I have a reservation.'])assert.ok(html.includes(target));assert.ok(html.includes(text('Your vocabulary toolkit')));
 }
 console.log('PASS: welcome, registration, learner setup, six-language picker and unchanged target examples render in all six interface languages.');
}finally{await vite.close();}
