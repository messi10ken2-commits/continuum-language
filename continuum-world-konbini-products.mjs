import * as THREE from 'three';

// Original fictional packaging: shared atlas, no photographed chain logos or
// network request. Every small product remains a real object with shelf depth.
export const hoshiGoods = [
  ['ほし緑茶','GREEN TEA','#2d7850','#e9efc7'],
  ['珈琲','COFFEE','#4c3026','#d9ba84'],
  ['天然水','NATURAL WATER','#e6f3f7','#328bc0'],
  ['ほし牛乳','MILK','#fcfbef','#397eaf'],
  ['ポテト','うすしお','#f4c34d','#9a4024'],
  ['おせんべい','香ばしい醤油','#b43f32','#fff1bf'],
  ['チョコ','CACAO 72%','#442b2b','#deb769'],
  ['くらし','DAILY CARE','#e7f1ec','#488fc0'],
  ['おにぎり','鮭 / SALMON','#f8f2dc','#283c31'],
  ['サンドイッチ','たまご / EGG','#f2efd9','#c66837'],
  ['幕の内弁当','MAKUNOUCHI','#292c2c','#e9d4a1'],
  ['焼きたてパン','BAKERY','#e4b36e','#68452b'],
  ['ヨーグルト','YOGURT','#f0f1e7','#457ba4'],
  ['東京さんぽ','TOKYO DAYS','#ede0c4','#bd5444'],
  ['カップ麺','しょうゆ','#bf4235','#f8e8b1'],
  ['フルーツ','FRUIT MIX','#f4d266','#4c813e'],
];
function paintAtlas(c,size) {
  const tile=size/4;
  hoshiGoods.forEach(([title,sub,bg,fg],index)=>{
    const x=index%4*tile,y=Math.floor(index/4)*tile;
    c.save();c.translate(x,y);c.fillStyle=bg;c.fillRect(0,0,tile,tile);
    const shine=c.createLinearGradient(0,0,tile,0);shine.addColorStop(0,'#ffffff55');shine.addColorStop(.3,'#ffffff00');shine.addColorStop(.85,'#00000024');shine.addColorStop(1,'#ffffff55');
    c.fillStyle=shine;c.fillRect(0,0,tile,tile);
    c.fillStyle=fg;c.fillRect(10,15,164,6);c.fillRect(10,225,164,5);
    c.fillStyle=index<8?fg:'#596148';c.font='bold 13px sans-serif';c.textAlign='center';c.fillText('HOSHI SELECT',92,41);
    c.font='bold 27px sans-serif';c.fillText(title,93,83,160);
    c.font='12px sans-serif';c.fillText(sub,93,106,165);
    // Food illustrations give the refrigerated trays readable ingredients.
    c.fillStyle=index===10?'#f3e9ce':index===8?'#faf8e9':index===9?'#ead39b':fg;
    c.beginPath();c.ellipse(91,161,index>=8&&index<=11?63:46,36,0,0,Math.PI*2);c.fill();
    if(index===8){c.fillStyle='#273b2b';c.fillRect(69,160,44,35);c.fillStyle='#d47862';c.fillRect(81,138,22,12);}
    else if(index===10){for(let n=0;n<24;n++){c.fillStyle=['#de9153','#617d3c','#faf5d7','#b85940'][n%4];c.fillRect(38+n%6*18,136+Math.floor(n/6)*14,15,10);}}
    else if(index===9){c.fillStyle='#f6f0db';c.beginPath();c.moveTo(38,190);c.lineTo(141,190);c.lineTo(89,132);c.closePath();c.fill();c.strokeStyle='#75924e';c.lineWidth=6;c.beginPath();c.moveTo(43,184);c.lineTo(136,184);c.stroke();}
    else {c.fillStyle=bg;c.font='bold 25px sans-serif';c.fillText(index<4?'★':'SELECT',92,170,100);}
    c.fillStyle=fg;c.font='10px sans-serif';c.fillText(index<4?'内容量 350ml':'おいしさを、毎日に。',92,213,155);
    // Side panel, ingredients, barcode and crimped wrapper edges.
    c.fillStyle='#eee9dc';c.fillRect(192,16,55,218);c.fillStyle='#43483e';c.textAlign='left';c.font='7px sans-serif';
    for(let n=0;n<13;n++)c.fillText(n%3===0?'栄養成分表示':'原材料・保存方法',196,28+n*8,47);
    for(let n=0;n<25;n++)if(n%3!==1)c.fillRect(196+n*1.8,166,(n%2+1)*.7,40);
    c.font='8px sans-serif';c.fillText('490000'+String(index).padStart(4,'0'),196,220,45);
    c.strokeStyle='#ffffff55';c.lineWidth=1;for(let n=0;n<10;n++){c.beginPath();c.moveTo(3+n*25,3);c.lineTo(10+n*25,10);c.stroke();}
    c.restore();
  });
}
export function hoshiProductFactory(meshes) {
  const material=meshes.canvasMaterial('Hoshi original packaging atlas',paintAtlas,{roughness:.48});
  const cache=new Map();
  let count=0;
  const product=(parent,index,position,size,kind='box',yaw=0)=>{
    index=((index%16)+16)%16;
    const key=index+':'+kind;
    if(!cache.has(key)) {
      let geometry;
      if(kind==='bottle')geometry=new THREE.LatheGeometry([[.29,-.5],[.46,-.43],[.46,.20],[.22,.39],[.20,.5]].map(p=>new THREE.Vector2(...p)),8);
      else if(kind==='can')geometry=new THREE.CylinderGeometry(.5,.5,1,10);
      else {
        geometry=new THREE.BoxGeometry(1,1,1);
        if(kind==='bag') {
          const p=geometry.attributes.position;
          for(let n=0;n<p.count;n++){if(p.getY(n)>.4){p.setX(n,p.getX(n)*.84);p.setZ(n,p.getZ(n)*.68);}}
          geometry.computeVertexNormals();
        }
      }
      const uv=geometry.attributes.uv;
      for(let n=0;n<uv.count;n++) {
        const face=kind==='box'||kind==='bag'?Math.floor(n/4):-1;
        const side=face>=0 && face!==4 && face!==2;
        const u=side ? .76+uv.getX(n)*.20 : .025+uv.getX(n)*.68;
        uv.setXY(n,(index%4+u)/4,1-(Math.floor(index/4)+.035+(1-uv.getY(n))*.93)/4);
      }
      cache.set(key,geometry);
    }
    const mesh=meshes.custom(parent,cache.get(key),material);
    mesh.position.set(...position);mesh.scale.set(...size);mesh.rotation.y=yaw;
    mesh.userData.hoshiProduct=hoshiGoods[index][0];
    count++;
    return mesh;
  };
  Object.defineProperty(product,"count",{get:()=>count});
  return product;
}
