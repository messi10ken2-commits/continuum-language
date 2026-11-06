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
 ['rose-arch','Rose arch'],['market-stall','Market stall'],['maple','Maple tree']
];

export function townRewardAt(index){
 const slot=index%decorations.length;
 const [art,name]=decorations[slot];
 return {index,slot,art,name,edition:Math.floor(index/decorations.length)+1};
}

// The progress endpoint supplies only the first clear for each round. Older
// guest records without a timestamp retain their position in the saved list.
export function townCollection(chapterRows,completed){
 const limits=new Map(chapterRows.map(row=>[row.lesson.id,row.rounds]));
 const unique=new Map();
 for(const row of completed){
  if(!Number.isInteger(row.round)||row.round<0||row.round>=limits.get(row.lesson)||!limits.has(row.lesson))continue;
  const key=row.lesson+':'+row.round;
  if(!unique.has(key))unique.set(key,row);
 }
 return [...unique.values()].sort((a,b)=>{
  const first=Date.parse(a.completedAt)||0,second=Date.parse(b.completedAt)||0;
  return first-second||(first?String(a.id).localeCompare(String(b.id)):0);
 }).map((row,index)=>({...townRewardAt(index),clearId:row.id}));
}

export function townPlacedRewards(collection,placements=[]){
 const placed=new Map(collection.map(item=>[item.slot,item]));
 for(const {slot,rewardIndex} of placements){
  const item=collection[rewardIndex];
  if(item?.slot===slot)placed.set(slot,item);
 }
 return [...placed.values()];
}
