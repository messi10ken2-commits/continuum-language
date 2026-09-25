// Shared curriculum and scoring contract. Content levels describe lesson difficulty, not learner certification.
const q=(prompt,options,answer,note,extra={})=>({prompt,options,answer,note,...extra});
const entry=(id,level,chapter,title,skill,explanation,example,questions,extra={})=>({id,level,chapter,title,skill,explanation,example,questions,minutes:6,...extra});
export const levels=[{id:'A1',name:'First conversations',description:'Introduce yourself, describe your world and order with confidence.'},{id:'A2',name:'Everyday independence',description:'Tell a short story, make plans and develop your ear for Spanish.'},{id:'B1',name:'Connected conversations',description:'Express uncertainty, explain reasons and connect your ideas.'},{id:'B2',name:'Nuance & real life',description:'Understand announcements, weigh arguments and discuss possibilities.'},{id:'C1',name:'Precision & perspective',description:'Interpret stance and choose language to suit your audience.'}];
export const chapters=[
 {id:'a1-hello',level:'A1',title:'Meet your world',goal:'Introduce people and describe how they are.'},
 {id:'a1-day',level:'A1',title:'Your everyday Spanish',goal:'Talk about routines and order in a café.'},
 {id:'a2-stories',level:'A2',title:'Stories & plans',goal:'Describe a finished day and arrange the next one.'},
 {id:'a2-sound',level:'A2',title:'Listen, stress, connect',goal:'Hear key details and practise Spanish word stress.'},
 {id:'b1-choice',level:'B1',title:'Purpose & uncertainty',goal:'Choose por or para and express doubt with the subjunctive.'},
 {id:'b1-express',level:'B1',title:'Make your point',goal:'Connect ideas and build a clear written message.'},
 {id:'b2-travel',level:'B2',title:'Listen beyond the textbook',goal:'Extract travel details and distinguish a speaker’s stance.'},
 {id:'b2-ideas',level:'B2',title:'Possibility & argument',goal:'Discuss hypothetical situations and qualify an argument.'},
 {id:'c1-register',level:'C1',title:'Choose your voice',goal:'Adjust register and interpret implied meaning.'},
 {id:'c1-precision',level:'C1',title:'Build a precise argument',goal:'Express reservations and organise a nuanced conclusion.'}
];
export const lessonList=[
 entry('introductions','A1','a1-hello','Meeting new people','Speaking','Use me llamo for your name, soy de for origin and vivo en for where you live. Practise the example aloud before checking the expressions.','Hola, me llamo Ana. Soy de México y vivo en Madrid.',[
 q('Choose: “My name is Ana.”',['Me llama Ana.','Me llamo Ana.','Soy en Ana.'],1,'Me llamo literally means “I call myself”.'),
 q('Soy ___ México.',['a','en','de'],2,'Use ser de to give your place of origin.'),
 q('Someone says “Mucho gusto”. A natural reply is…',['Igualmente.','Tengo veinte.','Hasta ayer.'],0,'Igualmente means “likewise” and returns the greeting.')],{speak:'Introduce yourself: say your name, where you are from and where you live.',pronunciationTarget:'Hola, me llamo Ana. Soy de México y vivo en Madrid.'}),
 entry('ser-estar','A1','a1-hello','Ser and estar','Grammar','Use ser for identity and characteristics; use estar for location and current states. This is a starting pattern, not simply “permanent versus temporary”.','Lucía es médica. Hoy está cansada. Está en casa.',[
 q('Lucía ___ médica.',['está','es','hay'],1,'A profession identifies someone: Lucía es médica.'),
 q('Las llaves ___ en la mesa.',['son','es','están'],2,'Use estar for the location of objects.'),
 q('Hoy nosotros ___ cansados.',['estamos','somos','estoy'],0,'Cansados describes how we feel today; nosotros takes estamos.')]),
 entry('daily-routine','A1','a1-day','A day in your life','Grammar','Regular -ar verbs change their endings with the subject: trabajo, trabajas, trabaja, trabajamos. Add time phrases to describe a routine.','Trabajo por la mañana y estudio español por la tarde.',[
 q('Yo ___ español cada día.',['estudio','estudia','estudian'],0,'The yo ending of estudiar is -o.'),
 q('Nosotros ___ en casa.',['trabajo','trabajamos','trabajas'],1,'Nosotros uses the -amos ending.'),
 q('Which means “in the afternoon”?',['Por la noche.','Por la mañana.','Por la tarde.'],2,'Por la tarde means in the afternoon or early evening.')]),
 entry('cafe','A1','a1-day','At the café','Listening','Listen for the item, size and request. Quiero is direct; quisiera is a common polite way to ask for something. Use por favor and gracias.','Quisiera un café con leche, por favor.',[
 q('What does the customer order?',['Tea with lemon.','Coffee with milk.','A glass of water.'],1,'Un café con leche is coffee with milk.',{audio:'Buenos días. Quisiera un café con leche, por favor.'}),
 q('What size does the customer choose?',['Small.','Medium.','Large.'],0,'Pequeño means small.',{audio:'¿Grande o pequeño? Pequeño, gracias.'}),
 q('Choose the polite request for the bill.',['Soy la cuenta.','¿Dónde soy?','La cuenta, por favor.'],2,'La cuenta, por favor is a common way to ask for the bill.')]),
 entry('past-events','A2','a2-stories','Yesterday’s story','Grammar','Use the pretérito for completed events: ayer visité, comí, salí. Keep the subject and time reference clear.','Ayer visité un museo y después comí con una amiga.',[
 q('Ayer yo ___ un museo.',['visito','visité','visitar'],1,'Visité is the completed first-person past form of visitar.'),
 q('El sábado nosotros ___ pizza.',['comer','comió','comimos'],2,'Comimos is the nosotros past form of comer.'),
 q('What happened first? “Visité el museo y después comí.”',['Visiting the museum.','Eating.','Both at the same time.'],0,'Después places eating after the museum visit.')]),
 entry('future-plans','A2','a2-stories','Make a plan','Speaking','Use ir a + infinitive for a plan: voy a estudiar. To invite someone, try ¿Quieres…? and add a time or place.','¿Quieres tomar un café mañana? Voy a estar en el centro.',[
 q('Mañana voy a ___ español.',['estudio','estudiar','estudié'],1,'After ir a, keep the next verb in the infinitive.'),
 q('Choose: “We are going to travel.”',['Vamos a viajar.','Voy a viajamos.','Vamos viajé.'],0,'Vamos a + infinitive describes our plan.'),
 q('A friend invites you. Accept and suggest a time.',['No sé dónde está.','Ayer fui al cine.','Sí, ¿a las cinco?'],2,'Sí accepts; ¿a las cinco? proposes a time.')],{speak:'Invite a friend for coffee tomorrow. Suggest a place and a time.',pronunciationTarget:'¿Quieres tomar un café mañana? Voy a estar en el centro.'}),
 entry('pronunciation','A2','a2-sound','Spanish rhythm workout','Pronunciation','Words ending in a vowel, n or s usually stress the next-to-last syllable; other endings usually stress the last. A written accent marks a different pattern. Listen, repeat and optionally record yourself. The recording check measures how closely speech recognition matches the model, not phoneme or accent quality.','Tengo el teléfono en casa.',[
 q('Which syllable is stressed in teléfono?',['te','lé','fo'],1,'The accent on é marks the stressed syllable: te-LÉ-fo-no.',{audio:'teléfono'}),
 q('Which syllable is stressed in ciudad?',['ciu','Both equally.','dad'],2,'Ciudad ends in d, so the last syllable is stressed: ciu-DAD.',{audio:'ciudad'}),
 q('Which syllable is stressed in música?',['mú','si','ca'],0,'The written accent marks MÚ-si-ca.',{audio:'música'})],{speak:'Repeat the model once, keeping the vowels clear.',pronunciationTarget:'Tengo el teléfono en casa.'}),
 entry('directions','A2','a2-sound','Find your way','Listening','Listen for direction words: derecha, izquierda and todo recto. Sequence words such as luego help you follow more than one instruction.','Sigue todo recto y luego gira a la izquierda.',[
 q('Which way should you turn?',['Right.','Left.','Back.'],1,'A la izquierda means to the left.',{audio:'En la próxima calle, gira a la izquierda.'}),
 q('What should you do first?',['Turn right.','Cross the bridge.','Go straight.'],2,'Sigue todo recto comes before luego gira.',{audio:'Sigue todo recto y luego gira a la derecha.'}),
 q('Where is the pharmacy?',['Beside the bank.','Inside the station.','Opposite the café.'],0,'Al lado del banco means beside the bank.',{audio:'La farmacia está al lado del banco.'})]),
 entry('porpara','B1','b1-choice','Por or para without pausing','Grammar','Use para for a purpose, intended recipient or deadline. Use por for a cause, exchange or route through a place. Choose from the meaning of the whole sentence.','Estudio para viajar. Gracias por tu ayuda.',[
 q('Estudio español ___ hablar con mis amigos.',['por','para','desde'],1,'Speaking with friends is the purpose: para + infinitive.'),
 q('Gracias ___ tu ayuda.',['para','a','por'],2,'Gracias por introduces what you are grateful for.'),
 q('Este regalo es ___ mi hermana.',['para','por','de'],0,'The intended recipient takes para.'),
 q('Paseamos ___ el parque antes de cenar.',['para','por','hacia'],1,'Por describes the route through or around the park.')]),
 entry('subjunctive','B1','b1-choice','Make the subjunctive automatic','Grammar','Expressions of doubt and possibility commonly take que + subjunctive. Contrast creo que viene with no creo que venga. Recall the form, then say a complete sentence.','Es posible que María venga mañana.',[
 q('Es posible que María ___ mañana.',['viene','venga','vendrá'],1,'Es posible que is followed by the subjunctive: venga.'),
 q('No creo que ellos ___ la respuesta.',['saben','sepan','sabrán'],1,'No creo que expresses doubt: sepan.'),
 q('Quizás ___ más tiempo esta tarde. (Treat it as uncertain.)',['tenemos','tengamos','tuvimos'],1,'The subjunctive tengamos presents the possibility as uncertain; quizás can also take the indicative in other contexts.'),
 q('Dudo que el vuelo ___ a tiempo.',['sale','salga','salió'],1,'Dudo que triggers the subjunctive: salga.'),
 q('Puede que no ___ suficiente.',['es','sea','será'],1,'Puede que takes the subjunctive: sea.')],{speak:'Say two uncertain plans using es posible que and puede que.',pronunciationTarget:'Es posible que María venga mañana.'}),
 entry('connectors','B1','b1-express','Connect your ideas','Reading','Porque gives a reason, por eso gives a result, and sin embargo introduces a contrast. Follow the relationship between ideas, not just the individual words.','Llovía mucho. Sin embargo, salimos a pasear.',[
 q('“Llovía mucho. Sin embargo, salimos.” What relationship is expressed?',['Cause.','Contrast.','Sequence.'],1,'Sin embargo contrasts the rain with the decision to go out.'),
 q('No había trenes. ___, tomamos un autobús.',['Aunque','Mientras','Por eso'],2,'Taking the bus is the result: por eso.'),
 q('Me quedé en casa ___ estaba enfermo.',['porque','por eso','sin embargo'],0,'Porque introduces the reason for staying home.')]),
 entry('travel-message','B1','b1-express','Write a clear travel message','Writing','Give your reason for writing, the relevant detail, and a clear request. Practise short controlled phrases before writing a longer message on your own.','Hola, llego a las ocho. ¿Podrías decirme cómo llegar al apartamento?',[
 q('Complete the polite request: “¿___ decirme la dirección?”',['Podrías','Podías ayer','Pudiste ayer'],0,'Podrías softens a request in the present.'),
 q('Type the missing word: “Llego ___ las ocho.”',null,'a','A introduces a clock time.',{type:'text',accepted:['a']}),
 q('Which closing fits a friendly request?',['Aunque no existe.','Gracias por tu ayuda.','No obstante el cual.'],1,'Gracias por tu ayuda closes the request politely.')],{speak:'Compose a short message aloud: give your arrival time and ask how to get to the apartment.',pronunciationTarget:'Hola, llego a las ocho. ¿Podrías decirme cómo llegar al apartamento?'}),
 entry('airport','B2','b2-travel','Airport conversations','Listening','Announcements often contain a correction or a change. Listen for the final gate, the revised time, and what passengers should do. You can replay or reveal the transcript.','El vuelo ha cambiado de puerta. Embarquen por la B dieciséis.',[
 q('What is the new gate?',['B12.','B16.','A16.'],1,'La nueva puerta es la B dieciséis.',{audio:'Atención, pasajeros. El vuelo a Madrid ya no sale por la puerta B doce. La nueva puerta es la B dieciséis.'}),
 q('When does boarding begin?',['18:20.','18:50.','19:20.'],1,'A las dieciocho cincuenta means 18:50.',{audio:'El embarque, previsto para las dieciocho veinte, comenzará finalmente a las dieciocho cincuenta.'}),
 q('What should passengers have ready?',['Only a passport.','Their luggage receipts.','Boarding pass and identity document.'],2,'Tarjeta de embarque and documento de identidad are both requested.',{audio:'Les rogamos que tengan preparados la tarjeta de embarque y un documento de identidad.'})]),
 entry('speaker-stance','B2','b2-travel','Hear the speaker’s position','Listening','Words such as aunque, si bien and aun así let a speaker acknowledge one point while maintaining another. Identify their final position.','Aunque la propuesta tiene ventajas, todavía necesita cambios.',[
 q('What is the speaker’s view?',['The proposal needs no changes.','It has benefits but needs changes.','It has no benefits.'],1,'Aunque acknowledges the advantages before the reservation.',{audio:'Aunque la propuesta tiene ventajas, creo que todavía necesita algunos cambios.'}),
 q('Does the speaker recommend the journey?',['Yes, despite the cost.','No, because of the cost.','Only if it is free.'],0,'Aun así introduces the recommendation despite the price.',{audio:'El viaje es bastante caro. Aun así, por la experiencia que ofrece, lo recomiendo.'}),
 q('Which point matters most to the speaker?',['The weather.','The price.','The location.'],2,'Lo que más valoro signals the main priority.',{audio:'El precio está bien, pero lo que más valoro es la ubicación.'})]),
 entry('hypotheticals','B2','b2-ideas','Imagine another possibility','Grammar','For a hypothetical present situation, pair si + imperfect subjunctive with the conditional: si tuviera tiempo, viajaría. Do not put the conditional directly after si in this pattern.','Si tuviera más tiempo, aprendería otro idioma.',[
 q('Si ___ más tiempo, viajaría más.',['tendría','tuviera','tengo ayer'],1,'Use imperfect subjunctive in the si clause: tuviera.'),
 q('Si viviera cerca, ___ todos los días.',['vendría','vino','venga'],0,'The imagined consequence takes the conditional: vendría.'),
 q('Which describes an unreal present possibility?',['Si llueve mañana, me quedo.','Ayer fui al parque.','Si fuera rico, viajaría por el mundo.'],2,'Fuera + viajaría builds a hypothetical situation.')]),
 entry('balanced-argument','B2','b2-ideas','Build a balanced argument','Reading','A balanced argument acknowledges a benefit and a limitation, then makes a justified recommendation. Distinguish a claim from the reason that supports it.','El transporte público reduce el tráfico; no obstante, necesita una mayor frecuencia.',[
 q('What limitation is mentioned in the example?',['Too many passengers drive.','Services should be more frequent.','Traffic cannot be reduced.'],1,'Necesita una mayor frecuencia identifies the limitation.'),
 q('Which phrase introduces a concession?',['Por último,','En primer lugar,','Si bien es cierto que…'],2,'Si bien es cierto que acknowledges a point before qualifying it.'),
 q('Which sentence supports “Debemos mejorar los autobuses”?',['Porque muchas zonas no tienen conexiones frecuentes.','Los autobuses son autobuses.','En conclusión, los autobuses.'],0,'It gives a specific reason for the recommendation.')]),
 entry('formal-register','C1','c1-register','Choose the right register','Writing','Match the relationship and purpose. Formal writing often uses precise requests and restrained wording. Formal does not mean unnecessarily complicated.','Le agradecería que me confirmara la recepción del documento.',[
 q('Which request best fits a formal email?',['Oye, dime si te llegó.','Le agradecería que confirmara la recepción.','¿Te llegó o qué?'],1,'Le agradecería + subjunctive is a courteous formal request.'),
 q('Choose a formal closing.',['Un beso enorme.','Nos vemos, tío.','Atentamente,'],2,'Atentamente is appropriate in formal correspondence.'),
 q('Complete: “Le agradecería que me ___ los detalles.”',['enviara','enviaría','enviar'],0,'The request uses imperfect subjunctive: enviara.')]),
 entry('implied-meaning','C1','c1-register','Read between the lines','Reading','Interpret stance from wording and context. A tentative recommendation can imply a concern without explicitly rejecting an idea. Avoid inferring more than the text supports.','La propuesta es ambiciosa; quizá convendría revisar los plazos antes de aprobarla.',[
 q('What concern is implied?',['The entire proposal is worthless.','The timeline may need revision.','Approval has already been granted.'],1,'Revisar los plazos suggests concern about timing; rejection is not stated.'),
 q('“No es que me oponga; me preocupa su viabilidad.” What is the reservation?',['Personal dislike.','The author’s identity.','Whether it can work in practice.'],2,'Viabilidad refers to practical feasibility.'),
 q('“Los resultados son prometedores, aunque preliminares.” What should the reader conclude?',['They are encouraging but not final.','They prove everything.','They are useless.'],0,'Preliminares qualifies the positive assessment.')]),
 entry('hedging','C1','c1-precision','Make a careful claim','Grammar','Use cautious wording when evidence is incomplete: cabe la posibilidad de que, parece indicar que, no necesariamente. Match the strength of the claim to the evidence.','Cabe la posibilidad de que los resultados cambien con una muestra mayor.',[
 q('Cabe la posibilidad de que los resultados ___.',['cambiarán','cambien','cambian siempre'],1,'This expression of possibility takes the subjunctive.'),
 q('Which claim is most cautious?',['La encuesta demuestra todo.','Es imposible que cambie.','Los datos parecen indicar una tendencia.'],2,'Parecen indicar signals a tentative interpretation.'),
 q('“No necesariamente implica una mejora” means…',['An improvement does not automatically follow.','An improvement is impossible.','An improvement is certain.'],0,'No necesariamente rejects certainty, not the possibility itself.')]),
 entry('synthesis','C1','c1-precision','Draw a nuanced conclusion','Writing','A synthesis brings together points and explains their relationship. A conclusion should follow from the evidence and preserve any relevant limitations.','En conjunto, los datos respaldan la propuesta, siempre que se tengan en cuenta sus limitaciones.',[
 q('Which phrase brings several findings together?',['Ayer por la tarde.','En conjunto,','A pesar de mí.'],1,'En conjunto signals an overall synthesis.'),
 q('Complete: “Siempre que se ___ en cuenta las limitaciones.”',['tienen','tendrán','tengan'],2,'Siempre que meaning “provided that” takes the subjunctive.'),
 q('Which conclusion preserves a limitation?',['La medida parece útil, aunque faltan datos a largo plazo.','La medida resolverá absolutamente todo.','Los datos no importan.'],0,'The first conclusion supports the measure while acknowledging missing evidence.')])
];
for(const chapter of chapters){const children=lessonList.filter(l=>l.chapter===chapter.id);lessonList.push(entry(chapter.id+'-checkpoint',chapter.level,chapter.id,'Chapter checkpoint','Checkpoint','Review both lessons, then check what you can recall. A score of 80% marks this checkpoint as mastered. You can retry any time.','Take your time and use the explanations after each answer.',children.flatMap(l=>l.questions),{checkpoint:true,minutes:8}));}
export const getLesson=id=>lessonList.find(l=>l.id===id);
export const lessonTitle=id=>getLesson(id||'subjunctive')?.title||'Previous practice';
export const forLesson=(attempts,id='subjunctive')=>attempts.filter(a=>(a.lesson||'subjunctive')===id);
export function validAnswer(q,a){return q.type==='text'?typeof a==='string'&&a.length<=150:Number.isInteger(a)&&a>=0&&a<q.options.length;}
const normal=s=>String(s).trim().toLocaleLowerCase('es').replace(/[.!?¿¡]+$/g,'').trim();
export function isCorrect(q,a){return q.type==='text'?(q.accepted||[q.answer]).some(x=>normal(x)===normal(a)):a===q.answer;}
export function gradeLesson(id,answers){const l=getLesson(id);if(!l||!Array.isArray(answers)||answers.length!==l.questions.length||!answers.every((a,i)=>validAnswer(l.questions[i],a)))throw new Error('Invalid completed exercise');const correct=answers.filter((a,i)=>isCorrect(l.questions[i],a)).length;return {score:Math.round(correct/l.questions.length*100),total:l.questions.length,correct};}
export function summarize(attempts){const out={};for(const a of attempts){const id=a.lesson||'subjunctive';const row=out[id]||(out[id]={lesson:id,best:0,latest:a.score,count:0});row.best=Math.max(row.best,a.score);row.count++;}return Object.values(out);}
