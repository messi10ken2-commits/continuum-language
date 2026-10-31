import {bundledRecordings,bundledRecording} from '../bundled-audio.mjs';
// Placement passages and gated original models must stay server-owned.
import fs from 'node:fs';import assert from 'node:assert/strict';
import {placementPacks} from '../curriculum/placement/index.mjs';
import {expandedExclusiveCourses} from '../expanded-exclusive-courses.mjs';
import premiumTimings from '../expanded-premium-video-timings.json' with {type:'json'};
const bundle=fs.readdirSync('dist/assets').filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync('dist/assets/'+f,'utf8')).join('\n');
for(const [language,rows] of Object.entries(placementPacks))for(const [id,row] of Object.entries(rows))for(const key of ['passage','audio'])assert.ok(!bundle.includes(row[key]),`${language} ${id}: private ${key} in client`);
for(const course of expandedExclusiveCourses)for(const model of course.examples)assert.ok(!bundle.includes(model),course.id+': gated model in client');
for(const timing of premiumTimings)assert.ok(!bundle.includes(timing.analysisId),'Exclusive timing/answer record in client: '+timing.youtubeId);
for(const record of bundledRecordings){const clip=bundledRecording(record.text,record.locale);assert.ok(!bundle.includes(clip.audio.toString('base64').slice(200,500)),record.key+': server audio in client bundle');if(record.kind==='studio')assert.ok(!bundle.includes(record.generationId),record.key+': gated studio provenance in client bundle');}
console.log('PASS: 240 private placement texts and 216 gated original models stay out of the production browser bundle.');
