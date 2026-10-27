import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {companions} from './adventure-model.mjs';
import {companionKeepsake} from './passport-keepsakes.mjs';
test('celebration keepsakes use earned finale, companion, and learning language',async()=>{
 const expected={es:['Barcelona','0% 0%'],en:['London','100% 0%'],pt:['Rio de Janeiro','0% 100%'],ja:['Kyoto','100% 100%']};
 for(const kind of companions)for(const [lang,[city,position]] of Object.entries(expected)){
  assert.equal(companionKeepsake(kind,lang,{finale:false}),null);
  const photo=companionKeepsake(kind,lang,{finale:true});
  assert.equal(photo.city,city);assert.equal(photo.position,position);
  await access(new URL('./public'+photo.src,import.meta.url));
  const data=await readFile(new URL('./public'+photo.src,import.meta.url));
  assert.equal(data.subarray(0,4).toString(),'RIFF');assert.equal(data.subarray(8,12).toString(),'WEBP');
 }
 assert.equal(companionKeepsake('../other','es',{finale:true}),null);
 assert.equal(companionKeepsake('cat','fr',{finale:true}),null);
});
