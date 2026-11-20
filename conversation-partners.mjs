// Original AI-generated personas, not profiles of real teachers. Keep selection
// stable when reopening a session and independent of the display language.
export const conversationPartners={
 mira:{id:'mira',name:'Mira',image:'/conversation-partners/mira-v1.webp',voice:'mira'},
 hana:{id:'hana',name:'Hana',image:'/conversation-partners/hana-v1.webp',voice:'hana'},
 rafael:{id:'rafael',name:'Rafael',image:'/conversation-partners/rafael-v1.webp',voice:'rafael'},
 lucia:{id:'lucia',name:'Lucía',image:'/conversation-partners/lucia-v1.webp',voice:'lucia'},
 theo:{id:'theo',name:'Theo',image:'/conversation-partners/theo-v1.webp',voice:'theo'}
};
const cast={
 en:{living:'hana',free:'mira',cafe:'theo',directions:'hana',shopping:'lucia',plans:'rafael',appointment:'mira',work:'theo'},
 pt:{living:'rafael',free:'rafael',cafe:'lucia',directions:'mira',shopping:'hana',plans:'theo',appointment:'rafael',work:'mira'},
 es:{living:'lucia',free:'lucia',cafe:'rafael',directions:'theo',shopping:'mira',plans:'hana',appointment:'lucia',work:'theo'},
 ja:{living:'hana',free:'hana',cafe:'mira',directions:'rafael',shopping:'theo',plans:'lucia',appointment:'hana',work:'mira'}
};
for(const language of ['zh','ko','fr','de','ar','it'])cast[language]={living:'mira',free:'hana',cafe:'theo',directions:'mira',shopping:'lucia',plans:'rafael',appointment:'hana',work:'theo'};
export const conversationPartner=(language,scenario)=>conversationPartners[cast[language]?.[scenario]||'mira'];
