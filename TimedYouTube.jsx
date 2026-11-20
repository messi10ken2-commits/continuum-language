import React,{useEffect,useRef,useState} from 'react';
import {formatVideoTime} from './conversation-cues.mjs';
import {t} from './interface-runtime.mjs';
let apiPromise;
function youtubeAPI(){
 if(window.YT?.Player)return Promise.resolve(window.YT);
 if(apiPromise)return apiPromise;
 apiPromise=new Promise((resolve,reject)=>{
  const previous=window.onYouTubeIframeAPIReady,script=document.createElement('script');let timer;
  const restore=()=>{clearTimeout(timer);if(window.onYouTubeIframeAPIReady===ready)window.onYouTubeIframeAPIReady=previous;};
  const ready=()=>{restore();try{previous?.()}finally{resolve(window.YT)}};
  const failed=()=>{restore();script.remove();apiPromise=null;reject(Error('Timeline unavailable'));};
  window.onYouTubeIframeAPIReady=ready;script.src='https://www.youtube.com/iframe_api';script.async=true;script.onerror=failed;timer=setTimeout(failed,15000);document.head.append(script);
 });return apiPromise;
}
// Mounted only after external-media consent. React owns the host, while the
// official player API owns its iframe, so destroy() cannot remove React nodes.
export default function TimedYouTube({youtubeId,title,clip,autoPlay=false,onError}){
 const host=useRef(null),player=useRef(null),[ready,setReady]=useState(false),[position,setPosition]=useState(clip.start),[unavailable,setUnavailable]=useState(false),[blocked,setBlocked]=useState(false);
 const reportError=useRef(onError);reportError.current=onError;
 useEffect(()=>{
  const container=host.current;let live=true,timer,instance;setReady(false);setPosition(clip.start);setUnavailable(false);setBlocked(false);
  const iframe=document.createElement('iframe');iframe.className='conversation-embed';iframe.title=title;iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allow='accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen; autoplay';iframe.allowFullscreen=true;
  iframe.src=`https://www.youtube-nocookie.com/embed/${youtubeId}?playsinline=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}&start=${clip.start}&end=${clip.end}${autoPlay?'&autoplay=1':''}`;container.append(iframe);
  youtubeAPI().then(YT=>{if(!live)return;instance=new YT.Player(iframe,{events:{
   onReady:()=>{if(!live)return;player.current=instance;setReady(true);timer=setInterval(()=>{if(!live)return;const value=instance.getCurrentTime();if(!Number.isFinite(value))return;setPosition(Math.max(clip.start,Math.min(clip.end,value)));if(value>=clip.end&&instance.getPlayerState()===1)instance.pauseVideo();},250);},
   onError:()=>{if(live){clearInterval(timer);player.current=null;setReady(false);reportError.current?.();}},
   onAutoplayBlocked:()=>{if(live)setBlocked(true);}
  }});}).catch(()=>{if(live)setUnavailable(true)});
  return()=>{live=false;clearInterval(timer);player.current=null;try{instance?.destroy()}finally{container.replaceChildren()}};
 },[youtubeId,clip.start,clip.end,title,autoPlay]);
 return <div className="timed-youtube"><div ref={host}/><div className="scene-timeline"><label>{t('Scene playback position')}<input type="range" aria-label={t('Scene playback position')} aria-valuetext={formatVideoTime(position)} min={clip.start} max={clip.end} step="0.1" value={position} disabled={!ready} onChange={e=>{const value=Number(e.target.value);setPosition(value);player.current?.seekTo(value,true)}}/></label><output>{formatVideoTime(position)} / {formatVideoTime(clip.end)}</output><small>{t('Full-video timestamps · playback is limited to this scene.')}</small></div>{blocked&&<p role="status">{t('Press play in the video to start this scene.')}</p>}{unavailable&&<p role="status">{t('The scene timeline is unavailable. Use the video’s own playback controls.')}</p>}</div>;
}
