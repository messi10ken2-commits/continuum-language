import {scheduleUiCopy} from './schedule-copy.mjs';
// Reviewed UI copy only. Names, chat, notes, assignments and target-language
// examples are user content and are never sent through this dictionary.
const rows=`
Trial lesson|体験レッスン|Clase de prueba|Aula experimental|体验课|Cours d’essai

Assignment complete. No further submission is needed.|この課題は完了しました。再提出は不要です。|Tarea completada. No necesitas volver a enviarla.|Tarefa concluída. Não é necessário enviar novamente.|作业已完成，无需再次提交。|Devoir terminé. Aucun nouvel envoi n’est nécessaire.
Back to messages|会話一覧に戻る|Volver a los mensajes|Voltar às mensagens|返回消息列表|Retour aux messages
Choose a conversation to start messaging.|相手を選ぶとメッセージを送れます。|Elige una conversación para enviar mensajes.|Escolha uma conversa para enviar mensagens.|选择一个会话开始聊天。|Choisissez une conversation pour échanger des messages.
Unread messages|未読メッセージ|Mensajes sin leer|Mensagens não lidas|未读消息|Messages non lus

Only learners can propose a class or a new time|授業や日時変更の提案は生徒から行ってください。|Solo los estudiantes pueden proponer una clase o un nuevo horario.|Somente alunos podem propor uma aula ou um novo horário.|只有学生可以提议课程或新时间。|Seuls les élèves peuvent proposer un cours ou un nouvel horaire.
No upcoming classes yet. Your learners can propose a time.|今後の授業はまだありません。生徒からの日時の提案をお待ちください。|Aún no hay clases próximas. Tus estudiantes pueden proponer un horario.|Ainda não há aulas agendadas. Seus alunos podem propor um horário.|暂无即将开始的课程。学生可以提议时间。|Aucun cours à venir. Vos élèves peuvent proposer un horaire.
Start the room first. Jitsi may ask you to sign in as the host.|先生が先にルームを開始してください。Jitsiで主催者としてのログインを求められる場合があります。|Inicia la sala primero. Jitsi puede pedirte que inicies sesión como anfitrión.|Inicie a sala primeiro. O Jitsi pode pedir que você entre como anfitrião.|请老师先开启会议室。Jitsi可能要求主持人登录。|Ouvrez la salle en premier. Jitsi peut vous demander de vous connecter comme hôte.
Your teacher starts the room. If asked, wait for the host.|先生がルームを開始します。案内が表示されたら主催者をお待ちください。|Tu profesor inicia la sala. Si se indica, espera al anfitrión.|Seu professor inicia a sala. Se solicitado, aguarde o anfitrião.|老师会开启会议室。如有提示，请等待主持人。|Votre professeur ouvre la salle. Si nécessaire, attendez l’hôte.
Prepare meeting room|通話ルームを用意する|Preparar sala de reunión|Preparar sala de reunião|准备会议室|Préparer la salle de réunion
A meeting room is prepared automatically. You can optionally replace it with your Google Meet or other supported link.|通話ルームは自動で用意されます。必要に応じてGoogle Meetなどの対応リンクに変更できます。|La sala se prepara automáticamente. Puedes sustituirla por un enlace de Google Meet u otro servicio compatible.|A sala é preparada automaticamente. Você pode substituí-la por um link do Google Meet ou de outro serviço compatível.|会议室会自动准备。您也可以改用Google Meet或其他受支持的链接。|Une salle est préparée automatiquement. Vous pouvez la remplacer par un lien Google Meet ou un autre lien compatible.
Arrange classes, share notes, and guide each learner’s next practice.|授業を調整し、ノートを共有して、生徒の次の練習につなげましょう。|Organiza clases, comparte notas y orienta la próxima práctica de cada estudiante.|Organize aulas, compartilhe notas e oriente a próxima prática de cada aluno.|安排课程、共享笔记，指导每位学生的下一步练习。|Organisez les cours, partagez des notes et guidez les prochains exercices de chaque élève.
Close|閉じる|Cerrar|Fechar|关闭|Fermer
LEARN WITH YOUR TEACHER|先生とつながる学習|APRENDE CON TU PROFESOR|APRENDA COM SEU PROFESSOR|跟老师一起学习|APPRENEZ AVEC VOTRE PROFESSEUR
Your teaching workspace|授業管理|Tu espacio de enseñanza|Seu espaço de ensino|教学工作台|Votre espace d’enseignement
Your classes and practice|授業と授業後の練習|Tus clases y prácticas|Suas aulas e práticas|课程与课后练习|Vos cours et vos exercices
Book a time, meet your teacher, and turn the class into useful practice.|日時を決めて授業に参加し、授業で学んだことを練習につなげましょう。|Acuerda una hora, asiste a clase y pon en práctica lo aprendido.|Combine um horário, participe da aula e pratique o que aprendeu.|约好时间、参加课程，再通过练习巩固所学。|Convenez d’un horaire, participez au cours et mettez vos acquis en pratique.
Pilot classes · no online payments|試行期間の授業・オンライン決済なし|Clases piloto · sin pagos en línea|Aulas-piloto · sem pagamentos online|试行课程·不支持在线付款|Cours pilotes · sans paiement en ligne
Class proposals need acceptance. Cancellations are free during this pilot. Updates arrive inside Continuum.|授業は相手の承認後に確定します。試行期間中のキャンセルは無料で、変更はContinuum内に届きます。|Las propuestas requieren aceptación. Durante la prueba, cancelar es gratis. Las novedades llegan dentro de Continuum.|As propostas precisam de aceitação. Durante o teste, o cancelamento é gratuito. As atualizações chegam pelo Continuum.|课程提议需经对方确认。试行期间取消免费，更新会在Continuum内显示。|Les propositions doivent être acceptées. L’annulation est gratuite pendant l’essai. Les mises à jour arrivent dans Continuum.
Classes|授業|Clases|Aulas|课程|Cours
Messages|メッセージ|Mensajes|Mensagens|消息|Messages
Assignments|課題|Tareas|Tarefas|作业|Devoirs
Find a teacher|先生を探す|Buscar profesor|Encontrar um professor|寻找老师|Trouver un professeur
Class workspace|授業ワークスペース|Espacio de clases|Espaço de aulas|课程工作区|Espace de cours
Loading class workspace…|授業の情報を読み込んでいます…|Cargando las clases…|Carregando as aulas…|正在加载课程信息…|Chargement des cours…
Learner and class language|生徒と授業の言語|Estudiante e idioma de la clase|Aluno e idioma da aula|学生与授课语言|Élève et langue du cours
Teacher and class language|先生と授業の言語|Profesor e idioma de la clase|Professor e idioma da aula|老师与授课语言|Professeur et langue du cours
Display time zone|表示するタイムゾーン|Zona horaria de visualización|Fuso horário de exibição|显示时区|Fuseau horaire d’affichage
Open learning record|学習記録を開く|Abrir historial de aprendizaje|Abrir histórico de aprendizagem|查看学习记录|Ouvrir le suivi d’apprentissage
No active connections|有効な接続がありません|No hay conexiones activas|Nenhuma conexão ativa|暂无有效关联|Aucune connexion active
Connect before arranging a class|先生・生徒と接続して授業を始めよう|Conéctate antes de organizar una clase|Conecte-se antes de marcar uma aula|先建立关联，再安排课程|Connectez-vous avant d’organiser un cours
Ask your learner for a sharing code from Account. It grants access only to the selected language.|生徒のアカウント画面で共有コードを発行してもらってください。選んだ言語だけにアクセスできます。|Pide al estudiante un código desde Cuenta. Solo permite acceder al idioma elegido.|Peça ao aluno um código na seção Conta. Ele dá acesso apenas ao idioma selecionado.|请学生在“账户”中生成共享码，只会授权所选语言的访问权限。|Demandez à l’élève un code dans Compte. Il donne accès uniquement à la langue choisie.
Find an approved teacher, or share an Account code privately with your teacher.|公開済みの先生を探すか、アカウント画面の共有コードを先生に直接伝えてください。|Busca un profesor aprobado o comparte en privado el código de tu Cuenta con tu profesor.|Encontre um professor aprovado ou compartilhe em particular o código da sua Conta com seu professor.|寻找已审核的老师，或将账户中的共享码私下提供给老师。|Trouvez un professeur approuvé ou transmettez-lui en privé le code de votre Compte.
Open account & sharing settings|アカウント・共有設定を開く|Abrir Cuenta y ajustes de acceso|Abrir Conta e configurações de compartilhamento|打开账户与共享设置|Ouvrir le compte et les réglages de partage
Propose a class|授業日時を提案する|Proponer una clase|Propor uma aula|提议课程时间|Proposer un cours
Propose a new time|別の日時を提案する|Proponer otro horario|Propor outro horário|提议新的时间|Proposer un autre horaire
Class topic|授業のテーマ|Tema de la clase|Tema da aula|课程主题|Thème du cours
Class date and time|授業の日時|Fecha y hora de la clase|Data e horário da aula|课程日期和时间|Date et heure du cours
Duration in minutes|授業時間（分）|Duración en minutos|Duração em minutos|时长（分钟）|Durée en minutes
The other participant must accept. Pending proposals do not reserve a time.|相手の承認が必要です。承認前の提案では時間枠は確保されません。|La otra persona debe aceptar. Una propuesta pendiente no reserva el horario.|A outra pessoa precisa aceitar. Propostas pendentes não reservam o horário.|需要对方确认。待确认的提议不会占用时间段。|L’autre personne doit accepter. Une proposition en attente ne réserve pas le créneau.
The original booking stays confirmed until this new time is accepted.|新しい日時が承認されるまで、元の予約が有効です。|La reserva original se mantiene hasta que se acepte el nuevo horario.|A reserva original continua confirmada até o novo horário ser aceito.|新时间获确认前，原预约仍然有效。|La réservation initiale reste confirmée jusqu’à l’acceptation du nouvel horaire.
Send class proposal|授業日時の提案を送る|Enviar propuesta de clase|Enviar proposta de aula|发送课程提议|Envoyer la proposition de cours
This local time does not exist in the selected time zone. Choose another time.|このタイムゾーンにはその時刻が存在しません。別の時刻を選んでください。|Esa hora local no existe en esta zona horaria. Elige otra.|Esse horário local não existe neste fuso. Escolha outro horário.|所选时区不存在这一当地时间，请另选时间。|Cette heure locale n’existe pas dans ce fuseau. Choisissez-en une autre.
This time occurs twice. Choose the UTC offset.|この時刻は2回現れます。UTCからの時差を選んでください。|Esta hora se repite. Elige el desfase UTC.|Esse horário ocorre duas vezes. Escolha a diferença em relação ao UTC.|这一时间会出现两次，请选择UTC偏移量。|Cette heure se produit deux fois. Choisissez le décalage UTC.
Choose an occurrence|どちらの時刻か選択|Elegir una de las dos horas|Escolher uma das duas ocorrências|选择具体时刻|Choisir une occurrence
Upcoming classes|今後の授業|Próximas clases|Próximas aulas|即将开始的课程|Cours à venir
Class history|授業履歴|Historial de clases|Histórico de aulas|课程记录|Historique des cours
No previous classes yet.|過去の授業はまだありません。|Aún no hay clases anteriores.|Ainda não há aulas anteriores.|暂无历史课程。|Aucun cours passé pour le moment.
No upcoming classes yet. Propose a time to get started.|今後の授業はまだありません。まず日時を提案しましょう。|Aún no hay próximas clases. Propón un horario para empezar.|Ainda não há aulas marcadas. Proponha um horário para começar.|暂无待上课程，先提议一个时间吧。|Aucun cours à venir. Proposez un horaire pour commencer.
Message your class partner|授業の相手に連絡する|Enviar un mensaje a tu compañero de clase|Enviar mensagem ao participante da aula|联系课程对方|Contacter votre partenaire de cours
Open class|授業の詳細を開く|Abrir clase|Abrir aula|查看课程详情|Ouvrir le cours
Accept time|この日時を承認|Aceptar horario|Aceitar horário|确认时间|Accepter l’horaire
Decline|見送る|Rechazar|Recusar|拒绝|Refuser
Join class|授業に参加する|Entrar a clase|Entrar na aula|加入课程|Rejoindre le cours
Finish class|授業を終了する|Finalizar clase|Encerrar aula|结束课程|Terminer le cours
Cancel class|授業をキャンセルする|Cancelar clase|Cancelar aula|取消课程|Annuler le cours
Cancellation reason|キャンセルの理由|Motivo de cancelación|Motivo do cancelamento|取消原因|Motif d’annulation
Confirm cancellation|キャンセルを確定|Confirmar cancelación|Confirmar cancelamento|确认取消|Confirmer l’annulation
Pilot classes have no cancellation fee.|試行期間の授業にキャンセル料はかかりません。|Las clases piloto no tienen gastos de cancelación.|As aulas-piloto não têm taxa de cancelamento.|试行课程不收取取消费。|Les cours pilotes n’entraînent aucun frais d’annulation.
Rescheduling proposal|日時変更の提案|Propuesta de cambio de horario|Proposta de alteração de horário|改期提议|Proposition de report
Back to classes|授業一覧に戻る|Volver a las clases|Voltar às aulas|返回课程列表|Retour aux cours
Meeting link|ビデオ通話の参加リンク|Enlace de videollamada|Link da videochamada|视频通话链接|Lien de visioconférence
Use Google Meet, Zoom, Teams, Jitsi or Whereby. Only class participants can access this link.|Google Meet・Zoom・Teams・Jitsi・Wherebyのリンクを使用してください。授業の参加者だけが確認できます。|Usa Google Meet, Zoom, Teams, Jitsi o Whereby. Solo los participantes pueden acceder al enlace.|Use Google Meet, Zoom, Teams, Jitsi ou Whereby. Apenas os participantes podem acessar o link.|请使用Google Meet、Zoom、Teams、Jitsi或Whereby链接，仅课程参与者可查看。|Utilisez Google Meet, Zoom, Teams, Jitsi ou Whereby. Seuls les participants peuvent accéder au lien.
Save meeting link|参加リンクを保存|Guardar enlace de videollamada|Salvar link da videochamada|保存通话链接|Enregistrer le lien
Class notes and follow-up|授業ノートと授業後の練習|Notas y seguimiento de la clase|Notas e prática após a aula|课堂笔记与课后练习|Notes et suivi du cours
No class notes shared yet.|共有された授業ノートはまだありません。|Todavía no se han compartido notas de clase.|Ainda não há notas de aula compartilhadas.|暂无共享课堂笔记。|Aucune note de cours partagée pour le moment.
Share a class note|授業ノートを共有する|Compartir una nota de clase|Compartilhar uma nota de aula|共享课堂笔记|Partager une note de cours
Edit shared note|共有ノートを編集する|Editar nota compartida|Editar nota compartilhada|编辑共享笔记|Modifier la note partagée
This note will be visible to the learner and teachers they authorise for this language.|このノートは生徒と、生徒がこの言語について共有を許可した先生に表示されます。|Esta nota será visible para el estudiante y los profesores autorizados para este idioma.|Esta nota ficará visível para o aluno e os professores autorizados por ele para este idioma.|学生及其授权查看此语言记录的老师可见这条笔记。|Cette note sera visible par l’élève et les professeurs qu’il autorise pour cette langue.
Learning focus|学習のポイント|Objetivo de aprendizaje|Foco de aprendizagem|学习重点|Objectif d’apprentissage
Class note|授業ノート|Nota de clase|Nota de aula|课堂笔记|Note de cours
Save and share note|保存してノートを共有|Guardar y compartir nota|Salvar e compartilhar nota|保存并共享笔记|Enregistrer et partager la note
Create follow-up assignment|授業後の課題を作る|Crear tarea de seguimiento|Criar tarefa de acompanhamento|布置课后作业|Créer un devoir de suivi
Open Assignments to practise the lesson chosen by your teacher and send your work back.|「課題」で先生が選んだレッスンを練習し、取り組んだ内容を提出しましょう。|Abre Tareas para practicar la lección elegida por tu profesor y enviar tu trabajo.|Abra Tarefas para praticar a lição escolhida pelo professor e enviar seu trabalho.|在“作业”中练习老师选择的课程，并提交你的作业。|Ouvrez Devoirs pour pratiquer la leçon choisie par votre professeur et lui envoyer votre travail.
Class messages|授業のメッセージ|Mensajes de clase|Mensagens da aula|课程消息|Messages du cours
Messages are shared only between you and this teacher or learner.|メッセージは、あなたとこの先生・生徒の間だけで共有されます。|Los mensajes solo se comparten entre tú y este profesor o estudiante.|As mensagens são compartilhadas apenas entre você e este professor ou aluno.|消息仅在你与这位老师或学生之间共享。|Les messages ne sont partagés qu’entre vous et ce professeur ou cet élève.
Load earlier messages|以前のメッセージを読み込む|Cargar mensajes anteriores|Carregar mensagens anteriores|加载更早的消息|Charger les messages précédents
Loading messages…|メッセージを読み込んでいます…|Cargando mensajes…|Carregando mensagens…|正在加载消息…|Chargement des messages…
Say hello and discuss your next class.|あいさつをして、次の授業について相談しましょう。|Saluda y habla sobre la próxima clase.|Dê um oi e conversem sobre a próxima aula.|打个招呼，商量下一次课程吧。|Dites bonjour et discutez du prochain cours.
Your message|メッセージ|Tu mensaje|Sua mensagem|你的消息|Votre message
Write a message…|メッセージを入力…|Escribe un mensaje…|Escreva uma mensagem…|输入消息…|Écrivez un message…
Send message|メッセージを送る|Enviar mensaje|Enviar mensagem|发送消息|Envoyer le message
You|あなた|Tú|Você|你|Vous
This connection is inactive. You can still read your saved history.|この接続は現在無効です。保存済みの履歴は確認できます。|Esta conexión está inactiva. Puedes consultar el historial guardado.|Esta conexão está inativa. Você ainda pode ler o histórico salvo.|此关联已失效，仍可查看已保存的记录。|Cette connexion est inactive. Vous pouvez toujours consulter l’historique enregistré.
Instructions|課題の内容|Instrucciones|Instruções|作业说明|Consignes
Follow-up lesson|復習用のレッスン|Lección de seguimiento|Lição de acompanhamento|复习课程|Leçon de suivi
Suggest from the assignment text|課題の内容から提案する|Sugerir según el texto de la tarea|Sugerir com base no texto da tarefa|根据作业内容推荐|Suggérer à partir du texte du devoir
Suggested lesson|おすすめの復習レッスン|Lección sugerida|Lição sugerida|推荐复习课程|Leçon suggérée
No clear match yet. Choose a lesson or send a written task.|適切なレッスンを特定できません。レッスンを選ぶか、記述課題として送れます。|No hay una coincidencia clara. Elige una lección o envía una tarea escrita.|Ainda não há uma correspondência clara. Escolha uma lição ou envie uma tarefa escrita.|暂未找到明确匹配的课程，可手动选择或发送书面作业。|Aucune correspondance claire. Choisissez une leçon ou envoyez un devoir écrit.
Due date (optional)|提出期限（任意）|Fecha límite (opcional)|Prazo de entrega (opcional)|截止时间（可选）|Date limite (facultative)
This assignment is sent to the learner and added to their class-to-practice record.|課題は生徒に送信され、「授業から練習へ」の記録にも追加されます。|La tarea se envía al estudiante y se añade a su seguimiento de clase y práctica.|A tarefa é enviada ao aluno e adicionada ao registro que conecta aula e prática.|作业会发送给学生，并加入课堂到练习的学习记录。|Le devoir est envoyé à l’élève et ajouté au suivi qui relie cours et pratique.
Send assignment|課題を送る|Enviar tarea|Enviar tarefa|发送作业|Envoyer le devoir
Assignments and feedback|課題とフィードバック|Tareas y comentarios|Tarefas e feedback|作业与反馈|Devoirs et commentaires
Assignment status|課題の状況|Estado de la tarea|Status da tarefa|作业状态|État du devoir
Class assignments and teacher feedback will appear here.|授業の課題と先生からのフィードバックがここに表示されます。|Aquí aparecerán las tareas y los comentarios del profesor.|As tarefas e o feedback do professor aparecerão aqui.|课堂作业和老师的反馈会显示在这里。|Les devoirs et les commentaires du professeur apparaîtront ici.
Due|提出期限|Fecha límite|Prazo|截止时间|Date limite
Completed practice|完了した練習|Práctica completada|Prática concluída|已完成的练习|Exercice terminé
Practise this lesson|このレッスンで練習する|Practicar esta lección|Praticar esta lição|练习这节课程|Pratiquer cette leçon
Submitted work|提出した内容|Trabajo enviado|Trabalho enviado|已提交的作业|Travail rendu
Teacher feedback|先生からのフィードバック|Comentarios del profesor|Feedback do professor|老师反馈|Commentaires du professeur
Your work or reflection|解答・取り組んだ内容|Tu trabajo o reflexión|Seu trabalho ou reflexão|你的作业或学习心得|Votre travail ou vos réflexions
Write your answer or explain what you practised.|解答や、どのような練習をしたかを書いてください。|Escribe tu respuesta o explica qué practicaste.|Escreva sua resposta ou explique o que praticou.|写下答案，或说明你练习了什么。|Rédigez votre réponse ou expliquez ce que vous avez travaillé.
Your submitted work is shared with this teacher. Lesson scores follow your self-study sharing setting.|提出した内容はこの先生に共有されます。レッスンの点数は自主学習の共有設定に従って表示されます。|El trabajo enviado se comparte con este profesor. Las notas de las lecciones respetan tus ajustes de acceso al autoaprendizaje.|O trabalho enviado é compartilhado com este professor. As notas das lições seguem sua configuração de compartilhamento do estudo autônomo.|提交的作业会与这位老师共享，课程分数是否显示取决于自主学习共享设置。|Votre travail est partagé avec ce professeur. Les résultats des leçons respectent vos réglages de partage de l’autoapprentissage.
Submit work|課題を提出する|Entregar trabajo|Enviar trabalho|提交作业|Rendre le devoir
Submit another attempt|もう一度提出する|Entregar otro intento|Enviar outra tentativa|再次提交|Rendre une nouvelle version
Send feedback|フィードバックを送る|Enviar comentarios|Enviar feedback|发送反馈|Envoyer les commentaires
Language to share with this teacher|この先生と学ぶ言語|Idioma que compartirás con este profesor|Idioma a compartilhar com este professor|与这位老师学习的语言|Langue à partager avec ce professeur
Connect with this teacher for this language. Share class notes and, if enabled in Account, self-study results for this language only.|この言語について先生と接続します。授業ノートと、アカウント設定で有効にしている場合はこの言語の自主学習結果だけを共有します。|Conecta con este profesor para este idioma. Comparte las notas de clase y, si lo permites en Cuenta, solo los resultados de autoaprendizaje de este idioma.|Conecte-se com este professor para este idioma. Compartilhe notas de aula e, se habilitado em Conta, apenas os resultados de estudo autônomo deste idioma.|就此语言与老师建立关联，共享课堂笔记；若在账户中允许，也会仅共享此语言的自主学习结果。|Connectez-vous à ce professeur pour cette langue. Partagez les notes de cours et, si vous l’autorisez dans Compte, uniquement les résultats d’autoapprentissage de cette langue.
Connect and send a message|接続してメッセージを送る|Conectar y enviar un mensaje|Conectar e enviar uma mensagem|建立关联并发送消息|Se connecter et envoyer un message
Pilot class proposals and messages are available in Classes. Already working with a teacher? Connect privately using a sharing code in Account.|授業の提案やメッセージは「授業」から利用できます。すでに先生がいる場合は、アカウント画面の共有コードで接続できます。|Las propuestas y los mensajes están en Clases. Si ya tienes profesor, conéctate en privado con un código de Cuenta.|As propostas e mensagens estão em Aulas. Se já tem professor, conecte-se em particular usando um código da sua Conta.|可在“课程”中提议授课时间并发送消息。若已有老师，可使用账户中的共享码私下关联。|Les propositions et messages sont disponibles dans Cours. Vous avez déjà un professeur ? Connectez-vous en privé avec un code de votre Compte.
Class operations|授業の運用管理|Gestión de clases|Gestão das aulas|课程运营管理|Gestion des cours
Paid checkout, refunds and teacher payouts are not enabled. No money is collected in this pilot.|有料授業の決済・返金・教師への支払いはまだ有効になっていません。この試行期間に料金は徴収しません。|Los pagos, reembolsos y abonos a profesores aún no están habilitados. En esta prueba no se cobra dinero.|Pagamentos, reembolsos e repasses a professores ainda não estão habilitados. Nenhum valor é cobrado neste teste.|付费结算、退款及教师收款尚未启用，试行期间不收取费用。|Les paiements, remboursements et versements aux professeurs ne sont pas activés. Aucun montant n’est encaissé pendant cet essai.
Choose a class|授業を選ぶ|Elegir una clase|Escolher uma aula|选择课程|Choisir un cours
Cancel pilot class|試行授業をキャンセルする|Cancelar clase piloto|Cancelar aula-piloto|取消试行课程|Annuler le cours pilote
Recent class actions|最近の授業の操作履歴|Acciones recientes de clases|Ações recentes nas aulas|近期课程操作|Actions récentes sur les cours
requested|承認待ち|Pendiente de aceptación|Aguardando aceitação|待确认|En attente d’acceptation
confirmed|予約確定|Confirmada|Confirmada|已确认|Confirmé
cancelled|キャンセル済み|Cancelada|Cancelada|已取消|Annulé
declined|見送り|Rechazada|Recusada|已拒绝|Refusé
completed|終了済み|Finalizada|Concluída|已结束|Terminé
assigned|未提出|Por entregar|A entregar|待提交|À rendre
submitted|提出済み|Entregada|Enviada|已提交|Rendu
reviewed|完了|Completada|Concluída|已完成|Terminé
all|すべて|Todas|Todas|全部|Tous
minutes|分|minutos|minutos|分钟|minutes
proposed|日時の提案|Horario propuesto|Horário proposto|已提议时间|Horaire proposé
rescheduled|日時変更|Cambio de horario|Horário alterado|已改期|Horaire modifié
access_cancelled|共有解除によるキャンセル|Cancelación por retirada del acceso|Cancelamento por remoção do acesso|因撤销共享而取消|Annulation après retrait de l’accès
admin_cancelled|管理者によるキャンセル|Cancelación por administración|Cancelamento pela administração|管理员取消|Annulation par l’administration
note_shared|ノート共有|Nota compartida|Nota compartilhada|已共享笔记|Note partagée
assignment_shared|課題の送信|Tarea enviada|Tarefa enviada|已发送作业|Devoir envoyé
assignment_submitted|課題の提出|Trabajo entregado|Trabalho enviado|已提交作业|Devoir rendu
assignment_reviewed|課題へのフィードバック|Comentarios enviados|Feedback enviado|已反馈作业|Devoir commenté
meeting_updated|参加リンクの更新|Enlace actualizado|Link atualizado|已更新通话链接|Lien mis à jour
A class time has been proposed.|授業の日時が提案されました。|Se ha propuesto un horario de clase.|Um horário de aula foi proposto.|已收到课程时间提议。|Un horaire de cours a été proposé.
The meeting link has been updated.|参加リンクが更新されました。|Se ha actualizado el enlace de la clase.|O link da aula foi atualizado.|课程通话链接已更新。|Le lien du cours a été mis à jour.
A class note has been shared.|授業ノートが共有されました。|Se ha compartido una nota de clase.|Uma nota de aula foi compartilhada.|课堂笔记已共享。|Une note de cours a été partagée.
A practice assignment has been shared.|練習課題が届きました。|Se ha compartido una tarea de práctica.|Uma tarefa de prática foi compartilhada.|收到新的练习作业。|Un devoir d’entraînement a été partagé.
Assignment work has been submitted.|課題が提出されました。|Se ha entregado el trabajo.|O trabalho foi enviado.|作业已提交。|Le devoir a été rendu.
Your assignment feedback is ready.|課題へのフィードバックが届きました。|Los comentarios de tu tarea están listos.|O feedback da sua tarefa está pronto.|作业反馈已就绪。|Les commentaires sur votre devoir sont prêts.
The administrator cancelled this pilot class.|管理者がこの試行授業をキャンセルしました。|La administración canceló esta clase piloto.|A administração cancelou esta aula-piloto.|管理员已取消这节试行课程。|L’administration a annulé ce cours pilote.
Class status updated: confirmed.|授業の予約が確定しました。|La clase ha quedado confirmada.|A aula foi confirmada.|课程已确认。|Le cours a été confirmé.
Class status updated: declined.|授業の提案は見送られました。|La propuesta de clase ha sido rechazada.|A proposta de aula foi recusada.|课程提议已被拒绝。|La proposition de cours a été refusée.
Class status updated: cancelled.|授業がキャンセルされました。|La clase ha sido cancelada.|A aula foi cancelada.|课程已取消。|Le cours a été annulé.
Class status updated: completed.|授業が終了しました。|La clase ha finalizado.|A aula foi concluída.|课程已结束。|Le cours est terminé.

Conversation not found|会話が見つかりません。|No se encontró la conversación.|Conversa não encontrada.|未找到对话。|Conversation introuvable.
This language is not shared with you|この言語の記録へのアクセスは許可されていません。|No tienes acceso a los registros de este idioma.|Você não tem acesso aos registros deste idioma.|你没有访问此语言记录的权限。|Vous n’avez pas accès aux données de cette langue.
Choose a lesson in the class language|授業と同じ言語のレッスンを選んでください。|Elige una lección en el idioma de la clase.|Escolha uma lição no idioma da aula.|请选择与授课语言相同的课程。|Choisissez une leçon dans la langue du cours.
Choose a valid class language|授業の言語を選んでください。|Elige un idioma válido para la clase.|Escolha um idioma válido para a aula.|请选择有效的授课语言。|Choisissez une langue de cours valide.
Not allowed for this account|このアカウントでは操作できません。|Esta cuenta no tiene permiso para realizar esta acción.|Esta conta não tem permissão para realizar esta ação.|此账户无权执行该操作。|Cette action n’est pas autorisée pour ce compte.
Choose a language and confirm sharing with this teacher|言語を選び、この先生との共有に同意してください。|Elige un idioma y confirma el acceso para este profesor.|Escolha um idioma e confirme o compartilhamento com este professor.|请选择语言，并确认向这位老师共享。|Choisissez une langue et confirmez le partage avec ce professeur.
Teacher profile is not published for this language|この言語では先生のプロフィールが公開されていません。|El perfil del profesor no está publicado para este idioma.|O perfil do professor não está publicado para este idioma.|该老师尚未公开此语言的教学资料。|Le profil du professeur n’est pas publié pour cette langue.
Choose a connected learner or teacher|接続済みの先生または生徒を選んでください。|Elige un profesor o estudiante con el que estés conectado.|Escolha um professor ou aluno com quem você já esteja conectado.|请选择已关联的老师或学生。|Choisissez un professeur ou un élève déjà connecté à votre compte.
Invalid message page|メッセージの読み込み位置が無効です。再読み込みしてください。|La página de mensajes no es válida. Actualiza la vista.|A página de mensagens é inválida. Atualize a tela.|消息分页无效，请刷新。|La page de messages n’est pas valide. Actualisez la vue.
Write a message of 1–4000 characters|メッセージは1〜4000文字で入力してください。|Escribe un mensaje de entre 1 y 4000 caracteres.|Escreva uma mensagem de 1 a 4000 caracteres.|请输入1至4000个字符的消息。|Écrivez un message de 1 à 4 000 caractères.
This submission was already sent with different content|同じ送信番号で別の内容が送られています。再読み込みして確認してください。|Esta solicitud ya se envió con otro contenido. Actualiza para comprobarlo.|Esta solicitação já foi enviada com outro conteúdo. Atualize para conferir.|此提交编号已用于其他内容，请刷新核对。|Cette demande a déjà été envoyée avec un autre contenu. Actualisez pour vérifier.
Choose a valid class time, time zone and duration|授業の日時・タイムゾーン・授業時間を確認してください。|Revisa la fecha, la zona horaria y la duración de la clase.|Confira a data, o fuso e a duração da aula.|请检查课程时间、时区和时长。|Vérifiez la date, le fuseau horaire et la durée du cours.
Choose a time at least five minutes ahead and within six months|5分後以降、6か月以内の日時を選んでください。|Elige una hora al menos cinco minutos más tarde y dentro de seis meses.|Escolha um horário com pelo menos cinco minutos de antecedência e dentro de seis meses.|请选择至少5分钟后、6个月内的时间。|Choisissez un horaire dans au moins cinq minutes et dans les six prochains mois.
Invalid booking|予約の情報が無効です。再読み込みしてください。|Los datos de la reserva no son válidos. Actualiza la vista.|Os dados da reserva são inválidos. Atualize a tela.|预约信息无效，请刷新。|Les données de réservation ne sont pas valides. Actualisez la vue.
Only a confirmed class can be rescheduled|日時変更は予約が確定した授業で利用できます。|Solo se puede cambiar el horario de una clase confirmada.|Só é possível remarcar uma aula confirmada.|只能更改已确认课程的时间。|Seul un cours confirmé peut être reporté.
This time overlaps a confirmed class. Choose another time|確定済みの授業と時間が重なっています。別の日時を選んでください。|Este horario se solapa con una clase confirmada. Elige otro.|Esse horário coincide com uma aula confirmada. Escolha outro.|该时间与已确认课程冲突，请另选时间。|Cet horaire chevauche un cours confirmé. Choisissez-en un autre.
Class not found|授業が見つかりません。|No se encontró la clase.|Aula não encontrada.|未找到课程。|Cours introuvable.
Reload before saving|保存する前に再読み込みしてください。|Actualiza antes de guardar.|Atualize antes de salvar.|请先刷新再保存。|Actualisez avant d’enregistrer.
This class changed. Refresh before saving|授業の情報が更新されています。再読み込みしてから保存してください。|La clase ha cambiado. Actualiza antes de guardar.|A aula foi alterada. Atualize antes de salvar.|课程信息已变更，请刷新后保存。|Le cours a été modifié. Actualisez avant d’enregistrer.
Only the teacher can set the meeting link|参加リンクを設定できるのは担当の先生だけです。|Solo el profesor puede establecer el enlace de la reunión.|Só o professor pode definir o link da reunião.|仅任课老师可设置通话链接。|Seul le professeur peut définir le lien de visioconférence.
Use an HTTPS Google Meet, Zoom, Teams, Jitsi or Whereby link for a confirmed class|確定済みの授業に、HTTPSのGoogle Meet・Zoom・Teams・Jitsi・Wherebyのリンクを設定してください。|Usa un enlace HTTPS de Google Meet, Zoom, Teams, Jitsi o Whereby para una clase confirmada.|Use um link HTTPS do Google Meet, Zoom, Teams, Jitsi ou Whereby em uma aula confirmada.|请为已确认课程设置Google Meet、Zoom、Teams、Jitsi或Whereby的HTTPS链接。|Utilisez un lien HTTPS Google Meet, Zoom, Teams, Jitsi ou Whereby pour un cours confirmé.
Choose a valid class action|授業に対する操作を選び直してください。|Elige una acción válida para la clase.|Escolha uma ação válida para a aula.|请选择有效的课程操作。|Choisissez une action valide pour le cours.
Only the other participant can respond to a future proposal|今後の授業の提案は、提案した本人ではなく相手が承認・辞退します。|Solo la otra persona puede aceptar o rechazar una propuesta futura.|Apenas a outra pessoa pode aceitar ou recusar uma proposta futura.|未来课程提议须由另一方确认或拒绝。|Seule l’autre personne peut accepter ou refuser une proposition à venir.
Add a reason to cancel this class|キャンセルの理由を入力してください。|Indica el motivo de la cancelación.|Informe o motivo do cancelamento.|请输入取消原因。|Indiquez le motif de l’annulation.
The teacher can finish a confirmed class after it starts|予約が確定した授業は、開始時刻を過ぎると先生が終了にできます。|El profesor puede finalizar una clase confirmada una vez que haya empezado.|O professor pode encerrar uma aula confirmada após o horário de início.|已确认课程开始后，老师才能将其标记为结束。|Le professeur peut terminer un cours confirmé après son heure de début.
The original class changed. Propose a new time|元の予約が変更されています。新しい日時を提案し直してください。|La reserva original ha cambiado. Propón otro horario.|A reserva original foi alterada. Proponha outro horário.|原预约已变更，请重新提议时间。|La réservation initiale a changé. Proposez un autre horaire.
Note not found|ノートが見つかりません。|No se encontró la nota.|Nota não encontrada.|未找到笔记。|Note introuvable.
Only the teacher can share a class note|授業ノートを共有できるのは担当の先生だけです。|Solo el profesor puede compartir una nota de clase.|Só o professor pode compartilhar uma nota de aula.|仅任课老师可共享课堂笔记。|Seul le professeur peut partager une note de cours.
Enter a focus and note (3–3000 characters)|学習のポイントと、3〜3000文字のノートを入力してください。|Indica el objetivo y una nota de entre 3 y 3000 caracteres.|Informe o foco e uma nota de 3 a 3000 caracteres.|请填写学习重点和3至3000个字符的笔记。|Indiquez l’objectif et une note de 3 à 3 000 caractères.
Assignment notes are managed from Assignments|課題に付随するノートは「課題」から管理します。|Las notas de tareas se gestionan desde Tareas.|As notas de tarefas são gerenciadas em Tarefas.|作业附属笔记请在“作业”中管理。|Les notes des devoirs se gèrent dans Devoirs.
This note changed. Refresh before saving|ノートが更新されています。再読み込みしてから保存してください。|La nota ha cambiado. Actualiza antes de guardar.|A nota foi alterada. Atualize antes de salvar.|笔记已变更，请刷新后保存。|La note a été modifiée. Actualisez avant d’enregistrer.
Invalid submission key|送信情報が無効です。再読み込みして再試行してください。|La información de envío no es válida. Actualiza y vuelve a intentarlo.|As informações de envio são inválidas. Atualize e tente novamente.|提交信息无效，请刷新后重试。|Les informations d’envoi ne sont pas valides. Actualisez et réessayez.
Only the teacher can create assignments|課題を作成できるのは担当の先生だけです。|Solo el profesor puede crear tareas.|Só o professor pode criar tarefas.|仅任课老师可布置作业。|Seul le professeur peut créer des devoirs.
Add an assignment title, instructions and a valid due date|課題のタイトル・内容・提出期限を確認してください。|Revisa el título, las instrucciones y la fecha límite de la tarea.|Confira o título, as instruções e o prazo da tarefa.|请检查作业标题、说明和截止时间。|Vérifiez le titre, les consignes et la date limite du devoir.
Assignment not found|課題が見つかりません。|No se encontró la tarea.|Tarefa não encontrada.|未找到作业。|Devoir introuvable.
This assignment changed. Refresh before saving|課題が更新されています。再読み込みしてから保存してください。|La tarea ha cambiado. Actualiza antes de guardar.|A tarefa foi alterada. Atualize antes de salvar.|作业已变更，请刷新后保存。|Le devoir a été modifié. Actualisez avant d’enregistrer.
Only the learner can submit this assignment|この課題を提出できるのは担当の生徒だけです。|Solo el estudiante asignado puede entregar esta tarea.|Só o aluno responsável pode enviar esta tarefa.|只有被布置该作业的学生可以提交。|Seul l’élève concerné peut rendre ce devoir.
Invalid practice result|練習結果が無効です。再読み込みして確認してください。|El resultado no es válido. Actualiza para comprobarlo.|O resultado da prática é inválido. Atualize para conferir.|练习结果无效，请刷新核对。|Le résultat de l’exercice n’est pas valide. Actualisez pour vérifier.
Complete the assigned lesson before attaching its result|課題で指定されたレッスンを完了してから、結果を添付してください。|Completa la lección asignada antes de adjuntar su resultado.|Conclua a lição atribuída antes de anexar o resultado.|请先完成指定课程，再附上结果。|Terminez la leçon attribuée avant de joindre son résultat.
Write your response or complete the assigned practice|解答を入力するか、指定された練習を完了してください。|Escribe tu respuesta o completa la práctica asignada.|Escreva sua resposta ou conclua a prática atribuída.|请填写答案或完成指定练习。|Rédigez votre réponse ou terminez l’exercice demandé.
Only the teacher can review submitted work|提出された課題を確認できるのは担当の先生だけです。|Solo el profesor puede revisar el trabajo entregado.|Só o professor pode revisar o trabalho enviado.|仅任课老师可批阅已提交的作业。|Seul le professeur peut commenter le travail rendu.
Add specific feedback for the learner|生徒への具体的なフィードバックを入力してください。|Escribe comentarios concretos para el estudiante.|Escreva um feedback específico para o aluno.|请输入给学生的具体反馈。|Ajoutez des commentaires précis pour l’élève.
Owner access required|この操作にはオーナー権限が必要です。|Esta acción requiere acceso del propietario.|Esta ação exige acesso do proprietário.|此操作需要所有者权限。|Cette action nécessite un accès propriétaire.
This class is already closed|この授業はすでに終了またはキャンセルされています。|Esta clase ya está cerrada.|Esta aula já foi encerrada.|该课程已结束或取消。|Ce cours est déjà clos.
Classroom endpoint not found|授業の操作先が見つかりません。再読み込みしてください。|No se encontró esta acción de clase. Actualiza la vista.|Esta ação de aula não foi encontrada. Atualize a tela.|未找到对应课程操作，请刷新。|Cette action de cours est introuvable. Actualisez la vue.
`;
export const classroomCopy=Object.fromEntries(rows.trim().split('\n').filter(Boolean).map(row=>{const [en,...values]=row.split('|');if(values.length!==5)throw Error('Invalid classroom copy');return [en,Object.fromEntries(['ja','es','pt','zh','fr'].map((l,i)=>[l,values[i]]))]}));

// Short status words are local to the classroom. They must not become global
// translations of words that may also be target-language lesson examples.
export const classroomTerms=new Set(['requested','confirmed','declined','cancelled','completed','assigned','submitted','reviewed','all','minutes','You','Close','proposed','rescheduled','access_cancelled','admin_cancelled','note_shared','assignment_shared','assignment_submitted','assignment_reviewed','meeting_updated']);
Object.assign(classroomCopy,scheduleUiCopy);
export const classroomUiCopy=Object.fromEntries(Object.entries(classroomCopy).filter(([key])=>!classroomTerms.has(key)));
