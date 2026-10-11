import React,{useState} from 'react';
import {languages} from './languages.mjs';
export default function TeacherLanguageAccess({teacher,onChange,onRemove}){
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const toggle=async(id,checked)=>{setBusy(true);setError('');try{await onChange(teacher.id,checked?[...teacher.languages,id]:teacher.languages.filter(x=>x!==id))}catch(e){setError(e.message)}finally{setBusy(false)}};
 return <fieldset className="teacher-language-access"><legend>{teacher.name}</legend><p>Share only languages you study with this teacher.</p><div className="shared-language-options">{languages.map(l=><label key={l.id}><input type="checkbox" checked={teacher.languages.includes(l.id)} disabled={busy} onChange={e=>toggle(l.id,e.target.checked)}/>{l.name}</label>)}</div>{!teacher.languages.length&&<p>No language selected — learning records and class notes are hidden.</p>}{error&&<p role="alert">{error}</p>}<button type="button" className="text-button" disabled={busy} onClick={()=>onRemove(teacher.id)}>Remove access</button></fieldset>;
}
