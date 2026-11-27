import {startWorldMusic} from './continuum-world-music.mjs';
let primed=null,primeTimer=null;
const audioType=()=>globalThis.AudioContext||globalThis.webkitAudioContext;

// Called by the trusted Explore Tokyo click before the lazy World import. Safari
// can then reuse this already-unlocked context when the screen mounts.
export function prepareWorldAudio(storageKey) {
 try{const state=JSON.parse(localStorage.getItem(storageKey)||'{}');if(state.volume===0||state.music===false&&state.sound!==true)return false;}catch{}
 const Audio=audioType();if(!Audio)return false;
 try{
  if(!primed||primed.state==='closed')primed=new Audio();
  void primed.resume().catch(()=>{});clearTimeout(primeTimer);
  const context=primed;primeTimer=setTimeout(()=>{if(primed===context){primed=null;void context.close().catch(()=>{});}},10000);
  return true;
 }catch{return false;}
}

// Original ambience and quiet instrumental music share one context and volume
// control. Music stays faint during NPC interaction, including microphone use.
export function createWorldAmbience({musicFactory=startWorldMusic}={}) {
 let context=null,ambientGain=null,musicGain=null,source=null,music=null,filter=null;
 let disposed=false,enabled=false,musicEnabled=false,active=true,ducked=false,volume=.2,suspendTimer=null;
 const wanted=()=>active&&(enabled||musicEnabled)&&volume>0;
 function ensure(){
  if(context)return true;const Audio=audioType();if(!Audio)return false;
  try{context=primed&&primed.state!=='closed'?primed:new Audio();if(primed===context){primed=null;clearTimeout(primeTimer);}}
  catch{return false;}
  ambientGain=context.createGain();musicGain=context.createGain();ambientGain.gain.value=musicGain.gain.value=0;
  ambientGain.connect(context.destination);musicGain.connect(context.destination);return true;
 }
 function ambience(){
  if(source)return;
  const buffer=context.createBuffer(1,context.sampleRate*3,context.sampleRate),samples=buffer.getChannelData(0);let seed=197;
  for(let i=0;i<samples.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;samples[i]=(seed/4294967296-.5)*.4;}
  filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=450;
  source=context.createBufferSource();source.buffer=buffer;source.loop=true;source.connect(filter);filter.connect(ambientGain);source.start();
 }
 function sync(){
  if(disposed||!context)return;clearTimeout(suspendTimer);
  const current=context,time=context.currentTime;
  ambientGain.gain.setTargetAtTime(enabled&&active?volume*.08:0,time,.15);
  musicGain.gain.setTargetAtTime(musicEnabled&&active?volume*.5*(ducked ? .10 : 1):0,time,ducked||!musicEnabled||volume===0 ? .10 : .65);
  music?.setActive(wanted()&&musicEnabled);
  if(wanted())void context.resume().then(()=>{if(context===current&&!wanted())void current.suspend().catch(()=>{});}).catch(()=>{});
  else if(!active)void current.suspend().catch(()=>{});
  else suspendTimer=setTimeout(()=>{if(context===current&&!wanted())void current.suspend().catch(()=>{});},280);
 }
 return {
  setEnabled(value,level=.2){if(disposed)return false;enabled=!!value;volume=Number.isFinite(level)?Math.max(0,Math.min(1,level)):.2;if(enabled&&!ensure())return false;if(enabled)ambience();sync();return true;},
  setMusicEnabled(value,level=volume){if(disposed)return false;musicEnabled=!!value;volume=Number.isFinite(level)?Math.max(0,Math.min(1,level)):.2;if(musicEnabled&&!ensure())return false;if(musicEnabled&&!music)music=musicFactory(context,musicGain);sync();return true;},
  setDucked(value){if(disposed)return;ducked=!!value;sync();},
  setActive(value){if(disposed)return;active=!!value;sync();},
  unlock(){if(disposed||!(enabled||musicEnabled))return false;if(context?.state==='running')return true;if(!ensure())return false;sync();return true;},
  dispose(){if(disposed)return;disposed=true;clearTimeout(suspendTimer);music?.dispose();source?.stop();source?.disconnect();filter?.disconnect();ambientGain?.disconnect();musicGain?.disconnect();if(context)void context.close().catch(()=>{});context=null;source=null;music=null;},
 };
}
