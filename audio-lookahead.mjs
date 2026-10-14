// Request only the next segment of audio the learner has chosen to play.
// Store failures as values so a cancelled/failed prefetch never rejects unhandled.
export function audioLookahead(parts,load,signal){
 const pending=new Map();
 const prepare=index=>{
  if(index>=parts.length||signal.aborted||pending.has(index))return;
  pending.set(index,Promise.resolve().then(()=>{
   signal.throwIfAborted();return load(parts[index],signal);
  }).then(value=>({value}),error=>({error})));
 };
 return async index=>{
  signal.throwIfAborted();prepare(index);
  const result=await pending.get(index);pending.delete(index);
  signal.throwIfAborted();
  if(result.error)throw result.error;
  prepare(index+1);
  return result.value;
 };
}
