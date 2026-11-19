// Prepare a disposable signing copy from real identifiers. Never enables shipping flags.
import {cp,mkdtemp,readFile,writeFile,symlink,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join,resolve} from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
export async function prepareCapabilities({appIdentifier,teamId,origin,environment,root=fileURLToPath(new URL('../../',import.meta.url))}){
 if(!/^[A-Z0-9]{10}\.[A-Za-z0-9][A-Za-z0-9.-]{2,180}$/.test(appIdentifier||'')||!/^[A-Z0-9]{10}$/.test(teamId||''))throw Error('Use the actual full App Identifier and signing Team ID from Apple.');
 if(!['Sandbox','Production'].includes(environment))throw Error('Select Sandbox or Production explicitly.');
 const url=new URL(origin);if(url.protocol!=='https:'||url.username||url.password||url.port||url.pathname!=='/'||url.search||url.hash)throw Error('Use an approved HTTPS origin without path or port.');
 await access(join(root,'ios/App/App/public/index.html'));
 const directory=await mkdtemp(join(tmpdir(),'continuum-apple-capabilities-'));await cp(join(root,'ios'),join(directory,'ios'),{recursive:true,filter:p=>!/(^|\/)(build|DerivedData|xcuserdata)(\/|$)/.test(p)});await symlink(resolve(root,'node_modules'),join(directory,'node_modules'),'dir');
 const bundle=appIdentifier.slice(11),info=join(directory,'ios/App/App/Info.plist');let plist=await readFile(info,'utf8');
 if(!/<key>ContinuumRemotePushEnabled<\/key>\s*<false\s*\/>/.test(plist))throw Error('The source project must keep remote push disabled.');
 plist=plist.replace(/(<key>ContinuumRemotePushEnabled<\/key>\s*)<false\s*\/>/,'$1<true/>').replace(/(<key>ContinuumAPNSEnvironment<\/key>\s*<string>)[^<]+/,'$1'+environment);await writeFile(info,plist);
 const entitlement=`<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>aps-environment</key><string>${environment==='Production'?'production':'development'}</string><key>com.apple.developer.associated-domains</key><array><string>applinks:${url.hostname}</string></array></dict></plist>\n`;
 await writeFile(join(directory,'ios/App/App/Continuum.entitlements'),entitlement);
 const project=join(directory,'ios/App/App.xcodeproj'),pbx=join(project,'project.pbxproj');let source=await readFile(pbx,'utf8');source=source.replaceAll('PRODUCT_BUNDLE_IDENTIFIER = com.continuum.language.dev;',`CODE_SIGN_ENTITLEMENTS = App/Continuum.entitlements;\n\t\t\t\tDEVELOPMENT_TEAM = ${teamId};\n\t\t\t\tPRODUCT_BUNDLE_IDENTIFIER = ${bundle};`);source=source.replaceAll('PRODUCT_BUNDLE_IDENTIFIER = com.continuum.language.dev.UITests;',`PRODUCT_BUNDLE_IDENTIFIER = ${bundle}.UITests;`);await writeFile(pbx,source);
 return {directory,project,appIdentifier,teamId,bundle,origin:url.origin,environment,warning:'Requires Apple-enabled capabilities and a matching provisioning profile; signing and APNs/Universal Links validation are still required. The App Identifier prefix may differ from the signing Team ID.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{console.log(JSON.stringify(await prepareCapabilities({appIdentifier:process.env.APPLE_APP_IDENTIFIER,teamId:process.env.APPLE_SIGNING_TEAM_ID,origin:process.env.APP_LINK_ORIGIN,environment:process.env.APNS_ENVIRONMENT}),null,2))}catch(e){console.error(e.message);process.exitCode=1}}
