// Rolling platform activity index, not a star rating or a claim about teaching quality.
export function popularityScore({learners=0,returning=0,completed=0,cancelled=0,replies=0,opportunities=0}){
 return 20*Math.min(learners/10,1)+20*(returning+1)/(learners+2)+40*(completed+3)/(completed+cancelled+4)+20*(replies+2)/(opportunities+4);
}
export async function migrateTeacherRanking(pool){for(const sql of ['CREATE INDEX IF NOT EXISTS class_events_rank_booking ON class_events(booking_id,actor_id,kind,created_at)','CREATE INDEX IF NOT EXISTS class_bookings_rank_window ON class_bookings(starts_at,teacher_id)','CREATE INDEX IF NOT EXISTS class_bookings_rank_created ON class_bookings(created_at,teacher_id)'])await pool.query(sql)}
export async function rankedTeachers(pool,{language=null,query='',sort='popularity'}={}){
 const order=sort==='newest'?'updated_at DESC,user_id':'score DESC,updated_at DESC,user_id';
 return (await pool.query(`WITH recent AS (
 SELECT b.*,EXISTS(SELECT 1 FROM class_events e WHERE e.booking_id=b.id AND e.actor_id=b.teacher_id AND e.kind='cancelled' AND e.detail->>'fromStatus'='confirmed') AS teacher_cancelled
 FROM class_bookings b WHERE b.starts_at>=now()-interval '90 days' AND b.starts_at<=now() AND ($1::text IS NULL OR b.language=$1)
 ), learners AS (SELECT teacher_id,learner_id,count(*)::float AS n FROM recent WHERE status='completed' GROUP BY teacher_id,learner_id), demand AS (
 SELECT teacher_id,count(*)::float AS learners,count(*) FILTER(WHERE n>=2)::float AS repeat_learners FROM learners GROUP BY teacher_id
 ), reliability AS (SELECT teacher_id,count(*) FILTER(WHERE status='completed')::float AS completed,count(*) FILTER(WHERE status='cancelled' AND teacher_cancelled)::float AS cancelled FROM recent GROUP BY teacher_id), requests AS (
 SELECT b.teacher_id,b.created_at,b.status,(SELECT min(e.created_at) FROM class_events e WHERE e.booking_id=b.id AND e.actor_id=b.teacher_id AND e.kind IN ('confirmed','declined','cancelled')) AS decision
 FROM class_bookings b WHERE b.proposed_by=b.learner_id AND b.created_at>=now()-interval '90 days' AND b.created_at<=now() AND ($1::text IS NULL OR b.language=$1)
 ), responsiveness AS (
 SELECT teacher_id,count(*) FILTER(WHERE decision IS NOT NULL OR (status='requested' AND created_at<=now()-interval '24 hours'))::float AS opportunities,
 count(*) FILTER(WHERE decision IS NOT NULL AND decision>=created_at AND decision<=created_at+interval '24 hours')::float AS replies FROM requests GROUP BY teacher_id
 ), inputs AS (
 SELECT p.user_id,p.data,p.status,p.updated_at,COALESCE(d.learners,0) AS learners,COALESCE(d.repeat_learners,0) AS repeat_learners,COALESCE(r.completed,0) AS completed,COALESCE(r.cancelled,0) AS cancelled,COALESCE(s.replies,0) AS replies,COALESCE(s.opportunities,0) AS opportunities
 FROM teacher_profiles p LEFT JOIN demand d ON d.teacher_id=p.user_id LEFT JOIN reliability r ON r.teacher_id=p.user_id LEFT JOIN responsiveness s ON s.teacher_id=p.user_id
 WHERE p.status='approved' AND ($1::text IS NULL OR p.data->'languages' ? $1) AND ($2='' OR concat_ws(' ',p.data->>'name',p.data->>'headline',p.data->>'bio') ILIKE '%'||$2||'%')
 ), scored AS (SELECT *,20*LEAST(learners/10,1)+20*(repeat_learners+1)/(learners+2)+40*(completed+3)/(completed+cancelled+4)+20*(replies+2)/(opportunities+4) AS score FROM inputs)
 SELECT * FROM scored ORDER BY ${order} LIMIT 100`,[language,query])).rows;
}
export function publicPopularity(row,rank){return {score:Math.round(Number(row.score)),rank,provisional:Number(row.completed)<3||Number(row.learners)<2,windowDays:90};}
