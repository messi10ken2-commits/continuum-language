import React from 'react';
import {Sparkles,ChevronRight,NotebookPen} from 'lucide-react';
import {buildLessonSuggestion,suggestionDraft} from './lesson-suggestions.mjs';

export default function LessonSuggestion({record,notes,onNavigate,onUseDraft,hasDraft}){
 const plan=buildLessonSuggestion({notes,attempts:record.attempts,sharing:record.sharing});
 return <section className="ai-note-card lesson-suggestion" aria-label="Suggested next lesson">
  <Sparkles size={22}/><span className="eyebrow">NEXT LESSON · EVIDENCE-BASED PLAN</span>
  <h3>{plan.title}</h3><p>{plan.reason}</p>
  {plan.saved&&<div className="suggestion-source"><b>Saved observation · {plan.saved.focus}</b><p>{plan.saved.note}</p></div>}
  <div><b>Relevant learning progress</b><p>{plan.progress}</p></div>
  <ol>{plan.steps.map(s=><li key={s.title}><b>{s.title}</b><p>{s.text}</p></li>)}</ol>
  <div><b>Check at the end</b><p>{plan.check}</p></div>
  <p>{plan.homework}</p>
  <button type="button" className="outline-button" disabled={hasDraft} onClick={()=>onUseDraft(plan.focus,suggestionDraft(plan))}><NotebookPen size={16}/>Use as class-plan draft</button>
  <small>{hasDraft?'Save or clear your current observation before inserting a plan.':'Inserts an editable draft above. Nothing is saved or assigned until you choose to save.'}</small>
  <button type="button" className="outline-button" onClick={()=>onNavigate('Learning memory')}>Review learning memory <ChevronRight size={16}/></button>
  <small>Built from course activities and planning rules—not an AI assessment. Unsaved typing does not change this plan.</small>
 </section>;
}
