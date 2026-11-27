import * as THREE from 'three';
import {expansionLocations} from './continuum-world-districts.mjs';

// One room shell and collision contract, authored fixtures by place. Each is a
// genuine navigable scene with its own NPC and language activity.
export function makeExpansionInterior(id,meshes){
 const place=expansionLocations.find(l=>l.id===id);if(!place)throw Error('Unsupported World interior');
 const root=new THREE.Group(),{shape,surface,sign}=meshes;
 root.name=place.title;
 const timber=surface('wood',4,0x9c7b57),metal=surface('metal',1,0x596b6b),wall=surface('concrete',5,0xd4cbb9);
 shape(root,'box',surface('tile',8,0xd8d0bc),[0,-.1,0],[14,.2,12]);
 shape(root,'box',wall,[0,2.6,-6.15],[14.3,5.2,.3]);
 for(const side of [-1,1]){
  shape(root,'box',wall,[side*7.15,2.6,0],[.3,5.2,12]);
  shape(root,'box',wall,[side*4.1,2.6,6.15],[6,5.2,.3]);
 }
 shape(root,'box',surface('concrete',4,0xe2ddce),[0,5.3,0],[14,.2,12]);
 shape(root,'box',timber,[0,.55,-3.6],[8,1.1,1.4]);
 shape(root,'box',surface('metal',2,0x434f4b),[0,1.14,-3.6],[8.2,.08,1.55]);
 sign(root,place.sign,[0,3.45,-5.97],6,'#344d4b');
 sign(root,'出口 / EXIT',[0,3.7,6.02],2.2,'#355d49').rotation.y=Math.PI;
 for(const x of [-4,0,4])shape(root,'box',0xffeac4,[x,5.08,0],[1.3,.03,1.3],true);
 for(const side of [-1,1]){
  const x=side*5.8;
  if(place.style==='books'){
   for(const z of [-1.7,1.7]){
    shape(root,'box',timber,[x,1.3,z],[1.15,2.6,2.7]);
    for(let row=0;row<4;row++)for(let n=0;n<10;n++)shape(root,'box',[0x7a9b93,0xc5a674,0xa16e5a,0x667d93][(n+row)%4],[x-side*.61,.35+row*.6,z-1.15+n*.24],[.12,.4+(n%3)*.035,.18]);
   }
  }else if(place.style==='music'){
   for(const z of [-1.7,1.7]){
    shape(root,'box',0x34454a,[x,1,z],[1.1,2,1.5]);
    shape(root,'cylinder',0x172b30,[x-side*.58,1,z],[.38,.05,.38]).rotation.z=Math.PI/2;
   }
   shape(root,'box',0x242b30,[0,2.2,-5.65],[3,.45,.3]);
   for(let i=0;i<18;i++)shape(root,'box',0xe1dfcd,[-1.4+i*.16,2.45,-5.6],[.12,.03,.24]);
  }else if(place.style==='station'){
   for(const z of [-1.7,1.7]){
    shape(root,'box',metal,[x,1.2,z],[1.15,2.4,1.5]);
    sign(root,'きっぷ',[x-side*.64,1.7,z],1,'#355d6c').rotation.y=-side*Math.PI/2;
   }
   sign(root,'東京  →  大阪   /   旅の相談',[0,2.75,-5.94],6,'#254a55');
  }else if(place.style==='food'){
   for(const z of [-1.5,1.5]){
    shape(root,'box',timber,[x,.85,z],[1.2,1.7,2.3]);
    for(let n=0;n<6;n++)shape(root,'sphere',0xc59658,[x,1.76,z-.8+n*.32],[.13,.11,.13]);
   }
   sign(root,'ソース ・ だし ・ ねぎ',[0,2.75,-5.94],5,'#744c39');
  }else{
   for(const z of [-1.5,1.5]){
    shape(root,'box',timber,[x,.75,z],[1.15,1.5,2.5]);
    sign(root,place.style==='arcade'?'商店街 MAP':'まちの交流会',[x-side*.64,2.1,z],1.8,'#4b6d69').rotation.y=-side*Math.PI/2;
   }
  }
 }
 // Reading display / event desk, within the common counter collider.
 sign(root,place.style==='books'?'本の相談はこちら':place.style==='music'?'見学 ・ 体験のご案内':'ご案内 / INFORMATION',[0,.65,-2.88],3.4,'#d4c6aa','#344843');
 return meshes.batch(root);
}
