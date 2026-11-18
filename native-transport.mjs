import {validatedAPIOrigin} from './native-policy.mjs';
export function createNativeFetch({origin,fetchImpl,vault,onExpired=()=>{},timeout=45000,assetRoots=[],allowsAI=()=>false}){
 const apiOrigin=validatedAPIOrigin(origin);
 let account;
 return async(input,options)=>{
  const request=new Request(typeof input==='string'?new URL(input,globalThis.location?.href||'capacitor://localhost/'):input,options);
  const url=new URL(request.url),local=url.origin==='null'||url.protocol==='capacitor:';
  if(!(local&&url.pathname.startsWith('/api/'))&&!(url.origin===apiOrigin&&url.pathname.startsWith('/api/')))return fetchImpl(input,options);
  const headers=new Headers(request.headers);headers.set('X-Continuum-Client','ios');
  if(!['GET','HEAD'].includes(request.method)&&/^\/api\/(speaking|skills|patterns|speech)(?:\/|$)/.test(url.pathname)&&!url.pathname.endsWith('/activity')&&!allowsAI(account))return Response.json({error:'Allow AI services in Account > App settings before sending text or audio to OpenAI or Google Gemini.'},{status:403});
  const {token}=await vault.readSession({origin:apiOrigin});if(token)headers.set('Authorization','Bearer '+token);else headers.delete('Authorization');
  const target=apiOrigin+url.pathname+url.search;
  const response=await fetchImpl(new Request(target,request),{headers,credentials:'omit',redirect:'error',signal:AbortSignal.any([request.signal,AbortSignal.timeout(timeout)])});
  if(response.status===401&&!['/api/auth/login','/api/account/deletion-request'].includes(url.pathname)&&!/^\/api\/owner\/deletion-requests\/[a-f0-9-]{36}\/fulfil$/.test(url.pathname)){await vault.clearSession({origin:apiOrigin});onExpired();}
  if(response.ok&&url.pathname==='/api/auth/logout')await vault.clearSession({origin:apiOrigin});
  if(response.headers.get('content-type')?.includes('application/json')){
   let data=await response.json();
   if(url.pathname==='/api/auth/me'||['/api/auth/login','/api/auth/register'].includes(url.pathname))account=data.user?.id;
   if(url.pathname==='/api/auth/me'&&response.ok&&!data.user&&token){await vault.clearSession({origin:apiOrigin});onExpired();}
   if(url.pathname==='/api/auth/logout'&&response.ok)account=undefined;
   if(response.ok&&['/api/auth/login','/api/auth/register'].includes(url.pathname)){
    if(!data.sessionToken)throw Error('Native session support is not available on this backend yet');
    await vault.saveSession({token:data.sessionToken,origin:apiOrigin});delete data.sessionToken;
   }
   const mediaKey=/^(?:src|poster|url|images?|imageUrl|photo|thumbnail|audio|audioUrl|video|videoUrl|asset|modelUrl|background)$/i;
   const rewrite=(value,key='')=>typeof value==='string'&&mediaKey.test(key)&&(assetRoots.some(root=>value.startsWith('/'+root+'/'))||value.startsWith('/api/lesson-video/'))?apiOrigin+value:Array.isArray(value)?value.map(v=>rewrite(v,key)):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,rewrite(v,k)])):value;
   const responseHeaders=new Headers(response.headers);responseHeaders.delete('content-length');responseHeaders.delete('content-encoding');
   return new Response(JSON.stringify(rewrite(data)),{status:response.status,headers:responseHeaders});
  }
  return response;
 };
}
