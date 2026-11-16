// Keep presence writes ordered. Inactive sessions need transitions, not polling.
export function createConversationPulse({send,onBudget=()=>{},every=setInterval,cancel=clearInterval}){
 let active=false,lastSent,running=null,force=false,closing=false,stopped=false;
 const pump=()=>{
  if(running)return running;
  if(stopped||!force&&lastSent===active){if(closing)stopped=true;return Promise.resolve();}
  running=Promise.resolve().then(async()=>{
   while(!stopped&&(force||lastSent!==active)){
    const value=active,final=closing;force=false;lastSent=value;
    try{const result=await send(value,final);if(!closing)onBudget(result);}
    catch{lastSent=undefined;if(closing)stopped=true;break;}
    if(closing&&value===false)stopped=true;
   }
  }).finally(()=>{running=null;});
  return running;
 };
 const timer=every(()=>{if(active&&!closing){force=true;void pump();}},10000);
 return {
  update(value){if(closing)return Promise.resolve();active=!!value;return pump();},
  stop(){if(!closing){closing=true;active=false;cancel(timer);}return pump();}
 };
}

// Preserve first daily sign-in and every active interval; skip unchanged idle
// and hidden-tab writes. A failed request can invalidate the gate for retry.
export function createStudyPulseGate(){
 let previous,day;
 return {shouldSend(active,today){if(!active&&previous===false&&day===today)return false;previous=active;day=today;return true;},retry(){previous=undefined;}};
}
