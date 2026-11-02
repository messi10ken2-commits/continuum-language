// Offline interface copy for the app redesign, in every display language.
const rows=[
 ['Continue learning','学習を続ける','Continuar aprendiendo','Continuar aprendendo','继续学习','Continuer à apprendre','학습 계속','Lanjutkan belajar','Продолжить обучение','متابعة التعلم'],
 ['Start talking','話し始める','Empezar a hablar','Começar a falar','开始对话','Commencer à parler','대화 시작','Mulai berbicara','Начать разговор','ابدأ التحدث'],
 ['Your course progress','コースの進捗','Tu progreso en el curso','Seu progresso no curso','你的课程进度','Votre progression dans le cours','코스 진행 상황','Progres kursus Anda','Ваш прогресс в курсе','تقدمك في الدورة'],
 ['Your learning profile','学習プロフィール','Tu perfil de aprendizaje','Seu perfil de aprendizagem','你的学习档案','Votre profil d’apprentissage','학습 프로필','Profil belajar Anda','Ваш учебный профиль','ملفك التعليمي'],
 ['Listen, record and compare.','聞いて、録音して、比べましょう。','Escucha, graba y compara.','Ouça, grave e compare.','听一听，录下来，再比较。','Écoutez, enregistrez et comparez.','듣고, 녹음하고, 비교해 보세요.','Dengarkan, rekam, dan bandingkan.','Слушайте, записывайте и сравнивайте.','استمع وسجّل وقارن.']
];
const locales=['ja','es','pt','zh','fr','ko','id','ru','ar'];
export const redesignCopy=Object.fromEntries(rows.map(([key,...values])=>[key,Object.fromEntries(locales.map((locale,i)=>[locale,values[i]]))]));
