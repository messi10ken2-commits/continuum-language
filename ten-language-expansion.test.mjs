import test from 'node:test';
import assert from 'node:assert/strict';
import {languages,courseBands} from './languages.mjs';
import {lessonList,chapters,getLesson,getLessonVariant,hasExpandedExercises,gradeLesson} from './course.mjs';
import {getSkillTask} from './skills-content.mjs';
import {equivalentAnswer} from './answer-equivalence.mjs';
import {scorePronunciation} from './pronunciation-score.mjs';
import {speakingScenarios} from './speaking-content.mjs';
import {learningArtFamily} from './learning-art-families.mjs';
import {livingMapTheme,livingMapGeometry} from './living-map-model.mjs';
import {buildRollingStock} from './rolling-stock.mjs';
import {illustratedLessonArt} from './illustrated-art.mjs';
import {existsSync} from 'node:fs';
const added=['zh','ko','fr','de','ar','it'];
for(const language of added){
 test(`${language}: complete independent core path, working mixed exercises and production connections`,()=>{
  const lang=languages.find(x=>x.id===language),all=lessonList.filter(l=>l.language===language),core=all.filter(l=>!l.specialist&&!l.checkpoint&&!l.summaryTest);
  assert.equal(core.length,58);assert.equal(new Set(core.map(l=>l.id)).size,58);
  for(const level of courseBands){
   const cs=chapters.filter(c=>c.language===language&&c.level===level&&!c.specialist),summary=all.find(l=>l.level===level&&l.summaryTest);
   assert.equal(cs.length,level==='B2'?6:7);assert.equal(cs.at(-1).summaryTest,true);
   for(const chapter of cs.filter(c=>!c.summaryTest)){
    const children=all.filter(l=>l.chapter===chapter.id);assert.equal(children.length,3);assert.equal(children.at(-1).checkpoint,true);
    const first=getLessonVariant(children.at(-1).id,'v1-expansion-first-123456789'),second=getLessonVariant(children.at(-1).id,'v1-expansion-second-123456789');
    assert.equal(first.questions.length,4);assert.equal(new Set(first.questions.map(q=>q.sourceLesson)).size,2);
    assert.notDeepEqual(first.questions.map(q=>q.prompt+'|'+q.context),second.questions.map(q=>q.prompt+'|'+q.context));
   }
   const v=getLessonVariant(summary.id,'v1-expansion-summary-123456789');assert.equal(v.questions.length,(cs.length-1)*3);assert.equal(new Set(v.questions.map(q=>q.topic)).size,cs.length-1);
  }
  for(const lesson of all){
   assert.equal(lesson.locale,lang.locale);assert.ok(lesson.explanation);assert.ok(lesson.example);
   const seed=lesson.checkpoint||lesson.summaryTest?'v1-expansion-matrix-123456789':hasExpandedExercises(lesson.id)?'v8-expansion-matrix-123456789':undefined;
   const variant=getLessonVariant(lesson.id,seed);assert.equal(gradeLesson(lesson.id,variant.questions.map(q=>q.answer),seed).score,100);
   for(const q of variant.questions){if(q.type==='text'){assert.ok(q.answer.length<=150);assert.equal(equivalentAnswer(q,'nonsense-invalid-answer'),false);}else{assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.answer>=0&&q.answer<q.options.length);}if(q.audio)assert.equal(q.audioLocale,lang.locale);}
   if(lesson.skill==='Listening'&&!lesson.conversation)assert.ok(variant.questions.every(q=>q.audio&&q.audioLocale===lang.locale));
   if(!lesson.specialist&&['Speaking','Writing'].includes(lesson.skill)){const task=getSkillTask(lesson.productionTask);assert.equal(task.language,language);assert.equal(task.lessonId,lesson.id);assert.equal(task.skill,lesson.skill);}
  }
 });
 test(`${language}: both layouts retain language identity and coherent shared scenery`,()=>{
  const art=illustratedLessonArt({language,title:'At the café'});assert.equal(art.language,language);assert.ok(existsSync('public'+art.src));
  assert.equal(livingMapTheme(language),livingMapTheme(learningArtFamily(language)));
  for(const progress of [0,.2,.5,.8])assert.deepEqual(buildRollingStock(language,progress),buildRollingStock(learningArtFamily(language),progress));
  for(const width of [320,390,700]){const cs=chapters.filter(c=>c.language===language&&c.level==='A1'),g=livingMapGeometry(cs,width);assert.ok(g.points.every(p=>p.x>=60&&p.x<=g.width-60&&p.y>=72&&p.y<=g.height-164));}
  for(const scenario of speakingScenarios)assert.ok(scenario.opening[language]?.trim());
 });
}
test('four new script paths have native audio, independent recall and honest shape practice',()=>{
 for(const language of ['zh','ko','ar','de']){
  const units=lessonList.filter(l=>l.language===language&&l.characters);assert.ok(units.length>=2);
  for(const l of units)for(const c of l.characters){assert.ok(c.glyph&&c.reading&&c.audio);assert.ok(l.questions.some(q=>q.type==='text'&&q.answer===c.glyph&&!q.prompt.includes(c.glyph)));}
 }
 const de=getLesson('de-script-v1-special-letters-0');assert.equal(equivalentAnswer(de.questions.find(q=>q.type==='text'&&q.answer==='Ä'),'ä'),false);
 assert.equal(equivalentAnswer({answer:'Maße'},'Masse'),false);assert.equal(equivalentAnswer({answer:'schön'},'schon'),false);
});
test('non-Latin speech transcripts are not discarded as empty text',()=>{
 for(const text of ['你好，我叫安娜。','안녕하세요. 저는 학생이에요.','مرحبا اسمي آنا','こんにちは'])assert.equal(scorePronunciation(text,text).score,100);
});

test('text matching preserves umlauts and Arabic hamza without claiming sound scoring',()=>{assert.notEqual(scorePronunciation('schön','schon','de-DE').score,100);assert.notEqual(scorePronunciation('Maße','Masse','de-DE').score,100);assert.equal(scorePronunciation('مَرْحَبًا','مرحبا','ar-SA').score,100);});

test('new-language class links, review sources, comprehension meanings and script readings retain their identity',async()=>{
 const {matchClassLesson}=await import('./class-practice.mjs'),{missedReviewItems}=await import('./review-pool.mjs'),{displayLanguageOptions}=await import('./answer-language.mjs'),{companionKeepsake}=await import('./passport-keepsakes.mjs'),{passportCards}=await import('./passport-cards.mjs');
 for(const language of added){
  for(const term of ['past perfect','conditional','idioms']){const l=matchClassLesson({language,focus:term,note:'Practise this concept.'},language);assert.ok(l,language+term);assert.equal(l.language,language);}
  const id=`${language}-a1-core-v3-lesson-7`,seed='v8-review-expansion-123456789',l=getLessonVariant(id,seed),wrong=l.questions.map(q=>q.type==='text'?'incorrect':(q.answer+1)%q.options.length),review=missedReviewItems(id,wrong,seed);assert.ok(review.length);assert.ok(review.every(r=>r.language===language&&r.lesson===id));
  const meaning=getLesson(id).questions[0];assert.equal(displayLanguageOptions(meaning,getLesson(id)),true);
  for(const script of lessonList.filter(l=>l.language===language&&l.characters))for(const q of script.questions.filter(q=>q.options))assert.equal(displayLanguageOptions(q,script),false);
  assert.ok(companionKeepsake('cat',language,{finale:true}));assert.ok(passportCards([],language,{includeLocked:true}).length>40);
 }
});

test('new meaning questions always show their native situation or supply native audio',()=>{
 for(const l of lessonList.filter(l=>added.includes(l.language)))for(const q of [l,...(hasExpandedExercises(l.id)?[getLessonVariant(l.id,'v8-context-audit-123456789')]:[])].flatMap(v=>v.questions))if(q.optionsRole==='meaning')assert.ok(q.audio||q.displayContext&&q.context||q.prompt.includes(q.context)&&q.context,l.id+': missing meaning context');
});

test('script recap audio uses native letter names and the learning locale',async()=>{const {visualFrames,themeFor}=await import('./lesson-media.mjs'),{allowedSpeech}=await import('./speech-api.mjs');for(const l of lessonList.filter(l=>added.includes(l.language)&&l.characters)){assert.equal(themeFor(l),'study');for(const f of visualFrames(l)){assert.equal(f.lang,l.locale);assert.ok(allowedSpeech(f.audio,l.locale));assert.equal(f.audio,l.characters.find(c=>c.glyph===f.text).audio);}}});
