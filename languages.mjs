export const languages=[{id:'es',name:'Spanish',native:'Español',locale:'es-ES'},{id:'ja',name:'Japanese',native:'日本語',locale:'ja-JP'},{id:'pt',name:'Portuguese (Brazil)',native:'Português',locale:'pt-BR'},{id:'en',name:'English',native:'English',locale:'en-US'}];
export const languageInfo=id=>languages.find(l=>l.id===id)||languages[0];
export const languageOf=id=>/^(ja|pt|en)-/.exec(id||'')?.[1]||'es';
export const courseBands=['A1','A2','B1','B2','C1'];
