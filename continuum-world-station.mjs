import * as THREE from 'three';
import {stationLayout as plan} from './continuum-world-station-layout.mjs';
import {makeStreetTree} from './continuum-world-street-art.mjs';

function disc(meshes,parent,rx,rz,x,z,y,material,inner=null) {
  const outline=new THREE.Shape();
  outline.absellipse(0,0,rx,rz,0,Math.PI*2,false,0);
  if(inner){const hole=new THREE.Path();hole.absellipse(0,0,inner[0],inner[1],0,Math.PI*2,true,0);outline.holes.push(hole);}
  const mesh=meshes.custom(parent,new THREE.ShapeGeometry(outline,40),material);
  mesh.rotation.x=-Math.PI/2;mesh.position.set(x,y,z);mesh.castShadow=false;
  return mesh;
}

export function makeStationDistrict(meshes,parent) {
  const {shape,sign,surface,special}=meshes, root=new THREE.Group();
  root.name='Asahi station, forecourt, platforms and railway';parent.add(root);
  const metal=surface('metal',1,0x536068), pale=0xd4d3ca, dark=0x26343e;
  const plaza=surface('paving',[11,7.5],0xd6d5cc);
  shape(root,'box',plaza,[0,.04,plan.forecourt.z],[22,.03,15]).castShadow=false;
  const r=plan.rotary,i=plan.island;
  disc(meshes,root,r.rx+.18,r.rz+.18,r.x,r.z,.061,0xbdbbb1,[r.rx,r.rz]);
  disc(meshes,root,r.rx,r.rz,r.x,r.z,.063,surface('asphalt',[1/3,1/3]),[i.rx+.18,i.rz+.18]);
  disc(meshes,root,i.rx+.18,i.rz+.18,i.x,i.z,.07,0xbdbbb1);
  disc(meshes,root,i.rx,i.rz,i.x,i.z,.085,surface('grass',.5,0x96a381));
  for(const [n,x] of [-.9,.9].entries())makeStreetTree(meshes,root,x,i.z,n+30);
  // Broken lane paint and a marked pedestrian crossing give the loop a road scale.
  for(let n=0;n<24;n++) {
    const a=n*Math.PI*2/24;
    const mark=shape(root,'box',0xe8e3d1,[6*Math.cos(a),.073,plan.rotary.z+3.55*Math.sin(a)],[.5,.012,.07]);
    mark.rotation.y=-Math.atan2(3.55*Math.cos(a),-6*Math.sin(a));mark.castShadow=false;
  }
  for(let n=-3;n<=3;n++)shape(root,'box',0xe8e3d1,[-5.5,.076,plan.rotary.z+n*.36],[3,.012,.16]).castShadow=false;
  for(let n=0;n<7;n++)shape(root,'box',0xd6b957,[3+n,.077,-26.9],[.9,.022,.28]).castShadow=false;
  // A sheltered station forecourt separates the road loop from the concourse.
  for(const [side,shelter] of plan.shelters.entries()) {
    const g=new THREE.Group();g.position.set(shelter.x,0,shelter.z);root.add(g);
    shape(g,'box',0x7f9691,[0,.12,0],[2,.14,3.8]);
    for(const z of [-1.65,1.65])shape(g,'box',metal,[0,1.5,z],[.075,2.8,.075]);
    shape(g,'box',metal,[0,2.95,0],[2.2,.12,4.15]);
    shape(g,'box',0x647f88,[.65,1.6,0],[.035,2.3,3.25]);
    for(const z of [-.85,.85])shape(g,'box',surface('wood',1),[0,.52,z],[.72,.08,.65]);
    const board=sign(g,side?'バス・のりば':'タクシーのりば',[0,2.64,1.94],1.7,'#293b4b');board.scale.y=.34;
  }
  // Dedicated open-sided station concourse, not a shop facade with a station sign.
  const station=new THREE.Group();station.position.set(0,0,-32);root.add(station);
  shape(station,'box',surface('tile',[7.5,4]),[0,.04,0],[15,.08,8]);
  shape(station,'box',surface('concrete',[10,1.5],0xc9c7b9),[0,4.96,0],[15.8,.38,8.7]);
  for(const x of [-7,-2.6,2.6,7])for(const z of [-3.5,3.5])shape(station,'box',metal,[x,2.25,z],[.19,4.5,.19]);
  shape(station,'box',dark,[0,4.12,4.02],[15.5,1.25,.2]);
  sign(station,'あさひ駅',[-3.7,4.13,4.14],4.2,'#293b4b');
  sign(station,'ASAHI STATION',[3.2,4.13,4.14],4.3,'#293b4b');
  const glass=special('station-glass',{color:0x9ebec9,transparent:true,opacity:.18,roughness:.16,metalness:.15,depthWrite:false});
  for(const side of [-1,1]) {
    shape(station,'box',glass,[side*7.35,2.25,0],[.035,3.9,7.6]);
    shape(station,'box',metal,[side*7.4,.6,0],[.12,.07,7.8]);
    for(const z of [-3.9,-1.3,1.3,3.9])shape(station,'box',metal,[side*7.4,2.2,z],[.07,4.2,.07]);
    shape(station,'box',glass,[side*4.8,2,3.95],[4.4,3.5,.035]);
  }
  // Closed glass entry is visually distinct from the outdoor information point.
  for(const x of [-.72,.72]) {
    shape(station,'box',glass,[x,1.65,4],[1.36,3.15,.035]);
    shape(station,'box',metal,[x+.66,1.65,4.04],[.04,3.15,.055]);
  }
  for(const x of [-1.5,0,1.5]) {
    shape(station,'box',metal,[x,.58,-.5],[.38,1.15,1.45]);
    shape(station,'box',0x238574,[x,1.17,-.18],[.3,.025,.35]);
  }
  for(const side of [-1,1]) {
    shape(station,'box',dark,[side*5.1,1.1,1.2],[1.25,1.8,.45]);
    const ticket=sign(station,'きっぷ',[side*5.1,1.5,1.44],.85,'#33574e');ticket.scale.y=.3;
    shape(station,'box',0x597b89,[side*5.1,1.05,1.45],[.75,.46,.02]);
  }
  const gate=sign(station,'改札口  →  1番線',[0,3,-.45],4.5,'#293b4b');gate.scale.y=.6;
  const light=new THREE.PointLight(0xffe7cb,0,16,2);light.position.set(0,3.5,2.5);light.userData.worldLamp=true;light.userData.worldLampIntensity=10;light.userData.worldLampDistance=14;station.add(light);
  // Raised platforms and real rail geometry extend behind the concourse.
  // Stairs rise from the concourse to the raised platform behind the gates.
  for(let n=0;n<6;n++)shape(root,'box',pale,[0,(n+1)*.09,-34.2-n*.32],[2.3,(n+1)*.18,.34]);
  const p=plan.platform;
  shape(root,'box',surface('concrete',[12.5,1.6],0xb7b7ae),[0,.52,p.z],[p.width,1.04,p.depth]);
  shape(root,'box',surface('paving',[12.5,1.6]),[0,1.065,p.z],[p.width,.05,p.depth]);
  shape(root,'box',0xd2ba65,[0,1.1,p.z-p.depth/2+.25],[p.width-.3,.035,.3]);
  for(let x=-10;x<=10;x+=4) {
    shape(root,'box',metal,[x,2.8,p.z],[.11,3.4,.11]);
    shape(root,'box',metal,[x,4.47,p.z],[.14,.16,4.1]);
  }
  shape(root,'box',0xa3aaa8,[0,4.65,p.z],[27,.14,4.4]);
  const platformSign=sign(root,'1番線　東京方面',[0,3.5,p.z+1.1],5,'#293b4b');platformSign.scale.y=.65;
  for(const z of plan.tracks) {
    shape(root,'box',surface('asphalt',[23,1]),[0,.015,z],[72,.1,2.8]);
    for(let x=-35.5;x<36;x+=.65)shape(root,'box',0x686151,[x,.105,z],[.19,.16,2.1]);
    for(const offset of [-.5335,.5335]) {
      shape(root,'box',metal,[0,.24,z+offset],[72,.12,.055]);
      shape(root,'box',0xbac1bd,[0,.307,z+offset],[72,.018,.065]);
    }
  }
  for(const x of [-26,0,26]) {
    for(const z of [-39.7,-48])shape(root,'cylinder',metal,[x,3.6,z],[.08,7.2,.08]);
    shape(root,'box',metal,[x,7.15,-43.85],[.11,.11,8.5]);
  }
  for(const z of plan.tracks)shape(root,'box',dark,[0,6.8,z],[72,.018,.018]);
  // Continuous visual barrier matches the rail-site collision boundary.
  for(const side of [-1,1]) {
    for(let x=side*8.2;side*x<36;x+=side*1.7)shape(root,'box',metal,[x,.8,-35.4],[.055,1.6,.055]);
    for(const y of [.38,.9,1.48])shape(root,'box',metal,[side*22.1,y,-35.4],[27.8,.035,.035]);
  }
  const warning=sign(root,'線路内 立入禁止',[17,1.1,-35.32],1.45,'#ede2c7','#6c4335');warning.scale.y=.44;
  return root;
}
