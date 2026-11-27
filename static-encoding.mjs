// Select a prebuilt representation without doing compression on request threads.
export function staticEncodings(header='') {
  const weights=new Map(String(header).toLowerCase().split(',').map(value=>{
    const [name,...params]=value.trim().split(';');
    const q=params.find(p=>p.trim().startsWith('q='));
    const weight=q?Number(q.trim().slice(2)):1;
    return [name,Number.isFinite(weight)&&weight>=0&&weight<=1?weight:0];
  }));
  return ['br','gzip'].map(name=>({name,q:weights.get(name)??weights.get('*')??0})).filter(e=>e.q>0).sort((a,b)=>b.q-a.q).map(e=>e.name);
}
