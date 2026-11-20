export const mediaPreferenceKey='continuumPrivacyV1';
export function readMediaPreference(storage){try{storage??=globalThis.localStorage;return JSON.parse(storage?.getItem(mediaPreferenceKey)||'null')?.externalMedia===true}catch{return false}}
export function saveMediaPreference(allowed,storage=globalThis.localStorage){if(typeof allowed!=='boolean')throw Error('Choose a valid media preference');if(!storage)throw Error('Browser storage is unavailable.');storage.setItem(mediaPreferenceKey,JSON.stringify({version:1,externalMedia:allowed,updatedAt:new Date().toISOString()}));}
