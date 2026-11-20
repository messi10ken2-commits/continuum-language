import {isCorrect} from './course.mjs';
const normalize=s=>String(s??'').normalize('NFKC').toLowerCase().trim().replace(/[.!?。！？]+$/,'').replace(/\s+/g,' ');
const noAccents=s=>s.normalize('NFD').replace(/\p{M}/gu,'');
export function mistakeFeedback(q,answer){
 if(isCorrect(q,answer))return q.note;
 const actual=q.type==='text'?String(answer??''):q.options?.[answer];
 const expected=q.type==='text'?q.answer:q.options?.[q.answer];
 const a=normalize(actual),e=normalize(expected);
 const authored=Object.entries(q.mistakeFeedback||{}).find(([key])=>normalize(key)===a)?.[1];
 if(authored)return authored;
 if(q.prompt?.includes('Complete with tocar:')&&e==='tocou'){
  const forms={
   ligou:'Ligou is a past form of ligar (to call or switch on), not tocar. Your past-tense choice is not the main problem: this question specifically asks for tocar, and a phone ringing is o telefone tocou.',
   tocava:'Tocava is the imperfect, which can describe habitual or ongoing ringing. Here the model presents one completed ring interrupting the reading, so tocou is intended.',
   tocar:'Tocar is the infinitive. O telefone needs the third-person singular completed-past form: tocar → tocou.',
   toquei:'Toquei is the eu form. The subject is o telefone (third-person singular), so use tocou.',
   tocaram:'Tocaram is plural. O telefone is singular, so use tocou.'
  };
  return (forms[a]||`You wrote “${actual}”. The requested verb is tocar; with o telefone, the intended completed-past form is tocou.`)+' Full sentence: Eu estava lendo quando o telefone tocou. Estava lendo is the ongoing background; tocou is the completed interruption.';
 }
 if(a!==e&&noAccents(a)===noAccents(e))return `Your answer “${actual}” differs from “${expected}” in its accent or other diacritic marks. Keep the marks in the model spelling. ${q.note}`;
 if(q.audio&&q.type==='text')return `You wrote “${actual}”; the recording says “${q.audio}”. The expected written answer is “${expected}”. Replay the recording and compare the different sounds and letters. ${q.note}`;
 if(q.type==='text'){
  const entered=a.split(' '),model=e.split(' '),missing=model.filter(x=>!entered.includes(x)),extra=entered.filter(x=>!model.includes(x));
  if(entered.length>1&&model.length>1&&!missing.length&&!extra.length)return `You used the model's words, but their order differs. Compare “${actual}” with “${expected}”. ${q.note}`;
  if(model.length>1&&missing.length&&missing.length<model.length&&!extra.length)return `Your answer is missing ${missing.map(x=>'“'+x+'”').join(', ')} from the model “${expected}”. ${q.note}`;
 }
 // Do not invent a learner's reason when the answer alone cannot establish it.
 return `You answered “${actual}”; the expected answer is “${expected}”. ${q.note}`;
}
