import {languages} from './languages.mjs';
import {assessmentVersion,assessmentFormCount,assessmentItems,publicAssessment,gradeAssessment} from './assessment-bank.mjs';

export async function migrateAssessments(pool){
 await pool.query(`CREATE TABLE IF NOT EXISTS assessments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK(kind IN ('placement','reassessment')), version text NOT NULL, form integer NOT NULL CHECK(form IN (0,1,2,3)),
 answers jsonb NOT NULL DEFAULT '[]', result jsonb, started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz);
 ALTER TABLE assessments DROP CONSTRAINT IF EXISTS assessments_form_check;
 ALTER TABLE assessments ADD CONSTRAINT assessments_form_check CHECK(form IN (0,1,2,3));
 ALTER TABLE assessments ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'es';
 DROP INDEX IF EXISTS assessment_active_user;
 CREATE UNIQUE INDEX IF NOT EXISTS assessment_active_language ON assessments(user_id,language) WHERE completed_at IS NULL;
 CREATE INDEX IF NOT EXISTS assessment_user_history ON assessments(user_id,completed_at DESC);`);
}
export async function assessmentHistory(pool,userId,language='es'){
 const r=await pool.query('SELECT id,kind,version,form,result,completed_at AS at FROM assessments WHERE user_id=$1 AND language=$2 AND completed_at IS NOT NULL ORDER BY completed_at DESC,id DESC LIMIT 20',[userId,language]);
 for(const h of r.rows){if(/-diagnostic-[23]$/.test(h.version)){const samples=await pool.query('SELECT task_id AS task,result FROM skill_submissions WHERE assessment_id=$1 AND user_id=$2 ORDER BY created_at DESC',[h.id,userId]);h.result={...h.result,productions:samples.rows};}}
 return r.rows;
}
export async function handleAssessment({route,req,res,pool,required,json,send,fail}){
 if(!route.startsWith('/api/assessments'))return false;
 const user=await required(req,'learner');
 const language=new URL(req.url,'http://localhost').searchParams.get('language')||'es';if(!languages.some(l=>l.id===language))fail(400,'Unknown language');
 const version=language==='es'?assessmentVersion:language+'-diagnostic-3';
 if(route==='/api/assessments'&&req.method==='GET'){
  const history=await assessmentHistory(pool,user.id,language),active=await pool.query('SELECT * FROM assessments WHERE user_id=$1 AND language=$2 AND completed_at IS NULL',[user.id,language]);
  send(res,200,{history,active:active.rows[0]?publicAssessment(active.rows[0]):null});return true;
 }
 if(route==='/api/assessments'&&req.method==='POST'){
  const c=await pool.connect();try{
   await c.query('BEGIN');await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);
   const active=await c.query('SELECT * FROM assessments WHERE user_id=$1 AND language=$2 AND completed_at IS NULL',[user.id,language]);
   let row=active.rows[0];
   if(!row){const count=await c.query('SELECT COUNT(*)::int AS count FROM assessments WHERE user_id=$1 AND language=$2 AND completed_at IS NOT NULL',[user.id,language]);const n=count.rows[0].count;const previous=await c.query('SELECT form,version FROM assessments WHERE user_id=$1 AND language=$2 AND completed_at IS NOT NULL ORDER BY completed_at DESC,id DESC LIMIT 1',[user.id,language]);const nextForm=previous.rows.length&&previous.rows[0].version===version?(previous.rows[0].form+1)%assessmentFormCount:0;const r=await c.query('INSERT INTO assessments(user_id,kind,version,form,language) VALUES($1,$2,$3,$4,$5) RETURNING *',[user.id,n?'reassessment':'placement',version,nextForm,language]);row=r.rows[0];}
   await c.query('COMMIT');send(res,200,{session:publicAssessment(row)});
  }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
  return true;
 }
 const match=route.match(/^\/api\/assessments\/([a-f0-9-]{36})$/);
 if(match&&req.method==='PUT'){
  const data=await json(req);
  if(!Number.isInteger(data.index)||data.index<0)fail(400,'Invalid question index');
  const c=await pool.connect();try{
   await c.query('BEGIN');const r=await c.query('SELECT * FROM assessments WHERE id=$1 AND user_id=$2 FOR UPDATE',[match[1],user.id]);
   if(!r.rows.length||r.rows[0].language!==language)fail(404,'Test not found');
   let row=r.rows[0];
   if(!(/^(es-diagnostic-1|(es|ja|pt|en)-diagnostic-[23])$/.test(row.version)))fail(409,'This test version is no longer supported');
   const items=assessmentItems(row.form,row.version),productive=/-diagnostic-[23]$/.test(row.version)&&data.index>=items.length;
   if(productive){if(data.index>=items.length+2)fail(400,'Invalid task index');if(data.answer!==null){if(!data.answer||typeof data.answer.sampleId!=='string'||!/^[a-f0-9-]{36}$/.test(data.answer.sampleId))fail(400,'Submit your response or skip');const sample=await c.query('SELECT task_id,result FROM skill_submissions WHERE id=$1 AND user_id=$2 AND assessment_id=$3',[data.answer.sampleId,user.id,row.id]);const expected=data.index===items.length?'writing':'speaking';if(!sample.rows[0]?.task_id.endsWith('-'+expected))fail(400,'Response does not belong to this test section');}}
   else if(!(data.answer===null||Number.isInteger(data.answer)&&data.answer>=0&&data.answer<(items[data.index]?.options.length||0)))fail(400,'Choose an answer or skip');
   // An identical retried request is safe, including a retried final submission.
   if(data.index<row.answers.length){if(JSON.stringify(row.answers[data.index])!==JSON.stringify(data.answer))fail(409,'This answer was already saved. Reload your test.');}
   else {
    if(row.completed_at||data.index!==row.answers.length)fail(409,'Your test changed in another tab. Reload to continue.');
    const answers=[...row.answers,data.answer],done=answers.length===items.length+(/-diagnostic-[23]$/.test(row.version)?2:0);
    const result=done?{...gradeAssessment(row.form,answers.slice(0,items.length),row.version),...(/-diagnostic-[23]$/.test(row.version)?{productiveStatus:{Writing:answers[items.length]?'pending':'skipped',Speaking:answers[items.length+1]?'pending':'skipped'}}:{})}:null;
    const updated=await c.query('UPDATE assessments SET answers=$2::jsonb,result=$3::jsonb,completed_at=CASE WHEN $4 THEN now() ELSE NULL END WHERE id=$1 RETURNING *',[row.id,JSON.stringify(answers),JSON.stringify(result),done]);row=updated.rows[0];
   }
   await c.query('COMMIT');send(res,200,{session:publicAssessment(row)});
  }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
  return true;
 }
 fail(404,'Test endpoint not found');
}
