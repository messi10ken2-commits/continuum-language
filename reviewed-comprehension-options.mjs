// Reviewed visual-story comprehension choices; the spoken models are separate.
const rows=`
Coffee with milk|ミルク入りのコーヒー|Café con leche|Café com leite|加奶咖啡|Un café au lait
Tea without milk|ミルクなしの紅茶|Té sin leche|Chá sem leite|不加奶的茶|Un thé sans lait
A glass of water|コップ1杯の水|Un vaso de agua|Um copo de água|一杯水|Un verre d’eau
At a reserved table|予約済みの席で|En una mesa reservada|Em uma mesa reservada|在预订的座位上|À une table réservée
The customer does not specify|客は指定していない|El cliente no lo especifica|O cliente não especifica|顾客没有说明|Le client ne le précise pas
Away from the café|店外で|Fuera del café|Fora da cafeteria|在店外|À l’extérieur du café
The menu|メニュー|El menú|O cardápio|菜单|Le menu
The bill|会計|La cuenta|A conta|账单|L’addition
Another drink|追加の飲み物|Otra bebida|Outra bebida|再来一杯饮料|Une autre boisson
Platform two|2番ホーム|El andén dos|A plataforma dois|二号站台|Le quai deux
No platform is announced|ホームは案内されていない|No se anuncia ningún andén|Nenhuma plataforma é anunciada|没有公布站台|Aucun quai n’est annoncé
Platform four|4番ホーム|El andén cuatro|A plataforma quatro|四号站台|Le quai quatre
Whether the station is closed|駅が閉まっているかどうか|Si la estación está cerrada|Se a estação está fechada|车站是否关闭|Si la gare est fermée
Whether the ticket is valid|その切符が使えるかどうか|Si el billete es válido|Se a passagem é válida|车票是否有效|Si le billet est valable
Whether the train has arrived|列車が到着したかどうか|Si el tren ha llegado|Se o trem chegou|火车是否已经到站|Si le train est arrivé
Unfinished|まだ完成していない|Sin terminar|Ainda não foi concluído|尚未完成|Pas encore terminé
Already submitted|すでに提出済み|Ya entregado|Já foi entregue|已经提交|Déjà remis
Cancelled|取りやめになった|Cancelado|Cancelado|已取消|Annulé
Thursday|木曜日|El jueves|Quinta-feira|星期四|Jeudi
Tomorrow morning|明日の朝|Mañana por la mañana|Amanhã de manhã|明天早上|Demain matin
Friday|金曜日|El viernes|Sexta-feira|星期五|Vendredi
A completed presentation|完成したプレゼン資料|Una presentación terminada|Uma apresentação concluída|已完成的演示文稿|Une présentation terminée
A draft|下書き|Un borrador|Um rascunho|草稿|Un brouillon
A signed contract|署名済みの契約書|Un contrato firmado|Um contrato assinado|已签署的合同|Un contrat signé
Possible, not guaranteed|可能性はあるが、確実ではない|Es posible, pero no está garantizado|É possível, mas não é garantido|有可能，但不能保证|C’est possible, mais pas garanti
Guaranteed|確実だとされている|Está garantizado|É garantido|有保证|C’est garanti
Already measured|すでに測定されている|Ya se ha medido|Já foi medido|已经测量过|Cela a déjà été mesuré
School exam results|学校の試験結果|Los resultados de los exámenes escolares|Os resultados das provas escolares|学校的考试成绩|Les résultats aux examens scolaires
Train ticket prices|列車の運賃|Los precios de los billetes de tren|Os preços das passagens de trem|火车票价格|Le prix des billets de train
Daily deliveries to shops|店舗への毎日の配送|Las entregas diarias a las tiendas|As entregas diárias às lojas|每天向商店配送货物|Les livraisons quotidiennes aux commerces
No further action|これ以上の対応はしない|No tomar más medidas|Nenhuma outra medida|不再采取行动|Ne prendre aucune autre mesure
A three-month trial|3か月間の試行|Una prueba de tres meses|Um teste de três meses|为期三个月的试行|Un essai de trois mois
Immediate permanent closure|直ちに恒久閉鎖する|El cierre definitivo e inmediato|O fechamento definitivo e imediato|立即永久关闭|Une fermeture définitive immédiate
An association|関連性があること|Una asociación|Uma associação|存在关联|Une association
Proof of causation|因果関係の証明|Una prueba de causalidad|Uma prova de causalidade|因果关系的证据|Une preuve de causalité
No relationship of any kind|何の関連性もないこと|Ningún tipo de relación|Nenhuma relação de qualquer tipo|不存在任何关系|Aucune relation d’aucune sorte
Rejects all research|すべての研究を否定している|Rechaza toda la investigación|Rejeita toda a pesquisa|否定所有研究|Rejette toutes les recherches
Guarantees the conclusion|結論が確実だと断言している|Garantiza la conclusión|Garante a conclusão|保证结论成立|Garantit la conclusion
Limits the causal claim|因果関係についての主張に留保を付けている|Matiza la afirmación causal|Limita a afirmação de causalidade|限定了关于因果关系的主张|Nuance l’affirmation d’un lien de causalité
Publish an absolute claim|断定的な主張を公表する|Publicar una afirmación categórica|Publicar uma afirmação categórica|发表绝对化的论断|Publier une affirmation catégorique
Compare with other sources|ほかの情報源と比較する|Comparar con otras fuentes|Comparar com outras fontes|与其他来源进行比较|Comparer avec d’autres sources
Ignore the findings|調査結果を無視する|Ignorar los resultados|Ignorar os resultados|忽略研究结果|Ignorer les résultats
`;
export const reviewedComprehensionOptions={ja:{},es:{},pt:{},zh:{},fr:{}};
for(const row of rows.trim().split('\n')){const [source,...values]=row.split('|');if(values.length!==5)throw Error('Incomplete comprehension translation');Object.keys(reviewedComprehensionOptions).forEach((locale,i)=>{reviewedComprehensionOptions[locale][source]=values[i]});}
