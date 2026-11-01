import {countryWorlds} from './country-worlds.mjs';
import {learningSceneryFamily as learningArtFamily} from './learning-art-families.mjs';
// Detailed rolling stock in world coordinates, shaded through the map's fixed camera.
// No photographs/cutout fragments are stretched onto a box.
import {curvedTrainPose,projectRail,railPoint} from './train-curve.mjs';
const DOT=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0),UNIT=v=>{const l=Math.hypot(...v)||1;return v.map(n=>n/l)},CROSS=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const VIEW=[0,.42,.9075],LIGHT=UNIT([-.5,.83,.35]);
const STOCK={
 pt:{paint:'#dfa92e',upper:'#e9dfbc',band:'#b58222',roof:'#4a5558',frame:'#a57839',glass:'#283f40',length:115},
 es:{paint:'#e1e2d6',upper:'#e9e6d4',band:'#254d78',roof:'#5d6c76',frame:'#959f9c',glass:'#263b48'},
 ja:{paint:'#d5cbb6',upper:'#e6ddca',band:'#917087',roof:'#64616b',frame:'#7b7772',glass:'#2b3d45'},
 en:{paint:'#254a3c',upper:'#254a3c',band:'#254a3c',roof:'#2e3943',frame:'#bd9d54',glass:'#273e3e'}
};
for(const [language,c] of Object.entries(countryWorlds))STOCK[language]={paint:c.paint,upper:c.paint,band:c.band,roof:'#5e696c',frame:'#a7aaa1',glass:'#2c4653'};
export function stockSpecification(language='en'){return STOCK[learningArtFamily(language)];}
export function buildRollingStock(language='en',progress=0){
 language=learningArtFamily(language);
 const pose=curvedTrainPose(language,progress),faces=[],lines=[],shadows=[],details={archedRoofSegments:0,windows:0,wheels:0},spec=stockSpecification(language);
 const P=(c,x,w,h)=>[c.center.x+c.t.x*x+c.n.x*w,h,c.center.z+c.t.z*x+c.n.z*w];
 const screen=p=>projectRail({x:p[0],z:p[2]},p[1]);
 function face(ps,color,options={}){if(ps.length<3)return;let n=UNIT(CROSS(ps[1].map((v,i)=>v-ps[0][i]),ps[2].map((v,i)=>v-ps[0][i])));if(options.out&&DOT(n,options.out)<0)n=n.map(v=>-v);if(!options.double&&DOT(n,VIEW)<-.01)return;faces.push({kind:'face',points:ps.map(screen),depths:ps.map(p=>DOT(p,VIEW)),depth:ps.reduce((z,p)=>z+DOT(p,VIEW),0)/ps.length,color,light:.59+.43*Math.max(0,DOT(n,LIGHT)),...options});}
 function line(ps,color,width=.6,options={}){lines.push({kind:'line',points:ps.map(screen),depths:ps.map(p=>DOT(p,VIEW)+.04),depth:ps.reduce((z,p)=>z+DOT(p,VIEW),0)/ps.length+.04,color,width,...options});}
 function box(c,x0,x1,w0,w1,h0,h1,color,openEnds=false){const p=(x,w,h)=>P(c,x,w,h);face([p(x0,w0,h0),p(x1,w0,h0),p(x1,w0,h1),p(x0,w0,h1)],color,{out:[-c.n.x,0,-c.n.z]});face([p(x0,w1,h0),p(x1,w1,h0),p(x1,w1,h1),p(x0,w1,h1)],color,{out:[c.n.x,0,c.n.z]});if(!openEnds)face([p(x1,w0,h0),p(x1,w1,h0),p(x1,w1,h1),p(x1,w0,h1)],color,{out:[c.t.x,0,c.t.z]});if(!openEnds)face([p(x0,w0,h0),p(x0,w1,h0),p(x0,w1,h1),p(x0,w0,h1)],color,{out:[-c.t.x,0,-c.t.z]});face([p(x0,w0,h1),p(x1,w0,h1),p(x1,w1,h1),p(x0,w1,h1)],color,{out:[0,1,0]});}
 function roof(c,x0,x1,w,spring,rise,color){
  // A barrel roof, with a round end lip, rather than a single flat rectangular lid.
  const segments=24,rings=[{x:x0,w:w-.8,r:rise-.5},{x:x0+1.7,w,r:rise},{x:x1-1.7,w,r:rise},{x:x1,w:w-.8,r:rise-.5}];
  const at=(r,i)=>P(c,r.x,-Math.cos(i/segments*Math.PI)*r.w,spring+Math.sin(i/segments*Math.PI)*r.r);
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<segments;i++){const mid=(i+.5)/segments*Math.PI;face([at(rings[j],i),at(rings[j+1],i),at(rings[j+1],i+1),at(rings[j],i+1)],color,{out:[-Math.cos(mid)*c.n.x,Math.sin(mid),-Math.cos(mid)*c.n.z],metal:true});details.archedRoofSegments++;}
  for(const j of [0,rings.length-1])face(Array.from({length:segments+1},(_,i)=>at(rings[j],i)),color,{out:[c.t.x*(j?1:-1),0,c.t.z*(j?1:-1)]});
  for(const x of [x0+(x1-x0)*.24,x0+(x1-x0)*.5,x0+(x1-x0)*.76])line(Array.from({length:17},(_,i)=>P(c,x,-Math.cos(i/16*Math.PI)*w,spring+Math.sin(i/16*Math.PI)*rise)), '#a5ada7',.25,{alpha:.25});
  for(const side of [-1,1])line([P(c,x0,side*w,spring),P(c,x1,side*w,spring)],'#c0b89d',.45,{alpha:.6});
 }
 function cylinder(c,x0,x1,r,h,color,bands=[]){
  const n=32,at=(x,i,extra=0)=>P(c,x,Math.cos(i/n*Math.PI*2)*(r+extra),h+Math.sin(i/n*Math.PI*2)*(r+extra));
  for(let i=0;i<n;i++){const a=(i+.5)/n*Math.PI*2;face([at(x0,i),at(x1,i),at(x1,i+1),at(x0,i+1)],color,{out:[Math.cos(a)*c.n.x,Math.sin(a),Math.cos(a)*c.n.z],metal:true});}
  face(Array.from({length:n},(_,i)=>at(x1,i)),color,{out:[c.t.x,0,c.t.z],metal:true});
  for(const x of bands)line(Array.from({length:n+1},(_,i)=>at(x,i, .4)),'#ac965e',.8);
 }
 function window(c,plane,x0,x1,h0,h1,side,seed=0){
  const w=c.width/2+.14,at=(x,h,offset=0)=>plane==='side'?P(c,x,side*(w+offset),h):P(c,side*(c.length/2-1.7-2.3*Math.pow(Math.abs(x)/(c.width/2),3)-1.5*Math.max(0,(h-32)/(c.height-8-32))+.23+offset),x,h);
  const out=plane==='side'?[c.n.x*side,0,c.n.z*side]:[c.t.x*side,0,c.t.z*side];
  const corners=(a,b,c0,d,offset=0)=>[at(a,c0,offset),at(b,c0,offset),at(b,d,offset),at(a,d,offset)];
  face(corners(x0-.8,x1+.8,h0-.8,h1+.8),spec.frame,{out,metal:true});
  face(corners(x0,x1,h0,h1,.06),spec.glass,{out,glass:true,seed});details.windows++;
  // Recessed interior, warm seat silhouettes and offset sunset reflections follow the glass plane.
  const y=h0+(h1-h0)*.28;
  face(corners(x0+1,x1-1,h0+1,y,.1),'#b17e42',{out,alpha:.3});
  face([at(x0+.8,h1-1,.12),at(x0+2.8,h1-1,.12),at(Math.min(x1-.7,x0+5),h0+2,.12),at(x0+3,h0+2,.12)],'#d7e2da',{out,alpha:.2});
  line([at(x0,h0,.18),at(x1,h0,.18)],'#e5d7ad',.45,{alpha:.8});
 }
 function wheels(c,steam){
  for(const bogie of c.bogies){
   const before=railPoint(language,bogie.distance-1),after=railPoint(language,bogie.distance+1),len=Math.hypot(after.x-before.x,after.z-before.z)||1,t={x:(after.x-before.x)/len,z:(after.z-before.z)/len},n={x:-t.z,z:t.x};
   const b={...c,center:bogie,t,n};box(b,-10,10,-c.width/2+2,c.width/2-2,5,13,'#252b2c');
   for(const axle of [-5.7,5.7])for(const side of [-1,1]){
    const r=steam?7:5.6,center=P(b,axle,side*(c.width/2+.4),r),radius=(rr,a)=>[center[0]+t.x*Math.cos(a)*rr,center[1]+Math.sin(a)*rr,center[2]+t.z*Math.cos(a)*rr];
    const out=[side*n.x,0,side*n.z],ring=rr=>Array.from({length:28},(_,i)=>radius(rr,i/28*Math.PI*2));
    face(ring(r),'#252c30',{out,double:true});face(ring(r-.8),'#7d8583',{out,metal:true});face(ring(r-1.6),'#242a2c',{out});
    for(let i=0;i<6;i++){const a=c.distance/r+i*Math.PI/3;line([radius(1,a),radius(r-2,a)],'#b5b8aa',.45);}
    face(ring(1.1),'#bfc1b6',{out,metal:true});details.wheels++;
   }
   for(const side of [-1,1]){const w=side*(c.width/2+1);line(Array.from({length:13},(_,i)=>P(b,-7+i*1.1,w,11+(i%2)*1.4)),'#65716f',.6);}
  }
 }
 function passenger(c){
  const l=c.length/2,w=c.width/2,wall=c.height-8,paint=spec.paint,p=(x,y,z)=>P(c,x,y,z);
  wheels(c,false);box(c,-l+2,l-2,-w+2,w-2,10,18,'#343a39');
  // Rounded sill and lower body; the brass/steel edges are narrow highlights, not black outlines.
  box(c,-l+2,l-2,-w+.7,w-.7,12,wall,paint,true);
  for(const side of [-1,1]){
   const y=side*w,out=[c.n.x*side,0,c.n.z*side];
   face([p(-l+2,y,12),p(l-2,y,12),p(l-2,y,21),p(-l+2,y,21)],spec.band,{out,metal:true});
   face([p(-l+2,y,21),p(l-2,y,21),p(l-2,y,wall),p(-l+2,y,wall)],spec.upper,{out});
   const count=language==='pt'?7:5,door=10,usable=c.length-2*door-8,ww=usable/count-2.2;
   for(let i=0;i<count;i++){const x=-l+door+4+i*usable/count;window(c,'side',x,x+ww,language==='en'?19:22,wall-3,side,i);}
   for(const end of [-1,1]){const x=end*(l-door/2-1),a=x-door/2+1,b=x+door/2-1;face([p(a,y,12),p(b,y,12),p(b,y,wall),p(a,y,wall)],spec.upper,{out});window(c,'side',a+1,b-1,25,wall-3,side);line([p(a,y+.1*side,18),p(a,y+.1*side,wall),p(b,y+.1*side,wall),p(b,y+.1*side,18)],spec.frame,.5);line([p(x+1,y+.4*side,25),p(x+1,y+.4*side,28)],'#e0d5ae',.7);}
   line([p(-l+2,y,21),p(l-2,y,21)],'#e7d7a7',.65,{alpha:.8});
   for(let i=0;i<6;i++){const x=-l+6+i*(c.length-12)/5;line([p(x,y,19),p(x,y,25)],'#0b1010',.28,{alpha:.25});}
  }
  // Bowed/raked cab ends: narrow facets follow the curved front rather than a square end wall.
  for(const end of [-1,1]){
   const X=(v,h)=>end*(l-1.7-2.3*Math.pow(Math.abs(v)/w,3)-1.5*Math.max(0,(h-32)/(wall-32))),out=[c.t.x*end,0,c.t.z*end];
   for(let j=0;j<12;j++){const a=-w+j*w/6,b=a+w/6;face([p(X(a,18),a,18),p(X(b,18),b,18),p(X(b,wall),b,wall),p(X(a,wall),a,wall)],paint,{out});}
   const gap=language==='pt'?4:1;
   // Cab wipers and a raised destination sign stay attached to the curved end surface.
   const cab=(v,h,extra=.35)=>p(X(v,h)+end*extra,v,h);
   for(const side of [-1,1])line([cab(side*w*.5,wall-17),cab(side*w*.35,wall-6)],'#26302e',.55);
   if(language==='pt'){const x=end*(l+1.25);face([p(x,-7,wall+1),p(x,7,wall+1),p(x,7,wall+4.5),p(x,-7,wall+4.5)],'#263d33',{out,metal:true});for(let i=0;i<4;i++)line([p(x+end*.12,-4.5+i*2.8,wall+2),p(x+end*.12,-3.4+i*2.8,wall+3.3)],'#e9dab0',.4);}

   window(c,'end',-w+3,-gap,wall-18,wall-3,end);window(c,'end',gap,w-3,wall-18,wall-3,end);
   if(language==='pt'){window(c,'end',-3,3,24,wall-4,end);line([p(end*(l-1),-4,18),p(end*(l-1),-4,wall)],'#e1c67a',.6);}
   for(const side of [-1,1]){
    const v=side*w*.64,x=end*(l+.2),h=language==='pt'?21:18;
    const circle=(radius,z)=>Array.from({length:22},(_,i)=>p(x+end*z,v+Math.cos(i/22*Math.PI*2)*radius,h+Math.sin(i/22*Math.PI*2)*radius));
    face(circle(2.5,0),'#9c9b82',{out,metal:true});face(circle(1.8,.2),'#fff2b1',{out,glow:true});
    line([p(end*(l+1),side*(w-1),20),p(end*(l+1),side*(w-1),36)],'#d5c9a1',.7);
   }
   line([p(end*(l+2),-w+2,15),p(end*(l+3),0,14),p(end*(l+2),w-2,15)],'#5b6461',3.2);
   line([p(end*(l+2),-w+2,16),p(end*(l+3),0,15),p(end*(l+2),w-2,16)],'#bac0b4',.55);
   box(c,end*l-1.3,end*l+1.3,-4,4,8,13,'#303738');
  }
  roof(c,-l-1,l+1,w+1.3,wall,8.5,spec.roof);
  if(language==='pt'){
   roof(c,-l+11,l-11,w*.62,wall+7,5.5,'#777d73');
   // Spring-loaded trolley pole, insulators and current collector, all real 3D points.
   for(const x of [-14,13])box(c,x-2,x+2,-3,3,wall+12,wall+15,'#424842');
   line([p(-14,0,wall+15),p(2,0,wall+31),p(28,0,wall+14)],'#4d5148',1.4);
   line([p(-12,1,wall+15),p(3,1,wall+29),p(27,1,wall+14)],'#aea77a',.45);
   line([p(0,-8,wall+31),p(0,8,wall+31)],'#53544a',1.3);
  }else for(const x of [-c.length*.26,0,c.length*.26])roof(c,x-5,x+5,3.2,wall+7,3,'#535e63');
 }
 function locomotive(c){
  const l=c.length/2,w=c.width/2,p=(x,y,z)=>P(c,x,y,z);wheels(c,true);box(c,-l,l,-w,w,12,18,'#273b32');
  // Real circular boiler/smokebox, rounded cab roof, brass boiler bands and separate cylinders.
  cylinder(c,-l+29,l-5,w*.82,32,'#214b3c',[-l+34,1,l-13]);cylinder(c,l-5,l+1,w*.84,32,'#313b39',[l]);
  box(c,-l+3,-l+31,-w,w,18,57,spec.paint);roof(c,-l,-l+34,w+2,57,6.5,'#34404b');
  for(const side of [-1,1]){const out=[c.n.x*side,0,c.n.z*side];window(c,'side',-l+8,-l+20,34,52,side);line([p(-l+6,side*(w+.5),22),p(-l+6,side*(w+.5),54)],'#c5a761',.8);face([p(-l+27,side*w,27),p(l-3,side*w,27),p(l-3,side*w,29),p(-l+27,side*w,29)],'#c5ad66',{out});}
  // Flared chimney and steam dome, not floating square blocks.
  for(const [x,r,h0,h1] of [[l-17,3.5,44,66],[-5,4,43,52]]){
   const levels=[[h0,r+1],[h1-2,r],[h1,r+2]],segments=20;
   for(let level=0;level<levels.length-1;level++)for(let i=0;i<segments;i++){const a=i/segments*Math.PI*2,b=(i+1)/segments*Math.PI*2,[z0,r0]=levels[level],[z1,r1]=levels[level+1];const q=(t,r,z)=>p(x+Math.cos(t)*r,Math.sin(t)*r,z);face([q(a,r0,z0),q(b,r0,z0),q(b,r1,z1),q(a,r1,z1)],'#414a3b',{out:[Math.cos(a)*c.t.x+Math.sin(a)*c.n.x,0,Math.cos(a)*c.t.z+Math.sin(a)*c.n.z],metal:true});}
   face(Array.from({length:20},(_,i)=>p(x+Math.cos(i/20*Math.PI*2)*(r+2),Math.sin(i/20*Math.PI*2)*(r+2),h1)),'#222d28',{out:[0,1,0]});
  }
  const out=[c.t.x,0,c.t.z];face(Array.from({length:24},(_,i)=>p(l+1.5,Math.cos(i/24*Math.PI*2)*4,34+Math.sin(i/24*Math.PI*2)*4)),'#bda566',{out,metal:true});face(Array.from({length:24},(_,i)=>p(l+1.7,Math.cos(i/24*Math.PI*2)*2.8,34+Math.sin(i/24*Math.PI*2)*2.8)),'#fff0b0',{out,glow:true});
  for(let i=-4;i<=4;i++)line([p(l+2,i*3,18),p(l+11,i*3.5,7)],'#a28d58',.75);
  line([p(l+11,-15,7),p(l+11,15,7)],'#655e49',1.2);
  for(const side of [-1,1]){line([p(-l+25,side*(w+1.5),40),p(l-6,side*(w+1.5),40)],'#d3b873',.7);line([p(-l+20,side*(w+1),10),p(l-9,side*(w+1),10)],'#b6ad90',1.1);}
 }
 for(const car of pose.cars){
  const p=(x,w,h)=>P(car,x,w,h),l=car.length/2,w=car.width/2;
  shadows.push({points:[p(-l,-w,0),p(l,-w,0),p(l,w,0),p(-l,w,0)].map(screen)});
  if(language==='en'&&car.index===0)locomotive(car);else passenger(car);
 }
 for(let i=1;i<pose.cars.length;i++){const a=pose.cars[i],b=pose.cars[i-1];line([P(a,a.length/2,0,11),P(b,-b.length/2,0,11)],'#313730',2.2);}
 const primitives=[...faces,...lines].sort((a,b)=>a.depth-b.depth),all=[...primitives.flatMap(f=>f.points),...shadows.flatMap(s=>s.points)],xs=all.map(p=>p[0]),ys=all.map(p=>p[1]),left=Math.min(...xs)-14,top=Math.min(...ys)-14;
 return {pose,primitives,shadows,details,bounds:{left,top,width:Math.max(...xs)-left+14,height:Math.max(...ys)-top+14}};
}
