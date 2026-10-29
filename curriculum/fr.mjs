import {u} from './authoring.mjs';
export const frUnits={
A1:[
u('Introduce yourself in French','Use je m’appelle for a name and j’habite à for a town. Ask a short question in return; vous keeps a first meeting polite.','Nationality adjectives agree with the person. Do not add an article before a profession after être.',`
Je [m’appelle] Léa.~My name is Léa.~t’appelles;s’appelle
J’[habite] à Lyon.~I live in Lyon.~habites;habitent
Je [suis] italien.~I am Italian.~es;sommes
Et vous, vous vous [appelez] comment ?~What is your name?~appelle;appellent`, `
Je [m’appelle] Karim et j’habite à Lille.~Karim introduces himself and where he lives.~t’appelles;s’appellent
Nous [sommes] étudiantes.~Several women say they are students.~êtes;sont`),
u('Identity, states and agreement','Être links a subject to an identity or state: je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont. Adjectives commonly agree in gender and number.','Unlike Spanish, French does not divide identity and temporary states between ser and estar.',`
Elle [est] médecin.~She is a doctor.~es;sont
Nous [sommes] fatigués.~We are tired.~suis;êtes
Tu [es] prêt ?~Are you ready?~est;suis
Ils [sont] à la maison.~They are at home.~sommes;est`, `
Vous [êtes] en avance.~You are early.~sont;est
La porte est [fermée].~The door is closed.~fermé;fermés`),
u('Present-tense routines','For regular -er verbs, remove -er and add -e, -es, -e, -ons, -ez, -ent. Subject pronouns are normally stated; written endings can sound alike.','The silent -ent ending of ils parlent is not pronounced like the word lent.',`
Je [travaille] le matin.~I work in the morning.~travailles;travaillent
Nous [habitons] près de la gare.~We live near the station.~habitez;habitent
Vous [étudiez] le français.~You study French.~étudions;étudie
Elles [parlent] doucement.~They speak quietly.~parle;parlez`, `
Tu [aimes] la musique.~You like music.~aime;aimons
Nous [regardons] un film le vendredi.~We watch a film on Fridays.~regardez;regardent`),
u('Order and clarify at a café','Listen for the item, quantity and final choice. Je voudrais is a polite request; sur place and à emporter distinguish eating in from taking away.','Un café normally means a small black coffee in France; specify milk if that is what you want.',`
Je voudrais [un thé], s’il vous plaît.~The customer asks for tea.~un café;un jus
Un café [au lait], s’il vous plaît.~The customer wants coffee with milk.~sans lait;sans café
C’est [à emporter].~The order is to take away.~sur place;pour demain
[L’addition], s’il vous plaît.~The customer asks for the bill.~Le menu;La réservation`, `
Pour moi, [un jus d’orange], s’il vous plaît.~The customer orders orange juice.~un thé;un café
Nous mangeons [sur place].~The customers will eat here.~à emporter;demain`),
u('Ask clear questions','Intonation can turn a statement into a familiar question. Est-ce que is a common neutral frame. Où, quand and comment ask for place, time and manner.','After est-ce que, keep ordinary subject–verb order: est-ce que tu viens, not est-ce que viens-tu.',`
[Est-ce que] vous habitez ici ?~The speaker asks whether the listener lives here.~Parce que;Pendant que
[Où] est la pharmacie ?~The speaker asks where the pharmacy is.~Quand;Combien
[Quand] commence le cours ?~The speaker asks when the class begins.~Qui;Où
[Comment] vous allez à la gare ?~The speaker asks how the listener gets to the station.~Combien;Qui`, `
[Est-ce que] le musée est ouvert ?~The speaker checks whether the museum is open.~Même si;Afin que
[Combien] coûte ce billet ?~The speaker asks the ticket price.~Quand;Qui`),
u('Negatives and useful contrasts','In careful standard French, ne/n’ precedes the conjugated verb and pas follows it. Ne…jamais means never; ne…plus means no longer. Informal speech often omits ne.','After a negative of quantity, un/une/des commonly become de; with être the article is normally retained.',`
Je ne comprends [pas].~I do not understand.~plusieurs;encore toujours
Elle n’habite [plus] ici.~She no longer lives here.~toujours;déjà
Nous n’avons pas [de] voiture.~We do not have a car.~une;des
Ce n’est pas [un] problème.~It is not a problem.~de;du`, `
Je ne bois [jamais] de café.~I never drink coffee.~toujours;souvent
Il n’y a pas [de] lait.~There is no milk.~du;un`),
u('Food and quantities','Use du, de la and de l’ for unspecified amounts; des introduces plural items. After a quantity such as un kilo, use de.','The partitive changes with grammatical gender and the following sound, not with the English translation.',`
Je prends [du pain].~I am taking some bread.~de la pain;des pain~some bread
Nous achetons [de l’eau].~We are buying some water.~du eau;de la eau~some water
Il faut un kilo [de pommes].~We need a kilo of apples.~des pommes;du pommes~of apples
Elle veut [de la soupe].~She wants some soup.~du soupe;des soupe~some soup
Je voudrais [deux œufs].~I would like two eggs.~deux œuf;deux œufs de~two eggs
Nous avons [des tomates].~We have some tomatoes.~du tomates;de la tomates~some tomatoes`, `
Il reste [du fromage].~There is some cheese left.~de la fromage;des fromage
J’achète une bouteille [d’eau].~I am buying a bottle of water.~de l’eau;du eau`),
u('Places and position in town','Learn the noun with its article and use complete position phrases. À côté de, en face de and près de express different relations. De + le contracts to du.','Do not confuse devant, in front of, with en face de, across from or opposite.',`
La banque est [à côté de] la poste.~The bank is next to the post office.~loin de;à l’intérieur de~next to
Le café est [en face du] musée.~The café is opposite the museum.~en face de le;en face au~opposite the
Je vais [à la gare].~I am going to the station.~au gare;à le gare~to the station
Nous attendons [devant] le cinéma.~We are waiting in front of the cinema.~derrière;sous~in front of
Il y a [une pharmacie] ici.~There is a pharmacy here.~un pharmacie;de pharmacie~a pharmacy
Le parc est [près de] l’école.~The park is near the school.~au-dessus de;dans~near`, `
L’hôtel est [derrière] la mairie.~The hotel is behind the town hall.~devant;sur
Le marché est [à côté du] parking.~The market is next to the car park.~à côté de le;à côté au`),
u('Polite contact and interruptions','Excusez-moi attracts attention or introduces a small interruption. Pardon can apologise for a minor mistake or ask for repetition. Match tu/vous to the relationship.','Excusez-moi and s’il vous plaît are different social acts; one does not replace the other in every situation.',`
[Excusez-moi], cette place est libre ?~The speaker politely attracts a stranger’s attention.~À bientôt;De rien
[S’il vous plaît], pouvez-vous fermer la porte ?~The speaker adds a polite request marker.~Enchanté;À demain
[Merci beaucoup] pour votre aide.~The speaker thanks someone warmly for their help.~Pardon;Bonsoir
[De rien], avec plaisir.~The speaker responds to thanks.~S’il vous plaît;Désolé`, `
[Pardon], je vous ai marché sur le pied.~The speaker apologises for stepping on someone’s foot.~Bienvenue;Bon courage
[Enchantée], je suis votre nouvelle collègue.~A woman says she is pleased to meet a new colleague.~De rien;À tout à l’heure`),
u('Ask for repetition and meaning','Use a repair phrase before guessing. Pouvez-vous répéter asks for the same words again; plus lentement asks for a slower pace; qu’est-ce que…veut dire asks about meaning.','Plus fort asks for greater volume, not slower speech.',`
Pouvez-vous [répéter], s’il vous plaît ?~The speaker asks the listener to repeat.~partir;écrire demain
Un peu plus [lentement], s’il vous plaît.~The speaker asks for slower speech.~fort;tôt
Qu’est-ce que ce mot [veut dire] ?~The speaker asks what the word means.~va faire;a acheté
Je n’ai pas [compris].~The speaker says they did not understand.~répondu;commandé`, `
Vous pouvez parler plus [fort] ?~The speaker asks for greater volume.~lentement;tard
Comment ça [s’écrit] ?~The speaker asks how to spell it.~se mange;se vend`),
u('Say what you need','Avoir besoin de introduces a needed thing or action. Il me faut also expresses need. Avoir faim and avoir soif use avoir rather than être.','De + vowel becomes d’: besoin d’aide, besoin d’eau.',`
J’ai besoin [d’aide].~I need help.~de aide;à aide
Il me faut [un billet].~I need a ticket.~un reçu;une gare
J’ai [faim].~I am hungry.~soif;froid
Elle a besoin de [se reposer].~She needs to rest.~se repose;se reposait`, `
Nous avons [soif].~We are thirsty.~soifs;soifés
J’ai besoin [de partir].~I need to leave.~à partir;de pars`),
u('Times of day and arrangements','Le matin can describe mornings generally; ce matin refers to this morning. Use à with clock times and vers for an approximate time.','À huit heures is a time; pendant huit heures is a duration.',`
Je travaille [le matin].~I work in the mornings.~hier matin seulement;pendant la nuit dernière
On se retrouve [à huit heures].~We will meet at eight.~pendant huit heures;depuis huit heures
Je rentre [ce soir].~I am coming home this evening.~hier soir;la semaine dernière
Le train part [vers midi].~The train leaves at about noon.~depuis midi;pendant midi`, `
Je suis libre [cet après-midi].~I am free this afternoon.~hier après-midi;la nuit dernière
La réunion dure [une heure].~The meeting lasts one hour.~à une heure;vers une heure`)
],
A2:[
u('Completed events with the passé composé','Build the passé composé with a present auxiliary and a past participle. Most verbs use avoir; common movement verbs and reflexive verbs use être.','With être, the participle agrees with the subject. With avoir, agreement involves a preceding direct object, not simply the subject.',`
Hier, j’[ai visité] le musée.~I visited the museum yesterday.~visite;visiterai
Elle [est arrivée] à neuf heures.~She arrived at nine.~a arrivé;est arrivé
Nous [avons pris] le train.~We took the train.~avons prend;sommes pris
Ils [sont partis] tôt.~They left early.~ont partis;sont parti`, `
Tu [as fini] ton travail hier.~You finished your work yesterday.~finis;vas finir
Marie [est rentrée] à pied.~Marie came home on foot.~a rentrée;est rentré`),
u('Arrange a meeting and offer an alternative','Combine a proposal with a time and place, then ask whether it suits the listener. On peut and ça te dit are common in familiar arrangements.','A proposal is not a confirmed appointment; wait for the other person to accept the details.',`
[Ça te dit] de déjeuner ensemble ?~Would you like to have lunch together?~Tu as déjà;Tu viens de
On se retrouve [devant la gare] ?~Shall we meet in front of the station?~derrière le musée;chez mon frère
[Plutôt samedi], si ça te va.~Saturday would suit me better, if that works for you.~Hier seulement;Jamais samedi
[On pourrait] essayer ce café.~We could try that café.~Nous avons dû;Nous venons de`, `
Je suis pris vendredi. [Et dimanche] ?~I am busy Friday; how about Sunday?~Donc vendredi;Comme vendredi
[Ça me va], à dix heures devant le cinéma.~I accept the proposed arrangement at ten in front of the cinema.~Je suis indisponible;Je ne suis pas d’accord`),
u('French sound: final letters and linked words','Many written final consonants are silent, but pronunciation depends on the word and context. Obligatory liaison links certain final consonants before a vowel; enchaînement links a consonant already pronounced.','Do not insert liaison everywhere: it is forbidden after et and normally absent after a singular noun.',`
Les [amis] arrivent.~The friends are arriving; les links to amis with a z sound.~héros;garçons
Nous [avons] un rendez-vous.~We have an appointment; nous links to avons with a z sound.~êtes;ont
Un [petit enfant] dort.~A small child is sleeping; petit links to enfant with a t sound.~grand chien;petit chat
Elle est grande [et intelligente].~She is tall and intelligent; there is no liaison after et.~mais absente;et petite`, `
Vous [êtes] prêts ?~Are you ready; vous links to êtes with a z sound.~sommes;sont
[Les enfants] jouent dehors.~The children play outside; les links to enfants with a z sound.~Les garçons;Les filles`),
u('Follow a route and check the landmark','Listen for the sequence and the reference point. Tout droit means straight ahead; à gauche and à droite give different turns; traversez means cross.','La deuxième rue is the second street; do not turn at the first street simply because you hear rue.',`
Continuez [tout droit].~Continue straight ahead.~à gauche;en arrière
Tournez [à droite] après le pont.~Turn right after the bridge.~à gauche;avant le pont
Prenez [la deuxième rue] à gauche.~Take the second street on the left.~la première rue;la dernière porte
[Traversez] la place.~Cross the square.~Contournez;Évitez`, `
La banque est [à gauche], après la pharmacie.~The bank is on the left after the pharmacy.~à droite;avant la pharmacie
Passez [devant la mairie], puis tournez.~Go past the town hall before turning.~derrière la gare;dans la mairie`),
u('Ask about a past event','Use the conjugated auxiliary in a passé composé question. Est-ce que keeps normal subject order; an informal question can use intonation.','The past participle does not become an infinitive merely because the sentence is a question.',`
Est-ce que tu [as vu] ce film ?~Did you see that film?~as voir;es vu
Quand est-ce qu’elle [est partie] ?~When did she leave?~a parti;est partir
Vous [avez choisi] une date ?~Have you chosen a date?~avez choisir;êtes choisi
Où [avez-vous acheté] ce livre ?~Where did you buy that book?~vous avez acheter;êtes-vous acheté`, `
Pourquoi est-ce qu’ils [ont annulé] la sortie ?~Why did they cancel the outing?~sont annulé;ont annuler
Avec qui [es-tu venu] ?~Who did you come with?~as-tu venu;es-tu venir`),
u('Past background and interrupted actions','The imparfait presents an ongoing background, state or repeated past habit; the passé composé presents a bounded event. Form the imparfait from the present nous stem, normally without -ons, plus -ais, -ais, -ait, -ions, -iez, -aient.','Être has the irregular stem ét-. A long event can still take the passé composé when presented as completed.',`
Quand le téléphone a sonné, je [lisais].~I was reading when the phone rang.~lirais;lirai
Nous [habitions] près du fleuve à cette époque.~We lived near the river at that time.~habiterons;habiterions
Il [faisait] froid, alors nous sommes rentrés.~It was cold, so we came home.~fera;ferait
Tous les étés, elle [allait] chez sa tante.~She used to visit her aunt every summer.~ira;irait`, `
Je [dormais] quand tu as appelé.~I was sleeping when you called.~dormirai;dormirais
Le repas [était] prêt quand ils sont arrivés.~The meal was ready when they arrived.~sera;serait`),
u('Book a room and state your requirements','Use a complete booking request and specify dates, room type and services. Pour deux nuits gives the length of the stay; du…au… gives the date range.','Une chambre double describes the room type; it does not always specify the exact bed arrangement. Ask if it matters.',`
Je voudrais [une chambre double].~I would like a double room.~un chambre double;une chambre doubles~a double room
Nous restons [deux nuits].~We are staying for two nights.~deux nuit;deux nuits de~two nights
Le [petit déjeuner] est compris ?~Is breakfast included?~petit dîner;petite déjeuner~breakfast
Y a-t-il [un ascenseur] ?~Is there a lift?~une ascenseur;des ascenseur~a lift
Je préfère [deux lits séparés].~I prefer twin beds.~deux lit séparé;deux lits séparée~two separate beds
À quelle heure est [le départ] ?~What time is check-out?~la départ;les départ~departure or check-out`, `
Avez-vous une chambre [pour trois nuits] ?~Do you have a room for three nights?~depuis trois nuits;il y a trois nuits
Le prix comprend [la taxe de séjour] ?~Does the price include the tourist tax?~le taxe de séjour;les taxe de séjour`),
u('Work tasks and deadlines','Distinguish a deadline from a duration and a meeting time. D’ici vendredi means by Friday; vendredi à quinze heures identifies a time on that day.','Un délai is a period allowed or a deadline; it is not automatically the same as an English delay, often un retard.',`
Le [délai] est de trois jours.~The allowed time is three days.~délaisons;départage~time allowed
Il faut envoyer [le devis].~The quotation must be sent.~la devis;les devis~a quotation
Nous avons [une réunion] demain.~We have a meeting tomorrow.~un réunion;une réunions~a meeting
Le rapport est [en retard].~The report is late.~à l’avance;à temps~late
Qui est [responsable du dossier] ?~Who is responsible for the file?~responsable de le dossier;responsables du dossier~responsible for the case
Je dois [confirmer le rendez-vous].~I must confirm the appointment.~confirmé le rendez-vous;confirmons le rendez-vous~confirm the appointment`, `
Merci de répondre [d’ici mardi].~Please reply by Tuesday.~pendant mardi;depuis mardi
Nous devons respecter [la date limite].~We must meet the deadline.~le date limite;les date limite`),
u('Make suggestions without pressure','On pourrait offers a possibility; et si…followed by the imparfait suggests a shared action. Pourquoi ne pas + infinitive also offers a possible course of action.','Et si on partait is a suggestion, not a statement that departure already happened.',`
[Et si on prenait] le bus ?~How about taking the bus?~Puisque nous avons pris;Malgré nous prenons
[On pourrait] reporter la réunion.~We could postpone the meeting.~On vient de;On a dû hier
[Pourquoi ne pas] demander de l’aide ?~Why not ask for help?~Sans avoir;Avant que
[Ça vous dirait] de participer ?~Would you like to take part?~Vous avez déjà participé;Vous ne devez pas`, `
[Et si on essayait] un autre horaire ?~How about trying another time?~Comme nous avons essayé;Depuis que nous essayons
[Je propose de] commencer par les questions.~I suggest starting with the questions.~Je viens de;J’ai oublié de`),
u('Accept, refuse and negotiate a request','Accept clearly or state a practical constraint and offer an alternative. Je peux…si…makes the condition explicit; je suis désolé softens a refusal without changing its meaning.','Pas de souci usually accepts or reassures; it does not by itself clarify a changed deadline.',`
[Pas de souci], je m’en occupe.~I agree to take care of it.~Impossible;Pas cette fois
Je peux le faire [si vous repoussez l’autre échéance].~I can do it if the other deadline is moved.~malgré mon refus;après avoir déjà terminé
[Malheureusement], je ne suis pas disponible.~I politely say I am unavailable.~Avec plaisir;Volontiers
[Est-ce que demain vous conviendrait] ?~I ask whether tomorrow would suit you.~Vous êtes venu hier;Vous avez refusé demain`, `
[Avec plaisir], je peux vous aider cet après-midi.~I am happy to help this afternoon.~Je refuse;Je ne pourrai pas
Je ne peux pas aujourd’hui, [mais je peux vendredi].~I offer Friday as an alternative to today.~donc je refuse toujours;car vendredi est impossible`),
u('Frequency and changing habits','Souvent and rarement express frequency; de temps en temps means occasionally. De plus en plus and de moins en moins describe a changing tendency.','A frequency adverb does not itself identify a completed event; interpret the verb and time context too.',`
Je prends le vélo [de temps en temps].~I cycle occasionally.~chaque minute sans arrêt;une seule fois hier
Elle vient [souvent] le samedi.~She often comes on Saturdays.~jamais;une fois l’an seulement
Nous mangeons [de moins en moins] de viande.~We are eating progressively less meat.~de plus en plus;exactement autant
Il arrive [rarement] en retard.~He is rarely late.~toujours;presque chaque jour`, `
Je lis [de plus en plus] en français.~I am reading increasingly often in French.~de moins en moins;une seule fois
[En général], nous partons vers huit heures.~We usually leave at about eight.~Une seule fois;Hier uniquement`),
u('Describe an eventual outcome','Finir par + infinitive describes what eventually happens, often after hesitation or other developments. Se rendre compte de expresses realisation.','Venir de + infinitive means have just done something, not eventually do it.',`
Nous avons fini [par réserver] une autre salle.~We eventually booked another room.~de réserver;à réserver
Je me suis [rendu compte] de mon erreur.~I realised my mistake.~rendu visite;mis d’accord
Elle vient [de partir].~She has just left.~par partir;à partir
[Finalement], nous sommes restés chez nous.~In the end, we stayed at home.~Au début;Avant tout`, `
Après plusieurs appels, j’ai fini [par obtenir] une réponse.~After several calls, I eventually got an answer.~d’obtenir;à obtenir
Ils viennent [d’arriver].~They have just arrived.~par arriver;à arriver`)
],B1:[
u('Explain a purpose','Pour and afin de introduce an infinitive when the subject stays the same. Pour que and afin que introduce a clause, normally with the subjunctive, when another subject is involved.','Do not use pour que followed directly by an infinitive.',`
Je suis venu pour [discuter] du projet.~I came to discuss the project.~discute;discutons
Elle parle lentement pour que nous [comprenions].~She speaks slowly so that we can understand.~comprenons;comprendre
Nous partons tôt afin [d’éviter] les bouchons.~We are leaving early to avoid traffic jams.~à éviter;que éviter
Je t’écris pour [te prévenir].~I am writing to warn you.~te préviens;tu prévenir`, `
Il économise pour [acheter] un vélo.~He is saving to buy a bicycle.~achète;achetons
J’ai laissé un message pour qu’elle [puisse] me rappeler.~I left a message so that she could call me back.~peut;pouvoir`),
u('Express possibility without certainty','Peut-être que normally takes the indicative; il est possible que and il se peut que take the subjunctive. The speaker’s wording signals uncertainty, not a fixed numerical probability.','Il est possible qu’il vienne does not guarantee that he will come.',`
Il est possible qu’elle [vienne] demain.~It is possible that she will come tomorrow.~vient;venir
[Peut-être qu’]ils ont oublié.~Perhaps they forgot.~Il faut qu’;Pour qu’
Il se peut que nous [soyons] en retard.~We may be late.~sommes;être
Ce document [pourrait] être utile.~This document could be useful.~doit forcément;ne peut jamais`, `
Il est possible que le magasin [soit] fermé.~The shop may be closed.~est;être
[Peut-être que] nous trouverons une autre solution.~Perhaps we will find another solution.~Bien que;Afin que`),
u('Read cause, contrast and consequence','Parce que gives a reason; pourtant and cependant introduce contrast; donc and c’est pourquoi introduce a consequence. Read both clauses before choosing the relation.','A contrast marker does not make either of the connected statements false.',`
La route était fermée ; [c’est pourquoi] nous avons fait un détour.~The detour is a consequence of the road closure.~pourtant;bien que
Il pleuvait ; [pourtant], le match a eu lieu.~The match took place despite the rain.~donc;parce que
Je suis resté chez moi [parce que] j’étais malade.~Illness explains why I stayed home.~donc;pourtant
Le billet est cher. [Cependant], il inclut tous les transports.~The included transport qualifies the objection about price.~Par conséquent;C’est pourquoi`, `
Le bus n’est pas passé ; [donc], nous avons marché.~Walking was a consequence of the missing bus.~pourtant;cependant
Le service est lent ; [en revanche], les plats sont excellents.~Good food contrasts with slow service.~par conséquent;parce que`),
u('Write a clear practical request','State the context, specify the information you need and end with a concrete polite request. Pourriez-vous softens a request; merci de can introduce a concise instruction.','A polite opening cannot repair an unclear request: say which booking, date or document you mean.',`
[Pourriez-vous] confirmer l’heure d’arrivée ?~I politely ask for the arrival time to be confirmed.~Vous venez de;Vous n’avez pas
Je vous écris [au sujet de] ma réservation.~I identify my booking as the topic of the message.~en dépit de;à la place de
Merci de me répondre [avant jeudi].~I ask for a reply before Thursday.~depuis jeudi;pendant jeudi
[Je vous remercie] de votre aide.~I thank the recipient for their help.~Je vous interdis;Je vous accuse`, `
[Serait-il possible] d’obtenir une chambre plus calme ?~I politely ask whether a quieter room is possible.~Est-il interdit;Il est déjà décidé
Pourriez-vous m’envoyer [une confirmation écrite] ?~I request written confirmation.~une invitation annulée;un paiement anticipé`),
u('Life experience and continuing duration','Use the passé composé for experiences and completed events, often with déjà or jamais. A situation continuing now commonly uses the present with depuis.','Do not copy the English present perfect mechanically: j’habite ici depuis deux ans uses the French present.',`
J’[ai déjà visité] ce musée.~I have already visited that museum.~visiterai demain;visite actuellement
Elle [habite] ici depuis trois ans.~She has been living here for three years and still does.~a habité;habitera
[As-tu déjà] travaillé à l’étranger ?~Have you ever worked abroad?~Travailleras-tu demain;Viens-tu de
Nous [n’avons jamais vu] la mer.~We have never seen the sea.~voyons toujours;verrons forcément`, `
Il [travaille] dans cette équipe depuis janvier.~He has worked in this team since January and still does.~travaillera;travaillerait demain
J’[ai déjà rencontré] la directrice.~I have already met the director.~rencontrerai demain;rencontre actuellement`),
u('An event before another past event','The plus-que-parfait uses an imparfait auxiliary plus the past participle: j’avais terminé, elle était partie. It locates an event before an established past reference point.','Keep the auxiliary and agreement pattern of the underlying verb; it is not simply an extra ending on the participle.',`
Quand je suis arrivé, elle [était déjà partie].~She had already left before I arrived.~partira demain;est en train de partir
Nous [avions réservé] avant de recevoir l’invitation.~We had booked before receiving the invitation.~réserverons;sommes en train de réserver
Il a compris qu’il [avait oublié] ses clés.~He realised he had forgotten his keys.~oubliera;oublie demain
J’[avais fini] lorsque tu as appelé.~I had finished when you called.~finirai;vais finir`, `
Les voyageurs [étaient descendus] avant le départ.~The passengers had got off before departure.~descendront;ont descendre
Elle [avait préparé] le dossier avant la réunion.~She had prepared the file before the meeting.~préparera;prépare demain`),
u('Future plans, promises and predictions','The futur proche uses aller + infinitive. The futur simple often states a prediction, promise or future event; many verbs use an irregular stem such as ser-, aur- or ir-.','After quand referring to a future event, French can use a future form: quand tu arriveras.',`
Demain, nous [partirons] à huit heures.~Tomorrow we will leave at eight.~partions;sommes partis
Je [vais appeler] le médecin.~I am going to call the doctor.~vais appelle;va appeler
Quand tu [arriveras], appelle-moi.~Call me when you arrive in the future.~arriverais;arrivais
Je te [rappellerai], c’est promis.~I promise I will call you back.~rappellerais si possible;avais rappelé`, `
Vous [aurez] la réponse demain.~You will have the answer tomorrow.~aviez;aviez eu
Ils [vont déménager] le mois prochain.~They are going to move next month.~vont déménagent;va déménager`),
u('Hypotheses and polite conditional forms','A present unreal or tentative condition commonly uses si + imparfait with a conditionnel result. The conditional also softens requests and suggestions.','Do not put the conditional immediately after si in this hypothetical pattern: si j’avais, not si j’aurais.',`
Si j’avais plus de temps, je [lirais] davantage.~With more time, I would read more.~lirai;lisais
À ta place, je [demanderais] confirmation.~In your position, I would ask for confirmation.~demanderai;avais demandé
[Pourriez-vous] m’expliquer ce point ?~Could you explain this point to me?~Vous avez pu;Vous allez devoir
Si nous habitions plus près, nous [viendrions] à pied.~If we lived nearer, we would come on foot.~viendrons;venions`, `
Si elle connaissait l’adresse, elle [viendrait].~If she knew the address, she would come.~viendra;venait hier
J’[aimerais] vous poser une question.~I would like to ask you a question.~aimerai;avais aimé`),
u('Reformulate and check understanding','Autrement dit and en d’autres termes introduce a paraphrase. Si je comprends bien checks an interpretation instead of pretending certainty.','A reformulation should preserve the original scope and conditions, not strengthen the claim.',`
[Autrement dit], le service reste ouvert le samedi.~I restate that the service remains open on Saturdays.~Malgré tout;En conséquence uniquement
[Si je comprends bien], le prix inclut la livraison ?~I check whether delivery is included.~Comme c’est certain;Même si j’ignore
[En d’autres termes], nous devons attendre l’accord.~I paraphrase that approval is needed first.~À la place;Sans aucun rapport
[Ce que je veux dire], c’est qu’il manque une étape.~I clarify that a step is missing.~Ce que j’ai oublié;Ce que je refuse de savoir`, `
[Si je vous suis bien], les deux options restent possibles ?~I check whether both options remain possible.~Il est prouvé que;Je refuse que
[Pour le dire autrement], le délai n’est pas encore fixé.~I restate that the deadline is not yet fixed.~Pour changer de sujet;Pour nier les faits`),
u('Offer an alternative and keep discussion open','À la place proposes a substitution; sinon introduces another option if the first does not work. On peut aussi adds an alternative without rejecting the first idea.','Sinon can also mean otherwise with a consequence; the surrounding sentences determine its role.',`
[On peut aussi] se retrouver en ligne.~I add meeting online as another option.~Il serait prématuré de;On a déjà fini de
[Sinon], je suis libre mardi.~I offer Tuesday if the first arrangement does not work.~Comme convenu hier;À cause de cela seulement
[À la place], prenons une salle plus petite.~I suggest substituting a smaller room.~De la même façon;En plus du même
[Une autre possibilité serait] de répartir les tâches.~I propose dividing the tasks as another possibility.~La seule obligation est;Le résultat certain est`, `
[Si cela ne convient pas], nous pouvons reporter.~I offer postponement if the arrangement is unsuitable.~Puisque tout est accepté;Même après l’annulation
[Pourquoi ne pas] commencer par un essai ?~I suggest starting with a trial.~À condition d’avoir fini;Sans jamais`),
u('Figurative expressions for help and resources','Donner un coup de main means help; mettre la main à la pâte means take an active part. Distinguish assistance from handing over responsibility.','These figurative expressions are conversational; use precise task descriptions in a formal agreement.',`
Tu peux me [donner un coup de main] ?~Can you help me?~demander des comptes;tenir à l’écart
Tout le monde a [mis la main à la pâte].~Everyone actively helped with the work.~baissé les bras;changé de sujet
Nous avons [un coup de pouce] de la mairie.~We have a helpful boost from the town hall.~un refus définitif;un retard imposé
Elle [s’en est sortie] malgré les difficultés.~She managed despite the difficulties.~a renoncé immédiatement;est restée bloquée`, `
Les voisins nous ont [donné un coup de main] pour déménager.~The neighbours helped us move.~demandé des comptes;laissés de côté
Avec ce soutien, il a réussi à [s’en sortir].~With this support, he managed to get through it.~tout abandonner;aggraver la situation`),
u('Realisation and a change of understanding','Se rendre compte de expresses realisation; prendre conscience de can stress growing awareness. Ça fait tilt and percuter are more informal reactions.','Percuter is familiar in this figurative sense; it also has a literal collision meaning in other contexts.',`
Je me suis [rendu compte] que l’adresse était fausse.~I realised the address was wrong.~mis d’accord;fait plaisir
Elle a [pris conscience] de l’importance du problème.~She became aware of how important the problem was.~fait abstraction;perdu le souvenir
Quand tu as montré le plan, [ça a fait tilt].~The plan suddenly made the idea click for me.~tout était oublié;je suis parti
Je n’avais pas [percuté] que c’était ton frère.~I had not twigged that he was your brother.~interdit;promis`, `
Il s’est [rendu compte] qu’il avait laissé son sac.~He realised he had left his bag behind.~mis au travail;fait inviter
C’est à ce moment-là que [j’ai compris].~That was when I understood.~j’ai tout refusé;j’ai changé de sujet`)
],B2:[
u('Hear corrected travel details','Follow the final confirmed information rather than the first number mentioned. En fait and finalement can introduce a correction or a change of plan.','A rejected proposal is not the final arrangement, even if it appears first in the recording.',`
Le train ne partira pas de la voie trois, mais [de la voie cinq].~The final platform is five.~de la voie trois;de la voie deux
Le départ était prévu à dix heures ; il est reporté [à dix heures vingt].~The revised departure is 10:20.~à dix heures;à neuf heures vingt
Les billets restent valables [sans supplément].~Existing tickets are valid without an extra charge.~avec un supplément;après un nouvel achat
Le bus remplacera le train [jusqu’à la gare centrale].~The replacement bus goes as far as Central Station.~jusqu’à l’aéroport;jusqu’au musée`, `
Nous avions annoncé la porte B2 ; embarquement finalement [à la porte B6].~The final boarding gate is B6.~à la porte B2;à la porte C2
Le service reprend [demain matin], et non ce soir.~The service resumes tomorrow morning, not tonight.~ce soir;demain soir`),
u('Hear support with a qualification','Support can be limited by a condition or reservation. À condition que, pourvu que and sous réserve de signal limits; pas forcément rejects certainty, not every possibility.','A speaker who supports a trial does not necessarily support permanent adoption.',`
Je suis favorable à un essai, [à condition qu’il soit évalué].~The speaker supports an evaluated trial.~même sans évaluation;uniquement si tout est abandonné
Le projet est intéressant, [mais le coût reste à préciser].~The speaker sees merit but wants the cost clarified.~et le coût ne pose aucune question;donc il faut le supprimer
Les résultats sont encourageants, [pas forcément définitifs].~The results are promising but not conclusive.~certainement définitifs;nécessairement faux
D’accord pour avancer, [sous réserve d’un financement].~Progress depends on funding.~sans aucune condition;malgré tout refus`, `
Je soutiens l’idée, [pourvu que les usagers soient consultés].~Support is conditional on consulting users.~même si personne ne l’est;à condition de tout annuler
La mesure peut aider, [sans tout résoudre].~The measure may help without solving everything.~en garantissant tout;en ne servant à rien`),
u('Counterfactuals and concessive conditions','Si + imparfait with the conditionnel presents an unreal or tentative present. Même si normally takes the indicative, whereas bien que takes the subjunctive.','A concession acknowledges an obstacle; it does not automatically make the main claim false.',`
Si le budget était plus élevé, nous [pourrions] recruter.~With a larger budget, we could recruit.~pouvons sûrement;avons pu hier
Même si cela [coûte] cher, le contrôle reste nécessaire.~Even if it costs a lot, the check is needed.~coûter;coûtions
Bien que le dossier [soit] incomplet, il mérite un examen.~Although the file is incomplete, it deserves review.~est;être
Si j’étais à votre place, je [vérifierais] la source.~In your position, I would check the source.~vérifierai;ai vérifié`, `
Bien qu’ils [aient] peu de temps, ils relisent le texte.~Although they have little time, they reread the text.~ont;avoir
Même si la réponse [est] négative, nous demanderons des précisions.~Even if the answer is negative, we will ask for details.~être;étions`),
u('Read a qualified argument','Certes concedes a point; mais can then limit its significance. Ne…que means only. Au moins and tout au plus place different bounds on an assessment.','Do not read a limited positive finding as universal support for the whole policy.',`
[Certes], le trajet est plus court, mais il est moins fréquent.~The writer concedes the shorter journey before a drawback.~Par conséquent;Au contraire seulement
La mesure [ne concerne que] les nouveaux contrats.~The measure applies only to new contracts.~concerne aussi;exclut entièrement
Les données suggèrent [tout au plus] une amélioration modeste.~The strongest warranted conclusion is a modest improvement.~au moins une réussite totale;nécessairement aucune évolution
L’idée est utile, [sans pour autant suffire].~The idea is useful but not sufficient.~et résout nécessairement tout;donc totalement inutile`, `
La hausse est réelle, [mais son origine reste incertaine].~The increase is accepted while its cause is uncertain.~et sa cause est démontrée;donc elle n’existe pas
Ce résultat est [au moins encourageant].~At a minimum, the result is encouraging.~nécessairement catastrophique;certainement définitif`),
u('Duration, progress and the reference point','French often uses a simple present with depuis for an activity continuing now. Être en train de stresses an activity in progress. An imparfait reference moves the ongoing viewpoint into the past.','French has no general equivalent requiring a present-perfect-continuous form whenever English uses one.',`
Cela fait deux heures que nous [attendons].~We have been waiting for two hours and still are.~attendrons;avions attendu puis sommes partis
Elle [est en train de relire] le contrat.~She is currently rereading the contract.~vient de finir de relire;relira l’an prochain
Quand vous êtes arrivé, nous [attendions depuis une heure].~We had already been waiting for an hour at your arrival.~attendrons une heure;commencerons demain
Il [travaille sur ce dossier depuis lundi].~He has been working on this file since Monday and still is.~commencera lundi prochain;a cessé avant lundi`, `
Voilà trois semaines qu’elle [cherche] une réponse.~She has been looking for an answer for three weeks and still is.~cherchera;avait cessé de chercher
À midi, ils [étaient en train de négocier].~At noon they were in the middle of negotiating.~ont négocié demain;négocieront la semaine prochaine`),
u('Past unreal conditions','Use si + plus-que-parfait for an unreal past condition and conditionnel passé for its unreal consequence. A mixed condition can connect a past cause with a present consequence.','The conditionnel passé uses avoir or être in the conditional plus a participle; keep agreement where required.',`
Si j’avais su, je [serais venu].~If I had known, I would have come.~viendrai;viens demain
Sans ce retard, nous [aurions terminé] hier.~Without the delay, we would have finished yesterday.~terminerons;terminons demain
Si elle était partie plus tôt, elle [aurait pris] le train.~Had she left earlier, she would have caught the train.~prendra;prenait
Si tu avais gardé le reçu, tu [pourrais demander] un remboursement aujourd’hui.~Keeping the receipt would now allow a refund request.~as forcément obtenu;avais déjà obtenu`, `
Si nous avions vérifié, nous [aurions évité] cette erreur.~Checking would have prevented this past error.~éviterons;évitons demain
Elle [serait arrivée] à temps si le bus avait circulé.~She would have arrived in time if the bus had run.~arrivera;était arrivée`),
u('Weigh options without pretending certainty','D’un côté…de l’autre weighs competing considerations. Tout bien considéré introduces an overall judgement; faute de means because something is lacking.','Weighing an option does not mean promising its success or dismissing every drawback.',`
[D’un côté], le prix est élevé ; de l’autre, l’entretien est inclus.~The speaker balances price against included maintenance.~Sans aucun doute;À défaut de tout
[Tout bien considéré], l’option locale semble préférable.~The speaker gives a considered overall preference.~Sans rien examiner;Contre toute information
[Faute de] garanties, nous attendrons.~We will wait because guarantees are lacking.~Grâce à;En plus de
[Il reste à voir] si le gain sera durable.~The durability of the gain is still uncertain.~Il est démontré;Il est impossible`, `
[À première vue], le projet paraît viable, mais il faut le chiffrer.~The initial impression is positive pending costing.~Après une preuve définitive;Sans aucune réserve
[Le principal compromis] concerne la souplesse des horaires.~The main trade-off concerns schedule flexibility.~Le bénéfice garanti;La certitude absolue`),
u('Turn a proposal into a workable plan','Mettre en œuvre concerns implementing a decision; faire le point reviews the current state; tenir compte de incorporates a relevant factor.','Faire le point is a review, not necessarily a final decision to stop or proceed.',`
Il faut [mettre en œuvre] la procédure approuvée.~We need to implement the approved procedure.~rejeter sans examen;cacher définitivement
Faisons [le point] sur ce qui reste à faire.~Let us review what remains to be done.~un détour;semblant
Le calendrier doit [tenir compte des] congés.~The timetable must take holidays into account.~faire abstraction des;se passer des
Qui va [prendre en charge] le suivi ?~Who will take responsibility for follow-up?~renoncer à;se méfier de`, `
Nous devons [passer à l’action] après la validation.~After approval, we need to act.~revenir sans cesse au début;tout dissimuler
[Fixons une échéance] pour chaque étape.~Let us set a deadline for each stage.~Oublions les dates;Annulons toutes les étapes`),
u('Idioms for workload and pressure','Avoir du pain sur la planche means having a lot to do; être débordé means being overwhelmed with work. Tenir le coup means keep going under difficulty.','These are figurative descriptions, not precise measurements of workload or a clinical assessment.',`
Nous avons [du pain sur la planche] avant vendredi.~We have a lot of work to do before Friday.~tout le temps libre;déjà tout terminé
Je suis [débordé] cette semaine.~I am overwhelmed with work this week.~entièrement disponible;en vacances sans tâche
Elle [tient le coup] malgré les changements.~She is managing to keep going despite the changes.~abandonne immédiatement;ignore tout
Je suis [au bout du rouleau] après ces journées.~I feel exhausted after these days.~plein d’énergie;libre de toute contrainte`, `
Avec trois dossiers urgents, il est [débordé].~With three urgent files, he is overwhelmed with work.~sans aucune tâche;totalement disponible
On va [tenir le coup] jusqu’à l’arrivée du renfort.~We will keep going until extra help arrives.~abandonner avant de commencer;faire disparaître les difficultés`),
u('Persist, recover and reconsider','Ne pas baisser les bras encourages persistence; rebondir can describe recovering from a setback. Garder le cap means maintaining a direction, not refusing all new evidence.','Persistence can include revising a method. An idiom is not proof that continuing is always the right choice.',`
Après ce refus, elle n’a pas [baissé les bras].~She did not give up after the refusal.~continué à essayer;gardé espoir
L’équipe a su [rebondir] après l’échec.~The team managed to recover after the failure.~renoncer définitivement;cacher tout résultat
Nous repartons [du bon pied] avec un accord clair.~We are making a fresh positive start with a clear agreement.~sans aucun accord;dans la même confusion
Malgré les difficultés, il faut [garder le cap].~We should maintain our direction despite difficulties.~changer au hasard;tout abandonner`, `
Ce revers ne doit pas nous faire [baisser les bras].~This setback should not make us give up.~persévérer;continuer les efforts
Elle a [rebondi] en lançant une nouvelle activité.~She recovered by starting a new activity.~tout abandonné;caché son projet`)
],C1:[
u('Formal requests that remain precise','Use a courteous frame, identify the exact issue and state the requested action. Je vous serais reconnaissant de and sauriez-vous can suit a formal exchange without excessive ceremonial wording.','A longer formula is not inherently more polite; avoid vague requests that leave the recipient guessing.',`
Je vous serais reconnaissant [de préciser] la portée du mandat.~I formally ask for the mandate’s scope to be clarified.~à précisez;que préciser
[Sauriez-vous] indiquer la date de validation ?~I politely ask whether the recipient can give the approval date.~Vous venez de;Vous avez dû hier
Je me permets [de solliciter] un complément d’information.~I courteously request further information.~à solliciter;que sollicite
[Dans l’attente de votre retour], je reste disponible.~I remain available while awaiting the recipient’s reply.~Après votre refus définitif;Malgré notre accord final`, `
Pourriez-vous préciser [ce qui relève de notre responsabilité] ?~I ask which matters fall within our responsibility.~pourquoi tout est déjà réglé;ce que nous avons refusé hier
Je vous remercie [de bien vouloir confirmer] ces modalités.~I courteously ask for these arrangements to be confirmed.~d’avoir définitivement annulé;de ne jamais répondre`),
u('Interpret implied reservations','Measured praise and negative formulations can convey a reservation. Ne…pas sans suggests a real link, while ce n’est pas idéal is less categorical than c’est impossible.','Interpret the whole setting; understatement does not licence inventing an unstated rejection.',`
La proposition [n’est pas sans intérêt], mais elle manque de détails.~The proposal has some merit but needs detail.~est dépourvue de tout intérêt;est approuvée sans réserve
[C’est un début], il reste à vérifier la méthode.~The speaker recognises a start while reserving judgement on method.~Tout est démontré;Rien ne vaut la peine
Ce choix [ne va pas de soi].~The choice is not self-evidently justified.~est forcément évident;ne peut jamais être discuté
L’argument [laisse à désirer] sur le plan des sources.~The sourcing of the argument is unsatisfactory.~est irréprochable;est sans rapport`, `
Le calendrier est ambitieux, [pour ne pas dire irréaliste].~The speaker strongly hints the timetable is unrealistic.~donc assuré;et sans risque
L’étude apporte un éclairage utile, [sans clore le débat].~The study is useful but does not settle the debate.~et prouve tout;donc n’apporte rien`),
u('Limit a causal claim','A correlation or a before-and-after change does not by itself establish causation. Use pourrait avoir contribué, semble associé à and ne permet pas de conclure to match the evidence.','Do not turn an observed association into a proven exclusive cause by choosing a stronger verb.',`
Le changement [pourrait avoir contribué] à la baisse.~The change may have contributed to the decrease.~prouve à lui seul;garantit toujours
Ce résultat [semble associé] à plusieurs facteurs.~The result appears associated with several factors.~démontre une cause unique;exclut toute autre cause
L’étude [ne permet pas de conclure] à un effet durable.~The study does not justify concluding that the effect is lasting.~prouve définitivement;garantit nécessairement
[Il n’est pas exclu que] d’autres variables interviennent.~Other variables may also be involved.~Il est impossible que;Il est certain qu’aucune`, `
Ces données [suggèrent], sans le prouver, un effet de la mesure.~The data suggest, but do not prove, an effect.~garantissent;démontrent définitivement
La hausse [ne saurait être attribuée] à ce seul changement.~The increase cannot reasonably be attributed only to this change.~doit forcément tout;prouve à elle seule`),
u('Synthesize findings with their limitations','A synthesis combines evidence and limitations before a proportionate recommendation. Dans l’ensemble, sous réserve de and il conviendrait de help retain the scope of the conclusion.','A caveat is not a reason to erase every positive finding; distinguish uncertainty from disproof.',`
[Dans l’ensemble], les résultats justifient un essai limité.~Overall, the findings warrant a limited trial.~Sans aucune donnée;Indépendamment des résultats
Le dispositif est prometteur, [sous réserve d’un suivi].~The scheme is promising provided there is follow-up.~sans aucun suivi;malgré une preuve contraire définitive
[Il conviendrait de] comparer plusieurs périodes.~It would be appropriate to compare several periods.~Il serait inutile de;Il n’est jamais utile de
Ces avantages [doivent être mis en regard des] coûts.~The benefits must be weighed against the costs.~rendent inutiles tous les;ne concernent aucun`, `
Nous recommandons [une évaluation complémentaire] avant la généralisation.~We recommend further evaluation before wider adoption.~une certitude immédiate;un abandon sans examen
Le bilan reste favorable, [à condition de tenir compte des limites].~The overall judgement is favourable with its limitations taken into account.~en supprimant les limites du rapport;parce que rien n’a été observé`),
u('Past inference and unconfirmed information','Il a dû can express a deduction from evidence but can also express obligation; context disambiguates it. A journalistic conditionnel passé, such as aurait quitté, marks reported information not presented as confirmed.','A reported conditional is not a guarantee and does not simply mean a conditional promise.',`
La lumière est éteinte ; il [a dû partir].~The speaker infers from the dark room that he has left.~partira forcément demain;vient pour travailler
Selon une source non confirmée, la directrice [aurait démissionné].~An unconfirmed source reports that the director has resigned.~a certainement démissionné;démissionnera assurément
Tout était fermé ; ils [avaient sans doute terminé].~The speaker infers that they had probably finished.~termineront demain;commençaient
On rapporte que le dossier [aurait été transmis] hier.~The transfer yesterday is reported, not confirmed.~sera nécessairement transmis;ne sera jamais transmis`, `
Vu les traces, quelqu’un [a dû entrer] par cette porte.~The speaker infers entry from visible traces.~entrera certainement;doit entrer demain
D’après des informations à vérifier, l’accord [aurait été signé].~The agreement is said to have been signed, pending verification.~est incontestablement signé;sera forcément signé`),
u('Regret and missed opportunities','J’aurais dû expresses a past action now judged advisable; j’aurais pu expresses a missed possibility. Regretter de + infinitif passé looks back on one’s own earlier action.','J’aurais dû prévenir does not mean I actually warned anyone; regret often concerns what did not happen.',`
J’[aurais dû vérifier] les chiffres avant l’envoi.~I regret not checking the figures before sending them.~ai bien vérifié;vais vérifier demain
Nous [aurions pu éviter] ce malentendu.~We had a possibility of avoiding the misunderstanding but did not.~avons forcément évité;éviterons certainement
Je regrette [de ne pas avoir répondu] plus tôt.~I regret not replying earlier.~de répondre demain;d’avoir toujours répondu tôt
Si j’avais compris l’enjeu, [j’aurais insisté].~Had I understood the issue, I would have insisted.~j’insisterai;j’ai forcément insisté`, `
Elle [aurait dû demander] un accord écrit.~It would have been advisable for her to request written agreement.~a forcément demandé;demandera certainement
Je regrette [d’avoir refusé] sans lire la proposition.~I regret refusing without reading the proposal.~de refuser demain;d’accepter toujours`),
u('Evidence-sensitive conclusions','Il ressort de introduces a finding drawn from evidence. Tout porte à croire expresses a reasoned expectation, while à ce stade limits the current assessment.','A reasoned expectation is not proof; state what remains uncertain.',`
[Il ressort de l’analyse] que les délais varient selon le site.~The analysis indicates differences between sites.~Il est inventé sans preuve;Il est sans rapport
[Tout porte à croire] que le problème est récurrent.~Available indications suggest the problem recurs.~Rien ne peut suggérer;Il est définitivement prouvé
[À ce stade], aucune cause unique n’est établie.~No single cause has been established at the present stage.~Pour toujours;Sans examiner les données
[En l’état des connaissances], une conclusion ferme serait prématurée.~A firm conclusion would be premature given current knowledge.~Malgré une certitude totale;Sans aucun rapport aux faits`, `
[Au vu des éléments disponibles], un essai est justifié.~The available evidence supports a trial.~En ignorant toutes les observations;Sans aucun examen
Ces résultats [plaident en faveur] d’un suivi plus long.~The findings support longer follow-up.~prouvent l’inutilité;interdisent toute analyse`),
u('Make qualifications explicit','Pour autant and cela dit introduce limits; sous réserve que takes the subjunctive when it states a condition. Encore faut-il que points to a necessary condition not yet secured.','A qualification narrows a claim; it does not always withdraw the claim entirely.',`
Le coût baisse ; [pour autant], la qualité doit être contrôlée.~Lower cost does not remove the need for quality checks.~donc aucun contrôle;ce qui prouve la perfection
[Cela dit], les situations locales diffèrent.~The speaker adds a qualification about local differences.~Par preuve définitive;Sans aucune exception
L’accord sera possible sous réserve que chacun [respecte] le calendrier.~Agreement depends on everyone keeping to the timetable.~respecter;respectent
[Encore faut-il que] les moyens suivent.~The necessary resources still have to materialise.~Il est acquis que;Il est inutile que`, `
L’idée est convaincante, [à ceci près que] le financement manque.~The speaker identifies missing funding as a specific reservation.~puisque tout est financé;donc sans aucune limite
Cela paraît faisable, [pour peu que] l’équipe soit formée.~It seems feasible provided the team receives training.~même sans aucune formation;parce que tout est impossible`),
u('Recognise understated criticism','Peut mieux faire signals room for improvement; ce n’est pas exactement…can indirectly challenge a description. Il y aurait lieu de suggests a warranted action in formal language.','Do not replace a mild reservation with an insult or a claim of total failure.',`
Sur la transparence, [on peut mieux faire].~Transparency needs improvement.~tout est irréprochable;aucune action n’est possible
Ce n’est [pas exactement ce qui avait été annoncé].~The speaker questions whether the outcome matches the announcement.~parfaitement conforme à l’annonce;déjà vérifié en tout point
[Il y aurait lieu de] préciser les critères.~The speaker considers that the criteria warrant clarification.~Il est inutile de;Il serait prématuré de
La présentation était claire ; [sur le fond, je reste réservé].~The speaker praises clarity but has reservations about substance.~j’approuve tout sans réserve;aucun point n’était clair`, `
Le résultat est intéressant, [encore que la méthode prête à discussion].~The method remains open to challenge despite the interesting result.~et la méthode ne fait aucun doute;donc tout est faux
[Disons que] le calendrier manque de réalisme.~The speaker softens criticism of the timetable’s realism.~Prouvons sans données que;Garantissons que`),
u('Choose a register that fits the audience','A familiar remark and a formal request may express the same concern with different wording. Adapt the relationship, precision and force rather than just replacing short words with longer ones.','Formal does not mean aggressive or needlessly elaborate; retain the actual question or request.',`
[Pourriez-vous clarifier ce point] avant validation ?~I request clarification in a professional register.~Tu racontes quoi;C’est n’importe quoi
[C’est pas clair], tu peux expliquer ?~I ask a friend informally for clarification.~Je vous prie d’agréer;Aux termes du contrat
[Nous souhaitons attirer votre attention sur] cet écart.~I formally draw attention to a discrepancy.~On s’en fiche de;Tu te débrouilles avec
[On se tient au courant], d’accord ?~I informally suggest keeping each other updated.~Veuillez certifier par acte;Aux conditions susmentionnées`, `
[Merci de nous confirmer] la date retenue.~I make a concise professional request for the chosen date.~Allez, déballe tout;C’est ton problème
[Tu me redis] quand tu sais ?~I casually ask for an update once the person knows.~Nous exigeons notification immédiate;En vertu de la présente`),
u('Casual reactions and spontaneous answers','Au pied levé concerns acting at short notice; de tête concerns recall without checking; à vue de nez marks a rough estimate. De but en blanc stresses abruptness, not simply lack of preparation.','These expressions are not interchangeable translations of English off the cuff. In a formal estimate, state the source and uncertainty explicitly.',`
Elle a remplacé le présentateur [au pied levé].~She stepped in as presenter at short notice.~après des mois de préparation;à une date inconnue
[De tête], je dirais une trentaine de personnes.~From memory, I estimate about thirty people.~Après un comptage officiel;Sans jamais avoir eu d’information
[À vue de nez], il reste deux kilomètres.~I roughly estimate that two kilometres remain.~Après une mesure certifiée;Sans aucun trajet à parcourir
Il m’a demandé [de but en blanc] pourquoi je partais.~He abruptly asked why I was leaving.~avec de longs préambules;uniquement par écrit
Cette nouvelle m’a [laissé sans voix].~The news left me speechless.~rendu totalement indifférent;permis de parler davantage`, `
Elle a accepté [au pied levé] d’animer l’atelier.~She agreed to run the workshop at short notice.~après une longue préparation;uniquement l’an prochain
[De tête], le dossier compte quinze pages ; je vérifierai.~I recall fifteen pages but will check.~Après vérification définitive;Sans aucune approximation possible`),
u('Idioms for control and difficult conversations','Avoir les cartes en main concerns having information or resources to act; tirer les ficelles suggests exercising control behind the scenes. Mettre sous le tapis criticises avoidance.','An idiom implying concealment or manipulation can sound accusatory. Use specific facts when documenting a professional concern.',`
Avec ces données, vous avez [les cartes en main].~You have the information or resources needed to act.~aucune possibilité d’agir;déjà obtenu un succès garanti
Qui [tire les ficelles] dans cette affaire ?~Who is exercising control behind the scenes?~ignore tout du dossier;subit sans rien décider
Nous ne pouvons pas [mettre le problème sous le tapis].~We should not conceal or ignore the problem.~examiner le problème ouvertement;résoudre définitivement le problème
Cette nouvelle a [changé la donne].~The news changed the situation’s key conditions.~confirmé exactement la même situation;supprimé toute incertitude
Mettons [cartes sur table] avant de négocier.~Let us state our positions openly before negotiating.~nos intentions à l’abri des regards;toute discussion de côté`, `
Le comité refuse de [mettre ces plaintes sous le tapis].~The committee refuses to hide or ignore the complaints.~confirmer un accord définitif;examiner ouvertement les plaintes
L’arrivée d’un concurrent a [changé la donne].~A new competitor altered the competitive situation.~laissé tous les paramètres identiques;garanti le résultat final`)
]
};
