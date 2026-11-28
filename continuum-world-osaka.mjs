import * as THREE from 'three';
import {shopBuilding} from './continuum-world-scenes.mjs';
import {expansionLocations} from './continuum-world-districts.mjs';
import {makeDotonboriLandmarks} from './continuum-world-osaka-landmarks.mjs';
import {makeStreetTree} from './continuum-world-street-art.mjs';

// Compact Osaka/Dotonbori scene; landmarks are authored geometry and canvas art.
// Same meshes, resource disposal, navigation, actors and lighting as Tokyo.
export function makeOsakaWorld(meshes){
 const root=new THREE.Group(),{shape,surface,sign,special}=meshes;
 root.name='Osaka · Akari Canal';
 for(const side of [-1,1])shape(root,'box',surface('paving',24,0x8a9189),[side*17,-.01,0],[26,.14,58]);
 const water=special('osaka-water',{color:0x246573,roughness:.24,metalness:.45});
 shape(root,'box',water,[0,-.18,0],[8,.08,56]);
 for(const side of [-1,1]){
  for(const z of [-16,16])shape(root,'box',surface('concrete',10,0x6e7772),[side*4.1,-.04,z],[.2,.42,24]);
  for(const z of [-16,-10,10,16,22]){
   shape(root,'box',0x354f53,[side*4.35,.55,z],[.08,1.1,.08]);
   shape(root,'box',0x354f53,[side*4.35,1.1,z],[.05,.06,5.8]);
  }
 }
 // Walkable bridge matches the gap in the canal collision volumes.
 shape(root,'box',surface('tile',6,0xc8bba2),[0,-.04,0],[8,.2,8]);
 for(const z of [-3.9,3.9]){
  shape(root,'box',0x616d6b,[0,1.08,z],[8,.09,.1]);
  shape(root,'box',0x616d6b,[0,.35,z],[8,.08,.08]);
  for(let x=-3.8;x<=4;x+=.4)shape(root,'box',0x616d6b,[x,.7,z],[.045,.74,.045]);
 }
 // Shared bank/deck top=.06; neither an overlapping paving slab nor a
 // retaining kerb crosses the bridge opening.
 for(const x of [-4.6,4.6])shape(root,'box',0x7f8981,[x,.015,0],[1,.07,7.7]);
 for(const p of expansionLocations.filter(l=>l.district==='osaka')){
  shopBuilding(meshes,root,p);
  // The canal sees the side elevations, not only the front door. Give those
  // elevations actual window bays, cornices and utility equipment too.
  const side=p.x<0?1:-1,g=new THREE.Group();g.position.set(p.x+side*p.width/2,0,p.z);g.rotation.y=side*Math.PI/2;root.add(g);
  for(const y of [2,5.6])for(const x of [-3,0,3]){
   shape(g,'box',0x485f63,[x,y,.025],[2,1.8,.05]);
   for(const dx of [-1,0,1])shape(g,'box',0xa2a495,[x+dx,y,.09],[.045,1.85,.06]);
   shape(g,'box',0xb3b3a1,[x,y-1,.15],[2.2,.1,.35]);
  }
  for(const x of [-4.7,4.7])shape(g,'cylinder',0x626f6c,[x,3.5,.15],[.04,7,.04]);
  sign(g,p.style==='food'?'たこ焼き ・ 大阪の味':'大阪みやげ ・ 商い',[0,7.3,.13],7,p.style==='food'?'#973c2b':'#34645d');
 }
 // Lantern-lined covered arcade, red noren, upright original signage.
 for(const x of [-21,-17,-13,13,17,21]){
  const lantern=shape(root,'sphere',0xeebd7d,[x,3,-7.85],[.35,.5,.35],true);
  lantern.material.userData.tokyoNight={day:.1,night:.7};
  shape(root,'box',surface('fabric',1,0xa24a35),[x,2.7,-8.7],[1.7,.55,.035]);
 }
 const neon=meshes.canvasMaterial('osaka-night-signs',(ctx,size)=>{
  const labels=[['たこ','TAKOYAKI'],['大阪','OSAKA'],['商店','SHOPS'],['喫茶','COFFEE']];
  ctx.fillStyle='#192329';ctx.fillRect(0,0,size,size);
  labels.forEach(([label,sub],i)=>{const x=i*size/4,w=size/4;ctx.strokeStyle=['#ffd68a','#ff8eb3','#80d9db','#f2d2a5'][i];ctx.lineWidth=5;ctx.strokeRect(x+12,12,w-24,size-24);ctx.textAlign='center';ctx.fillStyle=ctx.strokeStyle;ctx.font='600 92px sans-serif';[...label].forEach((glyph,n)=>ctx.fillText(glyph,x+w/2,280+n*190));ctx.font='500 24px sans-serif';ctx.fillText(sub,x+w/2,size-65);});
 },{color:0xffffff,emissive:0xffffff,emissiveIntensity:.1,roughness:.5});
 neon.emissiveMap=neon.map;neon.userData.tokyoNight={day:.1,night:1.6};
 for(const side of [-1,1])for(const [index,z]of [-17,-11].entries()){
  const group=new THREE.Group();group.position.set(side*11.36,5.7,z);group.rotation.y=-side*Math.PI/2;root.add(group);
  shape(group,'box',surface('metal',1,0x354f53),[0,0,-.05],[1.1,3.6,.12]);
  const geometry=new THREE.PlaneGeometry(.95,3.4),uv=geometry.attributes.uv,tile=index+(side===1?2:0);for(let n=0;n<uv.count;n++)uv.setX(n,(tile+uv.getX(n))/4);
  const panel=meshes.custom(group,geometry,neon);panel.position.z=.025;
 }
 // A sheltered shop entrance reads as a small shotengai, with a clear aisle.
 shape(root,'box',surface('metal',1,0x647b76),[17,3.9,-8],[11.8,.15,1.8]);
 for(const x of [11.2,22.8])shape(root,'box',surface('metal',1,0x647b76),[x,1.95,-8],[.12,3.9,.12]);
 sign(root,'戎橋 / EBISUBASHI',[0,.7,-3.82],2.8,'#56635c');
 sign(root,'商店街',[17,5.8,-7.9],4,'#724c37');
 makeDotonboriLandmarks(root,meshes);
 for(const x of [-23,23])for(const z of [6,18])makeStreetTree(meshes,root,x,z,Math.abs(x+z));
 for(const side of [-1,1])for(let i=0;i<6;i++){
  const z=-27+i*11,x=side*35,h=12+(i%3)*5;
  shape(root,'box',surface('concrete',3,[0xa4a395,0x8d9b98][i%2]),[x,h/2,z],[12,h,9]);
  for(let y=3;y<h;y+=3)shape(root,'box',0x465f67,[x,y,z+4.6],[10,1.2,.08]);
 }
 for(const x of [-5.5,5.5])for(const z of [-5,9,20]){
  shape(root,'cylinder',0x405353,[x,2.5,z],[.06,5,.06]);
  shape(root,'sphere',0xffd8a3,[x,5,z],[.25,.25,.25],true);
  const lamp=new THREE.PointLight(0xffbd81,0,12,2);lamp.position.set(x,4.8,z);lamp.userData.worldLamp=true;lamp.userData.worldLampIntensity=24;root.add(lamp);
 }
 return meshes.batch(root);
}
