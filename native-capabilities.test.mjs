import test from 'node:test';import assert from 'node:assert/strict';import {readFile,rm,access} from 'node:fs/promises';import {prepareCapabilities} from './docs/ios/prepare-capabilities.mjs';
test('capability preparation validates real-identity shape and isolates entitlements in a disposable project',async t=>{
 await assert.rejects(prepareCapabilities({}),/actual full App Identifier/);
 const identity={appIdentifier:'TESTPREFIX.com.fixture.language',teamId:'TESTTEAM01',origin:'https://fixture.example.test',environment:'Sandbox'};
 await assert.rejects(prepareCapabilities({...identity,origin:'http://fixture.example.test'}),/HTTPS/);
 try{await access('ios/App/App/public/index.html')}catch{return t.skip('Run ios:sync before provisioning-copy tests');}
 const before=await readFile('ios/App/App/Info.plist','utf8');let result;
 try{result=await prepareCapabilities(identity);assert.equal(await readFile('ios/App/App/Info.plist','utf8'),before);const copy=await readFile(result.directory+'/ios/App/App/Info.plist','utf8'),entitlement=await readFile(result.directory+'/ios/App/App/Continuum.entitlements','utf8'),project=await readFile(result.project+'/project.pbxproj','utf8');assert.match(copy,/<key>ContinuumRemotePushEnabled<\/key>\s*<true\/>/);assert.ok(entitlement.includes('<string>development</string>'));assert.ok(entitlement.includes('applinks:fixture.example.test'));assert.ok(project.includes('DEVELOPMENT_TEAM = TESTTEAM01;'));assert.ok(project.includes('PRODUCT_BUNDLE_IDENTIFIER = com.fixture.language;'));assert.ok(!project.includes('PRODUCT_BUNDLE_IDENTIFIER = TESTPREFIX.'));}finally{if(result)await rm(result.directory,{recursive:true,force:true})}
});
