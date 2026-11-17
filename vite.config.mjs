import {defineConfig} from 'vite';
import {readdirSync} from 'node:fs';
import {validatedAPIOrigin} from './native-policy.mjs';
export default defineConfig(({mode})=>{
 const native=mode==='native',origin=validatedAPIOrigin(process.env.CONTINUUM_API_ORIGIN);
 const roots=readdirSync(new URL('./public/',import.meta.url)).filter(s=>!s.includes('.')&&!['fonts','flags'].includes(s));
 const rootPattern=new RegExp('(["\'`])/(?:'+roots.join('|')+')(?=/)','g');
 return {publicDir:native?false:'public',build:{outDir:native?'dist-native':'dist'},define:{__CONTINUUM_API_ORIGIN__:JSON.stringify(origin),__CONTINUUM_REMOTE_ROOTS__:JSON.stringify(roots)},plugins:native?[{
  name:'continuum-bundled-native-shell',enforce:'pre',
  transformIndexHtml:{order:'pre',handler(html){return html.replace('src="/main.jsx"','src="/native-entry.mjs"').replace('initial-scale=1.0','initial-scale=1.0, viewport-fit=cover');}},
  transform(code,id){if(!/\.(?:jsx?|mjs|json|css)(?:\?|$)/.test(id)||id.includes('/node_modules/'))return;
   return code.replace(rootPattern,s=>s[0]+origin+s.slice(1)).replace(/(["'`])\/api(?=\/|["'`])/g,(_,q)=>q+origin+'/api').replace(/url\((['"]?)\/(?!\/)([^)]+)\)/g,(match,q,p)=>roots.some(root=>p.startsWith(root+'/'))?'url('+q+origin+'/'+p+')':match);
  }
 }]:[]};
});
