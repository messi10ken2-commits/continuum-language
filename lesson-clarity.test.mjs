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
