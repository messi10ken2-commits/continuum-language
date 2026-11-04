// Use only server-confirmed rewards for the selected language and companion.
export function companionReactions(bond){
 return [['reaction','hello'],['voice','call'],['expression','delight'],['finale','finale']].filter(([reward])=>bond?.[reward]===true).map(([,mode])=>mode);
}
// Nodes are centered; reserve their full title width plus a gap on either side.
export function mapCompanionPosition(point,geometry){
 const panel=geometry.width/geometry.columns,column=Math.floor(point.x/panel);
 const side=point.x-column*panel<panel/2?1:-1;
 return {left:Math.max(24,Math.min(geometry.width-24,point.x+side*104)),top:point.y-20};
}
