// Uses only a new randomly named database on the existing LOCAL QA PostgreSQL.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import net from 'node:net';
import pg from 'pg';
const root=fileURLToPath(new URL('../',import.meta.url));
const name='continuum_qa_'+crypto.randomUUID().replaceAll('-','');
const admin=new pg.Client({connectionString:'postgresql://continuum_dev@127.0.0.1:55432/continuum_dev'});
await admin.connect();let created=false,app,db;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const listener=net.createServer();await new Promise(r=>listener.listen(0,'127.0.0.1',r));const port=listener.address().port;await new Promise(r=>listener.close(r));
const origin='http://127.0.0.1:'+port;
async function stop(){if(!app||app.exitCode!==null||app.signalCode!==null)return;const exited=new Promise(r=>app.once('exit',r));app.kill('SIGTERM');await Promise.race([exited,sleep(3000)]);if(app.exitCode===null&&app.signalCode===null){app.kill('SIGKILL');await exited;}}
async function start(){
 app=spawn(process.execPath,['server.mjs'],{cwd:root,env:{...process.env,DATABASE_URL:`postgresql://continuum_dev@127.0.0.1:55432/${name}`,PORT:String(port),NODE_ENV:'development',OPENAI_API_KEY:'',GEMINI_API_KEY:''},stdio:['ignore','pipe','pipe']});
 let output='';app.stdout.on('data',chunk=>output+=chunk);app.stderr.on('data',chunk=>output+=chunk);
 for(let i=0;i<100;i++){if(app.exitCode!==null)throw Error('QA server startup failed: '+output);try{if((await fetch(origin+'/api/health')).ok)return;}catch{}await sleep(100);}throw Error('QA server readiness timed out');
}
async function request(path,method='GET',body,cookie){const r=await fetch(origin+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});assert.ok(r.ok,method+' '+path+' '+r.status);return {data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 await admin.query(`CREATE DATABASE "${name}"`);created=true;
 db=new pg.Client({connectionString:`postgresql://continuum_dev@127.0.0.1:55432/${name}`});await db.connect();await start();
 const learner=await request('/auth/register','POST',{name:'QA Learner',email:'qa-learner@example.test',password:'synthetic-postgres-password',role:'learner',adult:true});
 const teacher=await request('/auth/register','POST',{name:'QA Teacher',email:'qa-teacher@example.test',password:'synthetic-postgres-password',role:'teacher',adult:true});
 await request('/interface-language','PUT',{language:'ja'},learner.cookie);
 const attempt=await request('/practice','POST',{lesson:'subjunctive',answers:[1,1,1,1,1],submissionKey:'qa-real-postgres-001'},learner.cookie);
 const retried=await request('/practice','POST',{lesson:'subjunctive',answers:[1,1,1,1,1],submissionKey:'qa-real-postgres-001'},learner.cookie);assert.equal(retried.data.attempt.id,attempt.data.attempt.id);
 const share=await request('/share-code','POST',{language:'es'},learner.cookie);await request('/teacher/connect','POST',{code:share.data.code},teacher.cookie);
 const note=await request(`/teacher/learners/${learner.data.user.id}/notes`,'POST',{language:'es',focus:'QA Focus',note:'Synthetic note for persistence checks.'},teacher.cookie);
 const assessment=await request('/assessments?language=ja','POST',{},learner.cookie);
 const before=(await db.query('SELECT id,password_hash FROM users ORDER BY id')).rows;
 await stop();await start();
 assert.deepEqual((await db.query('SELECT id,password_hash FROM users ORDER BY id')).rows,before);
 assert.equal((await request('/auth/me','GET',null,learner.cookie)).data.user.id,learner.data.user.id);
 assert.equal((await request('/interface-language','GET',null,learner.cookie)).data.language,'ja');
 assert.equal((await request('/interface-language','GET',null,teacher.cookie)).data.language,null);
 assert.equal((await request('/practice','GET',null,learner.cookie)).data.attempts[0].id,attempt.data.attempt.id);
 assert.equal((await request('/notes','GET',null,learner.cookie)).data.notes[0].id,note.data.note.id);
 assert.equal((await request('/assessments?language=ja','GET',null,learner.cookie)).data.active.id,assessment.data.session.id);
 assert.equal((await fetch(origin+`/api/teacher/learners/${learner.data.user.id}?language=ja`,{headers:{cookie:teacher.cookie}})).status,403);
 console.log('PASS: real local PostgreSQL restart preserves accounts/password hashes, sessions, isolated language preference, idempotent history, shared notes and active assessment; teacher unshared-language access is rejected.');
}finally{await stop();await db?.end();if(created)await admin.query(`DROP DATABASE "${name}"`);await admin.end();}
