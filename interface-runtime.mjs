import {displayLanguageOptions} from './answer-language.mjs';
import {keepsLocalizedInstructions} from './learning-text-protection.mjs';
import {reviewedTranslation,translationRevision} from './reviewed-interface-copy.mjs';
import {feedbackParts} from './localized-feedback.mjs';
import {interfaceCopy} from './interface-copy.mjs';
import {detectedInterfaceLanguage,validInterfaceLanguage} from './interface-languages.mjs';
import {translationKey,translationSource,protectSource} from './localization-corpus.mjs';
let locale='en';
try{locale=localStorage.getItem('continuumInterfaceLanguage')||detectedInterfaceLanguage(navigator.languages||[navigator.language]);if(!validInterfaceLanguage(locale))locale='en';}catch{}
const protections=new WeakMap();
function protectionFor(source){if(!source)return null;if(!protections.has(source))protections.set(source,protectSource(source));return protections.get(source);}
const listeners=new Set(),cache=new Map(),queue=new Map(),failed=new Map(),inFlight=new Set();
let version=0,scheduled=false,running=false,account=null,binding=0,saving=false,preferenceError=false,selectionRevision=0;
try{const stored=JSON.parse(localStorage.getItem('continuumInterfaceTranslations:'+translationRevision)||'[]');for(const [key,value] of stored)if(typeof key==='string'&&typeof value==='string')cache.set(key,value);}catch{}
const emit=()=>{version++;for(const fn of listeners)fn();};
export const subscribeInterface=fn=>{listeners.add(fn);return()=>listeners.delete(fn)};
export const interfaceSnapshot=()=>version;
export const interfaceLanguage=()=>locale;
export const interfaceStatus=()=>({running:running||queue.size>0,failed:failed.size>0,saving,preferenceError});
export function setInterfaceLanguage(id,{persist=true}={}){if(!validInterfaceLanguage(id))return;locale=id;failed.clear();queue.clear();if(typeof document!=='undefined')document.documentElement.lang=id==='zh'?'zh-Hans':id;if(persist)try{localStorage.setItem('continuumInterfaceLanguage',id)}catch{}emit();}
export async function bindInterfaceAccount(user){
 const token=++binding,selectionAtStart=selectionRevision;account=user?.id||null;preferenceError=false;
 if(!account){queue.clear();failed.clear();emit();return;}
 try{const r=await fetch('/api/interface-language',{credentials:'same-origin'});if(!r.ok)throw Error();const d=await r.json();if(token!==binding||selectionAtStart!==selectionRevision)return;
  if(d.language)setInterfaceLanguage(d.language);
  else{const language=locale;const saved=await fetch('/api/interface-language',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({language})});if(!saved.ok)throw Error();}
 }catch{if(token===binding){preferenceError=true;emit();}}
 if(token===binding){emit();schedule();}
}
export async function chooseInterfaceLanguage(id){
 if(!validInterfaceLanguage(id)||saving)return;const token=binding;selectionRevision++;saving=true;preferenceError=false;emit();
 try{if(account){const r=await fetch('/api/interface-language',{method:'PUT',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({language:id})});if(!r.ok)throw Error();}if(token===binding)setInterfaceLanguage(id);}
 catch{if(token===binding)preferenceError=true;}
 finally{saving=false;emit();}
}
export function t(value,learningLanguage=''){
 if(typeof value!=='string'||!value.trim()||locale==='en'||['Continuum','Learn with Flow'].includes(value.trim()))return value;
 const text=value.trim(),prefix=value.slice(0,value.indexOf(text)),suffix=value.slice(value.indexOf(text)+text.length);
 const source=translationSource(text,learningLanguage),protection=protectionFor(source);
 if(protection&&/^⟦KEEP_\d+⟧$/.test(protection.text))return value;
 const exact=reviewedTranslation(text,locale)||interfaceCopy[text]?.[locale];if(exact)return prefix+exact+suffix;
 const id=translationKey(text,learningLanguage),key=locale+':'+id;
 if(cache.has(key)){if(!protection||keepsLocalizedInstructions({text,protection},cache.get(key)))return prefix+cache.get(key)+suffix;cache.delete(key);}
 if(account&&translationSource(text,learningLanguage)&&!failed.has(key)&&!inFlight.has(key)){queue.set(key,{locale,id,text,language:learningLanguage});schedule();}
 return value;
}
function schedule(){if(scheduled||running||!account||!queue.size)return;scheduled=true;queueMicrotask(()=>{scheduled=false;void flush()});}
async function flush(){if(running||!account||!queue.size)return;running=true;emit();
 const requestLocale=locale,requestBinding=binding,items=[];let length=0;
 for(const [key,item] of queue){if(item.locale!==requestLocale){queue.delete(key);continue;}if(items.length>=16||length+item.text.length>14000)break;items.push({...item,key});inFlight.add(key);queue.delete(key);length+=item.text.length;}
 try{if(!items.length)return;const r=await fetch('/api/localization',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({locale:requestLocale,items:items.map(({text,language})=>({text,language}))})});if(!r.ok)throw Error();const d=await r.json();const returned=new Map((d.translations||[]).map(x=>[x.id,x.text]));for(const item of items){const text=returned.get(item.id);if(typeof text!=='string'||!keepsLocalizedInstructions({text:item.text,protection:protectionFor(translationSource(item.text,item.language))},text))throw Error();cache.set(item.key,text);}
  while(cache.size>3500)cache.delete(cache.keys().next().value);
  try{localStorage.setItem('continuumInterfaceTranslations:'+translationRevision,JSON.stringify([...cache]))}catch{}
 }catch{if(requestBinding===binding&&requestLocale===locale){for(const item of items)failed.set(item.key,item);for(const [key,item] of queue)if(item.locale===requestLocale){failed.set(key,item);queue.delete(key);}}}
 finally{for(const item of items)inFlight.delete(item.key);running=false;emit();schedule();}
}
export function retryInterfaceTranslations(){for(const [key,item] of failed)queue.set(key,item);failed.clear();emit();schedule();}
export function tf(source,values){return t(source).replace(/\{(\d+)\}/g,(token,index)=>index<values.length?String(values[index]):token);}

export function localizedFeedback(q,answer,language){const {source,values,note,original}=feedbackParts(q,answer);if(locale==='en')return original;if(!values.length)return t(original,language);return tf(source,values)+t(note,language);}

export function optionText(q,value,lesson){return displayLanguageOptions(q,lesson)?t(value):value;}
