// Run only from the trusted deployment environment, with DATABASE_URL set.
// Identify and confirm the owner's account UUID before running; no public role-claim endpoint exists.
import pg from 'pg';
const id=process.argv[2];
if(!/^[a-f0-9-]{36}$/.test(id||''))throw Error('Usage: node scripts/grant-profile-reviewer.mjs <confirmed-account-uuid>');
if(!process.env.DATABASE_URL)throw Error('DATABASE_URL is required');
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
try{const r=await pool.query('INSERT INTO platform_reviewers(user_id) SELECT id FROM users WHERE id=$1 ON CONFLICT DO NOTHING RETURNING user_id',[id]);const check=await pool.query('SELECT user_id FROM platform_reviewers WHERE user_id=$1',[id]);if(!check.rows.length)throw Error('Account not found');console.log(r.rows.length?'Reviewer access granted. Sign in again to open Review teachers.':'Reviewer access already configured.')}finally{await pool.end()}
