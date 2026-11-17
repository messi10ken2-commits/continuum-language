import {readFile} from 'node:fs/promises';import assert from 'node:assert/strict';
const config=JSON.parse(await readFile('capacitor.config.json','utf8'));
assert.equal(config.webDir,'dist-native');assert.ok(!config.server.url);assert.ok(!config.server.cleartext);
assert.equal(config.appId,'com.continuum.language.dev');
const swift=await readFile('ios/App/App/AppDelegate.swift','utf8');assert.ok(swift.includes('kSecAttrAccessibleWhenUnlockedThisDeviceOnly'));assert.ok(swift.includes('registerPluginInstance(ContinuumNativePlugin())'));
const plist=await readFile('ios/App/App/Info.plist','utf8');assert.ok(plist.includes('NSMicrophoneUsageDescription'));assert.ok(!plist.includes('NSAllowsArbitraryLoads'));
const bridge=await readFile('ios/App/App/Base.lproj/Main.storyboard','utf8');assert.ok(bridge.includes('ContinuumViewController'));
console.log('PASS: bundled native configuration, Keychain registration, permissions and HTTPS policy. Xcode compilation requires macOS.');
