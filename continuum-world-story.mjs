import {worldJourney,worldChoices,districtForScene} from './continuum-world-districts.mjs';
import {worldLocations} from './continuum-world-model.mjs';
import {worldMission} from './continuum-world-missions.mjs';
export function worldStory(awards,choices={},memory=false){
 return worldJourney(awards.map(a=>({...a,location:worldMission(a.mission_id)?.location})),choices,memory,worldLocations);
}
export function allowedWorldChoice(id,value,awards){
 const c=worldChoices.find(c=>c.id===id);
 return !!c&&c.options.some(o=>o.id===value)&&awards.some(a=>a.mission_id===c.requires);
}
export function storyConversation(place,mission,level,choices={},hour=(new Date().getUTCHours()+9)%24){
 const selected=worldChoices.flatMap(c=>c.options.filter(o=>o.id===choices[c.id])).map(o=>o.text);
 const period=hour<6||hour>=18?'evening':hour<12?'morning':'afternoon';
 const events={books:['旅の本の小さな展示','物語を選ぶ読書案内'],music:['静かな楽器体験','小さな音楽ワークショップ'],community:['まちの交流会','大阪の旅を語る集まり'],station:['旅の経路を比べる相談','出発前の乗り換え確認'],food:['だしの味を相談する日','ソースと薬味を比べる日'],arcade:['商店街の散策案内','地域のことばを聞く小さな交流']};
 const variants=events[place.style]||['今日のおすすめ','ゆっくり過ごす街歩き'];
 const day=Math.floor((Date.now()+9*3600000)/86400000);
 return {district:districtForScene(place.id),mission:mission.id,level,period,event:variants[(day+(period==='evening'?1:0))%variants.length],playerChoices:selected,
 instruction:'This is a fictional present-day scene. Adapt sentence length and politeness to the supplied level. Mention choices only when relevant. Do not claim previous acquaintance, private preferences or remembered dialogue without confirmed NPC memories. Osaka expressions are optional explanations, never required to pass. No real tickets, purchases or bookings.'};
}

export function storyOpening(place,mission,level,choices={},hour){
 if(!place.style)return place.npc.line;
 const scene=storyConversation(place,mission,level,choices,hour);
 const questions={books:'どんな本をお探しですか。',music:'どんな音楽がお好きですか。',community:'どんな交流会に興味がありますか。',station:'どちらへ行きたいですか。',food:'どんな味がお好きですか。',arcade:'今日は何を楽しみたいですか。'};
 return (scene.period==='evening'?'こんばんは。':'こんにちは。')+(level==='A1'?'':`今日は${scene.event}をご案内しています。`)+questions[place.style];
}
