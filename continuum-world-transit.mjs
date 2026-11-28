export const worldRailRoutes=[{scene:'tokyo_station_hall',from:'tokyo',to:'osaka',platform:'14  新大阪 / Shin-Osaka',boarding:'大阪へ / Board for Osaka'},{scene:'osaka_station_hall',from:'osaka',to:'tokyo',platform:'18  東京 / Tokyo',boarding:'東京へ / Board for Tokyo'}];
// Ground-level accessible connector: gates → signed concourse → platform →
// open train doorway. Rendered solids and colliders use these same coordinates.
export const stationBoarding={x:8,z:-15.8};
export const stationTransitObstacles=[
 {x:-1.75,z:-6.15,width:10.5,depth:.3},{x:6.75,z:-6.15,width:.5,depth:.3},
 {x:-1.85,z:-8,width:10.3,depth:3.6},{x:14,z:-8,width:14,depth:3.6},
 {x:14,z:0,width:14,depth:12},
 {x:-1,z:-14,width:16,depth:.18},{x:15,z:-14,width:12,depth:.18},
 {x:7,z:-18.4,width:28,depth:.2},
 {x:-5.9,z:-16.2,width:2.2,depth:4.4},{x:20.7,z:-16.2,width:.2,depth:4.4},
 ...[-2,1,4,12,15,18].map(x=>({x,z:-17.4,width:1.5,depth:.8})),
];
export function makeStationBoarding(root,meshes,scene='tokyo_station_hall'){
 const route=worldRailRoutes.find(r=>r.scene===scene);if(!route)throw Error('Unknown station');
 const {shape,surface,sign}=meshes,steel=surface('metal',1,0x8d999b),wall=surface('concrete',3,0xd6d8cf);
 const b=(m,p,s)=>shape(root,'box',m,p,s);
 b(surface('tile',8,0xc6cbc7),[4.8,-.1,-8],[3.4,.2,4]);
 for(const x of [3,6.6])b(wall,[x,2.4,-8],[.2,4.8,4]);
 b(wall,[4.8,4.85,-8],[3.8,.1,4]);
 // Ticket gates flank a clear 1.5 m aisle rather than a fake impassable bar.
 for(const x of [3.55,6.05]){
  b(steel,[x,.52,-7.4],[.48,1.04,1.8]);b(0x254c63,[x,1.06,-7.1],[.32,.04,.38]);
  b(0x72bc94,[x,1.1,-6.75],[.18,.05,.14]);
 }
 sign(root,'新幹線 / SHINKANSEN →',[4.8,3.5,-6.4],3,'#224b65');
 for(const z of [-8,-10])b(0xd6b651,[4.8,.008,z],[.6,.016,1.8]);
 // Platform is flush with the room floor. The track sits below it, beyond
 // continuous barriers; there is no unsupported step across the walking route.
 b(meshes.special('station-platform',{color:0xb2bbb5,roughness:.9,emissive:0x28352f,emissiveIntensity:.3}),[7,-.15,-12],[28,.3,4]);
 b(0xc9aa43,[7,.008,-13.35],[27,.016,.45]);
 b(0x374b51,[7,-.6,-16.2],[28,.2,4.4]);
 for(const z of [-15.25,-17.15])b(steel,[7,-.32,z],[28,.12,.09]);
 for(let x=-6;x<21;x+=.8)b(0x69736f,[x,-.43,-16.2],[.15,.12,3]);
 for(const x of [-6,0,16,20]){
  b(steel,[x,2.5,-10.4],[.2,5,.2]);
  b(0x343d42,[x,4.65,-12],[.15,.15,4]);
 }
 b(steel,[7,5,-12],[28,.12,5]);
 for(const x of [-2,6,14]){
  shape(root,'box',0xf4f0d4,[x,4.86,-12],[4,.04,.35],true);
  sign(root,route.platform,[x,3.6,-12.5],3.6,'#173f58');
 }
 // Shinkansen carriage: blue waistline, recessed windows, open sliding-door
 // pocket, interior luggage racks and seats. The door is a real walkable gap.
 const white=meshes.special('shinkansen-enamel',{color:0xe9eded,roughness:.3,metalness:.18,emissive:0x263439,emissiveIntensity:.16}),blue=0x235991;
 b(white,[8,-.06,-16.2],[25.4,.12,4.3]);
 b(white,[8,3.5,-16.2],[25.4,.2,4.4]);
 b(white,[8,1.75,-18.45],[25.4,3.5,.18]);
 for(const [x,w]of [[1.1,11.8],[14.9,11.8]]){
  b(white,[x,.65,-14],[w,1.3,.18]);b(blue,[x,1.15,-13.89],[w,.24,.035]);
  b(white,[x,3.1,-14],[w,.6,.18]);
 }
 for(let x=-3.8;x<20;x+=2.2){
  if(x>6.5&&x<9.5)continue;
  b(white,[x+1.05,2.05,-14],[.3,1.5,.18]);
  b(0x3a5d6d,[x,2.05,-14.015],[1.55,1.02,.065]);
  b(0x3a5d6d,[x,2.05,-18.32],[1.55,1.02,.065]);
 }
 b(steel,[8,.025,-14.02],[1.9,.05,.4]);
 for(const x of [7,9])b(steel,[x,1.65,-14],[.12,3.3,.22]);
 sign(root,'8号車 / CAR 8',[8,3.12,-13.87],1.5,'#244b68');
 for(const x of [-2,1,4,12,15,18]){
  b(0x45687e,[x,.5,-17.4],[1.5,.2,.8]);b(0x45687e,[x,.95,-17.75],[1.5,.9,.16]);
  b(0xd8d5c8,[x,1.4,-17.76],[1.3,.18,.12]);b(steel,[x,.22,-17.4],[.7,.4,.5]);
 }
 b(steel,[8,2.7,-17.8],[24,.08,.7]);
 sign(root,route.boarding,[8,2,-18.3],3,'#244b68');
}
