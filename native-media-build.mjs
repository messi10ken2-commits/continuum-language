import {validatedAPIOrigin} from './native-policy.mjs';
// List entries after a comma lack the quote that the ordinary literal transform matches.
// Keep every density candidate on the same approved HTTPS origin as the first image.
export function rewriteNativeMediaLists(code,{origin,roots}){
 const base=validatedAPIOrigin(origin);
 if(!Array.isArray(roots)||roots.some(root=>typeof root!=='string'||! /^[A-Za-z0-9_-]+$/.test(root)))throw Error('Invalid native media roots');
 if(!roots.length)return code;
 const pattern=new RegExp('(,\\s*)/('+roots.join('|')+')(?=/)','g');
 return code.replace(pattern,(_,separator,root)=>separator+base+'/'+root);
}
