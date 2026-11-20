export function immersiveRecordingPlaylist(lesson,unit,{stage,part,all=false}){
 if(!['reading','listening','roleplay'].includes(stage)||!Number.isInteger(part)||part<0||part>5)return [];
 const rows=stage==='roleplay'?unit.questions.roleplay.map(q=>({text:q.sceneLine})):unit[stage];
 // The roleplay partner asks the current question, never six unrelated turns
 // in one recording. Full narration is an explicit reading/listening option.
 return rows.flatMap((row,i)=>(stage!=='roleplay'&&all)||i===part?[{text:row.text,lang:lesson.locale,endpoint:`/api/immersive/audio/${lesson.id}/${stage}/${i}`}]:[]);
}
