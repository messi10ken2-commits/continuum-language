export const skillEvidenceVersion='skill-evidence-v3';
export const pronunciationCriteria=['Sound articulation','Rhythm, stress and timing','Intonation and phrasing','Overall intelligibility'];
export const communicationCriteria=['Task fulfilment','Fluency and coherence','Vocabulary and grammar','Register and appropriateness'];
export const cefrDescriptors={
 'Below A1':'Only isolated words or fragments; insufficient control of basic meaningful messages.',
 A1:'Simple personal information and basic needs using short familiar phrases.',
 A2:'Routine exchanges and short linked descriptions of familiar experiences.',
 B1:'Connected accounts and opinions with reasons; can manage familiar practical problems.',
 B2:'Clear developed ideas, comparisons and arguments with generally reliable language control.',
 C1:'Flexible, well-organised and precise expression of complex ideas, with appropriate qualification and register.',
 C2:'Consistently nuanced, highly flexible and precise expression with subtle distinctions, supported by extensive evidence.'
};
const text=(s,max=3000)=>typeof s==='string'&&s.trim().length>0&&s.length<=max;
export function validatePronunciation(p){
 if(!p||typeof p.assessable!=='boolean'||!Array.isArray(p.ratings)||p.ratings.length!==4||p.ratings.some(n=>!Number.isInteger(n)||n<0||n>4)||!Array.isArray(p.evidence)||p.evidence.length!==4||!p.evidence.every(s=>typeof s==='string'&&s.length<=2000)||!text(p.feedback))throw Error('Incomplete pronunciation evidence');
 if(p.assessable&&p.evidence.some(s=>!s.trim()))throw Error('Missing acoustic evidence');
 return {assessable:p.assessable,ratings:p.assessable?p.ratings:[],evidence:p.assessable?p.evidence:[],feedback:p.feedback,criteria:pronunciationCriteria,score:p.assessable?Math.round(p.ratings.reduce((a,b)=>a+b,0)/16*100):null,source:'recorded-audio',version:skillEvidenceVersion};
}
export function validateCefr(p){
 if(!p||!(p.level===null||Object.hasOwn(cefrDescriptors,p.level))||!['low','medium'].includes(p.confidence)||!text(p.limitations)||!Array.isArray(p.evidence)||p.evidence.length>4||!p.evidence.every(x=>x&&text(x.quote,1500)&&text(x.reason,1500)))throw Error('Incomplete independent skill estimate');
 return p;
}
export function groundedCefr(p,{sample='',sufficient=false,assessable=false}={}){
 const clean=s=>s.normalize('NFKC').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
 const evidence=p.evidence.filter(e=>clean(sample).includes(clean(e.quote)));
 const supported=sufficient&&assessable&&evidence.length>=2;
 return {...p,level:supported?p.level:null,evidence,scope:'single-skill-sample',version:skillEvidenceVersion,...(!supported?{limitations:'Not enough verified evidence for an independent skill level. Submit a longer response and request assessment.'}:{})};
}
export function productionSkillEvidence(result,task){
 const ai=result?.aiAssessment||(result?.evaluationVersion===skillEvidenceVersion?result:null);
 const valid=ai?.evaluationVersion===skillEvidenceVersion;
 return {ai,level:valid?ai.cefr?.level:null,confidence:valid?ai.cefr?.confidence:null,taskLevel:task?.level,needsUpdate:!!result&&!valid};
}
export function conversationPronunciation(messages){
 const clips=messages.filter(m=>m.role==='user'&&m.mode==='voice'&&m.speechEvidence?.pronunciation?.assessable&&m.speechEvidence.version===skillEvidenceVersion);
 const seconds=clips.reduce((n,m)=>n+m.speechEvidence.seconds,0);
 if(clips.length<2||seconds<15)return {assessable:false,score:null,feedback:'Record at least two clear voice replies with enough speech for pronunciation feedback.',source:'recorded-audio',clips:clips.length,seconds};
 const weight=clips.reduce((n,m)=>n+Math.min(45,m.speechEvidence.seconds),0);
 const ratings=[0,1,2,3].map(i=>Math.round(clips.reduce((n,m)=>n+m.speechEvidence.pronunciation.ratings[i]*Math.min(45,m.speechEvidence.seconds),0)/weight*100)/100);
 return {assessable:true,score:Math.round(ratings.reduce((a,b)=>a+b,0)/16*100),ratings,criteria:pronunciationCriteria,clips:clips.length,seconds,source:'recorded-audio',evidence:clips.slice(-3).flatMap(m=>m.speechEvidence.pronunciation.evidence),feedback:'Pronunciation is estimated from your recorded voice replies, not typed messages or the transcript.',version:skillEvidenceVersion};
}
