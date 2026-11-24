// Internal collector persists encrypted tombstones outside PostgreSQL.
export async function recordErasureJournal(record,{env=process.env,fetchImpl=fetch}={}){
 if(env.ERASURE_JOURNAL_ENABLED!=='true')return {state:'disabled'};
 if(!/^[a-f0-9]{64}$/i.test(env.ERASURE_JOURNAL_TOKEN||''))throw Object.assign(Error('Erasure journal is unavailable.'),{status:503});
 const response=await fetchImpl('http://continuum-operations.railway.internal:8080/journal',{method:'POST',headers:{Authorization:'Bearer '+env.ERASURE_JOURNAL_TOKEN,'Content-Type':'application/json'},body:JSON.stringify(record),redirect:'error',signal:AbortSignal.timeout(10000)}).catch(()=>null);
 if(!response?.ok)throw Object.assign(Error('Erasure journal is unavailable. No unrecorded deletion is permitted.'),{status:503});
 return {state:'recorded'};
}
