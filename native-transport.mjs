import {validatedAPIOrigin} from './native-policy.mjs';
export function createNativeFetch({origin,fetchImpl,vault,onExpired=()=>{},onAccount=()=>{},timeout=45000,assetRoots=[],allowsAI=()=>false}){
 const apiOrigin=validatedAPIOrigin(origin);
 let account;
 return async(input,options)=>{
  const url=new URL(typeof input==='string'?input:input.url||input,globalThis.location?.href||'capacitor://localhost/'),local=url.origin==='null'||url.protocol==='capacitor:';
  if(!(local&&url.pathname.startsWith('/api/'))&&!(url.origin===apiOrigin&&url.pathname.startsWith('/api/')))return fetchImpl(input,options);
  if(url.username||url.password)throw new TypeError('Request URL must not contain credentials');
  const target=apiOrigin+url.pathname+url.search;
  // Encode ordinary JSON/FormData directly for HTTPS. Materializing a body from
  // a capacitor-scheme Request can abort inside newer iOS WebKit before any bytes
  // reach the server. A same-URL Request clone preserves native body encoding.
  const direct=typeof input==='string'||input instanceof URL;
  const request=new Request(direct?target:input,options);
  const headers=new Headers(request.headers);headers.set('X-Continuum-Client','ios');
  if(!['GET','HEAD'].includes(request.method)&&/^\/api\/(speaking|skills|patterns|speech)(?:\/|$)/.test(url.pathname)&&!url.pathname.endsWith('/activity')&&!allowsAI(account))return Response.json({error:'Allow AI services in Account > App settings before sending text or audio to OpenAI or Google Gemini.'},{status:403});
  const {token}=await vault.readSession({origin:apiOrigin});if(token)headers.set('Authorization','Bearer '+token);else headers.delete('Authorization');
  const signal=AbortSignal.any([request.signal,AbortSignal.timeout(timeout)]);
  signal.throwIfAborted();
  let forwarded;
  if(direct||request.url===target)forwarded=new Request(request,{headers,signal});
  else{
   // A caller-supplied Request still needs retargeting. Consume its encoded body
   // once, retaining multipart boundaries and rejecting caller cancellation.
   const body=request.body===null?undefined:await request.blob();
   signal.throwIfAborted();
   forwarded=new Request(target,{method:request.method,headers,body,cache:request.cache,referrerPolicy:request.referrerPolicy,integrity:request.integrity,keepalive:request.keepalive,signal});
  }
  const response=await fetchImpl(forwarded,{headers,credentials:'omit',redirect:'error',signal});
  if(response.status===401&&!['/api/auth/login','/api/account/deletion-request','/api/owner/mail/test'].includes(url.pathname)&&!/^\/api\/owner\/deletion-requests\/[a-f0-9-]{36}\/fulfil$/.test(url.pathname)){await vault.clearSession({origin:apiOrigin});onExpired();onAccount(undefined);}
  if(response.ok&&url.pathname==='/api/auth/logout')await vault.clearSession({origin:apiOrigin});
  if(response.headers.get('content-type')?.includes('application/json')){
   let data=await response.json();
   if(url.pathname==='/api/auth/me'||['/api/auth/login','/api/auth/register'].includes(url.pathname))account=data.user?.id;
   if(url.pathname==='/api/auth/me'&&response.ok&&!data.user&&token){await vault.clearSession({origin:apiOrigin});onExpired();onAccount(undefined);}
   if(url.pathname==='/api/auth/logout'&&response.ok)account=undefined;
   if(response.ok&&['/api/auth/login','/api/auth/register'].includes(url.pathname)){
    if(!data.sessionToken)throw Error('Native session support is not available on this backend yet');
    await vault.saveSession({token:data.sessionToken,origin:apiOrigin});delete data.sessionToken;
   }
   if(response.ok&&['/api/auth/me','/api/auth/login','/api/auth/register','/api/auth/logout'].includes(url.pathname))onAccount(account);
   const mediaKey=/^(?:src|poster|url|images?|imageUrl|photo|thumbnail|audio|audioUrl|video|videoUrl|asset|modelUrl|background)$/i;
   const rewrite=(value,key='')=>typeof value==='string'&&mediaKey.test(key)&&(assetRoots.some(root=>value.startsWith('/'+root+'/'))||value.startsWith('/api/lesson-video/'))?apiOrigin+value:Array.isArray(value)?value.map(v=>rewrite(v,key)):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,rewrite(v,k)])):value;
   const responseHeaders=new Headers(response.headers);responseHeaders.delete('content-length');responseHeaders.delete('content-encoding');
   return new Response(JSON.stringify(rewrite(data)),{status:response.status,headers:responseHeaders});
  }
  return response;
 };
}
