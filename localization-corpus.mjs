import {feedbackTemplates} from './localized-feedback.mjs';
import {mistakeFeedback} from './mistake-feedback.mjs';
import {lessonList,chapters,levels,getLessonVariant} from './course.mjs';
import {hasExpandedExercises} from './exercise-variants.mjs';
import {languageOf} from './languages.mjs';
import {interfaceCopy} from './interface-copy.mjs';
import uiSources from './interface-sources.json' with {type:'json'};
export const translationKey=(text,language='')=>JSON.stringify([language,text]);
const corpus=new Map();
function add(text,language='',protectedValues=[]){if(typeof text!=='string'||!/[A-Za-z]/.test(text)||!text.trim())return;const key=translationKey(text,language),old=corpus.get(key);corpus.set(key,{text,language,protectedValues:[...new Set([...(old?.protectedValues||[]),...protectedValues.filter(v=>typeof v==='string'&&v.length>1)])]});}
for(const text of [...uiSources,...Object.keys(interfaceCopy)])add(text);
for(const text of feedbackTemplates)add(text.trim());
for(const level of levels){add(level.name);add(level.description);}
const descriptionColumn=h=>/^(Type|Purpose|Function|Meaning|Focus|Interpretation|Time order|Reason|Difference|Time|Strength|Appropriate interpretation|Reference|Use|Usage|English|Translation|Ending sound)$/i.test(h);
for(const l of lessonList){
 add(l.title);
 const language=l.language||languageOf(l.id),terms=[...(l.vocabulary||[]),...(l.expressions||[])].flatMap(w=>[w.term,w.phrase,w.example]),forms=(l.breakdown?.tables||[]).flatMap(t=>t.rows.flatMap(r=>r.filter((_,i)=>!descriptionColumn(t.headers[i]))));
 const preserve=[...terms,...forms,l.example,...(l.breakdown?.examples||[]).map(x=>x[0])];
 for(const k of ['title','explanation','priority','speak'])add(l[k],language,preserve);
 for(const w of [...(l.vocabulary||[]),...(l.expressions||[])])for(const k of ['meaning','translation','use','pitfall','type','register','region'])add(w[k],language,preserve);
 for(const s of l.breakdown?.steps||[])add(s,language,preserve);add(l.breakdown?.pitfall,language,preserve);
 for(const [,en] of l.breakdown?.examples||[])add(en,language,preserve);
 for(const table of l.breakdown?.tables||[]){add(table.caption,language,preserve);for(const h of table.headers)add(h,language,preserve);for(const row of table.rows)row.forEach((s,i)=>{if(descriptionColumn(table.headers[i]))add(s,language,preserve)})}
 for(const [,hint] of l.soundGuide?.pairs||[])add(hint,language,preserve);
 for(const x of l.characters||[])add(x.meaning,language,preserve);
 for(const s of l.conversation?.watchTasks||[])add(s,language,preserve);
 for(const k of ['levelNote','hint'])add(l.conversation?.[k],language,preserve);
 const variants=[l];if(hasExpandedExercises(l.id))for(const v of [2,3,4])variants.push(getLessonVariant(l.id,`v${v}-localization-source-123456789`));
 for(const q of variants.flatMap(v=>v.questions||[])){
  const targetOptions=(!q.optionsLang||q.optionsLang.split('-')[0]===language)?q.options||[]:[];
  const protectedQ=[...preserve,q.audio,q.audioSpeech,...targetOptions,q.type==='text'?q.answer:null];
  add(q.prompt,language,protectedQ);add(q.note,language,protectedQ);
  for(const value of Object.values(q.mistakeFeedback||{}))add(value,language,protectedQ);
  if(q.prompt?.includes('Complete with tocar:'))for(const answer of ['ligou','tocava','tocar','toquei','tocaram'])add(mistakeFeedback(q,answer),language,protectedQ);
  if(q.optionsLang?.startsWith('en')&&language!=='en')for(const o of q.options||[])add(o,language,preserve);
 }
}
for(const c of chapters)for(const k of ['title','goal']){add(c[k],c.language||languageOf(c.id));add(c[k]);}
export const translationSource=(text,language='')=>corpus.get(translationKey(text,language))||corpus.get(translationKey(text,''));
// Replace exact target-language content with opaque tokens. Translation output
// must preserve every token; restore it only after validation, never as HTML.
export function protectSource(source){
 let text=source.text;const values=[];
 const candidates=[...source.protectedValues,...(source.text.match(/\{\d+\}/g)||[])];
 if(source.language==='en'){
  for(const match of text.matchAll(/[“"]([^”"\n]+)[”"]/g))candidates.push(match[1]);
  if(/_{2,}/.test(text)&&text.includes(':'))candidates.push(text.slice(text.indexOf(':')+1).trim());
 }
 // Longest first; word boundaries prevent protecting 'ir' inside 'first'.
 for(const value of [...new Set(candidates)].sort((a,b)=>b.length-a.length)){
  if(!value||value===source.text||!text.includes(value))continue;
  const escaped=value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  text=text.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`,'gu'),()=>{const id=values.push(value)-1;return `⟦KEEP_${id}⟧`;});
 }
 return {text,restore(translated){if(typeof translated!=='string'||!translated.trim()||translated.length>Math.max(1000,source.text.length*8))throw Error('Invalid translation');for(let i=0;i<values.length;i++){const token=`⟦KEEP_${i}⟧`;if(translated.split(token).length!==2)throw Error('Translation changed learning content');translated=translated.replace(token,values[i]);}if(/⟦KEEP_\d+⟧/.test(translated))throw Error('Unknown translation token');return translated;}};
}
