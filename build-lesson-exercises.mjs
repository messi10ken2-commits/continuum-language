// Authoring utility: emits a frozen exercise snapshot. Runtime never regenerates
// historical v2 exercises from editable lesson reference material.
import {writeFileSync} from 'node:fs';
import {lessonList} from './course.mjs';
import {grammarPractice} from './grammar-practice.mjs';
const clean=s=>s.replace(/（[^）]*）/g,'').replace(/^[〜～]/,'').trim();
const simple=s=>clean(s).replace(/^(?:a |an |the |el |la |los |las |un |una |o |a |os |as )/i,'');
const norm=s=>s.toLowerCase().replace(/[.!?。！？]+$/,'').trim();
const unique=xs=>[...new Set(xs)];
function text(prompt,answer,note,extra={}){return {type:'text',prompt,answer,accepted:unique([answer,clean(answer)]),note,...extra};}
function mc(prompt,answer,alternatives,note,extra={}){const options=unique([answer,...alternatives]).slice(0,4);if(options.length<2)throw Error('Missing alternatives: '+prompt);return {prompt,options,answer:0,note,...extra};}
const stop=new Set('a an the to of in on at for and or de da do das dos o os as el la los las un una um uma por para que se no na com en le les es is are be my your it i you we they he she'.split(' '));
function blankFor(entry){
 const sentence=entry.example;
 const candidates=unique([clean(entry.phrase||''),clean(entry.term),simple(entry.term)]).filter(x=>x.length>1&&!x.includes(' / ')&&!x.includes('…')).sort((a,b)=>b.length-a.length);
 for(const target of candidates){const index=sentence.toLowerCase().indexOf(target.toLowerCase());if(index>=0)return {sentence:sentence.slice(0,index)+'____'+sentence.slice(index+target.length),answer:sentence.slice(index,index+target.length)};}
 const words=clean(entry.term).match(/[\p{L}’-]+/gu)||[];
 for(const w of words.reverse()){if(stop.has(w.toLowerCase())||w.length<3)continue;const index=sentence.toLowerCase().indexOf(w.toLowerCase());if(index>=0)return {sentence:sentence.slice(0,index)+'____'+sentence.slice(index+w.length),answer:sentence.slice(index,index+w.length)};}
 return null;
}
function orderQuestion(sentence,meaning,note,locale){
 const tokens=locale==='ja-JP'?Array.from(new Intl.Segmenter('ja',{granularity:'word'}).segment(sentence),x=>x.segment):sentence.split(' ');
 if(tokens.length<2||tokens.length>28||sentence.length>150)return text(`Write the lesson's model for: “${meaning}”`,sentence,note,{mode:'recall',promptLang:'en-US'});
 return text(`Rebuild the model for: “${meaning}”\nBegin with “${tokens[0]}”.`,sentence,note,{mode:'order',tokens,joiner:locale==='ja-JP'?'':' ',promptLang:'en-US'});
}
const bank={};
for(const l of lessonList.filter(l=>!l.checkpoint&&!l.summaryTest)){
 const locale=l.locale||'es-ES',lang=l.language||'es',qs=[];
 const add=(q,coverage)=>{qs.push({...q,coverage,sourceLesson:l.id,promptLang:q.promptLang||'en-US',optionsLang:q.optionsLang||locale});};
 const entries=l.expressions||l.vocabulary;
 if(entries){
  // Three different passes: contextual use, active recall, then collocation or
  // sentence construction. Every taught entry appears in every pass.
  entries.forEach((e,i)=>{
   const label=e.term,note=`${e.example} — ${e.translation}. ${e.use||e.meaning}${e.pitfall?' '+e.pitfall:''}`;
   const b=blankFor(e);
   if(b)add(text(`Complete the model with the lesson's wording.\n${b.sentence}\nMeaning: ${e.translation}`,b.answer,note,{mode:'cloze',accepted:unique([b.answer,clean(b.answer)]),...(['Listening','Pronunciation'].includes(l.skill)?{audio:e.example,audioLocale:locale}: {})}),`entry:${i}:context`);
   else add(orderQuestion(e.example,e.translation,note,locale),`entry:${i}:context`);
  });
  entries.forEach((e,i)=>{
   const answer=clean(e.term),note=`${e.term}: ${e.meaning}. ${e.use||''} Example: ${e.example}`;
   add(text(`Recall the ${l.expressions?'expression':'word or phrase'} taught in this lesson: “${e.meaning}”.\nUse the lesson's entry${/[\/〜～]/.test(e.term)?'; for a paired entry give both forms separated by /, and keep 〜 in a pattern':''}${lang==='ja'?' in Japanese; readings in parentheses are optional':''}.`,answer,note,{mode:'recall',accepted:unique([answer,e.term,...(e.term.includes(' / ')?[e.term.replaceAll(' / ',' / ')]:[])])}),`entry:${i}:recall`);
  });
  entries.forEach((e,i)=>{
   const note=`${e.phrase||e.term} — ${e.meaning}. ${e.example} ${e.use||''}`;
   const phrase=clean(e.phrase||e.term);
   // Use whole-phrase production, not another question about the same sentence.
   if(phrase.split(' ').length>1&&!phrase.includes('/')&&!phrase.includes('…')&&lang!=='ja')add(orderQuestion(phrase,e.meaning,note,locale),`entry:${i}:combination`);
   else if(entries.length>1)add(mc(`Match this lesson entry to its meaning or use: “${clean(e.term)}”`,e.meaning,entries.filter((_,j)=>j!==i).map(x=>x.meaning),note,{optionsLang:'en-US',mode:'use'}),`entry:${i}:combination`);
  });
 }
 if(l.breakdown&&l.skill==='Grammar'){
  l.breakdown.tables.forEach((t,ti)=>t.rows.forEach((row,ri)=>{
   // Every row and target-language form is practised, not just the first verb.
   for(let ci=1;ci<row.length;ci++){
    const answer=row[ci];if(answer==='—'||answer.length>150)continue;
    const englishMetadata=/^(Ending sound|Focus|Interpretation|Meaning|Time order|Reason|Difference|Time|Strength|Appropriate interpretation|Reference|Use|Usage|Function|English|Translation)$/i.test(t.headers[ci]);
    const cue=`${t.caption}\n${t.headers[0]}: ${row[0]}\n${t.headers[ci]}: ____`;
    const note=`${t.headers[0]}: ${row[0]} → ${t.headers[ci]}: ${answer}. ${l.breakdown.pitfall}`;
    if(englishMetadata){const choices=t.rows.filter((_,j)=>j!==ri).map(r=>r[ci]).filter(x=>x!==answer&&x!=='—');if(choices.length)add(mc(`Choose the interpretation in this comparison.\n${cue}`,answer,choices,note,{mode:'contrast',optionsLang:'en-US'}),`table:${ti}:${ri}:${ci}`);}
    else if(/Example|Statement|Negative|Question|Result|perfect/i.test(t.headers[ci])&&answer.length>8)add(orderQuestion(answer,`${t.headers[ci]} for ${row[0]}`,note,locale),`table:${ti}:${ri}:${ci}`);
    else if(/Pattern|Form/i.test(t.headers[ci])&&answer.includes('+')){const alternatives=t.rows.filter((_,j)=>j!==ri).map(r=>r[ci]).filter(x=>x!==answer);if(alternatives.length)add(mc(`Choose the structure for: ${row[0]} (${t.caption}).`,answer,alternatives,note,{mode:'contrast',optionsLang:'en-US'}),`table:${ti}:${ri}:${ci}`);}
    else add(text(`Complete this part of the lesson's comparison.\n${cue}`,answer,note,{mode:'form'}),`table:${ti}:${ri}:${ci}`);
   }
  }));
  l.breakdown.examples.forEach(([sentence,meaning],i)=>add(orderQuestion(sentence,meaning,`${sentence} — ${meaning}. ${l.breakdown.pitfall}`,locale),`example:${i}`));
 }
 // Hand-authored transfer, correction and contrast items address exceptions and
 // rule application that conjugation grids alone cannot test.
 for(const [i,q] of (grammarPractice[l.id]||[]).entries())add(q,`application:${i}`);
 // Preserve useful original Spanish questions for non-reference lessons only.
 // International one-sentence form/meaning/audio triplets are replaced entirely.
 if(!entries&&!l.breakdown){for(const [i,q] of l.questions.entries())add({...q},`original:${i}`);}
 if(!qs.length)throw Error('No exercise coverage '+l.id);
 bank[l.id]=qs.map((q,i)=>({...q,...(q.type==='text'?{accepted:unique([...(q.accepted||[q.answer]),q.answer.replaceAll('do not',"don't").replaceAll('does not',"doesn't").replaceAll('did not',"didn't").replaceAll('was not',"wasn't").replaceAll('were not',"weren't").replaceAll('have not',"haven't").replaceAll('has not',"hasn't").replaceAll('had not',"hadn't")])}:{}),id:`${l.id}-exercise-v2-${i+1}`}));
}
writeFileSync('lesson-exercises.json',JSON.stringify(bank,null,2)+'\n');
console.log(Object.keys(bank).length+' lessons; '+Object.values(bank).reduce((n,q)=>n+q.length,0)+' questions');
