import React,{createContext,useContext,useMemo,useRef} from 'react';
import {baseLanguageInfo,normalizeBaseLanguage,translate} from './base-language.mjs';
import {localizeLesson} from './lesson-localizations.mjs';

const BaseLanguageContext=createContext(null);
const englishFallback={
 language:'en',
 locale:'en-US',
 t:(key,values)=>translate('en',key,values),
 localizeLesson:lesson=>localizeLesson(lesson,'en'),
 missingTranslations:()=>[]
};

export function BaseLanguageProvider({language,children}){
 const locale=normalizeBaseLanguage(language),missing=useRef(new Map());
 const record=item=>missing.current.set(`${item.kind}:${item.locale}:${item.key}`,item);
 const value=useMemo(()=>({
  language:locale,
  locale:baseLanguageInfo(locale).locale,
  t:(key,values)=>translate(locale,key,values,record),
  localizeLesson:lesson=>localizeLesson(lesson,locale,record),
  missingTranslations:()=>[...missing.current.values()]
 }),[locale]);
 return <BaseLanguageContext.Provider value={value}>{children}</BaseLanguageContext.Provider>;
}

export function useBaseLanguage(){
 const value=useContext(BaseLanguageContext);
 return value||englishFallback;
}
