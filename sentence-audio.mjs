// Keep blanks silent: audio must never infer or insert an answer.
export function cleanSpeech(text){return String(text||'').replace(/_{2,}|\[\s*…?\s*\]/g,', … ,').replace(/\bB (?=doce|dieciséis)/g,'be ');}
export function languageFor(text){
 const s=String(text||'');
 return /\b(i|we|they|he|she|it|would|could|should|an|not|yes|true|false|only|already|because|the|choose|complete|which|what|your|you|this|that|use|sentence|correct|means|answer|read|listen|write|select|is|are|have|with|without|from|before|after|for|to|and|of)\b/i.test(s)?'en-US':'es-ES';
}
export function speechParts(text,lang='auto',fallback='es-ES'){
 const value=cleanSpeech(text);
 if(lang!=='auto')return [{text:value,lang}];
 // Quoted Spanish and Spanish sentences following English instructions get their own voice.
 return value.split(/([“«][^”»]+[”»]|"[^"]+"|(?<=:)\s+)/u).filter(s=>s.trim()).map(s=>({text:s,lang:languageFor(s)==='es-ES'?fallback:'en-US'}));
}

export const isolatedSpeechWord=text=>String(text).trim().length<=40&&/^[\p{Script=Latin}\p{M}]+(?:[-’'][\p{Script=Latin}\p{M}]+)*$/u.test(String(text).trim());


// The clock hour 7 is しちじ. Leave larger numbers and durations untouched.
export function speechPronunciation(text,locale){
 return /^ja-JP(?:-|$)/.test(locale)
  ?text.replace(/(?<![0-9０-９〇零一二三四五六七八九十百千万])(?:七|7|７)時(?!間)/gu,'しちじ')
  :text;
}
