import * as THREE from 'three';
import {expansionLocations} from './continuum-world-districts.mjs';
import {retailLabels} from './continuum-world-retail-details.mjs';
import {makeStationBoarding} from './continuum-world-transit.mjs';

// Fixtures stay inside the shared side/counter collision envelopes. Small stock
// is merged/instanced by material; it never adds hundreds of independent draws.
export function makeExpansionInterior(id,meshes){
 const place=expansionLocations.find(l=>l.id===id);if(!place)throw Error('Unsupported World interior');
 const root=new THREE.Group(),{shape,surface,sign}=meshes;root.name=place.title;
 const label=['books','arcade'].includes(place.style)?retailLabels(meshes,place.style):null;
 const wood=surface('wood',4,0x937354),steel=surface('metal',1,0x697777),wall=surface('concrete',5,0xdcd7c9);
 const box=(mat,p,s)=>shape(root,'box',mat,p,s);
 const panel=(text,p,w=3,bg='#294a49')=>sign(root,text,p,w,bg,['#e5daca','#e7dfcb'].includes(bg)?'#344843':'#faf4e5');
 box(surface('tile',8,0xd8d2c3),[0,-.1,0],[14,.2,12]);
 if(place.style==='station'){
  box(wall,[-1.75,2.6,-6.15],[10.5,5.2,.3]);
  box(wall,[6.75,2.6,-6.15],[.5,5.2,.3]);
  box(wall,[4.8,4.65,-6.15],[3.4,1.1,.3]);
 }else box(wall,[0,2.6,-6.15],[14.3,5.2,.3]);
 for(const side of [-1,1]){
  box(wall,[side*7.15,2.6,0],[.3,5.2,12]);
  box(wall,[side*4.1,2.6,6.15],[6,5.2,.3]);
  box(wood,[side*7.0,.17,0],[.07,.34,11.9]);
 }
 box(surface('concrete',4,0xe6e1d6),[0,5.3,0],[14,.2,12]);
 // One sign per reserved wall band; no two planes share the same footprint.
 if(place.style!=='food')panel(place.sign,[0,4.1,-5.95],5.4,({books:'#715a43',station:'#21485b',community:'#525f68',arcade:'#8c4133',music:'#303f4b'})[place.style]);
 panel('出口 / EXIT',[0,3.7,6.02],2.2,'#355d49').rotation.y=Math.PI;
 for(const x of [-4,0,4])for(const z of [-3,2]){
  box(steel,[x,5.12,z],[1.9,.08,.8]);
  shape(root,'box',0xffefd5,[x,5.06,z],[1.75,.025,.64],true);
 }
 const counterMat=place.style==='food'?steel:wood;
 box(counterMat,[0,.52,-3.6],[8,1.04,1.4]);box(surface('stone',2,0x454e4a),[0,1.08,-3.6],[8.15,.08,1.48]);
 panel(place.style==='books'?'本のご相談 ・ お会計':place.style==='station'?'きっぷ ・ ご案内':'ご案内 / INFORMATION',[0,.6,-2.88],3.1,'#e5daca');
 // POS, receipt printer, card reader and a bag shelf below the till.
 box(0x26383c,[2.8,1.4,-3.62],[.65,.46,.1]);box(steel,[2.8,1.17,-3.65],[.35,.18,.3]);
 box(0x314e52,[2.8,1.4,-3.555],[.54,.33,.015]);box(0xe2ded4,[3.4,1.23,-3.55],[.32,.22,.4]);
 box(0x253337,[2.1,1.18,-3.15],[.22,.1,.32]);
 const chair=(x,z,color=0x647b73)=>{
  box(color,[x,.47,z],[.55,.1,.55]);box(color,[x,.85,z-.24],[.55,.65,.07]);
  for(const dx of [-.21,.21])for(const dz of [-.21,.21])box(steel,[x+dx,.24,z+dz],[.045,.48,.045]);
 };
 const shelf=(side,z,length=2.7)=>{
  const x=side*5.8;
  box(wood,[x+side*.53,1.45,z],[.09,2.9,length]);
  for(const dz of [-length/2,length/2])box(wood,[x,1.45,z+dz],[1.15,2.9,.08]);
  for(let row=0;row<5;row++)box(wood,[x,.25+row*.55,z],[1.15,.055,length]);
 };
 if(place.style==='books'){
  const colors=[0x8a5448,0x708e83,0xd2ba7f,0x3c5975,0xc8c3b7,0x9c7492];
  for(const side of [-1,1])for(const z of [-1.6,1.6]){
   shelf(side,z,2.6);
   for(let row=0;row<5;row++)for(let n=0;n<15;n++){
    const x=side*5.8,zz=z-1.18+n*.16,h=.33+(n%4)*.035;
    box(colors[(n+row*2)%6],[x-side*.15,.3+row*.55+h/2,zz],[.72,h,.105]);
    label(root,(n+row)%8,[x-side*.518,.3+row*.55+h/2,zz],.1,h,-side*Math.PI/2);
   }
  }
  panel('文学 ・ 小説',[-5.18,3.25,0],2.4).rotation.y=Math.PI/2;
  panel('旅 ・ 暮らし',[5.18,3.25,0],2.4).rotation.y=-Math.PI/2;
  panel('新刊 ・ スタッフのおすすめ',[0,2.6,-5.94],4.2,'#765d45');
  for(let i=0;i<8;i++){
   const x=-3.2+i*.8;box(wood,[x,1.75,-5.5],[.7,.07,.55]);
   box(colors[i%6],[x,2.02,-5.56],[.46,.5,.07]);
   panel(['旅の手帖','街を歩く','短編集','ことば'][i%4],[x,2.02,-5.51],.42,'#e7dfcb');
  }
 }else if(place.style==='food'){
  panel('たこ焼き 6個 480円 ・ 8個 620円',[0,4,-5.94],6,'#743a29');
  box(steel,[0,1.12,-4.8],[7,.12,.75]);
  for(const x of [-2.7,-.9,.9]){
   box(0x222a29,[x,1.21,-4.8],[1.6,.08,.6]);
   for(let row=0;row<3;row++)for(let n=0;n<6;n++){
    shape(root,'cylinder',0x121c1b,[x-.64+n*.25,1.258,-5+row*.2],[.095,.012,.095]);
    shape(root,'sphere',0xc18c48,[x-.64+n*.25,1.29,-5+row*.2],[.085,.07,.085]);
   }
  }
  box(steel,[0,2.65,-5.3],[7,.45,.95]);
  for(const x of [-2,0,2])box(0x303e3c,[x,2.4,-5.25],[1.5,.04,.6]);
  box(steel,[3.85,3.7,-5.5],[.7,2.3,.45]);
  for(const side of [-1,1]){
   box(wood,[side*5.8,.9,0],[1.15,1.8,5.4]);box(steel,[side*5.8,1.83,0],[1.2,.06,5.5]);
   for(let n=0;n<8;n++){
    const z=-2.25+n*.65;shape(root,'cylinder',[0x62412c,0xdbc68d,0x3b6144][n%3],[side*5.8,2.02,z],[.09,.32,.09]);
   }
   panel(side<0?'ソース ・ だし醤油':'青のり ・ かつお節',[side*5.14,2.65,0],3,'#743a29').rotation.y=-side*Math.PI/2;
  }
  for(const x of [-3.3,-2.5,-1.7]){
   box(0xd7be85,[x,1.16,-3.35],[.55,.05,.3]);
   for(let n=0;n<6;n++)shape(root,'sphere',0xb98240,[x-.17+(n%3)*.17,1.24,-3.44+Math.floor(n/3)*.17],[.078,.072,.078]);
  }
 }else if(place.style==='station'){
  panel('新幹線 → 改札・ホーム',[.2,2.65,-5.94],4.4,'#21485b');
  for(const side of [-1,1])for(const z of [-1.7,1.7]){
   box(steel,[side*6.3,1.05,z],[1.1,2.1,1.4]);
   const g=new THREE.Group();g.position.set(side*5.71,0,z);g.rotation.y=-side*Math.PI/2;root.add(g);
   shape(g,'box',0x192e36,[0,1.48,0],[1.05,.58,.03]);
   sign(g,'きっぷ ・ Ticket',[0,1.48,.025],.95,'#287472');
   shape(g,'box',0x1d292e,[0,.82,.01],[.65,.12,.05]);
   for(let n=0;n<3;n++)shape(g,'box',0xcdd4c9,[-.3+n*.3,1.02,.04],[.18,.07,.04]);
  }
  makeStationBoarding(root,meshes,id);
 }else if(place.style==='community'){
  panel('交流サロン ・ 2F / 学習室 ・ 3F',[0,2.65,-5.94],4.7,'#525f68');
  // Brushed lift doors, call button and floor indicator make this read as a
  // real mixed-use building lobby, alongside the staffed event reception.
  box(steel,[5.55,1.45,-5.85],[2.25,2.9,.15]);
  for(const x of [5.02,6.08])box(0xb0b9b7,[x,1.4,-5.75],[1.02,2.75,.035]);
  box(0x304245,[5.55,1.4,-5.72],[.035,2.7,.015]);
  panel('1F  ▲',[5.55,3.15,-5.74],1.4,'#243c42');
  box(0x38494b,[4.23,1.2,-5.72],[.15,.3,.06]);
  shape(root,'sphere',0xe0c59a,[4.23,1.25,-5.68],[.035,.035,.012],true);
  for(const side of [-1,1]){
   shape(root,'cylinder',surface('stone',1,0xa39b82),[side*6.3,.28,-4.8],[.3,.56,.3]);
   for(let i=0;i<7;i++){
    const a=i*2.4;shape(root,'cylinder',0x607a4d,[side*6.3+Math.sin(a)*.13,.95,-4.8+Math.cos(a)*.13],[.018,.9,.018]);
    const leaf=shape(root,'sphere',0x608059,[side*6.3+Math.sin(a)*.27,1.2+i*.065,-4.8+Math.cos(a)*.27],[.2,.11,.35]);leaf.rotation.y=a;
   }
  }

  for(const side of [-1,1]){
   box(wood,[side*5.8,.38,0],[1.1,.76,.6]);
   for(const z of [-1.6,1.6]){
    chair(side*5.75,z+.65);box(wood,[side*5.8,.77,z],[1.05,.08,1.3]);
    box(0xded6bd,[side*5.8,.83,z],[.45,.025,.6]);
   }
   panel(side<0?'地域のイベント ・ 参加受付':'朝日ビル / フロアガイド',[side*5.14,2.8,0],3,'#686b56').rotation.y=-side*Math.PI/2;
   for(let n=0;n<5;n++)box([0xceaf6c,0x8fa69a,0xd2cdc0][n%3],[side*6.96,2.2,-2+n],[.03,.65,.7]);
  }
 }else if(place.style==='arcade'){
  panel('食べ歩き ・ おみやげ ・ 商いの街',[0,2.65,-5.94],5.2,'#8c4133');
  for(const side of [-1,1])for(const z of [-1.6,1.6]){
   shelf(side,z,2.6);
   for(let row=0;row<4;row++)for(let n=0;n<7;n++){
    const zz=z-1.05+n*.34;
    box([0xbe7451,0xc9ad6d,0x758e7a,0xe0d5b9][(n+row)%4],[side*5.8,.48+row*.55,zz],[.7,.35,.28]);
    label(root,(n+row)%8,[side*5.44,.48+row*.55,zz],.26,.33,-side*Math.PI/2);
   }
   panel(z<0?'大阪みやげ':'商店街の逸品',[side*5.16,3.15,z],2.2,'#8c4133').rotation.y=-side*Math.PI/2;
  }
  for(let n=0;n<9;n++)box([0xc6ab6e,0xa3533e,0x6c8a7a][n%3],[-3.2+n*.65,1.22,-3.5],[.48,.23,.45]);
 }else{
  panel('見学 ・ 演奏体験 ・ レッスン',[0,2.65,-5.94],4.5);
  for(const side of [-1,1])for(const z of [-1.6,1.6]){
   box(0x2c373b,[side*5.8,1,z],[1.1,2,1.4]);
   for(const y of [.6,1.4])shape(root,'sphere',0x101c20,[side*5.2,y,z],[.06,.32,.32]);
  }
  box(0x242b30,[0,1.6,-5.6],[3,.22,.5]);
  for(let i=0;i<24;i++){box(0xe3dece,[-1.4+i*.12,1.73,-5.5],[.105,.025,.32]);if(i%7!==2&&i%7!==6)box(0x172328,[-1.35+i*.12,1.77,-5.63],[.05,.06,.17]);}
 }
 if(['books','community','arcade','food'].includes(place.style))for(const side of [-1,1]){
  const x=side*3.6,z=1.4;
  box(wood,[x,.38,z],[1.7,.76,1.1]);box(wood,[x,.79,z],[2,.08,1.4]);
  if(place.style==='books')for(let n=0;n<9;n++){
   box([0xa25745,0xc8b076,0x6d8e80][n%3],[x-.7+(n%3)*.65,.88+Math.floor(n/3)*.06,z-.35+(n%2)*.6],[.48,.055,.48]);
  }
  else if(place.style==='arcade')for(let n=0;n<8;n++)shape(root,'sphere',[0xc77941,0xbcb651,0x66834f][n%3],[x-.65+(n%4)*.43,.95,z-.25+Math.floor(n/4)*.5],[.15,.15,.15]);
  else if(place.style==='community'){
   box(0xded6bd,[x,.85,z],[.7,.025,.5]);box(0x39555e,[x,.99,z-.2],[.65,.3,.04]);
  }else{
   for(const dx of [-.5,.5]){shape(root,'cylinder',0xe3d9b9,[x+dx,.95,z],[.11,.25,.11]);box(0x354d43,[x+dx,.88,z+.4],[.28,.035,.18]);}
  }
 }
 return meshes.batch(root);
}
