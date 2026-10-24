// Account controls expose existing permissions; optional device media is browser-local.
export async function handlePrivacySettings({route,req,res,pool,required,json,send,fail}){
 if(route==='/api/privacy/settings'&&req.method==='GET'){
  const user=await required(req);
  if(user.role!=='learner'){send(res,200,{role:user.role,shareSelfLearning:null,patterns:[]});return true;}
  const [u,p]=await Promise.all([pool.query('SELECT share_self_learning FROM users WHERE id=$1',[user.id]),pool.query('SELECT language,enabled FROM learning_pattern_reports WHERE user_id=$1',[user.id])]);
  send(res,200,{role:user.role,shareSelfLearning:u.rows[0].share_self_learning,patterns:['en','es','pt','ja'].map(language=>({language,enabled:p.rows.some(r=>r.language===language&&r.enabled)}))});return true;
 }
 if(route==='/api/privacy/patterns'&&req.method==='DELETE'){
  const user=await required(req,'learner'),d=await json(req);if(d.language!=='all'&&!['en','es','pt','ja'].includes(d.language))fail(400,'Choose a supported language or all languages');
  await pool.query('UPDATE learning_pattern_reports SET enabled=false,report=NULL,fingerprint=NULL,request_token=NULL WHERE user_id=$1 AND ($2::text IS NULL OR language=$2)',[user.id,d.language==='all'?null:d.language]);send(res,200,{ok:true});return true;
 }
 return false;
}
