import {classTimeChoices,validTimeZone} from './class-time.mjs';
import {dateInZone,shiftDate} from './calendar-picker.mjs';
const minutes=s=>typeof s==='string'&&/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(s)?Number(s.slice(0,2))*60+Number(s.slice(3)):s==='24:00'?1440:NaN;
const clock=n=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
export function normalizeWeeklySchedule(d){
 if(!d||!validTimeZone(d.timezone)||![25,50].includes(d.duration)||!Number.isInteger(d.gap)||d.gap<0||d.gap>60||d.gap%5||!Array.isArray(d.days)||d.days.length!==7)throw Error('Choose valid weekly hours, lesson duration and break time');
 const days=d.days.map((day,i)=>{if(day.day!==i+1||typeof day.enabled!=='boolean'||!Array.isArray(day.ranges)||day.ranges.length>4)throw Error('Choose valid weekly hours, lesson duration and break time');const ranges=day.enabled?day.ranges.map(r=>{const start=minutes(r.start),end=minutes(r.end);if(!Number.isFinite(start)||!Number.isFinite(end)||start>=end||end-start<d.duration||start%5||end%5)throw Error('Each time range needs a later end and enough room for a lesson');return {start:r.start,end:r.end}}).sort((a,b)=>minutes(a.start)-minutes(b.start)):[];if(day.enabled&&!ranges.length)throw Error('Add a time range or turn this weekday off');for(let i=1;i<ranges.length;i++)if(minutes(ranges[i].start)<minutes(ranges[i-1].end))throw Error('Time ranges on the same weekday cannot overlap');return {day:i+1,enabled:day.enabled,ranges};});
 return {timezone:d.timezone,duration:d.duration,gap:d.gap,days};
}
export function weeklyOccurrences(schedule,now=Date.now(),horizon=60){
 const config=normalizeWeeklySchedule(schedule),today=dateInZone(now,config.timezone),result=[];let skipped=0;
 for(let i=0;i<=horizon;i++){const date=shiftDate(today,i),weekday=(new Date(date+'T12:00:00Z').getUTCDay()+6)%7,day=config.days[weekday];if(!day.enabled)continue;
  for(const range of day.ranges)for(let n=minutes(range.start);n+config.duration<=minutes(range.end);n+=config.duration+config.gap){
   const end=n+config.duration,local=date+'T'+clock(n),endLocal=end===1440?shiftDate(date,1)+'T00:00':date+'T'+clock(end),starts=classTimeChoices(local,config.timezone),ends=classTimeChoices(endLocal,config.timezone);
   if(starts.length!==1||ends.length!==1||Date.parse(ends[0])-Date.parse(starts[0])!==config.duration*60000){skipped++;continue;}
   if(Date.parse(starts[0])>=now+300000)result.push({startsAt:starts[0],endsAt:ends[0]});
  }
 }
 return {slots:result,skipped};
}
export async function migrateWeeklySchedule(pool){await pool.query(`CREATE TABLE IF NOT EXISTS class_weekly_schedule(teacher_id uuid PRIMARY KEY REFERENCES users(id),data jsonb NOT NULL,revision integer NOT NULL DEFAULT 1,generated_day text,updated_at timestamptz NOT NULL DEFAULT now());ALTER TABLE class_availability ADD COLUMN IF NOT EXISTS template_revision integer;`);}
export async function materializeWeekly(c,teacherId,now=Date.now(),force=false){
 const row=(await c.query('SELECT * FROM class_weekly_schedule WHERE teacher_id=$1 FOR UPDATE',[teacherId])).rows[0];if(!row)return null;if(![25,50].includes(row.data.duration))row.data={...row.data,duration:row.data.duration<50?25:50};
 const today=dateInZone(now,row.data.timezone);if(!force&&row.generated_day===today)return row;
 const {slots,skipped}=weeklyOccurrences(row.data,now);if(slots.length){
  const starts=slots.map(s=>s.startsAt),ends=slots.map(s=>s.endsAt),keys=starts.map(start=>'weekly-'+row.revision+'-'+start);
  await c.query(`INSERT INTO class_availability(teacher_id,starts_at,ends_at,timezone,client_key,request_hash,template_revision)
   SELECT $1,x.start_at,x.end_at,$5,x.submission_key,'weekly',$6 FROM unnest($2::timestamptz[],$3::timestamptz[],$4::text[]) AS x(start_at,end_at,submission_key)
   WHERE NOT EXISTS(SELECT 1 FROM class_availability s WHERE s.teacher_id=$1 AND s.active AND s.starts_at<x.end_at AND s.ends_at>x.start_at)
   AND NOT EXISTS(SELECT 1 FROM class_bookings b WHERE b.teacher_id=$1 AND b.status='confirmed' AND b.starts_at<x.end_at AND b.ends_at>x.start_at)
   ON CONFLICT(teacher_id,client_key) DO NOTHING`,[teacherId,starts,ends,keys,row.data.timezone,row.revision]);
 }
 await c.query('UPDATE class_weekly_schedule SET generated_day=$2 WHERE teacher_id=$1',[teacherId,today]);return {...row,generated_day:today,skipped};
}
export async function handleWeeklySchedule(ctx){
 const {route,req,res,pool,user,url,json,send,fail,transaction,limited,uuid}=ctx;
 if(!['/api/classroom/weekly-schedule','/api/classroom/schedule'].includes(route))return false;
 if(user.role!=='teacher')fail(403,'Only teachers can manage availability');
 if(route==='/api/classroom/weekly-schedule'&&req.method==='PUT'){
  limited(req,'weekly-hours',30);const d=await json(req);if(!Number.isInteger(d.revision)||d.revision<0)fail(400,'Reload before saving');let config;try{config=normalizeWeeklySchedule(d)}catch(e){fail(400,e.message)}
  const saved=await transaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);const old=(await c.query('SELECT * FROM class_weekly_schedule WHERE teacher_id=$1 FOR UPDATE',[user.id])).rows[0];
   if((old?.revision||0)!==d.revision){if(old&&old.revision===d.revision+1&&JSON.stringify(normalizeWeeklySchedule(old.data))===JSON.stringify(config))return old;fail(409,'Weekly hours changed. Reload before saving');}
   await c.query(`UPDATE class_availability s SET active=false WHERE teacher_id=$1 AND template_revision IS NOT NULL AND starts_at>now()`,[user.id]);
   await c.query('INSERT INTO class_weekly_schedule(teacher_id,data,revision) VALUES($1,$2::jsonb,1) ON CONFLICT(teacher_id) DO UPDATE SET data=EXCLUDED.data,revision=class_weekly_schedule.revision+1,generated_day=NULL,updated_at=now()',[user.id,JSON.stringify(config)]);
   return await materializeWeekly(c,user.id,Date.now(),true);
  });send(res,200,{weekly:{...saved.data,revision:saved.revision},skipped:saved.skipped||0});return true;
 }
 if(req.method==='GET'){
  const zone=url.searchParams.get('timezone')||'UTC';if(!validTimeZone(zone))fail(400,'Choose a valid calendar week');const from=url.searchParams.get('from')||dateInZone(Date.now(),zone);if(!/^\d{4}-\d{2}-\d{2}$/.test(from)||!classTimeChoices(from+'T12:00',zone).length)fail(400,'Choose a valid calendar week');
  const startChoices=classTimeChoices(from+'T00:00',zone),endChoices=classTimeChoices(shiftDate(from,7)+'T00:00',zone);const start=startChoices[0]||classTimeChoices(from+'T01:00',zone)[0],end=endChoices.at(-1)||classTimeChoices(shiftDate(from,7)+'T01:00',zone).at(-1);if(!start||!end)fail(400,'Choose a valid calendar week');
  const data=await transaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);const weekly=await materializeWeekly(c,user.id);if(route.endsWith('/weekly-schedule'))return {weekly:weekly?{...weekly.data,revision:weekly.revision}:null};
   const slots=(await c.query(`SELECT s.id,s.starts_at AS "startsAt",s.ends_at AS "endsAt",s.template_revision AS "templateRevision",EXISTS(SELECT 1 FROM class_bookings b WHERE b.teacher_id=$1 AND b.status IN ('confirmed','completed') AND b.starts_at<s.ends_at AND b.ends_at>s.starts_at) AS booked FROM class_availability s WHERE s.teacher_id=$1 AND s.active AND s.starts_at<$3 AND s.ends_at>$2 AND NOT EXISTS(SELECT 1 FROM class_time_off o WHERE o.teacher_id=$1 AND o.starts_at<s.ends_at AND o.ends_at>s.starts_at) ORDER BY s.starts_at`,[user.id,start,end])).rows;
   const bookings=(await c.query(`SELECT b.id,b.starts_at AS "startsAt",b.ends_at AS "endsAt",b.status,b.topic,b.language,l.name AS learner FROM class_bookings b JOIN users l ON l.id=b.learner_id WHERE b.teacher_id=$1 AND b.status IN ('confirmed','completed','requested') AND b.starts_at<$3 AND b.ends_at>$2 AND EXISTS(SELECT 1 FROM teacher_links x WHERE x.teacher_id=$1 AND x.learner_id=b.learner_id AND b.language=ANY(x.languages)) ORDER BY b.starts_at`,[user.id,start,end])).rows;
   const timeOff=(await c.query('SELECT id,starts_at AS "startsAt",ends_at AS "endsAt" FROM class_time_off WHERE teacher_id=$1 AND starts_at<$3 AND ends_at>$2 ORDER BY starts_at',[user.id,start,end])).rows;
   return {weekly:weekly?{...weekly.data,revision:weekly.revision}:null,slots,bookings,timeOff,from,timezone:zone};
  });send(res,200,data);return true;
 }
 return false;
}
