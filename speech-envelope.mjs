// Read decoded PCM without routing or changing the audible media element.
// These are amplitude envelopes, not phoneme/viseme alignment.
export function speechEnvelope(buffer,step=.05){
 if(!buffer?.getChannelData||!buffer.sampleRate||!buffer.length)return null;
 const channels=Array.from({length:Math.min(2,buffer.numberOfChannels||1)},(_,i)=>buffer.getChannelData(i));
 const stride=Math.max(1,Math.floor(buffer.sampleRate/12000)),hop=Math.max(1,Math.round(buffer.sampleRate*step));
 const levels=new Float32Array(Math.ceil(buffer.length/hop));let peak=0;
 for(let frame=0;frame<levels.length;frame++){
  let energy=0,count=0;const end=Math.min(buffer.length,(frame+1)*hop);
  for(let i=frame*hop;i<end;i+=stride)for(const channel of channels){energy+=channel[i]*channel[i];count++}
  const rms=Math.sqrt(energy/Math.max(1,count));levels[frame]=rms;peak=Math.max(peak,rms);
 }
 const reference=Math.max(.025,peak*.75);
 for(let i=0;i<levels.length;i++)levels[i]=levels[i]<.003?0:Math.min(1,levels[i]/reference);
 return {step,duration:buffer.length/buffer.sampleRate,levels};
}
export function speechLevelAt(envelope,time){
 if(!envelope||!Number.isFinite(time)||time<0||time>=envelope.duration)return 0;
 return envelope.levels[Math.floor(time/envelope.step)]||0;
}
export async function decodeSpeechEnvelope(blob,host=globalThis){
 const Offline=host.OfflineAudioContext||host.webkitOfflineAudioContext;
 if(!Offline)return null;
 try{return speechEnvelope(await new Offline(1,1,44100).decodeAudioData(await blob.arrayBuffer()))}catch{return null}
}
