import * as THREE from 'three';

// Metre-scale, distance-driven two-bone legs. Stance travels backwards at the
// character's ground speed; the swing leg clears the pavement with a bent knee.
export function makeGroundedGait(body, bones) {
  body.updateMatrixWorld(true);
  const origin = body.getWorldQuaternion(new THREE.Quaternion());
  const zAxis = new THREE.Vector3(0,0,1).applyQuaternion(origin);
  const rotateWorld = (bone, worldAxis, angle) => {
    const parent = bone.parent.getWorldQuaternion(new THREE.Quaternion()).invert();
    bone.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(worldAxis.clone().applyQuaternion(parent), angle));
  };
  for (const [side,sign] of [['l',-1],['r',1]]) {
    const arm=bones.get('upperarm_'+side);
    if(arm) { rotateWorld(arm,zAxis,sign*1.36); body.updateMatrixWorld(true); }
  }
  const rest=new Map([...bones].map(([name,bone])=>[name,{q:bone.quaternion.clone(),p:bone.position.clone()}]));
  const feet=['l','r'].map(side=>{
    const hip=bones.get('thigh_'+side), knee=bones.get('calf_'+side), foot=bones.get('foot_'+side);
    if(!hip||!knee||!foot) return null;
    const pos=b=>body.worldToLocal(b.getWorldPosition(new THREE.Vector3()));
    const h=pos(hip),k=pos(knee),f=pos(foot);
    return {hip,knee,foot,h,f,upper:h.distanceTo(k),lower:k.distanceTo(f),q:origin.clone().invert().multiply(foot.getWorldQuaternion(new THREE.Quaternion()))};
  });
  const pelvis=bones.get('pelvis'), baseY=body.position.y;
  const pelvisUp=pelvis ? new THREE.Vector3(0,1,0).applyQuaternion(origin).applyQuaternion(pelvis.parent.getWorldQuaternion(new THREE.Quaternion()).invert()) : null;
  let previous=0, phase=0, smoothSpeed=0;
  const v=new THREE.Vector3(),w=new THREE.Vector3(),q=new THREE.Quaternion(),parentQ=new THREE.Quaternion();
  function aim(bone,child,target) {
    const start=bone.getWorldPosition(new THREE.Vector3());
    const current=child.getWorldPosition(new THREE.Vector3()).sub(start).normalize();
    const desired=target.clone().sub(start).normalize();
    const correction=q.setFromUnitVectors(current,desired);
    const world=bone.getWorldQuaternion(new THREE.Quaternion()).premultiply(correction);
    bone.quaternion.copy(bone.parent.getWorldQuaternion(parentQ).invert().multiply(world));
    bone.updateWorldMatrix(false,true);
  }
  function swing(name,angle) {
    const bone=bones.get(name);if(!bone)return;
    bone.quaternion.copy(rest.get(name).q);
    const currentAxis=v.set(1,0,0).applyQuaternion(body.getWorldQuaternion(q));
    rotateWorld(bone,currentAxis,angle);
    bone.updateWorldMatrix(false,true);
  }
  return (time,speed,reduced)=>{
    const dt=Math.min(.1,Math.max(0,time-previous));previous=time;
    smoothSpeed+=(Math.max(0,speed)-smoothSpeed)*(1-Math.exp(-dt/.12));
    const run=THREE.MathUtils.smoothstep(smoothSpeed,2,3.8);
    const cycle=THREE.MathUtils.lerp(1.25,2.5,run), stance=THREE.MathUtils.lerp(.62,.4,run);
    phase=(phase+Math.max(0,speed)*dt/cycle)%1;
    const weight=reduced?0:Math.min(1,smoothSpeed/.55);
    for(const [name,bone] of bones) { bone.quaternion.copy(rest.get(name).q);bone.position.copy(rest.get(name).p); }
    body.position.y=baseY;
    if(!weight) { body.updateMatrixWorld(true); return; }
    const targets=feet.map((leg,index)=>{
      if(!leg)return null;
      const u=(phase+index*.5)%1, swingPhase=(u-stance)/(1-stance);
      const span=cycle*stance;
      const z=u<stance?span*(.5-u/stance):-span*.5+span*(swingPhase-Math.sin(2*Math.PI*swingPhase)/(2*Math.PI));
      return {z:z*weight,lift:u<stance?0:Math.sin(Math.PI*swingPhase)**2*THREE.MathUtils.lerp(.085,.19,run)*weight};
    });
    // Lower the pelvis just enough for the forward/rear support foot to reach.
    let drop=0;
    feet.forEach((leg,index)=>{
      if(!leg)return;
      const reach=(leg.upper+leg.lower)*.997,horizontal=targets[index].z+leg.f.z-leg.h.z;
      drop=Math.max(drop,leg.h.y-leg.f.y-Math.sqrt(Math.max(.01,reach*reach-horizontal*horizontal)));
    });
    if(pelvis)pelvis.position.addScaledVector(pelvisUp,-Math.max(.012,drop)*weight);
    body.updateMatrixWorld(true);
    feet.forEach((leg,index)=>{
      if(!leg)return;
      const {z,lift}=targets[index];
      const target=body.localToWorld(leg.f.clone().add(new THREE.Vector3(0,lift,z)));
      const h=leg.hip.getWorldPosition(new THREE.Vector3()),dir=target.clone().sub(h);
      const d=Math.min(dir.length(),leg.upper+leg.lower-.001);dir.normalize();
      const along=(leg.upper**2-leg.lower**2+d*d)/(2*d);
      const bend=Math.sqrt(Math.max(0,leg.upper**2-along**2));
      const forward=w.set(0,0,1).applyQuaternion(body.getWorldQuaternion(q));
      forward.addScaledVector(dir,-forward.dot(dir)).normalize();
      const kneeTarget=h.clone().addScaledVector(dir,along).addScaledVector(forward,bend);
      aim(leg.hip,leg.knee,kneeTarget);aim(leg.knee,leg.foot,target);
      const flat=body.getWorldQuaternion(new THREE.Quaternion()).multiply(leg.q);
      leg.foot.quaternion.copy(leg.foot.parent.getWorldQuaternion(parentQ).invert().multiply(flat));
      leg.foot.updateWorldMatrix(false,true);
    });
    swing('spine_01',run*.12*weight);
    for(const [index,side] of ['l','r'].entries()) {
      const step=Math.sin(phase*2*Math.PI+index*Math.PI);
      if(!feet[index]) { swing('thigh_'+side,step*.35*weight);swing('calf_'+side,-Math.max(0,-step)*.45*weight); }
      swing('upperarm_'+side,-step*THREE.MathUtils.lerp(.22,.52,run)*weight);
      swing('lowerarm_'+side,-THREE.MathUtils.lerp(.16,.8,run)*weight);
    }
  };
}
