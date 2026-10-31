import test from 'node:test';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';import ffmpeg from 'ffmpeg-static';
import clips from './native-words.json' with {type:'json'};
import {nativeWordEntry,nativeWordRecordings} from './native-word-map.mjs';
import {pcmHasSpeechSignal} from './speech-audio-quality.mjs';
test('bundled human recordings decode to audible PCM and reported pairs retain distinct accented entries',()=>{
 for(const entry of nativeWordRecordings){
  const pcm=execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-i','pipe:0','-f','s16le','-ac','1','-ar','24000','pipe:1'],{input:Buffer.from(clips[entry.key],'base64'),timeout:10000,maxBuffer:2_000_000});
  assert.ok(pcmHasSpeechSignal(pcm),entry.key);assert.ok(pcm.length/48000>.25&&pcm.length/48000<8,entry.key);
 }
 for(const [a,b] of [['avó','avô'],['lá','lã'],['mau','mão'],['pau','pão'],['pó','pôr']]){
  const first=nativeWordEntry(a,'pt-BR'),second=nativeWordEntry(b,'pt-BR');assert.ok(first&&second);assert.notEqual(first.audioSha256,second.audioSha256);assert.notEqual(clips[first.key],clips[second.key]);assert.equal(nativeWordEntry(a.normalize('NFD'),'pt-BR'),first);
 }
 assert.equal(nativeWordEntry('avo','pt-BR'),undefined);assert.equal(nativeWordEntry('avó','pt-PT'),undefined);
});
