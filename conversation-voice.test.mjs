import test from 'node:test';
import assert from 'node:assert/strict';
import {newVoiceWindow,detectVoiceEnd,ConversationVoiceLoop} from './conversation-voice.mjs';
function speech(w,start=500){for(let now=start;now<start+500;now+=50)assert.equal(detectVoiceEnd(w,.06,now),'listen');}
test('speech ends only after sustained voice and the selected thinking pause',()=>{
 const w=newVoiceWindow(0);speech(w);
 assert.equal(detectVoiceEnd(w,0,2000,{silenceMs:2200}),'listen');
 assert.equal(detectVoiceEnd(w,0,3200,{silenceMs:2200}),'send');
 const fast=newVoiceWindow(0);speech(fast);assert.equal(detectVoiceEnd(fast,0,2300,{silenceMs:1300}),'send');
});
test('silence and isolated clicks never send a learner turn; idle and long speech are bounded',()=>{
 const w=newVoiceWindow(0);for(let now=0;now<19500;now+=50){const click=now%1000===0;assert.equal(detectVoiceEnd(w,click?.03:0,now),'listen');}assert.equal(detectVoiceEnd(w,0,20000),'idle');
 const continuous=newVoiceWindow(0);speech(continuous,0);assert.equal(detectVoiceEnd(continuous,.04,45000),'send');
});
test('playback completes before microphone capture and upload; one captured clip is sent once',async()=>{
 const order=[];const host={AudioContext:class{constructor(){this.state='running'}resume(){return Promise.resolve()}close(){order.push('close');return Promise.resolve()}createMediaStreamSource(){return {connect(){},disconnect(){}}}createAnalyser(){return {fftSize:10}}},MediaRecorder:class{},navigator:{mediaDevices:{getUserMedia:async()=>({getAudioTracks:()=>[{enabled:true}],getTracks:()=>[{stop(){order.push('release-mic')}}]})}}};
 let turns=0;const loop=new ConversationVoiceLoop({host,onState:s=>order.push(s),onTurn:async clip=>{turns++;assert.equal(clip.audio,'actual clip');return '/api/speaking/id/audio/2'},canContinue:()=>turns<1});
 loop.speak=async()=>{order.push('playback-complete')};loop.listen=async()=>{order.push('capture-complete');return {audio:'actual clip',seconds:2}};
 await loop.start('/api/speaking/id/audio/0');for(let i=0;i<30&&loop.active;i++)await new Promise(r=>setTimeout(r,20));
 assert.equal(turns,1);assert.ok(order.indexOf('playback-complete')<order.indexOf('capture-complete'));assert.ok(order.indexOf('capture-complete')<order.indexOf('thinking'));assert.ok(order.includes('release-mic'));assert.equal(order.at(-1),'ready');
});
test('AI failure pauses and keeps the unsent audio for an explicit retry without recording again',async()=>{
 const loop=new ConversationVoiceLoop({onError:()=>{},onState:()=>{}});loop.active=true;loop.epoch=1;loop.stream={getAudioTracks:()=>[{enabled:true}],getTracks:()=>[]};const clip={audio:'keep-this',seconds:2};loop.retryClip=clip;loop.onTurn=async()=>{throw Error('synthetic provider failure')};
 await loop.loop(1);assert.equal(loop.active,false);assert.equal(loop.retryClip,clip);
});
test('cancelled microphone permission request releases late tracks and never records',async()=>{
 let permit,stopped=0;const host={AudioContext:class{resume(){return Promise.resolve()}close(){return Promise.resolve()}},MediaRecorder:class{},navigator:{mediaDevices:{getUserMedia:()=>new Promise(r=>permit=r)}}};
 const loop=new ConversationVoiceLoop({host});const start=loop.start('/audio');await new Promise(r=>setTimeout(r,0));loop.stop();permit({getTracks:()=>[{stop(){stopped++}}]});await start;assert.equal(stopped,1);assert.equal(loop.active,false);
});
test('provider quota failure switches visibly to device playback without losing a conversation turn',async()=>{
 let notices=0,device=0;const loop=new ConversationVoiceLoop({onVoiceFallback:()=>notices++,fetchImpl:async()=>new Response('{}',{status:503})});loop.active=true;loop.epoch=1;loop.speakDevice=async epoch=>{assert.equal(epoch,1);device++};
 await loop.speak('/saved-conversation/audio/2',1);assert.equal(notices,1);assert.equal(device,1);assert.equal(loop.deviceVoice,true);
 loop.active=false;await loop.speak('/saved-conversation/audio/2',1);assert.equal(notices,1);
});
test('natural output uses its own media element and marks speaking only after playing',async()=>{
 const states=[],released=[];let player;
 const loop=new ConversationVoiceLoop({host:{URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:x=>released.push(x)}},onState:s=>states.push(s)});loop.active=true;loop.epoch=1;
 loop.player=player={currentTime:0,play(){assert.deepEqual(states,[]);queueMicrotask(()=>{this.onplaying();assert.deepEqual(states,['speaking']);this.currentTime=1;this.onended()});return Promise.resolve()},pause(){},removeAttribute(){},load(){}};
 await loop.playMedia(new Uint8Array([1,2]),1);assert.equal(player.muted,false);assert.equal(player.volume,1);assert.equal(player.playbackRate,1);assert.deepEqual(released,['blob:test']);assert.equal(loop.endPlayback,null);
});
test('blocked natural autoplay pauses with an error instead of pretending to speak',async()=>{
 const states=[];const loop=new ConversationVoiceLoop({host:{URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}}},onState:s=>states.push(s)});loop.active=true;loop.epoch=1;loop.player={play:()=>Promise.reject(Error('NotAllowedError')),pause(){},removeAttribute(){},load(){}};
 await assert.rejects(loop.playMedia(new Uint8Array([1]),1),/Resume conversation/);assert.deepEqual(states,[]);
});
test('decoding cannot detach the bytes subsequently used for media playback',async()=>{
 const wav=new ArrayBuffer(120);const loop=new ConversationVoiceLoop({fetchImpl:async()=>({ok:true,headers:new Headers({'Content-Type':'audio/wav'}),arrayBuffer:async()=>wav})});loop.active=true;loop.epoch=1;loop.player={};loop.context={decodeAudioData:async bytes=>{structuredClone(bytes,{transfer:[bytes]});return {duration:1}}};let played=0;loop.playMedia=async bytes=>{assert.equal(bytes.byteLength,120);played++};await loop.speak('/audio',1);assert.equal(played,1);
});
test('manual device voice resumes paused synthesis and reads the current reply without a network roundtrip',async()=>{
 const states=[],order=[];let actual;const synth={getVoices:()=>[{lang:'en-GB',name:'English'}],cancel:()=>order.push('cancel'),resume:()=>order.push('resume'),speak:u=>{actual=u;assert.deepEqual(states,[]);queueMicrotask(()=>{u.onstart();u.onend()})}};
 const loop=new ConversationVoiceLoop({deviceVoice:true,host:{speechSynthesis:synth,SpeechSynthesisUtterance:class{constructor(text){this.text=text}}},onState:s=>states.push(s),fetchImpl:()=>assert.fail('Do not fetch a reply already saved in the UI')});loop.active=true;loop.epoch=1;loop.currentText='The current assistant reply.';loop.currentLocale='en-US';
 await loop.speak('/audio',1);assert.equal(actual.text,loop.currentText);assert.equal(actual.voice.lang,'en-GB');assert.equal(actual.rate,.9);assert.equal(actual.volume,1);assert.deepEqual(states,['speaking']);assert.deepEqual(order.slice(0,2),['cancel','resume']);
});
test('device voice waits for asynchronously loaded voices and cancellation prevents late speech',async()=>{
 let voices=[],changed,spoken=0;const synth={getVoices:()=>voices,addEventListener:(name,fn)=>changed=fn,removeEventListener(){},cancel(){},resume(){},speak:u=>{spoken++;queueMicrotask(()=>{u.onstart();u.onend()})}};const host={speechSynthesis:synth,SpeechSynthesisUtterance:class{constructor(text){this.text=text}}};
 const loop=new ConversationVoiceLoop({host});loop.active=true;loop.epoch=1;loop.currentText='Olá.';loop.currentLocale='pt-BR';const ready=loop.speakDevice(1);voices=[{lang:'pt-BR'}];changed();await ready;assert.equal(spoken,1);
 voices=[];loop.active=true;loop.epoch=2;const pending=loop.speakDevice(2);loop.stop();voices=[{lang:'pt-BR'}];await pending;assert.equal(spoken,1);
});
test('silent device synthesis cannot remain in a false speaking state',async()=>{
 const states=[];const loop=new ConversationVoiceLoop({host:{speechSynthesis:{getVoices:()=>[{lang:'en-US'}],cancel(){},resume(){},speak(){}},SpeechSynthesisUtterance:class{}},onState:s=>states.push(s)});loop.active=true;loop.epoch=1;loop.currentText='Hello.';loop.deviceStartTimeout=10;
 await assert.rejects(loop.speakDevice(1),/Resume conversation/);assert.deepEqual(states,[]);
});
test('device speech is unlocked synchronously before microphone permission awaits',async()=>{
 const order=[];let permit;const host={speechSynthesis:{cancel(){},resume(){order.push('resume')},speak:u=>{assert.equal(u.volume,0);assert.ok(u.text.trim());order.push('prime')}},SpeechSynthesisUtterance:class{constructor(text){this.text=text}},AudioContext:class{resume(){order.push('context');return Promise.resolve()}close(){return Promise.resolve()}},MediaRecorder:class{},navigator:{mediaDevices:{getUserMedia:()=>{order.push('permission');return new Promise(r=>permit=r)}}}};
 const loop=new ConversationVoiceLoop({host,deviceVoice:true});const start=loop.start('/audio',{text:'Hello.',locale:'en-US'});assert.deepEqual(order.slice(0,3),['resume','prime','context']);await new Promise(r=>setTimeout(r,0));assert.ok(order.indexOf('prime')<order.indexOf('permission'));loop.stop();permit({getTracks:()=>[]});await start;
});
test('long replies finish every device utterance in all four languages before completing',async()=>{
 for(const [locale,sentence]of [['en-US','Hello! Let us talk about your next trip. '],['es-ES','¡Hola! ¿Dónde quieres viajar este año? '],['pt-BR','Olá! Vamos conversar sobre a sua viagem. '],['ja-JP','こんにちは。次の旅行について話しましょう。']]){
  const spoken=[],text=sentence.repeat(20),synth={getVoices:()=>[{lang:locale}],cancel(){},resume(){},speak(u){spoken.push(u.text);queueMicrotask(()=>{u.onstart();u.onend()})}};
  const loop=new ConversationVoiceLoop({host:{speechSynthesis:synth,SpeechSynthesisUtterance:class{constructor(text){this.text=text}}}});loop.active=true;loop.epoch=1;loop.currentText=text;loop.currentLocale=locale;
  await loop.speakDevice(1);assert.equal(spoken.join(''),text);assert.ok(spoken.length>1);assert.equal(loop.endPlayback,null);
 }
});
test('intentional interruption cancels queued device chunks without duplicate playback',async()=>{
 let spoken=0;const host={speechSynthesis:{getVoices:()=>[{lang:'en-US'}],cancel(){},resume(){},speak(u){spoken++;queueMicrotask(()=>{u.onstart();loop.stop()})}},SpeechSynthesisUtterance:class{constructor(text){this.text=text}}};
 const loop=new ConversationVoiceLoop({host});loop.active=true;loop.epoch=1;loop.currentText='A long response. '.repeat(50);await loop.speakDevice(1);assert.equal(spoken,1);assert.equal(loop.active,false);
});
test('premature media ending is an explicit retry error, never a completed turn',async()=>{
 const loop=new ConversationVoiceLoop({host:{URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}}}});loop.active=true;loop.epoch=1;
 loop.player={currentTime:1,play(){queueMicrotask(()=>this.onended());return Promise.resolve()},pause(){},removeAttribute(){},load(){}};
 await assert.rejects(loop.playMedia(new Uint8Array([1]),1,20),/before the response finished/);
});
