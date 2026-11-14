import canonical from './canonical.json' with {type:'json'};
// Questions about comprehension use the chosen interface language. Spoken
// material and the learner's roleplay responses stay in the learning language.
export function localizeUnit(key,{title,goal,opening,reading,listening,dialogue}){
 const base=canonical[key];if(!base||reading.length!==6||listening.length!==6||dialogue.length!==6)throw Error('Incomplete native case: '+key);
 const roleplay=base.questions.roleplay.map((q,i)=>{
  const [sceneLine,...answers]=dialogue[i],shift=(i+1)%3;
  if(answers.length!==3)throw Error('Incomplete native dialogue');
  return {...q,sceneLine,options:[...answers.slice(shift),...answers.slice(0,shift)],answer:(3-shift)%3};
 });
 return {...base,title,goal:goal||base.goal,opening,reading:reading.map((text,i)=>({text,point:base.readingPoints[i]})),listening:listening.map((text,i)=>({text,point:base.listeningPoints[i]})),questions:{...base.questions,roleplay}};
}
