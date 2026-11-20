// Detect empty/near-silent PCM, not pronunciation accuracy. Keep samples intact.
export function pcmHasSpeechSignal(pcm,sampleRate=24000){
 if(!Buffer.isBuffer(pcm)||pcm.length%2||pcm.length<480)return false;
 let audible=0;const frame=Math.round(sampleRate*.02);
 for(let start=0;start<pcm.length/2;start+=frame){let sum=0,squares=0,n=0;
  for(let i=start;i<Math.min(start+frame,pcm.length/2);i++){const s=pcm.readInt16LE(i*2);sum+=s;squares+=s*s;n++;}
  // AC energy also rejects a constant DC offset masquerading as sound.
  if(n&&Math.sqrt(Math.max(0,squares/n-(sum/n)**2))>=32)audible+=n;
 }
 return audible>=sampleRate*.04;
}
export function wavHasSpeechSignal(bytes){
 if(!Buffer.isBuffer(bytes)||bytes.length<44||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WAVE')return false;
 let format=null,data=null;
 for(let p=12;p+8<=bytes.length;){const name=bytes.toString('ascii',p,p+4),size=bytes.readUInt32LE(p+4),start=p+8;if(start+size>bytes.length)return false;
  if(name==='fmt '&&size>=16)format={pcm:bytes.readUInt16LE(start),channels:bytes.readUInt16LE(start+2),rate:bytes.readUInt32LE(start+4),bits:bytes.readUInt16LE(start+14)};
  if(name==='data')data=bytes.subarray(start,start+size);p=start+size+(size%2);
 }
 return !!(format?.pcm===1&&format.channels===1&&format.bits===16&&format.rate>=8000&&format.rate<=96000&&data&&pcmHasSpeechSignal(data,format.rate));
}
