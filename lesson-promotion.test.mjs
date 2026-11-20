import assert from 'node:assert/strict';
import test from 'node:test';
import {promotionAfterCompletion,promotionDurationSeconds} from './lesson-promotion.mjs';

test('every two new completions share one ad across Standard and Light',()=>{
 let state={recent:[],count:0,pending:0};
 state=promotionAfterCompletion(state,'standard:first');
 assert.equal(state.pending,0);
 const restored=JSON.parse(JSON.stringify(state));
 state=promotionAfterCompletion(restored,'light:second');
 assert.equal(state.pending,1);
 assert.equal(state.count,0);
 assert.equal(promotionAfterCompletion(state,'light:second'),state);
 state={...state,pending:0};
 state=promotionAfterCompletion(state,'standard:third');
 state=promotionAfterCompletion(state,'standard:fourth');
 assert.equal(state.pending,1);
 assert.equal(promotionDurationSeconds,15);
});
