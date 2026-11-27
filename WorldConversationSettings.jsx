import React,{useState} from 'react';
import {t} from './interface-runtime.mjs';
import {worldRequest} from './continuum-world-request.mjs';
export default function WorldConversationSettings({profile,onProfile,welcome,onDone,onMemory}){
 const [draft,setDraft]=useState(profile.settings||{level:'auto',aiConsent:false,classContext:false}),[busy,setBusy]=useState(false),[error,setError]=useState(''),[saved,setSaved]=useState(false);
 const change=(key,value)=>{setSaved(false);setDraft(s=>({...s,[key]:value}));};
 const save=async()=>{setBusy(true);setError('');try{const d=await worldRequest('/settings',{...draft,onboarded:true},'PUT');onProfile({...profile,settings:d.settings});setSaved(true);if(welcome)onDone();}catch(e){setError(e.message);}finally{setBusy(false);}};
 return <section className="cw-conversation-settings" aria-label={t('Conversation settings')}>
 {welcome&&<p>{t('Walk up to someone and talk. You can change these choices anytime in World settings.')}</p>}
 <h3>{t('Conversation settings')}</h3>
 <fieldset disabled={busy}><label>{t('Conversation difficulty')}<select value={draft.level} onChange={e=>change('level',e.target.value)}>{['auto','A1','A2','B1','B2','C1'].map(l=><option key={l} value={l}>{l==='auto'?t('Auto'):l}</option>)}</select></label><p>{t('Changing conversation difficulty does not change course progress.')}</p>
 <label><input type="checkbox" checked={draft.aiConsent} onChange={e=>change('aiConsent',e.target.checked)}/>{t('Allow AI processing of my World conversations and recordings.')}</label>
 <label><input type="checkbox" checked={draft.classContext} onChange={e=>change('classContext',e.target.checked)}/>{t('Use my recent Japanese class learning notes in World conversations.')}</label></fieldset>
 <p>{t('NPC memory is optional. Learning evidence is saved separately.')}</p><button type="button" disabled={busy} onClick={onMemory}>{t('Missions and NPC memory')}</button>
 {saved&&<p role="status">{t('Conversation settings saved.')}</p>}{error&&<p role="alert">{t(error)}</p>}<button type="button" disabled={busy} onClick={save}>{t(busy?'Preparing…':welcome?'Save and explore':'Save conversation settings')}</button>
 </section>;
}
