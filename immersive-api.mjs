import {getLesson} from './course.mjs';
import {loadImmersiveUnit} from './immersive/loader.mjs';
import {serveStudioSpeech} from './speech-api.mjs';
export async function handleImmersiveAudio({route,req,res,pool,send,fail,limited,serveAudio=serveStudioSpeech}){
 if(!route.startsWith('/api/immersive/audio/'))return false;
 const match=route.match(/^\/api\/immersive\/audio\/([a-z0-9-]+)\/(reading|listening|roleplay)\/(\d{1,2})$/);
 if(!match)fail(404,'Recording not found');
 if(req.method!=='GET')fail(405,'Use GET for lesson recordings');
 const lesson=getLesson(match[1]);if(!lesson?.immersive)fail(404,'Recording not found');
 const unit=await loadImmersiveUnit(lesson.language,lesson.immersive.key),part=Number(match[3]);
 const text=match[2]==='roleplay'?unit.questions.roleplay[part]?.sceneLine:unit[match[2]][part]?.text;
 if(typeof text!=='string'||!text.trim()||text.length>1800)fail(404,'Recording not found');
 limited(req,'immersive-recording',120);
 if(new URL(req.url,'http://localhost').searchParams.get('format')==='text'){send(res,200,{text,locale:lesson.locale});return true;}
 return serveAudio({req,res,pool,text,locale:lesson.locale,send,fail,limited});
}
