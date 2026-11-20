import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cleanSpeech,speechParts} from './sentence-audio.mjs';
test('speech retains blanks without inserting a correct answer',()=>{assert.equal(cleanSpeech('Espero que ___ mañana.'),'Espero que , … , mañana.');});
test('Spanish conjugations retain Spanish voice',()=>{assert.equal(speechParts('¿Has terminado?')[0].lang,'es-ES');});
test('English instruction and quoted Spanish use separate voices',()=>{assert.deepEqual(speechParts('Complete: “Espero que vengas.”').map(p=>p.lang),['en-US','es-ES']);});
test('explicit language and airport letter are preserved',()=>{assert.equal(speechParts('La puerta B dieciséis.','es-ES')[0].text,'La puerta be dieciséis.');assert.equal(speechParts('Flight cancelled.','en-US')[0].lang,'en-US');});
