// Landmarks are in the approved source illustration's pixels. No generated
// replacement animal or procedural 3D body is used: a single textured quad is
// locally deformed at the jaw, eyes, head and raised paw.
export const companionRig={
 bird:{size:[388,390],head:[244,100,126,110],mouth:[292,94,24,15],eyes:[[221,87,25,15],[298,58,13,12]],arm:[339,171,46,72],tilt:-.2},
 fox:{size:[369,390],head:[221,112,124,114],mouth:[263,150,22,26],eyes:[[211,118,25,14],[291,102,19,12]],arm:[323,222,42,65],tilt:-.12},
 cat:{size:[369,390],head:[215,112,125,111],mouth:[260,148,18,22],eyes:[[198,112,26,15],[286,98,18,13]],arm:[330,204,36,63],tilt:-.1},
 dog:{size:[390,373],head:[215,100,145,107],mouth:[273,125,31,29],eyes:[[197,76,24,13],[287,50,16,10]],arm:[337,186,40,65],tilt:-.12},
 capybara:{size:[420,392],head:[236,104,135,108],mouth:[284,135,20,23],eyes:[[190,89,23,14],[303,59,14,12]],arm:[355,183,41,70],tilt:-.1},
 'guinea-pig':{size:[385,390],head:[221,104,143,106],mouth:[278,130,20,26],eyes:[[204,87,25,15],[292,59,17,13]],arm:[341,208,36,67],tilt:-.1},
 quokka:{size:[343,390],head:[196,105,125,113],mouth:[238,149,24,25],eyes:[[174,104,24,14],[260,82,16,12]],arm:[304,206,39,70],tilt:-.08},
 panda:{size:[340,390],head:[176,104,126,110],mouth:[218,132,23,24],eyes:[[160,95,22,14],[241,79,17,12]],arm:[302,191,39,66],tilt:-.08}
};

const vertex=`attribute vec2 position;varying vec2 uv;void main(){uv=vec2((position.x+1.0)*.5,(1.0-position.y)*.5);gl_Position=vec4(position,0.,1.);}`;
const fragment=`precision mediump float;
varying vec2 uv;uniform sampler2D artwork;uniform vec2 size;
uniform vec4 head,mouth,eyeA,eyeB,arm;uniform float jaw,blink,headAngle,armAngle,tilt;
vec2 turn(vec2 p,vec4 region,float angle){vec2 d=p-region.xy;float w=1.-smoothstep(.55,1.,length(d/region.zw));float c=cos(angle*w),s=sin(angle*w);return region.xy+mat2(c,-s,s,c)*d;}
vec2 closeRegion(vec2 p,vec4 region,float openness,float angle){
 vec2 d=p-region.xy;float c=cos(angle),s=sin(angle);d=mat2(c,-s,s,c)*d;
 float x=abs(d.x)/region.z,y=abs(d.y)/region.w;
 if(x<1.&&y<1.){float influence=1.-smoothstep(.6,1.,x);float exponent=mix(1.,max(.055,openness),influence);d.y=sign(d.y)*region.w*pow(y,exponent);}
 return region.xy+mat2(c,s,-s,c)*d;
}
void main(){vec2 p=uv*size;p=turn(p,arm,armAngle);p=turn(p,head,headAngle);
 p=closeRegion(p,mouth,jaw,tilt);p=closeRegion(p,eyeA,1.-blink*.93,0.);p=closeRegion(p,eyeB,1.-blink*.93,0.);
 vec2 sampleAt=p/size;if(sampleAt.x<0.||sampleAt.x>1.||sampleAt.y<0.||sampleAt.y>1.)gl_FragColor=vec4(0.);else gl_FragColor=texture2D(artwork,sampleAt);}`;

export function createCompanionPuppet(canvas,image,rig){
 const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true,powerPreference:'low-power'});
 if(!gl)return null;
 const resources=[];
 const shader=(type,source)=>{const s=gl.createShader(type);resources.push(['Shader',s]);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Companion shader unavailable');return s};
 let program,buffer,texture;
 try{
  program=gl.createProgram();resources.push(['Program',program]);gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Companion renderer unavailable');
  gl.useProgram(program);buffer=gl.createBuffer();resources.push(['Buffer',buffer]);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  texture=gl.createTexture();resources.push(['Texture',texture]);gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
  canvas.width=rig.size[0];canvas.height=rig.size[1];gl.viewport(0,0,...rig.size);gl.uniform2fv(gl.getUniformLocation(program,'size'),rig.size);
  for(const name of ['head','mouth','arm'])gl.uniform4fv(gl.getUniformLocation(program,name),rig[name]);
  gl.uniform4fv(gl.getUniformLocation(program,'eyeA'),rig.eyes[0]);gl.uniform4fv(gl.getUniformLocation(program,'eyeB'),rig.eyes[1]);gl.uniform1f(gl.getUniformLocation(program,'tilt'),rig.tilt);
  const locations=Object.fromEntries(['jaw','blink','headAngle','armAngle'].map(name=>[name,gl.getUniformLocation(program,name)]));
  if(gl.getError()!==gl.NO_ERROR)throw Error('Companion texture unavailable');
  return {draw({jaw=0,blink=0,head=0,arm=0}={}){if(gl.isContextLost())return;gl.useProgram(program);for(const [name,value] of Object.entries({jaw:Math.max(.055,jaw),blink,headAngle:head,armAngle:arm}))gl.uniform1f(locations[name],value);gl.drawArrays(gl.TRIANGLES,0,6)},dispose(){if(!gl.isContextLost())for(const [type,value]of resources)gl['delete'+type](value)}};
 }catch{if(!gl.isContextLost())for(const [type,value]of resources)gl['delete'+type](value);return null}
}
