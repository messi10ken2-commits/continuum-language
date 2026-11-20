// Authored v4 replacements: learners produce usable language, not grammar notation.
const text=(prompt,answer,note,accepted=[answer])=>({type:'text',mode:'cloze',prompt,answer,accepted,note});
const audio=(prompt,recording,options,answer,note,locale)=>({mode:'application',prompt,audio:recording,audioLocale:locale,options,answer,note,optionsLang:'en-US'});
export const practicalFormQuestions={
 'pt-a2-v2-lesson-12':{
  'entry:3:context':text('You planned to cook, but ended up ordering food. Complete with acabar in the past + the gerund of pedir: Nós ____ comida.','acabamos pedindo','Acabamos pedindo comida = We ended up ordering food. Acabar + gerund expresses the eventual outcome; acabamos de pedir means we have just ordered.')
 },
 'a2-time-patterns':{
  'entry:2:context':text('You started studying Spanish two years ago and still study it. Complete with llevar (yo): ____ dos años estudiando español.','Llevo','Llevo dos años estudiando español describes an activity continuing over a period up to now.')
 },
 'en-a1-v2-lesson-5':{
  'table:0:0:1':text('Ask a colleague about their routine. Complete: ____ you work on Saturdays?','Do','Use do with you and the base verb work.'),
  'table:0:1:1':text('Ask about Maya: ____ Maya work on Saturdays?','Does','Use does with a third-person singular subject; keep work in the base form.'),
  'table:0:2:1':text('Ask where Leo lives. Complete: Where ____ Leo live?','does','Where + does + subject + base verb asks about location.'),
  'table:0:3:1':text('Ask which person works here. Use work: Who ____ here?','works','Who is the subject. Use works directly; do not add does in this neutral subject question.')
 },
 'en-a2-v2-lesson-6':{
  'table:0:0:1':text('Put cook in the past progressive: I ____ dinner when the doorbell rang.','was cooking','Was cooking sets the activity in progress; rang presents the event during it.'),
  'table:0:2:1':text('Both activities were in progress. Use study in the past progressive: I was cooking while she ____.','was studying','While links two activities in progress. She takes was, followed by studying.'),
  'table:0:3:1':text('Say that sleep was NOT in progress. Use the negative past progressive: At midnight, I ____.','was not sleeping','Use was not + sleeping. Wasn’t sleeping is also natural.',['was not sleeping',"wasn't sleeping"]),
  'table:0:4:1':text('Ask about yesterday at eight. Complete with the past form of be: ____ you waiting for the bus?','Were','Use were before you in a past-progressive question.')
 },
 'en-a2-v2-lesson-3':{
  'entry:3:recall':audio('Listen to the bird name. Which description matches the word?', 'blackbird', ['A named species of bird','Any bird whose feathers happen to be black'],0,'Blackbird is a compound noun with its main stress on black. A black bird is a descriptive phrase.', 'en-US')
 },
 'ja-a1-v2-lesson-1':{
  'entry:3:recall':text('Tell someone your hobby is photography. Complete: 趣味は____です。','写真','趣味は写真です。means My hobby is photography. Fill the pattern with the actual hobby.',['写真','しゃしん'])
 },
 'ja-a1-v2-lesson-5':{
  'table:0:5:1':[
   text('You are writing in a casual diary. Use the dictionary form of します: 毎日、運動を____。','する','する is the dictionary form of します.'),
   text('Use the dictionary form of 来ます: 友達が明日____。','来る','来る（くる）is irregular. It means come.',['来る','くる'])],
  'table:0:5:2':[
   text('Complete the polite form: 毎日、運動を____ます。','し','する changes to し before ます.'),
   text('Type the missing part in hiragana: 友達が明日____ます。','き','来ます is read きます. The reading changes from くる to きます.')],
  'table:0:5:3':[
   text('Use する in the polite non-past: 毎日、運動を____。','します','する becomes します in polite speech.'),
   text('Use 来る in the polite non-past: 友達が明日____。','来ます','来る becomes 来ます（きます）.',['来ます','きます'])]
 },
 'ja-a2-v2-lesson-3':{
  'entry:0:recall':audio('Listen. Who is being mentioned?','おばあさん',['A grandmother or elderly woman','An aunt or middle-aged woman'],0,'おばあさん has a long あ. おばさん has a short あ and refers to an aunt or middle-aged woman.','ja-JP'),
  'entry:1:recall':audio('Listen. Who is being mentioned?','おじさん',['An uncle or middle-aged man','A grandfather or elderly man'],0,'おじさん has a short い sound. おじいさん has a long い sound.','ja-JP'),
  'entry:2:recall':audio('Listen. Which place does the speaker name?','高校',['High school','Here'],0,'高校（こうこう）has two long vowels. ここ means here and has short vowels.','ja-JP')
 },
 'ja-a2-v2-lesson-5':{
  'table:0:0:2':[
   text('Ask someone to buy water. Use 買う in the て-form: 水を____ください。','買って','買う → 買って: う changes to って.',['買って','かって']),
   text('Ask someone to wait. Use 待つ: ここで____ください。','待って','待つ → 待って: つ changes to って.',['待って','まって']),
   text('Ask someone to go home. Use 帰る: 家に____ください。','帰って','帰る is a godan verb: 帰って, not 帰て.',['帰って','かえって'])],
  'table:0:1:2':[
   text('Ask someone to read a book. Use 読む: この本を____ください。','読んで','読む → 読んで: む changes to んで.',['読んで','よんで']),
   text('Describe playing and then returning home. Use 遊ぶ: 公園で____、家に帰りました。','遊んで','遊ぶ → 遊んで: ぶ changes to んで.',['遊んで','あそんで']),
   text('Join these events using 死ぬ in the て-form: 魚が____、子どもが泣きました。','死んで','死ぬ → 死んで: ぬ changes to んで.',['死んで','しんで'])],
  'table:0:2:2':text('Ask someone to write their name. Use 書く: 名前を____ください。','書いて','書く → 書いて: く normally changes to いて.',['書いて','かいて']),
  'table:0:3:2':text('Describe swimming and then resting. Use 泳ぐ: プールで____、休みました。','泳いで','泳ぐ → 泳いで: ぐ changes to いで.',['泳いで','およいで']),
  'table:0:4:2':text('Ask someone to speak slowly. Use 話す: ゆっくり____ください。','話して','話す → 話して: す changes to して.',['話して','はなして']),
  'table:0:5:2':text('Ask someone to go to the station. Use 行く: 駅に____ください。','行って','行く is the exception: 行って, not 行いて.',['行って','いって'])
 },
 'ja-b1-v2-lesson-2':{
  'table:0:4:1':[
   text('Make a plain statement using 学生: 彼は____。','学生だ','A noun predicate takes だ in this plain statement.',['学生だ','がくせいだ']),
   text('Make a plain statement using 静か: この部屋は____。','静かだ','A な-adjective takes だ in this plain statement.',['静かだ','しずかだ'])],
  'table:0:4:2':[
   text('Say he might be a student. Use 学生 + かもしれません: 彼は____。','学生かもしれません','Remove だ before かもしれません.',['学生かもしれません','がくせいかもしれません']),
   text('Say this room might be quiet. Use 静か + かもしれません: この部屋は____。','静かかもしれません','Remove だ after a な-adjective before かもしれません.',['静かかもしれません','しずかかもしれません'])]
 },
 'ja-c1-v2-lesson-4':{
  'entry:2:recall':text('Report a remaining limitation: However, staff shortages remain an issue. Complete with 課題 and 残る in polite form: ただし、人員不足が____。','課題として残ります','ただし introduces a qualification. 課題として残ります identifies an issue that remains unresolved.',['課題として残ります','かだいとしてのこります'])
 }
};
