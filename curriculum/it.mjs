import {u} from './authoring.mjs';
export const itUnits={A1:[
u('Introduce yourself in Italian','Mi chiamo introduces a name; sono di identifies origin and abito a a city. Lei is polite singular address and takes third-person singular forms.','Lei can mean polite you or she. Context, capitalisation conventions and the verb alone do not always disambiguate.',`
Mi [chiamo] Elena.~My name is Elena.~chiami;chiamano
Sono [di] Napoli.~I am from Naples.~a;da
[Abito] a Torino.~I live in Turin.~Abiti;Abitano
Come [si chiama] ?~What is your name, politely?~ti chiami;vi chiamate`, `
Mi [chiamo] Amir e studio italiano.~Amir introduces himself and his studies.~chiami;chiama
Di dove [sei] ?~Where are you from, familiar singular?~siete;sono`),
u('Identity and agreement with essere','Present essere: sono, sei, è, siamo, siete, sono. Many adjectives agree in gender and number with the subject.','Essere is used for both identity and many temporary states; Italian does not copy the Spanish ser/estar distinction.',`
Lei [è] insegnante.~She is a teacher.~sei;siete
Noi [siamo] pronti.~We, a masculine or mixed group, are ready.~sono;siete
Tu [sei] stanca.~You, feminine singular, are tired.~è;siamo
Le porte sono [aperte].~The doors are open.~aperto;aperti`, `
Voi [siete] gentili.~You, plural, are kind.~siamo;è
Mia sorella è [contenta].~My sister is happy.~contento;contenti`),
u('Regular present routines','Regular -are verbs have endings -o, -i, -a, -iamo, -ate, -ano. A subject pronoun is often omitted when the verb and context make the person clear.','A pronoun can add contrast or emphasis; do not require an explicit pronoun in every Italian sentence.',`
Io [lavoro] in centro.~I work in the centre.~lavori;lavorano
Tu [studi] la sera.~You study in the evening.~studio;studiamo
Noi [abitiamo] vicino al parco.~We live near the park.~abitate;abita
Loro [parlano] italiano.~They speak Italian.~parlo;parli`, `
Voi [ascoltate] la radio.~You, plural, listen to the radio.~ascoltiamo;ascolta
Marta [cucina] spesso.~Marta often cooks.~cucino;cucinate`),
u('Listen to a café order','Vorrei is a common polite ordering form. Listen for the item, quantity and whether it is da portare via. A caffè without qualification usually means an espresso in Italy.','Do not assume un caffè means a large filter coffee. Specify a different preparation when needed.',`
Vorrei [un tè], per favore.~The customer asks for tea.~un caffè;un succo
Un cappuccino [senza zucchero].~The cappuccino should have no sugar.~con zucchero;con ghiaccio
Due caffè [da portare via].~The two coffees are to take away.~da bere qui;per domani
[Il conto], per favore.~The customer requests the bill.~Il menù;Il tavolo`, `
Per me [un bicchiere d'acqua].~The customer wants a glass of water.~una tazza di tè;un succo d'arancia
Vorremmo [pagare adesso].~The customers wish to pay now.~ordinare domani;aspettare ancora`),
u('Ask questions and identify the information needed','Common question words include dove, quando, chi, come and quanto. Yes/no questions can use statement word order with questioning intonation.','Perché can ask why or introduce because; identify its function from the whole sentence.',`
[Dove] abiti ?~Where do you live?~Quando;Chi
[Quando] comincia il corso ?~When does the course start?~Chi;Come mai
[Quanto] costa il biglietto ?~How much does the ticket cost?~Dove;Chi
[Chi] è quella persona ?~Who is that person?~Quando;Quanto`, `
[Come] ti chiami ?~What is your name?~Dove;Quanto
[Perché] studi italiano ?~Why do you study Italian?~Chi;Quanto`),
u('Negation with non and negative words','Non normally precedes a conjugated verb. In non...mai and non...niente, the second negative word follows the verb. A preceding niente or nessuno may itself introduce the negation.','Negative concord is standard Italian: non vedo niente is not interpreted as two negatives cancelling each other.',`
Io [non] bevo caffè.~I do not drink coffee.~mai;niente
Non vedo [niente].~I do not see anything.~qualcosa;tutto
Non arrivo [mai] tardi.~I never arrive late.~sempre;spesso
[Nessuno] è arrivato.~Nobody has arrived.~Qualcuno;Tutti`, `
Oggi [non] lavoro.~I do not work today.~niente;nessuno
Non conosco [nessuno] qui.~I do not know anyone here.~tutti;qualcuno`),
u('Food words with articles','Learn nouns with their article and number. Lo precedes masculine nouns beginning with s plus consonant and some other groups; un does not take an apostrophe before a masculine vowel.','Un amico is masculine; un’amica is feminine. The apostrophe is not a general decoration before vowels.',`
Vorrei [il pane].~I would like the bread.~il treno;il libro~bread
Compro [la frutta].~I buy the fruit.~la chiave;la sedia~fruit
Bevo [l'acqua].~I drink the water.~la strada;la borsa~water
Prendo [lo yogurt].~I take the yoghurt.~lo zaino;lo specchio~yoghurt
Mangio [una mela].~I eat an apple.~una penna;una porta~an apple
Ordino [il pesce].~I order the fish.~il foglio;il letto~fish`, `
A colazione mangio [il pane].~I eat bread for breakfast.~il tavolo;il biglietto
Vorrei [una mela] dopo pranzo.~I would like an apple after lunch.~una sedia;una chiave`),
u('Find places in town','Common place names use different articles. In farmacia and in banca are common destination phrases; alla stazione includes a definite article.','Do not translate every English to with the same Italian preposition.',`
Compro le medicine [in farmacia].~I buy medicines at the pharmacy.~in palestra;in biblioteca~at the pharmacy
Leggo [in biblioteca].~I read in the library.~in piscina;in farmacia~in the library
Prendo il treno [alla stazione].~I catch the train at the station.~al cinema;al mercato~at the station
Compro le verdure [al mercato].~I buy vegetables at the market.~al museo;al teatro~at the market
Faccio una passeggiata [al parco].~I go for a walk in the park.~all'ufficio postale;in banca~in the park
Spedisco il pacco [all'ufficio postale].~I send the parcel at the post office.~al ristorante;in palestra~at the post office`, `
Per prendere l'autobus vado [alla fermata].~I go to the stop to catch the bus.~in cucina;in camera
Per vedere il film andiamo [al cinema].~We go to the cinema to see the film.~in farmacia;in banca`),
u('Polite greetings and thanks','Buongiorno and buonasera are broadly polite greetings. Ciao is familiar. Grazie can be answered with prego; mi scusi is polite singular address.','Salve is common but register preferences vary by setting; use buongiorno when a clearly courteous opening is appropriate.',`
[Buongiorno], signora Rossi.~A courteous daytime greeting.~Buonanotte;Arrivederci
[Grazie] per l'aiuto.~I thank someone for help.~Peccato;Purtroppo
[Mi scusi], dov'è l'uscita ?~I politely get attention to ask for the exit.~Che peccato;A domani
Grazie mille ! — [Prego].~The reply acknowledges thanks.~Peccato;Magari un'altra volta`, `
[Buonasera], abbiamo una prenotazione.~A polite evening greeting before mentioning a booking.~Buonanotte;A presto
[Arrivederci], a lunedì.~A courteous goodbye until Monday.~Benvenuti;Buon appetito`),
u('Repair a conversation','Può ripetere and può parlare più lentamente are polite requests using Lei. Non ho capito signals a comprehension problem; come si dice asks for wording.','Non ho capito does not mean I disagree. Ask for the repair you need.',`
[Può ripetere], per favore ?~I politely ask someone to repeat.~È vietato parlare;Non voglio ascoltare
[Può parlare più lentamente] ?~I request slower speech.~Può andare più lontano;Può finire domani
[Non ho capito] l'ultima parola.~I did not understand the last word.~Non ho approvato;Non ho pronunciato
[Come si dice] questo in italiano ?~I ask how to say this in Italian.~Quanto costa;A che ora parte`, `
[Che cosa significa] questa parola ?~I ask what the word means.~Dove si compra;Chi la spedisce
[Può scriverlo], per favore ?~I ask politely for it to be written down.~Può cancellarlo;Può nasconderlo`),
u('Express everyday needs','Italian uses avere in ho fame, ho sete and ho bisogno di. These are conventional combinations rather than literal translations of English be hungry.','Use di before a needed noun or infinitive in avere bisogno di.',`
[Ho fame].~I am hungry.~Ho sete;Ho sonno
[Ho sete].~I am thirsty.~Ho freddo;Ho paura
[Ho bisogno di] una penna.~I need a pen.~Mi piace;Sono pieno di
[Ho sonno].~I feel sleepy.~Ho fame;Ho ragione`, `
[Ho freddo]; posso chiudere la finestra ?~I feel cold and ask to close the window.~Ho caldo;Ho fame
Abbiamo [bisogno di] aiuto.~We need help.~voglia senza;piacere per`),
u('Time, days and practical arrangements','Alle introduces most clock times; all’una is singular. Di mattina and di sera indicate parts of the day. Il lunedì can describe a recurring Monday routine.','Sono le due but è l’una. A named day without an article often refers to a particular occurrence.',`
Ci vediamo [alle tre].~We meet at three.~al tre;le tre
Il corso inizia [all'una].~The class starts at one.~alle una;le una
Studio [di sera].~I study in the evening.~ieri mattina;fra due anni
[Lunedì] parto per Roma.~I leave for Rome on Monday.~Sempre;L'anno scorso`, `
La visita è [alle dieci].~The appointment is at ten.~al dieci;le dieci
[Il sabato] lavoro sempre.~I work every Saturday.~Ieri soltanto;L'anno scorso soltanto`)
],A2:[
u('Completed events with passato prossimo','Passato prossimo combines present avere or essere with a past participle. Many intransitive motion or change verbs take essere, with participle agreement. Auxiliary choice is lexical and can vary with construction.','Not every motion verb takes essere: ho camminato uses avere. Learn the verb in its actual construction.',`
Ieri [ho comprato] il pane.~Yesterday I bought bread.~compro;comprerò
Giulia [è arrivata] alle otto.~Giulia arrived at eight.~ha arrivato;è arrivato
Noi [abbiamo visto] il film.~We saw the film.~siamo visto;vedremo
Le ragazze [sono partite] presto.~The girls left early.~hanno partito;sono partito`, `
Marco [ha camminato] per un'ora.~Marco walked for an hour.~è camminato;camminerà domani
Mia sorella [è tornata] ieri.~My sister returned yesterday.~ha tornato;è tornato`),
u('Arrange a meeting and offer an alternative','Ti va di and possiamo introduce familiar suggestions. Avrei un impegno softens mention of a scheduling problem; altrimenti offers a fallback.','Propose a concrete day, time or location rather than assuming the other person knows which meeting you mean.',`
[Ti va di] vederci sabato ?~I ask a friend whether Saturday suits them.~Ti vieto di;Hai già finito di
[Possiamo incontrarci] davanti al museo.~I propose meeting in front of the museum.~Non dobbiamo mai incontrarci;Ci siamo già incontrati ieri
Alle sei [ho un impegno].~I have another commitment at six.~sono sempre libero;non faccio mai programmi
[Altrimenti], possiamo fare domenica.~I offer Sunday as a fallback.~In ogni caso è vietato;Ormai è troppo tardi`, `
[Per te va bene] alle cinque ?~I ask whether five suits the other person.~Ti proibisco di venire;È già stato annullato
[Facciamo alle sette], allora.~I suggest settling on seven.~Non vediamoci mai;Siamo arrivati ieri`),
u('Hear consonant length and word stress','Italian consonant length can distinguish words, as in pala/palla and fato/fatto. Final written accents identify stress in words such as città and caffè.','A doubled consonant is held or articulated longer, not pronounced as two separate syllables. Do not replace native audio with English letter names.',`
La [pala] è nel giardino.~The shovel is in the garden; a single l contrasts with palla.~palla;pelle
Passami la [palla].~Pass me the ball; the l is long.~pala;palo
È un [fatto] importante.~It is an important fact; tt is long.~fato;foto
Bevo un [caffè].~I drink a coffee; stress is on the final syllable.~caffe;caso`, `
La [penna] è blu.~The pen is blue; nn contrasts with pena.~pena;panna
Questa [città] è tranquilla.~This city is quiet; stress is final.~citta;cita`),
u('Follow directions and landmarks','Giri a destra/sinistra are polite directions. Prosegua uses a polite imperative. Dopo and prima di establish the order of landmarks.','Dal ponte means from or at the bridge in context; dopo il ponte explicitly means after the bridge.',`
[Giri a destra] dopo il ponte.~Turn right after the bridge.~Giri a sinistra;Torni indietro
[Prosegua dritto] fino alla piazza.~Continue straight to the square.~Si fermi subito;Attraversi il parco
La banca è [di fronte alla posta].~The bank is opposite the post office.~dentro la posta;dietro la stazione
Giri [prima del semaforo].~Turn before the traffic light.~dopo il semaforo;solo al capolinea`, `
L'ingresso è [accanto alla farmacia].~The entrance is next to the pharmacy.~sopra il ponte;dietro il museo
[Attraversi la strada] e continui a sinistra.~Cross the road and continue left.~Rimanga qui;Torni alla stazione`),
u('Ask about completed events','Past questions retain auxiliary and participle agreement. Direct object pronouns before a compound tense can require agreement, as in le ho viste.','Distinguish chi è arrivato from chi hai visto: who arrived and whom you saw use different constructions.',`
Che cosa [hai comprato] ?~What did you buy?~sei comprato;comprerai domani
Quando [siete arrivati] ?~When did you, masculine or mixed plural, arrive?~avete arrivato;siete arrivato
Dove [ha lasciato] le chiavi Marta ?~Where did Marta leave the keys?~è lasciato;lascerà domani
Le tue amiche ? Le [ho viste] ieri.~I saw your female friends yesterday.~ho visto;sono visto`, `
Chi [è partito] stamattina ?~Who left this morning?~ha partito;partirà domani
Avete [finito] il lavoro ?~Have you finished the work?~finire;finendo`),
u('Background and habits with imperfetto','Imperfetto describes past habits, states and events viewed in progress. Passato prossimo often presents a bounded event against that background.','Imperfetto is not a mechanical translation of every English was...ing; viewpoint and context matter.',`
Da piccola [andavo] spesso al mare.~As a child I often went to the seaside.~andrò;vado domani
Mentre [leggevo], è suonato il telefono.~I was reading when the phone rang.~leggerò;leggo domani
Ieri alle otto [faceva] freddo.~It was cold at eight yesterday.~farà;fa domani
Quando siamo entrati, loro [cenavano].~They were having dinner when we entered.~ceneranno;cenano domani`, `
Una volta [abitavamo] in campagna.~We used to live in the countryside.~abiteremo;abitiamo domani
Mentre dormivo, qualcuno [ha bussato].~Someone knocked while I was sleeping.~busserà;busseremo`),
u('Hotel and accommodation vocabulary','Learn the noun and its practical use: prenotazione, camera, chiave, asciugamano, colazione and ricevuta.','Camera here means a room, not a camera for photographs; macchina fotografica is the latter.',`
Ho una [prenotazione].~I have a reservation.~scadenza;riunione~reservation
Vorrei una [camera] singola.~I would like a single room.~valigia;forchetta~room
Ho perso la [chiave].~I have lost the key.~colazione;ricevuta~key
Mi serve un [asciugamano].~I need a towel.~biglietto;contratto~towel
La [colazione] è inclusa ?~Is breakfast included?~valigia;partenza~breakfast
Posso avere una [ricevuta] ?~May I have a receipt?~coperta;doccia~receipt`, `
La mia [camera] è al secondo piano.~My room is on the second floor.~forchetta;colazione
La [prenotazione] è a nome Rossi.~The booking is under Rossi.~doccia;valigia`),
u('Work and scheduling vocabulary','Colleague roles and documents combine with practical verbs: fissare una riunione, rispettare una scadenza and firmare un contratto.','Scadenza means deadline or expiry, depending on context; it is not simply a meeting time.',`
La [riunione] comincia alle nove.~The meeting begins at nine.~ricevuta;valigia~meeting
Devo rispettare la [scadenza].~I must meet the deadline.~stampante;colazione~deadline
Ho letto il [contratto].~I have read the contract.~cuscino;biglietto~contract
Chiedo al mio [collega].~I ask my colleague.~bagaglio;tavolo~colleague
Mando una [bozza] al gruppo.~I send a draft to the group.~coperta;chiave~draft
La [stampante] non funziona.~The printer does not work.~scadenza;riunione~printer`, `
Possiamo fissare una [riunione] ?~Can we schedule a meeting?~coperta;valigia
La [scadenza] è venerdì.~The deadline is Friday.~stampante;colazione`),
u('Suggest a plan without imposing it','Potremmo uses conditional potere for a suggestion. Che ne dici di asks a familiar person for an opinion; perché non proposes an alternative.','A suggestion should leave room for the other person to decline or modify it.',`
[Potremmo] prendere il treno.~We could take the train.~Dobbiamo per forza;Abbiamo già finito di
[Che ne dici di] fare una pausa ?~What do you think about taking a break?~Ti proibisco di;Hai già smesso di
[Perché non] proviamo questo percorso ?~I suggest trying this route.~È vietato che;È impossibile che
[Ti andrebbe di] venire con noi ?~Would you feel like coming with us?~Ti ordino di;Hai già finito di`, `
[Potremmo] sederci fuori.~We could sit outside.~Dobbiamo obbligatoriamente;Abbiamo già smesso di
[Che ne dici di] rimandare a lunedì ?~I ask about postponing until Monday.~Ti vieto di;Hai già concluso di`),
u('Respond to practical requests','Certo and volentieri accept a request. Mi dispiace, ma introduces a courteous refusal; non c’è problema reassures.','Volentieri signals willingness, not an obligation or a completed action.',`
Puoi aiutarmi ? — [Volentieri].~The reply willingly accepts.~Assolutamente no;È vietato
[Mi dispiace, ma] oggi non posso.~I politely decline for today.~Come già confermato senza limiti;Per fortuna posso sempre
[Non c'è problema], lo mando subito.~I reassure and agree to send it.~Non intendo farlo;È impossibile
[Certo], puoi usare il mio telefono.~I agree to let someone use my phone.~Mai;Vietato`, `
[Magari un'altra volta], oggi sono occupato.~I decline today while leaving another occasion open.~Ho già confermato per oggi;Non ti aiuterò mai
[Va bene], ci penso io.~I accept responsibility for it.~Mi rifiuto;È proibito`),
u('Frequency and shared routines','Di solito describes a usual pattern; ogni tanto means occasionally. Sempre and mai express the ends of a frequency scale.','A frequency expression does not itself specify past or present tense.',`
[Di solito] pranzo a casa.~I usually have lunch at home.~Mai;Una sola volta nella vita
Vado al cinema [ogni tanto].~I go to the cinema occasionally.~ogni giorno senza eccezione;mai
Non salto [mai] la colazione.~I never skip breakfast.~sempre;spesso
Arriva [quasi sempre] in orario.~He arrives on time almost always.~una sola volta;mai`, `
Ci vediamo [una volta alla settimana].~We meet once a week.~ogni ora;una volta all'anno
[Spesso] lavoro da casa.~I often work from home.~Mai;Una sola volta`),
u('Describe the outcome of a plan','Alla fine marks an eventual outcome; per fortuna and purtroppo evaluate it positively or negatively. Riuscire a means manage to do something.','Finalmente often conveys relief after waiting, not merely the final point in a list.',`
[Alla fine] abbiamo trovato un tavolo.~Eventually we found a table.~Prima di iniziare;In ogni momento
[Per fortuna] il treno ci ha aspettati.~Fortunately the train waited for us.~Purtroppo;Contro ogni nostro desiderio
[Purtroppo] il negozio era chiuso.~Unfortunately the shop was closed.~Per nostra grande fortuna;Come desideravamo
Siamo [riusciti a] partire in tempo.~We managed to leave on time.~stati costretti a non;stati incapaci di`, `
[Finalmente] è arrivata la risposta !~The awaited answer has at last arrived.~Non è ancora arrivata;Non arriverà mai
[Alla fine] abbiamo cambiato strada.~In the end we changed route.~Prima ancora di partire;Durante ogni singolo minuto`)
],B1:[
u('Express purpose with per and perché','Per plus infinitive commonly expresses purpose with a shared subject. Perché plus subjunctive can express a purpose involving another subject.','Perché with indicative may state a cause; distinguish why something happens from its intended goal.',`
Studio [per migliorare] la pronuncia.~I study in order to improve my pronunciation.~senza migliorare;dopo aver dimenticato
Ti mando la mappa [perché tu possa] orientarti.~I send the map so that you can find your way.~perché tu puoi;perché tu potevi
Siamo usciti presto [per evitare] il traffico.~We left early to avoid traffic.~senza evitare;dopo aver cercato
Parlo piano [perché tutti capiscano].~I speak slowly so everyone understands.~perché tutti capiscono;perché tutti capivano`, `
Ho chiamato [per confermare] la visita.~I called to confirm the appointment.~senza confermare;dopo aver annullato
Lascio la luce accesa [perché tu veda] l'ingresso.~I leave the light on so you can see the entrance.~perché tu vedi;perché tu vedevi`),
u('Possibility, doubt and subjunctive','È possibile che and dubito che normally introduce subjunctive clauses. For present-time possibilities use forms such as sia, abbia and possa.','Subjunctive depends on the governing expression and construction, not simply on whether the speaker feels uncertain.',`
È possibile che [sia] chiuso.~It may be closed.~è;essere
Dubito che loro [abbiano] tempo.~I doubt they have time.~hanno;avere
Può darsi che lei [arrivi] tardi.~She may arrive late.~arriva;arrivare
È probabile che noi [possiamo] partire.~We will probably be able to leave.~potere;potremo domani`, `
Non credo che lui [sappia] l'indirizzo.~I do not think he knows the address.~sa;sapere
È possibile che voi [siate] già pronti.~You, plural, may already be ready.~siete;essere`),
u('Read reasons, contrasts and consequences','Tuttavia marks contrast; quindi introduces a consequence; poiché introduces a cause. Choose the relation between clauses before selecting a connector.','A connector changes the logic of an argument even if the individual clauses remain grammatical.',`
Il servizio costa di più; [tuttavia] è più affidabile.~The higher price is contrasted with greater reliability.~quindi per questo costo;infatti soltanto per il prezzo
Il ponte è chiuso; [quindi] cambiamo percorso.~The closure leads us to change route.~nonostante ciò senza motivo;al contrario
[Poiché] mancavano i dati, abbiamo rinviato la decisione.~Missing data are the reason for postponement.~Affinché;Benché non
La proposta è utile; [inoltre] costa poco.~Low cost is an additional advantage.~al contrario;invece di ciò`, `
La strada è allagata; [perciò] non possiamo passare.~Flooding consequently prevents passage.~eppure passiamo senza problemi;invece il contrario
[Nonostante] la pioggia, siamo partiti.~We left despite the rain.~A causa di sola;Al posto di`),
u('Write a clear practical request','Name the problem, its effect and the action requested. Sarebbe possibile softens a request without hiding what you need.','Use a greeting and sign-off appropriate to the relationship; include relevant dates or booking references.',`
[Le scrivo per segnalare] un problema con la prenotazione.~I state the purpose of a courteous written message.~Le vieto di rispondere;Confermo che non esiste alcun problema
[Sarebbe possibile] cambiare camera ?~I politely ask whether changing rooms is possible.~È proibito;È già escluso
[Preferirei] una soluzione entro domani.~I state a preference for resolution by tomorrow.~Ho già rifiutato;Non desidero mai
[La ringrazio per l'attenzione].~I close with courteous thanks.~Non desidero alcuna risposta;Ritiro ogni richiesta`, `
[Potrebbe verificare] la disponibilità ?~I politely request a check of availability.~Non controlli mai;Ha già vietato
[Resto in attesa di un Suo riscontro].~I formally indicate that I await a response.~Rifiuto ogni ulteriore contatto;Confermo che tutto è già risolto`),
u('Experience and continuing duration','Passato prossimo can describe experience. Present tense with da describes a state or activity that began earlier and continues now.','Abito qui da tre anni normally means I still live here; ho abitato qui per tre anni can frame a completed period.',`
[Abito] qui da tre anni.~I have lived here for three years and still do.~Abiterò domani;Abitai una sola volta
[Hai mai visitato] Palermo ?~Have you ever visited Palermo?~Visiterai soltanto domani;Stai per visitare
[Lavoriamo] insieme dal 2020.~We have worked together since 2020 and still do.~Lavoreremo solo domani;Lavorammo per un giorno
Non [ho mai assaggiato] questo piatto.~I have never tried this dish.~assaggerò mai domani;sto già finendo`, `
[Studio] italiano da sei mesi.~I have been studying Italian for six months and still am.~Studierò solo domani;Studiai per un minuto
[Sei mai stato] a Bologna ?~Have you ever been to Bologna, masculine singular?~Sei domani;Sarai soltanto tra un anno`),
u('Earlier events with trapassato prossimo','Trapassato prossimo combines imperfect avere or essere with a participle to locate an event before another past reference point. Agreement follows the auxiliary construction.','Past-before-past depends on the narrative reference point, not merely on how long ago something happened.',`
Quando sono arrivato, lei [era già partita].~She had already left when I arrived.~partirà domani;è partita domani
Non avevo fame perché [avevo già mangiato].~I was not hungry because I had already eaten.~mangerò domani;ho mangiato domani
Ci siamo accorti che [avevamo sbagliato] indirizzo.~We realised we had used the wrong address.~sbaglieremo;stiamo sbagliando domani
Le porte erano chiuse: il museo [aveva già chiuso].~The museum had already closed at the past reference time.~chiuderà la settimana prossima;chiude domani`, `
Ho trovato il libro che [avevo perso].~I found the book I had lost.~perderò;perdo domani
Le ospiti [erano già arrivate] quando abbiamo telefonato.~The female guests had arrived before our call.~erano già arrivato;avevano già arrivate`),
u('Future plans and predictions','Futuro semplice expresses predictions, intentions or future events. Present tense is also common for planned future events when context is clear.','The future can also express present conjecture, as in saranno le otto; do not assume every future form refers to later time.',`
Domani [partiremo] presto.~We will leave early tomorrow.~partivamo;siamo partiti ieri
Secondo le previsioni, [pioverà].~The forecast predicts rain.~ha piovuto ieri;pioveva ieri
Ti [chiamerò] appena arrivo.~I will call as soon as I arrive.~chiamavo;ho chiamato ieri
L'anno prossimo [vivranno] qui.~They will live here next year.~vivevano;hanno vissuto ieri`, `
Tra un mese [finirò] il corso.~I will finish the course in a month.~finivo;ho finito ieri
Non so l'ora: [saranno le nove].~I conjecture that it is about nine now.~furono le nove;sono state le nove ieri`),
u('Hypothetical conditions with congiuntivo and condizionale','For a present unreal or hypothetical condition use se plus imperfect subjunctive and conditional in the result: se avessi tempo, verrei.','In the standard hypothetical pattern, do not use a conditional in the se clause.',`
Se [avessi] tempo, verrei con voi.~If I had time, I would come with you.~avrei;avrò
Se fossi vicino, [verrei] a piedi.~If I were nearby, I would come on foot.~venivo;verrò sicuramente
Se lo [sapessi], te lo direi.~If I knew, I would tell you.~saprei;saprò
Se [potessimo], resteremmo più a lungo.~If we could, we would stay longer.~potremmo;possiamo certamente`, `
Se lei [fosse] qui, capirebbe.~If she were here, she would understand.~sarebbe;sarà
Se avessi il numero, [chiamerei].~If I had the number, I would call.~chiamavo;ho chiamato`),
u('Reformulate and verify understanding','In altre parole and cioè introduce reformulation. Se ho capito bene checks an interpretation rather than presenting it as established.','A paraphrase must preserve the original limit, condition and certainty.',`
[In altre parole], serve prima il permesso.~I restate that permission is needed first.~Cambiando del tutto argomento;Al contrario
[Se ho capito bene], il trasporto è incluso ?~I check whether transport is included.~È dimostrato senza dubbio;Vieto ogni verifica
[Cioè], dobbiamo rifare solo questa parte.~I clarify that only this part needs redoing.~Nonostante tutto;Invece di qualsiasi spiegazione
[Quello che intendo dire] è che manca una firma.~I clarify that a signature is missing.~Quello che nego categoricamente;Quello che ho già concluso`, `
[Mi stai dicendo che] il prezzo è cambiato ?~I check an interpretation about a changed price.~Ho già dimostrato che;È vietato che
[Detto in un altro modo], abbiamo bisogno di più tempo.~I paraphrase that more time is needed.~Senza alcun legame;Per negare tutto`),
u('Offer alternatives and leave choices open','In alternativa offers another option; altrimenti introduces a fallback or consequence. Potremmo anche adds a possibility.','Altrimenti can mean otherwise, not always a freely interchangeable alternative.',`
[In alternativa], possiamo parlare online.~I offer speaking online as another option.~Come unica imposizione;Senza altre possibilità
[Potremmo anche] dividere il lavoro.~I add dividing the work as a possibility.~Abbiamo già vietato di;Non dobbiamo mai
[Se non ti va], possiamo rimandare.~I leave room to postpone if the other person is unwilling.~Anche se hai già accettato senza riserve;Poiché tutto è già finito
[Un'altra possibilità sarebbe] partire prima.~I suggest leaving earlier as another option.~L'unico divieto è;Il risultato già certo è`, `
[Altrimenti], sentiamoci martedì.~I offer Tuesday if the first arrangement fails.~Come già definitivamente imposto;Senza alcuna alternativa
[Anziché] aspettare, potremmo telefonare.~I suggest calling instead of waiting.~Oltre a dover sempre;A causa del fatto di`),
u('Idioms for support and involvement','Dare una mano means help; metterci una buona parola means speak in someone’s favour. Rimboccarsi le maniche means get down to work.','These are conventional figurative expressions; formal agreements should name the concrete responsibilities.',`
Mi puoi [dare una mano] ?~Can you help me?~mettere i bastoni tra le ruote;voltare le spalle
Tutti si sono [rimboccati le maniche].~Everyone got down to work.~tirati indietro;dimenticati di tutto
Puoi [metterci una buona parola] ?~Can you speak in our favour?~vietare ogni intervento;peggiorare la situazione
Lei ci ha [dato una mano] con il trasloco.~She helped us move.~messo in difficoltà;lasciato soli`, `
I vicini ci hanno [dato una mano] in giardino.~The neighbours helped us in the garden.~voltato le spalle;messo in difficoltà
È ora di [rimboccarsi le maniche].~It is time to get down to work.~tirarsi indietro;rinunciare a tutto`),
u('Realisation and a new perspective','Rendersi conto means realise; mi si è accesa una lampadina figuratively describes a sudden idea or insight. Cadere dalle nuvole means be taken by surprise or seem unaware.','A sudden idea and discovering an unwelcome fact are different functions even if both involve new understanding.',`
Mi sono [reso conto] dell'errore.~I, masculine, realised the mistake.~dimenticato volontariamente;vantato
All'improvviso mi si è [accesa una lampadina].~I suddenly had an idea or insight.~chiusa ogni possibilità;spenta la memoria
Quando l'ha saputo, è [caduto dalle nuvole].~He was taken completely by surprise.~rimasto del tutto indifferente;preparato con mesi di anticipo
Solo dopo ho [capito] il motivo.~I understood the reason only later.~vietato;spedito`, `
Si è [resa conto] che mancava un documento.~She realised a document was missing.~vantata del fatto;dimenticata volontariamente
Con quell'esempio mi si è [accesa una lampadina].~That example prompted a sudden insight.~chiusa ogni strada;persa ogni speranza`)
],B2:[
u('Follow a corrected travel announcement','Non...ma replaces an earlier detail; anziché introduces the substituted alternative. Only the final corrected platform or time is operative.','Distinguish a delay from a cancellation; in ritardo does not mean soppresso.',`
Il treno parte non dal binario due, [ma dal binario cinque].~The corrected platform is five.~anche dal due;solo dal tre
La partenza è [posticipata alle undici].~Departure is postponed to eleven.~anticipata alle nove;annullata definitivamente
Il servizio è [in ritardo, non soppresso].~The service is delayed but still running.~annullato del tutto;già terminato
Oggi il treno ferma [eccezionalmente a Parma].~There is an exceptional stop in Parma today.~sempre senza fermate;soltanto domani`, `
L'arrivo è previsto alle dieci [anziché alle nove].~The arrival is ten rather than nine.~e anche alle nove;senza variazioni
Per il centro usate [l'uscita nord].~The north exit is advised for the centre.~l'uscita sud;l'ingresso ovest`),
u('Listen for reservations within agreement','In linea di massima expresses broad agreement with possible reservations. Purché and a condizione che introduce conditions and normally take the subjunctive.','A statement of support conditional on funding does not mean funding is already secured.',`
Sono d'accordo, [purché i costi restino contenuti].~Agreement requires controlled costs.~a prescindere da qualsiasi costo;anche se ogni limite viene superato
[In linea di massima] il progetto mi convince, ma manca un piano.~There is broad support with a missing-plan reservation.~Senza alcuna riserva;In nessun caso
Possiamo iniziare, [a condizione che arrivi l'autorizzazione].~Starting is conditional on authorisation.~anche senza alcun permesso;dopo che tutto è già finito
L'idea è valida; [resta però il problema dei tempi].~The idea has merit but timing remains problematic.~ogni dubbio è già risolto;non esistono limiti`, `
Lo approverei, [purché sia verificabile].~Approval depends on verifiability.~anche se non si può verificare;senza condizioni
La proposta è interessante, [salvo verificare la copertura finanziaria].~The proposal is interesting, with funding still to be verified.~poiché il finanziamento è già garantito;senza nessuna verifica`),
u('Unreal past conditions','An unreal past condition uses se plus trapassato congiuntivo and a result with condizionale passato: se avessi saputo, sarei venuto.','The auxiliary in the result follows the main verb: sarei venuta but avrei telefonato.',`
Se [avessi saputo] la verità, avrei chiamato.~If I had known the truth, I would have called.~avrei saputo;saprei
Se fosse partita prima, [sarebbe arrivata] in tempo.~An earlier departure would have let her arrive on time.~avrebbe arrivato;sarà arrivata domani
Se avessimo prenotato, [avremmo trovato] posto.~With a booking, we would have found space.~avremo trovato;avevamo trovato sicuramente
Se [fossi rimasto], li avrei incontrati.~Had I, masculine, stayed, I would have met them.~sarei rimasto;rimarrò`, `
Se avessi letto il messaggio, [avrei risposto].~Reading the message would have led me to reply.~risponderò;avevo sicuramente risposto
Se lei [fosse venuta], avrebbe capito.~Had she come, she would have understood.~sarebbe venuta;verrà`),
u('Read concession and qualification','Benché and sebbene usually take subjunctive. Anche se commonly takes indicative for an accepted fact. Nonostante can introduce a noun or clause.','The main conclusion survives the concession; do not read a limitation as a complete rejection.',`
[Benché] sia costoso, il progetto è utile.~The cost is conceded without denying usefulness.~Poiché soltanto;Affinché
[Anche se] piove, partiamo.~We leave despite the fact that it is raining.~Solo perché;Affinché
Il metodo funziona, [sia pure con alcuni limiti].~The method works with acknowledged limits.~senza alcun limite;quindi è completamente inutile
[Nonostante] il ritardo, l'obiettivo resta raggiungibile.~The delay does not make the objective unreachable.~Solo a causa di;Al posto di`, `
[Sebbene] i dati siano incompleti, indicano una tendenza.~Incomplete data still indicate a trend.~Affinché;Purché soltanto
Il confronto è utile, [pur non essendo definitivo].~The comparison is useful without being conclusive.~quindi risolve ogni dubbio;ma è completamente privo di valore`),
u('Ongoing activity and duration','Stare plus gerund presents an activity in progress. Present with da can describe a continuing duration; past tenses frame a completed or past ongoing interval.','Sto sapendo is not a normal replacement for so. Not every verb naturally uses a progressive construction.',`
In questo momento [sto leggendo].~I am reading right now.~ho già finito tutto;leggerò solo domani
[Aspetto da mezz'ora].~I have been waiting for half an hour and still am.~Aspetterò solo domani;Non ho mai aspettato
Quando hai chiamato, [stavo lavorando].~I was working when you called.~lavorerò domani;avevo già finito da giorni
[Ho lavorato per due ore], poi sono uscito.~I worked for a completed two-hour period and then went out.~Lavorerò domani per due ore;Lavoro ancora qui da anni`, `
Silenzio: [stanno registrando].~They are recording now.~hanno finito ieri;registreranno soltanto domani
Lei [vive qui dal 2018].~She has lived here since 2018 and still does.~è partita definitivamente nel 2018;arriverà l'anno prossimo`),
u('Mixed counterfactuals and past regret','A past unreal condition can have a present conditional result: se avessi studiato, ora saprei. Avrei dovuto plus infinitive expresses a missed duty or good action.','Match each clause to its time reference. A present result is not automatically a condizionale passato.',`
Se avessi accettato, [ora lavorerei lì].~Accepting the past offer would mean working there now.~ieri ho lavorato lì;ora lavorerò sicuramente
Se avessi studiato, [saprei rispondere].~Past study would enable me to answer now.~ho già risposto ieri;avrò sicuramente risposto
[Avrei dovuto avvisarti].~I should have warned you.~Ti ho sicuramente avvisato;Ti avviserò soltanto domani
Senza il tuo aiuto [avrei rinunciato].~Without your help I would have given up.~rinuncerò sicuramente;ho certamente rinunciato`, `
Se avessimo risparmiato, [ora potremmo partire].~Past saving would allow us to leave now.~ieri siamo partiti;partiremo di sicuro
[Avrei dovuto controllare] l'indirizzo.~I should have checked the address.~Ho sicuramente controllato;Controllerò certamente domani`),
u('Weigh options and accept trade-offs','Valutare i pro e i contro means weigh advantages and disadvantages. Mettere in conto anticipates a cost or risk; tenere conto di considers a relevant factor.','Mettere in conto does not necessarily mean the drawback has already occurred.',`
Dobbiamo [valutare i pro e i contro].~We must weigh advantages and disadvantages.~ignorare ogni rischio;confermare senza leggere
Bisogna [mettere in conto] qualche ritardo.~We should allow for possible delays.~escludere in assoluto;negare a posteriori
Occorre [tenere conto delle esigenze] del gruppo.~The group’s needs must be considered.~ignorare le richieste;nascondere ogni informazione
È una soluzione [a doppio taglio].~The solution has both benefits and potential harms.~priva di ogni rischio;sicuramente inutile`, `
Prima di decidere, [soppesiamo le alternative].~We weigh the alternatives before deciding.~scartiamo ogni confronto;garantiamo il risultato
Nel piano dobbiamo [mettere in conto] un margine di errore.~The plan must allow for a margin of error.~escludere categoricamente;dimenticare del tutto`),
u('Put a plan into practice together','Mettere in pratica implements an idea; avviare initiates a process. Fare il punto takes stock of the current situation; coordinarsi aligns work.','Starting a project is not the same as finishing it. State which stage has actually been reached.',`
Ora dobbiamo [mettere in pratica] la proposta.~Now we must implement the proposal.~nascondere;vietare
Prima di proseguire, [facciamo il punto].~We take stock before continuing.~cancelliamo ogni dato;evitiamo ogni confronto
È importante [coordinarci con gli altri].~We should coordinate with others.~ignorare gli altri;interrompere ogni contatto
Abbiamo [avviato la procedura].~We have started the procedure.~annullato ogni iniziativa;concluso definitivamente il processo`, `
Come possiamo [tradurre l'idea in azioni concrete] ?~How can we put the idea into concrete action?~impedire qualunque tentativo;nascondere il progetto
Domani [facciamo il punto] sui risultati.~Tomorrow we review the results and current position.~eliminiamo ogni prova;evitiamo di informarci`),
u('Idioms for pressure and setbacks','Essere sotto pressione describes pressure; mantenere il sangue freddo means remain calm. Prendere alla leggera means treat too lightly.','Sangue freddo here is figurative composure, not a physical temperature measurement.',`
Con questa scadenza siamo [sotto pressione].~The deadline puts us under pressure.~senza alcun impegno;al riparo da ogni problema
Devi [mantenere il sangue freddo].~You need to stay calm.~perdere subito la pazienza;agire senza riflettere
Non prendere il problema [alla leggera].~Do not treat the problem too lightly.~con la massima serietà;con attenzione
Mi trovo [tra due fuochi].~I am caught between competing pressures.~in una situazione senza rischi;senza alcun vincolo`, `
Nonostante la critica, ha [mantenuto il sangue freddo].~Despite criticism, the person stayed calm.~perso subito la pazienza;rinunciato a parlare
La difficoltà non va [presa alla leggera].~The difficulty must not be underestimated.~analizzata con cura;considerata seriamente`),
u('Persist and change a difficult situation','Tenere duro means persist; gettare la spugna means give up. Cambiare rotta changes direction and need not itself guarantee success.','Recognise when persistence is praised and when reassessing a plan is the actual recommendation.',`
Nonostante gli ostacoli, [teniamo duro].~Despite obstacles, we keep going.~rinunciamo subito;abbiamo già finito
Non voglio ancora [gettare la spugna].~I do not yet want to give up.~continuare con impegno;provare ancora
È il momento di [cambiare rotta].~It is time to change direction.~mantenere tutto identico;vietare ogni revisione
Senza risorse, il progetto [è a un punto morto].~Without resources, the project is stalled.~è già concluso con successo;procede senza ostacoli`, `
Abbiamo deciso di [tenere duro].~We decided to persevere.~abbandonare tutto;rinunciare subito
Le trattative sono [a un punto morto].~The negotiations have stalled.~già concluse positivamente;in rapido progresso`)
],C1:[
u('Write a precise formal clarification request','Use clear references and courteous conditional forms to request clarification. Specify what is unknown, why it matters and a practical response deadline.','Politeness should not make a request so vague that the reader cannot identify the action needed.',`
[Le sarei grato se potesse chiarire] il criterio applicato.~A courteous request to clarify the criterion.~Le vieto di precisare;Confermo senza leggere
[Con riferimento alla Sua proposta], chiediamo ulteriori dettagli.~The writer formally refers to the proposal.~Senza alcun collegamento;Dopo avere rifiutato ogni contatto
Vorremmo sapere [quali prestazioni siano incluse].~We ask which services are included.~che ogni servizio è già stato rifiutato;perché nessuno deve rispondere
Suggeriamo di [chiarire i punti aperti prima della firma].~We propose resolving open points before signing.~ignorare tutte le ambiguità;considerare il silenzio una conferma`, `
[Potrebbe precisare] a quale periodo si riferisce la stima ?~I politely request the estimate’s time scope.~Non risponda mai;Ha già vietato
Le saremmo grati per un riscontro [entro mercoledì].~We courteously request a response by Wednesday.~senza alcun limite temporale;solo dopo la fine dei lavori`),
u('Read implied criticism and reservations','Non del tutto convincente can politely communicate a substantive reservation. A quanto pare marks reported appearance; quantomeno can concede limited value.','A cautious or polite formulation is not necessarily approval. Interpret it with the surrounding argument.',`
La spiegazione è [non del tutto convincente].~The writer has reservations about the explanation.~dimostrata in modo definitivo;approvata senza riserve
[A quanto pare], manca ancora una firma.~Apparently a signature is still missing.~È provato oltre ogni dubbio che;Per definizione universale
È [quantomeno un punto di partenza].~Some limited initial value is conceded.~la soluzione definitiva;del tutto privo di utilità
Il risultato va [preso con cautela].~The result should be treated cautiously.~accettato senza controlli;considerato certamente falso`, `
La risposta [lascia aperte diverse questioni].~The response leaves several issues unresolved.~risolve definitivamente tutto;impedisce qualsiasi dubbio
La proposta è [quanto meno discutibile].~The proposal is at least open to serious question.~certamente incontestabile;già approvata senza condizioni`),
u('Distinguish association from causation','Essere associato a describes an association; essere dovuto a attributes a cause. Nella misura in cui limits scope. A causal claim requires support beyond simple co-occurrence.','Non si può escludere leaves a possibility open; it does not establish that the possibility occurred.',`
Il calo [è associato all'aumento dei prezzi].~The decline is associated with higher prices.~dimostra da solo una causa unica;esclude qualsiasi relazione
Il ritardo [è dovuto al guasto del server].~The server fault is identified as the cause.~coincide soltanto senza un nesso;non ha alcun rapporto con il server
I dati [suggeriscono un legame].~The data suggest an association.~dimostrano ogni causa possibile;escludono tutte le relazioni
[Non si può escludere] un effetto del contesto.~A contextual effect remains possible.~È dimostrato con certezza;È impossibile`, `
Lo studio [non consente conclusioni causali].~The study does not justify causal conclusions.~prova una causa unica;sostituisce ogni verifica
La raccomandazione vale [nella misura in cui riduce il rischio].~The recommendation applies to the extent that it reduces risk.~senza alcun legame con il rischio;in ogni circostanza immaginabile`),
u('Synthesize findings and limitations','Da un lato/dall’altro balances considerations. Alla luce di quanto emerso links a recommendation to the analysis. Name unresolved issues and proportionate next steps.','A synthesis must explain how the evidence and its limits shape the recommendation, not merely list points.',`
[Da un lato] calano i costi, dall'altro aumenta il lavoro di verifica.~The synthesis balances cost savings against verification work.~Senza alcun contrasto;In modo esclusivo
[Alla luce di quanto emerso], proponiamo una prova limitata.~The proposal follows from the findings.~Senza riferimento ai dati;Contro ogni dato citato
I risultati giustificano [una sperimentazione graduale].~The evidence supports gradual testing.~una garanzia assoluta;la fine di ogni controllo
Il beneficio è plausibile; [resta incerta la trasferibilità].~Potential benefit is plausible but generalisability is uncertain.~ogni dubbio è risolto;quindi ogni uso è garantito`, `
Raccomandiamo un'estensione [purché la verifica indipendente confermi il dato].~Expansion depends on independent confirmation.~anche se ogni dato viene smentito;senza alcun controllo
[Tenuto conto dei limiti], una fase pilota appare ragionevole.~Considering the limits, a pilot phase appears reasonable.~Ignorando volutamente tutti i limiti;Poiché il successo è garantito`),
u('Infer past events and distance reported claims','Deve essere partito expresses a strong inference about a completed event. Sarebbe partito can report an unconfirmed claim in journalistic usage. Potrebbe essere partito expresses possibility.','The evidential conditional is not automatically a future-in-the-past reading; interpret its context.',`
La luce è spenta: [deve essere uscito].~The speaker strongly infers he has gone out.~deve uscire domani;non può mai uscire
Secondo fonti non confermate, il ministro [si sarebbe dimesso].~The resignation is reported without confirmation.~si dimetterà certamente domani;non si è mai dimesso per definizione
Non risponde: [potrebbe essere già partito].~He may already have left.~partirà sicuramente fra un anno;non è possibile che sia partito
Senza chiave [non può essere entrato].~The speaker rules out his having entered without a key.~deve entrare domani;sta per comprare una chiave`, `
La strada è bagnata: [deve aver piovuto].~The wet road supports an inference of past rain.~pioverà certamente domani;non ha mai piovuto
Stando a una notizia non verificata, la società [avrebbe ritirato l'offerta].~An unverified report says the company withdrew its offer.~ritirerà certamente ogni offerta;non ha mai presentato offerte per definizione`),
u('Express regret about an unreal past','Magari avessi and se solo avessi introduce past wishes with trapassato congiuntivo. Avrei dovuto identifies an action that should have occurred.','Magari can also mean perhaps or express enthusiastic acceptance in other contexts; the verb construction matters.',`
[Se solo avessi chiesto] prima !~I wish I had asked earlier.~Se chiederò sicuramente;Ho chiesto senza dubbio
[Magari fossi rimasta] più a lungo !~I, feminine, wish I had stayed longer.~Resterò certamente;Sono rimasta davvero
[Avrei dovuto prendere] sul serio l'avvertimento.~I should have taken the warning seriously.~Ho sicuramente preso;Prenderò soltanto domani
[Sarebbe stato meglio controllare] prima di inviare.~It would have been better to check before sending.~È già stato controllato senza dubbio;Non occorrerà mai controllare`, `
[Se solo ti avessi ascoltato] !~I wish I had listened to you.~Ti ascolterò certamente domani;Ti ho sicuramente ascoltato
[Avremmo dovuto avvisare] gli altri.~We should have warned the others.~Abbiamo avvisato senza dubbio;Non dovremo mai avvisare`),
u('Calibrate certainty and attribute evidence','Secondo i dati attributes a claim; allo stato attuale limits it to current knowledge. Plausibile ma non dimostrato distinguishes credibility from proof.','Attribution identifies a source without guaranteeing its reliability.',`
[Secondo i dati], la domanda è cresciuta.~The claim is attributed to the data.~Senza alcun indizio;Contro tutti i dati
[Allo stato attuale], non emergono altri danni.~The statement is limited to current knowledge.~Per sempre e senza possibilità di revisione;A prescindere da qualunque informazione
L'ipotesi è [plausibile ma non dimostrata].~The hypothesis is credible but unproven.~definitivamente confutata;provata oltre ogni dubbio
[Stando alla comunicazione ufficiale], i lavori inizieranno a giugno.~The official communication is the source for the June start.~Senza consultare alcuna fonte;In contrasto con ogni comunicazione`, `
Il rapporto [non documenta un aumento significativo].~The report does not document a significant increase.~dimostra definitivamente un aumento;garantisce ogni aumento futuro
[A giudicare dagli indizi], la procedura è cambiata.~The inference is based on available indications.~Per una legge universale;Senza alcun elemento`),
u('Qualify scope without obscuring the claim','Non necessariamente denies necessity, not possibility. Solo in parte limits extent; salvo approvazione makes a commitment conditional.','Non è necessariamente falso does not mean certainly true. Preserve the scope of negation.',`
Più dati [non implicano necessariamente] meno distorsioni.~More data do not necessarily imply less bias.~garantiscono sempre;dimostrano in ogni caso
Il confronto è valido [solo in parte].~The comparison has limited validity.~senza alcuna eccezione;in ogni contesto possibile
La conferma resta [subordinata all'approvazione].~Confirmation depends on approval.~valida anche in caso di rifiuto;priva di condizioni
Il risultato [non è automaticamente generalizzabile].~The result cannot automatically be generalised.~vale certamente ovunque;è sempre del tutto inutile`, `
L'assunto regge [solo in condizioni molto specifiche].~The assumption holds only under very specific conditions.~sempre e senza eccezioni;senza alcun vincolo
La proposta è utile [sotto questo profilo].~The proposal is useful in the specified respect.~in ogni possibile aspetto;in nessuna circostanza`),
u('Understatement and tactful criticism','Non è proprio l’ideale and c’è margine di miglioramento can convey criticism politely. È un’interpretazione ardita questions an inference.','Understatement and irony require context; use explicit wording when a precise instruction matters.',`
Il calendario [non è proprio l'ideale].~The schedule is less than satisfactory.~è perfetto senza riserve;è stato approvato definitivamente
C'è [margine di miglioramento].~Improvement is still needed or possible.~una perfezione assoluta;un divieto di migliorare
È [un'interpretazione ardita].~The interpretation is viewed as a bold or poorly supported leap.~una prova definitiva;un semplice numero
La risposta è, [diciamo, perfezionabile].~The speaker tactfully suggests the response needs work.~senza alcun difetto;definitivamente completa`, `
Il piano è [a dir poco ambizioso].~The plan is at least very ambitious, possibly unrealistically so.~certamente privo di rischi;del tutto privo di obiettivi
Il commento [non è stato particolarmente utile].~The speaker mildly criticises the comment’s usefulness.~è stato il massimo aiuto possibile;dimostra definitivamente tutto`),
u('Adjust register to the relationship','Mi potrebbe inviare is polite; mi mandi can be familiar second-person present or polite imperative depending on context. Choose unambiguous complete requests for the intended relationship.','Lei takes third-person forms; tu takes second-person. Register choices vary with workplace relationships.',`
[Potrebbe inviarmi i documenti], per favore ?~A polite professional request for the documents.~Non invii mai nulla;I documenti sono irrilevanti
[Mi giri il file quando puoi] ?~A familiar request to forward the file when possible.~Le è vietato inviare il file;Il file è stato annullato
[Restiamo in attesa di un cortese riscontro].~A formal statement awaiting a response.~Non vogliamo alcuna risposta;Ogni contatto è vietato
[Fammi sapere se cambia qualcosa].~A familiar request for notice of changes.~Non dirmi mai nulla;Conferma tutto senza leggere`, `
[Le sarei grata per una risposta tempestiva].~A feminine writer courteously requests a prompt reply.~Non risponda in nessun caso;Ogni risposta è ormai inutile
[Mi dai una mano appena puoi] ?~A familiar request for help when available.~Le vieto di aiutarmi;L'aiuto è già stato rifiutato`),
u('Everyday idioms: spontaneous speech and authority','A braccio means without a prepared text; su due piedi means on the spot. Avere l’ultima parola means hold the final say. Essere fuori dai guai means be out of trouble.','A braccio and a memoria are different: without a script is not necessarily reciting something memorised.',`
Ha parlato [a braccio].~The person spoke without a prepared text.~leggendo il copione;dopo una recita imparata parola per parola
[Su due piedi] non saprei rispondere.~I cannot answer on the spot.~Dopo un'analisi completa;Con tutti i dati davanti
In quel reparto [ha lei l'ultima parola].~She has the final say in that department.~non ha alcuna autorità;nessuno la conosce
Con quella conferma sono [fuori dai guai].~The confirmation gets me out of trouble.~in guai ancora peggiori;responsabile di ogni errore
Non lo ricordo [a memoria].~I cannot recall it from memory.~dopo averlo letto sul foglio;con il testo davanti`, `
Sai farmi un esempio [su due piedi] ?~Can you give an example on the spot?~dopo settimane di preparazione;leggendo un copione completo
Chi [ha l'ultima parola] sulla scelta ?~Who has the final say on the choice?~non ha alcuna influenza;ha perso tutti i documenti`),
u('Everyday idioms: reversals, concealment and surprise','Ribaltare la situazione reverses a situation. Mettere la polvere sotto il tappeto conceals problems. Mandare all’aria disrupts plans. Cadere dalle nuvole expresses surprise or unawareness.','Use native idioms for the intended meaning; related English images are not always interchangeable.',`
La testimonianza ha [ribaltato la situazione].~The testimony reversed the situation.~confermato tutto senza cambiamenti;impedito ogni modifica
Non possiamo [mettere la polvere sotto il tappeto].~We cannot conceal the problems.~affrontare apertamente il problema;chiarire ogni errore
L'imprevisto ha [mandato all'aria i nostri piani].~The unexpected event disrupted our plans.~confermato ogni dettaglio;garantito il successo
Con il treno prima [ti conviene di più].~The earlier train puts you in a better practical position.~hai solo svantaggi;perdi ogni possibilità
Alla notizia è [caduta dalle nuvole].~She was taken completely by surprise.~rimasta preparata da mesi;rimasta totalmente indifferente`, `
L'errore non va [nascosto sotto il tappeto].~The error must not be concealed.~discusso apertamente;spiegato con chiarezza
Quell'imprevisto ha [mandato all'aria il programma].~The unexpected event disrupted the schedule.~confermato ogni orario;garantito tutti i risultati`)
]};
