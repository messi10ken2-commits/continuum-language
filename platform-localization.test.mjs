import assert from 'node:assert/strict';
import test from 'node:test';
import {reviewedTranslation} from './reviewed-interface-copy.mjs';
test('illustrated navigation and lesson tools have offline reviewed translations in every display locale',()=>{
 for(const locale of ['ja','es','pt','zh','fr'])for(const source of ['Upcoming','Past classes','Choose what you want to strengthen today.','Your journey, with a human guide.','Start','Practise','Watch','Explore','Choose course level','Chapter','Learning tools','Open pronunciation studio','Explore Japanese characters','Previous practice','Lesson photography credits','View all visual sources']){
 const translated=reviewedTranslation(source,locale);assert.ok(translated,locale+': '+source);assert.notEqual(translated,source,locale+': '+source);
 }
});
