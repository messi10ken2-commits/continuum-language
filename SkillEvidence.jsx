import React from 'react';
import {t,tf} from './interface-runtime.mjs';
import {skillEvidenceVersion} from './skill-evidence.mjs';
export function PronunciationEvidence({value}){
 return <section className="skill-acoustic"><h4>{t('Pronunciation from recorded audio')}</h4>{value?.assessable?<><b>{value.score}%</b>{value.criteria?.map((name,i)=><p key={name}><b>{t(name)}: {value.ratings[i]}/4</b></p>)}<ul>{value.evidence?.map((e,i)=>e&&<li key={i}>{e}</li>)}</ul><p>{t(value.feedback)}</p></>:<p>{t('Not enough recorded speech to assess pronunciation. Typed text is not scored for pronunciation.')}</p>}</section>;
}
export default function SkillEvidence({result}){
 if(result?.evaluationVersion!==skillEvidenceVersion)return <p className="reference-hint">{t('This older result has no independent skill level. Request an updated assessment; task difficulty is not your proficiency.')}</p>;
 return <section className="skill-independent"><h4>{t('Independent skill estimate')}</h4><b>{result.cefr?.level||t('Not enough evidence')}</b>{result.cefr?.level&&<small> · {t('Provisional CEFR estimate')} · {t(result.cefr.confidence==='medium'?'Medium confidence':'Low confidence')}</small>}<p>{t(result.cefr?.limitations||'Not enough evidence')}</p>{result.cefr?.evidence?.map((e,i)=><blockquote key={i}>{e.quote}<p>{e.reason}</p></blockquote>)}{result.pronunciation&&<PronunciationEvidence value={result.pronunciation}/>}<small>{t('The skill estimate uses this response only. It is separate from course placement and is not a certification.')}</small></section>;
}
