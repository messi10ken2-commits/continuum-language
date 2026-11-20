import assert from 'node:assert/strict';
import {test} from 'node:test';
import {setStudyPlayback,studyPlaybackActive} from './study-playback.mjs';
test('detached playback is idempotent, combines owners and clears on pause/unmount',()=>{
 const a={},b={};try{
  assert.equal(studyPlaybackActive(),false);setStudyPlayback(a,true);setStudyPlayback(a,true);assert.ok(studyPlaybackActive());
  setStudyPlayback(b,true);setStudyPlayback(a,false);assert.ok(studyPlaybackActive());
  setStudyPlayback(b,false);assert.equal(studyPlaybackActive(),false);setStudyPlayback(null,true);assert.equal(studyPlaybackActive(),false);
 }finally{setStudyPlayback(a,false);setStudyPlayback(b,false)}
});
