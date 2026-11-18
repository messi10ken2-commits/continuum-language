// Creates a disposable project copy; never changes shipping flags or enables live billing.
import {cp,mkdtemp,readFile,writeFile,symlink,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join,resolve} from 'node:path';import {fileURLToPath,pathToFileURL} from 'node:url';
export async function prepareLocalStoreKit(root=fileURLToPath(new URL('../../',import.meta.url))){
 await access(join(root,'ios/App/App/public/index.html'));
 const output=await mkdtemp(join(tmpdir(),'continuum-local-storekit-'));
 await cp(join(root,'ios'),join(output,'ios'),{recursive:true,filter:path=>!/(^|\/)(build|DerivedData|xcuserdata)(\/|$)/.test(path)});
 await symlink(resolve(root,'node_modules'),join(output,'node_modules'),'dir');
 const info=join(output,'ios/App/App/Info.plist');let plist=await readFile(info,'utf8');
 const flag=/<key>ContinuumLocalStoreKitTesting<\/key>\s*<false\s*\/>/;
 if(!flag.test(plist))throw Error('Shipping StoreKit flag must be false before creating a local test copy');
 plist=plist.replace(flag,'<key>ContinuumLocalStoreKitTesting</key><true/>');await writeFile(info,plist);
 await cp(new URL('./ContinuumLocalTesting.storekit',import.meta.url),join(output,'ios/App/App/ContinuumLocalTesting.storekit'));
 const schemes=join(output,'ios/App/App.xcodeproj/xcshareddata/xcschemes');let scheme=await readFile(join(schemes,'App.xcscheme'),'utf8');
 scheme=scheme.replace(/buildForArchiving="YES"/g,'buildForArchiving="NO"').replace(/<ArchiveAction\b[^>]*\/>/g,'').replace('</LaunchAction>','<StoreKitConfigurationFileReference identifier="../../App/ContinuumLocalTesting.storekit"/></LaunchAction>');
 await writeFile(join(schemes,'App-Local-StoreKit.xcscheme'),scheme);
 return {project:join(output,'ios/App/App.xcodeproj'),scheme:'App-Local-StoreKit',directory:output};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{console.log(JSON.stringify(await prepareLocalStoreKit(),null,2))}catch(error){console.error('Run npm run ios:sync first. '+error.message);process.exitCode=1}
}
