import {lessonList} from './course.mjs';
export const topics={
 'subjunctive':{terms:['subjunctive','subjuntivo','doubt','uncertainty','venga'],prompt:'You are planning a trip but nothing is confirmed. Give three possibilities using es posible que and no creo que.',check:'Listen for the subjunctive after each doubt expression; ask for one self-correction before giving the form.'},
 'porpara':{terms:['por para','por vs para','por vs. para','por or para','purpose','destination'],prompt:'Explain who a gift is for, why you bought it, and when it must arrive. Use por and para and explain each choice.',check:'Check meaning: recipient, cause and deadline. Ask for a new example, not just the rule.'},
 'connectors':{terms:['conjunction','conjunctions','connector','connectors','connect your ideas','porque','por eso','sin embargo'],prompt:'Should the city limit cars? Give a reason with porque, a result with por eso, and a contrasting point with sin embargo.',check:'Check that each connector expresses the intended relationship, then ask the learner to paraphrase the argument.'},
 'speaker-stance':{terms:['si bien','aunque','aun asi','speaker stance','concession'],prompt:'Discuss working from home. Begin one view with Si bien es cierto que… and another with Aunque…, then make your final position clear.',check:'Ask the listener to identify the concession and the final position. Check whether the learner preserves both meanings.'},
 'pronunciation':{terms:['pronunciation','pronunciacion','rhythm','stress','pronunciar'],prompt:'Say Tengo el teléfono en casa. Mark the stressed syllables, repeat in short chunks, then use teléfono in a new sentence.',check:'Compare clarity, word stress and rhythm by listening. A speech-recognition score alone is not a pronunciation assessment.'},
 'airport':{terms:['airport','gate','flight','aeropuerto','vuelo'],prompt:'Role-play a gate change: the flight moves from B12 to B16 and leaves 20 minutes later. The passenger repeats the new details and asks a follow-up question.',check:'Check the final gate and revised time without showing the transcript. Replay only after the learner gives an answer.'},
 'hypotheticals':{terms:['hypothetical','conditional','si tuviera','condicional'],prompt:'If you had a month free, what would you do? Use Si tuviera… and a conditional, then respond to an unexpected change of plan.',check:'Listen for imperfect subjunctive in the si clause and conditional in the result; request a second original example.'},
 'formal-register':{terms:['register','formal','politeness','formalidad'],prompt:'Ask a friend, then a hotel manager, to change a booking. Adapt the greeting, request and closing to each relationship.',check:'Compare tone and precision across the two messages. Ask the learner to explain which phrases they changed and why.'},
 'past-events':{terms:['past tense','preterite','preterito','yesterday'],prompt:'Tell a short story about yesterday. Add three completed events and answer a follow-up about who did each action.',check:'Check past forms and time sequence; ask for a self-correction without interrupting the first telling.'},
 'ser-estar':{terms:['ser estar','ser and estar','ser vs estar'],prompt:'Describe a friend’s profession, current mood and location. Then describe how their mood changes after some good news.',check:'Check identity, state and location separately; ask why ser or estar fits each sentence.'}
};
const normalize=s=>String(s||'').normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const has=(text,phrase)=>(' '+text+' ').includes(' '+normalize(phrase)+' ');
// Explicit curriculum concepts prevent a broad word such as “past” from
// redirecting a more specific request to a different tense or language.
const concepts=[
 [['past perfect subjunctive','pluperfect subjunctive','pluscuamperfecto de subjuntivo'],{es:'past-perfect-subjunctive-lab'}],
 [['present perfect subjunctive','perfecto de subjuntivo'],{es:'perfect-subjunctive-lab',pt:'pt-c1-v2-lesson-5'}],
 [['past perfect','pluperfect','pluscuamperfecto','mais que perfeito','過去完了'],{es:'pluperfect-lab',en:'en-b1-v2-lesson-6',pt:'pt-b1-v2-lesson-6'}],
 [['present perfect continuous'],{en:'en-b2-v2-lesson-5'}],
 [['present perfect','perfecto compuesto','現在完了'],{es:'present-perfect-lab',en:'en-b1-v2-lesson-5',pt:'pt-b1-v2-lesson-5'}],
 [['imperfect subjunctive','imperfecto de subjuntivo'],{es:'imperfect-subjunctive-lab',pt:'pt-b2-v2-lesson-3'}],
 [['past continuous','past progressive','過去進行形'],{en:'en-a2-v2-lesson-6'}],
 [['past simple','simple past','preterite','preterito indefinido','preterito perfeito','過去形'],{es:'preterite-lab',en:'en-a2-v2-lesson-1',pt:'pt-a2-v2-lesson-1',ja:'ja-a2-v2-lesson-1'}],
 [['imperfect','preterito imperfeito','imperfecto'],{es:'imperfect-lab',pt:'pt-a2-v2-lesson-5'}],
 [['por para','por vs para','por or para'],{es:'porpara'}],
 [['ser estar','ser and estar','ser vs estar'],{es:'ser-estar',pt:'pt-a1-v2-lesson-2'}],
 [['subjunctive','subjuntivo','接続法'],{es:'subjunctive',pt:'pt-b2-v2-lesson-5'}],
 [['te form','て形'],{ja:'ja-a2-v2-lesson-5'}],
 [['passive','causative','受身','受け身','使役'],{ja:'ja-b2-v2-lesson-5'}],
 [['hiragana','ひらがな'],{ja:'ja-script-v1-hiragana-0'}],
 [['katakana','カタカナ'],{ja:'ja-script-v1-katakana-0'}]
];
// New curricula use authored concept IDs, never a Spanish fallback.
const expandedIds=(band,index)=>Object.fromEntries(['zh','ko','fr','de','ar','it'].map(l=>[l,`${l}-${band}-core-v3-lesson-${index}`]));
const extraConcepts=[
 [['past perfect','pluperfect'],expandedIds('b1',6)],
 [['past simple','simple past','completed past','passé composé','passe compose','perfekt','passato prossimo'],expandedIds('a2',1)],
 [['past background','past habits','imperfect','imperfetto','imparfait'],expandedIds('a2',6)],
 [['hypothetical','conditional','conditionals','konjunktiv ii'],expandedIds('b1',8)],
 [['future','future plans','prediction'],expandedIds('b1',7)],
 [['question formation','questions'],expandedIds('a1',5)],
 [['negation','negative','negatives'],expandedIds('a1',6)],
 [['subjunctive','subjuntivo','congiuntivo'],{fr:'fr-b1-core-v3-lesson-2',it:'it-b1-core-v3-lesson-2'}],
 [['idiom','idioms','chengyu','proverbs'],expandedIds('c1',11)],
 [['pinyin','tones','hanzi'],{zh:'zh-script-v1-pinyin-0'}],
 [['hangul','hangeul','한글'],{ko:'ko-script-v1-letters-0'}],
 [['arabic alphabet','arabic letters'],{ar:'ar-script-v1-alphabet-0'}],
 [['umlaut','umlauts','eszett'],{de:'de-script-v1-special-letters-0'}]
];
for(const [terms,ids] of extraConcepts){const old=concepts.find(([existing])=>existing.some(t=>terms.includes(t)));if(old)Object.assign(old[1],ids);}
export function matchClassLesson(note,language='es',extraTerms=topics){
 if(!note||(note.language||'es')!==language)return null;
 const text=normalize(`${note.focus||''} ${note.note||''}`);
 const eligible=lessonList.filter(l=>(l.language||'es')===language&&!l.checkpoint&&!l.summaryTest);
 if(note.lessonId)return eligible.find(l=>l.id===note.lessonId)||null;
 // Longer concepts take precedence: past perfect subjunctive is not past perfect.
 const hits=[...concepts,...extraConcepts.filter(([,ids])=>ids[language])].flatMap(([terms,ids])=>terms.filter(t=>has(text,t)).map(t=>({term:t,id:ids[language]}))).sort((a,b)=>normalize(b.term).length-normalize(a.term).length);
 if(hits.length)return eligible.find(l=>l.id===hits[0].id)||null;
 const ranked=eligible.map(l=>{
  const title=normalize(l.title),terms=extraTerms[l.id]?.terms||[];
  const score=has(text,title)?100+title.length:terms.reduce((best,t)=>Math.max(best,(has(normalize(note.note),t)?40:0)+(has(normalize(note.focus),t)?30:0)+((has(text,t))?normalize(t).length/100:0)),0);
  return {lesson:l,score};
 }).filter(x=>x.score).sort((a,b)=>b.score-a.score);
 if(!ranked.length||ranked[0].score===ranked[1]?.score)return null;
 return ranked[0].lesson;
}
export function classPractice(notes=[],language='es'){
 const saved=notes.filter(n=>(n.language||'es')===language).map((n,i)=>({n,i})).sort((a,b)=>(Date.parse(b.n.at)||0)-(Date.parse(a.n.at)||0)||a.i-b.i)[0]?.n||null;
 return {saved,lesson:matchClassLesson(saved,language)};
}
