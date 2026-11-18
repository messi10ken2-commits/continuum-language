import {handleErasureOwner,erasurePolicy} from './account-erasure.mjs';
import {passwordMatches} from './password-security.mjs';import {billingTransaction} from './billing-api.mjs';
// An authenticated, idempotent in-app request, fulfilled through the existing
// operator Support queue. This does not pretend to have erased retained records.
export async function handleNativeAccount({route,req,res,pool,required,json,send,fail,limited}){
 if(await handleErasureOwner({route,req,res,pool,required,json,send,fail,limited}))return true;
 if(route!=='/api/account/deletion-request')return false;
 if(req.method==='GET'){const user=await required(req);const request=(await pool.query('SELECT id,status,requested_at AS \"requestedAt\",processing_days AS \"processingDays\" FROM account_deletion_requests WHERE user_id=$1',[user.id])).rows[0];send(res,200,{request:request||null,processingDays:erasurePolicy().days,retentionDays:erasurePolicy().configured?erasurePolicy().retentionDays:null});return true;}
 if(req.method!=='POST')fail(405,'Use GET or POST.');
 const user=await required(req);limited(req,'account-delete',4);const data=await json(req);
 if(data.confirm!==true||typeof data.password!=='string'||data.password.length>128)fail(400,'Confirm deletion and enter your password');
 const row=(await pool.query('SELECT password_hash FROM users WHERE id=$1',[user.id])).rows[0];
 if(!await passwordMatches(data.password,row?.password_hash))fail(401,'Email or password is incorrect');
 const ticket=await billingTransaction(pool,async c=>{
  const key='account-deletion-'+user.id;
  const r=await c.query("INSERT INTO support_tickets(user_id,subject,category,client_key) VALUES($1,'Account deletion request','account',$2) ON CONFLICT(user_id,client_key) DO UPDATE SET updated_at=support_tickets.updated_at RETURNING id",[user.id,key]);
  await c.query("INSERT INTO support_messages(ticket_id,author_id,body,client_key) VALUES($1,$2,$3,$4) ON CONFLICT(author_id,client_key) DO NOTHING",[r.rows[0].id,user.id,'I confirm my request to delete my Continuum account and personal learning data. Please confirm the processing time, any legally retained transaction records and completion. I understand store subscriptions must be cancelled separately.',key]);const policy=erasurePolicy();await c.query('INSERT INTO account_deletion_requests(user_id,ticket_id,policy_version,processing_days) VALUES($1,$2,$3,$4) ON CONFLICT(user_id) DO NOTHING',[user.id,r.rows[0].id,policy.configured?policy.version:null,policy.days]);return r.rows[0].id;
 });send(res,200,{requested:true,ticketId:ticket,status:'awaiting_operator_fulfilment'});return true;
}
