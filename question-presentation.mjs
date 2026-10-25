// Presentation only: never changes question IDs, seeds, answers or grading.
const rules=[
 [/^Complete the sentence\. Type only the missing word or phrase\.\n/,'Complete the sentence.'],
 [/^Use the information below to produce the requested form\. Type only that form, not its grammatical name\.\n/,'Complete the missing form.'],
 [/^Choose the interpretation supported by this expression\.\n/,'Choose the meaning.'],
 [/^Complete the model with the lesson's wording\.\n/,'Complete the model.',"Use this lesson’s wording."],
 [/^Complete the sentence to express:\s*/,'Complete the sentence.'],
 [/^Rebuild the model for:\s*/,'Put the words in order.'],
 [/^Recall the word or phrase taught in this lesson:\s*/,'Write the word or phrase.'],
 [/^What does this mean\?\s*/,'What does this mean?']
];
export function questionPromptSource(q){
 for(const [pattern,instruction,hint] of rules){const match=pattern.exec(q.prompt||'');if(match&&q.prompt.slice(match[0].length).trim())return {instruction,hint,body:q.prompt.slice(match[0].length),learningText:instruction==='What does this mean?',translatedLines:match[0].endsWith('\n')};}
 // Separate a scenario instruction from its cloze, retaining both verbatim.
 // Only explicit Complete: tasks qualify; other colon-delimited tasks stay put.
 const cloze=q.type==='text'&&/^(.*?\bComplete(?: the sentence)?):\s*([^\n]*_{2,}[^\n]*)$/s.exec(q.prompt||'');
 if(cloze)return {instruction:'Complete the sentence.',context:cloze[1].replace(/\bComplete(?: the sentence)?$/,'').trim(),body:cloze[2],learningText:true};
 return null;
}
