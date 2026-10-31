import {createHash} from 'node:crypto';
// Back off only failed provider credentials/model combinations. A corrected
// credential can recover immediately; no credential is logged or persisted.
export class SpeechProviderBackoff{
 constructor(now=Date.now){this.now=now;this.entries=new Map();}
 key(provider,credential,model){return createHash('sha256').update(JSON.stringify([provider,credential.trim(),model])).digest('hex');}
 remaining(provider,credential,model){const key=this.key(provider,credential,model),until=this.entries.get(key)||0;if(until<=this.now()){this.entries.delete(key);return 0;}return Math.ceil((until-this.now())/1000);}
 fail(provider,credential,model,status,retryAfter=60){
  const seconds=[401,403].includes(status)?600:status===429?Math.max(1,Math.min(600,Number(retryAfter)||60)):0;
  if(seconds){if(this.entries.size>=32)this.entries.delete(this.entries.keys().next().value);this.entries.set(this.key(provider,credential,model),this.now()+seconds*1000);}
 }
}
