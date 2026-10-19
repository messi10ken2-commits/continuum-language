import {conversationPartner} from './conversation-partners.mjs';
import {serveStudioSpeech} from './speech-api.mjs';
import {languageInfo} from './languages.mjs';
import crypto from 'node:crypto';
import {aiConfigured} from './ai-assessment.mjs';
import {validInterfaceLanguage} from './interface-languages.mjs';
import {speakingScenarios,scenarioById,validSpeakingLanguage,validSpeakingLevel,maxSpeakingTurns} from './speaking-content.mjs';
import {replySpeaking,reviewSpeaking,voiceTurnSpeaking} from './speaking-ai.mjs';
export async function migrateSpeaking(pool){await pool.query(`CREATE TABLE IF NOT EXISTS speaking_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 language text NOT NULL,level text NOT NULL,scenario text NOT NULL,display_language text NOT NULL DEFAULT 'en',
 messages jsonb NOT NULL DEFAULT '[]',review jsonb,status text NOT NULL DEFAULT 'active',revision integer NOT NULL DEFAULT 0,
 lease_token uuid,lease_until timestamptz,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now());
 CREATE INDEX IF NOT EXISTS speaking_user_language ON speaking_sessions(user_id,language,updated_at DESC);`);}
export const publicSpeaking=s=>({id:s.id,language:s.language,level:s.level,scenario:s.scenario,displayLanguage:s.display_language,messages:s.messages,review:s.review,status:s.status,revision:s.revision,at:s.updated_at});
const audioValid=r=>r&&typeof r.audio==='string'&&r.audio.length<=1400000&&/^data:audio\/(webm|mp4|ogg|wav)(;codecs=(?:[a-zA-Z0-9.,-]+|"[a-zA-Z0-9., -]+"))?;base64,[A-Za-z0-9+/]+=*$/.test(r.audio)&&Number.isFinite(r.seconds)&&r.seconds>=1&&r.seconds<=90;
const turnFingerprint=d=>crypto.createHash('sha256').update(JSON.stringify(d.audio?{audio:d.audio.audio,seconds:d.audio.seconds}:{text:typeof d.text==='string'?d.text.trim():null})).digest('hex');
export async function handleSpeaking({route,req,res,pool,required,json,send,fail,limited,reply=replySpeaking,review=reviewSpeaking,voiceTurn=voiceTurnSpeaking,serveAudio=serveStudioSpeech}){
 if(!route.startsWith('/api/speaking'))return false;
 const user=await required(req,'learner');
 const url=new URL(req.url,'http://localhost');
 if(route==='/api/speaking'&&req.method==='GET'){
  const language=url.searchParams.get('language');if(!validSpeakingLanguage(language))fail(400,'Choose a learning language');
  const r=await pool.query('SELECT * FROM speaking_sessions WHERE user_id=$1 AND language=$2 ORDER BY updated_at DESC LIMIT 30',[user.id,language]);
  send(res,200,{available:aiConfigured(),scenarios:speakingScenarios,sessions:r.rows.map(publicSpeaking)});return true;
 }
 if(route==='/api/speaking'&&req.method==='POST'){
  limited(req,'speaking-start',30);const d=await json(req),s=scenarioById(d.scenario);
  if(d.aiConsent!==true)fail(400,'Confirm AI conversation processing before starting');
  if(!s||!validSpeakingLanguage(d.language)||!validSpeakingLevel(d.level)||!validInterfaceLanguage(d.displayLanguage))fail(400,'Choose a valid language, level and scenario');
  if(!aiConfigured())fail(503,'AI conversation is temporarily unavailable. Please try again later.');
  const r=await pool.query('INSERT INTO speaking_sessions(user_id,language,level,scenario,display_language,messages) VALUES($1,$2,$3,$4,$5,$6::jsonb) RETURNING *',[user.id,d.language,d.level,s.id,d.displayLanguage,JSON.stringify([{role:'assistant',text:s.opening[d.language],mode:'text'}])]);
  send(res,201,{session:publicSpeaking(r.rows[0])});return true;
 }
 const audioRoute=route.match(/^\/api\/speaking\/([a-f0-9-]{36})\/audio\/(\d+|review\/\d+)$/);
 if(audioRoute){
  if(req.method!=='GET')fail(405,'Use GET for conversation audio');
  const record=await pool.query('SELECT * FROM speaking_sessions WHERE id=$1 AND user_id=$2',[audioRoute[1],user.id]),row=record.rows[0];
  if(!row)fail(404,'Conversation not found');
  const part=audioRoute[2],index=Number(part.split('/').at(-1));
  const text=part.startsWith('review/')?row.review?.corrections?.[index]?.improved:row.messages[index]?.role==='assistant'?row.messages[index].text:null;
  if(!text)fail(404,'Conversation audio not found');
  if(url.searchParams.get('format')==='text'){send(res,200,{text,locale:languageInfo(row.language).locale});return true;}
  return serveAudio({req,res,pool,text,locale:languageInfo(row.language).locale,send,fail,limited,privateAudio:true,voiceProfile:conversationPartner(row.language,row.scenario).voice});
 }
 const match=route.match(/^\/api\/speaking\/([a-f0-9-]{36})(?:\/(turn|review))?$/);if(!match)fail(404,'Conversation endpoint not found');
 const r=await pool.query('SELECT * FROM speaking_sessions WHERE id=$1 AND user_id=$2',[match[1],user.id]),s=r.rows[0];if(!s)fail(404,'Conversation not found');
 if(!match[2]&&req.method==='GET'){send(res,200,{session:publicSpeaking(s)});return true;}
 if(req.method!=='POST'||!match[2])fail(404,'Conversation endpoint not found');
 const d=await json(req);
 if(d.aiConsent!==true)fail(400,'Confirm AI conversation processing before continuing');
 if(match[2]==='turn'&&typeof d.turnKey==='string'&&s.messages.some(m=>m.key===d.turnKey)){if(s.messages.find(m=>m.key===d.turnKey).inputHash!==turnFingerprint(d))fail(409,'This reply was already sent with different content. Reload the saved conversation.');send(res,200,{session:publicSpeaking(s)});return true;}
 if(match[2]==='review'&&s.review){send(res,200,{session:publicSpeaking(s)});return true;}
 if(s.status==='completed')fail(409,'This conversation has ended. Start a new conversation.');
 if(d.revision!==s.revision)fail(409,'The conversation changed. Reload it before continuing.');
 const turns=s.messages.filter(m=>m.role==='user').length;
 if(match[2]==='turn'){
  if(turns>=maxSpeakingTurns)fail(400,'This conversation is ready for review.');
  if(typeof d.turnKey!=='string'||!/^[-a-zA-Z0-9]{10,100}$/.test(d.turnKey))fail(400,'Invalid conversation turn');
  if(d.audio){if(d.text!==undefined||!audioValid(d.audio))fail(400,'Record a valid response of 1–90 seconds');}
  else if(typeof d.text!=='string'||!d.text.trim()||d.text.length>2000)fail(400,'Write a reply of 1–2000 characters');
 }else if(turns<2)fail(400,'Send at least two replies before requesting a review.');
 limited(req,'speaking-ai',60);
 const token=crypto.randomUUID();
 const locked=await pool.query("UPDATE speaking_sessions SET lease_token=$3,lease_until=now()+interval '5 minutes' WHERE id=$1 AND user_id=$2 AND revision=$4 AND (lease_until IS NULL OR lease_until<now()) RETURNING id",[s.id,user.id,token,s.revision]);
 if(!locked.rows.length)fail(409,'A conversation response is already running. Please wait or reload.');
 try{
  let messages=s.messages,result=s.review;
  if(match[2]==='turn'){
   const turn=d.audio?await voiceTurn(s,d.audio):{transcript:d.text.trim(),reply:await reply(s,d.text.trim())};
   const text=turn.transcript,response=turn.reply;
   messages=[...messages,{role:'user',text,mode:d.audio?'voice':'text',key:d.turnKey,inputHash:turnFingerprint(d)},{role:'assistant',text:response,mode:'text'}];
  }else result=await review(s);
  const updated=await pool.query('UPDATE speaking_sessions SET messages=$3::jsonb,review=$4::jsonb,status=$5,revision=revision+1,lease_token=NULL,lease_until=NULL,updated_at=now() WHERE id=$1 AND user_id=$2 AND lease_token=$6 RETURNING *',[s.id,user.id,JSON.stringify(messages),JSON.stringify(result),result?'completed':'active',token]);
  if(!updated.rows.length)fail(409,'The conversation changed. Reload it before continuing.');
  send(res,200,{session:publicSpeaking(updated.rows[0])});return true;
 }catch(e){if(e.status&&e.status<500)throw e;console.warn('Speaking provider unavailable',JSON.stringify({operation:match[2],kind:e.name||'Error',code:/^[A-Z_]{1,50}$/.test(e.code||'')?e.code:undefined,providerStatus:e.providerStatus}));fail(503,match[2]==='review'?'Your conversation is saved, but the review could not be created. Please try creating the review again.':'AI conversation could not finish. Your saved conversation is unchanged; your unsent reply remains on this page. Please try again.');}
 finally{await pool.query('UPDATE speaking_sessions SET lease_token=NULL,lease_until=NULL WHERE id=$1 AND user_id=$2 AND lease_token=$3',[s.id,user.id,token]);}
}
