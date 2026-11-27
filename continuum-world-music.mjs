// Original quiet electric-piano score for Continuum World. No stock recording,
// streamed service, lyrics or third-party music licence is required.
export const WORLD_MUSIC_BPM=72;
export const WORLD_MUSIC_BEATS=64;
const chords=[
 [48,55,59,64],[45,52,55,60],[41,48,52,57],[50,53,57,60],
 [40,47,50,55],[45,52,55,59],[50,57,60,64],[43,53,57,64],
];
const melody=[
 [64,67,71,69],[72,71,67,64],[69,67,64,60],[65,64,62,57],
 [67,71,74,71],[72,71,69,64],[69,72,76,74],[71,69,67,62],
];
export const worldMusicScore=chords.flatMap((voicing,bar)=>[
 ...voicing.map((midi,i)=>({beat:bar*8+i*.035,midi,duration:6.8,velocity:.095})),
 ...melody[bar].map((midi,i)=>({beat:bar*8+[1.5,3.5,5,6.5][i],midi,duration:1.7,velocity:i===0?.13:.105})),
]).sort((a,b)=>a.beat-b.beat);
export const musicFrequency=midi=>440*2**((midi-69)/12);
export function startWorldMusic(context,destination,{setInterval:repeat=globalThis.setInterval,clearInterval:cancel=globalThis.clearInterval}={}) {
 const beat=60/WORLD_MUSIC_BPM,cycle=WORLD_MUSIC_BEATS*beat,voices=new Set();
 const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=1700;filter.Q.value=.45;filter.connect(destination);
 const real=new Float32Array(6),imag=new Float32Array([0,1,.20,.065,.018,.006]);
 const wave=context.createPeriodicWave(real,imag,{disableNormalization:false});
 let index=0,origin=context.currentTime+.06,timer=null,closed=false;
 function note(event,time){
  const oscillator=context.createOscillator(),envelope=context.createGain(),duration=event.duration*beat;
  oscillator.setPeriodicWave(wave);oscillator.frequency.value=musicFrequency(event.midi);
  envelope.gain.setValueAtTime(0,time);envelope.gain.linearRampToValueAtTime(event.velocity,time+.035);
  envelope.gain.exponentialRampToValueAtTime(.0001,time+duration);
  oscillator.connect(envelope);envelope.connect(filter);
  const voice={oscillator,envelope};voices.add(voice);
  oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();voices.delete(voice);};
  oscillator.start(time);oscillator.stop(time+duration+.04);
 }
 function schedule(){
  if(closed)return;
  // Skip elapsed events after a tab suspension; never replay a queue in a burst.
  while(origin+worldMusicScore[index].beat*beat<context.currentTime-.03){if(++index===worldMusicScore.length){index=0;origin+=cycle;}}
  while(origin+worldMusicScore[index].beat*beat<context.currentTime+.25){
   note(worldMusicScore[index],Math.max(context.currentTime+.01,origin+worldMusicScore[index].beat*beat));
   if(++index===worldMusicScore.length){index=0;origin+=cycle;}
  }
 }
 return {
  setActive(active){if(closed)return;if(active&&timer===null){schedule();timer=repeat(schedule,100);}else if(!active&&timer!==null){cancel(timer);timer=null;}},
  dispose(){if(closed)return;closed=true;if(timer!==null)cancel(timer);for(const voice of voices){voice.oscillator.onended=null;try{voice.oscillator.stop();}catch{}voice.oscillator.disconnect();voice.envelope.disconnect();}voices.clear();filter.disconnect();},
 };
}
