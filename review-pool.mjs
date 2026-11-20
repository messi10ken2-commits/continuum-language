import {getLesson,getLessonVariant,isCorrect,hasExpandedExercises} from './course.mjs';
// Derive entries from authored coverage, never from a guessed learner weakness.
export function reviewCandidate(lessonId,q){
 const base=getLesson(q.sourceLesson)||getLesson(lessonId);
 if(!base||(!base.vocabulary&&!base.expressions&&!['Vocabulary','Expressions','Expression'].includes(base.skill)))return null;
 const entries=base.vocabulary||base.expressions||[];
 const match=/^entry:(\d+):/.exec(q.coverage||'');
 const entry=match&&entries[Number(match[1])];
 let question=q;
 if(hasExpandedExercises(base.id)){
  const current=getLessonVariant(base.id,'v7-review-pool-123456789').questions;
  question=current.find(x=>x.coverage===`entry:${match?.[1]}:context`)||current.find(x=>x.coverage&&x.coverage===q.coverage)||q;
 }
 const term=entry?.term||(question.type==='text'?question.answer:question.options?.[question.answer]);
 if(!term)return null;
 const key=entry?`entry:${match[1]}`:q.coverage||q.prompt;
 return {key:base.id+':'+key,lesson:base.id,language:base.language||'es',kind:base.expressions?'expression':'vocabulary',term,meaning:entry?.meaning||question.note||'',example:entry?.example||'',question};
}
export function missedReviewItems(id,answers,seed,resolved=null){
 const lesson=resolved||getLessonVariant(id,seed);if(!lesson)return [];
 return answers.flatMap((answer,i)=>{const q=lesson.questions[i];if(!q||isCorrect(q,answer))return [];const item=reviewCandidate(id,q);return item?[{...item,index:i}]:[];});
}
export async function migrateReview(pool){await pool.query(`
 CREATE TABLE IF NOT EXISTS review_items(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,item_key text NOT NULL,language text NOT NULL,lesson_id text NOT NULL,kind text NOT NULL,term text NOT NULL,meaning text NOT NULL,example text NOT NULL,question jsonb NOT NULL,misses integer NOT NULL DEFAULT 1,strength integer NOT NULL DEFAULT 0,due_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),UNIQUE(user_id,item_key));
 CREATE TABLE IF NOT EXISTS review_ingested(user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,event_key text NOT NULL,PRIMARY KEY(user_id,event_key));
 CREATE TABLE IF NOT EXISTS review_answers(user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,submission_key text NOT NULL,item_id uuid NOT NULL REFERENCES review_items(id) ON DELETE CASCADE,result jsonb NOT NULL,PRIMARY KEY(user_id,submission_key));
 CREATE INDEX IF NOT EXISTS review_due ON review_items(user_id,language,due_at);
 `);}
export async function ingestReview(db,userId,items,eventPrefix){
 for(const item of items){
  const inserted=await db.query('INSERT INTO review_ingested(user_id,event_key) VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING event_key',[userId,eventPrefix+':'+item.index]);
  if(!inserted.rowCount)continue;
  await db.query(`INSERT INTO review_items(user_id,item_key,language,lesson_id,kind,term,meaning,example,question) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb) ON CONFLICT(user_id,item_key) DO UPDATE SET misses=review_items.misses+1,strength=0,due_at=now(),updated_at=now(),question=EXCLUDED.question`,[userId,item.key,item.language,item.lesson,item.kind,item.term,item.meaning,item.example,JSON.stringify(item.question)]);
 }
}
export const reviewRun=(lesson,seed,fallback)=>seed?`lesson:${lesson}:${seed}`:`attempt:${fallback}`;
