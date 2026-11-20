import React from 'react';
const countries={en:'gb',es:'es',pt:'br',ja:'jp',zh:'cn',ko:'kr',fr:'fr',de:'de',ar:'sa',it:'it'};
// Decorative: the adjacent localized language name supplies the accessible label.
export default function CountryFlag({language}){
 const country=countries[language];
 return country?<span className="account-language-flag" aria-hidden="true"><img src={'/flags/'+country+'.svg'} alt="" width="48" height="48"/></span>:null;
}
