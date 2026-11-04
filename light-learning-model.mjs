import {isInstructionalExample} from './lesson-copy-roles.mjs';
import {displayLanguageOptions} from './answer-language.mjs';
export const lightVersion='light-v1';
// Practice only authored models/meanings. These activities never replace a test.
export function lightActivities(lesson){
 if(!lesson||lesson.checkpoint||lesson.summaryTest)return [];
 if(lesson.conversation)return (lesson.questions||[]).filter(q=>q.options?.length>1&&Number.isInteger(q.answer)).slice(0,2).map((q,i)=>({id:`video-${i}`,type:'video',question:q,meaning:q.options[q.answer],options:[q.options[q.answer],q.options.find(v=>v!==q.options[q.answer])].sort((a,b)=>a.localeCompare(b))}));
 const pairs=[],seen=new Set();
 const add=(model,meaning,meaningNative=false)=>{if(typeof model==='string'&&!meaning){const first=[...new Intl.Segmenter(lesson.locale||'en',{granularity:'sentence'}).segment(model)][0];if(first)model=first.segment.trim()}if(typeof model!=='string'||!model.trim()||model.length>220||model.split(/\s+/).length>30||seen.has(model.trim())||/_{2,}|https?:/.test(model))return;seen.add(model.trim());pairs.push({model:model.trim(),meaningNative,meaning:typeof meaning==='string'&&meaning.trim()!==model.trim()?meaning.trim():''})};
 for(const w of [...(lesson.vocabulary||[]),...(lesson.expressions||[])])add(w.term||w.phrase,w.meaning||w.translation);
 for(const row of lesson.breakdown?.examples||[])if(Array.isArray(row))add(row[0],row[1]);
 for(const c of lesson.characters||[])add(c.glyph,c.meaning,lesson.language==='ko'&&/^[\u3130-\u318f\u1100-\u11ff\s+]+$/u.test(c.meaning||''));
 if(!isInstructionalExample(lesson))add(lesson.example);
 for(const [a,b] of lesson.soundGuide?.pairs||[]){add(a);add(b)}
 for(const q of lesson.questions||[])if(!displayLanguageOptions(q,lesson)&&(!q.optionsLang||q.optionsLang.split('-')[0]===(lesson.language||'es')))add(q.audioSpeech||q.audio||(q.type==='text'?q.answer:q.options?.[q.answer]));
 const selected=pairs.slice(0,2);return selected.flatMap((p,i)=>[{...p,id:`${i}-observe`,type:'observe'}, {...p,id:`${i}-practice`,type:p.meaning&&pairs.some(v=>v.meaning&&v.meaning!==p.meaning)?'meaning':'build',options:p.meaning?[p.meaning,pairs.find(v=>v.meaning&&v.meaning!==p.meaning)?.meaning].filter(Boolean).sort((a,b)=>a.localeCompare(b)):[],joiner:/\s/.test(p.model)?' ':'',tokens:(/\s/.test(p.model)?p.model.split(/\s+/):Array.from(new Intl.Segmenter(lesson.locale||'en',{granularity:'grapheme'}).segment(p.model),v=>v.segment)).reverse()}]);
}
export function lightCorrect(activity,answer){return activity.type==='observe'?answer===true:['meaning','video'].includes(activity.type)?answer===activity.meaning:typeof answer==='string'&&answer.replace(/\s+/g,' ').trim()===activity.model.replace(/\s+/g,' ').trim();}

export function lightChoiceValid(activity,value){return value===null||activity.type==='observe'&&value===true||['meaning','video'].includes(activity.type)&&activity.options.includes(value)||activity.type==='build'&&Array.isArray(value)&&value.length<=activity.tokens.length&&value.every((n,i)=>Number.isInteger(n)&&n>=0&&n<activity.tokens.length&&value.indexOf(n)===i);}
export function lightAnswer(activity,value){return activity.type==='build'?value?.map(i=>activity.tokens[i]).join(activity.joiner):value;}
export function validLightState(activities,state){return !!state&&state.version===lightVersion&&Array.isArray(state.steps)&&state.steps.length<=activities.length&&state.steps.every((s,i)=>s&&typeof s.hint==='boolean'&&lightCorrect(activities[i],s.answer))&&typeof state.hint==='boolean'&&typeof state.checked==='boolean'&&(state.steps.length===activities.length?state.choice===null:lightChoiceValid(activities[state.steps.length],state.choice));}
