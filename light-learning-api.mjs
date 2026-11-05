import {getLesson} from './course.mjs';
import {lightActivities,validLightState,lightVersion,legacyLightVersion,lightRoundCount} from './light-learning-model.mjs';
export async function migrateLightLearning(pool){await pool.query(`CREATE TABLE IF NOT EXISTS light_learning_sessions(user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,id uuid NOT NULL,lesson_id text NOT NULL,state jsonb NOT NULL,revision integer NOT NULL DEFAULT 1,completed_at timestamptz,updated_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(user_id,id));CREATE INDEX IF NOT EXISTS light_learning_history ON light_learning_sessions(user_id,updated_at DESC);`)}
export async function handleLightLearning({route,req,res,pool,required,json,send,fail,limited}){
 const progressRoute=route==='/api/learning/light/progress';
 const match=route.match(/^\/api\/learning\/light(?:\/([a-z0-9-]+))?$/);if(!match&&!progressRoute)return false;
 const user=await required(req,'learner'),lesson=match?.[1]&&getLesson(match[1]);
 if(progressRoute){if(req.method!=='GET')fail(405,'Method not allowed');const rows=(await pool.query("SELECT lesson_id AS lesson,(state->>'round')::int AS round FROM light_learning_sessions WHERE user_id=$1 AND completed_at IS NOT NULL AND state->>'version'=$2 GROUP BY lesson_id,state->>'round'",[user.id,lightVersion])).rows;send(res,200,{completed:rows});return true;}
 if(match?.[1]&&!lesson)fail(404,'Lesson not found');
 if(req.method==='GET'){
  const url=new URL(req.url,'http://localhost'),round=url.searchParams.get('round'),version=url.searchParams.get('version');
  if(round!==null&&(!/^\d+$/.test(round)||Number(round)>10000))fail(400,'Invalid light round');
  const filter=lesson&&round!==null;
  const rows=(await pool.query('SELECT id,lesson_id AS lesson,state,revision,completed_at AS "completedAt",updated_at AS at FROM light_learning_sessions WHERE user_id=$1'+(lesson?' AND lesson_id=$2':'')+(filter?" AND state->>'version'=$3 AND COALESCE((state->>'round')::int,0)=$4":'')+' ORDER BY updated_at DESC LIMIT '+(lesson?'1':'50'),filter?[user.id,lesson.id,version||lightVersion,Number(round)]:lesson?[user.id,lesson.id]:[user.id])).rows;
  send(res,200,lesson?{record:[lightVersion,legacyLightVersion].includes(rows[0]?.state?.version)?rows[0]:null}:{records:rows.filter(r=>[lightVersion,legacyLightVersion].includes(r.state.version))});return true;
 }
 if(req.method!=='PUT'||!lesson)fail(405,'Method not allowed');limited(req,'light-learning',120);
 const d=await json(req),activities=lightActivities(lesson,d?.state?.round||0,d?.state?.version);
 if(!activities.length||!d||typeof d.id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d.id)||!Number.isInteger(d.revision)||d.revision<0||!validLightState(activities,d.state)||(d.state.version===lightVersion&&(!Number.isInteger(d.state.round)||d.state.round<0||d.state.round>=lightRoundCount(lesson))))fail(400,'Invalid light practice');
 const state={version:d.state.version,...(d.state.version===lightVersion?{round:d.state.round}:{}),steps:d.state.steps.map(s=>({answer:s.answer,hint:s.hint})),choice:d.state.choice,hint:d.state.hint,checked:d.state.checked},complete=state.steps.length===activities.length;
 const rows=(await pool.query(`INSERT INTO light_learning_sessions(user_id,id,lesson_id,state,completed_at) VALUES($1,$2,$3,$4::jsonb,CASE WHEN $5 THEN now() END) ON CONFLICT(user_id,id) DO UPDATE SET state=EXCLUDED.state,revision=light_learning_sessions.revision+1,completed_at=EXCLUDED.completed_at,updated_at=now() WHERE light_learning_sessions.revision=$6 AND light_learning_sessions.lesson_id=EXCLUDED.lesson_id AND light_learning_sessions.completed_at IS NULL AND light_learning_sessions.state->>'version'=EXCLUDED.state->>'version' AND COALESCE((light_learning_sessions.state->>'round')::int,0)=COALESCE((EXCLUDED.state->>'round')::int,0) RETURNING id,lesson_id AS lesson,state,revision,completed_at AS "completedAt",updated_at AS at`,[user.id,d.id,lesson.id,JSON.stringify(state),complete,d.revision])).rows;
 if(!rows.length)fail(409,'Could not save light practice. Try again.');send(res,200,{record:rows[0]});return true;
}
