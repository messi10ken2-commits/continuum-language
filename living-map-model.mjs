import {learningArtFamily} from './learning-art-families.mjs';
import themes from './public/living-map-panorama/manifest.json' with {type:'json'};
export function livingMapState(chapters=[]){
 const completed=chapters.filter(c=>Array.isArray(c.lessons)&&c.lessons.length>0&&c.completed===c.lessons.length).length;
 return {completed,phase:Math.min(4,completed)};
}

export function livingMapTheme(language='en'){return themes[learningArtFamily(language)]}

// A continuous world spans at least three viewports; chapter order stays authored.
export function livingMapGeometry(chapters=[],viewportWidth=360){
 const w=Math.max(240,Number(viewportWidth)||360),height=Math.max(360,Math.round(w*1.4));
 // Spread every panel over its usable height, including the denser A1/A2
 // pathways. Narrow screens get another panel rather than overlapping nodes.
 const top=72,bottom=164,minRowStep=60;
 const capacity=Math.min(5,Math.max(3,Math.floor((height-top-bottom)/minRowStep)+1));
 const columns=Math.max(3,Math.ceil(chapters.length/capacity)),perColumn=Math.max(1,Math.ceil(chapters.length/columns));
 return {width:columns*w,height,columns,points:chapters.map((_,i)=>{
  const column=Math.floor(i/perColumn),row=i%perColumn,count=Math.min(perColumn,chapters.length-column*perColumn);
  const x=column*w+Math.max(60,Math.min(w-60,w*(row%2?.75:.25)));
  const y=count===1?(top+height-bottom)/2:top+(height-top-bottom)*row/(count-1);
  return {x,y};
 })};
}
