import {assessmentVersion,assessmentItems,publicAssessment,gradeAssessment} from './assessment-bank.mjs';

export async function migrateAssessments(pool){
 await pool.query(`CREATE TABLE IF NOT EXISTS assessments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK(kind IN ('placement','reassessment')), version text NOT NULL, form integer NOT NULL CHECK(form IN (0,1)),
 answers jsonb NOT NULL DEFAULT '[]', result jsonb, started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz);
 CREATE UNIQUE INDEX IF NOT EXISTS assessment_active_user ON assessments(user_id) WHERE completed_at IS NULL;
 CREATE INDEX IF NOT EXISTS assessment_user_history ON assessments(user_id,completed_at DESC);`);
}
export async function assessmentHistory(pool,userId){
 const r=await pool.query('SELECT id,kind,version,form,result,completed_at AS at FROM assessments WHERE user_id=$1 AND completed_at IS NOT NULL ORDER BY completed_at DESC,id DESC LIMIT 20',[userId]);return r.rows;
}
export async function handleAssessment({route,req,res,pool,required,json,send,fail}){
 if(!route.startsWith('/api/assessments'))return false;
 const user=await required(req,'learner');
 if(route==='/api/assessments'&&req.method==='GET'){
  const history=await assessmentHistory(pool,user.id),active=await pool.query('SELECT * FROM assessments WHERE user_id=$1 AND completed_at IS NULL',[user.id]);
  send(res,200,{history,active:active.rows[0]?publicAssessment(active.rows[0]):null});return true;
 }
 if(route==='/api/assessments'&&req.method==='POST'){
  const c=await pool.connect();try{
   await c.query('BEGIN');await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);
   const active=await c.query('SELECT * FROM assessments WHERE user_id=$1 AND completed_at IS NULL',[user.id]);
   let row=active.rows[0];
   if(!row){const count=await c.query('SELECT COUNT(*)::int AS count FROM assessments WHERE user_id=$1 AND completed_at IS NOT NULL',[user.id]);const n=count.rows[0].count;const r=await c.query('INSERT INTO assessments(user_id,kind,version,form) VALUES($1,$2,$3,$4) RETURNING *',[user.id,n?'reassessment':'placement',assessmentVersion,n%2]);row=r.rows[0];}
   await c.query('COMMIT');send(res,200,{session:publicAssessment(row)});
  }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
  return true;
 }
 const match=route.match(/^\/api\/assessments\/([a-f0-9-]{36})$/);
 if(match&&req.method==='PUT'){
  const data=await json(req);
  if(!Number.isInteger(data.index)||data.index<0||!(data.answer===null||Number.isInteger(data.answer)&&data.answer>=0&&data.answer<=3))fail(400,'Choose an answer or I don’t know');
  const c=await pool.connect();try{
   await c.query('BEGIN');const r=await c.query('SELECT * FROM assessments WHERE id=$1 AND user_id=$2 FOR UPDATE',[match[1],user.id]);
   if(!r.rows.length)fail(404,'Test not found');
   let row=r.rows[0];
   if(row.version!==assessmentVersion)fail(409,'This test version is no longer supported');
   // An identical retried request is safe, including a retried final submission.
   if(data.index<row.answers.length){if(row.answers[data.index]!==data.answer)fail(409,'This answer was already saved. Reload your test.');}
   else {
    if(row.completed_at||data.index!==row.answers.length)fail(409,'Your test changed in another tab. Reload to continue.');
    const answers=[...row.answers,data.answer],done=answers.length===assessmentItems(row.form).length;
    const result=done?gradeAssessment(row.form,answers):null;
    const updated=await c.query('UPDATE assessments SET answers=$2::jsonb,result=$3::jsonb,completed_at=CASE WHEN $4 THEN now() ELSE NULL END WHERE id=$1 RETURNING *',[row.id,JSON.stringify(answers),JSON.stringify(result),done]);row=updated.rows[0];
   }
   await c.query('COMMIT');send(res,200,{session:publicAssessment(row)});
  }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
  return true;
 }
 fail(404,'Test endpoint not found');
}
