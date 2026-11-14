import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Star,LockKeyhole,Check,ArrowRight,Flame,Trophy,Clock,Feather,Gift,Play} from 'lucide-react';
import {t,tf} from './interface-runtime.mjs';
import LessonText from './LessonText.jsx';
import {levels} from './course.mjs';
import {lightRoute,lightRouteStats} from './light-route.mjs';
import {lightTownProgress,saveTownPlacement,setTownPlacement,LessonModeControl} from './LightLesson.jsx';
import {TownScene,TownOpening,TownRewardArt,TownGem,TownRibbon,TownSegments,TownCollection,townRewardLabel,useLightCompanion} from './LightTown.jsx';
import {materialsPerRound,townCollection,townConstruction,townCoursePlacements,townRewardAt} from './light-town.mjs';
import {townArt} from './light-town-art.mjs';
import {lightActivities,lightLessonVersion} from './light-learning-model.mjs';
import {languageInfo} from './languages.mjs';
export default function LightPath({language,user,onStart,onMode,level,setLevel}){
 const [{completed,placements},setProgress]=useState({completed:[],placements:[]}),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[reload,setReload]=useState(0);
 useEffect(()=>{let live=true;setReady(false);setFailed(false);lightTownProgress(user).then(progress=>{if(live){setProgress(progress);setReady(true)}}).catch(()=>{if(live)setFailed(true)});return()=>{live=false}},[user?.id,language,reload]);
 const kind=useLightCompanion(user,language),[selected,setSelected]=useState(null);
 const languageRoute=useMemo(()=>lightRoute(language),[language]);
 const route=languageRoute.filter(row=>row.chapter.level===level),stats=lightRouteStats(route,completed),allStats=lightRouteStats(languageRoute,completed);
 const pending=route.find(row=>!stats.keys.has(row.lesson.id));
 const chapters=[...new Set(route.map(r=>r.chapter))];let previous=true;
 const chapter=chapters.find(c=>c.id===selected)||pending?.chapter||chapters[0];
 const chapterRows=route.filter(r=>r.chapter.id===chapter?.id);
 const chapterStats=lightRouteStats(chapterRows,completed);
 const collection=townCollection(languageRoute,completed);
 const coursePlacements=townCoursePlacements(language,languageRoute,placements);
 const placementLock=useRef(false);
 const [placing,setPlacing]=useState(false),[placementError,setPlacementError]=useState(null);
 const placeReward=async item=>{
  if(placementLock.current||!chapter)return;
  placementLock.current=true;
  setPlacing(true);
  setPlacementError(null);
  try{
   const placement=await saveTownPlacement(user,chapter.id,language,item);
   setProgress(progress=>({...progress,placements:setTownPlacement(progress.placements,placement)}));
  }catch{
   setPlacementError(chapter.id);
  }finally{
   placementLock.current=false;
   setPlacing(false);
  }
 };
 const nextReward=allStats.done<allStats.total?townRewardAt(collection.length):null;
 const mission=chapterRows.find(r=>r.lesson.id===pending?.lesson.id);
 const languageLessons=new Set(languageRoute.map(r=>r.lesson.id));
 const materials=completed.reduce((n,r)=>n+(languageLessons.has(r.lesson)?r.materials??materialsPerRound:0),0);
 const lots=townArt(language).stages.length-1;
 const construction=townConstruction(languageRoute,completed);
 const buildings=construction.buildings.slice(-lots);
 const pins=mission?buildings.slice(-(lots-1)):buildings;
 const places=pins.map(({lesson})=>{
  const row=languageRoute.find(r=>r.lesson.id===lesson);
  return {id:lesson,label:t(row.lesson.title),status:'done',onOpen:()=>onStart(lesson)};
 });
 if(mission)places.push({
  id:mission.lesson.id,label:t(mission.lesson.title),status:'current',onOpen:()=>onStart(mission.lesson.id)
 });
 const levelsControl=<nav className="light-levels" aria-label={t('Level')}>{levels.map(l=><button key={l.id} aria-pressed={level===l.id} onClick={()=>setLevel(l.id)}>{l.id}</button>)}</nav>;
 return <div className="light-path light-town">
 <div className="town-path-head"><span>{languageInfo(language).native} · {level}</span><LessonModeControl mode="light" compact onChange={onMode}/></div>
 <h1 className="town-title">{t('Word Town')}</h1>
 {!ready?<section className="panel"><p role="status">{t(failed?'Could not load light practice. Try again.':'Loading your light practice…')}</p>{failed&&<button className="outline-button" onClick={()=>setReload(n=>n+1)}>{t('Try again')}</button>}</section>:<>
 {chapter&&<section className="town-hub">
  <TownRibbon><select className="town-chapter-select" aria-label={t('Chapter')} value={chapter.id} onChange={e=>setSelected(e.target.value)}>{chapters.map(c=><option key={c.id} value={c.id}>{t(c.title)}</option>)}</select></TownRibbon>
  <div className="town-metrics"><b>{t('Chapter progress')} {chapterStats.done}/{chapterStats.total}</b><TownSegments value={chapterStats.done} total={chapterStats.total} label={t('Chapter progress')} round/><span><TownGem/> {t('Materials')} <b>{materials}</b></span></div>
  <div className="town-construction-status">
   <b>{tf('Buildings {0}/{1}',[construction.built,construction.total])}</b>
  </div>
  <TownOpening><TownScene language={language} kind={kind} places={places} collection={collection} placements={coursePlacements} built={buildings.length}/></TownOpening>
  <div className="town-paper town-mission">
   {mission?<><h2><Feather aria-hidden="true"/><LessonText text={mission.lesson.title} language={language}/></h2>
   <div className="town-mission-meta"><Clock size={16}/>{tf(mission.lesson.immersive?'{0} questions · short source windows':'{0} questions · about 2 min',[lightActivities(mission.lesson,0,lightLessonVersion).length])}</div>
   <p><LessonText text={chapter.goal} language={language}/></p>
   <p className="town-building-note">{t('Pass a lesson to build a new place.')}</p>
   <button className="primary wide town-cta" onClick={()=>onStart(pending.lesson.id)}><Play size={20} fill="currentColor"/>{t('Continue Light')}<ArrowRight size={19}/></button></>:<h2><LessonText text={chapter.title} language={language}/></h2>}
   {nextReward&&<div className="town-next-reward"><TownRewardArt item={nextReward} language={language}/><div><span><Gift size={16}/>{t('Next decoration')}</span><strong>{townRewardLabel(nextReward,language)}</strong></div></div>}
   <TownCollection language={language} items={collection} placements={coursePlacements} onPlace={placeReward} busy={placing} failed={placementError===chapter.id}/>
  </div>
 </section>}
 {levelsControl}
 <div className="light-path-score"><span><Flame size={21}/><b>{allStats.xp} XP</b></span><span><Star size={20}/>{tf('{0} lessons complete',[allStats.done])}</span></div>
 {stats.done===stats.total&&stats.total>0&&<div className="light-level-complete"><Trophy/><h2>{t('Light level complete!')}</h2><p>{t('Keep exploring or replay a favourite lesson.')}</p></div>}
 {chapters.map(chapter=>{const rows=route.filter(r=>r.chapter.id===chapter.id),chapterDone=rows.every(row=>stats.keys.has(row.lesson.id));return <section className="light-unit" key={chapter.id}><div className="light-unit-heading"><span>{chapterDone?<Trophy size={22}/>:<Star size={22}/>}</span><div><h2><LessonText text={chapter.title} language={language}/></h2><p>{chapterDone?t('Light chapter complete'):<LessonText text={chapter.goal} language={language}/>}</p></div></div><div className="light-node-list">{rows.map((row,index)=>{const done=stats.keys.has(row.lesson.id),available=previous||done;previous=done;return <div key={row.lesson.id} className={'light-path-node '+(done?'done ':available?'current ':'locked ')} style={{'--node-offset':`${[0,36,0,-36][index%4]}px`}} data-lesson-id={row.lesson.id}><button disabled={!available} aria-label={tf('Open Light: {0}',[t(row.lesson.title)])} onClick={()=>onStart(row.lesson.id)}>{done?<Check size={30}/>:available?<Star size={29} fill="currentColor"/>:<LockKeyhole size={24}/>}</button><b><LessonText text={row.lesson.title} language={language}/></b><span>{tf('{0} questions',[lightActivities(row.lesson,0,lightLessonVersion).length])}</span>{done&&<small>{t('Complete')}</small>}</div>})}</div></section>})}<p className="light-path-footnote">{t('Light has its own progress. Standard stays available whenever you choose.')}</p></>}
 </div>;
}
