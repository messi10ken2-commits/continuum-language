import {createDevicePlayback} from './device-speech.mjs';
import {t as uiText,tf as uiTemplate} from './interface-runtime.mjs';
import {nativeWordEntry} from './native-word-map.mjs';
import {nativeKanaKey} from './native-kana-map.mjs';
import {LanguageContext} from './LanguageContext.jsx';
import {languageInfo} from './languages.mjs';
import React,{useEffect,useRef,useState,useContext} from 'react';
import {Volume2,Square} from 'lucide-react';
import {isolatedSpeechWord,speechParts} from './sentence-audio.mjs';
import {audioLookahead} from './audio-lookahead.mjs';
import './sentence-audio.css';
let active=null;
const clips=new Map();let cacheBytes=0;
async function studioClip(part,signal,endpoint=null){
 const key=JSON.stringify([part.lang,part.text.trim()]);if(!endpoint&&clips.has(key))return clips.get(key);
 const pending=new AbortController();let timedOut=false;
 const cancel=()=>pending.abort();signal?.addEventListener('abort',cancel,{once:true});if(signal?.aborted)pending.abort();
 const timer=setTimeout(()=>{timedOut=true;pending.abort();},30000);let r,blob;
 try{
  r=await fetch(endpoint||'/api/speech',endpoint?{credentials:'same-origin',signal:pending.signal}:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:part.text,locale:part.lang}),signal:pending.signal});
  if(!r.ok){const p=await r.json().catch(()=>({}));throw Object.assign(Error(p.error||'Studio audio is unavailable. Please retry.'),{status:r.status});}
  if(!r.headers.get('content-type')?.includes('audio/'))throw Error('Studio audio is unavailable.');
  blob=await r.blob();if(!blob.size)throw Error('Studio audio is unavailable.');
  if(blob.size>8_100_000)throw Error('Audio is too large to play.');
 }catch(e){if(timedOut)throw Error('Studio audio is unavailable. Please retry.');throw e;}
 finally{clearTimeout(timer);signal?.removeEventListener('abort',cancel);}
 while(cacheBytes+blob.size>16_000_000&&clips.size){const first=clips.keys().next().value;cacheBytes-=clips.get(first).blob.size;clips.delete(first);}
 const clip={blob,source:r.headers.get('X-Audio-Source')==='Human recording'?'Human recording':'AI studio voice'};if(!endpoint){clips.set(key,clip);cacheBytes+=blob.size;}return clip;
}
export default function SentenceAudio({text,lang='auto',compact=false,onPlayed,audioEndpoint=null,allowDeviceFallback=true}){
 const language=useContext(LanguageContext),locale=languageInfo(language).locale;
 const humanWord=nativeWordEntry(text,lang==='auto'?locale:lang);
 const defaultSource=humanWord||nativeKanaKey(text,lang==='auto'?locale:lang)?'Human recording':'AI studio voice';
 const [playing,setPlaying]=useState(false),[loading,setLoading]=useState(false),[slow,setSlow]=useState(false),[error,setError]=useState(''),[source,setSource]=useState('');
 const device=useRef(null),readyClip=useRef(null);
 const owner=useRef({}),mounted=useRef(true),audio=useRef(null),request=useRef(null),objectURL=useRef(''),playbackWatch=useRef(null),generation=useRef(0),speed=useRef(1);
 const release=()=>{clearInterval(playbackWatch.current);playbackWatch.current=null;if(audio.current){audio.current.onended=null;audio.current.onerror=null;audio.current.pause();audio.current.removeAttribute('src');audio.current.load();audio.current=null;}if(objectURL.current){URL.revokeObjectURL(objectURL.current);objectURL.current='';}};
 const stop=()=>{generation.current++;device.current?.stop();device.current=null;request.current?.abort();request.current=null;release();if(active?.owner===owner.current){active=null;}if(mounted.current){setPlaying(false);setLoading(false);}};
 useEffect(()=>{readyClip.current=null;mounted.current=true;setPlaying(false);setLoading(false);setError('');setSource('');return()=>{mounted.current=false;stop();}},[text,lang,locale,audioEndpoint]);
 const play=async()=>{
  if(playing||loading){stop();return;}
  active?.stop();stop();const token=generation.current;active={owner:owner.current,stop};setError('');setSource(defaultSource);setLoading(true);
  request.current=new AbortController();const signal=request.current.signal;
  const parts=speechParts(text,lang,locale).filter(p=>p.text.trim());let queued=readyClip.current;readyClip.current=null;let index=queued?.index||0,started=queued?.started||false;
  const preparedClip=audioLookahead(parts,(part,signal)=>studioClip(part,signal,audioEndpoint),signal);
  const next=async()=>{if(!mounted.current||token!==generation.current)return;
   release();if(index>=parts.length){setPlaying(false);setLoading(false);if(active?.owner===owner.current)active=null;return;}
   setLoading(true);let lastClip;
   try{
    let clip;if(queued){clip=queued.clip;queued=null;index++;}else clip=await preparedClip(index++);lastClip=clip;if(!mounted.current||token!==generation.current)return;
    setSource(clip.source);objectURL.current=URL.createObjectURL(clip.blob);const player=new Audio(objectURL.current);audio.current=player;player.playbackRate=speed.current;player.preservesPitch=true;
    let lastTime=0,lastProgress=Date.now();playbackWatch.current=setInterval(()=>{if(token!==generation.current)return;if(player.currentTime>lastTime){lastTime=player.currentTime;lastProgress=Date.now();}if(Date.now()-lastProgress>15000){stop();setError('Could not play the studio recording. Tap Listen to retry.');}},500);
    player.onended=next;player.onerror=()=>{if(token===generation.current){stop();setError('Could not play the studio recording. Tap Listen to retry.');}};
    await player.play();if(!mounted.current||token!==generation.current)return;
    setLoading(false);setPlaying(true);if(!started){started=true;onPlayed?.();}
   }catch(e){if(e.name==='AbortError'||!mounted.current||token!==generation.current)return;stop();if(e.name==='NotAllowedError'&&lastClip)readyClip.current={clip:lastClip,index:index-1,started};setError(e.name==='NotAllowedError'?'Audio is ready. Tap Listen again to allow playback.':e.message);}
  };await next();
 };
 // Device speech must start from a fresh tap, not after an asynchronous failed
 // network request that has lost iOS user activation. It is never a silent swap.
 const devicePlay=()=>{
  active?.stop();stop();setError('');setSource('Device voice · quality varies');const token=generation.current;
  active={owner:owner.current,stop,device:true};setLoading(true);
  const controller=createDevicePlayback(speechParts(text,lang,locale),{
   synth:window.speechSynthesis,Utterance:window.SpeechSynthesisUtterance,rate:()=>speed.current,
   isCurrent:()=>mounted.current&&token===generation.current,
   onStart:()=>{setLoading(false);setPlaying(true);onPlayed?.();},onComplete:stop,
   onError:({code,locale:voiceLocale})=>{stop();setError(code==='unsupported'?'This device has no speech playback.':code==='voice-unavailable'?uiTemplate('Install a {0} voice on this device, or retry the studio voice.',[voiceLocale]):'Device speech could not start. Tap Listen again, or check that this language voice is installed on your device.');}
  });device.current=controller;controller.start();
 };
 if(!String(text||'').trim())return null;
 return <span className={`sentence-audio ${compact?'compact':''}`}><button type="button" className="sentence-play" title={source||defaultSource} aria-label={loading?'Cancel loading audio':playing?'Stop audio':'Listen to this text'} aria-pressed={playing||loading} onClick={e=>{e.preventDefault();e.stopPropagation();play();}}>{playing||loading?<Square size={16}/>:<Volume2 size={16}/>}{!compact&&<span>{uiText(loading?'Preparing…':playing?'Stop':'Listen')}</span>}</button>{(!compact||playing||loading)&&<button type="button" className="sentence-speed" aria-label={slow?'Use normal playback speed':'Use slower playback speed'} aria-pressed={slow} onClick={e=>{e.preventDefault();e.stopPropagation();const next=!slow;setSlow(next);speed.current=next?.85:1;if(audio.current)audio.current.playbackRate=speed.current;}}>{uiText(slow?'0.85×':'1×')}</button>}{!compact&&<small className="voice-source">{uiText(source||defaultSource)}</small>}{!compact&&isolatedSpeechWord(text)&&(source||defaultSource)==='AI studio voice'&&<small className="voice-source">{uiText('Short words are repeated twice.')}</small>}{humanWord&&!compact&&<small className="voice-source"><a href={humanWord.source} target="_blank" rel="noreferrer">{humanWord.author}</a> · {humanWord.region} · <a href={humanWord.licenseUrl} target="_blank" rel="noreferrer">{humanWord.license}</a><span title={humanWord.changes}>{uiText(" · Edited recording")}</span></small>}{error&&<span className="sentence-audio-error" role="status">{uiText(error)}{allowDeviceFallback&&<button type="button" className="text-button" onClick={e=>{e.preventDefault();e.stopPropagation();devicePlay();}}>{uiText("Use device voice instead")}</button>}</span>}</span>;
}
export function SpokenText({text,lang='auto'}){return <span className="spoken-sentence">{text} <SentenceAudio text={text} lang={lang} compact/></span>;}
