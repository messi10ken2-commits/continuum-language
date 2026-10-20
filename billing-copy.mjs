const rows=`
Membership|会員プラン|Membresía|Assinatura|会员方案|Abonnement
Free|無料|Gratis|Grátis|免费|Gratuit
Premium|Premium|Premium|Premium|Premium|Premium
Your plan|利用中のプラン|Tu plan|Seu plano|你的方案|Votre formule
Ad-free learning|広告なしで学習|Aprender sin anuncios|Aprendizado sem anúncios|无广告学习|Apprentissage sans publicité
All learning features|すべての学習機能|Todas las funciones de aprendizaje|Todos os recursos de aprendizado|全部学习功能|Toutes les fonctions d’apprentissage
Exclusive courses|Premium限定コース|Cursos exclusivos|Cursos exclusivos|专属课程|Cours exclusifs
Three introductory class tickets|初回オンライン授業3回分のチケット|Tres bonos iniciales para clases|Três créditos iniciais para aulas|三张首次在线课程券|Trois crédits de cours de bienvenue
Tickets are granted once after your first successful paid subscription. Renewals and rejoining do not add tickets.|チケットは初回の有料契約の支払い完了後に一度だけ付与されます。更新や再加入では増えません。|Los bonos se conceden una sola vez tras el primer pago. No se añaden al renovar ni al volver a suscribirte.|Os créditos são concedidos uma única vez após o primeiro pagamento. Renovações e novas assinaturas não geram mais créditos.|首次订阅付款成功后仅发放一次。续费或重新订阅不会重复发券。|Les crédits sont accordés une seule fois après le premier paiement. Les renouvellements et réabonnements n’en ajoutent pas.
Use tickets for eligible classes with participating teachers. Duration limits apply.|対象教師の特典授業に利用できます。授業時間の上限があります。|Úsalos en clases elegibles con docentes participantes. Se aplican límites de duración.|Use em aulas elegíveis com professores participantes. Há limite de duração.|可用于参与计划教师的指定课程，并有课时长度限制。|Utilisables pour les cours éligibles des enseignants participants, avec une durée maximale.
Review price on Stripe|Stripeで料金を確認|Ver precio en Stripe|Ver preço no Stripe|在Stripe查看价格|Voir le prix sur Stripe
Manage subscription|契約・支払いを管理|Gestionar suscripción|Gerenciar assinatura|管理订阅|Gérer l’abonnement
Refresh membership|会員状態を更新|Actualizar membresía|Atualizar assinatura|刷新会员状态|Actualiser l’abonnement
Checkout is not open yet.|購入手続きはまだ開始していません。|El pago aún no está disponible.|O pagamento ainda não está disponível.|付款尚未开放。|Le paiement n’est pas encore ouvert.
Monthly|月額|Mensual|Mensal|按月|Mensuel
Yearly|年額|Anual|Anual|按年|Annuel
Current free lessons, progress, teacher discovery and messaging remain available.|現在の無料レッスン・学習記録・教師検索・メッセージは引き続き利用できます。|Las lecciones gratuitas, el progreso, la búsqueda de docentes y los mensajes siguen disponibles.|As aulas gratuitas, o progresso, a busca de professores e as mensagens continuam disponíveis.|现有免费课程、学习记录、教师搜索和消息功能仍可使用。|Les leçons gratuites, le suivi, la recherche d’enseignants et les messages restent disponibles.
Class tickets|授業チケット|Bonos de clase|Créditos de aula|课程券|Crédits de cours
Available|利用可能|Disponibles|Disponíveis|可用|Disponibles
Reserved|予約に使用中|Reservados|Reservados|已预留|Réservés
Used|利用済み|Utilizados|Usados|已使用|Utilisés
Revoked|無効|Anulados|Revogados|已撤销|Révoqués
Use a Premium class ticket|Premiumの授業チケットを使う|Usar un bono Premium|Usar um crédito Premium|使用Premium课程券|Utiliser un crédit Premium
Participating teacher|特典授業の対象教師|Docente participante|Professor participante|参与计划的教师|Enseignant participant
No participating class is selected.|対象授業が選択されていません。|No hay una clase elegible seleccionada.|Nenhuma aula elegível foi selecionada.|尚未选择符合条件的课程。|Aucun cours éligible sélectionné.
Premium is required for this course.|このコースにはPremiumが必要です。|Este curso requiere Premium.|Este curso exige Premium.|此课程需要Premium会员。|Ce cours nécessite Premium.
Open course|コースを開く|Abrir curso|Abrir curso|打开课程|Ouvrir le cours
Back to membership|会員プランに戻る|Volver a membresía|Voltar à assinatura|返回会员页面|Retour à l’abonnement
Check answer|答え合わせ|Comprobar respuesta|Verificar resposta|检查答案|Vérifier la réponse
Continue|次へ|Continuar|Continuar|继续|Continuer
Finish course|コースを終了|Finalizar curso|Concluir curso|完成课程|Terminer le cours
Course complete|コース完了|Curso completado|Curso concluído|课程已完成|Cours terminé
Advertisement|広告|Publicidad|Anúncio|广告|Publicité
Billing operations|会員・決済管理|Gestión de pagos|Gestão de pagamentos|会员与付款管理|Gestion des paiements
Stripe configuration|Stripe接続設定|Configuración de Stripe|Configuração do Stripe|Stripe配置|Configuration Stripe
Payment events|決済イベント|Eventos de pago|Eventos de pagamento|付款事件|Événements de paiement
Ticket programme teachers|授業チケットの対象教師|Docentes del programa de bonos|Professores do programa de créditos|课程券计划教师|Enseignants du programme de crédits
Enable|有効にする|Activar|Ativar|启用|Activer
Disable|無効にする|Desactivar|Desativar|停用|Désactiver
No payment events yet.|決済イベントはまだありません。|Aún no hay eventos de pago.|Ainda não há eventos de pagamento.|暂无付款事件。|Aucun événement de paiement.
Choose a tactful disagreement.|配慮のある反対意見を選んでください。|Elige una forma respetuosa de discrepar.|Escolha uma discordância respeitosa.|选择委婉的不同意见。|Choisissez une manière diplomate de contredire.
Choose the clearest request.|最も明確な依頼を選んでください。|Elige la petición más clara.|Escolha o pedido mais claro.|选择最清楚的请求。|Choisissez la demande la plus claire.
Choose a realistic boundary.|無理のない条件を伝える表現を選んでください。|Elige un límite realista.|Escolha um limite realista.|选择合理表达界限的说法。|Choisissez une limite réaliste.
Choose the intended meaning.|文脈に合う意味を選んでください。|Elige el significado adecuado al contexto.|Escolha o significado adequado ao contexto.|选择符合语境的意思。|Choisissez le sens adapté au contexte.
Choose an appropriate follow-up.|適切な追加質問を選んでください。|Elige una pregunta de seguimiento adecuada.|Escolha uma pergunta de acompanhamento adequada.|选择合适的追问。|Choisissez une question de suivi appropriée.
Choose a useful response.|状況に合う返答を選んでください。|Elige una respuesta útil.|Escolha uma resposta útil.|选择合适的回答。|Choisissez une réponse adaptée.
Choose the most useful reply.|状況に最も合う返答を選んでください。|Elige la respuesta más adecuada.|Escolha a resposta mais adequada.|选择最适合情境的回答。|Choisissez la réponse la plus adaptée.
Workplace diplomacy|職場での配慮ある伝え方|Diplomacia en el trabajo|Diplomacia no trabalho|职场沟通技巧|Diplomatie au travail
Everyday negotiation in Portuguese|ポルトガル語での日常の相談と調整|Negociaciones cotidianas en portugués|Negociação no dia a dia em português|葡萄牙语日常协商|Négocier au quotidien en portugais
Natural social plans in Spanish|スペイン語で自然に予定を相談|Planes cotidianos en español|Planos naturais em espanhol|西班牙语日常约定|Organiser des sorties en espagnol
Considerate requests in Japanese|日本語で配慮のある依頼|Peticiones consideradas en japonés|Pedidos atenciosos em japonês|日语礼貌请求|Formuler des demandes en japonais
`;
export const billingCopy=Object.fromEntries(rows.trim().split('\n').map(line=>{const [k,...v]=line.split('|');if(v.length!==5)throw Error('Billing translation missing');return [k,Object.fromEntries(['ja','es','pt','zh','fr'].map((l,i)=>[l,v[i]]))]}));
