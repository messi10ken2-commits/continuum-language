// A failed provider or connection must never leave review controls busy forever.
export async function speakingRequest(path='',body,signal,{fetchImpl=fetch,timeoutMs=45000}={}){
 const controller=new AbortController();let timedOut=false;
 const abort=()=>controller.abort(signal?.reason);
 if(signal?.aborted)abort();else signal?.addEventListener('abort',abort,{once:true});
 const timer=setTimeout(()=>{timedOut=true;controller.abort();},timeoutMs);
 try{
  const response=await fetchImpl('/api/speaking'+path,{method:body?'POST':'GET',credentials:'same-origin',headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});
  const data=await response.json();if(!response.ok)throw Object.assign(Error(data.error||'Conversation unavailable'),{status:response.status});return data;
 }catch(error){
  if(timedOut)throw Object.assign(Error(path.endsWith('/review')?'Your conversation is saved, but the review could not be created. Please try creating the review again.':'AI conversation could not finish. Your saved conversation is unchanged; your unsent reply remains on this page. Please try again.'),{status:504});
  throw error;
 }finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
