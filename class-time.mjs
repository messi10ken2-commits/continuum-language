const validParts=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
export function validTimeZone(zone){try{if(typeof zone!=='string'||zone.length>80||zone==='Etc/Unknown')return false;new Intl.DateTimeFormat('en',{timeZone:zone}).format();return true}catch{return false}}
function wall(ms,zone){const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(ms).map(x=>[x.type,x.value]));return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;}
// An ambiguous DST hour is returned twice; a missing clock hour is never silently
// moved. The caller must choose an explicit UTC instant when there are two.
export function classTimeChoices(local,zone){
 const m=validParts.exec(local||'');if(!m||!validTimeZone(zone))return [];
 const nominal=Date.UTC(...m.slice(1).map(Number).map((n,i)=>i===1?n-1:n));
 if(wall(nominal,'UTC')!==local)return [];
 const offsets=new Set();for(let hours=-36;hours<=36;hours+=6){const sample=nominal+hours*3600000,p=validParts.exec(wall(sample,zone));const displayed=Date.UTC(...p.slice(1).map(Number).map((n,i)=>i===1?n-1:n));offsets.add(displayed-sample);}
 return [...offsets].map(offset=>nominal-offset).filter(ms=>wall(ms,zone)===local).sort((a,b)=>a-b).map(ms=>new Date(ms).toISOString());
}
export const formatClassTime=(at,zone,locale='en')=>new Intl.DateTimeFormat(locale==='zh'?'zh-Hans':locale,{timeZone:validTimeZone(zone)?zone:'UTC',weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',timeZoneName:'shortOffset'}).format(new Date(at));
export const browserTimeZone=()=>{try{const zone=Intl.DateTimeFormat().resolvedOptions().timeZone;return validTimeZone(zone)?zone:'UTC'}catch{return 'UTC'}};
