// The same authored dictation contract is used by the UI and server grader.
export function listeningReviewQuestion(item){
 const audio=(item.example||item.term||'').trim();
 if(!audio||audio.length>150||/[+\[\]{}]|\b(?:gerund|infinitive)\b/i.test(audio))return null;
 return {type:'text',prompt:'Listen and type the words you hear.',audio,answer:audio,note:item.meaning||'',audioLocale:({es:'es-ES',en:'en-US',pt:'pt-BR',ja:'ja-JP'})[item.language],mode:'dictation',coverage:item.question?.coverage};
}
