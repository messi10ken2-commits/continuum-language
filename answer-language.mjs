import meaningOptions from './answer-meaning-options.json' with {type:'json'};
import {tableAnnotation} from './table-audio.mjs';
const meaningGroups=new Set(meaningOptions.map(options=>JSON.stringify([...options].sort())));
// Classify answer purpose independently of the course language. Comprehension
// paraphrases belong to the display language; actual utterances/forms do not.
export function displayLanguageOptions(q,lesson={}){
 if(!q.options)return false;
 if(q.optionsRole)return ['comprehension','meaning'].includes(q.optionsRole);
 const language=lesson.language||lesson.locale?.split('-')[0]||'es';
 // Earlier saved banks incorrectly stamped these authored English meanings
 // with the course locale. Match the reviewed complete group, never guess a
 // language from an individual word or alter the answer/order of a saved run.
 if(language!=='en'&&meaningGroups.has(JSON.stringify([...q.options].sort())))return true;
 if(q.video||lesson.conversation)return true;
 if(lesson.visualStory&&!q.optionsLang)return true;
 if((lesson.skill==='Listening'||lesson.checkpoint||lesson.summaryTest)&&q.audio&&!q.optionsLang&&!lesson.specialist)return true;
 if(q.optionsLang?.startsWith('en')&&language!=='en')return true;
 if(q.optionsLang?.startsWith('en')&&['use','contrast','listening-application'].includes(q.mode))return true;
 if(q.optionsLang?.startsWith('en')&&['detail','correction','action','sequence','inference','stance','condition','priority'].includes(q.viewpoint))return true;
 return /^What does this mean\?/.test(q.prompt||'');
}

// The practice question and its end-of-lesson review share this rule. English
// explanations and transliteration annotations are text, not native utterances.
export function canPlayAnswerAudio(q,lesson={}){
 if(q.type==='text'&&/^table:/.test(q.coverage||'')&&tableAnnotation(q.answer))return false;
 const language=lesson.language||lesson.locale?.split('-')[0]||'es';
 const locale=q.answerLocale||q.optionsLang||lesson.locale;
 return !displayLanguageOptions(q,lesson)&&(!locale||locale.split('-')[0]===language);
}
