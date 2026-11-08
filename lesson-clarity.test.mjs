import test from 'node:test';
import assert from 'node:assert/strict';
import {lessonList,getLesson} from './course.mjs';
import {visualFrames,hasRecapVideo} from './lesson-media.mjs';
import {savedTimelineEvents} from './saved-timeline.mjs';
import {questionPromptSource} from './question-presentation.mjs';
test('all lesson galleries use unique authored examples, never an English title as target speech',()=>{
 for(const lesson of lessonList){const frames=visualFrames(lesson,{all:true});assert.equal(new Set(frames.map(f=>f.text.trim()+'\0'+(f.meaning||''))).size,frames.length,lesson.id);assert.ok(!frames.some(f=>f.lang==='en-US'&&f.text===lesson.title&&(lesson.language||'es')!=='en'),lesson.id);}
 const directions=getLesson('directions');assert.deepEqual(visualFrames(directions).map(f=>f.text),['Sigue todo recto y luego gira a la izquierda.']);assert.equal(hasRecapVideo(directions),false);
});
test('teacher timeline retains every attempt, scores, categories, times and unmodified notes',()=>{
 const attempts=Array.from({length:50},(_,i)=>({id:i,lesson:'directions',at:new Date(Date.UTC(2026,9,1+i)).toISOString(),score:80,total:5}));
 const note={id:7,at:'2026-12-01T00:00:00Z',focus:'Private learner text',teacher:'Teacher',note:'Unchanged: pagar con tarjeta.'};
 const events=savedTimelineEvents(attempts,[note],id=>getLesson(id)?.title||id);
 assert.equal(events.length,51);assert.equal(events[0].note,note.note);assert.equal(new Set(events.map(e=>e.id)).size,51);assert.equal(events.filter(e=>e.lesson==='directions'&&e.score===80&&e.total===5&&e.withTime).length,50);
});
test('concise question presentation preserves the full task body and does not mutate grading data',()=>{
 for(const prompt of ["Complete the model with the lesson's wording.\nSigue ____ y luego gira a la izquierda.\nWrite only the missing phrase.",'Rebuild the model for: “We live in Madrid.”\nBegin with “Vivimos”.','Use the information below to produce the requested form. Type only that form, not its grammatical name.\nSubject: tú\nhablar: ____','What does this mean? Pagar con tarjeta.']){
  const q={id:'saved-question',prompt,answer:'test',accepted:['test','alternative']},before=structuredClone(q),parts=questionPromptSource(q);assert.ok(parts);assert.ok(prompt.endsWith(parts.body));assert.ok(parts.instruction.length<80);assert.deepEqual(q,before);
 }
 assert.equal(questionPromptSource({prompt:'Choose a polite request that allows a later reply.'}),null,'unrecognized constraints are never removed');
});

test('full-sentence Japanese routine questions specify the meaning and the response format',async()=>{
 const {qualityQuestionBank}=await import('./question-quality.mjs');
 const {getLessonVariant}=await import('./course.mjs');
 const lesson=getLesson('ja-a1-v2-lesson-3');
 const expected=['パンを食べます。','家で勉強します。','六時に起きます。','毎朝走ります。','明日働きます。'];
 for(const version of [4,5,6,7,8]){
  const questions=getLessonVariant(lesson.id,`v${version}-clarity-fixture-12345`).questions.filter(q=>/^table:0:[0-4]:2$/.test(q.coverage));
  assert.ok(questions.length>0);
  for(const q of questions){
   const row=Number(q.coverage.split(':')[2]);
   const prompt=questionPromptSource(q);
   assert.equal(prompt.instruction,'Write the full sentence in polite Japanese.');
   assert.match(prompt.body,/^Say “.+” Use the verb /);
   assert.equal(q.answer,expected[row]);
  }
 }
 assert.equal(qualityQuestionBank(lesson).filter(q=>/^table:0:[0-4]:2$/.test(q.coverage)).length,5);
 for(const base of lessonList){
  for(const q of qualityQuestionBank(base))assert.doesNotMatch(q.prompt,/(?:^|\n)Example: ____\s*$/,`${base.id} ${q.coverage}`);
 }
});
