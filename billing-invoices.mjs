// Read-only Stripe subscription invoice history. Never generate a payable invoice here.
const safeInvoiceUrl=value=>{
  if(typeof value!=='string')return null;
  try {
    const url=new URL(value);
    if(url.protocol!=='https:'||url.port||url.username||url.password||
      !['invoice.stripe.com','pay.stripe.com','files.stripe.com'].includes(url.hostname))return null;
    return url.href;
  } catch { return null; }
};
export function customerInvoiceSummary(item){
  if(!item||typeof item!=='object'||typeof item.id!=='string'||!/^in_[A-Za-z0-9]+$/.test(item.id))return null;
  const money=v=>Number.isSafeInteger(v)&&v>=0?v:null;
  return {
    id:item.id,
    number:typeof item.number==='string'?item.number.slice(0,100):null,
    status:['draft','open','paid','void','uncollectible'].includes(item.status)?item.status:'unknown',
    currency:typeof item.currency==='string'&&/^[a-z]{3}$/i.test(item.currency)?item.currency.toLowerCase():null,
    total:money(item.total),
    amountPaid:money(item.amount_paid),
    created:Number.isSafeInteger(item.created)&&item.created>=0?item.created:null,
    hostedUrl:safeInvoiceUrl(item.hosted_invoice_url),
    pdfUrl:safeInvoiceUrl(item.invoice_pdf)
  };
}
export async function customerInvoiceHistory(stripe,customerId){
  if(typeof customerId!=='string'||!/^cus_[A-Za-z0-9]+$/.test(customerId))throw Error('Invalid billing customer');
  const result=await stripe.invoices.list({customer:customerId,limit:24});
  // Verify returned ownership as well as scoping the request. Never pass a hosted
  // URL through if the provider response omits or disagrees with the customer.
  const owns=item=>(typeof item?.customer==='string'?item.customer:item?.customer?.id)===customerId;
  return {invoices:(result.data||[]).filter(owns).map(customerInvoiceSummary).filter(Boolean),
    hasMore:result.has_more===true};
}
