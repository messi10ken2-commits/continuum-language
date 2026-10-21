// Original examples. Regional preferences are contextual, not exclusive national rules.
const choice=(prompt,context,options,answer,note,display=false)=>({type:display?'interpretation':'choice',prompt,context,options,answer,note});
const reorder=(prompt,context,tokens,answer,note,separator=' ')=>({type:'reorder',prompt,context,tokens,answer,note,separator});
const fill=(prompt,context,answer,note,acceptedAnswers=[])=>({type:'cloze',prompt,context,answer,note,acceptedAnswers});
const overview='Regional usage varies within every country and across generations. Learn to understand the speaker and match the setting; no variety is more correct or more intelligent than another.';
export const varietyCourses=[
 {id:'en-premium-varieties-v1',language:'en',level:'B2',scene:'varieties',title:'Across Britain, America and Australia',description:'Decode everyday regional vocabulary and switch register without stereotypes.',exampleNote:overview,examples:['Let’s meet this arvo.','Could you tell me where the elevator is?'],vocabulary:[{phrase:'arvo',meaning:'Informal Australian English for afternoon'},{phrase:'flat / apartment',meaning:'Common British / American housing terms; both are understood more widely'},{phrase:'chemist / pharmacy',meaning:'A chemist can mean a pharmacy in British usage'}],questions:[
 choice('An Australian friend suggests meeting later. What time of day is meant?','Let’s catch up this arvo.',['This afternoon','Early tomorrow morning','At midnight'],0,'Arvo is informal Australian usage for afternoon. Use afternoon in a formal appointment.',true),
 choice('You are asking for a lift in an American hotel. Which request uses the usual American word?','You want to go to the fourth floor.',['Where is the elevator?','Where is the escalator?','Where is the staircase?'],0,'Elevator is the usual American term for a lift. An escalator is a moving staircase.'),
 choice('What does this British housing notice offer?','A two-bedroom flat is available near the station.',['A level road','An apartment with two bedrooms','A flat tyre repair'],1,'Here flat names a home, not a surface. Apartment is common in American usage too.',true),
 reorder('Make a clear request that works across regional varieties.','You need to understand an unfamiliar local word.',['that','word','does','What','mean?'],'What does that word mean?','Asking for clarification is more reliable than guessing from a regional label.'),
 choice('In a British town, what is the most likely reason to ask for “the chemist”?','I need to pick up my prescription.',['To find a science laboratory','To buy a train ticket','To find a pharmacy'],2,'In this setting chemist refers to a pharmacy. Pharmacy is also used in Britain.',true),
 fill('Complete the neutral time word so this invitation is suitable for a formal email.','Could we meet this ____ at three?','afternoon','Afternoon replaces the informal arvo without changing the time of day.'),
 choice('An Australian friend is packing for the beach. What is most likely meant here?','Don’t forget your thongs for the sand.',['Rubber footwear worn on the feet','Winter gloves','Formal shoes for a meeting'],0,'In this Australian beach context thongs means flip-flops. The word has other meanings elsewhere; context matters.',true),
 choice('Which response handles an unfamiliar variety respectfully?','You have not heard a local expression before.',['That is not real English.','Could you explain what that means here?','Everyone from your country says the same thing.'],1,'Ask about meaning in this setting. Regional labels describe tendencies, not every individual.') ]},
 {id:'es-premium-varieties-v1',language:'es',level:'B2',scene:'varieties',title:'Spanish across the Atlantic',description:'Explore Spain, Mexico and Río de la Plata through everyday choices.',exampleNote:overview,examples:['¿Vos tenés tiempo mañana?','¿Ustedes quieren tomar algo?'],vocabulary:[{phrase:'ordenador / computadora',meaning:'Common computer terms in Spain / Mexico'},{phrase:'vos tenés',meaning:'A familiar singular form associated with voseo in Río de la Plata'},{phrase:'zumo / jugo',meaning:'Common juice terms in Spain / Mexico'}],questions:[
 choice('You hear this in Buenos Aires. What is the speaker asking?','¿Vos tenés tiempo mañana?',['Whether you have time tomorrow','Whether several people arrived yesterday','Whether you have lost a ticket'],0,'Vos tenés is familiar singular voseo common in Río de la Plata. Voseo also occurs elsewhere in different forms.',true),
 choice('Which form commonly addresses several people in Mexico, including friends?','You ask a group whether they want a drink.',['¿Tú quieres tomar algo?','¿Ustedes quieren tomar algo?','¿Vos querés tomar algo?'],1,'Ustedes is the usual plural address in Mexico. It is not limited to formal situations there.'),
 choice('What item is being discussed in this notice from Spain?','El ordenador de la biblioteca no funciona.',['A library employee','A mobile phone','A computer'],2,'Ordenador commonly means computer in Spain; computadora is common in Mexico. Other regions have their own preferences.',true),
 reorder('Build a request for clarification that works across varieties.','You want someone to explain a local expression.',['significa','aquí?','¿Qué','esa expresión'],'¿Qué significa esa expresión aquí?','Ask what the expression means here rather than treating your own variety as the only standard.'),
 choice('In a café in Mexico, which drink is being offered?','¿Quieres un jugo de naranja?',['Orange juice','Orange peel','Orange-flavoured cake'],0,'Jugo de naranja means orange juice here. Zumo de naranja is common in Spain.',true),
 fill('Complete the familiar plural form commonly used with vosotros in much of Spain.','¿Vosotros ____ venir mañana?','queréis','Queréis agrees with vosotros. Ustedes is used in Latin America and also in parts of Spain, including the Canary Islands.'),
 choice('A friend in Madrid says “vale” after you suggest a time. What does it most likely signal?','Nos vemos a las seis. — Vale.',['A request to change the date','Agreement with the arrangement','A claim about the price'],1,'In this exchange vale acknowledges and accepts the plan. Context determines the meaning.',true),
 choice('Which statement describes Spanish variation accurately?','You are comparing forms of address.',['All Latin American countries use vos in the same way.','Everyone in Spain always uses vosotros.','Plural and singular address vary by region and relationship.'],2,'Latin America is not one uniform variety, and Spain also has internal variation.',true) ]},
 {id:'pt-premium-varieties-v1',language:'pt',level:'B2',scene:'varieties',title:'Portuguese in Brazil and Portugal',description:'Navigate everyday vocabulary and progressive forms across the Atlantic.',exampleNote:overview,examples:['Estou esperando o ônibus.','Estou a esperar o autocarro.'],vocabulary:[{phrase:'ônibus / autocarro',meaning:'Common bus terms in Brazil / Portugal'},{phrase:'celular / telemóvel',meaning:'Common mobile-phone terms in Brazil / Portugal'},{phrase:'estou fazendo / estou a fazer',meaning:'Common Brazilian / European Portuguese progressive constructions'}],questions:[
 choice('In Lisbon, which form commonly describes an action happening now?','You are waiting for a friend.',['Estou a esperar um amigo.','Esperei um amigo ontem.','Esperarei um amigo amanhã.'],0,'Estar a + infinitive is common in European Portuguese. It is a tendency, not a ban on gerunds.'),
 choice('Which Brazilian sentence describes the same ongoing action?','Estou a estudar agora.',['Estudei ontem.','Estou estudando agora.','Estudarei amanhã.'],1,'Estar + gerund is common in Brazilian Portuguese. Both sentences describe studying in progress.'),
 choice('What transport is the speaker looking for in Portugal?','Onde fica a paragem do autocarro?',['A train','A taxi','A bus'],2,'Autocarro is the common European Portuguese bus term. Ônibus is common in Brazil.',true),
 reorder('Make a polite clarification request usable in either country.','You do not recognise a local word.',['essa palavra?','explicar','Pode','o que significa'],'Pode explicar o que significa essa palavra?','A direct clarification request works without pretending that all speakers use the same vocabulary.'),
 choice('What device is being discussed in this conversation in Portugal?','O meu telemóvel ficou sem bateria.',['A mobile phone','A washing machine','A television'],0,'Telemóvel means mobile phone. Celular is the common Brazilian term.',true),
 fill('Complete the Brazilian transport term meaning “train”.','Vou pegar o ____ para o centro.','trem','Trem is common in Brazil; comboio is the usual equivalent in Portugal.'),
 choice('What meal does this hotel notice in Portugal refer to?','O pequeno-almoço é servido às oito.',['Lunch','Breakfast','Dinner'],1,'Pequeno-almoço means breakfast in Portugal. Café da manhã is common in Brazil.',true),
 choice('Which conclusion avoids an overgeneralisation?','You compare estou a fazer and estou fazendo.',['Gerunds never occur in Portugal.','Brazilian Portuguese cannot express an action in progress.','Both can express ongoing action, with regional preferences in form.'],2,'European Portuguese also uses gerunds, including in regional varieties. The contrast is a common preference, not an absolute rule.',true) ]},
 {id:'ja-premium-varieties-v1',language:'ja',level:'B2',scene:'varieties',title:'Everyday Japanese meets Kansai',description:'Read familiar Kansai expressions in context and choose an appropriate register.',exampleNote:overview,examples:['おおきに。また来ます。','これ、なんぼですか。'],vocabulary:[{phrase:'おおきに',meaning:'A Kansai expression of thanks'},{phrase:'ほんま',meaning:'A Kansai form corresponding to hontō in familiar conversation'},{phrase:'あかん',meaning:'A familiar Kansai expression meaning not good or not allowed, depending on context'}],questions:[
 choice('A customer says this after receiving help in a Kansai shop. What is being expressed?','おおきに。助かりました。',['Thanks','A request for a refund','A complaint about the price'],0,'おおきに expresses thanks in Kansai usage. Speakers and situations differ; ありがとうございます remains widely usable.',true),
 choice('What is the friend checking?','それ、ほんま？',['Is it expensive?','Is that true?','Is it far away?'],1,'ほんま corresponds to 本当 in this familiar question.',true),
 choice('What does the warning mean here?','そこに入ったらあかんで。',['Please come in.','You arrived late.','You must not go in there.'],2,'あかん marks something as not acceptable or not allowed here. It can have other contextual meanings.',true),
 reorder('Build a neutral request for clarification.','You hear an unfamiliar regional expression.',['いう意味ですか。','それは、','どう'],'それは、どういう意味ですか。','This neutral request asks about the meaning without judging the speaker’s variety.',''),
 choice('A friend says this after dinner while pointing to a cupboard. What should you do?','この皿、棚になおしといて。',['Put the plate away in the cupboard','Repair a broken plate','Buy a new cupboard'],0,'In this Kansai household context なおす means put away. In standard usage it can mean repair, so the setting is essential.',true),
 fill('Complete the Kansai question asking the price.','これ、____ですか。','なんぼ','なんぼ asks how much in this price question.'),
 choice('What is the speaker doing at the end of the meeting?','ほな、また明日。',['Changing tomorrow’s date','Saying goodbye until tomorrow','Asking for directions'],1,'ほな corresponds to じゃあ or それでは in this farewell.',true),
 choice('Which sentence suits a formal academic report better?','You report a useful result in writing.',['めっちゃええ感じやった。','なんか、よう分からん。','この結果は、有用であると考えられる。'],2,'A formal report normally uses an appropriate written register. Casual or regional forms are not inferior; the audience and genre differ.') ]}
];
// Rotate choices while retaining authored keys.
for(const course of varietyCourses)course.questions=course.questions.map((q,i)=>{if(!q.options)return q;const offset=i%q.options.length;return {...q,options:[...q.options.slice(offset),...q.options.slice(0,offset)],answer:(q.answer-offset+q.options.length)%q.options.length};});

const references={
 en:[['Cambridge: arvo','https://dictionary.cambridge.org/dictionary/english/arvo'],['Cambridge: chemist','https://dictionary.cambridge.org/dictionary/english/chemist'],['Cambridge: thong','https://dictionary.cambridge.org/dictionary/english/thong']],
 es:[['Instituto Cervantes: regional address forms','https://cvc.cervantes.es/Ensenanza/biblioteca_ele/plan_curricular/niveles/02_gramatica_inventario_a1-a2.htm']],
 pt:[['Priberam: autocarro','https://dicionario.priberam.org/autocarro'],['Priberam: pequeno-almoço','https://dicionario.priberam.org/pequeno-almo%C3%A7o'],['Ciberdúvidas: progressive constructions','https://ciberduvidas-ql.iscte-iul.pt/consultorio/perguntas/o-gerundio-e-a-perifrase-estar-a--infinitivo/34913']],
 ja:[['Japan Foundation: Kansai expressions','https://www.jpf.go.jp/j/project/japanese/teach/tsushin/hint/201107.html']]
};
for(const course of varietyCourses)course.references=references[course.language].map(([title,url])=>({title,url}));

// Listening assesses meaning and regional vocabulary, never an unreviewed accent.
// Locale selection requests a regional style; it is not proof of authenticity.
const regionalListening={
 en:{0:['en-AU','Australia'],4:['en-GB','Britain']},
 es:{0:['es-AR','Río de la Plata (Argentina)'],4:['es-MX','Mexico']},
 pt:{0:['pt-PT','Portugal'],4:['pt-PT','Portugal']},
 ja:{0:['ja-JP-kansai','Kansai'],4:['ja-JP-kansai','Kansai']}
};
for(const course of varietyCourses){
 course.contentVersion=2;
 course.explanation='Compare the forms and vocabulary in context, then listen for meaning. Regional labels describe tendencies, not every speaker. The AI audio requests a regional style but has not been independently reviewed; it is not evidence of an authentic accent.';
 course.questions=course.questions.map((q,i)=>regionalListening[course.language][i]?{...q,type:'listening',audio:q.context,context:'',audioLocale:regionalListening[course.language][i][0],audioRegion:regionalListening[course.language][i][1],audioKind:'regional-synthesis',listeningTarget:'meaning'}:q);
}
const riverPlate=varietyCourses.find(c=>c.language==='es');
riverPlate.breakdown={
 steps:[
  'In familiar Río de la Plata speech, vos replaces tú. Present indicative forms usually stress the final syllable: hablás, comés, vivís.',
  'For regular affirmative commands, drop the final r of the infinitive and stress the final vowel: hablar → hablá; comer → comé; vivir → viví.',
  'Some frequent verbs differ: vos sos, tenés, venís, podés, querés; affirmative commands include sé, tené, vení, poné, hacé and decí. Ir uses andá.',
  'Object and reflexive pronouns remain te, and possessives remain tu/tuyo: vos te llamás; tu casa. Vos is singular; ustedes is plural.',
  'These tables cover familiar affirmative commands and present indicative, not every tense. Past and future usually use the same forms as tú. Negative commands and subjunctives vary; do not extend the affirmative rule automatically.'
 ],
 tables:[
  {caption:'Río de la Plata: present indicative — tú and vos',headers:['Infinitive','tú','vos'],rows:[['hablar','hablas','hablás'],['comer','comes','comés'],['vivir','vives','vivís'],['ser','eres','sos'],['tener','tienes','tenés'],['venir','vienes','venís'],['poder','puedes','podés'],['querer','quieres','querés'],['decir','dices','decís']]},
  {caption:'Río de la Plata: affirmative singular commands',headers:['Infinitive','tú','vos'],rows:[['hablar','habla','hablá'],['comer','come','comé'],['vivir','vive','viví'],['ser','sé','sé'],['tener','ten','tené'],['venir','ven','vení'],['poner','pon','poné'],['hacer','haz','hacé'],['decir','di','decí'],['ir','ve','andá']]},
  {caption:'Forms of address in context',headers:['Use','Form','Example'],rows:[['Familiar singular, Río de la Plata','vos','¿Vos tenés tiempo?'],['Familiar singular, many other varieties','tú','¿Tú tienes tiempo?'],['Plural, Latin America','ustedes','¿Ustedes tienen tiempo?'],['Familiar plural, much of Spain','vosotros','¿Vosotros tenéis tiempo?']]}
 ],
 pitfall:'Argentina has internal variation, and voseo also occurs outside Argentina with different patterns. Do not treat these forms as universal Latin American Spanish. Accent marks distinguish forms such as habla and hablá. The audio is unreviewed synthesis, so use these written tables for form and stress guidance, not as certification of a regional pronunciation.',
 examples:[['¿Vos tenés tiempo mañana?','Do you have time tomorrow? (familiar singular)'],['Vení mañana y hablá con Ana.','Come tomorrow and speak to Ana.'],['Vos te llamás Ana, ¿no?','Your name is Ana, right?']]
};
riverPlate.questions[3]=reorder('Build a familiar affirmative instruction used in Río de la Plata.','Ask one friend to come tomorrow and speak to Ana.',['Ana.','con','hablá','y','mañana','Vení'],'Vení mañana y hablá con Ana.','Vení and hablá are familiar singular affirmative vos commands. Tú uses ven and habla.');
riverPlate.questions[5]=fill('Complete the present indicative vos form of tener.','¿Vos ____ tiempo mañana?','tenés','Vos tenés is familiar singular in Río de la Plata. Tú tienes and ustedes tienen address different forms; keep the written accent in tenés.');
riverPlate.references.push({title:'RAE: voseo',url:'https://www.rae.es/dpd/voseo'});
const comparisonTables={
 en:{steps:['Choose vocabulary for the setting and audience, not just a national label.','Use a neutral clarification request when a local term is unfamiliar.'],tables:[{caption:'Everyday vocabulary and register',headers:['British usage','American usage','Australian informal usage'],rows:[['flat','apartment','flat / apartment'],['lift','elevator','lift'],['afternoon','afternoon','arvo'],['flip-flops','flip-flops','thongs']]}],pitfall:'These are common preferences, not exclusive national rules. Arvo and thongs are informal or context-dependent; vocabulary alone does not identify an accent.',examples:[['Could you explain what that means here?','Ask for clarification without judging the speaker.']]},
 pt:{steps:['To describe an ongoing action, conjugate estar for the subject.','Brazil commonly uses estar + gerund; Portugal commonly uses estar a + infinitive. Both patterns occur with regional variation.'],tables:[{caption:'An action in progress: Brazil and Portugal',headers:['Subject','Brazil: estudar','Portugal: estudar'],rows:[['eu','estou estudando','estou a estudar'],['tu','estás estudando','estás a estudar'],['você / ele / ela','está estudando','está a estudar'],['nós','estamos estudando','estamos a estudar'],['vocês / eles / elas','estão estudando','estão a estudar']]}],pitfall:'Gerunds also occur in Portugal. Tu and você vary in frequency, agreement and social meaning across communities; they are not interchangeable in every setting.',examples:[['Estou esperando o ônibus.','A common Brazilian way to say I am waiting for the bus.'],['Estou a esperar o autocarro.','A common Portuguese way to say I am waiting for the bus.']]},
 ja:{steps:['Interpret Kansai expressions using the situation and relationship.','Choose formal written Japanese for a formal report; regional everyday forms remain appropriate in many conversations.'],tables:[{caption:'Kansai expressions in context',headers:['Kansai expression','Standard equivalent','Meaning'],rows:[['おおきに','ありがとう','Thanks'],['ほんま','本当','Really / true'],['あかん','だめ','Not good / not allowed'],['なんぼ','いくら','How much'],['ほな','じゃあ / それでは','Well then']]}],pitfall:'Kansai is not one uniform dialect. Meanings, frequency and intonation vary by community, age and context. A written equivalent does not establish an accent.',examples:[['これ、なんぼですか。','How much is this?'],['ほな、また明日。','Well then, see you tomorrow.']]}
};
for(const course of varietyCourses)if(comparisonTables[course.language])course.breakdown=comparisonTables[course.language];

// Do not keep a known inaccurate synthetic Kansai model in pronunciation practice.
// Originals are linked, not copied, extracted or represented as our recordings.
const kansai=varietyCourses.find(c=>c.language==='ja');
kansai.contentVersion=3;
kansai.nativeReferences=[
 {label:'おおきに · Osaka native speaker',credit:'SBS Japanese · Kate Onomichi',url:'https://www.sbs.com.au/language/japanese/ja/podcast-episode/ookini-the-road-to-osaka-ben-master-1/nd1v7oror'},
 {label:'なんぼ · Osaka native speaker',credit:'SBS Japanese · Kate Onomichi',url:'https://www.sbs.com.au/language/japanese/ja/podcast-episode/nanbo-the-road-to-osaka-ben-master-2/65w3ymt06'}
];
kansai.explanation='Explore Kansai expressions in context. For intonation, listen to the linked original recordings by an Osaka native speaker. Unreviewed AI Kansai audio has been removed. Regional usage varies by speaker and setting.';
for(const i of [0,4]){const q=kansai.questions[i];q.context=q.audio;delete q.audio;delete q.audioLocale;delete q.audioKind;delete q.audioRegion;delete q.listeningTarget;q.type='interpretation';}
kansai.questions[0].nativeReference=kansai.nativeReferences[0];
kansai.questions[5].nativeReference=kansai.nativeReferences[1];
