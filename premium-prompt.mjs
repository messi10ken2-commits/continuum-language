export function requestPremium(feature='Premium'){window.dispatchEvent(new CustomEvent('continuum-premium-request',{detail:{feature}}));}
