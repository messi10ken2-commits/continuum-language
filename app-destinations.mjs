// Shared, credential-free navigation contract. Destinations never grant access.
const sections=new Set(['learn','practice','classes','account','support']);
const languages=new Set(['en','es','pt','ja','zh','ko','fr','de','ar','it']);
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export function appDestination(value){
 if(!value||typeof value!=='object'||Array.isArray(value)||!sections.has(value.section))return null;
 if(Object.keys(value).some(k=>!['section','language','lessonId','threadId','bookingId'].includes(k)))return null;
 const d={section:value.section};
 if(value.language!==undefined){if(!languages.has(value.language))return null;d.language=value.language;}
 if(value.lessonId!==undefined){if(d.section!=='learn'||typeof value.lessonId!=='string'||! /^[a-z0-9][a-z0-9-]{0,119}$/.test(value.lessonId))return null;d.lessonId=value.lessonId;}
 for(const key of ['threadId','bookingId'])if(value[key]!==undefined){if(d.section!=='classes'||!uuid.test(value[key]))return null;d[key]=value[key].toLowerCase();}
 return d;
}
export function destinationFromURL(value,{origin,development=false}={}){
 try{
  if(typeof value!=='string'||value.length>1500||/%(?:2f|5c|2e)|\\|\/\.\.?\//i.test(value))return null;
  const url=new URL(value);if(url.username||url.password||url.hash)return null;
  let section;
  if(development&&url.protocol==='continuum-dev:'&&url.hostname==='open'&&(!url.pathname||url.pathname==='/'))section=url.searchParams.get('section');
  else{const host=new URL(origin);if(host.protocol!=='https:'||host.origin!==url.origin||host.pathname!=='/'||host.search||host.hash)return null;section=/^\/app\/(learn|practice|classes|account|support)$/.exec(url.pathname)?.[1];}
  const allowed=new Set(['language','lessonId','threadId','bookingId',...(url.protocol==='continuum-dev:'?['section']:[])]);
  if([...url.searchParams.keys()].some(k=>!allowed.has(k)||url.searchParams.getAll(k).length!==1))return null;
  return appDestination({section,...Object.fromEntries([...url.searchParams].filter(([k])=>k!=='section'))});
 }catch{return null;}
}
export function destinationURL(value,origin){const d=appDestination(value);if(!d)throw Error('Invalid app destination');const u=new URL('/app/'+d.section,origin);if(u.protocol!=='https:')throw Error('App links require HTTPS');for(const [k,v]of Object.entries(d))if(k!=='section')u.searchParams.set(k,v);return u.href;}
let pending=null;
export function queueAppDestination(value){const d=appDestination(value);if(!d)return false;pending=d;if(typeof window!=='undefined')window.dispatchEvent(new Event('continuum-destination-pending'));return true;}
export function pendingAppDestination(){return pending;}
export function consumeAppDestination(){const result=pending;pending=null;return result;}
export function clearAppDestination(){pending=null;}
