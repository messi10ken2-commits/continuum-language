import {correctEntryNote} from './expression-watchouts.mjs';
import {everydayQuestions} from './everyday-expressions.mjs';
import {qualityQuestions} from './question-quality.mjs';
import {appliedExercises} from './applied-exercises.mjs';
import {practicalFormQuestions} from './practical-form-questions.mjs';
import exerciseBank from './lesson-exercises.json' with {type:'json'};
import practicalBank from './practical-exercises.json' with {type:'json'};
export function hasExpandedExercises(id){return Object.hasOwn(exerciseBank,id);}
export function expandedExercises(base,seed){
 let source=(/^v[34567]-/.test(seed)&&practicalBank[base.id])||exerciseBank[base.id];if(!source)throw Error('No expanded exercises for this lesson');
 if(/^v[4567]-/.test(seed))source=source.flatMap(q=>{
  const replacement=practicalFormQuestions[base.id]?.[q.coverage];
  if(!replacement)return [q];
  return (Array.isArray(replacement)?replacement:[replacement]).map((item,i)=>({...item,sourceLesson:base.id,coverage:q.coverage,id:`${q.id}-practical-${i}`,promptLang:'en-US',optionsLang:item.optionsLang||q.optionsLang}));
 });
 let state=2166136261;for(const c of seed+base.id){state^=c.charCodeAt(0);state=Math.imul(state,16777619)>>>0;}
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const shuffle=xs=>{const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 // Preserve the learning sequence and all coverage; only distractors and word
 // tiles shuffle. Never drop taught entries for the sake of a short session.
 if(/^v[67]-/.test(seed))source=qualityQuestions(base,source);
 if(/^v[567]-/.test(seed))source=appliedExercises(base,source,random);
 if(seed.startsWith('v7-'))source=[...source,...everydayQuestions(base)];
 source=source.map(q=>correctEntryNote(base,q));
 const questions=source.map(q=>q.tokens?{...q,tokens:shuffle(q.tokens)}:q.options?(()=>{const order=shuffle(q.options.map((_,i)=>i));return {...q,options:order.map(i=>q.options[i]),answer:order.indexOf(q.answer)};})():{...q});
 return {...base,questions,exerciseVersion:Number(seed[1])};
}
