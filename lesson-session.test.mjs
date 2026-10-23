import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,getLessonVariant,gradeLesson,hasExpandedExercises,isCurrentLessonDraft} from './course.mjs';
import {speechChunks} from './speech-chunks.mjs';
import {geminiAudioParts} from './speech-service.mjs';
import {visualFrames} from './lesson-media.mjs';
test('v8 sessions shuffle every language with stable grading, coverage and saved progress',()=>{
 for(const language of ['en','es','pt','ja']){
  const lessons=lessonList.filter(l=>(l.language||'es')===language&&hasExpandedExercises(l.id));
  assert.ok(lessons.length,language);
  for(const base of lessons){
   const seed='v8-session-regression-123456789',a=getLessonVariant(base.id,seed),b=getLessonVariant(base.id,seed);
   assert.deepEqual(a,b,base.id);
   assert.equal(gradeLesson(base.id,a.questions.map(q=>q.answer),seed).score,100,base.id);
   assert.ok(isCurrentLessonDraft(base.id,[],seed));
   assert.ok(a.questions.every(q=>q.type==='text'||q.mode==='order'||Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length),base.id);
   const another=getLessonVariant(base.id,'v8-session-another-123456789');
   if(a.questions.length>3)assert.notDeepEqual(a.questions.map(q=>[q.id,q.prompt]),another.questions.map(q=>[q.id,q.prompt]),base.id);
   assert.deepEqual(base,getLessonVariant(base.id), 'legacy base stays unchanged');
  }
 }
});
test('speech chunks preserve every character and punctuation in four languages',()=>{
 for(const text of ['Hello! “How are you?” This is a longer reply. ','¡Hola! ¿Cómo estás? Quiero hablar contigo. ','Olá! Como está? Vamos conversar mais um pouco. ','こんにちは。「今日はどうですか？」日本語で話しましょう。😀'].map(s=>s.repeat(30))){
  const chunks=speechChunks(text);assert.equal(chunks.join(''),text);assert.ok(chunks.length>1);assert.ok(chunks.every(s=>Array.from(s).length<=180));
 }
});
test('Gemini retains every audio block without duplicating alternate representations',()=>{
 assert.deepEqual(geminiAudioParts({outputs:[{type:'audio',data:'first'},{content:[{type:'audio',data:'last'}]}]}),['first','last']);
 assert.deepEqual(geminiAudioParts({steps:[{content:[{type:'audio',data:'first'},{type:'audio',data:'last'}]}],outputs:[{type:'audio',data:'duplicate'}]}),['first','last']);
 assert.deepEqual(geminiAudioParts({output_audio:{data:'complete'},outputs:[{type:'audio',data:'duplicate'}]}),['complete']);
});
test('visual exploration includes every vocabulary and expression example',()=>{
 for(const key of ['vocabulary','expressions']){
  const entries=Array.from({length:12},(_,i)=>({term:'term '+i,meaning:'meaning '+i,example:'example '+i}));
  assert.deepEqual(visualFrames({[key]:entries},{all:true}).map(f=>f.text),entries.map(e=>e.term));
 }
});
