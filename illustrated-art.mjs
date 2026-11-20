import {learningArtFamily} from './learning-art-families.mjs';
import lessonAssignments from './illustrated-lesson-assignments.json' with {type:'json'};
import {isLearningLanguage} from './languages.mjs';
// Decorative scenes use only the authored setting, never an answer or score.
export const illustratedContexts=['station','cafe','market','home','work','study','nature','city','health','travel','food','culture'];
export const illustratedLanguages=['en','es','pt','ja','zh','ko','fr','de','ar','it'];
export function illustratedContext(lesson={}){
 const text=[lesson.sceneText,lesson.title].filter(Boolean).join(' ').toLowerCase();
 if(/airport|flight|boarding|hotel|luggage|aeropuerto|aeroporto|aéroport|空港|ホテル|旅行|旅館/.test(text))return 'travel';
 if(/\b(?:train|trains|station|platform|railway|tren|trenes|trem)\b|andén|estação|電車|番線|駅/.test(text))return 'station';
 if(/doctor|clinic|hospital|health|médic|saúde|salud|病院|医者|健康/.test(text))return 'health';
 if(/café|cafe|coffee|café|喫茶|コーヒー/.test(text))return 'cafe';
 if(/restaurant|cook|kitchen|meal|food|breakfast|dinner|restaurant|cocin|cozinh|comida|料理|食べ|食事/.test(text))return 'food';
 if(/shop|market|clothes|buy|grocer|price|mercado|compr|roupa|tienda|買い|服|店/.test(text))return 'market';
 if(/direction|find your way|street|route|\bturn\b|bridge|gira|izquierda|derecha|rua|esquerda|direita|道|交差点|曲が/.test(text))return 'city';
 if(/work|office|job|meeting|interview|deadline|report|colleague|trabaj|trabalh|reuni|仕事|会議|職場/.test(text))return 'work';
 if(/home|house|family|routine|habit|daily|casa|famili|rotina|家族|日課|毎日/.test(text))return 'home';
 if(/museum|art|culture|history|music|museo|museu|cultura|美術|博物|文化|音楽/.test(text))return 'culture';
 if(/nature|park|forest|environment|weather|climate|ecology|walk|parque|ambiente|公園|環境|自然|散歩/.test(text))return 'nature';
 const theme=lesson.visualStory?.theme;
 return ({travel:'travel',station:'station',cafe:'cafe',city:'city',work:'work',food:'food',shopping:'market',study:'study',japan:'culture',nature:'nature',home:'home'})[theme]||'study';
}
// Related settings stay relevant to the lesson while providing enough choices
// to give adjacent lesson cards different illustrations. Selection is authored,
// stable and independent of answers, attempts and learner-entered text.
const relatedScenes={
 station:['station','travel','city'],cafe:['cafe','food','home'],
 market:['market','food','city'],home:['home','food','study','cafe'],
 work:['work','study','classroom','library'],study:['study','library','classroom','listening','work','home','culture'],
 nature:['nature','city','culture'],city:['city','travel','station','market'],
 health:['health','home','study'],travel:['travel','station','city','culture'],
 food:['food','cafe','market','home'],culture:['culture','city','nature','library']
};
const originalLanguages=new Set(['en','es','pt','ja']);
export function illustratedLessonCandidates(language,context){
 const scenes=(relatedScenes[context]||relatedScenes.study).filter(key=>originalLanguages.has(language)||!['library','classroom','listening'].includes(key));
 const paths=scenes.map(key=>`/illustrated-lessons/${language}-${key}.webp`);
 if(['study','work'].includes(context))paths.push('/journey-illustrated/library-v2.webp','/journey-illustrated/listening-v2.webp','/journey-illustrated/classes-v2.webp');
 return paths;
}
function authoredHash(text){let n=2166136261;for(const ch of text)n=Math.imul(n^ch.charCodeAt(0),16777619);return n>>>0;}
export function illustratedLessonArt(lesson={}){
 const language=isLearningLanguage(lesson.language)?lesson.language:isLearningLanguage(lesson.locale?.slice(0,2))?lesson.locale.slice(0,2):'es',context=illustratedContext(lesson);
 const authored=lessonAssignments[lesson.id];
 const candidates=illustratedLessonCandidates(language,context);
 const src=authored?.language===language&&authored.context===context?authored.src:candidates[authoredHash([lesson.id,lesson.title,lesson.sceneText].filter(Boolean).join('|'))%candidates.length];
 return {src,context,language,alt:'Illustrated learning scene'};
}
export const regionalHeaderScenes={'Overview':'culture','Learn':'city','Practice Studio':'station','AI conversation':'cafe','My classes':'work','Learning memory':'study','Account':'home','Support':'market','Level test':'travel','Skill report':'nature'};
export function illustratedHero(language,section){
 if(['zh','ko','fr','de','ar','it'].includes(language))return `/illustrated-lessons/${language}-${regionalHeaderScenes[section]||'culture'}.webp`;
 const lang=learningArtFamily(language);
 if(lang==='ja'&&section==='Skill report')return '/illustrated-lessons/ja-station.webp';
 const japanese={'Learning memory':'memory','My classes':'classroom','Practice Studio':'practice','Level test':'assessment','Skill report':'report'}[section];
 if(lang==='ja'&&japanese)return `/illustrated-lessons/ja-${japanese}-hero.webp`;
 const context=({'Practice Studio':'station','Learning memory':'station','My classes':'study','Learn':'city','Level test':'city','Skill report':'nature','Account':'home','AI conversation':'cafe','Support':'study'})[section];
 return context?`/illustrated-lessons/${lang}-${context}.webp`:`/journey-illustrated/${lang}-world.webp`;
}
