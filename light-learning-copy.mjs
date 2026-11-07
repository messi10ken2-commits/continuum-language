// Source | Japanese | Spanish | Portuguese | Chinese | French | Korean | Indonesian | Russian | Arabic
const rows=`
Buildings {0}/{1}|建物 {0}/{1}|Edificios {0}/{1}|Edifícios {0}/{1}|建筑 {0}/{1}|Bâtiments {0}/{1}|건물 {0}/{1}|Bangunan {0}/{1}|Здания {0}/{1}|المباني {0}/{1}
Town district|街の地区|Barrio de la ciudad|Bairro da cidade|小镇街区|Quartier de la ville|마을 구역|Kawasan kota|Район города|حي البلدة
District {0}|第{0}地区|Barrio {0}|Bairro {0}|第 {0} 街区|Quartier {0}|{0}구역|Kawasan {0}|Район {0}|الحي {0}
Finish all rounds in a lesson to build a new place.|レッスンの全ラウンドをクリアすると、街に建物が一軒増えます。|Completa todas las rondas de una lección para construir un nuevo lugar.|Conclua todas as rodadas de uma lição para construir um novo local.|完成一课的所有轮次，即可建造一栋新建筑。|Terminez toutes les manches d’une leçon pour construire un nouveau bâtiment.|레슨의 모든 라운드를 완료하면 건물이 하나 생겨요.|Selesaikan semua ronde dalam satu pelajaran untuk membangun tempat baru.|Завершите все раунды урока, чтобы построить новое здание.|أكمل جميع جولات الدرس لبناء مكان جديد.
A new building opened in your town!|街に新しい建物ができました！|¡Se ha inaugurado un nuevo edificio en tu ciudad!|Um novo edifício foi inaugurado na sua cidade!|小镇有了一栋新建筑！|Un nouveau bâtiment a ouvert dans votre ville !|마을에 새 건물이 생겼어요!|Bangunan baru telah dibuka di kotamu!|В вашем городе открылось новое здание!|افتُتح مبنى جديد في بلدتك!
Rose planter|バラの鉢植え|Macetero de rosas|Vaso de rosas|玫瑰花盆|Jardinière de roses|장미 화분|Pot bunga mawar|Кашпо с розами|حوض ورود
Ornamental tree|庭木|Árbol ornamental|Árvore ornamental|观赏树|Arbre ornemental|관상수|Pohon hias|Декоративное дерево|شجرة زينة
Chapter progress|チャプターの進み具合|Progreso del capítulo|Progresso do capítulo|章节进度|Progression du chapitre|챕터 진행 상황|Kemajuan bab|Прогресс главы|تقدّم الفصل
Complete|完了|Completado|Concluído|已完成|Terminé|완료|Selesai|Завершено|مكتمل
bread|パン|pan|pão|面包|pain|빵|roti|хлеб|خبز
milk|牛乳|leche|leite|牛奶|lait|우유|susu|молоко|حليب
Build the phrase|フレーズを組み立てる|Forma la frase|Monte a frase|组成短语|Construisez la phrase|문구 만들기|Susun frasa|Составьте фразу|كوّن العبارة
Learning progress|学習の進み具合|Progreso de aprendizaje|Progresso de aprendizagem|学习进度|Progression de l’apprentissage|학습 진행 상황|Kemajuan belajar|Ход обучения|تقدّم التعلم
From your classes|授業からの練習|De tus clases|Das suas aulas|来自课堂的练习|À partir de vos cours|수업에서 이어지는 연습|Dari kelas Anda|Из ваших занятий|من دروسك
Use normal playback speed|通常の再生速度に戻す|Usar velocidad normal|Usar velocidade normal|使用正常播放速度|Utiliser la vitesse normale|일반 속도로 재생|Gunakan kecepatan pemutaran normal|Использовать обычную скорость воспроизведения|استخدم سرعة التشغيل العادية
Use slower playback speed|ゆっくり再生|Reproducir más despacio|Reproduzir mais devagar|慢速播放|Lire plus lentement|느린 속도로 재생|Putar lebih pelan|Воспроизводить медленнее|شغّل ببطء
Light|ライト|Ligero|Leve|轻松|Léger|라이트|Ringan|Лёгкий|خفيف
Standard|スタンダード|Estándar|Padrão|标准|Standard|표준|Standar|Стандартный|عادي
Learning mode|学習モード|Modo de aprendizaje|Modo de aprendizagem|学习模式|Mode d’apprentissage|학습 모드|Mode belajar|Режим обучения|وضع التعلم
Small steps. Clear guidance.|少しずつ、わかりやすく。|Pasos pequeños. Guía clara.|Pequenos passos. Orientação clara.|小步学习，清晰引导。|De petits pas, des conseils clairs.|조금씩, 명확한 안내와 함께.|Langkah kecil. Panduan jelas.|Маленькие шаги. Понятные подсказки.|خطوات صغيرة وإرشادات واضحة.
Short guided practice|短いガイド付き練習|Práctica breve y guiada|Prática curta e guiada|简短引导练习|Pratique courte et guidée|짧은 안내형 연습|Latihan singkat terpandu|Короткая практика с подсказками|تدريب قصير وموجّه
Hints when you need them|必要なときにヒント|Pistas cuando las necesites|Dicas quando precisar|随时查看提示|Des indices au besoin|필요할 때 보는 힌트|Petunjuk saat dibutuhkan|Подсказки по необходимости|تلميحات عند الحاجة
Start light lesson|ライトレッスンを始める|Empezar lección ligera|Começar lição leve|开始轻松课程|Commencer la leçon légère|라이트 레슨 시작|Mulai pelajaran ringan|Начать лёгкий урок|ابدأ الدرس الخفيف
Switch anytime. Your learning stays saved.|いつでも切り替え可能。学習記録は残ります。|Cambia cuando quieras. Tu aprendizaje queda guardado.|Mude quando quiser. Seu aprendizado fica salvo.|随时切换，学习记录会保留。|Changez quand vous voulez. Vos acquis restent enregistrés.|언제든 전환하세요. 학습 기록은 유지됩니다.|Beralih kapan saja. Riwayat belajar tetap tersimpan.|Переключайтесь в любой момент. История сохранится.|يمكنك التبديل في أي وقت. يبقى سجل تعلمك محفوظًا.
Light practice is recorded separately from Standard mastery.|ライト練習はスタンダードの習得判定とは別に記録されます。|La práctica ligera se registra aparte del dominio en Estándar.|A prática leve é registrada separadamente do domínio no modo Padrão.|轻松练习与标准模式的掌握程度分别记录。|La pratique légère est enregistrée séparément de la maîtrise en Standard.|라이트 연습은 표준 모드의 숙달 기록과 별도로 저장됩니다.|Latihan ringan dicatat terpisah dari penguasaan mode Standar.|Лёгкая практика записывается отдельно от освоения в стандартном режиме.|يُسجّل التدريب الخفيف منفصلًا عن الإتقان في الوضع العادي.
Study this model|まずお手本を確認|Observa este modelo|Observe este modelo|先学习这个范例|Observez ce modèle|먼저 예문을 살펴보세요|Pelajari contoh ini|Изучите этот образец|تأمل هذا المثال
Now try it|やってみましょう|Ahora inténtalo|Agora tente|现在试一试|À vous d’essayer|이제 해 보세요|Sekarang coba|Теперь попробуйте|جرّب الآن
Show a hint|ヒントを見る|Ver una pista|Mostrar dica|查看提示|Voir un indice|힌트 보기|Lihat petunjuk|Показать подсказку|عرض تلميح
Hide hint|ヒントを隠す|Ocultar pista|Ocultar dica|隐藏提示|Masquer l’indice|힌트 숨기기|Sembunyikan petunjuk|Скрыть подсказку|إخفاء التلميح
Guided practice complete|ガイド付き練習が完了|Práctica guiada completada|Prática guiada concluída|引导练习已完成|Pratique guidée terminée|안내형 연습 완료|Latihan terpandu selesai|Практика с подсказками завершена|اكتمل التدريب الموجّه
Your guided practice was saved.|ガイド付き練習を保存しました。|Tu práctica guiada se ha guardado.|Sua prática guiada foi salva.|已保存你的引导练习。|Votre pratique guidée a été enregistrée.|안내형 연습을 저장했어요.|Latihan terpandu Anda telah disimpan.|Практика с подсказками сохранена.|تم حفظ تدريبك الموجّه.
Try Standard|スタンダードで練習|Probar Estándar|Experimentar Padrão|尝试标准模式|Essayer Standard|표준 모드로 연습|Coba Standar|Попробовать стандартный режим|جرّب الوضع العادي
Practise again|もう一度練習|Practicar otra vez|Praticar novamente|再次练习|Pratiquer à nouveau|다시 연습|Berlatih lagi|Повторить практику|تدرّب مجددًا
Resume light practice|ライト練習を再開|Retomar práctica ligera|Retomar prática leve|继续轻松练习|Reprendre la pratique légère|라이트 연습 이어하기|Lanjutkan latihan ringan|Продолжить лёгкую практику|تابع التدريب الخفيف
Loading your light practice…|ライト練習を読み込み中…|Cargando tu práctica ligera…|Carregando sua prática leve…|正在加载轻松练习…|Chargement de votre pratique légère…|라이트 연습을 불러오는 중…|Memuat latihan ringan…|Загрузка лёгкой практики…|جارٍ تحميل تدريبك الخفيف…
Could not load light practice. Try again.|ライト練習を読み込めませんでした。もう一度お試しください。|No se pudo cargar la práctica ligera. Inténtalo de nuevo.|Não foi possível carregar a prática leve. Tente novamente.|无法加载轻松练习，请重试。|Impossible de charger la pratique légère. Réessayez.|라이트 연습을 불러오지 못했어요. 다시 시도해 주세요.|Latihan ringan tidak dapat dimuat. Coba lagi.|Не удалось загрузить лёгкую практику. Повторите попытку.|تعذّر تحميل التدريب الخفيف. حاول مجددًا.
Could not save light practice. Try again.|ライト練習を保存できませんでした。もう一度お試しください。|No se pudo guardar la práctica ligera. Inténtalo de nuevo.|Não foi possível salvar a prática leve. Tente novamente.|无法保存轻松练习，请重试。|Impossible d’enregistrer la pratique légère. Réessayez.|라이트 연습을 저장하지 못했어요. 다시 시도해 주세요.|Latihan ringan tidak dapat disimpan. Coba lagi.|Не удалось сохранить лёгкую практику. Повторите попытку.|تعذّر حفظ التدريب الخفيف. حاول مجددًا.
Light practice history|ライト練習の記録|Historial de práctica ligera|Histórico de prática leve|轻松练习记录|Historique de pratique légère|라이트 연습 기록|Riwayat latihan ringan|История лёгкой практики|سجل التدريب الخفيف
No light practice saved yet.|ライト練習の記録はまだありません。|Aún no hay práctica ligera guardada.|Ainda não há prática leve salva.|尚无轻松练习记录。|Aucune pratique légère enregistrée.|저장된 라이트 연습이 아직 없어요.|Belum ada latihan ringan tersimpan.|Пока нет сохранённой лёгкой практики.|لا يوجد تدريب خفيف محفوظ بعد.
Saved on this device.|この端末に保存しました。|Guardado en este dispositivo.|Salvo neste dispositivo.|已保存在此设备上。|Enregistré sur cet appareil.|이 기기에 저장했어요.|Disimpan di perangkat ini.|Сохранено на этом устройстве.|تم الحفظ على هذا الجهاز.
Use the model to help you.|お手本を参考にしましょう。|Usa el modelo como ayuda.|Use o modelo como ajuda.|可以参考范例。|Aidez-vous du modèle.|예문을 참고하세요.|Gunakan contoh sebagai bantuan.|Воспользуйтесь образцом.|استعن بالمثال.
Checkpoints and assessments use Standard mode.|確認テストとレベル診断はスタンダードモードです。|Los controles y las evaluaciones usan el modo Estándar.|Os testes de capítulo e as avaliações usam o modo Padrão.|关卡测试和水平评估使用标准模式。|Les bilans et évaluations utilisent le mode Standard.|체크포인트와 평가는 표준 모드를 사용합니다.|Tes bab dan penilaian menggunakan mode Standar.|Контрольные и оценочные тесты проходят в стандартном режиме.|تستخدم اختبارات المراحل والتقييمات الوضع العادي.
{0} of {1} activities|{1}つ中{0}つの練習|{0} de {1} actividades|{0} de {1} atividades|{0}/{1} 个活动|{0} activités sur {1}|활동 {1}개 중 {0}개|{0} dari {1} aktivitas|{0} из {1} заданий|{0} من {1} أنشطة
`.trim().split('\n').map(r=>r.split('|'));
rows.push(...`
Two ways to learn. Choose your own pace.|2つの学び方。自分のペースで。|Dos formas de aprender. A tu ritmo.|Duas formas de aprender. No seu ritmo.|两种学习方式，按自己的节奏来。|Deux façons d’apprendre, à votre rythme.|두 가지 학습 방식, 나만의 속도로.|Dua cara belajar. Sesuai ritme Anda.|Два способа учиться. В своём темпе.|طريقتان للتعلم، حسب وتيرتك.
Back to Light path|ライトのルートへ戻る|Volver a la ruta Ligera|Voltar à trilha Leve|返回轻松路线|Retour au parcours Léger|라이트 경로로 돌아가기|Kembali ke jalur Ringan|К лёгкому маршруту|العودة إلى المسار الخفيف
Round {0} of {1}|ラウンド {0}/{1}|Ronda {0} de {1}|Rodada {0} de {1}|第 {0}/{1} 轮|Manche {0} sur {1}|라운드 {0}/{1}|Putaran {0} dari {1}|Раунд {0} из {1}|الجولة {0} من {1}
Finish rounds, earn XP and complete your Light path.|ラウンドをクリアしてXPを獲得し、ライトのルートを進めましょう。|Completa rondas, gana XP y termina tu ruta Ligera.|Conclua rodadas, ganhe XP e complete sua trilha Leve.|完成轮次，赚取经验，走完轻松路线。|Terminez des manches, gagnez des XP et achevez votre parcours Léger.|라운드를 완료하고 XP를 모아 라이트 경로를 완주하세요.|Selesaikan putaran, raih XP, dan tuntaskan jalur Ringan.|Завершайте раунды, получайте XP и пройдите лёгкий маршрут.|أكمل الجولات واكسب XP وأنهِ مسارك الخفيف.
Let’s go|さあ、始めよう|Vamos|Vamos lá|开始吧|C’est parti|시작해요|Ayo mulai|Начнём|لنبدأ
Round complete!|ラウンドクリア！|¡Ronda completada!|Rodada concluída!|本轮完成！|Manche terminée !|라운드 완료!|Putaran selesai!|Раунд завершён!|اكتملت الجولة!
Light progress saved|ライトの進み具合を保存しました|Progreso Ligero guardado|Progresso Leve salvo|轻松进度已保存|Progression Légère enregistrée|라이트 진행 상황 저장됨|Progres Ringan tersimpan|Лёгкий прогресс сохранён|تم حفظ التقدم الخفيف
Every round counts on your Light path.|1ラウンドずつ、ライトのルートを進めます。|Cada ronda cuenta en tu ruta Ligera.|Cada rodada conta na sua trilha Leve.|每一轮都推进你的轻松路线。|Chaque manche fait avancer votre parcours Léger.|매 라운드가 라이트 경로의 한 걸음이에요.|Setiap putaran memajukan jalur Ringan Anda.|Каждый раунд продвигает вас по лёгкому маршруту.|كل جولة تُقدّمك في المسار الخفيف.
Next Light round|次のライトラウンドへ|Siguiente ronda Ligera|Próxima rodada Leve|下一轮轻松练习|Manche Légère suivante|다음 라이트 라운드|Putaran Ringan berikutnya|Следующий лёгкий раунд|الجولة الخفيفة التالية
Watch, then choose|見て、選んでみよう|Mira y elige|Assista e escolha|观看后选择|Regardez, puis choisissez|보고 골라 보세요|Tonton, lalu pilih|Посмотрите и выберите|شاهد، ثم اختر
Meet this phrase|このフレーズに出会おう|Conoce esta frase|Conheça esta frase|认识这个短语|Découvrez cette phrase|이 표현을 만나 보세요|Kenali frasa ini|Познакомьтесь с фразой|تعرّف على هذه العبارة
Find the model|お手本を見つけよう|Encuentra el modelo|Encontre o modelo|找出范例|Retrouvez le modèle|예문을 찾아보세요|Temukan contohnya|Найдите образец|ابحث عن المثال
Listen, then say it your way.|聞いて、自分でも言ってみよう。|Escucha y dilo a tu manera.|Ouça e fale do seu jeito.|听一听，再自己说一遍。|Écoutez, puis dites-le à votre façon.|듣고 직접 말해 보세요.|Dengarkan, lalu ucapkan sendiri.|Послушайте и произнесите сами.|استمع، ثم قلها بنفسك.
Got it. Let’s play!|わかった！やってみよう|¡Entendido! ¡A jugar!|Entendi. Vamos jogar!|明白了，开始挑战！|Compris. À vous de jouer !|알겠어요. 해볼까요!|Paham. Ayo bermain!|Понятно. Поиграем!|فهمت. لنلعب!
Tap the word tiles|単語タイルをタップしよう|Toca las fichas|Toque nas palavras|点击词语方块|Touchez les mots|단어 타일을 눌러 보세요|Ketuk ubin kata|Нажимайте на слова|اضغط على مربعات الكلمات
Nice work!|いいね！|¡Muy bien!|Muito bem!|做得好！|Bien joué !|잘했어요!|Bagus sekali!|Отлично!|أحسنت!
No rush. Try once more.|大丈夫。もう一度やってみよう|Sin prisa. Inténtalo otra vez.|Sem pressa. Tente outra vez.|别急，再试一次。|Prenez votre temps. Réessayez.|괜찮아요. 다시 해봐요.|Santai saja. Coba lagi.|Не спешите. Попробуйте ещё раз.|لا تتعجل. حاول مرة أخرى.
{0} in a row!|{0}問連続正解！|¡{0} seguidas!|{0} seguidas!|连续答对 {0} 题！|{0} bonnes réponses de suite !|{0}개 연속 정답!|{0} berturut-turut!|{0} подряд!|{0} إجابات متتالية!
You’ve got this!|その調子！|¡Tú puedes!|Você consegue!|继续加油！|Vous y arrivez !|할 수 있어요!|Anda pasti bisa!|У вас получится!|أنت قادر على ذلك!
Use a hint and give it another go.|ヒントを見て、もう一度やってみよう。|Usa una pista e inténtalo otra vez.|Use uma dica e tente novamente.|看看提示，再试一次。|Aidez-vous d’un indice et réessayez.|힌트를 보고 다시 해봐요.|Gunakan petunjuk dan coba lagi.|Воспользуйтесь подсказкой и попробуйте снова.|استعن بتلميح وحاول مجددًا.
Keep going|次へ進もう|Sigue así|Continue assim|继续前进|Continuez|계속해요|Lanjutkan|Продолжайте|تابع التقدم
Your Light adventure|ライトの冒険|Tu aventura Ligera|Sua aventura Leve|你的轻松冒险|Votre aventure Légère|나의 라이트 모험|Petualangan Ringan Anda|Ваше лёгкое приключение|مغامرتك الخفيفة
A little play. Real progress.|遊ぶように、少しずつ前へ。|Un poco de juego. Progreso real.|Um pouco de jogo. Progresso real.|轻松玩，真进步。|Un peu de jeu. De vrais progrès.|가볍게 즐기며, 꾸준히 성장해요.|Sedikit bermain. Kemajuan nyata.|Немного игры. Настоящий прогресс.|قليل من اللعب، تقدّم حقيقي.
{0} rounds complete|{0}ラウンドクリア|{0} rondas completadas|{0} rodadas concluídas|已完成 {0} 轮|{0} manches terminées|{0}개 라운드 완료|{0} putaran selesai|Завершено раундов: {0}|اكتملت {0} جولات
Light progress|ライトの進み具合|Progreso Ligero|Progresso Leve|轻松进度|Progression Légère|라이트 진행 상황|Progres Ringan|Лёгкий прогресс|التقدم الخفيف
Light level complete!|ライトのレベルクリア！|¡Nivel Ligero completado!|Nível Leve concluído!|轻松等级完成！|Niveau Léger terminé !|라이트 레벨 완료!|Level Ringan selesai!|Лёгкий уровень пройден!|اكتمل المستوى الخفيف!
Keep exploring or replay a favourite round.|次の冒険へ進むか、好きなラウンドをもう一度。|Sigue explorando o repite tu ronda favorita.|Continue explorando ou repita uma rodada favorita.|继续探索，或重玩喜欢的一轮。|Continuez à explorer ou rejouez une manche préférée.|계속 탐험하거나 좋아하는 라운드를 다시 해보세요.|Lanjutkan menjelajah atau ulangi putaran favorit.|Продолжайте исследовать или повторите любимый раунд.|واصل الاستكشاف أو أعد جولتك المفضلة.
Continue Light|ライトを続ける|Continuar Ligero|Continuar Leve|继续轻松学习|Continuer en Léger|라이트 계속하기|Lanjutkan Ringan|Продолжить лёгкий режим|تابع الوضع الخفيف
Light chapter complete|ライトのチャプタークリア|Capítulo Ligero completado|Capítulo Leve concluído|轻松章节完成|Chapitre Léger terminé|라이트 챕터 완료|Bab Ringan selesai|Лёгкая глава завершена|اكتمل الفصل الخفيف
Open Light: {0}|ライトを開く：{0}|Abrir Ligero: {0}|Abrir Leve: {0}|打开轻松学习：{0}|Ouvrir Léger : {0}|라이트 열기: {0}|Buka Ringan: {0}|Открыть лёгкий: {0}|افتح الخفيف: {0}
Light has its own progress. Standard stays available whenever you choose.|ライトは独自の進み具合を記録します。スタンダードにもいつでも切り替えられます。|Ligero tiene su propio progreso. Estándar está disponible cuando quieras.|Leve tem progresso próprio. Padrão continua disponível quando você quiser.|轻松模式有独立进度，随时可选标准模式。|Léger a sa propre progression. Standard reste disponible à tout moment.|라이트는 독립적으로 진행돼요. 표준 모드도 언제든 선택할 수 있어요.|Ringan punya progres sendiri. Standar tetap tersedia kapan saja.|У лёгкого режима свой прогресс. Стандартный доступен в любой момент.|للخفيف تقدّمه الخاص. الوضع العادي متاح متى شئت.
`.trim().split('\n').map(r=>r.split('|')));
rows.push(...`
Choose the matching phrase|意味に合うフレーズを選ぼう|Elige la frase que corresponde|Escolha a frase correspondente|选择意思相符的短语|Choisissez la phrase correspondante|뜻에 맞는 표현을 고르세요|Pilih frasa yang sesuai|Выберите подходящую фразу|اختر العبارة المناسبة
Listen and choose|聞いて選ぼう|Escucha y elige|Ouça e escolha|听后选择|Écoutez et choisissez|듣고 고르세요|Dengarkan dan pilih|Послушайте и выберите|استمع واختر
Listen and build the phrase|聞いてフレーズを組み立てよう|Escucha y forma la frase|Ouça e monte a frase|听后组成短语|Écoutez et construisez la phrase|듣고 문장을 만들어 보세요|Dengarkan dan susun frasa|Послушайте и составьте фразу|استمع وركّب العبارة
Start with: {0}|最初は「{0}」|Empieza con: {0}|Comece com: {0}|以“{0}”开头|Commencez par : {0}|첫 단어: {0}|Mulai dengan: {0}|Начните с: {0}|ابدأ بـ: {0}
Look at the subject and the situation.|主語や場面に注目しましょう。|Fíjate en el sujeto y la situación.|Observe o sujeito e a situação.|注意主语和情境。|Observez le sujet et la situation.|주어와 상황에 주목하세요.|Perhatikan subjek dan situasinya.|Обратите внимание на подлежащее и ситуацию.|انتبه إلى الفاعل والموقف.
Think about the whole meaning, not just one word.|一語だけでなく、全体の意味を考えましょう。|Piensa en el significado completo, no solo en una palabra.|Pense no significado completo, não apenas em uma palavra.|考虑整体意思，而不只是一个词。|Pensez au sens global, pas à un seul mot.|한 단어가 아니라 전체 뜻을 생각해 보세요.|Pikirkan makna keseluruhan, bukan hanya satu kata.|Подумайте об общем смысле, а не об одном слове.|فكّر في المعنى الكامل، لا في كلمة واحدة فقط.
Does this answer fit the recording?|この答えは録音の内容に合っていますか？|¿Esta respuesta coincide con la grabación?|Esta resposta corresponde à gravação?|这个回答符合录音内容吗？|Cette réponse correspond-elle à l’enregistrement ?|이 답이 녹음 내용과 맞나요?|Apakah jawaban ini sesuai dengan rekaman?|Соответствует ли этот ответ записи?|هل تتوافق هذه الإجابة مع التسجيل؟
Does this answer fit the situation?|この答えは場面に合っていますか？|¿Esta respuesta encaja con la situación?|Esta resposta combina com a situação?|这个回答符合情境吗？|Cette réponse convient-elle à la situation ?|이 답이 상황에 맞나요?|Apakah jawaban ini sesuai dengan situasinya?|Подходит ли этот ответ к ситуации?|هل تناسب هذه الإجابة الموقف؟
Fits the recording|録音の内容に合っている|Coincide con la grabación|Corresponde à gravação|符合录音|Correspond à l’enregistrement|녹음 내용과 맞아요|Sesuai dengan rekaman|Соответствует записи|تتوافق مع التسجيل
Does not fit the recording|録音の内容に合っていない|No coincide con la grabación|Não corresponde à gravação|不符合录音|Ne correspond pas à l’enregistrement|녹음 내용과 맞지 않아요|Tidak sesuai dengan rekaman|Не соответствует записи|لا تتوافق مع التسجيل
Fits the situation|場面に合っている|Encaja con la situación|Combina com a situação|符合情境|Convient à la situation|상황에 맞아요|Sesuai dengan situasi|Подходит к ситуации|تناسب الموقف
Does not fit the situation|場面に合っていない|No encaja con la situación|Não combina com a situação|不符合情境|Ne convient pas à la situation|상황에 맞지 않아요|Tidak sesuai dengan situasi|Не подходит к ситуации|لا تناسب الموقف
`.trim().split('\n').map(r=>r.split('|')));
rows.push(...`
Word Town|ことばの街|La ciudad de las palabras|Cidade das palavras|语言小镇|La ville des mots|말의 마을|Kota Kata|Город слов|مدينة الكلمات
Materials|素材|Materiales|Materiais|材料|Matériaux|재료|Bahan|Материалы|مواد
Next decoration|次の装飾|Próximo adorno|Próxima decoração|下一件装饰|Prochaine décoration|다음 장식|Dekorasi berikutnya|Следующее украшение|الزينة التالية
Terrace|テラス席|Terraza|Esplanada|露台|La terrasse|테라스|Teras|Терраса|شرفة
Flower bed|花壇|Parterre|Canteiro de flores|花坛|Parterre de fleurs|화단|Petak bunga|Клумба|حوض زهور
Street lamp|街灯|Farola|Poste de luz|街灯|Réverbère|가로등|Lampu jalan|Фонарь|مصباح شارع
{0} questions · about 2 min|{0}問・約2分|{0} preguntas · unos 2 min|{0} perguntas · cerca de 2 min|{0} 题 · 约 2 分钟|{0} questions · env. 2 min|{0}문제 · 약 2분|{0} soal · sekitar 2 menit|{0} заданий · около 2 мин|{0} أسئلة · نحو دقيقتين
Best combo ×{0}|最大コンボ ×{0}|Mejor racha ×{0}|Melhor sequência ×{0}|最高连击 ×{0}|Meilleur combo ×{0}|최고 콤보 ×{0}|Kombo terbaik ×{0}|Лучшая серия ×{0}|أفضل سلسلة ×{0}
Perfect clear!|パーフェクトクリア！|¡Todo correcto!|Acertou todas!|完美通关！|Sans faute !|완벽 클리어!|Sempurna!|Без ошибок!|إتقان تام!
Review missed questions|間違えた問題を復習|Repasar los errores|Revisar as questões erradas|复习错题|Revoir les erreurs|틀린 문제 복습|Tinjau soal yang salah|Разобрать ошибки|راجع الأسئلة التي أخطأت فيها
First try: {0}/{1} · Hints: {2}|初回正解 {0}/{1}・ヒント {2}|Primer intento: {0}/{1} · Pistas: {2}|Primeira tentativa: {0}/{1} · Dicas: {2}|首次答对 {0}/{1} · 提示 {2}|Premier essai : {0}/{1} · Indices : {2}|첫 시도 정답 {0}/{1} · 힌트 {2}|Percobaan pertama: {0}/{1} · Petunjuk: {2}|С первой попытки: {0}/{1} · Подсказки: {2}|المحاولة الأولى: {0}/{1} · التلميحات: {2}
`.trim().split('\n').map(row=>row.split('|')));
rows.push(
 ['Up next','次はここだよ！','¡Sigue aquí!','É por aqui!','下一站','Par ici !','다음은 여기!','Selanjutnya','Далее сюда!','المحطة التالية'],
 ['Back to town','街に戻る','Volver a la ciudad','Voltar à cidade','返回小镇','Retour en ville','마을로 돌아가기','Kembali ke kota','Вернуться в город','العودة إلى المدينة'],
 ['Combo ×{0}','コンボ ×{0}','Racha ×{0}','Sequência ×{0}','连击 ×{0}','Série ×{0}','콤보 ×{0}','Kombo ×{0}','Серия ×{0}','سلسلة ×{0}']
);
rows.push(...`
Park bench|公園のベンチ|Banco de parque|Banco de jardim|公园长椅|Banc de parc|공원 벤치|Bangku taman|Парковая скамейка|مقعد الحديقة
Stone fountain|石造りの噴水|Fuente de piedra|Fonte de pedra|石雕喷泉|Fontaine en pierre|돌 분수|Air mancur batu|Каменный фонтан|نافورة حجرية
Book kiosk|小さな本屋|Quiosco de libros|Quiosque de livros|书亭|Kiosque à livres|작은 책방|Kios buku|Книжный киоск|كشك كتب
Market stall|市場の屋台|Puesto del mercado|Banca do mercado|市场摊位|Étal du marché|시장 가판대|Lapak pasar|Рыночный прилавок|بسطة السوق
Maple tree|カエデの木|Arce|Bordo|枫树|Érable|단풍나무|Pohon maple|Клён|شجرة القيقب
Town collection|街のコレクション|Colección de la ciudad|Coleção da cidade|小镇收藏|Collection de la ville|마을 컬렉션|Koleksi kota|Коллекция города|مجموعة البلدة
{0} · Edition {1}|{0}・第{1}版|{0} · Edición {1}|{0} · Edição {1}|{0} · 第{1}版|{0} · Édition {1}|{0} · 에디션 {1}|{0} · Edisi {1}|{0} · Выпуск {1}|{0} · الإصدار {1}
`.trim().split('\n').map(row=>row.split('|')));
rows.push(
 ['Place in town','街に飾る','Colocar en la ciudad','Colocar na cidade','摆放到小镇','Placer en ville','마을에 배치','Tempatkan di kota','Разместить в городе','ضعها في البلدة'],
 ['Keep this color','この色を固定','Mantener este color','Manter esta cor','保留此颜色','Garder cette couleur','이 색상 유지','Pertahankan warna ini','Сохранить этот цвет','ثبّت هذا اللون'],
 ['Placed in town','配置中','Colocado en la ciudad','Colocado na cidade','已摆放','Placé en ville','배치됨','Ditempatkan di kota','Размещено в городе','موضوعة في البلدة'],
 ['Could not save town decoration.','装飾の配置を保存できませんでした。','No se pudo guardar la decoración.','Não foi possível salvar a decoração.','无法保存小镇装饰。','Impossible d’enregistrer la décoration.','장식 배치를 저장하지 못했습니다.','Dekorasi tidak dapat disimpan.','Не удалось сохранить украшение.','تعذر حفظ زينة البلدة.']
);
export const lightLearningCopy=Object.fromEntries(rows.map(([source,...values])=>[source,Object.fromEntries(['ja','es','pt','zh','fr','ko','id','ru','ar'].map((l,i)=>[l,values[i]]))]));
