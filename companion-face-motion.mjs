export function makeEnvelope(channels,sampleRate,step=.025){
 if(!channels?.length||!sampleRate||!channels[0]?.length)return null;
 const hop=Math.max(1,Math.round(step*sampleRate)),n=channels[0].length,levels=[];let peak=0;
 for(let start=0;start<n;start+=hop){let sum=0,count=0;for(let i=start;i<Math.min(n,start+hop);i+=Math.max(1,Math.floor(sampleRate/12000)))for(const c of channels){sum+=(c[i]||0)**2;count++}const rms=Math.sqrt(sum/Math.max(1,count));levels.push(rms);peak=Math.max(peak,rms)}
 const ref=Math.max(.035,peak*.75);return {step,duration:n/sampleRate,levels:levels.map(x=>x<.003?0:Math.min(1,x/ref))};
}
export function envelopeLevel(envelope,time,audible){
 if(!audible||!envelope||!Number.isFinite(time)||time<0||time>=envelope.duration)return 0;
 return envelope.levels[Math.floor(time/envelope.step)]||0;
}
const clamp=x=>Math.max(0,Math.min(1,x));
export class FaceMotion{
 constructor(seed=73){this.time=0;this.randomSeed=seed;this.weights={listening:1,thinking:0,speaking:0};this.mouth=0;this.nextBlink=2.35;this.blinkStart=-10;this.last=null;}
 random(){this.randomSeed=(Math.imul(this.randomSeed,1664525)+1013904223)>>>0;return this.randomSeed/4294967296}
 update({dt,state='listening',level=0,audible=false,reduced=false,paused=false}){
  dt=Math.max(0,Math.min(.1,Number.isFinite(dt)?dt:0));
  if(paused&&this.last)return {...this.last,mouth:0,tongue:0,jaw:0};
  this.time+=dt;const blend=1-Math.exp(-dt/.24);
  for(const k of Object.keys(this.weights))this.weights[k]+=(Number(k===state)-this.weights[k])*blend;
  const target=audible?clamp(Number.isFinite(level)?level:0):0;
  this.mouth=target===0?0:this.mouth+(target-this.mouth)*(1-Math.exp(-dt/(target>this.mouth?.045:.065)));
  if(this.time>=this.nextBlink){this.blinkStart=this.time;this.nextBlink=this.time+2.7+this.random()*3.2}
  const age=this.time-this.blinkStart,blink=age>=0&&age<.22?Math.sin(Math.PI*age/.22)**2:0;
  const {thinking:t,speaking:s,listening:l}=this.weights,x=this.time;
  this.last={
   head:reduced?[0,0,0]:[.012*Math.sin(x*1.31)+.007*Math.sin(x*2.17)-t*.055+s*this.mouth*.022,.009*Math.sin(x*.67)+t*.07,t*.06+.008*Math.sin(x*.91)],
   neck:reduced?[0,0,0]:[.004*Math.sin(x*1.24),0,.005*Math.sin(x*.59)],
   eyes:reduced?[0,0,0]:[-t*.11,t*.12,0],
   blink:reduced?0:blink,mouth:reduced?0:this.mouth,tongue:reduced?0:clamp((this.mouth-.10)*3),jaw:reduced?0:this.mouth*.22,
   weights:{...this.weights}
  };return this.last;
 }
}
