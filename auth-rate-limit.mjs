import {createHash} from 'node:crypto';
import {isIP} from 'node:net';
// Trust Railway's documented client-IP header only in its deployment environment.
// Direct/local requests cannot rotate their budget with X-Forwarded-For.
export function authClientAddress(req,env=process.env){
 const supplied=req.headers['x-real-ip'];
 if(env.RAILWAY_ENVIRONMENT_ID&&typeof supplied==='string'&&isIP(supplied.trim()))return supplied.trim();
 return req.socket.remoteAddress||'unknown';
}
export async function migrateAuthLimits(pool){
 await pool.query(`CREATE TABLE IF NOT EXISTS auth_rate_limits (
  key_hash text PRIMARY KEY, hits integer NOT NULL, expires_at timestamptz NOT NULL
 ); CREATE INDEX IF NOT EXISTS auth_rate_limits_expiry ON auth_rate_limits(expires_at);`);
}
export function createAuthLimiter(pool,{now=Date.now}={}){
 let cleanupAt=0;
 return async function consume(scope,identity,limit,windowSeconds=900){
  const key=createHash('sha256').update(scope+'\0'+identity).digest('hex');
  let result;
  try{
   if(now()>=cleanupAt){
    cleanupAt=now()+60000;
    await pool.query('DELETE FROM auth_rate_limits WHERE key_hash IN (SELECT key_hash FROM auth_rate_limits WHERE expires_at<=now() ORDER BY expires_at LIMIT 500)');
   }
   result=await pool.query(`INSERT INTO auth_rate_limits(key_hash,hits,expires_at)
    VALUES($1,1,now()+($2*interval '1 second'))
    ON CONFLICT(key_hash) DO UPDATE SET
     hits=CASE WHEN auth_rate_limits.expires_at<=now() THEN 1 ELSE LEAST(auth_rate_limits.hits+1,$3) END,
     expires_at=CASE WHEN auth_rate_limits.expires_at<=now() THEN EXCLUDED.expires_at ELSE auth_rate_limits.expires_at END
    RETURNING hits, GREATEST(1,ceil(extract(epoch FROM expires_at-now())))::integer AS retry_after`,[key,windowSeconds,limit+1]);
  }catch{
   // Fail closed: database trouble must not silently remove brute-force protection.
   throw Object.assign(Error('Sign-in is temporarily unavailable. Please try again shortly.'),{status:503});
  }
  if(result.rows[0].hits>limit)throw Object.assign(Error('Too many attempts. Please try again later.'),{status:429,retryAfter:result.rows[0].retry_after});
 };
}
