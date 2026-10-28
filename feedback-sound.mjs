// An original, bright major-key pop, synthesised locally without an audio download.
let context;
export function feedbackSoundEnabled(){
 try{return localStorage.getItem('continuumFeedbackSound')!=='off';}catch{return true;}
}
export function saveFeedbackSound(enabled){
 try{localStorage.setItem('continuumFeedbackSound',enabled?'on':'off');}catch{}
}
export async function playCorrectSound(){
 try{
  const AudioContext=globalThis.AudioContext||globalThis.webkitAudioContext;
  if(!AudioContext)return;
  if(!context||context.state==='closed')context=new AudioContext();
  // Called directly from Check answer / Enter so mobile browsers can unlock audio.
  if(context.state!=='running')await context.resume();
  if(context.state!=='running')return;
  const start=context.currentTime;
  // A quick C–E–G pickup lands on the octave. Rounded plucks keep repeated
  // correct answers cheerful, with a little sparkle instead of a loud beep.
  for(const [frequency,delay,accent,decay] of [
   [523.25,0,0.065,0.16],
   [659.25,0.065,0.06,0.16],
   [783.99,0.13,0.065,0.17],
   [1046.5,0.215,0.085,0.24]
  ]){
   const at=start+delay;
   for(const [type,octave,volume,release] of [
    ['triangle',1,accent,decay],
    ['sine',2,accent*0.16,decay*0.55]
   ]){
    const tone=context.createOscillator(),gain=context.createGain();
    tone.type=type;
    tone.frequency.setValueAtTime(frequency*octave*0.97,at);
    tone.frequency.exponentialRampToValueAtTime(frequency*octave,at+0.018);
    gain.gain.setValueAtTime(0,at);
    gain.gain.linearRampToValueAtTime(volume,at+0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001,at+release);
    gain.gain.linearRampToValueAtTime(0,at+release+0.012);
    tone.connect(gain);gain.connect(context.destination);
    tone.onended=()=>{tone.disconnect();gain.disconnect();};
    tone.start(at);tone.stop(at+release+0.015);
   }
  }
 }catch{/* Sound must never block checking an answer. */}
}
