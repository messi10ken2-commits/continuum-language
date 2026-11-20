import assert from 'node:assert/strict';
import {testServer,db} from './test-server.mjs';
import {languages} from './languages.mjs';
import {skillRecordsForLanguage} from './skill-record-model.mjs';
const base='http://127.0.0.1:'+testServer.address().port;
async function api(path,method='GET',body,cookie){const r=await fetch(base+'/api'+path,{method,headers:{'Content-Type':'application/json',...(cookie?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
try{
 const learner=await api('/auth/register','POST',{name:'History Test',email:'history-language@example.test',password:'synthetic-history-password',role:'learner',adult:true});assert.equal(learner.status,200);const id=learner.data.user.id,cookie=learner.cookie;
 for(const [index,{id:language}] of languages.entries()){
  const task=(language==='es'?'':language+'-')+'skills-a1-writing';
  await db.query(`INSERT INTO skill_submissions(user_id,task_id,response,result,submission_key,created_at) SELECT $1,$2,'"Original learner evidence"'::jsonb,'{"status":"pending"}'::jsonb,$3||n,now()-interval '1 day' FROM generate_series(1,$4) n`,[id,task,'history-'+language+'-',index+1]);
 }
 // Newer records in one language must not displace another language's history
 // before the server applies its 100-record window.
 await db.query(`INSERT INTO skill_submissions(user_id,task_id,response,result,submission_key) SELECT $1,'skills-a1-writing','"Recent Spanish evidence"'::jsonb,'{"status":"pending"}'::jsonb,'recent-es-'||n FROM generate_series(1,105) n`,[id]);
 for(const [index,{id:language}] of languages.entries()){
  const res=await api('/skills?language='+language,'GET',null,cookie);assert.equal(res.status,200);assert.equal(res.data.submissions.length,language==='es'?100:index+1);assert.equal(skillRecordsForLanguage(res.data.submissions,language).length,res.data.submissions.length);
 }
 await db.query(`INSERT INTO skill_submissions(user_id,task_id,response,result,submission_key) VALUES($1,'focus-ko-work-writing-b2','"Private Korean response"'::jsonb,'{"status":"pending"}'::jsonb,'premium-ko-history')`,[id]);
 const ko=await api('/skills?language=ko','GET',null,cookie);assert.equal(ko.data.submissions.length,7);assert.equal(ko.data.submissions[0].taskInfo.language,'ko');assert.ok(ko.data.submissions.every(s=>!('response' in s)));
 assert.equal((await api('/skills?language=xx','GET',null,cookie)).status,400);assert.equal((await api('/skills?language=','GET',null,cookie)).status,400);
 const other=await api('/auth/register','POST',{name:'Other Learner',email:'history-other@example.test',password:'synthetic-history-password',role:'learner',adult:true});assert.equal((await api('/skills?language=ko','GET',null,other.cookie)).data.submissions.length,0);
 const teacher=await api('/auth/register','POST',{name:'History Teacher',email:'history-teacher@example.test',password:'synthetic-history-password',role:'teacher',adult:true});assert.equal((await api('/skills/learner/'+id+'?language=ko','GET',null,teacher.cookie)).status,403);
 const share=await api('/share-code','POST',{language:'ko'},cookie);assert.equal(share.status,201);assert.equal((await api('/teacher/connect','POST',{code:share.data.code},teacher.cookie)).status,200);
 assert.equal((await api('/skills/learner/'+id+'?language=ko','GET',null,teacher.cookie)).data.submissions.length,7);assert.equal((await api('/skills/learner/'+id+'?language=fr','GET',null,teacher.cookie)).status,403);
 console.log('PASS: all ten histories have per-language counts, filtering precedes LIMIT, unopened Premium metadata resolves, accounts and teacher permissions remain isolated.');
}finally{await new Promise(r=>testServer.close(r));await db.close();}
