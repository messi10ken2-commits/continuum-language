import React,{useContext} from 'react';
import {ArrowRight,Clock3,BookOpen} from 'lucide-react';
import {JourneyPhoto} from './JourneyVisual.jsx';
import {ActivityContext} from './LearningActivity.jsx';
import {t} from './interface-runtime.mjs';
import {languageInfo} from './languages.mjs';
export default function PhotoOverview({user,language,done,total,onLearn}){
 const {data}=useContext(ActivityContext)||{};
 return <section className="photo-overview"><div className="photo-overview-landscape"><JourneyPhoto language={language} decorative/><div><span className="eyebrow">{t(languageInfo(language).name)}</span><h1>{t('Your next chapter awaits')}</h1><p>{t('Explore, practise and make real progress.')}</p></div></div><div className="photo-overview-summary"><span className="photo-overview-name">{user?.name}</span><div><b>{t('Your course progress')}</b><span>{done}/{total}</span></div><progress value={done} max={total||1} aria-label={t('Your course progress')}/><button className="primary" onClick={onLearn}>{t('Continue learning')}<ArrowRight size={18}/></button></div><div className="photo-overview-stats"><span><Clock3 size={21}/><b>{data?Math.floor(Number(data.todayMs||0)/60000):'—'} {t('min')}</b><small>{t('Today')}</small></span><span><BookOpen size={21}/><b>{done}</b><small>{t('activities mastered')}</small></span></div></section>;
}
