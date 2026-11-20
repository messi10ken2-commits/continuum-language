export const dateInZone=(at,zone)=>new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(at));
export function shiftDate(day,offset){const d=new Date(day+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+offset);return d.toISOString().slice(0,10)}
export function monthDates(month){const first=new Date(month+'-01T12:00:00Z'),monday=(first.getUTCDay()+6)%7;return Array.from({length:42},(_,i)=>shiftDate(month+'-01',i-monday));}
export function shiftMonth(month,offset){const d=new Date(month+'-01T12:00:00Z');d.setUTCMonth(d.getUTCMonth()+offset);return d.toISOString().slice(0,7)}
export const timePeriods=[{id:0,label:'Night',start:0,end:6},{id:1,label:'Morning',start:6,end:12},{id:2,label:'Afternoon',start:12,end:18},{id:3,label:'Evening',start:18,end:24}];
export function timeButtons(period,step){const p=timePeriods.find(p=>p.id===period);if(!p||![5,15,30,60].includes(step))return [];return Array.from({length:(p.end-p.start)*60/step},(_,i)=>{const n=p.start*60+i*step;return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')});}
