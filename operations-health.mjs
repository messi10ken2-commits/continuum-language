// Public uptime summary contains no identities, counts, provider responses or secrets.
export function createOperationsHealth({env=process.env,fetchImpl=fetch,now=Date.now}={}){
 let cached=null;
 return async()=>{
  if(cached&&now()-cached.at<30000)return cached.value;
  let value={ok:false,checkedAt:null};
  if(env.ERASURE_JOURNAL_ENABLED==='true'&&/^[a-f0-9]{64}$/i.test(env.ERASURE_JOURNAL_TOKEN||'')){
   try{
    const r=await fetchImpl('http://continuum-operations.railway.internal:8080/status',{headers:{Authorization:'Bearer '+env.ERASURE_JOURNAL_TOKEN},redirect:'error',signal:AbortSignal.timeout(5000)});
    const data=r.ok?await r.json():null,stamp=Date.parse(data?.checkedAt);
    if(data?.ok===true&&Number.isFinite(stamp)&&now()-stamp<45*60000&&stamp<=now()+5*60000)value={ok:true,checkedAt:new Date(stamp).toISOString()};
   }catch{}
  }
  cached={at:now(),value};return value;
 };
}
