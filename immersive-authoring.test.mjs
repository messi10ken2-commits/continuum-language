import assert from 'node:assert/strict';
import {test} from 'node:test';
import {units} from './immersive/en.mjs';
import {units as japanese} from './immersive/ja.mjs';
import {units as spanish} from './immersive/es.mjs';
import {units as portuguese} from './immersive/pt.mjs';
import {validateImmersiveUnits} from './immersive/validate.mjs';
import {localizeUnit} from './immersive/localize.mjs';
for(const [language,pack] of Object.entries({en:units,ja:japanese,es:spanish,pt:portuguese}))test(language+' authored sources and exercises have valid, non-repeated source windows',()=>{
 assert.deepEqual(validateImmersiveUnits(language,pack,{english:units}),[]);
});
test('authoring audit detects an untranslated source and a repeated answer',()=>{
 const pack=structuredClone(japanese);pack.market.reading[0].text=units.market.reading[0].text;pack.market.questions.reading[0].options[1]=pack.market.questions.reading[0].options[0];
 const errors=validateImmersiveUnits('ja',pack,{english:units});
 assert.ok(errors.some(e=>e.includes('English fallback')));
 assert.ok(errors.some(e=>e.includes('three distinct answers')));
});
test('native dialogue rotates the intended answer without changing its meaning',()=>{
 const base=spanish.market;
 const dialogue=base.questions.roleplay.map(q=>[q.sceneLine,q.options[q.answer],...q.options.filter((_,i)=>i!==q.answer)]);
 const localized=localizeUnit('market',{title:base.title,opening:base.opening,reading:base.reading.map(p=>p.text),listening:base.listening.map(p=>p.text),dialogue});
 for(let i=0;i<6;i++)assert.equal(localized.questions.roleplay[i].options[localized.questions.roleplay[i].answer],dialogue[i][1]);
 assert.throws(()=>localizeUnit('market',{reading:[],listening:[],dialogue:[]}),/Incomplete/);
});

import canonical from './immersive/canonical.json' with {type:'json'};
import {compactImmersiveUnit,expandImmersiveUnit} from './immersive/catalog-model.mjs';
test('shared catalog metadata preserves every authored question, answer and evidence summary',()=>{
 for(const pack of [units,japanese,spanish,portuguese])for(const [key,u]of Object.entries(pack)){
  const restored=expandImmersiveUnit(compactImmersiveUnit(u),canonical[key]);
  assert.deepEqual(restored.questions,u.questions,key);
  assert.deepEqual(restored.evidence,[...u.reading.map(p=>p.point),...u.listening.map(p=>p.point)]);
  assert.equal(restored.opening,u.opening);
 }
});
test('compact catalog keeps full source paragraphs out of initial metadata',()=>{
 const compact=compactImmersiveUnit(spanish.heat);
 assert.ok(!JSON.stringify(compact).includes(spanish.heat.reading[0].text));
 assert.ok(!Object.hasOwn(compact,'reading'));
});
