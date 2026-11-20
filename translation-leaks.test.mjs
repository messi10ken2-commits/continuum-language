import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,getLessonVariant,hasExpandedExercises} from './course.mjs';
import {translationSource,protectSource} from './localization-corpus.mjs';
import {keepsProtectedText,keepsLocalizedInstructions} from './learning-text-protection.mjs';
import {reviewedExerciseInstructions} from './reviewed-exercise-instructions.mjs';
import {t,setInterfaceLanguage} from './interface-runtime.mjs';
const prompt='Complete the result with arrive: If we had taken the earlier bus, we ____ on time. Use would.';
test('reported and related instructions have reviewed translations, preserving only the learning material',()=>{
 for(const locale of ['ja','es','pt','zh','fr']){
  setInterfaceLanguage(locale,{persist:false});
  for(const [source,translation] of Object.entries(reviewedExerciseInstructions[locale])){
   const language=source.includes(' Se ')?'pt':source.includes(' Si ')?'es':'en';
   assert.equal(t(source,language),translation);
   const protection=protectSource(translationSource(source,language));
   assert.ok(keepsProtectedText(protection,translation),source);
  }
  const translated=t(prompt,'en');assert.ok(translated.includes('If we had taken the earlier bus, we ____ on time.'));assert.ok(translated.includes('would'));assert.ok(!translated.includes('Complete the result'));if(locale!=='pt')assert.ok(!translated.includes('Use would.'));
 }
 setInterfaceLanguage('ja',{persist:false});assert.match(t(Object.keys(reviewedExerciseInstructions.ja).find(x=>x.startsWith('You are emailing')),'en'),/契約書の4番目の条項/);
 setInterfaceLanguage('en',{persist:false});
});
test('trailing instructions and multiline meanings remain translatable',()=>{
 const p=protectSource(translationSource(prompt,'en'));assert.ok(p.values.includes('would'));assert.ok(p.text.includes('Use '));assert.ok(!p.values.some(v=>v.includes('Use would')));
 const text="Complete the model with the lesson's wording.\n____ a designer.\nMeaning: Use a/an before a singular countable job.";
 const meaning=protectSource(translationSource(text,'en'));assert.ok(meaning.text.includes('Meaning: Use a/an before a singular countable job.'));assert.ok(meaning.values.includes('____ a designer.'));
 const q='Complete with tener: Si ____ tiempo, viajaría más. Subject: yo.';
 const source=translationSource(q,'es');if(source)assert.ok(protectSource(source).text.includes('Subject:'));
 assert.ok(!keepsLocalizedInstructions({text:prompt,protection:p},prompt));
 assert.ok(keepsLocalizedInstructions({text:prompt,protection:p},reviewedExerciseInstructions.ja[prompt]));
});
test('rotating question variants always have public translation sources',()=>{
 let checked=0;
 for(const lesson of lessonList){if(!hasExpandedExercises(lesson.id))continue;for(const version of [2,3,4,5])for(let i=0;i<5;i++){
  const variant=getLessonVariant(lesson.id,`v${version}-coverage-${i}-123456789`);
  for(const q of variant.questions){assert.ok(translationSource(q.prompt,lesson.language||'es'),q.prompt);checked++;}
 }}
 assert.ok(checked>40000);
});

test('server replaces a cached untranslated instruction rather than serving it as localized text',async()=>{
 const {handleLocalization}=await import('./localization-api.mjs');
 const {translationRevision}=await import('./reviewed-interface-copy.mjs');
 const {default:crypto}=await import('node:crypto');
 const text='Correct only the verb: My neighbours is friendly.',source=translationSource(text,'en');
 const key=crypto.createHash('sha256').update(JSON.stringify([translationRevision,'ja',source])).digest('hex');
 const cache=new Map([[key,text]]);let output,translated=0;
 const pool={query:async(sql,args)=>{if(sql.startsWith('SELECT'))return {rows:args[0].filter(k=>cache.has(k)).map(k=>({cache_key:k,translated:cache.get(k)}))};args[0].forEach((k,i)=>cache.set(k,args[1][i]));return {rows:[]};}};
 await handleLocalization({route:'/api/localization',req:{method:'POST'},res:{},pool,required:async()=>({id:'test'}),json:async()=>({locale:'ja',items:[{text,language:'en'}]}),send:(_r,status,data)=>{assert.equal(status,200);output=data},fail:(status,message)=>{throw Error(status+message)},limited(){},translate:async()=>{translated++;return ['動詞だけを直してください：My neighbours is friendly.']}});
 assert.equal(translated,1);assert.equal(output.translations[0].text,'動詞だけを直してください：My neighbours is friendly.');assert.equal(cache.get(key),output.translations[0].text);
});
