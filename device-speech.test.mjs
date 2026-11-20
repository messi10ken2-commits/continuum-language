import test from 'node:test';import assert from 'node:assert/strict';
import {createDevicePlayback,deviceVoice} from './device-speech.mjs';
function setup(overrides={}){
 let now=0,id=0;const timers=new Map(),spoken=[],events=[],listeners=new Map();
 const clock={setTimer(fn,ms){timers.set(++id,{fn,at:now+ms});return id;},clearTimer(id){timers.delete(id);}};
 const synth={getVoices:()=>[{lang:'pt-BR',name:'Português',localService:true}],cancel(){events.push('cancel')},resume(){events.push('resume')},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:name=>listeners.delete(name),speak:u=>spoken.push(u),...overrides};
 const run=parts=>createDevicePlayback(parts,{synth,Utterance:class{constructor(text){this.text=text}},onStart:()=>events.push('start'),onComplete:()=>events.push('complete'),onError:e=>events.push(e.code),...clock});
 return {synth,run,spoken,events,listeners,timers,tick(ms){const end=now+ms;for(;;){const next=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>end)break;now=next[1].at;timers.delete(next[0]);next[1].fn();}now=end;}};
}
test('device voices preserve the exact pronunciation locale and prefer enhanced voices',()=>{
 assert.equal(deviceVoice([{lang:'pt-PT'}],'pt-BR'),undefined);
 assert.equal(deviceVoice([{lang:'pt_BR',name:'Enhanced Portuguese'},{lang:'pt-BR',localService:true}],'pt-BR').name,'Enhanced Portuguese');
});
test('paused device speech resumes, reads every chunk and clears completion timers',()=>{
 const h=setup({paused:true}),text='A minha avó está lá. '.repeat(30),p=h.run([{text,lang:'pt-BR'}]);p.start();
 let index=0;while(h.spoken[index]){const u=h.spoken[index++];u.onstart();u.onend();h.tick(0);}
 assert.equal(h.spoken.map(u=>u.text).join(''),text);assert.equal(h.events.filter(e=>e==='start').length,1);assert.ok(h.events.includes('resume'));assert.equal(h.events.at(-1),'complete');assert.equal(h.timers.size,0);
});
test('throws, missing voices and engines with no start/end events recover without hanging',()=>{
 for(const kind of ['throw','missing','start-stall','end-stall']){
  const h=setup(kind==='throw'?{speak(){throw Error('device failure')}}:kind==='missing'?{getVoices:()=>[{lang:'pt-PT'}]}:{}),p=h.run([{text:'avô',lang:'pt-BR'}]);p.start();
  if(kind==='end-stall')h.spoken[0].onstart();h.tick(100000);
  assert.ok(h.events.some(e=>['speech-failed','voice-unavailable','speech-stalled'].includes(e)),kind);assert.ok(!h.events.includes('complete'));assert.equal(h.timers.size,0);
 }
});
test('voices can arrive asynchronously; cancelling removes listeners and stale callbacks',()=>{
 let voices=[];const h=setup({getVoices:()=>voices}),p=h.run([{text:'Olá. '.repeat(80),lang:'pt-BR'}]);p.start();assert.equal(h.listeners.size,1);
 voices=[{lang:'pt-BR'}];h.listeners.get('voiceschanged')();assert.equal(h.listeners.size,0);const lateEnd=h.spoken[0].onend;p.stop();lateEnd();h.tick(100000);assert.equal(h.spoken.length,1);assert.equal(h.timers.size,0);assert.ok(!h.events.includes('complete'));
 const waiting=setup({getVoices:()=>[]}),cancel=waiting.run([{text:'avô',lang:'pt-BR'}]);cancel.start();cancel.stop();waiting.tick(10000);assert.equal(waiting.spoken.length,0);assert.equal(waiting.listeners.size,0);
});
