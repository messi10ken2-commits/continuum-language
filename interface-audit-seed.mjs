// Reviewed common UI and name-safe templates. User values are inserted after translation.
const rows=`
Link|リンク|Enlace|Link|链接|Lien|링크|Tautan|Ссылка|الرابط
Waiting|対応待ち|En espera|Aguardando|等待中|En attente|대기 중|Menunggu|Ожидание|قيد الانتظار
Resolved|解決済み|Resuelto|Resolvido|已解决|Résolu|해결됨|Selesai|Решено|تم الحل

15 min|15分|15 min|15 min|15分钟|15 min|15분|15 menit|15 мин|15 دقيقة
10 min|10分|10 min|10 min|10分钟|10 min|10분|10 menit|10 мин|10 دقائق
5 min|5分|5 min|5 min|5分钟|5 min|5분|5 menit|5 мин|5 دقائق

Subjunctive|接続法|Subjuntivo|Subjuntivo|虚拟式|Subjonctif|접속법|Subjungtif|Сослагательное наклонение|صيغة الشرط
Por vs. para|por と para の使い分け|Por y para|Por e para|por 与 para 的区别|Por et para|por와 para의 차이|Perbedaan por dan para|Разница между por и para|الفرق بين por وpara
Articles|冠詞|Artículos|Artigos|冠词|Articles|관사|Kata sandang|Артикли|أدوات التعريف والتنكير
Fluency|流暢さ|Fluidez|Fluência|流利度|Aisance|유창성|Kelancaran|Беглость речи|الطلاقة
Body|本文|Contenido|Conteúdo|正文|Contenu|본문|Isi|Текст|النص

Week|週|Semana|Semana|周|Semaine|주|Minggu|Неделя|الأسبوع
Month|月|Mes|Mês|月|Mois|월|Bulan|Месяц|الشهر
All time|全期間|Todo el período|Todo o período|全部时间|Depuis le début|전체 기간|Sepanjang waktu|За всё время|كل الفترات
Explore, practise and make real progress.|いろいろ試し、練習を重ねて、着実に力を伸ばそう。|Explora, practica y avanza de verdad.|Explore, pratique e avance de verdade.|探索、练习，让进步真正发生。|Explorez, entraînez-vous et progressez concrètement.|다양하게 탐색하고 연습하며 실력을 키워 보세요.|Jelajahi, berlatih, dan raih kemajuan nyata.|Открывайте новое, практикуйтесь и двигайтесь вперёд.|استكشف وتدرّب وحقّق تقدّمًا ملموسًا.
Every step becomes part of your story.|一歩ずつの積み重ねが、あなたの物語になる。|Cada paso forma parte de tu historia.|Cada passo faz parte da sua história.|每一步都会成为你学习故事的一部分。|Chaque pas fait partie de votre histoire.|한 걸음 한 걸음이 나만의 이야기가 돼요.|Setiap langkah menjadi bagian dari kisah Anda.|Каждый шаг становится частью вашей истории.|كل خطوة تصبح جزءًا من قصتك.
Your learning timeline|学習のタイムライン|Tu cronología de aprendizaje|Sua linha do tempo de aprendizagem|你的学习时间线|Votre parcours d’apprentissage|내 학습 타임라인|Linimasa belajar Anda|Хронология вашего обучения|الخط الزمني لتعلّمك
{0}’s learning memory|{0}さんの学習記録|Historial de aprendizaje de {0}|Histórico de aprendizagem de {0}|{0}的学习记录|Historique d’apprentissage de {0}|{0}님의 학습 기록|Riwayat belajar {0}|История обучения: {0}|سجل تعلّم {0}
`;
export const interfaceAuditSeed=Object.fromEntries(rows.trim().split('\n').filter(Boolean).map(row=>{const [source,...values]=row.split('|');if(values.length!==9)throw Error('Incomplete UI audit seed');return [source,Object.fromEntries(['ja','es','pt','zh','fr','ko','id','ru','ar'].map((l,i)=>[l,values[i]]))]}));
