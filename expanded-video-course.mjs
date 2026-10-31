import sources from './expanded-video-sources.json' with {type:'json'};
import {languageInfo} from './languages.mjs';
// Source-focus checks are limited to publisher-confirmed titles/descriptions.
// The listening guide develops deeper listening without inventing dialogue facts.
const guides={
 A1:['Watch once to identify the situation and who is speaking.','Replay a short exchange with captions and recognise a greeting or a familiar word.','Repeat one complete phrase, then use it to introduce an exchange of your own.'],
 A2:['Identify the situation before trying to catch every word.','Replay to follow the order of actions, places or activities.','Describe two details you heard using a short connected account.'],
 B1:['Listen for the main point and a supporting detail.','Compare two responses or stages of the interaction, using the recording as evidence.','Retell the exchange and keep the speakers’ meaning separate from your own assumptions.'],
 B2:['Identify the topic, purpose and the speakers’ perspectives.','Replay to distinguish reasons, examples and qualifications.','Summarise a point and a reservation without generalising beyond the speakers.'],
 C1:['Identify how stance is expressed through wording, emphasis and context.','Compare what is stated, what is implied and what the recording does not establish.','Give a nuanced synthesis: attribute views, preserve qualifications and identify the limits of the evidence.']
};
const choice=(id,prompt,options,note,index,reference)=>{const shift=index%options.length;return {id,type:'video',video:true,prompt,options:[...options.slice(shift),...options.slice(0,shift)],answer:(options.length-shift)%options.length,note,optionsRole:'comprehension',optionsLang:'en-US',sourceReference:reference};};
export function buildExpandedVideo(source){
 const {language,level,youtubeId,title}=source,exclusive=level==='exclusive',band=exclusive?'B2':level,locale=languageInfo(language).locale;
 const id=`${language}-${exclusive?'exclusive-video':'conversation'}-v1-${exclusive?'context':level.toLowerCase()}`,url=`https://www.youtube.com/watch?v=${youtubeId}`;
 const reference={kind:'publisher-overview',label:'Publisher’s introduction and full recording',url,evidence:'Publisher title and public description checked 2026-10-31. These are source-focus and interpretation checks, not a transcript-verified detail quiz. Exact phrase timings have not been verified.'};
 const detail=source.detail||['Which interpretation preserves the source’s focus?',source.focus,source.wrong,'Keep the stated topic and purpose; do not add a claim the source does not make.'];
 const rows=[
 ['What is the focus of this recording?',[source.topic,...source.alternatives],'The publisher identifies this topic in the title or introduction.'],
 ['Which listening focus fits this recording?',[source.focus,...source.wrong],'Use the topic to guide listening without adding unsupported claims.'],
 ['Which statement keeps the source’s scope accurate?',[source.scope,...source.scopewrong],'The publisher’s introduction supports this description; the alternatives overstate or change it.'],
 [detail[0],[detail[1],...detail[2]],detail[3]],
 ['Which conclusion goes beyond what this source establishes?',[source.scopewrong[0],source.scope,source.topic+' is the episode’s focus.'],'This conclusion makes an unsupported claim. A source’s topic is not evidence for every broader generalisation.'],
 ['How should you check an uncertain interpretation of this recording?',['Replay the relevant exchange, compare it with available captions, and keep any remaining uncertainty explicit.','Use the title alone as proof of every detailed claim.','Replace unclear words with an assumption and report it as something the speaker definitely said.'],'Replay the actual exchange. Captions can help, but publisher corrections and remaining uncertainty still matter.']
 ];
 // Avoid duplicating the focus check when no additional publisher detail exists.
 if(!source.detail)rows[3]=['Which alternative changes the subject of this recording?',[source.alternatives[0],source.topic,source.focus],'The alternative is a different subject, rather than a paraphrase of the recording’s focus.'];
 const explanation='Watch the original recording with a purpose, then check its topic, communicative focus and the limits of an interpretation.';
 const levelNote=`${band} describes the Continuum listening task, not an official CEFR rating of the source. ${source.variety?`Variety: ${source.variety}. `:''}The checks cover publisher-confirmed focus and interpretation; detailed dialogue and exact timestamps have not been independently verified.`;
 return {id,chapter:id+'-chapter',language,locale,level:band,title,specialist:true,curriculumVersion:3,exerciseVersion:'v1-video-expansion-20261031',contentVersion:1,skill:'Listening',minutes:18,description:explanation,explanation,example:'Watch with the listening guide, then complete the source-focus checks.',exampleLang:'en-US',examples:[],scene:'listening',conversation:{provider:'youtube',youtubeId,source:url,sourceTitle:source.sourceTitle,credit:source.credit,poster:'/lesson-media/city.jpg',alt:title,watchTasks:guides[band],levelNote,hint:'Use replay and the publisher’s captions where available. Follow any publisher corrections. The questions do not quote or claim to transcribe unverified dialogue.'},questions:rows.map(([prompt,options,note],i)=>({...choice(id+'-q'+(i+1),prompt,options,note,i,reference),context:source.sourceTitle}))};
}
export const expandedVideoLessons=sources.filter(s=>s.level!=='exclusive').map(buildExpandedVideo);
export const expandedVideoChapters=expandedVideoLessons.map(l=>({id:l.chapter,language:l.language,locale:l.locale,level:l.level,title:l.title,goal:l.explanation,kind:'Real conversations',specialist:true,curriculumVersion:3}));
