import * as T from 'three';

const palettes={
 capybara:{fur:0xb98a59,muzzle:0xddba8b,ear:0xa16c48,shape:'round'},
 cat:{fur:0x9d8ba9,muzzle:0xe9d5ce,ear:0xe8b5c0,shape:'point'},
 fox:{fur:0xd88c40,muzzle:0xffe8d0,ear:0x664337,shape:'point'},
 dog:{fur:0xc29a73,muzzle:0xf6dfbf,ear:0x7c573e,shape:'flop'},
 bird:{fur:0x6d9bb5,muzzle:0xe9d8ba,ear:0xefb965,shape:'bird'},
 'guinea-pig':{fur:0xd1ad82,muzzle:0xf0e0ca,ear:0xd7a9a3,shape:'round'},
 quokka:{fur:0xb4a083,muzzle:0xe4d5b9,ear:0x8c725b,shape:'round'},
 panda:{fur:0xf0e9db,muzzle:0xffffff,ear:0x3a373d,shape:'panda'}
};
export function createCompanion(host,kind,state){
 const p=palettes[kind]||palettes.capybara;
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 renderer.domElement.className='companion-3d-canvas';host.append(renderer.domElement);host.dataset.renderer='webgl';
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(31,1,.1,30);
 camera.position.set(0,1.25,6.7);camera.lookAt(0,1.1,0);
 scene.add(new T.HemisphereLight(0xfff2dd,0x8b7192,3));
 const sun=new T.DirectionalLight(0xffdfb1,4);sun.position.set(-3,5,5);scene.add(sun);
 const rim=new T.DirectionalLight(0xded5ff,2);rim.position.set(4,3,-2);scene.add(rim);
 const materials=new Map(),geometries=new Set();
 const mat=color=>{if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.7,metalness:0}));return materials.get(color)};
 const ball=(parent,color,position,scale)=>{
  const geo=new T.SphereGeometry(1,24,16);geometries.add(geo);
  const mesh=new T.Mesh(geo,mat(color));mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;
 };
 const cone=(parent,color,position,scale)=>{
  const geo=new T.ConeGeometry(1,1,24);geometries.add(geo);
  const mesh=new T.Mesh(geo,mat(color));mesh.position.set(...position);mesh.scale.set(...scale);parent.add(mesh);return mesh;
 };
 const root=new T.Group();scene.add(root);
 const body=new T.Group();root.add(body);
 ball(body,p.fur,[0,.78,0],[.63,.77,.44]);
 ball(body,p.muzzle,[0,.77,.36],[.43,.49,.12]);
 const feet=[-1,1].map(side=>ball(body,p.fur,[side*.38,.14,.22],[.29,.19,.36]));
 const arms=[-1,1].map(side=>{
  const pivot=new T.Group();pivot.position.set(side*.51,1.03,.03);pivot.rotation.z=side*.15;body.add(pivot);
  ball(pivot,p.fur,[side*.03,-.24,.07],p.shape==='bird'?[.28,.4,.12]:[.19,.38,.21]);return pivot;
 });
 const head=new T.Group();head.position.set(0,1.68,.04);body.add(head);
 ball(head,p.fur,[0,0,0],kind==='capybara'?[.69,.54,.48]:[.63,.57,.46]);
 if(p.shape==='point')for(const side of [-1,1]){
  const ear=cone(head,p.fur,[side*.42,.48,-.03],[.23,.53,.22]);ear.rotation.z=-side*.18;
  cone(head,p.ear,[side*.42,.49,.075],[.14,.32,.1]);
 }else if(p.shape==='flop')for(const side of [-1,1])ball(head,p.ear,[side*.56,-.04,-.02],[.22,.46,.17]);
 else if(p.shape!=='bird')for(const side of [-1,1]){
  ball(head,p.shape==='panda'?p.ear:p.fur,[side*.46,.43,-.04],[.23,.23,.15]);
  if(p.shape!=='panda')ball(head,p.ear,[side*.46,.44,.075],[.14,.14,.04]);
 }
 if(p.shape==='bird'){
  const crest=cone(head,p.fur,[0,.56,-.04],[.12,.35,.12]);crest.rotation.z=-.3;
  const beak=cone(head,0xeab15b,[0,-.08,.52],[.18,.36,.17]);beak.rotation.x=Math.PI/2;
 }else{
  ball(head,p.muzzle,[0,-.18,.36],kind==='capybara'?[.49,.28,.31]:[.39,.26,.22]);
  ball(head,0x4e3c39,[0,-.09,.64],kind==='capybara'?[.18,.12,.1]:[.12,.09,.07]);
 }
 const eyes=[-1,1].map(side=>{
  if(p.shape==='panda'){const patch=ball(head,p.ear,[side*.25,.045,.4],[.19,.23,.08]);patch.rotation.z=side*.25;}
  const eye=new T.Group();eye.position.set(side*.26,.06,p.shape==='bird'?.4:.46);head.add(eye);
  ball(eye,0x27242d,[0,0,0],[.085,.108,.065]);ball(eye,0xfff7e9,[-.02,.03,.058],[.025,.03,.015]);return eye;
 });
 for(const side of [-1,1])ball(head,0xdfa09a,[side*.43,-.13,.39],[.11,.05,.025]);
 const mouth=ball(head,0x623a42,[0,-.3,p.shape==='bird'?.43:.58],[.11,.035,.04]);
 const scarf=new T.Group();scarf.position.y=1.25;body.add(scarf);
 ball(scarf,0x73518e,[0,0,0],[.62,.14,.45]);
 const knot=cone(scarf,0x73518e,[.14,-.23,.4],[.24,.48,.07]);knot.rotation.z=.18;
 ball(scarf,0xe1bc73,[.15,-.18,.47],[.06,.06,.025]);
 // A travelling companion's satchel; reusable geometry, no external textures.
 ball(body,0x79523e,[-.55,.62,.19],[.24,.28,.13]);
 ball(body,0xb68653,[-.55,.64,.31],[.2,.11,.025]);
 ball(body,0xe5c981,[-.55,.57,.33],[.045,.06,.02]);
 if(kind==='cat')for(const side of [-1,1])for(let i=0;i<2;i++){
  const stripe=ball(head,0x6f5e7c,[side*(.48+i*.025),.14-i*.13,.28],[.1,.035,.09]);stripe.rotation.z=side*.28;
 }
 if(kind==='fox'||kind==='cat'){
  const tail=ball(body,p.fur,[.67,.48,-.25],[.28,.52,.27]);tail.rotation.z=-.45;
  if(kind==='fox')ball(body,p.muzzle,[.85,.82,-.25],[.2,.22,.21]);
 }
 if(p.shape==='bird')ball(body,p.fur,[0,.48,-.43],[.24,.35,.22]);
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
  head.rotation.z=reduced?0:Math.sin(t*.7)*.025;
  head.rotation.x=reduced?0:targetY*.05+(v.speaking?Math.sin(t*4)*.025:0);
  const blink=reduced?1:(t%4.4<.14?.12:1);eyes.forEach(e=>e.scale.y=blink);
  mouth.scale.y=v.speaking&&!reduced?.035*(1+Math.max(.05,v.level||Math.abs(Math.sin(t*10)))*3.7):.035;
  arms.forEach((arm,i)=>{const side=i?1:-1;arm.rotation.z=waving?(i?2.1+Math.sin(t*12)*.22:-.2):side*(.15+(v.speaking&&!reduced?Math.sin(t*2.8)*.08:0))});
  feet.forEach((foot,i)=>foot.rotation.z=waving?(i?1:-1)*.05:0);
  renderer.render(scene,camera);host.dataset.frames=String((Number(host.dataset.frames)||0)+1);
 };
 return {
  setActive(value,reduce){active=value;reduced=reduce;host.dataset.motion=active&&!reduce?'on':'off';renderer.setAnimationLoop(active&&!reduced?draw:null);if(active&&reduced){root.rotation.set(0,0,0);body.position.y=0;head.rotation.set(0,0,0);eyes.forEach(e=>e.scale.y=1);mouth.scale.y=.035;arms.forEach((a,i)=>a.rotation.z=(i?1:-1)*.15);renderer.render(scene,camera)}},
  dispose(){if(disposed)return;disposed=true;renderer.setAnimationLoop(null);resize.disconnect();host.removeEventListener('pointermove',pointer);host.removeEventListener('pointerleave',leave);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
 };
}
