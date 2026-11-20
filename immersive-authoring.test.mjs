import assert from 'node:assert/strict';
import {test} from 'node:test';
import {units} from './immersive/en.mjs';
import {units as japanese} from './immersive/ja.mjs';
import {units as spanish} from './immersive/es.mjs';
import {units as portuguese} from './immersive/pt.mjs';
import {units as chinese} from './immersive/zh.mjs';
import {units as french} from './immersive/fr.mjs';
import {units as italian} from './immersive/it.mjs';
import {units as german} from './immersive/de.mjs';
import {units as korean} from './immersive/ko.mjs';
import {units as arabic} from './immersive/ar.mjs';
import {validateImmersiveUnits} from './immersive/validate.mjs';
import {localizeUnit} from './immersive/localize.mjs';
for(const [language,pack] of Object.entries({en:units,ja:japanese,es:spanish,pt:portuguese,zh:chinese,fr:french,it:italian,de:german,ko:korean,ar:arabic}))test(language+' authored sources and exercises have valid, non-repeated source windows',()=>{
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
 for(const pack of [units,japanese,spanish,portuguese,chinese,french,italian,german,korean,arabic])for(const [key,u]of Object.entries(pack)){
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

import {immersiveRecordingPlaylist} from './immersive/audio-playlist.mjs';
test('full listening preserves order and locale, while roleplay only speaks the current turn',()=>{
 const lesson={id:'zh-immersive-market-v1-listening',locale:'zh-CN'},unit=chinese.market;
 const full=immersiveRecordingPlaylist(lesson,unit,{stage:'listening',part:2,all:true});
 assert.deepEqual(full.map(p=>p.text),unit.listening.map(p=>p.text));
 assert.ok(full.every(p=>p.lang==='zh-CN'));
 assert.equal(new Set(full.map(p=>p.endpoint)).size,6);
 const selected=immersiveRecordingPlaylist(lesson,unit,{stage:'listening',part:2});
 assert.equal(selected.length,1);assert.equal(selected[0].text,unit.listening[2].text);
 const turn=immersiveRecordingPlaylist(lesson,unit,{stage:'roleplay',part:4,all:true});
 assert.equal(turn.length,1);assert.equal(turn[0].text,unit.questions.roleplay[4].sceneLine);
 assert.deepEqual(immersiveRecordingPlaylist(lesson,unit,{stage:'writing',part:0}),[]);
 assert.deepEqual(immersiveRecordingPlaylist(lesson,unit,{stage:'listening',part:-1}),[]);
});
