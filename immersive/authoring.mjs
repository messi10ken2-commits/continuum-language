// Content stays in the learning language. The source window is explicit so Light
// can present one manageable part without discarding the original evidence.
export function unit({title,goal,role,goals,opening,reading,listening,readQuestions,listenQuestions,missions,checkpoint}){
 const question=(row,stage,index)=>{
  const [prompt,correct,wrong1,wrong2,note,part=index]=row;
  const options=[correct,wrong1,wrong2];const shift=(index+1)%3;
  return {prompt,options:[...options.slice(shift),...options.slice(0,shift)],answer:(3-shift)%3,note,immersiveSource:{stage,part}};
 };
 return {title,goal,role,goals,opening,reading:reading.map(([text,point])=>({text,point})),listening:listening.map(([text,point])=>({text,point})),questions:{reading:readQuestions.map((r,i)=>question(r,'reading',i)),listening:listenQuestions.map((r,i)=>question(r,'listening',i)),roleplay:missions.map((r,i)=>({...question(r,'roleplay',i),sceneLine:r[0]})),checkpoint:checkpoint.map((r,i)=>question(r,i%2?'listening':'reading',r[5]??i%6))}};
}
export function caseStudy({reading,listening,...meta}){
 return unit({...meta,reading:reading.map(r=>[r[0],r[2]]),listening:listening.map(r=>[r[0],r[2]]),readQuestions:reading.map(r=>r.slice(1)),listenQuestions:listening.map(r=>r.slice(1))});
}
