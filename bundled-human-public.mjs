import records from './bundled-human-public.json' with {type:'json'};
// Only metadata for public-curriculum human recordings is client-visible.
// Keep case, spacing, accents and punctuation: no fuzzy pronunciation matching.
export const recordingIdentity=(text,locale)=>JSON.stringify([locale,String(text||'').normalize('NFC').trim()]);
const byText=new Map(records.map(r=>[recordingIdentity(r.text,r.locale),r]));
export const publicHumanRecording=(text,locale)=>byText.get(recordingIdentity(text,locale));
export const publicHumanRecordings=records;
