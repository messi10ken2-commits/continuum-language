import * as THREE from 'three';

// Original in-app landmark artwork: the familiar runner/track/circle composition
// and an inflated fugu silhouette. No remote image request on world entry.
export function makeDotonboriLandmarks(root,meshes){
 const {shape,surface,sign}=meshes;
 const box=(m,p,s)=>shape(root,'box',m,p,s),metal=surface('metal',1,0x596465);
 const runner=meshes.canvasMaterial('dotonbori-runner',(c,n)=>{
  c.fillStyle='#f0eee5';c.fillRect(0,0,n,n);c.fillStyle='#c82e30';c.textAlign='center';c.font='italic bold 110px sans-serif';c.fillText('Glico',n/2,145);
  c.fillStyle='#244887';c.fillRect(45,190,n-90,n-220);
  c.strokeStyle='#d4dfec';c.lineWidth=6;for(let i=0;i<5;i++){c.beginPath();c.moveTo(70+i*170,n);c.lineTo(360+i*55,500);c.stroke();}
  c.fillStyle='#ce3436';c.beginPath();c.arc(512,440,230,0,Math.PI*2);c.fill();
  c.strokeStyle='#f6f1df';c.lineWidth=52;c.lineCap='round';
  const line=p=>{c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
  line([[490,430],[420,350],[340,255]]);line([[530,430],[605,350],[680,255]]);
  line([[510,440],[510,620]]);line([[510,610],[425,745],[395,900]]);line([[515,610],[620,725],[700,670]]);
  c.fillStyle='#ead0ad';c.beginPath();c.arc(510,350,43,0,Math.PI*2);c.fill();
  c.fillStyle='#f0eee5';c.fillRect(460,450,100,140);c.fillStyle='#ba3034';c.font='bold 25px sans-serif';c.fillText('グリコ',510,500);
 },{emissive:0xffffff,emissiveIntensity:.12,roughness:.6});
 runner.emissiveMap=runner.map;runner.userData.tokyoNight={day:.12,night:1.25};
 // Set back from the movement bounds; clear of the two enterable shops.
 box(surface('concrete',6,0x958c80),[5,9,-28],[9.5,18,5]);
 box(metal,[5,12,-25.38],[8,12.5,.3]);
 const panel=meshes.custom(root,new THREE.PlaneGeometry(7.7,12.2),runner);panel.position.set(5,12,-25.2);
 sign(root,'道頓堀 / DOTONBORI',[5,4.7,-25.15],7.6,'#285363');
 // Dense, individually framed commercial fronts along both walking banks.
 const labels=[['串かつ','揚げたて いらっしゃい'],['らーめん','自家製麺 ・ 濃厚だし'],['お好み焼','大阪の味'],['居酒屋','本日おすすめ'],['喫茶','珈琲と甘いもの']];
 for(const side of [-1,1])for(let i=0;i<5;i++){
  const g=new THREE.Group();g.position.set(side*28,0,-20+i*10);g.rotation.y=-side*Math.PI/2;root.add(g);
  const b=(m,p,s)=>shape(g,'box',m,p,s),[name,sub]=labels[(i+(side>0?2:0))%5];
  b(surface('concrete',4,[0x796b59,0xa19c89,0x6e7c78][i%3]),[0,4.7,-1.8],[8.8,9.4,3.6]);
  b(0x263d42,[0,1.5,.04],[7.6,2.8,.08]);
  for(const x of [-3.8,0,3.8])b(metal,[x,1.6,.13],[.1,3.2,.18]);
  b(surface('fabric',2,[0x963e30,0x345951,0xc29a56][i%3]),[0,3.35,.7],[8.5,.16,1.6]);
  sign(g,name,[0,4.4,.13],7.6,['#8d332c','#1e5354','#9c772b'][i%3]);
  sign(g,sub,[0,2.7,.19],6.2,'#e0c598','#443729');
  for(const x of [-2.8,-1.4,1.4,2.8]){
   const lantern=shape(g,'sphere',0xe4b676,[x,2.4,.8],[.22,.36,.22],true);lantern.material.userData.tokyoNight={day:.12,night:.7};
  }
  for(const x of [-2.5,2.5]){
   b(0x363f3e,[x,.5,.45],[1.5,1,.6]);b(0xc09b63,[x,1.02,.45],[1.6,.06,.7]);
   for(let k=0;k<5;k++)shape(g,'cylinder',0x7c915e,[x-.5+k*.25,1.2,.45],[.08,.3,.08]);
  }
  for(const y of [6.1,8])for(const x of [-2.8,0,2.8])b(0x40545c,[x,y,.05],[1.9,1.1,.08]);
  b(metal,[3.4,6.7,.45],[1.1,.65,.6]);
 }
 // Fugu balloon over the food shop: pale belly, dorsal spikes, eyes, fins,
 // open puckered mouth and wire suspension rather than a featureless sphere.
 const fish=new THREE.Group();fish.position.set(-16,6.8,-7);root.add(fish);
 shape(fish,'sphere',0xc7c3a4,[0,0,0],[1.55,1.25,1]);
 shape(fish,'sphere',0xeee5c7,[0,-.35,.12],[1.38,.85,.95]);
 for(const side of [-1,1]){
  shape(fish,'sphere',0xefdfb6,[side*1.45,-.05,0],[.4,.13,.5]);
  shape(fish,'sphere',0xe8e5d7,[side*.65,.4,.79],[.29,.29,.17]);
  shape(fish,'sphere',0x1e3032,[side*.65,.4,.94],[.12,.15,.06]);
 }
 shape(fish,'sphere',0xbcb18a,[0,-.05,1],[.33,.28,.16]);
 shape(fish,'sphere',0x4c5142,[0,-.04,1.14],[.15,.12,.025]);
 for(let i=0;i<9;i++){
  const a=i*.7;shape(fish,'sphere',0x797e66,[Math.cos(a)*1.3,.3+Math.sin(a)*.65,-.45],[.09,.12,.09]);
 }
 shape(fish,'sphere',0xa4aa88,[0,1.18,-.05],[.55,.22,.5]);
 for(const x of [-1,1])shape(fish,'cylinder',metal,[x,1.8,0],[.015,1.5,.015]);
 sign(root,'ふぐ料理',[-16,5.1,-6.95],2.8,'#24494e');
 // Small signs stay in their own facade bands, separate from shop name signs.
 sign(root,'くいだおれの街',[-8.8,10,-24],5,'#943b30');
 sign(root,'道頓堀',[16,12,-21],4.5,'#a34b2d');
}
