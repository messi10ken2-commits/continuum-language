import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {lessonList,getLessonVariant,hasExpandedExercises} from './course.mjs';
import {translationSource,translationKey,protectSource} from './localization-corpus.mjs';
import {questionLearningText,keepsProtectedText} from './learning-text-protection.mjs';
import {translationRevision} from './reviewed-interface-copy.mjs';
import {translateBatch,handleLocalization} from './localization-api.mjs';
const locales=['ja','es','pt','zh','fr'];
const reported='What does this mean? The offer remains valid, subject to funding.';
const sentence='The offer remains valid, subject to funding.';
const other='What does this mean? They must have misunderstood the revised deadline.';
const otherSentence='They must have misunderstood the revised deadline.';
const bounded=value=>new RegExp('(?<![\\p{L}\\p{N}])'+value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}\\p{N}])','u');

test('all authored exercise versions mask their declared learning text, not just lesson examples',()=>{
 let count=0;const languages=new Set();
 for(const lesson of lessonList){
  const language=lesson.language||'es';languages.add(language);
  const variants=[lesson,...[2,3,4,5].filter(()=>hasExpandedExercises(lesson.id)).map(n=>getLessonVariant(lesson.id,`v${n}-localization-source-123456789`))];
  for(const q of variants.flatMap(v=>v.questions||[])){
   count++;const source=translationSource(q.prompt,language);if(!source)continue;
   const p=protectSource(source);
   for(const target of questionLearningText(q,language).filter(t=>t.length>1))assert.ok(!bounded(target).test(p.text),lesson.id+': '+q.prompt+' / '+target);
   assert.equal(p.restore(p.text),q.prompt);
  }
 }
 assert.deepEqual([...languages].sort(),['en','es','ja','pt']);assert.ok(count>10000);
});

test('sentences, gaps, deliberate errors, lemmas, kana and sound contrasts survive in five display languages',async()=>{
 const sources=[translationSource(reported,'en'),translationSource(other,'en'),translationSource('Complete with go: Yesterday we ____ to the coast.','en'),translationSource('Correct only the verb: My neighbours is friendly.','en'),translationSource('sheep','en'),translationSource('mão','pt'),translationSource('perro','es'),translationSource('Write the romanized reading of あ.','ja')];
 for(const source of sources)assert.ok(source);
 const old=process.env.OPENAI_API_KEY;process.env.OPENAI_API_KEY='synthetic-test-key';
 try{for(const locale of locales){
  const result=await translateBatch(sources,locale,{fetchImpl:async(_url,init)=>{
   const input=JSON.parse(JSON.parse(init.body).messages[1].content);
   assert.ok(!input[0].text.includes(sentence));assert.ok(!input[1].text.includes(otherSentence));
   return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({translations:input.map(x=>locale+': '+x.text)})}}]})};
  }});
  result.forEach((translated,i)=>assert.ok(keepsProtectedText(protectSource(sources[i]),translated)));
  assert.ok(result[0].includes(sentence));assert.ok(result[1].includes(otherSentence));assert.ok(result[2].includes('Yesterday we ____ to the coast.'));assert.ok(result[3].includes('My neighbours is friendly.'));assert.ok(result[7].includes('あ'));
 }}finally{if(old===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=old;}
});

test('browser ignores old translated learning sentences and retains valid cached instructions',async()=>{
 const stored=[];for(const locale of locales){stored.push([locale+':'+translationKey(reported,'en'),'誤訳された教材文']);stored.push([locale+':'+translationKey(other,'en'),locale+': '+otherSentence]);stored.push([locale+':'+translationKey('sheep','en'),'羊']);}
 const old=globalThis.localStorage;globalThis.localStorage={getItem:key=>key==='continuumInterfaceTranslations:'+translationRevision?JSON.stringify(stored):null,setItem(){}};
 try{const runtime=await import('./interface-runtime.mjs?learning-text-cache-test');for(const locale of locales){runtime.setInterfaceLanguage(locale,{persist:false});assert.equal(runtime.t(reported,'en'),reported);assert.equal(runtime.t(other,'en'),locale+': '+otherSentence);assert.equal(runtime.t('sheep','en'),'sheep');}}
 finally{if(old===undefined)delete globalThis.localStorage;else globalThis.localStorage=old;}
});

test('server repairs a poisoned cache entry and rejects a provider result that changes learning text',async()=>{
 const source=translationSource(reported,'en');
 const key=crypto.createHash('sha256').update(JSON.stringify([translationRevision,'ja',source])).digest('hex');
 const cache=new Map([[key,'教材文まで翻訳された古い値']]);let writes=0,output;
 const pool={query:async(sql,args)=>{if(sql.startsWith('SELECT'))return {rows:args[0].filter(key=>cache.has(key)).map(key=>({cache_key:key,translated:cache.get(key)}))};assert.match(sql,/DO UPDATE SET translated/);args[0].forEach((key,index)=>cache.set(key,args[1][index]));writes++;return {rows:[]};}};
 const args={route:'/api/localization',req:{method:'POST'},res:{},pool,required:async()=>({id:'test'}),json:async()=>({locale:'ja',items:[{text:reported,language:'en'}]}),send:(_r,status,data)=>{output={status,data}},fail:(status,message)=>{throw Object.assign(Error(message),{status})},limited(){}};
 await handleLocalization({...args,translate:async()=>['これはどういう意味ですか？ '+sentence]});
 assert.equal(output.status,200);assert.equal(writes,1);assert.ok(output.data.translations[0].text.includes(sentence));
 await handleLocalization({...args,translate:async()=>{throw Error('valid cache should be reused')}});assert.equal(writes,1);
 cache.set(key,'別の誤訳');await assert.rejects(handleLocalization({...args,translate:async()=>['英文まで翻訳された値']}),e=>e.status===503);assert.equal(writes,1);
});


test('inline pronunciation words and alternative cloze/word-order formats are protected',()=>{
 for(const [prompt,language,targets] of [
  ['What changes from thin to the first sound in this?','en',['thin','this']],
  ['Which ending sound does needed have? Write /t/, /d/ or /ɪd/.','en',['needed']],
  ['Which syllable is stressed in teléfono?','es',['teléfono']],
  ['Place often correctly. Rebuild: My father / is / busy. Add often.','en',['My father / is / busy.']],
  ['Every summer as a child: Eu ____ na praia.','pt',['Eu ____ na praia.']]
 ]){
  const values=questionLearningText({prompt},language),p=protectSource({text:prompt,language,protectedValues:values});
  for(const target of targets){assert.ok(!bounded(target).test(p.text),prompt);assert.ok(p.restore(p.text).includes(target));}
 }
});
