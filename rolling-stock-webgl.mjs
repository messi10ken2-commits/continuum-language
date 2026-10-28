// Depth-tested rasterization prevents window panels or roof sections overwriting one another in a turn.
const rgb=hex=>hex.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16)/255);
export function createRollingStockRenderer(canvas){
 const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true,preserveDrawingBuffer:true});if(!gl)return null;
 const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
 const vs=shader(gl.VERTEX_SHADER,'attribute vec3 position;attribute vec4 color;attribute float glass;varying vec4 vColor;varying float vGlass;void main(){gl_Position=vec4(position,1.0);vColor=color;vGlass=glass;}');
 const fs=shader(gl.FRAGMENT_SHADER,'precision mediump float;varying vec4 vColor;varying float vGlass;void main(){vec4 c=vColor;if(vGlass>=0.0){float q=vGlass;vec3 a=vec3(.49,.59,.60);vec3 b=vec3(.14,.22,.25);vec3 d=vec3(.22,.29,.28);vec3 e=vec3(.69,.48,.25);c.rgb=q<.22?mix(a,b,q/.22):(q<.65?mix(b,d,(q-.22)/.43):mix(d,e,(q-.65)/.35));}gl_FragColor=c;}');
 const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
 const buffer=gl.createBuffer(),position=gl.getAttribLocation(program,'position'),color=gl.getAttribLocation(program,'color'),glass=gl.getAttribLocation(program,'glass');
 function draw(model){
  const b=model.bounds,prims=model.primitives,depths=prims.flatMap(p=>p.depths),near=Math.max(...depths)+10,far=Math.min(...depths)-10,opaque=[],translucent=[],shadows=[];
  const vertex=(list,p,depth,c)=>list.push((p[0]-b.left)/b.width*2-1,1-(p[1]-b.top)/b.height*2,(near-depth)/(near-far)*2-1,...c.slice(0,4),c[4]??-1);
  const tri=(list,ps,ds,cs)=>{for(let i=1;i<ps.length-1;i++)for(const j of [0,i,i+1])vertex(list,ps[j],ds[j],cs[j]);};
  for(const s of model.shadows){const cx=s.points.reduce((n,p)=>n+p[0],0)/4,cy=s.points.reduce((n,p)=>n+p[1],0)/4;for(let i=5;i>=0;i--){const q=s.points.map(p=>[cx+(p[0]-cx)*(1+i*.025),cy+(p[1]-cy)*(1+i*.08)+1]);tri(shadows,q,q.map(()=>far),q.map(()=>[.07,.08,.06,.018]));}}
  for(const f of prims){
   if(f.kind==='line'){for(let i=1;i<f.points.length;i++){const a=f.points[i-1],p=f.points[i],dx=p[0]-a[0],dy=p[1]-a[1],len=Math.hypot(dx,dy)||1,n=[-dy/len*f.width/2,dx/len*f.width/2],ps=[[a[0]+n[0],a[1]+n[1]],[p[0]+n[0],p[1]+n[1]],[p[0]-n[0],p[1]-n[1]],[a[0]-n[0],a[1]-n[1]]],c=[...rgb(f.color),f.alpha??1];tri(f.alpha?translucent:opaque,ps,[f.depths[i-1],f.depths[i],f.depths[i],f.depths[i-1]],ps.map(()=>c));}continue;}
   const base=rgb(f.color),ys=f.points.map(p=>p[1]),y0=Math.min(...ys),range=Math.max(...ys)-y0||1;
   const colors=f.points.map(p=>{const q=(p[1]-y0)/range;if(f.glass){const stops=[[0,[.49,.59,.60]],[.22,[.14,.22,.25]],[.65,[.22,.29,.28]],[1,[.69,.48,.25]]];let i=1;while(i<stops.length-1&&q>stops[i][0])i++;const a=stops[i-1],c=stops[i],t=(q-a[0])/(c[0]-a[0]);return [...a[1].map((v,k)=>v+(c[1][k]-v)*t),1,q];}const intensity=f.glow?1:f.light*((f.metal?1.1:1.04)-q*.15);return [...base.map(v=>Math.min(1,v*intensity)),f.alpha??1];});
   tri(f.alpha?translucent:opaque,f.points,f.depths,colors);
  }
  gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(position);gl.enableVertexAttribArray(color);gl.enableVertexAttribArray(glass);gl.vertexAttribPointer(position,3,gl.FLOAT,false,32,0);gl.vertexAttribPointer(color,4,gl.FLOAT,false,32,12);gl.vertexAttribPointer(glass,1,gl.FLOAT,false,32,28);
  const batch=vertices=>{if(!vertices.length)return;gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,vertices.length/8);};
  gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.DEPTH_TEST);gl.depthMask(false);batch(shadows);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.depthMask(true);gl.disable(gl.BLEND);batch(opaque);
  gl.enable(gl.BLEND);gl.depthMask(false);batch(translucent);gl.depthMask(true);gl.flush();
 }
 return {draw,dispose(){gl.deleteBuffer(buffer);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);gl.getExtension('WEBGL_lose_context')?.loseContext();}};
}
