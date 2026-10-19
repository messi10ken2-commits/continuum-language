// End-of-turn detection is based on microphone energy, never a browser ASR vendor.
export function newVoiceWindow(now){return {started:now,lastSpeech:now,heard:false,speechFrames:0,noise:0.002};}
export function detectVoiceEnd(window,rms,now,{silenceMs=1500,maxMs=45000,idleMs=20000}={}){
 const threshold=Math.max(0.009,Math.min(0.04,window.noise*3));
 const loud=rms>=threshold;
 if(loud){window.speechFrames++;window.lastSpeech=now;if(window.speechFrames>=3)window.heard=true;}
 else if(!window.heard){window.speechFrames=0;window.noise=window.noise*.96+Math.min(rms,0.012)*.04;}
 if(now-window.started>=maxMs)return window.heard?'send':'idle';
 if(window.heard&&now-window.lastSpeech>=silenceMs&&now-window.started>=1000)return 'send';
 if(!window.heard&&now-window.started>=idleMs)return 'idle';
 return 'listen';
}
export class ConversationVoiceLoop{
 constructor({onState,onLevel,onTurn,onError,onVoiceFallback,locale='en-US',silenceMs=1500,deviceVoice=false,fetchImpl=fetch,host=globalThis,canContinue}){Object.assign(this,{onState,onLevel,onTurn,onError,onVoiceFallback,locale,silenceMs,deviceVoice,fetchImpl,host,canContinue});this.fetchImpl=fetchImpl.bind(host);this.epoch=0;this.active=false;this.retryClip=null;}
 state(value){this.onState?.(value);}
 async start(url){
  if(this.active)return;
  this.active=true;const epoch=++this.epoch;this.currentURL=url;this.state('connecting');
  try{
   const AC=this.host.AudioContext||this.host.webkitAudioContext;
   if(!AC||!this.host.MediaRecorder||!this.host.navigator?.mediaDevices?.getUserMedia)throw Error('Voice conversation is unavailable in this browser. You can still type your replies.');
   this.context=new AC();await this.context.resume();if(!this.valid(epoch))return;
   const stream=await this.host.navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
   if(!this.valid(epoch)){stream.getTracks().forEach(t=>t.stop());return;}
   this.stream=stream;this.mic=this.context.createMediaStreamSource(stream);this.micMeter=this.context.createAnalyser();this.micMeter.fftSize=1024;this.mic.connect(this.micMeter);
   void this.loop(epoch);
  }catch(e){if(this.valid(epoch))this.fail(e.name==='NotAllowedError'?Error('Allow microphone access to start voice conversation. You can still use text chat.'):e);}
 }
 valid(epoch){return this.active&&this.epoch===epoch;}
 async loop(epoch){
  try{while(this.valid(epoch)){
   if(this.retryClip){this.stream.getAudioTracks().forEach(t=>t.enabled=false);this.state('thinking');const next=await this.onTurn(this.retryClip);this.retryClip=null;this.currentURL=next;if(!this.valid(epoch))return;}
   this.stream.getAudioTracks().forEach(t=>t.enabled=false);
   this.state('preparing');await this.speak(this.currentURL,epoch);if(!this.valid(epoch))return;
   if(this.canContinue?.()===false){this.stop();this.state('ready');return;}
   await new Promise(resolve=>{this.delay=setTimeout(resolve,250);this.cancelDelay=resolve;});if(!this.valid(epoch))return;
   this.stream.getAudioTracks().forEach(t=>t.enabled=true);
   this.state('listening');const clip=await this.listen(epoch);if(!this.valid(epoch))return;
   if(!clip){this.stop();this.state('idle');return;}this.retryClip=clip;
  }}catch(e){if(e.status===422)this.retryClip=null;if(this.valid(epoch))this.fail(e);}
 }
 async speak(url,epoch){
  if(this.deviceVoice)return this.speakDevice(epoch);
  this.abort=new AbortController();
  const timeout=setTimeout(()=>this.abort?.abort(),30000);let response;try{response=await this.fetchImpl(url,{credentials:'same-origin',signal:this.abort.signal});}catch(e){if(!this.valid(epoch))return;return this.fallbackVoice(epoch);}finally{clearTimeout(timeout);}
  if(!response.ok){await response.arrayBuffer();if(!this.valid(epoch))return;if([429,503,504].includes(response.status))return this.fallbackVoice(epoch);throw Error('Natural voice is temporarily unavailable. Retry, or choose device voice.');}
  if(!response.headers.get('content-type')?.startsWith('audio/'))throw Error('The voice response could not be played. Please retry.');
  const bytes=await response.arrayBuffer();if(!this.valid(epoch))return;
  if(bytes.byteLength>8100000)throw Error('The voice response could not be played. Please retry.');
  const buffer=await this.context.decodeAudioData(bytes);if(!this.valid(epoch))return;
  if(this.context.state==='suspended')await this.context.resume();
  if(this.context.state!=='running')throw Error('Tap Resume conversation to allow audio playback.');
  const source=this.context.createBufferSource(),meter=this.context.createAnalyser();source.buffer=buffer;meter.fftSize=512;source.connect(meter);meter.connect(this.context.destination);this.source=source;
  this.state('speaking');this.meter(meter,epoch);
  await new Promise((resolve,reject)=>{this.endPlayback=resolve;source.onended=resolve;try{source.start()}catch(e){reject(e)}});
  this.stopMeter();source.disconnect();meter.disconnect();this.source=null;this.endPlayback=null;
 }
 async fallbackVoice(epoch){
  if(!this.valid(epoch))return;this.deviceVoice=true;this.onVoiceFallback?.();return this.speakDevice(epoch);
 }
 async speakDevice(epoch){
  const r=await this.fetchImpl(this.currentURL+'?format=text',{credentials:'same-origin',signal:(this.abort=new AbortController()).signal});
  if(!r.ok)throw Error('The voice response could not be played. Please retry.');const {text,locale}=await r.json();if(!this.valid(epoch))return;
  const synth=this.host.speechSynthesis,U=this.host.SpeechSynthesisUtterance;if(!synth||!U)throw Error('Device voice is unavailable. Choose natural voice or type your reply.');
  const u=new U(text);this.utterance=u;u.lang=locale||this.locale;u.rate=1;
  const voice=synth.getVoices().find(v=>v.lang.replace('_','-').toLowerCase()===u.lang.toLowerCase());if(voice)u.voice=voice;
  this.state('speaking');
  await new Promise((resolve,reject)=>{this.endPlayback=resolve;u.onend=resolve;u.onerror=()=>reject(Error('Tap Resume conversation to allow audio playback.'));u.onboundary=()=>{this.onLevel?.(.5);clearTimeout(this.boundary);this.boundary=setTimeout(()=>this.onLevel?.(0),160)};synth.speak(u)});
  this.endPlayback=null;this.utterance=null;this.onLevel?.(0);
 }
 meter(analyser,epoch){
  this.stopMeter();const bytes=new Uint8Array(analyser.fftSize);
  this.levelTimer=setInterval(()=>{if(!this.valid(epoch))return;analyser.getByteTimeDomainData(bytes);const rms=Math.sqrt(bytes.reduce((sum,b)=>sum+((b-128)/128)**2,0)/bytes.length);this.onLevel?.(Math.min(1,rms*9));},60);
 }
 stopMeter(){clearInterval(this.levelTimer);this.onLevel?.(0);}
 listen(epoch){return new Promise((resolve,reject)=>{
  const MR=this.host.MediaRecorder,mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(t=>MR.isTypeSupported(t));
  const recorder=new MR(this.stream,{...(mime?{mimeType:mime}:{}),audioBitsPerSecond:32000});this.recorder=recorder;
  const chunks=[],started=Date.now(),window=newVoiceWindow(started),samples=new Uint8Array(this.micMeter.fftSize);let decision='idle';
  const finish=value=>{decision=value;if(recorder.state==='recording')recorder.stop();};
  this.cancelListen=()=>finish('idle');
  recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
  recorder.onerror=()=>{clearInterval(this.listenTimer);reject(Error('Microphone recording stopped. Please resume the conversation.'));};
  recorder.onstop=()=>{clearInterval(this.listenTimer);this.cancelListen=null;this.recorder=null;this.stopMeter();if(!this.valid(epoch)||decision!=='send'){resolve(null);return;}
   const blob=new Blob(chunks,{type:(recorder.mimeType||mime||'audio/mp4').split(';')[0]}),seconds=Math.min(90,(Date.now()-started)/1000);
   if(blob.size<100||blob.size>1000000){reject(Error('The recording could not be heard clearly. Please try again.'));return;}
   const reader=new this.host.FileReader();reader.onerror=()=>reject(Error('The recording could not be prepared. Please try again.'));reader.onload=()=>resolve({audio:reader.result,seconds});reader.readAsDataURL(blob);
  };
  recorder.start(200);
  this.listenTimer=setInterval(()=>{if(!this.valid(epoch)){finish('idle');return;}
   this.micMeter.getByteTimeDomainData(samples);const rms=Math.sqrt(samples.reduce((sum,b)=>sum+((b-128)/128)**2,0)/samples.length);this.onLevel?.(Math.min(1,rms*9));const next=detectVoiceEnd(window,rms,Date.now(),{silenceMs:this.silenceMs});if(next!=='listen')finish(next);
  },50);
 });}
 fail(error){this.stop();this.state('error');this.onError?.(error);}
 stop(){
  this.active=false;this.epoch++;this.abort?.abort();clearTimeout(this.delay);this.cancelDelay?.();this.cancelDelay=null;clearTimeout(this.boundary);clearInterval(this.listenTimer);this.cancelListen?.();this.cancelListen=null;
  if(this.recorder?.state==='recording')try{this.recorder.stop()}catch{}this.recorder=null;
  try{this.source?.stop()}catch{}this.endPlayback?.();this.endPlayback=null;if(this.utterance)this.host.speechSynthesis?.cancel();this.utterance=null;
  this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.mic?.disconnect();this.stopMeter();this.context?.close().catch(()=>{});this.context=null;
 }
}
