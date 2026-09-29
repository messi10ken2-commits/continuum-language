import {isDeepStrictEqual} from 'node:util';
import {getSkillTask,rubricFor} from './skills-content.mjs';
export async function migrateSkills(pool){await pool.query(`CREATE TABLE IF NOT EXISTS skill_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 task_id text NOT NULL, assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE,
 response jsonb NOT NULL, result jsonb NOT NULL, submission_key text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id,submission_key));
 CREATE INDEX IF NOT EXISTS skills_user_time ON skill_submissions(user_id,created_at DESC);`);}
const fields='id,task_id AS task,assessment_id AS assessment,result,created_at AS at';
export async function skillAccess(pool,user,row,fail){if(user.id===row.user_id)return; if(user.role!=='teacher')fail(403,'Not allowed');const access=await pool.query('SELECT 1 FROM teacher_links l JOIN users u ON u.id=l.learner_id WHERE l.teacher_id=$1 AND l.learner_id=$2 AND u.share_self_learning=true',[user.id,row.user_id]);if(!access.rowCount)fail(403,'This learner has not shared this evidence');}
export async function handleSkills({route,req,res,pool,required,json,send,fail,limited,assessSkill}){
 if(!route.startsWith('/api/skills'))return false;
 const user=await required(req);
 if(route==='/api/skills'&&req.method==='GET'){if(user.role!=='learner')fail(403,'Learner account required');const r=await pool.query(`SELECT ${fields} FROM skill_submissions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`,[user.id]);send(res,200,{submissions:r.rows});return true;}
 const list=route.match(/^\/api\/skills\/learner\/([a-f0-9-]{36})$/);
 if(list&&req.method==='GET'){if(user.role!=='teacher')fail(403,'Teacher account required');await skillAccess(pool,user,{user_id:list[1]},fail);const r=await pool.query(`SELECT ${fields} FROM skill_submissions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 100`,[list[1]]);send(res,200,{submissions:r.rows});return true;}
 if(route==='/api/skills'&&req.method==='POST'){
  if(user.role!=='learner')fail(403,'Learner account required');limited(req,'skill-submission',60);
  const data=await json(req),task=getSkillTask(data.task);if(!task||typeof data.submissionKey!=='string'||!/^[-a-zA-Z0-9]{10,100}$/.test(data.submissionKey))fail(400,'Invalid task');
  const old=await pool.query(`SELECT ${fields},response FROM skill_submissions WHERE user_id=$1 AND submission_key=$2`,[user.id,data.submissionKey]);
  if(old.rows.length){const previous=old.rows[0];if(previous.task!==task.id||previous.assessment!==(data.assessment||null)||!isDeepStrictEqual(previous.response,data.response))fail(409,'Submission key already used');delete previous.response;send(res,200,{submission:previous});return true;}
  let taskPrompt=task.prompt;
  if(data.assessment&&!/^[a-f0-9-]{36}$/.test(data.assessment))fail(400,'Invalid assessment');
  if(data.assessment){const r=await pool.query('SELECT * FROM assessments WHERE id=$1 AND user_id=$2',[data.assessment,user.id]);const a=r.rows[0];if(!a||a.completed_at||a.version!=='es-diagnostic-2')fail(400,'Active test not found');const {publicAssessment}=await import('./assessment-bank.mjs');const current=publicAssessment(a).question;taskPrompt=current?.task?.prompt; if(current?.task?.id!==task.id)fail(409,'This task is not the current assessment section');}
  const response=data.response;let result;
  if(task.skill==='Listening'){if(data.assessment)fail(400,'Use the test answer endpoint');if(!Array.isArray(response)||response.length!==task.questions.length||response.some((a,i)=>!Number.isInteger(a)||a<0||a>=task.questions[i].options.length))fail(400,'Answer every listening question');const correct=response.filter((a,i)=>a===task.questions[i].answer).length;result={status:'scored',score:Math.round(correct/response.length*100),correct,total:response.length,method:'listening-answer-key'};}
  else if(task.skill==='Writing'){if(typeof response!=='string'||response.trim().length<10||response.length>6000)fail(400,'Write between 10 and 6000 characters');result=await assessSkill(task,response);result.wordCount=response.trim().split(/\s+/).length;}
  else {if(!response||typeof response.audio!=='string'||response.audio.length>1400000||!/^data:audio\/(webm|mp4|ogg|wav)(;codecs=[a-zA-Z0-9.,-]+)?;base64,[A-Za-z0-9+/]+=*$/.test(response.audio)||!Number.isFinite(response.seconds)||response.seconds<1||response.seconds>95)fail(400,'Record a valid audio clip (up to 90 seconds / 1 MB)');const encoded=response.audio.split(',')[1];if(Buffer.from(encoded,'base64').length<100)fail(400,'Recording is empty');result=await assessSkill(task,response);result.duration=response.seconds;}
  result={...result,taskPrompt};
  const r=await pool.query(`INSERT INTO skill_submissions(user_id,task_id,assessment_id,response,result,submission_key) VALUES($1,$2,$3,$4::jsonb,$5::jsonb,$6) ON CONFLICT(user_id,submission_key) DO NOTHING RETURNING ${fields}`,[user.id,task.id,data.assessment||null,JSON.stringify(response),JSON.stringify(result),data.submissionKey]);
  if(!r.rows.length)fail(409,'A submission with this key is already saved. Reload your record.');send(res,201,{submission:r.rows[0]});return true;
 }
 const match=route.match(/^\/api\/skills\/([a-f0-9-]{36})(?:\/(review))?$/);
 if(match){const r=await pool.query('SELECT * FROM skill_submissions WHERE id=$1',[match[1]]);const row=r.rows[0];if(!row)fail(404,'Submission not found');await skillAccess(pool,user,row,fail);const task=getSkillTask(row.task_id);
  if(!match[2]&&req.method==='GET'){send(res,200,{submission:{id:row.id,task:row.task_id,assessment:row.assessment_id,response:row.response,result:row.result,at:row.created_at}});return true;}
  if(match[2]&&req.method==='PUT'){if(user.role!=='teacher'||task.skill==='Listening')fail(403,'Teacher review required');const data=await json(req),criteria=rubricFor(task.skill);if(!Array.isArray(data.ratings)||data.ratings.length!==criteria.length||data.ratings.some(n=>!Number.isInteger(n)||n<0||n>4)||typeof data.feedback!=='string'||data.feedback.trim().length<10||data.feedback.length>3000)fail(400,'Rate all four criteria and add specific feedback');const result={...row.result,status:'reviewed',score:Math.round(data.ratings.reduce((a,b)=>a+b,0)/16*100),criteria,ratings:data.ratings,feedback:data.feedback,reviewer:user.name,reviewedAt:new Date().toISOString()};await pool.query('UPDATE skill_submissions SET result=$2::jsonb WHERE id=$1',[row.id,JSON.stringify(result)]);send(res,200,{result});return true;}
 }
 fail(404,'Skills endpoint not found');
}
