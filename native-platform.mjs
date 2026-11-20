export const isNative=()=>globalThis.Capacitor?.isNativePlatform?.()===true;
export const isAppHidden=()=>!!globalThis.document?.hidden||!!globalThis.document?.documentElement?.classList?.contains('native-inactive');
