import {clearWorldSegment,worldFloorHeight} from './continuum-world-model.mjs';

// Sidewalk-only authored routes. They do not create conversations, requests or
// progress events; actor rigs reuse the same two decoded public models.
export const tokyoPedestrianRoutes=[
 [{x:-7.1,z:7},{x:-7.1,z:29}],
 [{x:7.2,z:28},{x:7.2,z:7}],
 [{x:11,z:-5.25},{x:31,z:-5.25}],
 [{x:-31,z:-5.25},{x:-10,z:-5.25}],
];
export function makeTokyoPedestrian(actor,index) {
 const route=tokyoPedestrianRoutes[index%tokyoPedestrianRoutes.length];
 if(!clearWorldSegment('outdoors',route[0],route[1],.35))throw new Error('Pedestrian route intersects architecture');
 let target=1,hold=index*.37,speed=0;
 const p={...route[0]};
 actor.root.position.set(p.x,worldFloorHeight('outdoors',p),p.z);
 actor.root.rotation.y=Math.atan2(route[1].x-p.x,route[1].z-p.z);
 return {actor,update(dt,time,reduced,nearby=[]) {
  dt=Math.max(0,Math.min(.1,dt));hold=Math.max(0,hold-dt);
  const goal=route[target],dx=goal.x-p.x,dz=goal.z-p.z,d=Math.hypot(dx,dz);
  const blocked=nearby.some(q=>Math.hypot(q.x-p.x,q.z-p.z)<1.25);
  const turn=Math.atan2(Math.sin(Math.atan2(dx,dz)-actor.root.rotation.y),Math.cos(Math.atan2(dx,dz)-actor.root.rotation.y));
  if(!reduced)actor.root.rotation.y+=turn*(1-Math.exp(-dt*3.5));
  const desired=reduced||blocked||hold>0?0:Math.min(.92+(index%3)*.13,d*1.8)*Math.max(0,Math.cos(turn));
  speed+=(desired-speed)*(1-Math.exp(-dt/.23));
  const step=reduced||blocked||hold>0?0:Math.min(d,speed*dt);
  if(d>.001){p.x+=dx/d*step;p.z+=dz/d*step;}
  if(d<.035){target=1-target;hold=1.1+index*.21;speed=0;}
  actor.root.position.set(p.x,worldFloorHeight('outdoors',p),p.z);
  actor.animate(time+index*1.71,step/Math.max(.001,dt),reduced);
 }};
}
