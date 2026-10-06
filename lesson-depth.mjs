// Authored reference material. Existing exercise IDs and grading stay stable.
// Pipe-delimited rows keep multilingual tables reviewable beside their examples.
const rows=s=>s.trim().split('\n').map(x=>x.split('|'));
const table=(caption,headers,data)=>({caption,headers:headers.split('|'),rows:rows(data)});
const grammar={en:{},pt:{},ja:{}};
function G(lang,key,steps,caption,headers,data,pitfall,examples){grammar[lang][key]={steps:steps.split('|'),tables:[table(caption,headers,data)],pitfall,examples:rows(examples)};}
G("en","A1-2","Use be before a noun phrase (identity), an adjective (state), or a place phrase.|Match be to the subject, not the word that follows it. You always takes are, even for one person.|Make a negative by adding not; make a question by moving be before the subject.|Use a/an before a singular countable job: a teacher, an engineer. Adjectives take no article.","Be: statements, negatives and questions","Subject|Statement|Negative|Question",`I|I am a student.|I am not tired.|Am I late?
She|She is a doctor.|She is not ready.|Is she ready?
You / we / they|They are at home.|They are not here.|Are they here?`,"Say She is tired, not She tired or She does tired. Use Are you ready?, not Do you are ready?",`My brother is an engineer.|A singular job needs an article.
We are in the kitchen.|Be also locates people.
Are the shops open? No, they are closed.|Invert be for a question; match a plural subject.`);
G("en","A1-3","Use the present simple for routines and general facts; it does not usually describe an action happening at this instant.|With he/she/it, add -s. Add -es after -s, -sh, -ch, -x and commonly -o.|Change consonant + y to -ies: study → studies. Keep y after a vowel: play → plays.|Put usually/often before an ordinary verb, but after be. Use every day and on Mondays to specify frequency.","Third-person spelling","Base|He / she / it|Example",`work|works|He works at home.
watch|watches|She watches the news.
study|studies|He studies at night.
play|plays|She plays tennis.
have|has|He has two jobs.`,"She studies, but Does she study? and She does not study: does already carries the third-person ending.",`My sister usually catches the bus.|A habitual action with third-person -es.
We study together on Fridays.|We takes the base form.
He is often busy, but he always calls.|Frequency follows be but precedes calls.`);
G("en","A1-5","Put do before I/you/we/they and does before he/she/it.|Keep the main verb in the base form after the auxiliary.|Place a question word before do/does: Where does she live?|Short answers repeat the auxiliary: Yes, she does. No, she does not.|Questions about the subject differ: Who lives here? normally has no do.","Present-simple questions","Type|Pattern|Example",`Yes/no|Do + subject + base verb?|Do you drive?
Third person|Does + subject + base verb?|Does Ben teach?
Wh-question|Where + does + subject + base verb?|Where does Ben work?
Subject question|Who + verb?|Who teaches this class?`,"Does she studies? → Does she study? Be uses its own inversion: Is she a student?, not Does she be a student?",`What time does the shop close?|The question asks for a time.
Do your parents live nearby? Yes, they do.|A plural subject takes do.
Who knows the answer?|Who is the subject, so no do is needed.`);
G("en","A1-6","Use do not/don’t with I/you/we/they and does not/doesn’t with he/she/it.|Keep the lexical verb in the base form after do/does.|Negative be does not use do: I am not hungry.|Not every negative needs not: never already carries negative meaning in standard English.","Positive and negative routines","Subject|Positive|Negative",`I / you / we / they|They drink coffee.|They do not drink coffee.
He / she / it|She drinks coffee.|She does not drink coffee.
Be|He is hungry.|He is not hungry.
Never|I eat fish.|I never eat fish.`,"He doesn’t eats meat → He doesn’t eat meat. Avoid I don’t never eat meat in standard neutral English.",`My father doesn't drive to work.|Doesn't + base drive.
We don't usually eat late.|Frequency comes after the auxiliary.
I'm not thirsty, but I need a rest.|Be and ordinary verbs build negatives differently.`);
G("en","A2-1","Use the past simple for completed events at a finished time.|Regular verbs take -ed; add only -d after e, and change consonant + y to -ied.|Some short stressed verbs double the final consonant: stop → stopped. Learn irregular forms separately.|The past form is the same for most subjects; be differs: was/were.|Describe a sequence with first, then, afterwards and finally.","Past forms and pronunciation","Base|Past|Ending sound",`visit|visited|/ɪd/
watch|watched|/t/
play|played|/d/
stop|stopped|/t/
go|went|irregular
buy|bought|irregular`,"Do not add -ed to an irregular form: went, not goed. After did not, return to the base: did not go.",`We stayed for three days and returned on Monday.|A long event can still be a completed past event.
She bought a ticket, then caught the train.|Bought and caught are irregular past forms.
They were tired after the journey.|Plural past be is were.`);
G("en","A2-5","Build a yes/no question with Did + subject + base verb.|Put a question word first: Why did you leave? When did they arrive?|Use did/didn’t in short answers; do not repeat a past main verb.|Be is different: Was she there? Were they late? No did is needed.|A subject question normally has no did: Who bought the tickets?","Past questions: ordinary verbs and be","Statement|Question|Short answer",`She bought a ticket.|Did she buy a ticket?|Yes, she did.
They went by bus.|How did they go?|By bus.
He was at home.|Was he at home?|No, he wasn't.
They were ready.|Were they ready?|Yes, they were.
Someone called.|Who called?|Ana did.`,"Did she bought the tickets? → Did she buy the tickets? Was she went? → Did she go? Do not combine both systems.",`What did you do after lunch?|The first did is the auxiliary; do is the main verb.
Didn't you book online?|A negative question can signal surprise or an expectation.
Who sent the message? Who did you send it to?|The subject question and object question have different structures.`);
G("en","A2-6","Use was/were + verb-ing for an action in progress at a past reference time.|Use the past simple for a shorter event that interrupts or occurs during it.|While often introduces the ongoing background; when can introduce the event.|Most stative verbs prefer a simple form: knew, wanted, believed.|For -ing, usually drop final silent e: make → making. Some short stressed verbs double: run → running.","Past simple versus continuous","Purpose|Form|Example",`Background|was/were + -ing|I was reading at eight.
Interrupting event|past simple|The doorbell rang.
Two ongoing actions|while + continuous|I was reading while she was cooking.
Negative|was/were not + -ing|They weren't sleeping.
Question|Was/Were + subject + -ing?|Were you waiting?`,"I was knowing the answer → I knew the answer. Duration alone does not choose the tense: I worked there for ten years is possible.",`We were crossing the road when it started to rain.|The crossing was already in progress.
At nine, he was still writing his report.|The reference time is inside the activity.
While they were chatting, I finished the washing-up.|Background contrasts with completion.`);
G("en","B1-1","Use to + base verb to explain why someone acts.|In order to and so as to make purpose explicit, especially in formal writing.|Use in order not to/so as not to for a negative purpose.|Use so that + subject + modal when the purpose has a different subject.|For + -ing can describe the function of an object rather than the personal intention of an actor.","Ways to express purpose","Pattern|Example|Focus",`to + verb|I called to confirm the date.|My purpose
in order not to|We left early in order not to miss the bus.|Avoiding an outcome
so that + clause|I spoke slowly so that everyone could follow.|Another person's outcome
for + -ing|This knife is for cutting bread.|Function`,"I went there for buy bread → I went there to buy bread. For buying can describe a tool or arrangement, but not this simple purpose clause.",`She saved up to replace her laptop.|Purpose follows the action.
Please write clearly so that I can read it.|The subjects are different.
We checked twice so as not to overlook a mistake.|Not comes before to.`);
G("en","B1-2","May, might and could can express present or future possibility.|A modal is followed by a bare infinitive: might arrive, not might to arrive.|Use might not/may not for a possible negative outcome; cannot can express impossibility.|Must can mark a strong deduction from evidence, not only an obligation.|The strength of a modal depends on context; do not assign fixed percentage probabilities.","Possibility and inference","Form|Example|Interpretation",`might + verb|It might rain later.|Possible
may not + verb|She may not know.|Possibly not
could be|He could be at home.|One possible explanation
must be|The lights are on; someone must be inside.|Strong inference
can't be|That can't be Jo; she's abroad.|Inference of impossibility`,"Might doesn't take third-person -s: She might come, not might comes. May not and cannot are not interchangeable.",`Take a coat; it could get cold.|A possible future condition.
They might not have enough seats.|The shortage is possible, not certain.
The shop must be closed: the shutters are down.|Evidence supports a deduction.`);
G("en","B1-5","Form the present perfect with have/has + past participle.|Use it for life experience or a current result without specifying a finished past time.|Ever asks about experience; never gives a negative experience; already and yet relate to expectations.|Use the past simple when asking when a particular event happened.|Since names a starting point; for gives a duration with situations continuing to now.","Perfect versus finished past","Base|Participle|Example",`see|seen|I have seen it before.
go|gone|She has gone home.
be|been|Have you been to Seoul?
write|written|He has written three reports.
finish|finished|We have just finished.`,"I have seen it yesterday → I saw it yesterday. Gone often means someone has not returned; been often describes a completed visit.",`Have you ever tried kayaking? Yes, I tried it last year.|Experience leads to a dated past detail.
She hasn't replied yet.|Yet usually comes at the end.
I've known them since 2020.|A state continues to now.`);
G("en","B1-6","Use had + past participle for an event earlier than a past reference point.|Had is the same with every subject.|Use had not/hadn’t for a prior event that did not happen.|Before and after can already make time order clear, so past perfect is not compulsory in every past sequence.|Use the past perfect to clarify an earlier event when narrative order differs from chronological order.","Two past reference points","Function|Example|Time order",`Earlier event|They had closed the gate.|First
Later reference|We arrived at the airport.|Second
Prior negative|I hadn't met her before the interview.|No meeting before then
Question|Had you eaten before you left?|Eating before departure`,"Do not use past perfect just because an event was a long time ago. A second past reference point must be explicit or understood.",`When I got home, the guests had already left.|Their departure preceded my arrival.
I recognised him because we had worked together.|Earlier experience explains later recognition.
She had never flown before that trip.|The experience was absent before the trip.`);
G("en","B1-7","Use will + base verb for a decision made as you speak, an offer or a prediction.|Use be going to for a prior intention or a prediction based on present evidence.|Use the present continuous for arrangements with time/place already organised.|In ordinary future time clauses after when/as soon as, use a present form rather than will.|Contract will to ’ll in conversation; the negative is will not/won’t.","Future meanings","Form|Example|Reason",`will|I'll answer the phone.|Decision now
be going to|I'm going to learn to drive.|Prior intention
present continuous|We're meeting Jo at six.|Arrangement
present after when|I'll call when I arrive.|Future time clause`,"When I will arrive, I will call → When I arrive, I will call. Will is not the only way to refer to the future.",`This bag looks heavy; I'll carry it.|An offer made now.
Look at those clouds. It's going to rain.|A prediction based on visible evidence.
We are flying on Friday; the tickets are booked.|A confirmed arrangement.`);
G("en","B1-8","For an imagined present or future, use if + past simple, then would + base verb.|The past form marks distance from reality, not necessarily past time.|Could marks an imagined ability or possibility; might makes the result less certain.|Were is common with all subjects in formal hypothetical be clauses; was is also common in conversation.|Put a comma after an initial if-clause; usually omit it when the if-clause comes second.","Hypothetical patterns","Condition|Result|Meaning",`If I had more space,|I would get a desk.|Imagined present
If she knew the route,|she could guide us.|Imagined ability
If it were cheaper,|we might try it.|Less certain result
If I were you,|I would ask.|Advice`,"If I would have time → If I had time. This standard pattern puts would in the result clause.",`We would move closer if we could afford it.|The result comes before the condition.
If you lived nearby, we could meet more often.|An imagined change to the present.
What would you do if the train were cancelled?|A hypothetical question.`);
G("en","B2-3","Use a past form after if for an unreal or remote present condition.|Use would/could/might + base verb for different strengths of imagined result.|Were can be used with all persons in hypothetical clauses, especially formal writing.|Unless means if not, but it does not replace every negative if-clause naturally.|Contrast a remote condition with an open one: if prices fall, we will move.","Open and remote conditions","Type|Condition|Result",`Open future|If prices fall,|we will move.
Remote present|If prices were lower,|we would move.
Ability|If we had permission,|we could enter.
Tentative result|If the schedule changed,|I might attend.`,"A past form after if can refer to now. Avoid interpreting If I knew as automatically describing yesterday.",`If I were responsible, I would publish the figures.|A hypothetical role and action.
We could extend the trial if funding were available.|Ability depends on funding.
If you need help tomorrow, I'll be available.|This is an open future condition.`);
G("en","B2-5","Build have/has been + verb-ing to emphasise a continuing or recently repeated activity.|Use for with a duration and since with a starting point.|The simple perfect often emphasises a completed result or number; the continuous emphasises process or duration.|A recently stopped activity can explain present evidence.|Stative verbs normally prefer the simple perfect: have known, not have been knowing.","Result and process","Simple perfect|Continuous perfect|Difference",`I've written three emails.|I've been writing emails.|Number/result versus activity
She's read the report.|She's been reading the report.|Finished versus process
We've lived here for years.|We've been living here for years.|Both possible; continuous emphasises duration
I've known her since school.|—|Know is normally stative`,"I have been learning since six months → I have been learning for six months. Since requires a starting point.",`Why are your shoes muddy? I've been gardening.|A recent activity explains a present result.
They have been discussing the budget all morning.|Emphasis on duration.
I've finished the report, but I've been checking the references.|Completion and ongoing work can coexist.`);
G("en","B2-6","Use if + had + past participle for an unreal past condition.|Use would have + past participle for the imagined past result.|Could have expresses possible ability/outcome; might have reduces certainty.|A mixed conditional links a past condition to a present result: if I had slept, I would feel better now.|Formal inversion can omit if: Had we known, we would have waited.","Past counterfactuals","Condition|Result|Time",`If we had left earlier,|we would have arrived on time.|Past → past
If I had trained,|I could have competed.|Past ability
If she'd asked,|they might have agreed.|Possible past result
If I'd kept the receipt,|I could return it now.|Past → present`,"If we would have booked → If we had booked. Would of is not the written form of would have.",`Had they checked the map, they would not have got lost.|Formal inversion.
If I hadn't missed the bus, I would be there now.|A past cause has a present consequence.
We might have won if our captain had played.|The result remains uncertain.`);
G("en","C1-3","Distinguish association, causal influence and proof: these claims have different strengths.|Not necessarily denies an automatic conclusion; it does not assert that the conclusion is false.|Hedge only the part of the claim that the evidence leaves uncertain.|Use may reflect, appears to and is consistent with to state plausible interpretations.|Name alternative explanations and the evidence needed to distinguish them.","Calibrating a claim","Wording|Strength|Appropriate interpretation",`is associated with|Observed relationship|Variables move together
may contribute to|Tentative causal role|One possible influence
does not necessarily establish|Limits an inference|Not sufficient on its own
rules out|Excludes an explanation|Requires strong contrary evidence`,"No significant effect was detected does not prove that no effect exists. A small or imprecise sample may leave uncertainty.",`Higher attendance may reflect improved access rather than stronger motivation.|An alternative explanation is explicit.
The findings support the proposal, but do not establish its long-term effectiveness.|Scope is limited.
The association persists after adjustment; unmeasured factors remain possible.|Adjustment is not proof of causality.`);
G("en","C1-5","Use modal + have + past participle to infer an earlier event.|Must have expresses a strong positive inference; cannot/can’t have a strong negative inference.|May/might/could have preserve alternatives.|Should have can describe an expectation or an unfulfilled obligation; use context to distinguish them.|Separate your observation from the inferred explanation.","Past inference","Form|Example|Meaning",`must have|She must have missed the message.|Strong inference
might have|She might have misread it.|Possible explanation
can't have|She can't have sent it yesterday.|Evidence excludes that timing
should have|The parcel should have arrived by now.|Expected arrival`,"Must have is not automatically criticism. She must have left describes an inference; She had to leave describes past necessity.",`The room is empty; everyone must have gone home.|Present evidence supports a past deduction.
He may have attached an earlier draft.|A possibility without certainty.
They can't have reached a decision yet: the meeting hasn't started.|The reason for rejecting the inference is given.`);
G("en","C1-6","Use wish + past perfect for regret about a past situation.|Use wish + past simple for an unreal present state.|Wish + would often expresses a desired change in another person's behaviour or an external situation.|If only adds stronger emotion to the same time contrasts.|Should have + participle evaluates a past action rather than directly constructing a wish.","Wishes across time","Pattern|Example|Reference",`wish + had + participle|I wish I'd saved a copy.|Past regret
wish + past simple|I wish I knew the answer.|Present unreality
wish + would|I wish they would reply.|Desired change
if only + past perfect|If only we'd checked the date.|Emphatic past regret`,"I wish I would have checked is not the neutral standard pattern taught here: use I wish I had checked.",`I wish I had asked for clarification before signing.|A different past is imagined.
If only the results were more conclusive.|Present uncertainty causes dissatisfaction.
We should have allowed more time, but we can still revise the plan.|Evaluation leads to a practical next step.`);
G("pt","A1-2","Use ser for identity, origin and classification; use estar for location and many current states.|This is not simply permanent versus temporary: a permanent location can use estar, and an event location uses ser.|Match the adjective to the person or thing in gender and number.|Você takes a third-person singular verb; vocês takes a third-person plural verb.|The same adjective can change meaning: ser seguro can describe something as safe; estar seguro can describe someone as certain.","Ser and estar in Brazilian Portuguese","Subject|Ser|Estar",`eu|sou|estou
você / ele / ela|é|está
nós|somos|estamos
a gente|é|está
vocês / eles / elas|são|estão`,"Sou cansado is not the usual way to say I feel tired now: use Estou cansado/cansada. Say A reunião é na sala dois for the event location.",`Somos estudantes, mas hoje estamos de férias.|We are students, but today we are on holiday.
As janelas estão abertas.|The windows are open.
Ela é brasileira e está em Lisboa.|She is Brazilian and is in Lisbon.`);
G("pt","A1-3","For regular -ar verbs, remove -ar and attach the present ending.|Use the present for routines, general facts and some current situations.|Você and a gente use the third-person singular form; nós uses -amos.|To negate, put não before the verb.|Questions commonly keep statement word order and change intonation or add a question word.","Regular -ar verbs","Subject|trabalhar|estudar|morar",`eu|trabalho|estudo|moro
você / ela / a gente|trabalha|estuda|mora
nós|trabalhamos|estudamos|moramos
vocês / eles|trabalham|estudam|moram`,"A gente trabalham → A gente trabalha. A gente means we but uses a singular verb in standard usage.",`Ela estuda à tarde.|She studies in the afternoon.
Nós moramos perto da estação.|We live near the station.
Você trabalha aos sábados? Não, não trabalho.|Do you work on Saturdays? No, I do not.`);
G("pt","A1-5","Regular -er and -ir verbs share several endings, but nós uses -emos versus -imos.|Eu takes -o: comer → como, abrir → abro.|Você/ele/ela takes -e in both groups; the plural takes -em.|Some frequent verbs are irregular, so this table is a pattern rather than a rule for every verb.|Keep the subject and verb consistent when changing from nós to a gente.","Regular present endings","Subject|comer|beber|abrir",`eu|como|bebo|abro
você / ele / ela|come|bebe|abre
nós|comemos|bebemos|abrimos
a gente|come|bebe|abre
vocês / eles / elas|comem|bebem|abrem`,"Nós abre → Nós abrimos. Abrimos can also be a past form; a time expression clarifies the meaning.",`Bebemos água durante o almoço.|We drink water during lunch.
A loja abre às oito todos os dias.|The shop opens at eight every day.
Eles não comem carne.|They do not eat meat.`);
G("pt","A1-6","Learn frequent irregular verbs as complete patterns.|Ter expresses possession and age; fazer appears in many activity and weather expressions.|Ir can describe movement or combine with an infinitive for a future plan.|Eu often differs most strongly: tenho, faço, vou.|Ter keeps an accent distinction between singular tem and plural têm.","Frequent irregular present verbs","Subject|ter|fazer|ir",`eu|tenho|faço|vou
você / ele / ela|tem|faz|vai
nós|temos|fazemos|vamos
a gente|tem|faz|vai
vocês / eles / elas|têm|fazem|vão`,"For age, use Tenho trinta anos, not Sou trinta anos. After vou, use an infinitive: vou estudar, not vou estudo.",`Eles têm uma reunião hoje.|They have a meeting today.
Faz calor, mas vamos caminhar.|It is hot, but we are going to walk.
O que você faz depois do trabalho?|What do you do after work?`);
G("pt","A2-1","Use the pretérito perfeito simples to present a past event as complete.|Remove the infinitive ending and add the appropriate endings.|Regular -er and -ir differ in eu but share several other endings.|Ser and ir share fui, foi, fomos, foram; context identifies identity/state or movement.|A long period may still be complete: morei lá dez anos.","Completed past: regular and common irregular forms","Subject|comprar|comer|abrir|ir / ser",`eu|comprei|comi|abri|fui
você / ela|comprou|comeu|abriu|foi
nós|compramos|comemos|abrimos|fomos
vocês / eles|compraram|comeram|abriram|foram`,"Do not replace the Brazilian completed past automatically with tenho + participle: tenho comprado usually suggests repeated recent purchases.",`Ontem vendi o carro e fui ao banco.|Yesterday I sold the car and went to the bank.
Moramos em Recife durante dois anos e depois mudamos.|We lived in Recife for two years and then moved.
Ela fez o jantar e trouxe uma sobremesa.|She made dinner and brought a dessert.`);
G("pt","A2-5","Use the pretérito imperfeito for past habits, descriptions and ongoing background.|Regular -ar verbs use -ava endings; -er and -ir use -ia endings.|Ser, ter, vir and pôr have important irregular patterns.|Eu and você/ele/ela share imperfect forms, so context or a subject pronoun may be useful.|Choose viewpoint, not merely duration: a completed period can use the perfeito.","Past habits and background","Subject|morar|comer|abrir|ser|ter",`eu / você / ela|morava|comia|abria|era|tinha
nós|morávamos|comíamos|abríamos|éramos|tínhamos
vocês / eles|moravam|comiam|abriam|eram|tinham`,"Morei lá dez anos is possible for a completed period. Morava lá describes a past situation without presenting its endpoint.",`Quando éramos crianças, brincávamos na rua.|When we were children, we used to play in the street.
A casa tinha duas janelas e ficava perto do rio.|The house had two windows and was near the river.
Ela lia todas as noites, mas ontem não leu.|She used to read every night, but yesterday she did not.`);
G("pt","A2-6","Use estava/estávamos/estavam + gerund to describe an activity in progress.|Build regular gerunds with -ando, -endo and -indo.|Use the perfeito for a completed event within that background.|Enquanto can connect simultaneous activities.|In Brazilian Portuguese, estar + gerund is usual; estar a + infinitive is more characteristic of Portugal.","Background and event","Base|Gerund|Example",`falar|falando|Eu estava falando.
comer|comendo|Ela estava comendo.
abrir|abrindo|Estávamos abrindo a loja.
ler|lendo|Eles estavam lendo.
vir|vindo|O ônibus estava vindo.`,"Estava ler → Estava lendo. Do not put both events in the continuous automatically; an interruption normally uses the simple completed past.",`Estávamos jantando quando faltou luz.|We were having dinner when the power went out.
Enquanto ela dirigia, eu estava olhando o mapa.|While she was driving, I was looking at the map.
Ele estava saindo quando chegou a encomenda.|He was leaving when the parcel arrived.`);
G("pt","B1-1","Para + infinitive commonly states a purpose.|A noun after para can identify a recipient or intended use.|When the purpose clause has its own explicit plural subject, a personal infinitive can mark it.|Para que takes a finite subjunctive clause.|Por often gives a cause or motive rather than the same purpose construction.","Purpose constructions","Construction|Example|Meaning",`para + infinitive|Estudo para melhorar.|I study to improve.
para + noun|Este livro é para você.|This book is for you.
personal infinitive|Deixei espaço para eles passarem.|I left room for them to pass.
para que + subjunctive|Fale devagar para que todos entendam.|Speak slowly so everyone understands.`,"Para que todos entendem → Para que todos entendam. Do not confuse por causa da chuva (because of rain) with a purpose.",`Guardamos dinheiro para fazer uma viagem.|We are saving money to take a trip.
Enviei os documentos para você conferir.|I sent the documents for you to check.
Organizei os dados para que a equipe possa compará-los.|I organised the data so the team can compare them.`);
G("pt","B1-2","Talvez before a clause normally takes the subjunctive in standard Portuguese.|For many regular verbs, derive the present subjunctive from eu present minus -o; -ar takes e and -er/-ir take a.|Common irregular bases include seja, esteja, tenha and vá.|É possível que also introduces uncertainty and takes the subjunctive.|Acho que commonly takes indicative when stating what you think is true.","Possibility and the present subjunctive","Verb|Eu present|Subjunctive: eu / ela|Nós|Eles",`falar|falo|fale|falemos|falem
comer|como|coma|comamos|comam
abrir|abro|abra|abramos|abram
estar|estou|esteja|estejamos|estejam
ter|tenho|tenha|tenhamos|tenham`,"Talvez ela está → Talvez ela esteja in the standard pattern taught here. Subjunctive expresses the framing, not a fixed numerical probability.",`Talvez eles cheguem mais cedo.|Perhaps they will arrive earlier.
É possível que a loja esteja fechada.|It is possible that the shop is closed.
Acho que ela sabe, mas talvez não tenha certeza.|I think she knows, but perhaps she is not certain.`);
G("pt","B1-5","Ter in the present + past participle often describes repeated or continuing recent activity in Brazilian Portuguese.|This differs from an English present perfect used for one completed event.|The participle normally stays unchanged after ter.|Regular participles use -ado for -ar and -ido for -er/-ir; learn irregular feito, visto, escrito and aberto.|Use ultimamente and nos últimos dias to make the recent repeated interpretation clear.","Recent repeated activity","Subject|Auxiliary|Example",`eu|tenho|Tenho trabalhado muito.
você / ela|tem|Ela tem lido bastante.
nós|temos|Temos feito caminhadas.
eles|têm|Eles têm chegado cedo.`,"I have bought a car, meaning one completed purchase, is normally Comprei um carro. Tenho comprado carros suggests repeated purchases.",`Tenho dormido mal ultimamente.|I have been sleeping badly lately.
Ela tem escrito para os amigos toda semana.|She has been writing to friends every week.
Já terminei o relatório; tenho revisado os dados diariamente.|I have finished the report; I have been reviewing the data daily.`);
G("pt","B1-6","Use tinha + participle for an event before another past reference point.|Ter changes for the subject; the participle stays unchanged.|Já and ainda não clarify what had or had not happened by then.|The simple literary past-perfect forms exist, but tinha + participle is common in everyday Brazilian Portuguese.|A chronological story does not require past perfect for every earlier event.","Compound past perfect","Subject|Auxiliary|Example",`eu / você / ela|tinha|Ela tinha saído.
nós|tínhamos|Tínhamos reservado.
eles / vocês|tinham|Eles tinham escrito.
negative|não tinha|Eu não tinha visto.`,"Tinha escrevido → Tinha escrito. The reference point is past, unlike tenho escrito, which commonly describes recent repeated writing.",`Quando liguei, eles já tinham fechado a loja.|When I called, they had already closed the shop.
Nunca tínhamos visitado aquele bairro antes da mudança.|We had never visited that neighbourhood before the move.
Ela explicou que tinha perdido o bilhete.|She explained that she had lost the ticket.`);
G("pt","B1-7","Use the future subjunctive after se or quando for an open future condition or time.|For regular verbs its singular form matches the infinitive, but irregular forms may differ.|Derive many forms from the third-person plural perfeito minus -am: tiveram → tiver, fizeram → fizer.|The main clause can use a future form, ir + infinitive, present with future meaning or an instruction.|Compare se tiver (open future) with se tivesse (hypothetical).","Future subjunctive","Infinitive|Eles: past|Eu / ela: future subjunctive|Nós",`ter|tiveram|tiver|tivermos
fazer|fizeram|fizer|fizermos
ir / ser|foram|for|formos
poder|puderam|puder|pudermos
estudar|estudaram|estudar|estudarmos`,"Se eu terei tempo → Se eu tiver tempo. Quando eu fazer → Quando eu fizer.",`Quando você chegar, me avise.|Let me know when you arrive.
Se eles puderem, vão participar.|If they can, they will participate.
Depois que terminarmos, vamos descansar.|After we finish, we will rest.`);
G("pt","B1-8","Use se + imperfect subjunctive for a hypothetical condition.|Derive the imperfect subjunctive from the past plural stem: puderam → pudesse.|Use the conditional for an imagined result; add -ia endings to the infinitive for regular verbs.|Some conditional stems are irregular: fazer → faria, dizer → diria, trazer → traria.|Spoken Brazilian Portuguese often uses an imperfect in the result, but practise the explicit conditional first.","Hypothetical condition and result","Verb|Condition: eu|Result: eu|Result: nós",`ter|se tivesse|teria|teríamos
poder|se pudesse|poderia|poderíamos
viajar|se viajasse|viajaria|viajaríamos
fazer|se fizesse|faria|faríamos`,"Se eu poderia → Se eu pudesse. The conditional normally belongs in the result clause of this pattern.",`Se tivéssemos mais tempo, ficaríamos outra noite.|If we had more time, we would stay another night.
Eu ajudaria se pudesse.|I would help if I could.
O que você faria se perdesse o documento?|What would you do if you lost the document?`);
G("pt","B2-3","Remote present conditions use se + imperfect subjunctive.|Use the conditional to make the imagined result explicit.|Ser becomes fosse in the condition and seria in the result.|The past-looking form can describe present unreality rather than a past event.|Contrast open future se for with remote se fosse.","Open versus remote conditions","Construction|Condition|Result",`Open future|Se o preço for menor,|vamos comprar.
Remote present|Se o preço fosse menor,|compraríamos.
Ability|Se houvesse tempo,|poderíamos conversar.
Advice|Se eu fosse você,|esperaria.`,"Se fosse and se for are not interchangeable: they frame the condition with different degrees of openness.",`Se a equipe fosse maior, dividiríamos as tarefas.|If the team were larger, we would divide the tasks.
Poderíamos avançar se houvesse consenso.|We could move forward if there were agreement.
Se houver uma vaga amanhã, vou me inscrever.|If there is a place tomorrow, I will register.`);
G("pt","B2-5","Use the subjunctive after a recommendation, request, wish or evaluation introduced by que.|Present subjunctive often describes an action still to be carried out.|For regular -ar verbs use e endings, and for -er/-ir use a endings.|Learn irregular seja, vá, dê, saiba, esteja and tenha.|When the subject is unchanged, an infinitive may be more natural: quero estudar; quero que ela estude.","Present subjunctive after que","Subject|estudar|comer|abrir|ser",`eu / você / ela|estude|coma|abra|seja
nós|estudemos|comamos|abramos|sejamos
vocês / eles|estudem|comam|abram|sejam`,"Recomendo que vocês estudam → Recomendo que vocês estudem. The form is triggered by the recommendation, not simply by the presence of que.",`É importante que todos saibam o prazo.|It is important that everyone knows the deadline.
Peço que você revise a introdução.|I ask you to revise the introduction.
Espero que a proposta seja aprovada.|I hope the proposal is approved.`);
G("pt","B2-6","Use tivesse + participle for an unreal past condition.|Use teria + participle for its imagined past result.|Both auxiliaries agree with the subject; the participle stays unchanged.|A past condition can also produce an imagined present result.|Had the condition really been met, the sentence would need a factual rather than counterfactual framing.","Past counterfactual forms","Subject|Condition|Result",`eu / você / ela|se tivesse reservado|teria pago
nós|se tivéssemos reservado|teríamos pago
eles / vocês|se tivessem reservado|teriam pago
mixed time|se eu tivesse estudado|saberia responder agora`,"Se teria reservado → Se tivesse reservado. Keep the conditional auxiliary in the result clause.",`Se tivéssemos saído cedo, não teríamos perdido o voo.|If we had left early, we would not have missed the flight.
Ela teria aceitado se soubesse das condições.|She would have accepted if she had known the terms.
Se eu tivesse guardado a senha, poderia entrar agora.|If I had kept the password, I could log in now.`);
G("pt","C1-3","Não necessariamente limits a conclusion without denying every possible instance.|Distinguish a correlation from a mechanism that explains causality.|Use pode indicar, sugere and é compatível com for claims supported only provisionally.|Name the relevant limit: sample, comparison, timing or alternative cause.|In formal argument, separate observation from interpretation.","Strength of an inference","Expression|Meaning|Limit",`está associado a|is associated with|Relationship, not necessarily cause
pode contribuir para|may contribute to|Possible causal role
não implica necessariamente|does not necessarily imply|Conclusion not automatic
permite concluir|allows us to conclude|Needs sufficient support`,"Não necessariamente prova is not the same as prova que não: insufficient proof does not establish the opposite.",`A melhoria pode decorrer de fatores não observados.|The improvement may arise from unobserved factors.
A associação persiste, mas isso não exclui outras explicações.|The association persists, but that does not exclude other explanations.
Os dados sugerem uma tendência, sem permitir uma conclusão definitiva.|The data suggest a trend without allowing a definitive conclusion.`);
G("pt","C1-5","Use tenha + participle for an uncertain completed event linked to the present.|The matrix expression supplies the uncertainty: é possível que, duvido que.|The auxiliary takes present subjunctive forms; the participle normally does not agree.|Contrast esteja interpretando (ongoing) with tenha interpretado (completed).|A past framing may instead require tivesse + participle.","Perfect subjunctive","Subject|ter: subjunctive|Example",`eu / você / ela|tenha|É possível que ela tenha saído.
nós|tenhamos|Talvez tenhamos entendido mal.
eles / vocês|tenham|Duvido que tenham terminado.
negative|não tenha|É possível que não tenha chegado.`,"Tenha interpretada → Tenha interpretado after ter. Do not confuse this completed-event form with indicative tem interpretado, often repeated recent activity.",`Talvez ele tenha enviado a versão antiga.|Perhaps he sent the old version.
Não acredito que tenham verificado todas as fontes.|I do not believe they checked every source.
É possível que o atraso tenha afetado o resultado.|The delay may have affected the result.`);
G("pt","C1-6","Quem dera expresses a wish that reality were different.|Tivesse + participle places that wish before the current moment.|Tomara que often expresses a hope about an open outcome; it is not the same as an unreal past wish.|Poderia ter and deveria ter can evaluate an unrealised past possibility or obligation.|State the practical lesson separately from the regret.","Wish, hope and evaluation","Pattern|Example|Meaning",`quem dera + past perfect subjunctive|Quem dera eu tivesse perguntado.|Unreal past wish
se ao menos + past perfect subjunctive|Se ao menos tivéssemos conferido.|If only we had checked
tomara que + perfect subjunctive|Tomara que ele tenha recebido.|Hope about an uncertain completed event
deveria ter + participle|Eu deveria ter esperado.|Past evaluation`,"A wish about a completed past uses tivesse verificado here, not teria verificado directly after quem dera.",`Quem dera tivéssemos pedido uma segunda opinião.|If only we had asked for a second opinion.
Eu deveria ter confirmado o endereço antes de sair.|I should have confirmed the address before leaving.
Se ao menos ela tivesse guardado uma cópia!|If only she had kept a copy!`);
G("ja","A1-2","は marks what the sentence is about and is pronounced wa as a particle.|の connects a possessor or associated noun to a following noun: 私の本, 日本語の先生.|です follows a noun or adjective in polite speech; verbs have their own polite endings.|これ stands alone; この must be followed by a noun.|A known topic can often be omitted when context makes it clear.","Topic, possession and identification","Pattern|Example|Meaning",`AはBです|私は学生です。|I am a student.
AのB|先生のかばん|the teacher’s bag
これ / この + noun|これは本です。この本です。|This is a book. It is this book.
Question + か|これは誰の本ですか。|Whose book is this?
Polite negative|私の本ではありません。|It is not my book.`,"私のは本です does not mean my book in the ordinary noun phrase: use 私の本. Do not put です after a ます-form verb.",`これは姉の自転車です。|This is my older sister’s bicycle.
この店は日本の会社の店です。|This shop belongs to a Japanese company.
それは誰のかばんですか。|Whose bag is that?`);
G("ja","A1-3","The ます-form is polite nonpast: it can describe a habit or a future action.|を marks a direct object; で marks where an action occurs.|Use に for a specific time such as 七時; 今日 and 毎日 usually need no に.|Japanese verbs do not change for person or number.|A time expression clarifies habitual versus future meaning.","Routine sentence patterns","Role|Particle / form|Example",`Object|を|パンを食べます。
Action location|で|家で勉強します。
Specific time|に|六時に起きます。
Routine time|usually no particle|毎朝走ります。
Future context|nonpast verb|明日働きます。`,"学校に勉強します → 学校で勉強します for studying at school. 学校に行きます uses に for the destination.",`毎晩、家で本を読みます。|I read books at home every evening.
父も母も七時に起きます。|My father and mother both get up at seven.
明日は図書館で勉強します。|Tomorrow I will study at the library.`);
G("ja","A1-5","Group 2 verbs remove る and add ます: 食べる → 食べます.|Group 1 verbs change the final u-row sound to the corresponding i-row sound before ます.|する → します and 来る → 来ます are irregular.|Not all verbs ending in -iru/-eru are Group 2: 帰る, 入る and 走る are common Group 1 exceptions.|Learn a verb with its group and a short object phrase.","Dictionary form to polite form","Group|Dictionary|Stem|Polite",`Group 1|書く|書き|書きます
Group 1|飲む|飲み|飲みます
Group 1|話す|話し|話します
Group 1 exception to the ending clue|帰る|帰り|帰ります
Group 2|食べる|食べ|食べます
Irregular|する / 来る|し / 来（き）|します / 来ます`,"飲むます → 飲みます. Ending in る alone does not identify the verb group: 帰る becomes 帰ります, not 帰ます.",`毎日、日記を書きます。|I write a diary every day.
友達は明日来ます。|My friend is coming tomorrow.
夕方、家に帰ります。|I go home in the evening.`);
G("ja","A1-6","Replace ます with ません for a polite nonpast negative.|Use ませんでした for a polite past negative.|The nonpast negative can describe a habit or future non-action.|Nouns and na-adjectives use ではありません or conversational じゃありません.|い-adjectives remove い and use くないです; they do not take ません directly.","Polite negatives","Type|Positive|Negative|Past negative",`Verb|食べます|食べません|食べませんでした
Irregular verb|します|しません|しませんでした
Noun|学生です|学生ではありません|学生ではありませんでした
い-adjective|高いです|高くないです|高くなかったです`,"高いません is incorrect. Also distinguish 行きません (do not/will not go) from 行きませんでした (did not go).",`日曜日は働きません。|I do not work on Sundays.
昨日はコーヒーを飲みませんでした。|I did not drink coffee yesterday.
この店は高くないです。|This shop is not expensive.`);
G("ja","A2-1","Use ました for a polite past affirmative and ませんでした for a polite past negative.|Only the ending changes; person and number do not.|Nouns and na-adjectives use でした, while い-adjectives use かったです.|The ta-form is the plain past form and changes according to verb group.|Use 昨日, 先週 and 去年 to locate a completed event.","Polite past across word classes","Type|Nonpast|Past|Past negative",`Verb|読みます|読みました|読みませんでした
Noun|学生です|学生でした|学生ではありませんでした
な-adjective|静かです|静かでした|静かではありませんでした
い-adjective|忙しいです|忙しかったです|忙しくなかったです
Exception|いいです|よかったです|よくなかったです`,"忙しいでした → 忙しかったです. Do not apply the noun ending directly to an い-adjective.",`先週、友達と博物館に行きました。|Last week I went to a museum with a friend.
昨日は忙しかったので、料理をしませんでした。|I was busy yesterday, so I did not cook.
旅行は楽しかったです。|The trip was enjoyable.`);
G("ja","A2-5","The te-form connects verbs and builds requests, ongoing states and other constructions.|Group 2 verbs remove る and add て; する becomes して and 来る becomes 来て（きて）.|For Group 1, the final sound determines って, んで, いて, いで or して.|行く is an important exception: 行って.|The te-form alone does not mark tense; the final predicate or following construction supplies it.","Group 1 te-form changes","Ending|Change|Example",`う / つ / る|って|買う→買って / 待つ→待って / 帰る→帰って
む / ぶ / ぬ|んで|読む→読んで / 遊ぶ→遊んで / 死ぬ→死んで
く|いて|書く→書いて
ぐ|いで|泳ぐ→泳いで
す|して|話す→話して
Exception|行って|行く→行って`,"書って → 書いて. 食べる is Group 2, so 食べて, not 食べって. Always identify the group before applying an ending rule.",`窓を開けてください。|Please open the window.
駅に行って、切符を買いました。|I went to the station and bought a ticket.
ここで少し待ってください。|Please wait here for a moment.`);
G("ja","A2-6","Attach いる to the te-form; polite speech uses ています.|Activity verbs often describe an action in progress.|Change-of-state verbs often describe a resulting state: 結婚している, 窓が開いている.|The construction can also describe repeated activity over a period.|知る has the common state 知っている, but the normal negative for not knowing is 知らない.","Different meanings of ている","Meaning|Example|Interpretation",`In progress|今、本を読んでいます。|Reading now
Resulting state|窓が開いています。|The window is open
Repeated activity|毎週ここで働いています。|Regular work over time
State of knowledge|その人を知っています。|Know that person
Past ongoing|昨日の八時は寝ていました。|Was sleeping at eight yesterday`,"Not every ている means English -ing: 結婚しています means is married. 知りません is the usual polite negative of 知っています.",`子どもたちは庭で遊んでいます。|The children are playing in the garden.
妹は大阪に住んでいます。|My younger sister lives in Osaka.
ドアが閉まっています。|The door is closed.`);
G("ja","B1-1","Dictionary-form verb + ために expresses an intentional purpose.|Nouns connect with のために.|The subjects of the purpose and action are commonly the same in this intentional pattern.|ように is often used for a desired ability or state beyond direct control, including potential and negative forms.|ため can also express a cause in other contexts; identify the relationship from the whole sentence.","Purpose: ために and ように","Construction|Example|Focus",`Dictionary + ために|留学するために貯金します。|Intentional goal
Noun + のために|家族のために働きます。|For someone / something
Potential + ように|読めるように練習します。|Developing ability
Negative + ように|忘れないようにメモします。|Avoiding an unwanted outcome`,"上手に話せるために is usually better expressed as 上手に話せるように. Potential forms generally favour ように for this purpose.",`資格を取るために、夜も勉強しています。|I also study at night to get the qualification.
みんなに聞こえるように、大きな声で話しました。|I spoke loudly so everyone could hear.
健康のために、毎日歩いています。|I walk every day for my health.`);
G("ja","B1-2","かもしれない follows a plain-form predicate and expresses possibility.|With a noun or na-adjective in the affirmative nonpast, omit だ.|Use かもしれません for polite speech.|The tense before the expression can locate the uncertain event in the past.|でしょう/だろう can present a tentative prediction or inference, depending on context.","Possibility across predicate types","Type|Plain predicate|With possibility",`Verb|来る|来るかもしれません
Negative verb|来ない|来ないかもしれません
Past verb|忘れた|忘れたかもしれません
い-adjective|高い|高いかもしれません
Noun / な-adjective|学生だ / 静かだ|学生かもしれません / 静かかもしれません`,"学生だかもしれない → 学生かもしれない. Do not attach the expression directly to a ます-form.",`電車が遅れているかもしれません。|The train may be delayed.
鍵を会社に忘れたかもしれない。|I may have left my keys at work.
明日は忙しくないかもしれません。|I may not be busy tomorrow.`);
G("ja","B1-5","Ta-form + ことがある states that an experience has occurred at least once.|Use ことがない for no experience and ことがありますか for an experience question.|一度, 何度も and まだ clarify frequency and whether it has happened yet.|For a specific dated event, a simple past statement is usually more direct.|Distinguish dictionary-form + ことがある, which can mean sometimes do.","Experience versus event","Pattern|Example|Meaning",`Ta + ことがある|京都に行ったことがあります。|Have been to Kyoto
Ta + ことがない|納豆を食べたことがありません。|Have never eaten natto
Dated past|去年、京都に行きました。|Went last year
Dictionary + ことがある|週末も働くことがあります。|Sometimes work weekends`,"昨日、初めて食べたことがあります is awkward for a direct report: 昨日、初めて食べました is natural.",`日本の電車に乗ったことがありますか。|Have you ever taken a train in Japan?
この映画は何度も見たことがあります。|I have seen this film many times.
まだ一人で海外旅行をしたことがありません。|I have not travelled abroad alone yet.`);
G("ja","B1-6","Te-form + おく describes preparation for a later purpose.|ておいた / ておきました reports that preparation has been completed.|The construction can also mean leave something in a state.|In conversation, ておく often contracts to とく and でおく to どく.|Make the later purpose explicit with 前に or a context that shows why preparation matters.","Preparation and leaving a state","Full form|Conversational form|Example",`書いておく|書いとく|予定を書いておきます。
読んでおく|読んどく|資料を読んでおいてください。
予約しておく|予約しとく|席を予約しておきました。
そのままにしておく|そのままにしとく|窓は開けたままにしておきます。`,"ておく is not just a past or completion marker: the preparation or maintained-state meaning matters.",`出発前に、ホテルの住所を調べておきます。|I will look up the hotel address before leaving.
会議までに、この資料を読んでおいてください。|Please read this material before the meeting.
帰るまで、電気をつけておいてください。|Please leave the light on until I return.`);
G("ja","B1-7","Dictionary form + つもりです expresses an intention.|Negative plain form + つもりです expresses an intention not to do something.|つもりはない can emphasise that one has no intention of doing it.|予定 describes a plan or schedule, while ことになっている can describe an arrangement decided externally.|A past intention does not guarantee that the action actually happened.","Intention and arrangement","Pattern|Example|Focus",`Dictionary + つもり|来月引っ越すつもりです。|Personal intention
Negative + つもり|参加しないつもりです。|Intention not to act
予定|三時に到着する予定です。|Scheduled plan
ことになっている|来週発表することになっています。|Established arrangement
つもりだった|電話するつもりでした。|Past intention`,"行くつもりです does not mean the trip is already booked. Use the wording that matches the actual certainty and source of the plan.",`今週末は家で休むつもりです。|I intend to rest at home this weekend.
昨日電話するつもりでしたが、忘れました。|I intended to call yesterday, but forgot.
会議は金曜日に開く予定です。|The meeting is scheduled for Friday.`);
G("ja","B1-8","Add ら to the ta-form to build a conditional.|Nouns and na-adjectives use だったら; negatives use なかったら.|たら can describe an open hypothetical condition or the point after an event is completed.|The result can be a request, invitation or intention.|Contrast と for predictable consequences and なら for taking up a premise supplied in context.","Building たら","Base|Conditional|Example",`行く|行ったら|駅に行ったら、電話してください。
食べる|食べたら|食べたら、片付けましょう。
忙しい|忙しかったら|忙しかったら、明日でいいです。
休みだ|休みだったら|休みだったら、会いましょう。
来ない|来なかったら|来なかったら、先に始めます。`,"たら does not automatically mean a counterfactual past. 帰ったら電話します normally means I will call after I get home.",`雨が降ったら、家にいます。|If it rains, I will stay home.
安かったら、二つ買いたいです。|If they are cheap, I would like to buy two.
仕事が終わったら、連絡してください。|Please contact me after work finishes.`);
G("ja","B2-3","なら takes a situation as a premise and gives advice, a judgment or a hypothetical result.|For a noun or na-adjective, use noun/adjective stem + なら rather than だなら.|Potential forms in the result can express what would become possible.|Sentence-final のに can express regret that the desired result does not match reality.|なら alone does not guarantee counterfactual meaning; context supplies whether the premise is real, open or unreal.","Conditional framing","Form|Example|Interpretation",`Noun + なら|学生なら、割引があります。|If you are a student
Verb + なら|京都へ行くなら、この店がおすすめです。|If you are going to Kyoto
Adjective + なら|もっと安いなら、買えるのに。|If it were cheaper, I could buy it
Past premise|もう予約したなら、変更を確認しましょう。|If you have already booked`,"Use 静かなら, not 静かだなら. Do not translate every なら clause as an unreal English second conditional.",`車があるなら、駅まで送ってもらえますか。|If you have a car, could you give me a lift to the station?
もっと時間があるなら、丁寧に説明できるのに。|If there were more time, I could explain carefully.
参加するなら、今日中に知らせてください。|If you are participating, please let me know today.`);
G("ja","B2-5","For Group 1 passives, change the final u sound to a + れる; う changes to われる.|For Group 1 causatives, change it to a + せる.|Group 2 verbs use られる for passive and させる for causative.|する becomes される/させる; 来る becomes 来られる/来させる.|Passive often marks the agent with に; causative particle choice depends on transitivity and the sentence.","Passive and causative","Dictionary|Passive|Causative",`呼ぶ|呼ばれる|呼ばせる
書く|書かれる|書かせる
買う|買われる|買わせる
食べる|食べられる|食べさせる
する|される|させる
来る|来られる（こられる）|来させる（こさせる）`,"食べられる can be passive or potential; context disambiguates it. Causative can mean make or let, so do not assume coercion in every case.",`私は先生にほめられました。|I was praised by the teacher.
母は子どもに野菜を食べさせました。|The mother made or let the child eat vegetables.
上司は私を先に帰らせてくれました。|My supervisor let me go home first.`);
G("ja","B2-6","Past counterfactuals combine an unreal earlier condition with an unreal result.|ていれば can imagine an earlier state or action having held.|たら and ば can both occur, but their context and emphasis differ.|のに often adds regret or disappointment about the unreal result.|Without のに, the same basic structure can remain a relatively neutral hypothetical inference.","Past conditions and regret","Construction|Example|Meaning",`ていれば|知っていれば、連絡したのに。|If I had known, I would have contacted you
なければ|雨が降らなければ、行けたのに。|If it had not rained, I could have gone
ていたら|早く出ていたら、間に合っただろう。|If we had left earlier, we probably would have made it
ておけば|調べておけば、困らなかった。|If I had checked in advance, I would not have had trouble`,"The past interpretation comes from the whole context, not from ば alone. 明日晴れれば refers to an open future condition.",`地図を持っていれば、迷わなかったのに。|If I had had a map, I would not have got lost.
もう少し待っていたら、彼に会えたかもしれない。|If I had waited a little longer, I might have met him.
予約を確認していれば、間違いに気づいただろう。|If we had checked the booking, we probably would have noticed the error.`);
G("ja","C1-3","必ずしも + negative denies an automatic or universal conclusion.|からといって introduces a premise that is insufficient for the following inference.|とは限らない means not necessarily, rather than definitely not.|Differentiate 因果関係, 相関 and an interpretation that remains only possible.|State the alternative explanation or limit instead of merely adding vague hedges.","Limits on conclusions","Form|Example|Function",`必ずしも〜ない|高価な物が必ずしも良いわけではない。|Deny an automatic generalisation
〜からといって|人気があるからといって、安全とは限らない。|Reject an insufficient premise
〜とは限らない|全員に効果があるとは限らない。|Allow exceptions
〜可能性がある|別の要因が影響した可能性がある。|Preserve another explanation`,"必ずしも効果がない is not the same as 必ず効果がない. The first qualifies a general claim; the second asserts certainty of no effect.",`利用者が増えたからといって、満足度が上がったとは限らない。|More users do not necessarily mean higher satisfaction.
この結果だけでは、因果関係があると断定できない。|This result alone does not establish causality.
改善は認められるが、他の要因も考慮する必要がある。|Improvement is observed, but other factors must be considered.`);
G("ja","C1-5","ものと思われる presents an inference in formal reporting.|Place the relevant plain predicate before もの; a ta-form places the inferred event earlier.|Compare と確認された for a confirmed finding and 可能性がある for an open possibility.|The impersonal form can reduce emphasis on the writer but does not create stronger evidence.|State the observation that supports the inference.","Reporting evidence and inference","Wording|Example|Status",`〜と確認された|送信済みと確認された。|Confirmed
〜ものと思われる|通知を見落としたものと思われる。|Reasoned inference
〜可能性がある|旧版を参照した可能性がある。|Possibility
〜とは断定できない|故意だったとは断定できない。|Conclusion withheld`,"Avoid using ものと思われる to disguise an unsupported guess as a finding. It still needs an evidential basis.",`記録がないため、処理が完了しなかったものと思われる。|The absence of a record suggests the process did not complete.
担当者の説明から、手順が誤解されたものと思われる。|The staff member’s explanation suggests the procedure was misunderstood.
ただし、現時点では原因を特定できない。|However, the cause cannot currently be identified.`);
G("ja","C1-6","ておけばよかった expresses regret about missing a useful preparation.|ばよかった can express a broader wish that a past action had been different.|なければよかった regrets an action that was taken.|Distinguish this retrospective wish from てよかった, which expresses relief or satisfaction.|A constructive follow-up can state what to do next time.","Regret versus relief","Pattern|Example|Meaning",`ておけばよかった|保存しておけばよかった。|Should have saved in advance
ばよかった|相談すればよかった。|Should have consulted
なければよかった|急がなければよかった。|Should not have rushed
てよかった|確認してよかった。|Glad I checked`,"確認してよかった praises the actual check; 確認しておけばよかった normally regrets not checking beforehand.",`締め切りを確認しておけばよかった。|I should have checked the deadline in advance.
根拠を確かめずに断定しなければよかった。|I should not have asserted it without checking the evidence.
今回は間違えたので、次は先に相談しよう。|I made a mistake this time, so next time I will consult someone first.`);
const vocabulary={en:{},pt:{},ja:{}};
function V(lang,key,data){vocabulary[lang][key]=rows(data).map(([term,meaning,phrase,example,translation])=>({term,meaning,phrase,example,translation}));}
V('en','A1-7',`a loaf|a whole piece of baked bread|a loaf of bread|Could I have a loaf of brown bread?|Ask for one whole loaf.
a slice|a thin flat piece|a slice of cheese|I'd like two slices of cheese.|Cheese can be measured in slices.
a bottle|a container for liquid|a bottle of water|We need three bottles of water.|Count the containers, not waters here.
a carton|a paper or cardboard container|a carton of milk|There is a carton of milk in the fridge.|Milk is normally uncountable.
a bunch|a group attached or held together|a bunch of bananas|I bought a bunch of bananas.|The bunch is a countable unit.
a little / a few|a small quantity / a small number|a little rice / a few apples|We have a little rice and a few apples.|Use little with uncountable nouns and few with plural countable nouns.`);
V('en','A1-8',`a pharmacy|a shop selling medicine|go to the pharmacy|The pharmacy is next to the bank.|Next to means immediately beside.
a library|a place to borrow or read books|borrow a book from the library|The library is opposite the school.|A library is not a bookshop.
a crossing|a place to cross a road|use the pedestrian crossing|Cross at the pedestrian crossing.|Use a designated place to cross.
a corner|where two streets or edges meet|on the corner|There's a café on the corner.|On the corner identifies the street junction.
between|in the space separating two things|between the bank and the café|The post office is between the bank and the café.|Name both reference places.
behind / in front of|at the back / at the front|behind the station|The car park is behind the station.|Behind differs from opposite, which means across from.`);
V('en','A2-7',`a reservation|an arrangement to keep a room or place|make / confirm a reservation|I'd like to confirm my reservation for Friday.|Confirm an existing booking.
a vacancy|an available room or position|have a vacancy|Do you have any vacancies for tonight?|Ask whether any rooms are available.
check-in|the arrival registration process|check-in time|What time is check-in?|The noun is hyphenated; the verb is check in.
a deposit|money paid in advance|pay a deposit|Is the deposit refundable?|Ask whether the advance payment can be returned.
luggage|bags taken on a journey; uncountable|leave my luggage|Could I leave my luggage here until three?|Say two bags, not two luggages.
a cancellation fee|money charged for cancelling|charge a cancellation fee|Is there a cancellation fee if my flight changes?|Ask about the cost of cancelling.`);
V('en','A2-8',`a deadline|the latest time for completion|meet / miss a deadline|We need to meet the deadline on Thursday.|Meet means finish in time.
an extension|extra time officially allowed|ask for an extension|Could I ask for a two-day extension?|Request additional time.
a shift|a scheduled period of work|work the night shift|She works the night shift twice a week.|A shift is a block of working time.
a workload|the amount of work assigned|manage a heavy workload|We need to share the workload more evenly.|Workload concerns quantity of work.
submit|send work for consideration or review|submit a report|Please submit the report by noon.|By noon sets the latest completion time.
on time / in time|punctually / early enough|arrive on time|The meeting started on time, and I arrived in time to join.|The phrases express different timing relationships.`);
V('pt','A1-7',`um quilo|one kilogram|um quilo de arroz|Quero um quilo de arroz.|I want a kilogram of rice.
meio quilo|half a kilogram|meio quilo de queijo|Vou levar meio quilo de queijo.|I will take half a kilogram of cheese.
um litro|one litre|um litro de leite|Precisamos de um litro de leite.|We need a litre of milk.
uma dúzia|twelve items|uma dúzia de ovos|Comprei uma dúzia de ovos.|I bought a dozen eggs.
uma fatia|a slice|uma fatia de pão|Você quer uma fatia de pão?|Would you like a slice of bread?
um pacote|a packet|um pacote de café|Este pacote de café custa vinte reais.|This packet of coffee costs twenty reais.`);
V('pt','A1-8',`a farmácia|pharmacy|ir à farmácia|A farmácia fica ao lado do mercado.|The pharmacy is next to the market.
a padaria|bakery|comprar pão na padaria|A padaria abre às seis.|The bakery opens at six.
a praça|square or public plaza|atravessar a praça|Atravesse a praça para chegar ao banco.|Cross the square to reach the bank.
a esquina|street corner|na esquina|Há uma banca na esquina.|There is a newsstand on the corner.
em frente a|opposite or in front of|em frente à escola|O ponto de ônibus fica em frente à escola.|The bus stop is in front of the school.
entre|between|entre o banco e o café|A loja fica entre o banco e o café.|The shop is between the bank and the café.`);
V('pt','A2-7',`a reserva|reservation|confirmar uma reserva|Gostaria de confirmar minha reserva.|I would like to confirm my reservation.
a diária|the price for one day's accommodation|o valor da diária|Qual é o valor da diária?|What is the nightly rate?
a vaga|an available space or room|ter vaga|Vocês têm vaga para hoje?|Do you have a vacancy for today?
a bagagem|luggage|guardar a bagagem|Posso guardar a bagagem aqui?|May I leave my luggage here?
o sinal|an advance deposit|pagar um sinal|É necessário pagar um sinal?|Is an advance deposit required?
a taxa de cancelamento|cancellation fee|cobrar uma taxa|Há taxa de cancelamento?|Is there a cancellation fee?`);
V('pt','A2-8',`o prazo|time limit or deadline|cumprir o prazo|A equipe conseguiu cumprir o prazo.|The team managed to meet the deadline.
a prorrogação|extension of a deadline or period|pedir uma prorrogação|Vou pedir uma prorrogação de dois dias.|I will ask for a two-day extension.
o turno|work shift|trabalhar no turno da noite|Ela trabalha no turno da noite.|She works the night shift.
a tarefa|task|dividir as tarefas|Vamos dividir as tarefas entre nós.|Let us divide the tasks among ourselves.
entregar|to hand in or deliver|entregar o relatório|Preciso entregar o relatório até sexta-feira.|I need to hand in the report by Friday.
a reunião|meeting|marcar uma reunião|Podemos marcar uma reunião para amanhã?|Can we schedule a meeting for tomorrow?`);
V('ja','A1-7',`一本（いっぽん）|one long cylindrical object|水を一本|水を一本ください。|One bottle of water, please.
二枚（にまい）|two flat objects|切符を二枚|切符を二枚買います。|I will buy two tickets.
三個（さんこ）|three small items|りんごを三個|りんごを三個食べました。|I ate three apples.
一杯（いっぱい）|one cup or bowlful|お茶を一杯|お茶を一杯お願いします。|One cup of tea, please.
一つ（ひとつ）|one item; general counter|パンを一つ|パンを一つください。|One bread item, please.
一袋（ひとふくろ）|one bagful|お米を一袋|お米を一袋買いました。|I bought one bag of rice.`);
V('ja','A1-8',`駅（えき）|station|駅の前|駅の前で待ちます。|I will wait in front of the station.
薬局（やっきょく）|pharmacy|薬局に行く|薬局は銀行の隣です。|The pharmacy is next to the bank.
交差点（こうさてん）|intersection|交差点を渡る|次の交差点を渡ってください。|Please cross the next intersection.
角（かど）|corner|角を曲がる|二つ目の角を右に曲がります。|Turn right at the second corner.
向かい（むかい）|opposite; across from|学校の向かい|店は学校の向かいです。|The shop is opposite the school.
間（あいだ）|between; the space separating|AとBの間|郵便局は銀行と駅の間です。|The post office is between the bank and the station.`);
V('ja','A2-7',`予約（よやく）|reservation|予約を確認する|予約を確認していただけますか。|Could you confirm the reservation?
空室（くうしつ）|vacant room|空室がある|今夜、空室はありますか。|Are there any rooms available tonight?
宿泊（しゅくはく）|an overnight stay|二泊する|二泊する予定です。|I plan to stay for two nights.
料金（りょうきん）|charge or rate|宿泊料金|朝食は宿泊料金に含まれますか。|Is breakfast included in the accommodation rate?
荷物（にもつ）|luggage or belongings|荷物を預ける|午後まで荷物を預けてもいいですか。|May I leave my luggage until the afternoon?
キャンセル料|cancellation fee|キャンセル料がかかる|いつからキャンセル料がかかりますか。|From when does a cancellation fee apply?`);
V('ja','A2-8',`締め切り（しめきり）|deadline|締め切りを守る|締め切りを守ることが大切です。|It is important to meet deadlines.
延長（えんちょう）|extension|締め切りを延長する|締め切りを一日延長できますか。|Can the deadline be extended by one day?
提出（ていしゅつ）|submission|資料を提出する|明日の正午までに資料を提出します。|I will submit the material by noon tomorrow.
担当（たんとう）|responsibility; person in charge|会議を担当する|この仕事は誰が担当しますか。|Who will be responsible for this work?
残業（ざんぎょう）|overtime work|残業する|今日は残業しない予定です。|I do not plan to work overtime today.
打ち合わせ（うちあわせ）|coordination meeting|打ち合わせをする|午後に打ち合わせをしましょう。|Let us have a coordination meeting this afternoon.`);
const expressions={en:{},pt:{},ja:{}};
function E(lang,key,register,pitfall,data){expressions[lang][key]=rows(data).map(([term,meaning,example,translation,use])=>({term,meaning,example,translation,use,register,type:'Useful expression',pitfall,region:lang==='pt'?'Brazilian Portuguese':lang==='ja'?'Japanese': 'English'}));}
E("en","A1-9","Polite / neutral","Use excuse me to attract attention; use sorry to apologise after causing inconvenience.",`Excuse me|a polite attention-getter|Excuse me, where is the exit?|Ask a stranger for directions.|Place it before your question.
Sorry to interrupt|acknowledges an interruption|Sorry to interrupt, but is this your bag?|Briefly interrupt an ongoing conversation.|Use when someone is already speaking or busy.
May I ask a question?|asks permission to speak|May I ask a question about the timetable?|Request a turn politely.|More formal than Can I ask something?
Could I get past, please?|asks someone to let you pass|Could I get past, please? This is my stop.|Ask for space to move.|Use in a crowded place.`);
E("en","A1-10","Polite / neutral","Again asks for repetition; more slowly asks for speed to change; spell asks for letters.",`Could you repeat that?|please say it again|Could you repeat that last number?|Ask to hear the final number again.|Name the part you missed.
Could you speak more slowly?|please reduce your speed|Could you speak more slowly? I'm still learning.|Ask for slower speech.|It does not request a quieter voice.
How do you spell that?|what are its letters?|How do you spell your surname?|Ask for the written letters.|Use for names and unfamiliar words.
What does that mean?|asks for an explanation|What does the word platform mean?|Ask about meaning.|This differs from asking for pronunciation.`);
E("en","A1-11","Neutral","Need + noun and need to + verb differ: I need help; I need to leave. Do not say need to a ticket.",`need a hand|require some help|I need a hand with this box.|I need help carrying it.|Often informal and practical.
need to leave|must go|I need to leave at five.|Leaving at five is necessary.|Use to before the verb.
would like to|politely express a wish|I'd like to book a table.|I want to make a booking.|A polite desire, not necessarily a necessity.
have to|express a requirement|I have to finish this today.|I am required to finish today.|It can describe an external obligation.`);
E("en","A1-12","Neutral","Use at night, in the morning and on Monday morning. Do not add at before every day.",`in the morning|during the morning|I exercise in the morning.|Morning is my usual exercise time.|Use in with the general part of day.
in the evening|during the evening|We cook together in the evening.|We usually cook after the daytime.|Evening is not always interchangeable with night.
at noon|at twelve midday|Let's meet at noon.|Meet at twelve in the daytime.|Use at for a specific time.
on Friday morning|during that named morning|The appointment is on Friday morning.|The day and part of day are specified.|Use on with a named day.`);
E("en","A2-9","Neutral / conversational","How about takes -ing; Why don’t we and Let’s take the base form.",`How about taking a break?|suggest a break|How about taking a break before we continue?|Shall we stop briefly?|Follow about with -ing.
Why don't we try another route?|suggest a different plan|Why don't we try another route to avoid traffic?|Propose an alternative route.|This is a suggestion, not normally a request for a reason.
Let's check first|suggest a shared action|Let's check the price first.|We should check together.|Let's includes the speaker.
We could take the bus|offer one possible option|We could take the bus if it's raining.|The bus is an option.|Could is less forceful than must.`);
E("en","A2-10","Polite / conversational","Do you mind...? asks whether something bothers you: No, not at all normally grants permission, unlike a simple yes/no request.",`Of course|readily agree|Could you open the window? Of course.|The speaker agrees to open it.|Use for willing acceptance.
I'd be happy to|willingly offer to do it|Could you check this? I'd be happy to.|The speaker is willing to check.|A warm, polite acceptance.
I'm afraid I can't|politely refuse|I'm afraid I can't stay late today.|The speaker cannot stay.|Afraid softens refusal; it need not mean fear.
No, not at all|say it does not bother you|Do you mind if I sit here? No, not at all.|The seat is permitted.|Interpret it in relation to mind.`);
E("en","A2-11","Neutral","Always/often usually precede an ordinary verb but follow be. Once in a while does not mean once only.",`once in a while|occasionally|We go hiking once in a while.|Hiking happens occasionally.|Often placed at the end.
every now and then|from time to time|Every now and then, I take a different route.|The change happens occasionally.|Useful at the beginning or end.
hardly ever|almost never|She hardly ever eats breakfast out.|It happens very rarely.|Do not normally add another not.
twice a week|two times each week|I swim twice a week.|There are two weekly swims.|Use twice, not two time.`);
E("en","A2-12","Neutral / conversational","Turn out describes an eventual result; turn up can mean arrive or appear and is a different phrasal verb.",`turn out well|have a good final result|The event turned out well.|The eventual outcome was good.|Often contrasts with an earlier worry.
work out|be resolved or succeed|Don't worry; we'll make it work out.|We will try to achieve a successful result.|Context separates this from exercise.
in the end|eventually, after developments|In the end, we stayed home.|This was the final decision.|At the end refers to a position or final point.
end up doing|eventually do, often unexpectedly|We ended up ordering takeaway.|That became our eventual action.|Use -ing after end up.`);
E("en","B1-9","Neutral","In other words restates an idea; for example illustrates it. Do not use a reformulation marker before an unrelated claim.",`in other words|stated differently|The fee is optional; in other words, you can choose whether to pay.|The second clause restates optional.|Useful when simplifying.
what I mean is|clarifies your intended point|What I mean is that we need more time, not more staff.|The speaker corrects an interpretation.|Often followed by that.
to put it simply|introduces a simpler explanation|To put it simply, demand exceeds supply.|A complex point is summarised.|Avoid sounding dismissive of the listener.
that is to say|introduces a precise restatement|The figures are provisional, that is to say, subject to revision.|The status is clarified.|More formal than I mean.`);
E("en","B1-10","Neutral","Instead of takes a noun or -ing form. Rather than often connects parallel forms; maintain the same grammatical structure.",`instead of|in place of|We met online instead of travelling.|Online replaced travel.|Follow with a noun or -ing.
rather than|in preference to|I'd prefer to wait rather than rush.|Waiting is preferred.|Keep the alternatives parallel.
as an alternative|another available option|As an alternative, we could meet on Thursday.|A second plan is offered.|Introduce a complete alternative.
otherwise|if that is not done|Book now; otherwise, there may be no seats.|No booking may lead to no seats.|It introduces a consequence or different case.`);
E("en","B1-11","Conversational","Give me a hand is a request for assistance; give her a hand can also mean applaud her in a performance context.",`give someone a hand|help someone|Could you give me a hand carrying this?|Please help me carry it.|Name the task when useful.
help out|provide practical help|Can you help out at the event?|Can you assist where needed?|Often temporary or practical.
do someone a favour|perform a helpful act|Could you do me a favour and collect the parcel?|A specific helpful action is requested.|Use do, not make, a favour.
lend a hand|offer assistance|Several neighbours lent a hand with the move.|The neighbours helped.|Lent is the past of lend.`);
E("en","B1-12","Conversational / neutral","Realise means become aware; remember means retrieve something already known. They are not always interchangeable.",`it dawned on me|I came to realise|It dawned on me that the dates were wrong.|I became aware of the date problem.|Follow with that + clause.
figure out|understand or solve|We finally figured out why it failed.|We solved the explanation.|Put a pronoun inside: figure it out.
make sense|be understandable|Now your explanation makes sense.|I can understand it now.|Not make a sense.
put two and two together|infer from clues|I put two and two together and realised they had moved.|Clues led to the conclusion.|Informal and figurative.`);
E("en","B2-7","Neutral","Weigh up is evaluative, not physical weighing. Consider trade-offs rather than assuming every option has only advantages.",`weigh up the options|compare choices carefully|We need to weigh up the options before committing.|Compare before deciding.|Common in British English; weigh the options also works.
take into account|include in your judgment|Take travel time into account.|Consider travel time as a factor.|The object may follow take or come at the end.
on the one hand / on the other hand|present contrasting considerations|On the one hand it's cheaper; on the other, it's slower.|Cost and speed conflict.|Use the pair for real contrast.
a trade-off|a gain accompanied by a cost|There is a trade-off between speed and accuracy.|Improving one may reduce the other.|Name both sides.`);
E("en","B2-8","Neutral / professional","Put into practice means apply; practise means rehearse or do repeatedly. Application and rehearsal can differ.",`put into practice|apply an idea|We put the feedback into practice in the next draft.|We applied the feedback.|Put is unchanged in the past.
follow through on|complete a promised action|We need to follow through on our commitments.|Carry out what was promised.|Include on before the commitment.
roll out|introduce progressively|The service will be rolled out in stages.|It will be introduced gradually.|Often used for services or systems.
get underway|begin operating|The pilot got underway in May.|The pilot began.|Underway is one word in this usage.`);
E("en","B2-9","Neutral / conversational","Under pressure describes demands; under control describes successful management. They do not mean the same thing.",`under pressure|facing strong demands|The team is under pressure to deliver.|There are strong expectations.|Use to + verb for the demanded action.
keep up with|maintain the required pace|I can't keep up with all these changes.|The pace is difficult to match.|Do not omit with before the object.
spread too thin|have too many responsibilities|We're spread too thin across five projects.|Resources are insufficiently concentrated.|Usually passive or be + participle.
take on too much|accept excessive responsibility|I took on too much this month.|I accepted more work than I could manage.|Take on differs from take over.`);
E("en","B2-10","Conversational","Keep at it encourages continued effort; put up with means tolerate something unpleasant, not work persistently on it.",`keep at it|continue making an effort|The first draft is difficult, but keep at it.|Continue working despite difficulty.|At belongs to the expression.
stick with it|continue rather than abandon|The method takes time; stick with it.|Continue using the method.|Informal encouragement.
bounce back|recover from a setback|The team bounced back after the defeat.|They recovered their performance.|It implies recovery, not avoiding all failure.
learn from a setback|use failure constructively|We learned from the setback and changed the plan.|The difficulty informed improvement.|Name what changed if possible.`);
E("en","C1-7","Formal / academic","Consistent with does not mean proves. An explanation may fit the evidence while alternatives also remain possible.",`consistent with|compatible with an interpretation|The pattern is consistent with seasonal demand.|Seasonal demand could explain it.|Does not exclude alternatives.
lend support to|provide some supporting evidence|The follow-up lends support to the initial finding.|It strengthens the finding.|Not necessarily conclusive.
fall short of establishing|be insufficient to prove|The survey falls short of establishing a causal link.|It does not provide enough causal evidence.|States a limit on support.
rule out|exclude an explanation|The data do not rule out selection effects.|Selection effects remain possible.|A negative preserves an alternative.`);
E("en","C1-8","Formal / professional","Subject to introduces a condition, not unconditional permission. Provided that introduces a clause; subject to normally takes a noun phrase.",`subject to|conditional upon|Approval is subject to a final inspection.|Inspection is a condition.|Follow with a noun or -ing phrase.
provided that|on the condition that|We can proceed provided that the budget is approved.|Budget approval is required.|Follow with a full clause.
with the proviso that|with an explicit qualification|I agree, with the proviso that results are published.|Agreement includes a condition.|Formal and relatively strong.
without prejudice to|without affecting a separate right or position|The extension is granted without prejudice to other conditions.|Other conditions remain in place.|Formal legal-administrative wording; use only when that meaning is intended.`);
E("en","C1-9","Polite / understated","Understatement can express real criticism. Read context rather than treating every mild phrase as praise.",`leave something to be desired|be less satisfactory than expected|The organisation left something to be desired.|The organisation was unsatisfactory.|Conventional restrained criticism.
room for improvement|scope to become better|There is room for improvement in the evidence section.|The evidence section needs work.|Specify what needs improvement.
not entirely convincing|partly unpersuasive|The explanation is not entirely convincing.|Reservations remain.|Not necessarily a total rejection.
a little ambitious|possibly unrealistic|The deadline seems a little ambitious.|The deadline may be unrealistic.|Context can make this a tactful objection.`);
E("en","C1-10","Register contrast","An idiom may suit a meeting but not a formal report. Replace it with precise wording when clarity for a broad audience matters.",`get the ball rolling|start an activity|Let's get the ball rolling with introductions.|Let us begin.|Conversational; formal: begin proceedings.
kick off|begin|We'll kick off the workshop at nine.|The workshop starts at nine.|Conversational; formal: commence.
initiate discussions|formally begin talks|The committee will initiate discussions next week.|Formal talks will begin.|Professional and explicit.
lay the groundwork|prepare a foundation|The interviews laid the groundwork for the review.|They prepared the basis for later work.|Metaphorical but common in formal prose.`);
E("pt","A1-9","Polite / neutral","Com licença requests permission or passage; desculpe apologises. Both can attract attention, but their main functions differ.",`com licença|excuse me; with your permission|Com licença, este lugar está livre?|Excuse me, is this seat free?|Use before interrupting or passing.
desculpe incomodar|sorry to bother you|Desculpe incomodar, onde fica a recepção?|Sorry to bother you, where is reception?|Acknowledge an interruption.
posso passar?|may I get past?|Com licença, posso passar?|Excuse me, may I get past?|Ask for physical space.
posso fazer uma pergunta?|may I ask a question?|Posso fazer uma pergunta sobre o horário?|May I ask about the timetable?|Use fazer with pergunta.`);
E("pt","A1-10","Polite / neutral","Mais devagar asks for slower speech, not a lower volume. Repetir asks for the same information again.",`pode repetir?|could you repeat?|Pode repetir o número, por favor?|Could you repeat the number, please?|Name the part you missed.
mais devagar|more slowly|Pode falar mais devagar?|Could you speak more slowly?|Use with falar.
como se escreve?|how is it written?|Como se escreve seu sobrenome?|How do you spell your surname?|Ask for letters or spelling.
o que significa?|what does it mean?|O que significa esta palavra?|What does this word mean?|Ask about meaning rather than sound.`);
E("pt","A1-11","Neutral","Precisar de + noun but precisar + infinitive: preciso de ajuda; preciso sair. Do not insert de before the infinitive in this standard pattern.",`precisar de ajuda|need help|Preciso de ajuda com a mala.|I need help with the suitcase.|Use de before a noun.
precisar sair|need to leave|Preciso sair às cinco.|I need to leave at five.|Use the infinitive directly.
ter que|have to|Tenho que terminar hoje.|I have to finish today.|Common for an obligation.
gostaria de|would like|Gostaria de reservar uma mesa.|I would like to book a table.|Polite desire rather than necessity.`);
E("pt","A1-12","Neutral","Às marks clock times, à noite is a time phrase, and de manhã has no crasis. Their written forms differ.",`de manhã|in the morning|Estudo de manhã.|I study in the morning.|A general morning period.
à tarde|in the afternoon|Trabalho à tarde.|I work in the afternoon.|Use the grave accent in this adverbial phrase.
à noite|at night; in the evening|Leio à noite.|I read at night.|The phrase covers evening/night contexts.
ao meio-dia|at noon|Vamos nos encontrar ao meio-dia.|Let us meet at noon.|Use ao with meio-dia.`);
E("pt","A2-9","Conversational / neutral","Que tal normally takes an infinitive or noun in Portuguese, unlike English how about + -ing.",`que tal...?|how about...?|Que tal fazer uma pausa?|How about taking a break?|Follow with an infinitive.
por que não...?|why not...?|Por que não tentamos outra rota?|Why don't we try another route?|A proposal rather than a literal demand for a reason.
podíamos|we could|Podíamos conversar amanhã.|We could talk tomorrow.|The imperfect softens a suggestion.
vamos...?|shall we...?|Vamos tomar um café?|Shall we have a coffee?|Includes the speaker in the activity.`);
E("pt","A2-10","Polite / conversational","Pois não conventionally offers help or accepts a request despite containing não. Pois é usually acknowledges or comments, rather than granting a request.",`pois não|certainly; how can I help?|Pode verificar? Pois não.|Could you check? Certainly.|Common in service encounters.
claro|of course|Você pode esperar? Claro.|Can you wait? Of course.|A clear affirmative acceptance.
sem problema|no problem|Posso sentar aqui? Sem problema.|May I sit here? No problem.|Grants permission or reassures.
infelizmente, não posso|unfortunately, I cannot|Infelizmente, não posso ficar até tarde.|Unfortunately, I cannot stay late.|Polite refusal with a clear limit.`);
E("pt","A2-11","Neutral","De vez em quando means occasionally; uma vez means once. Quase nunca normally does not need another não.",`de vez em quando|occasionally|De vez em quando, vamos ao cinema.|Occasionally, we go to the cinema.|A non-regular low frequency.
às vezes|sometimes|Às vezes trabalho em casa.|Sometimes I work at home.|Use the grave accent in às vezes.
quase nunca|hardly ever|Quase nunca pego táxi.|I hardly ever take a taxi.|Very low frequency.
duas vezes por semana|twice a week|Faço exercício duas vezes por semana.|I exercise twice a week.|Use plural vezes after duas.`);
E("pt","A2-12","Conversational / neutral","Dar certo means succeed; dar errado means go wrong. A literal translation of dar does not capture these expressions.",`dar certo|work out; succeed|A nova receita deu certo.|The new recipe worked out.|Past: deu certo.
dar errado|go wrong|O plano deu errado por falta de tempo.|The plan went wrong because of insufficient time.|Explains an unsuccessful result.
no fim das contas|in the end; all things considered|No fim das contas, ficamos em casa.|In the end, we stayed home.|Summarises the eventual outcome.
acabar + gerund|end up doing|Acabamos pedindo comida.|We ended up ordering food.|Different from acabar de + infinitive, meaning have just done.`);
E("pt","B1-9","Neutral","Ou seja restates; por exemplo illustrates. Isto é and ou seja should clarify the original point rather than add an unrelated claim.",`ou seja|in other words|A entrada é gratuita, ou seja, não é preciso pagar.|Entry is free; there is no need to pay.|Restate a meaning.
isto é|that is|O prazo é flexível, isto é, pode ser negociado.|The deadline is flexible; it can be negotiated.|A precise explanatory reformulation.
em outras palavras|in other words|Em outras palavras, precisamos de mais tempo.|In other words, we need more time.|Often introduces a plain-language restatement.
o que quero dizer é que|what I mean is that|O que quero dizer é que o custo não é o único problema.|What I mean is that cost is not the only problem.|Clarifies intended emphasis.`);
E("pt","B1-10","Neutral","Em vez de replaces one option with another; ao invés de is traditionally used for an opposition. Em vez de is the safer general replacement phrase.",`em vez de|instead of|Vamos de trem em vez de dirigir.|Let us go by train instead of driving.|Use an infinitive or noun after de.
como alternativa|as an alternative|Como alternativa, podemos nos reunir online.|Alternatively, we can meet online.|Introduce another workable choice.
caso contrário|otherwise|Confirme hoje; caso contrário, perderemos a vaga.|Confirm today; otherwise we will lose the place.|Gives the consequence if the action is not taken.
ou então|or else; alternatively|Podemos ir hoje, ou então amanhã cedo.|We can go today, or alternatively early tomorrow.|Conversational alternative.`);
E("pt","B1-11","Conversational","Dar uma mão means help; dar a mão can literally mean hold out or give your hand. Context and the article matter.",`dar uma mão|lend a hand|Você pode me dar uma mão na mudança?|Can you give me a hand with the move?|Informal practical help.
fazer um favor|do a favour|Pode me fazer um favor e fechar a janela?|Could you do me a favour and close the window?|Use fazer with favor.
ajudar com|help with|Ela me ajudou com o relatório.|She helped me with the report.|Use com for the task or object.
quebrar um galho|help someone out temporarily|Você pode quebrar um galho e me buscar?|Could you help me out and pick me up?|Informal Brazilian expression.`);
E("pt","B1-12","Conversational","Cair a ficha is an idiom for understanding, not a literal falling object in this context. Perceber can mean notice or realise.",`cair a ficha|the realisation sinks in|Só então caiu a ficha de que a data tinha mudado.|Only then did it sink in that the date had changed.|Informal Brazilian idiom.
se dar conta de|realise; become aware of|Eu me dei conta de que faltava um documento.|I realised a document was missing.|Keep de before que.
fazer sentido|make sense|Agora sua explicação faz sentido.|Now your explanation makes sense.|No article before sentido here.
entender o motivo|understand the reason|Finalmente entendi o motivo da alteração.|I finally understood the reason for the change.|A neutral alternative to an idiom.`);
E("pt","B2-7","Neutral / professional","Levar em conta includes a factor in a judgment; dar conta de concerns managing a task. Do not confuse the two.",`pesar os prós e os contras|weigh pros and cons|Vamos pesar os prós e os contras antes de decidir.|Let us weigh the advantages and disadvantages first.|Compare both sides explicitly.
levar em conta|take into account|É preciso levar o prazo em conta.|We must take the deadline into account.|The object can occur within the phrase.
por um lado / por outro lado|on one hand / on the other|Por um lado é barato; por outro, exige manutenção.|It is cheap but requires maintenance.|Introduce genuinely contrasting factors.
abrir mão de|give up; relinquish|Não queremos abrir mão da qualidade.|We do not want to give up quality.|Use de before the thing relinquished.`);
E("pt","B2-8","Neutral / professional","Pôr em prática means apply; pôr em dúvida means question. The prepositional phrase changes the meaning.",`pôr em prática|put into practice|Pusemos a sugestão em prática.|We put the suggestion into practice.|Pôr has an irregular past: pus/pusemos.
colocar em ação|put into action|Vamos colocar o plano em ação.|Let us put the plan into action.|Move from planning to execution.
dar andamento a|move a process forward|Precisamos dar andamento ao projeto.|We need to move the project forward.|A combines with o in ao.
levar adiante|carry forward|A equipe decidiu levar a proposta adiante.|The team decided to pursue the proposal.|Emphasises continuation.`);
E("pt","B2-9","Conversational / professional","Dar conta de a task means manage it; dar-se conta de a fact means realise it. The reflexive form changes the meaning.",`dar conta de|manage; cope with|Não consigo dar conta de tudo sozinho.|I cannot manage everything alone.|Use de before the workload.
ficar sobrecarregado|become overloaded|A equipe ficou sobrecarregada.|The team became overloaded.|Adjective agrees with its subject.
assumir responsabilidades|take on responsibilities|Ela assumiu novas responsabilidades.|She took on new responsibilities.|Neutral professional wording.
trabalhar sob pressão|work under pressure|Ele consegue trabalhar sob pressão.|He can work under pressure.|Sob, not sobre, in this expression.`);
E("pt","B2-10","Conversational","Jogar a toalha means give up; the negative encourages persistence. Insistir em can be positive or negative depending on context.",`não jogar a toalha|not give up|Ainda há opções; não vamos jogar a toalha.|There are still options; let us not give up.|An informal boxing metaphor.
seguir em frente|move forward|Aprendemos com o erro e seguimos em frente.|We learned from the error and moved on.|Can describe emotional or practical recovery.
dar a volta por cima|recover after adversity|Depois da perda, ela deu a volta por cima.|She bounced back after the loss.|Informal recovery idiom.
persistir no objetivo|persist towards a goal|Apesar das dificuldades, persistimos no objetivo.|Despite difficulties, we persisted in our goal.|More neutral than an idiom.`);
E("pt","C1-7","Formal / academic","Corroborar strengthens support; comprovar makes a stronger claim. Neither should be used automatically for any observed association.",`ser compatível com|be consistent with|O padrão é compatível com a hipótese inicial.|The pattern is consistent with the initial hypothesis.|Allows other compatible explanations.
corroborar|lend support to|A análise adicional corrobora a interpretação.|The additional analysis supports the interpretation.|State what is supported.
não permite concluir|does not allow a conclusion|A amostra não permite concluir que o efeito seja universal.|The sample does not establish a universal effect.|Limits the inference.
não descarta|does not rule out|O resultado não descarta explicações alternativas.|The result does not rule out alternatives.|Preserves uncertainty.`);
E("pt","C1-8","Formal / professional","Desde que meaning provided that usually takes the subjunctive; desde que meaning since can describe a factual time relation.",`estar condicionado a|be conditional on|O apoio está condicionado à revisão do orçamento.|Support depends on a budget review.|Observe agreement and a + a = à.
desde que|provided that|Podemos avançar, desde que haja consenso.|We can move forward provided there is consensus.|Conditional meaning takes subjunctive.
com a ressalva de que|with the qualification that|Concordo, com a ressalva de que os dados são preliminares.|I agree, with the proviso that the data are preliminary.|Explicitly limits agreement.
sujeito a|subject to|O cronograma está sujeito a alterações.|The timetable is subject to change.|Adjective agrees with the noun.`);
E("pt","C1-9","Restrained / professional","Deixar a desejar is criticism, not an expression that the reader literally desires something. Its mild surface can still convey substantial dissatisfaction.",`deixar a desejar|leave something to be desired|A clareza do texto deixa a desejar.|The clarity is unsatisfactory.|A conventional restrained criticism.
haver margem para melhoria|have room for improvement|Há margem para melhoria na análise.|The analysis could be improved.|Specify the dimension.
não ser de todo convincente|not be entirely convincing|A justificativa não é de todo convincente.|The justification leaves doubts.|Formal reservation rather than total rejection.
merecer revisão|warrant revision|O prazo proposto merece revisão.|The proposed deadline needs reconsideration.|A tactful recommendation.`);
E("pt","C1-10","Register contrast","Dar o pontapé inicial is figurative; iniciar is more literal and neutral in formal records.",`dar o pontapé inicial|get things started|A reunião deu o pontapé inicial no projeto.|The meeting got the project started.|Conversational metaphor.
iniciar os trabalhos|begin proceedings|A comissão iniciou os trabalhos às nove.|The committee began proceedings at nine.|Formal meeting language.
abrir a discussão|open the discussion|A relatora abriu a discussão sobre os custos.|The rapporteur opened discussion of costs.|Suitable for professional contexts.
lançar as bases|lay the foundations|O acordo lançou as bases para a cooperação.|The agreement laid the foundations for cooperation.|Metaphorical but common in formal prose.`);
E("ja","A1-9","Polite","すみません can attract attention or apologise. ごめんなさい normally apologises and is not the standard opening to ask a stranger for directions.",`すみません|excuse me; sorry|すみません、出口はどこですか。|Excuse me, where is the exit?|Use before a question to a stranger.
失礼します|excuse me as I enter, leave or interrupt|失礼します。今、よろしいですか。|Excuse me. Is now a good time?|Acknowledge an interruption or boundary.
ちょっといいですか|may I have a moment?|すみません、ちょっといいですか。|Excuse me, may I have a moment?|Polite enough in many everyday contexts.
通ってもいいですか|may I get past?|ここを通ってもいいですか。|May I pass through here?|Ask permission to move through.`);
E("ja","A1-10","Polite","もう一度 asks for repetition; ゆっくり asks for slower speed. 聞いてください means please listen, not please say it again.",`もう一度お願いします|once more, please|すみません、もう一度お願いします。|Sorry, could you repeat that?|A short polite repetition request.
ゆっくり話してください|please speak slowly|少しゆっくり話してください。|Please speak a little more slowly.|Use for speed.
どう書きますか|how do you write it?|お名前はどう書きますか。|How do you write your name?|Ask for spelling or characters.
どういう意味ですか|what does it mean?|この言葉はどういう意味ですか。|What does this word mean?|Ask about meaning.`);
E("ja","A1-11","Polite / neutral","たい attaches to a verb stem; ほしい describes a desired thing. Avoid using ほしい directly after a dictionary-form verb.",`〜たいです|want to do|週末は映画を見たいです。|I want to watch a film at the weekend.|Attach to the ます-stem.
〜がほしいです|want a thing|新しい辞書がほしいです。|I want a new dictionary.|Use a noun before が.
〜たいんですが|I would like to...|予約したいんですが。|I would like to make a reservation.|Invites assistance or a response.
〜たくないです|do not want to do|今日は外に出たくないです。|I do not want to go out today.|たい changes like an い-adjective.`);
E("ja","A1-12","Neutral","Clock times usually take に; 今日, 明日 and 毎朝 normally do not. Do not automatically add に to every time expression.",`毎朝（まいあさ）|every morning|毎朝、散歩します。|I walk every morning.|Normally no に.
今夜（こんや）|tonight|今夜、友達に会います。|I will meet a friend tonight.|Relative time, normally no に.
午前中（ごぜんちゅう）|during the morning|午前中に買い物をします。|I will shop during the morning.|に can mark the period in this sentence.
週末（しゅうまつ）|the weekend|週末は家で休みます。|At weekends I rest at home.|は can make the weekend the topic.`);
E("ja","A2-9","Polite / conversational","ませんか invites someone and gives room to decline; ましょう more directly proposes a shared action.",`〜ましょう|let us do|少し休みましょう。|Let us rest a little.|Attach to the verb stem.
〜ませんか|would you like to...?|一緒に昼ご飯を食べませんか。|Would you like to have lunch together?|A polite invitation.
〜のはどうですか|how about doing...?|明日行くのはどうですか。|How about going tomorrow?|Nominalise an action with の.
〜たらどうですか|why not do...?|先生に聞いたらどうですか。|Why not ask the teacher?|Can sound like advice; tone matters.`);
E("ja","A2-10","Polite","大丈夫です may accept or decline depending on context and gesture. Add はい、お願いします or いいえ、結構です when clarity matters.",`はい、お願いします|yes, please|袋は必要ですか。はい、お願いします。|Do you need a bag? Yes, please.|Clearly accept an offered service.
もちろんです|of course|手伝ってもらえますか。もちろんです。|Could you help? Of course.|Willing acceptance.
いいえ、結構です|no, thank you|おかわりはいかがですか。いいえ、結構です。|Would you like more? No, thank you.|A polite refusal, sometimes quite firm.
すみません、今は難しいです|sorry, I cannot manage it now|すみません、今は難しいです。明日でもいいですか。|Sorry, I cannot now. Would tomorrow work?|State a limit and offer an alternative.`);
E("ja","A2-11","Neutral","全然 normally pairs with a negative in the beginner standard pattern; affirmative colloquial uses exist but are not the basic rule here.",`いつも|always; usually in context|いつも同じ店で買います。|I always buy it at the same shop.|High frequency.
ときどき|sometimes|ときどき自転車で通勤します。|I sometimes cycle to work.|Occasional activity.
あまり〜ない|not very often; not much|最近はあまりテレビを見ません。|Recently I do not watch much television.|Use a negative predicate.
週に二回|twice a week|週に二回泳ぎます。|I swim twice a week.|に marks the frequency period.`);
E("ja","A2-12","Polite / neutral","うまくいく describes success; 間に合う means be in time. A successful result and timely arrival are different claims.",`うまくいく|go well; work out|試験はうまくいきました。|The exam went well.|Past: うまくいった/いきました.
失敗する|fail; make a mistake|最初は失敗しましたが、もう一度やります。|I failed at first, but will try again.|A neutral verb for failure.
結局（けっきょく）|in the end|結局、電車で行きました。|In the end, we went by train.|Marks the final outcome.
〜ことになる|it is decided / turns out that|来週会うことになりました。|It was decided that we would meet next week.|Often an arrangement or resulting decision.`);
E("ja","B1-9","Neutral","つまり often summarises or draws a conclusion; 例えば introduces an example. They organise ideas differently.",`つまり|in other words; in short|締め切りは延長されません。つまり、今日中に必要です。|The deadline will not be extended; it is needed today.|Clarify the practical implication.
言い換えると|to put it another way|言い換えると、費用より時間が問題です。|In other words, time is the problem rather than cost.|A direct reformulation marker.
要するに|in short|要するに、もう少し準備が必要です。|In short, more preparation is needed.|Summarises the essential point; can sound blunt.
〜ということです|that means...|参加は任意ということです。|It means participation is optional.|Restate an interpretation or explanation.`);
E("ja","B1-10","Neutral","代わりに can mean replacement or compensation. Identify which relationship the context establishes.",`〜代わりに|instead of; in exchange for|外食する代わりに、家で作ります。|Instead of eating out, I will cook at home.|Dictionary verb + 代わりに.
〜ではなく|not..., but...|電話ではなく、メールで連絡します。|I will contact them by email rather than phone.|Explicitly replaces an option.
別の方法として|as another method|別の方法として、オンラインで申請できます。|Alternatively, you can apply online.|Introduces a practical alternative.
それとも|or, in a question|今日にしますか。それとも明日にしますか。|Shall we do it today or tomorrow?|Use to ask someone to choose.`);
E("ja","B1-11","Conversational / polite","手を貸す is figurative help. 手伝う focuses on assistance with a task; 助ける can also refer to rescue or help in difficulty.",`手を貸す|lend a hand|荷物を運ぶのに手を貸してください。|Please help carry the luggage.|Figurative practical assistance.
手伝いましょうか|shall I help?|片付けを手伝いましょうか。|Shall I help with the tidying?|Offer assistance.
お願いがある|have a favour to ask|ちょっとお願いがあるんですが。|I have a small favour to ask.|Introduce the request before stating it.
助かります|that would help; I appreciate it|明日までに送っていただけると助かります。|It would help if you could send it by tomorrow.|Express the benefit of the requested help.`);
E("ja","B1-12","Neutral / conversational","なるほど acknowledges understanding, not necessarily agreement. With a senior person, repeated なるほど can sound evaluative; 承知しました may suit acknowledging an instruction.",`なるほど|I see; that makes sense|なるほど、そういう仕組みなんですね。|I see, that is how it works.|Signals understanding.
そういうことだったんですね|so that was what it meant|予定が変わったんですね。そういうことだったんですね。|The plan changed; now I understand.|A new explanation resolves confusion.
納得する|be convinced; find an explanation acceptable|説明を聞いて納得しました。|The explanation convinced me.|Stronger acceptance than merely hearing.
気づく|notice; realise|後で日付の間違いに気づきました。|Later I noticed the date error.|Use に for the thing noticed.`);
E("ja","B2-7","Neutral / professional","検討する means consider, not promise to accept. A reply of 検討します leaves the decision open.",`比較検討する|compare and evaluate|複数の案を比較検討します。|We will compare and evaluate several proposals.|An evaluation before a decision.
〜を踏まえて|taking ... into account|費用を踏まえて判断します。|We will judge taking cost into account.|Connect evidence to a decision.
一方で|on the other hand; meanwhile|便利な一方で、費用がかかります。|It is convenient, but costs money.|Introduce a contrasting aspect.
優先順位をつける|set priorities|まず課題に優先順位をつけましょう。|First, let us prioritise the issues.|Rank competing needs.`);
E("ja","B2-8","Professional / neutral","実行に移す means begin carrying out a plan; 検討する means still considering it. Do not report one as the other.",`実行に移す|put into action|来月から計画を実行に移します。|We will put the plan into action next month.|Move beyond planning.
具体化する|make concrete|提案を具体化する必要があります。|We need to make the proposal concrete.|Add operational detail.
段階的に導入する|introduce in stages|新制度を段階的に導入します。|We will introduce the new system in stages.|Describe gradual implementation.
最後までやり遂げる|follow through to the end|担当した仕事を最後までやり遂げます。|I will finish the work I took on.|Emphasise completion.`);
E("ja","B2-9","Neutral / conversational","手に負えない means unmanageable, not that hands are physically unavailable. 手が足りない means there are too few people to do the work.",`手に負えない|beyond one's capacity|この量は一人では手に負えません。|This amount is beyond one person’s capacity.|A limit on manageability.
手が回らない|cannot attend to everything|細かい確認まで手が回りません。|I cannot get to all the detailed checks.|Time or resources are stretched.
手が足りない|not enough people to help|今日は店の手が足りません。|The shop is short-staffed today.|Staffing shortage.
抱え込みすぎる|take on or keep too much alone|一人で仕事を抱え込みすぎないでください。|Please do not shoulder too much work alone.|Often encourages sharing tasks.`);
E("ja","B2-10","Neutral / conversational","投げ出す can literally mean throw out, but with work it means abandon. 諦める describes giving up a goal or hope.",`投げ出さない|do not abandon midway|難しくても、途中で投げ出さないで。|Even if it is difficult, do not abandon it halfway.|Informal encouragement.
粘り強く取り組む|work persistently|課題に粘り強く取り組みます。|I will work persistently on the issue.|Suitable for professional descriptions.
立ち直る|recover from a setback|失敗から立ち直るには時間がかかりました。|It took time to recover from the failure.|Recovery rather than avoiding failure.
試行錯誤を重ねる|learn through repeated trial and error|試行錯誤を重ねて方法を改善しました。|We improved the method through trial and error.|Emphasises iterative learning.`);
E("ja","C1-7","Formal / academic","整合的 means consistent, not proved uniquely. 裏付ける offers support; 立証する makes a stronger evidential claim.",`〜と整合的だ|be consistent with|観測結果は予測と整合的です。|The observations are consistent with the prediction.|Does not exclude all alternatives.
〜を裏付ける|support; corroborate|追加調査がこの解釈を裏付けています。|The additional study supports this interpretation.|Specify the supporting evidence.
〜を排除できない|cannot rule out|別の要因の影響を排除できません。|We cannot rule out other factors.|Preserve a possible explanation.
断定するには不十分だ|insufficient to conclude decisively|この資料だけでは断定するには不十分です。|This material alone is insufficient for a firm conclusion.|Explicitly limits certainty.`);
E("ja","C1-8","Formal / professional","を条件として restricts approval. を前提として names an assumption, which is not always an enforceable condition.",`〜を条件として|on condition of|再審査を条件として承認します。|We approve on condition of a further review.|A stated requirement.
〜を前提として|on the premise of|予算が確保されることを前提として計画します。|We plan on the premise that funding will be secured.|Identify an assumption.
〜限りにおいて|insofar as; within the limit that|安全が保たれる限りにおいて実施します。|We will proceed insofar as safety is maintained.|Formal scope limitation.
ただし|provided, however; with this qualification|参加は自由です。ただし、事前登録が必要です。|Participation is open, but advance registration is required.|Add a limiting condition.`);
E("ja","C1-9","Understated / professional","改善の余地がある can signal dissatisfaction despite its mild wording. It does not automatically mean the work is already satisfactory.",`改善の余地がある|there is room for improvement|説明の明確さには改善の余地があります。|The clarity of the explanation needs improvement.|Name the dimension to improve.
十分とは言い難い|hard to call sufficient|現在の根拠は十分とは言い難いです。|The current evidence is hardly sufficient.|A restrained negative evaluation.
再検討が望まれる|reconsideration is desirable|実施時期については再検討が望まれます。|The timing should be reconsidered.|Impersonal formal recommendation.
やや楽観的だ|somewhat optimistic|この見積もりはやや楽観的です。|This estimate is somewhat optimistic.|Can tactfully suggest an unrealistic estimate.`);
E("ja","C1-10","Register contrast","口火を切る is an idiom, whereas 協議を開始する explicitly states an administrative action. Choose for the audience and document type.",`口火を切る|start a discussion or action|彼の質問が議論の口火を切りました。|His question started the discussion.|Narrative metaphor.
協議を開始する|begin formal discussions|両者は来週、協議を開始します。|The two parties will begin talks next week.|Formal and explicit.
話を切り出す|broach a topic|彼女は費用の話を切り出しました。|She broached the subject of cost.|Often a delicate topic.
下地を作る|lay the groundwork|事前の対話が合意の下地を作りました。|Prior dialogue laid the groundwork for agreement.|Preparation before the main outcome.`);
const support={en:{},pt:{},ja:{}};
function S(lang,key,data){support[lang][key]=rows(data).map(([term,meaning,example,translation])=>({term,meaning,phrase:term,example,translation}));}
S('en','A1-1',`I'm from|my place of origin|I'm from Toronto, but I live in Osaka.|Origin and current residence can differ.
I work as|my occupation|I work as a designer.|Use a/an before a singular countable job.
Nice to meet you|a first-meeting greeting|Nice to meet you. What do you do?|Greet and then invite the other person to speak.
I'm interested in|something I enjoy or want to learn about|I'm interested in photography.|Follow in with a noun or -ing form.`);
S('pt','A1-1',`sou de|I am from|Sou de Salvador, mas moro em São Paulo.|I am from Salvador, but live in São Paulo.
trabalho como|I work as|Trabalho como professor.|I work as a teacher.
prazer em conhecer você|nice to meet you|Prazer em conhecer você. Você mora aqui?|Nice to meet you. Do you live here?
tenho interesse em|I am interested in|Tenho interesse em fotografia.|I am interested in photography.`);
S('ja','A1-1',`〜から来ました|I come from|カナダから来ました。|I come from Canada.
〜に住んでいます|I live in|今は大阪に住んでいます。|I now live in Osaka.
よろしくお願いします|a conventional first-introduction closing|田中です。よろしくお願いします。|I am Tanaka. It is a pleasure to meet you.
趣味は〜です|my hobby is|趣味は写真です。|My hobby is photography.`);
S('en','A1-4',`I'd like|a polite order|I'd like a tea and a sandwich.|State the item politely.
for here or to go?|eat here or take away?|Is that for here or to go?|The question concerns where it will be consumed.
anything else?|any additional items?|Anything else? No, that's all, thanks.|The server asks whether the order is complete.
how much is that?|ask for the total|How much is that altogether?|Ask for the combined price.`);
S('pt','A1-4',`queria|I would like|Queria um café e um sanduíche.|I would like a coffee and a sandwich.
para viagem|to take away|É para viagem, por favor.|It is to take away, please.
mais alguma coisa?|anything else?|Mais alguma coisa? Só isso, obrigado.|Anything else? Just that, thank you.
quanto fica?|what is the total?|Quanto fica tudo?|How much is everything?`);
S('ja','A1-4',`〜をください|please give me...|お茶を一杯ください。|One cup of tea, please.
持ち帰り（もちかえり）|takeaway|持ち帰りでお願いします。|To take away, please.
以上です|that is all|コーヒーを二つ。以上です。|Two coffees. That is all.
全部でいくらですか|what is the total?|全部でいくらですか。|How much is everything?`);
S('en','A2-2',`Are you free...?|ask about availability|Are you free on Saturday afternoon?|Check before proposing a plan.
Would six work for you?|ask whether a time suits someone|Would six work for you, or is that too early?|Offer room for an alternative.
outside the entrance|a precise meeting point|Let's meet outside the main entrance.|Specify which entrance.
Shall we make it...?|propose or revise a time|Shall we make it half past six instead?|Suggest a change.`);
S('pt','A2-2',`você está livre...?|are you free...?|Você está livre no sábado à tarde?|Are you free on Saturday afternoon?
pode ser às seis?|would six work?|Pode ser às seis, ou é muito cedo?|Would six work, or is that too early?
na entrada principal|at the main entrance|Vamos nos encontrar na entrada principal.|Let us meet at the main entrance.
que tal mudar para...?|how about changing to...?|Que tal mudar para domingo?|How about changing it to Sunday?`);
S('ja','A2-2',`〜は空いていますか|are you free...?|土曜日の午後は空いていますか。|Are you free on Saturday afternoon?
〜時でどうですか|how about ... o'clock?|六時でどうですか。|How about six o'clock?
正面入口（しょうめんいりぐち）|main entrance|正面入口で会いましょう。|Let us meet at the main entrance.
〜にしませんか|shall we choose...?|日曜日にしませんか。|Shall we make it Sunday?`);
S('en','A2-3',`BUS stop|a place where buses stop|I'll wait at the bus stop.|The first word normally carries the main stress.
TRAIN station|a railway station|The train station is nearby.|Practise the first stressed syllable without deleting the second word.
TOOTHbrush|a brush for teeth|I packed my toothbrush.|Notice the compound's stress.
BLACKbird / black BIRD|a species / a bird that is black|A blackbird is a kind of bird.|Stress helps distinguish a compound from a descriptive phrase; context also matters.`);
S('pt','A2-3',`pão|bread; nasal vowel|Quero pão fresco.|I want fresh bread.
irmã|sister; nasal ending|Minha irmã mora aqui.|My sister lives here.
bom|good; nasal vowel|O café está bom.|The coffee is good.
mão|hand; nasal diphthong|Lave as mãos antes de comer.|Wash your hands before eating.`);
S('ja','A2-3',`おばさん / おばあさん|aunt or middle-aged woman / grandmother or elderly woman|おばあさんに電話しました。|I called my grandmother.
おじさん / おじいさん|uncle or middle-aged man / grandfather or elderly man|おじいさんは元気です。|My grandfather is well.
ここ / 高校（こうこう）|here / high school|高校はここから近いです。|The high school is near here.
雪（ゆき）/ 勇気（ゆうき）|snow / courage|勇気を出して話しました。|I gathered my courage and spoke.`);
S('en','A2-4',`go past|continue beyond a landmark|Go past the pharmacy.|Do not stop at the pharmacy.
take the second left|turn at the second left-hand street|Take the second left after the bridge.|Count the turns after the landmark.
at the end of|at the final point|Turn right at the end of the road.|The endpoint is the reference.
on your right|to your right side|The museum will be on your right.|The destination's side is specified.`);
S('pt','A2-4',`siga em frente|go straight ahead|Siga em frente até a praça.|Go straight to the square.
passe pela|go past|Passe pela farmácia.|Go past the pharmacy.
vire à esquerda|turn left|Vire à esquerda na segunda rua.|Turn left at the second street.
do lado direito|on the right side|O museu fica do lado direito.|The museum is on the right.`);
S('ja','A2-4',`まっすぐ|straight ahead|ここからまっすぐ進んでください。|Go straight from here.
〜を過ぎて|go past...|銀行を過ぎて、左に曲がります。|Go past the bank and turn left.
二つ目の角|the second corner|二つ目の角を右に曲がってください。|Turn right at the second corner.
右側（みぎがわ）|the right side|図書館は右側にあります。|The library is on the right.`);
S('en','B1-3',`however|introduces a contrast|The route is longer. However, it is safer.|The second fact contrasts with the first.
therefore|introduces a consequence|The bridge is closed. Therefore, we need another route.|The closure causes the change.
because of|introduces a cause as a noun phrase|The game was delayed because of rain.|Use a noun phrase after of.
despite|introduces a concessive noun phrase|Despite the delay, everyone stayed.|The result contrasts with an expectation.`);
S('pt','B1-3',`no entanto|however|O trajeto é longo. No entanto, é seguro.|The route is long, but safe.
portanto|therefore|A ponte está fechada; portanto, precisamos de outra rota.|The bridge is closed, so we need another route.
por causa de|because of|O jogo foi adiado por causa da chuva.|The game was postponed because of rain.
apesar de|despite|Apesar do atraso, todos ficaram.|Despite the delay, everyone stayed.`);
S('ja','B1-3',`しかし|however|道は長いです。しかし、安全です。|The route is long, but safe.
そのため|therefore; for that reason|橋が閉鎖されています。そのため、別の道を使います。|The bridge is closed, so we will use another road.
〜ので|because; since|雨が降っているので、家にいます。|Because it is raining, I will stay home.
それでも|even so|道は遠いです。それでも、歩きたいです。|The route is long. Even so, I want to walk.`);
S('en','B1-4',`Could you confirm...?|request verification|Could you confirm whether breakfast is included?|Request a specific answer.
I would be grateful if...|soften a request|I would be grateful if you could reply by Friday.|Set a polite requested deadline.
regarding|concerning|I'm writing regarding my booking.|Identify the topic.
Please let me know|request information|Please let me know if you need further details.|Invite a reply.`);
S('pt','B1-4',`poderia confirmar...?|could you confirm...?|Poderia confirmar se o café da manhã está incluído?|Could you confirm whether breakfast is included?
agradeceria se|I would be grateful if|Agradeceria se pudesse responder até sexta-feira.|I would be grateful if you could reply by Friday.
a respeito de|regarding|Escrevo a respeito da minha reserva.|I am writing regarding my reservation.
por favor, avise|please let me know|Por favor, avise se precisar de mais informações.|Please let me know if you need more information.`);
S('ja','B1-4',`確認していただけますか|could you confirm?|朝食が含まれるか確認していただけますか。|Could you confirm whether breakfast is included?
〜について|regarding...|予約についてご連絡します。|I am contacting you regarding the reservation.
〜までに|by a deadline|金曜日までにお返事をいただけますか。|Could I receive a reply by Friday?
お知らせください|please let me know|必要な書類をお知らせください。|Please let me know which documents are required.`);
S('en','B2-1',`rather than|instead of the earlier alternative|Board at gate twelve rather than gate seven.|Twelve supersedes seven.
until further notice|until another update is issued|The entrance is closed until further notice.|No fixed reopening time is given.
rescheduled to|moved to another time|The departure has been rescheduled to 18:40.|The new time is 18:40.
please disregard|ignore the earlier information|Please disregard the previous announcement.|The earlier instruction is superseded.`);
S('pt','B2-1',`em vez de|rather than|O embarque será no portão doze em vez do sete.|Boarding will be at gate twelve rather than seven.
até novo aviso|until further notice|A entrada está fechada até novo aviso.|The entrance is closed until further notice.
remarcado para|rescheduled to|O voo foi remarcado para as dezoito horas.|The flight was rescheduled to six p.m.
desconsidere|disregard|Desconsidere o aviso anterior.|Disregard the earlier notice.`);
S('ja','B2-1',`〜ではなく|not..., but...|七番ではなく、十二番ゲートです。|It is gate twelve, not seven.
当面の間（とうめんのあいだ）|for the time being|入口は当面の間、閉鎖します。|The entrance is closed for the time being.
〜に変更する|change to...|出発時刻を十八時に変更します。|The departure time changes to six p.m.
先ほどの案内|the earlier announcement|先ほどの案内は訂正します。|We are correcting the earlier announcement.`);
S('en','B2-2',`although|concedes a contrasting point|Although expensive, the trial is worthwhile.|Cost does not cancel support.
worth considering|deserving consideration|The alternative is worth considering.|It merits evaluation, not automatic acceptance.
with reservations|with some concerns|I support the plan, with reservations about staffing.|Support includes a limit.
on balance|after weighing different factors|On balance, I favour a short trial.|Overall support follows comparison.`);
S('pt','B2-2',`embora|although|Embora seja caro, o teste é útil.|Although it is expensive, the test is useful.
valer a pena|be worthwhile|Vale a pena considerar a alternativa.|The alternative is worth considering.
com ressalvas|with reservations|Apoio a proposta, mas com ressalvas.|I support the proposal with reservations.
no conjunto|overall|No conjunto, os benefícios são maiores.|Overall, the benefits are greater.`);
S('ja','B2-2',`〜とはいえ|although; granted that|費用が高いとはいえ、必要です。|Although the cost is high, it is necessary.
検討する価値がある|be worth considering|別の案も検討する価値があります。|The alternative is also worth considering.
条件付きで|conditionally|条件付きで賛成します。|I support it conditionally.
総合的に見ると|viewed overall|総合的に見ると、試行が妥当です。|Overall, a trial is reasonable.`);
S('en','B2-4',`provided that|on condition that|Extend the trial provided that costs are reviewed.|A cost review is required.
as long as|while a condition holds|I agree as long as access remains free.|Support depends on free access.
only if|states a necessary condition|Proceed only if the safety checks pass.|Passing the checks is necessary.
unless|except if; if not|Do not expand unless the results improve.|Improvement is needed before expansion.`);
S('pt','B2-4',`desde que|provided that|Podemos ampliar, desde que haja avaliação.|We can expand provided there is evaluation.
contanto que|as long as|Concordo, contanto que o acesso seja gratuito.|I agree as long as access is free.
somente se|only if|Avance somente se os testes forem aprovados.|Proceed only if the tests pass.
a menos que|unless|Não amplie, a menos que os resultados melhorem.|Do not expand unless results improve.`);
S('ja','B2-4',`〜限り|as long as|安全が保たれる限り、続けます。|We will continue as long as safety is maintained.
〜場合に限り|only in the case that|審査に通った場合に限り、参加できます。|Participation is allowed only if the review is passed.
〜を条件に|on condition of...|毎月の報告を条件に承認します。|We approve on condition of monthly reports.
〜なければ|if not; unless|改善しなければ、拡大しません。|Unless it improves, we will not expand.`);
S('en','C1-1',`I would appreciate it if|a considerate formal request|I would appreciate it if you could clarify clause three.|The request specifies the unclear clause.
if feasible|if practicable|If feasible, please respond by Wednesday.|Leave room for practical constraints.
for the avoidance of doubt|to remove possible ambiguity|For the avoidance of doubt, does the fee include transport?|Make the uncertainty explicit.
please advise whether|please state whether|Please advise whether a revised schedule is available.|Formal request for information.`);
S('pt','C1-1',`agradeceria se|I would appreciate it if|Agradeceria se esclarecesse a terceira cláusula.|I would appreciate clarification of clause three.
se for viável|if feasible|Se for viável, solicito resposta até quarta-feira.|If feasible, I request a reply by Wednesday.
a fim de evitar dúvidas|to avoid ambiguity|A fim de evitar dúvidas, a taxa inclui transporte?|To avoid ambiguity, does the fee include transport?
solicito esclarecimentos|I request clarification|Solicito esclarecimentos sobre o cronograma.|I request clarification of the schedule.`);
S('ja','C1-1',`差し支えなければ|if it would not cause difficulty|差し支えなければ、経緯をお聞かせください。|If possible, please explain the circumstances.
可能な範囲で|to the extent feasible|可能な範囲で、資料をご共有ください。|Please share the material to the extent feasible.
念のため確認ですが|to confirm for clarity|念のため確認ですが、交通費は含まれますか。|To confirm, are travel costs included?
ご教示いただけますか|could you inform me?|必要な手続きをご教示いただけますか。|Could you inform me of the required procedure?`);
S('en','C1-2',`promising, albeit preliminary|encouraging but not yet established|The findings are promising, albeit preliminary.|The support is provisional.
not without merit|has some value|The proposal is not without merit.|Restrained acknowledgment, not full endorsement.
may warrant revision|may need reconsideration|The timetable may warrant revision.|A tactful concern about feasibility.
to an extent|partly; within limits|The evidence supports the claim to an extent.|The support is limited.`);
S('pt','C1-2',`promissor, embora preliminar|promising but preliminary|O resultado é promissor, embora preliminar.|The result is promising but preliminary.
não desprovido de mérito|not without merit|O argumento não é desprovido de mérito.|The argument has some merit.
pode exigir revisão|may need revision|O cronograma pode exigir revisão.|The schedule may need revision.
em certa medida|to an extent|Os dados sustentam a tese em certa medida.|The data support the thesis to an extent.`);
S('ja','C1-2',`一定の評価はできる|can be valued to a degree|提案には一定の評価はできます。|The proposal has value to a degree.
一概には言えない|cannot make a blanket judgment|最善だとは一概には言えません。|It cannot uniformly be called the best.
再考の余地がある|there is room for reconsideration|日程には再考の余地があります。|The schedule may need reconsideration.
限定的ながら|although limited|限定的ながら、有効性は認められます。|Some effectiveness is recognised, though limited.`);
S('en','C1-4',`taken together|considered jointly|Taken together, the findings support a limited extension.|Synthesise the evidence.
outweigh|be more significant than|The benefits appear to outweigh the costs.|Compare importance rather than physical weight.
with the caveat that|with this limitation|We recommend continuation, with the caveat that staffing must improve.|Preserve a condition.
further evidence is needed|the conclusion remains incomplete|Further evidence is needed on long-term effects.|Identify an unresolved scope.`);
S('pt','C1-4',`em síntese|in summary|Em síntese, recomendamos uma extensão limitada.|In summary, we recommend a limited extension.
superar|outweigh in context|Os benefícios parecem superar os custos.|The benefits appear to outweigh the costs.
com a ressalva de que|with the caveat that|Recomendamos continuar, com a ressalva de que falta pessoal.|We recommend continuing, with the caveat of insufficient staff.
são necessários mais dados|more evidence is needed|São necessários mais dados sobre efeitos duradouros.|More data on lasting effects are needed.`);
S('ja','C1-4',`以上を総合すると|considering the above together|以上を総合すると、限定的な延長が妥当です。|Taken together, a limited extension is reasonable.
〜を上回る|outweigh; exceed|便益が費用を上回ると考えられます。|Benefits appear to outweigh costs.
ただし〜が課題として残る|however, ... remains an issue|ただし、人員不足が課題として残ります。|However, understaffing remains an issue.
追加検証が必要だ|further evaluation is needed|長期的な効果には追加検証が必要です。|Long-term effects need further evaluation.`);
export function deepenLesson(lesson,row,index){
 const key=lesson.level+'-'+(index+1),lang=lesson.language;
 if(lesson.skill==='Grammar'){
  const detail=grammar[lang][key];if(!detail)throw Error('Missing grammar reference '+lesson.id);
  lesson.breakdown=detail;
 }else if(lesson.skill==='Vocabulary'){
  lesson.vocabulary=vocabulary[lang][key];if(!lesson.vocabulary)throw Error('Missing vocabulary '+lesson.id);
 }else if(lesson.skill==='Expressions'){
  lesson.expressions=expressions[lang][key];if(!lesson.expressions)throw Error('Missing expressions '+lesson.id);
  lesson.priority='Practise these related expressions together, then choose the one that fits the situation and level of formality.';
 }else{
  const words=support[lang][key];if(!words)throw Error('Missing communication toolkit '+lesson.id);
  lesson.vocabulary=words;
  const strategies={Speaking:['Build a response with an opening, the required details and a question for the listener.','Use the toolkit to vary your wording; keep your own names, places and reasons.','Record once, listen for missing information, then record a clearer version.'],Writing:['Identify your reader, purpose and the response you need before writing.','Organise the message into context, the main request or claim, and a clear next step.','Check the wording for register and the evidence for any claim; revise a sentence that is ambiguous.'],Reading:['Identify the main claim before examining details and connective expressions.','Underline words that signal contrast, condition or limits on a claim.','Paraphrase the conclusion without strengthening it beyond what the text supports.'],Listening:['Listen once for the situation and the speaker’s main purpose.','Listen again for quantities, corrections, conditions and the final confirmed detail.','Use the toolkit to recognise paraphrases rather than expecting the exact wording of an answer.'],Pronunciation:['Listen to each example and isolate the sound or stress contrast.','Repeat the phrase at a natural pace while preserving the contrast rather than just increasing volume.','Record and replay; compare the target sound and rhythm in the whole sentence.']};
  lesson.breakdown={steps:[row.rule,...strategies[lesson.skill]],tables:[],pitfall:{Speaking:'A correct memorised sentence is only a starting point. Change the details and answer the listener’s follow-up.',Writing:'Do not copy a model that leaves out your actual request or exaggerates the evidence. Keep the recipient and purpose clear.',Reading:'Do not treat a reservation as total rejection, or a conditional proposal as unconditional support.',Listening:'A word that occurs in the recording may belong to an option that the speaker rejects or corrects. Follow the whole message.',Pronunciation:lang==='ja'?'Preserve the extra mora in a long vowel; merely speaking louder does not make a vowel long.':lang==='pt'?'A nasal vowel is not simply an oral vowel followed by an extra n. Listen to resonance and the whole syllable.':'Prominence is relative. Do not stress every word equally or omit unstressed syllables.'}[lesson.skill],examples:words.slice(0,3).map(w=>[w.example,w.translation])};
 }
 lesson.minutes=Math.max(lesson.minutes||6,lesson.skill==='Grammar'?12:10);
 return lesson;
}
