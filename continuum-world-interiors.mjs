import {makeExpansionInterior} from './continuum-world-expansion-interiors.mjs';
import {makeHoshiInterior} from './continuum-world-konbini.mjs';
import {makeCafeInterior} from './continuum-world-cafe.mjs';
export function makeWorldInterior(id,meshes){
  if(id==='tokyo_cafe')return makeCafeInterior(meshes);
  if(id==='tokyo_konbini')return makeHoshiInterior(meshes);
  return makeExpansionInterior(id,meshes);
}
