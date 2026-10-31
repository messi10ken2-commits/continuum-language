// SERVER ONLY: gated transcripts and audio never enter the browser bundle.
import fs from 'node:fs';
import manifest from './bundled-audio-manifest.json' with {type:'json'};
import {recordingIdentity} from './bundled-human-public.mjs';
const byText=new Map(manifest.map(r=>[recordingIdentity(r.text,r.locale),r]));
const packs=new Map(),MAX_PACK_BYTES=64*1024*1024;let packBytes=0;
function audioPack(name){
 if(!/^(?:(?:en|es|pt|ja|zh|ko|fr|de|ar|it)|complete-(?:en|es|pt|ja|zh|ko|fr|de|ar|it)-[0-7])$/.test(name))throw Error('Invalid bundled audio pack');
 if(packs.has(name)){const e=packs.get(name);packs.delete(name);packs.set(name,e);return e.data;}
 const raw=fs.readFileSync(new URL('./bundled-audio-data-'+name+'.json',import.meta.url),'utf8'),bytes=Buffer.byteLength(raw);
 while(packBytes+bytes>MAX_PACK_BYTES&&packs.size){const oldest=packs.keys().next().value;packBytes-=packs.get(oldest).bytes;packs.delete(oldest);}
 const data=JSON.parse(raw);if(bytes<=MAX_PACK_BYTES){packs.set(name,{data,bytes});packBytes+=bytes;}return data;
}
export const bundledRecordings=manifest;
export const bundledRecordingInfo=(text,locale)=>byText.get(recordingIdentity(text,locale))||null;
export function bundledRecording(text,locale){const record=bundledRecordingInfo(text,locale);if(!record)return null;const encoded=audioPack(record.pack||locale.split('-')[0])?.[record.key];if(!encoded)throw Error('Missing bundled speech asset: '+record.key);return {record,audio:Buffer.from(encoded,'base64')};}
export function serveBundledRecording({res,text,locale,privateAudio=false}){
 const clip=bundledRecording(text,locale);if(!clip)return false;const {record,audio}=clip,credit=record.kind==='human'?Object.fromEntries(['author','region','source','license','licenseUrl','changes'].map(k=>[k,record[k]])):null;
 res.writeHead(200,{'Content-Type':'audio/mpeg','Content-Length':audio.length,'Cache-Control':privateAudio?'private, no-store':'public, max-age=86400','X-Audio-Source':record.kind==='human'?'Human recording':'AI-generated studio voice','X-Audio-Delivery':'bundled','X-Audio-Locale':locale,'X-Audio-Version':'bundled-lessons-v2',...(credit?{'X-Audio-Attribution':encodeURIComponent(JSON.stringify(credit))}:{})});res.end(audio);return true;
}
