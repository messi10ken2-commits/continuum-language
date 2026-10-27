// Reviewed common UI and name-safe templates. User values are inserted after translation.
const rows=`
Week|週|Semana|Semana|周|Semaine|주|Minggu|Неделя|الأسبوع
Month|月|Mes|Mês|月|Mois|월|Bulan|Месяц|الشهر
All time|全期間|Todo el período|Todo o período|全部时间|Depuis le début|전체 기간|Sepanjang waktu|За всё время|كل الفترات
Explore, practise and make real progress.|いろいろ試し、練習を重ねて、着実に力を伸ばそう。|Explora, practica y avanza de verdad.|Explore, pratique e avance de verdade.|探索、练习，让进步真正发生。|Explorez, entraînez-vous et progressez concrètement.|다양하게 탐색하고 연습하며 실력을 키워 보세요.|Jelajahi, berlatih, dan raih kemajuan nyata.|Открывайте новое, практикуйтесь и двигайтесь вперёд.|استكشف وتدرّب وحقّق تقدّمًا ملموسًا.
Every step becomes part of your story.|一歩ずつの積み重ねが、あなたの物語になる。|Cada paso forma parte de tu historia.|Cada passo faz parte da sua história.|每一步都会成为你学习故事的一部分。|Chaque pas fait partie de votre histoire.|한 걸음 한 걸음이 나만의 이야기가 돼요.|Setiap langkah menjadi bagian dari kisah Anda.|Каждый шаг становится частью вашей истории.|كل خطوة تصبح جزءًا من قصتك.
Your learning timeline|学習のタイムライン|Tu cronología de aprendizaje|Sua linha do tempo de aprendizagem|你的学习时间线|Votre parcours d’apprentissage|내 학습 타임라인|Linimasa belajar Anda|Хронология вашего обучения|الخط الزمني لتعلّمك
{0}’s learning memory|{0}さんの学習記録|Historial de aprendizaje de {0}|Histórico de aprendizagem de {0}|{0}的学习记录|Historique d’apprentissage de {0}|{0}님의 학습 기록|Riwayat belajar {0}|История обучения: {0}|سجل تعلّم {0}
`;
export const interfaceAuditSeed=Object.fromEntries(rows.trim().split('\n').filter(Boolean).map(row=>{const [source,...values]=row.split('|');if(values.length!==9)throw Error('Incomplete UI audit seed');return [source,Object.fromEntries(['ja','es','pt','zh','fr','ko','id','ru','ar'].map((l,i)=>[l,values[i]]))]}));
