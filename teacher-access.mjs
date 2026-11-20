import {languages} from './languages.mjs';
export function validSharedLanguages(value){return Array.isArray(value)&&value.length<=languages.length&&new Set(value).size===value.length&&value.every(id=>languages.some(l=>l.id===id));}
export async function teacherScope(pool,teacherId,learnerId,fail){
 const r=await pool.query('SELECT l.languages,u.share_self_learning FROM teacher_links l JOIN users u ON u.id=l.learner_id WHERE l.teacher_id=$1 AND l.learner_id=$2',[teacherId,learnerId]);
 if(!r.rows.length)fail(403,'This learner has not shared access with you');
 return {languages:validSharedLanguages(r.rows[0].languages)?r.rows[0].languages:[],selfLearning:r.rows[0].share_self_learning};
}
export function requestedScope(req,scope,fail){const language=new URL(req.url,'http://localhost').searchParams.get('language');if(language&&!scope.languages.includes(language))fail(403,'This language is not shared with you');return language?[language]:scope.languages;}
