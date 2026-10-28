import {languageInfo} from './languages.mjs';
export const expandedScriptChapters=[],expandedScriptLessons=[];
// Each entry includes an explicit native audio string. Pinyin/romanisation/IPA
// are visual reading aids and never submitted to the native voice as English.
const entries=text=>text.trim().split('\n').map(line=>{const [glyph,reading,audio,meaning]=line.split('|');if(!glyph||!reading||!audio)throw Error('Incomplete script entry');return {glyph,reading,audio,meaning};});
function chapter(language,key,title,goal,units){
 const locale=languageInfo(language).locale,id=`${language}-script-v1-${key}`,meta={language,locale,level:'A1',specialist:true,curriculumVersion:3};
 expandedScriptChapters.push({...meta,id,title,goal,kind:'Characters'});
 for(const [index,[title,explanation,text,guidance]] of units.entries()){
  const characters=entries(text),lessonId=id+'-'+index;
  const questions=characters.flatMap((entry,i)=>{
   const wrong=characters.filter(x=>x.reading!==entry.reading).slice(0,2),options=[entry.reading,...wrong.map(x=>x.reading)],offset=i%options.length,rotated=[...options.slice(offset),...options.slice(0,offset)];
   if(options.length<2)throw Error('Insufficient script contrasts');
   return [{prompt:`Choose the reading taught here for “${entry.glyph}”.`,context:entry.glyph,contextLang:locale,options:rotated,optionsLang:'en-US',answer:(options.length-offset)%options.length,note:`${entry.glyph}: ${entry.reading}. ${explanation}`,sourceLesson:lessonId},
    {type:'text',prompt:`Listen, then type the character or form. ${[entry.reading,entry.meaning].filter(Boolean).join('. ').replaceAll(entry.glyph,'[form]')}`,answer:entry.glyph,accepted:[entry.glyph],answerMatch:'exact',caseSensitive:true,audio:entry.audio,audioLocale:locale,note:'Compare the typed form with the model. '+explanation,sourceLesson:lessonId}];
  });
  expandedScriptLessons.push({...meta,id:lessonId,chapter:id,title,skill:'Characters',minutes:18,explanation,characterGuidance:guidance||explanation,example:characters.slice(0,5).map(x=>x.glyph).join(' '),exampleLang:locale,characters,questions});
 }
}
chapter('zh','pinyin','Mandarin pinyin and tones','Connect Mandarin sounds, pinyin and meaningful spoken words.',[
 ['Pinyin initials in words','Pinyin letters represent Mandarin sounds, not English letter names. The b/d/g initials are unaspirated; p/t/k are aspirated. J/q/x and zh/ch/sh use different tongue positions. Each audio model below is a whole word.',`
八|bā|八|eight
怕|pà|怕|fear
大|dà|大|big
他|tā|他|he
哥|gē|哥|older brother
可|kě|可|possible
鸡|jī|鸡|chicken
七|qī|七|seven
西|xī|西|west
知|zhī|知|know
吃|chī|吃|eat
诗|shī|诗|poem
日|rì|日|day
字|zì|字|written character
词|cí|词|word
四|sì|四|four
妈|mā|妈|mother
风|fēng|风|wind
你|nǐ|你|you
来|lái|来|come
好|hǎo|好|good`],
 ['Finals, ü and syllable spelling','Finals contain a vowel or vowel combination and sometimes -n or -ng. Keep ü distinct from u; after j/q/x and in yu the dots are omitted by spelling convention. I has different phonetic values in ji, zi and zhi. This is not an exhaustive pronunciation key.',`
衣|yī|衣|clothing
乌|wū|乌|a crow or black in compounds
鱼|yú|鱼|fish
女|nǚ|女|female
路|lù|路|road
绿|lǜ|绿|green
买|mǎi|买|buy
猫|māo|猫|cat
杯|bēi|杯|cup
狗|gǒu|狗|dog
三|sān|三|three
山|shān|山|mountain
心|xīn|心|heart
星|xīng|星|star
中|zhōng|中|middle
学|xué|学|study`],
 ['Four tones and a neutral syllable','The four citation tones are high level, rising, low/dipping and falling. A third tone is often low without a full rise in connected speech; a neutral syllable is unstressed and depends on context. Tone marks belong on the main vowel according to pinyin spelling rules.',`
妈|mā|妈|mother: first tone
麻|má|麻|hemp: second tone
马|mǎ|马|horse: third tone
骂|mà|骂|scold: fourth tone
妈妈|māma|妈妈|mother: neutral second syllable
吗|ma|吗|question particle: neutral tone`],
 ['Connected tones and lexical spelling','Pinyin normally records lexical tones in ordinary dictionaries. In speech, a third tone before another third tone is normally rising; 一 and 不 change in specified contexts. Learn the complete phrase and do not treat the altered surface tone as a new character.',`
你好|nǐ hǎo → ní hǎo in connected speech|你好|hello
不去|bù qù → bú qù in connected speech|不去|not going
不来|bù lái|不来|not coming
一个|yī ge → yí ge in common connected speech|一个|one item: 个 is often neutral
一天|yī tiān → yì tiān in connected speech|一天|one day
很好|hěn hǎo → hén hǎo in connected speech|很好|very good`]
]);
chapter('zh','hanzi','Simplified Chinese characters in context','Recognise components and connect common characters to words and meanings.',[
 ['Common characters and components','A character may be a word or part of a word. Components can suggest meaning or sound but are not reliable decoding rules. The reading here is for the specific shown context; many characters have other readings.',`
人|rén|人|person
口|kǒu|口|mouth
日|rì|日|sun or day
月|yuè|月|moon or month
山|shān|山|mountain
水|shuǐ|水|water
火|huǒ|火|fire
木|mù|木|wood or tree in compounds
林|lín|林|woods
好|hǎo|好|good
明|míng|明|bright in compounds
休息|xiūxi|休息|rest: recognise 亻 in 休`],
 ['Read characters as meaningful words','Learn character readings in whole words: 行 is háng in 银行 but xíng in 行走. Simplified and Traditional forms are related writing systems, not different Mandarin tones. This course uses Simplified forms.',`
中国|Zhōngguó|中国|China
中文|Zhōngwén|中文|Chinese language or writing
学生|xuésheng|学生|student
学校|xuéxiào|学校|school
朋友|péngyou|朋友|friend
银行|yínháng|银行|bank: 行 is háng
行走|xíngzǒu|行走|walk: 行 is xíng
车站|chēzhàn|车站|station
电话|diànhuà|电话|telephone
谢谢|xièxie|谢谢|thank you`]
]);
chapter('ko','letters','Hangul consonants and vowels','Read letters in syllable blocks and connect them to native audio.',[
 ['Basic consonant letters','The 14 basic consonant letters appear within syllable blocks. Initial ㅇ is silent; final ㅇ represents /ŋ/. Plain consonants vary with position and context. The audio models are Korean letter names, not English approximations.',`
ㄱ|giyeok|기역|basic consonant
ㄴ|nieun|니은|basic consonant
ㄷ|digeut|디귿|basic consonant
ㄹ|rieul|리을|basic consonant
ㅁ|mieum|미음|basic consonant
ㅂ|bieup|비읍|basic consonant
ㅅ|siot|시옷|basic consonant
ㅇ|ieung|이응|silent initially; /ŋ/ finally
ㅈ|jieut|지읒|basic consonant
ㅊ|chieut|치읓|aspirated consonant
ㅋ|kieuk|키읔|aspirated consonant
ㅌ|tieut|티읕|aspirated consonant
ㅍ|pieup|피읖|aspirated consonant
ㅎ|hieut|히읗|basic consonant`],
 ['Ten basic vowel letters','Korean has ten basic vowel letters and additional compound letters. A vertical vowel sits to the right of the initial consonant; a horizontal vowel sits below it. Isolated vowel syllables use silent initial ㅇ.',`
아|a|아|ㅏ in a syllable
야|ya|야|ㅑ in a syllable
어|eo|어|ㅓ in a syllable
여|yeo|여|ㅕ in a syllable
오|o|오|ㅗ in a syllable
요|yo|요|ㅛ in a syllable
우|u|우|ㅜ in a syllable
유|yu|유|ㅠ in a syllable
으|eu|으|ㅡ in a syllable
이|i|이|ㅣ in a syllable`]
]);
chapter('ko','blocks','Hangul blocks and additional letters','Build readable syllables and distinguish plain, aspirated and tense consonants.',[
 ['Syllable blocks and final consonants','A block has an initial and a vowel, with an optional final consonant or cluster. Final letters are called 받침. Initial ㅇ is silent; in 강 the final ㅇ is /ŋ/. The pad is shape practice, not stroke-order instruction.',`
가|ga|가|ㄱ + ㅏ
고|go|고|ㄱ + ㅗ
간|gan|간|ㄱ + ㅏ + ㄴ
강|gang|강|ㄱ + ㅏ + ㅇ
나|na|나|ㄴ + ㅏ
누|nu|누|ㄴ + ㅜ
문|mun|문|ㅁ + ㅜ + ㄴ: door
눈|nun|눈|ㄴ + ㅜ + ㄴ: eye or snow`],
 ['Tense consonants and compound vowels','The full initial inventory includes five tense consonants ㄲ ㄸ ㅃ ㅆ ㅉ. Compound vowel letters include ㅐ ㅔ ㅒ ㅖ ㅘ ㅙ ㅚ ㅝ ㅞ ㅟ ㅢ. In many contemporary speakers ㅐ and ㅔ merge; do not claim that text recognition proves a phonetic distinction.',`
까|kka|까|tense ㄲ
따|tta|따|tense ㄸ
빠|ppa|빠|tense ㅃ
싸|ssa|싸|tense ㅆ
짜|jja|짜|tense ㅉ
애|ae|애|ㅐ
에|e|에|ㅔ
얘|yae|얘|ㅒ
예|ye|예|ㅖ
와|wa|와|ㅘ
왜|wae|왜|ㅙ
외|oe|외|ㅚ; often realised like we
워|wo|워|ㅝ
웨|we|웨|ㅞ
위|wi|위|ㅟ
의|ui|의|ㅢ; pronunciation varies by position and function`]
]);
chapter('ko','reading','Hangul in connected words','Read meaningful words, batchim and linking in context.',[
 ['Final sounds and linking','Several final spellings share a surface sound before a pause or consonant. Before a vowel-initial grammatical ending, the final consonant often links to the next syllable. Keep spelling even when pronunciation changes.',`
옷|ot|옷|clothes; final ㅅ sounds [t̚] in isolation
옷이|osi|옷이|clothes with subject particle; [오시]
꽃|kkot|꽃|flower; final ㅊ sounds [t̚] in isolation
꽃이|kkochi|꽃이|flower with subject particle; [꼬치]
밥|bap|밥|cooked rice; final [p̚]
밥을|babeul|밥을|rice with object particle; [바블]
국|guk|국|soup; final [k̚]
국이|gugi|국이|soup with subject particle; [구기]`],
 ['Read whole words and common sound changes','Spelling and surface pronunciation differ in regular ways. Nasal assimilation gives 한국말 [한궁말]; 같이 has palatalisation [가치]. Learn words with native audio and context rather than guessing from romanisation.',`
한국말|hangungmal in pronunciation|한국말|Korean language; written 한국말
같이|gachi in pronunciation|같이|together; written 같이
학교|hakkkyo in pronunciation|학교|school; written 학교
친구|chingu|친구|friend
안녕하세요|annyeonghaseyo|안녕하세요|polite greeting
감사합니다|gamsahamnida in pronunciation|감사합니다|thank you; [감사함니다]`]
]);
chapter('ar','alphabet','Arabic alphabet with native audio','Recognise 28 basic letters and connect their shapes to MSA letter names.',[
 ['Arabic letters: first half','Arabic is written from right to left. These are isolated forms and letter names, not an English pronunciation code. Hamza ء is a glottal stop and has its own spelling rules; it is not identical to every alif.',`
ا|alif|ألف|alif
ب|bāʾ|باء|b
ت|tāʾ|تاء|t
ث|thāʾ|ثاء|/θ/
ج|jīm|جيم|MSA /dʒ/ model; regional variants exist
ح|ḥāʾ|حاء|/ħ/, distinct from ه
خ|khāʾ|خاء|/x/
د|dāl|دال|d
ذ|dhāl|ذال|/ð/
ر|rāʾ|راء|r
ز|zāy|زاي|z
س|sīn|سين|s
ش|shīn|شين|/ʃ/
ص|ṣād|صاد|emphatic /sˤ/`],
 ['Arabic letters: second half','Keep dot placement distinct: several letters share a base shape. Emphatic consonants and pharyngeal consonants require native listening, not English approximations. The same letter changes shape according to position and joining.',`
ض|ḍād|ضاد|emphatic /dˤ/
ط|ṭāʾ|طاء|emphatic /tˤ/
ظ|ẓāʾ|ظاء|emphatic /ðˤ/ in the model
ع|ʿayn|عين|/ʕ/
غ|ghayn|غين|/ɣ/
ف|fāʾ|فاء|f
ق|qāf|قاف|/q/
ك|kāf|كاف|k
ل|lām|لام|l
م|mīm|ميم|m
ن|nūn|نون|n
ه|hāʾ|هاء|h
و|wāw|واو|w or long ū depending on context
ي|yāʾ|ياء|y or long ī depending on context`]
]);
chapter('ar','joining','Arabic joining and contextual shapes','Read letters in words without confusing a joining break with a space.',[
 ['Joining forms in meaningful words','Most letters join on both sides when neighbouring letters permit. The isolated, initial, medial and final shapes are contextual forms of one letter. Arabic does not use uppercase and lowercase letters.',`
ب|bāʾ: isolated|باء|isolated ب
بـ|bāʾ: initial|باء|initial ب
ـبـ|bāʾ: medial|باء|medial ب
ـب|bāʾ: final|باء|final ب
بيت|bayt|بيت|house
كتب|kutub|كُتُب|books
قلم|qalam|قلم|pen
مكتبة|maktaba|مكتبة|library or bookshop in context`],
 ['Letters that do not join to the following letter','ا د ذ ر ز و do not join to the following letter on their left in normal Arabic writing. They can join to the preceding letter on their right. A visual break within a word is not necessarily a word space. Lam-alif لا remains two letters rendered together.',`
باب|bāb|باب|door; alif creates a joining break
دار|dār|دار|house; د and ا do not join leftward
ورد|ward|ورد|roses; و and ر do not join leftward
زاد|zād|زاد|increased; ز does not join leftward
هذا|hādhā|هذا|this; ذ does not join leftward
لا|lā|لا|ل + ا, not a new alphabet letter`]
]);
chapter('ar','vowels','Arabic vowels and reading marks','Connect short vowels, length, doubling and common spelling distinctions.',[
 ['Short vowels, long vowels, sukun and shadda','Fatḥa َ, kasra ِ and ḍamma ُ mark short a/i/u. Long vowels use appropriate ا و ي in context. Sukun ْ marks no following vowel; shadda ّ doubles a consonant. Ordinary adult text often omits short-vowel marks.',`
بَ|ba|بَ|fatḥa: short a
بِ|bi|بِ|kasra: short i
بُ|bu|بُ|ḍamma: short u
با|bā|با|long ā
بي|bī|بي|long ī
بو|bū|بو|long ū
دَرَسَ|darasa|دَرَسَ|he studied; single ر
دَرَّسَ|darrasa|دَرَّسَ|he taught; doubled ر
بِنْت|bint|بِنْت|girl; sukun on ن`],
 ['Hamza, ta marbuta and sun-letter assimilation','Hamza ء may appear independently or on a carrier أ إ ؤ ئ. Alif is also a long-vowel letter. ة is ta marbuta, commonly pronounced as a pause ending but as t in a connected construct. In الشمس the article’s l assimilates to ش; spelling remains الـ. Case endings depend on grammar and may be omitted in pausal reading.',`
أَب|ʾab|أَب|father; initial hamza
إِبْرَة|ʾibra|إِبْرَة|needle; hamza below alif
سُؤال|suʾāl|سُؤال|question; hamza on wāw
بَيْت|bayt|بَيْت|house
مَدْرَسَة|madrasa in pause|مَدْرَسَة|school; ta marbuta
مَدْرَسَةُ البَنات|madrasatu l-banāt|مَدْرَسَةُ البَنات|girls’ school; ta marbuta pronounced t in the construct
الشَّمْس|ash-shams|الشَّمْس|the sun; article assimilation
القَمَر|al-qamar|القَمَر|the moon; l remains audible`]
]);
chapter('de','special-letters','German umlauts and ß','Read and type ä, ö, ü and ß without losing meaningful spelling contrasts.',[
 ['Umlauts are vowel contrasts','Ä, ö and ü represent vowel qualities, not an a/o/u followed by a separately pronounced e. Ö and ü have rounded lips; long and short variants differ. Long ä varies between [ɛː] and [eː] across speakers. Ae/oe/ue can substitute when umlaut characters are unavailable, but the exercises request the displayed spelling.',`
Ä|capital ä|Ä|capital umlaut letter
ä|lowercase ä|ä|umlaut vowel
Ö|capital ö|Ö|capital umlaut letter
ö|lowercase ö|ö|umlaut vowel
Ü|capital ü|Ü|capital umlaut letter
ü|lowercase ü|ü|umlaut vowel
schon|schon /oː/|schon|already
schön|schön /øː/|schön|beautiful
fühlen|fühlen /yː/|fühlen|feel
füllen|füllen /ʏ/|füllen|fill`],
 ['ß, ẞ and ss in meaningful words','In German and Austrian standard spelling, ß generally follows a long vowel or diphthong for voiceless s; ss follows a short vowel in relevant patterns. Swiss standard uses ss. Capitalisation can use SS or ẞ. Maße and Masse differ in spelling, pronunciation and meaning; do not treat them as universal equivalents.',`
ß|Eszett, lowercase|Eszett|lowercase sharp s
ẞ|capital Eszett|großes Eszett|capital sharp s
Straße|Straße|Straße|street; long vowel
STRASSE|capital street: SS option|Straße|accepted capitalisation option
STRAẞE|capital street: ẞ option|Straße|accepted capitalisation option
Maße|Maße /aː/|Maße|measurements
Masse|Masse /a/|Masse|mass
heißen|heißen|heißen|be called; diphthong
wissen|wissen|wissen|know; short vowel`]
]);
