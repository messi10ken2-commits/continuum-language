import * as THREE from 'three';
import {createWorldPeoplePool} from './continuum-world-people.mjs';

// One GPU context and two decoded public people per open World. Scene geometry
// is still released on each crossing; nothing survives closing the World.
export function createWorldSession({makeRenderer=options=>new THREE.WebGLRenderer(options),peopleOptions}={}) {
 const people=createWorldPeoplePool(peopleOptions);
 let renderer=null,quality=null,closed=false,creates=0,sky=null,reflection=null;
 const retired=new Set();
 const releaseRetired=()=>{for(const old of retired)old.dispose();retired.clear();};
 const clearSky=()=>{reflection?.dispose();sky?.dispose();reflection=null;sky=null;};
 return {
  people,
  get disposed(){return closed;},
  get rendererCreates(){return creates;},
  renderer(host,nextQuality,capture=false){
   if(closed)throw new Error('World session is closed');
   if(renderer&&(quality!==nextQuality||renderer.getContext?.()?.isContextLost?.())){releaseRetired();clearSky();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();renderer=null;}
   if(!renderer){renderer=makeRenderer({antialias:nextQuality!=='low',powerPreference:'low-power',preserveDrawingBuffer:capture});quality=nextQuality;creates++;}
   if(renderer.domElement.parentElement!==host)host.append(renderer.domElement);
   return renderer;
  },
  retire(instance){instance.setActive?.(false);retired.add(instance);},
  releaseRetired,
  invalidateEnvironment:clearSky,
  environment(makeSky){
   if(closed||!renderer)throw Error('World renderer is unavailable');
   if(!reflection){sky=makeSky();const generator=new THREE.PMREMGenerator(renderer);reflection=generator.fromEquirectangular(sky);generator.dispose();}
   return reflection.texture;
  },
  dispose(){
   if(closed)return;closed=true;releaseRetired();clearSky();
   people.dispose();
   if(renderer){renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();renderer=null;}
  }
 };
}
