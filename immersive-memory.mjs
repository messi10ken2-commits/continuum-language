import {getLesson} from './course.mjs';
import {lightActivities,lightLessonVersion,validLightState} from './light-learning-model.mjs';
// Derived evidence only: Light records never become Standard completion records.
export function immersiveLightEvidence(records=[]){
 return records.flatMap(record=>{
  const lesson=getLesson(record.lesson),state=record.state;
  if(!lesson?.immersive||state?.version!==lightLessonVersion)return [];
  const activities=lightActivities(lesson,0,state.version);
  if(state.steps?.length!==activities.length||!validLightState(activities,state))return [];
  const correct=state.steps.filter(s=>s.missed===false).length,total=activities.length;
  return [{id:'light-'+record.id,lesson:lesson.id,at:record.at,source:'light',score:Math.round(correct/total*100),total,evidence:[{lesson:lesson.id,correct,total,items:activities.map((a,i)=>({prompt:a.question.prompt,correct:!state.steps[i].missed,response:state.steps[i].missed?null:state.steps[i].answer,expected:a.meaning,explanation:a.question.note||'',firstAttempt:true}))}]}];
 });
}
