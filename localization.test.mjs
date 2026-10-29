import test from 'node:test';
import assert from 'node:assert/strict';
import {detectedInterfaceLanguage,interfaceLanguages} from './interface-languages.mjs';
import {interfaceCopy} from './interface-copy.mjs';
import {protectSource,translationSource} from './localization-corpus.mjs';
import {translateBatch} from './localization-api.mjs';
import {languages} from './languages.mjs';
test('interface choices never expand the learning-language list',()=>{assert.equal(interfaceLanguages.length,10);assert.deepEqual(languages.map(l=>l.id),['es','ja','pt','en','zh','ko','fr','de','ar','it']);assert.equal(detectedInterfaceLanguage(['ja-JP']),'ja');assert.equal(detectedInterfaceLanguage(['zh-TW']),'zh');assert.equal(detectedInterfaceLanguage(['de-DE','fr-FR']),'fr');});
test('all bundled core copy has all five translations',()=>{for(const [text,entries] of Object.entries(interfaceCopy))for(const locale of ['ja','es','pt','zh','fr'])assert.ok(entries[locale]?.trim(),text+':'+locale);});
test('target forms and English exercise sentences survive translation',()=>{
 const p=protectSource({text:'Compare foi with fui. Use fui for eu.',language:'pt',protectedValues:['foi','fui','eu']});assert.ok(!p.text.includes('foi'));const restored=p.restore(p.text.replace('Compare','比較：'));assert.match(restored,/foi/);assert.match(restored,/fui/);assert.throws(()=>p.restore(p.text.replace('⟦KEEP_0⟧','gone')));
 const q=protectSource({text:'Complete: I ___ to school.',language:'en',protectedValues:[]});assert.equal(q.restore(q.text.replace('Complete','穴埋め')),'穴埋め: I ___ to school.');
 const slots=protectSource({text:'Question {0} of {1}',language:'',protectedValues:[]});assert.throws(()=>slots.restore('問題'));
 assert.equal(translationSource('Some private student response'),undefined);
});
test('provider output is validated before it can enter the cache',async()=>{
 const old=process.env.OPENAI_API_KEY,gemini=process.env.GEMINI_API_KEY;process.env.OPENAI_API_KEY='synthetic-test-key';delete process.env.GEMINI_API_KEY;
 try{const source={text:'Compare foi and fui.',language:'pt',protectedValues:['foi','fui']};const result=await translateBatch([source],'ja',{fetchImpl:async(_url,init)=>{const body=JSON.parse(init.body);assert.equal(body.store,false);const input=JSON.parse(body.messages[1].content);return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({translations:[input[0].text.replace('Compare','比較：')]})}}]})};}});assert.match(result[0],/foi and fui/);
 await assert.rejects(translateBatch([source],'ja',{fetchImpl:async()=>({ok:true,json:async()=>({choices:[{message:{content:'{"translations":["removed forms"]}'}}]})})}));
 }finally{if(old===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=old;if(gemini!==undefined)process.env.GEMINI_API_KEY=gemini;}
});

test('reviewed contextual copy wins over stale client translations',async()=>{
 const {reviewedInterfaceCopy,translationRevision}=await import('./reviewed-interface-copy.mjs');
 const {t,setInterfaceLanguage}=await import('./interface-runtime.mjs');
 setInterfaceLanguage('ja',{persist:false});
 assert.equal(t('Teachers are on their way'),'講師の公開を準備中です');
 assert.equal(t('Your level, tested.'),'今の語学レベルを確認しよう');
 assert.equal(t('Choose what teachers can see'),'講師に共有する情報を選ぶ');
 assert.equal(t('Connected teachers'),'連携中の講師');
 for(const text of Object.keys(reviewedInterfaceCopy.ja))assert.ok(translationSource(text),text);
 assert.notEqual(translationRevision,'v1');
 assert.match(translationSource('Teachers are on their way').context,/Profiles/);
 setInterfaceLanguage('en',{persist:false});
});
test('translation provider receives screen context and pedagogical terminology',async()=>{
 const old=process.env.OPENAI_API_KEY;process.env.OPENAI_API_KEY='synthetic-test-key';
 try{await translateBatch([translationSource('Teachers are on their way')],'ja',{fetchImpl:async(_url,init)=>{
  const body=JSON.parse(init.body);assert.match(body.messages[0].content,/not teachers physically travelling/);assert.match(body.messages[0].content,/過去進行形/);
  assert.match(JSON.parse(body.messages[1].content)[0].screenContext,/Profiles/);
  return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({translations:['講師の公開を準備中です']})}}]})};
 }});}finally{if(old===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=old;}
});

test('reviewed interface copy covers the same contexts in all four other locales',async()=>{
 const {multilingualReviewedCopy:copy}=await import('./multilingual-reviewed-copy.mjs');
 const {t,setInterfaceLanguage}=await import('./interface-runtime.mjs');
 const keys=Object.keys(copy.es);
 assert.ok(keys.length>=100);
 for(const locale of ['es','pt','zh','fr']){
  assert.deepEqual(Object.keys(copy[locale]),keys);
  setInterfaceLanguage(locale,{persist:false});
  for(const key of keys){
   assert.ok(translationSource(key),key);
   const {reviewedTranslation}=await import('./reviewed-interface-copy.mjs');
   assert.equal(t(key),reviewedTranslation(key,locale),locale+':'+key);
   const slots=x=>[...x.matchAll(/\{\d+\}/g)].map(m=>m[0]).sort();
   assert.deepEqual(slots(copy[locale][key]),slots(key));
  }
 }
 assert.equal(copy.zh['Share self-study activity'],'共享自学记录');
 assert.notEqual(copy.fr['Awaiting review'],copy.fr['Checkpoint']);
 setInterfaceLanguage('en',{persist:false});
});

test('every course heading and chapter goal has reviewed copy in all five locales',async()=>{
 const {lessonList,chapters,levels}=await import('./course.mjs');
 const {reviewedCourseTitles:copy}=await import('./reviewed-course-titles.mjs');
 const {t,setInterfaceLanguage}=await import('./interface-runtime.mjs');
 const sources=[...lessonList.map(l=>({text:l.title,language:l.language||'es'})),...chapters.flatMap(c=>[{text:c.title,language:c.language||'es'},{text:c.goal,language:c.language||'es'}]),...levels.map(l=>({text:l.name,language:''}))];
 for(const locale of ['ja','es','pt','zh','fr']){
  setInterfaceLanguage(locale,{persist:false});
  for(const {text,language} of sources){assert.ok(copy[locale][text]?.trim(),locale+': '+text);assert.ok(translationSource(text,language));assert.equal(t(text,language),copy[locale][text]);}
 }
 setInterfaceLanguage('ja',{persist:false});
 assert.equal(t('Interpret a qualified endorsement','ja'),'留保のある評価を読み取る');
 assert.equal(t('Report an inferred completed event','ja'),'過去の出来事について推測を伝える');
 assert.equal(t(' MIN'),' 分');
 setInterfaceLanguage('en',{persist:false});
 assert.equal(t('Report an inferred completed event','ja'),'Report an inferred completed event');
});
