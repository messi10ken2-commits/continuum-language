import {japaneseBasicVideoArchive} from './japanese-basic-video-archive.mjs';
import {kansaiComparisonVideo} from './regional-audio-pairs.mjs';
import {japaneseInlineVideoCourse} from './japanese-inline-video.mjs';
// Independent sources: never borrow ordinary-course videos or their question windows.
// Original media remains on the publisher's player; authored exercises are Premium.
const cueWindows={
 en:[[18,24],[23,28],[27,47],[103,122],[124,145],[172,191],[127,145],[27,47]],
 // Publisher chapter boundaries: section windows, not claimed phrase-level offsets.
 es:[[19,93],[93,187],[93,187],[187,250],[187,250],[250,340],[340,391],[340,391]]
};
const cueLabels={
 en:['Introduction','Introduction','Introduction','Water and butter','Herb','Envelope','Explaining pronunciation','Introduction'],
 es:['Vendor calls','At the stall','At the stall','Buying chicken','Buying chicken','Buying meat','Important notes','Important notes']
};
const definitions={
 en:{level:'B2',title:'Hear how two native speakers pronounce everyday words',youtubeId:'TQiHemDlOOk',credit:'British Council · Sophia and Natasha',sourcePage:'https://learnenglishteens.britishcouncil.org/study-break/youtubers/british-vs-american-accent-challenge',items:[
 ['Where is Natasha from?',['California','London','Sydney'],0,'Natasha identifies California.'],
 ['Where is Sophia from?',['New York','London','Toronto'],1,'Sophia identifies London.'],
 ['What are they comparing?',['Spelling tests','Travel prices','Their pronunciations'],2,'They compare spoken everyday words.'],
 ['Which consonant does Natasha compare to a D sound?',['T','H','V'],0,'She discusses T in water and butter.'],
 ['What happens to H in Natasha’s pronunciation of herb?',['It becomes louder','It is silent','It becomes an R'],1,'Her example omits the initial H.'],
 ['What does Natasha say about envelope?',['She never uses it','Only one pronunciation exists','Her own pronunciation sometimes varies'],2,'She acknowledges variation in her own speech.'],
 ['Do they claim to know every historical reason for these differences?',['No','Yes','They avoid pronunciation entirely'],0,'They acknowledge uncertainty about explanations.'],
 ['What is the safest conclusion from these two speakers?',['One accent is correct','Individual speakers illustrate variation','All Americans sound identical'],1,'Two speakers cannot represent everyone.']
 ]},
 es:{level:'B1',title:'Shop at a Mexican market with confidence',youtubeId:'CYaMj33yql4',credit:'Spring Spanish · Paulisima',sourcePage:'https://springlanguages.com/learn-spanish/buying-at-market-spanish/',items:[
 ['Why do vendors call out?',['To attract buyers','To announce closing','To refuse customers'],0,'They invite customers to their stalls.'],
 ['What amount of carrots is requested?',['Two kilos','Half a kilo','Ten kilos'],1,'The example requests half a kilo.'],
 ['What does the shopper ask before paying?',['The closing date','The weather','The amount owed'],2,'The question asks how much to pay.'],
 ['What is removed from the chicken?',['Its skin','Its price label','The whole stall'],0,'The customer requests skin removal.'],
 ['How does the chicken order change?',['It is cancelled','The breast is requested filleted','It becomes fish'],1,'The customer revises the preparation request.'],
 ['What helps the butcher recommend a cut?',['The customer’s age','The time of day','Its intended cooking use'],2,'Preparation plans guide the recommendation.'],
 ['What should buyers check about displayed prices?',['The quantity they apply to','The vendor’s birthday','The stall number only'],0,'A price may cover less than a kilo.'],
 ['What is a pilón in this shopping context?',['A tax','A small extra gift','A receipt'],1,'It is a small extra offered with a purchase.']
 ]},
 pt:{level:'B1',title:'Follow a playful dinner-table exchange in Portugal',youtubeId:'6i47YZuugAw',credit:'Practice Portuguese · Eliana and Joseph',sourcePage:'https://www.practiceportuguese.com/videos/hugo-e-patricia-a-mesa-de-jantar-animated/',items:[
 ['What does Hugo think is missing?',['A fork and knife','A spoon','The table'],0,'He has a spoon but wants other cutlery.',1,14],
 ['Why does Patrícia think a spoon is enough?',['They are eating cake','They are eating soup','They are leaving'],1,'A spoon suits the soup.',13,32],
 ['Why is the planned soup rejected?',['It is cold','It is expensive','It tastes sour'],2,'Hugo reacts to its sour taste.',32,39],
 ['What replacement meal is proposed?',['Fish and potatoes','Bread and cheese','Chicken and rice'],0,'Hugo proposes fish and potatoes.',38,43],
 ['What drink do they discuss?',['Tea','Juice','Milk'],1,'They discuss fruit juice.',41,55],
 ['How does Patrícia assess Hugo’s cooking?',['She dislikes everything','She says nothing','She praises it'],2,'She compliments his cooking.',57,68],
 ['How does Patrícia distinguish enjoyment from ability?',['She likes cooking but says she cooks badly','She dislikes eating','She cannot taste food'],0,'Liking an activity differs from doing it well.',65,75],
 ['What contrast makes their exchange playful?',['They both refuse food','He cooks while she eats everything','Neither likes dinner'],1,'They joke about their different roles.',74,85]
 ]},
 ja:{level:'B1',title:'Read family intentions while dinner is prepared',credit:'The Japan Foundation · Erin’s Challenge',sourcePage:'https://www.erin.jpf.go.jp/jp/lesson/03/advanced/',transcript:'https://www.erin.jpf.go.jp/materials/advanced/download/erin_lesson03_advanced_script.pdf',items:[
 ['Who is already home when Saki arrives?',['Her sister','Her teacher','Her coach'],0,'Akane is already home.'],
 ['How does Akane know their mother will return soon?',['A letter arrived','Their mother phoned','She guesses silently'],1,'She reports a recent phone call.'],
 ['Why is their mother late?',['She missed school','She went abroad','She was asked to run an errand'],2,'An errand delayed her return.'],
 ['What does Akane offer to do?',['Prepare dinner','Cancel dinner','Go to school'],0,'She offers practical help.'],
 ['Why did their mother buy quickly prepared food?',['They have no plates','Dinner can be ready sooner','Nobody is hungry'],1,'It reduces preparation time.'],
 ['How does Saki explain her appetite?',['She skipped a holiday','She dislikes dinner','Club activities leave her hungry'],2,'She connects hunger with club activities.'],
 ['Who does their mother ask for help?',['Both daughters','Only the neighbour','Only Saki’s teacher'],0,'She addresses both daughters.'],
 ['What does Akane advise about the item Saki points to?',['Throw it away','Leave it as it is','Heat it twice'],1,'She says it does not need heating.']
 ]}
};
const originalVideoCourses=Object.entries(definitions).map(([language,d])=>({
 id:`${language}-premium-video-v2`,contentVersion:3,language,level:d.level,title:d.title,
 description:'New source material: understand intentions and practical details in an original publisher video.',
 conversation:{provider:d.youtubeId?'youtube':'publisher',...(d.youtubeId?{youtubeId:d.youtubeId}:{}),source:d.youtubeId?`https://www.youtube.com/watch?v=${d.youtubeId}`:d.sourcePage,credit:d.credit,sourceTitle:d.title,hint:'Watch the indicated source section. These exercises use a different source from the ordinary lessons.'},
 examples:[],references:[{title:'Publisher’s lesson and transcript',url:d.sourcePage}],
 questions:d.items.map(([prompt,options,answer,note,start,end],i)=>{
 const window=cueWindows[language]?.[i];if(window)[start,end]=window;
 return ({type:'video',video:true,prompt,options,answer,note,
 ...(start!==undefined?{videoCue:{start,end,label:cueLabels[language]?.[i]||'Dinner-table exchange',precision:'section',evidence:language==='en'?'Context windows checked against the YouTube timestamped English transcript and publisher script, 2026-10-21.':language==='es'?'Publisher chapter boundaries checked in the YouTube description, with question content checked against the publisher lesson, 2026-10-21. These are chapter windows, not exact phrase offsets.':'Section windows from the publisher’s timestamped script, checked 2026-10-21.'}}:{sourceReference:{label:language==='ja'?'Lesson 3 · Advanced skit · family dinner':language==='es'?['Vendor calls','At the stall','At the stall','Buying chicken','Buying chicken','Buying meat','Important notes','Important notes'][i]:['Introduction','Introduction','Introduction','Water and butter','Herb','Envelope','Explaining pronunciation','Conclusion'][i],url:d.transcript||d.sourcePage,evidence:'Publisher’s public lesson/script checked 2026-10-21; exact video offsets not verified.'}})
 });})
}));
export const archivedPremiumVideoCourses=[...originalVideoCourses.filter(c=>c.language==='ja'),japaneseBasicVideoArchive];
export const premiumVideoCourses=[...originalVideoCourses.filter(c=>c.language!=='ja'),japaneseInlineVideoCourse];
export const premiumVideoSources=premiumVideoCourses.map(({id,language,title,conversation})=>({id,language,title,conversation}));

// Native comparison remains watchable without purchasing the exercises.
premiumVideoSources.push({id:'ja-premium-varieties-v1',language:'ja',title:kansaiComparisonVideo.sourceTitle,conversation:kansaiComparisonVideo});
