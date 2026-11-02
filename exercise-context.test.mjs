import test from 'node:test';import assert from 'node:assert/strict';
import {premiumCourses} from './premium-courses.mjs';
import {exerciseContextSources,isInstructionContext,contextProtectedValues} from './exercise-context.mjs';
import {questionContext,setInterfaceLanguage} from './interface-runtime.mjs';
import {translationSource,protectSource} from './localization-corpus.mjs';
import {keepsProtectedText} from './learning-text-protection.mjs';
test('Portuguese display translates every registered scenario, preserving named learning forms',()=>{
 setInterfaceLanguage('pt',{persist:false});
 try{for(const context of exerciseContextSources){const translated=questionContext({context});assert.notEqual(translated,context,context);const source=translationSource(context);assert.ok(source,context);assert.ok(keepsProtectedText(protectSource(source),translated),context);for(const form of contextProtectedValues(context))if(new RegExp('(?<![\\p{L}\\p{N}])'+form.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}\\p{N}])','u').test(context))assert.ok(translated.includes(form),context);}}
 finally{setInterfaceLanguage('en',{persist:false})}
});
test('all ten courses keep target-language contexts and cloze answers verbatim while scenarios translate',()=>{
 setInterfaceLanguage('pt',{persist:false});
 try{for(const c of premiumCourses)for(const q of c.questions){if(!q.context)continue;if(/^(You |Ask |Use the Austrian|Use first-person|A market |A speaker |Two people |The time|A French |A Swiss |A woman |A common Levantine)/.test(q.context))assert.ok(isInstructionContext(q.context),c.id+': '+q.context);if(isInstructionContext(q.context))assert.notEqual(questionContext(q),q.context,c.id);else assert.equal(questionContext(q),q.context,c.id);}}
 finally{setInterfaceLanguage('en',{persist:false})}
});
