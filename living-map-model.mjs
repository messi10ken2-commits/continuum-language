export function livingMapState(chapters=[]){
 const completed=chapters.filter(c=>Array.isArray(c.lessons)&&c.lessons.length>0&&c.completed===c.lessons.length).length;
 return {completed,phase:Math.min(4,completed)};
}
