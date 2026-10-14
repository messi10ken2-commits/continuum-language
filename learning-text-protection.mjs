// Public authored learning text, never learner input. These spans must survive
// interface translation verbatim, including errors deliberately shown in drills.
export function questionLearningText(q,language){
 const prompt=q.prompt||'',values=[q.context,q.audio,q.audioSpeech,...(q.type==='text'?[q.answer,...(q.accepted||[])]:[])];
 const add=value=>{if(typeof value==='string'&&value.trim())values.push(value.trim());};
 const afterInstruction=value=>value.split(/\s+(?:Write (?:only|the|a|both)|Use |Begin |Add |Give )/)[0].trim();
 const meaning=prompt.match(/^What does this mean\?\s*([\s\S]+)$/);if(meaning)add(meaning[1]);
 const contextual=prompt.match(/^Complete the model with the lesson's wording\.\n([^\n]+)/);if(contextual)add(contextual[1]);
 const sentence=prompt.match(/^Complete the sentence to express:[^\n]*\n([\s\S]+)$/);if(sentence)add(sentence[1]);
 // Colon-delimited correction, transformation and cloze exercises. Keep the
 // sentence as written: correcting it in a translation would reveal the answer.
 if(/^(?:Complete|Correct|Make|Ask|Use|Put|Replace|Express|Remove|Limit|Write|Read\s*:)/.test(prompt)&&prompt.includes(':')&&!/^Choose the structure/.test(prompt)){
  const tail=prompt.slice(prompt.indexOf(':')+1).trim();
  if(!/^[“"]/.test(tail)&&!tail.includes('\n'))add(afterInstruction(tail));
 }
 if(/_{2,}/.test(prompt)&&!prompt.includes(':')&&!prompt.includes('\n')&&!/^(?:Complete|Write|Choose|Use|Say|Describe|Ask|Both|Every|You)\b/.test(prompt))add(prompt);
 // Quoted glosses in non-English courses are explanations; quoted examples,
 // comparison words and the first word in a word-order task are learning text.
 const gloss=/^(?:Recall |Rebuild the model for:|Write the lesson's model for:|Complete the sentence to express:|Which model communicates this\?|Which means )/;
 for(const match of prompt.matchAll(/[“"]([^”"\n]+)[”"]/g))if(language==='en'||!gloss.test(prompt)||/Begin with\s*$/.test(prompt.slice(0,match.index)))add(match[1]);
 // Single-quoted model speech in scenario questions is also learning material.
 for(const match of prompt.matchAll(/(?:says|said|reads|wrote):\s*'([^'\n]+(?:'[^'\n]+)?)'/g))add(match[1]);
 // Lemmas and forms named in an instruction must remain in the studied language.
 for(const match of prompt.matchAll(/(?:Complete with|Correct only|Correct|Use|with) ([\p{L}’'-]+(?: (?:or|and) [\p{L}’'-]+)?)(?=[:,.]| in the | to express | for |\s*$)/gu)){
  if(!/^(?:the|a|an|only|negative|simple|past|present|word|verb|form|auxiliary|participle|question|purpose|result|polite|imperfect|conventional|desired|negative purpose|past form)$/.test(match[1]))add(match[1]);
 }
 for(const match of prompt.matchAll(/(?:past|participle|imperfect) of ([\p{L}’'-]+)/gu))add(match[1]);
 if(language==='en')for(const match of prompt.matchAll(/(?:Begin|Add|Use) ([A-Za-z]+(?: [A-Za-z]+)?)(?=[.!?]|$)/g))add(match[1]);
 if(language==='ja')for(const match of prompt.matchAll(/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー〜]+(?:[_＿]+[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}ー〜]*)?/gu))add(match[0]);
 return [...new Set(values.filter(v=>typeof v==='string'&&v.trim()).map(v=>v.trim()))];
}

// Cache entries are accepted only if every protected occurrence is still there.
// The provider restores exact spans, so even a spelling/case change is invalid.
export function keepsProtectedText(protection,translated){
 if(!protection)return typeof translated==='string';
 if(typeof translated!=='string')return false;
 const expected=new Map();for(const value of protection.values)expected.set(value,(expected.get(value)||0)+1);
 for(const [value,count] of expected){let found=0,index=0;while((index=translated.indexOf(value,index))!==-1){found++;index+=value.length;}if(found<count)return false;}
 return true;
}
