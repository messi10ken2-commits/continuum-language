import {immersiveTopics} from './topics.mjs';
export function makeImmersiveLoader(loaders,{browser=false,fetchImpl=(...args)=>fetch(...args)}={}){
 const pending=new Map(),failedImports=new Set();
 function loadPack(language,{retry=false}={}){
  if(!Object.hasOwn(loaders,language))return Promise.reject(Error('Unknown learning language'));
  if(pending.has(language))return pending.get(language);
  const fallback=browser&&retry&&failedImports.has(language);
  const task=(async()=>{
   let units;
   if(fallback){
    // Browsers can retain a failed module fetch for this document. Retrying
    // that same import URL is insufficient; use the canonical public JSON.
    const response=await fetchImpl('/api/immersive/content/'+language,{credentials:'omit'});
    if(!response.ok)throw Error('Chapter content is unavailable');
    units=(await response.json()).units;
   }else units=(await loaders[language]()).units;
   if(!units||immersiveTopics.some(({key})=>!units[key]||units[key].reading?.length!==6||units[key].listening?.length!==6||units[key].questions?.roleplay?.length!==6))throw Error('Incomplete chapter content');
   return units;
  })();
  pending.set(language,task);
  void task.catch(()=>{if(pending.get(language)===task)pending.delete(language);if(!fallback)failedImports.add(language)});
  return task;
 }
 async function loadUnit(language,key,options){const units=await loadPack(language,options);if(!Object.hasOwn(units,key))throw Error('Unknown immersion chapter');return units[key]}
 return {loadPack,loadUnit};
}
