import themes from './public/living-map-panorama/manifest.json' with {type:'json'};
export function livingMapState(chapters=[]){
 const completed=chapters.filter(c=>Array.isArray(c.lessons)&&c.lessons.length>0&&c.completed===c.lessons.length).length;
 return {completed,phase:Math.min(4,completed)};
}

export function livingMapTheme(language='en'){return Object.hasOwn(themes,language)?themes[language]:themes.en}

// A continuous world spans at least three viewports; chapter order stays authored.
export function livingMapGeometry(chapters=[],viewportWidth=360){
 const w=Math.max(240,Number(viewportWidth)||360),columns=Math.max(3,Math.ceil(chapters.length/5)),perColumn=Math.max(1,Math.ceil(chapters.length/columns)),height=Math.round(w*1.4);
 const xs=[.27,.34,.75,.42,.78],ys=[.09,.28,.18,.46,.39];
 return {width:columns*w,height,columns,points:chapters.map((_,i)=>({x:Math.floor(i/perColumn)*w+Math.max(76,Math.min(w-76,w*xs[i%perColumn])),y:height*ys[i%perColumn]}))};
}
