// Correct shared legacy feedback without changing question order or answer keys.
export function correctEntryNote(base,q){
 const match=/^entry:(\d+):/.exec(q.coverage||'');
 const entry=match&&(base?.expressions||base?.vocabulary||[])[Number(match[1])];
 if(!entry?.previousPitfall||!q.note?.includes(entry.previousPitfall))return q;
 return {...q,note:q.note.replaceAll(entry.previousPitfall,entry.pitfall)};
}
