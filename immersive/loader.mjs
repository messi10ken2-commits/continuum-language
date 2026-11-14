// Named imports become language-specific chunks in Vite; Node uses the same source.
const loaders={en:()=>import('./en.mjs'),es:()=>import('./es.mjs'),pt:()=>import('./pt.mjs'),ja:()=>import('./ja.mjs'),zh:()=>import('./zh.mjs'),ko:()=>import('./ko.mjs'),fr:()=>import('./fr.mjs'),de:()=>import('./de.mjs'),ar:()=>import('./ar.mjs'),it:()=>import('./it.mjs')};
const pending=new Map();
export function loadImmersiveUnit(language,key){
 if(!Object.hasOwn(loaders,language))return Promise.reject(Error('Unknown learning language'));
 if(!pending.has(language)){
  const request=loaders[language]().then(m=>m.units).catch(error=>{pending.delete(language);throw error});
  pending.set(language,request);
 }
 return pending.get(language).then(units=>{const unit=units[key];if(!unit)throw Error('Unknown immersion chapter');return unit});
}
