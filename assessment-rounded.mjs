import bank from './assessment-rounded.json' with {type:'json'};
import clips from './assessment-rounded-audio.json' with {type:'json'};
import {variedAssessmentItems} from './assessment-variety.mjs';
import {languageInfo} from './languages.mjs';
// Held-out examples. No lesson questions or review examples are copied here.
const listening=[
 ['What availability is the speaker actually offering?','Thursday morning only.','The whole of Thursday.','Thursday afternoon only.','Every weekday morning.'],
 ['What does the speaker recommend before changing the route?','Try it during the usual weekday travel period.','Use it only during the school holidays.','Assume that lighter traffic is typical at all times.','Switch immediately because its distance is shorter.'],
 ['What comparison does the speaker want?','Total prices including delivery and assembly.','Chair prices with all services excluded.','Delivery times instead of purchase costs.','Assembly quality without considering the price.'],
 ['What would best address the speaker’s concern?','A short session on applying the examples to their project.','Repeating the entire presentation without changes.','Removing the examples from the workshop.','Replacing the project with a different one.']
];
function choice(options,form,level,slot){const offset=(form+['A1','A2','B1','B2','C1'].indexOf(level)+slot)%4;return {options:[...options.slice(offset),...options.slice(0,offset)],answer:(4-offset)%4};}
export function roundedAssessmentItems(language,form){
 const old=variedAssessmentItems(language,form),locale=languageInfo(language).locale;
 return ['A1','A2','B1','B2','C1'].flatMap(level=>{
  const group=old.filter(q=>q.level===level),reading=group.filter(q=>q.skill==='Reading').map(q=>({...q,id:q.id.replace('v3-','v4-'),competency:'reading'}));
  const grammar={...group.find(q=>q.skill==='Language use'),competency:'grammar'};grammar.id=grammar.id.replace('v3-','v4-');
  if(level==='A2'){const item=bank.find(x=>x.language===language&&x.form===form&&x.competency==='grammar');Object.assign(grammar,{prompt:item.prompt,...choice(item.options,form,level,0)});}
  const use=['vocabulary','pragmatics'].map((competency,i)=>{
   const source=bank.find(x=>x.language===language&&x.level===level&&x.form===form&&x.competency===competency);if(!source)throw Error('Missing rounded placement item');
   const contextual=competency==='vocabulary';
   return {id:`v4-${language}-${form}-${level}-${competency}`,level,skill:'Language use',locale,competency,colloquial:source.colloquial,instructionOnly:true,promptLang:'en-US',optionsLang:locale,
    prompt:contextual?(source.prompt.includes('____')?'Choose the word or phrase that fits the situation.':'Read the message. Which interpretation fits this context?'):source.prompt,
    ...(contextual?{context:source.prompt}:{}),...choice(source.options,form,level,i+1)};
  });
  const audio=group.filter(q=>q.skill==='Listening').map(q=>({...q,id:q.id.replace('v3-','v4-'),competency:'listening'}));
  if(level==='B2'){const [prompt,...options]=listening[form];audio[2]={...audio[2],id:`v4-${language}-${form}-B2-practical-listening`,audio:clips.find(x=>x.language===language&&x.form===form).audio,prompt,...choice(options,form,level,3)};}
  // Interleave domains rather than presenting long runs of near-identical tasks.
  return [reading[0],grammar,audio[0],use[0],reading[1],use[1],audio[1],reading[2],audio[2]];
 });
}
