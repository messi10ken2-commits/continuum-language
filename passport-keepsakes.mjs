import {isLearningLanguage} from './languages.mjs';
import {learningArtFamily} from './learning-art-families.mjs';
import {companions} from './adventure-model.mjs';
const locations={es:{city:'Barcelona',position:'0% 0%'},en:{city:'London',position:'100% 0%'},pt:{city:'Rio de Janeiro',position:'0% 100%'},ja:{city:'Kyoto',position:'100% 100%'}};
export function companionKeepsake(companion,language,bond){
 if(!isLearningLanguage(language)||!bond?.finale||!companions.includes(companion)||!locations[learningArtFamily(language)]) return null;
 return {...locations[learningArtFamily(language)],src:`/passport-keepsakes/${companion}.webp`};
}
