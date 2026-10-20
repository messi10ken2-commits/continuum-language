// Original situational micro-lessons. These are not transcripts of third-party videos.
const situations={
 interview:{title:'Tell your story in an interview',description:'Handle follow-up questions, acknowledge limits and explain your impact.',level:'B2',contexts:[
 'The interviewer asks how your past work connects to this role. Link your experience to the job.',
 'Complete the phrase for a lesson learned: “That experience taught me to take ____.” Use the noun meaning responsibility for a result.',
 'Listen and write the complete sentence about the result of your work.',
 'Rebuild a question that asks the interviewer to explain how success is measured.',
 'You lack experience with one tool, but want to show a realistic way to learn it.',
 'Listen to the candidate. What does the candidate offer to explain?',
 'The interviewer asks about a disagreement. Choose a reply that shows how you resolved it.',
 'Listen and write the question about the next stage of recruitment.']},
 housing:{title:'Get a housing problem resolved',description:'Report faults, clarify charges and agree on repairs without losing important details.',level:'B1',contexts:[
 'A leak is recurring. Explain that the problem has returned after the repair.',
 'Complete the sentence asking for written confirmation. Fill in the missing word.',
 'Listen and write the sentence describing how the fault affects daily life.',
 'Rebuild the request for an itemised explanation of a charge.',
 'A contractor needs access. State a precise time when you can be at home.',
 'Listen to the tenant. What does the tenant want confirmed?',
 'The landlord asks for evidence of damage. Choose a helpful reply.',
 'Listen and write the request for a temporary solution.']},
 travel:{title:'Recover when travel plans change',description:'Clarify alternatives, protect your connection and confirm the final arrangement.',level:'B1',contexts:[
 'Your train has been cancelled. Ask about another route to your destination.',
 'Complete the sentence asking whether the ticket is valid. Fill in the missing word.',
 'Listen and write the sentence explaining why the connection matters.',
 'Rebuild the request to confirm that a booking change has no extra charge.',
 'You need accessible accommodation. Ask a specific question about step-free access.',
 'Listen to the traveller. What information is requested?',
 'A staff member offers a later departure. Accept it only if a stated condition is met.',
 'Listen and write the request for written confirmation of the new arrangement.']}
};
const languageRows={
 en:{
 interview:['My experience handling customer requests would help me in this role.','That experience taught me to take ownership.','We cut the waiting time by almost a third.','How would you measure success in the first three months?','I have not used that tool yet, but I have learned similar systems quickly.','I can walk you through the steps I took.','I listened to their concerns and we agreed on a workable compromise.','Could you tell me what the next stage involves?'],
 housing:['The leak has started again since the repair.','Could you confirm the appointment in writing?','The water keeps coming back, so I cannot use the cupboard.','Could you send me a breakdown of this charge?','I can be at home on Tuesday between two and four.','Could you confirm whether the repair is covered by the rent?','I can send dated photos showing the damage.','Is there a temporary solution while we wait for the repair?'],
 travel:['Is there another way to get to the same destination today?','Is this ticket still valid on the replacement service?','I have a connecting flight that I cannot afford to miss.','Could you confirm that there is no additional charge?','Does the room have step-free access from the entrance?','Which platform does the replacement train leave from?','That departure works if I can still make my connection.','Could you send the updated booking confirmation by email?']},
 pt:{
 interview:['Minha experiência com atendimento ao cliente pode contribuir para esta função.','Essa experiência me ensinou a assumir responsabilidades.','Conseguimos reduzir o tempo de espera em quase um terço.','Como vocês avaliam o desempenho nos primeiros três meses?','Ainda não usei essa ferramenta, mas aprendi sistemas parecidos rapidamente.','Posso explicar passo a passo como resolvi a situação.','Ouvi as preocupações da equipe e chegamos a um acordo viável.','Você poderia me explicar como será a próxima etapa?'],
 housing:['O vazamento voltou depois do conserto.','Você pode confirmar a visita por escrito?','A água continua entrando, então não consigo usar o armário.','Você pode me enviar o detalhamento dessa cobrança?','Posso estar em casa na terça, entre duas e quatro.','Você pode confirmar se o conserto está incluído no aluguel?','Posso enviar fotos com a data mostrando o estrago.','Tem alguma solução provisória enquanto esperamos o conserto?'],
 travel:['Tem outra maneira de chegar ao mesmo destino hoje?','Esta passagem ainda vale no transporte substituto?','Tenho uma conexão de voo que não posso perder.','Você pode confirmar que não haverá cobrança adicional?','Dá para chegar ao quarto sem subir degraus?','De qual plataforma sai o trem substituto?','Esse horário serve, desde que eu consiga fazer a conexão.','Você pode enviar a reserva atualizada por e-mail?']},
 es:{
 interview:['Mi experiencia en atención al cliente puede aportar valor a este puesto.','Esa experiencia me enseñó a asumir responsabilidades.','Conseguimos reducir el tiempo de espera en casi un tercio.','¿Cómo se evalúa el desempeño durante los primeros tres meses?','Todavía no he usado esa herramienta, pero he aprendido sistemas similares con rapidez.','Puedo explicar paso a paso cómo resolví la situación.','Escuché sus preocupaciones y llegamos a un acuerdo viable.','¿Podría explicarme en qué consiste la siguiente fase?'],
 housing:['La fuga ha vuelto después de la reparación.','¿Puede confirmar la visita por escrito?','Sigue entrando agua, así que no puedo utilizar el armario.','¿Puede enviarme un desglose de este cargo?','Puedo estar en casa el martes entre las dos y las cuatro.','¿Puede confirmar si la reparación está incluida en el alquiler?','Puedo enviar fotos con fecha que muestren los daños.','¿Hay alguna solución provisional mientras esperamos la reparación?'],
 travel:['¿Hay otra forma de llegar hoy al mismo destino?','¿Sigue siendo válido este billete en el servicio alternativo?','Tengo un vuelo de conexión que no puedo perder.','¿Puede confirmar que no hay ningún cargo adicional?','¿Se puede llegar a la habitación sin subir escalones?','¿De qué andén sale el tren alternativo?','Esa salida me viene bien siempre que pueda llegar a mi conexión.','¿Puede enviarme por correo la confirmación actualizada de la reserva?']},
 ja:{
 interview:['接客で培った経験を、この仕事でも生かせると考えています。','その経験から、責任を持って取り組むことの大切さを学びました。','待ち時間を約三分の一短縮できました。','入社後三ヶ月の成果は、どのように評価されますか。','そのツールは未経験ですが、似たシステムを短期間で習得した経験があります。','解決までの手順を、順を追ってご説明できます。','相手の懸念を聞き、双方が納得できる案で合意しました。','次の選考について教えていただけますか。'],
 housing:['修理していただいた後、また水漏れしています。','訪問日時を書面で確認していただけますか。','水が入ってくるので、棚を使えない状態です。','この請求の内訳を送っていただけますか。','火曜日の午後二時から四時でしたら、在宅できます。','修理費が家賃に含まれるか、確認していただけますか。','撮影日が分かる、被害の写真をお送りできます。','修理までの間、応急処置はできますか。'],
 travel:['今日中に同じ目的地に着く、別の経路はありますか。','この切符は代わりの便でも有効ですか。','乗り継ぎの飛行機に、どうしても間に合う必要があります。','追加料金がかからないか、確認していただけますか。','入口から部屋まで、段差なしで移動できますか。','代わりの列車は、何番線から出ますか。','乗り継ぎに間に合うのであれば、その便でお願いします。','変更後の予約確認を、メールで送っていただけますか。']}
};
const meanings={
 interview:['Link relevant experience to the role','Take responsibility for the outcome','Quantify an improvement','Ask how early performance is evaluated','Acknowledge a gap and explain transferable learning','Offer a step-by-step account','Show a mutually acceptable resolution','Ask about the next recruitment stage'],
 housing:['Report a recurring fault','Request written confirmation','Explain the practical impact of a fault','Request an itemised charge','Offer a precise access window','Clarify who covers repair costs','Offer dated photographic evidence','Ask for an interim remedy'],
 travel:['Request an alternative route','Check ticket validity after a disruption','Explain an essential onward connection','Confirm there is no extra charge','Check step-free access','Identify the departure platform','Accept an alternative subject to a condition','Request updated written confirmation']
};
const explanations={
 interview:['Connect an actual skill to the role; simply describing a previous job does not explain its relevance.','The missing expression means taking responsibility for what happens, not merely completing a task.','A measured reduction makes the impact concrete. Keep both the direction of change and the amount.','This asks for the criteria used to judge performance, rather than asking for the interview result.','Acknowledge the unfamiliar tool honestly, then support your ability to learn with relevant experience.','The candidate offers to describe the process step by step, not to guarantee a recruitment result.','Listening to concerns and agreeing on a workable solution demonstrates conflict resolution.','The question asks what happens next in recruitment; it does not ask whether the job is already secured.'],
 housing:['The problem has returned after a repair. A first report would omit the important fact that it is recurring.','Written confirmation creates a record of the appointment. The missing expression specifies the format.','The sentence explains why the fault matters by identifying something the tenant cannot use.','A breakdown itemises the charge. A total alone would not explain its components.','A specific day and time window lets the contractor plan access; it is not confirmation that entry is possible at any time.','The tenant asks whether the repair is included in the rent, so the issue is cost responsibility.','Dated photos provide evidence of the damage rather than merely repeating that a problem exists.','An interim solution helps before the full repair. It does not replace the request for a permanent fix.'],
 travel:['The request keeps the destination and the need to travel today, while allowing the route to change.','The missing word checks whether an existing ticket can still be used, rather than asking to buy another one.','The onward flight explains the urgency. Omitting the connection would remove the reason for the request.','The request confirms the absence of an extra charge, not simply the existence of a new booking.','Step-free access asks about a concrete accessibility requirement, rather than whether the room is generally convenient.','The traveller needs the departure platform, not the ticket price or arrival time.','The alternative is acceptable only if the connection remains possible. An unconditional acceptance loses this constraint.','The traveller asks for the changed arrangement to be confirmed by email, not for the original booking to be cancelled.']
};
// Cloze slots use language-specific wording and context; never require grammatical notation.
const cloze={
 en:{interview:['That experience taught me to take ____.','ownership'],housing:['Could you confirm the appointment in ____?','writing'],travel:['Is this ticket still ____ on the replacement service?','valid']},
 pt:{interview:['Essa experiência me ensinou a assumir ____.','responsabilidades'],housing:['Você pode confirmar a visita por ____?','escrito'],travel:['Esta passagem ainda ____ no transporte substituto?','vale']},
 es:{interview:['Esa experiencia me enseñó a asumir ____.','responsabilidades'],housing:['¿Puede confirmar la visita por ____?','escrito'],travel:['¿Sigue siendo ____ este billete en el servicio alternativo?','válido']},
 ja:{interview:['その経験から、____を持って取り組むことの大切さを学びました。','責任'],housing:['訪問日時を____で確認していただけますか。','書面'],travel:['この切符は代わりの便でも____ですか。','有効']}
};
const outcome={interview:['An explanation of the steps taken','A guarantee of immediate employment','A request to cancel the interview'],housing:['Whether the rent covers the repair','Whether the tenant must move out today','Whether the appointment has already happened'],travel:['The departure platform','The passenger’s passport number','The price of a hotel room']};
const contextsFor=(scene,index)=>index===1?'Complete the missing word so the sentence matches the situation.':situations[scene].contexts[index];
export const expandedPremiumCourses=Object.entries(languageRows).flatMap(([language,scenes])=>Object.entries(scenes).map(([scene,lines])=>{
 const s=situations[scene],questions=lines.map((line,i)=>{
 const note='Choose language that addresses the stated situation and preserves the speaker’s intent.';
 if(i===1)return {type:'cloze',prompt:contextsFor(scene,i),context:cloze[language][scene][0],answer:cloze[language][scene][1],note:'The missing word completes the expression used for this purpose.'};
 if(i===2||i===7)return {type:'typing',prompt:'Type the sentence you hear.',context:'',audio:line,answer:line,note:'Check the wording against the recording. Punctuation and capitalisation do not affect the score.'};
 if(i===3)return {type:'reorder',prompt:s.contexts[i],context:'',separator:language==='ja'?'':' ',tokens:language==='ja'?({interview:['入社後三ヶ月の成果は、','どのように','評価されますか。'],housing:['この請求の','内訳を','送っていただけますか。'],travel:['追加料金が','かからないか、','確認していただけますか。']})[scene].reverse():line.split(' ').reverse(),answer:line,note:'The request asks for a specific detail rather than a general explanation.'};
 if(i===5)return {type:'listening',prompt:s.contexts[i],context:'',audio:line,options:outcome[scene],answer:0,note:'The answer must match the purpose of the spoken request.'};
 const options=[line,lines[(i+1)%8],lines[(i+4)%8]],offset=(i+1)%3;
 return {type:'choice',prompt:s.contexts[i],context:'',options:[...options.slice(offset),...options.slice(0,offset)],answer:(3-offset)%3,note};
 });
 return {id:`${language}-premium-${scene}-v1`,language,title:s.title,description:s.description,level:s.level,scene,examples:lines.slice(0,2),vocabulary:lines.map((phrase,i)=>({phrase,meaning:meanings[scene][i]})),questions:questions.map((q,i)=>({...q,note:explanations[scene][i]}))};
}));
