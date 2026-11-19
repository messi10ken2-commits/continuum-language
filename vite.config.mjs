import {defineConfig} from 'vite';
import {readdirSync} from 'node:fs';
import {validatedAPIOrigin} from './native-policy.mjs';
import {rewriteNativeMediaLists} from './native-media-build.mjs';
export default defineConfig(({mode})=>{
 const native=mode==='native',origin=validatedAPIOrigin(process.env.CONTINUUM_API_ORIGIN);
 const roots=readdirSync(new URL('./public/',import.meta.url)).filter(s=>!s.includes('.')&&!['fonts','flags'].includes(s));
 const rootPattern=new RegExp('(["\'`])/(?:'+roots.join('|')+')(?=/|[^a-zA-Z0-9_-])','g');
 return {publicDir:native?false:'public',build:{outDir:native?'dist-native':'dist',target:native?'safari17.4':undefined},define:{__CONTINUUM_API_ORIGIN__:JSON.stringify(origin),__CONTINUUM_REMOTE_ROOTS__:JSON.stringify(roots)},plugins:native?[{
  name:'continuum-bundled-native-shell',enforce:'pre',
  transformIndexHtml:{order:'pre',handler(html){return html.replace('src="/main.jsx"','src="/native-entry.mjs"').replace('initial-scale=1.0','initial-scale=1.0, viewport-fit=cover');}},
  transform(code,id){if(!/\.(?:jsx?|mjs|json|css)(?:\?|$)/.test(id)||id.includes('/node_modules/')||/native-(?:policy|transport|runtime|platform)\.mjs/.test(id))return;
   return rewriteNativeMediaLists(code.replace(rootPattern,s=>s[0]+origin+s.slice(1)),{origin,roots}).replace(/(["'`])\/api\/lesson-video\//g,(_,q)=>q+origin+'/api/lesson-video/').replace(/url\((['"]?)\/(?!\/)([^)]+)\)/g,(match,q,p)=>roots.some(root=>p.startsWith(root+'/'))?'url('+q+origin+'/'+p+')':match);
  }
 }]:[]};
});
