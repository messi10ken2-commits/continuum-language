import test from 'node:test';import assert from 'node:assert/strict';import {nativeInterfaceCopy} from './native-interface-copy.mjs';import {reviewedTranslation} from './reviewed-interface-copy.mjs';import {translationSource} from './localization-corpus.mjs';
test('native settings, safety, offline and recovery copy is registered in all nine display locales',()=>{
 for(const [source,translations] of Object.entries(nativeInterfaceCopy)){
  assert.ok(translationSource(source),source);
  for(const locale of ['ja','es','pt','zh','fr','ko','id','ru','ar']){assert.ok(translations[locale]?.trim(),locale+': '+source);assert.equal(reviewedTranslation(source,locale),translations[locale]);}
 }
});
