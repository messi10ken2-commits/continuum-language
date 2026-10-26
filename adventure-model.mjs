import {getLesson} from './course.mjs';
import {journeyChapters,journeyLevels} from './journey-model.mjs';
export const companions=['bird','fox','cat','dog'];
export const quests=['listening','revisit','review','class'];
export function adventureRecord({language,attempts=[],days=[],classes=[],assignments=[],reviewCount=0,selection}){
 const valid=attempts.filter(a=>a.source==='exercise'&&getLesson(a.lesson)&&(getLesson(a.lesson).language||'es')===language&&Number.isFinite(a.score)&&a.score>=0&&a.score<=100&&Number.isFinite(Date.parse(a.at))),ordered=[...valid].sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 const completed=journeyLevels.flatMap(l=>journeyChapters(language,l,valid)).filter(c=>c.lessons.length&&c.completed===c.lessons.length);
 const returns=ordered.filter((a,i)=>ordered.slice(0,i).some(b=>b.lesson===a.lesson&&b.score<(getLesson(b.lesson).passScore||80)));
 const stamps=[...completed.map(c=>({id:'chapter:'+c.id,title:c.title,kind:'chapter',at:new Date(Math.max(...c.lessons.map(l=>Math.min(...ordered.filter(a=>a.lesson===l.id&&a.score>=(l.passScore||80)).map(a=>Date.parse(a.at)))))).toISOString()}))];
 if(returns.length)stamps.push({id:'return',title:'A brave return',kind:'return',at:returns[0].at});
 const activeDays=days.filter(d=>Number(d.studyMs)>=60000).length;
 if(activeDays>=3)stamps.push({id:'rhythm',title:'Three learning days',kind:'rhythm'});
 const since=Date.parse(selection?.startedAt),recent=ordered.filter(a=>Date.parse(a.at)>=since);
 const progress=selection?.quest==='review'?reviewCount:selection?.quest==='listening'?recent.filter(a=>getLesson(a.lesson).skill==='Listening').length:selection?.quest==='revisit'?recent.filter(a=>ordered.some(b=>b.lesson===a.lesson&&Date.parse(b.at)<Date.parse(a.at)&&b.score<(getLesson(b.lesson).passScore||80))).length:selection?.quest==='class'?classes.filter(c=>c.status==='completed'&&Date.parse(c.at)>=since).length+assignments.filter(a=>['submitted','reviewed'].includes(a.status)&&Date.parse(a.at)>=since).length:0;
 return {completed:completed.map(c=>({id:c.id,title:c.title})),stamps,progress:Math.min(selection?.quest==='review'?5:1,progress),target:selection?.quest==='review'?5:1,nextListening:journeyLevels.flatMap(l=>journeyChapters(language,l,valid)).flatMap(c=>c.lessons).find(l=>l.skill==='Listening')?.id,nextRevisit:ordered.find(a=>a.score<(getLesson(a.lesson).passScore||80))?.lesson};
}
