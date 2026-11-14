import {immersiveLightActivities} from './immersive-course.mjs';
import {languageInfo} from './languages.mjs';
import {speechParts} from './sentence-audio.mjs';
import {isInstructionalExample} from './lesson-copy-roles.mjs';
import {displayLanguageOptions,unmarkedMeaningOptions} from './answer-language.mjs';
export const lightVersion='light-v3';
export const priorLightVersion='light-v2';
// The corrected lessons get their own draft version; older attempts still grade with their original activities.
const correctedLightVersion='light-v4';
export const previousLightLessonVersion='light-v5';
export const lightLessonVersion='light-v6';
export const lightSingleLessonVersions=[lightLessonVersion,previousLightLessonVersion];
export const lightVersions=[...lightSingleLessonVersions,correctedLightVersion,lightVersion,priorLightVersion,'light-v1'];
export const lightVersionFor=lesson=>lesson?.immersive?lightLessonVersion:lesson?.questions?.some(q=>unmarkedMeaningOptions(q,lesson))?correctedLightVersion:lightVersion;
const historicalDisplayOptions=(q,lesson)=>!unmarkedMeaningOptions(q,lesson)&&displayLanguageOptions(q,lesson);
export const legacyLightVersion='light-v1';
// Practice only authored models/meanings. These activities never replace a test.
export function legacyLightActivities(lesson){
 if(!lesson||lesson.checkpoint||lesson.summaryTest)return [];
 if(lesson.conversation)return (lesson.questions||[]).filter(q=>q.options?.length>1&&Number.isInteger(q.answer)).slice(0,2).map((q,i)=>({id:`video-${i}`,type:'video',question:q,meaning:q.options[q.answer],options:[q.options[q.answer],q.options.find(v=>v!==q.options[q.answer])].sort((a,b)=>a.localeCompare(b))}));
 const pairs=[],seen=new Set();
 const add=(model,meaning,meaningNative=false)=>{if(typeof model==='string'&&!meaning){const first=[...new Intl.Segmenter(lesson.locale||'en',{granularity:'sentence'}).segment(model)][0];if(first)model=first.segment.trim()}if(typeof model!=='string'||!model.trim()||model.length>220||model.split(/\s+/).length>30||seen.has(model.trim())||/_{2,}|https?:/.test(model))return;seen.add(model.trim());pairs.push({model:model.trim(),meaningNative,meaning:typeof meaning==='string'&&meaning.trim()!==model.trim()?meaning.trim():''})};
 for(const w of [...(lesson.vocabulary||[]),...(lesson.expressions||[])])add(w.term||w.phrase,w.meaning||w.translation);
 for(const row of lesson.breakdown?.examples||[])if(Array.isArray(row))add(row[0],row[1]);
 for(const c of lesson.characters||[])add(c.glyph,c.meaning,lesson.language==='ko'&&/^[\u3130-\u318f\u1100-\u11ff\s+]+$/u.test(c.meaning||''));
 if(!isInstructionalExample(lesson))add(lesson.example);
 for(const [a,b] of lesson.soundGuide?.pairs||[]){add(a);add(b)}
 for(const q of lesson.questions||[])if(!historicalDisplayOptions(q,lesson)&&(!q.optionsLang||q.optionsLang.split('-')[0]===(lesson.language||'es')))add(q.audioSpeech||q.audio||(q.type==='text'?q.answer:q.options?.[q.answer]));
 const selected=pairs.slice(0,2);return selected.flatMap((p,i)=>[{...p,id:`${i}-observe`,type:'observe'}, {...p,id:`${i}-practice`,type:p.meaning&&pairs.some(v=>v.meaning&&v.meaning!==p.meaning)?'meaning':'build',options:p.meaning?[p.meaning,pairs.find(v=>v.meaning&&v.meaning!==p.meaning)?.meaning].filter(Boolean).sort((a,b)=>a.localeCompare(b)):[],joiner:/\s/.test(p.model)?' ':'',tokens:(/\s/.test(p.model)?p.model.split(/\s+/):Array.from(new Intl.Segmenter(lesson.locale||'en',{granularity:'grapheme'}).segment(p.model),v=>v.segment)).reverse()}]);
}
export function lightCorrect(activity,answer){return activity.type==='observe'?answer===true:['meaning','video','recall','translate','listen','context','video-confirm','confirm'].includes(activity.type)?answer===activity.meaning:typeof answer==='string'&&answer.replace(/\s+/g,' ').trim()===activity.model.replace(/\s+/g,' ').trim();}

export function lightChoiceValid(activity,value){return value===null||activity.type==='observe'&&value===true||['meaning','video','recall','translate','listen','context','video-confirm','confirm'].includes(activity.type)&&activity.options.includes(value)||activity.type==='build'&&Array.isArray(value)&&value.length<=activity.tokens.length&&value.every((n,i)=>Number.isInteger(n)&&n>=0&&n<activity.tokens.length&&value.indexOf(n)===i);}
export function lightAnswer(activity,value){return activity.type==='build'?value?.map(i=>activity.tokens[i]).join(activity.joiner):value;}
export function validLightState(activities,state){return !!state&&lightVersions.includes(state.version)&&Array.isArray(state.steps)&&state.steps.length<=activities.length&&state.steps.every((s,i)=>s&&typeof s.hint==='boolean'&&(!lightSingleLessonVersions.includes(state.version)||typeof s.missed==='boolean')&&lightCorrect(activities[i],s.answer))&&typeof state.hint==='boolean'&&typeof state.checked==='boolean'&&(state.steps.length===activities.length?state.choice===null:lightChoiceValid(activities[state.steps.length],state.choice));}

// Light is its own complete route. Every authored model is covered over short rounds.
export function lightModels(lesson,{historical=false}={}){
 const displayOptions=historical?historicalDisplayOptions:displayLanguageOptions;
 if(!lesson||lesson.checkpoint||lesson.summaryTest)return [];
 const language=lesson.language||'es',locale=languageInfo(language).locale,pairs=[],seen=new Set();
 const add=(model,meaning,extra={})=>{if(typeof model!=='string'||lesson.characters?.length&&language==='ja'&&/^[a-z]+$/i.test(model)||!model.trim()||model.length>400||/_{2,}|https?:/.test(model)||seen.has(model.trim()))return;seen.add(model.trim());pairs.push({model:model.trim(),meaning:typeof meaning==='string'&&meaning.trim()!==model.trim()?meaning.trim():'',locale,...extra})};
 for(const w of [...(lesson.vocabulary||[]),...(lesson.expressions||[])]){add(w.phrase||w.term,w.meaning||w.translation);if(w.example)add(w.example,w.exampleTranslation)}
 for(const row of lesson.breakdown?.examples||[])if(Array.isArray(row))add(row[0],row[1]);
 for(const c of lesson.characters||[])add(c.glyph,c.meaning||c.reading,{audio:c.audio||(language==='ja'?c.glyph:c.meaning?c.reading:c.glyph)||c.glyph,meaningNative:!c.meaning||language==='ko'&&/^[\u3130-\u318f\u1100-\u11ff\s+]+$/u.test(c.meaning||'')});
 if(!isInstructionalExample(lesson))add(lesson.example);
 for(const [a,b] of lesson.soundGuide?.pairs||[]){add(a);if(!/[A-Z /:]/.test(b))add(b)}
 for(const q of lesson.questions||[])if(!displayOptions(q,lesson)&&(!q.optionsLang||q.optionsLang.split('-')[0]===language))add(q.audioSpeech||q.audio||(q.type==='text'?q.answer:q.options?.[q.answer]),'',{locale:q.audioLocale||q.optionsLang||locale,guidance:q.note});
 return pairs;
}
// Keep round numbers stable so existing completions and rewards still count.
export function lightRoundCount(lesson){if(lesson?.immersive)return 1;if(lesson?.conversation)return Math.max(1,Math.ceil((lesson.questions||[]).filter(q=>q.options?.length>1&&Number.isInteger(q.answer)).length/3));return Math.ceil(lightModels(lesson,{historical:true}).length/2)}
export function v2LightActivities(lesson,round=0){
 if(!Number.isInteger(round)||round<0||round>=lightRoundCount(lesson))return [];
 if(lesson.conversation)return lesson.questions.filter(q=>q.options?.length>1&&Number.isInteger(q.answer)).slice(round*3,round*3+3).map((q,i)=>({id:`video-${round}-${i}`,type:'video',question:q,meaning:q.options[q.answer],options:rotate([q.options[q.answer],q.options.find(v=>v!==q.options[q.answer])],round+i),locale:languageInfo(lesson.language||'es').locale}));
 const pairs=lightModels(lesson,{historical:true}),selected=pairs.slice(round*2,round*2+2),result=[];
 selected.forEach((p,i)=>{
  const prefix=`${round}-${i}`,tokens=/\s/.test(p.model)?p.model.split(/\s+/):Array.from(new Intl.Segmenter(p.locale,{granularity:'grapheme'}).segment(p.model),v=>v.segment),distractor=pairs.find(v=>v.model!==p.model&&v.meaning&&v.meaning!==p.meaning);
  result.push({...p,id:prefix+'-observe',type:'observe'});
  if(p.meaning&&distractor)result.push({...p,id:prefix+'-meaning',type:'meaning',options:rotate([p.meaning,distractor.meaning],round+i)});
  if(tokens.length>1&&tokens.length<=10)result.push({...p,id:prefix+'-build',type:'build',joiner:/\s/.test(p.model)?' ':'',tokens:tokens.reverse()});
  else {const other=pairs.find(v=>v.model!==p.model);if(other)result.push({...p,id:prefix+'-recall',type:'recall',options:rotate([p.model,other.model],round+i),meaning:p.model});}
 });return result;
}
function rotate(values,n){return n%2?values:values.toReversed()}
export function lightAudioTargets(lessons){const found=new Map();const add=(text,locale,lesson)=>{if(!text)return;for(const part of speechParts(text,locale,locale)){const key=JSON.stringify([part.lang,part.text.normalize('NFC').trim()]);if(!found.has(key))found.set(key,{text:part.text.normalize('NFC').trim(),locale:part.lang,lesson})}};
 for(const lesson of lessons){if(lesson.checkpoint||lesson.summaryTest)continue;for(const p of lightModels(lesson))add(p.audio||p.model,p.locale,lesson.id);for(const q of lesson.questions||[])if(q.audio)add(q.audioSpeech||q.audio,q.audioLocale||languageInfo(lesson.language||'es').locale,lesson.id)}return [...found.values()];}

// Six retrieval questions, without counting previews as answers. Keep old versions immutable.
export function lightLessonPassed(steps,total){
 return total>0&&steps.length===total&&steps.filter(step=>step.missed===false).length*5>=total*4;
}

export function lightActivities(lesson,round=0,version=lightVersionFor(lesson)){
 if(lesson?.immersive)return round===0&&version===lightLessonVersion?immersiveLightActivities(lesson):[];
 if(version===previousLightLessonVersion)return round===0?lightActivities(lesson):[];
 const diverse=version===lightLessonVersion;
 if(diverse&&round!==0)return [];
 if(version===legacyLightVersion)return legacyLightActivities(lesson);
 if(version===priorLightVersion)return v2LightActivities(lesson,round);
 if((!diverse&&version!==lightVersion&&version!==lightVersionFor(lesson))||!Number.isInteger(round)||round<0||round>=lightRoundCount(lesson))return [];
 const locale=languageInfo(lesson.language||'es').locale;
 const questions=(lesson.questions||[]).filter(q=>q.options?.length>1&&Number.isInteger(q.answer)&&typeof q.options[q.answer]==='string');
 // Round zero in the original single-lesson version used the current v3/v4 content.
 const historical=(diverse?lightVersionFor(lesson):version)===lightVersion;
 const displayOptions=historical?historicalDisplayOptions:displayLanguageOptions;
 const context=(q,index,type='context')=>({id:`q-${index}`,type,question:q,model:q.options[q.answer],meaning:q.options[q.answer],options:rotate([...new Set(q.options)],round+index),optionsNative:!displayOptions(q,lesson),locale:q.optionsLang||locale,audio:q.audioSpeech||q.audio,audioLocale:q.audioLocale||locale,source:'question'});
 if(lesson.conversation){const ordered=questions.map((_,i)=>context(questions[(round*3+i)%questions.length],(round*3+i)%questions.length,'video')).slice(0,diverse?questions.length:6);
  if(ordered.length<5){const q=questions[round%questions.length],fits=round%2===0;ordered.push({...context(q,round,'video-confirm'),id:'video-confirm-'+round,statement:fits?q.options[q.answer]:q.options.find(o=>o!==q.options[q.answer]),statementNative:!displayOptions(q,lesson),options:['Fits the recording','Does not fit the recording'],optionsNative:false,meaning:fits?'Fits the recording':'Does not fit the recording'});}return diverse?variedLightActivities(lesson,ordered):ordered;
 }
 const pairs=lightModels(lesson,{historical}),selected=pairs.slice(round*2,round*2+2);if(!selected.length)selected.push(...pairs.slice(0,2));if(selected.length===1&&pairs.length>1)selected.push(pairs[(round*2+1)%pairs.length]);
 const out=[],seen=new Set();
 const push=a=>{if(!a||!diverse&&out.length===6)return;const key=[a.type,a.question?.prompt||a.model,a.promptMeaning||''].join('::');if(!seen.has(key)){seen.add(key);out.push({...a,id:`r${round}-q${out.length}`})}};
 const linked=p=>questions.find(q=>(q.audioSpeech||q.audio||q.options[q.answer])===p.model);
 const tasks=p=>{
  const others=pairs.filter(v=>v.model!==p.model),meaningOthers=others.filter(v=>v.meaning&&v.meaning!==p.meaning&&!!v.meaningNative===!!p.meaningNative);
  const nativeOptions=rotate([p.model,...others.slice(0,2).map(v=>v.model)],round+pairs.indexOf(p));
  const meanings=rotate([...new Set([p.meaning,...meaningOthers.map(v=>v.meaning)])].slice(0,3),round+pairs.indexOf(p));
  const base={...p,source:'model'};
  const tokens=/\s/.test(p.model)?p.model.split(/\s+/):/^[\p{Script=Latin}\p{M}\p{P}]+$/u.test(p.model)?[p.model]:Array.from(new Intl.Segmenter(p.locale,{granularity:'grapheme'}).segment(p.model),v=>v.segment);
  const build=tokens.length>1&&tokens.length<=10&&new Set(tokens).size>1&&!p.meaningNative?{...base,type:'build',promptMeaning:p.meaning,joiner:/\s/.test(p.model)?' ':'',tokens:shuffle(tokens,round+pairs.indexOf(p))}:null;
  return {meaning:p.meaning&&meaningOthers.length?{...base,type:'meaning',options:meanings}:null,translate:p.meaning&&nativeOptions.length>1?{...base,type:'translate',promptMeaning:p.meaning,options:nativeOptions,meaning:p.model,optionsNative:true}:null,listen:(p.meaning&&meaningOthers.length)?{...base,type:'listen',options:meanings,optionsNative:p.meaningNative}:nativeOptions.length>1?{...base,type:'listen',options:nativeOptions,meaning:p.model,optionsNative:true}:null,build,linked:linked(p)?context(linked(p),questions.indexOf(linked(p))):null};
 };
 if(questions.length)push(context(questions[(round*2)%questions.length],(round*2)%questions.length));
 for(let i=0;i<selected.length;i++){const choices=tasks(selected[i]);push(i%2?choices.translate||choices.listen:choices.meaning||choices.listen);push(choices.build||choices.linked||choices.listen);}
 for(let i=0;i<questions.length;i++)push(context(questions[(round*2+1+i)%questions.length],(round*2+1+i)%questions.length));
 for(const p of [...selected,...pairs])for(const a of Object.values(tasks(p)))push(a);
 for(let i=0;i<questions.length&&(diverse||out.length<5);i++){const q=questions[(round+i)%questions.length],fits=(round+i)%2===0;push({...context(q,i,'confirm'),statement:fits?q.options[q.answer]:q.options.find(o=>o!==q.options[q.answer]),statementNative:!displayOptions(q,lesson),optionsNative:false,options:['Fits the situation','Does not fit the situation'],meaning:fits?'Fits the situation':'Does not fit the situation'});}
 return diverse?variedLightActivities(lesson,out):out;
}
function lightTextKey(text){
 return text?.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}\p{M}]+/gu,' ').trim()||'';
}

function variedLightActivities(lesson,activities){
 const segmenter=new Intl.Segmenter(languageInfo(lesson.language||'es').locale,{granularity:'sentence'});
 const expressionByText=new Map();
 for(const item of [...(lesson.vocabulary||[]),...(lesson.expressions||[])]){
  const family=lightTextKey(item.term||item.phrase);
  if(family)for(const text of [item.term,item.phrase,item.example]){
   if(text)expressionByText.set(lightTextKey(text),family);
  }
 }
 const candidates=activities.map(activity=>{
  const prompt=activity.question?.prompt;
  const spoken=activity.question?.audioSpeech||activity.question?.audio;
  const target=activity.source==='model'?activity.model:spoken;
  const quoted=prompt?.match(/[“「『]([^”」』]+)[”」』]/u)?.[1];
  const nativeAnswer=activity.source==='question'&&displayLanguageOptions(activity.question,lesson)===false?activity.model:'';
  const sentenceKeys=[lightTextKey(prompt)];
  for(const text of [target,nativeAnswer&&/[.!?。！？؟]$/u.test(nativeAnswer)?nativeAnswer:'']){
   if(text)for(const part of segmenter.segment(text))sentenceKeys.push(lightTextKey(part.segment));
  }
  const expressionText=lightTextKey(quoted||target||nativeAnswer||prompt);
  const expression=expressionByText.get(expressionText)||expressionText;
  return {activity,expression,sentences:[...new Set(sentenceKeys.filter(Boolean))]};
 });
 const sentenceCounts=new Map(),expressionCounts=new Map(),formatCounts=new Map(),result=[];
 const add=(counts,key)=>counts.set(key,(counts.get(key)||0)+1);
 const repetitions=({sentences})=>Math.max(0,...sentences.map(sentence=>sentenceCounts.get(sentence)||0));
 const isConfirmation=({activity})=>activity.type==='confirm'||activity.type==='video-confirm';
 while(result.length<6){
  const available=candidates.filter(candidate=>repetitions(candidate)<2);
  if(!available.length)break;
  available.sort((a,b)=>Number(isConfirmation(a))-Number(isConfirmation(b))
   ||repetitions(a)-repetitions(b)
   ||(expressionCounts.get(a.expression)||0)-(expressionCounts.get(b.expression)||0)
   ||(formatCounts.get(a.activity.type)||0)-(formatCounts.get(b.activity.type)||0));
  const selected=available[0];
  candidates.splice(candidates.indexOf(selected),1);
  for(const sentence of selected.sentences)add(sentenceCounts,sentence);
  add(expressionCounts,selected.expression);
  add(formatCounts,selected.activity.type);
  result.push(selected.activity);
 }
 return result;
}

function shuffle(tokens,seed){const values=tokens.map((v,i)=>({v,key:((i+1)*1103515245+(seed+3)*12345)>>>0})).sort((a,b)=>a.key-b.key).map(r=>r.v);if(values.join('')===tokens.join(''))values.push(values.shift());return values;}
