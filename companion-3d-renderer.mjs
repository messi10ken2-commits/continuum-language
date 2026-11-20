import * as T from 'three';

const palettes={
 capybara:{fur:0xc98c42,muzzle:0xb9763b,ear:0x8c542c,shape:'round'},
 cat:{fur:0x9e8aa7,muzzle:0xe9d5ce,ear:0xe8b5c0,shape:'point'},
 fox:{fur:0xd88c40,muzzle:0xffe8d0,ear:0x664337,shape:'point'},
 dog:{fur:0xd7a04f,muzzle:0xf1cd8b,ear:0xc48b44,shape:'flop'},
 bird:{fur:0x6d9bb5,muzzle:0xe9d8ba,ear:0xefb965,shape:'bird'},
 'guinea-pig':{fur:0xd1ad82,muzzle:0xf0e0ca,ear:0xd7a9a3,shape:'round'},
 quokka:{fur:0xc28d4d,muzzle:0xe3b779,ear:0x8c725b,shape:'round'},
 panda:{fur:0xf0e9db,muzzle:0xffffff,ear:0x3a373d,shape:'panda'}
};
export function createCompanion(host,kind,state){
 const p=palettes[kind]||palettes.capybara;
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 renderer.domElement.className='companion-3d-canvas';host.append(renderer.domElement);host.dataset.renderer='webgl';
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(31,1,.1,30);
 camera.position.set(0,1.26,6.5);camera.lookAt(0,1.15,0);
 scene.add(new T.HemisphereLight(0xfff2dd,0x756380,1.8));
 const sun=new T.DirectionalLight(0xffe8cf,2.7);sun.position.set(-3,5,5);scene.add(sun);
 const rim=new T.DirectionalLight(0xded5ff,1.5);rim.position.set(4,3,-2);scene.add(rim);
 const materials=new Map(),geometries=new Set();
 // A deterministic fine-strand bump texture: no protruding fur shells or downloads.
 const furCanvas=document.createElement('canvas');furCanvas.width=furCanvas.height=512;
 const ctx=furCanvas.getContext('2d');ctx.fillStyle='#909090';ctx.fillRect(0,0,512,512);
 let seed=17;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let i=0;i<13000;i++){
  const x=random()*512,y=random()*512,shade=100+Math.floor(random()*70);
  ctx.strokeStyle=`rgb(${shade},${shade},${shade})`;ctx.lineWidth=.45+random()*.45;
  ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+1,y+3,x-.5,y+6+random()*3);ctx.stroke();
 }
 const furTexture=new T.CanvasTexture(furCanvas);furTexture.wrapS=furTexture.wrapT=T.RepeatWrapping;furTexture.repeat.set(3,2);

 const mat=color=>{if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:[p.fur,p.muzzle,p.ear].includes(color)?.94:.7,metalness:0,...([p.fur,p.muzzle,p.ear].includes(color)?{bumpMap:furTexture,bumpScale:.017}:{})}));return materials.get(color)};
 const sphereGeo=new T.SphereGeometry(1,28,20);geometries.add(sphereGeo);
 const ball=(parent,color,position,scale)=>{
  const mesh=new T.Mesh(sphereGeo,mat(color));mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;
 };
 const coneGeo=new T.ConeGeometry(1,1,24);geometries.add(coneGeo);
 const cone=(parent,color,position,scale)=>{
  const mesh=new T.Mesh(coneGeo,mat(color));mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;
 };
 const line=(parent,color,points,radius=.012)=>{
  const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)));
  const geo=new T.TubeGeometry(curve,24,radius,6,false);geometries.add(geo);
  const mesh=new T.Mesh(geo,mat(color));parent.add(mesh);return mesh;
 };
 const root=new T.Group();scene.add(root);
 const body=new T.Group();root.add(body);
 const bird=p.shape==='bird',long=kind==='capybara',small=kind==='guinea-pig';
 const bodyScale=bird?[.5,.66,.4]:small?[.65,.62,.46]:[.57,.69,.43];
 ball(body,p.fur,[0,.76,0],bodyScale);
 if(!long)ball(body,p.muzzle,[0,.73,.35],bird?[.36,.43,.13]:[.34,.42,.13]);
 const limb=p.shape==='panda'?p.ear:p.fur;
 const feet=[-1,1].map(side=>{
  if(!bird)return ball(body,limb,[side*.33,.14,.22],[.23,.16,.3]);
  const foot=new T.Group();foot.position.set(side*.19,.05,.15);body.add(foot);
  ball(foot,0xc99449,[0,.07,0],[.04,.12,.045]);
  for(let i=-1;i<=1;i++)line(foot,0xd7a85d,[[0,0,0],[i*.06,-.012,.1],[i*.1,-.015,.21]],.025);
  return foot;
 });
 const arms=[-1,1].map(side=>{
  const pivot=new T.Group();pivot.position.set(side*.51,1.03,.03);pivot.rotation.z=side*.15;body.add(pivot);
  ball(pivot,limb,[side*.03,-.24,.07],bird?[.23,.34,.1]:[.19,.38,.21]);
  if(bird)for(let i=0;i<4;i++){const feather=ball(pivot,p.fur,[side*(.015+i*.055),-.4+i*.018,.07],[.055,.17,.07]);feather.rotation.z=-side*i*.12;}
  return pivot;
 });
 const head=new T.Group();head.position.set(0,small?1.5:1.62,.04);body.add(head);
 const headScale=long?[.63,.53,.48]:kind==='fox'?[.6,.51,.43]:bird?[.53,.53,.43]:[.6,.54,.46];
 ball(head,p.fur,[0,0,0],headScale);
 const ears=[];
 if(p.shape==='point')for(const side of [-1,1]){
  const ear=cone(head,p.fur,[side*.42,.48,-.03],[.23,.53,.22]);ear.rotation.z=-side*.18;ears.push(ear);
  cone(head,p.ear,[side*.42,.49,.075],[.14,.32,.1]);
 }else if(p.shape==='flop')for(const side of [-1,1]){const ear=ball(head,p.ear,[side*.53,-.04,-.02],[.23,.43,.2]);ears.push(ear);}
 else if(p.shape!=='bird')for(const side of [-1,1]){
  ball(head,p.shape==='panda'?p.ear:p.fur,[side*.43,long?.4:.43,-.04],long?[.14,.16,.12]:[.2,.21,.15]);
  if(p.shape!=='panda')ball(head,p.ear,[side*.43,long?.41:.44,.075],long?[.085,.09,.035]:[.12,.13,.04]);
 }
 if(p.shape==='bird'){
  const crest=cone(head,p.fur,[0,.56,-.04],[.12,.35,.12]);crest.rotation.z=-.3;
  const beak=cone(head,0xeab15b,[0,-.06,.52],[.16,.33,.13]);beak.rotation.x=Math.PI/2;
  ball(head,0xd99a3e,[0,-.2,.51],[.13,.055,.15]);
  for(let i=0;i<3;i++){const tuft=ball(head,p.fur,[-.1+i*.06,.47+i*.025,-.03],[.065,.19,.08]);tuft.rotation.z=.4+i*.15;}
 }else{
  ball(head,p.muzzle,[0,-.13,long?.43:.36],long?[.43,.29,.32]:kind==='fox'?[.39,.25,.26]:[.36,.25,.23]);
  if(long){for(const side of [-1,1]){const nostril=ball(head,0x533424,[side*.14,-.015,.724],[.047,.024,.014]);nostril.rotation.z=side*.35;}}
  else ball(head,0x4a3028,[0,-.065,kind==='fox'?.65:.59],[.11,.075,.065]);
 }
 const smileEyes=[];
 const eyes=[-1,1].map(side=>{
  if(p.shape==='panda'){const patch=ball(head,p.ear,[side*.25,.045,.4],[.19,.23,.08]);patch.rotation.z=side*.25;}
  const eye=new T.Group();eye.position.set(side*.26,.06,p.shape==='bird'?.4:.46);head.add(eye);
  const smileEye=line(head,0x493229,[[side*(long?.34:.25)-.065,.06,.49],[side*(long?.34:.25),.105,.51],[side*(long?.34:.25)+.065,.06,.49]],.018);smileEye.visible=false;smileEyes.push(smileEye);
  ball(eye,0x27242d,[0,0,0],[.065,.083,.043]);ball(eye,0xfff7e9,[-.02,.03,.058],[.025,.03,.015]);return eye;
 });
 for(const side of [-1,1]){
  ball(head,0xdf9b88,[side*.43,-.12,.39],[.09,.04,.025]);
  line(head,0x65432f,[[side*.18,.23,.43],[side*.25,.25,.45],[side*.31,.23,.43]],.018);
  if(kind==='cat')for(let i=0;i<3;i++)line(head,0xeee0ce,[[side*.32,-.2+i*.045,.49],[side*.55,-.22+i*.07,.46],[side*.68,-.2+i*.08,.37]],.006);
 }
 const mouth=ball(head,0x623a42,[0,bird?-.135:-.32,bird?.61:long?.7:.55],bird?[.09,.025,.025]:[.11,.09,.035]);
 // Draped triangular bandana, stitched edge, embroidered wheat crest.
 if(!bird)ball(head,0xe78e8e,[0,-.38,long?.73:.58],[.065,.035,.012]);
 const scarf=new T.Group();scarf.position.y=1.22;body.add(scarf);
 ball(scarf,0x662963,[0,0,0],[.58,.105,.43]);
 const fabricGeo=new T.BufferGeometry();
 const fabricPoints=[[-.47,-.015,.4],[0,-.16,.51],[.47,-.015,.4],[0,-.54,.48]];
 fabricGeo.setAttribute('position',new T.Float32BufferAttribute(fabricPoints.flat(),3));fabricGeo.setIndex([0,1,3,1,2,3]);fabricGeo.computeVertexNormals();geometries.add(fabricGeo);
 const fabricMat=new T.MeshStandardMaterial({color:0x742768,roughness:.94,side:T.DoubleSide});materials.set('fabric',fabricMat);scarf.add(new T.Mesh(fabricGeo,fabricMat));
 line(scarf,0xae6f91,[[-.45,-.04,.41],[0,-.52,.495],[.45,-.04,.41]],.012);
 for(const side of [-1,1]){
  line(scarf,0xe7ba58,[[0,-.4,.515],[side*.12,-.28,.524],[side*.19,-.15,.505]],.008);
  for(let i=0;i<3;i++){
   const leaf=ball(scarf,0xe7ba58,[side*(.055+i*.047),-.345+i*.07,.528],[.014,.039,.007]);leaf.rotation.z=side*-.65;
   const leaf2=ball(scarf,0xe7ba58,[side*(.1+i*.037),-.365+i*.07,.525],[.014,.035,.007]);leaf2.rotation.z=side*.85;
  }
 }
 // Leather backpack and rolled blanket remain visible around the shoulder.
 const pack=new T.Group();pack.position.set(-.46,.87,-.24);pack.rotation.z=-.12;body.add(pack);
 ball(pack,0x7e4729,[0,0,0],[.31,.43,.24]);
 ball(pack,0xa76b3c,[-.08,-.09,.18],[.24,.22,.12]);
 ball(pack,0xbc8650,[-.08,.09,.24],[.25,.12,.045]);
 ball(pack,0xe5b65d,[-.08,-.01,.3],[.045,.05,.018]);
 line(body,0x81512f,[[-.45,1.29,.19],[-.37,1.07,.36],[-.42,.77,.38],[-.5,.54,.1]],.045);
 line(body,0xd5a374,[[-.465,1.29,.223],[-.385,1.07,.393],[-.435,.77,.413],[-.515,.54,.133]],.006);
 ball(body,0xdfb45c,[-.38,1.05,.41],[.074,.083,.026]);ball(body,0x6d4029,[-.38,1.05,.44],[.043,.05,.012]);
 const roll=ball(pack,0xd3b27d,[-.04,.37,-.01],[.36,.17,.17]);
 const spiral=[];for(let i=0;i<55;i++){const a=i*.24,r=.012+i*.0022;spiral.push([-.385,.37+Math.cos(a)*r,-.01+Math.sin(a)*r]);}line(pack,0x927043,spiral,.014);
 for(const x of [-.17,.14])ball(pack,0x805336,[x,.37,.01],[.035,.18,.18]);
 if(kind==='cat')for(const side of [-1,1])for(let i=0;i<2;i++){
  const stripe=ball(head,0x6f5e7c,[side*(.48+i*.025),.14-i*.13,.28],[.1,.035,.09]);stripe.rotation.z=side*.28;
 }
 let tail;
 if(['fox','cat','dog','quokka'].includes(kind)){
  tail=ball(body,p.fur,[.61,.48,-.25],kind==='fox'?[.3,.55,.28]:kind==='cat'?[.14,.6,.15]:[.18,.36,.18]);tail.rotation.z=-.45;
  if(kind==='fox')ball(body,p.muzzle,[.85,.82,-.25],[.2,.22,.21]);
 }
 if(kind==='guinea-pig'){ball(head,0x8d5830,[-.46,.0,-.05],[.18,.4,.28]);ball(head,p.muzzle,[.27,-.16,.23],[.26,.36,.27]);}
 if(bird)for(let i=-1;i<=1;i++){const feather=ball(body,p.fur,[i*.12,.42,-.46],[.09,.36,.12]);feather.rotation.x=-.65;feather.rotation.z=i*.2;}
 const floorGeo=new T.CircleGeometry(.73,40);geometries.add(floorGeo);
 const floorMat=new T.MeshBasicMaterial({color:0x553755,transparent:true,opacity:.13,depthWrite:false});materials.set('shadow',floorMat);
 const shadow=new T.Mesh(floorGeo,floorMat);shadow.rotation.x=-Math.PI/2;shadow.position.set(0,-.045,0);shadow.scale.y=.7;scene.add(shadow);
 let active=false,reduced=false,disposed=false,lastFrame=0,origin=performance.now(),greetUntil=0,lastReact=false,lastCelebrate=false,targetX=0,targetY=0;
 const size=()=>{const box=host.getBoundingClientRect();if(box.width<1||box.height<1)return;renderer.setSize(box.width,box.height,false);camera.aspect=box.width/box.height;camera.updateProjectionMatrix();if(!active)renderer.render(scene,camera)};
 const resize=new ResizeObserver(size);resize.observe(host);size();
 const pointer=e=>{if(e.pointerType==='touch')return;const box=host.getBoundingClientRect();targetX=Math.max(-1,Math.min(1,(e.clientX-box.left)/box.width*2-1));targetY=Math.max(-1,Math.min(1,(e.clientY-box.top)/box.height*2-1));};
 const leave=()=>{targetX=0;targetY=0};host.addEventListener('pointermove',pointer);host.addEventListener('pointerleave',leave);
 const draw=now=>{
  if(disposed||!active||now-lastFrame<33)return;lastFrame=now;
  const t=(now-origin)/1000,v=state();
  if((v.reacting&&!lastReact)||(v.celebrate&&!lastCelebrate))greetUntil=now+1400;
  lastReact=v.reacting;lastCelebrate=v.celebrate;
  const waving=!reduced&&now<greetUntil;
  root.rotation.y=reduced?0:root.rotation.y+(targetX*.34+Math.sin(t*.65)*.035-root.rotation.y)*.08;
  body.position.y=reduced?0:Math.sin(t*1.5)*.018+(waving?Math.abs(Math.sin((greetUntil-now)/1400*Math.PI*2))*.07:0);
  head.rotation.z=reduced?0:Math.sin(t*.7)*.035+(waving?-.08:0);
  ears.forEach((ear,i)=>{ear.rotation.x=reduced?0:Math.sin(t*1.8+i)*.035;});
  if(tail)tail.rotation.z=-.45+(reduced?0:Math.sin(t*(v.speaking?3:1.7))*.1);
  head.rotation.x=reduced?0:targetY*.05+(v.speaking?Math.sin(t*4)*.025:0);
  const blink=reduced?1:(t%4.4<.14?.12:1);eyes.forEach(e=>{e.scale.y=blink;e.visible=!waving});smileEyes.forEach(e=>e.visible=waving);
  mouth.scale.y=v.speaking&&!reduced?(bird?.025:.07)*(1+Math.max(.05,v.level||Math.abs(Math.sin(t*10)))*1.1):(bird?.025:.09);
  arms.forEach((arm,i)=>{const side=i?1:-1;arm.rotation.z=waving?(i?2.1+Math.sin(t*12)*.22:-.2):side*(.15+(v.speaking&&!reduced?Math.sin(t*2.8)*.08:0))});
  feet.forEach((foot,i)=>foot.rotation.z=waving?(i?1:-1)*.05:0);
  renderer.render(scene,camera);host.dataset.frames=String((Number(host.dataset.frames)||0)+1);
 };
 return {
  setActive(value,reduce){active=value;reduced=reduce;host.dataset.motion=active&&!reduce?'on':'off';renderer.setAnimationLoop(active&&!reduced?draw:null);if(active&&reduced){root.rotation.set(0,0,0);body.position.y=0;head.rotation.set(0,0,0);eyes.forEach(e=>{e.scale.y=1;e.visible=true});smileEyes.forEach(e=>e.visible=false);mouth.scale.y=bird?.025:.09;arms.forEach((a,i)=>a.rotation.z=(i?1:-1)*.15);renderer.render(scene,camera)}},
  dispose(){if(disposed)return;disposed=true;renderer.setAnimationLoop(null);resize.disconnect();host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());furTexture.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
 };
}
