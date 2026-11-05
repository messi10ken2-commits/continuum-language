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
