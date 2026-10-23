// Client-safe presentation only: never import the server's answer-key catalog.
export function exclusiveSession(course,seed){
 let state=2166136261;for(const c of String(seed)+course.id){state^=c.charCodeAt(0);state=Math.imul(state,16777619)>>>0;}
 const shuffle=values=>{const out=[...values];for(let i=out.length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=Math.floor(state/4294967296*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;};
 const source=course.questions.map((q,i)=>{
  const optionOrder=q.options?.map((_,index)=>index),order=seed&&optionOrder&&!q.preserveOptionOrder?shuffle(optionOrder):optionOrder;
  return {...q,_sourceIndex:i,_optionOrder:order,...(order?{options:order.map(index=>q.options[index])}:{}),...(seed&&q.tokens?{tokens:shuffle(q.tokens)}:{})};
 });
 if(!seed||course.preserveQuestionOrder)return {...course,questions:source};
 const questions=shuffle(source);
 if(questions.length>1&&questions.every((q,i)=>q._sourceIndex===i))questions.push(questions.shift());
 return {...course,questions};
}
export function exclusiveAnswer(question,answer){return question._optionOrder&&Number.isInteger(answer)?question._optionOrder[answer]:answer;}
export function exclusiveAnswers(session,answers){const original=Array(session.questions.length);session.questions.forEach((q,i)=>{original[q._sourceIndex]=exclusiveAnswer(q,answers[i])});return original;}
export function premiumGalleryFrames(course){
 const frames=[],seen=new Set();
 const add=(text,meaning,label)=>{if(typeof text!=='string'||!text.trim()||seen.has(text))return;seen.add(text);frames.push({text,meaning:meaning||'',label});};
 for(const text of course.examples||[])add(text,'','Example');
 for(const [text,meaning] of course.breakdown?.examples||[])add(text,meaning,'See the meaning in context');
 for(const word of course.vocabulary||[])add(word.phrase||word.term,word.meaning,'Useful expressions for this situation');
 return frames;
}
