import {rubricFor} from './skills-content.mjs';
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const words=s=>String(s||'').trim().split(/\s+/).filter(Boolean);
const heuristic=(task,response)=>{
 const text=typeof response==='string'?response:String(response?.transcript||'');const count=words(text).length;const target=task.words||[30,60];
 const length=clamp(count<target[0]?count/target[0]*65:count>target[1]?95:80);
 const connectors=(text.match(/porque|pero|sin embargo|aunque|por eso|en conjunto|además|primero|después|si bien/gi)||[]).length;
 const coverage=(task.prompt.match(/\b(?:why|reason|problem|solution|recommend|explain|compare|evidence|question|ask|details?)\b/gi)||[]).length;
 const structure=clamp(45+connectors*8+Math.min(coverage,3)*4);
 const score=clamp(length*.35+structure*.25+60*.4);
 const level=score>=85?'Strong for this task':score>=70?'Effective with some gaps':score>=50?'Developing':'Needs more support';
 return {status:'practice-feedback',score:null,method:'continuum-basic-feedback-v2',criteria:rubricFor(task.skill),ratings:[Math.round(score/25),Math.round(structure/25),Math.round((length+structure)/50),Math.round(score/25)].map(n=>Math.min(4,n)),feedback:`Basic practice check (not AI assessment). ${count} words were detected. ${length<70?'Add the required detail and a clearer ending.':'The response has enough material to develop the task.'} ${connectors?'Your linking words help the flow.':'Use linking words such as porque, sin embargo or en conjunto to make relationships clearer.'}`,nextStep:length<70?'Answer every part of the prompt with one concrete example.':'Add one specific example and reread for verb endings and agreement.'};
};
export async function assessSkill(task,response){
 const text=typeof response==='string'?response:String(response?.transcript||'');
 if(task.skill==='Speaking'&&!text.trim())return {status:'saved',score:null,method:'recording-only',feedback:'Your recording is saved. No transcript was available, so it has not been scored.',nextStep:'Replay your recording to review it. You can keep practising without connecting a teacher.'};
 if(process.env.OPENAI_API_KEY){try{
  const body={model:process.env.OPENAI_ASSESSMENT_MODEL||'gpt-4o-mini',input:[{role:'system',content:[{type:'input_text',text:'You are a careful Spanish language-learning evaluator. Score only the supplied task response. Do not claim an official CEFR level. Return specific, encouraging feedback and one next step.'}]},{role:'user',content:[{type:'input_text',text:JSON.stringify({skill:task.skill,level:task.level,prompt:task.prompt,rubric:rubricFor(task.skill),response:text})}]}],text:{format:{type:'json_schema',name:'skill_evaluation',strict:true,schema:{type:'object',additionalProperties:false,properties:{score:{type:'integer'},ratings:{type:'array',items:{type:'integer'}},feedback:{type:'string'},nextStep:{type:'string'}},required:['score','ratings','feedback','nextStep']}}}};
  const r=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body)});if(!r.ok)throw Error('AI service unavailable');const d=await r.json();const raw=d.output_text||d.output?.flatMap(x=>x.content||[]).find(x=>x.text)?.text;const parsed=JSON.parse(raw);return {...heuristic(task,response),...parsed,score:clamp(parsed.score),status:'ai-reviewed',method:'openai-structured-rubric-v1'};
 }catch(e){console.warn('AI assessment fallback:',e.message)} }
 return heuristic(task,response);
}
