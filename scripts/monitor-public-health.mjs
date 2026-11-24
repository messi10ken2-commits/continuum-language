// External GitHub runner: no Railway/Gmail credentials or personal information.
const origin='https://continuum-language-production.up.railway.app';
for(const path of ['/api/health','/api/health/operations']){
 let healthy=false;
 // Allow a bounded rollout window when the workflow starts with a new deployment.
 for(let i=0;i<18&&!healthy;i++){
  try{const r=await fetch(origin+path,{redirect:'error',signal:AbortSignal.timeout(15000),headers:{'Cache-Control':'no-cache'}});healthy=r.ok&&(await r.json()).ok===true}catch{}
  if(!healthy&&i<17)await new Promise(resolve=>setTimeout(resolve,10000));
 }
 if(!healthy){console.error('CONTINUUM_PUBLIC_HEALTH_FAILED '+path);process.exit(1)}
}
console.log('CONTINUUM_PUBLIC_HEALTH_OK');
