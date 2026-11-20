// Exercise provider/cache behavior with approved learning copy that still needs live translation.
// Common UI is now bundled offline, so it must not be used to force provider requests.
import sources from './premium-display-sources.json' with {type:'json'};
import {reviewedTranslation} from './reviewed-interface-copy.mjs';
import {interfaceCopy} from './interface-copy.mjs';
import {translationSource} from './localization-corpus.mjs';
export const dynamicTranslationSources=sources.filter(text=>{const source=translationSource(text);return source&&!source.protectedValues.length&&!reviewedTranslation(text,'ja')&&!interfaceCopy[text]?.ja;}).slice(0,2);
if(dynamicTranslationSources.length!==2)throw Error('Translation tests need two approved sources without offline Japanese copy.');
