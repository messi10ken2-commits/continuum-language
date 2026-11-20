import React from 'react';
import {t} from './interface-runtime.mjs';
import {speakingGoal,needsSpeakingFeedback} from './speaking-goal.mjs';
import SentenceAudio from './SentenceAudio.jsx';
export default function SpeakingCoaching({session,locale,onRefresh,busy,pending=false}){
 const r=session.review,goal=speakingGoal(session),alternatives=r.naturalAlternatives||[];
 const render=(c,i,alternative)=><article className="conversation-correction" key={(alternative?'alternative':'error')+i}><span>{t('You said')}</span><p lang={locale}>{c.original}</p><span>{t(alternative?'Optional natural alternative':'Try saying')}</span><p lang={locale}><strong>{c.improved}</strong></p><SentenceAudio text={c.improved} lang={locale} audioEndpoint={'/api/speaking/'+session.id+'/audio/'+(alternative?'alternative/':'review/')+i}/><p>{c.explanation}</p></article>;
 return <section className="speaking-coaching"><h3>{t('Try a more natural way')}</h3>{r.corrections.map((c,i)=>render(c,i,false))}{alternatives.map((c,i)=>render(c,i,true))}{!r.corrections.length&&!alternatives.length&&<p>{t(needsSpeakingFeedback(r)?'Speaking feedback is not ready yet.':'No useful wording changes were needed in this review.')}</p>}{pending&&<p role="status">{t('Updating speaking feedback…')}</p>}{onRefresh&&needsSpeakingFeedback(r)&&<button className="text-button feedback-refresh" disabled={busy||pending} onClick={onRefresh}>{t('Update speaking feedback')}</button>}<h3>{t('Your next speaking goal')}</h3><p className="next-speaking-goal">{t(goal.goal)}</p>{goal.stretch&&<p>{t('Try it with a different choice and add one extra detail.')}</p>}</section>;
}
