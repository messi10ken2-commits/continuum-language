import {billingTransaction} from './billing-api.mjs';
import {validZone,activityDay,splitStudyInterval} from './learning-activity.mjs';
export async function migrateActivity(c){await c.query(`CREATE TABLE IF NOT EXISTS learner_activity_days(user_id uuid NOT NULL REFERENCES users(id),day date NOT NULL,study_ms bigint NOT NULL DEFAULT 0 CHECK(study_ms>=0),PRIMARY KEY(user_id,day));CREATE TABLE IF NOT EXISTS learner_presence(user_id uuid PRIMARY KEY REFERENCES users(id),zone text NOT NULL,tab text NOT NULL,seq bigint NOT NULL DEFAULT 0,active boolean NOT NULL DEFAULT false,tick timestamptz NOT NULL DEFAULT now());`)}
export async function handleActivity({route,req,res,pool,required,json,send,fail,limited}){
 if(!['/api/activity','/api/activity/heartbeat'].includes(route))return false;const user=await required(req,'learner');
 if(route==='/api/activity/heartbeat'&&req.method==='POST'){
  limited(req,'learning-heartbeat-'+user.id,240);const d=await json(req);if(typeof d.active!=='boolean'||!validZone(d.zone)||typeof d.tab!=='string'||!/^[-a-zA-Z0-9]{12,100}$/.test(d.tab)||!Number.isSafeInteger(d.seq)||d.seq<1)fail(400,'Invalid learning activity heartbeat');
  await billingTransaction(pool,async c=>{await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);const now=Date.now(),old=(await c.query('SELECT * FROM learner_presence WHERE user_id=$1 FOR UPDATE',[user.id])).rows[0],zone=old?.zone||d.zone;
   await c.query('INSERT INTO learner_activity_days(user_id,day) VALUES($1,$2) ON CONFLICT DO NOTHING',[user.id,activityDay(now,zone)]);
   if(old&&old.tab===d.tab&&Number(old.seq)>=d.seq)return;
   if(old&&old.tab!==d.tab&&old.active&&now-Date.parse(old.tick)<25000)return;
   if(old&&old.tab===d.tab&&old.active){const start=Date.parse(old.tick),end=Math.min(now,start+20000);for(const part of splitStudyInterval(start,end,zone))await c.query('INSERT INTO learner_activity_days(user_id,day,study_ms) VALUES($1,$2,$3) ON CONFLICT(user_id,day) DO UPDATE SET study_ms=learner_activity_days.study_ms+EXCLUDED.study_ms',[user.id,part.day,part.ms]);}
   await c.query('INSERT INTO learner_presence(user_id,zone,tab,seq,active,tick) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(user_id) DO UPDATE SET tab=EXCLUDED.tab,seq=EXCLUDED.seq,active=EXCLUDED.active,tick=EXCLUDED.tick',[user.id,zone,d.tab,d.seq,d.active,new Date(now)]);
  });send(res,200,{ok:true});return true;
 }
 if(route==='/api/activity'&&req.method==='GET'){
  const zone=(await pool.query('SELECT zone FROM learner_presence WHERE user_id=$1',[user.id])).rows[0]?.zone||'UTC',today=activityDay(Date.now(),zone);
  const total=(await pool.query('SELECT min(day)::text AS "trackedSince",count(*)::int AS "loggedDays",COALESCE(sum(study_ms),0)::text AS "studyMs",count(*) FILTER(WHERE study_ms>=60000)::int AS "studyDays" FROM learner_activity_days WHERE user_id=$1',[user.id])).rows[0];
  const days=(await pool.query('SELECT day::text,study_ms::text AS "studyMs" FROM learner_activity_days WHERE user_id=$1 ORDER BY day DESC LIMIT 90',[user.id])).rows;
  send(res,200,{...total,zone,today,todayMs:days.find(d=>d.day===today)?.studyMs||'0',days});return true;
 }
 fail(405,'Method not allowed');
}
