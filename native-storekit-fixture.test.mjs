import test from 'node:test';import assert from 'node:assert/strict';import {readFile,rm,access} from 'node:fs/promises';
import {prepareLocalStoreKit} from './docs/ios/prepare-local-storekit.mjs';
test('local StoreKit copy isolates test flags, preserves shipping configuration and never permits archiving',async t=>{
 const shipping='ios/App/App/Info.plist',before=await readFile(shipping,'utf8');let prepared;
 try{await access('ios/App/App/public/index.html')}catch{return t.skip('Run ios:sync to generate the native web assets first');}// generated assets are absent until ios:sync on a clean backend-only checkout
 try{
  prepared=await prepareLocalStoreKit();assert.equal(await readFile(shipping,'utf8'),before);
  const copied=await readFile(prepared.directory+'/ios/App/App/Info.plist','utf8');assert.match(copied,/<key>ContinuumLocalStoreKitTesting<\/key><true\/>/);
  const scheme=await readFile(prepared.directory+'/ios/App/App.xcodeproj/xcshareddata/xcschemes/App-Local-StoreKit.xcscheme','utf8');assert.ok(scheme.includes('StoreKitConfigurationFileReference'));assert.ok(!scheme.includes('buildForArchiving="YES"'));
  const config=JSON.parse(await readFile(prepared.directory+'/ios/App/App/ContinuumLocalTesting.storekit','utf8'));assert.deepEqual(config.subscriptionGroups[0].subscriptions.map(s=>s.productID),['com.continuum.premium.monthly','com.continuum.premium.yearly']);assert.ok(config.subscriptionGroups[0].subscriptions.every(s=>s.familyShareable===false));
 }finally{if(prepared)await rm(prepared.directory,{recursive:true,force:true})}
});
