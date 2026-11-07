import {chapters,lessonList,levels} from './course.mjs';
import {lightActivities,lightRoundCount,priorLightVersion} from './light-learning-model.mjs';
export function lightRoute(language,level){return chapters.filter(c=>(c.language||'es')===language&&!c.legacy&&(!level||c.level===level)).flatMap(c=>lessonList.filter(l=>l.chapter===c.id&&(l.language||'es')===language&&!l.checkpoint&&!l.summaryTest&&lightRoundCount(l)).map(lesson=>({lesson,chapter:c,legacyRounds:lightRoundCount(lesson)}))).sort((a,b)=>levels.findIndex(l=>l.id===a.lesson.level)-levels.findIndex(l=>l.id===b.lesson.level));}
// Old rounds remain reward events. Only a full legacy lesson or a new pass
// advances the lesson path, and a replay cannot earn a second lesson reward.
export function lightProgressEvidence(route,completed){
 const limits=new Map(route.map(row=>[row.lesson.id,row.legacyRounds]));
 const unique=new Map();
 for(const row of completed){
  const limit=limits.get(row.lesson);
  if(!limit||(!row.lessonPass&&(!Number.isInteger(row.round)||row.round<0||row.round>=limit)))continue;
  const key=row.lesson+':'+(row.lessonPass?'pass':row.round);
  if(!unique.has(key))unique.set(key,row);
 }
 const ordered=[...unique.values()].sort((a,b)=>{
  const first=Date.parse(a.completedAt)||0,second=Date.parse(b.completedAt)||0;
  return first-second||(first?String(a.id).localeCompare(String(b.id)):0);
 });
 const keys=new Set(),legacyCounts=new Map(),clears=[],buildings=[];
 for(const row of ordered){
  if(row.lessonPass&&keys.has(row.lesson))continue;
  clears.push(row);
  const count=(legacyCounts.get(row.lesson)||0)+1;
  if(!row.lessonPass)legacyCounts.set(row.lesson,count);
  if(!keys.has(row.lesson)&&(row.lessonPass||count===limits.get(row.lesson))){
   keys.add(row.lesson);
   buildings.push({lesson:row.lesson,clearId:row.id});
  }
 }
 return {keys,clears,buildings};
}
export function lightRouteStats(route,completed){
 const {keys,clears}=lightProgressEvidence(route,completed);
 const lessons=new Map(route.map(({lesson})=>[lesson.id,lesson]));
 const xp=clears.reduce((sum,row)=>sum+(row.xp??lightActivities(lessons.get(row.lesson),row.round,priorLightVersion).length*10),0);
 return {total:route.length,done:keys.size,xp,keys};
}
export function nextLightLesson(lesson){
 const route=lightRoute(lesson.language||'es'),index=route.findIndex(row=>row.lesson.id===lesson.id);
 return index>=0?route[index+1]?.lesson.id:null;
}
