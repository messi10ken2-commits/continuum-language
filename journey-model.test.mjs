import test from 'node:test';import assert from 'node:assert/strict';
import {journeyChapters,journeyMilestones,journeyLevels} from './journey-model.mjs';
import {lessonList} from './course.mjs';
test('every language and band exposes every current activity once with free selection',()=>{for(const language of ['en','es','pt','ja'])for(const level of journeyLevels){const chapters=journeyChapters(language,level),items=chapters.flatMap(c=>c.lessons),expected=lessonList.filter(l=>(l.language||'es')===language&&l.level===level);assert.ok(chapters.length>0);assert.equal(items.length,expected.length);assert.equal(new Set(items.map(l=>l.id)).size,expected.length);assert.ok(chapters.every(c=>c.next.id===c.lessons[0].id&&c.completed===0));}});
test('chapter completion uses valid exercise evidence and preserves course difficulty rather than granting assessed levels',()=>{const c=journeyChapters('ja','A1')[0],id=c.lessons[0].id,other=journeyChapters('en','A1')[0].lessons[0].id;for(const source of ['imported','invented',undefined])assert.equal(journeyChapters('ja','A1',[{lesson:id,source,score:100}])[0].completed,0);assert.equal(journeyChapters('ja','A1',[{lesson:other,source:'exercise',score:100}])[0].completed,0);assert.equal(journeyChapters('ja','A1',[{lesson:id,source:'exercise',score:Infinity}])[0].completed,0);assert.equal(journeyChapters('ja','A1',[{lesson:id,source:'exercise',score:0}])[0].completed,0);const pass={lesson:id,source:'exercise',score:100};assert.equal(journeyChapters('ja','A1',[pass,pass])[0].completed,1);assert.equal(journeyChapters('ja','A1',[pass])[0].next.id,c.lessons[1].id);});
test('milestones use distinct real exercise records and accumulated active study; zero history earns nothing',()=>{assert.ok(journeyMilestones().every(m=>!m.earned&&m.value===0));const attempts=lessonList.slice(0,5).map(l=>({lesson:l.id,source:'exercise',score:0}));assert.ok(journeyMilestones(attempts,{studyMs:'3600000',studyDays:7}).every(m=>m.earned));assert.ok(journeyMilestones(attempts.map(a=>({...a,source:'imported'})),{}).every(m=>!m.earned));assert.equal(journeyMilestones(Array(5).fill(attempts[0]))[1].earned,false);assert.ok(journeyMilestones([{source:'exercise',lesson:'made-up',score:100}]).every(m=>!m.earned));});

test('map completion uses the same full-history best scores as Learn, beyond the recent-history window',()=>{
 for(const language of ['es','en','pt','ja'])for(const level of ['A1','A2','B1','B2','C1']){
 const chapters=journeyChapters(language,level),lessons=chapters.flatMap(c=>c.lessons),progress=lessons.map(l=>({lesson:l.id,best:l.passScore||80,latest:0,count:2}));
 const recent=Array.from({length:50},()=>({lesson:'unknown',source:'exercise',score:100}));
 const map=journeyChapters(language,level,recent,progress);
 for(const c of map)assert.equal(c.completed,c.lessons.length);
 assert.ok(journeyChapters(language,level,recent,[]).every(c=>c.completed===0));
 const partial=journeyChapters(language,level,recent,progress.slice(1));assert.equal(partial[0].completed,partial[0].lessons.length-1);assert.equal(partial[0].next.id,lessons[0].id);
 }
});
