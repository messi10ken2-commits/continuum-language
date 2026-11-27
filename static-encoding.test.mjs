import test from 'node:test';import assert from 'node:assert/strict';import{staticEncodings}from'./static-encoding.mjs';
test('static compression honors exclusions and quality without request-time work',()=>{
  assert.deepEqual(staticEncodings(''),[]);
  assert.deepEqual(staticEncodings('br, gzip'),['br','gzip']);
  assert.deepEqual(staticEncodings('gzip;q=1,br;q=.5'),['gzip','br']);
  assert.deepEqual(staticEncodings('br;q=0,gzip;q=0,*;q=1'),[]);
  assert.deepEqual(staticEncodings('br;q=no,gzip;q=2'),[]);
  assert.deepEqual(staticEncodings('gzip;q=0,*;q=.5'),['br']);
});
