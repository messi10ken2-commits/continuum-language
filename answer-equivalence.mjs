// Equivalence is deliberately limited to unambiguous English contractions.
// Accents, tense, pronouns, word order and lexical meaning remain significant.
export const normalizeAnswer=value=>String(value).trim().toLocaleLowerCase('es').normalize('NFKC').replace(/[’‘]/g,"'").replace(/\s+/g,' ').replace(/[.!?¿¡。！？]+$/g,'').trim();
const expansions={"i'm":'i am',"you're":'you are',"we're":'we are',"they're":'they are',"i've":'i have',"you've":'you have',"we've":'we have',"they've":'they have',"isn't":'is not',"aren't":'are not',"wasn't":'was not',"weren't":'were not',"haven't":'have not',"hasn't":'has not',"hadn't":'had not',"don't":'do not',"doesn't":'does not',"didn't":'did not',"can't":'cannot',"couldn't":'could not',"won't":'will not',"wouldn't":'would not',"shouldn't":'should not',"mustn't":'must not',"needn't":'need not',"shan't":'shall not'};
for(const subject of ['i','you','he','she','it','we','they'])expansions[subject+"'ll"]=subject+' will';
const pattern=new RegExp('(?<![\\p{L}\\p{N}])('+Object.keys(expansions).join('|')+')(?![\\p{L}\\p{N}])','gu');
export const expandContractions=value=>normalizeAnswer(value).replace(pattern,word=>expansions[word])
 // Resolve ambiguous suffixes only when the following form disambiguates them.
 .replace(/\b(i|you|he|she|it|we|they)'d (?=(?:like|love|prefer|rather|be|have|go|come|say|buy|take|help|need|want|try|choose)\b)/g,'$1 would ')
 .replace(/\b(i|you|he|she|it|we|they)'d (?=(?:been|seen|done|taken|written|eaten|spoken|forgotten)\b)/g,'$1 had ')
 .replace(/\b(he|she|it|that|what|who|there)'s (?=been\b)/g,'$1 has ')
 .replace(/\b(he|she|it|that|what|who|there)'s (?=(?:a|an|the|from|here|there|ready|happy|tired|late|busy|fine|raining|working|studying|going|coming)\b)/g,'$1 is ');
export function equivalentAnswer(q,value){
 const expected=[q.answer,...(q.accepted||[]),...(q.acceptedAnswers||[])],actual=normalizeAnswer(value);
 if(expected.some(answer=>normalizeAnswer(answer)===actual))return true;
 if(/[ぁ-んァ-ン一-龯]/.test(q.answer)&&q.answerMatch!=='exact'&&q.mode!=='order'&&expected.some(a=>normalizeAnswer(a).replace(/\s+/g,'')===actual.replace(/\s+/g,'')))return true;
 const strict=q.answerMatch==='exact'||q.mode==='order'||q.type==='reorder'||/without (?:a |any )?contractions?|do not (?:use contractions|contract)|uncontracted|(?:full|contracted|shortened) forms?|(?:write|use|give|form) (?:the |a )?(?:casual )?contraction|contraction of/i.test(q.prompt||'');
 return !strict&&expected.some(answer=>expandContractions(answer)===expandContractions(value));
}
