import * as THREE from 'three';

// A single atlas per room gives books and souvenir packs legible original
// jackets/spines without a texture, material or draw call per product.
export function retailLabels(meshes,kind){
 const names=kind==='books'?['東京散歩','大阪案内','日本の旅','短編集','季節の食卓','ことばの本','音楽と街','暮らしの知恵']:['大阪せんべい','だしの味','たこ焼き便り','浪花の菓子','旅の茶葉','商店街限定','大阪珈琲','街のおみやげ'];
 const colors=['#a45a46','#638b80','#cfb975','#365979','#c3b8a4','#907a99','#7d8b55','#c47d50'];
 const mat=meshes.canvasMaterial('retail-'+kind,(c,n)=>{
  for(let i=0;i<8;i++){
   const x=i*n/8,w=n/8;c.fillStyle=colors[i];c.fillRect(x,0,w,n);
   c.fillStyle='#e9dfbd';c.fillRect(x+8,35,w-16,10);c.fillRect(x+8,n-80,w-16,8);
   c.textAlign='center';c.fillStyle='#fcf6dd';c.font='bold 36px sans-serif';
   [...names[i]].forEach((glyph,j)=>c.fillText(glyph,x+w/2,155+j*74));
   c.fillStyle='#eee3bd';c.fillRect(x+18,720,w-36,120);c.fillStyle='#4f5144';
   for(let k=0;k<21;k++)if(k%3!==1)c.fillRect(x+24+k*3.6,745,k%2+1,65);
   c.font='18px sans-serif';c.fillText(kind==='books'?'青葉書房':'大阪の味',x+w/2,915);
  }
 },{roughness:.75});
 const cache=new Map();
 return (parent,index,position,width,height,yaw=0)=>{
  const key=index+':'+width+':'+height;let geometry=cache.get(key);
  if(!geometry){geometry=new THREE.PlaneGeometry(width,height);const uv=geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setX(i,(index%8+.01+uv.getX(i)*.98)/8);cache.set(key,geometry);}
  const face=meshes.custom(parent,geometry,mat);face.position.set(...position);face.rotation.y=yaw;return face;
 };
}
