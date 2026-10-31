// SERVER ONLY: licensed recordings and gated course speech never enter JS bundles.
import manifest from './bundled-audio-manifest.json' with {type:'json'};
import en from './bundled-audio-data-en.json' with {type:'json'};
import es from './bundled-audio-data-es.json' with {type:'json'};
import pt from './bundled-audio-data-pt.json' with {type:'json'};
import zh from './bundled-audio-data-zh.json' with {type:'json'};
import ko from './bundled-audio-data-ko.json' with {type:'json'};
import fr from './bundled-audio-data-fr.json' with {type:'json'};
import de from './bundled-audio-data-de.json' with {type:'json'};
import ar from './bundled-audio-data-ar.json' with {type:'json'};
import it from './bundled-audio-data-it.json' with {type:'json'};
import {recordingIdentity} from './bundled-human-public.mjs';
const bytes={en,es,pt,zh,ko,fr,de,ar,it};
const byText=new Map(manifest.map(r=>[recordingIdentity(r.text,r.locale),r]));
export const bundledRecordings=manifest;
export function bundledRecording(text,locale){
 const record=byText.get(recordingIdentity(text,locale));if(!record)return null;
 const encoded=bytes[locale.split('-')[0]]?.[record.key];if(!encoded)throw Error('Missing bundled speech asset: '+record.key);
 return {record,audio:Buffer.from(encoded,'base64')};
}
export function serveBundledRecording({res,text,locale,privateAudio=false}){
 const clip=bundledRecording(text,locale);if(!clip)return false;
 const {record,audio}=clip,credit=record.kind==='human'?Object.fromEntries(['author','region','source','license','licenseUrl','changes'].map(k=>[k,record[k]])):null;
 res.writeHead(200,{'Content-Type':'audio/mpeg','Content-Length':audio.length,'Cache-Control':privateAudio?'private, no-store':'public, max-age=86400','X-Audio-Source':record.kind==='human'?'Human recording':'AI-generated studio voice','X-Audio-Delivery':'bundled','X-Audio-Locale':locale,'X-Audio-Version':'bundled-lessons-v1',...(credit?{'X-Audio-Attribution':encodeURIComponent(JSON.stringify(credit))}:{})});res.end(audio);return true;
}
