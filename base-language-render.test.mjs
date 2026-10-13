import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {baseLanguages,translate} from './base-language.mjs';
import {getLesson,lessonList} from './course.mjs';
import {localizeLesson} from './lesson-localizations.mjs';

const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {BaseLanguageProvider}=await vite.ssrLoadModule('/BaseLanguageContext.jsx');
 const {default:LessonReference}=await vite.ssrLoadModule('/LessonReference.jsx');
 for(const {id} of baseLanguages){
  const lesson=localizeLesson(getLesson('food-vocabulary'),id);
  const html=renderToStaticMarkup(React.createElement(BaseLanguageProvider,{language:id},React.createElement(LessonReference,{lesson})));
  assert.ok(html.includes(translate(id,'reference.vocabulary')),id);
  assert.ok(html.includes('Quisiera una barra de pan.'),id);
  assert.ok(html.includes('lang="es-ES"'),id);
 }
 // Every base language must leave every target language's grading inputs intact.
 for(const lesson of lessonList){
  const before=JSON.stringify(lesson);
  for(const {id} of baseLanguages){
   const localized=localizeLesson(lesson,id);
   assert.equal(localized.id,lesson.id);
   assert.equal(localized.level,lesson.level);
   assert.equal(localized.language,lesson.language);
   assert.equal(localized.locale,lesson.locale);
   for(let index=0;index<(lesson.questions?.length||0);index++){
    const {note:originalNote,...original}=lesson.questions[index];
    const {note:localizedNote,...actual}=localized.questions[index];
    assert.deepEqual(actual,original,`${lesson.id}/${id}/${index}`);
   }
  }
  assert.equal(JSON.stringify(lesson),before,lesson.id+' mutated');
 }
 console.log('PASS: six base-language reference screens and grading preservation across every course lesson.');
}finally{await vite.close();}
