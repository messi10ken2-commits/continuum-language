import * as T from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {FaceMotion} from './companion-face-motion.mjs';
export const CAPYBARA_MODEL='/companions-3d/capybara-pop-v3.glb';
export function bindFaceRig(model){
 const bones={},morphs=[];model.traverse(o=>{if(o.isBone)bones[o.userData.name||o.name]={object:o,rest:o.quaternion.clone()};if(o.isMesh&&o.morphTargetDictionary)morphs.push(o)});
 for(const name of ['head','neck','jaw','eye.-1','eye.1'])if(!bones[name])throw Error('Incomplete companion rig');
 const rotation=new T.Quaternion(),euler=new T.Euler();
 return pose=>{
  for(const [name,values]of [['head',pose.head],['neck',pose.neck],['jaw',[pose.jaw,0,0]],['eye.-1',pose.eyes],['eye.1',pose.eyes]]){const b=bones[name];b.object.quaternion.copy(b.rest).multiply(rotation.setFromEuler(euler.set(...values,'XYZ')))}
  for(const mesh of morphs)for(const [name,index]of Object.entries(mesh.morphTargetDictionary))mesh.morphTargetInfluences[index]=name==='Blink'?pose.blink:name==='MouthOpen'?pose.mouth:name==='TongueVisible'?pose.tongue:0;
 };
}
function disposeModel(model){const materials=new Set(),geometries=new Set();model.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of [o.material].flat())materials.add(m);if(o.isSkinnedMesh)o.skeleton?.dispose()});geometries.forEach(g=>g.dispose());materials.forEach(m=>{for(const v of Object.values(m))if(v?.isTexture)v.dispose();m.dispose()})}
export async function createCallRig(host,values,{signal,onLost}={}){
 const response=await fetch(CAPYBARA_MODEL,{signal});if(!response.ok)throw Error('Companion model unavailable');
 const gltf=await new GLTFLoader().parseAsync(await response.arrayBuffer(),'');
 if(signal?.aborted){disposeModel(gltf.scene);throw new DOMException('Aborted','AbortError')}
 let renderer;
 try{
  const apply=bindFaceRig(gltf.scene);renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.25));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;renderer.setClearColor(0,0);
  const canvas=renderer.domElement;canvas.className='call-companion-rig-canvas';host.append(canvas);
  const scene=new T.Scene(),camera=new T.OrthographicCamera(-1.3,1.3,1.625,-1.625,.1,40);camera.position.set(0,1.8,7);camera.lookAt(0,1.8,0);scene.add(gltf.scene);
  scene.add(new T.HemisphereLight(0xffebcb,0x375243,1.6));for(const [pos,color,power]of [[[-3,4,4],0xffdfb6,2.5],[[3,2,3],0xe6efff,1],[[1,3,-3],0xffcb85,1.7]]){const light=new T.DirectionalLight(color,power);light.position.set(...pos);scene.add(light)}
  const motion=new FaceMotion();let active=false,reduced=false,disposed=false,contextLost=false,frame=0,last=0,draws=0;
  const paint=(dt=0)=>{const v=values(),speaking=v.state==='speaking',state=['thinking','preparing'].includes(v.state)?'thinking':speaking?'speaking':'listening';const pose=motion.update({dt,state,level:speaking?v.level:0,audible:speaking,reduced:reduced||!active});apply(pose);renderer.render(scene,camera);host.dataset.frames=String(++draws);host.dataset.mouth=pose.mouth.toFixed(3)};
  const tick=now=>{frame=0;if(disposed||!active||reduced)return;if(now-last>=1000/24){paint(Math.min(.1,(now-last)/1000));last=now}frame=requestAnimationFrame(tick)};
  const resize=()=>{if(disposed||contextLost)return;const {width,height}=host.getBoundingClientRect();if(width<1||height<1)return;const ratio=width/height,halfHeight=Math.max(1.625,1.17/ratio);camera.left=-halfHeight*ratio;camera.right=halfHeight*ratio;camera.top=halfHeight;camera.bottom=-halfHeight;camera.updateProjectionMatrix();const scale=Math.min(1,600/width,900/height);renderer.setSize(Math.round(width*scale),Math.round(height*scale),false);paint()};
  const observer=new ResizeObserver(resize);observer.observe(host);resize();
  const lost=e=>{e.preventDefault();contextLost=true;cancelAnimationFrame(frame);frame=0;active=false;onLost?.()};canvas.addEventListener('webglcontextlost',lost);
  return {setActive(value,reduce){if(disposed||contextLost)return;active=value;reduced=reduce;cancelAnimationFrame(frame);frame=0;last=performance.now();paint();if(active&&!reduced)frame=requestAnimationFrame(tick)},dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();canvas.removeEventListener('webglcontextlost',lost);disposeModel(gltf.scene);renderer.dispose();renderer.forceContextLoss();canvas.remove()}};
 }catch(error){disposeModel(gltf.scene);if(renderer){renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()}throw error}
}
