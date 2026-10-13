import test from 'node:test';
import assert from 'node:assert/strict';
import {detectedInterfaceLanguage,interfaceLanguages} from './interface-languages.mjs';
import {interfaceCopy} from './interface-copy.mjs';
import {protectSource,translationSource} from './localization-corpus.mjs';
import {translateBatch} from './localization-api.mjs';
import {languages} from './languages.mjs';
test('interface choices never expand the learning-language list',()=>{assert.equal(interfaceLanguages.length,6);assert.deepEqual(languages.map(l=>l.id),['es','ja','pt','en']);assert.equal(detectedInterfaceLanguage(['ja-JP']),'ja');assert.equal(detectedInterfaceLanguage(['zh-TW']),'zh');assert.equal(detectedInterfaceLanguage(['de-DE','fr-FR']),'fr');});
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
