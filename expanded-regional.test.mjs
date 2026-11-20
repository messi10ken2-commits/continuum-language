import test from 'node:test';import assert from 'node:assert/strict';
import {expandedRegionalCourses} from './expanded-regional-courses.mjs';
import {expandedRegionalPairs} from './expanded-regional-pairs.mjs';
import {premiumCourses,premiumCourseById,archivedPremiumCourseSummary,gradeCourseAnswer} from './premium-courses.mjs';
import {speechLocales} from './speech-service.mjs';
const added=['zh','ko','fr','de','ar','it'];
for(const language of added)test(`${language}: regional replacement preserves archived results and complete practice`,()=>{
 const course=expandedRegionalCourses.find(c=>c.language===language),old=`${language}-exclusive-v1-listening`;
 assert.ok(course);assert.equal(premiumCourses.filter(c=>c.language===language).length,10);assert.ok(premiumCourses.includes(course));assert.ok(!premiumCourses.some(c=>c.id===old));assert.ok(premiumCourseById(old));assert.ok(archivedPremiumCourseSummary.some(c=>c.id===old));assert.notEqual(course.id,old);
 assert.equal(course.scene,'varieties');assert.equal(course.questions.length,8);assert.ok(course.breakdown.tables.length);assert.ok(new Set(course.questions.map(q=>q.type)).size>=4);assert.ok(course.references.length>=3);assert.equal(course.contentVersion,1);
 for(const q of course.questions){assert.ok(gradeCourseAnswer(q,q.answer));if(q.options){assert.equal(new Set(q.options).size,q.options.length);assert.ok(!gradeCourseAnswer(q,(q.answer+1)%q.options.length));}if(q.audio){assert.ok(speechLocales.includes(q.audioLocale));assert.equal(q.audioKind,'standard-reference');assert.ok(q.audioRegion.includes('not assessed'));}}
 assert.equal(course.questions.filter(q=>q.audio).length,2);
 for(const pair of expandedRegionalPairs[language]){assert.equal(pair.variants[1].locale,null);assert.ok(speechLocales.includes(pair.variants[0].locale));}
 for(const table of course.breakdown.tables)for(const row of table.rows)assert.equal(row.length,table.headers.length);
});
test('regional scope distinguishes language, standard, dialect and register without blanket rules',()=>{
 const by=id=>expandedRegionalCourses.find(c=>c.language===id);
 assert.ok(by('zh').breakdown.steps.some(x=>x.includes('Austronesian')));assert.ok(by('ko').breakdown.pitfall.includes('stranger'));assert.ok(by('de').breakdown.pitfall.includes('not one uniform dialect'));assert.ok(by('ar').breakdown.pitfall.includes('عايزة'));assert.ok(by('it').breakdown.pitfall.includes('not compulsory'));assert.ok(by('fr').breakdown.tables.some(t=>t.rows.some(r=>r.includes('déjeuner'))));
});
