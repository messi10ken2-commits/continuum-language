import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {publicDocuments,renderPublicDocument,supportEmail} from './public-documents.mjs';
import {readMediaPreference,saveMediaPreference,mediaPreferenceKey} from './media-privacy.mjs';
test('privacy preference is opt-in, strictly validated, persistent and safe on broken storage',()=>{
 const map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};assert.equal(readMediaPreference(storage),false);for(const value of ['bad','{}','{"externalMedia":"true"}','{"externalMedia":1}']){map.set(mediaPreferenceKey,value);assert.equal(readMediaPreference(storage),false)}saveMediaPreference(true,storage);assert.equal(readMediaPreference(storage),true);saveMediaPreference(false,storage);assert.equal(readMediaPreference(storage),false);assert.throws(()=>saveMediaPreference('yes',storage));assert.equal(readMediaPreference({getItem(){throw Error('blocked')}}),false);assert.throws(()=>saveMediaPreference(true,{setItem(){throw Error('blocked')}}));
});
test('documents explain actual features and public contact without copying the reference service',async()=>{
 for(const page of Object.keys(publicDocuments)){const html=renderPublicDocument(page);assert.ok(html.includes(supportEmail));assert.ok(!/Busuu|Chegg|08172044|guaranteed GDPR compliant/.test(html));assert.ok(html.includes('lang="en"'));assert.ok(html.includes('Terms of Service'));}assert.equal(renderPublicDocument('bad'),null);
 const css=await readFile('styles.css','utf8');assert.ok(!css.includes('fonts.googleapis.com'));assert.ok(css.includes('/fonts/dm-sans-latin-wght-normal.woff2'));
 for(const family of ['dm-sans','manrope']){assert.ok((await readFile('public/fonts/'+family+'-latin-wght-normal.woff2')).length>1000);assert.ok((await readFile('public/fonts/'+family+'-LICENSE.txt','utf8')).includes('SIL OPEN FONT LICENSE'));}
});
