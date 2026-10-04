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
