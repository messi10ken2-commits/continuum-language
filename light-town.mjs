import {lightProgressEvidence} from './light-route.mjs';

export const materialsPerRound=20;
export function lightRoundEvidence(steps){
 let combo=0,best=0,firstCorrect=0,hints=0;
 for(const step of steps){
  if(step.hint)hints++;
  combo=step.missed===false?combo+1:0;
  if(step.missed===false)firstCorrect++;
  best=Math.max(best,combo);
 }
 return {combo,best,firstCorrect,hints};
}
export function lightMaterials(steps){
 const {best}=lightRoundEvidence(steps);
 return materialsPerRound+(best>=3?8:0)+(best>=5?12:0);
}

const decorations=[
 ['terrace','Terrace'],['flower-bed','Flower bed'],['street-lamp','Street lamp'],
 ['bench','Park bench'],['fountain','Stone fountain'],['book-kiosk','Book kiosk'],
 ['rose-planter','Rose planter'],['market-stall','Market stall'],['maple','Maple tree']
];

export function townRewardAt(index){
 const slot=index%decorations.length;
 const [art,name]=decorations[slot];
 return {index,slot,art,name,edition:Math.floor(index/decorations.length)+1};
}

export function townCollection(routeRows,completed){
 return lightProgressEvidence(routeRows,completed).clears.map((row,index)=>({...townRewardAt(index),clearId:row.id}));
}

export const townCourseKey=language=>'language:'+language;

export function townCoursePlacements(language,route,placements){
 const chapters=[...new Set(route.map(row=>row.chapter.id)),townCourseKey(language)];
 const byChapter=new Map();
 for(const placement of placements){
  const rows=byChapter.get(placement.chapter)||[];
  rows.push(placement);
  byChapter.set(placement.chapter,rows);
 }
 // For old chapter-specific choices, use the furthest chapter per slot.
 // An explicit course-wide choice always takes precedence.
 const placed=new Map();
 for(const chapter of chapters)for(const placement of byChapter.get(chapter)||[])placed.set(placement.slot,placement);
 return [...placed.values()];
}

export function townPlacedRewards(collection,placements=[]){
 const placed=new Map(collection.map(item=>[item.slot,item]));
 for(const {slot,rewardIndex} of placements){
  const item=collection[rewardIndex];
  if(item?.slot===slot)placed.set(slot,item);
 }
 return [...placed.values()];
}

export function townConstruction(route,completed){
 const {buildings}=lightProgressEvidence(route,completed);
 return {built:buildings.length,total:route.length,buildings};
}
