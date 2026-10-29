import {learningLanguageIds} from './languages.mjs';
import {withVerifiedAnswers} from './verified-answers.mjs';
import {correctEntryNote} from './expression-watchouts.mjs';
import {listeningReviewQuestion} from './review-listening.mjs';
import {getLesson,getLessonVariant,isCorrect,validAnswer} from './course.mjs';
import {reviewCandidate,ingestReview,reviewRun} from './review-pool.mjs';
export async function handleReview({route,req,res,pool,required,json,send,fail}){
 if(!route.startsWith('/api/review'))return false;
 const reply=(...args)=>{send(...args);return true;};
 const user=await required(req,'learner');
 if(route==='/api/review'&&req.method==='GET'){
  // One-time catch-up for historical attempts with saved per-question outcomes.
  const c=await pool.connect();try{await c.query('BEGIN');await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);
   const attempts=await c.query(`SELECT id,lesson_id,variant_seed,evidence FROM practice_attempts a WHERE user_id=$1 AND evidence IS NOT NULL AND NOT EXISTS(SELECT 1 FROM review_ingested r WHERE r.user_id=a.user_id AND r.event_key='history:'||a.id::text) ORDER BY created_at`,[user.id]);
   for(const a of attempts.rows){
    let lesson;try{lesson=getLessonVariant(a.lesson_id,a.variant_seed)}catch{continue;}
    const items=[];for(const group of a.evidence||[])for(const e of group.items||[]){if(e.correct)continue;const index=lesson?.questions.findIndex(q=>q.prompt===e.prompt);if(index<0||index==null)continue;const item=reviewCandidate(a.lesson_id,lesson.questions[index]);if(item)items.push({...item,index});}
    await ingestReview(c,user.id,items,reviewRun(a.lesson_id,a.variant_seed,a.id));
    await c.query('INSERT INTO review_ingested(user_id,event_key) VALUES($1,$2) ON CONFLICT DO NOTHING',[user.id,'history:'+a.id]);
   }
   await c.query('COMMIT');
  }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
  const language=new URL(req.url,'http://localhost').searchParams.get('language');if(!learningLanguageIds.includes(language))fail(400,'Choose a supported language');
  const rows=await pool.query('SELECT id,language,lesson_id AS lesson,kind,term,meaning,example,question,misses,strength,due_at AS "dueAt" FROM review_items WHERE user_id=$1 AND language=$2 ORDER BY strength,due_at,term',[user.id,language]);
  return reply(res,200,{items:rows.rows.map(item=>({...item,question:correctEntryNote(getLesson(item.lesson),item.question)}))});
 }
 const match=/^\/api\/review\/([0-9a-f-]{36})\/check$/.exec(route);
 if(match&&req.method==='POST'){
  const data=await json(req);if(data.mode!=null&&!['context','listening'].includes(data.mode))fail(400,'Invalid review mode');const mode=data.mode||'context';if(typeof data.submissionKey!=='string'||!/^[-a-zA-Z0-9]{10,100}$/.test(data.submissionKey))fail(400,'Invalid submission');
  const c=await pool.connect();try{await c.query('BEGIN');await c.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);
   const previous=await c.query('SELECT item_id,result FROM review_answers WHERE user_id=$1 AND submission_key=$2',[user.id,data.submissionKey]);
   if(previous.rowCount){if(previous.rows[0].item_id!==match[1]||(previous.rows[0].result.mode||'context')!==mode)fail(409,'Submission already used');await c.query('COMMIT');return reply(res,200,previous.rows[0].result);}
   const found=await c.query('SELECT * FROM review_items WHERE user_id=$1 AND id=$2 FOR UPDATE',[user.id,match[1]]);if(!found.rowCount)fail(404,'Review item not found');
   const item=found.rows[0],rawQuestion=mode==='listening'?listeningReviewQuestion(item):correctEntryNote(getLesson(item.lesson_id),item.question);if(!rawQuestion)fail(400,'This item has no listening exercise');const q=mode==='context'?(await withVerifiedAnswers(c,user.id,{language:item.language,questions:[rawQuestion]})).questions[0]:rawQuestion;if(!validAnswer(q,data.answer))fail(400,'Choose or enter an answer');
   const correct=isCorrect(q,data.answer),strength=correct?Math.min(3,item.strength+1):0,days=[0,1,3,7][strength];
   const updated=await c.query("UPDATE review_items SET strength=$3,due_at=now()+($4*interval '1 day'),updated_at=now() WHERE user_id=$1 AND id=$2 RETURNING due_at",[user.id,item.id,strength,days]);
   const result={mode,correct,strength,dueAt:updated.rows[0].due_at,answer:q.type==='text'?q.answer:q.options[q.answer],note:q.note};
   await c.query('INSERT INTO review_answers(user_id,submission_key,item_id,result) VALUES($1,$2,$3,$4::jsonb)',[user.id,data.submissionKey,item.id,JSON.stringify(result)]);
   await c.query('COMMIT');return reply(res,200,result);
  }catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}
 }
 fail(404,'Review route not found');
}
