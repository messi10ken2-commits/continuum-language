// Named imports become language-specific chunks; server and browser share sources.
import {makeImmersiveLoader} from './loader-cache.mjs';
const loaders={en:()=>import('./en.mjs'),es:()=>import('./es.mjs'),pt:()=>import('./pt.mjs'),ja:()=>import('./ja.mjs'),zh:()=>import('./zh.mjs'),ko:()=>import('./ko.mjs'),fr:()=>import('./fr.mjs'),de:()=>import('./de.mjs'),ar:()=>import('./ar.mjs'),it:()=>import('./it.mjs')};
const loader=makeImmersiveLoader(loaders,{browser:typeof window!=='undefined'});
export const loadImmersivePack=loader.loadPack;
export const loadImmersiveUnit=loader.loadUnit;
