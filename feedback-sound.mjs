// Original Web Audio cues. Prepare audio during the learner's tap, before any network work.
let context;
let resuming;
export function feedbackSoundEnabled(){
 try{return localStorage.getItem('continuumFeedbackSound')!=='off';}catch{return true;}
}
export function saveFeedbackSound(enabled){
 try{localStorage.setItem('continuumFeedbackSound',enabled?'on':'off');}catch{}
}

export function prepareFeedbackSound({retry=false}={}){
 if(!feedbackSoundEnabled())return;
 try{
  const AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext;
  if(!AudioContext)return;
  if(!context||context.state==='closed'){
   context=new AudioContext();
   resuming=null;
  }
  if(context.state!=='running'&&(!resuming||retry)){
   const resume=context.resume().catch(()=>{}).finally(()=>{if(resuming===resume)resuming=null});
   resuming=resume;
  }
 }catch{/* Sound must never block learning. */}
}

const correctNotes=[
 [523.25,0,.08,.13],[659.25,.065,.075,.15],[783.99,.13,.085,.16],[1046.5,.215,.1,.24]
];
const rewardNotes=[
 [523.25,0,.085,.22],[659.25,.09,.085,.23],[783.99,.18,.09,.24],
 [1046.5,.31,.11,.49],[659.25,.31,.045,.44],[783.99,.31,.05,.44],[1318.51,.43,.065,.38]
];

async function play(notes){
 if(!feedbackSoundEnabled())return;
 try{
  prepareFeedbackSound();
  if(resuming)await resuming;
  if(context?.state!=='running'||!feedbackSoundEnabled())return;
  const start=context.currentTime+.018;
  for(const [frequency,delay,volume,release] of notes){
   const at=start+delay,tone=context.createOscillator(),gain=context.createGain();
   tone.type='triangle';
   tone.frequency.setValueAtTime(frequency,at);
   gain.gain.setValueAtTime(0,at);
   gain.gain.linearRampToValueAtTime(volume,at+.008);
   gain.gain.exponentialRampToValueAtTime(.0001,at+release);
   tone.connect(gain);gain.connect(context.destination);
   tone.onended=()=>{tone.disconnect();gain.disconnect()};
   tone.start(at);tone.stop(at+release+.012);
  }
 }catch{/* Sound must never block learning. */}
}

export const playCorrectSound=()=>play(correctNotes);
export const playRewardSound=()=>play(rewardNotes);
