import {catalogInterfaceCopy} from './catalog-interface-copy.mjs';
import {expansionDisplayCopy} from './expansion-display-copy.mjs';
import {idiomReviewedCopy} from './idiom-display-copy.mjs';
// Editorial course headings: English source | Japanese | Spanish | Brazilian Portuguese | Simplified Chinese | French.
// These overrides take precedence over generated translations and saved caches.
const rows=`
Meeting new people|初対面の人と話す|Conocer gente nueva|Conhecer pessoas novas|认识新朋友|Faire de nouvelles rencontres
Ser and estar|serとestarの使い分け|Ser y estar: cuándo usar cada uno|Ser e estar em espanhol|区分 ser 和 estar|Distinguer ser et estar
A day in your life|一日の習慣を話す|Hablar de tu día a día|Falar sobre seu dia a dia|介绍日常生活|Parler de son quotidien
At the café|カフェで注文する|En la cafetería|Na cafeteria|在咖啡馆点单|Commander au café
Yesterday’s story|昨日の出来事を話す|Contar lo que hiciste ayer|Contar o que você fez ontem|讲述昨天的经历|Raconter sa journée d’hier
Make a plan|予定を立てる|Hacer planes|Fazer planos|制定计划|Faire des projets
Spanish rhythm workout|スペイン語のリズムを練習する|Practicar el ritmo del español|Praticar o ritmo do espanhol|练习西班牙语的节奏|Travailler le rythme de l’espagnol
Find your way|道案内を聞き取る|Orientarse y seguir indicaciones|Se orientar e seguir instruções|听懂指路信息|Se repérer et suivre un itinéraire
Por or para without pausing|porとparaを自然に使い分ける|Usar por y para con soltura|Usar por e para com naturalidade em espanhol|熟练区分 por 和 para|Utiliser por et para avec aisance
Make the subjunctive automatic|接続法を自然に使う|Usar el subjuntivo con soltura|Usar o subjuntivo com naturalidade|熟练运用虚拟式|Utiliser le subjonctif avec aisance
Connect your ideas|考えをつなげて伝える|Conectar ideas|Conectar ideias|连贯地表达想法|Relier ses idées
Write a clear travel message|旅行に関する用件を明確に書く|Escribir un mensaje claro sobre un viaje|Escrever uma mensagem clara sobre uma viagem|写清楚旅行相关的事项|Rédiger un message clair pour un voyage
Airport conversations|空港でのやり取りを聞く|Conversaciones en el aeropuerto|Conversas no aeroporto|听懂机场对话|Comprendre les échanges à l’aéroport
Hear the speaker’s position|話し手の立場を聞き取る|Identificar la postura del hablante|Identificar a posição de quem fala|听懂说话者的立场|Identifier le point de vue de la personne qui parle
Imagine another possibility|仮定の状況を話す|Hablar de situaciones hipotéticas|Falar de situações hipotéticas|谈论假设的情境|Parler de situations hypothétiques
Build a balanced argument|両面を踏まえて意見を述べる|Construir un argumento equilibrado|Construir um argumento equilibrado|兼顾不同角度提出观点|Construire une argumentation équilibrée
Choose the right register|場面に合う言葉遣いを選ぶ|Elegir el registro adecuado|Escolher o registro adequado|选择适合场合的表达|Choisir le registre adapté
Read between the lines|行間の意味を読み取る|Leer entre líneas|Ler nas entrelinhas|理解言外之意|Lire entre les lignes
Make a careful claim|根拠に合わせて慎重に述べる|Formular una afirmación con cautela|Fazer uma afirmação com cautela|根据依据谨慎表达观点|Formuler une affirmation avec prudence
Draw a nuanced conclusion|細かな違いを踏まえて結論を出す|Llegar a una conclusión matizada|Chegar a uma conclusão com nuances|考虑细微差别后得出结论|Formuler une conclusion nuancée
Present: regular -ar, -er and -ir verbs|現在形：-ar・-er・-ir規則動詞|Presente: verbos regulares en -ar, -er e -ir|Presente em espanhol: verbos regulares em -ar, -er e -ir|现在时：-ar、-er 和 -ir 规则动词|Présent : verbes réguliers en -ar, -er et -ir
Present: irregular forms and stem changes|現在形：不規則活用と語幹変化|Presente: formas irregulares y cambios de raíz|Presente em espanhol: formas irregulares e mudanças no radical|现在时：不规则形式与词干变化|Présent : formes irrégulières et changements de radical
Preterite: completed past events|点過去：完了した出来事|Pretérito indefinido: hechos terminados|Pretérito indefinido em espanhol: acontecimentos concluídos|简单过去时：已完成的事件|Passé simple espagnol : événements achevés
Imperfect: background and past habits|線過去：背景と過去の習慣|Pretérito imperfecto: contexto y hábitos del pasado|Pretérito imperfeito em espanhol: contexto e hábitos do passado|未完成过去时：背景与过去的习惯|Imparfait : contexte et habitudes du passé
Present perfect: haber + participle|現在完了：haber＋過去分詞|Pretérito perfecto compuesto: haber + participio|Pretérito perfecto compuesto em espanhol: haber + particípio|现在完成时：haber＋过去分词|Passé composé espagnol : haber + participe passé
Pluperfect: an earlier past|過去完了：過去より前の出来事|Pluscuamperfecto: un hecho anterior a otro hecho pasado|Mais-que-perfeito em espanhol: um passado anterior a outro|过去完成时：过去某一时刻之前的事件|Plus-que-parfait : un événement antérieur à un autre
Simple future: keep the infinitive|未来形：不定詞に語尾を付ける|Futuro simple: añadir terminaciones al infinitivo|Futuro simples em espanhol: acrescentar terminações ao infinitivo|简单将来时：在不定式后加词尾|Futur simple : ajouter les terminaisons à l’infinitif
Conditional: would and polite requests|条件法：仮定の結果と丁寧な依頼|Condicional: hipótesis y peticiones corteses|Condicional: hipóteses e pedidos educados|条件式：假设与礼貌请求|Conditionnel : hypothèses et demandes polies
Present subjunctive: form before fluency|接続法現在：活用の基本|Presente de subjuntivo: dominar las formas|Presente do subjuntivo: dominar as formas|虚拟式现在时：掌握基本形式|Subjonctif présent : maîtriser les formes
Imperfect subjunctive: the -ra pattern|接続法過去：-ra型の活用|Imperfecto de subjuntivo: formas en -ra|Imperfeito do subjuntivo em espanhol: formas em -ra|虚拟式未完成过去时：-ra 形式|Subjonctif imparfait espagnol : formes en -ra
Present perfect subjunctive: haya + participle|接続法現在完了：haya＋過去分詞|Pretérito perfecto de subjuntivo: haya + participio|Pretérito perfeito composto do subjuntivo em espanhol: haya + particípio|虚拟式现在完成时：haya＋过去分词|Subjonctif passé espagnol : haya + participe passé
Past perfect subjunctive: an unreal earlier past|接続法過去完了：実際と異なる過去を想定する|Pluscuamperfecto de subjuntivo: hipótesis sobre el pasado|Mais-que-perfeito do subjuntivo: hipóteses sobre o passado|虚拟式过去完成时：与事实不符的过去假设|Subjonctif plus-que-parfait : hypothèses sur le passé
Food: words you can order with|食べ物：注文に使える語彙|Comida: vocabulario para pedir|Comida: vocabulário para fazer pedidos|食物：点单实用词汇|Alimentation : du vocabulaire pour commander
Around town: places and directions|街の場所と道案内|Por la ciudad: lugares e indicaciones|Pela cidade: lugares e direções|城市中的地点与方向|En ville : lieux et itinéraires
Travel: bookings and problems|旅行：予約とトラブル対応|Viajes: reservas e imprevistos|Viagens: reservas e imprevistos|旅行：预订与问题处理|Voyages : réservations et imprévus
Work and study: useful combinations|仕事と勉強：よく使う語の組み合わせ|Trabajo y estudios: combinaciones útiles|Trabalho e estudo: combinações úteis|工作与学习：实用词语搭配|Travail et études : associations de mots utiles
Polite contact: three small essentials|丁寧なやり取りの基本表現3つ|Tres expresiones básicas de cortesía|Três expressões básicas de cortesia|礼貌交流的三个基本表达|Trois expressions essentielles de politesse
Ask again without losing the conversation|会話を止めずに聞き返す|Pedir que repitan sin perder el hilo|Pedir para repetir sem perder o fio da conversa|在不中断交流的情况下请对方重复|Faire répéter sans perdre le fil
Needs with tener|tenerで状態や欲求を伝える|Expresar necesidades con tener|Expressar necessidades com tener em espanhol|用 tener 表达需求和感受|Exprimer ses besoins avec tener
Time and routine as chunks|時間と習慣を表す定番表現|Expresiones de tiempo y rutina|Expressões de tempo e rotina|表达时间与习惯的常用语|Expressions courantes de temps et de routine
Make plans naturally|自然な表現で予定を立てる|Hacer planes con naturalidad|Fazer planos com naturalidade|自然地商量计划|Faire des projets avec naturel
Requests and reassurance|依頼と安心させる返答|Pedir ayuda y tranquilizar|Pedir ajuda e tranquilizar|提出请求与让人安心的回应|Demander de l’aide et rassurer
Frequency, punctuality and duration|頻度・時間厳守・継続期間を表す|Frecuencia, puntualidad y duración|Frequência, pontualidade e duração|表达频率、准时与持续时间|Exprimer la fréquence, la ponctualité et la durée
Describe how an experience went|体験がどうだったかを話す|Contar cómo fue una experiencia|Contar como foi uma experiência|描述一次经历的结果|Raconter comment une expérience s’est passée
Clarify, reformulate and add a point|説明を補い、言い換え、要点を加える|Aclarar, reformular y añadir una idea|Esclarecer, reformular e acrescentar uma ideia|澄清、换一种说法并补充观点|Clarifier, reformuler et ajouter une idée
Agreement, reasons and alternatives|賛同・理由・別の案を伝える|Expresar acuerdo, razones y alternativas|Expressar concordância, motivos e alternativas|表达赞同、理由与其他方案|Exprimer son accord, donner des raisons et proposer une autre option
Help, attention and ease|手助け・注意・簡単さを表す慣用句|Expresiones para ayudar, prestar atención y hablar de facilidad|Expressões de ajuda, atenção e facilidade|关于帮助、注意与轻松的惯用语|Expressions d’aide, d’attention et de facilité
Realise, care and connect|気づき・関心・つながりを表す|Expresar que te das cuenta, te importa o conectas ideas|Expressar percepção, interesse e conexão|表达察觉、关心与联系|Exprimer une prise de conscience, un intérêt ou un lien
Weigh options before deciding|選択肢を比較して決める|Comparar opciones antes de decidir|Comparar opções antes de decidir|比较选项后做决定|Comparer les options avant de décider
Collaborate and put plans into action|協力して計画を実行する|Colaborar y llevar los planes a la práctica|Colaborar e colocar os planos em prática|合作并落实计划|Collaborer et mettre les projets en œuvre
Pressure, mistakes and distraction|プレッシャー・失敗・気の散りを表す|Hablar de presión, errores y distracciones|Falar de pressão, erros e distrações|表达压力、失误与分心|Parler de pression, d’erreurs et de distractions
Effort, cost and persistence|努力・負担・粘り強さを表す|Hablar de esfuerzo, coste y perseverancia|Falar de esforço, custo e persistência|表达努力、代价与坚持|Parler d’effort, de coût et de persévérance
Evidence without overclaiming|根拠から言える範囲で述べる|Presentar pruebas sin exagerar las conclusiones|Apresentar evidências sem exagerar as conclusões|根据依据表达，避免过度推断|Présenter les éléments disponibles sans exagérer les conclusions
Qualify and organise an argument|主張の範囲を明確にして論を組み立てる|Matizar y organizar un argumento|Fazer ressalvas e organizar um argumento|明确观点的适用范围并组织论述|Nuancer et structurer une argumentation
Switch between vivid and formal language|くだけた表現と改まった表現を使い分ける|Alternar entre lenguaje expresivo y formal|Alternar entre linguagem expressiva e formal|区分生动表达与正式表达|Passer d’un langage imagé à un registre formel
Chapter checkpoint|章の確認テスト|Prueba de repaso del capítulo|Teste de revisão do capítulo|章节检测|Test de fin de chapitre
Past imperfect or past progressive?|過去の習慣・背景と過去進行形の使い分け|Imperfecto y pasado progresivo: diferencias y coincidencias|Imperfeito e passado progressivo: diferenças e semelhanças|未完成过去时与过去进行时：区别与重合|Imparfait et passé progressif : différences et points communs
Introduce yourself|自己紹介をする|Presentarte|Se apresentar|做自我介绍|Se présenter
Identity and current state|人の特徴と今の状態を伝える|Identidad y estado actual|Identidade e estado atual|表达身份与当前状态|Exprimer l’identité et l’état actuel
Third-person routines|三人称で日常の習慣を話す|Hablar de rutinas en tercera persona|Falar de rotinas na terceira pessoa|用第三人称描述日常习惯|Parler des habitudes d’une autre personne
Order at a café|カフェで注文する|Pedir en una cafetería|Fazer um pedido na cafeteria|在咖啡馆点单|Commander au café
Questions with do and does|do・doesを使った疑問文|Preguntas con do y does|Perguntas com do e does|用 do 和 does 提问|Poser des questions avec do et does
Present-simple negatives|現在形の否定文|Negaciones en presente simple|Frases negativas no presente simples|一般现在时的否定句|Former des phrases négatives au présent simple
Food quantities|食べ物の量を表す|Expresar cantidades de comida|Expressar quantidades de alimentos|表达食物的数量|Exprimer des quantités d’aliments
Places in town|街にある場所の名前|Lugares de la ciudad|Lugares da cidade|城市中的地点|Les lieux en ville
Polite interruptions|丁寧に声をかける|Interrumpir con educación|Interromper com educação|礼貌地打断或搭话|Interrompre poliment
Ask someone to repeat|聞き取れなかったときに聞き返す|Pedir que repitan|Pedir para repetir|请对方重复|Demander de répéter
Express a need|必要なことを伝える|Expresar una necesidad|Expressar uma necessidade|表达需求|Exprimer un besoin
Times of day|一日の時間帯を表す|Los momentos del día|Os períodos do dia|一天中的时间段|Les moments de la journée
Completed past actions|完了した過去の出来事を話す|Acciones terminadas en el pasado|Ações concluídas no passado|描述已完成的过去事件|Parler d’actions passées achevées
Arrange a meeting|会う日時を決める|Acordar cuándo y dónde quedar|Combinar um encontro|约定见面的时间与地点|Organiser un rendez-vous
Word stress in compound nouns|複合名詞の強勢を聞き分ける|El acento en los sustantivos compuestos|A sílaba tônica em substantivos compostos|辨别复合名词的重音|Repérer l’accent dans les noms composés
Follow directions|道案内を理解する|Seguir indicaciones|Seguir instruções de caminho|听懂指路信息|Suivre un itinéraire
Past-simple questions|過去形の疑問文|Preguntas en pasado simple|Perguntas no passado simples|一般过去时的疑问句|Poser des questions au prétérit anglais
Past background actions|過去の場面で進行中だった動作|Acciones en curso como contexto del pasado|Ações em andamento como contexto do passado|作为过去背景的进行中动作|Décrire une action en cours dans le passé
Booking a room|部屋を予約する|Reservar una habitación|Reservar um quarto|预订房间|Réserver une chambre
Work deadlines|仕事の締め切りを伝える|Plazos de trabajo|Prazos de trabalho|表达工作截止时间|Parler des délais au travail
Make a suggestion|提案をする|Hacer una sugerencia|Fazer uma sugestão|提出建议|Faire une suggestion
Respond to a request|依頼に返答する|Responder a una petición|Responder a um pedido|回应请求|Répondre à une demande
Frequency expressions|頻度を表す表現|Expresiones de frecuencia|Expressões de frequência|表达频率|Exprimer la fréquence
Describe an outcome|結果を伝える|Describir un resultado|Descrever um resultado|描述结果|Décrire un résultat
Purpose with infinitives|不定詞で目的を表す|Expresar finalidad con infinitivos|Expressar finalidade com infinitivos|用不定式表达目的|Exprimer le but avec un infinitif
Possibility with modals|助動詞で可能性を表す|Expresar posibilidad con verbos modales|Expressar possibilidade com verbos modais|用情态动词表达可能性|Exprimer une possibilité avec les verbes modaux
Read cause and contrast|理由と対比の関係を読み取る|Identificar causas y contrastes|Identificar causa e contraste|读懂原因与对比关系|Repérer les causes et les contrastes
Write a clear request|依頼内容を明確に書く|Escribir una petición clara|Escrever um pedido claro|清楚地写出请求|Rédiger une demande claire
Experience without a finished time|時点を特定せず経験を話す|Hablar de experiencias sin indicar cuándo ocurrieron|Falar de experiências sem indicar quando aconteceram|不指定具体时间地谈论经历|Parler d’expériences sans préciser quand elles ont eu lieu
An earlier past|過去の出来事より前のことを話す|Un hecho anterior a otro hecho pasado|Um acontecimento anterior a outro no passado|表达过去事件之前发生的事|Parler d’un événement antérieur à un autre
Future decisions and predictions|未来の決定と予測を伝える|Decisiones y predicciones sobre el futuro|Decisões e previsões sobre o futuro|表达未来的决定与预测|Exprimer des décisions et des prévisions
Hypothetical results|仮定した場合の結果を伝える|Resultados de situaciones hipotéticas|Resultados de situações hipotéticas|表达假设情境下的结果|Exprimer les conséquences d’une hypothèse
Reformulate an idea|考えを言い換える|Reformular una idea|Reformular uma ideia|换一种说法表达想法|Reformuler une idée
Offer an alternative|別の案を提案する|Proponer una alternativa|Propor uma alternativa|提出其他方案|Proposer une autre option
Help someone|手助けするときの表現|Ofrecer ayuda|Oferecer ajuda|表达帮助他人的意愿|Proposer son aide
Realise something|気づいたことを伝える|Expresar que te has dado cuenta de algo|Expressar que você percebeu algo|表达自己的发现|Exprimer une prise de conscience
Hear corrected travel information|訂正された旅行情報を聞き取る|Entender correcciones en la información de viaje|Entender correções nas informações de viagem|听懂更正后的旅行信息|Comprendre une rectification dans les informations de voyage
Hear qualified support|条件や留保のある賛同を聞き取る|Identificar un apoyo con reservas|Identificar apoio com ressalvas|听懂有所保留的支持|Comprendre un soutien assorti de réserves
Counterfactual present conditions|現在の事実と異なる状況を仮定する|Condiciones contrarias a la realidad presente|Condições contrárias à realidade presente|假设与当前事实不符的情境|Formuler une hypothèse contraire à la réalité présente
Identify the writer's qualification|書き手が示す条件や留保を読み取る|Identificar las reservas del autor|Identificar as ressalvas de quem escreve|识别作者提出的条件或保留意见|Repérer les réserves de l’auteur
Present perfect continuous|現在完了進行形|Presente perfecto continuo en inglés|Presente perfeito contínuo em inglês|现在完成进行时|Le present perfect continu en anglais
Past unreal conditions|過去の事実と異なる状況を仮定する|Condiciones contrarias a la realidad pasada|Condições contrárias à realidade passada|假设与过去事实不符的情境|Formuler une hypothèse contraire à la réalité passée
Weigh alternatives|選択肢を比較する|Comparar alternativas|Comparar alternativas|比较不同方案|Comparer les options
Put a plan into action|計画を実行する|Poner un plan en práctica|Colocar um plano em prática|落实计划|Mettre un projet en œuvre
Work under pressure|プレッシャーの中で働く|Trabajar bajo presión|Trabalhar sob pressão|在压力下工作|Travailler sous pression
Persistence after setbacks|困難があっても続ける|Seguir adelante tras un contratiempo|Persistir após um contratempo|遇到挫折后继续坚持|Persévérer après un revers
Formal requests without excess|簡潔で丁寧な依頼をする|Peticiones formales sin complicaciones|Pedidos formais sem excessos|提出简洁得体的正式请求|Formuler une demande formelle sans lourdeur
Interpret implied reservations|暗に示された懸念を読み取る|Interpretar reservas implícitas|Interpretar ressalvas implícitas|理解隐含的保留意见|Interpréter des réserves implicites
Limit a causal claim|因果関係を慎重に述べる|Matizar una afirmación de causalidad|Fazer ressalvas ao afirmar uma relação de causa|谨慎表述因果关系|Nuancer une affirmation de causalité
Synthesize with limitations|根拠の限界を踏まえて要点をまとめる|Sintetizar teniendo en cuenta las limitaciones|Sintetizar considerando as limitações|在考虑局限的前提下综合要点|Faire une synthèse en tenant compte des limites
Past deductions|過去の出来事を推測する|Hacer deducciones sobre el pasado|Fazer deduções sobre o passado|推测过去发生的事|Faire des déductions sur le passé
Regret about an earlier past|過去の出来事への後悔を表す|Expresar arrepentimiento sobre el pasado|Expressar arrependimento sobre o passado|表达对过去的后悔|Exprimer un regret sur le passé
Evidence-sensitive conclusions|根拠の強さに合った結論を述べる|Formular conclusiones acordes con las pruebas|Formular conclusões compatíveis com as evidências|根据依据的强弱得出结论|Formuler des conclusions adaptées aux éléments disponibles
Add an explicit qualification|条件や留保を明確に付け加える|Añadir una reserva explícita|Acrescentar uma ressalva explícita|明确补充条件或保留意见|Ajouter une réserve explicite
Recognise understated criticism|控えめな表現に含まれる批判を読み取る|Reconocer una crítica discreta|Reconhecer uma crítica sutil|识别委婉表达中的批评|Reconnaître une critique discrète
Choose a suitable register|場面に合う言葉遣いを選ぶ|Elegir el registro adecuado|Escolher o registro adequado|选择适合场合的表达|Choisir le registre adapté
Introduce yourself in Brazilian Portuguese|ブラジルのポルトガル語で自己紹介する|Presentarte en portugués de Brasil|Se apresentar em português brasileiro|用巴西葡萄牙语做自我介绍|Se présenter en portugais du Brésil
Ser for identity, estar for a current state|serで特徴を、estarで今の状態を伝える|Ser para la identidad y estar para el estado actual|Ser para identidade e estar para o estado atual|用 ser 表达身份，用 estar 表达当前状态|Ser pour l’identité, estar pour l’état actuel
Present-tense routines|現在形で日常の習慣を話す|Hablar de rutinas en presente|Falar de rotinas no presente|用现在时描述日常习惯|Parler des habitudes au présent
Hear a café order|カフェでの注文を聞き取る|Entender un pedido en una cafetería|Entender um pedido na cafeteria|听懂咖啡馆点单|Comprendre une commande au café
Regular -er and -ir present forms|現在形：-er・-ir規則動詞|Presente: verbos regulares en -er e -ir|Presente: verbos regulares em -er e -ir|现在时：-er 和 -ir 规则动词|Présent : verbes réguliers en -er et -ir
Common irregular present forms|よく使う動詞の不規則な現在形|Formas irregulares frecuentes del presente|Formas irregulares comuns do presente|常用动词的不规则现在时形式|Les formes irrégulières courantes du présent
Buy food by quantity|数量を伝えて食べ物を買う|Comprar comida indicando la cantidad|Comprar alimentos indicando a quantidade|按数量购买食物|Acheter des aliments en précisant la quantité
Find places in town|街の場所を探す|Encontrar lugares en la ciudad|Encontrar lugares na cidade|寻找城市中的地点|Trouver un lieu en ville
Get attention politely|丁寧に声をかける|Llamar la atención con educación|Chamar a atenção com educação|礼貌地引起对方注意|Attirer l’attention poliment
Ask for repetition|聞き取れなかったときに聞き返す|Pedir que repitan|Pedir para repetir|请对方重复|Demander de répéter
State what you need to do|する必要があることを伝える|Decir lo que necesitas hacer|Dizer o que você precisa fazer|说明需要做的事|Dire ce qu’il faut faire
Everyday time combinations|日常で使う時間の表現|Expresiones de tiempo cotidianas|Expressões de tempo do dia a dia|日常时间表达|Les expressions de temps du quotidien
Completed events with the perfect past|直説法完全過去で完了した出来事を話す|Hechos terminados con el pretérito perfeito portugués|Acontecimentos concluídos com o pretérito perfeito|用葡萄牙语简单过去时表达已完成的事件|Exprimer un événement achevé avec le pretérito perfeito portugais
Make a near-future plan|近い未来の予定を立てる|Hacer planes para el futuro próximo|Fazer planos para o futuro próximo|制定近期计划|Faire des projets pour un avenir proche
Hear and produce nasal vowels|鼻母音を聞き分けて発音する|Distinguir y pronunciar vocales nasales|Distinguir e pronunciar vogais nasais|辨别并发出鼻化元音|Distinguer et prononcer les voyelles nasales
Follow street directions|街での道案内を聞き取る|Seguir indicaciones por la ciudad|Seguir instruções de caminho pela cidade|听懂街道上的指路信息|Suivre un itinéraire en ville
Background and repeated past actions|過去の背景と繰り返しの動作を表す|Describir el contexto y acciones habituales del pasado|Descrever o contexto e ações habituais do passado|描述过去的背景与反复发生的动作|Décrire le contexte et les habitudes du passé
An event inside a past background|過去の背景の中で起きた出来事を話す|Un acontecimiento dentro de un contexto pasado|Um acontecimento em meio a uma situação passada|描述过去背景中发生的事件|Raconter un événement dans son contexte passé
Hotel reservations|ホテルを予約する|Reservar un hotel|Reservar um hotel|预订酒店|Réserver un hôtel
Work and deadlines|仕事と締め切りについて話す|Hablar del trabajo y los plazos|Falar sobre trabalho e prazos|谈论工作与截止时间|Parler du travail et des délais
Suggest an activity|一緒にすることを提案する|Proponer una actividad|Sugerir uma atividade|提议一起做某事|Proposer une activité
Accept a practical request|日常の依頼に応じる|Aceptar una petición cotidiana|Aceitar um pedido do dia a dia|答应日常请求|Accepter une demande du quotidien
Describe occasional habits|ときどきすることを話す|Hablar de hábitos ocasionales|Falar de hábitos ocasionais|描述偶尔做的事|Parler de ses habitudes occasionnelles
Tell how something turned out|どういう結果になったかを話す|Contar cómo salió algo|Contar como algo acabou|描述事情最后的结果|Raconter comment les choses se sont passées
Purpose with para|paraで目的を表す|Expresar finalidad con para|Expressar finalidade com para|用 para 表达目的|Exprimer le but avec para
Uncertainty with talvez|talvezで不確かさを表す|Expresar incertidumbre con talvez|Expressar incerteza com talvez|用 talvez 表达不确定性|Exprimer l’incertitude avec talvez
Read contrast and consequence|対比と結果の関係を読み取る|Identificar contraste y consecuencia|Identificar contraste e consequência|读懂对比与结果关系|Repérer le contraste et la conséquence
Write a specific polite request|具体的で丁寧な依頼を書く|Escribir una petición concreta y cortés|Escrever um pedido específico e educado|写出具体且礼貌的请求|Rédiger une demande précise et polie
Repeated activity up to now|今まで繰り返してきたことを話す|Hablar de acciones repetidas hasta ahora|Falar de ações repetidas até agora|描述一直到现在反复发生的动作|Parler d’actions répétées jusqu’à présent
An event before another past event|過去の出来事より前に起きたことを話す|Un hecho anterior a otro hecho pasado|Um acontecimento anterior a outro no passado|描述过去事件之前发生的事|Parler d’un événement antérieur à un autre
Future conditions with se|seで未来の条件を表す|Condiciones futuras con se en portugués|Condições futuras com se|用 se 表达未来条件|Exprimer une condition future avec se
Hypothetical present results|現在の仮定に対する結果を述べる|Resultados de una hipótesis sobre el presente|Resultados de uma hipótese sobre o presente|表达关于现在的假设结果|Exprimer les conséquences d’une hypothèse au présent
Rephrase for clarity|わかりやすく言い換える|Reformular para aclarar|Reformular para esclarecer|换一种说法让意思更清楚|Reformuler pour clarifier
Replace one action with another|「〜の代わりに」で別の行動を伝える|Hacer una cosa en lugar de otra|Fazer uma coisa em vez de outra|表达做一件事而不做另一件事|Faire une chose à la place d’une autre
Ask for a helping hand|手助けを頼む|Pedir una mano|Pedir uma mãozinha|请别人帮忙|Demander un coup de main
Describe a moment of realization|気づいた瞬間を話す|Contar el momento en que te diste cuenta de algo|Contar o momento em que você percebeu algo|描述意识到某件事的时刻|Raconter le moment où l’on a compris quelque chose
Hear corrected departure information|訂正された出発情報を聞き取る|Entender cambios en la información de salida|Entender mudanças nas informações de partida|听懂更正后的出发信息|Comprendre une modification des informations de départ
Unreal present conditions|現在の事実と異なる状況を仮定する|Hipótesis contrarias a la realidad presente|Hipóteses contrárias à realidade presente|假设与当前事实不符的情境|Formuler une hypothèse contraire à la réalité présente
Read conditions attached to approval|承認に付けられた条件を読み取る|Identificar las condiciones de una aprobación|Identificar as condições de uma aprovação|读懂同意时附带的条件|Repérer les conditions d’une approbation
Present subjunctive after a recommendation|勧める表現の後で接続法現在を使う|Presente de subjuntivo después de una recomendación|Presente do subjuntivo após uma recomendação|在建议表达后使用虚拟式现在时|Employer le subjonctif présent après une recommandation
Past counterfactual conditions|過去の事実と異なる状況を仮定する|Hipótesis contrarias a la realidad pasada|Hipóteses contrárias à realidade passada|假设与过去事实不符的情境|Formuler une hypothèse contraire à la réalité passée
Weigh alternatives before deciding|選択肢を比較して決める|Comparar alternativas antes de decidir|Comparar alternativas antes de decidir|比较不同方案后做决定|Comparer les options avant de décider
Apply a shared plan|一緒に立てた計画を実行する|Poner en práctica un plan común|Colocar um plano conjunto em prática|落实共同制定的计划|Mettre en œuvre un projet commun
Handle competing responsibilities|複数の役割や仕事をやりくりする|Gestionar responsabilidades que compiten entre sí|Lidar com responsabilidades que disputam seu tempo|协调同时面临的多项任务|Gérer plusieurs responsabilités à la fois
Persist through difficulty|困難の中でも続ける|Perseverar ante las dificultades|Persistir diante das dificuldades|在困难中坚持|Persévérer face aux difficultés
Formal written requests|改まった依頼文を書く|Peticiones formales por escrito|Pedidos formais por escrito|书写正式请求|Rédiger des demandes formelles
Read an implicit reservation|暗に示された懸念を読み取る|Identificar una reserva implícita|Identificar uma ressalva implícita|理解隐含的保留意见|Repérer une réserve implicite
Avoid overclaiming causation|因果関係を断定しすぎずに述べる|Evitar conclusiones causales excesivas|Evitar conclusões exageradas sobre causa e efeito|避免过度断言因果关系|Éviter d’affirmer une causalité sans preuves suffisantes
Synthesize a qualified recommendation|条件や留保を踏まえて提言をまとめる|Resumir una recomendación con reservas|Sintetizar uma recomendação com ressalvas|综合提出带有条件或保留的建议|Faire la synthèse d’une recommandation nuancée
Completed events under uncertainty|完了した出来事を不確かなものとして述べる|Hechos terminados expresados con incertidumbre|Acontecimentos concluídos expressos com incerteza|不确定地谈论已完成的事件|Parler d’événements achevés avec incertitude
Regret about a prior past|過去の出来事への後悔を表す|Expresar arrepentimiento sobre el pasado|Expressar arrependimento sobre o passado|表达对过去的后悔|Exprimer un regret sur le passé
Distinguish compatibility from proof|「矛盾しない」と「証明する」を区別する|Distinguir compatibilidad y prueba|Distinguir compatibilidade e prova|区分“相符”与“证明”|Distinguer compatibilité et preuve
Make a recommendation conditional|条件付きで勧める|Formular una recomendación condicionada|Fazer uma recomendação condicional|提出有条件的建议|Formuler une recommandation sous conditions
Recognize restrained criticism|控えめな表現に含まれる批判を読み取る|Reconocer una crítica discreta|Reconhecer uma crítica sutil|识别委婉表达中的批评|Reconnaître une critique discrète
Choose an informal or formal register|くだけた表現と改まった表現を選ぶ|Elegir entre un registro informal y formal|Escolher entre um registro informal e formal|选择非正式或正式表达|Choisir entre un registre familier et formel
Introduce yourself politely|丁寧に自己紹介する|Presentarte con cortesía|Se apresentar com educação|礼貌地做自我介绍|Se présenter poliment
Topic and possession|「は」と「の」で話題と所有を表す|Tema y posesión con は y の|Tópico e posse com は e の|用 は 和 の 表达话题与所属|Exprimer le thème et la possession avec は et の
Polite present routines|丁寧な現在形で習慣を話す|Hablar de rutinas con formas corteses del presente|Falar de rotinas com formas educadas do presente|用礼貌的现在时形式描述习惯|Parler des habitudes avec les formes polies du présent
Hear a simple order|簡単な注文を聞き取る|Entender un pedido sencillo|Entender um pedido simples|听懂简单点单|Comprendre une commande simple
Verb groups and polite stems|動詞の種類とます形の作り方|Grupos de verbos y formación de la forma ます|Grupos de verbos e formação da forma ます|动词类别与 ます 形的构成|Les groupes de verbes et la formation de la forme ます
Negative polite verbs|丁寧な動詞の否定形|Negación de los verbos en forma cortés|Negação dos verbos na forma educada|动词礼貌形式的否定|Former la négation des verbes à la forme polie
Food and item counters|食べ物や物の数え方|Contar alimentos y objetos|Contar alimentos e objetos|食物与物品的量词|Compter les aliments et les objets
Locations in a town|街にある場所を伝える|Ubicar lugares en la ciudad|Indicar lugares na cidade|描述城市中的位置|Indiquer un lieu en ville
Say what you want|欲しい物やしたいことを伝える|Decir lo que quieres|Dizer o que você quer|表达想要的东西或想做的事|Dire ce que l’on veut
Everyday time expressions|日常で使う時間の表現|Expresiones de tiempo cotidianas|Expressões de tempo do dia a dia|日常时间表达|Les expressions de temps du quotidien
Completed polite past actions|丁寧な過去形で出来事を話す|Hablar de acciones pasadas con formas corteses|Falar de ações passadas com formas educadas|用礼貌的过去时形式描述事件|Parler d’actions passées avec les formes polies
Arrange an activity together|一緒にすることを相談する|Organizar una actividad juntos|Combinar uma atividade juntos|商量一起做的活动|Organiser une activité ensemble
Hear and produce long vowels|長母音を聞き分けて発音する|Distinguir y pronunciar vocales largas|Distinguir e pronunciar vogais longas|辨别并发出长元音|Distinguer et prononcer les voyelles longues
Follow spoken directions|口頭の道案内を聞き取る|Entender indicaciones orales|Entender instruções de caminho faladas|听懂口头指路信息|Comprendre un itinéraire donné à l’oral
Build the te-form|て形の作り方|Formar la forma て|Formar a forma て|掌握 て 形的构成|Former la forme て
Ongoing actions with te iru|「〜ている」で進行中の動作を表す|Acciones en curso con 〜ている|Ações em andamento com 〜ている|用 〜ている 表达进行中的动作|Exprimer une action en cours avec 〜ている
Book accommodation|宿泊先を予約する|Reservar alojamiento|Reservar hospedagem|预订住宿|Réserver un hébergement
Accept an offer or request|申し出や依頼に応じる|Aceptar una oferta o petición|Aceitar uma oferta ou um pedido|接受提议或请求|Accepter une proposition ou une demande
Describe a successful outcome|うまくいった結果を伝える|Describir un resultado positivo|Descrever um resultado positivo|描述顺利的结果|Décrire un résultat positif
Purpose with tame ni|「〜ために」で目的を表す|Expresar finalidad con 〜ために|Expressar finalidade com 〜ために|用 〜ために 表达目的|Exprimer le but avec 〜ために
Express uncertainty|不確かさを伝える|Expresar incertidumbre|Expressar incerteza|表达不确定性|Exprimer l’incertitude
Write a clear polite request|丁寧でわかりやすい依頼を書く|Escribir una petición clara y cortés|Escrever um pedido claro e educado|写出清楚且礼貌的请求|Rédiger une demande claire et polie
Describe experience|経験したことを話す|Hablar de experiencias|Falar de experiências|谈论经历|Parler de ses expériences
Completed preparation|「〜ておく」で準備を表す|Expresar preparación con 〜ておく|Expressar preparação com 〜ておく|用 〜ておく 表达事先准备|Exprimer la préparation avec 〜ておく
State an intention|するつもりのことを伝える|Expresar una intención|Expressar uma intenção|表达打算|Exprimer une intention
Conditional possibilities with tara|「〜たら」で条件を表す|Expresar condiciones con 〜たら|Expressar condições com 〜たら|用 〜たら 表达条件|Exprimer une condition avec 〜たら
Replace an action|「〜代わりに」で別の行動を伝える|Hacer una cosa en lugar de otra|Fazer uma coisa em vez de outra|表达做一件事而不做另一件事|Faire une chose à la place d’une autre
Offer practical help|具体的な手助けを申し出る|Ofrecer ayuda concreta|Oferecer ajuda concreta|提出具体的帮助|Proposer une aide concrète
Describe understanding an explanation|説明を理解したことを伝える|Expresar que has entendido una explicación|Dizer que você entendeu uma explicação|表达已经理解说明|Dire que l’on a compris une explication
Hear revised travel information|変更された旅行情報を聞き取る|Entender cambios en la información de viaje|Entender mudanças nas informações de viagem|听懂变更后的旅行信息|Comprendre une modification des informations de voyage
Hear support with a reservation|留保のある賛同を聞き取る|Entender un apoyo con reservas|Entender apoio com ressalvas|听懂有所保留的支持|Comprendre un soutien assorti de réserves
Unreal conditions with nara|「〜なら」で仮定の状況を表す|Expresar situaciones hipotéticas con 〜なら|Expressar situações hipotéticas com 〜なら|用 〜なら 表达假设情境|Exprimer une hypothèse avec 〜なら
Read limits on a proposal|提案に付けられた条件を読み取る|Identificar los límites de una propuesta|Identificar os limites de uma proposta|读懂提案的限制条件|Repérer les limites d’une proposition
Distinguish passive and causative|受身と使役を使い分ける|Distinguir la pasiva y la causativa|Distinguir a passiva e a causativa|区分被动与使役|Distinguer le passif et le causatif
Past counterfactual regret|実際と異なる過去を想定して後悔を表す|Expresar arrepentimiento sobre un pasado distinto|Expressar arrependimento sobre um passado diferente|假设不同的过去并表达后悔|Exprimer un regret sur un passé différent
Handle more than you can manage|手に負えない状況を表す|Hablar de una situación que te supera|Falar de uma situação que você não consegue dar conta|表达难以应付的处境|Décrire une situation qui nous dépasse
Persist despite a setback|うまくいかなくても続ける|Seguir adelante pese a un contratiempo|Persistir apesar de um contratempo|尽管遇到挫折仍继续坚持|Persévérer malgré un revers
Formal requests with consideration|相手に配慮して丁寧に依頼する|Hacer peticiones formales con consideración|Fazer pedidos formais com consideração|体谅对方地提出正式请求|Formuler une demande formelle avec tact
Interpret a qualified endorsement|留保のある評価を読み取る|Interpretar una valoración con reservas|Interpretar uma avaliação com ressalvas|理解有所保留的评价|Interpréter une appréciation nuancée
Limit causal claims|因果関係を慎重に述べる|Matizar las afirmaciones de causalidad|Fazer ressalvas ao afirmar relações de causa|谨慎表述因果关系|Nuancer les affirmations de causalité
Write a synthesis with limits|根拠の限界を踏まえて要点をまとめる|Escribir una síntesis teniendo en cuenta las limitaciones|Escrever uma síntese considerando as limitações|在考虑局限的前提下写出综合总结|Rédiger une synthèse en tenant compte des limites
Report an inferred completed event|過去の出来事について推測を伝える|Expresar una inferencia sobre un hecho pasado|Expressar uma inferência sobre um acontecimento passado|表达对过去事件的推测|Exprimer une déduction sur un événement passé
Express an unreal earlier wish|「〜ておけばよかった」で準備をしなかった後悔を表す|Expresar un deseo sobre un pasado distinto|Expressar um desejo sobre um passado diferente|表达希望过去有所不同的愿望|Exprimer le souhait que le passé ait été différent
Distinguish evidence from proof|根拠と決定的な証明を区別する|Distinguir indicios y pruebas concluyentes|Distinguir indícios e provas conclusivas|区分依据与确凿证明|Distinguer les indices et les preuves concluantes
State an explicit condition|条件を明確に伝える|Indicar una condición explícita|Indicar uma condição explícita|明确说明条件|Énoncer une condition explicite
Recognize understated criticism|控えめな表現に含まれる批判を読み取る|Reconocer una crítica discreta|Reconhecer uma crítica sutil|识别委婉表达中的批评|Reconnaître une critique discrète
Match expressions to register|場面に合う表現を使う|Adaptar las expresiones al registro|Adaptar as expressões ao registro|根据场合选择表达|Adapter les expressions au registre
Vowels: hear the difference|母音の違いを聞き分ける|Vocales: distinguir los sonidos|Vogais: distinguir os sons|辨别元音的差异|Voyelles : distinguer les sons
Consonants: tongue and airflow|子音：舌と息の使い方|Consonantes: posición de la lengua y flujo de aire|Consoantes: posição da língua e fluxo de ar|辅音：舌位与气流|Consonnes : position de la langue et souffle
Sound check: clear sounds|発音の確認：音を明瞭にする|Repaso de pronunciación: sonidos claros|Revisão de pronúncia: sons claros|发音检测：清晰发音|Bilan de prononciation : des sons clairs
Stress and the relaxed vowel|強勢と弱く発音する母音|El acento y la vocal reducida|Acentuação e vogal reduzida|重音与弱化元音|L’accent tonique et la voyelle réduite
Endings and connected speech|語尾と音のつながり|Terminaciones y enlace entre palabras|Terminações e ligação entre palavras|词尾与连读|Les fins de mots et les liaisons à l’oral
Sound check: rhythm & phrases|発音の確認：リズムとフレーズ|Repaso de pronunciación: ritmo y frases|Revisão de pronúncia: ritmo e frases|发音检测：节奏与短语|Bilan de prononciation : rythme et phrases
Five steady vowels|5つの母音を安定して発音する|Pronunciar las cinco vocales con claridad|Pronunciar as cinco vogais com clareza|清晰稳定地发出五个元音|Prononcer clairement les cinq voyelles
Tap and trill|rとrrの音を聞き分けて発音する|La r simple y la rr vibrante|O r simples e o rr vibrante do espanhol|辨别并发出 r 与 rr 的音|Distinguer le r simple et le r roulé
Word stress and accent marks|語の強勢とアクセント記号|Acento de palabra y tildes|Sílaba tônica e acentos gráficos|单词重音与重音符号|L’accent tonique et les accents écrits
Link words without losing vowels|母音を保って単語をつなげる|Enlazar palabras sin perder las vocales|Ligar palavras sem perder as vogais|保留元音并连读单词|Enchaîner les mots sans perdre les voyelles
Oral and nasal vowels|口母音と鼻母音を聞き分ける|Distinguir vocales orales y nasales|Distinguir vogais orais e nasais|辨别口元音与鼻化元音|Distinguer les voyelles orales et nasales
Vowel quality and stress|母音の音色と強勢|Sonidos vocálicos y acento|Qualidade das vogais e acentuação|元音音质与重音|Le timbre des voyelles et l’accent tonique
Consonant combinations|子音の組み合わせを発音する|Pronunciar grupos de consonantes|Pronunciar grupos de consoantes|练习辅音组合|Prononcer les groupes de consonnes
Phrase rhythm and final sounds|フレーズのリズムと語末の音|Ritmo de las frases y sonidos finales|Ritmo das frases e sons finais|短语节奏与词尾发音|Le rythme des phrases et les sons finaux
Mora timing and long vowels|拍の長さと長母音|El ritmo de las moras y las vocales largas|O ritmo das moras e as vogais longas|音拍时长与长元音|Le rythme des mores et les voyelles longues
Small っ and moraic ん|小さい「っ」と「ん」の長さ|La duración de っ pequeña y ん|A duração do っ pequeno e do ん|小 っ 与 ん 的时长|La durée du petit っ et de ん
Small kana and combined sounds|小さい仮名と拗音|Kana pequeños y sonidos combinados|Kana pequenos e sons combinados|小假名与拗音|Les petits kana et les sons combinés
Phrase rhythm and intonation|フレーズのリズムとイントネーション|Ritmo y entonación de las frases|Ritmo e entonação das frases|短语节奏与语调|Le rythme et l’intonation des phrases
Hiragana: first 25 characters|ひらがな：最初の25文字|Hiragana: los primeros 25 caracteres|Hiragana: os primeiros 25 caracteres|平假名：前25个字符|Hiragana : les 25 premiers caractères
Hiragana: remaining basic characters|ひらがな：残りの基本文字|Hiragana: los demás caracteres básicos|Hiragana: os demais caracteres básicos|平假名：其余基本字符|Hiragana : les autres caractères de base
Hiragana: voicing marks|ひらがな：濁点と半濁点|Hiragana: dakuten y handakuten|Hiragana: dakuten e handakuten|平假名：浊点与半浊点|Hiragana : dakuten et handakuten
Katakana: first 25 characters|カタカナ：最初の25文字|Katakana: los primeros 25 caracteres|Katakana: os primeiros 25 caracteres|片假名：前25个字符|Katakana : les 25 premiers caractères
Katakana: remaining basic characters|カタカナ：残りの基本文字|Katakana: los demás caracteres básicos|Katakana: os demais caracteres básicos|片假名：其余基本字符|Katakana : les autres caractères de base
Katakana: voicing marks|カタカナ：濁点と半濁点|Katakana: dakuten y handakuten|Katakana: dakuten e handakuten|片假名：浊点与半浊点|Katakana : dakuten et handakuten
Read small kana and long sounds|小さい仮名と長音を読む|Leer kana pequeños y vocales largas|Ler kana pequenos e vogais longas|读懂小假名与长音|Lire les petits kana et les voyelles longues
Katakana combinations|カタカナの組み合わせを読む|Leer combinaciones de katakana|Ler combinações de katakana|读懂片假名组合|Lire les combinaisons de katakana
First kanji: words and signs|初めての漢字：単語と標識|Primeros kanji: palabras y señales|Primeiros kanji: palavras e placas|入门汉字：词语与标识|Premiers kanji : mots et panneaux
A café order, step by step|カフェでの注文を順に練習する|Pedir en una cafetería paso a paso|Fazer um pedido na cafeteria, passo a passo|分步练习咖啡馆点单|Commander au café, étape par étape
Scene checkpoint|場面別の確認テスト|Prueba de repaso de la situación|Teste de revisão da situação|情境检测|Test de compréhension de la situation
A change of platform|乗り場の変更を聞き取る|Entender un cambio de andén|Entender uma mudança de plataforma|听懂站台变更信息|Comprendre un changement de quai
Renegotiate a deadline|締め切りの変更を相談する|Negociar un nuevo plazo|Negociar um novo prazo|协商调整截止时间|Négocier un nouveau délai
A neighbourhood proposal|地域への提案を検討する|Valorar una propuesta para el barrio|Avaliar uma proposta para o bairro|讨论社区提案|Examiner une proposition pour le quartier
Read a claim critically|主張と根拠を吟味する|Evaluar una afirmación de forma crítica|Avaliar uma afirmação de forma crítica|审慎评估观点与依据|Examiner une affirmation avec esprit critique
Meet a new neighbour|新しい隣人と話す|Conocer a un nuevo vecino|Conhecer um novo vizinho|认识新邻居|Faire connaissance avec un nouveau voisin
Meet the people in your building|同じ建物に住む人と話す|Conocer a las personas de tu edificio|Conhecer as pessoas do seu prédio|认识同一栋楼的住户|Faire connaissance avec les habitants de son immeuble
Introduce yourself in Spanish|スペイン語で自己紹介する|Presentarte en español|Se apresentar em espanhol|用西班牙语做自我介绍|Se présenter en espagnol
Follow a slow Japanese conversation|ゆっくりした日本語の会話を聞く|Entender una conversación pausada en japonés|Entender uma conversa pausada em japonês|听懂语速较慢的日语对话|Comprendre une conversation lente en japonais
Follow a morning routine|朝の習慣についての話を聞く|Entender una rutina de mañana|Entender uma rotina da manhã|听懂关于早晨习惯的描述|Comprendre une routine du matin
Respond to a compliment|褒められたときに返答する|Responder a un cumplido|Responder a um elogio|回应赞美|Répondre à un compliment
Discuss how technology may change us|テクノロジーが人に与える影響を考える|Hablar de cómo la tecnología puede cambiarnos|Falar de como a tecnologia pode nos transformar|讨论科技可能带来的改变|Parler de la façon dont la technologie peut nous transformer
Explore the motives behind travel|旅に出る理由を考える|Explorar los motivos para viajar|Explorar os motivos para viajar|探讨旅行的动机|Explorer les motivations du voyage
Describe a morning in Portuguese|ポルトガル語で朝の様子を話す|Describir una mañana en portugués|Descrever uma manhã em português|用葡萄牙语描述早晨|Décrire une matinée en portugais
Talk about plans and uncertain futures|予定と不確かな将来について話す|Hablar de planes y de un futuro incierto|Falar de planos e de um futuro incerto|谈论计划与不确定的未来|Parler de projets et d’un avenir incertain
Reflect on change and expectations|変化と期待について考える|Reflexionar sobre cambios y expectativas|Refletir sobre mudanças e expectativas|思考变化与期待|Réfléchir aux changements et aux attentes
Evaluate goals, values and personal growth|目標・価値観・成長を振り返る|Reflexionar sobre metas, valores y crecimiento personal|Refletir sobre metas, valores e crescimento pessoal|反思目标、价值观与个人成长|Réfléchir aux objectifs, aux valeurs et à l’évolution personnelle
Follow everyday Japanese exchanges|日常の日本語のやり取りを聞く|Entender intercambios cotidianos en japonés|Entender conversas do dia a dia em japonês|听懂日常日语交流|Comprendre les échanges du quotidien en japonais
Exchange travel experiences in Japanese|日本語で旅行の経験を話す|Compartir experiencias de viaje en japonés|Compartilhar experiências de viagem em japonês|用日语交流旅行经历|Échanger sur ses voyages en japonais
Weigh up a move|引っ越しの選択肢を検討する|Valorar una mudanza|Avaliar uma mudança de casa|权衡是否搬家|Peser le pour et le contre d’un déménagement
Interpret subtext in a Japanese conversation|日本語の会話で言外の意味を読み取る|Interpretar lo implícito en una conversación en japonés|Interpretar o que está implícito em uma conversa em japonês|理解日语对话中的言外之意|Interpréter le sous-entendu dans une conversation en japonais
Talk through your daily routine|一日の流れを説明する|Explicar tu rutina diaria|Explicar sua rotina diária|介绍一天的安排|Décrire sa routine quotidienne
Make a complaint politely|丁寧に不満や問題を伝える|Expresar una queja con educación|Fazer uma reclamação com educação|礼貌地提出不满或问题|Formuler une réclamation poliment
Explore the art of conversation|会話のコツを考える|Explorar las claves de una buena conversación|Explorar o que faz uma boa conversa|探讨有效交流的技巧|Explorer les clés d’une bonne conversation
Analyse persuasive advice about conversation|会話についての助言がどう説得力を生むかを分析する|Analizar cómo se presentan consejos convincentes sobre la conversación|Analisar como apresentar conselhos persuasivos sobre conversas|分析关于交谈的建议如何产生说服力|Analyser la force persuasive de conseils sur la conversation
Meet your world|自己紹介と身近な人の話をする|Presentarte y hablar de quienes te rodean|Se apresentar e falar das pessoas ao seu redor|介绍自己与身边的人|Se présenter et parler de son entourage
Your everyday Spanish|日常で使うスペイン語|Español para el día a día|Espanhol para o dia a dia|日常西班牙语|L’espagnol au quotidien
Stories & plans|過去の出来事とこれからの予定|Experiencias y planes|Experiências e planos|过去的经历与未来的计划|Expériences et projets
Listen, stress, connect|聞き取り・強勢・音のつながり|Escucha, acento y enlace de palabras|Escuta, acentuação e ligação entre palavras|听力、重音与连读|Écoute, accent tonique et enchaînement des mots
Purpose & uncertainty|目的と不確かさを表す|Expresar finalidad e incertidumbre|Expressar finalidade e incerteza|表达目的与不确定性|Exprimer le but et l’incertitude
Make your point|自分の考えを明確に伝える|Expresar tus ideas con claridad|Expressar suas ideias com clareza|清楚表达自己的观点|Exprimer clairement son point de vue
Listen beyond the textbook|実際の場面での聞き取り|Comprender situaciones reales|Compreender situações reais|听懂真实情境中的交流|Comprendre les échanges en situation réelle
Possibility & argument|仮定と意見の述べ方|Hipótesis y argumentación|Hipóteses e argumentação|假设与论述|Hypothèses et argumentation
Choose your voice|場面に合う言葉遣いと含意|Registro y significados implícitos|Registro e sentidos implícitos|表达方式与隐含意义|Registre et sens implicite
Build a precise argument|根拠を踏まえて論を組み立てる|Construir un argumento preciso|Construir um argumento preciso|依据证据组织严谨论述|Construire une argumentation précise
Grammar lab · Present tense|文法練習：現在形|Práctica de gramática: presente|Prática de gramática: presente|语法练习：现在时|Atelier de grammaire : le présent
Grammar lab · Two views of the past|文法練習：過去の出来事と背景|Práctica de gramática: hechos y contexto en el pasado|Prática de gramática: acontecimentos e contexto no passado|语法练习：过去的事件与背景|Atelier de grammaire : événements et contexte dans le passé
Grammar lab · Perfect tenses|文法練習：現在完了と過去完了|Práctica de gramática: perfecto y pluscuamperfecto|Prática de gramática: presente perfeito e mais-que-perfeito|语法练习：现在完成时与过去完成时|Atelier de grammaire : les temps composés
Grammar lab · Future and conditional|文法練習：未来と仮定|Práctica de gramática: futuro e hipótesis|Prática de gramática: futuro e hipóteses|语法练习：未来与假设|Atelier de grammaire : futur et hypothèses
Grammar lab · Subjunctive forms|文法練習：接続法の活用|Práctica de gramática: formas del subjuntivo|Prática de gramática: formas do subjuntivo|语法练习：虚拟式形式|Atelier de grammaire : les formes du subjonctif
Grammar lab · Perfect subjunctive|文法練習：接続法の完了形|Práctica de gramática: tiempos compuestos del subjuntivo|Prática de gramática: tempos compostos do subjuntivo|语法练习：虚拟式完成形式|Atelier de grammaire : les temps composés du subjonctif
Vocabulary lab · Everyday essentials|語彙練習：日常の基本語彙|Práctica de vocabulario: lo esencial del día a día|Prática de vocabulário: o essencial do dia a dia|词汇练习：日常基础词汇|Atelier de vocabulaire : les essentiels du quotidien
Vocabulary lab · Travel and work|語彙練習：旅行と仕事|Práctica de vocabulario: viajes y trabajo|Prática de vocabulário: viagens e trabalho|词汇练习：旅行与工作|Atelier de vocabulaire : voyages et travail
Expression lab · Small conversations|表現練習：短いやり取り|Práctica de expresiones: conversaciones breves|Prática de expressões: conversas breves|表达练习：简短交流|Atelier d’expressions : les échanges courts
Expression lab · Everyday combinations|表現練習：日常で使う語の組み合わせ|Práctica de expresiones: combinaciones cotidianas|Prática de expressões: combinações do dia a dia|表达练习：日常词语搭配|Atelier d’expressions : les associations courantes
Expression lab · Plans and practical requests|表現練習：予定と日常の依頼|Práctica de expresiones: planes y peticiones cotidianas|Prática de expressões: planos e pedidos do dia a dia|表达练习：计划与日常请求|Atelier d’expressions : projets et demandes du quotidien
Expression lab · Everyday stories|表現練習：日常の出来事|Práctica de expresiones: experiencias cotidianas|Prática de expressões: experiências do dia a dia|表达练习：日常经历|Atelier d’expressions : les expériences du quotidien
Expression lab · Keep the conversation moving|表現練習：会話を続ける|Práctica de expresiones: mantener la conversación|Prática de expressões: manter a conversa|表达练习：让对话继续|Atelier d’expressions : faire avancer la conversation
Expression lab · Beyond literal meaning|表現練習：慣用句を理解する|Práctica de expresiones: entender frases hechas|Prática de expressões: entender expressões idiomáticas|表达练习：理解惯用语|Atelier d’expressions : comprendre les expressions idiomatiques
Expression lab · Decisions and collaboration|表現練習：意思決定と協力|Práctica de expresiones: decisiones y colaboración|Prática de expressões: decisões e colaboração|表达练习：决策与合作|Atelier d’expressions : décisions et collaboration
Expression lab · Idioms in real situations|表現練習：場面に合う慣用句|Práctica de expresiones: frases hechas en contexto|Prática de expressões: expressões idiomáticas em contexto|表达练习：情境中的惯用语|Atelier d’expressions : les expressions idiomatiques en contexte
Expression lab · Precise arguments|表現練習：根拠に沿って意見を述べる|Práctica de expresiones: argumentar con precisión|Prática de expressões: argumentar com precisão|表达练习：严谨地论述观点|Atelier d’expressions : argumenter avec précision
Expression lab · Subtext and register|表現練習：言外の意味と言葉遣い|Práctica de expresiones: sentidos implícitos y registro|Prática de expressões: sentidos implícitos e registro|表达练习：言外之意与表达方式|Atelier d’expressions : sous-entendus et registre
Your everyday English|日常で使う英語|Inglés para el día a día|Inglês para o dia a dia|日常英语|L’anglais au quotidien
Grammar lab · Perfect aspect and counterfactuals|文法練習：完了進行形と過去の仮定|Práctica de gramática: perfecto continuo e hipótesis sobre el pasado|Prática de gramática: perfeito contínuo e hipóteses sobre o passado|语法练习：完成进行时与过去假设|Atelier de grammaire : perfect continu et hypothèses sur le passé
Grammar lab · Past inference and regret|文法練習：過去の推測と後悔|Práctica de gramática: deducciones y arrepentimiento sobre el pasado|Prática de gramática: deduções e arrependimento sobre o passado|语法练习：推测过去与表达后悔|Atelier de grammaire : déductions et regrets sur le passé
Your everyday Portuguese|日常で使うポルトガル語|Portugués para el día a día|Português para o dia a dia|日常葡萄牙语|Le portugais au quotidien
Listen, nasal vowels, connect|聞き取り・鼻母音・音のつながり|Escucha, vocales nasales y enlace de palabras|Escuta, vogais nasais e ligação entre palavras|听力、鼻化元音与连读|Écoute, voyelles nasales et enchaînement des mots
Grammar lab · Compound tenses|文法練習：複合時制|Práctica de gramática: tiempos compuestos|Prática de gramática: tempos compostos|语法练习：复合时态|Atelier de grammaire : les temps composés
Grammar lab · Compound subjunctive|文法練習：接続法の複合時制|Práctica de gramática: tiempos compuestos del subjuntivo|Prática de gramática: tempos compostos do subjuntivo|语法练习：虚拟式复合时态|Atelier de grammaire : les temps composés du subjonctif
Your everyday Japanese|日常で使う日本語|Japonés para el día a día|Japonês para o dia a dia|日常日语|Le japonais au quotidien
Grammar lab · Verb forms|文法練習：動詞の活用|Práctica de gramática: formas verbales|Prática de gramática: formas verbais|语法练习：动词形式|Atelier de grammaire : les formes verbales
Listen, length, connect|聞き取り・音の長さ・音のつながり|Escucha, duración de los sonidos y enlace de palabras|Escuta, duração dos sons e ligação entre palavras|听力、音长与连读|Écoute, durée des sons et enchaînement des mots
Grammar lab · Actions and aspect|文法練習：動作とその進行・状態|Práctica de gramática: acciones y aspecto|Prática de gramática: ações e aspecto|语法练习：动作与体貌|Atelier de grammaire : actions et aspect
Grammar lab · Experience and preparation|文法練習：経験と事前の準備|Práctica de gramática: experiencias y preparación|Prática de gramática: experiências e preparação|语法练习：经历与事先准备|Atelier de grammaire : expériences et préparation
Grammar lab · Intentions and conditions|文法練習：意図と条件|Práctica de gramática: intenciones y condiciones|Prática de gramática: intenções e condições|语法练习：意图与条件|Atelier de grammaire : intentions et conditions
Grammar lab · Voice and counterfactuals|文法練習：受身・使役と過去の仮定|Práctica de gramática: pasiva, causativa e hipótesis sobre el pasado|Prática de gramática: passiva, causativa e hipóteses sobre o passado|语法练习：被动、使役与过去假设|Atelier de grammaire : passif, causatif et hypothèses sur le passé
Grammar lab · Inference and regret|文法練習：推測と後悔|Práctica de gramática: inferencias y arrepentimiento|Prática de gramática: inferências e arrependimento|语法练习：推测与后悔|Atelier de grammaire : déductions et regrets
Pronunciation: build clear sounds|発音練習：一つひとつの音を明瞭にする|Pronunciación: sonidos claros|Pronúncia: sons claros|发音练习：清晰发音|Prononciation : des sons clairs
Pronunciation: rhythm & phrases|発音練習：リズムとフレーズ|Pronunciación: ritmo y frases|Pronúncia: ritmo e frases|发音练习：节奏与短语|Prononciation : rythme et phrases
Hiragana with sound|音と一緒に学ぶひらがな|Hiragana y sus sonidos|Hiragana e seus sons|结合发音学习平假名|Apprendre les hiragana avec leurs sons
Katakana with sound|音と一緒に学ぶカタカナ|Katakana y sus sonidos|Katakana e seus sons|结合发音学习片假名|Apprendre les katakana avec leurs sons
Small kana & long sounds|小さい仮名と長音|Kana pequeños y vocales largas|Kana pequenos e vogais longas|小假名与长音|Les petits kana et les voyelles longues
Kanji in useful words|実用的な単語で学ぶ漢字|Kanji en palabras útiles|Kanji em palavras úteis|通过实用词语学习汉字|Apprendre les kanji dans des mots utiles
First conversations|初めての会話|Primeras conversaciones|Primeiras conversas|初次交流|Premières conversations
Everyday independence|日常の用事を自分でこなす|Desenvolverte en el día a día|Se virar no dia a dia|独立应对日常事务|Se débrouiller au quotidien
Connected conversations|考えをつなげて話す|Conversaciones con ideas conectadas|Conversas com ideias conectadas|连贯地交流想法|Relier ses idées à l’oral
Nuance & real life|実際の場面と微妙な意味の違い|Matices y situaciones reales|Nuances e situações reais|真实情境与细微含义|Nuances et situations réelles
Precision & perspective|正確に伝え、視点を深める|Precisión y perspectiva|Precisão e perspectiva|准确表达与深入思考|Précision et perspective
Create & submit a response|回答を作成して提出する|Crear y enviar una respuesta|Criar e enviar uma resposta|完成并提交回答|Rédiger et envoyer une réponse
New situations · mixed questions|新しい場面での総合問題|Situaciones nuevas y preguntas variadas|Novas situações e perguntas variadas|新情境与综合题|Nouvelles situations et questions variées
Explanation + guided practice|解説と段階的な練習|Explicación y práctica guiada|Explicação e prática guiada|讲解与引导练习|Explications et exercices guidés
`;
export const reviewedCourseTitles={ja:{},es:{},pt:{},zh:{},fr:{}};
for(const line of rows.trim().split('\n')){
 const [source,...translations]=line.split('|');
 if(translations.length!==5||translations.some(value=>!value.trim()))throw Error('Incomplete course heading: '+source);
 for(const [i,locale] of ['ja','es','pt','zh','fr'].entries()){
  if(reviewedCourseTitles[locale][source])throw Error('Duplicate course heading: '+source);
  reviewedCourseTitles[locale][source]=translations[i];
 }
}
const summary=(level)=>({ja:level+'の総合テスト',es:'Prueba de repaso de '+level,pt:'Teste de revisão de '+level,zh:level+' 综合测试',fr:'Test de révision du niveau '+level});
const courseNames={English:{ja:'英語',es:'Inglés',pt:'Inglês',zh:'英语',fr:'Anglais'},'Portuguese (Brazil)':{ja:'ポルトガル語（ブラジル）',es:'Portugués de Brasil',pt:'Português brasileiro',zh:'巴西葡萄牙语',fr:'Portugais du Brésil'},Japanese:{ja:'日本語',es:'Japonés',pt:'Japonês',zh:'日语',fr:'Japonais'}};
for(const level of ['A1','A2','B1','B2','C1']){
 for(const locale of ['ja','es','pt','zh','fr']){
  const title=summary(level)[locale];
  reviewedCourseTitles[locale][level+' summary test']=title;
  reviewedCourseTitles[locale][level+' level summary test']=title;
  for(const [name,translations] of Object.entries(courseNames))reviewedCourseTitles[locale][name+' · '+level+' summary test']=translations[locale]+' · '+title;
 }
}

// Chapter goals reuse the same reviewed lesson headings.
const pairedGoals=[
 "Introduce yourself · Identity and current state",
 "Third-person routines · Order at a café",
 "Questions with do and does · Present-simple negatives",
 "Food quantities · Places in town",
 "Polite interruptions · Ask someone to repeat",
 "Express a need · Times of day",
 "Completed past actions · Arrange a meeting",
 "Word stress in compound nouns · Follow directions",
 "Past-simple questions · Past background actions",
 "Booking a room · Work deadlines",
 "Make a suggestion · Respond to a request",
 "Frequency expressions · Describe an outcome",
 "Purpose with infinitives · Possibility with modals",
 "Read cause and contrast · Write a clear request",
 "Experience without a finished time · An earlier past",
 "Future decisions and predictions · Hypothetical results",
 "Reformulate an idea · Offer an alternative",
 "Help someone · Realise something",
 "Hear corrected travel information · Hear qualified support",
 "Counterfactual present conditions · Identify the writer's qualification",
 "Present perfect continuous · Past unreal conditions",
 "Weigh alternatives · Put a plan into action",
 "Work under pressure · Persistence after setbacks",
 "Formal requests without excess · Interpret implied reservations",
 "Limit a causal claim · Synthesize with limitations",
 "Past deductions · Regret about an earlier past",
 "Evidence-sensitive conclusions · Add an explicit qualification",
 "Recognise understated criticism · Choose a suitable register",
 "Introduce yourself in Brazilian Portuguese · Ser for identity, estar for a current state",
 "Present-tense routines · Hear a café order",
 "Regular -er and -ir present forms · Common irregular present forms",
 "Buy food by quantity · Find places in town",
 "Get attention politely · Ask for repetition",
 "State what you need to do · Everyday time combinations",
 "Completed events with the perfect past · Make a near-future plan",
 "Hear and produce nasal vowels · Follow street directions",
 "Background and repeated past actions · An event inside a past background",
 "Hotel reservations · Work and deadlines",
 "Suggest an activity · Accept a practical request",
 "Describe occasional habits · Tell how something turned out",
 "Purpose with para · Uncertainty with talvez",
 "Read contrast and consequence · Write a specific polite request",
 "Repeated activity up to now · An event before another past event",
 "Future conditions with se · Hypothetical present results",
 "Rephrase for clarity · Replace one action with another",
 "Ask for a helping hand · Describe a moment of realization",
 "Hear corrected departure information · Hear qualified support",
 "Unreal present conditions · Read conditions attached to approval",
 "Present subjunctive after a recommendation · Past counterfactual conditions",
 "Weigh alternatives before deciding · Apply a shared plan",
 "Handle competing responsibilities · Persist through difficulty",
 "Formal written requests · Read an implicit reservation",
 "Avoid overclaiming causation · Synthesize a qualified recommendation",
 "Completed events under uncertainty · Regret about a prior past",
 "Distinguish compatibility from proof · Make a recommendation conditional",
 "Recognize restrained criticism · Choose an informal or formal register",
 "Introduce yourself politely · Topic and possession",
 "Polite present routines · Hear a simple order",
 "Verb groups and polite stems · Negative polite verbs",
 "Food and item counters · Locations in a town",
 "Say what you want · Everyday time expressions",
 "Completed polite past actions · Arrange an activity together",
 "Hear and produce long vowels · Follow spoken directions",
 "Build the te-form · Ongoing actions with te iru",
 "Book accommodation · Work and deadlines",
 "Make a suggestion · Accept an offer or request",
 "Frequency expressions · Describe a successful outcome",
 "Purpose with tame ni · Express uncertainty",
 "Read cause and contrast · Write a clear polite request",
 "Describe experience · Completed preparation",
 "State an intention · Conditional possibilities with tara",
 "Reformulate an idea · Replace an action",
 "Offer practical help · Describe understanding an explanation",
 "Hear revised travel information · Hear support with a reservation",
 "Unreal conditions with nara · Read limits on a proposal",
 "Distinguish passive and causative · Past counterfactual regret",
 "Handle more than you can manage · Persist despite a setback",
 "Formal requests with consideration · Interpret a qualified endorsement",
 "Limit causal claims · Write a synthesis with limits",
 "Report an inferred completed event · Express an unreal earlier wish",
 "Distinguish evidence from proof · State an explicit condition",
 "Recognize understated criticism · Match expressions to register"
];
for(const source of pairedGoals)for(const locale of ['ja','es','pt','zh','fr'])reviewedCourseTitles[locale][source]=source.split(' · ').map(part=>reviewedCourseTitles[locale][part]).join(locale==='ja'?'・':' · ');
const goalRows=`
Introduce people and describe how they are.|人を紹介し、その人の特徴や状態を説明する。|Presentar a otras personas y describir cómo son o cómo están.|Apresentar pessoas e descrever suas características e seu estado.|介绍他人，描述他们的特点与状态。|Présenter des personnes et décrire leurs caractéristiques et leur état.
Talk about routines and order in a café.|日常の習慣を話し、カフェで注文する。|Hablar de rutinas y pedir en una cafetería.|Falar de rotinas e fazer um pedido na cafeteria.|谈论日常习惯，在咖啡馆点单。|Parler des habitudes et commander au café.
Describe a finished day and arrange the next one.|過去の一日を振り返り、次の予定を立てる。|Contar cómo fue un día y planear el siguiente.|Contar como foi um dia e planejar o próximo.|描述过去的一天，安排接下来的计划。|Raconter une journée passée et organiser la suivante.
Hear key details and practise Spanish word stress.|重要な情報を聞き取り、スペイン語の語の強勢を練習する。|Identificar detalles importantes al escuchar y practicar el acento de las palabras en español.|Identificar informações importantes ao ouvir e praticar a sílaba tônica em espanhol.|听懂关键信息，练习西班牙语的单词重音。|Repérer les informations importantes à l’écoute et travailler l’accent tonique en espagnol.
Choose por or para and express doubt with the subjunctive.|porとparaを使い分け、接続法で疑いを表す。|Elegir entre por y para y expresar duda con el subjuntivo.|Escolher entre por e para e expressar dúvida com o subjuntivo.|区分 por 与 para，用虚拟式表达疑问或不确定。|Choisir entre por et para et exprimer le doute avec le subjonctif.
Connect ideas and build a clear written message.|考えをつなげ、わかりやすい文章を書く。|Conectar ideas y escribir un mensaje claro.|Conectar ideias e escrever uma mensagem clara.|连贯组织想法，写出清楚的文字。|Relier ses idées et rédiger un message clair.
Extract travel details and distinguish a speaker’s stance.|旅行に必要な情報と話し手の立場を聞き取る。|Identificar información de viaje y la postura del hablante.|Identificar informações de viagem e a posição de quem fala.|听懂旅行信息，辨别说话者的立场。|Repérer les informations de voyage et le point de vue de la personne qui parle.
Discuss hypothetical situations and qualify an argument.|仮定の状況を話し、主張に条件や留保を加える。|Hablar de situaciones hipotéticas y matizar un argumento.|Falar de situações hipotéticas e fazer ressalvas em um argumento.|谈论假设情境，为观点补充条件或保留意见。|Parler de situations hypothétiques et nuancer une argumentation.
Adjust register and interpret implied meaning.|場面に合わせて言葉遣いを調整し、言外の意味を読み取る。|Adaptar el registro e interpretar significados implícitos.|Adaptar o registro e interpretar sentidos implícitos.|调整表达方式，理解隐含意义。|Adapter le registre et interpréter le sens implicite.
Express reservations and organise a nuanced conclusion.|懸念や留保を伝え、細かな違いを踏まえて結論をまとめる。|Expresar reservas y formular una conclusión matizada.|Expressar ressalvas e formular uma conclusão com nuances.|表达保留意见，考虑细微差别后组织结论。|Exprimer des réserves et organiser une conclusion nuancée.
Build verb forms from stems and endings, then handle common irregular verbs.|語幹と語尾から活用形を作り、よく使う不規則動詞も練習する。|Formar verbos a partir de raíces y terminaciones y practicar los irregulares frecuentes.|Formar verbos a partir de radicais e terminações e praticar os irregulares comuns.|结合词干与词尾构成动词形式，并练习常用不规则动词。|Former les verbes à partir du radical et des terminaisons, puis travailler les irréguliers courants.
Separate completed events from background and habits.|完了した出来事と、背景や習慣を区別する。|Distinguir hechos terminados, contexto y hábitos.|Distinguir acontecimentos concluídos, contexto e hábitos.|区分已完成的事件、背景与习惯。|Distinguer les événements achevés, le contexte et les habitudes.
Use haber and a participle to relate one time to another.|haberと過去分詞を使い、出来事の時間関係を表す。|Usar haber y un participio para relacionar momentos distintos.|Usar haber e um particípio para relacionar momentos diferentes em espanhol.|用 haber 与过去分词表达事件的时间关系。|Employer haber et un participe passé pour situer les événements les uns par rapport aux autres.
Build future and conditional forms and choose them for a purpose.|未来形と条件法の活用を覚え、伝えたい意味に合わせて使う。|Formar el futuro y el condicional y elegirlos según lo que quieras expresar.|Formar o futuro e o condicional e escolher conforme o que você quer expressar.|掌握将来时与条件式形式，根据表达目的选择使用。|Former le futur et le conditionnel et les choisir selon le sens voulu.
Build present and imperfect subjunctive forms and connect them to meaning.|接続法現在・過去の活用を覚え、意味と結び付けて使う。|Formar el presente y el imperfecto de subjuntivo y relacionarlos con su significado.|Formar o presente e o imperfeito do subjuntivo e relacioná-los ao significado.|掌握虚拟式现在时与未完成过去时形式，结合语义使用。|Former le subjonctif présent et imparfait et les relier au sens.
Express uncertainty about completed actions and unreal past conditions.|完了した動作への不確かさと、過去の事実に反する仮定を表す。|Expresar incertidumbre sobre acciones terminadas e hipótesis contrarias a la realidad pasada.|Expressar incerteza sobre ações concluídas e hipóteses contrárias à realidade passada.|表达对已完成动作的不确定性，以及与过去事实不符的假设。|Exprimer l’incertitude sur des actions achevées et des hypothèses contraires à la réalité passée.
Learn nouns with articles and useful phrases for food and the city.|食べ物や街に関する名詞を、冠詞や使えるフレーズと一緒に覚える。|Aprender nombres de alimentos y lugares con sus artículos y frases útiles.|Aprender nomes de alimentos e lugares com seus artigos e frases úteis.|结合冠词与实用短语学习食物和城市相关的名词。|Apprendre les noms d’aliments et de lieux avec leur article et des expressions utiles.
Use new words in practical combinations, not isolated translations.|新しい語を、実際に使える組み合わせで練習する。|Practicar palabras nuevas en combinaciones útiles.|Praticar palavras novas em combinações úteis.|在实用搭配中练习新词。|Pratiquer les nouveaux mots dans des associations utiles.
Use short, reusable phrases for polite contact and asking for help.|丁寧な声かけや助けを求める場面で、短い定番表現を使う。|Usar frases cortas de cortesía y para pedir ayuda.|Usar frases curtas de cortesia e para pedir ajuda.|使用简短常用语礼貌搭话或求助。|Employer des expressions courtes de politesse et de demande d’aide.
Learn natural word partners for needs, time and routine.|必要なこと・時間・習慣を表す自然な語の組み合わせを覚える。|Aprender combinaciones naturales para hablar de necesidades, tiempo y rutinas.|Aprender combinações naturais para falar de necessidades, tempo e rotinas.|学习表达需求、时间与习惯的自然搭配。|Apprendre les associations naturelles pour parler des besoins, du temps et des habitudes.
Arrange meetings, ask for assistance and react naturally.|会う予定を決め、手助けを頼み、自然に返答する。|Organizar encuentros, pedir ayuda y responder con naturalidad.|Combinar encontros, pedir ajuda e responder com naturalidade.|安排见面、请求帮助并自然回应。|Organiser des rencontres, demander de l’aide et réagir naturellement.
Describe routines and experiences with useful phrase patterns.|定番のフレーズを使い、習慣や経験を話す。|Describir rutinas y experiencias con expresiones útiles.|Descrever rotinas e experiências com expressões úteis.|用实用句式描述习惯与经历。|Décrire ses habitudes et ses expériences avec des expressions utiles.
Clarify meaning, add a point and express agreement.|意味を明確にし、要点を補い、賛同を伝える。|Aclarar el sentido, añadir una idea y expresar acuerdo.|Esclarecer o sentido, acrescentar uma ideia e expressar concordância.|澄清含义、补充观点并表达赞同。|Clarifier le sens, ajouter une idée et exprimer son accord.
Recognise everyday idioms and describe reactions accurately.|日常の慣用句を理解し、反応を的確に伝える。|Entender frases hechas cotidianas y describir reacciones con precisión.|Entender expressões idiomáticas do dia a dia e descrever reações com precisão.|理解日常惯用语，准确描述反应。|Comprendre les expressions idiomatiques du quotidien et décrire les réactions avec précision.
Use natural collocations to compare options and coordinate action.|自然な語の組み合わせを使い、選択肢を比べたり協力して行動したりする。|Usar combinaciones naturales para comparar opciones y coordinar acciones.|Usar combinações naturais para comparar opções e coordenar ações.|用自然的词语搭配比较方案并协调行动。|Employer des associations naturelles pour comparer les options et coordonner les actions.
Interpret figurative language and choose an appropriate tone.|比喩的な表現を理解し、場面に合う言い方を選ぶ。|Interpretar el lenguaje figurado y elegir el tono adecuado.|Interpretar a linguagem figurada e escolher o tom adequado.|理解比喻表达，选择适合场合的语气。|Interpréter le langage figuré et choisir un ton adapté.
Qualify evidence and organise a balanced argument.|根拠の限界を示し、両面を踏まえて論を組み立てる。|Matizar las pruebas y organizar un argumento equilibrado.|Indicar as limitações das evidências e organizar um argumento equilibrado.|说明依据的局限，兼顾不同角度组织论述。|Préciser les limites des éléments disponibles et construire une argumentation équilibrée.
Recognise indirect meanings and switch from idioms to formal language.|遠回しな意味を読み取り、慣用句を改まった表現に言い換える。|Identificar significados indirectos y reformular frases hechas en un registro formal.|Identificar sentidos indiretos e reformular expressões idiomáticas em um registro formal.|理解间接含义，将惯用语改写为正式表达。|Repérer les sens indirects et reformuler les expressions idiomatiques dans un registre formel.
Review every chapter at this level. Pass with 85% for a next-level recommendation.|このレベルの全章を復習する。85%以上で、次のレベルへの学習の目安が示されます。|Repasa todos los capítulos de este nivel. Con un 85 % o más, recibirás una recomendación para pasar al siguiente.|Revise todos os capítulos deste nível. Com 85% ou mais, você receberá uma recomendação para seguir ao próximo.|复习本级别的所有章节。达到85%后，系统会建议进入下一级学习。|Révisez tous les chapitres de ce niveau. Un score d’au moins 85 % permet d’obtenir une recommandation pour le niveau suivant.
Listen, shape the sound, practise in context and compare your recording.|音を聞き、口の動かし方を確かめ、フレーズの中で練習して自分の録音と比べる。|Escucha, practica cómo producir el sonido y compáralo con tu grabación en contexto.|Ouça, pratique como produzir o som e compare com sua gravação em contexto.|听发音、练习发音动作，在语境中练习并对比自己的录音。|Écoutez, travaillez l’articulation, pratiquez en contexte et comparez avec votre enregistrement.
Connect each character to its reading, then recall it independently.|文字と読み方を結び付け、ヒントなしで思い出す。|Relaciona cada carácter con su lectura y recuérdalo sin pistas.|Associe cada caractere à sua leitura e relembre sem dicas.|将字符与读音对应，再尝试独立回忆。|Associez chaque caractère à sa lecture, puis retrouvez-la sans aide.
Read combinations and preserve their timing.|仮名の組み合わせを読み、音の長さを正確に保つ。|Lee combinaciones de kana respetando la duración de los sonidos.|Leia combinações de kana respeitando a duração dos sons.|读懂假名组合，准确保持音长。|Lisez les combinaisons de kana en respectant la durée des sons.
Learn a character together with a word, its reading and its meaning.|漢字を単語・読み方・意味と一緒に覚える。|Aprende cada kanji con una palabra, su lectura y su significado.|Aprenda cada kanji com uma palavra, sua leitura e seu significado.|结合词语、读音与含义学习汉字。|Apprenez chaque kanji avec un mot, sa lecture et son sens.
Order a drink, choose a size and ask for the bill.|飲み物を注文し、サイズを選び、会計を頼む。|Pide una bebida, elige el tamaño y pide la cuenta.|Peça uma bebida, escolha o tamanho e peça a conta.|点饮品、选择大小并请求结账。|Commandez une boisson, choisissez la taille et demandez l’addition.
Follow a travel update and check the new departure point.|移動に関する変更を聞き取り、新しい出発場所を確認する。|Entiende un cambio en el viaje y confirma el nuevo punto de salida.|Entenda uma mudança na viagem e confirme o novo local de partida.|听懂行程变更，确认新的出发地点。|Comprenez une modification de trajet et vérifiez le nouveau lieu de départ.
Explain a delay, propose a deadline and make a commitment.|遅れの理由を説明し、締め切りを提案して対応を約束する。|Explica un retraso, propone un plazo y asume un compromiso.|Explique um atraso, proponha um prazo e assuma um compromisso.|解释延误、提出截止时间并作出承诺。|Expliquez un retard, proposez un délai et prenez un engagement.
Weigh a benefit against a practical concern and suggest a trial.|利点と実際の懸念を比較し、試行を提案する。|Compara una ventaja con una dificultad práctica y propone una prueba.|Compare uma vantagem com uma dificuldade prática e proponha um teste.|权衡好处与实际顾虑，并建议试行。|Comparez un avantage à une difficulté pratique et proposez un essai.
Distinguish a reported relationship from a causal conclusion.|報告された関連性と、因果関係の結論を区別する。|Distingue una relación observada de una conclusión causal.|Distinga uma relação observada de uma conclusão causal.|区分观察到的关联与因果结论。|Distinguez une relation observée d’une conclusion de causalité.
Listen to Anna and Pete introduce themselves, check a name and confirm an address.|AnnaとPeteの自己紹介を聞き、名前と住所を確認する。|Escucha las presentaciones de Anna y Pete y confirma un nombre y una dirección.|Ouça as apresentações de Anna e Pete e confirme um nome e um endereço.|听 Anna 和 Pete 自我介绍，确认姓名与地址。|Écoutez Anna et Pete se présenter, puis vérifiez un nom et une adresse.
Follow introductions and distinguish names, apartment numbers and a request.|自己紹介を聞き取り、名前・部屋番号・依頼を区別する。|Entiende las presentaciones e identifica nombres, números de apartamento y una petición.|Entenda as apresentações e identifique nomes, números de apartamento e um pedido.|听懂自我介绍，辨别姓名、房间号与请求。|Comprenez les présentations et repérez les noms, les numéros d’appartement et une demande.
Understand the speakers’ statements, experiences and reasons in this recording.|録音の中で話される内容・経験・理由を理解する。|Comprende lo que dicen los hablantes, sus experiencias y sus razones en esta grabación.|Entenda o que as pessoas dizem, suas experiências e seus motivos nesta gravação.|理解录音中说话者陈述的内容、经历与理由。|Comprenez les propos, les expériences et les raisons des personnes dans cet enregistrement.
min|分|min|min|分钟|min
MIN|分|MIN|MIN|分钟|MIN
Listen & answer|聞いて答える|Escuchar y responder|Ouvir e responder|听并回答|Écouter et répondre
Listen, record & compare|聞いて録音し、比べる|Escuchar, grabar y comparar|Ouvir, gravar e comparar|听、录音并对比|Écouter, enregistrer et comparer
`;
for(const line of goalRows.trim().split('\n')){
 const [source,...translations]=line.split('|');
 if(translations.length!==5||translations.some(value=>!value.trim()))throw Error('Incomplete course description: '+source);
 ['ja','es','pt','zh','fr'].forEach((locale,i)=>{reviewedCourseTitles[locale][source]=translations[i]});
}
for(const level of ['A1','A2','B1','B2','C1']){
 const source='Review the complete '+level+' pathway before moving on.';
 const translations={ja:level+'の学習内容全体を復習してから、次に進む。',es:'Repasa todo el contenido de '+level+' antes de seguir.',pt:'Revise todo o conteúdo de '+level+' antes de continuar.',zh:'复习完整的 '+level+' 学习内容后，再继续下一步。',fr:'Révisez l’ensemble du parcours '+level+' avant de poursuivre.'};
 for(const locale of ['ja','es','pt','zh','fr'])reviewedCourseTitles[locale][source]=translations[locale];
}

for(const locale of ['ja','es','pt','zh','fr'])Object.assign(reviewedCourseTitles[locale],idiomReviewedCopy[locale]);

for(const [source,values] of Object.entries(expansionDisplayCopy))for(const [locale,value] of Object.entries(values))(reviewedCourseTitles[locale]??={})[source]??=value;

for(const [source,values] of Object.entries(catalogInterfaceCopy))for(const locale of ['ja','es','pt','zh','fr'])reviewedCourseTitles[locale][source]??=values[locale];
