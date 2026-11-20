import test from 'node:test';import assert from 'node:assert/strict';import {trainTrack,railPoint,curvedTrainPose,projectRail} from './train-curve.mjs';
test('every regional train follows a real bend at constant ground speed without decorative reversals',()=>{for(const language of ['en','es','pt','ja']){const track=trainTrack(language);assert.ok(track.length>1000);const xs=track.points.map(p=>p.x),turn=xs.indexOf(Math.max(...xs));assert.ok(turn>0&&turn<xs.length-1);assert.ok(xs[turn]>xs[0]+250&&xs.at(-1)<0);const a=curvedTrainPose(language,.04),b=curvedTrainPose(language,.05);assert.ok(Math.abs(b.distance-a.distance-track.length*.01)<1e-8);assert.ok(track.points.every((p,i)=>i===0||p.z>=track.points[i-1].z-.1));}});
test('bogies stay on rails, successive carriages articulate, and wheel rotation follows distance',()=>{for(const language of ['en','es','pt','ja'])for(const progress of [0,.1,.25,.4]){const {cars}=curvedTrainPose(language,progress);assert.equal(cars.length,language==='pt'?1:language==='en'?3:2);for(const car of cars){const expected=[-.32,.32].map(f=>railPoint(language,car.distance+car.length*f));assert.deepEqual(car.bogies,expected);assert.equal(car.wheelAngle,car.distance/6);assert.ok(projectRail(car.center).every(Number.isFinite));if(car.index)assert.equal(Math.round(cars[car.index-1].distance-car.distance),(cars[car.index-1].length+car.length)/2+7);}if(cars.length>1&&progress===0)assert.ok(Math.abs(cars[0].heading-cars[1].heading)>.2,'carriages have independent headings at the bend');}});

test('curve exits match painted rail centres and join the straight without lateral drift',()=>{
 // Independent panorama measurements, in native 1920 × 896 pixels. These catch
 // paths that stay internally consistent while missing the actual painted rails.
 const references={en:[[500,664],[450,681],[400,692],[350,705],[300,718],[250,730]],es:[[400,675],[350,690],[300,704],[250,718]],pt:[[450,698],[400,710],[350,721],[300,730],[250,739]],ja:[[450,665],[400,675],[350,684],[300,693],[250,700]]};
 for(const [language,anchors] of Object.entries(references)){
  const points=trainTrack(language).points.map(p=>projectRail(p)),apex=points.reduce((a,p,i)=>p[0]>points[a][0]?i:a,0),outgoing=points.slice(apex);
  for(const [x,y] of anchors){const i=outgoing.findIndex(p=>p[0]<=x),a=outgoing[i-1],b=outgoing[i],q=(x-a[0])/(b[0]-a[0]),actual=a[1]+q*(b[1]-a[1]);assert.ok(Math.abs(actual-y)<3,language+' exit at '+x+' misses the painted rails: '+actual+' vs '+y);}
  const straight=points.slice(2048),a=straight[0],b=straight.at(-1),dx=b[0]-a[0],dy=b[1]-a[1];
  for(const p of straight)assert.ok(Math.abs((p[0]-a[0])*dy-(p[1]-a[1])*dx)<1e-7,'no curved drift on the straight');
  for(const join of [1024,2048]){const a=points[join-1],b=points[join],c=points[join+1],u=[b[0]-a[0],b[1]-a[1]],v=[c[0]-b[0],c[1]-b[1]];assert.ok(Math.abs(u[0]*v[1]-u[1]*v[0])/(Math.hypot(...u)*Math.hypot(...v))<.04,language+' has an abrupt direction change');}
 }
});
