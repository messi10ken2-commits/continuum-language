import test from 'node:test';import assert from 'node:assert/strict';
import {assessmentItems,gradeAssessment,publicAssessment} from './assessment-bank.mjs';
import {languageInfo,courseBands} from './languages.mjs';
import {lessonList} from './course.mjs';
import {expandedWorkshopTasks} from './expanded-workshops.mjs';
import {allowedSpeech} from './speech-api.mjs';
import {translationSource,protectSource} from './localization-corpus.mjs';
for(const language of ['zh','ko','fr','de','ar','it'])test(`${language}: four held-out forms, native listening, protected copy and productive tasks`,()=>{
 const seenPassages=new Set(),seenAudio=new Set(),lang=languageInfo(language),models=new Set(lessonList.filter(l=>l.language===language).map(l=>l.example));
 for(let form=0;form<4;form++){
  const version=language+'-diagnostic-4',items=assessmentItems(form,version);assert.equal(items.length,45);assert.equal(new Set(items.map(q=>q.id)).size,45);assert.deepEqual(items,assessmentItems(form,version));
  for(const level of courseBands){const group=items.filter(q=>q.level===level);for(const skill of ['Reading','Language use','Listening'])assert.equal(group.filter(q=>q.skill===skill).length,3);for(const c of ['grammar','vocabulary','pragmatics'])assert.equal(group.filter(q=>q.competency===c).length,1);const passage=group.find(q=>q.passage).passage,audio=group.find(q=>q.audio).audio;assert.ok(!seenPassages.has(passage));assert.ok(!seenAudio.has(audio));assert.notEqual(passage,audio);assert.ok(!models.has(passage)&&!models.has(audio));seenPassages.add(passage);seenAudio.add(audio);}
  for(const q of items){assert.equal(q.locale,lang.locale);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);if(q.audio)assert.ok(allowedSpeech(q.audio,lang.locale));const source=translationSource(q.prompt,language);assert.ok(source);const protectedSource=protectSource(source);assert.equal(protectedSource.restore(protectedSource.text),q.prompt);}
  const answers=items.map(q=>q.answer);assert.equal(gradeAssessment(form,answers,version).level,'C1');assert.equal(gradeAssessment(form,items.map(()=>null),version).level,'Below A1');assert.equal(gradeAssessment(form,items.map(q=>q.level==='A2'&&q.skill==='Listening'?null:q.answer),version).level,'A1');
  for(let index=0;index<47;index++){const state=publicAssessment({id:'new-language-matrix',version,form,answers:[...answers,null,null].slice(0,index)});assert.equal(state.total,47);assert.ok(state.question);assert.equal('answer' in state.question,false);assert.equal('competency' in state.question,false);if(index>=45){assert.equal(state.question.task.language,language);assert.equal(state.question.task.model,undefined);}}
 }
 assert.equal(seenPassages.size,20);assert.equal(seenAudio.size,20);assert.throws(()=>assessmentItems(0,language+'-diagnostic-3'),/Unsupported/);
 const tasks=expandedWorkshopTasks.filter(t=>t.language===language);assert.equal(tasks.length,15);for(const task of tasks){assert.equal(task.locale,lang.locale);assert.ok(task.model&&task.audio);assert.ok(!seenAudio.has(task.audio));assert.ok(allowedSpeech(task.audio,lang.locale));assert.equal(task.questions.length,3);}
});
