// Creator-hosted videos stay in the official YouTube player. Practice below is
// independently authored; it is deliberately not represented as a transcript.
const definitions=[
 {language:'es',locale:'es-ES',key:'introductions',title:'Introduce yourself in Spanish',youtubeId:'JsGQizTuPSo',credit:'Easy Spanish',poster:'/lesson-media/city.jpg',goal:'Watch native speakers introduce themselves in slow Spanish. Listen for names and questions, then practise your own introduction.',phrases:[['¿Cómo te llamas?','What is your name?'],['Me llamo Ana.','My name is Ana.'],['¿De dónde eres?','Where are you from?'],['Soy de México.','I am from Mexico.']],questions:[
 ['Choose the question that asks someone’s name.',['¿Cómo te llamas?','¿Cómo estás?','¿Dónde vives?'],0,'¿Cómo te llamas? asks for a name. ¿Cómo estás? asks how someone is.'],
 ['Complete: Me ___ Ana.',['llamas','llamo','llama'],1,'Use me llamo to give your own name; te llamas refers to the person you are addressing.'],
 ['Which reply answers “¿De dónde eres?”?',['Tengo veinte años.','Me llamo Ana.','Soy de México.'],2,'De dónde asks about origin. Soy de introduces where you are from.'],
 ['Ask where someone lives now.',['¿Dónde vives?','¿De dónde eres?','¿Cómo te llamas?'],0,'¿Dónde vives? asks about your current home, which may differ from your place of origin.'],
 ['Choose a natural first-meeting greeting.',['Hasta mañana.','Mucho gusto.','Buenas noches y adiós.'],1,'Mucho gusto means pleased to meet you.'],
 ['Complete: ___ de México.',['Estoy','Tengo','Soy'],2,'Use ser for origin: soy de México.'],
 ['You did not catch a name. What can you say?',['¿Puedes repetir, por favor?','¿Cuántos años tienes?','¿Dónde trabajas?'],0,'Ask the person to repeat: ¿Puedes repetir, por favor?'],
 ['Choose the introduction with both a name and an origin.',['Me llamo Ana y tengo veinte años.','Me llamo Ana y soy de México.','Soy de México y vivo en Madrid.'],1,'Me llamo supplies the name; soy de supplies the origin.']
 ]},
 {language:'pt',locale:'pt-BR',key:'introductions',title:'Introduce yourself in Brazilian Portuguese',youtubeId:'3ggDuePqcAo',credit:'Easy Languages · Brazilian Portuguese',poster:'/lesson-media/cafe.jpg',goal:'Listen to introductions in Brazilian Portuguese. Replay short sections, notice the rhythm, then practise names and origins.',phrases:[['Como você se chama?','What is your name?'],['Eu me chamo Ana.','My name is Ana.'],['De onde você é?','Where are you from?'],['Eu sou do Brasil.','I am from Brazil.']],questions:[
 ['Which question asks someone’s name?',['Como você se chama?','Como você está?','Onde você mora?'],0,'Como você se chama? asks for a name; Como você está? asks how someone is.'],
 ['Complete: Eu me ___ Ana.',['chama','chamo','chamam'],1,'Eu takes chamo. With você, use se chama.'],
 ['Which reply gives your country of origin?',['Eu tenho vinte anos.','Eu me chamo Ana.','Eu sou do Brasil.'],2,'Sou do Brasil gives your origin. Do combines de and o.'],
 ['Ask where someone lives now.',['Onde você mora?','De onde você é?','Como você se chama?'],0,'Morar means to live or reside; this asks for the current home.'],
 ['Choose a natural response when introduced to someone.',['Até amanhã.','Prazer!','Boa viagem!'],1,'Prazer! is a common short way to say pleased to meet you.'],
 ['Complete: Você ___ de Portugal?',['sou','somos','é'],2,'Você uses é. Sou is the eu form; somos is the nós form.'],
 ['You need the speaker to repeat. Choose the request.',['Pode repetir, por favor?','Você mora aqui?','Qual é o seu nome?'],0,'Pode repetir, por favor? politely asks for repetition.'],
 ['Which introduction gives both a name and a home city?',['Sou do Brasil e tenho vinte anos.','Meu nome é Ana e moro em São Paulo.','Moro em São Paulo e trabalho aqui.'],1,'Meu nome é introduces a name, and moro em gives the city where you live.']
 ]},
 {language:'ja',locale:'ja-JP',key:'slow-conversation',title:'Follow a slow Japanese conversation',youtubeId:'hySkqIAFRCs',credit:'Japanese with Shun',poster:'/lesson-media/japan.jpg',goal:'Listen to a relaxed beginner conversation. Start with two or three minutes, pause after each turn and repeat a phrase you recognise. The full video is optional.',phrases:[['はじめまして。','Nice to meet you (at a first meeting).'],['お名前は何ですか。','What is your name?'],['日本から来ました。','I come from Japan.'],['もう一度お願いします。','Once more, please.']],questions:[
 ['Choose a greeting for meeting someone for the first time.',['はじめまして。','おかえりなさい。','いただきます。'],0,'はじめまして is a first-meeting greeting. おかえりなさい welcomes someone back; いただきます is said before eating.'],
 ['What does お名前は何ですか ask for?',['A home address','A name','An age'],1,'名前（なまえ）means name. The お makes the wording polite.'],
 ['Complete “I come from Japan”: 日本___来ました。',['を','に','から'],2,'から marks the starting place or origin. 日本から means from Japan.'],
 ['You want the speaker to repeat. Choose the request.',['もう一度お願いします。','お元気ですか。','ありがとうございます。'],0,'もう一度（もういちど）means once more. お願いします makes a polite request.'],
 ['Which asks the speaker to speak slowly?',['ここに住んでいます。','ゆっくり話してください。','日本から来ました。'],1,'ゆっくり means slowly; 話してください means please speak.'],
 ['Choose a natural response to “お元気ですか。”',['東京です。','田中です。','はい、元気です。'],2,'元気ですか asks how you are. はい、元気です means yes, I am well.'],
 ['What does “東京に住んでいます。” communicate?',['I live in Tokyo.','I am going to Tokyo.','I came from Tokyo.'],0,'住んでいます（すんでいます）describes where someone lives; に marks the place of residence.'],
 ['Which politely says you did not understand?',['分かりました。','すみません、分かりません。','よろしくお願いします。'],1,'分かりません means I do not understand; すみません adds a polite apology.']
 ]}
];
const id=d=>`${d.language}-conversation-v1-${d.key}`;
export const multilingualConversationChapters=definitions.map(d=>({id:id(d)+'-chapter',level:'A1',language:d.language,locale:d.locale,specialist:true,curriculumVersion:2,title:d.title,goal:d.goal,kind:'Real conversations'}));
export const multilingualConversationLessons=definitions.map(d=>({id:id(d),chapter:id(d)+'-chapter',level:'A1',language:d.language,locale:d.locale,specialist:true,curriculumVersion:2,title:d.title,skill:'Listening',minutes:15,explanation:d.goal,example:'Watch and listen, then try the related language practice. The practice phrases are original examples, not a transcript or a quiz on the speakers’ personal details.',exampleLang:'en-US',conversation:{provider:'youtube',youtubeId:d.youtubeId,poster:d.poster,alt:'Illustrative scene for conversation practice',source:`https://www.youtube.com/watch?v=${d.youtubeId}`,credit:d.credit,phrases:d.phrases,hint:d.goal+' Use the player settings for speed and captions when available.'},questions:d.questions.map(([prompt,options,answer,note])=>({prompt,options,answer,note,video:true,languagePractice:true}))}));
