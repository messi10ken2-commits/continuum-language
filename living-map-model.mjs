import themes from './public/living-map-v2/manifest.json' with {type:'json'};
export function livingMapState(chapters=[]){
 const completed=chapters.filter(c=>Array.isArray(c.lessons)&&c.lessons.length>0&&c.completed===c.lessons.length).length;
 return {completed,phase:Math.min(4,completed)};
}

export function livingMapTheme(language='en'){return Object.hasOwn(themes,language)?themes[language]:themes.en}
