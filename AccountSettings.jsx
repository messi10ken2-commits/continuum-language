import CountryFlag from './CountryFlag.jsx';
import {CompanionAvatar,CompanionAvatarSettings} from './CompanionAvatar.jsx';
import React,{useEffect,useRef,useState,useContext} from 'react';
import {ChevronRight,BookOpen,Globe,Target,Palette,Crown,Shield,HelpCircle} from 'lucide-react';
import {t} from './interface-runtime.mjs';
import {ActivityContext} from './LearningActivity.jsx';
import {languageInfo} from './languages.mjs';
import {Clock3,Flame} from 'lucide-react';
import {billingRequest} from './Membership.jsx';
import {useInterfaceLanguage} from './InterfaceLanguage.jsx';
import {useJourneyLayout,illustratedScene} from './JourneyLayout.jsx';
function Setting({title,Icon,children,open=false}){return <details className="setting-row" open={open||undefined}><summary><Icon size={20}/><span>{t(title)}</span><ChevronRight size={18}/></summary><div className="setting-content">{children}</div></details>}
export default function AccountSettings({user,language,layoutPicker,goal,awards,support,displayLanguage,membership,profile,account,focusOffer,onLogout,assessment,learnerProfile,onProfile}){
 const {data:activity}=useContext(ActivityContext)||{};
 useInterfaceLanguage();const {layout}=useJourneyLayout(),[billing,setBilling]=useState(null),plan=useRef(null);
 useEffect(()=>{let live=true;if(user.role==='learner')billingRequest().then(d=>{if(live)setBilling(d)}).catch(()=>{});return()=>{live=false}},[user.id]);
 const photo=layout==='photo'&&user.role==='learner';
 const level=assessment?.result?.courseLevel||(learnerProfile?.primaryLanguage===language?learnerProfile.level:null)||'—';
 const rank=['A1','A2','B1','B2','C1'].indexOf(level);
 const selectedLanguages=[...new Set(learnerProfile?.languages?.length?learnerProfile.languages:[language])];
 const showPlan=()=>{if(plan.current){plan.current.open=true;plan.current.scrollIntoView({block:'start',behavior:'smooth'});}};
 return <section className={'account-settings'+(photo?' photo-learner-account':'')}><header className="settings-heading"><h1>{t('Your account')}</h1><p>{t('Your learning preferences, membership and privacy, in one place.')}</p></header>

 <div className="settings-identity"><span aria-hidden="true"><CompanionAvatar user={user}/></span><div><h2>{user.name}</h2><p>{photo?user.email:t(user.role==='learner'?'Learner account':'Teacher account')}</p></div></div>
 {user.role==='learner'&&<>
 {photo&&<div className="account-profile-heading"><h3>{t('Your learning profile')}</h3><button className="text-button" onClick={onProfile}>{t('Edit')}</button></div>}
 <button className="account-learning-profile" onClick={onProfile}>
 {photo?<CountryFlag language={language}/>:<span className="account-level-badge">{level}</span>}
 <span><b>{t(languageInfo(language).name)}</b><small>{photo?level+' · ':''}{t(assessment?.result?'course placement':'Your learning profile')}</small>{photo&&<span className="account-level-steps" aria-hidden="true">{['A1','A2','B1','B2','C1'].map((band,i)=><i key={band} className={i<=rank?'filled':''} style={{height:8+i*3}}/>)}</span>}</span><ChevronRight size={19}/>
 </button>
 <div className="account-activity-pair"><div><Flame/><span><b>{activity?.studyDays??'—'}</b><small>{t('active days')}</small></span></div><div><Clock3/><span><b>{activity?photo?(Number(activity.studyMs||0)/3600000).toLocaleString(undefined,{maximumFractionDigits:1}):Math.floor(Number(activity.studyMs||0)/60000):'—'}{!photo&&' '+t('min')}</b><small>{t(photo?'hours studied':'Total tracked study time')}</small></span></div></div>
 {photo&&<section className="account-languages"><h3><Globe size={19}/>{t('Languages')}</h3>{selectedLanguages.map(id=><button key={id} className="account-language-row" onClick={onProfile}><CountryFlag language={id}/><span>{t(languageInfo(id).name)}</span>{id===learnerProfile?.primaryLanguage&&<small>{t('Primary')}</small>}<ChevronRight size={17}/></button>)}<button className="text-button" onClick={onProfile}><span aria-hidden="true">＋</span>{t('Add another language')}</button></section>}
 {layout==='illustrated'&&<div className="account-journey-collection">{awards}</div>}
 </>}
 {billing&&!billing.membership.premium&&<aside className="settings-premium"><Crown aria-hidden="true"/><div><strong>{t('Premium')}</strong><p>{t('View subscription options')}</p></div><button type="button" className="settings-premium-action" onClick={showPlan}>{t('View membership')} <ChevronRight size={18} aria-hidden="true"/></button></aside>}
 {user.role==='learner'&&<CompanionAvatarSettings user={user}/>}<h3>{t('Your learning')}</h3><div className="settings-group"><Setting title={user.role==='teacher'?'Edit teaching profile':'Edit learning profile'} Icon={BookOpen}>{profile}</Setting>{layoutPicker&&<Setting title="World style" Icon={Palette}>{layoutPicker}</Setting>}{goal&&<Setting title="Your daily study goal" Icon={Target}>{goal}</Setting>}<Setting title="Display language" Icon={Globe}>{displayLanguage}</Setting>{awards&&layout!=='illustrated'&&<Setting title="Your activity" Icon={Target}>{awards}</Setting>}</div>
 {membership&&<><h3>{t('Membership')}</h3><details className="setting-row" ref={plan} open={focusOffer||undefined}><summary><Crown size={20}/><span>{t('View subscription options')}</span><ChevronRight size={18}/></summary><div className="setting-content">{membership}</div></details></>}
 <h3>{t('Sharing & privacy')}</h3><div className="settings-group"><Setting title="Sharing & privacy" Icon={Shield}>{account}<a className="settings-link" href="/privacy-settings" target="_blank" rel="noopener noreferrer">{t('Privacy Settings')}<ChevronRight size={18}/></a></Setting><Setting title="Help & contact" Icon={HelpCircle}>{support}</Setting><a className="settings-link" href="/terms" target="_blank" rel="noopener noreferrer">{t('Terms of Service')}<ChevronRight size={18}/></a><a className="settings-link" href="/privacy" target="_blank" rel="noopener noreferrer">{t('Privacy Policy')}<ChevronRight size={18}/></a></div>
 <button className="settings-signout outline-button" onClick={onLogout}>{t('Sign out')}</button>
 </section>;
}
