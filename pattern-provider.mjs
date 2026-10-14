// Keep evidence within the provider named in the learner's consent. A missing
// Gemini model may move to another supported Gemini text model, not another vendor.
let discovery=null;
const unconfigured='AI analysis is not connected. Your calculated results remain available.';
const incomplete='AI returned incomplete pattern analysis. Your saved results are unchanged. Please try again.';
function failure(message,status){return Object.assign(Error(message),{status:503,providerStatus:status});}
async function checked(response,provider,model){
 if(response.ok)return;
 const body=await response.json().catch(()=>({}));
 const code=String(body.error?.code||body.error?.status||'unknown');
 console.warn('Pattern analysis provider failure',JSON.stringify({provider,model,status:response.status,code:/^[\w.-]{1,80}$/.test(code)?code:'unknown'}));
 throw failure(response.status===429?'AI analysis is busy or its quota is unavailable. Your saved results are unchanged. Please try later.':response.status===404?'AI analysis model is unavailable. Your saved results are unchanged. Please try again later.':response.status===401||response.status===403?'AI analysis provider authentication failed. Your saved results are unchanged. Please try again later.':'AI analysis provider is temporarily unavailable. Your saved results are unchanged. Please try again later.',response.status);
}
function parse(raw){try{return JSON.parse(String(raw||'').replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));}catch{throw failure(incomplete);}}
export async function requestPatternBatch(system,context,{fetchImpl=fetch}={}){
 try{
  if(process.env.GEMINI_API_KEY){
   const configured=(process.env.GEMINI_ASSESSMENT_MODEL||'gemini-2.5-flash').replace(/^models\//,'');
   const cacheKey=configured+':'+process.env.GEMINI_API_KEY;
   let model=discovery?.key===cacheKey&&discovery.until>Date.now()?discovery.model:configured;
   const generate=m=>fetchImpl(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:context}]}],generationConfig:{temperature:0.2,responseMimeType:'application/json'}}),signal:AbortSignal.timeout(60000)});
   let response=await generate(model);
   if(response.status===404){
    await checked(response,'Gemini',model).catch(()=>{});
    const listing=await fetchImpl('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000',{headers:{'x-goog-api-key':process.env.GEMINI_API_KEY},signal:AbortSignal.timeout(15000)});
    await checked(listing,'Gemini','model-list');
    const models=(await listing.json()).models||[];
    const candidates=models.filter(m=>m.supportedGenerationMethods?.includes('generateContent')&&/^models\/gemini-[\w.-]*flash[\w.-]*$/.test(m.name)&&!/(?:image|audio|live|tts|thinking|exp)/i.test(m.name));
    candidates.sort((a,b)=>Number(/preview|latest/.test(a.name))-Number(/preview|latest/.test(b.name))||Number(/lite/.test(a.name))-Number(/lite/.test(b.name))||b.name.localeCompare(a.name,undefined,{numeric:true}));
    const next=candidates.find(m=>m.name!=='models/'+model)?.name.replace(/^models\//,'');
    if(!next)throw failure('AI analysis model is unavailable. Your saved results are unchanged. Please try again later.',404);
    model=next;response=await generate(model);
    if(response.ok)discovery={key:cacheKey,model,until:Date.now()+15*60*1000};
   }
   await checked(response,'Gemini',model);
   const d=await response.json();return {value:parse(d.candidates?.[0]?.content?.parts?.filter(p=>!p.thought).map(p=>p.text||'').join('')),provider:'Gemini',model};
  }
  if(process.env.OPENAI_API_KEY){
   const model=process.env.OPENAI_ASSESSMENT_MODEL||'gpt-4o-mini';
   const response=await fetchImpl('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:JSON.stringify({model,store:false,max_output_tokens:3000,input:[{role:'system',content:system},{role:'user',content:context}],text:{format:{type:'json_object'}}}),signal:AbortSignal.timeout(60000)});
   await checked(response,'OpenAI',model);const d=await response.json();return {value:parse(d.output_text||d.output?.flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join('')),provider:'OpenAI',model};
  }
  throw failure(unconfigured);
 }catch(e){
  if(e.status===503)throw e;
  console.warn('Pattern analysis request failure',JSON.stringify({kind:['TimeoutError','AbortError','TypeError','SyntaxError'].includes(e.name)?e.name:'Error'}));
  throw failure('AI analysis timed out or could not connect. Your saved results are unchanged. Please try again.');
 }
}

export async function warmPatternProvider(){
 if(!process.env.GEMINI_API_KEY&&!process.env.OPENAI_API_KEY)return;
 try{const result=await requestPatternBatch('Return exactly {"items":[]} as JSON for this synthetic availability check. No learner data is included.','{"purpose":"startup availability check"}');
  if(!Array.isArray(result.value?.items))throw Error('Invalid probe result');
  console.log('Pattern analysis provider ready',JSON.stringify({provider:result.provider,model:result.model}));
 }catch{console.warn('Pattern analysis provider unavailable; calculated results remain available');}
}
