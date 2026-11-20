import {internationalUnits} from './international-content.mjs';
import {languageInfo} from './languages.mjs';
export function internationalAssessmentItems(language,form=0){
 const lang=languageInfo(language);
 return internationalUnits.filter(u=>u.language===language).flatMap(u=>{
 const qs=[...u.reading.map(q=>({...q,skill:'Reading',passage:u.scene,promptLang:'en-US',optionsLang:lang.locale})),...u.transfer.slice(form%2,form%2+3).map(q=>({...q,skill:'Language use',promptLang:'auto',optionsLang:'auto'})),...u.phrases.map(([term,meaning,example],i)=>({skill:'Listening',audio:example,prompt:'What does the expression mean in this situation?',promptLang:'en-US',optionsLang:'en-US',options:[meaning,...u.phrases.filter((_,j)=>i!==j).map(p=>p[1])],answer:0}))];
 return qs.map((q,i)=>{const offset=(i+form)%q.options.length;return {...q,id:`${language}-${form}-${u.level}-${i}`,level:u.level,locale:lang.locale,options:[...q.options.slice(offset),...q.options.slice(0,offset)],answer:(q.answer-offset+q.options.length)%q.options.length};});
 });
}
