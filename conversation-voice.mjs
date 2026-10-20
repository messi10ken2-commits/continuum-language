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
 constructor({onState,onLevel,onTurn,onError,onVoiceFallback,locale='en-US',silenceMs=1500,deviceVoice=false,rate=1,fetchImpl=fetch,host=globalThis,canContinue}){Object.assign(this,{onState,onLevel,onTurn,onError,onVoiceFallback,locale,silenceMs,deviceVoice,rate,fetchImpl,host,canContinue});this.fetchImpl=fetchImpl.bind(host);this.epoch=0;this.active=false;this.retryClip=null;}
 state(value){this.onState?.(value);}
 async start(url,reply=null){
  if(this.active)return;
  this.active=true;const epoch=++this.epoch;this.currentURL=url;this.currentText=reply?.text;this.currentLocale=reply?.locale;this.state('connecting');
  try{
   // Prime the browser's device speech engine inside the actual button gesture,
   // before permission dialogs or network awaits lose user activation.
   if(this.host.speechSynthesis&&this.host.SpeechSynthesisUtterance){const synth=this.host.speechSynthesis;synth.cancel();synth.resume();const prime=new this.host.SpeechSynthesisUtterance('Ready');prime.volume=0;this.utterance=prime;synth.speak(prime);}
   const AC=this.host.AudioContext||this.host.webkitAudioContext;
   if(!AC||!this.host.MediaRecorder||!this.host.navigator?.mediaDevices?.getUserMedia)throw Error('Voice conversation is unavailable in this browser. You can still type your replies.');
   // Keep an unlocked media element for output, separate from microphone Web Audio.
   // Safari can change the capture AudioContext route/state between turns.
   if(this.host.Audio){this.player=new this.host.Audio();this.player.preload='auto';this.player.muted=false;this.player.volume=1;
    this.player.src='data:audio/wav;base64,UklGRmQBAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YUABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';
    const player=this.player,unlocked=player.play();unlocked?.then(()=>{if(player.src.startsWith('data:'))player.pause()}).catch(()=>{});}
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
   if(this.retryClip){this.stream.getAudioTracks().forEach(t=>t.enabled=false);this.state('thinking');const next=await this.onTurn(this.retryClip);this.retryClip=null;this.currentURL=typeof next==='string'?next:next.url;this.currentText=typeof next==='string'?null:next.text;this.currentLocale=typeof next==='string'?null:next.locale;if(!this.valid(epoch))return;}
   this.stream.getAudioTracks().forEach(t=>t.enabled=false);
   this.state('preparing');await this.speak(this.currentURL,epoch);if(!this.valid(epoch))return;
   if(this.canContinue?.()===false){this.stop();this.state('ready');return;}
   await new Promise(resolve=>{this.delay=setTimeout(resolve,250);this.cancelDelay=resolve;});if(!this.valid(epoch))return;
   this.stream.getAudioTracks().forEach(t=>t.enabled=true);
   if(this.context.state!=='running')await this.context.resume();if(!this.valid(epoch))return;if(this.context.state!=='running')throw Error('Tap Resume conversation to allow audio playback.');
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
  const buffer=await this.context.decodeAudioData(bytes.slice(0));if(!this.valid(epoch))return;
  if(this.player)return this.playMedia(bytes,epoch);
  if(this.context.state==='suspended')await this.context.resume();
  if(this.context.state!=='running')throw Error('Tap Resume conversation to allow audio playback.');
  const source=this.context.createBufferSource(),meter=this.context.createAnalyser();source.buffer=buffer;meter.fftSize=512;source.connect(meter);meter.connect(this.context.destination);this.source=source;
  this.state('speaking');this.meter(meter,epoch);
  await new Promise((resolve,reject)=>{this.endPlayback=resolve;source.onended=resolve;try{source.start()}catch(e){reject(e)}});
  this.stopMeter();source.disconnect();meter.disconnect();this.source=null;this.endPlayback=null;
 }
 async playMedia(bytes,epoch){
  const player=this.player,URL=this.host.URL||globalThis.URL;
  this.playbackURL=URL.createObjectURL(new Blob([bytes],{type:'audio/wav'}));player.src=this.playbackURL;player.muted=false;player.volume=1;player.playbackRate=this.rate;player.preservesPitch=true;
  try{await new Promise((resolve,reject)=>{
   let lastTime=0,lastProgress=Date.now();
   const fail=()=>reject(Error('Tap Resume conversation to allow audio playback.'));
   this.endPlayback=resolve;player.onended=resolve;player.onerror=fail;
   player.onplaying=()=>{if(!this.valid(epoch)){resolve();return;}lastProgress=Date.now();this.state('speaking');};
   this.playbackWatch=setInterval(()=>{if(!this.valid(epoch)){resolve();return;}if(player.currentTime>lastTime){lastTime=player.currentTime;lastProgress=Date.now();}if(Date.now()-lastProgress>5000)fail();},250);
   const playback=player.play();playback?.catch(fail);
  });}finally{clearInterval(this.playbackWatch);player.onended=null;player.onerror=null;player.onplaying=null;player.pause();player.removeAttribute('src');player.load();URL.revokeObjectURL(this.playbackURL);this.playbackURL=null;this.endPlayback=null;this.onLevel?.(0);}
 }
 async fallbackVoice(epoch){
  if(!this.valid(epoch))return;this.deviceVoice=true;this.onVoiceFallback?.();return this.speakDevice(epoch);
 }
 async speakDevice(epoch){
  let text=this.currentText,locale=this.currentLocale||this.locale;
  if(!text){const r=await this.fetchImpl(this.currentURL+'?format=text',{credentials:'same-origin',signal:(this.abort=new AbortController()).signal});if(!r.ok)throw Error('The voice response could not be played. Please retry.');({text,locale}=await r.json());}
  if(!this.valid(epoch))return;
  const synth=this.host.speechSynthesis,U=this.host.SpeechSynthesisUtterance;if(!synth||!U)throw Error('Device voice is unavailable. Choose natural voice or type your reply.');
  if(!synth.getVoices().length)await new Promise(resolve=>{const done=()=>{clearTimeout(timer);synth.removeEventListener?.('voiceschanged',done);this.cancelVoices=null;resolve()};const timer=setTimeout(done,1500);this.cancelVoices=done;synth.addEventListener?.('voiceschanged',done)});
  if(!this.valid(epoch))return;
  const u=new U(text);this.utterance=u;u.lang=locale||this.locale;u.rate=Math.min(.9,this.rate);u.volume=1;
  const voices=synth.getVoices(),lang=u.lang.replace('_','-').toLowerCase(),base=lang.split('-')[0];
  const voice=voices.find(v=>v.lang.replace('_','-').toLowerCase()===lang)||voices.find(v=>v.lang.replace('_','-').toLowerCase().split('-')[0]===base);if(voice)u.voice=voice;
  try{await new Promise((resolve,reject)=>{
   let started=false;
   const error=()=>reject(Error('Tap Resume conversation to allow audio playback.'));
   const begin=()=>{if(!this.valid(epoch))return;if(!started){started=true;clearTimeout(this.deviceStartTimer);this.state('speaking');}};
   this.endPlayback=resolve;u.onstart=begin;u.onend=resolve;u.onerror=error;
   u.onboundary=()=>{begin();this.onLevel?.(.5);clearTimeout(this.boundary);this.boundary=setTimeout(()=>this.onLevel?.(0),160)};
   this.deviceStartTimer=setTimeout(error,this.deviceStartTimeout||5000);
   this.deviceEndTimer=setTimeout(error,Math.min(90000,Math.max(15000,text.length*150)));
   // A paused engine or an old queued utterance must not silently swallow a turn.
   synth.cancel();synth.resume();synth.speak(u);
  });}finally{clearTimeout(this.deviceStartTimer);clearTimeout(this.deviceEndTimer);clearTimeout(this.boundary);u.onstart=null;u.onend=null;u.onerror=null;u.onboundary=null;if(this.utterance===u){synth.cancel();this.utterance=null;}this.endPlayback=null;this.onLevel?.(0);}
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
  this.active=false;this.epoch++;this.abort?.abort();this.cancelVoices?.();clearTimeout(this.deviceStartTimer);clearTimeout(this.deviceEndTimer);clearInterval(this.playbackWatch);if(this.player){this.player.pause();this.player.removeAttribute('src');this.player.load();}this.player=null;clearTimeout(this.delay);this.cancelDelay?.();this.cancelDelay=null;clearTimeout(this.boundary);clearInterval(this.listenTimer);this.cancelListen?.();this.cancelListen=null;
  if(this.recorder?.state==='recording')try{this.recorder.stop()}catch{}this.recorder=null;
  try{this.source?.stop()}catch{}this.endPlayback?.();this.endPlayback=null;if(this.utterance)this.host.speechSynthesis?.cancel();this.utterance=null;
  this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;this.mic?.disconnect();this.stopMeter();this.context?.close().catch(()=>{});this.context=null;
 }
}
