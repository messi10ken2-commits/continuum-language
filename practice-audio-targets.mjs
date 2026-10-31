// SERVER/AUDIT ONLY: keep Premium Practice Studio transcripts out of public JS.
import {skillTasks} from './skills-content.mjs';
import {premiumSkillTasks} from './premium-skills.mjs';
import {speechParts} from './sentence-audio.mjs';
function collector(){const map=new Map();return {add(text,lang,fallback,scope,id){if(typeof text!=='string'||!text.trim())return;for(const p of speechParts(text,lang,fallback)){const text=p.text.normalize('NFC').trim();if(!text)continue;const key=JSON.stringify([p.lang,text]),row=map.get(key)||{text,locale:p.lang,scopes:[],lessons:[]};if(!row.scopes.includes(scope))row.scopes.push(scope);if(!row.lessons.includes(id))row.lessons.push(id);map.set(key,row);}},rows:()=>[...map.values()]};}
export function freePracticeAudioTargets(){
 const c=collector();for(const task of skillTasks.filter(t=>!t.premium)){
  const locale=task.locale||'es-ES';c.add(task.model,locale,locale,'workshop-model',task.id);
  if(task.skill==='Listening'){
   c.add(task.audio,locale,locale,'workshop-listening',task.id);
   for(const q of task.questions){c.add(q.prompt,'auto',locale,'workshop-question',task.id);for(const option of q.options)c.add(option,q.optionsLang||locale,locale,'workshop-option',task.id);}
  }else c.add(task.prompt,'auto',locale,'workshop-prompt',task.id);
 }return c.rows();
}
export function premiumPracticeAudioTargets(){
 const c=collector();for(const task of premiumSkillTasks){const locale=task.locale||'es-ES';
  c.add(task.audio,locale,locale,'premium-workshop-audio',task.id);c.add(task.model,locale,locale,'premium-workshop-model',task.id);
  if(task.skill!=='Listening')c.add(task.prompt,'en-US','en-US','premium-workshop-prompt',task.id);
 }return c.rows();
}
