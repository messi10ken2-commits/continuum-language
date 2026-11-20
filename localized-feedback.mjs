import {mistakeFeedback} from './mistake-feedback.mjs';
export const feedbackTemplates=[
 'You answered {0}; the expected answer is {1}. ',
 'Your answer {0} differs from {1} in its accent or other diacritic marks. Keep the marks in the model spelling. ',
 'You wrote {0}; the recording says {1}. The expected written answer is {2}. Replay the recording and compare the different sounds and letters. ',
 "You used the model's words, but their order differs. Compare {0} with {1}. ",
 'You wrote {0}. The requested verb is tocar; with o telefone, the intended completed-past form is tocou. Full sentence: Eu estava lendo quando o telefone tocou. Estava lendo is the ongoing background; tocou is the completed interruption.',
 ...Array.from({length:12},(_,n)=>`Your answer is missing ${Array.from({length:n+1},(_,i)=>`{${i}}`).join(', ')} from the model {${n+1}}. `)
];
export function feedbackParts(q,answer){
 const original=mistakeFeedback(q,answer),note=q.note&&original.endsWith(q.note)?q.note:'',prefix=note?original.slice(0,-note.length):original,values=[];
 const source=prefix.replace(/“[^”]*”/g,value=>`{${values.push(value)-1}}`);
 return {source,values,note,original};
}
