import test from 'node:test';
import assert from 'node:assert/strict';
import {displayLanguageOptions} from './answer-language.mjs';
import {lessonList,getLessonVariant,hasExpandedExercises} from './course.mjs';
import {translationSource,protectSource} from './localization-corpus.mjs';
import {optionText,setInterfaceLanguage} from './interface-runtime.mjs';
import {reviewedComprehensionOptions} from './reviewed-comprehension-options.mjs';
test('all comprehension choices have display-language translation sources, including rotating questions',()=>{
 let count=0,video=0,visual=0;const languages=new Set();
 for(const l of lessonList){const variants=[l,...(hasExpandedExercises(l.id)?[getLessonVariant(l.id,'v4-answer-scan-123456789'),getLessonVariant(l.id,'v5-answer-scan-123456789')]:[])];
 for(const v of variants)for(const q of v.questions){if(!displayLanguageOptions(q,l))continue;languages.add(l.language||'es');video+=!!q.video;visual+=!!l.visualStory;
 for(const o of q.options){if(!/[A-Za-z]/.test(o))continue;const source=translationSource(o);assert.ok(source,l.id+': '+o);const p=protectSource(source);assert.ok(!/^⟦KEEP_\d+⟧$/.test(p.text)||/^\/.*\/$/.test(o),o);count++;}
 }}assert.ok(count>2000);assert.ok(video>100);assert.ok(visual>20);assert.equal(languages.size,10);
});
test('reviewed visual meanings translate in five locales while actual target utterances stay intact',()=>{
 for(const locale of ['ja','es','pt','zh','fr']){setInterfaceLanguage(locale,{persist:false});for(const l of lessonList.filter(l=>l.visualStory))for(const q of l.questions.filter(q=>q.options))for(const o of q.options){if(displayLanguageOptions(q,l))assert.equal(optionText(q,o,l),reviewedComprehensionOptions[locale][o]||o);else assert.equal(optionText(q,o,l),o);}}
 setInterfaceLanguage('fr',{persist:false});const l=lessonList.find(l=>l.id==='pt-visual-v1-meeting'),q=l.questions[0];assert.equal(optionText(q,'Unfinished',l),'Pas encore terminé');assert.equal(optionText(q,'Already submitted',l),'Déjà remis');assert.equal(optionText(q,'Cancelled',l),'Annulé');
 const reply={options:['To go, please.'],optionsLang:'en-US',viewpoint:'reply'};assert.equal(optionText(reply,reply.options[0],{language:'en'}),'To go, please.');
 assert.equal(displayLanguageOptions({...reply,viewpoint:'detail'},{language:'en'}),true);
 const cafe=lessonList.find(l=>l.id==='cafe');assert.equal(displayLanguageOptions(cafe.questions[0],cafe),true);assert.equal(displayLanguageOptions(cafe.questions[2],cafe),false);
 setInterfaceLanguage('en',{persist:false});
});
