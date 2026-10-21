import assert from 'node:assert/strict';
import {test} from 'node:test';
import {scryptSync} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {passwordHash,passwordMatches} from './password-security.mjs';
import {createAuthLimiter,authClientAddress,migrateAuthLimits} from './auth-rate-limit.mjs';
import {assertSecureRuntime} from './runtime-policy.mjs';

test('runtime rejects pre-patch and unvalidated major versions',()=>{
 for(const v of ['22.11.0','24.19.0','24.22.0','24.22.1-rc.1','26.12.1'])assert.throws(()=>assertSecureRuntime(v));
 for(const v of ['24.22.1','24.22.2','24.23.0'])assert.equal(assertSecureRuntime(v),v);
});
test('password verification preserves legacy hashes, keeps the event loop responsive and bounds expensive work',async()=>{
 const password='synthetic-security-password',salt='0123456789abcdef0123456789abcdef';
 const old=salt+':'+scryptSync(password,salt,64).toString('hex');
 assert.equal(await passwordMatches(password,old),true);
 assert.equal(await passwordMatches('wrong',old),false);
 assert.equal(await passwordMatches(password,undefined),false);
 assert.equal(await passwordMatches('x'.repeat(129),old),false);
 const pending=passwordHash(password,salt);
 const first=await Promise.race([pending.then(()=> 'hash'),new Promise(r=>setImmediate(()=>r('event-loop')))]);
 assert.equal(first,'event-loop');assert.equal(await pending,old);
 const jobs=await Promise.allSettled(Array.from({length:25},()=>passwordHash(password)));
 assert.equal(jobs.filter(r=>r.status==='fulfilled').length,20);
 for(const r of jobs.filter(r=>r.status==='rejected'))assert.equal(r.reason.status,503);
 assert.equal(await passwordMatches(password,await passwordHash(password)),true,'queue releases capacity');
});
test('shared authentication budgets are atomic, survive limiter recreation, expire and fail closed',async()=>{
 const db=new PGlite();
 const pool={query:(sql,args)=>args?db.query(sql,args):db.exec(sql)};
 try{
  await migrateAuthLimits(pool);
  const one=createAuthLimiter(pool),two=createAuthLimiter(pool);
  const responses=await Promise.allSettled(Array.from({length:20},(_,i)=>(i%2?one:two)('login-ip','192.0.2.20',12)));
  assert.equal(responses.filter(r=>r.status==='fulfilled').length,12);
  for(const r of responses.filter(r=>r.status==='rejected')){assert.equal(r.reason.status,429);assert.ok(r.reason.retryAfter>0);}
  await assert.rejects(createAuthLimiter(pool)('login-ip','192.0.2.20',12),{status:429});
  await one('login-ip','192.0.2.21',12);
  await one('login-account','person@example.test',1);
  await assert.rejects(two('login-account','person@example.test',1),{status:429});
  const rows=(await db.query('SELECT key_hash FROM auth_rate_limits')).rows;
  assert.ok(rows.every(r=>/^[a-f0-9]{64}$/.test(r.key_hash)),'identifiers are hashed');
  await db.query("UPDATE auth_rate_limits SET expires_at=now()-interval '1 second'");
  await one('login-ip','192.0.2.20',12); // Reset in the UPSERT even before the next cleanup.
  let clock=Date.now()+120000;
  await createAuthLimiter(pool,{now:()=>clock})('login-ip','192.0.2.22',12);
  assert.equal((await db.query('SELECT count(*)::integer AS n FROM auth_rate_limits')).rows[0].n,2);
 }finally{await db.close();}
 await assert.rejects(createAuthLimiter({query(){throw Error('database down')}})('login-ip','192.0.2.20',12),{status:503});
});
test('direct requests ignore spoofed forwarding headers; Railway uses a valid X-Real-IP',()=>{
 const req={headers:{'x-forwarded-for':'192.0.2.1','x-real-ip':'192.0.2.2'},socket:{remoteAddress:'127.0.0.1'}};
 assert.equal(authClientAddress(req,{}),'127.0.0.1');
 assert.equal(authClientAddress(req,{RAILWAY_ENVIRONMENT_ID:'synthetic'}),'192.0.2.2');
 req.headers['x-real-ip']='not-an-ip';assert.equal(authClientAddress(req,{RAILWAY_ENVIRONMENT_ID:'synthetic'}),'127.0.0.1');
});
