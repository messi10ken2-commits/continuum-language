export const promotionDurationSeconds=15;

export function promotionAfterCompletion(state,id){
 if(!id||state.recent.includes(id))return state;
 const count=state.count+1;
 return {recent:[...state.recent.slice(-39),id],count:count%2,pending:state.pending+Math.floor(count/2)};
}
