// Shared event shape: the timeline retains lesson categories, scores and every
// saved attempt instead of duplicating a short preview in a second list.
export function savedTimelineEvents(attempts=[],notes=[],titleFor=id=>id){
 return [...attempts.map((a,i)=>({id:`practice-${a.id||i}`,at:a.at,kind:'Practice',lesson:a.lesson||'subjunctive',title:titleFor(a.lesson||'subjunctive'),score:a.score,total:a.total,source:a.source,withTime:true})),
 ...notes.map((n,i)=>({id:`note-${n.id||i}`,at:n.at,kind:'Class note',title:[n.focus,n.teacher].filter(Boolean).join(' · '),note:n.note}))]
 .sort((a,b)=>new Date(b.at||0)-new Date(a.at||0));
}
