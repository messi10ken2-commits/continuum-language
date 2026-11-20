// F identifies a genuinely different held-out form. All answer alternatives
// are explicit native text; the first is the key before seeded rotation.
export function placementText(text){const result={};for(const line of text.trim().split('\n')){const [key,passage,audio,...use]=line.split('|');if(!key||!passage||!audio||use.length!==3)throw Error('Incomplete placement text '+key);result[key]={passage,audio,use:use.map(q=>q.split('~'))};}if(Object.keys(result).length!==20)throw Error('Each language needs twenty held-out passage/audio packs');return result;}
