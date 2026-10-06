import nativeWordAudio from './native-words.json' with {type:'json'};
import {nativeWordEntry,nativeWordRecordings} from './native-word-map.mjs';
import nativeKanaAudio from './native-kana.json' with {type:'json'};
import {nativeKanaKey} from './native-kana-map.mjs';
import {lessonList} from './course.mjs';
import {skillTasks} from './skills-content.mjs';
import {assessmentItems,assessmentFormCount} from './assessment-bank.mjs';
import exerciseBank from './lesson-exercises.json' with {type:'json'};
import {speechParts,cleanSpeech} from './sentence-audio.mjs';
import {synthesizeSpeech,speechKey,speechLocales,speechVersion} from './speech-service.mjs';
// Only authored public curriculum may reach a paid speech provider. No arbitrary
// user text, private class notes, or learner recordings enter this endpoint.
const catalog=new Set();
function collect(value){
 if(typeof value==='string'){
  const text=cleanSpeech(value).normalize('NFC').trim();if(text.length&&text.length<=1800)catalog.add(text);
  for(const locale of speechLocales)for(const part of speechParts(value,'auto',locale)){const s=part.text.normalize('NFC').trim();if(s&&s.length<=1800)catalog.add(s);}
 }else if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object')Object.values(value).forEach(collect);
}
collect(lessonList);collect(skillTasks);collect(exerciseBank);
for(const recording of nativeWordRecordings)collect(recording.text);
for(const lang of ['es','en','pt','ja'])for(let form=0;form<assessmentFormCount;form++){
 try{collect(assessmentItems(form,lang+'-diagnostic-3'));}catch{/* Unsupported historical form is not in the public catalog. */}
}
export const allowedSpeech=(text,locale)=>typeof text==='string'&&speechLocales.includes(locale)&&catalog.has(text.normalize('NFC').trim());
export async function migrateSpeech(pool){await pool.query(`CREATE TABLE IF NOT EXISTS speech_cache (cache_key text PRIMARY KEY, audio bytea NOT NULL, provider text NOT NULL, model text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()); CREATE TABLE IF NOT EXISTS speech_daily_budget (day date PRIMARY KEY, generated integer NOT NULL DEFAULT 0);`);}
const inFlight=new Map();let active=0;
export async function handleSpeech({route,req,res,pool,json,send,fail,limited,synthesize=synthesizeSpeech}){
 if(route!=='/api/speech')return false;
 if(req.method!=='POST')fail(405,'Use POST for speech');
 const data=await json(req),text=typeof data.text==='string'?data.text.normalize('NFC').trim():null,locale=data.locale;
 if(!allowedSpeech(text,locale))fail(400,'This text is not available as a studio recording.');
 const word=nativeWordEntry(text,locale);
 if(word){const bytes=Buffer.from(nativeWordAudio[word.key],'base64');res.writeHead(200,{'Content-Type':'audio/mpeg','Content-Length':bytes.length,'Cache-Control':'public, max-age=86400','X-Audio-Source':'Human recording','X-Audio-Version':'native-words-v1'});res.end(bytes);return true;}
 const native=nativeKanaKey(text,locale);
 if(native){const bytes=Buffer.from(nativeKanaAudio[native],'base64');res.writeHead(200,{'Content-Type':'audio/mpeg','Content-Length':bytes.length,'Cache-Control':'public, max-age=86400','X-Audio-Source':'Human recording','X-Audio-Version':'native-kana-v1'});res.end(bytes);return true;}
 const key=speechKey(text,locale);const existing=await pool.query('SELECT audio,provider,model FROM speech_cache WHERE cache_key=$1',[key]);
 let result=existing.rows[0],cached=!!result;
 if(!result){
  limited(req,'studio-speech',180);
  if(!inFlight.has(key)){
   if(active>=4)fail(429,'Studio voice is busy. Please retry in a moment.');
   const task=(async()=>{active++;try{
    const budget=await pool.query(`INSERT INTO speech_daily_budget(day,generated) VALUES(CURRENT_DATE,1) ON CONFLICT(day) DO UPDATE SET generated=speech_daily_budget.generated+1 WHERE speech_daily_budget.generated<$1 RETURNING generated`,[Number(process.env.TTS_DAILY_LIMIT)||1000]);
    if(!budget.rows.length)fail(429,'Today’s new-audio limit has been reached. Saved audio is still available.');
    const generated=await synthesize(text,locale);
    await pool.query('INSERT INTO speech_cache(cache_key,audio,provider,model) VALUES($1,$2,$3,$4) ON CONFLICT(cache_key) DO NOTHING',[key,generated.audio,generated.provider,generated.model]);
    // Bound persistent audio storage to the newest 256 MB. Evicted clips can be regenerated.
    await pool.query(`DELETE FROM speech_cache WHERE cache_key IN (SELECT cache_key FROM (SELECT cache_key,SUM(octet_length(audio)) OVER (ORDER BY created_at DESC,cache_key) AS bytes FROM speech_cache) ranked WHERE bytes>268435456)`);return generated;
   }finally{active--;}})();inFlight.set(key,task);
   task.finally(()=>inFlight.delete(key)).catch(()=>{});
  }
  try{result=await inFlight.get(key);}catch(e){if(e.status===503){send(res,503,{error:e.message,...(e.retryAfter?{retryAfter:e.retryAfter}:{})},e.retryAfter?{'Retry-After':String(e.retryAfter)}:{});return true;}throw e;}
 }
 const bytes=Buffer.from(result.audio);res.writeHead(200,{'Content-Type':'audio/wav','Content-Length':bytes.length,'Cache-Control':'private, max-age=86400','X-Audio-Source':'AI-generated studio voice','X-Audio-Cache':cached?'hit':'miss','X-Audio-Version':speechVersion});res.end(bytes);return true;
}
