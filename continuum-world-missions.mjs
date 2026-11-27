import {worldLocations} from './continuum-world-model.mjs';
const rows=[
 ['cafe-order','tokyo_cafe','main','はじめての注文',['Order a drink politely.','Explain a preference or ask about an option.','Confirm your order.']],
 ['shop-buy','tokyo_konbini','main','コンビニで買い物',['Ask to buy an item.','Discuss the bag or payment.','Confirm the purchase politely.'],'cafe-order'],
 ['station-route','tokyo_station','main','街の道案内',['Ask how to reach a destination.','Ask about a route or transfer.','Confirm your understanding.'],'shop-buy'],
 ['park-meet','tokyo_park','main','東京で友達を作る',['Introduce yourself without requiring personal contact details.','Ask a relevant friendly question.','Respond and close naturally.'],'station-route'],
 ['cafe-permission','tokyo_cafe','side','席を使ってもいいですか',['Ask permission to use a seat or facility.','Explain a small preference.','Acknowledge the answer politely.']],
 ['cafe-recommend','tokyo_cafe','side','おすすめを聞く',['Ask for a recommendation.','Explain your taste.','Choose or clarify an option.']],
 ['shop-payment','tokyo_konbini','side','支払い方法を相談',['Ask about a payment method.','Respond to the proposed option.','Confirm your choice.']],
 ['shop-bag','tokyo_konbini','side','袋と温めを相談',['Discuss whether you need a bag or heating.','Make a specific request.','Confirm the result politely.']],
 ['station-check','tokyo_station','side','乗り換えを確かめる',['Ask a question about a transfer.','Clarify a detail you did not understand.','Restate the useful information.']],
 ['station-access','tokyo_station','side','歩きやすい道を探す',['Ask for an accessible or quieter route.','Explain a practical constraint without private health details.','Confirm a useful direction.']],
 ['park-weather','tokyo_park','side','季節の雑談',['Start a conversation about the weather or season.','Share an opinion and reason.','Ask a relevant follow-up question.']],
 ['park-plan','tokyo_park','side','次のお出かけ',['Suggest a fictional local activity.','Discuss a preference or time.','Agree on a simple plan without exchanging contact details.']],
 ['daily-cafe','tokyo_cafe','daily','今日のひとこと：カフェ',['Ask a natural question about today’s fictional menu.','Respond to the answer.','Close politely.']],
 ['daily-shop','tokyo_konbini','daily','今日のひとこと：買い物',['Ask about an item or alternative.','Explain a preference.','Acknowledge the answer.']],
 ['daily-station','tokyo_station','daily','今日のひとこと：案内',['Ask about a fictional destination.','Clarify one detail.','Thank the staff.']],
 ['daily-park','tokyo_park','daily','今日のひとこと：公園',['Start a short friendly conversation.','Share a non-sensitive preference.','Ask a follow-up question.']],
];
export const worldMissions=rows.map(([id,location,type,title,goals,requires])=>({id,location,type,title,goals,requires:requires||null,xp:type==='main'?80:type==='side'?30:15}));
export const worldMission=id=>worldMissions.find(m=>m.id===id);
export function worldScenario(id){
 const mission=worldMissions.find(m=>'world-'+m.id===id);if(!mission)return null;
 const place=worldLocations.find(l=>l.id===mission.location),npc=place.npc;
 return {id,worldLocation:place.id,missionId:mission.id,title:mission.title,role:`${npc.name}, a ${npc.role} at fictional ${place.title} in Tokyo; ${npc.personality}; ${npc.speech}. Never request addresses, contacts, secrets or real payment.`,goals:mission.goals,opening:{ja:npc.line}};
}
export const worldDay=(at=Date.now())=>new Date(at+9*3600000).toISOString().slice(0,10);
export function availableWorldMissions(awards=[],day=worldDay()){
 const done=new Set(awards.map(a=>a.mission_id)),daily=worldMissions.filter(m=>m.type==='daily'),index=Math.floor(Date.parse(day)/86400000)%daily.length;
 return worldMissions.filter(m=>m.type!=='daily'||[daily[index].id,daily[(index+1)%daily.length].id].includes(m.id)).map(m=>({...m,locked:!!m.requires&&!done.has(m.requires),completed:awards.some(a=>a.mission_id===m.id&&(m.type!=='daily'||a.day===day))}));
}
export function worldGoalEvidence(review,messages){
 const words=messages.filter(m=>m.role==='user').map(m=>m.text);
 return (review?.goals||[]).map((g,i)=>{
  const achieved=g.achieved===true&&g.assessed!==false&&typeof g.evidence==='string'&&!!g.evidence.trim()&&words.some(w=>w.includes(g.evidence));
  return {goal:i,achieved,quote:achieved?g.evidence.slice(0,300):''};
 });
}
const memoryTopics={
 'cafe-order':'お飲み物のご注文','cafe-permission':'お席のご利用','cafe-recommend':'おすすめのメニュー',
 'shop-buy':'ほしマートでのお買い物','shop-payment':'お支払い方法','shop-bag':'袋や温めのご希望',
 'station-route':'目的地までの行き方','station-check':'乗り換え','station-access':'歩きやすい道',
 'park-meet':'自己紹介','park-weather':'季節のお話','park-plan':'近くのお出かけ先',
 'daily-cafe':'今日のメニュー','daily-shop':'商品の選び方','daily-station':'街の道案内','daily-park':'公園での過ごし方'
};
export const memorySummary=mission=>`前回は${memoryTopics[mission.id]}についてお話ししましたね。`;
