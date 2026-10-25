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
 const {default:SelfStudy}=await vite.ssrLoadModule('/SelfStudy.jsx');
 const {lessonList,chapters}=await vite.ssrLoadModule('/course.mjs');
 const {reviewedCourseTitles}=await vite.ssrLoadModule('/reviewed-course-titles.mjs');
 const escaped=text=>renderToStaticMarkup(React.createElement('span',null,text)).slice(6,-7);
 for(const locale of ['ja','es','pt','zh','fr']){
  setInterfaceLanguage(locale,{persist:false});
  for(const language of ['es','en','pt','ja'])for(const level of ['A1','A2','B1','B2','C1']){
   store.set('continuumCourseLevel'+(language==='es'?'':':'+language),level);
   const html=render(SelfStudy,{language,attempts:[],onStart(){},onExit(){},onComplete(){}});assert.ok(!html.includes('Build your '),locale+' '+language+' '+level+' course band description');
   for(const chapter of chapters.filter(c=>(c.language||'es')===language&&!c.legacy&&c.level===level)){
    assert.ok(html.includes(escaped(reviewedCourseTitles[locale][chapter.title])),locale+': '+chapter.title);
    assert.ok(html.includes(escaped(reviewedCourseTitles[locale][chapter.goal])),locale+': '+chapter.goal);
   }
   for(const lesson of lessonList.filter(l=>(l.language||'es')===language&&l.level===level))assert.ok(html.includes(escaped(reviewedCourseTitles[locale][lesson.title])),locale+': '+lesson.title);
   if(['ja','zh'].includes(locale))assert.ok(!html.includes(' MIN'));assert.ok(!html.includes('Explanation + guided practice'));
  }
  for(const source of ['Interpret a qualified endorsement','Write a synthesis with limits','Report an inferred completed event']){
   const lesson=lessonList.find(l=>l.title===source);
   const html=render(SelfStudy,{language:'ja',activeLesson:lesson.id,attempts:[],onStart(){},onExit(){},onComplete(){}});
   assert.ok(html.includes('<h1>'+escaped(reviewedCourseTitles[locale][source])+'</h1>'));
  }
 }
 const {default:LanguageOverview}=await vite.ssrLoadModule('/LanguageOverview.jsx');
 const pressure=lessonList.find(l=>l.title==='Work under pressure');
 for(const locale of ['ja','es','pt','zh','fr']){
  setInterfaceLanguage(locale,{persist:false});
  const html=render(LanguageOverview,{language:'en',memory:true,attempts:[{lesson:pressure.id,score:80,total:5,at:'2026-10-14T12:00:00Z'}],onPractice(){},onNavigate(){}});
  const title=escaped(reviewedCourseTitles[locale][pressure.title]);
  assert.ok(html.includes('<h2>'+title+'</h2>'));assert.equal((html.match(/class="record-timeline"/g)||[]).length,1);assert.ok(html.includes('<strong>'+title+'</strong>'));assert.ok(!html.includes('>Work under pressure<'));
 }
 setInterfaceLanguage('en',{persist:false});
 console.log('PASS: six-language account screens, 100 translated roadmaps, all course headings and chapter goals, and the reported lesson titles render correctly.');
}finally{await vite.close();}
