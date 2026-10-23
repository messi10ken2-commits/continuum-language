// Bounded utterances avoid long-utterance stalls in browser speech engines.
// Keep every character, including Japanese punctuation and surrogate pairs.
export function speechChunks(text,limit=180){
 const chars=Array.from(String(text)),parts=[];
 while(chars.length){
  let end=Math.min(limit,chars.length);
  if(end<chars.length){
   const boundary=chars.slice(0,end).join('').match(/[.!?。！？、,;:；：\s][”’」』）)]?(?=[^.!?。！？]*$)/u);
   if(boundary&&boundary.index>=limit/3)end=Array.from(chars.slice(0,end).join('').slice(0,boundary.index+boundary[0].length)).length;
  }
  parts.push(chars.splice(0,end).join(''));
 }
 return parts;
}
