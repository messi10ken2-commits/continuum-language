import test from 'node:test';
import assert from 'node:assert/strict';
import {companionReactions,mapCompanionPosition} from './companion-reactions.mjs';
import {bondState} from './companion-bond.mjs';
import {livingMapGeometry} from './living-map-model.mjs';
import {journeyChapters,journeyLevels} from './journey-model.mjs';
test('Studio taps expose exactly the selected companion’s earned reactions',()=>{
 for(const [chapters,expected] of [[0,[]],[4,[]],[5,['hello']],[14,['hello']],[15,['hello','call']],[29,['hello','call']],[30,['hello','call','delight']]])assert.deepEqual(companionReactions(bondState(chapters)),expected);
 assert.deepEqual(companionReactions(bondState(40,true)),['hello','call','delight','finale']);
 assert.deepEqual(companionReactions(undefined),[]);
 assert.deepEqual(companionReactions({reaction:true,voice:false,expression:false,finale:false}),['hello']);
});
test('map companions clear the complete title panel and stay within their visible panorama panel at every level and screen width',()=>{
 for(const language of ['en','es','pt','ja','zh','ko','fr','de','ar','it'])for(const level of journeyLevels)for(const width of [240,320,390,768,1440]){
  const geometry=livingMapGeometry(journeyChapters(language,level,[]),width),panel=geometry.width/geometry.columns;
  for(const point of geometry.points){const p=mapCompanionPosition(point,geometry),column=Math.floor(point.x/panel);assert.ok(Math.abs(p.left-point.x)-21>=72+8,language+' '+level);assert.ok(p.left-21>=column*panel);assert.ok(p.left+21<=(column+1)*panel);assert.ok(p.top>=0&&p.top+48<=geometry.height);}
 }
});
