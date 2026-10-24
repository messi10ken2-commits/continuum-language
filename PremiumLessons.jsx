import React,{useEffect,useState} from 'react';
import PremiumVisual,{PremiumGallery} from './PremiumVisual.jsx';
import {exclusiveSession,exclusiveAnswer,exclusiveAnswers} from './premium-session.mjs';
import ConversationVideo from './ConversationVideo.jsx';
import {formatVideoTime} from './conversation-cues.mjs';
import {languageInfo} from './languages.mjs';
import {billingRequest} from './Membership.jsx';
import {t} from './interface-runtime.mjs';
import {LessonPlayer} from './SelfStudy.jsx';
import LessonReference from './LessonReference.jsx';

export function premiumLesson(course){
 const locale=languageInfo(course.language).locale;
 return {...course,locale,skill:course.scene==='varieties'?'Regional varieties':course.conversation?'Listening':'Practice',minutes:Math.ceil(course.questions.length*1.5),
  explanation:course.explanation||course.description||'Listen, read the examples and practise using the expressions in context.',example:(course.examples||[]).join(' '),
  // The shared player uses regular lesson question types; grading remains on the Premium API.
  conversation:null,questions:course.questions.map(q=>({...q,type:['typing','cloze','reorder'].includes(q.type)?'text':'choice',mode:q.type==='reorder'?'order':undefined,joiner:q.separator??' ',optionsRole:['video','listening','interpretation'].includes(q.type)?'comprehension':'utterance',optionsLang:['video','listening','interpretation'].includes(q.type)?'en-US':locale,answer:undefined,audioLocale:q.audioLocale||locale}))};
}
function NativeReferences({sources}){return sources?.length?<section className="rule-pitfall"><h3>{t('Listen to native speakers')}</h3><p>{t('Open the publisher’s original recording. These are pronunciation references, not recordings of the exercise sentences.')}</p>{sources.map(s=><p key={s.url}><a className="outline-button" href={s.url} target="_blank" rel="noopener noreferrer">{s.label} ↗</a><small> · {s.credit}</small></p>)}</section>:null;}
function CourseReference({course,lesson}){
 return <><NativeReferences sources={course.nativeReferences}/><LessonReference lesson={{...lesson,vocabulary:undefined}} audioEnabled={course.scene!=='varieties'}/>
 {course.exampleNote&&<section className="rule-pitfall"><h3>{t('Usage note')}</h3><p>{t(course.exampleNote)}</p></section>}
 {course.reading&&<section><h3>{t('Read the scenario')}</h3><p lang={course.language}>{course.reading}</p></section>}
 {course.visualData&&<figure className="academic-chart"><figcaption>{t('Hypothetical study · end-of-study mean scores')}</figcaption>{[['Daily practice',course.visualData.daily],['Weekly practice',course.visualData.weekly]].map(([label,value])=><div key={label}><span>{t(label)}</span><div><i style={{width:value+'%'}}/></div><b>{value}/100</b></div>)}<small>{t('40 adults · self-selected groups · no baseline or follow-up. The chart does not establish causation.')}</small></figure>}
 {course.vocabulary&&<section className="lesson-reference"><h3>{t('Useful expressions for this situation')}</h3>{course.vocabulary.map(({phrase,meaning})=><div className="translated-example" key={phrase}><b lang={course.language}>{phrase}</b><p>{t(meaning)}</p></div>)}</section>}
 {course.references&&<details><summary>{t('Further reading')}</summary><ul>{course.references.map(r=><li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a></li>)}</ul></details>}</>;
}
export function ExclusiveCoursePlayer({course,user,onExit,onFinish,initialDraft}){
 const storageKey=`continuum-exclusive:${user.id}:${course.id}:${course.contentVersion||1}`;
 const [draft]=useState(()=>{try{const saved=initialDraft||JSON.parse(sessionStorage.getItem(storageKey)||'null');
  if(saved?.shuffleSeed!=null&&(typeof saved.shuffleSeed!=='string'||!/^[a-zA-Z0-9-]{12,100}$/.test(saved.shuffleSeed)))return null;
  if(!saved||!Array.isArray(saved.answers)||saved.answers.length>course.questions.length||typeof saved.key!=='string')return null;
  if(!saved.answers.every((a,i)=>saved.checks?.[i]?.first?.value===a&&typeof saved.checks[i].first.correct==='boolean'&&typeof saved.checks[i].answer==='string'&&typeof saved.checks[i].note==='string'))return null;
  return saved;
 }catch{return null}});
 const [shuffleSeed,setShuffleSeed]=useState(()=>draft?.shuffleSeed||null);
 const session=exclusiveSession(course,shuffleSeed),lesson=premiumLesson(session);
 const save=(answers,seed,checks,key)=>{const nextSeed=answers.length===0?key:shuffleSeed;sessionStorage.setItem(storageKey,JSON.stringify({answers,checks,key,shuffleSeed:nextSeed}));if(answers.length===0)setShuffleSeed(nextSeed);};
 const [submissionKey]=useState(()=>draft?.key||crypto.randomUUID());
 return <LessonPlayer lesson={lesson} language={course.language} user={user} initialAnswers={draft?.answers} onDraft={save} onExit={onExit}
  external={{lesson,reviewLesson:course.id,initialChecks:draft?.checks,initialSubmission:submissionKey,backLabel:'Back to courses',regional:course.scene==='varieties',
   media:<PremiumGallery course={course}/>,reference:<CourseReference course={course} lesson={lesson}/>,
   audioEndpoint:index=>'/api/billing/courses/'+course.id+'/audio?question='+session.questions[index]._sourceIndex,
   questionMedia:q=>(q.nativeReference||q.video)?<>{q.nativeReference&&<NativeReferences sources={[q.nativeReference]}/>} {q.video&&<>{q.videoCue?<p>{formatVideoTime(q.videoCue.start)}–{formatVideoTime(q.videoCue.end)}</p>:<p className="question-video-reference">{t('Source section:')} {t(q.sourceReference?.label)} · {t('Exact video timing has not been verified.')} {q.sourceReference?.url&&<a href={q.sourceReference.url} target="_blank" rel="noopener noreferrer">{t('Publisher’s lesson and transcript')}</a>}</p>}<ConversationVideo lesson={{...course,locale:lesson.locale}} practice cue={q.videoCue} autoPlay={!!q.videoCue}/></>}</>:<PremiumVisual course={course} index={q._sourceIndex} context={q.context||q.prompt}/>,
   check:(question,answer)=>billingRequest('/courses/'+course.id+'/answer','POST',{question:session.questions[question]._sourceIndex,answer:exclusiveAnswer(session.questions[question],answer)})}}
  onComplete={async({answers,submissionKey})=>{const result=await billingRequest('/courses/'+course.id+'/finish','POST',{answers:exclusiveAnswers(session,answers),key:submissionKey});sessionStorage.removeItem(storageKey);onFinish?.();return {...result,score:Math.round(result.correct/result.total*100)};}}/>;
}
export default function PremiumLessons({user,language,showLocked=false,onAccount}){
 const [data,setData]=useState(null),[course,setCourse]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[videoPreview,setVideoPreview]=useState(null);
 useEffect(()=>{let live=true;setCourse(null);setData(null);setError('');if(user)billingRequest().then(d=>{if(live)setData(d)}).catch(e=>{if(live)setError(e.message)});return()=>{live=false}},[user?.id,language]);
 const run=async f=>{setBusy(true);setError('');try{await f()}catch(e){setError(e.message)}finally{setBusy(false)}};
 if(!data)return error?<p role="alert">{t(error)}</p>:null;
 if(!data.membership.premium&&!showLocked)return null;
 if(course)return <ExclusiveCoursePlayer key={course.id} user={user} course={course} onExit={()=>setCourse(null)} onFinish={()=>{billingRequest().then(setData).catch(e=>setError(e.message));}}/>;
 return <section className="panel premium-lessons"><span className="eyebrow">Premium</span><h2>{t('Exclusive courses')}</h2>{error&&<p role="alert">{t(error)}</p>}<div className="membership-courses">{data.courses.filter(c=>c.language===language).map(c=><article key={c.id}><PremiumVisual course={c} compact/>{c.level&&<small>{c.level} · {t(c.scene==='academic'?'Academic practice':c.scene==='varieties'?'Regional varieties':'Practical situations')}</small>}<h3>{t(c.title)}</h3><p>{t(c.description)}</p>{data.progress.find(p=>p.id===c.id)&&<small>{t('Best score')}: {data.progress.find(p=>p.id===c.id).best}/{c.questions}</small>}{data.videoSources?.find(v=>v.id===c.id)&&<button className="text-button" onClick={()=>setVideoPreview(data.videoSources.find(v=>v.id===c.id))}>{t('Watch video · Free')}</button>}<button className="primary" disabled={busy} onClick={()=>run(async()=>{if(!data.membership.premium){onAccount?.();return;}setCourse((await billingRequest('/courses/'+c.id)).course);})}>{t(data.membership.premium?'Open course':'Explore Premium')}</button></article>)}</div>{videoPreview&&<div className="studio-video-preview"><button className="back" onClick={()=>setVideoPreview(null)}>{t('Close video')}</button><ConversationVideo lesson={{...videoPreview,locale:languageInfo(language).locale}} practice/></div>}</section>;
}
