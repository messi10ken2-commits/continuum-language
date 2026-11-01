// Conversation consent permits either configured provider. Keep this independent
// of pattern analysis, whose consent intentionally stays within one vendor.
const cooldown=new Map();
const unavailable=()=>Object.assign(Error('Conversation AI is temporarily busy. Your conversation is saved; please retry.'),{status:503,code:'CONVERSATION_PROVIDER_BUSY'});
export async function requestConversation(system,context,{fetchImpl=fetch,env=process.env,timeoutMs=18000,maxTokens=2400,now=Date.now,deadline=Infinity,interactive=false}={}){
 const providers=[];
 if(env.OPENAI_API_KEY)providers.push({name:'OpenAI',key:env.OPENAI_API_KEY,model:env.OPENAI_CONVERSATION_MODEL||env.OPENAI_ASSESSMENT_MODEL||'gpt-4o-mini',url:'https://api.openai.com/v1/responses'});
 if(env.GEMINI_API_KEY)providers.push({name:'Gemini',key:env.GEMINI_API_KEY,model:(env.GEMINI_CONVERSATION_MODEL||env.GEMINI_ASSESSMENT_MODEL||'gemini-2.5-flash').replace(/^models\//,'')});
 for(const p of providers){
  const remaining=Math.min(timeoutMs,deadline-now());if(remaining<=0)break;
  const id=p.name+':'+p.model+':'+p.key;if(providers.length>1&&(cooldown.get(id)||0)>now())continue;
  const start=now();
  try{
   const open=p.name==='OpenAI';
   const r=await fetchImpl(open?p.url:`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(p.model)}:generateContent`,{method:'POST',headers:open?{'Content-Type':'application/json',Authorization:`Bearer ${p.key}`}:{'Content-Type':'application/json','x-goog-api-key':p.key},body:JSON.stringify(open?{model:p.model,store:false,max_output_tokens:maxTokens,input:[{role:'system',content:system},{role:'user',content:context}],text:{format:{type:'json_object'}}}:{systemInstruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:context}]}],generationConfig:{temperature:.2,responseMimeType:'application/json',maxOutputTokens:maxTokens,...(interactive&&/^gemini-2\.5-flash(?:$|-)/.test(p.model)?{thinkingConfig:{thinkingBudget:0}}:{})}}),signal:AbortSignal.timeout(Math.max(1,Math.floor(remaining)))});
   if(!r.ok){if([429,503,401,403,404].includes(r.status))cooldown.set(id,now()+60000);console.warn('Conversation provider unavailable',JSON.stringify({provider:p.name,status:r.status}));continue;}
   const d=await r.json(),raw=open?d.output_text||d.output?.flatMap(x=>x.content||[]).filter(x=>x.type==='output_text').map(x=>x.text).join(''):d.candidates?.[0]?.content?.parts?.filter(x=>!x.thought).map(x=>x.text||'').join('');
   let value;try{value=JSON.parse(String(raw||'').replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,''));}catch{console.warn('Conversation provider invalid JSON',JSON.stringify({provider:p.name}));continue;}
   console.info('Conversation provider completed',JSON.stringify({provider:p.name,milliseconds:now()-start}));return {value,provider:p.name,model:p.model};
  }catch(e){cooldown.set(id,now()+30000);console.warn('Conversation provider request failed',JSON.stringify({provider:p.name,kind:e.name==='TimeoutError'?'timeout':'connection'}));}
 }
 throw unavailable();
}
