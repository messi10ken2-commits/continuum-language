import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import pg from 'pg';
import {getLesson,gradeLesson,validAnswer} from './course.mjs';
import {migrateAssessments,handleAssessment,assessmentHistory} from './assessment-api.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,'dist');
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:6,connectionTimeoutMillis:8000});
const sessionDays=30;

const attempts=new Map();
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2'};
const hash=text=>crypto.createHash('sha256').update(text).digest('hex');
const random=()=>crypto.randomBytes(32).toString('base64url');
const cookieName='continuum_session';
const cookieAttrs=`HttpOnly; SameSite=Lax; Path=/; Max-Age=${sessionDays*86400}${process.env.NODE_ENV==='production'?' ; Secure':''}`;

async function migrate(){
 await pool.query(`CREATE TABLE IF NOT EXISTS users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email text UNIQUE NOT NULL, name text NOT NULL, role text NOT NULL CHECK(role IN ('learner','teacher')), password_hash text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
 ALTER TABLE users ADD COLUMN IF NOT EXISTS share_self_learning boolean NOT NULL DEFAULT true;
 CREATE TABLE IF NOT EXISTS sessions (token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at timestamptz NOT NULL);
 CREATE TABLE IF NOT EXISTS practice_attempts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, lesson_id text NOT NULL, score integer NOT NULL CHECK(score BETWEEN 0 AND 100), total integer NOT NULL CHECK(total BETWEEN 1 AND 100), source text NOT NULL CHECK(source IN ('exercise','imported')), created_at timestamptz NOT NULL DEFAULT now());
 ALTER TABLE practice_attempts ADD COLUMN IF NOT EXISTS submission_key text;
 CREATE UNIQUE INDEX IF NOT EXISTS practice_submission ON practice_attempts(user_id,submission_key);
 CREATE TABLE IF NOT EXISTS lesson_drafts (user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, lesson_id text NOT NULL, answers jsonb NOT NULL DEFAULT '[]', updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,lesson_id));
 CREATE TABLE IF NOT EXISTS pronunciation_attempts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, lesson_id text NOT NULL, target_version text NOT NULL, score integer NOT NULL CHECK(score BETWEEN 0 AND 100), duration_ms integer NOT NULL CHECK(duration_ms BETWEEN 250 AND 120000), method text NOT NULL DEFAULT 'browser-speech-match-v1', submission_key text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id,submission_key));
 CREATE INDEX IF NOT EXISTS pronunciation_user_time ON pronunciation_attempts(user_id,created_at DESC);
 CREATE INDEX IF NOT EXISTS practice_user_time ON practice_attempts(user_id,created_at DESC);
 CREATE TABLE IF NOT EXISTS share_codes (code_hash text PRIMARY KEY, learner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at timestamptz NOT NULL, redeemed_at timestamptz);
 CREATE TABLE IF NOT EXISTS teacher_links (teacher_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, learner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(teacher_id,learner_id));
 CREATE TABLE IF NOT EXISTS class_notes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), learner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, teacher_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE, focus text NOT NULL, note text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());`);
 await migrateAssessments(pool);
}
function send(res,status,body,headers={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(body))}
function fail(status,message){const e=new Error(message);e.status=status;throw e}
function limited(req,key,limit=12){const address=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'unknown').toString().split(',')[0];const id=address+':'+key;const now=Date.now(),record=attempts.get(id)||{count:0,until:now+15*60e3};if(record.until<now){record.count=0;record.until=now+15*60e3}record.count++;attempts.set(id,record);if(record.count>limit)fail(429,'Too many attempts. Please try again later.')}
async function json(req){let body='';for await(const chunk of req){body+=chunk;if(body.length>300000)fail(413,'Request too large')}try{return JSON.parse(body||'{}')}catch{fail(400,'Invalid JSON')}}
async function currentUser(req){const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(!token)return null;const result=await pool.query('SELECT u.id,u.email,u.name,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()',[hash(token)]);return result.rows[0]||null}
async function required(req,role){const user=await currentUser(req);if(!user)fail(401,'Sign in to continue');if(role&&user.role!==role)fail(403,'Not allowed for this account');return user}
async function linked(teacherId,learnerId){const r=await pool.query('SELECT 1 FROM teacher_links WHERE teacher_id=$1 AND learner_id=$2',[teacherId,learnerId]);if(!r.rowCount)fail(403,'This learner has not shared access with you')}
async function startSession(res,user){const token=random();await pool.query("INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '30 days')",[hash(token),user.id]);send(res,200,{user},{'Set-Cookie':`${cookieName}=${token}; ${cookieAttrs}`})}
function passwordHash(password,salt=crypto.randomBytes(16).toString('hex')){return salt+':'+crypto.scryptSync(password,salt,64).toString('hex')}
function passwordMatches(password,stored){const [salt,key]=stored.split(':');if(!salt||!key||key.length!==128)return false;const a=Buffer.from(key,'hex'),b=crypto.scryptSync(password,salt,64);return crypto.timingSafeEqual(a,b)}
function safeEmail(email){return String(email||'').trim().toLowerCase()}
async function handle(req,res){
 const url=new URL(req.url,'http://localhost');const route=url.pathname;
 if(!route.startsWith('/api/'))return serve(req,res,route);
 if(req.method!=='GET'&&req.method!=='HEAD'){const origin=req.headers.origin;if(origin&&new URL(origin).host!==req.headers.host)fail(403,'Invalid request origin')}
 if(await handleAssessment({route,req,res,pool,required,json,send,fail}))return;
 if(route==='/api/health'&&req.method==='GET'){await pool.query('SELECT 1');return send(res,200,{ok:true})}
 if(route==='/api/auth/me'&&req.method==='GET')return send(res,200,{user:await currentUser(req)});
 if(route==='/api/auth/register'&&req.method==='POST'){
  limited(req,'register',6);const data=await json(req);const email=safeEmail(data.email),name=String(data.name||'').trim(),password=String(data.password||'');
  if(!data.adult||!/^\S+@\S+\.\S+$/.test(email)||email.length>254||name.length<2||name.length>80||password.length<12||password.length>128||!['learner','teacher'].includes(data.role))fail(400,'Enter a valid name, email, 12+ character password, and confirm you are 18 or older');
  try{const result=await pool.query('INSERT INTO users(email,name,role,password_hash) VALUES($1,$2,$3,$4) RETURNING id,email,name,role',[email,name,data.role,passwordHash(password)]);return startSession(res,result.rows[0])}catch(e){if(e.code==='23505')fail(409,'An account already uses this email');throw e}
 }
 if(route==='/api/auth/login'&&req.method==='POST'){
  limited(req,'login',12);const data=await json(req);const r=await pool.query('SELECT * FROM users WHERE email=$1',[safeEmail(data.email)]);if(!r.rowCount||!passwordMatches(String(data.password||''),r.rows[0].password_hash))fail(401,'Email or password is incorrect');const {id,email,name,role}=r.rows[0];return startSession(res,{id,email,name,role});
 }
 if(route==='/api/auth/logout'&&req.method==='POST'){
  const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(token)await pool.query('DELETE FROM sessions WHERE token_hash=$1',[hash(token)]);return send(res,200,{ok:true},{'Set-Cookie':`${cookieName}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${process.env.NODE_ENV==='production'?'; Secure':''}`});
 }
 if(route==='/api/privacy'&&req.method==='GET'){
  const user=await required(req,'learner');const r=await pool.query('SELECT share_self_learning FROM users WHERE id=$1',[user.id]);return send(res,200,{shareSelfLearning:r.rows[0].share_self_learning});
 }
 if(route==='/api/privacy'&&req.method==='PUT'){
  const user=await required(req,'learner'),data=await json(req);if(typeof data.shareSelfLearning!=='boolean')fail(400,'Choose whether to share self-study activity');
  await pool.query('UPDATE users SET share_self_learning=$2 WHERE id=$1',[user.id,data.shareSelfLearning]);return send(res,200,{shareSelfLearning:data.shareSelfLearning});
 }
 if(route==='/api/practice'&&req.method==='GET'){
  const user=await required(req,'learner');const r=await pool.query('SELECT id,lesson_id AS lesson,score,total,source,created_at AS at FROM practice_attempts WHERE user_id=$1 ORDER BY created_at DESC,id DESC LIMIT 50',[user.id]);return send(res,200,{attempts:r.rows});
 }
 if(route==='/api/pronunciation'&&req.method==='GET'){
  const user=await required(req,'learner');const r=await pool.query('SELECT id,lesson_id AS lesson,target_version AS "targetVersion",score,duration_ms AS "durationMs",method,created_at AS at FROM pronunciation_attempts WHERE user_id=$1 ORDER BY created_at DESC,id DESC LIMIT 50',[user.id]);return send(res,200,{attempts:r.rows});
 }
 if(route==='/api/pronunciation'&&req.method==='POST'){
  const user=await required(req,'learner'),data=await json(req),lesson=getLesson(data.lesson),expected=data.lesson+'-model-v1';limited(req,'pronunciation',60);
  if(!lesson?.pronunciationTarget||data.targetVersion!==expected||!Number.isInteger(data.score)||data.score<0||data.score>100||!Number.isInteger(data.durationMs)||data.durationMs<250||data.durationMs>120000||typeof data.submissionKey!=='string'||!/^[-a-zA-Z0-9]{10,100}$/.test(data.submissionKey))fail(400,'Invalid pronunciation result');
  const r=await pool.query("INSERT INTO pronunciation_attempts(user_id,lesson_id,target_version,score,duration_ms,method,submission_key) VALUES($1,$2,$3,$4,$5,'browser-speech-match-v1',$6) ON CONFLICT(user_id,submission_key) DO UPDATE SET submission_key=EXCLUDED.submission_key RETURNING id,lesson_id AS lesson,target_version AS \"targetVersion\",score,duration_ms AS \"durationMs\",method,created_at AS at",[user.id,lesson.id,expected,data.score,data.durationMs,data.submissionKey]);
  if(r.rows[0].lesson!==lesson.id)fail(409,'Submission key already used');return send(res,201,{attempt:r.rows[0]});
 }
 if(route==='/api/learning'&&req.method==='GET'){
  const user=await required(req,'learner');
  const [progress,drafts]=await Promise.all([pool.query("SELECT lesson_id AS lesson,MAX(score)::int AS best,COUNT(*)::int AS count,(ARRAY_AGG(score ORDER BY created_at DESC,id DESC))[1] AS latest FROM practice_attempts WHERE user_id=$1 GROUP BY lesson_id",[user.id]),pool.query('SELECT lesson_id AS lesson,answers,updated_at AS at FROM lesson_drafts WHERE user_id=$1',[user.id])]);
  return send(res,200,{progress:progress.rows,drafts:drafts.rows});
 }
 const draftMatch=route.match(/^\/api\/learning\/([a-z0-9-]+)$/);
 if(draftMatch&&req.method==='PUT'){
  const user=await required(req,'learner'),data=await json(req),lesson=getLesson(draftMatch[1]);
  if(!lesson||!Array.isArray(data.answers)||data.answers.length>=lesson.questions.length||!data.answers.every((a,i)=>validAnswer(lesson.questions[i],a)))fail(400,'Invalid lesson progress');
  await pool.query('INSERT INTO lesson_drafts(user_id,lesson_id,answers) VALUES($1,$2,$3::jsonb) ON CONFLICT(user_id,lesson_id) DO UPDATE SET answers=EXCLUDED.answers,updated_at=now()',[user.id,lesson.id,JSON.stringify(data.answers)]);
  return send(res,200,{ok:true});
 }
 if(route==='/api/practice'&&req.method==='POST'){
  const user=await required(req,'learner'),data=await json(req);let result;
  try{result=gradeLesson(data.lesson,data.answers)}catch{fail(400,'Invalid completed exercise')}
  const key=data.submissionKey||null;if(key!==null&&(typeof key!=='string'||!/^[-a-zA-Z0-9]{10,100}$/.test(key)))fail(400,'Invalid submission key');
  const c=await pool.connect();try{
   await c.query('BEGIN');
   const r=await c.query("INSERT INTO practice_attempts(user_id,lesson_id,score,total,source,submission_key) VALUES($1,$2,$3,$4,'exercise',$5) ON CONFLICT(user_id,submission_key) DO UPDATE SET submission_key=EXCLUDED.submission_key RETURNING id,lesson_id AS lesson,score,total,source,created_at AS at",[user.id,data.lesson,result.score,result.total,key]);
   if(r.rows[0].lesson!==data.lesson)fail(409,'Submission key already used');
   await c.query('DELETE FROM lesson_drafts WHERE user_id=$1 AND lesson_id=$2',[user.id,data.lesson]);await c.query('COMMIT');return send(res,201,{attempt:r.rows[0]});
  }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
 }
 if(route==='/api/practice/import'&&req.method==='POST'){
  const user=await required(req,'learner'),data=await json(req);if(!Array.isArray(data.attempts)||data.attempts.length>2000)fail(400,'Invalid import');
  for(const attempt of data.attempts){if(!Number.isInteger(attempt.score)||attempt.score<0||attempt.score>100||!Number.isInteger(attempt.total)||attempt.total<1||attempt.total>100||!getLesson(attempt.lesson||'subjunctive'))fail(400,'Invalid score')}
  const c=await pool.connect();try{await c.query('BEGIN');await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);
  const existing=await c.query('SELECT 1 FROM practice_attempts WHERE user_id=$1 LIMIT 1',[user.id]);if(existing.rowCount)fail(409,'This account already has saved practice');
  for(const attempt of [...data.attempts].reverse()){const date=attempt.at&&Number.isFinite(Date.parse(attempt.at))?new Date(attempt.at):new Date();await c.query("INSERT INTO practice_attempts(user_id,lesson_id,score,total,source,created_at) VALUES($1,$5,$2,$3,'imported',$4)",[user.id,attempt.score,attempt.total,date,attempt.lesson||'subjunctive'])}
  await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
  return send(res,200,{imported:data.attempts.length});
 }
 if(route==='/api/share-code'&&req.method==='POST'){
  const user=await required(req,'learner');limited(req,'share',8);const code=crypto.randomBytes(6).toString('hex').toUpperCase();await pool.query("INSERT INTO share_codes(code_hash,learner_id,expires_at) VALUES($1,$2,now()+interval '24 hours')",[hash(code),user.id]);return send(res,201,{code,expiresInHours:24});
 }
 if(route==='/api/learner/teachers'&&req.method==='GET'){const user=await required(req,'learner');const r=await pool.query('SELECT u.id,u.name FROM teacher_links l JOIN users u ON u.id=l.teacher_id WHERE l.learner_id=$1 ORDER BY u.name',[user.id]);return send(res,200,{teachers:r.rows})}
 const removeTeacher=route.match(/^\/api\/learner\/teachers\/([a-f0-9-]{36})$/);
 if(removeTeacher&&req.method==='DELETE'){const user=await required(req,'learner');await pool.query('DELETE FROM teacher_links WHERE learner_id=$1 AND teacher_id=$2',[user.id,removeTeacher[1]]);return send(res,200,{ok:true})}
 if(route==='/api/teacher/connect'&&req.method==='POST'){
  const teacher=await required(req,'teacher'),data=await json(req);limited(req,'connect',15);const code=String(data.code||'').replace(/\s/g,'').toUpperCase();if(!/^[A-F0-9]{12}$/.test(code))fail(400,'Enter a 12-character sharing code');
  const c=await pool.connect();try{await c.query('BEGIN');const r=await c.query('UPDATE share_codes SET redeemed_at=now() WHERE code_hash=$1 AND expires_at>now() AND redeemed_at IS NULL RETURNING learner_id',[hash(code)]);if(!r.rowCount)fail(400,'Code expired or already used');await c.query('INSERT INTO teacher_links(teacher_id,learner_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[teacher.id,r.rows[0].learner_id]);await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}return send(res,200,{ok:true});
 }
 if(route==='/api/teacher/learners'&&req.method==='GET'){
  const teacher=await required(req,'teacher');const r=await pool.query('SELECT u.id,u.name FROM teacher_links l JOIN users u ON u.id=l.learner_id WHERE l.teacher_id=$1 ORDER BY u.name',[teacher.id]);return send(res,200,{learners:r.rows});
 }
 const match=route.match(/^\/api\/teacher\/learners\/([a-f0-9-]{36})(?:\/(notes))?$/);
 if(match){const teacher=await required(req,'teacher'),learnerId=match[1];await linked(teacher.id,learnerId);
  if(!match[2]&&req.method==='GET'){const learner=await pool.query('SELECT id,name,share_self_learning FROM users WHERE id=$1',[learnerId]);const shared=learner.rows[0].share_self_learning;const [r,assessments,pronunciation]=shared?await Promise.all([pool.query('SELECT id,lesson_id AS lesson,score,total,source,created_at AS at FROM practice_attempts WHERE user_id=$1 ORDER BY created_at DESC,id DESC LIMIT 50',[learnerId]),assessmentHistory(pool,learnerId),pool.query('SELECT id,lesson_id AS lesson,target_version AS "targetVersion",score,duration_ms AS "durationMs",method,created_at AS at FROM pronunciation_attempts WHERE user_id=$1 ORDER BY created_at DESC,id DESC LIMIT 20',[learnerId])]):[{rows:[]},[],{rows:[]}];return send(res,200,{learner:{id:learner.rows[0].id,name:learner.rows[0].name},attempts:r.rows,assessment:assessments[0]||null,pronunciation:pronunciation.rows,sharing:{selfLearning:shared}})}
  if(match[2]==='notes'&&req.method==='GET'){const r=await pool.query('SELECT n.id,n.focus,n.note,n.created_at AS at,u.name AS teacher FROM class_notes n JOIN users u ON u.id=n.teacher_id WHERE n.learner_id=$1 ORDER BY n.created_at DESC LIMIT 50',[learnerId]);return send(res,200,{notes:r.rows})}
  if(match[2]==='notes'&&req.method==='POST'){const data=await json(req),focus=String(data.focus||'').trim(),note=String(data.note||'').trim();if(focus.length<2||focus.length>100||note.length<3||note.length>3000)fail(400,'Enter a focus and note (3–3000 characters)');const r=await pool.query('INSERT INTO class_notes(learner_id,teacher_id,focus,note) VALUES($1,$2,$3,$4) RETURNING id,focus,note,created_at AS at',[learnerId,teacher.id,focus,note]);return send(res,201,{note:r.rows[0]})}
 }
 if(route==='/api/notes'&&req.method==='GET'){const user=await required(req,'learner');const r=await pool.query('SELECT n.id,n.focus,n.note,n.created_at AS at,u.name AS teacher FROM class_notes n JOIN users u ON u.id=n.teacher_id WHERE n.learner_id=$1 ORDER BY n.created_at DESC LIMIT 50',[user.id]);return send(res,200,{notes:r.rows})}
 fail(404,'Not found');
}
async function serve(req,res,route){if(req.method!=='GET'&&req.method!=='HEAD')return send(res,405,{error:'Method not allowed'});let filename=path.resolve(dist,'.'+route);if(!filename.startsWith(dist+path.sep)&&filename!==dist)return send(res,404,{error:'Not found'});if(route==='/'||!path.extname(route))filename=path.join(dist,'index.html');try{const data=await fs.readFile(filename);res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':filename.endsWith('index.html')?'no-cache':'public, max-age=31536000, immutable'});res.end(req.method==='HEAD'?undefined:data)}catch{send(res,404,{error:'Not found'})}}
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required');
await migrate();
http.createServer((req,res)=>handle(req,res).catch(err=>{if(err.status<500)send(res,err.status,{error:err.message});else{console.error('Request failed',err);send(res,500,{error:'Server error'})}})).listen(Number(process.env.PORT)||3000,'0.0.0.0',()=>console.log('Continuum API ready'));
