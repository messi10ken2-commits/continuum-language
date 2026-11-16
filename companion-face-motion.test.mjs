import test from 'node:test';import assert from 'node:assert/strict';import {makeEnvelope,envelopeLevel,FaceMotion} from './companion-face-motion.mjs';
test('real PCM envelope preserves silent pauses, clamps output, and follows playback time',()=>{
 const pcm=Float32Array.from({length:300},(_,i)=>i<100||i>=200?0:.2*Math.sin(i));const env=makeEnvelope([pcm],1000);
 assert.equal(envelopeLevel(env,.05,true),0);assert.ok(envelopeLevel(env,.15,true)>0);assert.equal(envelopeLevel(env,.25,true),0);
 for(const t of [-1,1,NaN,Infinity])assert.equal(envelopeLevel(env,t,true),0);
 assert.equal(envelopeLevel(env,.15,false),0);assert.ok(env.levels.every(x=>x>=0&&x<=1));
});
test('pause, buffering and completion cannot leave a moving mouth or invent speech motion',()=>{
 const m=new FaceMotion();for(let i=0;i<30;i++)m.update({dt:1/60,state:'speaking',level:.8,audible:true});
 assert.ok(m.last.mouth>.7);for(const state of ['speaking','thinking','listening']){const p=m.update({dt:1/60,state,level:1,audible:false});assert.equal(p.mouth,0);assert.equal(p.jaw,0)}
 assert.equal(m.update({dt:1/60,level:1,audible:true,paused:true}).mouth,0);
});
test('state transitions blend without overshoot and reduced motion closes mouth and freezes pose',()=>{
 const m=new FaceMotion();let prev=[0,0,0];
 for(const state of ['thinking','speaking','listening'])for(let i=0;i<100;i++){
  const p=m.update({dt:1/60,state,level:.5,audible:state==='speaking'});assert.ok(p.head.every((v,j)=>Number.isFinite(v)&&Math.abs(v-prev[j])<.04));assert.ok(Object.values(p.weights).every(x=>x>=0&&x<=1));prev=p.head;
 }
 const r=m.update({dt:1/60,state:'speaking',level:1,audible:true,reduced:true});assert.deepEqual(r.head,[0,0,0]);assert.equal(r.mouth,0);assert.equal(r.blink,0);
});
test('idle blink scheduling varies, and invalid input remains bounded',()=>{
 const a=new FaceMotion(),times=[];let previous=a.nextBlink;
 for(let i=0;i<2400;i++){const p=a.update({dt:1/60,state:'listening',level:NaN});if(a.nextBlink!==previous){times.push(a.nextBlink);previous=a.nextBlink}assert.equal(p.mouth,0)}
 assert.ok(times.length>5);assert.ok(new Set(times.slice(1).map((x,i)=>(x-times[i]).toFixed(2))).size>3);
 assert.ok(Number.isFinite(a.update({dt:Infinity,state:'thinking'}).jaw));
});
