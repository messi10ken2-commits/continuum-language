import {localizeQualityBody} from './question-quality-copy.mjs';
import exerciseBank from './lesson-exercises.json' with {type:'json'};
import practicalBank from './practical-exercises.json' with {type:'json'};
import {practicalFormQuestions} from './practical-form-questions.mjs';
import {reviewedCourseTitles} from './reviewed-course-titles.mjs';
const locales=['en','ja','es','pt','zh','fr'];
const instruction={
 fill:['Complete the sentence. Type only the missing word or phrase.','文の意味と形に合うように空欄を埋めてください。入力するのは空欄の語句だけです。','Completa la oración. Escribe solo la palabra o expresión que falta.','Complete a frase. Digite apenas a palavra ou expressão que falta.','请补全句子，只填写空缺的单词或短语。','Complétez la phrase. Écrivez uniquement le mot ou le groupe de mots manquant.'],
 form:['Use the information below to produce the requested form. Type only that form, not its grammatical name.','下の情報をもとに、このレッスンで学んだ形を作ってください。文法用語ではなく、指定された語句・文だけを入力してください。','Con la información siguiente, forma la expresión solicitada según esta lección. Escribe la forma, no su nombre gramatical.','Use as informações abaixo para produzir a forma solicitada nesta lição. Digite a forma, não o nome gramatical.','根据以下信息，写出本课所学的指定形式。请填写实际的词语或句子，不要填写语法名称。','À partir des indications ci-dessous, donnez la forme demandée dans cette leçon. Écrivez la forme elle-même, pas son nom grammatical.'],
 verb:['Complete the sentence with the correct form of {0}. Type only the missing form.','{0}を適切な形にして空欄を埋めてください。入力するのは空欄の部分だけです。','Completa la oración con la forma adecuada de {0}. Escribe solo la forma que falta.','Complete a frase com a forma adequada de {0}. Digite apenas a forma que falta.','请用 {0} 的适当形式补全句子，只填写空缺部分。','Complétez la phrase avec la forme appropriée de {0}. Écrivez uniquement la forme manquante.'],
 interpretation:['Choose the interpretation supported by this expression.','この表現から読み取れる意味・判断として適切なものを選んでください。','Elige la interpretación que permite esta expresión.','Escolha a interpretação sustentada por esta expressão.','请选择该表达所支持的含义或判断。','Choisissez l’interprétation permise par cette expression.']};
const labels={Subject:['主語','Sujeto','Sujeito','主语','Sujet'],Base:['基本形','Forma base','Forma básica','基本形式','Forme de base'],Past:['過去形','Pasado','Passado','过去式','Passé'],Positive:['肯定形','Afirmativo','Afirmativa','肯定形式','Affirmatif'],Negative:['否定形','Negativo','Negativa','否定形式','Négatif'],Question:['疑問文','Pregunta','Pergunta','疑问句','Question'],'Short answer':['短い返答','Respuesta breve','Resposta curta','简短回答','Réponse courte'],Participle:['過去分詞','Participio','Particípio','过去分词','Participe passé'],Gerund:['進行形に使う動詞の形','Gerundio','Gerúndio','动词进行形式','Gérondif'],Dictionary:['辞書形','Forma de diccionario','Forma de dicionário','词典形','Forme du dictionnaire'],Stem:['語幹','Raíz','Radical','词干','Radical'],Polite:['丁寧形','Forma cortés','Forma polida','礼貌形式','Forme polie'],Nonpast:['非過去形','Forma no pasada','Forma não passada','非过去式','Forme non passée'],'Past negative':['過去の否定形','Pasado negativo','Passado negativo','过去否定式','Négatif au passé'],Conditional:['条件形','Condicional','Condicional','条件形式','Conditionnel'],Passive:['受身形','Pasiva','Passiva','被动形式','Passif'],Causative:['使役形','Causativa','Causativa','使役形式','Causatif'],Example:['例文','Ejemplo','Exemplo','例句','Exemple'],Verb:['動詞','Verbo','Verbo','动词','Verbe'],Infinitive:['不定詞','Infinitivo','Infinitivo','不定式','Infinitif'],Auxiliary:['助動詞','Auxiliar','Auxiliar','助动词','Auxiliaire'],Group:['グループ','Grupo','Grupo','类别','Groupe'],Type:['種類','Tipo','Tipo','类型','Type'],Condition:['条件を表す部分','Condición','Condição','条件部分','Condition'],Result:['結果を表す部分','Resultado','Resultado','结果部分','Résultat'],'Plain predicate':['普通形の述語','Predicado en forma llana','Predicado na forma simples','普通体谓语','Prédicat à la forme neutre']};
Object.assign(labels,{
 'Full form':['省略しない形','Forma completa','Forma completa','完整形式','Forme complète'],
 'Conversational form':['会話での縮約形','Forma coloquial','Forma coloquial','口语缩略形式','Forme familière'],
 'With possibility':['可能性を表す形','Forma de posibilidad','Forma de possibilidade','表示可能性的形式','Forme exprimant la possibilité'],
 'He / she / it':['he / she / itに対応する現在形','Presente con he / she / it','Presente com he / she / it','he / she / it 对应的现在时形式','Présent avec he / she / it'],
 'Eu present':['euの現在形','Presente con eu','Presente com eu','eu 的现在时形式','Présent avec eu'],
 'Subjunctive: eu / ela':['eu / elaの接続法現在','Presente de subjuntivo con eu / ela','Presente do subjuntivo com eu / ela','eu / ela 的虚拟式现在时','Présent du subjonctif avec eu / ela'],
 'Eles: past':['elesの完了過去形','Pretérito con eles','Pretérito perfeito com eles','eles 的简单过去时','Passé simple portugais avec eles'],
 'Eu / ela: future subjunctive':['eu / elaの接続法未来','Futuro de subjuntivo con eu / ela','Futuro do subjuntivo com eu / ela','eu / ela 的虚拟式将来时','Futur du subjonctif avec eu / ela'],
 'ter: subjunctive':['terの接続法現在','Presente de subjuntivo de ter','Presente do subjuntivo de ter','ter 的虚拟式现在时','Présent du subjonctif de ter']
});
const label=(value,locale)=>locale==='en'?value:labels[value]?.[locales.indexOf(locale)-1]||(value.includes(':')?value.split(':').map(x=>label(x.trim(),locale)).join(': '):value);
function make(q,key,body,answer=q.answer,extra={}){
 const prompts=Object.fromEntries(locales.map((locale,i)=>[locale,instruction[key][i]+'\n'+localizeQualityBody(typeof body==='function'?body(locale):body,locale)]));
 return {...q,prompt:prompts.en,promptTranslations:prompts,answer,accepted:q.type==='text'?(answer===q.answer?q.accepted||[answer]:[answer]):q.accepted,context:(typeof body==='string'?body.split('\n').find(line=>line.includes('____'))?.split(/\s+(?:Use |Write (?:only|the)|Begin )/)[0]:undefined)||q.context,qualityVersion:6,...extra};
}
const authored={
 'en-b2-v2-lesson-3':{
 'table:0:0:1':['Prices may decrease in the future. Complete the open condition.\nIf prices ____, we will move.','fall'],
 'table:0:1:1':['Imagine prices being lower now. Complete the unreal present condition.\nIf prices ____ lower, we would move.','were'],
 'table:0:2:1':['Imagine having permission now. Complete the unreal condition.\nIf we ____ permission, we could enter.','had'],
 'table:0:3:1':['Imagine a possible change to the schedule. Complete the remote condition.\nIf the schedule ____, I might attend.','changed']},
 'pt-b2-v2-lesson-3':{
 'table:0:0:1':['A lower price is a real future possibility.\nSe o preço ____ menor, vamos comprar.','for'],
 'table:0:1:1':['Imagine a lower price now.\nSe o preço ____ menor, compraríamos.','fosse'],
 'table:0:2:1':['Imagine having more time.\nSe ____ tempo, poderíamos conversar.','houvesse'],
 'table:0:3:1':['Give advice by imagining yourself in the other person’s situation.\nSe eu ____ você, esperaria.','fosse']},
 'en-a1-v2-lesson-5':{'table:0:3:1':['Use work to ask a subject question about the employee.\nWho ____ here?','works']},
 'en-a2-v2-lesson-6':{'table:0:1:1':['A short completed event interrupts an activity in progress. Use the past of ring.\nI was reading when the doorbell ____.','rang']},
 'ja-a1-v2-lesson-2':{'table:0:0:1':['Say politely that you are a student. Type the missing predicate.\n私は____。','学生です'],'table:0:1:1':['Connect the owner and object: the teacher’s bag.\n先生____かばん','の']}
};
const intentions={
 should:'Express an expected outcome, not a proven fact.',must:'Express a strong conclusion from the evidence.',"can't":'Express that the conclusion is impossible.',may:'Express an uncertain possibility.',could:'Express an ability in an imagined situation.',might:'Express a tentative possibility, not certainty.',have:'Complete the verb phrase referring to an unrealised past possibility.', 'going to':'Express a prediction based on visible evidence.'
};
const alternatives=(answer,body,accepted=[answer])=>[...new Set([...accepted,...({should:['ought to'],could:['would be able to'],might:['may','could'],may:/____\s+not/.test(body)?['might']:['might','could'],"can't":['cannot',"couldn't",'could not'],'going to':['about to'],porque:['ya que','puesto que'],'después':['luego','más tarde'],'行く':['いく']}[answer]||[])])];
export function qualityQuestion(base,q){
 const a=authored[base.id]?.[q.coverage];if(a){
  const key=base.id+':'+q.coverage;
  const aliases={
   'en-b2-v2-lesson-3:table:0:0:1':['drop','decrease'],
   'en-b2-v2-lesson-3:table:0:2:1':['were given','were granted'],
   'en-b2-v2-lesson-3:table:0:3:1':['were to change','were changed'],
   'ja-a1-v2-lesson-2:table:0:0:1':['がくせいです']
  };
  return make(q,'fill',a[0],a[1],{audio:undefined,audioSpeech:undefined,accepted:[a[1],...(aliases[key]||[])]});
 }
 if(q.type==='text'&&/^Complete this part of the lesson/.test(q.prompt)){
  const match=/^table:(\d+):(\d+):(\d+)/.exec(q.coverage||'');const table=match&&base.breakdown?.tables?.[+match[1]],row=table?.rows?.[+match[2]],col=match&&+match[3];
  if(!table||!row)return q;
  const header=table.headers[col];
  if(/^(Limit|Status)$/.test(header)){
   const options=[row[col],...table.rows.filter(r=>r[col]!==row[col]).slice(0,2).map(r=>r[col])];
   return make({...q,type:undefined,options,optionsRole:'comprehension',optionsLang:'en-US'},'interpretation',row[0],0);
  }
  const references=row.map((value,i)=>({value,i})).filter(({i})=>i!==col&&i!==0&&!/^(Meaning|Limit|Status|Ending sound)$/.test(table.headers[i]));
  const reference=references.find(x=>!/[+→/]/.test(x.value))||references[0];
  return make(q,'form',locale=>[
   reviewedCourseTitles[locale]?.[base.title]||base.title,
   ...(!['Group','Type','Role','Purpose'].includes(table.headers[0])&&!['Never','Be'].includes(row[0])?[label(table.headers[0],locale)+': '+row[0]]:[]),
   ...(reference?[label(table.headers[reference.i],locale)+': '+reference.value]:[]),
   label(header,locale)+': ____'
  ].join('\n'));
 }
 if(q.type==='text'){
  const trailing=/\s+Use ([\p{L}'’ ]+)\.$/u.exec(q.prompt);
  const cleanPrompt=trailing&&trailing[1].toLowerCase()===String(q.answer).toLowerCase()?q.prompt.slice(0,trailing.index):q.prompt;
  const m=/^Complete(?: [^:\n]+)? with ([^:]+):\s*([\s\S]+)$/.exec(cleanPrompt);
  if(m){const named=m[1].trim(),answer=String(q.answer).toLowerCase();
   if(named.toLowerCase()===answer){
    let body=m[2],accepted=q.accepted||[q.answer];
    if(answer==='play')body='Change the past-tense routine to the present: Yesterday the children played outside.\nThe children ____ outside after school.';
    else if(answer==='arrive')body='Change the past form arrived to fit a future time clause.\nI will text you when I ____.';
    else if(answer==='ser')body='Express: It may be a good idea.\nPode ____ uma boa ideia.';
    else if(answer==='chegar')body='Ask someone to let you know when they arrive.\nQuando você ____, avise.';
    else if(answer==='行く')body='Express: He might go too. Type the verb in Japanese.\n彼も____かもしれません。';
    else if(answer==='después')body='Link two events in chronological order.\nPrimero trabajé y ____ descansé.';
    accepted=alternatives(q.answer,body,accepted);
    return make(q,'fill',(intentions[answer]?intentions[answer]+'\n':'')+body,q.answer,{accepted});
   }
   return make(q,'verb',m[2],q.answer,{promptTranslations:Object.fromEntries(locales.map((l,i)=>[l,instruction.verb[i].replace('{0}',named.replace(/ (?:or|and) /g,' / '))+'\n'+m[2]])),prompt:instruction.verb[0].replace('{0}',named)+'\n'+m[2]});
  }
  // Trailing instructions that name the complete answer are replaced by its
  // communicative purpose, preserving real alternatives in the task itself.
  const tail=/\s+Use ([\p{L}'’ ]+)\.$/u.exec(q.prompt);
  if(tail&&tail[1].toLowerCase()===String(q.answer).toLowerCase())return make(q,'fill',(intentions[String(q.answer).toLowerCase()]||'Choose a form that fits the meaning of the sentence.')+'\n'+q.prompt.slice(0,tail.index).replace(/^[^:\n]+:\s*/,''),q.answer,{accepted:alternatives(q.answer,q.prompt,q.accepted)});
  const use=/^Use ([^ ]+) for [^:]+:\s*([\s\S]+)$/.exec(q.prompt);
  if(use&&use[1].toLowerCase()===String(q.answer).toLowerCase())return make(q,'fill',(intentions[String(q.answer).toLowerCase()]||'Express the intended meaning.')+'\n'+use[2],q.answer,{accepted:alternatives(q.answer,use[2],q.accepted)});
 }
 return q;
}
export const qualityQuestions=(base,questions)=>questions.map(q=>qualityQuestion(base,q));

export function qualityQuestionBank(base){
 const source=practicalBank[base.id]||exerciseBank[base.id]||[];
 return qualityQuestions(base,source.flatMap(q=>{const r=practicalFormQuestions[base.id]?.[q.coverage];return r?(Array.isArray(r)?r:[r]).map((item,i)=>({...item,sourceLesson:base.id,coverage:q.coverage,id:q.id+'-practical-'+i,promptLang:'en-US',optionsLang:item.optionsLang||q.optionsLang})):[q]}));
}
