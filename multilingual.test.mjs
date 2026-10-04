import test from 'node:test';import assert from 'node:assert/strict';
import {lessonList,chapters,getLessonVariant,gradeLesson} from './course.mjs';
import {getSkillTask} from './skills-content.mjs';
import {assessmentItems,gradeAssessment,publicAssessment} from './assessment-bank.mjs';
import {languageInfo,courseBands} from './languages.mjs';
const seed='v1-multilingual-123456789';
for(const language of ['ja','pt','en'])test(language+' has playable lessons, independently scored tests and correctly routed production tasks',()=>{
 const lessons=lessonList.filter(l=>l.language===language);assert.equal(lessons.length,20);
 for(const level of courseBands){const units=lessons.filter(l=>l.level===level);assert.equal(units.length,4);assert.ok(units.some(l=>l.summaryTest));for(const skill of ['listening','writing','speaking'])assert.equal(getSkillTask(`${language}-skills-${level.toLowerCase()}-${skill}`).locale,languageInfo(language).locale);}
 for(const l of lessons){const selected=l.checkpoint||l.summaryTest?getLessonVariant(l.id,seed):l;assert.equal(gradeLesson(l.id,selected.questions.map(q=>q.answer),l.checkpoint||l.summaryTest?seed:undefined).score,100);assert.equal(gradeLesson(l.id,selected.questions.map(q=>(q.answer+1)%q.options.length),l.checkpoint||l.summaryTest?seed:undefined).score,0);if(l.summaryTest)assert.equal(l.passScore,85);}
 for(const form of [0,1,2]){const version=language+'-diagnostic-2',items=assessmentItems(form,version);assert.equal(items.length,45);assert.equal(new Set(items.map(q=>q.id)).size,45);const answers=items.map(q=>q.answer);assert.equal(gradeAssessment(form,answers,version).level,'C1');assert.equal(gradeAssessment(form,items.map(()=>null),version).level,'Below A1');const row={id:'test',form,version,answers:[],language};assert.equal('answer' in publicAssessment(row).question,false);for(const n of [45,46]){const q=publicAssessment({...row,answers:[...answers,...(n===46?[null]:[])]}).question;assert.equal(q.task.language,language);assert.equal(q.task.locale,languageInfo(language).locale);assert.equal('model' in q.task,false);}}
});
test('Spanish checkpoints never draw another language',()=>{for(const l of lessonList.filter(l=>!l.language&&(l.checkpoint||l.summaryTest))){const v=getLessonVariant(l.id,seed);assert.ok(v.questions.every(q=>chapters.some(c=>!c.language&&c.title===q.topic)));}});
