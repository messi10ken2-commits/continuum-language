import {AsyncLocalStorage} from 'node:async_hooks';
import {randomUUID} from 'node:crypto';

const scope=new AsyncLocalStorage();
export function withAIUsage(pool,feature,work,{userId=null,tier=null,operationId=null,getTier}={}){
 return scope.run({pool,feature,userId,tier,operationId,getTier,requestId:randomUUID()},work);
}
export function identifyAIUser(userId){const current=scope.getStore();if(current)current.userId=userId;}
export function aiContext(feature,identity,work){
 const current=scope.getStore();
 return current?scope.run({...current,feature,...identity},work):work();
}

export async function migrateAIMetering(pool){
 await pool.query(`
  CREATE TABLE IF NOT EXISTS ai_provider_calls (
   id uuid PRIMARY KEY DEFAULT gen_random_uuid(), request_id uuid NOT NULL,
   user_id uuid REFERENCES users(id) ON DELETE SET NULL, tier text, operation_id text,
   feature text NOT NULL, stage text NOT NULL, provider text NOT NULL, model text NOT NULL,
   http_status integer, success boolean NOT NULL DEFAULT false, finished_at timestamptz,
   usage jsonb NOT NULL DEFAULT '{}', rate jsonb, estimated_usd numeric(18,10),
   created_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IF NOT EXISTS ai_provider_calls_time ON ai_provider_calls(created_at);
  CREATE INDEX IF NOT EXISTS ai_provider_calls_user_time ON ai_provider_calls(user_id,created_at);
  CREATE INDEX IF NOT EXISTS ai_provider_calls_operation ON ai_provider_calls(user_id,operation_id);
  CREATE TABLE IF NOT EXISTS ai_alert_resolutions (
   alert_key text PRIMARY KEY, resolved_by uuid REFERENCES users(id) ON DELETE SET NULL,
   resolved_at timestamptz NOT NULL DEFAULT now()
  );
 `);
}

// Standard on-demand paid rates in USD per million tokens. Missing prices
// stay unknown. AI_MODEL_RATES_JSON can override or add exact model IDs.
const defaults={
 'openai:gpt-4o-mini':{input:.15,output:.60,cached:.075},
 'openai:gpt-audio-1.5':{input:2.50,output:10,audioInput:32,audioOutput:64},
 'openai:gpt-4o-mini-tts':{input:.60,audioOutput:12},
 'gemini:gemini-2.5-flash':{input:.30,output:2.50,audioInput:1,cached:.03,cachedAudio:.10},
 'gemini:gemini-3.1-flash-lite':{input:.25,output:1.50,audioInput:.50,cached:.025,cachedAudio:.05},
 'gemini:gemini-3.1-flash-tts-preview':{input:1,audioOutput:20},
 'gemini:gemini-2.5-flash-preview-tts':{input:.50,audioOutput:10}
};
const rateFields=['input','output','audioInput','audioOutput','cached','cachedAudio'];
const count=value=>Number.isSafeInteger(value)&&value>=0?value:undefined;
export function modelRate(provider,model){
 const key=provider+':'+model;
 let override;
 try{override=JSON.parse(process.env.AI_MODEL_RATES_JSON||'{}')?.[key];}catch{}
 if(!override||typeof override!=='object'||Array.isArray(override))return defaults[key]??null;
 const entries=Object.entries(override);
 if(!entries.length||!entries.every(([field,value])=>rateFields.includes(field)&&Number.isFinite(value)&&value>=0))return defaults[key]??null;
 return {...defaults[key],...Object.fromEntries(entries)};
}
function modality(details,type){
 if(!Array.isArray(details))return undefined;
 const found=details.filter(item=>String(item.modality).toUpperCase()===type);
 return found.reduce((n,item)=>n+(count(item.tokenCount??item.tokens)??0),0);
}
export function readProviderUsage(provider,data,{audioIn=false,audioOut=false}={}){
 const u=provider==='openai'?data?.usage:(data?.usageMetadata??data?.usage_metadata??data?.usage);
 if(!u)return {};
 if(provider==='openai'){
  const inputDetails=u.input_tokens_details??u.prompt_tokens_details;
  const outputDetails=u.output_tokens_details??u.completion_tokens_details;
  return {
   input:count(u.input_tokens??u.prompt_tokens),output:count(u.output_tokens??u.completion_tokens),
   cached:count(inputDetails?.cached_tokens)??0,
   audioInput:count(inputDetails?.audio_tokens)??(audioIn?undefined:0),
   audioOutput:count(outputDetails?.audio_tokens)??(audioOut?undefined:0)
  };
 }
 const inputDetails=u.promptTokensDetails??u.input_tokens_by_modality;
 const outputDetails=u.candidatesTokensDetails??u.output_tokens_by_modality;
 const cacheDetails=u.cacheTokensDetails;
 const output=count(u.candidatesTokenCount??u.total_output_tokens??u.output_tokens);
 return {
  input:count(u.promptTokenCount??u.total_input_tokens??u.input_tokens),
  output:output===undefined?undefined:output+(count(u.thoughtsTokenCount)??(u.total_output_tokens==null?count(u.total_thought_tokens):0)??0),
  cached:count(u.cachedContentTokenCount??u.total_cached_tokens)??0,
  cachedAudio:modality(cacheDetails,'AUDIO'),
  audioInput:modality(inputDetails,'AUDIO')??(audioIn?undefined:0),
  audioOutput:modality(outputDetails,'AUDIO')??(audioOut?undefined:0)
 };
}
export function estimateUSD(usage,rate){
 const {input,output,audioInput,audioOutput,cached=0,cachedAudio}=usage;
 if(!rate||[input,output,audioInput,audioOutput].some(v=>count(v)===undefined))return null;
 if(audioInput>input||audioOutput>output||cached>input)return null;
 // Mixed audio and cached input require the provider to identify cached audio.
 if(audioInput&&cached&&cachedAudio===undefined)return null;
 const audioCached=cachedAudio??0;
 if(audioCached>audioInput||audioCached>cached||cached-audioCached>input-audioInput)return null;
 const units={input:input-audioInput-cached+audioCached,output:output-audioOutput,audioInput:audioInput-audioCached,audioOutput,cached:cached-audioCached,cachedAudio:audioCached};
 if(Object.entries(units).some(([key,n])=>n>0&&rate[key]===undefined))return null;
 return Object.entries(units).reduce((usd,[key,n])=>usd+n*(rate[key]??0)/1e6,0);
}
const safeId=value=>typeof value==='string'&&/^[\w.:-]{1,100}$/.test(value)?value:null;
function wavSeconds(encoded){
 if(typeof encoded!=='string')return undefined;
 const header=Buffer.from(encoded.slice(0,8192),'base64');
 if(header.toString('ascii',0,4)!=='RIFF')return undefined;
 let bytesPerSecond=0;
 for(let offset=12;offset+8<=header.length;){
  const kind=header.toString('ascii',offset,offset+4),size=header.readUInt32LE(offset+4);
  if(kind==='fmt '&&offset+20<=header.length)bytesPerSecond=header.readUInt32LE(offset+16);
  if(kind==='data')return bytesPerSecond?Math.round(size/bytesPerSecond*100)/100:undefined;
  offset+=8+size+(size%2);
 }
}
function requestMetadata(url,options){
 const parsed=new URL(url),provider=parsed.hostname==='api.openai.com'?'openai':parsed.hostname==='generativelanguage.googleapis.com'?'gemini':null;
 if(!provider||options?.method!=='POST')return null;
 let body;
 try{body=JSON.parse(options.body);}catch{}
 const model=safeId(body?.model?.replace(/^models\//,''))??safeId(parsed.pathname.match(/\/models\/([^/:]+)/)?.[1])??'unknown';
 const speech=parsed.pathname.endsWith('/audio/speech')||/tts/i.test(model);
 const parts=body?.messages?.flatMap(m=>Array.isArray(m.content)?m.content:[])??body?.contents?.flatMap(c=>c.parts??[])??[];
 const audioIn=parts.some(p=>p.type==='input_audio'||/^audio\//.test(p.inline_data?.mime_type??p.inlineData?.mimeType??''));
 const audioOut=speech||body?.modalities?.includes('audio')||body?.response_modalities?.includes('audio');
 const seconds=parts.map(part=>wavSeconds(part.input_audio?.data??part.inline_data?.data??part.inlineData?.data)).filter(value=>value!==undefined);
 return {provider,model,speech,audioIn,audioOut,requestedAudioSeconds:seconds.length?seconds.reduce((a,b)=>a+b,0):undefined,
  requestedCharacters:speech&&typeof body?.input==='string'?Array.from(body.input).length:undefined};
}
export async function meteredFetch(fetchImpl,url,options,stage){
 const current=scope.getStore(),meta=current&&requestMetadata(url,options);
 if(!meta)return fetchImpl(url,options);
 const {pool,userId,requestId,operationId,feature}=current;
 const {provider,model,speech}=meta;
 const tier=current.tier??(userId&&current.getTier?await current.getTier(userId).catch(()=>null):null);
 const rate=modelRate(provider,model),callId=randomUUID();
 let recorded=false,response;
 let usage={requestedAudioSeconds:meta.requestedAudioSeconds,requestedCharacters:meta.requestedCharacters};
 try{
  await pool.query(`INSERT INTO ai_provider_calls(id,request_id,user_id,tier,operation_id,feature,stage,provider,model,rate)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb)`,
  [callId,requestId,userId,tier,operationId,feature,stage??(speech?'tts':'inference'),provider,model,JSON.stringify(rate)]);
  recorded=true;
 }catch{console.warn('AI usage log could not be started');}
 try{
  response=await fetchImpl(url,options);
  // Binary OpenAI speech responses have no token counts. Keep their costs unknown.
  if(recorded&&!(speech&&provider==='openai')&&response.clone){
   try{usage={...usage,...readProviderUsage(provider,await response.clone().json(),meta)};}catch{}
  }
  return response;
 }finally{
  if(recorded)try{
   await pool.query(`UPDATE ai_provider_calls SET finished_at=now(),http_status=$2,success=$3,usage=$4::jsonb,estimated_usd=$5 WHERE id=$1`,
   [callId,response?.status??null,response?.ok===true,JSON.stringify(usage),estimateUSD(usage,rate)]);
  }catch{console.warn('AI usage log could not be finalized');}
 }
}
