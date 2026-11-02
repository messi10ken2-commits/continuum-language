import React from 'react';
import {UserRound,ChevronDown} from 'lucide-react';
import {JourneyLayoutPicker} from './JourneyLayout.jsx';
import {languages} from './languages.mjs';
import {t} from './interface-runtime.mjs';

// The header is presentation only. Language and world style use existing state.
export function AppHeader({user,language,teacher,onLanguage,onAccount}){
 return <header className="continuum-header">
  <div className="continuum-wordmark" aria-label="Continuum"><span aria-hidden="true">∞</span><b>Continuum</b></div>
  <div className="continuum-header-tools"><JourneyLayoutPicker compact/><button className="continuum-account" onClick={onAccount} aria-label={t('Your account')}><UserRound size={21}/></button></div>
  {!teacher&&<label className="continuum-language"><span className="sr-only">{t('Learning language')}</span><select aria-label={t('Learning language')} value={language} onChange={e=>onLanguage(e.target.value)}>{languages.map(l=><option key={l.id} value={l.id}>{l.native} · {t(l.name)}</option>)}</select><ChevronDown size={14} aria-hidden="true"/></label>}
 </header>;
}
