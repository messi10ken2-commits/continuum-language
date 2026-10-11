import {validSharedLanguages} from './teacher-access.mjs';
export async function migrateProfiles(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS learner_profiles(user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS teacher_profiles(user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, data jsonb NOT NULL DEFAULT '{}', status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','pending','approved','changes_requested')), revision integer NOT NULL DEFAULT 1, feedback text NOT NULL DEFAULT '', updated_at timestamptz NOT NULL DEFAULT now());
 CREATE TABLE IF NOT EXISTS teacher_bookmarks(learner_id uuid REFERENCES users(id) ON DELETE CASCADE,teacher_id uuid REFERENCES users(id) ON DELETE CASCADE,created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(learner_id,teacher_id));
 CREATE TABLE IF NOT EXISTS platform_reviewers(user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE);
 CREATE TABLE IF NOT EXISTS teacher_profile_reviews(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),teacher_id uuid REFERENCES users(id) ON DELETE CASCADE,reviewer_id uuid REFERENCES users(id),revision integer NOT NULL,decision text NOT NULL,feedback text NOT NULL,created_at timestamptz NOT NULL DEFAULT now());
 `);}
const text=(value,max)=>typeof value==='string'?value.trim().slice(0,max):'';
function video(value){try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&['youtube.com','www.youtube.com','youtu.be','vimeo.com','www.vimeo.com'].includes(u.hostname)}catch{return false}}
function photo(value){if(typeof value!=='string'||value.length>220000)return false;const m=value.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);if(!m)return false;const b=Buffer.from(m[2],'base64');return m[1]==='jpeg'?b[0]===255&&b[1]===216:m[1]==='png'?b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP'}
const publicProfile=row=>({id:row.user_id,status:row.status,profile:(( {credentialNotes,...publicFields})=>publicFields)(row.data)});
export async function handleProfiles({route,req,res,pool,required,json,send,fail}){
 if(!['/api/profile','/api/teachers','/api/bookmarks','/api/admin/teacher-profiles'].some(p=>route===p||route.startsWith(p+'/')))return false;
 const reviewer=async user=>(await pool.query('SELECT 1 FROM platform_reviewers WHERE user_id=$1',[user.id])).rows.length>0;
 if(route==='/api/profile'&&req.method==='GET'){
  const user=await required(req),r=await pool.query(`SELECT * FROM ${user.role==='teacher'?'teacher_profiles':'learner_profiles'} WHERE user_id=$1`,[user.id]);
  send(res,200,{profile:r.rows[0]?.data||null,status:r.rows[0]?.status||null,feedback:r.rows[0]?.feedback||'',revision:r.rows[0]?.revision||0,reviewer:await reviewer(user)});return true;
 }
 if(route==='/api/profile'&&req.method==='PUT'){
  const user=await required(req),body=await json(req),d=body.profile||{};
  if(user.role==='learner'){
   if(!validSharedLanguages(d.languages)||!d.languages.length||!d.languages.includes(d.primaryLanguage)||!['manual','assessment'].includes(d.startMode)||!['A1','A2','B1','B2','C1'].includes(d.level))fail(400,'Choose your language, starting level and learning route');
   const data={name:text(d.name,80),languages:d.languages,primaryLanguage:d.primaryLanguage,startMode:d.startMode,level:d.level,goal:text(d.goal,500)};if(data.name.length<2)fail(400,'Enter a display name');
   await pool.query('INSERT INTO learner_profiles(user_id,data) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET data=EXCLUDED.data,updated_at=now()',[user.id,data]);send(res,200,{profile:data});return true;
  }
  if(!Number.isInteger(body.revision)||body.revision<0)fail(400,'Reload your profile before saving');
  if(!validSharedLanguages(d.languages))fail(400,'Choose supported teaching languages');
  const data={name:text(d.name,80),headline:text(d.headline,120),bio:text(d.bio,2500),experience:text(d.experience,2000),approach:text(d.approach,2000),qualifications:text(d.qualifications,1500),credentialNotes:text(d.credentialNotes,2000),spokenLanguages:text(d.spokenLanguages,300),timezone:text(d.timezone,80),languages:d.languages,photo:d.photo||'',video:text(d.video,500)};
  if(data.photo&&!photo(data.photo))fail(400,'Upload a JPEG, PNG or WebP photo under 160 KB');
  if(data.video&&!video(data.video))fail(400,'Use an HTTPS YouTube or Vimeo introduction video link');
  if(body.submit){
   if(data.name.length<2||data.headline.length<10||data.bio.length<100||data.experience.length<40||data.approach.length<50||data.qualifications.length<5||!data.spokenLanguages||!data.languages.length||!data.photo||!data.video||body.consent!==true)fail(400,'Complete every required profile field and confirm your information before submitting');
   try{new Intl.DateTimeFormat('en',{timeZone:data.timezone}).format()}catch{fail(400,'Enter a valid time zone')}
  }
  const status=body.submit?'pending':'draft';let r;
  if(body.revision===0)r=await pool.query('INSERT INTO teacher_profiles(user_id,data,status) VALUES($1,$2,$3) ON CONFLICT DO NOTHING RETURNING revision',[user.id,data,status]);
  else r=await pool.query("UPDATE teacher_profiles SET data=$2,status=$3,revision=revision+1,feedback='',updated_at=now() WHERE user_id=$1 AND revision=$4 RETURNING revision",[user.id,data,status,body.revision]);
  if(!r.rows.length)fail(409,'This profile changed in another session. Reload before saving.');
  send(res,200,{profile:data,status,revision:r.rows[0].revision,feedback:''});return true;
 }
 if(route.startsWith('/api/admin/teacher-profiles')){
  const user=await required(req);if(!await reviewer(user))fail(403,'Reviewer access required');
  if(route==='/api/admin/teacher-profiles'&&req.method==='GET'){const r=await pool.query("SELECT user_id,data,status,revision,feedback,updated_at FROM teacher_profiles WHERE status IN ('pending','approved','changes_requested') ORDER BY CASE WHEN status='pending' THEN 0 ELSE 1 END,updated_at DESC LIMIT 100");send(res,200,{profiles:r.rows});return true;}
  const m=route.match(/^\/api\/admin\/teacher-profiles\/([a-f0-9-]{36})$/);
  if(m&&req.method==='PUT'){
   const d=await json(req),feedback=text(d.feedback,1500);if(!['approved','changes_requested'].includes(d.decision)||!Number.isInteger(d.revision)||feedback.length<3||d.decision==='approved'&&d.checked!==true)fail(400,'Review the profile, add feedback and confirm your checks');
   if(m[1]===user.id)fail(403,'You cannot review your own profile');
   const c=await pool.connect();try{await c.query('BEGIN');const r=await c.query("UPDATE teacher_profiles SET status=$2,feedback=$3,updated_at=now() WHERE user_id=$1 AND revision=$4 AND status IN ('pending','approved') RETURNING user_id",[m[1],d.decision,feedback,d.revision]);if(!r.rows.length)fail(409,'Profile changed or is no longer awaiting review');await c.query('INSERT INTO teacher_profile_reviews(teacher_id,reviewer_id,revision,decision,feedback) VALUES($1,$2,$3,$4,$5)',[m[1],user.id,d.revision,d.decision,feedback]);await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
   send(res,200,{ok:true});return true;
  }
 }
 if(route==='/api/teachers'&&req.method==='GET'){
  const language=new URL(req.url,'http://localhost').searchParams.get('language');if(language&&!validSharedLanguages([language]))fail(400,'Unknown language');
  const r=await pool.query("SELECT user_id,data,status FROM teacher_profiles WHERE status='approved' AND ($1::text IS NULL OR data->'languages' ? $1) ORDER BY updated_at DESC LIMIT 100",[language||null]);send(res,200,{teachers:r.rows.map(publicProfile)});return true;
 }
 const detail=route.match(/^\/api\/teachers\/([a-f0-9-]{36})$/);
 if(detail&&req.method==='GET'){const r=await pool.query("SELECT user_id,data,status FROM teacher_profiles WHERE user_id=$1 AND status='approved'",[detail[1]]);if(!r.rows.length)fail(404,'Teacher profile is not published');send(res,200,{teacher:publicProfile(r.rows[0])});return true;}
 if(route==='/api/bookmarks'&&req.method==='GET'){const user=await required(req,'learner'),r=await pool.query("SELECT p.user_id,p.data,p.status FROM teacher_bookmarks b JOIN teacher_profiles p ON p.user_id=b.teacher_id WHERE b.learner_id=$1 AND p.status='approved' ORDER BY b.created_at DESC",[user.id]);send(res,200,{teachers:r.rows.map(publicProfile)});return true;}
 const bookmark=route.match(/^\/api\/bookmarks\/([a-f0-9-]{36})$/);
 if(bookmark&&['PUT','DELETE'].includes(req.method)){
  const user=await required(req,'learner');if(req.method==='DELETE')await pool.query('DELETE FROM teacher_bookmarks WHERE learner_id=$1 AND teacher_id=$2',[user.id,bookmark[1]]);
  else{const r=await pool.query("INSERT INTO teacher_bookmarks(learner_id,teacher_id) SELECT $1,user_id FROM teacher_profiles WHERE user_id=$2 AND status='approved' ON CONFLICT DO NOTHING RETURNING teacher_id",[user.id,bookmark[1]]);if(!r.rows.length){const existing=await pool.query("SELECT 1 FROM teacher_profiles WHERE user_id=$1 AND status='approved'",[bookmark[1]]);if(!existing.rows.length)fail(404,'Teacher profile is not published');}}
  send(res,200,{ok:true});return true;
 }
 fail(404,'Not found');
}
