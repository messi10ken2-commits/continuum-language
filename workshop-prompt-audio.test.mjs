import test from 'node:test';
import assert from 'node:assert/strict';
import {skillTasks} from './skills-content.mjs';
import {freePracticeAudioTargets} from './practice-audio-targets.mjs';

test('Spanish workshop comprehension prompts retain their authored audio locale',()=>{
 const targets=freePracticeAudioTargets();
 const tasks=skillTasks.filter(t=>/^skills-[a-c][12]-listening$/.test(t.id));
 assert.equal(tasks.length,5);
 for(const task of tasks)for(const q of task.questions){
  assert.equal(q.promptLocale,'es-ES');
  assert.ok(targets.some(r=>r.text===q.prompt&&r.locale==='es-ES'),q.prompt);
  assert.ok(!targets.some(r=>r.text===q.prompt&&r.locale==='en-US'),q.prompt);
 }
});
