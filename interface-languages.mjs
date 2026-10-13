// Interface languages are independent of the four learning languages.
export const interfaceLanguages=[
 {id:'en',name:'English'},{id:'ja',name:'日本語'},{id:'es',name:'Español'},
 {id:'pt',name:'Português'},{id:'zh',name:'中文（简体）'},{id:'fr',name:'Français'}
];
export const validInterfaceLanguage=id=>interfaceLanguages.some(l=>l.id===id);
export function detectedInterfaceLanguage(values=[]){for(const value of values){const id=String(value).toLowerCase().split(/[-_]/)[0];if(validInterfaceLanguage(id))return id;}return 'en';}
