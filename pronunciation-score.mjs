// A transparent word-sequence match for fixed model sentences. This is not a
// phoneme, accent, or CEFR assessment; the UI labels it accordingly.
export function normalizeSpeech(value,locale='es'){
 let text=String(value||'').toLocaleLowerCase(locale||'es').normalize('NFC');
 // Preserve the original Spanish matcher while keeping lexical distinctions
 // such as German schon/schön and French a/à in the new languages.
 if(locale.startsWith('es'))text=text.normalize('NFD').replace(/\p{Diacritic}/gu,'').normalize('NFC');
 if(locale.startsWith('ar'))text=text.replace(/[\u064b-\u0652\u0670]/g,'');
 return text.replace(/[^\p{L}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim();
}
export function speechTokens(value,locale='es'){const normalized=normalizeSpeech(value,locale);if(!normalized)return [];if(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(normalized))return [...new Intl.Segmenter(locale.startsWith('ja')?'ja':'zh',{granularity:'word'}).segment(normalized.replace(/\s+/g,''))].filter(x=>x.isWordLike).map(x=>x.segment);return normalized.split(' ')}
function lcs(a,b){
 const row=new Array(b.length+1).fill(0);
 for(let i=1;i<=a.length;i++){let diagonal=0;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=a[i-1]===b[j-1]?diagonal+1:Math.max(row[j],row[j-1]);diagonal=old}}
 return row[b.length];
}
export function scorePronunciation(target,spoken,locale='es'){
 const expected=speechTokens(target,locale),heard=speechTokens(spoken,locale);
 if(!expected.length||!heard.length)return {score:0,matched:0,total:expected.length,missing:expected,label:'No speech detected'};
 const matched=lcs(expected,heard),precision=matched/heard.length,recall=matched/expected.length;
 const match=precision+recall?2*precision*recall/(precision+recall):0;
 const remaining=[...heard],missing=expected.filter(word=>{const index=remaining.indexOf(word);if(index<0)return true;remaining.splice(index,1);return false});
 const score=Math.round(match*100),label=score>=90?'Strong match':score>=75?'Close match':score>=55?'Developing':'Try once more';
 return {score,matched,total:expected.length,missing,label};
}
