// A transparent word-sequence match for fixed model sentences. This is not a
// phoneme, accent, or CEFR assessment; the UI labels it accordingly.
export function normalizeSpeech(value){
 return String(value||'').toLocaleLowerCase('es').normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/[^a-zñü0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}
export function speechTokens(value){const normalized=normalizeSpeech(value);return normalized?normalized.split(' '):[]}
function lcs(a,b){
 const row=new Array(b.length+1).fill(0);
 for(let i=1;i<=a.length;i++){let diagonal=0;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=a[i-1]===b[j-1]?diagonal+1:Math.max(row[j],row[j-1]);diagonal=old}}
 return row[b.length];
}
export function scorePronunciation(target,spoken){
 const expected=speechTokens(target),heard=speechTokens(spoken);
 if(!expected.length||!heard.length)return {score:0,matched:0,total:expected.length,missing:expected,label:'No speech detected'};
 const matched=lcs(expected,heard),precision=matched/heard.length,recall=matched/expected.length;
 const match=precision+recall?2*precision*recall/(precision+recall):0;
 const remaining=[...heard],missing=expected.filter(word=>{const index=remaining.indexOf(word);if(index<0)return true;remaining.splice(index,1);return false});
 const score=Math.round(match*100),label=score>=90?'Strong match':score>=75?'Close match':score>=55?'Developing':'Try once more';
 return {score,matched,total:expected.length,missing,label};
}
