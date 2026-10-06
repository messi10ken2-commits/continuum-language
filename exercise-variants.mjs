import exerciseBank from './lesson-exercises.json' with {type:'json'};
export function hasExpandedExercises(id){return Object.hasOwn(exerciseBank,id);}
export function expandedExercises(base,seed){
 const source=exerciseBank[base.id];if(!source)throw Error('No expanded exercises for this lesson');
 let state=2166136261;for(const c of seed+base.id){state^=c.charCodeAt(0);state=Math.imul(state,16777619)>>>0;}
 const random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};
 const shuffle=xs=>{const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
 // Preserve the learning sequence and all coverage; only distractors and word
 // tiles shuffle. Never drop taught entries for the sake of a short session.
 const questions=source.map(q=>q.tokens?{...q,tokens:shuffle(q.tokens)}:q.options?(()=>{const order=shuffle(q.options.map((_,i)=>i));return {...q,options:order.map(i=>q.options[i]),answer:order.indexOf(q.answer)};})():{...q});
 return {...base,questions,exerciseVersion:2};
}
