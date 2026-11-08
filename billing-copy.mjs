const rows=`
Membership|会員プラン|Membresía|Assinatura|会员方案|Abonnement
Free|無料|Gratis|Grátis|免费|Gratuit
Premium|Premium|Premium|Premium|Premium|Premium
Your plan|利用中のプラン|Tu plan|Seu plano|你的方案|Votre formule
Ad-free learning|広告なしで学習|Aprender sin anuncios|Aprendizado sem anúncios|无广告学习|Apprentissage sans publicité
All learning features|すべての学習機能|Todas las funciones de aprendizaje|Todos os recursos de aprendizado|全部学习功能|Toutes les fonctions d’apprentissage
Exclusive courses|Premium限定コース|Cursos exclusivos|Cursos exclusivos|专属课程|Cours exclusifs
One introductory class ticket|初回オンライン授業1回分のチケット|Un bono inicial para una clase|Um crédito inicial para uma aula|一张首次在线课程券|Un crédit de cours de bienvenue
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
Billed annually at {0}. Equivalent to {1} per month.|年額 {0} を一括請求。月換算 {1}。|Se cobran {0} al año. Equivale a {1} al mes.|Cobrança anual de {0}. Equivale a {1} por mês.|每年一次性收取 {0}，相当于每月 {1}。|Facturé {0} par an, soit {1} par mois.|연 {0} 일괄 결제. 월 환산 {1}.|Ditagih {0} per tahun, setara {1} per bulan.|{0} списывается раз в год. Эквивалент {1} в месяц.|يُحصّل {0} دفعةً واحدة سنويًا، بما يعادل {1} شهريًا.
Save about {0}% ({1} per year).|約{0}%お得（年間 {1} の節約）。|Ahorra cerca del {0}% ({1} al año).|Economize cerca de {0}% ({1} por ano).|约省 {0}%（每年省 {1}）。|Économisez environ {0}% ({1} par an).|약 {0}% 할인(연 {1} 절약).|Hemat sekitar {0}% ({1} per tahun).|Экономия около {0}% ({1} в год).|وفّر نحو {0}٪ ({1} سنويًا).
Automatically renews. Cancel in Account → Membership. Stripe shows any applicable tax before confirmation.|自動更新されます。アカウントの会員プランから解約できます。適用される税額は確定前にStripeで確認できます。|Se renueva automáticamente. Cancela en Cuenta → Membresía. Stripe muestra los impuestos aplicables antes de confirmar.|Renovação automática. Cancele em Conta → Assinatura. A Stripe mostra os impostos aplicáveis antes da confirmação.|自动续订。可在账户 → 会员方案取消。Stripe 会在确认前显示适用税费。|Renouvellement automatique. Résiliez dans Compte → Abonnement. Stripe affiche les taxes applicables avant confirmation.|자동 갱신됩니다. 계정 → 멤버십에서 해지하세요. Stripe가 확정 전 적용 세금을 표시합니다.|Diperpanjang otomatis. Batalkan di Akun → Keanggotaan. Stripe menampilkan pajak yang berlaku sebelum konfirmasi.|Продлевается автоматически. Отмена в разделе «Аккаунт → Подписка». Stripe покажет применимые налоги до подтверждения.|يتجدد تلقائيًا. ألغِ التجديد من الحساب ← العضوية. تعرض Stripe الضرائب المطبقة قبل التأكيد.
Access until {0}|利用期限 {0}|Acceso hasta el {0}|Acesso até {0}|可使用至 {0}|Accès jusqu’au {0}|{0}까지 이용 가능|Akses hingga {0}|Доступ до {0}|الوصول حتى {0}
Next billing date: {0}|次回請求日 {0}|Próximo cobro: {0}|Próxima cobrança: {0}|下次扣款日期：{0}|Prochaine facturation : {0}|다음 결제일: {0}|Tagihan berikutnya: {0}|Следующее списание: {0}|تاريخ الفوترة التالية: {0}
Update your payment method in Manage subscription.|「サブスクリプションを管理」から支払い方法を更新してください。|Actualiza el método de pago en Gestionar suscripción.|Atualize o método de pagamento em Gerenciar assinatura.|请在“管理订阅”中更新付款方式。|Mettez à jour votre moyen de paiement dans Gérer l’abonnement.|구독 관리에서 결제 수단을 업데이트하세요.|Perbarui metode pembayaran di Kelola langganan.|Обновите способ оплаты в разделе управления подпиской.|حدّث طريقة الدفع من إدارة الاشتراك.
Payment problems and refunds|支払いの問題と返金|Problemas de pago y reembolsos|Problemas de pagamento e reembolsos|付款问题和退款|Problèmes de paiement et remboursements|결제 문제 및 환불|Masalah pembayaran dan pengembalian dana|Проблемы с оплатой и возвраты|مشكلات الدفع والمبالغ المستردة
Renewal stopped|自動更新停止|Renovación detenida|Renovação desativada|已停止续订|Renouvellement désactivé|갱신 중지|Perpanjangan dihentikan|Продление отключено|تم إيقاف التجديد
Paid invoice amounts this month (UTC)|今月の請求書支払い額（UTC）|Importes de facturas pagadas este mes (UTC)|Valores das faturas pagas neste mês (UTC)|本月已付账单金额（UTC）|Montants des factures réglées ce mois-ci (UTC)|이번 달 결제된 청구서 금액(UTC)|Nilai faktur yang dibayar bulan ini (UTC)|Оплаченные счета за этот месяц (UTC)|مبالغ الفواتير المدفوعة هذا الشهر (UTC)
Gross invoice payments. Stripe fees, taxes and bank payouts are separate.|請求書の総支払額です。Stripe手数料、税額、銀行への振込額は別です。|Pagos brutos de facturas. Comisiones de Stripe, impuestos e ingresos bancarios se contabilizan aparte.|Pagamentos brutos de faturas. Tarifas Stripe, impostos e repasses bancários são separados.|这是账单付款总额。Stripe 手续费、税费和银行打款另计。|Paiements bruts des factures. Frais Stripe, taxes et virements bancaires sont distincts.|청구서 총 결제액입니다. Stripe 수수료, 세금, 은행 정산액은 별도입니다.|Pembayaran faktur bruto. Biaya Stripe, pajak, dan pencairan bank dihitung terpisah.|Валовые платежи по счетам. Комиссии Stripe, налоги и банковские выплаты учитываются отдельно.|إجمالي مدفوعات الفواتير. رسوم Stripe والضرائب والتحويلات البنكية بنود منفصلة.
Paid invoice events|請求書支払いイベント|Eventos de facturas pagadas|Eventos de faturas pagas|账单支付事件|Événements de factures réglées|청구서 결제 이벤트|Peristiwa faktur dibayar|События оплаты счетов|أحداث دفع الفواتير
Failed payment events|支払い失敗イベント|Eventos de pago fallido|Eventos de pagamento malsucedido|支付失败事件|Événements d’échec de paiement|결제 실패 이벤트|Peristiwa pembayaran gagal|События неудачной оплаты|أحداث فشل الدفع
Recorded refunds|記録済みの返金|Reembolsos registrados|Reembolsos registrados|已记录的退款|Remboursements enregistrés|기록된 환불|Pengembalian dana tercatat|Зафиксированные возвраты|المبالغ المستردة المسجلة
Estimated MRR / ARR|推定MRR／ARR|MRR / ARR estimados|MRR / ARR estimados|预估 MRR / ARR|MRR / ARR estimés|예상 MRR / ARR|Perkiraan MRR / ARR|Оценка MRR / ARR|تقدير MRR / ARR
MRR adds monthly list prices and one twelfth of annual list prices. ARR is MRR × 12.|MRRは月額料金と年額料金の12分の1の合計です。ARRはMRRの12倍です。|El MRR suma los precios mensuales y la doceava parte de los anuales. El ARR es el MRR × 12.|O MRR soma preços mensais e um doze avos dos anuais. ARR é MRR × 12.|MRR 为月费与年费十二分之一之和。ARR 为 MRR × 12。|Le MRR additionne les tarifs mensuels et un douzième des tarifs annuels. L’ARR vaut MRR × 12.|MRR은 월 정가와 연 정가의 12분의 1을 합산합니다. ARR은 MRR × 12입니다.|MRR menjumlahkan harga bulanan dan seperdua belas harga tahunan. ARR adalah MRR × 12.|MRR складывает месячные тарифы и одну двенадцатую годовых. ARR равен MRR × 12.|يجمع MRR الأسعار الشهرية وجزءًا من اثني عشر من الأسعار السنوية. ARR يساوي MRR × 12.
{0} subscriptions lack a comparable price.|比較できる価格が未記録の契約が {0} 件あります。|{0} suscripciones no tienen un precio comparable.|{0} assinaturas não têm um preço comparável.|有 {0} 个订阅缺少可比较的价格。|{0} abonnements n’ont pas de tarif comparable.|비교 가능한 가격이 없는 구독 {0}개.|{0} langganan tidak memiliki harga yang dapat dibandingkan.|Для подписок ({0}) нет сопоставимой цены.|لا تتوفر أسعار قابلة للمقارنة لعدد {0} من الاشتراكات.

Regular lessons, review and Learning Memory|通常レッスン・復習・学習メモリー|Lecciones, repaso y memoria de aprendizaje|Aulas, revisão e memória de aprendizagem|常规课程、复习和学习记忆|Leçons, révisions et mémoire d’apprentissage|일반 레슨, 복습 및 학습 기록|Pelajaran reguler, ulasan, dan memori belajar|Обычные уроки, повторение и память обучения|الدروس العادية والمراجعة وذاكرة التعلّم
AI conversation sessions per day|AI会話の1日あたりの回数|Conversaciones con IA al día|Conversas com IA por dia|每日 AI 对话次数|Conversations avec l’IA par jour|하루 AI 대화 횟수|Sesi percakapan AI per hari|Сеансы общения с ИИ в день|جلسات المحادثة مع الذكاء الاصطناعي يوميًا
Focused Practice AI evaluations per day|集中練習の1日あたりのAI評価回数|Evaluaciones diarias de práctica enfocada|Avaliações diárias de prática focada|每日专项练习 AI 评估次数|Évaluations IA d’entraînement ciblé par jour|하루 집중 연습 AI 평가 횟수|Evaluasi AI latihan terfokus per hari|Оценки ИИ для целевой практики в день|تقييمات الذكاء الاصطناعي للتدريب المركّز يوميًا
Included|利用可能|Incluido|Incluído|已包含|Inclus|포함|Termasuk|Включено|مشمول
Detailed|詳細|Detallado|Detalhado|详细|Détaillé|상세|Terperinci|Подробно|مفصّل

AI feedback|AIフィードバック|Comentarios de IA|Feedback de IA|AI 反馈|Retour de l’IA|AI 피드백|Umpan balik AI|Обратная связь ИИ|ملاحظات الذكاء الاصطناعي
Feature|機能|Función|Recurso|功能|Fonctionnalité|기능|Fitur|Функция|الميزة
Summary|概要|Resumen|Resumo|概要|Résumé|요약|Ringkasan|Сводка|ملخّص

Invoices and receipts|請求書と領収書|Facturas y recibos|Faturas e recibos|发票和收据|Factures et reçus|청구서 및 영수증|Faktur dan kuitansi|Счета и квитанции|الفواتير والإيصالات
Invoice history is temporarily unavailable.|請求履歴を一時的に表示できません。|El historial de facturas no está disponible temporalmente.|O histórico de faturas está temporariamente indisponível.|暂时无法查看发票记录。|L’historique des factures est temporairement indisponible.|청구 내역을 일시적으로 확인할 수 없습니다.|Riwayat faktur sementara tidak tersedia.|История счетов временно недоступна.|سجل الفواتير غير متاح مؤقتًا.
Loading invoices…|請求書を読み込み中…|Cargando facturas…|Carregando faturas…|正在加载发票…|Chargement des factures…|청구서를 불러오는 중…|Memuat faktur…|Загрузка счетов…|جارٍ تحميل الفواتير…
No invoices yet.|請求書はまだありません。|Aún no hay facturas.|Ainda não há faturas.|暂无发票。|Aucune facture pour le moment.|아직 청구서가 없습니다.|Belum ada faktur.|Счетов пока нет.|لا توجد فواتير بعد.
Invoice|請求書|Factura|Fatura|发票|Facture|청구서|Faktur|Счёт|فاتورة
View invoice|請求書を表示|Ver factura|Ver fatura|查看发票|Voir la facture|청구서 보기|Lihat faktur|Посмотреть счёт|عرض الفاتورة
Invoice PDF|請求書PDF|PDF de la factura|PDF da fatura|发票 PDF|PDF de la facture|청구서 PDF|PDF faktur|Счёт в PDF|ملف الفاتورة PDF
For older invoices, open subscription management.|過去の請求書はサブスクリプション管理から確認できます。|Consulta las facturas anteriores en la gestión de suscripciones.|Consulte faturas anteriores no gerenciamento da assinatura.|请在订阅管理中查看更早的发票。|Consultez les anciennes factures dans la gestion de l’abonnement.|이전 청구서는 구독 관리에서 확인하세요.|Lihat faktur lama di pengelolaan langganan.|Предыдущие счета доступны в разделе управления подпиской.|اطّلع على الفواتير الأقدم من إدارة الاشتراك.
Draft invoice|下書き|Factura en borrador|Fatura em rascunho|发票草稿|Brouillon de facture|청구서 초안|Draf faktur|Черновик счёта|مسودة فاتورة
Open invoice|支払い待ち|Factura pendiente|Fatura pendente|待付款|Facture en attente|결제 대기|Faktur menunggu pembayaran|Ожидает оплаты|فاتورة بانتظار الدفع
Paid invoice|支払い済み|Factura pagada|Fatura paga|已付款|Facture réglée|결제 완료|Faktur lunas|Оплаченный счёт|فاتورة مدفوعة
Void invoice|無効|Factura anulada|Fatura anulada|已作废|Facture annulée|무효 청구서|Faktur dibatalkan|Аннулированный счёт|فاتورة ملغاة
Uncollectible invoice|回収不能|Factura incobrable|Fatura incobrável|无法收款|Facture irrécouvrable|회수 불가|Faktur tidak tertagih|Счёт не подлежит взысканию|فاتورة متعذرة التحصيل
Unknown invoice status|請求状況不明|Estado de factura desconocido|Status da fatura desconhecido|发票状态未知|Statut de facture inconnu|알 수 없는 청구 상태|Status faktur tidak diketahui|Статус счёта неизвестен|حالة الفاتورة غير معروفة

`;
export const billingCopy=Object.fromEntries(rows.trim().split('\n').filter(Boolean).map(line=>{const [k,...v]=line.split('|');if(![5,9].includes(v.length))throw Error('Billing translation missing');return [k,Object.fromEntries(['ja','es','pt','zh','fr','ko','id','ru','ar'].slice(0,v.length).map((l,i)=>[l,v[i]]))]}));
