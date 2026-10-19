import {migrateWeeklySchedule,materializeWeekly,handleWeeklySchedule} from './weekly-schedule.mjs';
import crypto from 'node:crypto';
import {availabilityDates,teachingMetrics} from './schedule-model.mjs';
import {validTimeZone} from './class-time.mjs';
export async function migrateTeacherSchedule(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS class_availability(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),teacher_id uuid NOT NULL REFERENCES users(id),starts_at timestamptz NOT NULL,ends_at timestamptz NOT NULL,timezone text NOT NULL,active boolean NOT NULL DEFAULT true,client_key text NOT NULL,request_hash text NOT NULL DEFAULT '',created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(teacher_id,client_key),CHECK(ends_at>starts_at));
 CREATE INDEX IF NOT EXISTS class_availability_time ON class_availability(teacher_id,starts_at);
 CREATE TABLE IF NOT EXISTS class_time_off(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),teacher_id uuid NOT NULL REFERENCES users(id),starts_at timestamptz NOT NULL,ends_at timestamptz NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),CHECK(ends_at>starts_at));
 ALTER TABLE class_bookings ADD COLUMN IF NOT EXISTS change_reason text NOT NULL DEFAULT '';
 ALTER TABLE class_bookings ADD COLUMN IF NOT EXISTS slot_id uuid REFERENCES class_availability(id);
 CREATE UNIQUE INDEX IF NOT EXISTS class_confirmed_slot ON class_bookings(slot_id) WHERE status='confirmed';
 `);await migrateWeeklySchedule(pool);}
export const slotPublic=s=>({id:s.id,startsAt:s.starts_at,endsAt:s.ends_at,timezone:s.timezone,active:s.active,booked:!!s.booked});
export async function handleTeacherSchedule(ctx){
 const {route,req,res,pool,user,url,json,send,fail,limited,transaction,threadAccess,lockPeople,lockLanguage,conflicts,event,updateMessage,bookingPublic,uuid,key,text,fingerprint}=ctx;
 if(await handleWeeklySchedule(ctx))return true;
 if(route==='/api/classroom/insights'&&req.method==='GET'){
  if(user.role!=='teacher')fail(403,'Not allowed for this account');const days=Number(url.searchParams.get('days')||30);if(![7,30,90].includes(days))fail(400,'Choose 7, 30 or 90 days');
  const b=await pool.query('SELECT * FROM class_bookings WHERE teacher_id=$1',[user.id]);const m=await pool.query("SELECT m.*,t.teacher_id FROM class_messages m JOIN class_threads t ON t.id=m.thread_id WHERE t.teacher_id=$1 AND m.kind='message' ORDER BY m.created_at,m.seq",[user.id]);const e=await pool.query('SELECT e.* FROM class_events e JOIN class_bookings b ON b.id=e.booking_id WHERE b.teacher_id=$1',[user.id]);
  send(res,200,{metrics:teachingMetrics(b.rows,m.rows,e.rows,{days})});return true;
 }
 if(route==='/api/classroom/availability'&&req.method==='GET'){
  const threadId=url.searchParams.get('threadId');let teacher=user.id,t;
  if(threadId){t=await threadAccess(pool,user,threadId,fail,{write:true});teacher=t.teacher_id;}else if(user.role!=='teacher')fail(403,'Choose a connected learner or teacher');
  await transaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[teacher]);await materializeWeekly(c,teacher);});
  const r=await pool.query(`SELECT s.*,EXISTS(SELECT 1 FROM class_bookings b WHERE b.teacher_id=s.teacher_id AND b.status='confirmed' AND b.starts_at<s.ends_at AND b.ends_at>s.starts_at) AS booked FROM class_availability s WHERE s.teacher_id=$1 AND s.active AND s.starts_at>now()+interval '5 minutes' AND s.starts_at<now()+interval '180 days' AND NOT EXISTS(SELECT 1 FROM class_time_off o WHERE o.teacher_id=s.teacher_id AND o.starts_at<s.ends_at AND o.ends_at>s.starts_at) ORDER BY s.starts_at LIMIT 10000`,[teacher]);
  let rows=r.rows;if(threadId){const own=(await pool.query("SELECT starts_at,ends_at FROM class_bookings WHERE learner_id=$1 AND status='confirmed'",[t.learner_id])).rows;const exclude=url.searchParams.get('replacesId');let old=null;if(exclude){if(!uuid.test(exclude))fail(400,'Invalid booking');old=(await pool.query("SELECT * FROM class_bookings WHERE id=$1 AND thread_id=$2 AND status='confirmed'",[exclude,t.id])).rows[0];if(!old)fail(409,'Only a confirmed class can be rescheduled');}
   rows=rows.filter(s=>!s.booked&&!own.some(b=>Date.parse(b.starts_at)<Date.parse(s.ends_at)&&Date.parse(b.ends_at)>Date.parse(s.starts_at)&&(!old||Date.parse(b.starts_at)!==Date.parse(old.starts_at))));
  }
  const off=user.role==='teacher'&&!threadId?(await pool.query('SELECT id,starts_at AS "startsAt",ends_at AS "endsAt" FROM class_time_off WHERE teacher_id=$1 AND ends_at>now() ORDER BY starts_at',[user.id])).rows:[];
  send(res,200,{slots:rows.map(slotPublic),timeOff:off});return true;
 }
 if(route==='/api/classroom/availability'&&req.method==='POST'){
  if(user.role!=='teacher')fail(403,'Only teachers can manage availability');limited(req,'class-availability',40);const d=await json(req);if(!key(d.clientKey))fail(400,'Invalid submission key');let dates;try{dates=availabilityDates(d)}catch(e){fail(400,e.message)}
  const requestHash=fingerprint([d.local,d.timezone,d.duration,d.weeks||1,d.startsAt]);
  const slots=await transaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);const result=[];
   for(let i=0;i<dates.length;i++){const s=dates[i],k=d.clientKey+'-'+i;const prev=(await c.query('SELECT * FROM class_availability WHERE teacher_id=$1 AND client_key=$2',[user.id,k])).rows[0];if(prev){if(prev.request_hash!==requestHash||Date.parse(prev.starts_at)!==Date.parse(s.startsAt)||Date.parse(prev.ends_at)!==Date.parse(s.endsAt)||prev.timezone!==d.timezone)fail(409,'This submission was already sent with different content');result.push(prev);continue;}
    if((await c.query(`SELECT 1 FROM class_availability WHERE teacher_id=$1 AND active AND starts_at<$3 AND ends_at>$2 UNION ALL SELECT 1 FROM class_bookings WHERE teacher_id=$1 AND status='confirmed' AND starts_at<$3 AND ends_at>$2 UNION ALL SELECT 1 FROM class_time_off WHERE teacher_id=$1 AND starts_at<$3 AND ends_at>$2 LIMIT 1`,[user.id,s.startsAt,s.endsAt])).rows.length)fail(409,'Availability overlaps another slot, class or time off');
    result.push((await c.query('INSERT INTO class_availability(teacher_id,starts_at,ends_at,timezone,client_key,request_hash) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',[user.id,s.startsAt,s.endsAt,d.timezone,k,requestHash])).rows[0]);
   }return result;});send(res,201,{slots:slots.map(slotPublic)});return true;
 }
 const slot=route.match(/^\/api\/classroom\/availability\/([a-f0-9-]{36})$/);
 if(slot&&req.method==='DELETE'){
  if(user.role!=='teacher')fail(403,'Only teachers can manage availability');if(!uuid.test(slot[1]))fail(404,'Availability not found');
  await transaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);const s=(await c.query('SELECT * FROM class_availability WHERE id=$1 AND teacher_id=$2 FOR UPDATE',[slot[1],user.id])).rows[0];if(!s)fail(404,'Availability not found');if((await c.query("SELECT 1 FROM class_bookings WHERE teacher_id=$1 AND status='confirmed' AND starts_at<$3 AND ends_at>$2",[user.id,s.starts_at,s.ends_at])).rows.length)fail(409,'This slot is booked. Open the class to cancel or reschedule');await c.query('UPDATE class_availability SET active=false WHERE id=$1',[s.id]);});send(res,200,{ok:true});return true;
 }
 if(route==='/api/classroom/time-off'&&req.method==='POST'){
  if(user.role!=='teacher')fail(403,'Only teachers can manage availability');limited(req,'class-time-off',40);const d=await json(req),start=new Date(d.startsAt),end=new Date(d.endsAt);if(!validTimeZone(d.timezone)||![d.startsAt,d.endsAt].every(s=>typeof s==='string'&&/(Z|[+-]\d\d:\d\d)$/.test(s))||!Number.isFinite(+start)||!Number.isFinite(+end)||+end<=+start||+start<Date.now()||+end>Date.now()+181*86400000)fail(400,'Choose a valid future time-off period');
  const result=await transaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);const existing=(await c.query('SELECT id FROM class_time_off WHERE teacher_id=$1 AND starts_at=$2 AND ends_at=$3',[user.id,start,end])).rows[0];if(existing)return existing;return (await c.query('INSERT INTO class_time_off(teacher_id,starts_at,ends_at) VALUES($1,$2,$3) RETURNING id',[user.id,start,end])).rows[0];});send(res,201,{id:result.id});return true;
 }
 const off=route.match(/^\/api\/classroom\/time-off\/([a-f0-9-]{36})$/);if(off&&req.method==='DELETE'){if(user.role!=='teacher')fail(403,'Only teachers can manage availability');if(!uuid.test(off[1]))fail(404,'Availability not found');await transaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);await c.query('DELETE FROM class_time_off WHERE id=$1 AND teacher_id=$2',[off[1],user.id]);});send(res,200,{ok:true});return true;}
 if(route==='/api/classroom/bookings'&&req.method==='POST'){
  limited(req,'class-booking',40);const d=await json(req),topic=text(d.topic,160);if(!uuid.test(d.threadId||'')||!uuid.test(d.slotId||'')||!key(d.clientKey)||!topic||d.priceMinor)fail(400,'Choose an available slot and enter a class topic');if(user.role!=='learner'&&!d.replacesId)fail(403,'Only learners can book a class');
  const reason=text(d.reason,500);if(user.role==='teacher'&&reason.length<3)fail(400,'Add a reason for the new time');const hash=fingerprint([d.threadId,d.slotId,topic,d.replacesId||null,reason]);const result=await transaction(pool,async c=>{
   const t=await threadAccess(c,user,d.threadId,fail,{write:true});await lockPeople(c,t);await lockLanguage(c,t,fail);
   const prev=(await c.query('SELECT * FROM class_bookings WHERE proposed_by=$1 AND client_key=$2',[user.id,d.clientKey])).rows[0];if(prev){if(prev.input_hash!==hash)fail(409,'This submission was already sent with different content');return prev;}
   await materializeWeekly(c,t.teacher_id);
   let old=null;if(d.replacesId){if(!uuid.test(d.replacesId))fail(400,'Invalid booking');old=(await c.query('SELECT * FROM class_bookings WHERE id=$1 AND thread_id=$2 FOR UPDATE',[d.replacesId,t.id])).rows[0];if(old?.status!=='confirmed'||Date.parse(old.starts_at)<=Date.now())fail(409,'Only a future confirmed class can be rescheduled');}
   const s=(await c.query('SELECT * FROM class_availability WHERE id=$1 AND teacher_id=$2 AND active FOR UPDATE',[d.slotId,t.teacher_id])).rows[0];if(!s||Date.parse(s.starts_at)<Date.now()+300000||Date.parse(s.starts_at)>Date.now()+180*86400000||(await c.query('SELECT 1 FROM class_time_off WHERE teacher_id=$1 AND starts_at<$3 AND ends_at>$2',[t.teacher_id,s.starts_at,s.ends_at])).rows.length)fail(409,'This slot is no longer available. Choose another time');
   if(old&&old.slot_id===s.id)fail(400,'Choose a different slot to reschedule');if(await conflicts(c,t,s.starts_at,s.ends_at,old?.id||null))fail(409,'This time overlaps a confirmed class. Choose another time');
   const instant=user.role==='learner',status=instant?'confirmed':'requested';
   if(instant&&old){await c.query("UPDATE class_bookings SET status='cancelled',revision=revision+1,updated_at=now() WHERE id=$1",[old.id]);await event(c,user.id,t.id,'rescheduled',{booking:old.id,detail:{fromStatus:'confirmed'}});}
   const b=(await c.query('INSERT INTO class_bookings(thread_id,teacher_id,learner_id,language,starts_at,ends_at,proposed_timezone,proposed_by,topic,client_key,input_hash,replaces_id,slot_id,status,meeting_url,change_reason,rules_version) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *',[t.id,t.teacher_id,t.learner_id,t.language,s.starts_at,s.ends_at,s.timezone,user.id,topic,d.clientKey,hash,old?.id||null,s.id,status,instant?'https://meet.jit.si/Continuum-'+crypto.randomUUID():'',reason,'pilot-slots-v2'])).rows[0];await event(c,user.id,t.id,instant?'booked':'proposed',{booking:b.id});await updateMessage(c,user.id,t.id,instant?'A class has been booked from an available slot.':'Your teacher proposed a new class time. The original class stays confirmed until you accept.');return b;
  });send(res,201,{booking:bookingPublic(result)});return true;
 }
 return false;
}
