import {appliedScenarios} from './applied-scenarios.mjs';
import {appliedListening} from './applied-listening.mjs';
import {appliedCommunication} from './applied-communication.mjs';
export {appliedScenarios,appliedListening,appliedCommunication};
export const appliedQuestionBank=[...Object.values(appliedScenarios),...Object.values(appliedListening),...Object.values(appliedCommunication)].flat();
const affectedSkills=new Set(['Grammar','Listening','Reading','Speaking','Writing','Pronunciation']);
export const hasAppliedPractice=base=>!base.specialist&&!base.checkpoint&&!base.summaryTest&&affectedSkills.has(base.skill);
const classify=q=>({...q,viewpoint:q.viewpoint||(q.mode==='order'?'construction':/^Correct|^Remove|^Replace/.test(q.prompt)?'repair':q.type==='text'?'production':'interpretation')});
function mixGroups(groups){const result=[];for(let i=0;groups.some(g=>i<g.length);i++)for(const g of groups)if(g[i])result.push(g[i]);return result;}
export function appliedExercises(base,source,random){
 if(!hasAppliedPractice(base))return source;
 const pick=xs=>xs[Math.floor(random()*xs.length)];
 const shuffled=xs=>{const copy=[...xs];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;};
 if(appliedListening[base.id]){const groups=new Map();for(const q of appliedListening[base.id]){const g=groups.get(q.coverage)||[];g.push(q);groups.set(q.coverage,g);}return [...groups.values()].map(qs=>classify(pick(qs)));}
 const scenario=(appliedScenarios[base.id]||appliedCommunication[base.id]||[]).map(classify);
 if(base.skill==='Grammar'){
  const tables=new Map(),examples=new Map(),applications=[],other=[];
  for(const q of source){const row=/^(table:\d+:\d+):/.exec(q.coverage||'');
   if(row){const group=tables.get(row[1])||[];group.push(q);tables.set(row[1],group);}
   else if(/^example:/.test(q.coverage||'')){const group=examples.get(q.coverage)||[];group.push(q);examples.set(q.coverage,group);}
   else if(/^application:/.test(q.coverage||''))applications.push(q);else other.push(q);
  }
  // Every conjugation/comparison row remains represented. Different columns
  // rotate across saved runs; the full table stays available in the reference.
  const forms=[...tables.values()].map(pick).map(classify);
  const constructions=[...examples.values()].map(pick).map(classify);
  const transfer=shuffled(applications).slice(0,Math.max(3,Math.ceil(applications.length/2))).map(classify);
  const chosen=mixGroups([forms,[...scenario,...transfer],constructions,other.map(classify)]);
  return chosen.length?chosen:source;
 }
 // Ordinary communication lessons previously asked three times about each
 // model. Keep one task per taught entry, with task types rotated by the seed.
 const entries=new Map(),other=[];
 for(const q of source){const match=/^entry:(\d+):/.exec(q.coverage||'');if(match){const group=entries.get(match[1])||[];group.push(q);entries.set(match[1],group);}else other.push(q);}
 const offset=Math.floor(random()*3);
 const selected=[...entries.values()].map((qs,i)=>{const kinds=['context','recall','combination'],kind=kinds[(i+offset)%3],preferred=qs.filter(q=>q.coverage.endsWith(':'+kind));return classify(pick(preferred.length?preferred:qs));});
 return mixGroups([selected,scenario,other.map(classify)]);
}
