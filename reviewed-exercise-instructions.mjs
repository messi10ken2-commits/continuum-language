// Reviewed recurring instructions: keep the actual exercise sentence and named
// verb forms intact, while translating the task rather than the answer.
import {grammarPractice} from './grammar-practice.mjs';
import practicalBank from './practical-exercises.json' with {type:'json'};
const locales=['ja','es','pt','zh','fr'];
export const reviewedExerciseInstructions=Object.fromEntries(locales.map(l=>[l,{}]));
for(const q of [...Object.values(grammarPractice).flat(),...Object.values(practicalBank).flat()]){
 const match=/^Complete the result with ([\p{L}]+): (.*?)(?: Use (.*)\.| Subject: (.*)\.)?$/u.exec(q.prompt);
 if(!match)continue;
 const [,verb,sentence,use,subject]=match;
 const forms=use?.replace(' + participle',' + particípio');
 const extra=use?[
  use==='would'?'wouldを使ってください。':'ter＋過去分詞の形を使ってください。',
  use==='would'?'Usa would.':'Usa ter + participio.',
  use==='would'?'Use would.':`Use ${forms}.`,
  use==='would'?'请使用 would。':'请使用 ter＋过去分词。',
  use==='would'?'Utilisez would.':'Utilisez ter + participe passé.'
 ]:subject?[
  `主語は${subject}です。`,`El sujeto es ${subject}.`,`O sujeito é ${subject}.`,`主语是 ${subject}。`,`Le sujet est ${subject}.`
 ]:locales.map(()=>'');
 const translated=[
  `${verb}を適切な形にして、空欄を埋めてください。${extra[0]}\n${sentence}`,
  `Completa el resultado con la forma adecuada de ${verb}. ${extra[1]}\n${sentence}`,
  `Complete o resultado com a forma adequada de ${verb}. ${extra[2]}\n${sentence}`,
  `请用 ${verb} 的适当形式补全表示结果的部分。${extra[3]}\n${sentence}`,
  `Complétez le résultat avec la forme appropriée de ${verb}. ${extra[4]}\n${sentence}`
 ];
 locales.forEach((l,i)=>{reviewedExerciseInstructions[l][q.prompt]=translated[i]});
}
const scenario='You are emailing about a contract. Choose a polite request to clarify clause four by Wednesday, while allowing for a later reply if necessary.';
const oldScenario='Ask about clause four, leaving room for a delay if a Wednesday reply is impractical.';
const translations=[
 '契約書の4番目の条項について、水曜日までに説明してもらいたい場面です。期限が難しい可能性にも配慮した、丁寧な依頼を選んでください。',
 'Quieres pedir por correo una aclaración sobre la cuarta cláusula de un contrato antes del miércoles. Elige una petición cortés que admita una respuesta posterior si hace falta.',
 'Você quer pedir por e-mail um esclarecimento sobre a quarta cláusula de um contrato até quarta-feira. Escolha um pedido educado que permita uma resposta posterior, se necessário.',
 '你想通过邮件请对方在周三之前解释合同的第四条条款。请选择一种礼貌的请求方式，并体谅对方可能需要晚些回复。',
 'Vous souhaitez demander par courriel des précisions sur la quatrième clause d’un contrat d’ici mercredi. Choisissez une demande polie qui permette une réponse plus tardive si nécessaire.'
];
locales.forEach((l,i)=>{reviewedExerciseInstructions[l][scenario]=translations[i];reviewedExerciseInstructions[l][oldScenario]=translations[i]});
