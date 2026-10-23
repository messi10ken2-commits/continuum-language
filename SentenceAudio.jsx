import {speechChunks} from './speech-chunks.mjs';
import {t as uiText,tf as uiTemplate} from './interface-runtime.mjs';
import {nativeWordEntry} from './native-word-map.mjs';
import {nativeKanaKey} from './native-kana-map.mjs';
import {LanguageContext} from './LanguageContext.jsx';
import {languageInfo} from './languages.mjs';
import React,{useEffect,useRef,useState,useContext} from 'react';
import {Volume2,Square} from 'lucide-react';
import {speechParts} from './sentence-audio.mjs';
import {audioLookahead} from './audio-lookahead.mjs';
import './sentence-audio.css';
let active=null;
const clips=new Map();let cacheBytes=0;
async function studioClip(part,signal,endpoint=null){
 const key=JSON.stringify([part.lang,part.text.trim()]);if(!endpoint&&clips.has(key))return clips.get(key);
 const r=await fetch(endpoint||'/api/speech',endpoint?{credentials:'same-origin',signal}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:part.text,locale:part.lang}),signal});
 if(!r.ok){const p=await r.json().catch(()=>({}));throw Object.assign(Error(p.error||'Studio audio is unavailable. Please retry.'),{status:r.status});}
 if(!r.headers.get('content-type')?.includes('audio/'))throw Error('Studio audio is unavailable.');
 const blob=await r.blob();if(blob.size>8_100_000)throw Error('Audio is too large to play.');
 while(cacheBytes+blob.size>16_000_000&&clips.size){const first=clips.keys().next().value;cacheBytes-=clips.get(first).blob.size;clips.delete(first);}
 const clip={blob,source:r.headers.get('X-Audio-Source')==='Human recording'?'Human recording':'AI studio voice'};if(!endpoint){clips.set(key,clip);cacheBytes+=blob.size;}return clip;
}
export default function SentenceAudio({text,lang='auto',compact=false,onPlayed,audioEndpoint=null,allowDeviceFallback=true}){
 const language=useContext(LanguageContext),locale=languageInfo(language).locale;
 const humanWord=nativeWordEntry(text,lang==='auto'?locale:lang);
 const defaultSource=humanWord||nativeKanaKey(text,lang==='auto'?locale:lang)?'Human recording':'AI studio voice';
 const [playing,setPlaying]=useState(false),[loading,setLoading]=useState(false),[slow,setSlow]=useState(false),[error,setError]=useState(''),[source,setSource]=useState('');
 const utterance=useRef(null);
 const owner=useRef({}),mounted=useRef(true),audio=useRef(null),request=useRef(null),objectURL=useRef(''),generation=useRef(0),speed=useRef(1);
 const release=()=>{if(audio.current){audio.current.onended=null;audio.current.onerror=null;audio.current.pause();audio.current.removeAttribute('src');audio.current.load();audio.current=null;}if(objectURL.current){URL.revokeObjectURL(objectURL.current);objectURL.current='';}};
 const stop=()=>{utterance.current=null;generation.current++;request.current?.abort();request.current=null;release();if(active?.owner===owner.current){if(active.device)window.speechSynthesis?.cancel();active=null;}if(mounted.current){setPlaying(false);setLoading(false);}};
 useEffect(()=>{mounted.current=true;setPlaying(false);setLoading(false);setError('');setSource('');return()=>{mounted.current=false;stop();}},[text,lang,locale,audioEndpoint]);
 const play=async()=>{
  if(playing||loading){stop();return;}
  active?.stop();stop();const token=generation.current;active={owner:owner.current,stop};setError('');setSource(defaultSource);setLoading(true);
  request.current=new AbortController();const signal=request.current.signal;
  const parts=speechParts(text,lang,locale).filter(p=>p.text.trim());let index=0,started=false;
  const preparedClip=audioLookahead(parts,(part,signal)=>studioClip(part,signal,audioEndpoint),signal);
  const next=async()=>{if(!mounted.current||token!==generation.current)return;
   release();if(index>=parts.length){setPlaying(false);setLoading(false);if(active?.owner===owner.current)active=null;return;}
   setLoading(true);
   try{
    const clip=await preparedClip(index++);if(!mounted.current||token!==generation.current)return;
    setSource(clip.source);objectURL.current=URL.createObjectURL(clip.blob);const player=new Audio(objectURL.current);audio.current=player;player.playbackRate=speed.current;player.preservesPitch=true;
    player.onended=next;player.onerror=()=>{if(token===generation.current){stop();setError('Could not play the studio recording. Tap Listen to retry.');}};
    await player.play();if(!mounted.current||token!==generation.current)return;
    setLoading(false);setPlaying(true);if(!started){started=true;onPlayed?.();}
   }catch(e){if(e.name==='AbortError'||!mounted.current||token!==generation.current)return;if(allowDeviceFallback&&!(/^(foi|fui)$/i.test(String(text).trim())&&lang==='pt-BR')&&e.name!=='NotAllowedError'&&(e.status===503||e.status===429||e instanceof TypeError)){await devicePlay(parts.slice(index-1),started);return;}stop();setError(e.name==='NotAllowedError'?'Audio is ready. Tap Listen again to allow playback.':e.message);}
  };await next();
 };
 const devicePlay=async(remainingParts=null,alreadyStarted=false)=>{
  active?.stop();stop();setError('');setSource('Device voice · quality varies');const token=generation.current;
  const synth=window.speechSynthesis;if(!synth||!window.SpeechSynthesisUtterance){setError('This device has no speech playback.');return;}
  active={owner:owner.current,stop,device:true};setLoading(true);
  if(!synth.getVoices().length)await new Promise(resolve=>{const done=()=>{clearTimeout(timer);synth.removeEventListener('voiceschanged',done);resolve();};const timer=setTimeout(done,1500);synth.addEventListener('voiceschanged',done);});
  if(token!==generation.current||!mounted.current)return;
  const parts=(remainingParts||speechParts(text,lang,locale)).flatMap(part=>speechChunks(part.text,part.lang.startsWith('ja')?60:180).map(text=>({...part,text})));let index=0;
  const next=()=>{if(token!==generation.current||!mounted.current)return;if(index===parts.length){stop();return;}
   const part=parts[index++],voices=synth.getVoices(),voice=voices.find(v=>v.lang.replace('_','-').toLowerCase()===part.lang.toLowerCase());
   if(!voice){stop();setError(`Install a ${part.lang} voice on this device, or retry the studio voice.`);return;}
   const u=new SpeechSynthesisUtterance(part.text);utterance.current=u;u.lang=part.lang;u.voice=voice;u.rate=speed.current;u.onstart=()=>{if(token===generation.current){setLoading(false);setPlaying(true);if(index===1&&!alreadyStarted)onPlayed?.();}};u.onend=next;u.onerror=()=>{if(token===generation.current){stop();setError('Device speech could not start. Tap Listen again, or check that this language voice is installed on your device.');}};synth.speak(u);
  };next();
 };
 if(!String(text||'').trim())return null;
 return <span className={`sentence-audio ${compact?'compact':''}`}><button type="button" className="sentence-play" title={source||defaultSource} aria-label={loading?'Cancel loading audio':playing?'Stop audio':'Listen to this text'} aria-pressed={playing||loading} onClick={e=>{e.preventDefault();e.stopPropagation();play();}}>{playing||loading?<Square size={16}/>:<Volume2 size={16}/>}{!compact&&<span>{uiText(loading?'Preparing…':playing?'Stop':'Listen')}</span>}</button>{(!compact||playing||loading)&&<button type="button" className="sentence-speed" aria-label={slow?'Use normal playback speed':'Use slower playback speed'} aria-pressed={slow} onClick={e=>{e.preventDefault();e.stopPropagation();const next=!slow;setSlow(next);speed.current=next?.85:1;if(audio.current)audio.current.playbackRate=speed.current;}}>{uiText(slow?'0.85×':'1×')}</button>}{!compact&&<small className="voice-source">{source||defaultSource}</small>}{humanWord&&!compact&&<small className="voice-source"><a href={humanWord.source} target="_blank" rel="noreferrer">{humanWord.author}</a> · {humanWord.region} · <a href={humanWord.licenseUrl} target="_blank" rel="noreferrer">{humanWord.license}</a><span title={humanWord.changes}>{uiText(" · Edited recording")}</span></small>}{error&&<span className="sentence-audio-error" role="status">{uiText(error)}{allowDeviceFallback&&<button type="button" className="text-button" onClick={e=>{e.preventDefault();e.stopPropagation();devicePlay();}}>{uiText("Use device voice instead")}</button>}</span>}</span>;
}
export function SpokenText({text,lang='auto'}){return <span className="spoken-sentence">{text} <SentenceAudio text={text} lang={lang} compact/></span>;}
