import React,{useEffect,useSyncExternalStore} from 'react';
import {interfaceLanguages} from './interface-languages.mjs';
import {t,subscribeInterface,interfaceSnapshot,interfaceLanguage,interfaceStatus,chooseInterfaceLanguage,bindInterfaceAccount,retryInterfaceTranslations} from './interface-runtime.mjs';
import './interface-language.css';
export function useInterfaceLanguage(){useSyncExternalStore(subscribeInterface,interfaceSnapshot,()=>0);const language=interfaceLanguage();useEffect(()=>{if(typeof document!=='undefined')document.documentElement.lang=language==='zh'?'zh-Hans':language},[language]);return language;}
export function useInterfaceAccount(user){useEffect(()=>{void bindInterfaceAccount(user)},[user?.id]);}
export function InterfaceLanguagePicker({compact=false}){
 const language=useInterfaceLanguage(),status=interfaceStatus();
 return <section className={compact?'interface-picker compact':'panel interface-picker'}><label><span>{t('Display language')}</span><select aria-label={t('Display language')} value={language} disabled={status.saving} onChange={e=>void chooseInterfaceLanguage(e.target.value)}>{interfaceLanguages.map(l=><option key={l.id} value={l.id} lang={l.id}>{l.name}</option>)}</select></label>{!compact&&<p>{t('Choose the language for menus and explanations. Your learning language stays the same.')}</p>}{status.saving&&<small role="status">{t('Saving…')}</small>}{status.preferenceError&&<small role="alert">{t('Could not save. Please try again.')}</small>}</section>;
}
export function InterfaceTranslationStatus(){const language=useInterfaceLanguage(),s=interfaceStatus();if(language==='en')return null;return <div className="interface-translation-status" role="status">{s.failed?<><span>{t('Some explanations are still shown in English. Retry translation.')}</span><button className="text-button" onClick={retryInterfaceTranslations}>{t('Try again')}</button></>:s.running?t('Preparing translations…'):null}</div>;}
export function TranslationNote(){const language=useInterfaceLanguage();return language==='en'?null:<p className="reference-hint">{t('AI-translated explanations; learning examples and audio keep their original language.')}</p>;}
