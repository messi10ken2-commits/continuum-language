import assert from 'node:assert/strict';
import test from 'node:test';
import {reviewedTranslation} from './reviewed-interface-copy.mjs';
import {t,setInterfaceLanguage} from './interface-runtime.mjs';
test('visible Indonesian UI copy never exposes generated underscore identifiers',async()=>{
 const {auditDisplayCoverage}=await import('./scripts/audit-display-coverage.mjs'),{interfaceCopy}=await import('./interface-copy.mjs');
 for(const {source}of auditDisplayCoverage().sources){if(/[a-z]_[a-z]/i.test(source))continue;const value=(reviewedTranslation(source,'id')||interfaceCopy[source]?.id||'').replace(/\{[^}]*\}/g,'');assert.ok(!/[a-z]_[a-z]/i.test(value),source+': '+value);}
});
test('teacher action confirmations and profile states translate offline in all nine non-English locales',()=>{
 try{for(const locale of ['ja','es','pt','zh','fr','ko','id','ru','ar']){
  setInterfaceLanguage(locale,{persist:false});
  for(const source of ['Learner connected.','Class note saved to this learner’s account.','Approved','Pending review','Changes requested','Draft'])assert.notEqual(t(source),source,locale+' '+source);
 }}finally{setInterfaceLanguage('en',{persist:false});}
});
test('illustrated navigation and lesson tools have offline reviewed translations in every display locale',()=>{
 for(const locale of ['ja','es','pt','zh','fr'])for(const source of ['Upcoming','Past classes','Choose what you want to strengthen today.','Your journey, with a human guide.','Start','Practise','Watch','Explore','Choose course level','Chapter','Learning tools','Open pronunciation studio','Explore Japanese characters','Previous practice','Lesson photography credits','View all visual sources']){
 const translated=reviewedTranslation(source,locale);assert.ok(translated,locale+': '+source);assert.notEqual(translated,source,locale+': '+source);
 }
});
