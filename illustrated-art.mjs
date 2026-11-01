import {countryWorldArt} from './country-worlds.mjs';
import {learningArtFamily} from './learning-art-families.mjs';
import {isLearningLanguage} from './languages.mjs';
// Decorative scenes use only the authored setting, never an answer or score.
export const illustratedContexts=['station','cafe','market','home','work','study','nature','city','health','travel','food','culture'];
export const illustratedLanguages=['en','es','pt','ja'];
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
export function illustratedLessonArt(lesson={}){
 const language=isLearningLanguage(lesson.language)?lesson.language:isLearningLanguage(lesson.locale?.slice(0,2))?lesson.locale.slice(0,2):'es',context=illustratedContext(lesson);
 const selected=context;
 return {src:countryWorldArt(language)||`/illustrated-lessons/${learningArtFamily(language)}-${selected}.webp`,context:selected,language,alt:'Illustrated learning scene'};
}
export function illustratedHero(language,section){
 const lang=learningArtFamily(language);
 if(countryWorldArt(language))return countryWorldArt(language);
 if(lang==='ja'&&section==='Skill report')return '/illustrated-lessons/ja-station.webp';
 const japanese={'Learning memory':'memory','My classes':'classroom','Practice Studio':'practice','Level test':'assessment','Skill report':'report'}[section];
 if(lang==='ja'&&japanese)return `/illustrated-lessons/ja-${japanese}-hero.webp`;
 const context=({'Practice Studio':'station','Learning memory':'station','My classes':'study','Learn':'city','Level test':'city','Skill report':'nature','Account':'home','AI conversation':'cafe','Support':'study'})[section];
 return context?`/illustrated-lessons/${lang}-${context}.webp`:`/journey-illustrated/${lang}-world.webp`;
}
