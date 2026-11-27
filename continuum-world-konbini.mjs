import * as THREE from 'three';
import {hoshiProductFactory,hoshiPackage} from './continuum-world-konbini-products.mjs';

import {hoshiInteriorFixtures} from "./continuum-world-konbini-layout.mjs";
function floorPaint(c,size) {
  c.fillStyle='#d9d5c5';c.fillRect(0,0,size,size);
  const tile=size/20;
  for(let x=0;x<20;x++)for(let y=0;y<20;y++){
    c.fillStyle=['#eeeade','#e9e5d9','#eeeadf','#e6e3d7'][(x*7+y*3)%4];
    c.fillRect(x*tile+1,y*tile+1,tile-2,tile-2);
    c.strokeStyle='#ffffff55';c.strokeRect(x*tile+2,y*tile+2,tile-4,tile-4);
  }
}
function shell(meshes,root) {
  const {shape,surface,special,sign}=meshes;
  const floor=meshes.canvasMaterial('Hoshi polished ceramic floor',floorPaint,{roughness:.27,metalness:.04});
  shape(root,'box',floor,[0,-.1,0],[14,.2,12]);
  const wall=surface('concrete',[7,2],0xf1eee4), metal=0x9babae;
  shape(root,'box',surface('wood',[7,2],0xcdb995),[0,1.9,-6],[14,3.8,.18]);
  shape(root,'box',0xe8e9e3,[0,3.78,0],[14,.15,12]);
  for(const side of [-1,1]) {
    shape(root,'box',wall,[side*7,1.9,0],[.18,3.8,12]);
    shape(root,'box',surface('wood',[7,1],0xcdba99),[0,2.85,side*5.94],[13.8,.5,.04]);
    for(const x of [side*4.35])shape(root,'box',wall,[x,.25,6],[5.3,.5,.15]);
  }
  const glass=special('Hoshi display glass',{color:0xe6f2f3,roughness:.1,metalness:.06,transparent:true,opacity:.12,depthWrite:false});
  for(const side of [-1,1])shape(root,'box',glass,[side*4.35,1.75,5.98],[5.2,2.45,.025]);
  for(const x of [-6.9,-4.3,-1.65,-1.25,1.25,1.65,4.3,6.9])shape(root,'box',metal,[x,1.6,5.94],[.045,3.1,.065]);
  // Broad entry glazing, metal door rails and an outside pavement with depth.
  for(const side of [-1,1]) {
    const door=new THREE.Group();door.name='Hoshi automatic sliding door';
    door.position.x=side*.62;door.userData.hoshiDoorSide=side;root.add(door);
    const pane=shape(door,'box',glass,[0,1.43,5.98],[1.18,2.8,.025]);
    const stile=shape(door,'box',metal,[side*.59,1.43,5.94],[.035,2.8,.055]);
    for(const part of [pane,stile]){part.userData.worldBatch=false;part.castShadow=false;}
  }
  shape(root,'box',metal,[0,2.87,5.96],[2.55,.1,.14]);
  shape(root,'box',0x35434a,[0,.012,4.95],[2.2,.02,1.15]);
  shape(root,'box',surface('paving',[7,3]),[0,-.06,8],[16,.08,4]);
  shape(root,'box',0x657e88,[0,2.6,12],[18,5.2,1]);
  const exit=sign(root,'出口 EXIT',[0,3.25,5.84],1.1,'#27604f');exit.rotation.y=Math.PI;
  const led=special('Hoshi cool LED',{color:0xffffff,emissive:0xf4fcff,emissiveIntensity:2.2,toneMapped:false});
  for(const x of [-4.7,0,4.7])for(const z of [-4,0,4]) {
    shape(root,'box',0xb8c0bc,[x,3.63,z],[2.9,.09,.23]);
    shape(root,'box',led,[x,3.575,z],[2.75,.025,.16]).castShadow=false;
  }
  for(const x of [-3.2,3.2]) {
    shape(root,'box',0xcdd2ce,[x,3.64,-1.8],[1.1,.12,1.1]);
    for(let n=-3;n<=3;n++)shape(root,'box',0x8d9997,[x,3.57,-1.8+n*.12],[.8,.02,.035]);
  }
  if(meshes.physical)for(const z of [-2,2.5]) {
    const lamp=new THREE.PointLight(0xf1f8ff,8,10,2);lamp.position.set(0,3.35,z);root.add(lamp);
  }
  return {glass,led};
}
function rack(meshes,root,goods,x,z,width,depth,category) {
  const {shape,sign}=meshes, rack=new THREE.Group();rack.name='Hoshi stocked gondola';rack.position.set(x,0,z);root.add(rack);
  const metal=0xcdd5d1;
  shape(rack,'box',0xe4e8e0,[0,.12,0],[width,.22,depth]);
  shape(rack,'box',metal,[0,1.05,0],[.055,1.95,depth]);
  for(const end of [-depth/2,depth/2]) {
    shape(rack,'box',0xe6e9df,[0,.18,end],[width,.12,.055]);
    for(const dx of [-width/2,width/2])shape(rack,'box',metal,[dx,.95,end],[.035,1.9,.035]);
  }
  for(let level=0;level<5;level++) {
    const y=.25+level*.335;
    shape(rack,'box',0xf1f2e9,[0,y,0],[width,.035,depth]);
    for(const side of [-1,1]) {
      shape(rack,'box',0xc2cdc9,[side*(width/2-.015),y-.035,0],[.025,.075,depth]);
      for(let labelZ=-depth/2+.22;labelZ<depth/2;labelZ+=.48) {
        const label=sign(rack,level%2?'¥158':'¥138',[side*(width/2+.003),y-.03,labelZ],.22,'#f4f1e5','#454d42');
        label.scale.y=.055;label.rotation.y=side*Math.PI/2;
      }
      const spacing=level===0?.11:.24;
      for(let n=0;n<Math.floor(depth/spacing);n++) {
        const index=level===0?n%4:4+(n+level+category)%4;
        const {size,kind}=hoshiPackage(index),h=size[1],front=width/2-.07-size[2]/2;
        const z=-depth/2+spacing*.6+n*spacing;
        goods(rack,index,[side*front,y+.025+h/2,z],size,kind,side*Math.PI/2);
        if(n%3!==1)goods(rack,index,[side*(front-size[2]-.04),y+.025+h/2,z],size,kind,side*Math.PI/2);
      }
    }
  }
  for(const end of [-1,1])for(let level=0;level<5;level++)for(const side of [-1,1]) {
    const index=4+(level+category+side+2)%4,{size,kind}=hoshiPackage(index);
    goods(rack,index,[side*width*.27,.275+level*.335+size[1]/2,end*(depth/2-size[2]/2-.05)],size,kind,end<0?Math.PI:0);
  }
  const board=sign(rack,category%2?'お菓子 ・ チョコレート':'飲料 ・ 日用品',[0,2.08,depth/2+.04],Math.max(1,width+.2),'#f0f2e6','#315b52');board.scale.y=.30;
}
function refrigeratedWall(meshes,root,goods,glass,led,side) {
  const {shape,sign}=meshes, yaw=-side*Math.PI/2;
  shape(root,'box',0x909e9e,[side*6.96,1.3,-1],[.08,2.6,6]);
  shape(root,'box',0xe9eee8,[side*6.91,1.3,-1],[.025,2.4,5.86]);
  for(const y of [.12,2.6])shape(root,'box',0x909e9e,[side*6.65,y,-1],[.65,.12,6]);
  for(const z of [-4,2])shape(root,'box',0x909e9e,[side*6.65,1.3,z],[.65,2.6,.05]);
  for(let bay=0;bay<5;bay++) {
    const z=-3.4+bay*1.2;
    for(const y of [.38,.84,1.30,1.76,2.22]) {
      shape(root,'box',0xc8d2ce,[side*6.48,y,z],[.43,.035,1.14]);
      const count=side>0?12:5,spacing=side>0?.092:.215;
      for(let n=0;n<count;n++) {
        const index=side>0?(bay+n)%4:8+(bay+n)%5,{size,kind}=hoshiPackage(index);
        goods(root,index,[side*(6.29+size[2]/2+.035),y+.025+size[1]/2,z-(count-1)*spacing/2+n*spacing],size,kind,yaw);
      }
    }
    shape(root,'box',glass,[side*6.28,1.38,z],[.022,2.25,1.14]);
    for(const end of [-.59,.59])shape(root,'box',0x768b8e,[side*6.25,1.38,z+end],[.04,2.3,.035]);
    shape(root,'box',0xd6dfdd,[side*6.22,1.3,z+.44],[.045,.65,.035]);
    shape(root,'box',led,[side*6.3,2.49,z],[.045,.035,1.04]).castShadow=false;
  }
  const header=sign(root,side>0?'冷たい飲み物　 /　 DRINKS':'お弁当 ・ おにぎり ・ サンドイッチ',[side*6.25,2.72,-1],5.4,'#edf1e7','#3b655b');header.rotation.y=yaw;header.scale.y=.35;
}
function checkout(meshes,root,goods,glass) {
  const {shape,surface,sign}=meshes;
  shape(root,'box',0xe8e8dc,[0,.5,-3.6],[8,1,1.4]);
  shape(root,'box',surface('wood',[6,1],0x9c805f),[0,.5,-2.885],[8,.86,.025]);
  shape(root,'box',0x4a514c,[0,1.04,-3.6],[8.1,.08,1.48]);
  for(const x of [-1.25,1.25]) {
    shape(root,'box',0x324143,[x,1.2,-3.43],[.22,.3,.25]);
    const pos=shape(root,'box',0x38484c,[x,1.45,-3.34],[.51,.36,.055]);pos.rotation.x=-.12;
    const display=sign(root,'HOSHI　¥ 580',[x,1.45,-3.3],.43,'#c7ddd5','#34554d');display.scale.y=.42;
    shape(root,'box',0x202b30,[x+.36,1.16,-3.12],[.18,.12,.24]);
    shape(root,'box',0x81c1b0,[x+.36,1.225,-3.10],[.13,.012,.12]);
    shape(root,'box',0xabb7b1,[x-.3,1.095,-3.14],[.24,.022,.34]);
  }
  // Counter hot-food case, coffee machine, cups and small impulse-buy products.
  shape(root,'box',glass,[2.9,1.42,-3.55],[1.25,.68,.7]);
  for(const y of [1.19,1.48]) {
    shape(root,'box',0x949f98,[2.9,y,-3.55],[1.15,.035,.64]);
    for(let n=0;n<4;n++)goods(root,11,[2.48+n*.27,y+.07,-3.48],[.21,.09,.17],'bag');
  }
  shape(root,'box',0x3d4949,[-2.9,1.55,-3.65],[.7,.92,.66]);
  shape(root,'box',0xabb5b0,[-2.9,1.27,-3.28],[.6,.06,.22]);
  for(const x of [-3.05,-2.78])shape(root,'cylinder',0xf2efdc,[x,1.37,-3.22],[.065,.14,.065]);
  const coffee=sign(root,'挽きたて珈琲　150円',[-2.9,2.2,-3.58],1.5,'#343b35');coffee.scale.y=.3;
  for(let n=0;n<8;n++)goods(root,6,[-.48+n*.13,1.16,-3.02],[.1,.17,.055]);
  sign(root,'ほしマート',[0,3.05,-5.85],4,'#ecf0e5','#256752');
  const service=sign(root,'お会計　　宅配便 ・ 公共料金',[0,2.42,-5.85],4.7,'#edf0e4','#375d50');service.scale.y=.35;
  shape(root,'box',0xbac5bd,[5.75,1.0,-5.35],[.95,2,.65]);
  sign(root,'ATM',[5.75,2.2,-4.99],.85,'#ad4b3a').scale.y=.4;
  shape(root,'box',0x314c56,[5.75,1.38,-4.99],[.52,.4,.025]);
}
export function makeHoshiInterior(meshes) {
  const root=new THREE.Group();root.name='Hoshi convenience store: stocked aisles, refrigerated wall and checkout';
  const goods=hoshiProductFactory(meshes), {glass,led}=shell(meshes,root);
  checkout(meshes,root,goods,glass);
  for(const side of [-1,1]) {
    rack(meshes,root,goods,side*4.4,-.2,1.5,5,side+1);
    rack(meshes,root,goods,side*1.85,1.25,1.1,2.5,side+2);
    refrigeratedWall(meshes,root,goods,glass,led,side);
    const x=side*4.8,z=4.65;
    shapeFreezer(meshes,root,goods,glass,x,z);
  }
  root.userData.hoshiFixtures=hoshiInteriorFixtures;
  root.userData.stockedProducts=goods.count;
  return meshes.batch(root);
}
function shapeFreezer(meshes,root,goods,glass,x,z) {
  const {shape,sign}=meshes;
  shape(root,'box',0xe4e9e1,[x,.12,z],[2.1,.24,.9]);
  for(const dz of [-.43,.43])shape(root,'box',0xe4e9e1,[x,.55,z+dz],[2.1,.62,.04]);
  for(const dx of [-1.03,1.03])shape(root,'box',0xe4e9e1,[x+dx,.55,z],[.04,.62,.9]);
  shape(root,'box',0x9daea7,[x,.74,z],[2,.025,.8]);
  shape(root,'box',0x687e80,[x,.86,z],[2.12,.055,.93]);
  shape(root,'box',glass,[x,.9,z],[2.02,.025,.8]);
  for(let n=0;n<9;n++)goods(root,13+n%3,[x-.87+n*.215,.78,z],[.18,.025,.57]);
  sign(root,'アイス ・ 冷凍食品',[x,.55,z+.46],1.75,'#ecf2e7','#486653').scale.y=.25;
}

// Visible through the street glazing; independent light-weight display geometry
// uses the same packaging as the enterable room without rendering a second room.
export function dressHoshiExterior(meshes,group,{width,depth}) {
  const {shape,surface,special,sign}=meshes,face=depth/2,goods=hoshiProductFactory(meshes,{radialSegments:6});
  const metal=surface('metal',1,0xa6b5b4);
  const led=special('Hoshi storefront LED',{color:0xffffff,emissive:0xe8fff2,emissiveIntensity:1.8,toneMapped:false});
  for(const side of [-1,1]) {
    const x=side*(width/4+.55),w=width/2-1.6;
    shape(group,'box',0xf0f0e3,[x,3.08,face-.9],[w,.055,.18]);
    shape(group,'box',led,[x,3.045,face-.9],[w-.1,.018,.13]).castShadow=false;
    // Open refrigerated case: back, shelves and individually labelled goods.
    shape(group,'box',0xe1e9e2,[x,1.2,face-2.15],[w,2.35,.08]);
    for(let row=0;row<4;row++) {
      const y=.28+row*.52;
      shape(group,'box',0xe6ece5,[x,y,face-1.8],[w,.035,.65]);
      shape(group,'box',metal,[x,y-.025,face-1.46],[w,.065,.025]);
      const count=Math.floor(w/(row<2?.24:.12)),spacing=w/count;
      for(let n=0;n<count;n++) {
        const index=row<2?8+(n+row)%5:n%4,{size,kind}=hoshiPackage(index);
        goods(group,index,[x-w/2+spacing/2+n*spacing,y+.025+size[1]/2,face-1.73],size,kind);
      }
    }
    // Reflective mullions and a small service decal remain on the real glazing.
    for(const edge of [-w/2,w/2])shape(group,'box',metal,[x+edge,1.7,face+.055],[.045,3.1,.065]);
  }
  shape(group,'box',0x334641,[0,2.82,face+.04],[2.02,.065,.1]);
  shape(group,'box',0xc9d5ce,[0,3.17,face+.06],[2.35,.17,.24]);
  shape(group,'box',0x253b3f,[0,3.14,face+.19],[.18,.075,.04]);
  for(const x of [-.5,.5])shape(group,'box',0x46a491,[x,1.12,face+.06],[.92,.045,.018]);
  const payment=sign(group,'各種カード ・ 電子マネー',[.52,1.72,face+.065],.78,'#e8efe4','#31574d');payment.scale.y=.35;
  // Bin cabinets and parcel/umbrella stand stay inside the facade collider.
  for(const x of [-width/2+.65,-width/2+1.25]) {
    shape(group,'box',0xc7d0c9,[x,.5,face-.28],[.5,1,.45]);
    shape(group,'box',0x334843,[x,.86,face-.038],[.28,.11,.015]);
  }
  const bin=sign(group,'びん・缶　／　ペットボトル',[-width/2+.95,.67,face-.025],1.05,'#e5eadd','#4b5f4f');bin.scale.y=.19;
  shape(group,'box',0x788d89,[width/2-.6,.36,face-.28],[.48,.72,.48]);
  for(let n=0;n<5;n++)shape(group,'cylinder',0x738b9d,[width/2-.76+n*.075,.8,face-.26],[.015,.85,.015]);
  group.userData.stockedWindowProducts=goods.count;
}
