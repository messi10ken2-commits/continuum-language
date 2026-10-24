import {useSyncExternalStore} from 'react';
import {readMediaPreference,saveMediaPreference} from './media-privacy.mjs';
const event='continuum-media-privacy';
function subscribe(fn){window.addEventListener(event,fn);window.addEventListener('storage',fn);return()=>{window.removeEventListener(event,fn);window.removeEventListener('storage',fn)}}
export const useExternalMedia=()=>useSyncExternalStore(subscribe,()=>readMediaPreference(),()=>false);
export function allowExternalMedia(allowed){saveMediaPreference(allowed);window.dispatchEvent(new Event(event))}
