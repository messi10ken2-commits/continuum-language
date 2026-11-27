export async function worldRequest(path,body,method=body?'POST':'GET',signal){
 const controller=new AbortController(),abort=()=>controller.abort();if(signal?.aborted)abort();else signal?.addEventListener('abort',abort,{once:true});
 const timer=setTimeout(abort,20000);
 try{const response=await fetch('/api/world'+path,{method,credentials:'same-origin',headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:controller.signal});const d=await response.json();if(!response.ok)throw Object.assign(Error(d.error||'World is temporarily unavailable.'),{status:response.status});return d;}
 finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
