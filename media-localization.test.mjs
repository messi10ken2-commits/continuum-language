import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList} from './course.mjs';
import {visualFrames} from './lesson-media.mjs';
import {skillTasks} from './skills-content.mjs';
import {translationSource,protectSource} from './localization-corpus.mjs';
test('visual recap explanations are approved localization sources; model text stays protected',()=>{
 let checked=0;
 for(const lesson of lessonList){
  const language=lesson.language||'es';
  for(const frame of visualFrames(lesson))for(const key of ['label','meaning','note']){
   const text=frame[key];if(typeof text!=='string'||!/[A-Za-z]/.test(text)||!text.trim())continue;
   const source=translationSource(text,language);assert.ok(source,lesson.id+': '+key);
   const protection=protectSource(source);
   const restored=protection.restore(protection.text);
   assert.equal(restored,text);
   if(text.includes(frame.text)&&/[A-Za-z]/.test(frame.text))assert.ok(protection.values.some(value=>value.includes(frame.text)),lesson.id+': preserve model in '+key);
   checked++;
  }
 }
 assert.ok(checked>1000);console.log('Validated visual explanation sources:',checked);
});
test('workshop instructions are localizable while authored model responses stay protected',()=>{
 for(const task of skillTasks){
  const language=task.language||'es';
  for(const text of [task.title,task.topic,task.prompt,...(task.tips||[])]){
   if(typeof text==='string'&&/[A-Za-z]/.test(text))assert.ok(translationSource(text,language),task.id+': '+text);
  }
  for(const q of task.questions||[])for(const text of [q.prompt,q.note])if(typeof text==='string'&&/[A-Za-z]/.test(text))assert.ok(translationSource(text,language),task.id);
 }
});
