// A learning language and a decorative art family are separate identities.
// Existing original landscapes are shared; never relabel their real locations.
export const learningArtFamilies={en:'en',es:'es',pt:'pt',ja:'ja',zh:'ja',ko:'ja',fr:'en',de:'en',ar:'es',it:'pt'};
export const learningArtFamily=language=>learningArtFamilies[language]||'en';
export const learningPhotoScenes={en:'en-london',es:'es-barcelona',pt:'pt-lisbon',ja:'ja-neighbourhood',zh:'ja-neighbourhood',ko:'ja-neighbourhood',fr:'en-london',de:'en-london',ar:'es-barcelona',it:'pt-lisbon'};

export const learningSceneryFamily=language=>['zh','ko','fr','de','ar','it'].includes(language)?language:learningArtFamily(language);
