const periods=[1,7,30];
const tracked=['conversation','focused-speaking','focused-writing','cefr-assessment','skill-assessment'];
const empty=()=>({used:0,calls:0,unknown:0,cost:null});
const combine=(row,event)=>{
 row.used+=event.used;
 row.calls+=event.calls;
 row.unknown+=event.unknown;
 if(event.cost!=null)row.cost=(row.cost??0)+Number(event.cost);
};
const aggregate=`
 SELECT day::text AS day,tier,feature,sum(used)::int AS used,sum(calls)::int AS calls,sum(unknown)::int AS unknown,sum(cost)::float8 AS cost
 FROM (
  SELECT day,tier,feature,count(*)::int AS used,0 AS calls,0 AS unknown,NULL::numeric AS cost
  FROM ai_operations WHERE completed_at IS NOT NULL AND day>=(now() AT TIME ZONE 'UTC')::date-29
  GROUP BY day,tier,feature
  UNION ALL
  SELECT (created_at AT TIME ZONE 'UTC')::date,coalesce(tier,'unattributed'),feature,0,count(*)::int,
   count(*) FILTER (WHERE estimated_usd IS NULL)::int,sum(estimated_usd)
  FROM ai_provider_calls WHERE created_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'-interval '29 days'
  GROUP BY 1,2,3
 ) totals GROUP BY day,tier,feature ORDER BY day`;
const userStats=`
 , activity AS (
  SELECT user_id,(created_at AT TIME ZONE 'UTC')::date AS day,feature,0 AS used,
   count(*)::int AS calls,count(*) FILTER (WHERE estimated_usd IS NULL)::int AS unknown,sum(estimated_usd) AS cost
  FROM ai_provider_calls WHERE user_id IS NOT NULL AND created_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'-interval '29 days'
  GROUP BY 1,2,3
  UNION ALL
  SELECT user_id,day,feature,count(*)::int,0,0,NULL::numeric FROM ai_operations
  WHERE completed_at IS NOT NULL AND day>=(now() AT TIME ZONE 'UTC')::date-29 GROUP BY 1,2,3
 ), totals AS (
  SELECT user_id,
   sum(used) FILTER (WHERE feature='conversation' AND day>=(now() AT TIME ZONE 'UTC')::date-($1::int-1))::int AS conversations,
   sum(used) FILTER (WHERE feature='focused-writing' AND day>=(now() AT TIME ZONE 'UTC')::date-($1::int-1))::int AS writing,
   sum(used) FILTER (WHERE feature='focused-speaking' AND day>=(now() AT TIME ZONE 'UTC')::date-($1::int-1))::int AS speaking,
   sum(cost) FILTER (WHERE day=(now() AT TIME ZONE 'UTC')::date)::float8 AS today,
   sum(cost) FILTER (WHERE day>=(now() AT TIME ZONE 'UTC')::date-6)::float8 AS week,
   sum(cost)::float8 AS month,
   sum(unknown) FILTER (WHERE day>=(now() AT TIME ZONE 'UTC')::date-($1::int-1))::int AS unknown,
   sum(cost) FILTER (WHERE feature IN ('focused-writing','focused-speaking') AND day>=(now() AT TIME ZONE 'UTC')::date-($1::int-1))::float8 AS evaluation_cost
  FROM activity GROUP BY user_id
 )
 SELECT p.id,p.name,p.tier,t.conversations,t.writing,t.speaking,t.today,t.week,t.month,t.unknown,t.evaluation_cost
 FROM totals t JOIN plans p ON p.id=t.user_id
 ORDER BY (CASE $1::int WHEN 1 THEN t.today WHEN 7 THEN t.week ELSE t.month END) DESC NULLS LAST,
  coalesce(t.conversations,0)+coalesce(t.writing,0)+coalesce(t.speaking,0) DESC,p.id LIMIT 50 OFFSET $2`;
const activeSQL=`
 SELECT count(DISTINCT user_id)::int AS count FROM (
  SELECT user_id FROM ai_provider_calls WHERE created_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'-(($1::int-1)*interval '1 day')
  UNION SELECT user_id FROM ai_operations WHERE completed_at IS NOT NULL AND day>=(now() AT TIME ZONE 'UTC')::date-($1::int-1)
 ) a`;
const numberSetting=(key,fallback)=>{
 const value=Number(process.env[key]);return Number.isFinite(value)&&value>0?value:fallback;
};
async function alerts(pool){
 const evaluationBurst=numberSetting('AI_ALERT_EVALUATIONS_HOURLY',20);
 const failureBurst=numberSetting('AI_ALERT_FAILURES_HOURLY',8);
 const quotaBurst=numberSetting('AI_ALERT_QUOTA_DENIALS_HOURLY',12);
 const highEvaluation=numberSetting('AI_ALERT_EVALUATION_USD',.15);
 const userFloor=numberSetting('AI_ALERT_USER_DAY_USD',.75);
 const modelFloor=numberSetting('AI_ALERT_MODEL_DAY_USD',3);
 const spikeFactor=numberSetting('AI_ALERT_SPIKE_FACTOR',4);
 const [hourly,denials,costly,spikes,resolutions]=await Promise.all([
  pool.query(`SELECT user_id,feature,date_trunc('hour',created_at) AS at,
   count(DISTINCT operation_id)::int AS evaluations,count(*) FILTER (WHERE NOT success AND finished_at IS NOT NULL)::int AS failures,
   sum(estimated_usd)::float8 AS cost FROM ai_provider_calls
   WHERE user_id IS NOT NULL AND created_at>=now()-interval '24 hours'
   GROUP BY 1,2,3 HAVING count(DISTINCT operation_id)>=$1 OR count(*) FILTER (WHERE NOT success AND finished_at IS NOT NULL)>=$2`,[evaluationBurst,failureBurst]),
  pool.query('SELECT * FROM ai_quota_denials WHERE hour>=now()-interval \'24 hours\' AND attempts>=$1',[quotaBurst]),
  pool.query(`SELECT user_id,feature,request_id,max(created_at) AS at,sum(estimated_usd)::float8 AS cost
   FROM ai_provider_calls WHERE feature IN ('focused-writing','focused-speaking','cefr-assessment','skill-assessment')
   AND created_at>=now()-interval '24 hours' GROUP BY 1,2,3 HAVING sum(estimated_usd)>=$1`,[highEvaluation]),
  pool.query(`SELECT 'user' AS kind,user_id::text AS target,(created_at AT TIME ZONE 'UTC')::date::text AS day,sum(estimated_usd)::float8 AS cost,max(created_at) AS at
   FROM ai_provider_calls WHERE user_id IS NOT NULL AND created_at>=now()-interval '8 days' AND estimated_usd IS NOT NULL GROUP BY 2,3
   UNION ALL SELECT 'model',provider||':'||model,(created_at AT TIME ZONE 'UTC')::date::text,sum(estimated_usd)::float8,max(created_at)
   FROM ai_provider_calls WHERE created_at>=now()-interval '8 days' AND estimated_usd IS NOT NULL GROUP BY 2,3`),
  pool.query("SELECT alert_key,resolved_at FROM ai_alert_resolutions WHERE resolved_at>=now()-interval '30 days'")
 ]);
 const list=[],today=new Date().toISOString().slice(0,10);
 const add=(kind,target,feature,at,value,threshold,unit,risk,cost=null,group=at.toISOString())=>{
  const key=[kind,target,feature,group].join('|');
  list.push({key,kind,target,feature,at,value,threshold,unit,risk,cost,resolvedAt:resolutions.rows.find(r=>r.alert_key===key)?.resolved_at??null});
 };
 for(const row of hourly.rows){
  if(tracked.includes(row.feature)&&row.feature!=='conversation'&&row.evaluations>=evaluationBurst)add('Evaluation burst',row.user_id,row.feature,row.at,row.evaluations,evaluationBurst,'evaluations','warning',row.cost);
  if(row.failures>=failureBurst)add('Repeated provider failures',row.user_id,row.feature,row.at,row.failures,failureBurst,'calls','warning',row.cost);
 }
 for(const row of denials.rows)add('Repeated quota denials',row.user_id,row.bucket,row.hour,row.attempts,quotaBurst,'requests','warning');
 for(const row of costly.rows)add('High evaluation cost',row.user_id??'unattributed',row.feature,row.at,row.cost,highEvaluation,'USD','high',row.cost,row.request_id);
 const series=new Map();
 for(const row of spikes.rows){const key=row.kind+'|'+row.target;const previous=series.get(key)??[];previous.push(row);series.set(key,previous);}
 for(const days of series.values()){
  const current=days.find(row=>row.day===today);
  if(!current)continue;
  const baseline=days.filter(row=>row!==current);
  const floor=current.kind==='model'?modelFloor:userFloor;
  const threshold=baseline.length>=3?Math.max(floor,baseline.reduce((n,row)=>n+row.cost,0)/baseline.length*spikeFactor):floor;
  if(current.cost>=threshold)add(current.kind==='model'?'Model cost spike':'User cost spike',current.target,current.kind,current.at,current.cost,threshold,'USD','high',current.cost,today);
 }
 return list.sort((a,b)=>b.at-a.at).slice(0,100);
}
export async function handleAIOwner({route,req,res,pool,user,json,send,fail,limited,accessSQL}){
 if(route==='/api/owner/ai-usage'&&req.method==='GET'){
  limited(req,'owner-ai-usage',60);
  const params=new URL(req.url,'http://localhost').searchParams,days=Number(params.get('days')??7),offset=Number(params.get('offset')??0);
  if(!periods.includes(days)||!Number.isInteger(offset)||offset<0||offset>10000)fail(400,'Choose a valid reporting period.');
  const [data,users,active,detected,models]=await Promise.all([
   pool.query(aggregate),pool.query(accessSQL+userStats,[days,offset]),pool.query(activeSQL,[days]),alerts(pool),
   pool.query(`SELECT provider,model,stage,count(*)::int AS calls,count(*) FILTER (WHERE NOT success AND finished_at IS NOT NULL)::int AS failures,
    count(*) FILTER (WHERE estimated_usd IS NULL)::int AS unknown,sum(estimated_usd)::float8 AS cost,
    sum((usage->>'input')::bigint)::float8 AS input,sum((usage->>'output')::bigint)::float8 AS output,
    sum((usage->>'audioInput')::bigint)::float8 AS "audioInput",sum((usage->>'audioOutput')::bigint)::float8 AS "audioOutput"
    FROM ai_provider_calls WHERE created_at>=date_trunc('day',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'-(($1::int-1)*interval '1 day')
    GROUP BY 1,2,3 ORDER BY cost DESC NULLS LAST,calls DESC LIMIT 60`,[days])
  ]);
  const since=period=>new Date(Date.now()-(period-1)*86400000).toISOString().slice(0,10);
  const byPeriod=Object.fromEntries(periods.map(period=>[period,empty()]));
  const features={},tiers={},trend=Object.fromEntries(Array.from({length:days},(_,index)=>[since(days-index),empty()]));
  for(const row of data.rows){
   const day=row.day;
   for(const period of periods)if(day>=since(period))combine(byPeriod[period],row);
   if(day<since(days))continue;
   combine(features[row.feature]??=empty(),row);
   combine(tiers[row.tier]??=empty(),row);
   combine(trend[day]??=empty(),row);
  }
  send(res,200,{days,offset,byPeriod,features,tiers,trend,users:users.rows,alerts:detected,models:models.rows,activeUsers:active.rows[0].count});return true;
 }
 if(route==='/api/owner/ai-usage/resolve'&&req.method==='POST'){
  limited(req,'owner-ai-resolve',60);
  const {key}=await json(req);
  if(typeof key!=='string'||key.length>300||!(await alerts(pool)).some(item=>item.key===key))fail(400,'Choose an existing AI usage alert.');
  await pool.query('INSERT INTO ai_alert_resolutions(alert_key,resolved_by) VALUES($1,$2) ON CONFLICT DO NOTHING',[key,user.id]);
  send(res,200,{ok:true});return true;
 }
 return false;
}
