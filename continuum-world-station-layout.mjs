// Shared geometry/collision dimensions; metres. Tracks are scenery behind a
// continuous barrier, never a destination or a walkable boarding area in Phase 1.
export const stationLayout = {
  forecourt: {x:0,z:-20.5,width:22,depth:15,top:.055},
  rotary: {x:0,z:-20.5,rx:8.6,rz:5.2},
  island: {x:0,z:-20.5,rx:2.8,rz:2.0},
  railSite: {x:0,z:-43,width:72,depth:15},
  platform: {x:0,z:-38,width:25,depth:3.2},
  tracks: [-41.4,-45.4],
  shelters: [{x:-10.7,z:-24,width:2,depth:3.8},{x:10.7,z:-24,width:2,depth:3.8}],
  streetTrees: [{x:-26,z:-2.7},{x:-12,z:-2.7},{x:12,z:-2.7},{x:26,z:-2.7}],
};
