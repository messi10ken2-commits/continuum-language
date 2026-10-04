// Original application questions. Correct option comes first in source tuples.
// Never change v1 content/order: saved seeds reproduce the same test on resume.
const Q=(prompt,right,wrong1,wrong2,note,audio)=>({prompt,options:[right,wrong1,wrong2],answer:0,note,...(audio?{audio}:{})});
export const transferBank={
'a1-hello':[
 Q('At a club, introduce yourself and say where you live.','Me llamo Leo y vivo en Quito.','Me llama Leo y vive en Quito.','Soy llamo Leo y soy en Quito.','Use me llamo for your name and vivo en for residence.'),
 Q('Your new colleague asks your origin, not your current location.','Soy de Chile.','Estoy en Chile.','Voy a Chile.','Soy de states origin; estoy en states location.'),
 Q('A friend feels ill today. Complete: Hoy Marta ___ enferma.','está','es','hay','Use estar for a current condition.'),
 Q('Introduce your brother’s occupation: Mi hermano ___ enfermero.','es','está','hay','Professions normally use ser.'),
 Q('You are at the station. Tell a friend where you are.','Estoy en la estación.','Soy la estación.','Tengo la estación.','Estar en locates a person.'),
 Q('Someone says “Mucho gusto” after hearing your name. What fits?','Encantada.','Tengo treinta años.','Está cerrado.','Encantada responds naturally to an introduction.')
],
'a1-day':[
 Q('Describe a daily habit: Cada mañana yo ___ agua.','bebo','bebes','beben','Yo takes bebo.'),
 Q('Your friend asks when you work. Say “in the afternoon”.','Trabajo por la tarde.','Trabajo ayer.','Trabajo una vez el año pasado.','Por la tarde identifies part of the day.'),
 Q('Order bread politely in a bakery.','Un pan, por favor.','Soy un pan.','El pan vive aquí.','A noun with por favor makes a simple polite order.'),
 Q('The waiter asks “¿Algo más?” You want nothing else.','No, gracias.','Mucho gusto.','Soy de aquí.','No, gracias declines an additional order.'),
 Q('Your neighbours walk to work each day: Ellos ___ al trabajo.','caminan','camino','caminas','Ellos takes the plural ending -an.'),
 Q('You finished lunch and want to pay.','La cuenta, por favor.','La puerta, por favor.','La mañana, por favor.','La cuenta is the bill.')
],
'a2-stories':[
 Q('Report a finished event: Anoche Elena ___ una carta.','escribió','escribirá','va a escribir','Anoche places this completed event in the past.'),
 Q('You already bought tickets for next week. State the plan.','Vamos a visitar Toledo el lunes.','Visitamos Toledo ayer.','Antes visitábamos Toledo.','Ir a + infinitive expresses a plan.'),
 Q('Put these events in order: Primero cenamos; después salimos. What came first?','Dinner.','Going out.','They happened simultaneously.','Primero precedes después.'),
 Q('Reply with a completed action: ¿Compraste las entradas ayer?','Sí, las compré por internet.','Sí, las compraré mañana.','Sí, voy a comprarlas el mes próximo.','Compré answers a question about a completed purchase.'),
 Q('Arrange a meeting: ¿___ a las seis delante del cine?','Quedamos','Quedé ayer','Has quedado ayer','Quedamos can propose a future arrangement.'),
 Q('Your trip is tomorrow. Complete: Mañana ___ a salir temprano.','voy','fui','era','Voy a + infinitive expresses the future plan.')
],
'a2-sound':[
 Q('The announcement changes a platform. Which platform should you use?','Three.','Two.','Five.','Finalmente introduces the corrected platform.','El tren saldrá finalmente del andén tres, no del dos.'),
 Q('Where is the bakery?','After the bridge, on the left.','Before the bridge, on the right.','Inside the station.','Después del puente and a la izquierda locate it.','Cruza el puente y gira a la izquierda. Allí está la panadería.'),
 Q('Say “teléfono”. Which syllable carries the written accent?','lé','te','fo','The accent mark identifies the stressed syllable lé.'),
 Q('A visitor asks how to get to the park. Which instruction means “go straight”?','Sigue todo recto.','Vuelve a casa.','Gira a la derecha.','Todo recto means straight ahead.'),
 Q('In “café”, which syllable is stressed?','fé','ca','Both equally.','The written accent marks final stress.'),
 Q('What must the passenger do?','Change buses at the square.','Walk all the way home.','Stay on the same bus.','Cambiar de autobús means transfer to another bus.','Para llegar al hospital, cambia de autobús en la plaza.')
],
'b1-choice':[
 Q('Explain a destination for an object: He comprado estas flores ___ mi vecina.','para','por','durante','Para introduces the intended recipient.'),
 Q('A broken lift caused your delay: Llegué tarde ___ la avería.','por','para','hacia','Por introduces the cause.'),
 Q('You doubt a shop is open: No creo que la tienda ___ abierta.','esté','está','estuvo','Negated belief triggers the subjunctive esté.'),
 Q('You have a goal: Ahorro ___ hacer un curso.','para','por','desde','Para + infinitive expresses purpose.'),
 Q('The delivery is uncertain: Puede que el paquete ___ hoy.','llegue','llega','llegó','Puede que takes the subjunctive.'),
 Q('You know the answer as a fact: Creo que ella ___ la dirección.','sabe','sepa','sabiendo','Affirmative creo que normally presents an indicative assertion.')
],
'b1-express':[
 Q('You were tired but attended: Estaba cansado; ___, fui a la reunión.','sin embargo','por eso','además de','Sin embargo introduces the contrast.'),
 Q('Explain why you missed a bus: Perdí el autobús ___ salí tarde.','porque','aunque','para que','Porque introduces a cause.'),
 Q('Write to a hotel to ask about arrival after midnight.','¿Sería posible entrar después de medianoche?','Entré ayer antes del mediodía.','La habitación tiene dos camas.','A clear question states the information you need.'),
 Q('Your train was cancelled, so you took a taxi. Choose the link.','Cancelaron el tren; por eso tomé un taxi.','Cancelaron el tren; aunque tomé un taxi.','Cancelaron el tren; para tomé un taxi.','Por eso connects cause and consequence.'),
 Q('A host needs to know your new arrival time. Which message gives it clearly?','El vuelo se retrasa; llegaré sobre las diez.','Mi vuelo es muy grande.','Me gusta mucho viajar.','Give the problem and the revised time.'),
 Q('Add a second benefit: El piso es luminoso. ___, está cerca del metro.','Además','En cambio','Por culpa de','Además adds another supporting point.')
],
'b2-travel':[
 Q('Which desk should passengers visit?','Desk seven.','Desk four.','The information desk outside.','The correction replaces four with seven.','La facturación se ha trasladado del mostrador cuatro al siete.'),
 Q('What does the speaker recommend?','Book despite the small rooms.','Avoid the hotel entirely.','Wait until rooms are larger.','Aun así introduces a recommendation despite a reservation.','Las habitaciones son pequeñas. Aun así, por la ubicación y el precio, reservaría allí.'),
 Q('What is the final departure time?','Quarter past nine.','Half past eight.','Quarter to nine.','The later time is the revised departure.','La salida de las ocho y media se retrasa hasta las nueve y cuarto.'),
 Q('What matters most to the speaker?','Reliability.','The cheapest fare.','The number of stops.','Lo fundamental highlights the main criterion.','No es el servicio más barato, pero lo fundamental para mí es que sea fiable.'),
 Q('What must travellers show?','Their reservation and passport.','Only their suitcase.','A restaurant receipt.','Both documents are explicitly requested.','Tengan a mano la reserva y el pasaporte antes de llegar al control.'),
 Q('How does the speaker view the plan?','Useful, provided the timetable improves.','Perfect as it stands.','Useless under all circumstances.','Siempre que makes the support conditional.','El plan puede funcionar, siempre que ajustemos los horarios a la demanda real.')
],
'b2-ideas':[
 Q('Imagine a situation that is not true now: Si el alquiler ___ menos, me mudaría.','costara','costaría','costará','Si + imperfect subjunctive pairs with the conditional.'),
 Q('You lack a car. State an imagined consequence of having one.','Si tuviera coche, podría llevarte.','Si tendría coche, pude llevarte.','Si tuve coche ayer, te llevo siempre.','Tuviera + podría describes an unreal present possibility.'),
 Q('Recommend an app while acknowledging a limitation.','Es útil para repasar, aunque no sustituye la conversación.','Como es útil, resuelve cualquier dificultad.','No tiene conversación, por tanto nada sirve.','A balanced claim states a benefit and a limit.'),
 Q('Support a proposal to add evening buses.','Muchos empleados terminan después del último servicio.','Los autobuses tienen ventanas.','La propuesta se llama propuesta.','The reason directly supports the need for later services.'),
 Q('Complete the imagined result: Si supiéramos la fecha, ___ los billetes.','compraríamos','compramos ayer','compráramos','The consequence takes the conditional.'),
 Q('“Si bien la medida reduce costes, aumenta la espera.” What is acknowledged first?','A saving.','A shorter queue.','A complete failure.','Si bien introduces the concession before the drawback.')
],
'c1-register':[
 Q('Ask a public office to clarify a requirement.','Le agradecería que aclarara qué documentos se requieren.','Oye, aclara eso ya.','No pienso leer los requisitos.','A formal indirect request suits an unfamiliar institution.'),
 Q('“El calendario parece optimista; convendría prever un margen.” What is implied?','The schedule may allow too little time.','The project has definitely been rejected.','Every deadline has already been missed.','The wording raises a timing concern without asserting failure.'),
 Q('Choose a restrained formal disagreement.','Comprendo el planteamiento, aunque discrepo de la conclusión.','Eso es una tontería y ya está.','Da igual lo que diga el informe.','Acknowledge the position and identify the disagreement precisely.'),
 Q('“Sería deseable contar con más información antes de decidir.” What is requested?','More evidence before a decision.','Immediate unconditional approval.','Permanent cancellation.','The tentative phrasing still communicates a clear need.'),
 Q('Complete a formal request: Le rogaría que ___ el importe.','revisara','revisaría','revisando','Le rogaría que takes imperfect subjunctive.'),
 Q('A review calls a report “interesante, aunque desigual”. Which reading is justified?','It has merit but uneven quality.','It is uniformly excellent.','It contains no useful ideas.','Aunque desigual qualifies the praise.')
],
'c1-precision':[
 Q('A small survey suggests a trend. Which claim matches that evidence?','Los resultados sugieren una tendencia que habrá que contrastar.','La encuesta prueba una ley universal.','La tendencia queda garantizada para siempre.','Suggestive evidence supports a qualified claim.'),
 Q('Complete: Es posible que la muestra no ___ representativa.','sea','es','será','Es posible que introduces the subjunctive.'),
 Q('One study finds savings; another reports worse access. Choose a synthesis.','Hay ahorro, pero debe valorarse junto con la pérdida de acceso.','Ambos estudios prueban que no hay inconvenientes.','Solo importa el estudio favorable.','A synthesis relates both findings.'),
 Q('A policy is acceptable only with safeguards: La apoyaremos siempre que se ___ las garantías.','mantengan','mantienen','mantendrán','Conditional siempre que takes the subjunctive.'),
 Q('“No cabe descartar un efecto indirecto.” What is the strength of the claim?','An indirect effect remains possible.','An indirect effect is proven.','An indirect effect is impossible.','No cabe descartar leaves a possibility open.'),
 Q('Choose a conclusion with an explicit evidence limit.','El programa parece eficaz a corto plazo; falta evaluar su continuidad.','El programa funcionará en todo contexto.','Una mejora inicial demuestra eficacia eterna.','The time limit prevents overgeneralisation.')
],
'a1-verb-lab':[
 Q('Describe your work: Yo ___ bicicletas en una tienda.','reparo','reparas','reparan','Regular -ar with yo ends in -o.'),
 Q('Ask two friends: ¿Vosotros ___ cerca?','vivís','vives','viven','Vosotros of vivir is vivís.'),
 Q('Describe a group: Mis primos ___ verduras.','comen','comes','como','Ellos of comer is comen.'),
 Q('Say what you can do: Yo ___ ayudarte ahora.','puedo','podo','puede','Poder changes o to ue in puedo.'),
 Q('Your sister leaves home: Ella ___ a las ocho.','sale','salo','sales','Salir uses sale for ella; salgo is the yo form.'),
 Q('You want water: Yo ___ agua.','quiero','quero','quiere','Querer changes e to ie in quiero.')
],
'a2-past-lab':[
 Q('A finished purchase: El martes ___ una lámpara.','compré','compraré','compro mañana','A completed past event takes the preterite.'),
 Q('A childhood habit: De niño, ___ con mis primos cada verano.','jugaba','jugaré','he jugado mañana','Repeated past habits use the imperfect.'),
 Q('Set the scene: ___ de noche cuando sonó el teléfono.','Era','Será','Sería mañana','The imperfect describes the background.'),
 Q('Complete a finished journey: Ayer mis amigas ___ al teatro.','fueron','irán','van mañana','Ir has irregular preterite fueron.'),
 Q('An interruption: Mientras cocinaba, alguien ___ a la puerta.','llamó','llamará','llama mañana','A completed interruption uses the preterite.'),
 Q('Describe an old home: Antes nuestra casa ___ un jardín.','tenía','tendrá','ha tenido mañana','Tenía describes an ongoing state in the past.')
],
'b1-perfect-lab':[
 Q('Report a recent result: Ya ___ terminado la reparación.','hemos','somos','estamos','Present perfect uses haber + participle.'),
 Q('The train left before you arrived: Cuando llegué, el tren ya ___.','había salido','saldrá','ha salir','Había salido places departure before a past arrival.'),
 Q('Complete the participle: ¿Has ___ el correo?','escrito','escribido','escribiendo','Escribir has irregular participle escrito.'),
 Q('You had not met her before the party: Nunca la ___ visto antes de aquella fiesta.','había','he mañana','estoy','Past perfect locates the experience before a past reference point.'),
 Q('Tell someone the door is now open after your action: He ___ la puerta.','abierto','abrido','abriendo','Abrir has participle abierto.'),
 Q('We had already eaten when guests arrived.','Ya habíamos comido cuando llegaron.','Ya comeremos cuando llegaron.','Ya hemos comer cuando llegaron.','Habíamos comido expresses the earlier past action.')
],
'b1-future-lab':[
 Q('Make a prediction: Dentro de diez años la ciudad ___ más grande.','será','fue','era','The future of ser is será.'),
 Q('Ask politely for help: ¿___ explicarme este formulario?','Podría','Pudo ayer','Podía ayer','Podría softens a present request.'),
 Q('Promise a future action: Mañana te ___ la respuesta.','diré','dicí','digo ayer','Decir has irregular future stem dir-.'),
 Q('Explain a preference in an imagined situation: Yo ___ una habitación tranquila.','preferiría','preferí ayer','prefiriendo','Conditional preferiría expresses would prefer.'),
 Q('Future obligation: El próximo mes ___ que renovar el permiso.','tendremos','tuvimos','teníamos ayer','Tener uses future stem tendr-.'),
 Q('You would leave earlier if possible. Complete: Yo ___ antes.','saldría','saliría','saldriendo','Salir uses conditional stem saldr-.')
],
'b2-mood-lab':[
 Q('Request action: Quiero que vosotros ___ la ventana.','cerréis','cerráis','cerrasteis','Present subjunctive of cerrar with vosotros is cerréis.'),
 Q('Express doubt: Dudo que ellos ___ toda la historia.','conozcan','conocen','conocerán','Conocer uses conozc- in the present subjunctive.'),
 Q('Report a past wish: Querían que nosotros ___ con ellos.','fuéramos','iremos','íbamos mañana','A past wish takes imperfect subjunctive fuéramos.'),
 Q('Imagine ability: Si ella ___ conducir, vendría sola.','supiera','sabría','sabe ayer','Si with an unreal present condition takes supiera.'),
 Q('A present recommendation: Es mejor que tú ___ despacio.','conduzcas','conduces','conducirás','The recommendation requires present subjunctive.'),
 Q('A past request: Me pidió que le ___ un mensaje.','enviara','enviaré','envío','Pidió que is followed here by imperfect subjunctive.')
],
'c1-perfect-mood':[
 Q('Doubt about a completed action: No creo que ___ recibido la notificación todavía.','hayan','habían','han','Present perfect subjunctive uses hayan + participle.'),
 Q('Regret an unreal past: Si ___ reservado antes, habríamos pagado menos.','hubiéramos','hayamos','hemos','Hubiéramos reservado creates a counterfactual past condition.'),
 Q('React to completed news: Me alegra que ___ encontrado trabajo.','hayas','has','habías','Emotion about a completed event takes hayas encontrado.'),
 Q('Past impossibility: Era imposible que él ___ terminado antes de nuestra llegada.','hubiera','ha','haya mañana','Hubiera terminado places the action before a past reference.'),
 Q('Choose the counterfactual consequence: Si me hubieran avisado, ___.','habría cambiado mis planes','cambiaré ayer mis planes','he cambiar mis planes','The unreal past consequence uses habría + participle.'),
 Q('A possible completed mistake: Puede que nos ___ equivocado de fecha.','hayamos','hemos','habíamos','Puede que takes subjunctive; hayamos equivocado marks completion.')
],
'a1-word-lab':[
 Q('You want a drink made from fruit. Ask for…','un zumo','un tenedor','una acera','Zumo means juice.'),
 Q('You need bread. Where do you go?','A la panadería.','A la farmacia.','Al aparcamiento.','A panadería sells bread.'),
 Q('You want to buy medicine.','Busco una farmacia.','Busco una estación.','Busco una playa.','Farmacia is a pharmacy.'),
 Q('Ask for water without bubbles.','Agua sin gas, por favor.','Agua con gas, por favor.','Una servilleta, por favor.','Sin gas means still water.'),
 Q('The museum is opposite the bank.','El museo está enfrente del banco.','El museo está dentro del banco.','El museo es un banco.','Enfrente de means opposite.'),
 Q('You need something to eat soup with.','Una cuchara.','Una maleta.','Un billete.','Cuchara means spoon.')
],
'a2-word-lab':[
 Q('Your hotel booking is for the wrong night.','Quisiera cambiar la fecha de la reserva.','Quisiera cambiar mi apellido por una maleta.','Quisiera pedir la cuenta del tren.','Fecha de la reserva identifies the booking date.'),
 Q('You need a ticket to go and come back.','Un billete de ida y vuelta.','Un billete solo de ida.','Una tarjeta de embarque usada.','Ida y vuelta means return travel.'),
 Q('A work task is due on Friday. What is Friday?','El plazo de entrega.','El lugar de descanso.','El sueldo mensual.','Plazo de entrega is the deadline.'),
 Q('You want to enrol in a course.','Quiero matricularme en el curso.','Quiero despedir el curso.','Quiero perder el curso en la estación.','Matricularse en means enrol in.'),
 Q('You must send a job application with your experience.','Adjunto mi currículum.','Adjunto mi postre.','Adjunto mi andén.','Currículum summarises qualifications and experience.'),
 Q('Your bag did not arrive at the airport.','Quisiera comunicar la pérdida de mi equipaje.','Quisiera reservar una mesa.','Quisiera entregar los deberes.','Equipaje refers to luggage.')
],
'a1-expressions-social':[
 Q('A stranger introduces herself at your course.','Mucho gusto.','De nada.','Tengo hambre.','Mucho gusto belongs to introductions.'),
 Q('Someone thanks you for holding the door.','De nada.','Lo siento por tu nombre.','Hasta ayer.','De nada responds to thanks.'),
 Q('You did not hear a price.','¿Puede repetirlo, por favor?','No necesito escuchar nunca.','Mucho gusto por el precio.','Ask for repetition politely.'),
 Q('You cannot follow rapid speech.','Más despacio, por favor.','Más lejos, por favor.','Más caro, por favor.','Más despacio requests a slower pace.'),
 Q('You do not understand an instruction.','No entiendo.','De nada.','Mucho gusto.','No entiendo signals a need for clarification.'),
 Q('Ask a classmate to repeat an address.','¿Puedes repetir la dirección, por favor?','De nada por la dirección.','Mucho gusto de dirección.','Puedes repetir asks for repetition; por favor keeps the request polite.')
],
'a1-expressions-daily':[
 Q('You have not eaten all day.','Tengo hambre.','Soy hambre.','Hago hambre.','Hunger is expressed with tener hambre.'),
 Q('You need a drink after walking.','Tengo sed.','Estoy sed.','Soy sed.','Use tener sed for thirst.'),
 Q('You need to leave immediately to catch a bus.','Tengo prisa.','Hago prisa.','Soy prisa.','Tener prisa means to be in a hurry.'),
 Q('Say when you have breakfast: ___ desayuno en casa.','Por la mañana','De la mañana por','A mañana por','Por la mañana means in the morning.'),
 Q('You feel ready for bed.','Tengo sueño.','Soy sueño.','Hago sueño.','Tener sueño means to feel sleepy.'),
 Q('Suggest a walk after lunch.','Vamos a dar un paseo.','Vamos a tener un paseo.','Vamos a poner un paseo.','Dar un paseo is the natural combination for taking a walk.')
],
'a2-expressions-plans':[
 Q('Suggest meeting on Saturday.','¿Qué te parece si quedamos el sábado?','¿Qué te parece si quedando el sábado?','¿Qué parece tú sábado?','Qué te parece si + clause proposes an arrangement.'),
 Q('A friend apologises for arriving two minutes late. Reassure them.','No pasa nada.','No vale nada tu vida.','Nunca pasa el autobús.','No pasa nada reassures someone about a minor issue.'),
 Q('Ask someone to open a heavy door.','¿Me puedes ayudar?','¿Me puedes repetir tu nombre?','¿Te viene bien el sábado?','Me puedes ayudar requests practical assistance.'),
 Q('Confirm a meeting place: Entonces, ¿___ en la entrada?','quedamos','quedando','quedarse','Quedamos can confirm an arrangement.'),
 Q('You cannot attend and propose another time.','Hoy no puedo; ¿te viene bien mañana?','Hoy no puedo; ayer mañana nunca.','Hoy no puedo; te vienes bueno.','Te viene bien asks whether a time suits someone.'),
 Q('A friend asks whether they may sit beside you. Agree warmly.','Por supuesto.','No pasa nadie.','No tengo ganas de salir.','Por supuesto expresses confident permission or agreement.')
],
'a2-expressions-stories':[
 Q('You do an activity occasionally.','La hago de vez en cuando.','La hago sin ninguna vez.','La hago todas las horas siempre.','De vez en cuando means occasionally.'),
 Q('You reached the bus just before it left.','Llegué a tiempo.','Llegué fuera de lugar.','Llegué de memoria.','A tiempo means in time.'),
 Q('A holiday was enjoyable.','Lo pasé muy bien.','Lo pasé muy caro.','Lo pasé muy pronto de precio.','Pasarlo bien describes enjoying an experience.'),
 Q('You began learning two years ago and still learn.','Llevo dos años aprendiendo.','Llevo dos años aprender.','Llevo dos años aprendido.','Llevar + duration + gerund expresses ongoing duration.'),
 Q('You want to ask the guide about the building.','¿Puedo hacer una pregunta?','¿Puedo cometer una pregunta?','¿Puedo pasar una pregunta bien?','Hacer una pregunta is the natural collocation.'),
 Q('You entered the wrong date on a form.','Cometí un error en la fecha.','Hice una pregunta en la fecha.','Pasé bien la fecha.','Cometer un error means make a mistake.')
],
'b1-expressions-conversation':[
 Q('Clarify your meaning after a misunderstanding.','Es decir, necesitamos más tiempo, no más dinero.','Por casualidad, el tiempo es ayer.','Ni siquiera porque más.','Es decir reformulates a point.'),
 Q('Add a forgotten point in conversation.','Por cierto, también debemos avisar a Nuria.','Por culpa, también debemos.','Por tanto que, Nuria.','Por cierto introduces an additional or related point.'),
 Q('Agree with a suggestion.','Estoy de acuerdo con la propuesta.','Soy de acuerdo a la propuesta.','Tengo acuerdo por la propuesta.','Estar de acuerdo con is the usual combination.'),
 Q('Offer an alternative route.','En vez de conducir, podemos ir en tren.','A causa de conducir, tren nunca.','A pesar de que tren.','En vez de introduces a replacement.'),
 Q('A colleague correctly identifies a missing file. Agree.','Tienes razón; falta el archivo.','Eres razón; falta el archivo.','Haces razón; falta el archivo.','Tener razón means be right.'),
 Q('A colleague uses an unclear term. Ask for clarification.','¿A qué te refieres con «flexible»?','¿Por cierto flexible?','¿En vez de flexible mañana?','A qué te refieres asks what someone means.')
],
'b1-expressions-idioms':[
 Q('“¿Puedes echarme una mano con las cajas?” What is wanted?','Help carrying or handling them.','An actual detached hand.','Permission to throw the boxes away.','Echar una mano means help.'),
 Q('“La prueba fue pan comido.” How was it?','Easy.','About baking.','Impossible to finish.','Pan comido describes something easy.'),
 Q('“No me di cuenta de que faltaba una página.” What happened?','The missing page went unnoticed.','The speaker counted every page correctly.','The speaker deliberately removed it.','Darse cuenta de means realise or notice.'),
 Q('“Este retraso tiene que ver con la huelga.” What is stated?','The delay is connected with the strike.','The delay is unrelated to the strike.','The strike has certainly ended.','Tener que ver con expresses a connection.'),
 Q('“Échale un vistazo al horario antes de salir.” What should you do?','Take a quick look at the timetable.','Change every departure time.','Ignore the timetable.','Echar un vistazo means take a quick look.'),
 Q('“Me llevo bien con mis vecinos.” What is described?','A good relationship.','Driving neighbours to work.','Living far from neighbours.','Llevarse bien con describes getting along.')
],
'b2-expressions-decisions':[
 Q("Your team must consider the budget.","Hay que tener en cuenta el presupuesto.","Hay que poner de acuerdo el presupuesto.","Hay que valer el presupuesto en pena.","Tener en cuenta means consider."),
 Q("After comparing options, choose one.","Tenemos que tomar una decisión.","Tenemos que hacer una decisión.","Tenemos que poner una decisión de acuerdo.","Tomar una decisión is the natural collocation."),
 Q("A longer journey brings a much better opportunity. Say it is worthwhile.","Vale la pena hacer el viaje.","Tiene la pena hacer el viaje.","Toma la pena hacer el viaje.","Valer la pena describes something worth the effort."),
 Q("The team must agree on responsibilities.","Debemos ponernos de acuerdo sobre las tareas.","Debemos tomarnos una pena sobre las tareas.","Debemos llevar las tareas en cuenta de acuerdo.","Ponerse de acuerdo means reach agreement."),
 Q("The pilot has approval; now execute it.","Vamos a llevar a cabo la prueba.","Vamos a llevar en cuenta la prueba.","Vamos a hacer de acuerdo la prueba.","Llevar a cabo means carry out."),
 Q("A business must deal with rising costs.","Debe hacer frente al aumento de costes.","Debe valer la pena al aumento de costes.","Debe poner en cabo el aumento de costes.","Hacer frente a means confront or deal with.")
],
'b2-expressions-idioms':[
 Q('“Metí la pata al mencionar la sorpresa.” What happened?','The speaker made an awkward mistake.','The speaker entered a room physically.','The speaker completed the plan perfectly.','Meter la pata means make a blunder.'),
 Q('“Te ahogas en un vaso de agua por un pequeño cambio.” What is the criticism?','You are treating a small difficulty as overwhelming.','You are ignoring a serious emergency.','You are handling every change calmly.','Ahogarse en un vaso de agua means be overwhelmed by a small problem.'),
 Q('“Otra vez estás en las nubes.” What is the criticism?','You are distracted.','You work in aviation.','You are too attentive.','Estar en las nubes means be absent-minded.'),
 Q('“El arreglo me costó un ojo de la cara.” What was the problem?','It was very expensive.','It caused an eye injury.','It was free but slow.','Costar un ojo de la cara refers to high cost.'),
 Q('“Aunque fue difícil, no tiró la toalla.” What did the person do?','Kept trying.','Gave up immediately.','Changed clothes.','Tirar la toalla means give up; negating it signals persistence.'),
 Q('“Hay mucho trabajo; tenemos que ponernos las pilas.” What is urged?','Become active and make an effort.','Give up because of the workload.','Wait for someone else to act.','Ponerse las pilas means get going energetically.')
],
'c1-expressions-argument':[
 Q("An audit reveals a serious weakness.","La auditoría pone de manifiesto una carencia importante.","La auditoría pasa por alto una carencia importante.","La auditoría da por resuelta toda carencia.","Poner de manifiesto means reveal or make evident."),
 Q("New evidence calls an earlier conclusion into question.","Los nuevos datos ponen en tela de juicio la conclusión.","Los nuevos datos confirman necesariamente la conclusión.","Los nuevos datos dejan intacta la conclusión por definición.","Poner en tela de juicio questions validity."),
 Q("Frame a revised view using the available evidence.","A la luz de los resultados, conviene revisar el plan.","A grandes rasgos de luz, el plan.","Hasta cierto punto de resultados, revisado.","A la luz de means in light of."),
 Q("Limit the scope of a comment to funding.","En lo que respecta a la financiación, faltan garantías.","A la luz que respecta, faltan garantías.","En grandes puntos de financiación, garantías.","En lo que respecta a introduces a specific topic."),
 Q("Give a broad outline before the details.","A grandes rasgos, el proyecto tiene tres fases.","En tela de juicio, el proyecto tiene tres fases.","Por alto, el proyecto tiene tres fases.","A grandes rasgos signals an overview."),
 Q("Agree only partially with an argument.","Hasta cierto punto comparto esa interpretación.","Comparto esa interpretación sin ninguna reserva.","Rechazo por completo cualquier interpretación.","Hasta cierto punto limits agreement.")
],
'c1-expressions-nuance':[
 Q("A colleague says “Hay que leer entre líneas este comunicado”. What should you examine?","Its implied message.","Only spelling mistakes.","The physical spacing between lines.","Leer entre líneas means infer subtext."),
 Q("A speaker keeps avoiding the central question.","Se está yendo por las ramas.","Está dando en el clavo.","Está sentando las bases de una respuesta precisa.","Irse por las ramas means digress or avoid the point."),
 Q("“Está en juego la confianza del público.” What is at stake?","Public trust may be affected or lost.","Public trust is guaranteed.","A public sports match is necessarily scheduled.","Estar en juego identifies what is at risk."),
 Q("Replace “diste en el clavo” in a formal review.","Identificó con precisión el problema central.","Ignoró el problema principal.","Desvió la atención hacia un asunto secundario.","Dar en el clavo means identify the point exactly."),
 Q("A reviewer overlooked an important exception.","Pasó por alto una excepción relevante.","Puso de manifiesto una excepción relevante.","Dio en el clavo con toda excepción.","Pasar por alto means overlook."),
 Q("Describe early work that enables a future partnership.","El acuerdo sienta las bases de una colaboración duradera.","El acuerdo pasa por alto toda colaboración.","El acuerdo se va por las ramas de colaborar.","Sentar las bases de means lay the foundations for.")
]
};
