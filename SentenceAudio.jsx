import {LanguageContext} from './LanguageContext.jsx';
import {languageInfo} from './languages.mjs';
import React,{useEffect,useRef,useState,useContext} from 'react';
import {Volume2,Square} from 'lucide-react';
import {speechParts} from './sentence-audio.mjs';
import './sentence-audio.css';
let active=null;
export default function SentenceAudio({text,lang='auto',compact=false,onPlayed}){
 const language=useContext(LanguageContext),locale=languageInfo(language).locale;
 const [playing,setPlaying]=useState(false),[slow,setSlow]=useState(false),[error,setError]=useState('');
 const owner=useRef({}),mounted=useRef(true),utterance=useRef(null);
 const stop=()=>{if(active?.owner===owner.current){active=null;window.speechSynthesis?.cancel();}if(mounted.current)setPlaying(false);};
 useEffect(()=>{mounted.current=true;setPlaying(false);return()=>{mounted.current=false;if(active?.owner===owner.current){active=null;window.speechSynthesis?.cancel();}}},[text]);
 const play=()=>{
  if(playing){stop();return;}
  const synth=window.speechSynthesis;setError('');
  if(!synth||!window.SpeechSynthesisUtterance){setError('Audio is unavailable on this device. The text is still available.');return;}
  active?.stop();synth.cancel();active={owner:owner.current,stop};setPlaying(true);
  const parts=speechParts(text,lang==='es-ES'&&language!=='es'?locale:lang,locale);let index=0;
  const next=()=>{
   if(active?.owner!==owner.current)return;
   if(index>=parts.length){active=null;setPlaying(false);return;}
   const part=parts[index++],u=new SpeechSynthesisUtterance(part.text);
   u.lang=part.lang;u.rate=slow?.75:1;
   const voices=synth.getVoices();u.voice=voices.find(v=>v.lang===part.lang)||voices.find(v=>v.lang.startsWith(part.lang.slice(0,2)))||null;
   u.onstart=()=>{if(index===1)onPlayed?.();};u.onend=next;
   u.onerror=e=>{if(active?.owner!==owner.current)return;active=null;setPlaying(false);if(!['interrupted','canceled'].includes(e.error))setError('Could not play audio. Check your device’s speech voices and try again.');};
   utterance.current=u;synth.speak(u);
  };next();
 };
 if(!String(text||'').trim())return null;
 return <span className={`sentence-audio ${compact?'compact':''}`}><button type="button" className="sentence-play" aria-label={playing?'Stop audio':'Listen to this text'} aria-pressed={playing} onClick={e=>{e.preventDefault();e.stopPropagation();play();}}>{playing?<Square size={16}/>:<Volume2 size={16}/>}{!compact&&<span>{playing?'Stop':'Listen'}</span>}</button>{playing&&<button type="button" className="sentence-speed" aria-label={slow?'Use normal playback speed':'Use slower playback speed'} onClick={e=>{e.preventDefault();e.stopPropagation();stop();setSlow(v=>!v);}}>{slow?'0.75×':'1×'}</button>}{error&&<span role="status" className="sentence-audio-error">{error}</span>}</span>;
}
export function SpokenText({text,lang='auto'}){
 return <span className="spoken-sentence">{text} <SentenceAudio text={text} lang={lang} compact/></span>;
}
