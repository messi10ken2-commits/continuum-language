import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {default:Media}=await vite.ssrLoadModule('/LessonMedia.jsx'),{default:Prompt}=await vite.ssrLoadModule('/QuestionPrompt.jsx'),{setInterfaceLanguage,t}=await vite.ssrLoadModule('/interface-runtime.mjs'),{getLesson}=await vite.ssrLoadModule('/course.mjs');
 test('Spanish listening recap has one model and no English title/audio in all display languages',()=>{
  for(const locale of ['en','ja','es','pt','zh','fr']){setInterfaceLanguage(locale,{persist:false});const html=renderToStaticMarkup(React.createElement(Media,{lesson:getLesson('directions')}));assert.equal((html.match(/Sigue todo recto y luego gira a la izquierda\./g)||[]).length,1);assert.ok(!html.includes('Find your way'));assert.ok(!html.includes('en-US'));assert.ok(!html.includes('visual-steps'));if(locale!=='en')assert.ok(!html.includes('>Example<'));}
 });
 test('short question headings precede media and preserve target sentence and constraints',()=>{
  const question={prompt:"Complete the model with the lesson's wording.\nSigue ____ y luego gira a la izquierda.\nWrite only the missing phrase."};
  for(const locale of ['en','ja','es','pt','zh','fr']){setInterfaceLanguage(locale,{persist:false});const html=renderToStaticMarkup(React.createElement(Prompt,{question,lesson:{language:'es',locale:'es-ES'}},React.createElement('img',{src:'/fixture.webp',alt:'fixture'})));assert.ok(html.indexOf('<h1>')<html.indexOf('<img'));assert.ok(html.includes('Sigue ____ y luego gira a la izquierda.'));assert.ok(html.includes('question-cloze'));assert.ok(!html.includes("Complete the model with the lesson"));assert.ok(html.includes(t('Complete the model.')));}
 });
}finally{await vite.close()}
