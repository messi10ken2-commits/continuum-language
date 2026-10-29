// Placement passages and gated original models must stay server-owned.
import fs from 'node:fs';import assert from 'node:assert/strict';
import {placementPacks} from '../curriculum/placement/index.mjs';
import {expandedExclusiveCourses} from '../expanded-exclusive-courses.mjs';
const bundle=fs.readdirSync('dist/assets').filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync('dist/assets/'+f,'utf8')).join('\n');
for(const [language,rows] of Object.entries(placementPacks))for(const [id,row] of Object.entries(rows))for(const key of ['passage','audio'])assert.ok(!bundle.includes(row[key]),`${language} ${id}: private ${key} in client`);
for(const course of expandedExclusiveCourses)for(const model of course.examples)assert.ok(!bundle.includes(model),course.id+': gated model in client');
console.log('PASS: 240 private placement texts and 216 gated original models stay out of the production browser bundle.');
