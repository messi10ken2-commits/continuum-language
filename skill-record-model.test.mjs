import test from 'node:test';import assert from 'node:assert/strict';
import {skillSubmissionTask,skillRecordsForLanguage} from './skill-record-model.mjs';
const records=[{id:'spanish',task:'skills-a1-writing'},{id:'french',task:'fr-skills-a1-writing'},{id:'korean-premium',task:'focus-ko-work-writing-b2',taskInfo:{id:'focus-ko-work-writing-b2',language:'ko',title:'Workplace communication',skill:'Writing',premium:true}},{id:'unknown',task:'retired-unknown-task'}];
test('counts and lists are scoped to the selected learning language, including unopened Premium tasks',()=>{
 for(const [language,expected] of [['es',['spanish']],['fr',['french']],['ko',['korean-premium']],['ar',[]]])assert.deepEqual(skillRecordsForLanguage(records,language).map(r=>r.id),expected);
 assert.equal(skillSubmissionTask(records[2]).language,'ko');assert.equal(skillSubmissionTask(records[3]),undefined);assert.equal(skillRecordsForLanguage(records).length,4);
});
