// Client-safe comparison references. Null locale means no invented dialect voice.
const p=(label,a,locale,b)=>({label,variants:[{text:a,locale},{text:b,locale:null}]});
export const expandedRegionalPairs={
 zh:[p('Mainland Mandarin / Taiwan Mandarin: taxi','我要叫一辆出租车。','zh-CN','我要叫一輛計程車。'),p('Mainland Mandarin / Taiwan Mandarin: potato','我想买一些土豆。','zh-CN','我想買一些馬鈴薯。')],
 ko:[p('Standard Korean / Gyeongsang: casual question','지금 뭐 해?','ko-KR','지금 뭐 하노?'),p('Standard Korean / Gyeongsang: emphasis','정말 맛있어.','ko-KR','억수로 맛있다.')],
 fr:[p('France / Quebec: weekend vocabulary','On se retrouve ce week-end.','fr-FR','On se retrouve en fin de semaine.'),p('France / Quebec: shopping vocabulary','Je vais faire les magasins.','fr-FR','Je vais magasiner.')],
 de:[p('Germany / Austria: bread roll','Ich hätte gern ein Brötchen.','de-DE','Ich hätte gern eine Semmel.'),p('Standard German / Swiss German: greeting','Guten Tag.','de-DE','Grüezi.')],
 ar:[p('Modern Standard Arabic / Egyptian: addressing one man','كيف حالك؟','ar-SA','إزيك؟'),p('Modern Standard Arabic / Levantine: addressing one man','ماذا تريد؟','ar-SA','شو بدك؟')],
 it:[p('Neutral Italian / informal emphasis found across regions','Non fa freddo.','it-IT','Non fa mica freddo.'),p('Everyday northern preference / passato remoto used more in parts of the South','Ieri sono andato al mercato.','it-IT','Ieri andai al mercato.')]
};
