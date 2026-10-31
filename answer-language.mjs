// Classify answer purpose independently of the course language. Comprehension
// paraphrases belong to the display language; actual utterances/forms do not.
export function displayLanguageOptions(q,lesson={}){
 if(!q.options)return false;
 if(q.optionsRole)return ['comprehension','meaning'].includes(q.optionsRole);
 if(q.video||lesson.conversation)return true;
 if(lesson.visualStory&&!q.optionsLang)return true;
 if((lesson.skill==='Listening'||lesson.checkpoint||lesson.summaryTest)&&q.audio&&!q.optionsLang&&!lesson.specialist)return true;
 const language=lesson.language||lesson.locale?.split('-')[0]||'es';
 if(q.optionsLang?.startsWith('en')&&language!=='en')return true;
 if(q.optionsLang?.startsWith('en')&&['use','contrast','listening-application'].includes(q.mode))return true;
 if(q.optionsLang?.startsWith('en')&&['detail','correction','action','sequence','inference','stance','condition','priority'].includes(q.viewpoint))return true;
 return /^What does this mean\?/.test(q.prompt||'');
}

// The practice question and its end-of-lesson review share this rule. English
// explanations and transliteration annotations are text, not native utterances.
export function canPlayAnswerAudio(q,lesson={}){
 const language=lesson.language||lesson.locale?.split('-')[0]||'es';
 const locale=q.answerLocale||q.optionsLang||lesson.locale;
 return !displayLanguageOptions(q,lesson)&&(!locale||locale.split('-')[0]===language);
}
