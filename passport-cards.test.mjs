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
 assert.equal(used.size,catalog.length);
});
test('photo bytes and Commons attribution are retained',async()=>{
 for(const p of catalog){assert.match(p.credit.source,/^https:\/\/commons.wikimedia.org\//);assert.ok(p.credit.author);assert.match(p.credit.license,/CC BY|CC0|public domain|PDM/i);assert.ok(!/NC|ND/.test(p.credit.license));const bytes=await readFile(new URL('./public'+p.src,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),p.sha256)}
});
