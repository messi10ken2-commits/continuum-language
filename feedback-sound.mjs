// An original two-note chime, synthesised locally: no download or voice service.
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
  for(const [frequency,delay] of [[659.25,0],[880,0.11]]){
   const tone=context.createOscillator(),gain=context.createGain(),at=start+delay;
   tone.type='sine';tone.frequency.value=frequency;
   gain.gain.setValueAtTime(0,at);
   gain.gain.linearRampToValueAtTime(0.09,at+0.012);
   gain.gain.exponentialRampToValueAtTime(0.001,at+0.24);
   tone.connect(gain);gain.connect(context.destination);
   tone.onended=()=>{tone.disconnect();gain.disconnect();};
   tone.start(at);tone.stop(at+0.25);
  }
 }catch{/* Sound must never block checking an answer. */}
}
