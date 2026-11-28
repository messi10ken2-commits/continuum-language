import {stationTransitObstacles} from './continuum-world-transit.mjs';
// Shared city/scene contract. A world adds data and one outdoor renderer;
// movement, conversations, consent, missions and learning evidence stay shared.
export const worldDistricts=[
 {id:'tokyo',scene:'outdoors',title:'Tokyo · Komorebi Street',requires:null,station:'tokyo_station_hall'},
 {id:'osaka',scene:'osaka',title:'Osaka · Akari Canal',requires:'station-journey',station:'osaka_station_hall'},
];
const npc=(id,name,role,goal,line)=>({id,name,role,goal,line,x:0,z:-4.8,personality:'親切で地域の暮らしに詳しい',speech:'自然で分かりやすい丁寧語'});
export const expansionLocations=[
 {id:'tokyo_station_hall',district:'tokyo',title:'Asahi station concourse',sign:'あさひ駅・きっぷ窓口',x:0,z:-32,width:15,depth:8,height:5.2,door:{x:0,z:-26.5},interior:true,model:false,requires:'station-route',style:'station',npc:npc('sora','空','駅の窓口係','旅の計画を相談する','いらっしゃいませ。どちらへの旅をご相談ですか。')},
 {id:'tokyo_bookshop',district:'tokyo',title:'Aoba Bookshop',sign:'青葉書店',x:-24,z:15,width:18,depth:22,height:18,rotation:Math.PI/2,door:{x:-11.5,z:15},interior:true,requires:'park-meet',style:'books',color:0xb4b7b4,npc:npc('shiori','栞','書店員','読みたい本を探す','こんにちは。本や旅のガイドをお探しですか。')},
 {id:'tokyo_music',district:'tokyo',title:'Alley Music Room',sign:'路地の音楽室',x:-30,z:-31,width:8,depth:12,height:25,door:{x:-30,z:-24},interior:true,requires:'book-find',style:'music',color:0xc5c0b7,npc:npc('oto','音','音楽室の案内係','音楽体験を相談する','ようこそ。見学と体験、どちらをご希望ですか。')},
 {id:'tokyo_asahi',district:'tokyo',title:'Asahi community building',sign:'朝日ビル',x:29,z:-31,width:10,depth:12,height:22,door:{x:29,z:-24},interior:true,requires:'music-rehearse',style:'community',color:0x929c9f,npc:npc('kei','恵','交流サロンの受付係','交流イベントを計画する','こんにちは。街の交流会についてご案内します。')},
 {id:'osaka_station_hall',district:'osaka',title:'Akari Osaka station',sign:'大阪あかり駅・新幹線',x:17,z:14,width:11,depth:10,height:8,door:{x:17,z:20.5},interior:true,requires:'station-journey',style:'station',color:0x8eabae,npc:npc('yuu','悠','大阪駅の案内係','東京への帰り方を相談する','いらっしゃいませ。東京行きの新幹線は、案内表示に沿って改札からホームへお進みください。')},
 {id:'osaka_takoyaki',district:'osaka',title:'Akari Takoyaki',sign:'あかり たこ焼き',x:-17,z:-14,width:11,depth:10,height:8,door:{x:-17,z:-7.5},interior:true,requires:'station-journey',style:'food',color:0x99725c,npc:{...npc('nagi','凪','たこ焼き店の店員','好みに合わせて注文する','いらっしゃいませ。お味の好みを聞かせてもらえますか。'),personality:'気さくで料理の話が好き',speech:'自然な丁寧語。学習者が希望するときだけ短い大阪の表現を説明する'}},
 {id:'osaka_arcade',district:'osaka',title:'Akari shopping arcade',sign:'あかり商店街・案内所',x:17,z:-14,width:11,depth:10,height:10,door:{x:17,z:-7.5},interior:true,requires:'station-journey',style:'arcade',color:0x829792,npc:npc('mio','澪','商店街の案内係','商店街での過ごし方を相談する','ようこそ、あかり商店街へ。食べ歩きとお買い物、何に興味がありますか。')},
];
export const expansionScenes=Object.fromEntries(expansionLocations.map(l=>[l.id,{
 district:l.district,bounds:{minX:-7,maxX:7,minZ:-6,maxZ:6},spawn:{x:0,z:0},
 obstacles:[{x:0,z:-3.6,width:8,depth:1.4},...[-1,1].map(side=>({x:side*5.8,z:0,width:1.2,depth:6}))],
}]));
for(const l of expansionLocations.filter(l=>['books','community','arcade','food'].includes(l.style)))expansionScenes[l.id].obstacles.push(...[-1,1].map(side=>({x:side*3.6,z:1.4,width:2,depth:1.4})));

expansionScenes.tokyo_asahi.obstacles.push(...[-1,1].map(side=>({x:side*6.3,z:-4.8,width:.7,depth:.7})));
for(const place of expansionLocations.filter(l=>l.style==='station')){
 const scene=expansionScenes[place.id];
 for(const o of scene.obstacles)if(Math.abs(o.x)===5.8)o.x=Math.sign(o.x)*6.3;
 scene.bounds={minX:-7,maxX:21,minZ:-18.5,maxZ:6};
 scene.obstacles.push(...stationTransitObstacles.map(o=>({...o})));
}
expansionScenes.osaka={district:'osaka',outdoor:true,bounds:{minX:-26,maxX:26,minZ:-25,maxZ:24},spawn:{x:-7,z:6},obstacles:[
 {x:0,z:-14.5,width:8,depth:21},{x:0,z:14.5,width:8,depth:21},
 ...expansionLocations.filter(l=>l.district==='osaka').map(l=>({x:l.x,z:l.z,width:l.width,depth:l.depth})),
]};
export const worldChoices=[
 {id:'reading',title:'Choose your reading interest',requires:'book-find',options:[{id:'stories',title:'Stories and fiction',text:'小説や物語を読んでみたい'},{id:'travel',title:'Travel and local culture',text:'旅や街の文化を知りたい'},{id:'music',title:'Music and the arts',text:'音楽や芸術に触れたい'}]},
 {id:'journey',title:'Choose your Osaka plan',requires:'asahi-plan',options:[{id:'food',title:'Food and conversation',text:'食べ物を通じて会話を楽しみたい'},{id:'culture',title:'Shops and local culture',text:'商店街や地域の文化を知りたい'}]},
];
export const districtForScene=scene=>worldDistricts.find(d=>d.scene===scene)?.id||expansionLocations.find(l=>l.id===scene)?.district||'tokyo';
export const outdoorForLocation=place=>worldDistricts.find(d=>d.id===(place?.district||'tokyo'))?.scene||'outdoors';
export function worldJourney(awards=[],choices={},memoryEnabled=false,locations=[]){
 const done=new Set(awards.map(a=>a.mission_id));
 return {districts:worldDistricts.map(d=>({...d,unlocked:!d.requires||done.has(d.requires)})),
  places:locations.map(l=>({id:l.id,unlocked:!l.requires||done.has(l.requires),requires:l.requires||null})),
  choices:worldChoices.map(c=>({...c,unlocked:done.has(c.requires),selected:c.options.some(o=>o.id===choices[c.id])?choices[c.id]:null})),
  chapter:done.has('station-journey')?'osaka':done.has('park-meet')?'neighbourhood':'arrival',
  // Relationship progress is derived from game achievements only. Personal
  // familiarity remains subject to NPC-memory consent and confirmed summaries.
  relationships:memoryEnabled?locations.map(l=>({npcId:l.npc.id,activities:awards.filter(a=>a.location===l.id).length})):[],
 };
}
