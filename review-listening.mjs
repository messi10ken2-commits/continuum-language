import {languageInfo} from './languages.mjs';
// The same authored dictation contract is used by the UI and server grader.
export function listeningReviewQuestion(item){
 const audio=(item.example||item.term||'').trim();
 if(!audio||audio.length>150||/[+\[\]{}]|\b(?:gerund|infinitive)\b/i.test(audio))return null;
 return {type:'text',prompt:'Listen and type the words you hear.',audio,answer:audio,note:item.meaning||'',audioLocale:languageInfo(item.language).locale,mode:'dictation',coverage:item.question?.coverage};
}
