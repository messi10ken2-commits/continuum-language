// October 2026 security baseline. Keep deployment and CI on the same patched LTS.
export const minimumNodeVersion='24.22.1';
export function assertSecureRuntime(version=process.versions.node){
 const parts=/^(\d+)\.(\d+)\.(\d+)$/.exec(version)?.slice(1).map(Number);
 if(!parts||parts[0]!==24||parts[1]<22||(parts[1]===22&&parts[2]<1)){
  throw Error(`Unsupported Node.js ${version}. Use patched Node.js ${minimumNodeVersion} or a newer 24.x release.`);
 }
 return version;
}
