import {languageInfo} from './languages.mjs';
export const expandedSoundChapters=[],expandedSoundLessons=[],expandedSoundTransfer={};
const data={
fr:[
 ['French vowel contrasts','Distinguish /y/ in tu from /u/ in tout: keep the tongue forward for /y/ while rounding the lips. Compare /e/ and /ɛ/ without turning them into English diphthongs.',[['tu','tout'],['dessus','dessous'],['fée','fait']],'Tu as tout mis dessus.'],
 ['Nasal vowels and oral vowels','In a nasal vowel, air resonates through the nose and mouth. Do not automatically add a separate n. Compare beau/bon and bas/banc. Contemporary regional varieties differ, especially in brun/brin.',[['beau','bon'],['bas','banc'],['peau','pont']],'Le bon pain est sur le banc.'],
 ['French r and meaningful consonants','The common France French r is produced near the uvula and varies with context. Keep it distinct from l; listen without forcing the throat. Final consonants may be silent or pronounced depending on the word.',[['roue','loup'],['rue','lu'],['riz','lit']],'La roue est près de la rue.'],
 ['Liaison, enchaînement and phrase groups','A usually silent consonant can surface in a required liaison such as les amis. Enchaînement links an already pronounced final consonant. Liaison is not automatic everywhere: it is prohibited after et. Group by meaning rather than stressing every word equally.',[['les amis','les livres'],['un petit ami','un petit livre'],['elle arrive','elle travaille']],'Les amis arrivent et Éva reste.']
],
de:[
 ['Long and short vowels','Vowel length and quality distinguish words such as bieten/bitten. A doubled consonant in spelling usually signals a preceding short vowel; it is not an Italian-style extra-long consonant.',[['bieten','bitten'],['Miete','Mitte'],['Staat','Stadt']],'Wir bieten eine Wohnung zur Miete.'],
 ['Umlaut vowel quality','Ö and ü are rounded front vowels. Keep lip rounding while moving the tongue forward; compare schon/schön and long fühlen with short füllen. Long ä varies across standard speakers.',[['schon','schön'],['fühlen','füllen'],['Ofen','Öfen']],'Die schönen Öfen stehen schon hier.'],
 ['Ich-Laut, ach-Laut and s sounds','The fricative in ich differs from the one in ach. Initial s before a vowel is often voiced; ß and ss represent voiceless s in their spelling patterns. St and sp at the start of a stem are commonly pronounced with /ʃ/.', [['ich','ach'],['reisen','reißen'],['Stein','Schein']],'Ich reise durch die Stadt.'],
 ['Final devoicing and word stress','Word-final voiced obstruents are normally devoiced, so Rad and Rat can sound identical in isolation. Inflected forms reveal differences. Inseparable prefixes such as be- are usually unstressed; many separable prefixes are stressed.',[['Räder','Räte'],['bieten','gebieten'],['ankommen','bekommen']],'Die Räder kommen morgen an.']
],
it:[
 ['Consonant length','Consonant length distinguishes words. Hold or articulate the doubled consonant longer without inserting an extra vowel: pala/palla and fato/fatto.',[['pala','palla'],['fato','fatto'],['pena','penna']],'La penna è vicino alla palla.'],
 ['Italian vowels and lexical stress','Keep unstressed vowels relatively clear. Written final accents identify stressed endings such as città. Open and close e/o contrasts vary by word and regional usage; native listening matters.',[['papa','papà'],['pero','però'],['meta','metà']],'Papà vive in quella città.'],
 ['Palatal consonants and spelling','Gn represents a palatal nasal as in sogno; gli before a vowel often represents a palatal lateral as in figlio, with lexical exceptions. C/g change before e/i; ch/gh preserve hard sounds.',[['cena','china'],['giro','ghiro'],['sogno','sono']],'Mio figlio fa un bel sogno.'],
 ['Connected phrases without extra vowels','Link words into meaningful phrases while preserving lexical stress and meaningful consonant length. Apostrophes can mark elision, as in l’amica. Not every written apostrophe marks an extra syllable.',[['lago','lago blu'],['un amico','unica'],["l'amica",'la mica']],'Un amico arriva con la mia amica.']
],
zh:[
 ['Mandarin tone contrasts','Tone is lexical. Compare mā/má/mǎ/mà with the same segments. A neutral tone has no single fixed pitch contour. Listen to the native model rather than reading tone marks as English stress.',[['妈','马'],['买','卖'],['书','树']],'妈妈买了一本书。'],
 ['Aspiration and tongue position','Pinyin b/d/g are unaspirated and p/t/k aspirated; the contrast is not simply English voicing. Distinguish j/q/x from zh/ch/sh, with different tongue positions.',[['八','怕'],['鸡','七'],['资','知']],'他吃了七个包子。'],
 ['Final n, ng and rounded ü','Keep final -n and -ng distinct. Pinyin ü is a rounded front vowel, not u. Its dots are omitted after j/q/x and in yu by spelling convention.',[['心','星'],['山','商'],['路','绿']],'星星在山的上方。'],
 ['Tone changes in connected phrases','Third-tone sandhi normally makes the first of two third tones rising. 一 and 不 also change tone in specified contexts. The character and lexical meaning remain the same. Do not claim ASR text matching evaluates pitch.',[['你好','您好'],['不去','不来'],['一天','一件']],'你好，我今天不去。']
],
ko:[
 ['Plain, aspirated and tense consonants','Korean distinguishes plain, aspirated and tense consonants. These are not simple English voiced/unvoiced pairs. Compare 달/탈/딸 with native audio.',[['달','탈'],['달','딸'],['불','풀']],'딸이 달을 봐요.'],
 ['Vowel contrasts and modern variation','Keep 어/오 and 으/우 distinct. Many contemporary speakers merge 애/에, so this course does not require a universal acoustic distinction between them. Romanisation is only a reading aid.',[['어','오'],['으','우'],['벌','볼']],'물을 마시고 문을 열어요.'],
 ['Batchim and linking','Final spellings reduce to a limited set of surface sounds before a pause or consonant. Before vowel-initial particles, a final consonant can link. Preserve the spelling in written answers.',[['옷이','옷도'],['밥을','밥도'],['꽃이','꽃도']],'꽃이 있고 밥도 있어요.'],
 ['Sound changes across syllables','Nasal assimilation and palatalisation create regular differences between spelling and pronunciation. 한국말 is commonly [한궁말], 같이 [가치]. Listen to complete words in phrase groups.',[['한국말','한국어'],['같이','가시'],['국물','국어']],'친구와 같이 한국말을 공부해요.']
],
ar:[
 ['Short vowels and long vowels','Vowel length can distinguish Arabic words. Keep short a/i/u distinct from long ā/ī/ū; do not merely increase volume. The model is Modern Standard Arabic.',[['عَلَم','عالَم'],['مَلِك','مالِك'],['جَمَل','جَمال']],'هذا عالم واسع.'],
 ['Consonant doubling and shadda','Shadda doubles a consonant. Compare دَرَسَ, he studied, with دَرَّسَ, he taught. Keep the consonant longer without inserting a new vowel.',[['دَرَسَ','دَرَّسَ'],['عَلِمَ','عَلَّمَ'],['حَمَلَ','حَمَّلَ']],'هو درّس اللغة العربية.'],
 ['Distinct consonant places','ح and ه are distinct; ع differs from hamza. ق and ك have different places of articulation. These are MSA contrasts, with regional variants in everyday dialects.',[['حَرَم','هَرَم'],['قلب','كلب'],['عَلَم','أَلَم']],'هذا قلب وليس كلبا.'],
 ['The article and connected reading','Before a sun letter, the l of الـ assimilates to the following consonant, as in الشمس. Before a moon letter it remains, as in القمر. Short case endings can be omitted in pause; connected formal reading may retain them.',[['الشمس','القمر'],['الطالب','الكتاب'],['النور','الباب']],'الشمس والقمر في السماء.']
]
};
for(const [language,units] of Object.entries(data)){
 const locale=languageInfo(language).locale;
 for(let group=0;group<2;group++){
  const id=`${language}-sound-v1-${group}`,level=group?'A2':'A1',meta={language,locale,level,specialist:true,curriculumVersion:3};
  expandedSoundChapters.push({...meta,id,title:group?'Pronunciation: rhythm & phrases':'Pronunciation: build clear sounds',kind:'Pronunciation',goal:'Listen, shape the sound, practise in context and compare your recording.'});
  const lessons=units.slice(group*2,group*2+2).map(([title,explanation,pairs,example],i)=>{
   const lessonId=id+'-'+i,questions=pairs.flatMap(([a,b],j)=>[a,b].map((word,k)=>({id:lessonId+'-'+j+'-'+k,sourceLesson:lessonId,prompt:'Listen. Which word or phrase do you hear?',options:[a,b],optionsLang:locale,answer:k,audio:word,audioLocale:locale,note:explanation})));
   questions.push({id:lessonId+'-dictation',sourceLesson:lessonId,type:'text',prompt:'Listen and write the full model phrase.',answer:example,accepted:[example],audio:example,audioLocale:locale,note:explanation});
   return {...meta,id:lessonId,chapter:id,title,skill:'Pronunciation',minutes:12,explanation,example,exampleLang:locale,soundGuide:{pairs},speak:'Listen to the full model. Repeat slowly, then record and compare the feature described here. Speech recognition checks words, not individual sounds.',pronunciationTarget:example,questions};
  });
  expandedSoundLessons.push(...lessons);expandedSoundTransfer[id]=lessons.flatMap(l=>l.questions.filter(q=>q.type!=='text'));
  expandedSoundLessons.push({...meta,id:id+'-check',chapter:id,title:'Sound check: '+(group?'rhythm & phrases':'clear sounds'),skill:'Review',checkpoint:true,minutes:6,explanation:'Review both sound lessons. Listening results measure recognition; recordings support reflection rather than phoneme scoring.',example:lessons[0].example,exampleLang:locale,questions:lessons.flatMap(l=>l.questions.filter(q=>q.type!=='text').slice(0,2))});
 }
}
