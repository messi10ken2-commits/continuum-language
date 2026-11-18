// Ephemeral synthetic certificates. No production Apple keys or accounts.
import {generateKeyPairSync,sign,X509Certificate} from 'node:crypto';
import {mkdtempSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {execFileSync} from 'node:child_process';
export function syntheticAppleSigner(){
 const dir=mkdtempSync(join(tmpdir(),'continuum-apple-jws-'));
 const run=args=>execFileSync('openssl',args,{cwd:dir,stdio:'ignore'});
 try{
  for(const name of ['root','intermediate','leaf']){const {privateKey}=generateKeyPairSync('ec',{namedCurve:'prime256v1'});writeFileSync(join(dir,name+'.key'),privateKey.export({format:'pem',type:'pkcs8'}),{mode:0o600});}
  run(['req','-new','-x509','-key','root.key','-out','root.pem','-days','2','-subj','/CN=Continuum Synthetic Root','-addext','basicConstraints=critical,CA:TRUE','-addext','keyUsage=critical,keyCertSign,cRLSign']);
  for(const name of ['intermediate','leaf'])run(['req','-new','-key',name+'.key','-out',name+'.csr','-subj','/CN=Continuum Synthetic '+name]);
  writeFileSync(join(dir,'intermediate.ext'),'basicConstraints=critical,CA:TRUE,pathlen:0\nkeyUsage=critical,keyCertSign,cRLSign\n1.2.840.113635.100.6.2.1=DER:05:00\n');
  writeFileSync(join(dir,'leaf.ext'),'basicConstraints=critical,CA:FALSE\nkeyUsage=critical,digitalSignature\n1.2.840.113635.100.6.11.1=DER:05:00\n');
  run(['x509','-req','-in','intermediate.csr','-CA','root.pem','-CAkey','root.key','-CAcreateserial','-out','intermediate.pem','-days','2','-extfile','intermediate.ext']);
  run(['x509','-req','-in','leaf.csr','-CA','intermediate.pem','-CAkey','intermediate.key','-CAcreateserial','-out','leaf.pem','-days','2','-extfile','leaf.ext']);
  const roots=[new X509Certificate(readFileSync(join(dir,'root.pem'))).raw],key=readFileSync(join(dir,'leaf.key'));
  const x5c=['leaf','intermediate','root'].map(name=>new X509Certificate(readFileSync(join(dir,name+'.pem'))).raw.toString('base64'));
  return {roots,jws(payload){const h=Buffer.from(JSON.stringify({alg:'ES256',x5c})).toString('base64url'),p=Buffer.from(JSON.stringify(payload)).toString('base64url'),message=h+'.'+p;return message+'.'+sign('sha256',Buffer.from(message),{key,dsaEncoding:'ieee-p1363'}).toString('base64url')}};
 }finally{rmSync(dir,{recursive:true,force:true})}
}
