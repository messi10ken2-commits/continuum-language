import React,{useEffect,useState} from 'react';
import {t,interfaceLanguage} from './interface-runtime.mjs';

const invoiceStatuses={draft:'Draft invoice',open:'Open invoice',paid:'Paid invoice',void:'Void invoice',uncollectible:'Uncollectible invoice',unknown:'Unknown invoice status'};
function invoiceTotal(invoice){
 if(!invoice.currency||invoice.total===null)return '—';
 const currency=invoice.currency.toUpperCase();
 const format=new Intl.NumberFormat(interfaceLanguage(),{style:'currency',currency,currencyDisplay:'code'});
 const digits=['ISK','UGX'].includes(currency)?2:format.resolvedOptions().maximumFractionDigits;
 return format.format(invoice.total/10**digits);
}

// Customer-scoped invoice history from the existing authenticated Billing API.
export default function BillingInvoices({customer,request}){
 const [data,setData]=useState(null),[error,setError]=useState('');
 useEffect(()=>{
  if(!customer){setData(null);setError('');return;}
  let active=true;
  request('/invoices').then(result=>{if(active)setData(result)}).catch(()=>{if(active)setError('Invoice history is temporarily unavailable.')});
  return()=>{active=false};
 },[customer,request]);
 if(!customer)return null;
 return <section className="membership-invoices"><h3>{t('Invoices and receipts')}</h3>
  {error?<p role="status">{t(error)}</p>:!data?<p>{t('Loading invoices…')}</p>:
   data.invoices.length===0?<p>{t('No invoices yet.')}</p>:
   <ul>{data.invoices.map(invoice=><li key={invoice.id}>
    <span>{invoice.created?new Date(invoice.created*1000).toLocaleDateString(interfaceLanguage()):t('Invoice')} · {t(invoiceStatuses[invoice.status]??invoiceStatuses.unknown)}</span>
    <strong>{invoiceTotal(invoice)}</strong>
    {invoice.hostedUrl&&<a href={invoice.hostedUrl} target="_blank" rel="noopener noreferrer">{t('View invoice')}</a>}
    {invoice.pdfUrl&&<a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">{t('Invoice PDF')}</a>}
   </li>)}</ul>}
  {data?.hasMore&&<small>{t('For older invoices, open subscription management.')}</small>}
 </section>;
}
