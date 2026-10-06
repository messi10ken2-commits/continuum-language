// Additional authored applications. Correct answers are explicit; prompts state
// the intended meaning or register so legitimate alternative readings are avoided.
export const grammarPractice={};
function Q(id,data){grammarPractice[id]=data.trim().split('\n').map(row=>{const [prompt,answer,note,...accepted]=row.split('|');return {type:'text',mode:'application',prompt,answer,accepted:[answer,...accepted],note};});}
Q('en-a1-v2-lesson-2',`Correct only the verb: My neighbours is friendly.|are|A plural subject takes are.
Complete the job description: Maya is ____ engineer.|an|Use an before the vowel sound in engineer.
Make this negative: I am late. Write the full sentence.|I am not late.|Add not after am.|I'm not late.
Ask a yes/no question: The windows are open.|Are the windows open?|Move are before the subject.
Complete the short answer: Are you ready? Yes, I ____.|am|The short answer agrees with I.`);
Q('en-a1-v2-lesson-3',`Complete with study: Leo ____ every evening.|studies|Consonant + y changes to -ies.
Complete with watch: My aunt ____ the news at six.|watches|Add -es after -ch.
Correct the verb: She haves a bicycle.|has|Have has the irregular third-person form has.
Place often correctly. Rebuild: My father / is / busy. Add often.|My father is often busy.|Frequency adverbs normally follow be.
Complete with play: The children ____ outside after school.|play|A plural subject takes the base form.`);
Q('en-a1-v2-lesson-5',`Complete the question: ____ your sister work here?|Does|Use does with a third-person singular subject.
Correct only the main verb: Does Amir drives to work?|drive|Does carries the person ending; the main verb is base form.
Ask about the place: She lives in Leeds. Begin Where.|Where does she live?|Put where before does and the subject.
Ask who performs the action: Someone teaches French here. Begin Who.|Who teaches French here?|A subject question normally does not use do.
Complete: Do they know? No, they ____.|do not|Repeat the auxiliary in a short answer.|don't`);
Q('en-a1-v2-lesson-6',`Complete: Omar ____ not eat meat.|does|Does agrees with a singular subject.
Correct only the main verb: She doesn't needs help.|need|After does not use the base verb.
Make negative: We are hungry.|We are not hungry.|Be takes not directly, without do.|We aren't hungry.
Remove the unnecessary negative: I don't never drink tea.|I never drink tea.|Never already expresses a negative frequency.
Make negative without a contraction: They work on Sundays.|They do not work on Sundays.|Use do not with they.`);
Q('en-a2-v2-lesson-1',`Complete with stop in the past: The taxi ____ outside.|stopped|Double the final consonant before -ed in stopped.
Complete with go: Yesterday we ____ to the coast.|went|Go has an irregular past form.
Correct only the verb: Last night she buyed a coat.|bought|Buy → bought, not buyed.
Write the past of try.|tried|Consonant + y becomes -ied.
Which ending sound does needed have? Write /t/, /d/ or /ɪd/.|/ɪd/|After /d/, -ed adds a syllable.|ɪd`);
Q('en-a2-v2-lesson-5',`Correct only the verb: Did your cousin took the train?|take|Did already marks past time; take stays in the base form.
Ask a yes/no question: They were outside.|Were they outside?|Invert were; do not add did.
Ask who did it: Someone broke the glass.|Who broke the glass?|Who is the subject, so no did is needed.
Ask about the object: Nina called someone. Begin Who did.|Who did Nina call?|Here Nina is the subject and who is the object.
Complete: Did you finish? No, I ____.|did not|Use did not in a negative past short answer.|didn't`);
Q('en-a2-v2-lesson-6',`Complete with read in the past continuous: At nine, I ____ a novel.|was reading|Was + -ing describes an action in progress.
Complete with ring in the past simple: I was resting when the phone ____.|rang|The short interrupting event takes past simple.
Correct only the auxiliary: They was waiting outside.|were|They takes were.
Make a past-continuous question from: You were sleeping.|Were you sleeping?|Move were before the subject.
Complete with cook: While I was washing dishes, he ____ dinner.|was cooking|Two simultaneous ongoing actions can both use the continuous.`);
Q('en-b1-v2-lesson-1',`Complete the purpose: I rang the clinic ____ book an appointment.|to|To + base verb gives the purpose of your action.
Complete the function: These gloves are for ____ glass. Use handle.|handling|For + -ing describes function.
Complete the negative purpose: We whispered in order ____ wake the baby.|not to|Use in order not to for avoiding an outcome.
Complete: I wrote it down so ____ you could remember it.|that|So that introduces a clause with its own subject.
Correct the purpose phrase: I went there for meet the director. Write only the correction.|to meet|An action's purpose is to + verb here, not for + base verb.`);
Q('en-b1-v2-lesson-2',`Correct only the main verb: He might arrives later.|arrive|A modal is followed by a base verb.
Use might to express uncertainty: Perhaps the key is upstairs.|The key might be upstairs.|Might presents a possibility, not a fact.
Complete with must or might: Her passport proves she is 30, so she ____ be over 18.|must|The evidence supports a strong inference.
Complete with can't: That ____ be our bus; its number is different.|can't|Can't rejects an inference based on contrary evidence.|cannot
Complete with may: Perhaps he does not know the address. He ____ not know the address.|may|May not means possibly not; it does not mean impossible.`);
Q('en-b1-v2-lesson-5',`Complete with write in the present perfect: I ____ three pages so far.|have written|Use have + past participle for a result up to now.
Choose the past form of see for a finished time: I ____ him yesterday.|saw|Yesterday requires the finished-past form here.
Complete: She has worked here ____ 2020.|since|Since introduces a starting point.
Complete: We have waited ____ two hours.|for|For introduces a duration.
Complete with been or gone: Jo is back from Seoul. She has ____ there twice.|been|Been describes a visit and return; gone often indicates absence.`);
Q('en-b1-v2-lesson-6',`Complete with leave: When we reached the platform, the train ____ already ____. Write the two missing words.|had left|Past perfect places the departure before the past arrival.
Correct only the participle: She had wrote the letter before lunch.|written|Had is followed by the past participle.
Make negative: I had met him before.|I had not met him before.|Insert not after had.|I hadn't met him before.
Ask a question: They had eaten before the meeting.|Had they eaten before the meeting?|Invert had and the subject.
Complete with lose: I could not get inside because I ____ my key.|had lost|Losing the key precedes being unable to enter.`);
Q('en-b1-v2-lesson-7',`The phone starts ringing. Complete the immediate offer with will: I ____ answer it.|will|Will is natural for a decision made now.
Complete with arrive: I will text you when I ____.|arrive|Use present, not will, in this future time clause.
Use the present continuous for an arrangement: We / meet / Eva / tomorrow.|We are meeting Eva tomorrow.|Present continuous can describe a confirmed arrangement.
Correct only the auxiliary: He are going to study law.|is|Going to still requires be to agree with the subject.
Complete with going to: Look at that cracked branch! It is ____ fall.|going to|Present evidence supports this prediction.`);
Q('en-b1-v2-lesson-8',`Complete: If I knew the answer, I ____ tell you. Use would.|would|An imagined present condition takes would + base verb in the result.
Complete with have: If we ____ more space, we would grow vegetables.|had|Past form marks a remote present possibility here.
Correct the result: If she lived closer, she would visits us. Write only the verb.|visit|Would takes the base form.
Complete the conventional advice: If I ____ you, I would ask first.|were|Were is the conventional form in If I were you.
Use could for imagined ability: If I had a boat, I ____ cross the lake.|could|Could describes possible ability under the imagined condition.`);
Q('en-b2-v2-lesson-3',`Complete the open condition: If sales improve, we ____ hire another person. Use will.|will|An open future condition takes present + will.
Complete the remote condition with be: If tickets ____ cheaper, we would go.|were|Were marks a remote imagined situation.|were to be
Correct only the condition verb: If I would know, I would tell you.|knew|Do not normally use would in this condition clause.
Complete with could: If they gave us permission, we ____ enter.|could|Could expresses ability or permission under a condition.
Complete with might: If the dates changed, I ____ attend, but I am not sure.|might|Might keeps the result tentative.`);
Q('en-b2-v2-lesson-5',`Complete with write in the continuous perfect: I ____ emails all morning and am still working.|have been writing|The continuous highlights the ongoing process.
Complete with finish in the simple perfect: I ____ all five reports.|have finished|A completed quantity favours the simple perfect.
Correct the verb phrase: I have been knowing her for years.|have known|Know is normally stative here.
Complete with since or for: He has been waiting ____ noon.|since|Noon is a starting point.
Complete with read in the simple perfect: She ____ the entire document, so she can summarise it now.|has read|The focus is the completed result.`);
Q('en-b2-v2-lesson-6',`Complete the result with arrive: If we had taken the earlier bus, we ____ on time. Use would.|would have arrived|Past counterfactual results use would have + participle.
Correct only the participle: If I had knew, I would have stayed.|known|Had requires known, not knew.
Complete the mixed conditional: If I had kept the receipt, I ____ return this now. Use could.|could|The condition is past, but the possible result is present.
Complete with ask: If she ____ us, we might have agreed.|had asked|An unreal past condition takes past perfect.
Complete with have: I could ____ helped if you had called.|have|Could have + participle refers to unrealised past ability.`);
Q('en-c1-v2-lesson-3',`Limit a causal claim: The policy ____ have contributed to the change. Use may.|may|May qualifies the possible causal contribution.
Complete the association phrase: The measure is associated ____ better outcomes.|with|Association does not by itself establish causation.
Complete the qualification: These results do not ____ establish causation.|necessarily|Not necessarily denies certainty without denying possibility.
Complete the phrase that excludes an explanation: This evidence rules ____ a timing error.|out|Rule out requires evidence strong enough to exclude an explanation.
Replace proves with the more cautious verb suggests: This pattern proves a possible link. Write the whole sentence.|This pattern suggests a possible link.|Suggests signals evidence compatible with a link, not definitive proof.`);
Q('en-c1-v2-lesson-5',`Complete with must: Her coat is wet; she ____ have been outside in the rain.|must|Must have expresses a strong inference about the past.
Complete the participle: He might have ____ the email. Use forget.|forgotten|Modal + have requires a past participle.
Complete with can't: She ____ have sent the file yesterday; the computer was disconnected.|can't|Can't have marks an inference of impossibility.|cannot
Complete with should: The package ____ have arrived by now; that was the expected date.|should|Should have can express expectation, not just criticism.
Correct the form: They must had left early. Write the corrected verb phrase.|must have left|After a modal use have, not had.`);
Q('en-c1-v2-lesson-6',`Express past regret with wish: I did not check the address. Begin I wish.|I wish I had checked the address.|Wish + past perfect expresses regret about a completed past situation.
Complete the present wish: I wish I ____ more patient. Use were.|were|Past form refers to an unreal present state.
Complete a desired change: I wish the neighbours ____ turn the music down.|would|Wish + would can request a change in others' behaviour.
Complete with save: If only I ____ the document before the crash.|had saved|If only + past perfect adds emphasis to past regret.
Correct only the form after should: I should have took notes.|taken|Should have takes the past participle taken.`);
Q('pt-a1-v2-lesson-2',`Complete identity: Eu ____ médica.|sou|Use ser for identity; eu takes sou.
Complete location: As chaves ____ na gaveta.|estão|Use estar for the location of objects; plural chaves takes estão.
Correct the adjective only: As salas estão limpo.|limpas|The adjective agrees with feminine plural salas.
Complete an event location: A reunião ____ no auditório.|é|Event locations use ser, unlike the location of an object.`);
Q('pt-a1-v2-lesson-3',`Complete with trabalhar: Nós ____ aos sábados.|trabalhamos|Nós takes -amos in a regular -ar present verb.
Complete with comer: Você ____ aqui todos os dias?|come|Você takes third-person singular agreement.
Complete with abrir: Elas ____ a loja às nove.|abrem|Regular -ir verbs take -em with elas.
Correct only the verb: Eu trabalha em casa.|trabalho|Eu takes the -o form in the present.`);
Q('pt-a1-v2-lesson-5',`Complete with ter: Eu ____ duas irmãs.|tenho|Ter is irregular: eu tenho.
Complete with ir: Nós ____ ao cinema hoje.|vamos|Ir has an irregular present paradigm.
Complete with querer: Eles ____ descansar.|querem|Eles takes querem.
Correct only the verb: Você tenho tempo?|tem|Você takes tem, not tenho.`);
Q('pt-a1-v2-lesson-6',`Make negative: Ela trabalha aqui.|Ela não trabalha aqui.|Place não before the conjugated verb.
Make negative: Nós estamos prontos.|Nós não estamos prontos.|Não also precedes estar.
Complete: Eu ____ sei a resposta. Use não.|não|Negation precedes the verb.
Correct the verb only: Ele não gostam de café.|gosta|Negation does not change subject–verb agreement.`);
Q('pt-a2-v2-lesson-1',`Complete with visitar in the completed past: Ontem eu ____ minha tia.|visitei|Regular -ar eu in the pretérito perfeito ends in -ei.
Complete with comer: Ontem nós ____ cedo.|comemos|Nós comemos can be present or past; ontem fixes the past context.
Complete with ir: No domingo passado, eles ____ à praia.|foram|Ir has the irregular past form foram.
Correct the verb only: Ontem eu fazi um bolo.|fiz|Fazer → eu fiz in the completed past.`);
Q('pt-a2-v2-lesson-5',`Complete with falar: Ontem ela ____ com o gerente.|falou|The singular -ar perfect ending is -ou.
Complete with vender: Na semana passada eu ____ meu carro.|vendi|The eu perfect ending for -er is -i.
Complete with ter: Ontem nós ____ um problema.|tivemos|Ter has the irregular stem tiv-.
Complete with ser: A viagem de ontem ____ tranquila.|foi|Foi can come from ser or ir; the adjective here selects ser.`);
Q('pt-a2-v2-lesson-6',`Complete a childhood habit with brincar: Quando criança, eu ____ no quintal.|brincava|The imperfect presents a repeated past habit.
Complete the background with chover: Quando saí, ____.|chovia|The imperfect supplies the background state.
Complete with ser in the imperfect: Antes, as ruas ____ mais calmas.|eram|Ser has an irregular imperfect form.
Complete the interrupting event with tocar: Eu estudava quando o telefone ____.|tocou|The completed event contrasts with the ongoing background.`);
Q('pt-b1-v2-lesson-1',`Complete purpose: Saí cedo ____ evitar o trânsito.|para|Para + infinitive expresses purpose with the same subject.
Complete with poder: Falei devagar para que todos ____ entender.|pudessem|A past purpose clause uses the imperfect subjunctive here.
Complete the negative purpose: Anotei o endereço para ____ esquecer.|não|Place não before the infinitive.
Correct the verb only: Trouxe uma cadeira para você senta.|sentar|After para você, the infinitive is sentar here.`);
Q('pt-b1-v2-lesson-2',`Complete with chover: Talvez ____ amanhã.|chova|Talvez before the verb commonly takes the subjunctive.
Complete with estar: É possível que ela ____ em casa.|esteja|The possibility frame takes the subjunctive.
Complete with ser: Pode ____ uma boa ideia.|ser|Poder is followed by the infinitive.
Correct the verb only: Talvez ele vem mais tarde.|venha|Talvez venha marks uncertainty.`);
Q('pt-b1-v2-lesson-5',`Complete with estudar for repeated recent activity: Eu ____ bastante ultimamente. Use ter + participle.|tenho estudado|Brazilian Portuguese compound perfect often describes repeated or continuing recent activity.
Complete with fazer: Ela tem ____ exercícios todos os dias.|feito|Fazer has the participle feito.
Correct the participle only: Elas têm estudadas muito.|estudado|With ter, the participle does not agree with the subject.
Complete a single finished event with chegar: Ontem eu ____ às dez.|cheguei|A single completed event at a finished time normally uses the simple perfect.`);
Q('pt-b1-v2-lesson-6',`Complete with sair: Quando chegamos, eles já ____. Use ter + participle.|tinham saído|The compound pluperfect places departure before another past event.
Complete the participle: Eu tinha ____ o relatório. Use escrever.|escrito|Escrever has the irregular participle escrito.
Make negative: Ela tinha recebido a carta.|Ela não tinha recebido a carta.|Não precedes the auxiliary.
Correct the auxiliary only: Nós tinha reservado a sala.|tínhamos|The auxiliary agrees with nós.`);
Q('pt-b1-v2-lesson-7',`Complete with fazer in the future simple: Amanhã eu ____ a inscrição.|farei|Fazer uses the future stem far-.
Complete with ter in the future simple: Nós ____ tempo amanhã.|teremos|Ter uses the future stem ter- with -emos.
Express the plan using ir + infinitive: Eu / estudar / amanhã.|Eu vou estudar amanhã.|Ir is conjugated and the main verb stays infinitive.
Complete with chegar: Aviso quando eu ____ amanhã.|chegar|Future reference after quando uses the future subjunctive here.`);
Q('pt-b1-v2-lesson-8',`Complete with comprar: Se eu tivesse dinheiro, ____ um piano.|compraria|The hypothetical result uses the conditional.
Complete a polite request with poder: Você ____ me ajudar?|poderia|Poderia softens the request.
Complete with ter: Nós ____ mais tempo se morássemos perto.|teríamos|Teríamos agrees with nós and expresses a hypothetical result.
Correct the result only: Se eu soubesse, eu direi. Use the conditional of dizer.|diria|Dizer has the irregular conditional stem dir-.`);
Q('pt-b2-v2-lesson-3',`Complete with ser: Se eu ____ você, esperaria.|fosse|An unreal present condition takes the imperfect subjunctive.
Complete with saber: Se ela ____ a resposta, diria.|soubesse|Saber has the imperfect-subjunctive form soubesse.
Complete with ter for an open future: Se eu ____ tempo amanhã, ajudarei.|tiver|An open future condition uses the future subjunctive.
Correct the condition only: Se eu teria dinheiro, compraria. Use ter.|tivesse|Use tivesse in the hypothetical condition, not teria.`);
Q('pt-b2-v2-lesson-5',`Complete with chegar: Espero que vocês ____ cedo.|cheguem|Present subjunctive after espero que; g becomes gu before e.
Complete with fazer: É importante que nós ____ uma pausa.|façamos|Fazer has the subjunctive stem faç-.
Complete with estar: Não acho que ela ____ pronta.|esteja|A negated belief commonly takes the subjunctive.
Complete with falar in a negative command to você: Não ____ tão alto.|fale|Negative commands use the subjunctive form.`);
Q('pt-b2-v2-lesson-6',`Complete with ter: Se eu ____ mais tempo, viajaria.|tivesse|The remote condition uses the imperfect subjunctive.
Complete with poder: Gostaria que você ____ vir.|pudesse|Poder → pudesse in the imperfect subjunctive.
Complete with falar: Se nós ____ mais devagar, entenderiam.|falássemos|The nós form takes -ssemos and an accent.
Complete the result with ajudar: Se soubéssemos, nós ____.|ajudaríamos|The conditional result matches the hypothetical condition.`);
Q('pt-c1-v2-lesson-3',`Complete with contribuir: É possível que a medida ____ para a queda. Use ter + participle.|tenha contribuído|The compound subjunctive can express uncertainty about a prior contribution.
Complete with haver: Não significa que ____ uma relação causal.|haja|Não significa que limits the inference and takes the subjunctive.
Complete the qualification: Isso não ____ prova causalidade. Use necessariamente.|necessariamente|Not necessarily limits certainty without claiming impossibility.
Correct the participle only: Talvez elas tenham chegadas.|chegado|With ter, the participle remains invariable.`);
Q('pt-c1-v2-lesson-5',`Complete with terminar: Espero que ela já ____. Use ter + participle.|tenha terminado|Present perfect subjunctive marks a prior event under present hope.
Complete with fazer: Talvez eles tenham ____ a revisão.|feito|The participle of fazer is feito.
Complete with chegar: É possível que nós já ____. Use ter + participle.|tenhamos chegado|The auxiliary agrees with nós.
Correct the auxiliary only: Duvido que vocês tem entendido.|tenham|Duvido que takes subjunctive tenham.`);
Q('pt-c1-v2-lesson-6',`Complete with guardar: Se eu ____ uma cópia, não teria perdido tudo. Use ter + participle.|tivesse guardado|A counterfactual past condition uses the pluperfect subjunctive.
Complete with saber: Se nós ____, teríamos avisado. Use ter + participle.|tivéssemos sabido|Tivéssemos agrees with nós.
Complete the result with sair: Se tivesse recebido o aviso, eu ____ antes. Use ter + participle.|teria saído|A past counterfactual result uses teria + participle.
Correct the participle only: Se ela tivesse escrevido, eu saberia.|escrito|Escrever has the irregular participle escrito.`);
Q('ja-a1-v2-lesson-2',`Choose the missing particle: 私____学生です。Write only the particle.|は|は marks the topic.
Complete politely: 田中さんは先生____。|です|です follows a noun in a polite identification.
Make negative using ではありません: 私は医者です。|私は医者ではありません。|Place ではありません after the noun.
Complete the question particle: 学生です____。|か|か marks a polite question.`);
Q('ja-a1-v2-lesson-3',`Fill the object particle: 毎朝、パン____食べます。|を|を marks the direct object.
Fill the action-location particle: 図書館____勉強します。|で|で marks where the action happens.
Fill the destination particle using に: 学校____行きます。|に|に marks the destination; へ is another destination marker in other phrasings.
Complete politely from 飲む: お茶を____。|飲みます|飲む → 飲みます.`);
Q('ja-a1-v2-lesson-5',`Write the polite form of 書く.|書きます|Change the final く to き before ます.
Write the polite form of 食べる.|食べます|This ichidan verb drops る before ます.
Write the polite form of する.|します|する is irregular.
Write the polite form of 来る using kanji.|来ます|来る is irregular; 来ます is read きます.|きます`);
Q('ja-a1-v2-lesson-6',`Write the polite negative of 行きます.|行きません|Replace ます with ません.
Write the plain negative of 飲む.|飲まない|Change the final む to ま and add ない.
Write the plain negative of 食べる.|食べない|Drop る and add ない for this ichidan verb.
Write the plain negative of ある.|ない|ある has the exceptional negative ない.`);
Q('ja-a2-v2-lesson-1',`Write the polite past of 行きます.|行きました|Replace ます with ました.
Write the plain past of 食べる.|食べた|Ichidan verbs replace る with た.
Write the plain past of 書く.|書いた|く normally changes to いた.
Write the plain past of 行く.|行った|行く is an exception: 行った.`);
Q('ja-a2-v2-lesson-5',`Write the て-form of 読む.|読んで|む changes to んで.
Write the て-form of 話す.|話して|す changes to して.
Write the て-form of 行く.|行って|行く is exceptional.
Complete permission: ここに座って____ですか。|もいい|て-form + もいいですか asks permission.`);
Q('ja-a2-v2-lesson-6',`Complete ongoing action with 読む: 今、本を____。Use polite ている.|読んでいます|ている describes an action in progress here.
Complete a resulting state with 開く: 窓が____。Use polite ている.|開いています|With this intransitive verb, ている describes the resulting open state.
Complete preparation with 置く: 椅子を並べて____。Use polite form.|おきます|ておく marks preparation in advance.
Correct the verb phrase: 今、昼ご飯を食べるいます。|食べています|ている attaches to the て-form, not the dictionary form.`);
Q('ja-b1-v2-lesson-1',`Complete deliberate purpose: 留学する____、お金を貯めています。|ために|ために links a deliberate action with its purpose.
Complete a desired ability: 日本語が話せる____、練習しています。|ように|ように is used with this desired ability.
Complete negative purpose: 忘れない____、メモしました。|ように|ないように expresses preventing an unwanted outcome.
Fill the particle: 子ども____ために働いています。|の|A noun connects to ため with の.`);
Q('ja-b1-v2-lesson-2',`Complete uncertainty: 明日は雨____。Use かもしれません after the noun.|かもしれません|A noun attaches directly; no だ before かもしれない.
Correct only the ending: 学生だかもしれません。Write the full corrected sentence.|学生かもしれません。|Do not insert だ before かもしれません.
Complete with 行く: 彼も____かもしれません。|行く|Use a plain form before かもしれません.
Complete a past possibility with 忘れる: 彼は約束を____かもしれません。|忘れた|The plain past describes a possible earlier event.`);
Q('ja-b1-v2-lesson-5',`Complete experience with 行く: 京都に____ことがあります。|行った|Experience uses plain past + ことがある.
Make negative: 富士山に登ったことがあります。Use ありません.|富士山に登ったことがありません。|The negative denies experience, not just a particular climb.
Complete using 見る: この映画を____ことがあります。|見た|Use the た-form before ことがある.
Correct the verb form: 寿司を食べることがあります。Change it to mean past experience, not occasional behaviour.|寿司を食べたことがあります。|Dictionary form + ことがある can describe occasional behaviour; た-form describes experience.`);
Q('ja-b1-v2-lesson-6',`Complete preparation with 買う: 旅行の前に切符を____おきます。|買って|ておく marks an action done in advance.
Complete politely: 明日のために資料を印刷して____。|おきます|The auxiliary おく is conjugated politely.
Write the casual contraction of 読んでおく.|読んどく|でおく contracts to どく in casual speech.
Complete with 消す: 帰る前に電気を____おいてください。|消して|消す has the て-form 消して.`);
Q('ja-b1-v2-lesson-7',`Complete intention with 勉強する: 来年、日本語を____つもりです。|勉強する|The dictionary form precedes つもり.
Complete a negative intention: 行く____はありません。|つもり|つもりはない denies an intention.
Complete an arrangement with 会う: 明日、先生に____予定です。|会う|Dictionary form + 予定 describes a schedule.
Correct the noun connection: 会議予定です。Add の in the intended phrase meaning scheduled for a meeting.|会議の予定です。|A noun connects to 予定 with の.`);
Q('ja-b1-v2-lesson-8',`Complete with 雨 using なら: ____、家にいます。|雨なら|Noun + なら needs no だ.
Complete with 安い using なら: ____、買いたいです。|安いなら|い-adjectives keep い before なら.
Fill the advice frame: 京都に行く____、この寺がおすすめです。|なら|なら takes the other person's proposed plan as a premise.
Correct the attachment: 学生だなら割引があります。|学生なら割引があります。|Do not insert だ between a noun and なら.`);
Q('ja-b2-v2-lesson-3',`Complete a condition with 終わる: 仕事が____、電話してください。|終わったら|たら can mean once the event has happened.
Complete with 暇: 明日____、手伝ってください。|暇だったら|A な-adjective uses だったら.
Complete counterfactual regret with 知る: ____、別の道を選んだのに。Use ている + たら.|知っていたら|The past conditional refers to knowledge that was absent.
Complete with 安い: もっと____、買ったのに。|安かったら|い-adjectives form the conditional with かったら.`);
Q('ja-b2-v2-lesson-5',`Write the passive of 褒める in polite past.|褒められました|Ichidan passive replaces る with られる.
Write the passive of 書く in plain form.|書かれる|Godan passive changes the final sound to the a-row + れる.
Fill the agent particle: 私は先生____褒められました。|に|に marks the agent in this passive sentence.
Complete adverse passive with 泣く: 夜中に赤ちゃんに____、眠れませんでした。|泣かれて|The indirect passive can express being adversely affected.`);
Q('ja-b2-v2-lesson-6',`Write the causative of 食べる in plain form.|食べさせる|Ichidan causative replaces る with させる.
Write the causative of 行く in plain form.|行かせる|Godan causative changes to the a-row + せる.
Fill the causee particle for this transitive construction: 先生は学生____作文を書かせました。|に|に marks who writes; 作文 is already the direct object.
Complete a permission request with 休む: 明日、____いただけますか。Use causative て-form.|休ませて|させていただけますか can ask permission respectfully.`);
Q('ja-c1-v2-lesson-3',`Complete a limited inference: 相関があるからといって、因果関係がある____。Use とは限らない.|とは限らない|This rejects an automatic conclusion without rejecting every possibility.
Complete evidence-based wording: 調査結果を____、方針を決める。Use 踏まえる.|踏まえて|を踏まえて identifies the basis for judgment.
Complete a qualified conclusion: 一定の効果がある____。Use と言える.|と言える|と言える frames a supported conclusion.
Correct overstatement: Change 必ず改善する to a not-necessarily claim using とは限らない.|必ず改善するとは限らない|Not necessarily differs from never.`);
Q('ja-c1-v2-lesson-5',`Complete a strong inference: 電気がついている。誰かいる____。Use に違いない.|に違いない|に違いない marks a strong inference.
Complete expectation: 荷物は今日届く____です。Use はず.|はず|はず expresses expectation based on a reason.
Complete impossible inference: 彼は海外にいるので、ここにいる____。Use はずがない.|はずがない|はずがない excludes the proposed inference.
Complete a noun connection: 彼は専門家____はずです。|の|A noun connects to はず with の.`);
Q('ja-c1-v2-lesson-6',`Express regret with 確認する: 住所を____よかった。Use ておけば.|確認しておけば|ておけばよかった regrets missing a preparatory action.
Complete a negative regret: あんなことを言わ____よかった。|なければ|なければよかった regrets an action that happened.
Complete with 早い: もっと____出ればよかった。|早く|早い becomes adverbial 早く before a verb.
Complete unreal past: 知っていた____、連絡したのに。Use なら.|なら|The ending のに conveys regret about the unrealised outcome.`);
Q('ser-estar',`Complete origin: Mi vecino ____ de Perú.|es|Origin uses ser.
Complete the current state: Hoy yo ____ nervioso.|estoy|Current feelings use estar.
Correct only the verb: Nosotros es estudiantes.|somos|Ser agrees with nosotros.
Complete location: El banco ____ cerca del parque.|está|The location of a building uses estar.`);
Q('daily-routine',`Complete with estudiar: Tú ____ por la noche.|estudias|Tú takes -as with regular -ar verbs.
Complete with trabajar: Ellas ____ los lunes.|trabajan|Ellas takes -an.
Write the lesson's phrase for in the morning.|por la mañana|Use por la mañana for this part of the day.
Correct only the verb: Nosotros trabajo aquí.|trabajamos|Nosotros takes -amos.`);
Q('past-events',`Complete with salir: Ayer yo ____ temprano.|salí|The completed past of salir with yo is salí.
Complete with visitar: La semana pasada ella ____ Toledo.|visitó|The ella perfect ending is -ó.
Correct the verb only: Ayer tú comió aquí.|comiste|Tú takes -iste with comer in the preterite.
Complete with después: First I worked, then I rested. Primero trabajé y ____ descansé.|después|Después puts the second event later.`);
Q('porpara',`Complete purpose: Estudio ____ conseguir otro trabajo.|para|Para + infinitive states purpose.
Complete cause: Gracias ____ ayudarme.|por|Por gives the reason for thanking.
Complete destination: Este tren sale ____ Sevilla.|para|Para can identify a destination.
Complete exchange: Pagué veinte euros ____ el libro.|por|Por is used for exchange or payment.`);
Q('subjunctive',`Complete with venir: Espero que tú ____ mañana.|vengas|Espero que expresses hope and triggers subjunctive.
Complete with tener: No creo que ellos ____ razón.|tengan|Negated belief takes subjunctive here.
Complete with estar: Me alegra que ustedes ____ aquí.|estén|An emotional reaction takes subjunctive in this clause.
Correct only the verb: Quiero que tú estudias.|estudies|Querer que + another subject takes subjunctive.`);
Q('hypotheticals',`Complete with tener: Si ____ tiempo, viajaría más. Subject: yo.|tuviera|Use imperfect subjunctive in the hypothetical condition.|tuviese
Complete the result with comprar: Si fuera más barato, lo ____. Subject: yo.|compraría|Use conditional in the hypothetical result.
Correct the condition verb only: Si yo sería rico, viajaría.|fuera|Ser takes imperfect subjunctive here.|fuese
Complete with poder: Si nosotros ____ elegir, viviríamos cerca del mar.|pudiéramos|The nosotros form agrees with the subject.|pudiésemos`);
Q('hedging',`Complete a tentative conclusion: Los datos ____ que puede haber una relación. Use sugerir.|sugieren|Sugieren is weaker than demuestran.
Complete the caveat: Esto no implica ____ que la medida sea eficaz. Use necesariamente.|necesariamente|No necesariamente limits certainty.
Complete with contribuir: Es posible que la medida ____ al cambio.|contribuya|Es posible que takes subjunctive.
Complete the association phrase: Está relacionado ____ varios factores.|con|Relacionado con describes association, not proof of causation.`);
Q('present-regular-lab',`Complete with buscar: Tú ____ las llaves.|buscas|Regular -ar agreement with tú.
Correct the verb: Nosotros comen aquí.|comemos|Nosotros takes -emos with comer.
Complete with abrir: Ellas ____ la tienda.|abren|Regular -ir agreement with ellas.
Make a question by adding question marks: Estudias aquí.|¿Estudias aquí?|Spanish can use the same verb form in a question.|Estudias aquí?`);
Q('present-irregular-lab',`Complete with tener: Yo ____ hambre.|tengo|Tener has the irregular yo form tengo.
Complete with querer: Nosotros ____ salir.|queremos|No stem change in nosotros.
Complete with ir: Ustedes ____ al centro.|van|Ustedes agrees with third-person plural.
Correct the verb: Yo soyo profesor.|soy|Soy is the irregular first-person form of ser.`);
Q('preterite-lab',`Complete with tener: Ayer yo ____ suerte.|tuve|Tener uses the irregular stem tuv-.
Complete with hacer: Ayer ella ____ la cena.|hizo|Hacer has hizo in the third-person singular.
Complete with ir: El lunes nosotros ____ a Córdoba.|fuimos|Ser and ir share this past form; destination selects ir.
Add the missing accent for past he spoke: hablo.|habló|Habló is past; hablo is present first person.`);
Q('imperfect-lab',`Complete with ser: De niño, yo ____ muy tímido.|era|Ser has the irregular imperfect era.
Complete with ir: Antes nosotros ____ a pie.|íbamos|Ir is irregular; íbamos keeps the accent.
Complete with ver: Desde allí se ____ el mar.|veía|Ver has imperfect veía.
Choose the background form of llover: Cuando llegué, ____.|llovía|The imperfect describes the ongoing background.`);
Q('present-perfect-lab',`Complete with hacer: Ella ha ____ la tarea.|hecho|Hacer has the irregular participle hecho.
Correct the participle: Ellas han terminadas.|terminado|The participle after haber does not agree with the subject.
Complete with escribir: Hemos ____ dos cartas.|escrito|Escribir has the participle escrito.
Make negative: He comido.|No he comido.|No precedes the auxiliary.`);
Q('pluperfect-lab',`Complete with salir: Cuando llegué, ella ya ____. Use haber + participle.|había salido|The departure precedes the past arrival.
Complete the participle: Habíamos ____ la puerta. Use abrir.|abierto|Abrir has the irregular participle abierto.
Correct the participle: Habían vistas la película.|visto|The participle after haber is invariable.
Make negative: Habías llamado.|No habías llamado.|No goes before había- forms.`);
Q('future-simple-lab',`Complete with hacer: Mañana yo ____ la compra.|haré|The irregular future stem is har-.
Complete with decir: Nosotros te lo ____ mañana.|diremos|Decir uses dir- in the future.
Complete with salir: Ellas ____ a las ocho.|saldrán|Salir uses saldr-.
Correct the form: Yo teneré tiempo.|tendré|Tener uses tendr-, not tener-.`);
Q('conditional-lab',`Complete a polite request with poder: ¿____ ayudarme? Subject: tú.|Podrías|Podrías softens a request.
Complete with hacer: Yo lo ____ de otra manera.|haría|Hacer uses har- in the conditional.
Complete with decir: Nosotros no ____ eso.|diríamos|Decir uses dir-.
Complete with tener: Si fuera posible, ellos ____ más tiempo.|tendrían|Tener uses tendr-.`);
Q('present-subjunctive-lab',`Complete with buscar: Quiero que tú ____ otra opción.|busques|Keep the /k/ sound with qu before e.
Complete with tener: Dudo que ellos ____ tiempo.|tengan|Tener uses teng- in the subjunctive.
Complete with ir: Espero que ella ____ contigo.|vaya|Ir is irregular in the subjunctive.
Correct the verb: Es importante que nosotros llegamos pronto.|lleguemos|The subjunctive form preserves /g/ with gu.`);
Q('imperfect-subjunctive-lab',`Complete with ser, using the -ra series: Si él ____ más paciente, esperaría.|fuera|Ser has fuera in the -ra series.
Complete with venir, using the -ra series: Querían que nosotros ____.|viniéramos|Viniéramos agrees with nosotros and has an accent.
Give the alternative -se form of hablara.|hablase|The -ra and -se series can both form the imperfect subjunctive.
Complete with saber, -ra series: Si yo lo ____, te lo diría.|supiera|Saber has the stem supie-.`);
Q('perfect-subjunctive-lab',`Complete with hacer: Me alegra que lo ____. Subject: tú; use haber + participle.|hayas hecho|Present subjunctive haber + hecho marks a prior completed action.
Complete with llegar: Espero que ellos ____. Use haber + participle.|hayan llegado|The auxiliary agrees with ellos.
Correct the participle: Espero que hayan llegadas.|llegado|The participle after haber is invariable.
Complete with escribir: Dudo que ella lo ____. Use haber + participle.|haya escrito|Escrito is the irregular participle.`);
Q('past-perfect-subjunctive-lab',`Complete with salir, using hubiera: Si yo ____ antes, habría llegado.|hubiera salido|The counterfactual past condition uses pluperfect subjunctive.
Give the alternative auxiliary to hubiera in this tense.|hubiese|Hubiese is the -se-series alternative.
Complete with saber, using hubiéramos: Si nosotros lo ____, habríamos avisado.|hubiéramos sabido|The auxiliary agrees with nosotros.
Correct the participle: Si hubieran vistas el aviso, habrían llamado.|visto|Haber takes an invariable participle.`);
// Align the supplemental applications with the exact language-specific syllabus.
Q('pt-a1-v2-lesson-5',`Complete with beber: Eu ____ água.|bebo|The eu ending is -o.
Complete with comer: Nós ____ juntos.|comemos|Regular -er verbs take -emos with nós.
Complete with abrir: Nós ____ cedo.|abrimos|Regular -ir verbs take -imos with nós.
Correct the verb only: Vocês parte amanhã.|partem|Vocês takes third-person plural -em.`);
Q('pt-a1-v2-lesson-6',`Complete with ter: Eu ____ dois irmãos.|tenho|Ter has the irregular eu form tenho.
Complete with ir: Nós ____ para casa.|vamos|Ir has the irregular form vamos.
Complete with fazer: Você ____ o almoço?|faz|Você takes the third-person singular form faz.
Complete with poder: Eles ____ entrar.|podem|Eles takes podem.`);
Q('pt-a2-v2-lesson-5',`Complete with brincar: Quando criança, eu ____ no jardim.|brincava|The imperfect describes a repeated past habit.
Complete with ser: Antes, as ruas ____ tranquilas.|eram|Ser has the irregular imperfect eram.
Complete with ter: Naquela época nós ____ um cachorro.|tínhamos|The imperfect describes a past state.
Correct the verb only: Quando criança, eu ia à escola e brinca no recreio.|brincava|The coordinated past habit also uses the imperfect.`);
Q('pt-a2-v2-lesson-6',`Complete with estudar: Às oito, eu ____. Use estar + gerund in the imperfect.|estava estudando|The progressive describes an ongoing past action.
Complete with tocar: Eu estava lendo quando o telefone ____.|tocou|The completed interruption takes the simple perfect.
Correct only the auxiliary: Eles estava trabalhando.|estavam|The auxiliary agrees with eles.
Complete with cozinhar: Enquanto eu limpava, ela ____. Use estar + gerund in the imperfect.|estava cozinhando|The two actions were ongoing together.`);
Q('pt-b1-v2-lesson-7',`Complete with ter: Se eu ____ tempo amanhã, vou ajudar.|tiver|Future subjunctive in an open future condition.
Complete with chegar: Quando você ____, avise.|chegar|Future subjunctive after quando.
Complete with fazer: Se nós ____ a reserva, avisaremos.|fizermos|Fazer has the future-subjunctive form fizermos.
Complete with ir: Se eles ____ ao centro, vão passar aqui.|forem|Ir has the irregular future-subjunctive form forem.`);
Q('pt-b2-v2-lesson-6',`Complete with sair: Se eu ____ antes, teria chegado a tempo. Use ter + participle.|tivesse saído|The past counterfactual condition uses tivesse + participle.
Complete with saber: Se nós ____ disso, teríamos ajudado. Use ter + participle.|tivéssemos sabido|The auxiliary agrees with nós.
Complete the result with evitar: Se tivessem avisado, nós ____ o problema. Use ter + participle.|teríamos evitado|The counterfactual result uses conditional ter + participle.
Correct only the participle: Se ela tivesse fazido a reserva, teria lugar.|feito|Fazer has the participle feito.`);
const tara=grammarPractice['ja-b2-v2-lesson-3'];grammarPractice['ja-b2-v2-lesson-3']=grammarPractice['ja-b1-v2-lesson-8'];grammarPractice['ja-b1-v2-lesson-8']=tara;
grammarPractice['ja-b2-v2-lesson-5'].push(...grammarPractice['ja-b2-v2-lesson-6']);
Q('ja-b2-v2-lesson-6',`Complete past regret with 出る: もっと早く____、間に合ったのに。Use ていたら.|出ていたら|This imagines an earlier action that did not happen.
Complete a past ability result with 間に合う: 早く出ていれば、____。Use たはずだ.|間に合ったはずだ|A past expectation forms the unrealised result.
Complete with 確認する: 時間を____、遅れずに済んだのに。Use ていれば.|確認していれば|The earlier condition is unreal.
Complete the regretted result: 切符を買っていれば、乗れた____。Use のに.|のに|Sentence-final のに conveys regret about the unrealised outcome.`);
Q('ja-c1-v2-lesson-5',`Complete formal inference: 担当者はすでに出発した____。Use ものと思われる.|ものと思われる|This marks an inferred completed event in formal reporting.
Complete with 終了する: 会議はすでに____ものと思われます。Use plain past.|終了した|The past form places completion before the reporting time.
Complete expectation: 予定どおりなら、もう到着した____です。Use はず.|はず|はず signals an expectation based on a schedule.
Avoid stating inference as direct observation: 手続きは完了した。Add ものと思われる after 完了した.|手続きは完了したものと思われる。|The wording distinguishes inference from direct confirmation.`);
grammarPractice['ja-a1-v2-lesson-2'].push({type:'text',mode:'application',prompt:'Fill possession: これは私____本です。',answer:'の',note:'の connects the possessor with the noun.'});
Q('introductions',`Write the missing reflexive pronoun: Me llamo Ana. ¿Cómo ____ llamas?|te|Te llamas asks another person’s name.
Complete your origin: Soy ____ Chile.|de|Use ser de for origin.
Complete residence: Vivo ____ Lima.|en|Use vivir en for where you live.
Write the reciprocal greeting taught in this lesson after Mucho gusto.|Igualmente|Igualmente returns the greeting.`);
Q('future-plans',`Complete a plan with ir: Nosotros ____ a estudiar mañana.|vamos|The auxiliary agrees with nosotros.
Correct only the main verb: Voy a estudio esta noche.|estudiar|After ir a, use the infinitive.
Complete an invitation: ¿____ tomar un café? Use querer, tú.|Quieres|Quieres + infinitive invites a friend.
Write tomorrow in Spanish.|mañana|Mañana can give the time of the plan.`);
Q('connectors',`Complete a contrast with pero: Quiero ir, ____ no tengo tiempo.|pero|Pero contrasts two clauses.
Complete a cause with porque: No fui ____ estaba enfermo.|porque|Porque introduces the reason.
Complete a consequence: Estaba cerrado; ____ eso volvimos. Use por.|por|Por eso introduces the consequence.
Complete an addition: El piso es grande y, ____, luminoso. Use además.|además|Además adds another point.`);
Q('travel-message',`Complete a polite request with poder, usted: ¿____ confirmar la hora de llegada?|Podría|Podría softens a request.
Complete a courteous question: ¿Sería ____ entrar antes? Use posible.|posible|Sería posible is a polite request frame.
Write the missing preposition: Gracias ____ su ayuda.|por|Por introduces the reason for thanking.
Complete the need: Necesito ____ habitación tranquila. Use the indefinite article.|una|Habitación is feminine.`);
Q('balanced-argument',`Complete the contrast: Es útil; no ____, cuesta mucho.|obstante|No obstante introduces a limitation.
Complete a concession: Si ____ es cierto que ayuda, no basta.|bien|Si bien acknowledges a point before qualification.
Complete a justification: Conviene ampliarlo ____ faltan plazas. Use porque.|porque|Porque connects the recommendation with its reason.
Complete the recommendation: Por ello, ____ una prueba limitada. Use recomendar, nosotros.|recomendamos|The conclusion should follow from the reasons given.`);
Q('formal-register',`Complete with enviar: Le agradecería que me ____ los detalles.|enviara|Le agradecería que takes imperfect subjunctive.|enviase
Write the formal closing taught in this lesson.|Atentamente|Atentamente is a neutral formal closing.
Correct only the verb: Le agradecería que confirmaría la recepción.|confirmara|Use subjunctive rather than conditional in the que clause.|confirmase
Complete a polite request with poder, usted: ¿____ indicarme el plazo?|Podría|Podría indicarme asks precisely and courteously.`);
Q('implied-meaning',`Complete the qualification: Los datos son prometedores, aunque ____. Use preliminares.|preliminares|Preliminares says the findings are not final.
Complete the reservation: No es que me oponga; me preocupa su ____. Use viabilidad.|viabilidad|Viabilidad concerns whether it can work in practice.
Complete tentative advice with convenir in conditional: Quizá ____ revisar el calendario.|convendría|The conditional makes the advice tentative.
Complete the caution: Esto no equivale ____ una aprobación definitiva.|a|No equivale a limits what may be inferred.`);
Q('synthesis',`Complete the synthesis marker: En ____, las ventajas son claras.|conjunto|En conjunto brings findings together.
Complete the condition: Siempre que se ____ en cuenta los límites. Use tener.|tengan|Siempre que meaning provided that takes subjunctive.
Complete a caveat: Recomendamos continuar, con la ____ de que faltan datos. Use salvedad.|salvedad|The caveat preserves a limitation on the recommendation.
Complete the conclusion: A la ____ de estos datos, conviene esperar. Use luz.|luz|A la luz de connects the conclusion to evidence.`);
function L(id,data){grammarPractice[id]=data.trim().split('\n').map(row=>{const [audio,prompt,answer,note]=row.split('|');return {type:'text',mode:'listening',audio,audioLocale:'es-ES',prompt,answer,note};});}
L('cafe',`Quisiera un té sin azúcar, por favor.|Listen and write the drink requested, without an article.|té|Té is tea; the speaker asks for no sugar.
¿Algo más? Sí, un vaso de agua.|Listen and complete: un vaso de ____.|agua|The additional request is a glass of water.
Para llevar, por favor.|Listen and write the two-word phrase meaning to take away.|para llevar|Para llevar contrasts with eating or drinking on the premises.
¿Me trae la cuenta, por favor?|Listen and complete: ¿Me trae la ____, por favor?|cuenta|La cuenta is the bill.`);
L('directions',`Cruza la plaza y luego gira a la derecha.|After crossing the square, which direction is given? Write the Spanish direction word.|derecha|The turn comes after crossing the square.
La panadería está enfrente del museo.|Complete the location: ____ del museo.|enfrente|Enfrente de means opposite.
Sigue todo recto hasta el puente.|Write the two-word phrase for straight ahead.|todo recto|The route continues straight until the bridge.
Primero cruza el puente; después gira a la izquierda.|What must be crossed first? Write the Spanish noun without its article.|puente|Primero fixes the order: cross the bridge first.`);
L('airport',`La puerta ya no es la C ocho. Diríjanse a la C diez.|Write the final gate as a letter and number.|C10|The corrected gate replaces the first announcement.
El embarque comienza a las diecinueve quince.|Write the boarding time as HH:MM.|19:15|Diecinueve quince is 19:15.
Por favor, preparen su documento de identidad.|Complete the item requested: documento de ____.|identidad|A document proving identity is requested.
El vuelo está retrasado, pero no cancelado.|Write the Spanish word describing the flight's current status.|retrasado|The flight is delayed, not cancelled.`);
L('speaker-stance',`Si bien el precio es alto, recomiendo la visita.|Does the speaker recommend the visit? Write sí or no.|sí|The concession does not cancel the recommendation.
El diseño es atractivo; aun así, no lo compraría.|Would the speaker buy it? Write sí or no.|no|Aun así introduces the final negative decision.
Aunque apoyo la idea, el calendario debe revisarse.|Complete the item needing revision: el ____.|calendario|Support is qualified by a concern about scheduling.
Lo que más valoro es la seguridad, no la rapidez.|Write the speaker's main priority in Spanish.|seguridad|Lo que más valoro identifies the priority.`);
L('pronunciation',`canción|Write the stressed syllable with its accent.|ción|The written accent marks final stress.
árbol|Write the stressed syllable with its accent.|ár|The accent overrides the default final stress for a word ending in l.
ventana|Write the stressed syllable.|ta|A vowel ending normally gives penultimate stress.
reloj|Write the stressed syllable.|loj|A consonant other than n or s normally gives final stress.`);
