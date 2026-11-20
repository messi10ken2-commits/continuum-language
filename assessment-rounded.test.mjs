import test from 'node:test';import assert from 'node:assert/strict';
import {assessmentItems,gradeAssessment,publicAssessment} from './assessment-bank.mjs';
import {allowedSpeech} from './speech-api.mjs';
import {translationSource,protectSource} from './localization-corpus.mjs';
import {lessonList,getLessonVariant,hasExpandedExercises} from './course.mjs';
const bands=['A1','A2','B1','B2','C1'];
for(const language of ['en','es','pt','ja'])test(`${language}: four balanced v4 forms, a small colloquial sample, protected instructions and authorised audio`,()=>{
 const vocabulary=new Set(),pragmatics=new Set(),newAudio=new Set();
 for(let form=0;form<4;form++){
  const version=language+'-diagnostic-4',items=assessmentItems(form,version);assert.equal(items.length,45);assert.equal(new Set(items.map(q=>q.id)).size,45);assert.deepEqual(items,assessmentItems(form,version));
  assert.equal(items.filter(q=>q.colloquial).length,1);
  for(const level of bands){const group=items.filter(q=>q.level===level);for(const skill of ['Reading','Language use','Listening'])assert.equal(group.filter(q=>q.skill===skill).length,3);for(const competency of ['grammar','vocabulary','pragmatics'])assert.equal(group.filter(q=>q.competency===competency).length,1);}
  for(const q of items){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options[q.answer]);if(q.audio)assert.ok(allowedSpeech(q.audio,q.locale));if(q.instructionOnly){const source=translationSource(q.prompt,language);assert.ok(source);if(q.context)assert.ok(!q.prompt.includes(q.options[q.answer])||q.prompt==='Read the message. Which interpretation fits this context?');protectSource(source).restore(protectSource(source).text);}if(q.competency==='vocabulary')vocabulary.add(q.context);if(q.competency==='pragmatics')pragmatics.add(q.prompt);if(q.id.endsWith('practical-listening'))newAudio.add(q.audio);}
  const answers=items.map(q=>q.answer),result=gradeAssessment(form,answers,version);assert.equal(result.level,'C1');assert.equal(result.correct,45);assert.equal(result.overallCefr,null);assert.deepEqual(result.competencies.map(x=>[x.total,x.correct]),[[5,5],[5,5],[5,5]]);
  assert.equal(gradeAssessment(form,items.map(()=>null),version).level,'Below A1');
  assert.equal(gradeAssessment(form,items.map(q=>q.colloquial?null:q.answer),version).level,'C1','one informal expression must not gate progression');
  assert.equal(gradeAssessment(form,items.map(q=>q.skill==='Listening'&&q.level==='A2'?null:q.answer),version).level,'A1','listening is part of the new recommendation');
  for(let index=0;index<47;index++){const state=publicAssessment({id:'test',version,form,answers:[...answers,null,null].slice(0,index)});assert.equal(state.total,47);assert.ok(state.question);assert.equal('answer' in state.question,false);assert.equal('level' in state.question,false);assert.equal('competency' in state.question,false);assert.equal(state.question.task?.model,undefined);assert.deepEqual(state,publicAssessment(JSON.parse(JSON.stringify({id:'test',version,form,answers:[...answers,null,null].slice(0,index)}))));}
 }
 assert.equal(vocabulary.size,20);assert.equal(pragmatics.size,20);assert.equal(newAudio.size,4);
});
test('new application prompts are held out from ordinary lesson questions',()=>{
 const prompts=new Set(lessonList.flatMap(l=>[...l.questions,...(hasExpandedExercises(l.id)?getLessonVariant(l.id,'v7-assessment-holdout-123456789').questions:[])].map(q=>q.prompt)));
 for(const language of ['en','es','pt','ja'])for(let form=0;form<4;form++)for(const q of assessmentItems(form,language+'-diagnostic-4').filter(q=>q.competency==='pragmatics'))assert.ok(!prompts.has(q.prompt),q.id);
});
