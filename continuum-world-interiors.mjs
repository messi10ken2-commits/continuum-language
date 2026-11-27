import {makeHoshiInterior} from './continuum-world-konbini.mjs';
import {makeCafeInterior} from './continuum-world-cafe.mjs';
export function makeWorldInterior(id,meshes){
  if(id==='tokyo_cafe')return makeCafeInterior(meshes);
  if(id==='tokyo_konbini')return makeHoshiInterior(meshes);
  throw new Error('Unsupported World interior');
}
