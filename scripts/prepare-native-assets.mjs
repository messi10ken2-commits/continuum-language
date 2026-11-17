import {cp,mkdir,readFile,readdir,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
for(const directory of ['fonts','flags']){await mkdir(new URL('dist-native/'+directory,root),{recursive:true});await cp(new URL('public/'+directory,root),new URL('dist-native/'+directory,root),{recursive:true});}
async function files(path){const entries=await readdir(path,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?files(new URL(e.name+'/',path)):new URL(e.name,path)))).flat();}
let bytes=0;const assets=await files(new URL('dist-native/',root)),scripts=[];
for(const path of assets){bytes+=(await stat(path)).size;if(/\.(js|html|css)$/.test(path.pathname)){const text=await readFile(path,'utf8');if(path.pathname.endsWith('.js'))scripts.push(text);assert.ok(!/(?:sk_live_|sk-proj-)[A-Za-z0-9_-]{16,}|BEGIN (?:RSA )?PRIVATE KEY/.test(text),'Secret-shaped material in native bundle: '+path.pathname);}}
// Media rewriting must never rewrite the transport's pathname comparisons.
assert.ok(scripts.some(s=>/\.pathname\.startsWith\(([`"'])\/api\/\1\)/.test(s)),'Compiled native transport lost its relative API path check');
assert.ok(!scripts.some(s=>/\.pathname\.startsWith\(([`"'])https:/.test(s)),'Media transform corrupted API routing');
const config=JSON.parse(await readFile(new URL('capacitor.config.json',root)));assert.ok(!config.server?.url,'Native shell must use bundled frontend assets');
console.log(JSON.stringify({bundledFiles:assets.length,bundledBytes:bytes,remoteMedia:'HTTPS on demand; no remote executable code',bundleId:config.appId}));
