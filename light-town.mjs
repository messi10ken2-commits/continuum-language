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

// The progress endpoint supplies only the first clear for each round. Older
// guest records without a timestamp retain their position in the saved list.
function townFirstClears(routeRows,completed){
 const limits=new Map(routeRows.map(row=>[row.lesson.id,row.rounds]));
 const unique=new Map();
 for(const row of completed){
  if(!Number.isInteger(row.round)||row.round<0||row.round>=limits.get(row.lesson)||!limits.has(row.lesson))continue;
  const key=row.lesson+':'+row.round;
  if(!unique.has(key))unique.set(key,row);
 }
 return [...unique.values()].sort((a,b)=>{
  const first=Date.parse(a.completedAt)||0,second=Date.parse(b.completedAt)||0;
  return first-second||(first?String(a.id).localeCompare(String(b.id)):0);
 });
}

export function townCollection(routeRows,completed){
 return townFirstClears(routeRows,completed).map((row,index)=>({...townRewardAt(index),clearId:row.id}));
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

export function townConstruction(route,completed,lotsPerDistrict){
 const limits=new Map(route.map(({lesson,rounds})=>[lesson.id,rounds]));
 const clearedByLesson=new Map();
 const buildings=[];
 for(const {lesson,id} of townFirstClears(route,completed)){
  const cleared=(clearedByLesson.get(lesson)||0)+1;
  clearedByLesson.set(lesson,cleared);
  if(cleared===limits.get(lesson))buildings.push({lesson,clearId:id});
 }
 const built=buildings.length;
 const total=route.length;
 const district=Math.max(0,Math.ceil(built/lotsPerDistrict)-1);
 const lastDistrict=Math.max(0,Math.ceil(Math.min(total,built+1)/lotsPerDistrict)-1);
 return {built,total,district,lastDistrict,buildings};
}
