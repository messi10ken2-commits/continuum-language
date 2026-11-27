import * as THREE from 'three';

// One original sign atlas, three emissive palettes, no full-screen bloom or
// extra shadow maps. Lettering stays upright; fictional businesses avoid logos.
export function dressTokyoAtmosphere(meshes,root) {
 const {shape,special}=meshes;
 const palette=[0xf35f99,0x54c7ec,0xffcd7f];
 const atlas=meshes.canvasMaterial('tokyo-night-signs',(ctx,s)=>{
  ctx.fillStyle='#111b28';ctx.fillRect(0,0,s,s);
  const labels=[['喫茶','COFFEE'],['東京','TOKYO'],['音楽','MUSIC'],['書店','BOOKS'],['居酒屋','DINING'],['カラオケ','KARAOKE'],['ラーメン','RAMEN'],['珈琲','ROASTERY']];
  labels.forEach(([label,sub],i)=>{
   const x=(i%4)*256,y=Math.floor(i/4)*512;
   ctx.strokeStyle=['#ff75b4','#7be6ff','#ffe1a4'][i%3];ctx.lineWidth=5;ctx.strokeRect(x+16,y+14,224,484);
   ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=9;ctx.fillStyle=ctx.strokeStyle;
   ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.font='600 64px "Noto Sans CJK JP", "Yu Gothic", sans-serif';
   [...label].forEach((char,n)=>ctx.fillText(char,x+128,y+95+n*76));
   ctx.shadowBlur=0;ctx.font='500 22px sans-serif';ctx.fillText(sub,x+128,y+463);
  });
 },{color:0xffffff,emissive:0xffffff,emissiveIntensity:.10,roughness:.5});
 atlas.emissiveMap=atlas.map;atlas.userData.tokyoNight={day:.10,night:1.9};
 const trim=palette.map((color,i)=>{
  const mat=special('tokyo-neon-'+i,{color,emissive:color,emissiveIntensity:.1,roughness:.32});
  mat.userData.tokyoNight={day:.1,night:2.6};return mat;
 });
 const warm=special('tokyo-window-warm',{color:0x637585,emissive:0xffd598,emissiveIntensity:0,roughness:.38});
 const cool=special('tokyo-window-cool',{color:0x617482,emissive:0xb6d7ef,emissiveIntensity:0,roughness:.4});
 warm.userData.tokyoNight={day:0,night:1.05};cool.userData.tokyoNight={day:0,night:.62};
 const frame=meshes.surface('metal',1,0x536068),concrete=frame;
 function blade(x,z,y,index,rotation=0) {
  const group=new THREE.Group();group.position.set(x,y,z);group.rotation.y=rotation;root.add(group);
  shape(group,'box',frame,[0,0,-.08],[.98,3.45,.22]);
  for(const yy of [-1.4,1.4])shape(group,'box',frame,[0,yy,-.40],[.12,.10,.8]);
  const geo=new THREE.PlaneGeometry(.86,3.28),uv=geo.attributes.uv;
  for(let n=0;n<uv.count;n++)uv.setXY(n,(index%4+uv.getX(n))/4,(1-Math.floor(index/4)+uv.getY(n))/2);
  const panel=meshes.custom(group,geo,atlas);panel.position.z=.038;panel.castShadow=false;
 }
 // Closest streets retain warm shop lighting; cyan/magenta are accents above
 // eye level. Different mounting heights create a dense, legible skyline.
 [[-10.7,-6.75,6.4,0,0],[10.8,-6.75,7.1,4,0],[-21.9,-6.75,9,3,0],
  [21.7,-6.75,10.5,5,0],[-25.7,-24.8,10,2,0],[25.5,-24.8,12,1,0],
  [-14.7,9.3,6.5,7,Math.PI/2],[-14.7,21.4,9,3,Math.PI/2],
  [-33.1,-24.8,17,5,0],[32.2,-24.8,17.6,6,0]].forEach(args=>blade(...args));
 // A restrained ribbon of sign light, not every wall painted neon.
 for(const [x,z,width,color] of [[-17,-6.70,11,2],[17,-6.70,11,1],[-30,-24.75,7,0],[29,-24.75,9,1]]) {
  shape(root,'box',trim[color],[x,4.42,z],[width,.055,.055]);
  shape(root,'box',trim[color],[x-width/2,5.15,z],[.045,1.45,.045]);
  const lamp=new THREE.PointLight(palette[color],0,11,2);lamp.position.set(x,3.9,z+.35);
  lamp.name='Tokyo sign spill';lamp.userData.worldLamp=true;lamp.userData.worldLampIntensity=34;lamp.userData.worldLampDistance=11;root.add(lamp);
 }
 // Individually lit rooms mixed with dark glass; mullions and deep sills read
 // as offices above small businesses instead of a single luminous billboard.
 for(const [x,z,width,height] of [[-17,-6.92,13,16],[17,-6.92,13,15],[-30,-24.92,8,25],[29,-24.92,10,22]]) {
  for(let y=5.65;y<height-1;y+=3)for(let dx=-width/2+1.3,col=0;dx<width/2-.5;dx+=2.4,col++) {
   if((Math.round(y)+col+Math.abs(x))%4===0)continue;
   shape(root,'plane',(col+Math.round(y))%3?warm:cool,[x+dx,y,z],[1.70,1.50,1]);
   shape(root,'box',frame,[x+dx,y,z+.035],[.035,1.54,.06]);
   shape(root,'box',concrete,[x+dx,y-.82,z+.11],[1.88,.10,.26]);
  }
 }
 // Light inside the distant blocks gives parallax and depth after dark.
 for(let i=0;i<9;i++) {
  const x=-36+i*9;
  for(let y=3;y<18;y+=3.2)for(let dx=-2;dx<=2;dx+=2)if((i+dx+Math.round(y))%3)
   shape(root,'plane',(i+dx)%2?warm:cool,[x+dx,y,-48.36],[1.12,1.45,1]);
 }
 // Roof rails, downpipes and compact electrical runs add a usable scale cue.
 for(const [x,z,height] of [[-23.1,-6.7,16],[23.1,-6.7,15],[-33.6,-24.7,25],[33.5,-24.7,22]]) {
  shape(root,'cylinder',frame,[x,height/2,z],[.045,height,.045]);
  for(let y=2;y<height;y+=3)shape(root,'box',frame,[x,y,z-.12],[.18,.05,.26]);
 }
 return root;
}

// Works on merged/instanced meshes too: atmosphere state belongs to material,
// not discarded pre-batch mesh metadata. No texture creation in the frame loop.
export function tokyoLightingMaterials(root) {
 const materials=new Set();root.traverse(o=>{for(const m of [o.material].flat())if(m?.userData?.tokyoNight)materials.add(m);});return [...materials];
}
export function setTokyoNight(materials,night) {
 for(const m of materials)m.emissiveIntensity=m.userData.tokyoNight[night?'night':'day'];
}
