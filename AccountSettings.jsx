import {CompanionAvatar,CompanionAvatarSettings} from './CompanionAvatar.jsx';
import React,{useEffect,useRef,useState} from 'react';
import {ChevronRight,BookOpen,Globe,Target,Palette,Crown,Shield,HelpCircle} from 'lucide-react';
import {t} from './interface-runtime.mjs';
import {billingRequest} from './Membership.jsx';
import {useInterfaceLanguage} from './InterfaceLanguage.jsx';
import {useJourneyLayout,illustratedScene} from './JourneyLayout.jsx';
function Setting({title,Icon,children,open=false}){return <details className="setting-row" open={open||undefined}><summary><Icon size={20}/><span>{t(title)}</span><ChevronRight size={18}/></summary><div className="setting-content">{children}</div></details>}
export default function AccountSettings({user,language,layoutPicker,goal,awards,support,displayLanguage,membership,profile,account,focusOffer,onLogout}){
 useInterfaceLanguage();const {layout}=useJourneyLayout(),[billing,setBilling]=useState(null),plan=useRef(null);
 useEffect(()=>{let live=true;if(user.role==='learner')billingRequest().then(d=>{if(live)setBilling(d)}).catch(()=>{});return()=>{live=false}},[user.id]);
 const showPlan=()=>{if(plan.current){plan.current.open=true;plan.current.scrollIntoView({block:'start',behavior:'smooth'});}};
 return <section className="account-settings"><header className="settings-heading"><h1>{t('Your account')}</h1><p>{t('Your learning preferences, membership and privacy, in one place.')}</p></header>{billing&&!billing.membership.premium&&<aside className="settings-premium"><Crown/><div><strong>{t('Premium')}</strong><p>{t('View subscription options')}</p></div><button className="primary" onClick={showPlan}>{t('View membership')} <ChevronRight size={18}/></button></aside>}
 {layout==='illustrated'&&<img className="settings-landscape" src={illustratedScene(language)} alt="" width={1440} height={960}/>}
 <div className="settings-identity"><span aria-hidden="true"><CompanionAvatar user={user}/></span><div><h2>{user.name}</h2><p>{t(user.role==='learner'?'Learner account':'Teacher account')}</p></div></div>
 {user.role==='learner'&&<CompanionAvatarSettings user={user}/>}<h3>{t('Your learning')}</h3><div className="settings-group"><Setting title={user.role==='teacher'?'Edit teaching profile':'Edit learning profile'} Icon={BookOpen}>{profile}</Setting>{layoutPicker&&<Setting title="World style" Icon={Palette}>{layoutPicker}</Setting>}{goal&&<Setting title="Your daily study goal" Icon={Target}>{goal}</Setting>}<Setting title="Display language" Icon={Globe}>{displayLanguage}</Setting>{awards&&<Setting title="Your activity" Icon={Target}>{awards}</Setting>}</div>
 {membership&&<><h3>{t('Membership')}</h3><details className="setting-row" ref={plan} open={focusOffer||undefined}><summary><Crown size={20}/><span>{t('View subscription options')}</span><ChevronRight size={18}/></summary><div className="setting-content">{membership}</div></details></>}
 <h3>{t('Sharing & privacy')}</h3><div className="settings-group"><Setting title="Sharing & privacy" Icon={Shield}>{account}<a className="settings-link" href="/privacy-settings" target="_blank" rel="noopener noreferrer">{t('Privacy Settings')}<ChevronRight size={18}/></a></Setting><Setting title="Help & contact" Icon={HelpCircle}>{support}</Setting><a className="settings-link" href="/terms" target="_blank" rel="noopener noreferrer">{t('Terms of Service')}<ChevronRight size={18}/></a><a className="settings-link" href="/privacy" target="_blank" rel="noopener noreferrer">{t('Privacy Policy')}<ChevronRight size={18}/></a></div>
 <button className="settings-signout outline-button" onClick={onLogout}>{t('Sign out')}</button>
 </section>;
}
