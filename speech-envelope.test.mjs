import test from 'node:test';
import assert from 'node:assert/strict';
import {speechEnvelope,speechLevelAt,decodeSpeechEnvelope} from './speech-envelope.mjs';
import {currentConversationCaption} from './conversation-caption.mjs';
import {ConversationVoiceLoop} from './conversation-voice.mjs';
const pcm=()=>({sampleRate:100,length:20,numberOfChannels:1,getChannelData:()=>Float32Array.from([0,0,0,0,0,.1,-.1,.1,-.1,.1,.2,-.2,.2,-.2,.2,0,0,0,0,0])});
test('decoded audio drives a bounded envelope with silent pauses and no invented sound',()=>{
 const envelope=speechEnvelope(pcm());assert.equal(speechLevelAt(envelope,.02),0);assert.ok(speechLevelAt(envelope,.07)>0);assert.ok(speechLevelAt(envelope,.12)>speechLevelAt(envelope,.07));assert.equal(speechLevelAt(envelope,.17),0);
 for(const time of [-1,1,NaN,Infinity])assert.equal(speechLevelAt(envelope,time),0);
 assert.ok([...envelope.levels].every(level=>level>=0&&level<=1));assert.equal(speechEnvelope({duration:3}),null);
 const silent={...pcm(),getChannelData:()=>new Float32Array(20)};assert.ok([...speechEnvelope(silent).levels].every(level=>level===0));
});
test('caption selection preserves the correct audio index and never changes saved messages',()=>{
 const session={id:'a',messages:[{role:'assistant',text:'Earlier'},{role:'user',text:'My turn'},{role:'assistant',text:'Now'}]};const before=JSON.stringify(session);
 assert.equal(currentConversationCaption(session).index,2);assert.equal(currentConversationCaption(session).text,'Now');assert.equal(JSON.stringify(session),before);assert.equal(currentConversationCaption(null),null);
});
test('optional replay analysis fails safely without an offline decoder',async()=>{
 assert.equal(await decodeSpeechEnvelope(new Blob(['audio']),{}),null);
 assert.equal(await decodeSpeechEnvelope(new Blob(['audio']),{OfflineAudioContext:class{decodeAudioData(){throw Error('unsupported')}}}),null);
});
test('natural media mouth level follows audible playback time and closes during buffering and after completion',async()=>{
 const levels=[],loop=new ConversationVoiceLoop({host:{URL:{createObjectURL:()=> 'blob:envelope',revokeObjectURL(){}}},onLevel:value=>levels.push(value)});loop.active=true;loop.epoch=1;
 const player={paused:true,currentTime:0,play(){this.paused=false;queueMicrotask(()=>this.onplaying());return Promise.resolve()},pause(){this.paused=true},removeAttribute(){},load(){}};loop.player=player;
 const playing=loop.playMedia(new Uint8Array([1]),1,0,speechEnvelope(pcm()));
 player.currentTime=.07;await new Promise(r=>setTimeout(r,80));assert.ok(levels.some(value=>value>0));
 player.onwaiting();await new Promise(r=>setTimeout(r,70));assert.equal(levels.at(-1),0);
 player.onplaying();player.currentTime=.12;await new Promise(r=>setTimeout(r,70));assert.ok(levels.at(-1)>0);
 player.onended();await playing;assert.equal(levels.at(-1),0);assert.equal(loop.levelTimer,null);
});
