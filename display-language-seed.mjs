// Editorial terminology for the four additional interface languages.
// Columns: source | Korean | Indonesian | Russian | Modern Standard Arabic.
const rows=`
Contact the Continuum team and check your replies.|Continuum 팀에 문의하고 답변을 확인하세요.|Hubungi tim Continuum dan lihat balasannya.|Свяжитесь с командой Continuum и проверьте ответы.|تواصل مع فريق Continuum وتابع الردود.
Open Support|고객지원 열기|Buka bantuan|Открыть поддержку|فتح الدعم
View lesson history|학습 이력 보기|Lihat riwayat pelajaran|Посмотреть историю занятий|عرض سجل الدروس
Learning tools|학습 도구|Alat belajar|Инструменты обучения|أدوات التعلّم
Review your learning history and recurring patterns.|학습 기록과 반복되는 어려움을 확인하세요.|Tinjau riwayat belajar dan kesulitan yang berulang.|Просмотрите историю обучения и повторяющиеся трудности.|راجع سجل تعلّمك والصعوبات المتكررة.
Check your level and see your skill report.|현재 레벨과 영역별 결과를 확인하세요.|Periksa level dan laporan keterampilan Anda.|Определите свой уровень и просмотрите отчёт по навыкам.|تحقّق من مستواك واطّلع على تقرير مهاراتك.

Your learning preferences, membership and privacy, in one place.|학습 설정, 멤버십, 개인정보 보호를 한곳에서 관리하세요.|Kelola preferensi belajar, keanggotaan, dan privasi Anda di satu tempat.|Управляйте настройками обучения, подпиской и конфиденциальностью в одном месте.|إعدادات التعلّم والعضوية والخصوصية، كلّها في مكان واحد.
Warm lights across your neighbourhood|마을 곳곳에 따뜻한 불빛이 켜졌어요|Cahaya hangat menerangi lingkungan Anda|Ваш район озарился тёплым светом|أضواء دافئة تنير حيّك
The station is restored|역이 새 단장을 마쳤어요|Stasiun sudah dipugar|Станция восстановлена|اكتمل ترميم المحطة
The café is open|카페가 문을 열었어요|Kafe sudah buka|Кафе открыто|افتُتح المقهى
The neighbourhood is blooming|마을에 꽃이 피었어요|Lingkungan mulai bermekaran|Район расцветает|ازدهر الحيّ
A world that grows with you|함께 성장하는 세계|Dunia yang tumbuh bersama Anda|Мир, который растёт вместе с вами|عالم ينمو معك
10 min a day|하루 10분|10 menit sehari|10 мин. в день|10 دقائق يوميًا
5 min a day|하루 5분|5 menit sehari|5 мин. в день|5 دقائق يوميًا
15 min a day|하루 15분|15 menit sehari|15 мин. в день|15 دقيقة يوميًا
20 min a day|하루 20분|20 menit sehari|20 мин. в день|20 دقيقة يوميًا
30 min a day|하루 30분|30 menit sehari|30 мин. в день|30 دقيقة يوميًا
Replay world restoration|마을 변화 다시 보기|Putar ulang pemulihan dunia|Повторить восстановление мира|إعادة عرض استعادة العالم
Pause map motion|지도 움직임 일시 정지|Jeda gerakan peta|Приостановить анимацию карты|إيقاف حركة الخريطة مؤقتًا
Resume map motion|지도 움직임 재개|Lanjutkan gerakan peta|Продолжить анимацию карты|استئناف حركة الخريطة
Drag to explore|드래그해서 둘러보기|Geser untuk menjelajah|Перетаскивайте, чтобы исследовать|اسحب للاستكشاف

Overview|홈|Ringkasan|Обзор|نظرة عامة
Learn|학습|Belajar|Обучение|تعلّم
Practice|연습|Latihan|Практика|تدرّب
Practise|연습하기|Berlatih|Практиковаться|تدرّب
Classes|수업|Kelas|Занятия|الدروس
My classes|내 수업|Kelas saya|Мои занятия|دروسي
Account|계정|Akun|Аккаунт|الحساب
Your account|내 계정|Akun Anda|Ваш аккаунт|حسابك
Settings|설정|Pengaturan|Настройки|الإعدادات
Display language|표시 언어|Bahasa tampilan|Язык интерфейса|لغة الواجهة
World style|화면 스타일|Gaya tampilan|Стиль оформления|نمط العرض
Illustrated world|일러스트 세계|Dunia ilustrasi|Иллюстрированный мир|عالم مرسوم
Real photography|실제 사진|Foto nyata|Фотографии|صور حقيقية
Photo|사진|Foto|Фото|صور
Illustrated|일러스트|Ilustrasi|Иллюстрации|رسوم
Continue|계속|Lanjutkan|Продолжить|متابعة
Back|뒤로|Kembali|Назад|رجوع
Next|다음|Berikutnya|Далее|التالي
Start|시작|Mulai|Начать|ابدأ
Save|저장|Simpan|Сохранить|حفظ
Saving…|저장 중…|Menyimpan…|Сохранение…|جارٍ الحفظ…
Cancel|취소|Batal|Отмена|إلغاء
Close|닫기|Tutup|Закрыть|إغلاق
Try again|다시 시도|Coba lagi|Попробовать снова|حاول مجددًا
Loading…|불러오는 중…|Memuat…|Загрузка…|جارٍ التحميل…
Sign in|로그인|Masuk|Войти|تسجيل الدخول
Sign out|로그아웃|Keluar|Выйти|تسجيل الخروج
Create account|계정 만들기|Buat akun|Создать аккаунт|إنشاء حساب
Email|이메일|Email|Электронная почта|البريد الإلكتروني
Password|비밀번호|Kata sandi|Пароль|كلمة المرور
Name|이름|Nama|Имя|الاسم
Learner|학습자|Pelajar|Учащийся|متعلّم
Teacher|선생님|Pengajar|Преподаватель|مدرّس
Learner account|학습자 계정|Akun pelajar|Аккаунт учащегося|حساب متعلّم
Teacher account|선생님 계정|Akun pengajar|Аккаунт преподавателя|حساب مدرّس
Learning language|학습 언어|Bahasa yang dipelajari|Изучаемый язык|لغة التعلّم
English|영어|Bahasa Inggris|Английский|الإنجليزية
Japanese|일본어|Bahasa Jepang|Японский|اليابانية
Spanish|스페인어|Bahasa Spanyol|Испанский|الإسبانية
Portuguese (Brazil)|포르투갈어(브라질)|Bahasa Portugis (Brasil)|Португальский (Бразилия)|البرتغالية (البرازيل)
Learning memory|학습 기록|Riwayat belajar|История обучения|سجل التعلّم
Your daily study goal|하루 학습 목표|Target belajar harian Anda|Ваша ежедневная цель|هدفك اليومي للتعلّم
Choose the language for menus and explanations. Your learning language stays the same.|메뉴와 설명에 사용할 언어를 선택하세요. 학습 언어는 바뀌지 않아요.|Pilih bahasa untuk menu dan penjelasan. Bahasa yang Anda pelajari tidak berubah.|Выберите язык меню и объяснений. Изучаемый язык останется прежним.|اختر لغة القوائم والشروحات. لن تتغيّر اللغة التي تتعلّمها.
Switch your layout anytime. Your learning progress stays the same.|화면 스타일은 언제든 바꿀 수 있어요. 학습 진도는 그대로 유지돼요.|Ubah tampilan kapan saja. Kemajuan belajar Anda tetap tersimpan.|Оформление можно изменить в любой момент. Ваш прогресс сохранится.|يمكنك تغيير نمط العرض في أي وقت. سيبقى تقدّمك في التعلّم محفوظًا.
Sharing & privacy|공유 및 개인정보 보호|Berbagi & privasi|Общий доступ и конфиденциальность|المشاركة والخصوصية
Choose what teachers can see|선생님에게 공유할 정보 선택|Pilih informasi yang dapat dilihat pengajar|Выберите, что видят преподаватели|اختر ما يمكن للمدرّسين الاطّلاع عليه
Share self-study activity|자기주도 학습 기록 공유|Bagikan aktivitas belajar mandiri|Делиться результатами самостоятельного обучения|مشاركة نشاط التعلّم الذاتي
Membership|멤버십|Keanggotaan|Подписка|العضوية
View subscription options|구독 옵션 보기|Lihat pilihan langganan|Посмотреть варианты подписки|عرض خيارات الاشتراك
Trial lesson|체험 수업|Kelas percobaan|Пробное занятие|درس تجريبي
Regular lesson|일반 수업|Kelas reguler|Обычное занятие|درس عادي
Lesson type|수업 유형|Jenis kelas|Тип занятия|نوع الدرس
Duration in minutes|수업 시간(분)|Durasi dalam menit|Продолжительность в минутах|المدة بالدقائق
Book an available slot|가능한 시간 예약|Pesan waktu yang tersedia|Забронировать свободное время|حجز موعد متاح
minutes|분|menit|мин.|دقائق
Completed|완료|Selesai|Завершено|مكتمل
completed|완료|selesai|завершено|مكتمل
Listening|듣기|Menyimak|Аудирование|الاستماع
Speaking|말하기|Berbicara|Говорение|التحدّث
Reading|읽기|Membaca|Чтение|القراءة
Writing|쓰기|Menulis|Письмо|الكتابة
Grammar|문법|Tata bahasa|Грамматика|القواعد
Vocabulary|어휘|Kosakata|Лексика|المفردات
Pronunciation|발음|Pelafalan|Произношение|النطق
Level test|레벨 진단|Tes level|Определение уровня|اختبار تحديد المستوى
Check answer|정답 확인|Periksa jawaban|Проверить ответ|تحقّق من الإجابة
Correct answer:|정답:|Jawaban benar:|Правильный ответ:|الإجابة الصحيحة:
Teachers are on their way|선생님 프로필을 준비하고 있어요|Profil pengajar akan segera tersedia|Профили преподавателей скоро появятся|ستتوفر ملفات المدرّسين قريبًا
Your level, tested.|지금 내 언어 실력 알아보기|Ketahui level Anda saat ini|Определите свой текущий уровень|تعرّف على مستواك الحالي
Recurring patterns|반복되는 어려움|Kesulitan yang berulang|Повторяющиеся трудности|الصعوبات المتكررة
From class to practice|수업에서 연습으로|Dari kelas ke latihan|От занятия к практике|من الدرس إلى التدريب
`;
export const displayLanguageSeed=Object.fromEntries(rows.trim().split('\n').filter(Boolean).map(row=>{const [source,...values]=row.split('|');if(values.length!==4)throw Error('Invalid display-language seed');return [source,Object.fromEntries(['ko','id','ru','ar'].map((l,i)=>[l,values[i]]))]}));
