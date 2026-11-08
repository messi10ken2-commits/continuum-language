import test from 'node:test';
import assert from 'node:assert/strict';
import {customerInvoiceSummary,customerInvoiceHistory} from './billing-invoices.mjs';

test('invoice summaries include only fields needed by the learner',()=>{
 const result=customerInvoiceSummary({id:'in_ABC123',number:'C-001',status:'paid',currency:'usd',
  total:7999,amount_paid:7999,created:1783500000,
  hosted_invoice_url:'https://invoice.stripe.com/i/test-id',
  invoice_pdf:'https://files.stripe.com/links/abc',
  customer_email:'private@example.com',description:'private content'});
 assert.equal(result.amountPaid,7999);
 assert.equal(result.pdfUrl,'https://files.stripe.com/links/abc');
 assert.equal('customer_email' in result,false);
 assert.equal('description' in result,false);
});
test('rejects untrusted invoice links and invalid identifiers',()=>{
 const result=customerInvoiceSummary({id:'in_valid',status:'paid',
 hosted_invoice_url:'https://invoice.stripe.com.evil.example/steal',
 invoice_pdf:'javascript:alert(1)'});
 assert.equal(result.hostedUrl,null);
 assert.equal(result.pdfUrl,null);
 assert.equal(customerInvoiceSummary({id:'other'}),null);
});
test('fetches only supplied customer and does not create charges',async()=>{
 let calls=0;const mock={invoices:{list:async args=>{calls++;assert.deepEqual(args,{customer:'cus_Test123',limit:24});
 return {data:[{id:'in_Test123',status:'open',currency:'usd',amount_paid:0,total:999}],has_more:false};}}};
 assert.equal((await customerInvoiceHistory(mock,'cus_Test123')).invoices.length,1);
 assert.equal(calls,1);
 await assert.rejects(customerInvoiceHistory(mock,'cus_Invalid!'));
 assert.equal(calls,1);
});
