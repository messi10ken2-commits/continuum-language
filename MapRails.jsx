import React from 'react';
import {trainTrack,railPoint,projectRail} from './train-curve.mjs';
// Use the same ground-space centre line and gauge as the rendered bogies.
export default function MapRails({language}){
 const track=trainTrack(language),edges=[[],[]],sleepers=[];
 for(let d=0;d<=track.length;d+=8){const p=railPoint(language,d),q=railPoint(language,Math.min(track.length,d+1)),r=railPoint(language,Math.max(0,d-1)),dx=q.x-r.x,dz=q.z-r.z,n=Math.hypot(dx,dz)||1;for(let side=0;side<2;side++){const w=side?14:-14;edges[side].push(projectRail({x:p.x-dz/n*w,z:p.z+dx/n*w}));}if(d%32===0){sleepers.push([-24,24].map(w=>projectRail({x:p.x-dz/n*w,z:p.z+dx/n*w})));}}
 const path=points=>points.map(([x,y],i)=>(i?'L':'M')+x.toFixed(2)+' '+y.toFixed(2)).join(' ');
 return <svg className="map-rails" viewBox="0 0 1920 896" preserveAspectRatio="none" aria-hidden="true"><g stroke="#796852" strokeWidth="3">{sleepers.map((ps,i)=><path key={i} d={path(ps)}/>)}</g>{edges.map((ps,i)=><path key={i} d={path(ps)} fill="none" stroke="#777d7c" strokeWidth="2"/>)}</svg>;
}
