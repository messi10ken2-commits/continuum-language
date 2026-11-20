import test from 'node:test';
import assert from 'node:assert/strict';
import {premiumSkillTasks,premiumSkillSummary,legacyPremiumSkillTasks} from './premium-skills.mjs';
import {focusCopy} from './focus-copy.mjs';
const levels=['A1','A2','B1','B2','C1'];
test('every language and focused scenario has distinct level-specific content and a safe public summary',()=>{
 assert.equal(legacyPremiumSkillTasks.length,60);assert.equal(new Set(premiumSkillTasks.map(t=>t.id)).size,660);
 assert.equal(premiumSkillSummary.length,600);
 for(const language of ['en','es','pt','ja'])for(const scene of ['interview','travel','work','living'])for(const skill of ['Listening','Writing','Speaking']){
  const tasks=levels.map(level=>premiumSkillTasks.find(t=>t.language===language&&t.scene===scene&&t.skill===skill&&t.level===level&&t.id.endsWith('-'+level.toLowerCase())));
  assert.ok(tasks.every(Boolean));assert.equal(new Set(tasks.map(t=>t.prompt)).size,skill==='Listening'?4:5);
  assert.equal(new Set(tasks.map(t=>t.audio)).size,5);assert.equal(new Set(tasks.map(t=>t.model)).size,5);
  assert.equal(new Set(tasks.map(t=>t.words[0])).size,5);assert.equal(new Set(tasks.map(t=>t.seconds)).size,5);
  for(const t of tasks){assert.ok(focusCopy[t.prompt],t.prompt);for(const q of t.questions){assert.equal(q.options.length,3);assert.ok(q.options[q.answer]);assert.ok(focusCopy[q.prompt],q.prompt);for(const option of q.options)assert.ok(focusCopy[option],option)} }
 }
 for(const t of premiumSkillSummary){assert.deepEqual(Object.keys(t).sort(),['id','language','level','premium','scene','skill','title']);assert.ok(!('audio' in t)&&!('questions' in t)&&!('model' in t));}
});
test('legacy attempts continue resolving unchanged while new catalog contains only level-specific IDs',()=>{
 for(const legacy of legacyPremiumSkillTasks){assert.equal(premiumSkillTasks.find(t=>t.id===legacy.id),legacy);assert.ok(!premiumSkillSummary.some(t=>t.id===legacy.id));}
});
