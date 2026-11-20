const locales=['ja','es','pt','zh','fr','ko','id','ru','ar'];
const rows=`
AI Usage|AI利用状況|Uso de IA|Uso de IA|AI 使用情况|Utilisation de l’IA|AI 사용 현황|Penggunaan AI|Использование ИИ|استخدام الذكاء الاصطناعي
AI Usage & Cost Monitoring|AI利用状況と費用の監視|Monitoreo del uso y coste de IA|Monitoramento de uso e custos de IA|AI 使用量与费用监控|Suivi de l’utilisation et des coûts de l’IA|AI 사용량 및 비용 모니터링|Pemantauan Penggunaan dan Biaya AI|Мониторинг использования и затрат на ИИ|مراقبة استخدام الذكاء الاصطناعي وتكاليفه
USD estimates use provider-reported usage and configured model rates. Unpriced calls are excluded from the dollar totals and shown separately.|米ドルでの推定額は、プロバイダーの使用量データと設定済みのモデル単価に基づきます。金額を算出できない呼び出しは別に表示します。|Las estimaciones en USD usan los datos del proveedor y las tarifas configuradas. Las llamadas sin coste calculable se muestran por separado.|As estimativas em USD usam os dados do provedor e as tarifas configuradas. Chamadas sem custo calculável aparecem separadamente.|美元估算基于服务商报告的使用量与配置的模型费率。无法估价的调用单独显示，不计入金额合计。|Les estimations en USD utilisent les données du fournisseur et les tarifs configurés. Les appels dont le coût est inconnu sont affichés à part.|미국 달러 추정액은 공급자가 보고한 사용량과 설정된 모델 요율을 기준으로 합니다. 비용을 산정할 수 없는 호출은 별도로 표시합니다.|Estimasi USD memakai data penggunaan dari penyedia dan tarif model yang dikonfigurasi. Panggilan yang biayanya belum diketahui ditampilkan terpisah.|Оценка в долларах США рассчитана по данным поставщика и настроенным тарифам. Вызовы с неизвестной стоимостью показаны отдельно.|تستند التقديرات بالدولار إلى بيانات الاستخدام من المزوّد وأسعار النماذج المحددة. تُعرض الطلبات التي يتعذر تقدير تكلفتها بشكل منفصل.
Reporting period (UTC)|集計期間（UTC）|Periodo del informe (UTC)|Período do relatório (UTC)|统计时段（UTC）|Période du rapport (UTC)|보고 기간(UTC)|Periode laporan (UTC)|Период отчёта (UTC)|فترة التقرير (UTC)
Active AI users|AIを利用したユーザー|Usuarios activos de IA|Usuários ativos de IA|AI 活跃用户|Utilisateurs actifs de l’IA|AI 활성 사용자|Pengguna AI aktif|Активные пользователи ИИ|مستخدمو الذكاء الاصطناعي النشطون
estimated per user|ユーザーあたりの推定額|estimado por usuario|estimado por usuário|每位用户的估算费用|estimation par utilisateur|사용자당 추정액|perkiraan per pengguna|оценка на пользователя|التقدير لكل مستخدم
Daily estimated cost (UTC)|日別推定費用（UTC）|Coste diario estimado (UTC)|Custo diário estimado (UTC)|每日估算费用（UTC）|Coût quotidien estimé (UTC)|일일 추정 비용(UTC)|Perkiraan biaya harian (UTC)|Оценка затрат по дням (UTC)|التكلفة اليومية المقدّرة (UTC)
Estimated USD|推定額（米ドル）|Estimación en USD|Estimativa em USD|估算金额（美元）|Estimation en USD|추정액(USD)|Estimasi USD|Оценка в долларах США|التقدير بالدولار
Unattributed|アカウントへの紐付けなし|Sin atribuir|Sem atribuição|未归属|Non attribué|계정 미확인|Tidak teratribusi|Без привязки|غير منسوب
unpriced calls|費用未算出の呼び出し|llamadas sin coste calculado|chamadas sem custo calculado|无法估价的调用|appels au coût inconnu|비용 미산정 호출|panggilan dengan biaya belum diketahui|вызовов с неизвестной стоимостью|طلبات بلا تقدير للتكلفة
Unpriced calls|費用未算出の呼び出し|Llamadas sin coste calculado|Chamadas sem custo calculado|无法估价的调用|Appels au coût inconnu|비용 미산정 호출|Panggilan dengan biaya belum diketahui|Вызовы с неизвестной стоимостью|طلبات بلا تقدير للتكلفة
High|高リスク|Alto|Alto|高风险|Élevé|높음|Tinggi|Высокий|مرتفع
Warning|注意|Advertencia|Atenção|注意|Avertissement|주의|Peringatan|Предупреждение|تحذير
Mark resolved|解決済みにする|Marcar como resuelto|Marcar como resolvido|标记为已解决|Marquer comme résolu|해결로 표시|Tandai selesai|Отметить как решённое|وضع علامة تم الحل
No recent AI usage alerts.|最近のAI利用警告はありません。|No hay alertas recientes de uso de IA.|Não há alertas recentes de uso de IA.|近期没有 AI 使用告警。|Aucune alerte récente d’utilisation de l’IA.|최근 AI 사용 알림이 없습니다.|Tidak ada peringatan penggunaan AI terbaru.|Нет недавних предупреждений об использовании ИИ.|لا توجد تنبيهات حديثة بشأن الاستخدام.
Free and Premium|FreeとPremium|Free y Premium|Free e Premium|Free 与 Premium|Free et Premium|Free 및 Premium|Free dan Premium|Free и Premium|Free وPremium
Completed uses|完了回数|Usos completados|Usos concluídos|完成次数|Utilisations terminées|완료 횟수|Penggunaan selesai|Завершённые операции|الاستخدامات المكتملة
Provider calls|API呼び出し|Llamadas al proveedor|Chamadas ao provedor|服务商调用次数|Appels au fournisseur|공급자 호출|Panggilan penyedia|Вызовы API|طلبات المزوّد
Usage by feature|機能別の利用状況|Uso por función|Uso por recurso|按功能统计使用量|Utilisation par fonctionnalité|기능별 사용량|Penggunaan per fitur|Использование по функциям|الاستخدام حسب الميزة
User cost ranking|ユーザー別費用ランキング|Clasificación de coste por usuario|Ranking de custo por usuário|用户费用排行|Classement des coûts par utilisateur|사용자별 비용 순위|Peringkat biaya pengguna|Рейтинг пользователей по затратам|ترتيب المستخدمين حسب التكلفة
Estimated per evaluation|評価1回あたりの推定額|Estimación por evaluación|Estimativa por avaliação|每次评估的估算费用|Estimation par évaluation|평가당 추정액|Estimasi per evaluasi|Оценка на одну проверку|التقدير لكل تقييم
Models and measured usage|モデル別の実測利用量|Modelos y uso medido|Modelos e uso medido|模型与实测用量|Modèles et utilisation mesurée|모델 및 측정 사용량|Model dan penggunaan terukur|Модели и измеренное использование|النماذج والاستخدام المقاس
AI usage alerts|AI利用警告|Alertas de uso de IA|Alertas de uso de IA|AI 使用告警|Alertes d’utilisation de l’IA|AI 사용 알림|Peringatan penggunaan AI|Предупреждения об использовании ИИ|تنبيهات استخدام الذكاء الاصطناعي
Input tokens|入力トークン|Tokens de entrada|Tokens de entrada|输入词元|Jetons d’entrée|입력 토큰|Token masukan|Входные токены|رموز الإدخال
Output tokens|出力トークン|Tokens de salida|Tokens de saída|输出词元|Jetons de sortie|출력 토큰|Token keluaran|Выходные токены|رموز الإخراج
Audio input tokens|音声入力トークン|Tokens de entrada de audio|Tokens de entrada de áudio|音频输入词元|Jetons d’entrée audio|오디오 입력 토큰|Token masukan audio|Входные аудиотокены|رموز إدخال الصوت
Audio output tokens|音声出力トークン|Tokens de salida de audio|Tokens de saída de áudio|音频输出词元|Jetons de sortie audio|오디오 출력 토큰|Token keluaran audio|Выходные аудиотокены|رموز إخراج الصوت
Evaluation burst|短時間の評価集中|Pico de evaluaciones|Pico de avaliações|评估次数激增|Pic d’évaluations|평가 급증|Lonjakan evaluasi|Всплеск оценок|ارتفاع مفاجئ في التقييمات
Repeated provider failures|APIの連続失敗|Fallos repetidos del proveedor|Falhas repetidas no provedor|服务商调用反复失败|Échecs répétés du fournisseur|공급자 호출 반복 실패|Kegagalan penyedia berulang|Повторные сбои API|إخفاقات متكررة لدى المزوّد
Repeated quota denials|利用上限による連続拒否|Rechazos repetidos por límite|Bloqueios repetidos por limite|反复因配额被拒|Refus répétés liés au quota|한도 초과 요청 반복|Penolakan kuota berulang|Повторные отказы по лимиту|رفض متكرر بسبب الحد
High evaluation cost|評価費用が高額|Coste alto de evaluación|Custo alto de avaliação|评估费用过高|Coût d’évaluation élevé|높은 평가 비용|Biaya evaluasi tinggi|Высокая стоимость оценки|تكلفة تقييم مرتفعة
User cost spike|ユーザー費用の急増|Aumento de coste por usuario|Pico de custo do usuário|用户费用激增|Pic du coût utilisateur|사용자 비용 급증|Lonjakan biaya pengguna|Всплеск затрат пользователя|ارتفاع مفاجئ في تكلفة المستخدم
Model cost spike|モデル費用の急増|Aumento de coste por modelo|Pico de custo do modelo|模型费用激增|Pic du coût du modèle|모델 비용 급증|Lonjakan biaya model|Всплеск затрат на модель|ارتفاع مفاجئ في تكلفة النموذج
`;
export const aiOperationsCopy=Object.fromEntries(rows.trim().split('\n').map(row=>{
 const [key,...values]=row.split('|');
 return [key,Object.fromEntries(locales.map((locale,index)=>[locale,values[index]]))];
}));
