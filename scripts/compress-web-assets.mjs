import {createReadStream,createWriteStream} from 'node:fs';
import {readdir} from 'node:fs/promises';
import {pipeline} from 'node:stream/promises';
import {createGzip} from 'node:zlib';

const directory=new URL('../dist/assets/',import.meta.url);
for(const entry of await readdir(directory,{withFileTypes:true})){
 if(!entry.isFile()||!/\.(js|css)$/.test(entry.name))continue;
 const source=new URL(entry.name,directory);
 const target=new URL(entry.name+'.gz',directory);
 await pipeline(createReadStream(source),createGzip({level:9}),createWriteStream(target));
}
