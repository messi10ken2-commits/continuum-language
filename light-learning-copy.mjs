// Source | Japanese | Spanish | Portuguese | Chinese | French | Korean | Indonesian | Russian | Arabic
const rows=`
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
export const lightLearningCopy=Object.fromEntries(rows.map(([source,...values])=>[source,Object.fromEntries(['ja','es','pt','zh','fr','ko','id','ru','ar'].map((l,i)=>[l,values[i]]))]));
