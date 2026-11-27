import * as THREE from 'three';
import {callCompanionKind} from './companion-call-models.mjs';

// Full-body travelling companions share the Light town's warm palette, scarf,
// pack and species silhouettes. All geometry/materials belong to worldMeshes.
const styles={
 capybara:[0xdca14e,0xf1c778,.23,.23,.075],
 fox:[0xe88736,0xffe5bf,.20,.23,.16],
 cat:[0x9d8da8,0xeadbd5,.18,.21,.13],
 dog:[0xd9a258,0xf2d29a,.20,.23,.14],
 'guinea-pig':[0xc99b6b,0xf5e2c7,.21,.20,.065],
 quokka:[0xc89252,0xe8c68c,.20,.22,.09],
 panda:[0xeee6d7,0xfdf3df,.23,.23,.085],
 bird:[0x719ed4,0xf4e4bf,.19,.20,.06],
};
export function makeWorldCompanion(meshes,requested='bird') {
 const kind=callCompanionKind(requested),[fur,cream,rx,hy,earSize]=styles[kind];
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);root.name='World full-body '+kind;
 const {shape,surface,special}=meshes;
 const coat=surface(kind==='bird'?'fabric':'fur',3,fur),light=surface('fur',3,cream);
 const dark=surface('fur',3,kind==='panda'?0x363335:0x815234);
 const eye=special('companion-living-eye',{color:0x211c21,roughness:.17,metalness:0});
 const scarf=surface('fabric',3,0x861850),leather=surface('fabric',2,0x92603c),gold=meshes.material(0xeac15d);
 const ball=(parent,mat,p,s)=>shape(parent,'sphere',mat,p,s);
 const hull=shape(body,'organic',coat,[0,.36,-.015],[rx,.285,.18]);hull.userData.worldBatch=false;
 ball(body,light,[0,.32,.133],[rx*.79,.20,.075]);
 const head=new THREE.Group();head.position.set(0,.67,.028);body.add(head);
 shape(head,'organic',coat,[0,0,0],[rx*1.1,hy,.18]);
 const muzzle=kind==='capybara'?[.139,.106,.08]:kind==='bird'?[.07,.045,.09]:[.11,.065,.065];
 ball(head,kind==='capybara'?dark:light,[0,-.055,.154],muzzle);
 if(kind!=='bird') {
  ball(head,eye,[0,-.027,.215],[kind==='capybara'?.032:.027,.019,.014]);
  // A small smile and divided muzzle, without a human mouth or teeth.
  const smile=shape(head,'box',0x694635,[0,-.106,.222],[.032,.006,.006]);
  smile.rotation.z=.08;
 } else {
  const beak=shape(head,'cone',0xd9a343,[0,-.028,.218],[.052,.106,.045]);beak.rotation.x=Math.PI/2;
 }
 const eyes=[],ears=[];
 for(const side of [-1,1]) {
  const socket=new THREE.Group();socket.position.set(side*rx*.63,.018,.151);head.add(socket);
  if(kind==='panda')ball(head,dark,[side*.137,.01,.137],[.065,.083,.032]).rotation.z=-side*.3;
  ball(socket,eye,[0,0,0],[.025,.031,.017]);
  ball(socket,0xfff5df,[-.007,.009,.014],[.007,.008,.004]);eyes.push(socket);
  const brow=ball(head,dark,[side*rx*.63,.071,.147],[.032,.008,.009]);brow.rotation.z=-side*.18;
  if(kind!=='bird') {
   const ear=new THREE.Group();ear.position.set(side*rx*.87,hy*.73,-.018);head.add(ear);
   if(kind==='fox'||kind==='cat') {
    const outside=shape(ear,'cone',coat,[0,.05,0],[earSize*.63,earSize,earSize*.42]);outside.rotation.z=-side*.18;
    shape(ear,'cone',light,[0,.055,.035],[earSize*.38,earSize*.72,earSize*.15]);
   } else {
    ball(ear,kind==='panda'?dark:coat,[0,0,0],[earSize*.65,earSize,earSize*.45]);
    ball(ear,light,[0,0,earSize*.28],[earSize*.37,earSize*.64,earSize*.13]);
    if(kind==='dog')ear.rotation.z=side*.7;
   }ears.push(ear);
  }
 }
 if(kind==='bird')for(let i=0;i<3;i++)ball(head,coat,[(i-1)*.043,.18,-.02-i*.02],[.045,.056,.07]).rotation.z=.45;
 // Purple neckerchief: a folded collar and a pointed woven front, like Light.
 ball(body,scarf,[0,.529,.015],[rx*1.025,.045,.186]);
 const g=new THREE.BufferGeometry();
 g.setAttribute('position',new THREE.Float32BufferAttribute([-.18,.53,.18,.18,.53,.18,0,.32,.217],3));
 g.setAttribute('uv',new THREE.Float32BufferAttribute([0,1,1,1,.5,0],2));g.computeVertexNormals();
 const bib=meshes.custom(body,g,scarf);bib.material.side=THREE.DoubleSide;
 // Wheat embroidery, kept as simple opaque stitches instead of alpha fur cards.
 for(const side of [-1,1])for(let i=0;i<3;i++) {
  const stitch=shape(body,'box',gold,[side*(.025+i*.022),.405+i*.026,.216-i*.004],[.026,.007,.004]);stitch.rotation.z=side*.8;
 }
 const pack=new THREE.Group();pack.position.set(0,.37,-.19);body.add(pack);
 shape(pack,'rounded',leather,[0,0,-.035],[.29,.31,.12]);
 shape(pack,'rounded',leather,[0,-.045,-.108],[.21,.13,.045]);
 const blanket=shape(pack,'cylinder',light,[0,.17,-.035],[.067,.29,.067]);blanket.rotation.z=Math.PI/2;
 for(const side of [-1,1]) {
  shape(body,'box',leather,[side*.17,.405,.118],[.029,.23,.025]).rotation.z=side*.23;
  shape(body,'box',gold,[side*.185,.455,.14],[.042,.043,.014]);
  shape(body,'box',leather,[side*.185,.455,.152],[.024,.024,.006]);
 }
 const legs=[],arms=[];
 for(const side of [-1,1]) {
  const leg=new THREE.Group();leg.position.set(side*rx*.51,.145,0);body.add(leg);
  const calf=ball(leg,kind==='panda'?dark:coat,[0,-.035,0],[.079,.105,.075]);calf.userData.worldBatch=false;
  const ankle=new THREE.Group();ankle.name="Companion planted foot";ankle.position.set(0,-.095,0);leg.add(ankle);
  ball(ankle,kind==='bird'?dark:kind==='fox'?dark:coat,[0,-.011,.041],[.075,.039,.115]);
  for(let toe=-1;toe<=1;toe++)ball(ankle,dark,[toe*.025,-.016,.132],[.01,.017,.017]);
  legs.push({leg,ankle,calf});
  const arm=new THREE.Group();arm.position.set(side*rx*.9,.475,.004);body.add(arm);
  ball(arm,kind==='panda'?dark:coat,[side*.023,-.08,0],[.064,.135,.07]);
  ball(arm,kind==='fox'?dark:coat,[side*.026,-.185,.024],[.063,.063,.066]);arms.push(arm);
 }
 const tail=new THREE.Group();tail.position.set(0,.23,-.17);body.add(tail);
 if(['fox','cat','dog','quokka','bird'].includes(kind)) {
  ball(tail,coat,[0,.04,-.13],[kind==='fox'?.105:.06,.085,.20]);
  if(kind==='fox')ball(tail,light,[0,.055,-.28],[.08,.072,.09]);
 } else if(kind==='panda')ball(tail,coat,[0,0,-.025],[.055,.055,.06]);
 root.traverse(o=>{if(o.isMesh)o.castShadow=false;});
 // Batch only within the independently animated parts, preserving joints/eyes.
 const groups=[];root.traverse(o=>{if(o.isGroup)groups.push(o);});groups.reverse().forEach(g=>meshes.batch(g,false));
 meshes.contact(root,0,0,.8,.65,.34);
 let previous=0,gait=0,phase=0;
 return {kind,root,animate(time,speed,reduced,looking=0){
  const dt=Math.min(.1,Math.max(0,time-previous));previous=time;
  gait+=(Math.max(0,speed)-gait)*(1-Math.exp(-dt/.18));phase+=dt*Math.max(0,speed)/ .48*2*Math.PI;
  const amount=reduced?0:Math.min(1,gait/.5),breathe=reduced?0:Math.sin(time*2.2)*.004;
  body.position.y=reduced?0:Math.abs(Math.sin(phase))*.012*amount;
  hull.scale.y=.285+breathe;body.rotation.z=reduced?0:Math.sin(phase)*.025*amount;
  head.rotation.y=reduced?0:THREE.MathUtils.clamp(looking,-.55,.55)*.55+Math.sin(time*.73)*.035*(1-amount);
  head.rotation.x=reduced?0:Math.sin(phase)*.035*amount+Math.sin(time*1.7)*.012;
  const blink=(time%5.7),open=reduced?1:1-Math.max(0,1-Math.abs(blink-4.8)/.105)*.94;
  eyes.forEach(e=>e.scale.y=open);
  legs.forEach(({leg,ankle,calf},i)=>{
   const u=(phase/(2*Math.PI)+i*.5)%1,stance=.58,s=(u-stance)/(1-stance),span=.48*stance;
   const z=(u<stance?span*(.5-u/stance):-span*.5+span*(3*s*s-2*s*s*s)-.48*(1-stance)*(2*s*s*s-3*s*s+s))*amount;
   const lift=u<stance?0:Math.sin(Math.PI*s)**2*.07*amount;
   const targetY=(.05+lift-body.position.y-Math.sin(body.rotation.z)*leg.position.x)/Math.cos(body.rotation.z);
   const down=.145-targetY,length=Math.hypot(down,z);
   // During stance, local foot travel exactly cancels root travel. Flight uses
   // a Hermite return matching stance velocity; the ankle stays level at touchdown.
   leg.rotation.x=-Math.atan2(z,down);leg.position.y=.145;
   ankle.position.y=-length;ankle.rotation.x=-leg.rotation.x;ankle.rotation.z=-body.rotation.z;
   calf.position.y=-length*.4;calf.scale.y=length*.65+.04325;
  });
  arms.forEach((arm,i)=>{arm.rotation.x=-Math.sin(phase+i*Math.PI)*.27*amount;arm.rotation.z=(i?1:-1)*.07+(reduced?0:Math.sin(time*1.4+i)*.018);});
  ears.forEach((ear,i)=>{ear.rotation.x=reduced?0:Math.sin(time*2.1+i)*.028+Math.sin(phase-.5)*.035*amount;});
  tail.rotation.y=reduced?0:Math.sin(time*2.3)*.16+Math.sin(phase-.7)*.12*amount;
  pack.rotation.x=reduced?0:Math.sin(phase-.4)*.018*amount;
 }};
}
