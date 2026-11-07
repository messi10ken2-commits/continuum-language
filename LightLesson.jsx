import {feedbackSoundEnabled,playCorrectSound} from './feedback-sound.mjs';
import React,{forwardRef,useEffect,useImperativeHandle,useLayoutEffect,useRef,useState} from 'react';
import {ArrowRight,CheckCircle2,Lightbulb,Flame,Star,BookOpenCheck,Headphones,X} from 'lucide-react';
import {t,tf,interfaceLanguage} from './interface-runtime.mjs';
import LessonText from './LessonText.jsx';
import {lightActivities,lightAnswer,lightCorrect,lightVersionFor,validLightState,lightRoundCount} from './light-learning-model.mjs';
import {nextLightRound,lightRoute} from './light-route.mjs';
import {getLesson} from './course.mjs';
import {languageInfo} from './languages.mjs';
import {useStudyActivity} from './LearningActivity.jsx';
import {PageScene} from './LessonMedia.jsx';
import SentenceAudio,{stopSentenceAudio} from './SentenceAudio.jsx';
import {TownCompanion,TownScene,TownGem,TownRibbon,TownSegments,TownRewardArt,townRewardLabel,useLightCompanion} from './LightTown.jsx';
import {lightMaterials,lightRoundEvidence,townCollection,townCourseKey,townCoursePlacements} from './light-town.mjs';
import ConversationVideo from './ConversationVideo.jsx';
import QuestionPrompt from './QuestionPrompt.jsx';
import {resetLessonViewport} from './lesson-scroll.mjs';
export const lightStorageKey=(user,lesson,round=0)=>'continuumLight'+lightVersionFor(lesson).replace('light-v','V')+':'+(user?.id||'guest')+':'+lesson.id+':'+round;
export async function lightApi(path,options){const r=await fetch('/api/learning/light'+path,{credentials:'same-origin',headers:{'Content-Type':'application/json'},...options}),d=await r.json();if(!r.ok)throw Error();return d;}
const guestPlacementsKey='continuumLightTownPlacements:guest';
export async function lightTownProgress(user){
 if(user)return lightApi('/progress');
 const read=key=>{
  try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}
 };
 return {completed:read('continuumLightProgress:guest'),placements:read(guestPlacementsKey)};
}
export async function lightProgress(user){
 return (await lightTownProgress(user)).completed;
}
export function setTownPlacement(placements,placement){
 return [...placements.filter(p=>p.chapter!==placement.chapter||p.slot!==placement.slot),placement];
}
export async function saveTownPlacement(user,chapter,language,item){
 if(user)return (await lightApi('/town-placement',{method:'PUT',body:JSON.stringify({chapter,rewardIndex:item.index})})).placement;
 const {placements}=await lightTownProgress(null);
 const placement={chapter:townCourseKey(language),slot:item.slot,rewardIndex:item.index};
 localStorage.setItem(guestPlacementsKey,JSON.stringify(setTownPlacement(placements,placement)));
 return placement;
}
export function LessonModeControl({mode,onChange,compact=false,busy=false}){return compact?<label className="lesson-mode-compact"><select aria-label={t('Learning mode')} disabled={busy} value={mode} onChange={e=>onChange(e.target.value)}><option value="light">{t('Light')}</option><option value="standard">{t('Standard')}</option></select></label>:<fieldset className="lesson-mode-control" disabled={busy}><legend>{t('Learning mode')}</legend><div>{['light','standard'].map(value=><button type="button" key={value} aria-pressed={mode===value} onClick={()=>onChange(value)}>{t(value==='light'?'Light':'Standard')}</button>)}</div><small>{t('Two ways to learn. Choose your own pace.')}</small></fieldset>}
export default forwardRef(function LightLesson({lesson,user,suspended,onExit,onStandard,modeControl,round=0,onNext,autoStart=false},ref){
 const activities=lightActivities(lesson,round),language=lesson.language||'es',locale=languageInfo(language).locale;
 const lightVersion=lightVersionFor(lesson);
 const blank=()=>({version:lightVersion,round,steps:[],choice:null,hint:false,checked:false});
 const [record,setRecord]=useState(null),[state,setState]=useState(blank),[ready,setReady]=useState(false),[phase,setPhase]=useState('intro'),[busy,setBusy]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 const kind=useLightCompanion(user,language);
 const [speaking,setSpeaking]=useState(false),[reward,setReward]=useState(null);
 const [rewardRetry,setRewardRetry]=useState(0);
 const evidence=lightRoundEvidence(state.steps);
 useEffect(()=>{if(suspended)stopSentenceAudio()},[suspended]);
 useEffect(()=>{
  setReward(null);
  if(phase!=='result'||!record?.completedAt)return;
  let live=true;
  lightTownProgress(user).then(({completed:rows,placements})=>{
   if(!live)return;
   const route=lightRoute(language);
   const collection=townCollection(route,rows);
   const award=collection.find(item=>item.clearId===record.id);
   setReward({collection,placements:townCoursePlacements(language,route,placements),award,materials:rows.find(r=>r.id===record.id)?.materials??0});
  }).catch(()=>{if(live)setReward({failed:true})});
  return()=>{live=false};
 },[user?.id,lesson.id,language,record?.id,record?.completedAt,phase,rewardRetry]);
 const root=useRef(null),owner=user?.id||'guest',lock=useRef(false),[refreshing,setRefreshing]=useState(false);
 const endpoint='/'+lesson.id+'?round='+round+'&version='+lightVersion;
 useEffect(()=>{let live=true;setReady(false);setError('');const load=async()=>{try{let saved;if(user)saved=(await lightApi(endpoint)).record;else try{saved=JSON.parse(localStorage.getItem(lightStorageKey(user,lesson,round))||'null')}catch{}
  if(!live)return;if(saved&&validLightState(activities,saved.state)&&saved.state.round===round){setRecord(saved);setState(saved.state);setPhase(saved.completedAt?'result':saved.state.steps.length||saved.state.choice!==null||autoStart?'exercise':'intro')}else{setRecord({id:crypto.randomUUID(),revision:0});setState(blank());setPhase(autoStart?'exercise':'intro')}setReady(true);
 }catch{if(live)setError('Could not load light practice. Try again.')}};load();return()=>{live=false;stopSentenceAudio()}},[lesson.id,owner,round,retry]);
 useStudyActivity(!suspended&&ready&&phase==='exercise'&&user?.role==='learner'&&!busy);
 useLayoutEffect(()=>{
  if(suspended||!root.current)return;
  root.current.querySelector('.light-game-board')?.focus({preventScroll:true});
  resetLessonViewport(root.current);
 },[suspended,phase,ready,state.steps.length]);
 const persist=async(value=state)=>{if(!ready)return !error;if(lock.current)return false;if(record?.completedAt)return true;lock.current=true;setBusy(true);setError('');try{let saved;if(user){try{saved=(await lightApi('/'+lesson.id,{method:'PUT',body:JSON.stringify({id:record.id,revision:record.revision,state:value})})).record}catch{const recovered=(await lightApi(endpoint)).record;if(recovered?.id!==record.id||!sameLightDraft(recovered.state,value))throw Error();saved=recovered}}else{saved={...record,state:value,lesson:lesson.id,at:new Date().toISOString(),revision:record.revision+1,completedAt:value.steps.length===activities.length?new Date().toISOString():null};localStorage.setItem(lightStorageKey(user,lesson,round),JSON.stringify(saved));if(saved.completedAt){const rows=await lightProgress(null);localStorage.setItem('continuumLightProgress:guest',JSON.stringify([...rows.filter(r=>r.lesson!==lesson.id||r.round!==round),{...(rows.find(r=>r.lesson===lesson.id&&r.round===round)||{id:saved.id,completedAt:saved.completedAt,materials:lightMaterials(value.steps)}),lesson:lesson.id,round,xp:activities.length*10}]))}}setRecord(saved);setState(saved.state);return true}catch{setError('Could not save light practice. Try again.');return false}finally{lock.current=false;setBusy(false)}};
 useImperativeHandle(ref,()=>({save:()=>persist(),busy}),[record,state,ready,busy,error]);
 const exit=async()=>{if(await persist()){stopSentenceAudio();onExit()}};
 const next=async()=>{const a=activities[state.steps.length],answer=a.type==='observe'?true:lightAnswer(a,state.choice);if(!lightCorrect(a,answer))return;const value={...blank(),steps:[...state.steps,{answer,hint:state.hint,missed:!!state.missed}]};if(await persist(value)){stopSentenceAudio();if(value.steps.length===activities.length)setPhase('result')}};
 const restart=()=>{setRecord({id:crypto.randomUUID(),revision:0});setState(blank());setPhase('intro');setError('')};
 const a=activities[state.steps.length],good=a&&lightCorrect(a,lightAnswer(a,state.choice)),nextRound=nextLightRound(lesson,round);
 const choose=value=>{if(state.checked&&!good)setState(s=>({...s,choice:value,checked:false}));else setState(s=>({...s,choice:value}))};
 const combo=state.missed?0:evidence.combo+(state.checked&&good?1:0);
 const check=()=>{
  if(state.checked&&!good){setState(s=>({...s,choice:null,checked:false}));return}
  if(good){
   if(feedbackSoundEnabled())void playCorrectSound();
   setState(s=>({...s,checked:true}));
  }else void persist({...state,checked:true,missed:true});
 };
 if(!ready)return <section className="panel">{modeControl}<p role="status">{t(error||'Loading your light practice…')}</p>{error&&<button className="outline-button" onClick={()=>setRetry(n=>n+1)}>{t('Try again')}</button>}<button className="back" onClick={onExit}>{t('Back to Light path')}</button></section>;
 const title=<LessonText text={lesson.title} language={language}/>;
 const refresh=async()=>{setRefreshing(true);try{await lightProgress(user);setRetry(n=>n+1)}finally{setRefreshing(false)}};
 return <div ref={root} className="study-lesson light-lesson light-game light-town" data-phase={phase}>
  <div role="banner" className="light-game-top"><button aria-label={t('Save & exit')} className="light-close" disabled={busy} onClick={exit}><X size={22}/></button>
   <div className="town-round-progress"><TownSegments value={state.steps.length} total={activities.length} label={t('Learning progress')}/><b>{Math.min(state.steps.length+1,activities.length)}/{activities.length}</b></div>
   <LessonModeControl compact mode="light" onChange={onStandard} busy={busy}/>
  </div>
  {phase==='intro'?<section className="light-launch"><div className="light-launch-art"><PageScene lesson={lesson} caption=""/><span><Star size={30} fill="currentColor"/></span></div><span className="eyebrow">{lesson.level} · {tf('Round {0} of {1}',[round+1,lightRoundCount(lesson)])}</span><h1>{title}</h1><p>{t('Small steps. Clear guidance.')}</p><div className="light-round-facts"><span><Flame/>{activities.length*10} XP</span><span><Lightbulb/>{t('Hints when you need them')}</span></div><p className="light-record-note">{t('Finish rounds, earn XP and complete your Light path.')}</p><button className="primary wide light-game-button" disabled={busy} onClick={()=>setPhase('exercise')}>{t('Let’s go')}<ArrowRight size={19}/></button>{modeControl}</section>:
  phase==='result'?<section className="light-celebration town-result">
   <h1 className="town-title">{t(evidence.firstCorrect===activities.length?'Perfect clear!':'Round complete!')}</h1>
   <TownRibbon><b>{activities.length}/{activities.length} · {tf('Best combo ×{0}',[evidence.best])}</b></TownRibbon>
   <TownScene kind={kind} collection={reward?.collection} placements={reward?.placements} highlight={reward?.award?.index} celebrate={!!reward?.materials}/>
   <div className="town-paper town-result-card">
    <h2>{title}</h2>
    {reward?.failed?<div role="status"><p>{t('Could not load light practice. Try again.')}</p><button className="text-button" onClick={()=>setRewardRetry(n=>n+1)}>{t('Try again')}</button></div>:
     !reward&&<p role="status">{t('Loading your light practice…')}</p>}
    <div className="town-result-loot">
     {reward?.award&&<div><TownRewardArt item={reward.award}/><strong>{townRewardLabel(reward.award)}</strong></div>}
     {!!reward?.materials&&<div><TownGem/><strong>{t('Materials')} +{reward.materials}</strong></div>}
    </div>
    <div className="town-save-stamp"><BookOpenCheck size={24}/>{t('Light progress saved')} · {activities.length*10} XP</div>
    <p>{t(user?'Your guided practice was saved.':'Saved on this device.')}</p>
    {state.steps.some(step=>step.missed)&&<details className="town-review"><summary>{t('Review missed questions')}</summary>{activities.map((item,i)=>state.steps[i]?.missed&&<div key={item.id}><LightAnswerDetails activity={item} language={language}/>{spokenText(item)&&<SentenceAudio text={spokenText(item)} lang={item.audioLocale||item.locale||locale}/>}</div>)}</details>}
    <button className="primary wide town-cta" onClick={onExit}>{t('Back to town')}<ArrowRight size={19}/></button>
    <div className="town-result-links">{nextRound&&onNext&&<button className="text-button" onClick={()=>onNext(nextRound)}>{t('Next Light round')}</button>}<button className="text-button" onClick={restart}>{t('Practise again')}</button></div>
   </div>
  </section>:
  <section className="light-game-board" tabIndex={-1} aria-label={t('Practice question')}>
   <div className="light-task-heading"><span className="town-combo-chip" data-active={combo>=3}><Flame size={18}/>{tf('Combo ×{0}',[combo])}</span><button className="light-tip" aria-label={t('Show a hint')} disabled={busy||state.hint} onClick={()=>setState(s=>({...s,hint:true}))}><Lightbulb size={21}/></button></div>
   <h1 className="town-lesson-heading">{spokenText(a)&&<Headphones size={24} aria-hidden="true"/>}{title}</h1>
   <TownLessonStage key={a.id} activity={a} lesson={lesson} language={language} kind={kind} speaking={speaking} onPlaybackChange={setSpeaking}/>
   <div className="town-paper town-question-card">
   <LightChallengePrompt activity={a} lesson={lesson} language={language} checked={state.checked}/>
   {a.type==='build'?<div className="word-builder"><div className="light-answer-slots" aria-live="polite" lang={a.locale||locale} dir="auto">{state.choice?.length?state.choice.map((index,i)=><button key={i} disabled={busy||state.checked} onClick={()=>choose(state.choice.filter((_,j)=>j!==i))}>{a.tokens[index]}</button>):<span>{t('Tap the word tiles')}</span>}</div><div className="word-builder-tiles" dir="auto">{a.tokens.map((token,i)=><button key={i} lang={a.locale||locale} disabled={busy||state.checked||state.choice?.includes(i)} onClick={()=>choose([...(state.choice||[]),i])}>{token}</button>)}</div><button className="text-button" disabled={busy||state.checked||!state.choice?.length} onClick={()=>choose(null)}>{t('Clear')}</button></div>:
   <div className="light-game-choices">{a.options.map((value,i)=><button key={i} aria-pressed={state.choice===value} disabled={busy||state.checked} className={state.choice===value?'selected':''} onClick={()=>choose(value)}><span className="light-choice-letter">{String.fromCharCode(65+i)}</span>{a.optionsNative||a.type==='meaning'&&a.meaningNative?<span lang={a.locale||locale} dir="auto">{value}</span>:<LessonText text={value} language={language} interactive={false}/>}</button>)}</div>}
   {state.hint&&<div role="note" className="light-game-hint"><Lightbulb size={18}/><span>{a.type==='build'&&a.tokens.length>2?tf('Start with: {0}',[a.model.split(a.joiner||'')[0]]):t(a.question?'Look at the subject and the situation.':'Think about the whole meaning, not just one word.')}</span></div>}
   <div className={'light-game-footer '+(state.checked?good?'is-correct':'is-retry':'')}>
    {state.checked&&<div className="light-game-feedback" role="status"><CheckCircle2 size={24}/><div><strong>{t(good?'Nice work!':'No rush. Try once more.')}</strong>{good?<><p>{combo>1?tf('{0} in a row!',[combo]):t('You’ve got this!')}</p></>:<p>{t('Use a hint and give it another go.')}</p>}</div></div>}
    {state.checked&&<LightAnswerDetails activity={a} language={language}/>}
    <button className="primary wide town-cta" disabled={busy||!state.checked&&(state.choice===null||a.type==='build'&&state.choice.length!==a.tokens.length)} onClick={state.checked&&good?next:check}>{t(busy?'Saving…':state.checked?good?'Keep going':'Try again':'Check answer')}<ArrowRight size={19}/></button>
   </div>
   </div>
  </section>}

  {error&&<div role="alert" className="auth-error"><p>{t(error)}</p><button className="outline-button" disabled={refreshing||busy} onClick={refresh}>{t('Refresh record')}</button><button className="outline-button" disabled={busy} onClick={()=>persist()}>{t('Try again')}</button></div>}
 </div>;
});
function LightMeaning({activity,language}){return activity.meaningNative?<span lang={language}>{activity.meaning}</span>:<LessonText text={activity.meaning} language={language}/>;}
function sameLightDraft(a,b){
 return a.version===b.version&&a.round===b.round&&a.hint===b.hint&&a.checked===b.checked&&!!a.missed===!!b.missed&&
  JSON.stringify(a.choice)===JSON.stringify(b.choice)&&a.steps.length===b.steps.length&&
  a.steps.every((step,i)=>step.answer===b.steps[i].answer&&step.hint===b.steps[i].hint&&step.missed===b.steps[i].missed);
}
function spokenText(a){
 return a.audio||((a.type==='listen'||a.type==='build'&&!a.promptMeaning)?a.model:null);
}
function LightAnswerDetails({activity:a,language}){
 const spoken=spokenText(a),answer=a.type==='build'?a.model:a.meaning;
 return <div className="town-answer-detail">
  {spoken&&<p lang={a.audioLocale||a.locale} dir="auto">{spoken}</p>}
  {answer&&answer!==spoken&&<p>{a.optionsNative||a.meaningNative||a.type==='build'?<span lang={a.locale} dir="auto">{answer}</span>:<LessonText text={answer} language={language}/>}</p>}
  {(a.question?.note||a.guidance)&&<p><LessonText text={a.question?.note||a.guidance} language={language}/></p>}
 </div>;
}
export function LightPracticeHistory({user,language,onStart}){const [records,setRecords]=useState([]),[failed,setFailed]=useState(false);useEffect(()=>{let live=true;setRecords([]);setFailed(false);if(user?.role!=='learner')return;lightApi('').then(d=>{if(live)setRecords(d.records||[])}).catch(()=>{if(live)setFailed(true)});return()=>{live=false}},[user?.id,language]);const rows=records.filter(r=>(getLesson(r.lesson)?.language||'es')===language);return user?.role==='learner'?<details className="panel light-history"><summary>{t('Light practice history')}</summary>{failed?<p>{t('Could not load light practice. Try again.')}</p>:rows.length?<ul>{rows.map(r=><li key={r.id}><button onClick={()=>onStart?.(r.lesson)}><LessonText text={getLesson(r.lesson)?.title||r.lesson} language={language}/></button><span>{t(r.completedAt?'Guided practice complete':'Resume light practice')} · {new Date(r.at).toLocaleDateString(interfaceLanguage())}</span>{r.state.steps.length>0&&r.state.steps.every(step=>typeof step.missed==='boolean')&&<small>{tf('First try: {0}/{1} · Hints: {2}',[lightRoundEvidence(r.state.steps).firstCorrect,r.state.steps.length,lightRoundEvidence(r.state.steps).hints])}</small>}</li>)}</ul>:<p>{t('No light practice saved yet.')}</p>}</details>:null}

function TownLessonStage({activity,lesson,language,kind,speaking,onPlaybackChange}){
 const recording=lesson.conversation?null:spokenText(activity)||(activity.type==='meaning'?activity.model:null);
 return <div className="town-listen-stage" data-speaking={speaking}>
  <img src="/light-town/cafe.webp" alt="" width="1000" height="562"/>
  <TownCompanion kind={kind} speaking={speaking}/>
  {recording&&<div className="town-listen-control">
   <SentenceAudio text={recording} lang={activity.audioLocale||activity.locale||languageInfo(language).locale} onPlaybackChange={onPlaybackChange} presentation="town"/>
  </div>}
 </div>;
}

export function LightChallengePrompt({activity:a,lesson,language,checked=false}){
 const locale=a.locale||languageInfo(language).locale;
 if(a.question)return <div className="town-prompt">
  <QuestionPrompt question={a.question} lesson={lesson}/>
  {lesson.conversation&&<ConversationVideo lesson={lesson} practice cue={a.question.videoCue} showTranscript={checked}/>}
  {a.statement&&<div className="light-confirm-statement"><p>{t(lesson.conversation?'Does this answer fit the recording?':'Does this answer fit the situation?')}</p>{a.statementNative?<b lang={locale} dir="auto">{a.statement}</b>:<LessonText text={a.statement} language={language}/>}</div>}
 </div>;
 if(a.type==='meaning')return <div className="town-prompt"><h2>{t('What does this mean?')}</h2><p lang={locale} dir="auto">{a.model}</p></div>;
 const instruction=a.type==='listen'?'Listen and choose':a.type==='translate'?'Choose the matching phrase':a.promptMeaning?'Build the phrase':'Listen and build the phrase';
 return <div className="town-prompt"><h2>{t(instruction)}</h2>{a.promptMeaning&&<p className="light-build-meaning"><LightMeaning activity={{...a,meaning:a.promptMeaning}} language={language}/></p>}</div>;
}
