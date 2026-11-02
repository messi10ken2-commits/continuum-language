// A learning language and a decorative art family are separate identities.
// Existing original landscapes are shared; never relabel their real locations.
export const learningArtFamilies={en:'en',es:'es',pt:'pt',ja:'ja',zh:'ja',ko:'ja',fr:'en',de:'en',ar:'es',it:'pt'};
export const learningArtFamily=language=>learningArtFamilies[language]||'en';
export const learningPhotoScenes={en:'en-london',es:'es-barcelona',pt:'pt-brazil',ja:'ja-neighbourhood',zh:'zh-shanghai',ko:'ko-seoul',fr:'fr-paris',de:'de-berlin',ar:'ar-marrakech',it:'it-rome'};

export const learningSceneryFamily=language=>['zh','ko','fr','de','ar','it'].includes(language)?language:learningArtFamily(language);
