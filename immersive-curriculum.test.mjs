import assert from 'node:assert/strict';
import {test} from 'node:test';
import {chapters,lessonList,getLessonVariant,gradeLesson,isCurrentLessonDraft} from './course.mjs';
import {learningLanguageIds} from './languages.mjs';
import {immersiveTopics,immersiveStages} from './immersive/topics.mjs';
import {loadImmersiveUnit} from './immersive/loader.mjs';
import {lightActivities,lightLessonVersion,lightLessonPassed,validLightState} from './light-learning-model.mjs';
import {lightRoute,lightLessonAvailability} from './light-route.mjs';
import {immersiveLightEvidence} from './immersive-memory.mjs';
import {buildPatternEvidence} from './learning-patterns.mjs';
import {translationSource,protectSource} from './localization-corpus.mjs';
import {displayLanguageOptions} from './answer-language.mjs';
const added=chapters.filter(c=>c.immersive),lessons=lessonList.filter(l=>l.immersive);
test('ten languages contain exactly 2 B1, 3 B2 and 4 C1 four-stage chapters without a writing stage',()=>{
 assert.equal(added.length,90);assert.equal(lessons.length,360);
 for(const language of learningLanguageIds){
  const local=added.filter(c=>c.language===language);
  for(const [level,count]of Object.entries({B1:2,B2:3,C1:4}))assert.equal(local.filter(c=>c.level===level).length,count,language+'/'+level);
  for(const chapter of local){const stages=lessons.filter(l=>l.chapter===chapter.id);assert.deepEqual(stages.map(l=>l.immersive.stage),immersiveStages);assert.ok(stages.every(l=>l.language===language));assert.equal(stages.filter(l=>l.checkpoint).length,1)}
 }
 assert.equal(new Set(lessons.map(l=>l.id)).size,360);
 assert.equal(new Set(lessons.flatMap(l=>l.questions.map(q=>q.id))).size,2160);
});
test('all 360 lessons grade and save with the canonical version and six first-attempt Light questions',()=>{
 for(const lesson of lessons){
  const run=getLessonVariant(lesson.id,lesson.exerciseVersion),answers=run.questions.map(q=>q.answer);
  assert.equal(gradeLesson(lesson.id,answers,lesson.exerciseVersion).score,100,lesson.id);
  assert.ok(isCurrentLessonDraft(lesson.id,answers.slice(0,3),lesson.exerciseVersion),lesson.id);
  const activities=lightActivities(lesson,0,lightLessonVersion);assert.equal(activities.length,6);
  const steps=activities.map(a=>({answer:a.meaning,hint:false,missed:false}));
  assert.ok(validLightState(activities,{version:lightLessonVersion,round:0,steps,choice:null,hint:false,checked:false}));
  assert.ok(lightLessonPassed(steps,6));steps[0].missed=true;assert.ok(lightLessonPassed(steps,6));steps[1].missed=true;assert.equal(lightLessonPassed(steps,6),false);
  for(const version of ['light-v1','light-v2','light-v3','light-v4','light-v5'])assert.deepEqual(lightActivities(lesson,0,version),[]);
  assert.deepEqual(lightActivities(lesson,1,lightLessonVersion),[]);
  for(const a of activities){assert.equal(a.optionsNative,!displayLanguageOptions(a.question,lesson));assert.equal(a.optionsNative,lesson.immersive.stage==='roleplay')}
 }
});
test('native sources exist for every chapter and all question source windows resolve',async()=>{
 for(const language of learningLanguageIds)for(const topic of immersiveTopics){
  const unit=await loadImmersiveUnit(language,topic.key);
  for(const lesson of lessons.filter(l=>l.language===language&&l.immersive.key===topic.key))for(const q of lesson.questions){const {stage,part}=q.immersiveSource;const text=stage==='roleplay'?unit.questions.roleplay[part].sceneLine:unit[stage][part].text;assert.ok(text.trim());assert.ok(text.length<=1800)}
 }
 await assert.rejects(loadImmersiveUnit('__proto__','market'),/Unknown/);
 await assert.rejects(loadImmersiveUnit('en','missing'),/Unknown/);
});
test('new Light chapters are independently available while stage prerequisites and old availability remain intact',()=>{
 for(const language of learningLanguageIds){
  const route=lightRoute(language),old=route.filter(r=>!r.chapter.immersive),fresh=lightLessonAvailability(route,new Set());
  let previous=true;
  for(const row of old){assert.equal(fresh.has(row.lesson.id),previous);previous=false}
  for(const chapter of added.filter(c=>c.language===language)){
   const rows=route.filter(r=>r.chapter.id===chapter.id);assert.equal(rows.length,4);
   assert.ok(fresh.has(rows[0].lesson.id));assert.ok(!fresh.has(rows[1].lesson.id));
   const keys=new Set(rows.slice(0,3).map(r=>r.lesson.id));
   assert.ok(lightLessonAvailability(route,keys).has(rows[3].lesson.id));
  }
  const completed=new Set(old.slice(0,3).map(r=>r.lesson.id));
  const expected=lightLessonAvailability(old,completed),actual=lightLessonAvailability(route,completed);
  for(const {lesson}of old)assert.equal(actual.has(lesson.id),expected.has(lesson.id));
 }
});
function recordFor(lesson,misses=2){const activities=lightActivities(lesson);return {id:'saved-light-'+lesson.id,lesson:lesson.id,at:'2026-11-14T12:00:00Z',state:{version:lightLessonVersion,round:0,steps:activities.map((a,i)=>({answer:a.meaning,hint:false,missed:i<misses})),choice:null,hint:false,checked:false,passed:misses<=1}}}
test('Learning Memory derives first-attempt evidence without inventing incorrect wording or granting Standard completion',()=>{
 const lesson=lessons.find(l=>l.language==='es'),record=recordFor(lesson),before=JSON.stringify(record),evidence=immersiveLightEvidence([record]);
 assert.equal(evidence.length,1);assert.equal(evidence[0].score,67);assert.equal(evidence[0].source,'light');
 const items=evidence[0].evidence[0].items;assert.equal(items.filter(i=>!i.correct).length,2);
 assert.ok(items.filter(i=>!i.correct).every(i=>i.response===null));
 assert.equal(JSON.stringify(record),before);assert.ok(!Object.hasOwn(evidence[0],'best'));
 const other=recordFor(lessons.find(l=>l.language==='en'));
 const report=buildPatternEvidence({language:'es',lightRecords:[record,other]});
 assert.equal(report.coverage.lessons,1);assert.equal(report.topics.length,1);
 assert.ok(report.topics[0].evidence[0].text.includes('original incorrect wording was not retained'));
 assert.deepEqual(immersiveLightEvidence([{...record,state:{...record.state,steps:record.state.steps.slice(0,2)}}]),[]);
 assert.deepEqual(immersiveLightEvidence([{...record,state:{...record.state,version:'light-v5'}}]),[]);
});

test('native chapter labels remain readable in every UI language while comprehension remains translatable',()=>{
 for(const lesson of lessons){
  for(const value of [lesson.title,lesson.explanation])for(const language of ['',lesson.language]){
   const source=translationSource(value,language);assert.ok(source,lesson.id+' native label');
   const protectedValue=protectSource(source);assert.match(protectedValue.text,/^⟦KEEP_\d+⟧$/);assert.equal(protectedValue.restore(protectedValue.text),value);
  }
  if(lesson.immersive.stage!=='roleplay'){
   for(const q of lesson.questions){assert.ok(translationSource(q.prompt,lesson.language));for(const option of q.options)assert.ok(translationSource(option));}
  }
 }
});

test('seeded immersion checkpoints reproduce source windows and grading and retain their authored revision',()=>{
 for(const lesson of lessons.filter(l=>l.checkpoint)){
  const seed='v1-'+lesson.exerciseVersion+'-first-123456789',other='v1-'+lesson.exerciseVersion+'-second-123456789';
  const a=getLessonVariant(lesson.id,seed),b=getLessonVariant(lesson.id,other);
  assert.deepEqual(a,getLessonVariant(lesson.id,seed));assert.notDeepEqual(a.questions,b.questions);assert.equal(a.questions.length,6);
  assert.equal(gradeLesson(lesson.id,a.questions.map(q=>q.answer),seed).score,100);
  for(const q of a.questions)assert.deepEqual(q.immersiveSource,lesson.questions.find(x=>x.id===q.id).immersiveSource);
  assert.ok(isCurrentLessonDraft(lesson.id,[a.questions[0].answer],seed));assert.ok(!isCurrentLessonDraft(lesson.id,[],'v1-immersive-v0-first-123456789'));
 }
});
