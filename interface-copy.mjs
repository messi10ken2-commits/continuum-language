// Reviewed first-visit and everyday navigation copy. English is the source key.
// Columns: English | Japanese | Spanish | Portuguese | Simplified Chinese | French.
const rows=`
I’ll choose my level|自分でレベルを選ぶ|Elegiré mi nivel|Vou escolher meu nível|自行选择水平|Je choisis mon niveau
Help me find my level with an assessment|レベル診断で開始レベルを決める|Ayúdame a encontrar mi nivel con una prueba|Quero descobrir meu nível com um teste|通过测试确定水平|Déterminer mon niveau avec un test
Starting course level|開始するコースのレベル|Nivel inicial del curso|Nível inicial do curso|课程起始水平|Niveau de départ du cours
This is your choice, not an assessed CEFR result. You can change it in Learn.|ここで選ぶのは自己申告の開始レベルです。CEFRの診断結果ではありません。「学ぶ」で変更できます。|Es tu elección, no un resultado evaluado del MCER. Puedes cambiarla en Aprender.|É sua escolha, não um resultado avaliado do CEFR. Você pode alterá-la em Aprender.|这是你自行选择的起点，并非CEFR测评结果。可在“学习”中更改。|Il s’agit de votre choix, pas d’un résultat évalué du CECR. Vous pouvez le modifier dans Apprendre.
YOUR TEACHING PROFILE|教師プロフィール|TU PERFIL DOCENTE|SEU PERFIL DE PROFESSOR|你的教师档案|VOTRE PROFIL ENSEIGNANT
Help learners get to know you|あなたのことを生徒に伝えよう|Date a conocer a los estudiantes|Apresente-se aos alunos|让学员了解你|Présentez-vous aux élèves
Complete your public introduction and submit it for a human review. Saving changes hides your profile until it is submitted and approved again.|公開用プロフィールを入力して審査に提出してください。変更を保存すると、再提出・承認まで非公開になります。|Completa tu presentación y envíala a revisión. Al guardar cambios, el perfil se oculta hasta su nueva aprobación.|Complete sua apresentação e envie para análise. Ao salvar mudanças, o perfil fica oculto até ser aprovado novamente.|填写公开介绍并提交人工审核。保存修改后，档案将暂时隐藏，直至重新提交并获批。|Complétez votre présentation et soumettez-la à une vérification. Toute modification masque le profil jusqu’à sa nouvelle approbation.
Profile photo|プロフィール写真|Foto de perfil|Foto de perfil|头像|Photo de profil
A clear photo of you, with your face visible.|顔がはっきり見える写真を選んでください。|Una foto clara en la que se vea tu cara.|Uma foto nítida com seu rosto visível.|请上传面部清晰可见的照片。|Une photo nette sur laquelle votre visage est visible.
Profile headline|プロフィールの見出し|Título del perfil|Título do perfil|档案标题|Titre du profil
Introduce yourself and your specialities|自己紹介と得意分野|Preséntate y describe tus especialidades|Apresente-se e descreva suas especialidades|自我介绍与专长|Présentez-vous et vos spécialités
Teaching experience|指導経験|Experiencia docente|Experiência de ensino|教学经验|Expérience d’enseignement
Your lesson approach and who you teach|授業の進め方と対象の生徒|Tu metodología y a quién enseñas|Sua abordagem e para quem ensina|教学方式及适合的学员|Votre méthode et votre public
Education and teaching qualifications|学歴・指導資格|Formación y titulaciones docentes|Formação e qualificações para ensino|教育背景及教学资格|Formation et qualifications pédagogiques
Languages you speak and your proficiency|話せる言語とそのレベル|Idiomas que hablas y tu nivel|Idiomas que fala e seus níveis|掌握的语言及水平|Langues parlées et niveaux
Time zone (for example Asia/Kuala_Lumpur)|タイムゾーン（例：Asia/Kuala_Lumpur）|Zona horaria (por ejemplo Asia/Kuala_Lumpur)|Fuso horário (por exemplo Asia/Kuala_Lumpur)|时区（例如 Asia/Kuala_Lumpur）|Fuseau horaire (par exemple Asia/Kuala_Lumpur)
Introduction video — YouTube or Vimeo HTTPS link|自己紹介動画（YouTubeまたはVimeoのHTTPSリンク）|Vídeo de presentación: enlace HTTPS de YouTube o Vimeo|Vídeo de apresentação: link HTTPS do YouTube ou Vimeo|自我介绍视频：YouTube或Vimeo的HTTPS链接|Vidéo de présentation : lien HTTPS YouTube ou Vimeo
Private notes for the review team (optional)|審査担当者への非公開メモ（任意）|Notas privadas para el equipo de revisión (opcional)|Notas privadas para a equipe de análise (opcional)|审核团队专用备注（可选）|Notes privées pour l’équipe de vérification (facultatif)
Submit for review|審査に提出|Enviar a revisión|Enviar para análise|提交审核|Soumettre à la vérification
Save draft|下書きを保存|Guardar borrador|Salvar rascunho|保存草稿|Enregistrer le brouillon
Back to account|アカウントに戻る|Volver a la cuenta|Voltar à conta|返回账号|Retour au compte
At least|最低|Al menos|Pelo menos|至少|Au moins
characters ·|文字・|caracteres ·|caracteres ·|字符 ·|caractères ·
You’ll go straight to the placement test for|この言語のレベル診断に進みます：|Irás directamente a la prueba de nivel de|Você irá direto para o teste de nível de|将直接进入以下语言的水平测试：|Vous passerez directement au test de niveau de
. You can pause and return later.|。途中で中断して、後から再開することもできます。|. Puedes pausar y volver más tarde.|. Você pode pausar e voltar depois.|。可以暂停并稍后继续。|. Vous pouvez faire une pause et reprendre plus tard.
Open review →|復習を開く →|Abrir repaso →|Abrir revisão →|打开复习 →|Ouvrir la révision →
Your practice and class notes are saved to your account.|練習の結果と授業ノートはアカウントに保存されます。|Tus prácticas y notas de clase se guardan en tu cuenta.|Suas práticas e notas de aula ficam salvas na sua conta.|练习和课堂笔记保存在你的账号中。|Vos exercices et notes de cours sont enregistrés dans votre compte.

Display language|表示・説明の言語|Idioma de la interfaz|Idioma da interface|界面语言|Langue d’affichage
Choose the language for menus and explanations. Your learning language stays the same.|メニューや説明を読む言語です。学習する言語は変わりません。|Elige el idioma de los menús y las explicaciones. Tu idioma de aprendizaje no cambia.|Escolha o idioma dos menus e das explicações. O idioma que você estuda não muda.|选择菜单和说明的语言。你学习的语言不会改变。|Choisissez la langue des menus et des explications. La langue étudiée ne change pas.
WELCOME TO CONTINUUM|Continuumへようこそ|TE DAMOS LA BIENVENIDA A CONTINUUM|BOAS-VINDAS AO CONTINUUM|欢迎来到 CONTINUUM|BIENVENUE SUR CONTINUUM
One journey.|ひとつにつながる学び。|Un solo camino.|Uma só jornada.|一段学习旅程。|Un seul parcours.
Every way you learn.|あなたに合った、いろいろな学び方。|Todas tus formas de aprender.|Todas as suas formas de aprender.|多种学习方式。|Toutes vos façons d’apprendre.
Connect independent practice with a teacher who understands your progress.|自主学習と、あなたの進歩を理解する先生との授業をつなげましょう。|Conecta tu práctica autónoma con un profesor que comprenda tu progreso.|Conecte o estudo independente a um professor que entende seu progresso.|将自主练习与了解你学习进度的老师的课程连接起来。|Reliez votre pratique autonome aux cours d’un professeur qui comprend vos progrès.
I want to learn|学びたい|Quiero aprender|Quero aprender|我想学习|Je veux apprendre
I want to teach|教えたい|Quiero enseñar|Quero ensinar|我想教学|Je veux enseigner
Choose a language, find your starting point and build your learning memory.|学ぶ言語と開始レベルを選び、学習の記録を積み重ねましょう。|Elige un idioma y tu punto de partida, y construye tu historial de aprendizaje.|Escolha um idioma e seu ponto de partida e construa seu histórico de aprendizagem.|选择语言和起点，积累你的学习记录。|Choisissez une langue et votre point de départ, puis construisez votre historique d’apprentissage.
Create your teaching profile and submit it for review before joining the directory.|教師プロフィールを作成して審査に提出しましょう。承認後に一覧へ公開されます。|Crea tu perfil docente y envíalo a revisión antes de aparecer en el directorio.|Crie seu perfil de professor e envie-o para análise antes de aparecer no catálogo.|创建教师档案并提交审核，通过后即可展示在教师列表中。|Créez votre profil enseignant et soumettez-le à une vérification avant sa publication.
Start learning|学習を始める|Empezar a aprender|Começar a aprender|开始学习|Commencer à apprendre
Create a teacher profile|教師プロフィールを作成|Crear perfil docente|Criar perfil de professor|创建教师档案|Créer un profil enseignant
Already a member? Sign in|アカウントをお持ちの方：ログイン|¿Ya tienes cuenta? Inicia sesión|Já tem conta? Entrar|已有账号？登录|Déjà inscrit ? Se connecter
← Back to welcome|← Welcome画面に戻る|← Volver a la bienvenida|← Voltar ao início|← 返回欢迎页|← Retour à l’accueil
Connecting to your account…|アカウントに接続しています…|Conectando con tu cuenta…|Conectando à sua conta…|正在连接你的账号…|Connexion à votre compte…
ONE CONTINUOUS LEARNER RECORD|学びをつなぐ、ひとつの記録|UN HISTORIAL DE APRENDIZAJE CONTINUO|UM HISTÓRICO CONTÍNUO DE APRENDIZAGEM|连贯的学习记录|UN HISTORIQUE D’APPRENTISSAGE CONTINU
Your account|アカウント|Tu cuenta|Sua conta|你的账号|Votre compte
Keep your progress across devices|どの端末からも学習を続けよう|Conserva tu progreso en todos tus dispositivos|Mantenha seu progresso em todos os dispositivos|在不同设备上继续学习|Retrouvez vos progrès sur tous vos appareils
Create a free learner account or sign in to save your practice securely.|無料アカウントを作成するか、ログインして学習を始めましょう。|Crea una cuenta gratuita o inicia sesión para guardar tus prácticas.|Crie uma conta gratuita ou entre para salvar suas práticas.|创建免费账号或登录，即可保存练习记录。|Créez un compte gratuit ou connectez-vous pour sauvegarder vos exercices.
Sign in|ログイン|Iniciar sesión|Entrar|登录|Se connecter
Create account|アカウントを作成|Crear cuenta|Criar conta|创建账号|Créer un compte
Sign out|ログアウト|Cerrar sesión|Sair|退出登录|Se déconnecter
I’m signing up as|アカウントの種類|Me registro como|Estou me cadastrando como|注册身份|Je m’inscris en tant que
Learner|学習者|Estudiante|Aluno|学员|Élève
Teacher|教師|Profesor|Professor|教师|Professeur
Name|名前|Nombre|Nome|姓名|Nom
Email|メールアドレス|Correo electrónico|E-mail|电子邮箱|E-mail
Password|パスワード|Contraseña|Senha|密码|Mot de passe
(12 characters minimum)|（12文字以上）|(mínimo 12 caracteres)|(mínimo de 12 caracteres)|（至少12个字符）|(12 caractères minimum)
I confirm I am 18 or older.|18歳以上であることを確認します。|Confirmo que tengo 18 años o más.|Confirmo que tenho 18 anos ou mais.|我确认已年满18岁。|Je confirme avoir 18 ans ou plus.
Please wait…|お待ちください…|Espera…|Aguarde…|请稍候…|Veuillez patienter…
Passwords are stored as salted hashes. Email verification and password reset are not available in this early preview.|パスワードは安全なハッシュ形式で保存されます。試用版ではメール認証とパスワード再設定はまだ利用できません。|Las contraseñas se guardan como hashes con sal. Esta versión de prueba aún no incluye verificación de correo ni restablecimiento de contraseña.|As senhas são armazenadas como hashes com salt. A verificação de e-mail e a redefinição de senha ainda não estão disponíveis nesta versão de teste.|密码以加盐哈希形式保存。此试用版暂不支持邮箱验证和密码重置。|Les mots de passe sont stockés sous forme de hachages salés. Cette version d’essai ne propose pas encore la vérification d’e-mail ni la réinitialisation du mot de passe.
Email or password is incorrect|メールアドレスまたはパスワードが違います|El correo o la contraseña no son correctos|E-mail ou senha incorretos|邮箱或密码错误|E-mail ou mot de passe incorrect
An account already uses this email|このメールアドレスは登録済みです|Ya existe una cuenta con este correo|Já existe uma conta com este e-mail|此邮箱已被注册|Un compte utilise déjà cet e-mail
Enter a valid name, email, 12+ character password, and confirm you are 18 or older|名前・メールアドレス・12文字以上のパスワードを入力し、18歳以上であることを確認してください|Introduce un nombre, correo y contraseña de al menos 12 caracteres y confirma que eres mayor de edad|Informe nome, e-mail e senha de pelo menos 12 caracteres e confirme que tem 18 anos ou mais|请输入有效姓名、邮箱和至少12位密码，并确认已满18岁|Saisissez un nom, un e-mail et un mot de passe d’au moins 12 caractères et confirmez avoir 18 ans ou plus
Overview|ホーム|Inicio|Visão geral|首页|Vue d’ensemble
Learn|学ぶ|Aprender|Aprender|学习|Apprendre
Level test|レベル診断|Prueba de nivel|Teste de nível|水平测试|Test de niveau
My classes|授業|Mis clases|Minhas aulas|我的课程|Mes cours
Classes|授業|Clases|Aulas|课程|Cours
Learning memory|学習の記録|Historial de aprendizaje|Histórico de aprendizagem|学习记录|Historique d’apprentissage
Memory|学習記録|Historial|Histórico|学习记录|Historique
Account|アカウント|Cuenta|Conta|账号|Compte
Admin|管理|Administración|Administração|管理|Administration
Assignments|課題|Tareas|Tarefas|作业|Devoirs
Class notes|授業ノート|Notas de clase|Notas de aula|课堂笔记|Notes de cours
Notes|ノート|Notas|Notas|笔记|Notes
Learner account|学習者アカウント|Cuenta de estudiante|Conta de aluno|学员账号|Compte élève
Teacher account|教師アカウント|Cuenta de profesor|Conta de professor|教师账号|Compte enseignant
Your saved learning record|保存された学習の記録|Tu historial de aprendizaje guardado|Seu histórico de aprendizagem salvo|已保存的学习记录|Votre historique d’apprentissage
Your record is saved|学習記録は保存されています|Tu historial está guardado|Seu histórico está salvo|学习记录已保存|Votre historique est sauvegardé
Practice follows your account. Share access only with teachers you choose.|学習記録はアカウントに保存されます。選んだ先生だけに共有できます。|Las prácticas se guardan en tu cuenta. Compártelas solo con los profesores que elijas.|As práticas ficam na sua conta. Compartilhe apenas com os professores que escolher.|练习记录保存在账号中，只与指定的老师共享。|Vos exercices sont liés à votre compte. Partagez-les uniquement avec les professeurs de votre choix.
Learning language|学習する言語|Idioma que estudias|Idioma que você estuda|学习语言|Langue étudiée
English|英語|Inglés|Inglês|英语|Anglais
Japanese|日本語|Japonés|Japonês|日语|Japonais
Spanish|スペイン語|Español|Espanhol|西班牙语|Espagnol
Portuguese (Brazil)|ポルトガル語（ブラジル）|Portugués (Brasil)|Português (Brasil)|葡萄牙语（巴西）|Portugais (Brésil)
YOUR STARTING POINT|学習のスタート地点|TU PUNTO DE PARTIDA|SEU PONTO DE PARTIDA|你的学习起点|VOTRE POINT DE DÉPART
Make this journey yours|あなたに合った学び方を選ぼう|Haz tuyo este camino|Personalize sua jornada|定制你的学习旅程|Personnalisez votre parcours
A short setup, then you can start. You can switch learning languages at any time.|簡単な設定で始められます。学習する言語はいつでも切り替えられます。|Configura lo básico y empieza. Puedes cambiar de idioma en cualquier momento.|Faça uma configuração rápida e comece. Você pode trocar o idioma de estudo a qualquer momento.|完成简单设置即可开始，随时可以切换学习语言。|Une configuration rapide, puis vous pouvez commencer. Vous pourrez changer de langue étudiée à tout moment.
Display name|表示名|Nombre visible|Nome de exibição|显示名称|Nom affiché
Languages|言語|Idiomas|Idiomas|语言|Langues
Start with|最初に学ぶ言語|Empezar con|Começar com|首先学习|Commencer par
What would you like to achieve? (optional)|学習の目標（任意）|¿Qué te gustaría lograr? (opcional)|O que deseja alcançar? (opcional)|学习目标（可选）|Quel est votre objectif ? (facultatif)
Choose your starting point|開始レベルを選ぶ|Elige tu punto de partida|Escolha seu ponto de partida|选择起点|Choisissez votre point de départ
Choose my level|自分でレベルを選ぶ|Elegir mi nivel|Escolher meu nível|自行选择水平|Choisir mon niveau
Take a placement test|レベル診断を受ける|Hacer una prueba de nivel|Fazer um teste de nível|参加水平测试|Passer un test de niveau
Starting level|開始レベル|Nivel inicial|Nível inicial|起始水平|Niveau de départ
Save & start learning|保存して学習を始める|Guardar y empezar|Salvar e começar|保存并开始学习|Enregistrer et commencer
Save & take placement test|保存してレベル診断へ|Guardar e ir a la prueba|Salvar e fazer o teste|保存并参加测试|Enregistrer et passer le test
Edit learning profile|学習プロフィールを編集|Editar perfil de aprendizaje|Editar perfil de aprendizagem|编辑学习档案|Modifier le profil d’apprentissage
Edit teaching profile|教師プロフィールを編集|Editar perfil docente|Editar perfil de professor|编辑教师档案|Modifier le profil enseignant
Loading your profile…|プロフィールを読み込み中…|Cargando tu perfil…|Carregando seu perfil…|正在加载档案…|Chargement de votre profil…
Save|保存|Guardar|Salvar|保存|Enregistrer
Saving…|保存中…|Guardando…|Salvando…|正在保存…|Enregistrement…
Saved|保存しました|Guardado|Salvo|已保存|Enregistré
Could not save. Please try again.|保存できませんでした。もう一度お試しください。|No se pudo guardar. Inténtalo de nuevo.|Não foi possível salvar. Tente novamente.|保存失败，请重试。|Impossible d’enregistrer. Réessayez.
Cancel|キャンセル|Cancelar|Cancelar|取消|Annuler
Continue|次へ|Continuar|Continuar|继续|Continuer
Try again|もう一度試す|Intentar de nuevo|Tentar novamente|重试|Réessayer
Start|開始|Empezar|Começar|开始|Commencer
Review|復習|Repasar|Revisar|复习|Réviser
Resume|続きから|Reanudar|Retomar|继续|Reprendre
Start lesson|レッスンを始める|Empezar lección|Começar lição|开始课程|Commencer la leçon
Resume lesson|レッスンの続きから|Reanudar lección|Retomar lição|继续课程|Reprendre la leçon
Review lesson|レッスンを復習|Repasar lección|Revisar lição|复习课程|Réviser la leçon
Start practice|練習を始める|Empezar práctica|Começar prática|开始练习|Commencer l’exercice
Back to learning path|学習一覧に戻る|Volver al recorrido|Voltar ao percurso|返回学习路线|Retour au parcours
Save & exit|保存して戻る|Guardar y salir|Salvar e sair|保存并退出|Enregistrer et quitter
Check answer|答えを確認|Comprobar respuesta|Conferir resposta|检查答案|Vérifier la réponse
Your answer|あなたの答え|Tu respuesta|Sua resposta|你的答案|Votre réponse
Your answer:|あなたの答え：|Tu respuesta:|Sua resposta:|你的答案：|Votre réponse :
Correct answer:|正解：|Respuesta correcta:|Resposta correta:|正确答案：|Bonne réponse :
That’s right.|正解です。|Correcto.|Está certo.|回答正确。|C’est exact.
Let’s take another look.|もう一度確認してみよう。|Vamos a revisarlo.|Vamos conferir novamente.|再看一遍吧。|Regardons à nouveau.
Try this question again|この問題にもう一度挑戦|Reintentar esta pregunta|Tentar esta questão novamente|再试一次这道题|Réessayer cette question
Finish & save|終了して保存|Terminar y guardar|Concluir e salvar|完成并保存|Terminer et enregistrer
Listen|聞く|Escuchar|Ouvir|播放音频|Écouter
Show transcript|スクリプトを表示|Mostrar transcripción|Mostrar transcrição|显示文本|Afficher la transcription
Review the lesson explanation|レッスンの説明を確認|Revisar la explicación|Rever a explicação|查看课程说明|Relire l’explication
Progress saves after Continue. The current question can be repeated when you return.|「次へ」を押すと進捗が保存されます。再開時に同じ問題が表示されることがあります。|El progreso se guarda al continuar. La pregunta actual puede repetirse al volver.|O progresso é salvo ao continuar. A questão atual pode se repetir ao voltar.|点击“继续”后保存进度。返回时可能会再次显示当前题目。|La progression est sauvegardée après « Continuer ». La question actuelle peut se répéter à votre retour.
Grammar|文法|Gramática|Gramática|语法|Grammaire
Vocabulary|単語|Vocabulario|Vocabulário|词汇|Vocabulaire
Expressions|表現|Expresiones|Expressões|表达|Expressions
Listening|リスニング|Comprensión auditiva|Compreensão oral|听力|Compréhension orale
Speaking|スピーキング|Expresión oral|Expressão oral|口语|Expression orale
Reading|リーディング|Lectura|Leitura|阅读|Lecture
Writing|ライティング|Escritura|Escrita|写作|Écriture
Pronunciation|発音|Pronunciación|Pronúncia|发音|Prononciation
Checkpoint|チェックポイント|Control|Revisão|阶段测试|Bilan
Chapter checkpoint|チャプターの確認テスト|Control del capítulo|Revisão do capítulo|章节测试|Bilan du chapitre
Your course roadmap|学習のロードマップ|Tu recorrido de aprendizaje|Seu percurso de aprendizagem|你的学习路线|Votre parcours d’apprentissage
A little practice. A bigger world.|少しずつ学んで、世界を広げよう。|Un poco de práctica. Un mundo más grande.|Um pouco de prática. Um mundo maior.|每天练一点，世界更广阔。|Un peu de pratique. Un monde plus vaste.
Explore the whole path, choose a chapter and keep moving.|チャプターを選んで、自分のペースで進めましょう。|Explora el recorrido, elige un capítulo y sigue avanzando.|Explore o percurso, escolha um capítulo e siga em frente.|选择章节，按自己的节奏前进。|Explorez le parcours, choisissez un chapitre et avancez à votre rythme.
How the form works|形と使い方|Cómo funciona la forma|Como funciona a forma|形式与用法|Comment se construit la forme
BUILD THE RULE|ルールを理解する|CONSTRUYE LA REGLA|ENTENDA A REGRA|理解规则|COMPRENDRE LA RÈGLE
Watch out for this|ここに注意|Ten cuidado con esto|Atenção a isto|注意这一点|Attention à ce point
See the meaning in context|文脈で意味を確認|Observa el significado en contexto|Veja o significado no contexto|在语境中理解含义|Comprendre le sens en contexte
EXAMPLE|例文|EJEMPLO|EXEMPLO|例句|EXEMPLE
Your vocabulary toolkit|使える単語を増やそう|Tu vocabulario práctico|Seu vocabulário prático|实用词汇|Votre vocabulaire pratique
Your expression toolkit|使える表現を増やそう|Tus expresiones prácticas|Suas expressões práticas|实用表达|Vos expressions pratiques
When & how:|使う場面と方法：|Cuándo y cómo:|Quando e como:|使用场景和方法：|Quand et comment :
Watch out:|注意：|Atención:|Atenção:|注意：|Attention :
CHOOSE YOUR ANSWER|答えを選んでください|ELIGE TU RESPUESTA|ESCOLHA SUA RESPOSTA|选择答案|CHOISISSEZ VOTRE RÉPONSE
WRITE YOUR ANSWER|答えを入力してください|ESCRIBE TU RESPUESTA|ESCREVA SUA RESPOSTA|输入答案|ÉCRIVEZ VOTRE RÉPONSE
WATCH AND LISTEN|見て、聞いてみよう|MIRA Y ESCUCHA|ASSISTA E OUÇA|观看并聆听|REGARDEZ ET ÉCOUTEZ
LISTEN AND RESPOND|聞いて答えてください|ESCUCHA Y RESPONDE|OUÇA E RESPONDA|听后回答|ÉCOUTEZ ET RÉPONDEZ
BUILD THE PHRASE|語句を並べよう|CONSTRUYE LA FRASE|MONTE A FRASE|排列词语|CONSTRUISEZ LA PHRASE
APPLY OR CORRECT|使ってみる・直してみる|APLICA O CORRIGE|APLIQUE OU CORRIJA|应用或纠正|APPLIQUEZ OU CORRIGEZ
Undo last word|最後の単語を戻す|Deshacer última palabra|Desfazer última palavra|撤销最后一个词|Annuler le dernier mot
Clear|クリア|Borrar|Limpar|清空|Effacer
Choose the words in order.|単語を順番に選んでください。|Elige las palabras en orden.|Escolha as palavras na ordem.|按顺序选择词语。|Choisissez les mots dans l’ordre.
Sound effects: on|効果音：オン|Efectos de sonido: activados|Efeitos sonoros: ligados|音效：开|Effets sonores : activés
Sound effects: off|効果音：オフ|Efectos de sonido: desactivados|Efeitos sonoros: desligados|音效：关|Effets sonores : désactivés
Open review|復習を開く|Abrir repaso|Abrir revisão|打开复习|Ouvrir la révision
Needs review|要復習|Por repasar|Precisa revisar|需要复习|À revoir
Practising|練習中|En práctica|Praticando|练习中|En cours
Strong|定着|Dominado|Consolidado|已掌握|Bien acquis
Search|検索|Buscar|Buscar|搜索|Rechercher
FROM CLASS TO PRACTICE|授業から自主練習へ|DE LA CLASE A LA PRÁCTICA|DA AULA À PRÁTICA|从课堂到练习|DU COURS À LA PRATIQUE
Keep your class momentum|授業の学びを、次の練習へ|Continúa lo aprendido en clase|Continue o aprendizado da aula|延续课堂学习|Poursuivez le travail du cours
A focus for today|今日の学習ポイント|Tu objetivo de hoy|Seu foco de hoje|今日重点|L’objectif du jour
Preparing translations…|説明を翻訳しています…|Preparando traducciones…|Preparando traduções…|正在翻译说明…|Préparation des traductions…
Some explanations are still shown in English. Retry translation.|一部の説明は英語で表示されています。翻訳を再試行してください。|Algunas explicaciones siguen en inglés. Reintenta la traducción.|Algumas explicações ainda estão em inglês. Tente traduzir novamente.|部分说明仍显示为英语，请重试翻译。|Certaines explications restent en anglais. Réessayez la traduction.
AI-translated explanations; learning examples and audio keep their original language.|説明には自動翻訳を使用します。学習用の例文と音声は元の言語のままです。|Las explicaciones se traducen con IA; los ejemplos y el audio conservan su idioma original.|As explicações usam tradução por IA; os exemplos e o áudio mantêm o idioma original.|说明由AI翻译；学习例句和音频保留原语言。|Les explications sont traduites par IA ; les exemples et l’audio restent dans leur langue d’origine.
`;
export const interfaceCopy=Object.fromEntries(rows.trim().split('\n').filter(Boolean).map(line=>{const [en,...values]=line.split('|');if(values.length!==5)throw Error('Invalid interface copy: '+en);return [en,Object.fromEntries(['ja','es','pt','zh','fr'].map((id,i)=>[id,values[i]]))]}));
