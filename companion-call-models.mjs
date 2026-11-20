// Explicit bundled assets: never construct an arbitrary URL from account data.
export const CALL_MODELS=Object.freeze({
 capybara:'/companions-3d/capybara-pop-v3.glb',
 bird:'/companions-3d/bird-pop-v1.glb',
 fox:'/companions-3d/fox-pop-v1.glb',
 cat:'/companions-3d/cat-pop-v1.glb',
 dog:'/companions-3d/dog-pop-v1.glb',
 'guinea-pig':'/companions-3d/guinea-pig-pop-v1.glb',
 quokka:'/companions-3d/quokka-pop-v1.glb',
 panda:'/companions-3d/panda-pop-v1.glb'
});
export const callCompanionKind=kind=>Object.hasOwn(CALL_MODELS,kind)?kind:'bird';
