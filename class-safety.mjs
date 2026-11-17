export async function migrateClassSafety(pool){await pool.query(`CREATE TABLE IF NOT EXISTS class_user_blocks(blocker_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,blocked_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(blocker_id,blocked_id),CHECK(blocker_id<>blocked_id));`);}
export async function messagesBlocked(pool,a,b){return (await pool.query('SELECT 1 FROM class_user_blocks WHERE (blocker_id=$1 AND blocked_id=$2) OR (blocker_id=$2 AND blocked_id=$1) LIMIT 1',[a,b])).rows.length>0;}
export async function handleClassSafety({route,req,res,pool,required,json,send,fail}){
 const match=/^\/api\/classroom\/threads\/([a-f0-9-]{36})\/safety$/.exec(route);if(!match)return false;
 const user=await required(req),row=(await pool.query('SELECT teacher_id,learner_id FROM class_threads WHERE id=$1',[match[1]])).rows[0];if(!row||![row.teacher_id,row.learner_id].includes(user.id))fail(404,'Conversation not found');
 const other=row.teacher_id===user.id?row.learner_id:row.teacher_id;
 if(req.method==='PUT'){const data=await json(req);if(typeof data.blocked!=='boolean')fail(400,'Choose whether to block messages');const c=await pool.connect();try{await c.query('BEGIN');await c.query('SELECT id FROM users WHERE id=ANY($1::uuid[]) ORDER BY id FOR UPDATE',[[user.id,other]]);if(data.blocked)await c.query('INSERT INTO class_user_blocks(blocker_id,blocked_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[user.id,other]);else await c.query('DELETE FROM class_user_blocks WHERE blocker_id=$1 AND blocked_id=$2',[user.id,other]);await c.query('COMMIT')}catch(e){await c.query('ROLLBACK');throw e}finally{c.release()}}
 else if(req.method!=='GET')fail(405,'Use GET or PUT');
 const mine=(await pool.query('SELECT 1 FROM class_user_blocks WHERE blocker_id=$1 AND blocked_id=$2',[user.id,other])).rows.length>0;send(res,200,{blockedByMe:mine,blocked:await messagesBlocked(pool,user.id,other)});return true;
}
