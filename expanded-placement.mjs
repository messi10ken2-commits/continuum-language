import {languageInfo,courseBands} from './languages.mjs';
import {variedAssessmentItems} from './assessment-variety.mjs';
import {placementPacks} from './curriculum/placement/index.mjs';
export const expandedPlacementLanguages=['zh','ko','fr','de','ar','it'];
export function expandedPlacementItems(language,form){
 if(!expandedPlacementLanguages.includes(language)||!Number.isInteger(form)||form<0||form>3)throw Error('Unknown expanded placement form');
 const locale=languageInfo(language).locale,blueprints=variedAssessmentItems('en',form);
 return courseBands.flatMap(level=>{
  const pack=placementPacks[language]?.[form+'-'+level];
  if(!pack?.passage||!pack.audio||pack.use?.length!==3)throw Error('Incomplete held-out placement pack: '+language+' '+form+' '+level);
  const shared=blueprints.filter(q=>q.level===level),meta={level,locale};
  const reading=shared.filter(q=>q.skill==='Reading').map((q,i)=>({...q,...meta,id:`v4-${language}-${form}-${level}-reading-${i}`,passage:pack.passage,competency:'reading'}));
  const listening=shared.filter(q=>q.skill==='Listening').map((q,i)=>({...q,...meta,id:`v4-${language}-${form}-${level}-listening-${i}`,audio:pack.audio,competency:'listening'}));
  const use=pack.use.map((row,i)=>{
   const [source,...options]=row,[intent,context]=source.includes('::')?source.split('::'):[null,source],competency=['grammar','vocabulary','pragmatics'][i],offset=(form+courseBands.indexOf(level)+i)%4;
   if(!context||options.length!==4||new Set(options).size!==4)throw Error('Invalid placement alternatives: '+language+' '+form+' '+level+' '+competency);
   return {...meta,id:`v4-${language}-${form}-${level}-${competency}`,skill:'Language use',competency,instructionOnly:true,promptLang:'en-US',optionsLang:locale,context,prompt:intent|| (i===2?'Choose the response that best fits the situation.':'Choose the word or phrase that fits the situation.'),options:[...options.slice(offset),...options.slice(0,offset)],answer:(4-offset)%4,...(level==='B1'&&i===2?{conversational:true,...(language!=='ar'?{colloquial:true}:{})}:{})};
  });
  return [reading[0],use[0],listening[0],use[1],reading[1],use[2],listening[1],reading[2],listening[2]];
 });
}
