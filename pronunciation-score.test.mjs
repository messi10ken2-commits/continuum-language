import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeSpeech,scorePronunciation} from './pronunciation-score.mjs';
test('normalizes Spanish accents and punctuation',()=>assert.equal(normalizeSpeech('¡Teléfono,  MÉXICO!'),'telefono mexico'));
test('scores an exact recognized model at 100',()=>assert.deepEqual(scorePronunciation('Tengo el teléfono en casa.','tengo el telefono en casa').score,100));
test('penalizes missing and extra recognized words',()=>{const result=scorePronunciation('Tengo el teléfono en casa','tengo telefono afuera');assert.ok(result.score>0&&result.score<75);assert.deepEqual(result.missing,['el','en','casa'])});
test('handles no recognized speech without inventing a result',()=>assert.deepEqual(scorePronunciation('Hola, me llamo Ana','').score,0));
