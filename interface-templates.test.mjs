import test from 'node:test';import assert from 'node:assert/strict';
import {interfaceReliabilityCopy} from './interface-reliability-copy.mjs';
import {t,tf,setInterfaceLanguage} from './interface-runtime.mjs';
import {reviewedTranslation} from './reviewed-interface-copy.mjs';
import {translationSource} from './localization-corpus.mjs';
test('reviewed UI templates are available offline in every display language and retain all inserted values',()=>{
 for(const locale of ['ja','es','pt','zh','fr']){setInterfaceLanguage(locale,{persist:false});for(const [key,translations] of Object.entries(interfaceReliabilityCopy)){
  assert.ok(translationSource(key),key);assert.ok(translations[locale]);const placeholders=[...key.matchAll(/\{(\d+)\}/g)].map(x=>Number(x[1]));const values=Array.from({length:Math.max(-1,...placeholders)+1},(_,i)=>'KEEP_VALUE_'+i);
  const output=tf(key,values),expected=(reviewedTranslation(key,locale)||translations[locale]).replace(/\{(\d+)\}/g,(_,i)=>values[i]);assert.equal(output,expected);for(const value of values)assert.ok(output.includes(value),locale+' '+key);assert.ok(!/\{\d+\}/.test(output));
 }for(const language of ['English','Spanish','Portuguese','Japanese'])for(const band of ['A1','A2','B1','B2','C1']){const output=tf('Build your {0} communication skills at {1}.',[t(language),band]);assert.ok(output.includes(band));assert.ok(output.includes(t(language)));assert.ok(!output.includes('Build your '));}}
 setInterfaceLanguage('en',{persist:false});
});

 test('all interface source files register static UI calls and avoid raw visible English templates',async()=>{const {auditInterfaceTemplates}=await import('./scripts/audit-interface-templates.mjs');const result=auditInterfaceTemplates();assert.ok(result.files>=50);assert.ok(result.interfaceCalls>1000);assert.deepEqual(result.issues,[]);});
