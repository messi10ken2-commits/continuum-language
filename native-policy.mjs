// Pure policy shared by native build checks, transport and server tests.
export const nativeOrigins=new Set(['capacitor://localhost']);
export const defaultAPIOrigin='https://continuum-language-production.up.railway.app';
export function validatedAPIOrigin(value=defaultAPIOrigin){
 const url=new URL(value);
 if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw Error('Native API origin must be an HTTPS origin without a path or credentials');
 return url.origin;
}
export function nativeSessionRequest(req){return req.headers['x-continuum-client']==='ios'&&(!req.headers.origin||nativeOrigins.has(req.headers.origin));}
export function requestSessionToken(req){
 const bearer=/^Bearer ([A-Za-z0-9_-]{43})$/.exec(req.headers.authorization||'');
 if(bearer)return bearer[1];
 return (req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('continuum_session='))?.slice('continuum_session='.length);
}
export function handleNativeOrigin(req,res,route,fail){
 const origin=req.headers.origin;
 if(!nativeOrigins.has(origin))return false;
 res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
 if(req.method==='OPTIONS'){
  const headers=(req.headers['access-control-request-headers']||'').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
  if(headers.some(h=>!['authorization','content-type','x-continuum-client'].includes(h)))fail(403,'Unsupported native request header');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type, X-Continuum-Client');res.writeHead(204);res.end();return true;
 }
 if(!['GET','HEAD'].includes(req.method)&&!(/^Bearer [A-Za-z0-9_-]{43}$/.test(req.headers.authorization||'')||(['/api/auth/login','/api/auth/register'].includes(route)&&nativeSessionRequest(req))))fail(403,'Native writes require an authenticated bearer session');
 return false;
}
