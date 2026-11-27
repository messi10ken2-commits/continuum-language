import * as THREE from 'three';

// Original Komorebi branding, with the scale/material vocabulary of a Tokyo coffee bar.
export function makeCafeInterior(meshes) {
  const root=new THREE.Group();root.name='Komorebi Tokyo coffee bar';
  const {shape,sign,surface,special}=meshes;
  const oak=surface('wood',[5,2],0xc5a477),walnut=surface('wood',[3,2],0x6c4930),cream=surface('concrete',3,0xf0e5cd),steel=surface('metal',2,0xa9aaa4);
  const black=0x292b29,ivory=0xece6d7,brass=0x99835b;
  const glass=special('cafe-clear-glass',{color:0xc2d8d9,transparent:true,opacity:.17,roughness:.12,depthWrite:false});
  shape(root,'box',surface('tile',8,0xb4ab98),[0,-.1,0],[14,.2,12]);
  shape(root,'box',cream,[0,1.9,-6],[14,3.8,.18]);
  shape(root,'box',0xe4dacc,[0,3.78,0],[14,.15,12]);
  for(const side of [-1,1]) {
    shape(root,'box',cream,[side*7,.49,0],[.18,.98,12]);
    shape(root,'box',cream,[side*7,3.48,0],[.18,.64,12]);
    shape(root,'box',walnut,[side*6.88,.55,0],[.06,1.1,11.8]);
    // Tall street windows with a real sill and views beyond the glazing.
    for(const z of [-3,1,4]) {
      for(const dz of [-1.32,1.32])shape(root,'box',black,[side*6.75,2,z+dz],[.12,2.2,.055]);
      for(const y of [.91,3.09])shape(root,'box',black,[side*6.75,y,z],[.12,.055,2.65]);
      shape(root,'box',glass,[side*6.65,2,z],[.03,2.05,2.48]);
      shape(root,'box',0x8b9c9e,[side*8,1.9,z],[.3,3.2,2.4]);
      shape(root,'box',oak,[side*6.56,.96,z],[.45,.08,2.85]);
    }
    shape(root,'box',cream,[side*4,.23,6],[6,.46,.15]);
    shape(root,'box',cream,[side*4,3.55,6],[6,.5,.15]);
    shape(root,'box',glass,[side*3.8,1.9,6.1],[5.5,2.75,.025]);
    for(const x of [side*1.1,side*6.7])shape(root,'box',black,[x,1.8,6.13],[.06,3.5,.1]);
  }
  // The entry camera may sit on this apron, while player movement stays indoors.
  shape(root,'box',surface('paving',3,0xa5a59b),[0,-.09,8],[14,.15,4]);
  shape(root,'box',black,[0,3.4,6],[2.2,.15,.15]);
  const exit=sign(root,'出口 EXIT',[0,3.42,5.9],1.2,'#255b45','#f4f0da');exit.rotation.y=Math.PI;
  // Existing counter and NPC coordinates are retained.
  shape(root,'box',walnut,[0,.5,-3.6],[8,1,1.4]);
  for(let x=-3.9;x<4;x+=.14)shape(root,'box',oak,[x,.49,-2.885],[.055,.91,.025]);
  shape(root,'box',0x46413a,[0,1.04,-3.6],[8.12,.08,1.52]);
  shape(root,'box',walnut,[0,1.25,-5.65],[11,.85,.5]);
  shape(root,'box',ivory,[0,1.7,-5.65],[11.1,.07,.62]);
  sign(root,'KOMOREBI COFFEE',[0,2.98,-5.87],4.3,'#322d25','#f7edce');
  for(const [x,text] of [[-3.9,'ブレンド  ¥350  /  カフェラテ  ¥450'],[0,'ミラノ風サンド  ¥490'],[3.9,'ケーキセット  ¥680']]) {
    const board=sign(root,text,[x,2.2,-5.85],3.5,'#3c352d','#fff5d8');board.scale.y=.65;
  }
  const cup=(x,y,z)=>{
    shape(root,'cylinder',ivory,[x,y,z],[.052,.10,.052]);
    shape(root,'cylinder',0x503020,[x,y+.052,z],[.045,.005,.045]);
    shape(root,'cylinder',ivory,[x,y-.055,z],[.085,.012,.085]);
    const handle=meshes.custom(root,new THREE.TorusGeometry(.026,.008,4,8),ivory);handle.position.set(x+.058,y,z);handle.rotation.y=Math.PI/2;
  };
  // Espresso machine, group heads, grinder, cups and a refrigerated cake case.
  shape(root,'box',steel,[-2.6,1.36,-3.7],[1.1,.56,.55]);
  shape(root,'box',black,[-2.6,1.24,-3.38],[.94,.09,.15]);
  for(const x of [-2.85,-2.38]){shape(root,'cylinder',steel,[x,1.4,-3.4],[.04,.16,.04]);cup(x,1.15,-3.22);}
  shape(root,'cylinder',black,[-3.45,1.27,-3.6],[.13,.4,.13]);
  shape(root,'cylinder',glass,[-3.45,1.65,-3.6],[.14,.32,.14]);
  for(let n=0;n<5;n++)cup(-1.8+n*.15,1.14,-3.5);
  shape(root,'box',black,[2.8,1.24,-3.45],[.36,.32,.24]);
  shape(root,'box',0x839a99,[2.8,1.34,-3.3],[.31,.2,.025]);
  shape(root,'box',steel,[.8,1.08,-3.5],[2,.06,.75]);
  shape(root,'box',glass,[.8,1.39,-3.5],[2,.6,.75]);
  for(const y of [1.16,1.42]) {
    shape(root,'box',steel,[.8,y-.04,-3.5],[1.9,.015,.68]);
    for(let n=0;n<6;n++) {
      const x=.05+n*.29;
      shape(root,'box',ivory,[x,y,-3.45],[.22,.012,.26]);
      shape(root,'box',n%2?0x5b3422:0xe8d4a6,[x,y+.07,-3.45],[.16,.13,.2]);
      shape(root,'sphere',n%2?0xd3a878:0xac4036,[x,y+.15,-3.45],[.045,.025,.045]);
    }
  }
  // Compact two-person seating matches shared collision footprints.
  for(const side of [-1,1])for(const z of [-.9,1.55]) {
    const x=side*4.65;
    shape(root,'box',oak,[x,.74,z],[1.18,.06,.72]);
    shape(root,'cylinder',black,[x,.37,z],[.04,.72,.04]);
    shape(root,'box',black,[x,.035,z],[.55,.035,.45]);
    for(const dx of [-.93,.93]) {
      shape(root,'box',0x675c44,[x+dx,.45,z],[.45,.055,.47]);
      shape(root,'box',walnut,[x+dx+Math.sign(dx)*.19,.76,z],[.035,.5,.46]);
      for(const a of [-.17,.17])for(const b of [-.17,.17])shape(root,'cylinder',black,[x+dx+a,.23,z+b],[.012,.44,.012]);
    }
    cup(x-.2,.83,z);shape(root,'box',ivory,[x+.27,.79,z],[.18,.08,.12]);
  }
  // Ceiling rails, slim pendants and warm localized counter light.
  for(const x of [-4.6,0,4.6]) {
    shape(root,'box',black,[x,3.61,0],[.04,.04,9]);
    for(const z of [-2.2,1,3.6]) {
      shape(root,'cylinder',black,[x,3.32,z],[.006,.56,.006]);
      shape(root,'cone',brass,[x,3.03,z],[.17,.16,.17]);
      shape(root,'cylinder',0xffe0a6,[x,2.94,z],[.145,.012,.145],true);
    }
  }
  if(meshes.physical)for(const x of [-3,3]){const lamp=new THREE.PointLight(0xffdbad,7,9,2);lamp.position.set(x,2.8,-1);root.add(lamp);}
  for(const side of [-1,1]) {
    shape(root,'cylinder',0x403f34,[side*6.3,.32,4.6],[.24,.64,.24]);
    for(let n=0;n<9;n++){const leaf=shape(root,'plane',meshes.foliage(),[side*6.3+Math.sin(n)*.15,1+n*.025,4.6+Math.cos(n)*.15],[.55,.65,1]);leaf.rotation.set(-.35,n,0);}
  }
  root.userData.cafeSeats=8;return meshes.batch(root);
}

export function dressCafeExterior(meshes,root,{width,depth}) {
  const {shape,sign,surface}=meshes,face=depth/2;
  const oak=surface('wood',3,0x97764f),dark=0x302c26,cream=0xeee7d1;
  shape(root,'box',dark,[0,3.73,face+.27],[width-.4,1.12,.16]);
  shape(root,'box',0xd6b54a,[0,3.14,face+.28],[width-.4,.075,.18]);
  sign(root,'KOMOREBI COFFEE',[0,3.78,face+.38],5.8,'#302c26','#f6edd7');
  sign(root,'こもれび珈琲',[width*.3,3.74,face+.38],2.9,'#302c26','#f6edd7');
  for(const side of [-1,1]) {
    const x=side*width*.28;
    shape(root,'box',oak,[x,.72,face-.23],[width*.3,.055,.75]);
    for(const dx of [-1,0,1]) {
      shape(root,'cylinder',dark,[x+dx,.33,face-.6],[.018,.6,.018]);
      shape(root,'box',oak,[x+dx,.64,face-.6],[.38,.05,.38]);
      shape(root,'cylinder',cream,[x+dx,.79,face-.18],[.045,.09,.045]);
    }
    shape(root,'box',cream,[x,2.55,face+.08],[3.4,.7,.025]);
    sign(root,side<0?'ブレンド 350円 ・ モーニング':'サンドイッチ ・ ケーキ',[x,2.55,face+.12],3.2,'#eee7d1','#40382d').scale.y=.6;
  }
}
