// Explicit operator tool for one synthetic review learner. No secrets are printed or saved.
import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
export async function prepareReviewAccount({origin,email,password,fetchImpl=fetch}){
 const target=new URL(origin);if(target.protocol!=='https:'||target.username||target.password||target.pathname!=='/'||target.search||target.hash)throw Error('Use the exact approved HTTPS review-backend origin.');
 if(typeof email!=='string'||! /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)||typeof password!=='string'||password.length<24)throw Error('Supply a dedicated reviewer email and a secret random password of at least 24 characters.');
 let token;
 const request=async(path,body)=>{const response=await fetchImpl(target.origin+'/api'+path,{method:path==='/profile'?'PUT':'POST',headers:{'Content-Type':'application/json',Origin:'capacitor://localhost','X-Continuum-Client':'ios',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body),redirect:'error',signal:AbortSignal.timeout(45000)});if(!response.ok)throw Error('Review setup failed at '+path+' (HTTP '+response.status+'). Check the approved target/account without logging credentials.');return response.json()};
 try{
  const created=await request('/auth/register',{name:'Alex',email,password,role:'learner',adult:true});token=created.sessionToken;if(!/^[A-Za-z0-9_-]{43}$/.test(token||''))throw Error('Review backend did not issue a native session.');
  await request('/profile',{profile:{name:'Alex',languages:['es'],primaryLanguage:'es',level:'A1',startMode:'manual',goal:'Everyday communication'}});
  return {created:true,role:'learner',profileReady:true,warning:'Only a basic synthetic learner was created. Verify external login, actual shipping features and any class/paid demo needs before submission. Enter the password separately in the approved review secret field.'};
 }finally{if(token)await request('/auth/logout',{}).catch(()=>{})}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{if(!process.argv.includes('--create'))throw Error('Use --create only after selecting the approved review backend and secret credentials.');console.log(JSON.stringify(await prepareReviewAccount({origin:process.env.REVIEW_PROVISION_ORIGIN,email:process.env.REVIEW_PROVISION_EMAIL,password:process.env.REVIEW_PROVISION_PASSWORD}),null,2))}catch(e){console.error(e.message);process.exitCode=1}}
