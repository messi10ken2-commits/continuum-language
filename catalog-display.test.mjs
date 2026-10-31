import test from 'node:test';import assert from 'node:assert/strict';
import {auditCatalogDisplay} from './scripts/audit-catalog-display.mjs';
import {displayLocales} from './scripts/audit-display-coverage.mjs';
import {t,setInterfaceLanguage} from './interface-runtime.mjs';
import {translationSource} from './localization-corpus.mjs';
import {catalogInterfaceCopy} from './catalog-interface-copy.mjs';
import {premiumCourseSummary} from './premium-courses.mjs';
import {languages} from './languages.mjs';
test('all public course cards and workshop metadata translate offline in all nine display locales',()=>{
 const result=auditCatalogDisplay();assert.ok(result.sources.length>100);assert.deepEqual(result.missing,[]);
 try{for(const locale of displayLocales){setInterfaceLanguage(locale,{persist:false});for(const language of languages){const courses=premiumCourseSummary.filter(c=>c.language===language.id);assert.equal(courses.length,10);for(const c of courses)for(const text of [c.title,c.description])assert.notEqual(t(text),text,locale+' '+c.id+' '+text);}}}finally{setInterfaceLanguage('en',{persist:false});}
});
test('reported Japanese cards have reviewed copy even before a provider or saved cache is available',()=>{
 try{setInterfaceLanguage('ja',{persist:false});assert.equal(t('Listen beyond the first impression'),'第一印象にとらわれずに聞く');assert.equal(t('Choose register with care'),'場面に合う言葉遣いを選ぶ');assert.match(t('Follow corrections, distinguish a possibility from a promise and interpret conditions.'),/可能性と確約/);for(const source of Object.keys(catalogInterfaceCopy)){assert.ok(translationSource(source));for(const locale of displayLocales){setInterfaceLanguage(locale,{persist:false});assert.notEqual(t(source),source,locale+': '+source);}}}finally{setInterfaceLanguage('en',{persist:false});}
});
