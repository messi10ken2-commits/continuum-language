import test from 'node:test';import assert from 'node:assert/strict';import {createServer} from 'vite';import {renderToStaticMarkup} from 'react-dom/server';import React from 'react';import {getLesson,lessonList} from './course.mjs';import {lightActivities,lightRoundCount} from './light-learning-model.mjs';
test('retrieval prompts keep the solution off the page; Latin grammar is contextual, not letter copying',async()=>{const vite=await createServer({configFile:false,server:{middlewareMode:true,watch:null,hmr:false},appType:'custom'});try{const {LightChallengePrompt}=await vite.ssrLoadModule('/LightLesson.jsx');let counts={};for(const lesson of lessonList)for(let round=0;round<lightRoundCount(lesson);round++)for(const a of lightActivities(lesson,round)){if(!['build','translate','listen'].includes(a.type)||counts[a.type]>=40)continue;const html=renderToStaticMarkup(React.createElement(LightChallengePrompt,{activity:a,lesson,language:lesson.language||'es'}));assert.ok(!html.includes('>'+a.model+'<'),lesson.id+' leaked '+a.model);assert.ok(!html.includes('Use the model to help you.'));counts[a.type]=(counts[a.type]||0)+1;}assert.equal(counts.build,40);assert.equal(counts.translate,40);assert.equal(counts.listen,40);const subj=getLesson('subjunctive'),items=lightActivities(subj,1);assert.ok(items.some(a=>a.type==='context'&&a.question.prompt.includes('Dudo que el vuelo ___')));assert.ok(!items.some(a=>a.type==='build'));}finally{await vite.close()}});

test('each language renders its own town, reward art, and the selected companion',async()=>{
 const {learningLanguageIds}=await import('./languages.mjs');
 const {townRewardAt}=await import('./light-town.mjs');
 const {townArt,townRewardImage}=await import('./light-town-art.mjs');
 const {access}=await import('node:fs/promises');
 const vite=await createServer({configFile:false,server:{middlewareMode:true,watch:null,hmr:false},appType:'custom'});
 try{
  const {TownScene,TownRewardArt,TownRewardScene,TownOpening}=await vite.ssrLoadModule('/LightTown.jsx');
  const scenes=new Set();
  for(const language of learningLanguageIds){
   const art=townArt(language);
   scenes.add(art.stages.at(-1));
   assert.equal(art.stages.length,language==='es'?5:3);
   const collection=Array.from({length:10},(_,index)=>townRewardAt(index));
   const html=renderToStaticMarkup(React.createElement(TownScene,{language,kind:'capybara',collection,highlight:9}));
   assert.ok(html.includes(art.stages.at(-1)),language);
   assert.ok(html.includes('/light-town/rose-planter.webp'),language);
   assert.ok(html.includes('/light-town/capybara.webp'),language);
   assert.equal((html.match(/class="town-decoration"/g)||[]).length,9,language);
   assert.match(html,/--town-reward-hue:27deg/);
   for(const [built,asset] of art.stages.entries()){
    await access(new URL('public'+asset,import.meta.url));
    const phase=renderToStaticMarkup(React.createElement(TownScene,{language,built}));
    assert.deepEqual(art.stages.filter(url=>phase.includes(url)),[asset],language);
   }
   const newest=collection.at(-1);
   const reveal=renderToStaticMarkup(React.createElement(TownRewardScene,{language,item:newest,collection,placements:[],built:art.stages.length-1}));
   assert.match(reveal,/data-placed="true"/);
   assert.match(reveal,/Placed in town/);
   assert.match(reveal,/data-new="true"/);
   assert.ok(reveal.includes(townRewardImage(language,newest)));
   const savedColor=renderToStaticMarkup(React.createElement(TownRewardScene,{language,item:newest,collection,placements:[{slot:0,rewardIndex:0}]}));
   assert.match(savedColor,/data-placed="false"/);
   assert.doesNotMatch(savedColor,/Placed in town|data-new="true"/);
   assert.match(renderToStaticMarkup(React.createElement(TownOpening,null,React.createElement(TownScene,{language}))),/town-opening-frame/);
   for(const item of collection.slice(0,9)){
    const asset=townRewardImage(language,item);
    await access(new URL('public'+asset,import.meta.url));
    const reward=renderToStaticMarkup(React.createElement(TownRewardArt,{language,item}));
    assert.ok(reward.includes(asset),language);
    assert.equal((reward.match(/<img /g)||[]).length,1);
    assert.doesNotMatch(reward,/<svg|props\.webp/);
   }
  }
  assert.equal(scenes.size,learningLanguageIds.length);
 }finally{await vite.close()}
});
