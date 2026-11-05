import React,{useEffect,useMemo,useState} from 'react';
import {Star,LockKeyhole,Check,ArrowRight,Flame,Trophy,Clock,Feather,Gift,Play} from 'lucide-react';
import {t,tf} from './interface-runtime.mjs';
import LessonText from './LessonText.jsx';
import {levels} from './course.mjs';
import {lightRoute,lightRouteStats,lightRoundKey} from './light-route.mjs';
import {lightProgress,LessonModeControl} from './LightLesson.jsx';
import {TownScene,TownRewardArt,TownGem,TownRibbon,TownSegments,townRewards,useLightCompanion} from './LightTown.jsx';
import {materialsPerRound} from './light-town.mjs';
import {lightActivities} from './light-learning-model.mjs';
import {languageInfo} from './languages.mjs';
export default function LightPath({language,user,onStart,onMode,level,setLevel}){
 const [completed,setCompleted]=useState([]),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[reload,setReload]=useState(0);
 useEffect(()=>{let live=true;setReady(false);setFailed(false);lightProgress(user).then(rows=>{if(live){setCompleted(rows);setReady(true)}}).catch(()=>{if(live)setFailed(true)});return()=>{live=false}},[user?.id,language,reload]);
 const kind=useLightCompanion(user,language),[selected,setSelected]=useState(null);
 const languageRoute=useMemo(()=>lightRoute(language),[language]);
 const route=languageRoute.filter(row=>row.chapter.level===level),stats=lightRouteStats(route,completed),allStats=lightRouteStats(languageRoute,completed);
 const pending=route.flatMap(row=>Array.from({length:row.rounds},(_,round)=>({lesson:row.lesson.id,round}))).find(r=>!stats.keys.has(lightRoundKey(r.lesson,r.round)));
 const chapters=[...new Set(route.map(r=>r.chapter))];let previous=true;
 const chapter=chapters.find(c=>c.id===selected)||route.find(r=>r.lesson.id===pending?.lesson)?.chapter||chapters[0];
 const chapterRows=route.filter(r=>r.chapter.id===chapter?.id);
 const chapterStats=lightRouteStats(chapterRows,completed);
 const mission=chapterRows.find(r=>r.lesson.id===pending?.lesson);
 const languageLessons=new Set(languageRoute.map(r=>r.lesson.id));
 const materials=completed.reduce((n,r)=>n+(languageLessons.has(r.lesson)?r.materials??materialsPerRound:0),0);
 const places=chapterRows.slice(Math.max(0,chapterRows.indexOf(mission)-1),Math.max(0,chapterRows.indexOf(mission)-1)+4).map(r=>{
  const round=Array.from({length:r.rounds},(_,i)=>i).find(i=>!stats.keys.has(lightRoundKey(r.lesson.id,i)));
  const status=round===undefined?'done':r===mission?'current':'locked';
  return {id:r.lesson.id,label:t(r.lesson.title),status,
   onOpen:status==='locked'?undefined:()=>onStart(r.lesson.id,round??0)};
 });
 const levelsControl=<nav className="light-levels" aria-label={t('Level')}>{levels.map(l=><button key={l.id} aria-pressed={level===l.id} onClick={()=>setLevel(l.id)}>{l.id}</button>)}</nav>;
 return <div className="light-path light-town">
 <div className="town-path-head"><span>{languageInfo(language).native} · {level}</span><LessonModeControl mode="light" compact onChange={onMode}/></div>
 <h1 className="town-title">{t('Word Town')}</h1>
 {!ready?<section className="panel"><p role="status">{t(failed?'Could not load light practice. Try again.':'Loading your light practice…')}</p>{failed&&<button className="outline-button" onClick={()=>setReload(n=>n+1)}>{t('Try again')}</button>}</section>:<>
 {chapter&&<section className="town-hub">
  <TownRibbon><select className="town-chapter-select" aria-label={t('Chapter')} value={chapter.id} onChange={e=>setSelected(e.target.value)}>{chapters.map(c=><option key={c.id} value={c.id}>{t(c.title)}</option>)}</select></TownRibbon>
  <div className="town-metrics"><b>{t('Light progress')} {chapterStats.done}/{chapterStats.total}</b><TownSegments value={chapterStats.done} total={chapterStats.total} label={t('Light progress')} round/><span><TownGem/> {t('Materials')} <b>{materials}</b></span></div>
  <TownScene kind={kind} places={places} decoration={chapterStats.done}/>
  <div className="town-paper town-mission">
   {mission?<><h2><Feather aria-hidden="true"/><LessonText text={mission.lesson.title} language={language}/></h2>
   <div className="town-mission-meta"><Clock size={16}/>{tf('{0} questions · about 2 min',[lightActivities(mission.lesson,pending.round).length])}</div>
   <p><LessonText text={chapter.goal} language={language}/></p>
   <button className="primary wide town-cta" onClick={()=>onStart(pending.lesson,pending.round)}><Play size={20} fill="currentColor"/>{t('Continue Light')}<ArrowRight size={19}/></button></>:<h2><LessonText text={chapter.title} language={language}/></h2>}
   {chapterStats.done<townRewards.length&&<div className="town-next-reward"><TownRewardArt index={chapterStats.done}/><div><span><Gift size={16}/>{t('Next decoration')}</span><strong>{t(townRewards[chapterStats.done])}</strong></div></div>}
  </div>
 </section>}
 {levelsControl}
 <div className="light-path-score"><span><Flame size={21}/><b>{allStats.xp} XP</b></span><span><Star size={20}/>{tf('{0} rounds complete',[allStats.done])}</span></div>
 {stats.done===stats.total&&stats.total>0&&<div className="light-level-complete"><Trophy/><h2>{t('Light level complete!')}</h2><p>{t('Keep exploring or replay a favourite round.')}</p></div>}
 {chapters.map(chapter=>{const rows=route.filter(r=>r.chapter.id===chapter.id),chapterDone=rows.every(row=>Array.from({length:row.rounds},(_,i)=>stats.keys.has(lightRoundKey(row.lesson.id,i))).every(Boolean));return <section className="light-unit" key={chapter.id}><div className="light-unit-heading"><span>{chapterDone?<Trophy size={22}/>:<Star size={22}/>}</span><div><h2><LessonText text={chapter.title} language={language}/></h2><p>{chapterDone?t('Light chapter complete'):<LessonText text={chapter.goal} language={language}/>}</p></div></div><div className="light-node-list">{rows.map((row,index)=>{const count=Array.from({length:row.rounds},(_,i)=>stats.keys.has(lightRoundKey(row.lesson.id,i))).filter(Boolean).length,done=count===row.rounds,available=previous||done,round=Array.from({length:row.rounds},(_,i)=>i).find(i=>!stats.keys.has(lightRoundKey(row.lesson.id,i)))??0;previous=done;return <div key={row.lesson.id} className={'light-path-node '+(done?'done ':available?'current ':'locked ')} style={{'--node-offset':`${[0,36,0,-36][index%4]}px`}} data-lesson-id={row.lesson.id}><button disabled={!available} aria-label={tf('Open Light: {0}',[t(row.lesson.title)])} onClick={()=>onStart(row.lesson.id,round)}>{done?<Check size={30}/>:available?<Star size={29} fill="currentColor"/>:<LockKeyhole size={24}/>}</button><b><LessonText text={row.lesson.title} language={language}/></b><span>{tf('Round {0} of {1}',[Math.min(count+1,row.rounds),row.rounds])}</span>{done&&<small>{t('Complete')}</small>}</div>})}</div></section>})}<p className="light-path-footnote">{t('Light has its own progress. Standard stays available whenever you choose.')}</p></>}
 </div>;
}
