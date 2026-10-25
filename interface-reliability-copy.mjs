// Reviewed dynamic interface templates. Values are inserted after translation;
// learner evidence and target-language examples are never translated as UI.
const rows=`
AI conversation|AI会話|Conversación con IA|Conversa com IA|AI 对话|Conversation avec l’IA
Vocabulary review|語彙の復習|Repaso de vocabulario|Revisão de vocabulário|词汇复习|Révision du vocabulaire
Introduce yourself, describe your world and order with confidence.|自己紹介や身の回りの説明を練習し、自信を持って注文できるようになりましょう。|Preséntate, describe tu entorno y haz pedidos con confianza.|Apresente-se, descreva seu mundo e faça pedidos com confiança.|练习自我介绍、描述身边的事物，并自信地点餐。|Présentez-vous, décrivez votre univers et commandez avec assurance.
Tell a short story, make plans and develop your ear for Spanish.|短い出来事を話し、予定を立て、スペイン語を聞き取る力を育てましょう。|Cuenta una historia breve, haz planes y mejora tu comprensión del español hablado.|Conte uma história curta, faça planos e desenvolva sua compreensão do espanhol falado.|讲述简短的故事、制定计划，并培养西班牙语听力。|Racontez une courte histoire, faites des projets et entraînez votre oreille à l’espagnol.
Express uncertainty, explain reasons and connect your ideas.|不確かなことを表現し、理由を説明し、考えをつなげて話しましょう。|Expresa incertidumbre, explica motivos y conecta tus ideas.|Expresse incerteza, explique motivos e conecte suas ideias.|表达不确定性、解释原因，并有条理地衔接观点。|Exprimez l’incertitude, expliquez vos raisons et reliez vos idées.
Understand announcements, weigh arguments and discuss possibilities.|アナウンスを理解し、さまざまな主張を比較し、可能性について話し合いましょう。|Comprende anuncios, sopesa argumentos y habla de distintas posibilidades.|Entenda avisos, pondere argumentos e discuta possibilidades.|理解通知、权衡论点，并讨论各种可能性。|Comprenez les annonces, pesez les arguments et discutez des possibilités.
Interpret stance and choose language to suit your audience.|相手の立場や意図を読み取り、聞き手や読み手に合った表現を選びましょう。|Interpreta posturas y elige el lenguaje adecuado para tu público.|Interprete posições e escolha a linguagem adequada ao seu público.|理解说话者的立场，并根据听众或读者选择合适的表达。|Interprétez les points de vue et adaptez votre langage à votre public.
Review your learning history and recurring patterns.|学習履歴と繰り返し見られる課題を確認しましょう。|Revisa tu historial de aprendizaje y las dificultades recurrentes.|Confira seu histórico de aprendizagem e as dificuldades recorrentes.|查看学习历史和反复出现的困难。|Consultez votre historique d’apprentissage et les difficultés récurrentes.
Check your level and see your skill report.|今のレベルを確認し、技能別レポートを見てみましょう。|Comprueba tu nivel y consulta tu informe por habilidades.|Confira seu nível e veja seu relatório por habilidade.|检测水平并查看技能报告。|Évaluez votre niveau et consultez votre bilan par compétence.
· YOUR LEARNING RECORD|· 学習記録|· TU REGISTRO DE APRENDIZAJE|· SEU HISTÓRICO DE APRENDIZAGEM|· 学习记录|· VOTRE HISTORIQUE D’APPRENTISSAGE
· your saved learning memory|· 保存された学習の記録|· tu registro de aprendizaje guardado|· seu histórico de aprendizagem salvo|· 已保存的学习记录|· votre historique d’apprentissage enregistré
activities mastered|習得済みの学習項目|actividades dominadas|atividades dominadas|项已掌握的练习|activités maîtrisées
class notes|授業ノート|notas de clase|anotações de aula|条课堂笔记|notes de cours
Class observation|授業での所見|Observación de clase|Observação de aula|课堂观察|Observation de cours
On track|順調です|Vas por buen camino|No caminho certo|进展顺利|En bonne voie
Recurring difficulty|繰り返し見られる課題|Dificultad recurrente|Dificuldade recorrente|反复出现的困难|Difficulté récurrente
Review suggested|復習がおすすめ|Repaso sugerido|Revisão sugerida|建议复习|Révision conseillée
Lesson accuracy|レッスンの正答率|Precisión en las lecciones|Taxa de acerto nas lições|课程正确率|Exactitude dans les leçons
Rubric evidence|評価基準別の記録|Evidencias por criterio|Evidências por critério|评分标准记录|Éléments par critère
Task accuracy|課題の正答率|Precisión en las tareas|Taxa de acerto nas tarefas|任务正确率|Exactitude dans les tâches
Speech-match score|音声認識との一致率|Puntuación de coincidencia de voz|Pontuação de correspondência de fala|语音匹配分数|Score de correspondance vocale
{0} recent score|{0}の最近の成績|Puntuación reciente de {0}|Pontuação recente de {0}|{0}最近的分数|Score récent de {0}
· previous five: {0}%|· その前の5件：{0}%|· cinco anteriores: {0}%|· cinco anteriores: {0}%|· 前五条：{0}%|· cinq précédents : {0}%
Practice question|練習問題|Pregunta de práctica|Pergunta de prática|练习题|Question d’entraînement
Not enough evidence|評価に十分な記録がありません|Evidencia insuficiente|Evidências insuficientes|证据不足|Éléments insuffisants
All day|終日|Todo el día|O dia todo|全天|Toute la journée
By creating an account, you agree to our|アカウントを作成すると、次の規約に同意したものとします：|Al crear una cuenta, aceptas nuestros|Ao criar uma conta, você concorda com nossos|创建账号即表示你同意我们的|En créant un compte, vous acceptez nos
. Read how we use your information in our|。情報の取り扱いについては、次のポリシーをご確認ください：|. Consulta cómo utilizamos tus datos en nuestra|. Saiba como usamos suas informações em nossa|。了解我们如何使用你的信息，请阅读我们的|. Découvrez comment nous utilisons vos données dans notre
Photo|写真|Foto|Foto|照片|Photo
Illustrated|イラスト|Ilustrado|Ilustrado|插画|Illustré
Build your {0} communication skills at {1}.|{1}レベルの{0}コミュニケーション力を身につけましょう。|Desarrolla tus habilidades de comunicación en {0} en el nivel {1}.|Desenvolva suas habilidades de comunicação em {0} no nível {1}.|培养你的{0}沟通能力，达到{1}课程的要求。|Développez vos compétences de communication en {0} au niveau {1}.
In progress · {0}/{1} questions|学習中 · {0}/{1}問|En curso · {0}/{1} preguntas|Em andamento · {0}/{1} perguntas|进行中 · {0}/{1}题|En cours · {0}/{1} questions
Understanding check {0}% · Recording / writing feedback is in skill submissions|理解度チェック {0}% · 録音・作文へのフィードバックは技能別の提出記録で確認できます。|Comprobación de comprensión: {0}% · Los comentarios sobre grabaciones y textos están en tus entregas de habilidades.|Verificação de compreensão: {0}% · O feedback de gravações e textos está nas entregas de habilidades.|理解检测 {0}% · 录音和写作反馈见技能提交记录。|Vérification de compréhension : {0}% · Les retours sur vos enregistrements et écrits figurent dans vos travaux par compétence.
Latest {0}% · Best {1}%|最新 {0}% · 最高 {1}%|Último: {0}% · Mejor: {1}%|Último: {0}% · Melhor: {1}%|最近 {0}% · 最佳 {1}%|Dernier : {0}% · Meilleur : {1}%
Mastered|習得済み|Dominado|Dominado|已掌握|Maîtrisé
Review recommended|復習がおすすめ|Repaso recomendado|Revisão recomendada|建议复习|Révision conseillée
Try these words again: {0}.|もう一度練習しましょう：{0}。|Practica estas palabras de nuevo: {0}.|Pratique estas palavras novamente: {0}.|请再次练习这些词语：{0}。|Réessayez ces mots : {0}.
{0} of the latest {1} scored records are below 80%. Review the evidence before practising again.|直近{1}件の採点済み記録のうち、{0}件が80%未満です。もう一度練習する前に記録を確認しましょう。|De los últimos {1} registros puntuados, {0} están por debajo del 80%. Revisa las evidencias antes de practicar de nuevo.|Dos últimos {1} registros pontuados, {0} estão abaixo de 80%. Confira as evidências antes de praticar novamente.|最近{1}条已评分记录中，有{0}条低于80%。请先查看记录，再进行练习。|Parmi les {1} derniers résultats notés, {0} sont inférieurs à 80 %. Consultez les éléments enregistrés avant de vous entraîner de nouveau.
Your teacher’s observation is saved below. AI can help interpret the next step.|講師の所見は下に保存されています。AIを使って次の練習を考えることもできます。|La observación de tu profesor está guardada debajo. La IA puede ayudarte a definir el siguiente paso.|A observação do seu professor está salva abaixo. A IA pode ajudar a definir o próximo passo.|老师的观察记录保存在下方。AI可以帮助你明确下一步。|L’observation de votre professeur est enregistrée ci-dessous. L’IA peut vous aider à déterminer la suite.
Recent results are strong. Use a new context to check that the skill transfers.|最近の成績は良好です。別の場面でも使えるか試してみましょう。|Tus resultados recientes son buenos. Prueba otro contexto para comprobar que puedes aplicar lo aprendido.|Seus resultados recentes são bons. Pratique em outro contexto para verificar se consegue aplicar o que aprendeu.|近期表现良好。请在新情境中检验能否运用所学技能。|Vos résultats récents sont solides. Essayez un nouveau contexte pour vérifier que vous savez y appliquer cette compétence.
One result is a starting point; more attempts will show whether this difficulty repeats.|一つの結果は出発点です。練習を重ねると、同じ難しさが繰り返されているか分かります。|Un resultado es un punto de partida; con más intentos verás si esta dificultad se repite.|Um resultado é um ponto de partida; com mais tentativas, será possível ver se a dificuldade se repete.|一次结果只是起点；更多练习能帮助判断该困难是否反复出现。|Un résultat est un point de départ ; d’autres essais permettront de voir si cette difficulté se répète.
Conversation video: {0}|会話動画：{0}|Vídeo de conversación: {0}|Vídeo de conversa: {0}|对话视频：{0}|Vidéo de conversation : {0}
Captioned visual recap: {0}|字幕付きの図解まとめ：{0}|Resumen visual con subtítulos: {0}|Resumo visual com legendas: {0}|带字幕的图像回顾：{0}|Récapitulatif visuel sous-titré : {0}
Optional copying pad for {0}|{0}の書き写し練習（任意）|Práctica de escritura opcional para {0}|Prática de escrita opcional para {0}|{0}的可选临摹练习|Zone de copie facultative pour {0}
Install a {0} voice on this device, or retry the studio voice.|この端末に{0}の音声を追加するか、スタジオ音声を再試行してください。|Instala una voz de {0} en este dispositivo o vuelve a intentar la voz de estudio.|Instale uma voz de {0} neste dispositivo ou tente novamente a voz de estúdio.|请在此设备上安装{0}语音，或重试录音室语音。|Installez une voix en {0} sur cet appareil ou réessayez la voix de studio.
Request failed ({0})|リクエストに失敗しました（{0}）|La solicitud falló ({0})|A solicitação falhou ({0})|请求失败（{0}）|Échec de la requête ({0})
{0}% · {1} questions|{0}% · {1}問|{0}% · {1} preguntas|{0}% · {1} perguntas|{0}% · {1}题|{0}% · {1} questions
words|語|palabras|palavras|词|mots
characters|文字|caracteres|caracteres|字|caractères
`;
export const interfaceReliabilityCopy=Object.fromEntries(rows.trim().split('\n').map(line=>{const [key,...values]=line.split('|');if(values.length!==5)throw Error('Missing interface template translation: '+key);return [key,Object.fromEntries(['ja','es','pt','zh','fr'].map((lang,i)=>[lang,values[i]]))]}));

// These authored headings are composed in the skill catalog. Bundle every band
// so saved records never depend on a translation provider or its cache.
const skillTitleParts={
 'Listen for meaning':['意味を聞き取る','Escuchar para comprender','Ouvir para compreender','听懂含义','Écouter pour comprendre'],
 'Write with purpose':['目的に合わせて書く','Escribir con un propósito','Escrever com um objetivo','有目的地写作','Écrire avec un objectif'],
 'Speak in your own words':['自分の言葉で話す','Hablar con tus propias palabras','Falar com suas próprias palavras','用自己的话表达','Parler avec ses propres mots'],
 Japanese:['日本語','Japonés','Japonês','日语','Japonais'],
 'Portuguese (Brazil)':['ポルトガル語（ブラジル）','Portugués (Brasil)','Português (Brasil)','葡萄牙语（巴西）','Portugais (Brésil)'],
 English:['英語','Inglés','Inglês','英语','Anglais'],
 Listening:['リスニング','Comprensión oral','Compreensão oral','听力','Compréhension orale'],
 Writing:['ライティング','Expresión escrita','Expressão escrita','写作','Expression écrite'],
 Speaking:['スピーキング','Expresión oral','Expressão oral','口语','Expression orale']
};
for(const band of ['A1','A2','B1','B2','C1']){
 for(const base of ['Listen for meaning','Write with purpose','Speak in your own words'])interfaceReliabilityCopy[base+' · '+band]=Object.fromEntries(['ja','es','pt','zh','fr'].map((locale,i)=>[locale,skillTitleParts[base][i]+' · '+band]));
 for(const language of ['Japanese','Portuguese (Brazil)','English'])for(const skill of ['Listening','Writing','Speaking'])interfaceReliabilityCopy[language+' · '+skill+' · '+band]=Object.fromEntries(['ja','es','pt','zh','fr'].map((locale,i)=>[locale,skillTitleParts[language][i]+' · '+skillTitleParts[skill][i]+' · '+band]));
}
