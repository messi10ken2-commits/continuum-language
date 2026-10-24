import {chapters,lessonList} from './course.mjs';
export const journeyLevels=['A1','A2','B1','B2','C1'];
export const dailyGoals=[5,10,15,20,30];
export function journeyChapters(language,level,attempts=[]){
 const lessons=lessonList.filter(l=>(l.language||'es')===language&&l.level===level),earned=new Set(attempts.filter(a=>a.source==='exercise'&&Number.isFinite(a.score)&&a.score>=0&&a.score<=100).filter(a=>{const l=lessons.find(l=>l.id===a.lesson);return l&&a.score>=(l.passScore||80)}).map(a=>a.lesson));
 return [...new Set(lessons.map(l=>l.chapter))].map(id=>{const c=chapters.find(c=>c.id===id),items=lessons.filter(l=>l.chapter===id);return {id,title:c?.title||items[0].title,lessons:items,completed:items.filter(l=>earned.has(l.id)).length,next:items.find(l=>!earned.has(l.id))||items[0]};});
}
export function journeyMilestones(attempts=[],activity={}){
 const known=new Set(lessonList.map(l=>l.id)),practised=new Set(attempts.filter(a=>a.source==='exercise'&&known.has(a.lesson)&&Number.isFinite(a.score)&&a.score>=0&&a.score<=100).map(a=>a.lesson));
 return [{id:'first',title:'First recorded practice',earned:practised.size>=1,value:Math.min(1,practised.size),target:1},{id:'five',title:'Five activities explored',earned:practised.size>=5,value:Math.min(5,practised.size),target:5},{id:'hour',title:'An hour of active study',earned:Number(activity.studyMs)>=3600000,value:Math.min(60,Math.floor(Number(activity.studyMs||0)/60000)),target:60},{id:'week',title:'Seven study days',earned:Number(activity.studyDays)>=7,value:Math.min(7,Number(activity.studyDays||0)),target:7}];
}
