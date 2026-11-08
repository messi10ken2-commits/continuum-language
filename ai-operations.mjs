import {randomUUID} from 'node:crypto';

export const utcDay=(now=new Date())=>now.toISOString().slice(0,10);
export const dailyLimit=(bucket,premium)=>premium?15:bucket==='focused'?2:1;
export const aiTier=premium=>premium?'premium':'free';

export async function migrateAIOperations(pool){
 await pool.query(`
  CREATE TABLE IF NOT EXISTS ai_operations (
   user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   bucket text NOT NULL, feature text NOT NULL, operation_key text NOT NULL,
   day date NOT NULL, tier text NOT NULL, token uuid NOT NULL,
   expires_at timestamptz NOT NULL, completed_at timestamptz,
   PRIMARY KEY(user_id,bucket,operation_key)
  );
  CREATE INDEX IF NOT EXISTS ai_operations_quota ON ai_operations(user_id,bucket,day);
  CREATE UNIQUE INDEX IF NOT EXISTS ai_operations_token ON ai_operations(token);
  CREATE INDEX IF NOT EXISTS ai_operations_reports ON ai_operations(completed_at);
  CREATE TABLE IF NOT EXISTS ai_quota_denials (
   user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   bucket text NOT NULL, tier text NOT NULL, hour timestamptz NOT NULL, attempts integer NOT NULL DEFAULT 1,
   PRIMARY KEY(user_id,bucket,hour)
  );
  CREATE INDEX IF NOT EXISTS ai_quota_denials_time ON ai_quota_denials(hour);
 `);
}
export async function dailyAIUsage(db,userId,bucket,premium,day=utcDay()){
 const {rows:[row]}=await db.query(`SELECT count(*) FILTER (WHERE completed_at IS NOT NULL)::int AS used,
  count(*) FILTER (WHERE completed_at IS NULL AND expires_at>now())::int AS reserved
  FROM ai_operations WHERE user_id=$1 AND bucket=$2 AND day=$3::date`,[userId,bucket,day]);
 const limit=dailyLimit(bucket,premium);
 const resetAt=new Date(Date.parse(day)+86400000).toISOString();
 return {used:row.used,reserved:row.reserved,limit,remaining:Math.max(0,limit-row.used-row.reserved),resetAt,premium};
}

// Call within a transaction holding the user's row lock. Reuse is reserved
// for a conversation start moving into its first provider-backed turn.
export async function reserveAI(db,{userId,bucket,feature,key,premium,day=utcDay(),reuse=false}){
 const params=[userId,bucket,key];
 const {rows:[old]}=await db.query('SELECT token,completed_at,expires_at>now() AS active FROM ai_operations WHERE user_id=$1 AND bucket=$2 AND operation_key=$3',params);
 if(old?.completed_at)return {completed:true};
 if(old?.active&&!reuse)return {pending:true};
 if(!old?.active&&bucket!=='other'&&!(await dailyAIUsage(db,userId,bucket,premium,day)).remaining)return {denied:true};
 const token=randomUUID();
 await db.query(`INSERT INTO ai_operations(user_id,bucket,operation_key,feature,day,tier,token,expires_at)
  VALUES($1,$2,$3,$4,$5::date,$6,$7,now()+interval '10 minutes')
  ON CONFLICT(user_id,bucket,operation_key) DO UPDATE SET day=EXCLUDED.day,
   tier=EXCLUDED.tier,token=EXCLUDED.token,expires_at=EXCLUDED.expires_at`,[...params,feature,day,aiTier(premium),token]);
 return {token};
}
export async function settleAI(db,token,completed){
 if(!token)return;
 const result=await db.query(completed
  ?'UPDATE ai_operations SET completed_at=now() WHERE token=$1 AND completed_at IS NULL RETURNING token'
  :'DELETE FROM ai_operations WHERE token=$1 AND completed_at IS NULL RETURNING token',[token]);
 if(completed&&!result.rows.length)throw Error('AI operation reservation expired');
}
export async function denyAI(pool,userId,bucket,premium,fail){
 try{
  await pool.query(`INSERT INTO ai_quota_denials(user_id,bucket,tier,hour)
   VALUES($1,$2,$3,date_trunc('hour',now())) ON CONFLICT(user_id,bucket,hour)
   DO UPDATE SET attempts=ai_quota_denials.attempts+1`,[userId,bucket,aiTier(premium)]);
 }catch{console.warn('Could not record AI quota denial');}
 fail(429,bucket==='focused'?'Daily Focused Practice AI limit reached.':'Daily AI conversation limit reached.');
}
