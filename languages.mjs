// Learning languages are independent of the language used for menus/explanations.
export const languages=[
 {id:'es',name:'Spanish',native:'Español',locale:'es-ES',direction:'ltr',script:'Latin'},
 {id:'ja',scriptEntry:'ja-script-v1-hiragana-0',name:'Japanese',native:'日本語',locale:'ja-JP',direction:'ltr',script:'Japanese'},
 {id:'pt',name:'Portuguese (Brazil)',native:'Português',locale:'pt-BR',direction:'ltr',script:'Latin'},
 {id:'en',name:'English',native:'English',locale:'en-US',direction:'ltr',script:'Latin'},
 {id:'zh',scriptEntry:'zh-script-v1-pinyin-0',name:'Chinese (Mandarin)',native:'简体中文',locale:'zh-CN',direction:'ltr',script:'Han',variety:'Simplified Chinese; standard Mandarin'},
 {id:'ko',scriptEntry:'ko-script-v1-letters-0',name:'Korean',native:'한국어',locale:'ko-KR',direction:'ltr',script:'Hangul',variety:'Standard South Korean usage'},
 {id:'fr',name:'French',native:'Français',locale:'fr-FR',direction:'ltr',script:'Latin',variety:'French as used in France'},
 {id:'de',scriptEntry:'de-script-v1-special-letters-0',name:'German',native:'Deutsch',locale:'de-DE',direction:'ltr',script:'Latin',variety:'Standard German'},
 {id:'ar',scriptEntry:'ar-script-v1-alphabet-0',name:'Arabic (Modern Standard)',native:'العربية الفصحى',locale:'ar-SA',direction:'rtl',script:'Arabic',variety:'Modern Standard Arabic; regional dialects distinguished explicitly'},
 {id:'it',name:'Italian',native:'Italiano',locale:'it-IT',direction:'ltr',script:'Latin',variety:'Standard Italian'}
];
export const learningLanguageIds=languages.map(l=>l.id);
export const isLearningLanguage=id=>learningLanguageIds.includes(id);
export const languageInfo=id=>languages.find(l=>l.id===id)||languages[0];
export const languageOf=id=>languages.find(l=>String(id||'').startsWith(l.id+'-'))?.id||'es';
export const courseBands=['A1','A2','B1','B2','C1'];
