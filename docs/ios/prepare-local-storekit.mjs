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
 // Only the disposable project bundles the test session and its product fixture.
 await cp(new URL('./LocalStoreKitUITests.swift',import.meta.url),join(output,'ios/App/NativeUITests/LocalStoreKitUITests.swift'));
 const pbx=join(output,'ios/App/App.xcodeproj/project.pbxproj');let project=await readFile(pbx,'utf8');
 project=project.replace('/* End PBXBuildFile section */',`C01171000000000000000301 = {isa = PBXBuildFile; fileRef = C01171000000000000000302; };
 C01171000000000000000303 = {isa = PBXBuildFile; fileRef = C01171000000000000000304; };
 C01171000000000000000305 = {isa = PBXBuildFile; fileRef = C01171000000000000000304; };
 /* End PBXBuildFile section */`);
 project=project.replace('/* End PBXFileReference section */',`C01171000000000000000302 = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = NativeUITests/LocalStoreKitUITests.swift; sourceTree = SOURCE_ROOT; };
 C01171000000000000000304 = {isa = PBXFileReference; lastKnownFileType = text; path = App/ContinuumLocalTesting.storekit; sourceTree = SOURCE_ROOT; };
 /* End PBXFileReference section */`);
 project=project.replace('files = (C01171000000000000000201,);','files = (C01171000000000000000201,C01171000000000000000301,);');
 project=project.replace('C01171000000000000000207 = {isa = PBXResourcesBuildPhase; buildActionMask = 2147483647; files = ();','C01171000000000000000207 = {isa = PBXResourcesBuildPhase; buildActionMask = 2147483647; files = (C01171000000000000000303,);');
 project=project.replace('504EC3121FED79650016851F /* LaunchScreen.storyboard in Resources */,','C01171000000000000000305,\n                504EC3121FED79650016851F /* LaunchScreen.storyboard in Resources */,');
 await writeFile(pbx,project);
 const schemes=join(output,'ios/App/App.xcodeproj/xcshareddata/xcschemes');let scheme=await readFile(join(schemes,'App.xcscheme'),'utf8');
 scheme=scheme.replace(/buildForArchiving="YES"/g,'buildForArchiving="NO"').replace(/<ArchiveAction\b[^>]*\/>/g,'').replace('</LaunchAction>','<StoreKitConfigurationFileReference identifier="../../App/ContinuumLocalTesting.storekit"/></LaunchAction>');
 await writeFile(join(schemes,'App-Local-StoreKit.xcscheme'),scheme);
 return {project:join(output,'ios/App/App.xcodeproj'),scheme:'App-Local-StoreKit',directory:output};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{console.log(JSON.stringify(await prepareLocalStoreKit(),null,2))}catch(error){console.error('Run npm run ios:sync first. '+error.message);process.exitCode=1}
}
