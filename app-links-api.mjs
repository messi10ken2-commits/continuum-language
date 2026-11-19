import {destinationFromURL} from './app-destinations.mjs';
export function appLinkSettings(env=process.env){
 try{const url=new URL(env.APP_LINK_ORIGIN||'https://continuum-language-production.up.railway.app');const valid=url.protocol==='https:'&&!url.username&&!url.password&&url.pathname==='/'&&!url.search&&!url.hash;
 const identifier=env.APPLE_APP_IDENTIFIER;const configured=valid&&/^[A-Z0-9]{10}\.[A-Za-z0-9][A-Za-z0-9.-]{2,180}$/.test(identifier||'');return {origin:url.origin,identifier,configured,enabled:configured&&env.APP_LINKS_ENABLED==='true'};}catch{return {configured:false,enabled:false};}
}
export function associationDocument(settings){if(!settings.enabled)throw Error('App association is not configured');return {applinks:{details:[{appIDs:[settings.identifier],components:[...['learn','practice','classes','account','support'].map(s=>({'/':'/app/'+s})),{'/':'/*',exclude:true}]}]}};}
export function handleAppAssociation(req,res,route,{env=process.env}={}){
 if(!['/.well-known/apple-app-site-association','/apple-app-site-association'].includes(route))return false;
 const settings=appLinkSettings(env);const status=!['GET','HEAD'].includes(req.method)?405:settings.enabled?200:404;
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':settings.enabled?'public, max-age=3600':'no-store'});
 if(req.method==='GET'||req.method==='HEAD'){res.end(req.method==='HEAD'?undefined:JSON.stringify(settings.enabled?associationDocument(settings):{error:'App association is not configured.'}));return true;}
 res.end(JSON.stringify({error:'Use GET or HEAD.'}));return true;
}
export {destinationFromURL};
