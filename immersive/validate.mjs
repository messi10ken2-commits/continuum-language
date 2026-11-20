import {immersiveTopics,immersiveStages} from './topics.mjs';
const scriptChecks={ja:/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,zh:/\p{Script=Han}/u,ko:/\p{Script=Hangul}/u,ar:/\p{Script=Arabic}/u};
// Structural/density guards, not a substitute for contextual linguistic review.
export function validateImmersiveUnits(language,units,{english}={}){
 const errors=[],add=(path,message)=>errors.push(`${language}/${path}: ${message}`);
 if(!units||typeof units!=='object')return [`${language}: missing units`];
 const expected=new Set(immersiveTopics.map(t=>t.key));
 for(const key of Object.keys(units))if(!expected.has(key))add(key,'unexpected chapter');
 for(const {key,level} of immersiveTopics){
  const u=units[key];if(!u){add(key,'missing chapter');continue}
  for(const field of ['title','goal','opening'])if(typeof u[field]!=='string'||!u[field].trim())add(key,`missing ${field}`);
  for(const stage of ['reading','listening']){
   const parts=u[stage];
   if(!Array.isArray(parts)||parts.length!==6){add(key,stage+' must have six source parts');continue}
   const joined=parts.map(p=>p.text).join(' '),minimum=scriptChecks[language]?({B1:600,B2:700,C1:800}[level]):({B1:1500,B2:1700,C1:2000}[level]);
   // Narrated sources are deliberately shorter than articles.
   if(joined.length<minimum*(stage==='listening'?.65:1))add(key,stage+' is below the source-density guard');
   if(new Set(parts.map(p=>p.text)).size!==6)add(key,stage+' repeats a source part');
   for(const [i,p]of parts.entries()){
    if(typeof p.text!=='string'||!p.text.trim()||p.text.length>1800)add(key,`${stage}/${i} invalid recording length`);
    if(typeof p.point!=='string'||!p.point.trim())add(key,`${stage}/${i} lacks an evidence summary`);
    if(scriptChecks[language]&&!scriptChecks[language].test(p.text))add(key,`${stage}/${i} lacks target-language script`);
    if(language!=='en'&&english?.[key]?.[stage]?.[i]?.text===p.text)add(key,`${stage}/${i} is an English fallback`);
   }
  }
  if(Object.keys(u.questions||{}).some(s=>!immersiveStages.includes(s)))add(key,'unexpected exercise stage');
  for(const stage of immersiveStages){
   const qs=u.questions?.[stage];
   if(!Array.isArray(qs)||qs.length!==6){add(key,stage+' must have six questions');continue}
   if(new Set(qs.map(q=>q.prompt)).size!==6)add(key,stage+' repeats a question prompt');
   for(const [i,q]of qs.entries()){
    const label=`${stage}/q${i+1}`;
    if(!q.prompt?.trim()||!q.note?.trim())add(key,label+' lacks prompt or explanation');
    if(q.options?.length!==3||new Set(q.options).size!==3||q.options.some(v=>typeof v!=='string'||!v.trim()))add(key,label+' requires three distinct answers');
    if(!Number.isInteger(q.answer)||q.answer<0||q.answer>2)add(key,label+' has an invalid answer index');
    const source=q.immersiveSource;
    if(!source||!['reading','listening','roleplay'].includes(source.stage)||!Number.isInteger(source.part)||source.part<0||source.part>5)add(key,label+' has an invalid source window');
    if(stage==='roleplay'){
     if(!q.sceneLine?.trim()||q.sceneLine.length>1800)add(key,label+' lacks a playable scene line');
     if(scriptChecks[language]&&!scriptChecks[language].test(q.sceneLine))add(key,label+' scene is not in the target script');
     if(language!=='en'&&english?.[key]?.questions?.roleplay?.[i]?.sceneLine===q.sceneLine)add(key,label+' has an English scene fallback');
    }
   }
   if(new Set(qs.map(q=>q.answer)).size<3)add(key,stage+' does not vary correct-answer positions');
  }
  const earlier=new Set([...(u.questions?.reading||[]),...(u.questions?.listening||[])].map(q=>q.prompt));
  if(u.questions?.checkpoint?.some(q=>earlier.has(q.prompt)))add(key,'checkpoint repeats an earlier question verbatim');
 }
 return errors;
}
