import destinations from './public/passport-scenery/destinations.json' with {type:'json'};
import art from './public/passport-stamps/manifest.json' with {type:'json'};
const keys=Object.keys(art).filter(k=>k.includes(':chapter:'));
export function passportScenery(language,id){
 const index=keys.indexOf(`${language}:${id}`);
 if(index<0)return null;
 const destination=destinations[index%destinations.length];
 return {...destination,src:`/passport-scenery/${destination.sheet}.webp`};
}
