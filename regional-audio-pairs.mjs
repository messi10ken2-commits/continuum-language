import {expandedRegionalPairs} from './expanded-regional-pairs.mjs';
// Original comparison examples. Locale requests are synthetic, not certified accents.
const pair=(label,a,al,b,bl)=>({label,variants:[{text:a,locale:al},{text:b,locale:bl}]});
export const regionalAudioPairs={
 en:[pair('Britain / Australia','Let’s meet this afternoon.','en-GB','Let’s meet this arvo.','en-AU'),pair('Britain / America','Where is the lift?','en-GB','Where is the elevator?','en-US'),pair('Britain / America','flat','en-GB','apartment','en-US'),pair('Britain / America','chemist','en-GB','pharmacy','en-US'),pair('Australia / America','thongs','en-AU','flip-flops','en-US')],
 es:[pair('Spain / Río de la Plata','¿Tú tienes tiempo mañana?','es-ES','¿Vos tenés tiempo mañana?','es-AR'),pair('Spain / Mexico','¿Vosotros queréis tomar algo?','es-ES','¿Ustedes quieren tomar algo?','es-MX'),pair('Spain / Mexico','ordenador','es-ES','computadora','es-MX'),pair('Spain / Mexico','zumo','es-ES','jugo','es-MX'),pair('Present indicative · Spain / Río de la Plata','tú hablas','es-ES','vos hablás','es-AR'),pair('Present indicative · Spain / Río de la Plata','tú comes','es-ES','vos comés','es-AR'),pair('Present indicative · Spain / Río de la Plata','tú vives','es-ES','vos vivís','es-AR'),pair('Present indicative · Spain / Río de la Plata','tú eres','es-ES','vos sos','es-AR'),pair('Present indicative · Spain / Río de la Plata','tú puedes','es-ES','vos podés','es-AR'),pair('Affirmative command · Spain / Río de la Plata','ven','es-ES','vení','es-AR'),pair('Affirmative command · Spain / Río de la Plata','habla','es-ES','hablá','es-AR'),pair('Affirmative command · Spain / Río de la Plata','haz','es-ES','hacé','es-AR'),pair('Affirmative command · Spain / Río de la Plata','di','es-ES','decí','es-AR'),pair('Affirmative command · Spain / Río de la Plata','ve','es-ES','andá','es-AR')],
 pt:[pair('Brazil / Portugal','Estou esperando o ônibus.','pt-BR','Estou a esperar o autocarro.','pt-PT'),pair('Brazil / Portugal','celular','pt-BR','telemóvel','pt-PT'),pair('Brazil / Portugal','trem','pt-BR','comboio','pt-PT'),pair('Brazil / Portugal','Estou estudando agora.','pt-BR','Estou a estudar agora.','pt-PT'),pair('Brazil / Portugal','café da manhã','pt-BR','pequeno-almoço','pt-PT')],
 ja:[pair('Standard Japanese / Kansai','ありがとう','ja-JP','おおきに',null),pair('Standard Japanese / Kansai','本当','ja-JP','ほんま',null),pair('Standard Japanese / Kansai','だめ','ja-JP','あかん',null),pair('Standard Japanese / Kansai','いくら','ja-JP','なんぼ',null),pair('Standard Japanese / Kansai','じゃあ','ja-JP','ほな',null)]
};
Object.assign(regionalAudioPairs,expandedRegionalPairs);
export const kansaiComparisonVideo={provider:'youtube',youtubeId:'tW1kj38VZ2c',source:'https://www.youtube.com/watch?v=tW1kj38VZ2c',credit:'Miku Real Japanese · Miku and Yuyu',sourceTitle:'Standard Japanese VS Kansai dialect (関西弁 VS 標準語)',hint:'Compare the speakers’ regional forms and intonation. Examples in the written table are separate teaching material; the video is not a recording of every table entry.'};
// These clips practise regional wording using a clearly labelled standard voice.
// Authentic regional pronunciation stays with the native-speaker references.
const wordingVoices={'es-AR':'es-ES','es-MX':'es-ES','pt-PT':'pt-BR'};
export const regionalPlaybackLocale=locale=>wordingVoices[locale]||locale;
export const regionalWordingOnly=locale=>Object.hasOwn(wordingVoices,locale||'');
export const regionalWordingNote='Standard-language studio voice for this wording. Use the native-speaker references for the regional accent.';
const frameVariant=(course,text)=>(regionalAudioPairs[course.language]||[]).flatMap(p=>p.variants).find(v=>v.text===text);
export const regionalFrameVoice=(course,text)=>regionalPlaybackLocale(frameVariant(course,text)?.locale)||null;
export const regionalFrameWording=(course,text)=>regionalWordingOnly(frameVariant(course,text)?.locale);
