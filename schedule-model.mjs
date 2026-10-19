import {classTimeChoices,validTimeZone} from './class-time.mjs';
export function availabilityDates({local,timezone,duration,weeks=1,startsAt},now=Date.now()){
 if(!validTimeZone(timezone)||!Number.isInteger(duration)||duration<15||duration>120||duration%5||!Number.isInteger(weeks)||weeks<1||weeks>12)throw Error('Choose a valid availability time, duration and repeat count');
 const first=classTimeChoices(local,timezone);if(!first.includes(startsAt))throw Error('Choose a valid local time and UTC offset');
 const result=[];
 for(let i=0;i<weeks;i++){
  const day=new Date(local.slice(0,10)+'T12:00:00Z');day.setUTCDate(day.getUTCDate()+i*7);const wall=day.toISOString().slice(0,10)+local.slice(10),choices=classTimeChoices(wall,timezone);
  if(choices.length!==1&&i)throw Error('A repeated time crosses an ambiguous or missing clock hour. Publish these dates separately');
  const at=i?choices[0]:startsAt,start=Date.parse(at);if(start<now+300000||start>now+180*86400000)throw Error('Choose a time at least five minutes ahead and within six months');
  result.push({startsAt:at,endsAt:new Date(start+duration*60000).toISOString()});
 }
 return result;
}
export function teachingMetrics(bookings,messages,events,{days=30,now=Date.now()}={}){
 const cutoff=now-days*86400000,byId=new Map(bookings.map(b=>[b.id,b]));const at=x=>Date.parse(x),inPeriod=b=>at(b.starts_at)>=cutoff&&at(b.starts_at)<=now;
 const confirmed=new Set(bookings.filter(b=>['confirmed','completed'].includes(b.status)).map(b=>b.id));
 for(const e of events)if(['confirmed','booked','rescheduled'].includes(e.kind)||e.detail?.fromStatus==='confirmed')confirmed.add(e.booking_id);
 const activity=new Set(events.filter(e=>at(e.created_at)>=cutoff&&at(e.created_at)<=now&&['confirmed','booked','cancelled','rescheduled'].includes(e.kind)).map(e=>e.booking_id));
 const performancePeriod=b=>!!b&&(activity.has(b.id)||(at(b.created_at)>=cutoff&&at(b.created_at)<=now));
 const eligible=bookings.filter(b=>confirmed.has(b.id)&&performancePeriod(b));
 const cancellations=new Set(events.filter(e=>e.kind==='cancelled'&&e.actor_id===byId.get(e.booking_id)?.teacher_id&&confirmed.has(e.booking_id)&&at(e.created_at)>=cutoff&&at(e.created_at)<=now).map(e=>e.booking_id));
 const changed=new Set(events.filter(e=>e.kind==='rescheduled'&&e.actor_id===byId.get(e.booking_id)?.teacher_id&&at(e.created_at)>=cutoff&&at(e.created_at)<=now).map(e=>e.booking_id));
 const completed=bookings.filter(b=>b.status==='completed'&&inPeriod(b)),allCompleted=bookings.filter(b=>b.status==='completed');
 // A learner burst before the teacher's next reply is one response opportunity.
 // System updates are never replies. A pending burst enters the denominator only after 24h.
 const pending=new Map();let opportunities=0,timely=0;
 for(const m of [...messages].filter(m=>m.kind==='message').sort((a,b)=>at(a.created_at)-at(b.created_at)||Number(a.seq)-Number(b.seq))){
  const time=at(m.created_at);if(time>now)continue;
  if(m.author_id===m.teacher_id){const start=pending.get(m.thread_id);if(start!==undefined){if(start>=cutoff){opportunities++;if(time-start<=86400000)timely++;}pending.delete(m.thread_id);}}
  else if(!pending.has(m.thread_id))pending.set(m.thread_id,time);
 }
 for(const time of pending.values())if(time>=cutoff&&time<=now-86400000)opportunities++;
 const minutes=items=>items.reduce((n,b)=>n+(at(b.ends_at)-at(b.starts_at))/60000,0),pct=(n,d)=>d?Math.round(n/d*100):null;
 return {days,from:new Date(cutoff).toISOString(),to:new Date(now).toISOString(),completed:completed.length,teachingMinutes:minutes(completed),totalCompleted:allCompleted.length,totalTeachingMinutes:minutes(allCompleted),activeLearners:new Set(completed.map(b=>b.learner_id)).size,weeklyLessons:bookings.filter(b=>b.status==='completed'&&at(b.starts_at)>=now-7*86400000&&at(b.starts_at)<=now).length,upcoming:bookings.filter(b=>b.status==='confirmed'&&at(b.starts_at)>now).length,eligible:eligible.length,teacherCancelled:cancellations.size,teacherRescheduled:changed.size,cancellationRate:pct(cancellations.size,eligible.length),rescheduleRate:pct(changed.size,eligible.length),reliability:pct(eligible.length-cancellations.size,eligible.length),responseRate:pct(timely,opportunities),responseOpportunities:opportunities,timelyReplies:timely,earnings:{enabled:false,collectedMinor:0,paidOutMinor:0,pendingMinor:0,currency:null}};
}
