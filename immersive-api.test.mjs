import assert from 'node:assert/strict';
import {test} from 'node:test';
import {handleImmersiveAudio} from './immersive-api.mjs';
import {controlledFeatures} from './platform-controls.mjs';
import {loadImmersiveUnit} from './immersive/loader.mjs';
import {learningLanguageIds,languageInfo} from './languages.mjs';
function context(path,{method='GET',url=path}={}){
 const state={calls:[],limited:[]};
 return {state,args:{route:path,req:{method,url},res:{},pool:{query:()=>{throw Error('Unexpected database call in source lookup')}},send:(_r,status,data)=>{state.sent={status,data}},fail:(status,message)=>{throw Object.assign(Error(message),{status})},limited:(_req,key,n)=>state.limited.push({key,n}),serveAudio:async options=>{state.calls.push(options);return true}}};
}
test('authored audio uses only known native source text for every learning language',async()=>{
 for(const language of learningLanguageIds){
  const unit=await loadImmersiveUnit(language,'market');
  for(const stage of ['reading','listening','roleplay']){
   const route=`/api/immersive/audio/${language}-immersive-market-v1-${stage}/${stage}/2`,{args,state}=context(route,{url:route+'?text=untrusted+replacement'});
   assert.equal(await handleImmersiveAudio(args),true);assert.equal(state.calls.length,1);
   assert.equal(state.calls[0].text,stage==='roleplay'?unit.questions.roleplay[2].sceneLine:unit[stage][2].text);
   assert.equal(state.calls[0].locale,languageInfo(language).locale);assert.equal(state.limited.length,1);
  }
 }
});
test('text recovery is canonical, bounded and never synthesizes audio',async()=>{
 const route='/api/immersive/audio/ar-immersive-heat-v1-checkpoint/listening/5',{args,state}=context(route,{url:route+'?format=text'});
 assert.ok(await handleImmersiveAudio(args));assert.equal(state.calls.length,0);assert.equal(state.sent.status,200);assert.equal(state.sent.data.locale,'ar-SA');
 const unit=await loadImmersiveUnit('ar','heat');assert.equal(state.sent.data.text,unit.listening[5].text);
});
test('unknown lessons, path manipulation, out-of-range chunks and writes cannot request arbitrary synthesis',async()=>{
 for(const [path,method,status]of [
  ['/api/immersive/audio/missing/reading/0','GET',404],
  ['/api/immersive/audio/en-immersive-market-v1-reading/reading/99','GET',404],
  ['/api/immersive/audio/en-immersive-market-v1-reading/reading/-1','GET',404],
  ['/api/immersive/audio/../../private/reading/0','GET',404],
  ['/api/immersive/audio/en-immersive-market-v1-reading/writing/0','GET',404],
  ['/api/immersive/audio/en-immersive-market-v1-reading/reading/0','POST',405]
 ]){const {args,state}=context(path,{method});await assert.rejects(handleImmersiveAudio(args),e=>e.status===status);assert.equal(state.calls.length,0)}
 const {args}=context('/api/unrelated');assert.equal(await handleImmersiveAudio(args),false);
});
test('new recordings obey the existing administrator studio-audio control',()=>{
 assert.deepEqual(controlledFeatures('/api/immersive/audio/en-immersive-market-v1-reading/reading/0','GET'),['studioAudio']);
});

import {handleImmersiveContent} from './immersive-api.mjs';
test('content recovery returns only public authored packs, uses bounded rate limits and does no database or synthesis work',async()=>{
 const {args,state}=context('/api/immersive/content/ar');
 args.send=(_res,status,data,headers)=>{state.sent={status,data,headers}};
 assert.ok(await handleImmersiveContent(args));assert.equal(state.sent.status,200);assert.equal(Object.keys(state.sent.data.units).length,9);
 assert.equal(state.sent.data.units.market.title,'سوق مناسب لجميع أهل الحي');
 assert.equal(state.sent.headers['Cache-Control'],'public, max-age=3600');assert.equal(state.calls.length,0);assert.deepEqual(state.limited,[{key:'immersive-content',n:60}]);
 for(const [route,method,status]of [['/api/immersive/content/__proto__','GET',404],['/api/immersive/content/ar/../../users','GET',404],['/api/immersive/content/en','POST',405]]){const {args}=context(route,{method});await assert.rejects(handleImmersiveContent(args),e=>e.status===status)}
});

test('new source recordings do not pretend to be historical bundled word/example references',async()=>{
 const {ordinaryLessonAudioTargets}=await import('./lesson-audio-targets.mjs'),{lightAudioTargets,lightModels}=await import('./light-learning-model.mjs'),{lessonList,getLesson}=await import('./course.mjs');
 const ordinary=ordinaryLessonAudioTargets();assert.ok(ordinary.length>12000);assert.ok(ordinary.every(r=>r.lessons.every(id=>!getLesson(id)?.immersive)));
 assert.ok(lightAudioTargets(lessonList).every(r=>!getLesson(r.lesson)?.immersive));
 for(const lesson of lessonList.filter(l=>l.immersive))assert.deepEqual(lightModels(lesson),[]);
});
