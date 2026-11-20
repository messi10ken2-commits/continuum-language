// Share instructional questions/evidence once across ten courses. Only the
// target-language scene, utterance choices and chapter copy vary by pack.
export function compactImmersiveUnit(unit){
 return {title:unit.title,goal:unit.goal,opening:unit.opening,dialogue:unit.questions.roleplay.map(({sceneLine,options,answer})=>({sceneLine,options,answer}))};
}
export function expandImmersiveUnit(compact,canonical){
 if(!canonical||compact.dialogue?.length!==6)throw Error('Incomplete immersion metadata');
 return {...compact,role:canonical.role,goals:canonical.goals,evidence:[...canonical.readingPoints,...canonical.listeningPoints],questions:{...canonical.questions,roleplay:canonical.questions.roleplay.map((q,i)=>({...q,...compact.dialogue[i]}))}};
}
