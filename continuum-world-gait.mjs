import * as THREE from 'three';

// Hermite flight path: smooth toe-off, heel recovery, knee drive and landing.
// End tangents match the backwards speed of the planted stance foot.
const flightKeys = [[0,-.50,0,.34],[.18,-.68,.32,.28],[.55,.10,.37,.02],[.85,.54,.12,-.10],[1,.50,0,-.12]];
function flight(s, channel, span) {
  let i=0;while(i<flightKeys.length-2 && s>flightKeys[i+1][0])i++;
  const a=flightKeys[i],b=flightKeys[i+1],length=b[0]-a[0],t=(s-a[0])/length;
  const derivative=index=>{
    if(index===0 || index===flightKeys.length-1)return channel===1?-span:0;
    return (flightKeys[index+1][channel]-flightKeys[index-1][channel])/(flightKeys[index+1][0]-flightKeys[index-1][0]);
  };
  return (2*t**3-3*t*t+1)*a[channel]+(t**3-2*t*t+t)*length*derivative(i)+(-2*t**3+3*t*t)*b[channel]+(t**3-t*t)*length*derivative(i+1);
}
export function makeGroundedGait(body,bones) {
  body.updateMatrixWorld(true);
  const origin=body.getWorldQuaternion(new THREE.Quaternion());
  const rotateWorld=(bone,axis,angle)=>{
    const inverse=bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
    bone.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(axis.clone().applyQuaternion(inverse),angle));
  };
  for(const [side,sign] of [['l',-1],['r',1]]) {
    const arm=bones.get('upperarm_'+side);
    if(arm){rotateWorld(arm,new THREE.Vector3(0,0,1).applyQuaternion(origin),sign*1.36);body.updateMatrixWorld(true);}
  }
  const rest=new Map([...bones].map(([name,bone])=>[name,{q:bone.quaternion.clone(),p:bone.position.clone()}]));
  const position=bone=>body.worldToLocal(bone.getWorldPosition(new THREE.Vector3()));
  const legs=['l','r'].map(side=>{
    const hip=bones.get('thigh_'+side),knee=bones.get('calf_'+side),foot=bones.get('foot_'+side);
    if(!hip||!knee||!foot)return null;
    const h=position(hip),k=position(knee),f=position(foot);
    return {side,hip,knee,foot,f,upper:h.distanceTo(k),lower:k.distanceTo(f),sole:[],q:origin.clone().invert().multiply(foot.getWorldQuaternion(new THREE.Quaternion()))};
  });
  // The shipped shoes are rigidly weighted to each foot. Cache their actual
  // vertices so heel/toe roll preserves the shoe's lowest point, rather than
  // assuming an ankle at ground level or allowing toes to sink through it.
  body.traverse(mesh=>{
    if(!mesh.isSkinnedMesh || mesh.material?.name!=='World shoes')return;
    const indices=mesh.geometry.attributes.skinIndex,weights=mesh.geometry.attributes.skinWeight;
    for(let n=0;n<indices.count;n++) {
      const bone=mesh.skeleton.bones[indices.getX(n)],leg=legs.find(l=>l?.foot.name===bone?.name);
      if(!leg || weights.getX(n)<.99)continue;
      const p=mesh.getVertexPosition(n,new THREE.Vector3());
      mesh.localToWorld(p);body.worldToLocal(p);leg.sole.push(p.sub(leg.f));
    }
  });
  legs.forEach(leg=>{if(leg)leg.soleY=leg.sole.length?Math.min(...leg.sole.map(p=>p.y)):-leg.f.y;});
  const pelvis=bones.get('pelvis'),baseY=body.position.y;
  const parentAxes=pelvis?[new THREE.Vector3(0,1,0),new THREE.Vector3(1,0,0)].map(axis=>axis.applyQuaternion(origin).applyQuaternion(pelvis.parent.getWorldQuaternion(new THREE.Quaternion()).invert())):[];
  const scratch=new THREE.Quaternion(),inverse=new THREE.Quaternion();
  function swing(name,angle,axis=new THREE.Vector3(1,0,0)) {
    const bone=bones.get(name);if(!bone)return;
    bone.quaternion.copy(rest.get(name).q);
    rotateWorld(bone,axis.applyQuaternion(body.getWorldQuaternion(scratch)),angle);
    bone.updateWorldMatrix(false,true);
  }
  function aim(bone,child,target) {
    const start=bone.getWorldPosition(new THREE.Vector3());
    const current=child.getWorldPosition(new THREE.Vector3()).sub(start).normalize();
    const desired=target.clone().sub(start).normalize();
    const world=bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(new THREE.Quaternion().setFromUnitVectors(current,desired));
    bone.quaternion.copy(bone.parent.getWorldQuaternion(inverse).invert().multiply(world));
    bone.updateWorldMatrix(false,true);
  }
  let previous=0,phase=0,smoothSpeed=0,resting=true;
  return(time,speed,reduced)=>{
    const dt=Math.min(.1,Math.max(0,time-previous));previous=time;
    smoothSpeed+=(Math.max(0,speed)-smoothSpeed)*(1-Math.exp(-dt/.12));
    const run=THREE.MathUtils.smoothstep(smoothSpeed,2,3.8),cycle=THREE.MathUtils.lerp(1.25,2.6,run),stance=THREE.MathUtils.lerp(.62,.35,run);
    phase=(phase+Math.max(0,speed)*dt/cycle)%1;
    const weight=reduced?0:Math.min(1,smoothSpeed/.55);
    if(weight<.00001 && resting)return;
    for(const [name,bone] of bones){bone.quaternion.copy(rest.get(name).q);bone.position.copy(rest.get(name).p);}
    body.position.y=baseY;
    resting=weight<.00001;
    if(resting){body.updateMatrixWorld(true);return;}
    const wave=Math.cos(phase*2*Math.PI),twist=-run*.035*wave*weight;
    if(pelvis){
      rotateWorld(pelvis,new THREE.Vector3(0,1,0).applyQuaternion(body.getWorldQuaternion(scratch)),twist);
      pelvis.position.addScaledVector(parentAxes[1],run*.013*Math.sin(phase*2*Math.PI)*weight);
    }
    body.updateWorldMatrix(true,true);
    const targets=legs.map((leg,index)=>{
      if(!leg)return null;
      const u=(phase+index*.5)%1,s=(u-stance)/(1-stance),span=cycle*stance;
      const walkZ=u<stance?span*(.5-u/stance):-span*.5+span*(s-Math.sin(2*Math.PI*s)/(2*Math.PI));
      const runZ=u<stance?span*(.5-u/stance):flight(s,1,cycle*(1-stance)/span)*span;
      const lift=u<stance?0:THREE.MathUtils.lerp(Math.sin(Math.PI*s)**2*.085,Math.max(0,flight(s,2,0)),run)*weight;
      const contact=u/stance;
      const pitch=(u<stance?-.12*(1-THREE.MathUtils.smoothstep(contact,0,.22))+.34*THREE.MathUtils.smoothstep(contact,.55,1):flight(s,3,0))*run*weight;
      const cosine=Math.cos(pitch),sine=Math.sin(pitch);
      const roll=leg.sole.length?leg.soleY-Math.min(...leg.sole.map(p=>p.y*cosine-p.z*sine)):0;
      return {z:THREE.MathUtils.lerp(walkZ,runZ,run)*weight,lift:lift+roll,pitch};
    });
    let required=-Infinity;
    legs.forEach((leg,index)=>{
      if(!leg)return;
      const h=position(leg.hip),target=targets[index],reach=(leg.upper+leg.lower)*.997;
      const dx=leg.f.x-h.x,dz=leg.f.z+target.z-h.z;
      required=Math.max(required,h.y-leg.f.y-target.lift-Math.sqrt(Math.max(.01,reach*reach-dx*dx-dz*dz)));
    });
    const floatWave=.5+.5*Math.cos(phase*4*Math.PI-1.8*Math.PI);
    const desired=THREE.MathUtils.lerp(.012,.035-.05*floatWave,run);
    if(pelvis)pelvis.position.addScaledVector(parentAxes[0],-Math.max(desired,required)*weight);
    body.updateWorldMatrix(true,true);
    legs.forEach((leg,index)=>{
      if(!leg)return;
      const target=targets[index],ankle=body.localToWorld(leg.f.clone().add(new THREE.Vector3(0,target.lift,target.z)));
      const hip=leg.hip.getWorldPosition(new THREE.Vector3()),direction=ankle.clone().sub(hip);
      const distance=Math.min(direction.length(),leg.upper+leg.lower-.001);direction.normalize();
      const along=(leg.upper**2-leg.lower**2+distance*distance)/(2*distance),bend=Math.sqrt(Math.max(0,leg.upper**2-along*along));
      const forward=new THREE.Vector3(0,0,1).applyQuaternion(body.getWorldQuaternion(scratch));
      forward.addScaledVector(direction,-forward.dot(direction)).normalize();
      aim(leg.hip,leg.knee,hip.clone().addScaledVector(direction,along).addScaledVector(forward,bend));
      aim(leg.knee,leg.foot,ankle);
      const flat=body.getWorldQuaternion(new THREE.Quaternion()).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),target.pitch)).multiply(leg.q);
      leg.foot.quaternion.copy(leg.foot.parent.getWorldQuaternion(inverse).invert().multiply(flat));leg.foot.updateWorldMatrix(false,true);
    });
    // Relaxed cupped hands, with the thumb resting beside the curled fingers.
    for(const [name,bone] of bones) {
      if(/^(index|middle|ring|pinky)_0[123]_[lr]$/.test(name))
        bone.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),run*weight*(name.includes('_01_')?.18:.30)));
      else if(/^thumb_0[23]_[lr]$/.test(name))
        bone.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),run*weight*.10));
    }
    swing('spine_01',run*.14*weight);
    swing('spine_02',-twist*1.5,new THREE.Vector3(0,1,0));
    swing('spine_03',run*.022*Math.sin(phase*2*Math.PI)*weight,new THREE.Vector3(0,0,1));
    for(const [index,side] of ['l','r'].entries()) {
      const arm=Math.cos(phase*2*Math.PI+index*Math.PI);
      if(!legs[index]){swing('thigh_'+side,arm*.35*weight);swing('calf_'+side,-Math.max(0,-arm)*.45*weight);}
      swing('upperarm_'+side,arm*THREE.MathUtils.lerp(.22,.63,run)*weight);
      swing('lowerarm_'+side,-THREE.MathUtils.lerp(.16,1.05+.12*arm,run)*weight);
    }
  };
}
