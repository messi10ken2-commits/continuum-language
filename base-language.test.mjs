import test from 'node:test';
import assert from 'node:assert/strict';
import {baseLanguages,missingUiTranslations,normalizeBaseLanguage,translate,uiTranslationReport} from './base-language.mjs';
import {lessonLocalizations,lessonTranslationReport,localizeLesson} from './lesson-localizations.mjs';
import {getLesson} from './course.mjs';
import {mistakeFeedback} from './mistake-feedback.mjs';

test('all initial base languages have complete UI catalogs',()=>{
 assert.deepEqual(baseLanguages.map(language=>language.id),['en','es','pt','fr','zh','ja']);
 for(const {id} of baseLanguages)assert.deepEqual(missingUiTranslations(id),[],`${id} has missing UI strings`);
 assert.equal(uiTranslationReport().fr.missing.length,0);
 assert.equal(translate('zh','lesson.questionsFeedback',{count:3}),'3 道题 · 每题即时反馈');
});

test('unknown languages and missing keys fall back predictably',()=>{
 assert.equal(normalizeBaseLanguage('xx'),'en');
 const missing=[];
 assert.equal(translate('fr','unknown.key',{},item=>missing.push(item)),'unknown.key');
 assert.deepEqual(missing,[{kind:'ui',locale:'fr',key:'unknown.key'}]);
});

test('authored lesson localization never changes target-language grading data',()=>{
 const source=getLesson('subjunctive'),localized=localizeLesson(source,'ja');
 assert.equal(localized.title,lessonLocalizations.subjunctive.ja.title);
 assert.equal(localized.questions[0].answer,source.questions[0].answer);
 assert.deepEqual(localized.questions[0].options,source.questions[0].options);
 assert.equal(localized.translationFallback,true);
 assert.ok(localized.missingTranslationFields.includes('questions.2.note'));
});

test('untranslated lesson content is detectable and falls back to authored English',()=>{
 const source=getLesson('daily-routine'),missing=[];
 const localized=localizeLesson(source,'fr',item=>missing.push(item));
 assert.equal(localized.explanation,source.explanation);
 assert.equal(localized.translationFallback,true);
 assert.ok(missing.some(item=>item.kind==='lesson-field'&&item.key==='daily-routine.explanation'));
 assert.ok(lessonTranslationReport(['subjunctive','daily-routine']).fr.missing.includes('daily-routine'));
});

test('shuffled questions retain the right explanation and ignore grading overrides',()=>{
 const source=getLesson('subjunctive');
 const catalog={subjunctive:{es:{id:'wrong-id',level:'C1',questions:[{sourcePrompt:source.questions[0].prompt,sourceNote:source.questions[0].note,note:'Localized explanation',answer:99,options:['wrong']} ]}}};
 const shuffled={...source,questions:[source.questions[1],source.questions[0]]};
 const result=localizeLesson(shuffled,'es',undefined,catalog);
 assert.equal(result.id,source.id);
 assert.equal(result.level,source.level);
 assert.equal(result.questions[0].note,source.questions[1].note);
 assert.equal(result.questions[1].note,'Localized explanation');
 assert.deepEqual(result.questions[1].options,source.questions[0].options);
 assert.equal(result.questions[1].answer,source.questions[0].answer);
 assert.equal(localizeLesson(null,'ja'),null);
});

test('vocabulary translations preserve target-language words and sentences',()=>{
 const source={id:'vocab',title:'Words',vocabulary:[{term:'agua',meaning:'water',phrase:'el agua',example:'Quiero agua.',translation:'I want water.'}]};
 const result=localizeLesson(source,'ja',undefined,{vocab:{ja:{title:'語彙',vocabulary:[{term:'agua',meaning:'水',translation:'水がほしいです。',example:'Do not replace target'}]}}});
 assert.equal(result.vocabulary[0].meaning,'水');
 assert.equal(result.vocabulary[0].example,'Quiero agua.');
 assert.equal(result.vocabulary[0].phrase,'el agua');
});

test('authored food vocabulary changes meaning and translation in all five additional bases',()=>{
 const source=getLesson('food-vocabulary');
 for(const locale of ['es','pt','fr','zh','ja']){
  const localized=localizeLesson(source,locale);
  assert.equal(localized.vocabulary[0].meaning,lessonLocalizations['food-vocabulary'][locale].vocabulary[0].meaning);
  assert.equal(localized.vocabulary[0].example,source.vocabulary[0].example);
  assert.equal(localized.vocabulary[0].term,source.vocabulary[0].term);
 }
 assert.equal(localizeLesson(source,'ja').vocabulary[0].meaning,'パン');
 assert.equal(translate('ja','toString'),'toString');
});

test('grammar tables localize instructional columns without replacing target forms',()=>{
 const source={id:'table',breakdown:{steps:[],examples:[],tables:[{caption:'Present',headers:['Person','Form','Meaning'],rows:[['yo','hablo','I speak']]}]}};
 const catalog={table:{ja:{breakdown:{tables:[{sourceCaption:'Present',caption:'現在形',headers:[{source:'Meaning',text:'意味'}],cells:[{row:'yo',header:'Form',source:'hablo',text:'must not replace'},{row:'yo',header:'Meaning',source:'I speak',text:'私は話す'}]}]}}}};
 const result=localizeLesson(source,'ja',undefined,catalog);
 assert.deepEqual(result.breakdown.tables[0].rows,[['yo','hablo','私は話す']]);
 assert.equal(result.breakdown.tables[0].caption,'現在形');
 assert.deepEqual(result.breakdown.tables[0].sourceHeaders,['Person','Form','Meaning']);
 assert.equal(source.breakdown.tables[0].caption,'Present');
});

test('mistake feedback uses the base language while keeping target answers',()=>{
 const question={type:'text',prompt:'Complete',answer:'café',note:'説明'};
 const t=(key,values)=>translate('ja',key,values);
 const feedback=mistakeFeedback(question,'cafe',t);
 assert.ok(feedback.includes('アクセント記号'));
 assert.ok(feedback.includes('café'));
 assert.ok(feedback.includes('cafe'));
 assert.ok(feedback.includes('説明'));
 assert.ok(mistakeFeedback(question,'cafe').includes('diacritic marks'));
 const audio=mistakeFeedback({...question,audio:'café'},'tea',t);
 assert.ok(audio.includes('音声'));
 const ordered={type:'text',answer:'el agua',note:'説明'};
 assert.ok(mistakeFeedback(ordered,'agua el',t).includes('語順'));
 assert.ok(mistakeFeedback(ordered,'agua',t).includes('抜けています'));
});
