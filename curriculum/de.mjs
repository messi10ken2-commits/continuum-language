import {u} from './authoring.mjs';
export const deUnits={
A1:[
u('Introduce yourself in German','Use ich heiße for a name, ich komme aus for origin and ich wohne in for where you live. Sie is polite address and takes the plural verb form.','Sie meaning polite you is capitalised; sie can also mean she or they, depending on verb and context.',`
Ich [heiße] Anna.~My name is Anna.~heißt;heißen
Ich [komme] aus Italien.~I come from Italy.~kommt;kommen
Ich [wohne] in Berlin.~I live in Berlin.~wohnst;wohnen
Wie [heißen] Sie ?~What is your name, politely?~heißt;heiße`, `
Ich [heiße] Karim und wohne in Bonn.~Karim introduces himself and where he lives.~heißt;heißen
Woher [kommen] Sie ?~Where do you come from, politely?~kommt;kommst`),
u('Identity and states with sein','Sein has the present forms ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind. Use it for identity, location and many states.','German does not use a different copula simply because a state is temporary. Predicate adjectives do not take attributive endings.',`
Sie [ist] Ärztin.~She is a doctor.~bist;sind
Wir [sind] müde.~We are tired.~bin;seid
Du [bist] heute früh hier.~You are here early today.~ist;bin
Ihr [seid] zu Hause.~You, plural familiar, are at home.~sind;bist`, `
Ich [bin] bereit.~I am ready.~bist;ist
Die Türen [sind] geschlossen.~The doors are closed.~ist;seid`),
u('Present routines and verb position','In a standard main statement, the finite verb occupies the second constituent position. The subject can come before or after it. Regular present endings include -e, -st, -t, -en, -t, -en.','Second position means second constituent, not necessarily second word.',`
Ich [arbeite] am Vormittag.~I work in the morning.~arbeitest;arbeiten
Heute [lernt] sie zu Hause.~Today she studies at home.~lernen;lerne
Wir [wohnen] nahe am Bahnhof.~We live near the station.~wohnt;wohnst
Am Freitag [besuchen] wir unsere Freunde.~On Fridays we visit our friends.~besucht;besuchst`, `
Du [spielst] gern Klavier.~You enjoy playing the piano.~spiele;spielen
Morgens [trinke] ich Tee.~In the mornings I drink tea.~trinken;trinkst`),
u('Order at a café','Ich hätte gern and ich möchte make common polite requests. Listen for the final item and whether the order is zum Mitnehmen or zum Hieressen.','Ein Kaffee is usually coffee without automatically specifying milk; ask for milk or a particular drink if needed.',`
Ich hätte gern [einen Tee].~The customer orders tea.~einen Kaffee;einen Saft
Einen Kaffee [mit Milch], bitte.~The customer wants coffee with milk.~ohne Milch;mit Zitrone
Das ist [zum Mitnehmen].~The order is to take away.~zum Hieressen;für morgen
[Die Rechnung], bitte.~The customer asks for the bill.~Die Speisekarte;Die Reservierung`, `
Für mich [ein Wasser], bitte.~The customer orders water.~ein Tee;ein Kaffee
Wir möchten [hier essen].~The customers want to eat here.~alles mitnehmen;erst morgen bestellen`),
u('Ask yes/no and information questions','A yes/no question begins with the finite verb. In a question with a question word, that word or phrase normally precedes the finite verb.','Wo asks for location; wohin asks for a destination and woher for origin.',`
[Wohnst] du hier ?~Do you live here?~Du wohnst;Du wohnen
[Wo] ist die Apotheke ?~Where is the pharmacy?~Wann;Wie viel
[Wann] beginnt der Kurs ?~When does the class begin?~Wer;Woher
[Wohin] fährt dieser Bus ?~Where is this bus going?~Wo;Woher`, `
[Ist] das Museum heute geöffnet ?~Is the museum open today?~Das ist;Das sind
[Wie viel] kostet die Fahrkarte ?~How much does the ticket cost?~Wohin;Wer`),
u('Negation with nicht and kein','Kein negates an indefinite noun phrase and changes with case, gender and number. Nicht negates other elements, including a predicate adjective or a particular action.','Kein is not an unchanging word: ich habe keinen Wagen uses accusative masculine.',`
Ich habe [kein] Auto.~I do not have a car.~nicht;keinen
Das ist [nicht] teuer.~That is not expensive.~kein;keine
Wir haben [keine] Zeit.~We have no time.~kein;keinen
Er kauft [keinen] Kaffee.~He is not buying any coffee.~kein;keine`, `
Sie ist heute [nicht] hier.~She is not here today.~keine;kein
Ich habe [keinen] Bruder.~I do not have a brother.~kein;keine`),
u('Food, articles and quantities','Learn each noun with its grammatical gender. Quantity expressions specify an amount; the following food noun is often uncountable or plural.','German noun gender is not reliably predicted by what the object means. Nouns are capitalised.',`
Ich kaufe [ein Brot].~I am buying a loaf of bread.~eine Brot;einen Brot~a loaf of bread
Wir brauchen [einen Liter Milch].~We need a litre of milk.~ein Liter Milch;eine Liter Milch~a litre of milk
Ich nehme [zwei Eier].~I am taking two eggs.~zwei Ei;zwei Eiers~two eggs
Sie möchte [eine Suppe].~She would like a soup.~ein Suppe;einen Suppe~a soup
Haben Sie [frisches Wasser] ?~Do you have fresh water?~frische Wasser;frischen Wasser~fresh water
Wir essen [etwas Käse].~We are eating some cheese.~viele Käse;einige Käse~some cheese`, `
Ich brauche [ein Kilo Äpfel].~I need a kilo of apples.~ein Kilo Apfel;eine Kilo Äpfel
Wir bestellen [zwei Tassen Tee].~We order two cups of tea.~zwei Tasse Tee;zwei Tasse Tees`),
u('Places and position in town','Use complete place expressions and learn their cases. Static location with a two-way preposition normally takes the dative; a directed change of position normally takes the accusative.','For these models, the question is where something is, not where it is being moved.',`
Die Post ist [neben der Bank].~The post office is next to the bank.~neben die Bank;neben den Bank~next to the bank
Das Café liegt [gegenüber dem Museum].~The café is opposite the museum.~gegenüber das Museum;gegenüber der Museum~opposite the museum
Ich gehe [zum Bahnhof].~I am going to the station.~zur Bahnhof;zum Bahnhofs~to the station
Wir warten [vor dem Kino].~We are waiting in front of the cinema.~vor das Kino;vor der Kino~in front of the cinema
Hier gibt es [eine Apotheke].~There is a pharmacy here.~ein Apotheke;einen Apotheke~a pharmacy
Der Park ist [hinter der Schule].~The park is behind the school.~hinter die Schule;hinter dem Schule~behind the school`, `
Das Hotel liegt [neben dem Rathaus].~The hotel is next to the town hall.~neben das Rathaus;neben der Rathaus
Der Eingang ist [auf der linken Seite].~The entrance is on the left side.~auf die linke Seite;auf den linken Seite`),
u('Polite contact and small interruptions','Entschuldigung attracts attention or apologises for a small mistake. Bitte can accompany a request or respond to thanks. Match du and Sie to the relationship.','Bitte has several functions; use the surrounding exchange to distinguish a request from a response to thanks.',`
[Entschuldigung], ist dieser Platz frei ?~The speaker politely attracts someone’s attention.~Bis morgen;Gute Nacht
Können Sie bitte [die Tür schließen] ?~The speaker politely asks for the door to be closed.~die Tür öffnen;die Tür kaufen
[Vielen Dank] für Ihre Hilfe.~The speaker thanks someone warmly for their help.~Keine Sorge;Auf Wiedersehen
[Gern geschehen], das war kein Problem.~The speaker responds to thanks.~Es tut mir leid;Entschuldigen Sie`, `
[Entschuldigung], ich habe Sie nicht gesehen.~The speaker apologises for not noticing the listener.~Herzlichen Glückwunsch;Guten Appetit
[Freut mich], ich bin Ihre neue Kollegin.~A woman says she is pleased to meet her new colleague.~Keine Ursache;Gute Besserung`),
u('Ask for repetition and meaning','Noch einmal asks for repetition, langsamer for slower speech and lauter for greater volume. Was bedeutet…? asks about meaning.','Lauter does not mean more slowly; choose the repair request for the actual problem.',`
Können Sie das [wiederholen] ?~The speaker asks for repetition.~vergessen;bestellen
Bitte sprechen Sie etwas [langsamer].~The speaker asks for slower speech.~lauter;früher
Was [bedeutet] dieses Wort ?~The speaker asks what the word means.~kostet;besucht
Wie [schreibt] man das ?~The speaker asks how to spell it.~isst;bezahlt`, `
Könnten Sie bitte [lauter] sprechen ?~The speaker asks for greater volume.~langsamer;später
Das habe ich nicht [verstanden].~The speaker says they did not understand.~gekauft;geöffnet`),
u('Say what you need and how you feel','Brauchen takes an accusative object; etwas brauchen and Hilfe brauchen state needs. Physical sensations often use mir ist…rather than ich bin….','Mir ist kalt means I feel cold; ich bin kalt can describe a cold personality or a cold object rather than the intended sensation.',`
Ich brauche [Hilfe].~I need help.~Hunger;Schlafens
Wir brauchen [einen Tisch].~We need a table.~ein Tisch;eine Tisch
Ich habe [Hunger].~I am hungry.~Durst;Angst
Mir ist [kalt].~I feel cold.~kalte;kalten`, `
Ich brauche [eine Pause].~I need a break.~ein Pause;einen Pause
Wir haben [Durst].~We are thirsty.~Hunger;Angst`),
u('Clock times and parts of the day','Um introduces a precise clock time and gegen an approximate time. Morgens describes mornings generally; morgen means tomorrow.','Capitalisation matters: der Morgen is the morning, while morgen is an adverb meaning tomorrow.',`
Wir treffen uns [um acht Uhr].~We meet at eight.~seit acht Uhr;acht Stunden lang
Ich komme [gegen Mittag].~I will come at about noon.~seit Mittag;den ganzen Mittag lang
[Morgens] trinke ich Tee.~I drink tea in the mornings.~Morgen einmal;Gestern Abend
Ich bin [heute Abend] frei.~I am free this evening.~gestern Abend;letztes Jahr`, `
Die Sitzung dauert [eine Stunde].~The meeting lasts one hour.~um ein Uhr;gegen ein Uhr
[Morgen] fahre ich nach Köln.~Tomorrow I am going to Cologne.~Gestern;Vorgestern`)
],
A2:[
u('Completed events with the Perfekt','Build the Perfekt with a finite form of haben or sein and a past participle, normally near the clause end. Many intransitive changes of place or state use sein.','Not every verb connected with movement automatically takes sein; learn the verb’s construction and meaning.',`
Gestern [habe] ich das Museum besucht.~I visited the museum yesterday.~bin;bist
Sie ist um neun Uhr [angekommen].~She arrived at nine.~ankommen;ankommt
Wir haben den Zug [genommen].~We took the train.~nehmen;nimmt
Die Kinder [sind] früh eingeschlafen.~The children fell asleep early.~haben;hat`, `
Du [hast] die Aufgabe beendet.~You finished the task.~bist;hat
Marie ist zu Fuß [nach Hause gegangen].~Marie walked home.~nach Hause gehen;nach Hause geht`),
u('Arrange a meeting and offer an alternative','Combine an invitation with a clear time and place, then check whether it suits the listener. Wie wäre es mit…? offers an alternative without insisting.','An invitation is not yet an accepted appointment; confirm both the time and the meeting point.',`
[Hast du Lust], zusammen zu essen ?~Would you like to eat together?~Du hast bereits;Du musst unbedingt
Treffen wir uns [vor dem Bahnhof] ?~Shall we meet in front of the station?~hinter dem Museum;bei meiner Schwester
[Lieber am Samstag], wenn das für dich passt.~Saturday would suit me better, if that works for you.~Nur gestern;Niemals am Samstag
[Wir könnten] das neue Café ausprobieren.~We could try the new café.~Wir haben bereits;Wir mussten gestern`, `
Freitag kann ich nicht. [Wie wäre es mit Sonntag] ?~I offer Sunday because Friday is impossible.~Also doch am Freitag;Freitag ist bestätigt
[Das passt mir], um zehn vor dem Kino.~I accept the arrangement at ten in front of the cinema.~Das geht leider nicht;Das lehne ich ab`),
u('Hear vowel length in meaningful words','Long and short German vowels can differ in quality as well as duration. Double consonant letters commonly signal a preceding short vowel; they do not normally create Italian-style long consonants.','Practise the whole word. Speaking louder does not distinguish Miete from Mitte or fühlen from füllen.',`
Die [Miete] ist hoch.~The rent is high; Miete has a long vowel.~Mitte;Mütze
Wir stehen in der [Mitte].~We stand in the middle; Mitte has a short vowel.~Miete;Mode
Kannst du den Unterschied [fühlen] ?~Can you feel the difference; fühlen has a long ü?~füllen;fallen
Bitte das Glas [füllen].~Please fill the glass; füllen has a short ü.~fühlen;fehlen`, `
Wir möchten eine Wohnung [mieten].~We want to rent a flat; mieten has a long vowel.~mitten;meinen
Die Kinder [bitten] um Hilfe.~The children ask for help; bitten has a short i.~bieten;beten`),
u('Follow directions and identify landmarks','Geradeaus means straight ahead; links and rechts mark different turns. Überqueren means cross. Listen for the numbered street and the relevant landmark.','Die zweite Straße is the second street, not the first.',`
Gehen Sie [geradeaus].~Go straight ahead.~nach links;zurück
Biegen Sie nach der Brücke [rechts] ab.~Turn right after the bridge.~links;vorher links
Nehmen Sie [die zweite Straße] links.~Take the second street on the left.~die erste Straße;die letzte Tür
[Überqueren] Sie den Platz.~Cross the square.~Verlassen;Vermeiden`, `
Die Bank liegt [links], hinter der Apotheke.~The bank is on the left beyond the pharmacy.~rechts;vor der Apotheke
Gehen Sie [am Rathaus vorbei], dann biegen Sie ab.~Go past the town hall before turning.~in das Rathaus;hinter den Bahnhof`),
u('Ask about a completed event','In a Perfekt question the finite auxiliary moves into the appropriate question position while the participle normally stays at the end. Question words specify the missing detail.','Do not use an infinitive where the question requires the past participle.',`
[Hast] du den Film gesehen ?~Did you see the film?~Bist;Hat
Wann [ist] sie abgefahren ?~When did she leave?~hat;haben
Wo habt ihr das Buch [gekauft] ?~Where did you buy the book?~kaufen;kauft
Mit wem [bist] du gekommen ?~Who did you come with?~hast;haben`, `
Warum [haben] sie die Fahrt abgesagt ?~Why did they cancel the trip?~sind;ist
Wann hast du die Nachricht [gelesen] ?~When did you read the message?~lesen;liest`),
u('Past states, background and ongoing actions','War and hatte are common Präteritum forms in speech as well as writing. German often uses a simple past form plus gerade to show an action in progress; it has no obligatory Spanish-style imperfect/progressive contrast.','Choose the tense appropriate to the construction and register, not a rule that every long event needs a special progressive form.',`
Als du angerufen hast, [war] ich im Zug.~I was on the train when you called.~bin;werde
Wir [hatten] damals wenig Zeit.~We had little time then.~haben;werden haben
Sie [las gerade], als es klingelte.~She was reading when the bell rang.~wird lesen;liest morgen
Früher [wohnten] wir am Fluss.~We used to live by the river.~wohnen morgen;werden wohnen`, `
Es [war] kalt, deshalb gingen wir hinein.~It was cold, so we went inside.~wird;ist morgen
Ich [hatte] den Schlüssel nicht dabei.~I did not have the key with me.~habe morgen;werde haben`),
u('Book accommodation and clarify services','State the room type, dates and number of nights. Ask explicitly about breakfast, access and beds if these matter to your booking.','Ein Doppelzimmer does not always specify the exact bed arrangement. Ask for getrennte Betten if you need twin beds.',`
Ich möchte [ein Doppelzimmer] buchen.~I would like to book a double room.~eine Doppelzimmer;einen Doppelzimmer~a double room
Wir bleiben [zwei Nächte].~We are staying for two nights.~zwei Nacht;zwei Nachts~two nights
Ist [das Frühstück] inbegriffen ?~Is breakfast included?~der Frühstück;die Frühstück~breakfast
Gibt es [einen Aufzug] ?~Is there a lift?~ein Aufzug;eine Aufzug~a lift
Wir brauchen [getrennte Betten].~We need separate beds.~getrennte Bett;getrenntes Betten~separate beds
Wann ist [die Abreise] ?~When is check-out?~der Abreise;das Abreise~departure or check-out`, `
Haben Sie ein Zimmer [für drei Nächte] ?~Do you have a room for three nights?~seit drei Nächten;vor drei Nächten
Ist [die Kurtaxe] im Preis enthalten ?~Is the tourist tax included in the price?~der Kurtaxe;das Kurtaxe`),
u('Work tasks, deadlines and confirmation','Eine Frist is a time limit; ein Termin can be an appointment or a scheduled date. Bis Freitag sets a deadline, while am Freitag refers to an event on that day.','Do not translate English deadline as Tod or an invented compound. Frist and Abgabetermin are useful real terms.',`
Die [Frist] beträgt drei Tage.~The allowed time is three days.~Besprechung;Fahrt~time limit
Wir müssen [das Angebot] verschicken.~We must send the quotation.~der Angebot;die Angebot~a quotation or offer
Morgen haben wir [eine Besprechung].~We have a meeting tomorrow.~ein Besprechung;einen Besprechung~a meeting
Der Bericht ist [verspätet].~The report is late.~pünktlich;frühzeitig~late
Wer ist [für den Vorgang zuständig] ?~Who is responsible for the case?~für der Vorgang zuständig;für das Vorgang zuständig~responsible for the case
Bitte [bestätigen] Sie den Termin.~Please confirm the appointment.~bestätigt;bestätigst~confirm`, `
Bitte antworten Sie [bis Dienstag].~Please reply by Tuesday.~seit Dienstag;vorletzten Dienstag
Wir müssen [die Frist] einhalten.~We must meet the deadline.~der Frist;das Frist`),
u('Make a suggestion without pressure','Wir könnten offers a possibility; wie wäre es mit + dative proposes an option. Warum nicht + infinitive is another concise suggestion.','Könnten and wäre are tentative forms here; they do not describe a completed past event.',`
[Wie wäre es mit] dem Bus ?~How about taking the bus?~Wir sind bereits mit;Wir waren gestern mit
[Wir könnten] die Sitzung verschieben.~We could postpone the meeting.~Wir haben gestern;Wir müssen unbedingt jetzt
[Warum nicht] um Hilfe bitten ?~Why not ask for help?~Ohne je;Statt schon
[Hätten Sie Interesse], teilzunehmen ?~Would you be interested in taking part?~Sie haben bereits zugesagt;Sie müssen jetzt`, `
[Wie wäre es mit] einem anderen Termin ?~How about another date?~Es war bereits an;Es geschah gestern mit
[Ich schlage vor], mit den Fragen anzufangen.~I suggest starting with the questions.~Ich habe vergessen;Ich habe aufgehört`),
u('Accept, decline and negotiate a request','Accept clearly or explain a practical constraint and offer an alternative. Ich kann…wenn…states a condition explicitly.','Kein Problem can reassure or accept, but does not by itself specify a changed deadline.',`
[Kein Problem], ich kümmere mich darum.~I accept and will take care of it.~Auf keinen Fall;Diesmal nicht
Ich kann das übernehmen, [wenn die andere Frist verschoben wird].~I can take it on if the other deadline changes.~obwohl ich alles ablehne;nachdem alles abgesagt ist
[Leider] bin ich nicht verfügbar.~I politely say that I am unavailable.~Sehr gern;Mit Vergnügen
[Würde Ihnen morgen passen] ?~I ask whether tomorrow would suit you.~Sie waren gestern hier;Sie haben morgen abgesagt`, `
[Sehr gern], ich kann heute Nachmittag helfen.~I am happy to help this afternoon.~Auf keinen Fall;Ich werde nicht helfen
Heute geht es nicht, [aber am Freitag könnte ich].~I offer Friday instead of today.~deshalb sage ich immer ab;denn Freitag geht auch nicht`),
u('Frequency and changing habits','Manchmal means sometimes, oft often and selten rarely. Immer mehr and immer weniger express increasing and decreasing tendencies.','Einmal can mean once; it is not interchangeable with regelmäßig.',`
Ich fahre [manchmal] mit dem Rad.~I cycle sometimes.~immer ohne Ausnahme;einmal gestern
Sie kommt [oft] samstags.~She often comes on Saturdays.~nie;nur einmal im Leben
Wir essen [immer weniger] Fleisch.~We are eating progressively less meat.~immer mehr;genau gleich viel
Er kommt [selten] zu spät.~He is rarely late.~immer;fast jeden Tag`, `
Ich lese [immer mehr] auf Deutsch.~I am reading increasingly often in German.~immer weniger;nur ein einziges Mal
[Normalerweise] fahren wir gegen acht los.~We usually leave at about eight.~Nur gestern;Einmal vor Jahren`),
u('Describe the eventual outcome','Schließlich and am Ende can introduce the eventual outcome of a sequence. Sich herausstellen indicates what turns out to be the case. Gerade erst stresses recentness.','An eventual outcome and a very recent event are different meanings; do not translate both with the same time expression.',`
[Schließlich] haben wir einen anderen Raum gebucht.~We eventually booked another room.~Zuallererst;Schon vor dem ersten Versuch
Es hat sich [herausgestellt], dass die Adresse falsch war.~It turned out that the address was wrong.~verabredet;angemeldet
Sie ist [gerade erst] gegangen.~She has only just left.~erst nächstes Jahr;schon vor zehn Jahren
[Am Ende] sind wir zu Hause geblieben.~In the end, we stayed at home.~Gleich zu Beginn;Vor allen Plänen`, `
Nach mehreren Anrufen bekamen wir [schließlich] eine Antwort.~After several calls, we eventually got an answer.~zuvor;bevor wir anriefen
Die Gäste sind [gerade angekommen].~The guests have just arrived.~erst morgen hier;schon lange abgereist`)
],
B1:[
u('Explain purposes with um…zu and damit','Um…zu + infinitive normally shares its understood subject with the main clause. Damit introduces a finite subordinate clause and can have a different subject.','In a subordinate clause with damit, the finite verb normally comes at the end.',`
Ich bin gekommen, um das Projekt zu [besprechen].~I came to discuss the project.~bespreche;besprichst
Sie spricht langsam, damit wir sie [verstehen].~She speaks slowly so that we understand her.~versteht;verstehst
Wir fahren früh los, um den Stau zu [vermeiden].~We leave early to avoid the traffic jam.~vermeidet;vermeidest
Ich schreibe dir, um dich zu [informieren].~I am writing to inform you.~informiert;informierst`, `
Er spart, um ein Fahrrad zu [kaufen].~He is saving to buy a bicycle.~kauft;kaufst
Ich hinterlasse eine Nachricht, damit sie mich [anrufen kann].~I leave a message so that she can call me.~kann anrufen;anrufen kannst`),
u('Express possibilities and deductions','Vielleicht and möglicherweise express possibility; können can mark what may happen. Müssen can express a deduction as well as an obligation, depending on the context.','A modal does not correspond to a fixed probability percentage. Preserve the infinitive after the finite modal.',`
[Vielleicht] kommt sie morgen.~Perhaps she will come tomorrow.~Bestimmt;Keinesfalls
Das [kann] ein Fehler sein.~It may be a mistake.~muss zwingend;darf keinesfalls
Es ist [möglich], dass wir uns verspäten.~It is possible that we will be late.~sicher;ausgeschlossen
Das Licht brennt ; jemand [muss] zu Hause sein.~The light is on, so someone must be home, as an inference.~soll erst morgen;kann unmöglich`, `
Der Laden [könnte] schon geschlossen sein.~The shop might already be closed.~ist zweifellos;wird garantiert
[Möglicherweise] finden wir eine andere Lösung.~We may find another solution.~Zweifellos;Ausgeschlossen`),
u('Read reasons, contrasts and consequences','Weil introduces a reason with a verb-final clause. Deshalb introduces a consequence in a main clause; trotzdem marks an unexpected contrast.','After deshalb or trotzdem, maintain the main-clause finite verb position.',`
Die Straße war gesperrt ; [deshalb] nahmen wir einen Umweg.~The detour was a consequence of the road closure.~trotzdem;obwohl
Es regnete ; [trotzdem] fand das Spiel statt.~The match took place despite the rain.~deshalb;weil
Ich blieb zu Hause, [weil] ich krank war.~Illness explains why I stayed home.~deshalb;trotzdem
Die Fahrkarte ist teuer. [Allerdings] gilt sie für alle Verkehrsmittel.~The broad validity qualifies the price objection.~Deshalb;Folglich`, `
Der Bus kam nicht ; [deshalb] gingen wir zu Fuß.~Walking followed from the missing bus.~trotzdem;obwohl
Der Service ist langsam ; [dafür] ist das Essen ausgezeichnet.~Good food is a compensating contrast to slow service.~deswegen;weil`),
u('Write a clear practical request','Explain the situation, identify the missing detail and make a specific polite request. Könnten Sie…? and wäre es möglich…? are useful frames.','A polite opening cannot compensate for an unspecified booking, date or document.',`
[Könnten Sie] die Ankunftszeit bestätigen ?~I politely ask for the arrival time to be confirmed.~Sie haben bereits;Sie müssen unbedingt
Ich schreibe Ihnen [wegen meiner Reservierung].~I identify my booking as the reason for writing.~trotz meiner Abreise;anstelle meiner Kollegin
Bitte antworten Sie [vor Donnerstag].~I ask for a reply before Thursday.~seit Donnerstag;donnerstags immer
[Vielen Dank] für Ihre Unterstützung.~I thank the recipient for their support.~Auf keinen Fall;Keine Auskunft`, `
[Wäre es möglich], ein ruhigeres Zimmer zu bekommen ?~I politely ask whether a quieter room is possible.~Es ist verboten;Es ist schon beschlossen
Könnten Sie mir [eine schriftliche Bestätigung] schicken ?~I request written confirmation.~eine abgesagte Einladung;einen neuen Zahlungsauftrag`),
u('Experiences and continuing situations','The Perfekt can describe a past experience with schon or jemals. A situation continuing now commonly uses the present with seit + dative, rather than an English-style present perfect.','Ich wohne seit drei Jahren hier describes a situation still continuing; ich habe hier gewohnt can present a finished period.',`
Ich [habe] dieses Museum schon besucht.~I have already visited the museum.~bin;bist
Sie [wohnt] seit drei Jahren hier.~She has lived here for three years and still does.~wird wohnen;würde wohnen
Hast du [jemals] im Ausland gearbeitet ?~Have you ever worked abroad?~erst morgen;übermorgen
Wir haben das Meer [noch nie] gesehen.~We have never seen the sea.~schon oft;jedes Jahr`, `
Er [arbeitet] seit Januar in diesem Team.~He has worked in this team since January and still does.~wird arbeiten;würde arbeiten
Ich habe die Leiterin [schon kennengelernt].~I have already met the director.~erst morgen getroffen;noch nie getroffen`),
u('An event before a past reference point','The Plusquamperfekt uses hatte or war plus the past participle. It locates something before an established past point.','Choose haben or sein according to the verb’s construction, not simply according to the English auxiliary.',`
Als ich ankam, [war] sie schon gegangen.~She had already left before I arrived.~hatte;wurde
Wir [hatten] vor der Einladung gebucht.~We had booked before receiving the invitation.~waren;wurden
Er merkte, dass er seine Schlüssel [vergessen hatte].~He realised he had forgotten his keys.~hatte vergessen;vergessen war
Ich [hatte] die Aufgabe beendet, als du anriefst.~I had finished the task when you called.~war;wurde`, `
Die Fahrgäste [waren] vor der Abfahrt ausgestiegen.~The passengers had got off before departure.~hatten;wurden
Sie hatte die Unterlagen vorher [vorbereitet].~She had prepared the documents beforehand.~vorbereiten;bereitet vor`),
u('Future plans and predictions','German often uses the present with a future time phrase for an arrangement. Werden + infinitive can express a future prediction or intention.','Werden plus an infinitive is not the passive; passive constructions normally require a past participle.',`
Morgen [fahren] wir um acht los.~We leave at eight tomorrow.~fuhren;waren gefahren
Ich [werde] den Arzt anrufen.~I will call the doctor.~wurde;bin
Wenn du [ankommst], ruf mich an.~Call me when you arrive.~ankommen;ankamst gestern
Ich [werde] dich zurückrufen, versprochen.~I promise I will call you back.~wurde;bin`, `
Sie [bekommen] die Antwort morgen.~You, politely, will receive the answer tomorrow.~bekam;bekamst
Nächsten Monat [ziehen] sie um.~They are moving next month.~zogen;waren umgezogen`),
u('Hypothetical conditions and polite advice','Wenn + Konjunktiv II can introduce a hypothetical condition. Würde + infinitive is common; wäre, hätte and könnte are frequent simple forms.','Wenn moves the finite verb to the subordinate-clause end. The following main clause begins with its finite verb.',`
Wenn ich mehr Zeit hätte, [würde ich mehr lesen].~With more time, I would read more.~ich würde mehr lesen;hätte ich mehr gelesen
An deiner Stelle [würde ich nachfragen].~In your position, I would ask for clarification.~ich würde nachfragen;hatte ich nachgefragt
[Könnten Sie] diesen Punkt erklären ?~Could you explain this point?~Sie konnten gestern;Sie haben bereits
Wenn wir näher wohnten, [kämen wir zu Fuß].~If we lived nearer, we would come on foot.~wir kämen zu Fuß;kommen wir zu Fuß`, `
Wenn sie die Adresse wüsste, [würde sie kommen].~If she knew the address, she would come.~sie würde kommen;ist sie gestern gekommen
Ich [möchte] Ihnen eine Frage stellen.~I would like to ask you a question.~möchtest;möchtet`),
u('Reformulate and check understanding','Mit anderen Worten and anders gesagt introduce a paraphrase. Wenn ich Sie richtig verstehe checks an interpretation rather than claiming certainty.','A paraphrase should retain the original conditions and scope.',`
[Mit anderen Worten], der Service bleibt samstags geöffnet.~I restate that the service remains open on Saturdays.~Trotz allem;Dagegen
[Wenn ich Sie richtig verstehe], ist die Lieferung enthalten ?~I check whether delivery is included.~Es steht zweifelsfrei fest;Ich behaupte ohne Prüfung
[Anders gesagt], wir brauchen zuerst die Genehmigung.~I paraphrase that approval is needed first.~Stattdessen;Ohne Zusammenhang
[Was ich meine], ist, dass ein Schritt fehlt.~I clarify that a step is missing.~Was ich ablehne;Was ich bereits erledigt habe`, `
[Habe ich Sie richtig verstanden], dass beide Optionen offenbleiben ?~I check whether both options remain open.~Ich beweise endgültig;Ich verbiete ausdrücklich
[Um es anders auszudrücken], die Frist steht noch nicht fest.~I restate that the deadline is not yet fixed.~Um das Thema zu wechseln;Um die Tatsachen zu bestreiten`),
u('Offer alternatives and leave room for choice','Alternativ introduces another option; sonst can mean otherwise or offer a fallback. Wir könnten auch adds a possibility without necessarily rejecting the first idea.','Sonst does not always mean an alternative proposal; follow the relation between the clauses.',`
[Wir könnten auch] online sprechen.~I add meeting online as another option.~Wir dürfen niemals;Wir haben schon fertig
[Sonst] hätte ich am Dienstag Zeit.~I offer Tuesday if the first arrangement does not work.~Wie endgültig bestätigt;Wegen der einzigen Folge
[Stattdessen] nehmen wir einen kleineren Raum.~I suggest substituting a smaller room.~Zusätzlich zum selben;In genau gleicher Weise
[Eine weitere Möglichkeit wäre], die Aufgaben aufzuteilen.~I suggest dividing the tasks as another possibility.~Die einzige Pflicht ist;Das garantierte Ergebnis ist`, `
[Wenn das nicht passt], können wir verschieben.~I offer postponement if the arrangement is unsuitable.~Weil alles schon feststeht;Nachdem alle endgültig abgesagt haben
[Warum beginnen wir nicht] mit einem Versuch ?~I suggest starting with a trial.~Warum lehnen wir alles ab;Wir haben den Versuch schon beendet`),
u('Idioms for help and active participation','Jemandem unter die Arme greifen means support or help someone; mit anpacken means contribute practically. Sich durchschlagen can mean manage under difficult conditions.','These figurative expressions are conversational. Use precise responsibilities in a formal agreement.',`
Kannst du mir [unter die Arme greifen] ?~Can you help or support me?~Steine in den Weg legen;die Schuld geben
Beim Aufbau haben alle [mit angepackt].~Everyone helped practically with setting up.~aufgegeben;weggesehen
Der Vorstand gab uns [Rückendeckung].~The board provided support or backing.~ein endgültiges Verbot;eine zusätzliche Hürde
Sie hat sich trotz der Probleme [durchgeschlagen].~She managed to get through despite the problems.~sofort zurückgezogen;alles leicht gemacht`, `
Die Nachbarn haben uns beim Umzug [unter die Arme gegriffen].~The neighbours helped us move.~Steine in den Weg gelegt;die Schuld zugeschoben
Mit dieser Unterstützung konnten wir [weitermachen].~This support allowed us to continue.~sofort aufgeben;nichts mehr tun`),
u('Realise something and gain perspective','Mir ist klar geworden describes realisation. Mir ist ein Licht aufgegangen and der Groschen ist gefallen are figurative ways to say something finally became clear.','Mir ist ein Licht aufgegangen refers to understanding, not literally switching on a light.',`
Mir ist [klar geworden], dass die Adresse falsch war.~I realised the address was wrong.~egal geworden;verboten worden
Als du den Plan gezeigt hast, ist mir [ein Licht aufgegangen].~The plan made the idea suddenly clear.~jede Erinnerung verschwunden;der Mut vergangen
Jetzt ist [der Groschen gefallen].~I finally understand.~alles bedeutungslos;die Entscheidung gefallen
Ich habe erst spät [begriffen], dass es dein Bruder war.~I only understood late that he was your brother.~bestritten;bestellt`, `
Sie hat [erkannt], dass wichtige Angaben fehlten.~She realised that important details were missing.~versprochen;verboten
Erst beim zweiten Lesen ist mir [ein Licht aufgegangen].~I only understood on the second reading.~jede Erinnerung verschwunden;alles gleichgültig geworden`)
],B2:[
u('Follow a corrected travel announcement','Bei einer Korrektur ersetzt sondern die zuvor verneinte Angabe. Erst shifts an expected time later; schon can signal earlier than expected.','Use the final corrected information, not the first time or platform you hear.',`
Der Zug fährt nicht um neun, [sondern um zehn].~The corrected departure is ten.~auch um neun;aber nur um acht
Wir halten heute [ausnahmsweise in Bonn].~Today there is an exceptional stop in Bonn.~wie immer ohne Halt;erst hinter Köln
Der Anschluss wartet [entgegen der ersten Meldung].~Contrary to the first announcement, the connecting service waits.~gemäß jeder bisherigen Meldung;wegen einer bestätigten Absage
Bitte steigen Sie [erst am nächsten Bahnhof] um.~Change at the next station, not here.~sofort hier;bereits vor der Abfahrt`, `
Die Abfahrt erfolgt nicht an Gleis drei, [sondern an Gleis fünf].~The corrected platform is five.~wieder an Gleis drei;an keinem Bahnsteig
Der Bus kommt [erst um halb elf].~The bus does not arrive until ten thirty.~schon um zehn;spätestens um neun`),
u('Hear qualified agreement','Grundsätzlich and im Prinzip may signal agreement with reservations. Allerdings introduces a limitation; unter der Voraussetzung names a condition.','Qualified agreement is not unconditional approval. Identify both the support and its limit.',`
Ich stimme zu, [sofern die Kosten begrenzt bleiben].~Agreement depends on limiting costs.~ganz unabhängig von den Kosten;obwohl jede Grenze entfällt
[Im Prinzip] unterstütze ich den Vorschlag, aber der Termin passt nicht.~There is broad support with a scheduling reservation.~Ohne jede Einschränkung;Unter keinen Umständen
Der Entwurf ist überzeugend, [allerdings fehlen Belege].~The convincing draft still lacks evidence.~alle Fragen sind endgültig geklärt;Belege sind unnötig
Wir können beginnen, [unter der Voraussetzung, dass die Zusage schriftlich vorliegt].~A written commitment is required before starting.~auch ohne jede Zusage;nachdem alles bereits beendet ist`, `
Ich bin einverstanden, [solange der Zugang offenbleibt].~Agreement requires continued open access.~selbst wenn jeder Zugang gesperrt wird;ohne jede Bedingung
Das klingt sinnvoll, [wobei die Finanzierung noch offen ist].~The idea makes sense but funding remains unresolved.~weil alle Mittel schon bewilligt sind;und jede weitere Prüfung entfällt`),
u('Past counterfactual conditions','For an unreal past condition, wenn clauses use hätte or wäre plus the participle, with the finite auxiliary at the end. The result also uses Konjunktiv II past.','Hätte ich es gewusst can replace wenn ich es gewusst hätte. Do not confuse this with a factual past report.',`
Wenn ich das gewusst hätte, [hätte ich angerufen].~If I had known, I would have called.~habe ich angerufen;ich hätte angerufen
Wenn sie früher losgefahren wäre, [hätte sie den Zug erreicht].~An earlier departure would have let her catch the train.~hat sie den Zug erreicht;sie hätte den Zug erreicht
[Hätten wir] die Datei gespeichert, wäre sie noch da.~Had we saved the file, it would still exist.~Wir haben;Wir werden
Ohne deine Hilfe [wäre ich gescheitert].~Without your help, I would have failed.~bin ich gescheitert;ich wäre gescheitert`, `
Wenn er die Warnung gelesen hätte, [wäre er vorsichtiger gewesen].~Reading the warning would have made him more careful.~ist er vorsichtiger;er wäre vorsichtiger gewesen
[Wäre sie] geblieben, hätte sie uns getroffen.~Had she stayed, she would have met us.~Sie ist;Sie wird`),
u('Read concessions without losing the conclusion','Obwohl introduces a subordinate concession; trotzdem is an adverb in a main clause. Zwar announces a concession often followed by aber.','The concession acknowledges a difficulty; it does not automatically reverse the main conclusion.',`
[Obwohl] die Stichprobe klein ist, sind die Ergebnisse aufschlussreich.~The small sample does not prevent useful findings.~Weil allein;Damit
Die Daten sind unvollständig; [trotzdem] prüfen wir die Hypothese.~We examine the hypothesis despite incomplete data.~deshalb niemals;stattdessen keinesfalls
Das Verfahren ist [zwar] schnell, aber teuer.~Speed is conceded before a cost limitation.~weder;entweder
[Selbst wenn] die Nachfrage sinkt, bleibt die Reserve nötig.~The reserve remains necessary even if demand falls.~Nur weil;Damit endlich`, `
[Trotz] der Verzögerung bleibt das Ziel erreichbar.~The delay does not make the goal unreachable.~Wegen allein;Anstelle
Die Lösung ist brauchbar, [wenn auch nicht ideal].~The solution is usable with a limitation.~also vollkommen fehlerfrei;und daher ohne Alternative`),
u('Duration, completion and ongoing activity','German often uses present tense with seit for an activity continuing now. Schon and noch frame duration or persistence. A completed bounded event is distinguished by context and tense, not an English-style progressive suffix.','Seit einer Stunde means for an hour up to the reference point; vor einer Stunde means an hour ago.',`
Wir [arbeiten seit zwei Stunden] an der Antwort.~We have been working on the answer for two hours and still are.~arbeiteten vor zwei Stunden;werden erst morgen arbeiten
Sie [hat den Bericht bereits abgegeben].~She has already submitted the report.~gibt ihn erst morgen ab;hat ihn noch nicht begonnen
Als ich ankam, [war er noch bei der Arbeit].~He was still at work when I arrived.~hatte er alles längst beendet;würde er erst morgen anfangen
Er [wohnt seit Mai] hier.~He has lived here since May and still does.~zog erst nächsten Mai ein;wohnte vor vielen Jahren`, `
Ich [warte schon seit zwanzig Minuten].~I have been waiting for twenty minutes and still am.~kam erst morgen an;habe nie gewartet
Sie [hat die Reparatur inzwischen abgeschlossen].~She has completed the repair in the meantime.~wird sie vielleicht beginnen;hat sie nie übernommen`),
u('Past unreal results and mixed time references','An unreal past condition may have a present result: wenn wir früher gebucht hätten, wären wir jetzt sicher. Use the time reference to select present Konjunktiv II or its past form.','Jetzt would normally locate the result now; damals locates it then. Do not choose an auxiliary only by the first clause.',`
Wenn wir früher gebucht hätten, [hätten wir jetzt einen Platz].~Earlier booking would give us a seat now.~hatten wir gestern einen Platz;haben wir bestimmt gebucht
Wenn ich damals gelernt hätte, [könnte ich jetzt mitreden].~Past study would let me contribute now.~konnte ich gestern mitreden;habe ich sicher gelernt
Wenn sie die Karte mitgenommen hätte, [hätte sie gestern bezahlt].~Taking the card would have allowed payment yesterday.~bezahlt sie morgen;sie hätte gestern bezahlt
Ohne die Verspätung [wären wir längst angekommen].~Without the delay, we would already have arrived.~kommen wir erst morgen;wir wären längst angekommen`, `
Wenn ich das Angebot angenommen hätte, [würde ich jetzt dort arbeiten].~Accepting the offer would mean working there now.~habe ich gestern dort gearbeitet;ich würde jetzt dort arbeiten
Hätten wir nicht nachgefragt, [wäre der Fehler unentdeckt geblieben].~Without asking, the error would have remained unnoticed.~ist jeder Fehler behoben;der Fehler wäre unentdeckt geblieben`),
u('Weigh options and consequences','Etwas abwägen means consider competing factors. In Betracht ziehen names a possibility; in Kauf nehmen accepts a drawback without welcoming it.','In Kauf nehmen is figurative acceptance of a cost or risk, not necessarily buying an item.',`
Wir müssen die Vor- und Nachteile [abwägen].~We must weigh advantages and disadvantages.~ignorieren;verheimlichen
Wir sollten auch eine Pause [in Betracht ziehen].~We should consider a pause as an option.~endgültig ausschließen;als erledigt melden
Dafür nehmen wir längere Wege [in Kauf].~We accept longer journeys as a drawback.~in Betrieb;in Schutz
Bei der Entscheidung [kommt es auf die Sicherheit an].~Safety is the decisive factor.~ist Sicherheit völlig unwichtig;ist Sicherheit schon garantiert`, `
Lasst uns beide Angebote [gegeneinander abwägen].~Let us compare the merits of both offers.~ohne Prüfung bestätigen;aus Versehen löschen
Den zusätzlichen Aufwand würden wir [in Kauf nehmen].~We would accept the additional effort.~von vornherein ausschließen;mit Sicherheit vermeiden`),
u('Turn decisions into coordinated action','Etwas in die Wege leiten means initiate it; umsetzen means put it into practice. Sich abstimmen means coordinate with others.','Initiating a process does not mean it has already been completed.',`
Wir haben die Umstellung [in die Wege geleitet].~We have initiated the changeover.~vollständig rückgängig gemacht;endgültig verboten
Jetzt müssen wir den Beschluss [umsetzen].~Now we must implement the decision.~geheim halten;für ungültig erklären
Bitte [stimmt euch mit dem Team ab].~Please coordinate with the team.~ignoriert das Team;beendet jede Zusammenarbeit
Wir müssen bei den Angaben [auf dem gleichen Stand sein].~We need a shared current understanding of the details.~absichtlich Verschiedenes behaupten;nichts mehr erfahren`, `
Sie hat die nötigen Schritte [in die Wege geleitet].~She initiated the necessary steps.~verhindert;annulliert
Vor der Veröffentlichung sollten wir uns [abstimmen].~We should coordinate before publication.~aus dem Weg gehen;widersprechen müssen`),
u('Respond to pressure and difficult situations','Unter Druck stehen describes pressure; die Ruhe bewahren means stay calm. Eine Zwickmühle is a dilemma in which available choices cause difficulties.','These idioms describe a situation, not a medical diagnosis or a guaranteed solution.',`
Seit der Friständerung stehen wir [unter Druck].~The changed deadline puts us under pressure.~außer Gefahr;ohne Aufgabe
Auch bei Kritik [bewahrt sie die Ruhe].~She remains calm even under criticism.~verliert sie sofort die Geduld;zieht sie jede Aussage zurück
Ich stecke [in einer Zwickmühle].~I face a difficult dilemma.~in einer sicheren Einigung;in völliger Unkenntnis
Er hat die Lage [auf die leichte Schulter genommen].~He treated the situation too lightly.~besonders ernst genommen;gründlich untersucht`, `
Wir sollten trotz der Hektik [einen kühlen Kopf bewahren].~We should stay level-headed despite the rush.~jeden Überblick verlieren;alles ungeprüft versprechen
Die Warnung darfst du nicht [auf die leichte Schulter nehmen].~You must not dismiss the warning lightly.~sorgfältig lesen;rechtzeitig weitergeben`),
u('Persist, change direction and recognise limits','Am Ball bleiben means keep at something. Das Ruder herumreißen means turn a difficult situation around. Auf der Stelle treten suggests making no progress.','Figurative imagery is conventional; do not translate each word literally into another language.',`
Auch nach dem Rückschlag [bleiben wir am Ball].~We keep working despite the setback.~geben wir sofort auf;vergessen wir das Ziel
Mit der neuen Strategie konnten wir [das Ruder herumreißen].~The new strategy let us turn the situation around.~alles beim Alten lassen;die Verantwortung verstecken
Ohne Rückmeldung [treten wir auf der Stelle].~Without feedback we are making no progress.~erreichen wir alle Ziele;kommen wir sicher voran
Wir dürfen die Probleme nicht [vor uns herschieben].~We must not keep putting the problems off.~jetzt besprechen;gemeinsam lösen`, `
Sie ist beim Lernen [am Ball geblieben].~She persisted with her learning.~sofort ausgestiegen;ohne Mühe fertig geworden
Seit Monaten [treten die Verhandlungen auf der Stelle].~The negotiations have been stalled for months.~sind die Verhandlungen abgeschlossen;werden die Verhandlungen abgesagt`)
],C1:[
u('Write a precise formal request','In a formal request, Konjunktiv II softens the request while precise references identify what needs clarification. Name a feasible next step rather than merely expressing dissatisfaction.','Softening does not replace essential information such as the relevant clause, deadline or requested action.',`
Ich wäre Ihnen dankbar, wenn Sie [die Berechnungsgrundlage erläutern könnten].~I politely request clarification of the calculation basis.~jede Nachfrage ausschließen würden;die Angaben ungelesen bestätigen würden
[Bezug nehmend auf Ihr Angebot] bitte ich um nähere Angaben.~I refer formally to the offer when requesting details.~Ganz ohne Zusammenhang;Nach endgültiger Ablehnung jeder Auskunft
Bitte teilen Sie uns mit, [welche Leistungen im Preis enthalten sind].~I request the exact scope included in the price.~dass niemand Auskunft geben darf;ob jede Prüfung entfallen muss
Wir schlagen vor, [die offenen Punkte vor Vertragsabschluss zu klären].~We propose resolving outstanding points before signing.~die Unklarheiten unverändert zu lassen;jede Rückfrage als Zustimmung zu werten`, `
Könnten Sie bitte präzisieren, [auf welchen Zeitraum sich die Schätzung bezieht] ?~I ask which period the estimate covers.~warum keine Auskunft erfolgen darf;dass alle Zahlen endgültig bewiesen sind
Für eine Rückmeldung [bis zum kommenden Mittwoch] wären wir Ihnen dankbar.~I politely specify a response deadline.~ohne jede zeitliche Vorgabe;erst nach Abschluss aller Arbeiten`),
u('Read implied reservations and distance','Formulations such as nicht ganz überzeugend can convey a substantive reservation through understatement. Angeblich distances the speaker from a claim; immerhin concedes a positive point within a mixed evaluation.','Tone depends on context. A polite formulation can still communicate a serious objection.',`
Die Begründung ist [nicht ganz überzeugend].~The writer has reservations about the argument.~vollständig bewiesen;ausdrücklich vorbehaltlos gebilligt
[Angeblich] liegt die Zustimmung bereits vor.~The approval is reported but not endorsed as certain.~Nachweislich;Unbestreitbar
Der Entwurf ist [immerhin ein Anfang].~The draft is conceded some value but is not a finished solution.~bereits die endgültige Lösung;in jeder Hinsicht wertlos
Das Ergebnis ist [mit Vorsicht zu genießen].~The result should be treated cautiously.~ohne Prüfung verbindlich;unter allen Umständen falsch`, `
Das wäre [zumindest diskussionswürdig].~The proposal merits discussion without guaranteed acceptance.~bereits endgültig beschlossen;von vornherein verboten
Die Antwort lässt [einige Fragen offen].~The response leaves unresolved issues.~keinen Zweifel zu;alle Gegenargumente verschwinden`),
u('Distinguish cause, correlation and evidential scope','Einhergehen mit reports association; zurückzuführen auf attributes a cause and requires support. Insofern and soweit can limit the scope of a claim.','Correlation alone does not establish causation. Match the strength of your wording to the study design and evidence.',`
Der Rückgang [geht mit höheren Preisen einher].~The decline is associated with higher prices.~beweist allein eine eindeutige Ursache;schließt jeden Zusammenhang aus
Die Verzögerung ist [auf den Ausfall des Servers zurückzuführen].~The server failure is identified as the cause of the delay.~nur zeitlich gleichzeitig beobachtet;völlig unabhängig vom Server
[Soweit die vorliegenden Daten erkennen lassen], bleibt der Effekt begrenzt.~The claim is limited to what the available data show.~Unter allen denkbaren Umständen;Unabhängig von jeder Untersuchung
Der Befund [legt einen Zusammenhang nahe].~The finding suggests an association without proving causality.~beweist jede mögliche Ursache;widerlegt sämtliche Beziehungen`, `
Die Studie [erlaubt keine kausalen Schlüsse].~The study does not justify causal conclusions.~beweist die alleinige Ursache;ersetzt sämtliche weiteren Prüfungen
[Insofern] ist die Empfehlung nachvollziehbar, als sie das Risiko begrenzt.~The recommendation is reasonable to the extent that it limits risk.~Völlig losgelöst davon;In jedem Fall ohne Einschränkung`),
u('Synthesize evidence into a proportionate recommendation','Weigh findings and limitations explicitly. Einerseits/andererseits structures a tension; vor diesem Hintergrund links an evidence-based recommendation to the analysis.','A synthesis is not a list of claims. Explain how their strengths and limitations affect the recommendation.',`
[Einerseits] sinken die Kosten, andererseits steigt der Prüfaufwand.~The synthesis balances lower costs against more verification work.~Ausschließlich;Unwiderlegbar
[Vor diesem Hintergrund] empfehlen wir einen begrenzten Versuch.~The recommendation follows from the preceding evidence.~Ohne Bezug zur Analyse;Entgegen jedem genannten Befund
Die Ergebnisse sprechen dafür, [den Ansatz schrittweise zu erproben].~The evidence supports gradual testing.~jeden Erfolg zu garantieren;weitere Beobachtung auszuschließen
[Unter Abwägung der Risiken] erscheint eine Pilotphase vertretbar.~Considering the risks, a pilot appears defensible.~Ohne Kenntnis der Risiken;Wegen garantierter Risikofreiheit`, `
Der Nutzen ist plausibel; [offen bleibt jedoch die Übertragbarkeit].~Potential benefit is acknowledged while generalisability remains uncertain.~alle weiteren Fragen sind damit erledigt;daher ist jede Anwendung garantiert
Wir empfehlen eine Ausweitung, [sofern die unabhängige Prüfung den Befund bestätigt].~Expansion is conditional on independent confirmation.~selbst bei vollständiger Widerlegung;ohne irgendeine weitere Prüfung`),
u('Infer a past event and report uncertain information','Er muss gegangen sein expresses a strong inference about a completed event. Er soll gegangen sein reports a claim; er dürfte gegangen sein expresses a cautious probability.','These modal constructions differ in evidential force. They are not interchangeable reports of established facts.',`
Das Licht ist aus; sie [muss schon gegangen sein].~The speaker strongly infers she has left.~muss morgen erst gehen;darf niemals gegangen sein
Er [soll den Bericht bereits gelesen haben].~It is reported that he has read the report.~muss ihn morgen erst lesen;hat ihn nachweislich nie erhalten
Sie [dürfte die Nachricht inzwischen erhalten haben].~She has probably received the message by now.~wird sie erst nächstes Jahr erhalten;darf sie grundsätzlich nicht lesen
Ohne Schlüssel [kann er nicht hineingekommen sein].~The speaker rules out his having entered without a key.~musste er morgen hineingehen;wird er den Schlüssel kaufen`, `
Die Straße ist nass; es [muss geregnet haben].~The wet street supports an inference of past rain.~muss nächste Woche regnen;darf nicht mehr regnen
Der Zeuge [will nichts bemerkt haben].~The witness claims personally not to have noticed anything.~wird morgen alles bemerken;muss jedes Detail bemerkt haben`),
u('Express regret and an unreal past wish','Hätte ich doch and wäre ich doch introduce regret about an unrealised past alternative. Hätte machen sollen expresses a missed desirable action; hätte machen müssen a missed necessity.','Hätte ich angerufen is unreal past; ich hatte angerufen is an indicative report about an earlier actual event.',`
[Hätte ich doch] früher nachgefragt !~I regret not having asked sooner.~Ich hatte tatsächlich;Ich werde bestimmt
Ich [hätte die Warnung ernst nehmen sollen].~I should have taken the warning seriously.~habe sie zweifellos ernst genommen;werde sie morgen erhalten
[Wäre ich doch] länger geblieben !~I wish I had stayed longer.~Ich war tatsächlich;Ich werde sicher
Wir [hätten die Frist beachten müssen].~We ought to have observed the mandatory deadline.~haben sie nachweislich eingehalten;werden sie erst festlegen`, `
Wenn ich nur [auf deinen Rat gehört hätte] !~I wish I had listened to your advice.~morgen auf deinen Rat höre;ihn bereits nachweislich befolgt habe
Sie [hätte den Fehler früher melden sollen].~She should have reported the error earlier.~hat ihn nachweislich rechtzeitig gemeldet;wird ihn morgen vielleicht entdecken`),
u('Calibrate certainty and cite evidence','Den Daten zufolge attributes a claim; allem Anschein nach signals inference. Zweifelsfrei requires unusually strong support. Nach derzeitiger Kenntnis leaves room for revision.','Source attribution does not itself guarantee that the source is correct.',`
[Den Daten zufolge] ist die Nachfrage gestiegen.~The claim is attributed to the data.~Ohne irgendeinen Anhaltspunkt;Entgegen den genannten Daten
[Allem Anschein nach] wurde die Frist verlängert.~Available signs suggest an extension.~Nach zweifelsfreiem Beweis;Unter allen denkbaren Umständen
[Nach derzeitiger Kenntnis] bestehen keine weiteren Schäden.~The statement is limited to current knowledge.~Für alle Zukunft garantiert;Unabhängig von jeder Erkenntnis
Diese Erklärung ist [plausibel, aber nicht belegt].~The explanation is credible but unproven.~endgültig widerlegt;zweifelsfrei nachgewiesen`, `
[Nach Angaben der Behörde] beginnen die Arbeiten im Juni.~The authority is the stated source of the June start.~Ohne Bezug auf irgendeine Quelle;Im Widerspruch zu jeder Mitteilung
Der Zusammenhang ist [bislang nicht nachgewiesen].~The association has not yet been demonstrated.~abschließend bewiesen;für alle Zukunft ausgeschlossen`),
u('Limit and qualify an argument','Nicht zwangsläufig denies necessity, not possibility. Nur bedingt limits applicability; vorbehaltlich makes a statement dependent on a reservation or approval.','Nicht unbedingt falsch does not mean certainly correct. Track the scope of each negation.',`
Eine größere Stichprobe führt [nicht zwangsläufig] zu weniger Verzerrung.~A larger sample does not necessarily reduce bias.~unter allen Umständen;ausnahmslos
Der Vergleich ist [nur bedingt aussagekräftig].~The comparison has limited interpretive value.~vollständig ohne Einschränkung gültig;in jedem Fall verbindlich
Die Zusage gilt [vorbehaltlich der Genehmigung].~The commitment depends on approval.~auch bei verweigerter Genehmigung;ohne irgendeine Bedingung
Das ist [nicht ohne Weiteres übertragbar].~The finding cannot simply be generalised.~automatisch überall gültig;grundsätzlich bedeutungslos`, `
Der Vorschlag ist [in dieser Hinsicht] sinnvoll.~The proposal is sensible in the specified respect.~in jeder möglichen Hinsicht;unter keinerlei Umständen
Diese Annahme trifft [allenfalls unter engen Bedingungen] zu.~The assumption holds at most under narrow conditions.~immer ohne Ausnahme;garantiert in jedem Kontext`),
u('Use understatement and recognise polite criticism','Das ist nicht gerade ideal and da ist noch Luft nach oben signal limitations through understatement. Ein gewagter Schluss can question an inference politely but substantially.','Irony and understatement depend on shared context. Avoid relying on them for safety-critical instructions.',`
Der Ablauf ist [nicht gerade ideal].~The process is less than satisfactory.~ausnahmslos perfekt;völlig ohne Einschränkung gelobt
Beim Nachweis [ist noch Luft nach oben].~There is room to improve the supporting evidence.~ist alles endgültig geklärt;ist jede Verbesserung ausgeschlossen
Das ist [ein gewagter Schluss].~The inference is considered insufficiently justified or risky.~ein zwingender Beweis;eine rein beschreibende Zahl
Die Antwort war [sagen wir, ausbaufähig].~The speaker politely suggests the response needs work.~in jeder Hinsicht mustergültig;ohne weiteren Informationsbedarf`, `
Der Zeitplan ist [bestenfalls optimistisch].~Even the charitable assessment is that the schedule is optimistic.~nachweislich risikofrei;absichtlich vollständig aufgegeben
Das war [nicht unbedingt hilfreich].~The speaker mildly criticises the usefulness.~ausdrücklich die beste Hilfe;ein endgültiger Beweis`),
u('Adjust register while preserving the request','Formal written requests, neutral workplace coordination and familiar conversation may express the same goal differently. Keep the requested action and degree of obligation clear.','Könnten Sie is polite; könntest du is familiar. Switching pronouns also changes the verb form.',`
[Könnten Sie mir bitte die Unterlagen zusenden] ?~A polite professional request to send the documents.~Du musst mir sofort alles geben;Die Unterlagen sind unwichtig
[Schickst du mir kurz die Datei] ?~A familiar, relatively casual request for the file.~Jegliche Zusendung ist untersagt;Der Antrag wurde endgültig abgelehnt
[Wir bitten um Rückmeldung bis Freitag].~A formal request includes a Friday deadline.~Eine Antwort ist niemals erwünscht;Der Termin spielt keine Rolle
[Bitte geben Sie uns Bescheid, falls sich etwas ändert].~A polite request for notification of changes.~Informieren Sie niemanden;Bestätigen Sie alles ungeprüft`, `
[Könntest du kurz nachsehen] ?~A familiar softened request to check something.~Sie dürfen nichts überprüfen;Ich untersage jede Nachfrage
[Für eine zeitnahe Antwort wären wir Ihnen dankbar].~A formal courteous request for a prompt reply.~Antworten Sie unter keinen Umständen;Jede Antwort ist bereits überflüssig`),
u('Everyday idioms: decisions and spontaneous speech','Aus dem Stegreif means without preparation; aus dem Kopf means from memory. Das Sagen haben means hold decision-making authority. Den Spieß umdrehen reverses the positions in a dispute.','Aus dem Stegreif and aus dem Kopf can overlap in context but emphasise preparation and memory respectively.',`
Sie erklärte den Ablauf [aus dem Stegreif].~She explained the process spontaneously without preparation.~nach stundenlanger Probe;mit abgelesenem Manuskript
Die Nummer weiß ich nicht [aus dem Kopf].~I cannot recall the number from memory.~trotz schriftlicher Abschrift;nach dem Nachschlagen
In dieser Abteilung [hat sie das Sagen].~She has the authority to call the shots in this department.~hat sie keinerlei Einfluss;kennt sie niemanden
Er versuchte, [den Spieß umzudrehen].~He tried to reverse the roles or turn the tables.~die Lage unverändert zu lassen;jeden Austausch zu beenden
Damit bin ich [aus dem Schneider].~That gets me out of a difficult position or responsibility.~in zusätzlichen Schwierigkeiten;für alles allein zuständig`, `
Kannst du [aus dem Stegreif] ein Beispiel nennen ?~Can you provide an example without preparation?~nach langem Einüben;aus einem vorgelesenen Text
Wer [hat hier das Sagen] ?~Who is in charge here?~hat überhaupt keinen Einfluss;hat die Unterlagen verloren`),
u('Everyday idioms: change, concealment and surprise','Das Blatt wenden means change the course of events. Etwas unter den Teppich kehren means conceal or suppress it. Etwas auf den Kopf stellen overturns assumptions or disrupts the established order.','Select a native expression for its meaning and register; do not substitute a literal English image.',`
Die neue Aussage hat [das Blatt gewendet].~The new statement changed the course of events.~alles unverändert bestätigt;jede Änderung verhindert
Wir dürfen den Fehler nicht [unter den Teppich kehren].~We must not conceal the error.~offen besprechen;gründlich erklären
Die Entdeckung hat unser Verständnis [auf den Kopf gestellt].~The discovery overturned our understanding.~ohne Änderung bestätigt;als unwichtig verworfen
Mit dem früheren Zug [bist du besser dran].~Taking the earlier train puts you in a better position.~hast du sicher mehr Nachteile;verlierst du jede Möglichkeit
Diese Wendung hat mich [völlig aus der Fassung gebracht].~The twist left me very unsettled or astonished.~völlig unberührt gelassen;gründlich vorbereitet`, `
Nach dem neuen Beweis [hat sich das Blatt gewendet].~The new evidence changed the situation decisively.~blieb alles genau gleich;war jede Änderung unmöglich
Sie wollte die Beschwerden [unter den Teppich kehren].~She wanted to suppress the complaints.~öffentlich erörtern;systematisch aufklären`)
]
};
