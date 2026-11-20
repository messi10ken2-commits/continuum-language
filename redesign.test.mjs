import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import postcss from 'postcss';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {languages} from './languages.mjs';
import {lessonList,chapters} from './course.mjs';
import {learningPhotoScenes} from './learning-art-families.mjs';

test('redesign CSS requires the opt-in application root, including inside media queries',async()=>{
 const css=postcss.parse(await readFile(new URL('./continuum-ui.css',import.meta.url),'utf8'));
 css.walkRules(rule=>{for(const selector of rule.selectors)assert.ok(selector.includes('.continuum-ui'),`Unscoped redesign selector: ${selector}`)});
 const app=await readFile(new URL('./main.jsx',import.meta.url),'utf8');
 assert.match(app,/const redesign=!\['Admin','Review teachers'\]\.includes\(tab\)/);
 assert.match(app,/\+\(redesign\?' continuum-ui/);
});

test('all ten learning languages have their own local attributed photographic landscape',async()=>{
 assert.equal(new Set(languages.map(l=>learningPhotoScenes[l.id])).size,10);
 const credits=JSON.parse(await readFile(new URL('./journey-photo-credits.json',import.meta.url),'utf8'));
 for(const language of languages){const id=learningPhotoScenes[language.id];assert.ok(credits.find(c=>c.id===id&&c.author&&c.licenseUrl));for(const size of ['','-small'])assert.ok((await stat(new URL('./public/journey-media/'+id+size+'.webp',import.meta.url))).size>1000);}
});

test('both course presentations expose every existing activity once, including checkpoints and scripts',async()=>{
 const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const {default:Catalog}=await vite.ssrLoadModule('/IllustratedCourse.jsx');
  const {JourneyLayoutContext}=await vite.ssrLoadModule('/JourneyLayout.jsx');
  for(const language of languages.map(l=>l.id))for(const level of ['A1','A2','B1','B2','C1']){
   const lessons=lessonList.filter(l=>(l.language||'es')===language),expected=lessons.filter(l=>l.level===level),list=chapters.filter(c=>(c.language||'es')===language&&!c.legacy);
   const ids=[];
   for(const layout of ['photo','illustrated']){
    const html=renderToStaticMarkup(React.createElement(JourneyLayoutContext.Provider,{value:{layout}},React.createElement(Catalog,{language,level,lessons,chapters:list,rows:{},drafts:{},nextLesson:expected[0],onStart(){},setLevel(){},total:expected.length})));
    const actual=[...html.matchAll(/data-lesson-id="([^"]+)"/g)].map(x=>x[1]);
    assert.deepEqual(actual.toSorted(),expected.map(l=>l.id).toSorted(),`${layout} ${language} ${level}`);
    assert.equal(new Set(actual).size,actual.length);ids.push(actual.toSorted());
    assert.match(html,/Open pronunciation studio/);
   }
   assert.deepEqual(ids[0],ids[1]);
  }
 }finally{await vite.close()}
});
