import entries from './everyday-expressions.json' with {type:'json'};
const spanish={A1:['a1-polite-contact','a1-ask-again'],A2:['a2-meet-and-plan','a2-practical-help'],B1:['b1-clarify-and-add','b1-reaction-patterns'],B2:['b2-idioms-pressure','b2-collaborate'],C1:['c1-read-subtext','c1-register-shift']};
const indices={A1:[9,10],A2:[9,10],B1:[9,12],B2:[9,8],C1:[9,10]};
export const everydayAdditions=new Map();
for(const language of ['es','en','pt','ja'])for(const level of ['A1','A2','B1','B2','C1']){
 const group=entries.filter(x=>x.language===language&&x.level===level);
 for(let i=0;i<2;i++){
  const id=language==='es'?spanish[level][i]:`${language}-${level.toLowerCase()}-v2-lesson-${indices[level][i]}`;
  everydayAdditions.set(id,group.slice(i*2,i*2+2).map(x=>({...x,type:'Conversational expression',region:x.register,phrase:x.term})));
 }
}
export function enrichEverydayLessons(lessons){
 for(let i=0;i<lessons.length;i++){const original=lessons[i],additions=everydayAdditions.get(original.id);if(!additions)continue;const lesson={...original};lessons[i]=lesson;
  const field=lesson.expressions?'expressions':'vocabulary';
  lesson[field]=[...(lesson[field]||[]),...additions.map(x=>({...x}))];
  lesson.minutes+=5;
 }
}
export function everydayQuestions(base){
 const additions=everydayAdditions.get(base.id);if(!additions)return [];
 const field=base.expressions||base.vocabulary,locale=base.locale||'es-ES';
 return additions.flatMap((x,i)=>{
  const index=field.findIndex(e=>e.term===x.term&&e.example===x.example),coverage=`entry:${index}:`,common={sourceLesson:base.id,promptLang:'en-US',note:`${x.meaning}. ${x.register} ${x.pitfall}`};
  const wrong=entries.filter(e=>e.language===x.language&&e.level===x.level&&e.term!==x.term).slice(0,2).map(e=>e.meaning);
  // Context and register interpretation, followed by a real phrase completion.
  const context={...common,id:base.id+'-everyday-'+i+'-context',coverage:coverage+'context',prompt:`${x.use} What does the reply mean in this situation?`,context:x.example,options:[x.meaning,...wrong],answer:0,optionsLang:'en-US',...(i%2?{audio:x.example,audioLocale:locale}:{passage:x.example,prompt:`${x.use} What does this reply mean? “${x.example}”`})};
  const at=x.example.toLocaleLowerCase().indexOf(x.term.toLocaleLowerCase());
  if(at<0)throw Error('Missing everyday phrase in example: '+x.term);
  const sentence=x.example.slice(0,at)+'____'+x.example.slice(at+x.term.length);
  const production={...common,id:base.id+'-everyday-'+i+'-production',coverage:coverage+'production',type:'text',mode:'application',prompt:`${x.use} Complete the reply with the conversational expression from this lesson: ${sentence}`,answer:x.example.slice(at,at+x.term.length),answerLocale:locale};
  return [context,production];
 });
}
