import {createReadStream,createWriteStream} from 'node:fs';
import {readdir} from 'node:fs/promises';
import {pipeline} from 'node:stream/promises';
import {createGzip,createBrotliCompress,constants} from 'node:zlib';
const directories=[new URL('../dist/assets/',import.meta.url),new URL('../dist/world-tokyo/people/',import.meta.url)];
for(const directory of directories)for(const entry of await readdir(directory,{withFileTypes:true})){
 if(!entry.isFile()||!/\.(js|css|glb)$/.test(entry.name))continue;
 const source=new URL(entry.name,directory);
 await pipeline(createReadStream(source),createGzip({level:9}),createWriteStream(new URL(entry.name+'.gz',directory)));
 await pipeline(createReadStream(source),createBrotliCompress({params:{[constants.BROTLI_PARAM_QUALITY]:9}}),createWriteStream(new URL(entry.name+'.br',directory)));
}
