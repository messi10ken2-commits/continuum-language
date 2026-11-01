import {createHash} from 'node:crypto';
// Back off only failed provider credentials/model combinations. A corrected
// credential can recover immediately; no credential is logged or persisted.
export class SpeechProviderBackoff{
 constructor(now=Date.now){this.now=now;this.entries=new Map();}
 key(provider,credential,model){return createHash('sha256').update(JSON.stringify([provider,credential.trim(),model])).digest('hex');}
 remaining(provider,credential,model){const key=this.key(provider,credential,model),until=Math.max(this.entries.get(key)||0,this.entries.get(this.key(provider,credential,'*'))||0);if(until<=this.now()){this.entries.delete(key);return 0;}return Math.ceil((until-this.now())/1000);}
 fail(provider,credential,model,status,retryAfter=60){
  const seconds=[401,403].includes(status)?600:status===429?Math.max(1,Math.min(600,Number(retryAfter)||60)):status===404?60:status===408?30:[502,503,504].includes(status)?5:0;
  if(seconds){if(this.entries.size>=32)this.entries.delete(this.entries.keys().next().value);this.entries.set(this.key(provider,credential,status===401?'*':model),this.now()+seconds*1000);}
 }
}

// Shared by conversation recognition and speech: an invalid key is not retried
// for every model and every rally. Only opaque credential fingerprints are kept.
export const voiceProviderBackoff=new SpeechProviderBackoff();
