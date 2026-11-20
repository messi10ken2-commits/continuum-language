import test from 'node:test';import assert from 'node:assert/strict';
import {rewriteNativeMediaLists} from './native-media-build.mjs';
const origin='https://api.example.test',roots=['journey-media','lesson-media'];
test('native source sets retain all density candidates on the approved media host',()=>{
 const source='srcSet: "https://api.example.test/journey-media/a-small.webp 640w, /journey-media/a.webp 1440w, /lesson-media/b.webp 2x"';
 const result=rewriteNativeMediaLists(source,{origin,roots});
 assert.equal(result,'srcSet: "https://api.example.test/journey-media/a-small.webp 640w, https://api.example.test/journey-media/a.webp 1440w, https://api.example.test/lesson-media/b.webp 2x"');
 assert.equal(rewriteNativeMediaLists(result,{origin,roots}),result);
});
test('native media-list rewriting preserves API comparisons, foreign hosts and unrelated content',()=>{
 const source='fetch("/api/auth/me"); x.pathname.startsWith("/api/"); const a="640w, //foreign.example.test/x 2x, https://foreign.example.test/x 3x, /unknown/x 4x";';
 assert.equal(rewriteNativeMediaLists(source,{origin,roots}),source);
 assert.throws(()=>rewriteNativeMediaLists('',{origin:'http://api.example.test',roots}));
 assert.throws(()=>rewriteNativeMediaLists('',{origin,roots:['bad|root']}));
 assert.equal(rewriteNativeMediaLists('x',{origin,roots:[]}), 'x');
});
