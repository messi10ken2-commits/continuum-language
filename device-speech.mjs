import {speechChunks} from './speech-chunks.mjs';

const localeKey=value=>String(value||'').replaceAll('_','-').toLowerCase();
export function deviceVoice(voices,locale){
 const exact=voices.filter(v=>localeKey(v.lang)===localeKey(locale));
 // Never substitute a different language or national pronunciation model.
 return exact.find(v=>/enhanced|premium|natural/i.test(v.name||''))||exact.find(v=>v.localService)||exact[0];
}

// Browser speech can throw, stay paused, or never dispatch start/end (notably
// after an interrupted iOS utterance). Every state has a bounded recovery path.
export function createDevicePlayback(parts,{synth,Utterance,rate=()=>1,onStart=()=>{},onComplete=()=>{},onError=()=>{},isCurrent=()=>true,setTimer=setTimeout,clearTimer=clearTimeout,startTimeout=8000}){
 const queue=parts.flatMap(part=>speechChunks(part.text,part.lang.startsWith('ja')?60:180).map(text=>({...part,text})));
 let stopped=false,started=false,index=0,timer=null,utterance=null,listening=false;
 const live=()=>!stopped&&isCurrent();
 const clear=()=>{clearTimer(timer);timer=null;if(listening){synth?.removeEventListener?.('voiceschanged',voicesReady);listening=false;}};
 const stop=()=>{stopped=true;clear();if(utterance){utterance.onstart=null;utterance.onend=null;utterance.onerror=null;utterance=null;}try{synth?.cancel()}catch{/* Already unavailable. */}};
 const fail=(code,locale)=>{if(!live())return;stop();onError({code,locale});};
 const next=()=>{
  if(!live())return;
  clear();
  if(index>=queue.length){stopped=true;utterance=null;onComplete();return;}
  const part=queue[index++];
  try{
   const voice=deviceVoice(synth.getVoices(),part.lang);
   if(!voice){fail('voice-unavailable',part.lang);return;}
   const u=new Utterance(part.text);utterance=u;u.lang=part.lang;u.voice=voice;u.rate=Math.max(.5,Math.min(2,Number(rate())||1));
   u.onstart=()=>{if(!live()||utterance!==u)return;clear();timer=setTimer(()=>fail('speech-stalled'),Math.min(90000,15000+Array.from(part.text).length*250/u.rate));if(!started){started=true;onStart();}};
   u.onend=()=>{if(!live()||utterance!==u)return;clear();utterance=null;timer=setTimer(next,0);};
   u.onerror=()=>{if(live()&&utterance===u)fail('speech-failed');};
   timer=setTimer(()=>fail('speech-stalled'),startTimeout);
   if(synth.paused)synth.resume();
   synth.speak(u);
  }catch{fail('speech-failed');}
 };
 function voicesReady(){
  if(!live())return;
  try{if(!synth.getVoices().length)return;clear();next();}catch{fail('speech-failed');}
 }
 return {stop,start(){
  if(!live())return;
  if(!synth||!Utterance){fail('unsupported');return;}
  try{
   synth.cancel();if(synth.paused)synth.resume();
   if(synth.getVoices().length){next();return;}
   listening=true;synth.addEventListener?.('voiceschanged',voicesReady);
   timer=setTimer(()=>{clear();next();},1500);
  }catch{fail('speech-failed');}
 }};
}
