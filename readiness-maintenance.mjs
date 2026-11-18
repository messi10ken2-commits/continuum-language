import {drainMailOutbox} from './transactional-mail.mjs';
import {reconcileAppleDue} from './apple-store-api.mjs';
export async function runReadinessMaintenance(pool){
 const [mail,apple]=await Promise.allSettled([drainMailOutbox(pool),reconcileAppleDue(pool)]);
 await pool.query('DELETE FROM account_recovery_tokens WHERE expires_at<now()');
 return {mail:mail.status==='fulfilled'?mail.value:{failed:true},apple:apple.status==='fulfilled'?apple.value:{failed:true}};
}
export function startReadinessMaintenance(pool,{intervalMs=60000}={}){
 if(process.env.READINESS_MAINTENANCE_ENABLED!=='true')return ()=>{};
 let busy=false,stopped=false;const run=async()=>{if(busy||stopped)return;busy=true;try{const result=await runReadinessMaintenance(pool);if(result.mail.failed||result.apple.failed)console.warn('Readiness maintenance has pending retries')}catch{console.warn('Readiness maintenance is temporarily unavailable')}finally{busy=false}};
 const timer=setInterval(()=>void run(),intervalMs);timer.unref();return()=>{stopped=true;clearInterval(timer)};
}
