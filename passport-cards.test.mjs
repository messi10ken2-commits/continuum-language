import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {passportCards} from './passport-cards.mjs';
import catalog from './public/passport-real/catalog.json' with {type:'json'};
import art from './public/passport-stamps/manifest.json' with {type:'json'};
test('every recovered real photo appears for its earned chapter with original earned date',()=>{
 assert.ok(catalog.length>0);const used=new Set();
 for(const language of ['es','en','pt','ja']){
  const stamps=Object.keys(art).filter(k=>k.startsWith(language+':')).map(k=>({id:k.slice(language.length+1),at:'2026-09-23T12:00:00Z'}));
  const cards=passportCards(stamps,language);assert.equal(new Set(cards.map(c=>c.key)).size,cards.length);
  for(const c of cards){assert.equal(c.at,'2026-09-23T12:00:00Z');if(c.photo){assert.equal(c.photo.language,language);assert.equal(c.scene,undefined);if(!c.photo.id.startsWith('regional:'))used.add(c.photo.id)}}
  assert.deepEqual(passportCards([],language),[]);
 }
 assert.equal(used.size,['es','en','pt','ja'].reduce((n,l)=>n+new Set(catalog.filter(p=>p.language===l).map(p=>p.sha256||p.credit.source)).size,0));
});
test('photo bytes and Commons attribution are retained',async()=>{
 for(const p of catalog){assert.match(p.credit.source,/^https:\/\/commons.wikimedia.org\//);assert.ok(p.credit.author);assert.match(p.credit.license,/CC BY|CC0|public domain|PDM/i);assert.ok(!/NC|ND/.test(p.credit.license));const bytes=await readFile(new URL('./public'+p.src,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),p.sha256)}
});

test('locked album is stable and deduplicated before or after earning chapters',()=>{for(const l of ['es','en','pt','ja']){const locked=passportCards([],l,{includeLocked:true});assert.ok(locked.length>0);assert.ok(locked.every(c=>c.locked&&!c.at));const stamps=Object.keys(art).filter(k=>k.startsWith(l+':')).map(k=>({id:k.slice(l.length+1),at:'2026-09-23T12:00:00Z'}));const earned=passportCards(stamps,l,{includeLocked:true});assert.deepEqual(earned.map(c=>c.key),locked.map(c=>c.key));const pictures=earned.map(c=>c.photo?(c.photo.sha256||c.photo.src):c.scene.src+c.scene.position);assert.equal(new Set(pictures).size,pictures.length);assert.ok(earned.every(c=>!c.locked&&c.at));assert.ok(earned.every(c=>c.photo||c.scene));}});
