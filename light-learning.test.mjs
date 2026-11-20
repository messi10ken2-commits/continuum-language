import test from 'node:test';import assert from 'node:assert/strict';
import {lessonList} from './course.mjs';import {legacyLightActivities,v2LightActivities,priorLightVersion,lightActivities,lightModels,lightRoundCount,lightAnswer,lightCorrect,validLightState,lightVersion,lightVersionFor,lightLessonPassed,lightLessonVersion,previousLightLessonVersion} from './light-learning-model.mjs';import {lightLearningCopy} from './light-learning-copy.mjs';import {translationSource} from './localization-corpus.mjs';
test('every regular lesson across ten languages has a bounded, answerable authored guided session; tests remain Standard',()=>{
 const languages=new Set();for(const lesson of lessonList){const before=JSON.stringify(lesson),items=legacyLightActivities(lesson);if(lesson.checkpoint||lesson.summaryTest){assert.equal(items.length,0);continue}languages.add(lesson.language||'es');assert.ok(items.length>=2&&items.length<=4,lesson.id);const state={version:lightVersion,steps:[],choice:null,hint:false,checked:false};
  for(const a of items){const answer=a.type==='observe'?true:['meaning','video'].includes(a.type)?a.meaning:a.model;assert.ok(lightCorrect(a,answer),lesson.id);if(a.type==='build'){const indexes=a.tokens.map((_,i)=>i).reverse();assert.ok(lightCorrect(a,lightAnswer(a,indexes)),lesson.id)}if(a.meaning&&!a.meaningNative)assert.ok(translationSource(a.meaning,lesson.language||'es'),lesson.id+' must translate its meanings');state.steps.push({answer,hint:true});}assert.ok(validLightState(items,state),lesson.id);assert.equal(JSON.stringify(lesson),before,'must never modify the Standard lesson');}
 assert.equal(languages.size,10);
});
test('Light UI copy has all nine non-English display translations and preserves interpolation',()=>{for(const [text,locales] of Object.entries(lightLearningCopy))for(const locale of ['ja','es','pt','zh','fr','ko','id','ru','ar']){assert.ok(locales[locale],text+' '+locale);if(!(text==='Standard'&&locale==='fr'))assert.notEqual(locales[locale],text,text+' '+locale);for(const match of text.match(/\{\d+\}/g)||[])assert.ok(locales[locale].includes(match));}});

test('Light phrase reconstruction uses one intact authored sentence rather than a multi-sentence paragraph',()=>{const lesson=lessonList.find(l=>l.example==='Hola, me llamo Ana. Soy de México y vivo en Madrid.');assert.ok(lesson);const a=legacyLightActivities(lesson).find(a=>a.type==='build');assert.equal(a.model,'Hola, me llamo Ana.');assert.equal(a.tokens.length,4);assert.equal(lesson.example,'Hola, me llamo Ana. Soy de México y vivo en Madrid.');});

import {lightRoute,lightRouteStats,nextLightLesson} from './light-route.mjs';
import {learningLanguageIds} from './languages.mjs';
test('standalone Light covers every regular lesson and model in short complete rounds with independent XP',()=>{
 let count=0;for(const lesson of lessonList){if(!lightRoundCount(lesson))continue;const models=new Set(),rounds=lightRoundCount(lesson);for(let round=0;round<rounds;round++){const items=lightActivities(lesson,round);assert.ok(items.length>=5&&items.length<=6,lesson.id);const state={version:lightVersionFor(lesson),round,steps:[],choice:null,hint:false,checked:false};for(const a of items){assert.notEqual(a.type,'observe','model previews are not questions');if(a.source==='model')models.add(a.model);if(a.type==='build')assert.ok(a.tokens.length<=10);else {assert.ok(a.options.length>=2);assert.equal(new Set(a.options).size,a.options.length,lesson.id+' duplicate choices');}const answer=a.type==='observe'?true:['meaning','video','recall','translate','listen','context','confirm','video-confirm'].includes(a.type)?a.meaning:a.model;assert.ok(lightCorrect(a,answer));state.steps.push({answer,hint:false,...(state.version===lightLessonVersion?{missed:false}:{})});}assert.ok(validLightState(items,state));count++;}}
 for(const language of learningLanguageIds){const route=lightRoute(language);assert.equal(route.length,lessonList.filter(l=>(l.language||'es')===language&&lightRoundCount(l)).length);const completed=route.flatMap(row=>Array.from({length:row.legacyRounds},(_,round)=>({lesson:row.lesson.id,round})));const stats=lightRouteStats(route,[...completed,...completed]);assert.equal(stats.done,stats.total);assert.ok(stats.xp>0);assert.equal(stats.xp,lightRouteStats(route,completed).xp,'replaying cannot farm XP');}assert.ok(count>2000);
});

test('Light pairs full authored phrases with their sentence meanings rather than a cloze fragment',()=>{for(const language of ['zh','ko','fr','de','ar','it']){const lesson=lessonList.find(l=>l.language===language&&l.vocabulary?.[0]?.phrase);const a=lightActivities(lesson).find(a=>a.source==='model'&&a.meaning===lesson.vocabulary[0].meaning);assert.equal(a.model,lesson.vocabulary[0].phrase);assert.equal(a.meaning,lesson.vocabulary[0].meaning);}});

test('new Light challenges never spell out a one-word Latin answer and retain versioned v2 grading',()=>{for(const lesson of lessonList){for(let round=0;round<lightRoundCount(lesson);round++){for(const a of lightActivities(lesson,round)){if(a.type==='build'){assert.ok(!(/^[\p{Script=Latin}\p{M}\p{P}]+$/u.test(a.model)),lesson.id+' must test meaning or context, not spell a visible word');assert.notEqual(a.tokens.join(a.joiner),a.model,lesson.id+' tiles must be shuffled');}if(a.type==='translate')assert.ok(a.promptMeaning);if(a.type==='context')assert.ok(a.question.prompt);}}assert.deepEqual(lightActivities(lesson,0,priorLightVersion),lesson.immersive?[]:v2LightActivities(lesson));}});

test('Spanish comprehension labels stay in written questions and out of Light audio and target-language distractors',()=>{
 const cases={
  connectors:'Contrast.',
  'past-events':'Visiting the museum.',
  'preterite-lab':'I went.',
  'future-simple-lab':'A guess about the current time.'
 };
 for(const [id,label] of Object.entries(cases)){
  const lesson=lessonList.find(item=>item.id===id);
  assert.notEqual(lightVersionFor(lesson),lightVersion);
  assert.ok(lightModels(lesson,{historical:true}).some(model=>model.model===label),id);
  assert.ok(!lightModels(lesson).some(model=>model.model===label),id);
  let foundWritten=false;
  for(let round=0;round<lightRoundCount(lesson);round++)for(const activity of lightActivities(lesson,round)){
   if(activity.options?.includes(label)){
    assert.equal(activity.type,'context',id);
    assert.equal(activity.optionsNative,false,id);
    assert.equal(activity.audio,undefined,id);
    foundWritten=true;
   }
   if(activity.source==='model')assert.notEqual(activity.model,label,id);
  }
  assert.ok(foundWritten,id);
 }
});

test('new and saved single Light lessons remain answerable and need 80% first-try accuracy',()=>{
 for(const language of learningLanguageIds){
  const route=lightRoute(language);
  for(const [i,{lesson}] of route.entries()){
   const items=lightActivities(lesson,0,lightLessonVersion);
   // New immersion IDs have no historical v5 attempt; old lessons keep their exact saved contract.
   assert.deepEqual(lightActivities(lesson,0,previousLightLessonVersion),lesson.immersive?[]:lightActivities(lesson));
   assert.ok(items.length===5||items.length===6,lesson.id);
   const segmenter=new Intl.Segmenter(lesson.locale||'en',{granularity:'sentence'});
   const spokenCounts=new Map();
   for(const activity of items){
    const answer=activity.type==='build'?activity.model:activity.meaning;
    assert.ok(lightCorrect(activity,answer),lesson.id);
    if(activity.type!=='build')assert.ok(activity.options.length>=2&&activity.options.includes(answer),lesson.id);
    const text=activity.source==='model'?activity.model:activity.audio;
    if(!text)continue;
    const keys=new Set(Array.from(segmenter.segment(text),part=>part.segment.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}\p{M}]+/gu,' ').trim()));
    for(const key of keys){
     const count=(spokenCounts.get(key)||0)+1;
     assert.ok(count<=2,lesson.id+' repeats '+key);
     spokenCounts.set(key,count);
    }
   }
   assert.deepEqual(lightActivities(lesson,1,lightLessonVersion),[]);
   assert.equal(nextLightLesson(lesson),route[i+1]?.lesson.id);
  }
 }
 for(const total of [5,6]){
  const steps=Array.from({length:total},(_,index)=>({missed:index===0}));
  assert.equal(lightLessonPassed(steps,total),true);
  assert.equal(lightLessonPassed(steps.slice(1),total),false);
  steps[1]={missed:true};
  assert.equal(lightLessonPassed(steps,total),false);
 }
});

test('the Portuguese rhythm lesson uses several targets instead of recycling its opening sentence',()=>{
 const lesson=lessonList.find(item=>item.id==='pt-sound-v1-1-1');
 const items=lightActivities(lesson,0,lightLessonVersion);
 assert.equal(items.length,6);
 assert.ok(items.filter(item=>[item.model,item.audio].some(text=>text?.includes('Os amigos chegaram ao Brasil'))).length<=2);
 for(const phrase of ['Brasil','os amigos']){
  assert.ok(items.some(item=>item.model===phrase||item.question?.prompt.includes(phrase)),phrase);
 }
 assert.ok(items.some(item=>item.type==='listen'));
 assert.ok(items.some(item=>item.type==='build'));
});
