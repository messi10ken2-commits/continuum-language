// Visible only when the native DEBUG build verifies the local Xcode StoreKit environment.
import React,{useEffect,useState} from 'react';
import {t,tf} from './interface-runtime.mjs';
import {Native} from './native-runtime.mjs';
export default function LocalStoreKitTools({user}){
 const [enabled,setEnabled]=useState(false),[products,setProducts]=useState([]),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{let live=true;Native.localStoreKitStatus().then(s=>{if(live)setEnabled(s.enabled===true)}).catch(()=>{});return()=>{live=false}},[]);
 const run=async action=>{if(busy)return;setBusy(true);setNotice('');try{await action()}catch{setNotice('Local StoreKit operation failed.')}finally{setBusy(false)}};
 if(!enabled)return null;
 return <section aria-label={t('Local StoreKit test')}><h3>{t('Local StoreKit test')}</h3><p>{t('LOCAL TEST ONLY. Prices are fixtures. No real charge or server Premium access.')}</p>
 <button className="outline-button" disabled={busy} onClick={()=>run(async()=>{const r=await Native.products();setProducts(r.products);setNotice(tf('Local products loaded: {0}',[r.products.length]))})}>{t('Load local products')}</button>
 {products.map(p=><div key={p.id}><p>{p.name} · {p.price}</p><button className="outline-button" disabled={busy} onClick={()=>run(async()=>{const r=await Native.purchase({productId:p.id,accountToken:user.id});setNotice(r.pending?'Local purchase pending. No access granted.':r.cancelled?'Local purchase cancelled. No access granted.':r.environment==='local-testing'&&r.transactionId?'Local purchase succeeded. No access granted.':'Unexpected local purchase result.');})}>{t(p.id.endsWith('.monthly')?'Buy local monthly':'Buy local yearly')}</button></div>)}
 <button className="outline-button" disabled={busy} onClick={()=>run(async()=>{const r=await Native.restore();setNotice(r.transactionIds.length?tf('Local purchases restored: {0}. No access granted.',[r.transactionIds.length]):'No local purchases to restore.')})}>{t('Restore local purchases')}</button>
 {notice&&<p role="status">{t(notice)}</p>}</section>;
}
