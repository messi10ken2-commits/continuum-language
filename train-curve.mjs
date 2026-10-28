// Fixed orthographic camera. Rails are authored in panorama pixels, then lifted onto a 3D ground plane.
const routes={
 en:[[100,570],[340,575],[625,615],[530,650],[500,675],[240,703],[-330,780]],
 es:[[80,530],[290,555],[530,600],[445,650],[430,685],[180,710],[-330,780]],
 pt:[[100,590],[325,607],[530,633],[470,676],[450,705],[220,735],[-330,790]],
 ja:[[100,565],[350,580],[630,603],[525,650],[490,672],[180,685],[-330,755]]
};
const tables=new Map(),depth=.42,ground=560;
function cubic(a,b,c,d,t){const u=1-t;return {x:u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],z:(u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]-ground)/depth};}
export function trainTrack(language='en'){
 const key=routes[language]?language:'en';if(tables.has(key))return tables.get(key);const p=routes[key],points=[];let distance=0;
 for(let segment=0;segment<2;segment++)for(let i=segment?1:0;i<=256;i++){const a=cubic(...p.slice(segment*3,segment*3+4),i/256),last=points.at(-1);if(last)distance+=Math.hypot(a.x-last.x,a.z-last.z);points.push({...a,distance});}
 const track={points,length:distance};tables.set(key,track);return track;
}
export function railPoint(language,distance){const {points,length}=trainTrack(language),d=Math.max(0,Math.min(length,distance));let lo=0,hi=points.length-1;while(lo+1<hi){const mid=(lo+hi)>>1;if(points[mid].distance<d)lo=mid;else hi=mid;}const a=points[lo],b=points[hi],q=(d-a.distance)/(b.distance-a.distance||1);return {x:a.x+(b.x-a.x)*q,z:a.z+(b.z-a.z)*q,distance:d};}
export const projectRail=(p,h=0)=>[p.x,ground+depth*p.z-h*(.95+Math.max(0,p.z)*.0002)];
export function curvedTrainPose(language='en',progress=0){
 const track=trainTrack(language),distance=((progress+.34)%1+1)%1*track.length,cars=[];
 const dimensions=language==='pt'?[[115,36,54]]:language==='en'?[[88,31,51],[104,30,47],[104,30,47]]:[[132,29,47],[132,29,47]];
 let d=distance;
 for(let i=0;i<dimensions.length;i++){const [length,width,height]=dimensions[i];if(i)d-=(dimensions[i-1][0]+length)/2+7;const rear=railPoint(language,d-length*.32),front=railPoint(language,d+length*.32),norm=Math.hypot(front.x-rear.x,front.z-rear.z)||1,t={x:(front.x-rear.x)/norm,z:(front.z-rear.z)/norm};cars.push({index:i,distance:d,length,width,height,center:{x:(front.x+rear.x)/2,z:(front.z+rear.z)/2},t,n:{x:-t.z,z:t.x},bogies:[rear,front],heading:Math.atan2(t.z,t.x),wheelAngle:d/6});}

 return {distance,cars};
}
export function carPoint(car,longitudinal,lateral,height=0){return projectRail({x:car.center.x+car.t.x*longitudinal+car.n.x*lateral,z:car.center.z+car.t.z*longitudinal+car.n.z*lateral},height);}
