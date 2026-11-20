import {queueClassReminders,drainPushOutbox} from './push-api.mjs';
import {drainMailOutbox,mailSettings,checkGmailAuthorization} from './transactional-mail.mjs';
import {reconcileAppleDue} from './apple-store-api.mjs';
export async function runReadinessMaintenance(pool){
 const [mail,apple,push]=await Promise.allSettled([drainMailOutbox(pool),reconcileAppleDue(pool),(async()=>{await queueClassReminders(pool);return drainPushOutbox(pool)})()]);
 await pool.query('DELETE FROM account_recovery_tokens WHERE expires_at<now()');
 await pool.query("DELETE FROM mail_delivery_checks WHERE expires_at<now()-interval '30 days'");
 return {push:push.status==='fulfilled'?push.value:{failed:true},mail:mail.status==='fulfilled'?mail.value:{failed:true},apple:apple.status==='fulfilled'?apple.value:{failed:true}};
}
export function startReadinessMaintenance(pool,{intervalMs=60000}={}){
 if(process.env.READINESS_MAINTENANCE_ENABLED!=='true')return ()=>{};
 // Validate token renewal without sending mail or reading the Gmail inbox.
 if(mailSettings().provider==='gmail-api'&&mailSettings().configured)void checkGmailAuthorization().then(result=>console.info('Mail authorization check',JSON.stringify(result)));
 let busy=false,stopped=false;const run=async()=>{if(busy||stopped)return;busy=true;try{const result=await runReadinessMaintenance(pool);if(result.mail.failed||result.apple.failed||result.push.failed)console.warn('Readiness maintenance has pending retries',JSON.stringify({mail:result.mail.failures||{},apple:!!result.apple.failed,push:!!result.push.failed}))}catch{console.warn('Readiness maintenance is temporarily unavailable')}finally{busy=false}};
 const timer=setInterval(()=>void run(),intervalMs);timer.unref();return()=>{stopped=true;clearInterval(timer)};
}
