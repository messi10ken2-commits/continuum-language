import test from 'node:test';import assert from 'node:assert/strict';
import {appDestination,destinationFromURL,destinationURL,queueAppDestination,pendingAppDestination,consumeAppDestination,clearAppDestination} from './app-destinations.mjs';
import {appLinkSettings,associationDocument} from './app-links-api.mjs';
const origin='https://app.example.test',threadId='11111111-1111-4111-8111-111111111111';
test('app links allow only configured hosts and credential-free, typed destinations',()=>{
 const d={section:'classes',threadId,language:'ja'};assert.deepEqual(destinationFromURL(destinationURL(d,origin),{origin}),d);
 for(const value of [origin+'/app/admin',origin+'/app/classes?token=secret',origin+'/app/classes?language=ja&language=en',origin+'/app/classes?threadId=nope','https://app.example.test.evil.test/app/classes',origin+'/app/%2e%2e/admin',origin+'/app/classes#secret','https://a:b@app.example.test/app/classes'])assert.equal(destinationFromURL(value,{origin}),null,value);
 assert.equal(appDestination({section:'learn',userId:threadId}),null);assert.equal(appDestination({section:'account',lessonId:'en-a1-lesson-1'}),null);
 assert.deepEqual(destinationFromURL('continuum-dev://open?section=learn&lessonId=en-a1-lesson-1',{origin,development:true}),{section:'learn',lessonId:'en-a1-lesson-1'});
 assert.equal(destinationFromURL('continuum-dev://open?section=learn',{origin}),null);
});
test('link creation rejects credential-bearing origins',()=>{assert.throws(()=>destinationURL({section:'learn'},'https://user:pass@example.test'));});
test('a pending tap survives the authentication wait but is consumed only once and cleared on logout',()=>{clearAppDestination();assert.equal(queueAppDestination({section:'classes',threadId}),true);assert.deepEqual(pendingAppDestination(),{section:'classes',threadId});assert.deepEqual(consumeAppDestination(),{section:'classes',threadId});assert.equal(consumeAppDestination(),null);queueAppDestination({section:'learn'});clearAppDestination();assert.equal(pendingAppDestination(),null);});
test('AASA defaults off and never invents an app identity',()=>{assert.equal(appLinkSettings({}).enabled,false);const settings=appLinkSettings({APP_LINK_ORIGIN:origin,APPLE_APP_IDENTIFIER:'TESTTEAM01.com.example.app',APP_LINKS_ENABLED:'true'});assert.equal(settings.enabled,true);const a=associationDocument(settings);assert.deepEqual(a.applinks.details[0].appIDs,['TESTTEAM01.com.example.app']);assert.equal(a.applinks.details[0].components.at(-1).exclude,true);assert.equal(appLinkSettings({APP_LINK_ORIGIN:'http://bad.test',APPLE_APP_IDENTIFIER:'TESTTEAM01.com.example.app',APP_LINKS_ENABLED:'true'}).enabled,false);});
