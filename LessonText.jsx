import React,{useState,useSyncExternalStore} from 'react';
import {t,tf,interfaceLanguage,subscribeInterface,interfaceSnapshot,interfaceStatus,lessonTranslationState,retryInterfaceTranslations} from './interface-runtime.mjs';
import {displayLanguageOptions} from './answer-language.mjs';
import {feedbackParts} from './localized-feedback.mjs';
// Models, answer keys and private notes are never passed through this component.
export default function LessonText({text,language='',translated,values,children,interactive=true}){
 useSyncExternalStore(subscribeInterface,interfaceSnapshot,()=>0);
 const [original,setOriginal]=useState(null),key=interfaceLanguage()+':'+text;
 const state=translated!==undefined?{status:'ready',text:translated}:lessonTranslationState(text,language);
 const fill=value=>values?value.replace(/\{(\d+)\}/g,(token,i)=>i<values.length?String(values[i]):token):value;
 const render=value=>typeof children==='function'?children(value):value;
 if(state.status==='ready')return render(fill(state.text));
 if(!interactive)return <span className="lesson-translation" data-translation-state={state.status}><span role="status">{t(state.status==='pending'?'Preparing lesson translation…':'Translation unavailable. Try again.')}</span>{state.status==='unavailable'&&<span lang="en">{fill(text)}</span>}</span>;
 return <span className="lesson-translation" data-translation-state={state.status}>
  <span role="status">{t(state.status==='pending'?'Preparing lesson translation…':'Translation unavailable. Try again.')}</span>
  {state.status==='unavailable'&&<><button type="button" className="text-button" onClick={retryInterfaceTranslations}>{t('Try again')}</button><button type="button" className="text-button" aria-expanded={original===key} onClick={()=>setOriginal(original===key?null:key)}>{t(original===key?'Hide original text':'Show original text')}</button>{original===key&&<span lang="en" className="lesson-original">{fill(text)}</span>}</>}
 </span>;
}
export function LessonFeedback({question,answer,language}){
 const {source,values,note,original}=feedbackParts(question,answer);
 return values.length?<><LessonText text={source} values={values}/><LessonText text={note} language={language}/></>:<LessonText text={original} language={language}/>;
}

export function LessonOption({question,value,lesson}){return displayLanguageOptions(question,lesson)?<LessonText text={value} interactive={false}/>:value;}

export function LessonTranslationNotice(){useSyncExternalStore(subscribeInterface,interfaceSnapshot,()=>0);return interfaceStatus().failed?<div className="lesson-translation-notice" role="status">{t('Translation unavailable. Try again.')}<button type="button" className="text-button" onClick={retryInterfaceTranslations}>{t('Try again')}</button></div>:null;}
