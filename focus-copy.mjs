import {focusedLevelCopy,levelRequirements,levelTaskPrompt} from './focused-level-copy.mjs';
const rows=`
Focused practice|技能別の集中レッスン|Práctica enfocada|Prática focada|专项练习|Entraînement ciblé
Build a specific skill, then put it to work in AI conversation.|苦手な技能を集中的に練習し、AI会話で使ってみましょう。|Entrena una habilidad y aplícala en conversaciones con la IA.|Treine uma habilidade e coloque-a em prática nas conversas com a IA.|集中训练一项技能，再到 AI 对话中实际运用。|Travaillez une compétence, puis utilisez-la en conversation avec l’IA.
Core practice · Free|基本練習・無料|Práctica básica · Gratis|Prática básica · Grátis|基础练习 · 免费|Entraînement de base · Gratuit
Catch the details|必要な情報を聞き取る|Capta los detalles|Entenda os detalhes|听出关键信息|Repérez les détails
Write a clear message|伝わる文章を書く|Escribe un mensaje claro|Escreva uma mensagem clara|写出清晰的文字|Rédigez un message clair
Explain your ideas aloud|考えをまとめて話す|Explica tus ideas en voz alta|Explique suas ideias em voz alta|有条理地表达想法|Exprimez vos idées à l’oral
Train your ear to find key facts and meaning in a recording.|音声から要点や具体的な情報を聞き取る練習です。|Entrena el oído para identificar datos clave y el sentido de una grabación.|Treine o ouvido para identificar informações importantes e o sentido de uma gravação.|训练从录音中提取关键事实和理解含义的能力。|Entraînez-vous à repérer les informations clés et le sens d’un enregistrement.
Organise, write and refine a complete response at your own pace.|自分のペースで構成を考え、文章を書いて推敲します。|Organiza, escribe y revisa una respuesta completa a tu ritmo.|Organize, escreva e revise uma resposta completa no seu ritmo.|按自己的节奏组织、撰写和修改完整的回答。|Organisez, rédigez et améliorez une réponse complète à votre rythme.
Build a structured spoken response, beyond short conversation replies.|短い受け答えから一歩進み、順序立てて説明する練習です。|Practica respuestas orales estructuradas, más allá de intercambios breves.|Pratique respostas orais estruturadas, além das respostas curtas de uma conversa.|从简短对答进阶到有条理的口头表达。|Construisez une réponse orale structurée, au-delà des échanges brefs.
Practise focused listening|聞き取りを集中練習|Practicar escucha enfocada|Praticar escuta focada|开始听力专项练习|Travailler la compréhension orale
Practise structured writing|文章の組み立てを練習|Practicar escritura estructurada|Praticar escrita estruturada|练习有条理的写作|Travailler l’expression écrite
Practise spoken explanations|まとまった説明を練習|Practicar explicaciones orales|Praticar explicações orais|练习口头说明|Travailler les explications orales
Practise a real-life situation|場面別の実践練習|Practica una situación real|Pratique uma situação real|真实场景练习|Entraînez-vous en situation réelle
Prepare for interviews, travel problems and shopping requests with focused listening, writing and speaking.|面接・旅行のトラブル・買い物の相談に備えて、聞く・書く・話す力を場面別に練習します。|Prepárate para entrevistas, problemas de viaje y gestiones en tiendas con práctica de escucha, escritura y expresión oral.|Prepare-se para entrevistas, problemas em viagens e pedidos em lojas com prática de escuta, escrita e fala.|通过听说写专项练习，为面试、旅行问题和购物沟通做好准备。|Préparez les entretiens, les imprévus en voyage et les demandes en magasin grâce à l’écoute, l’écrit et l’oral.
Open focused practice|集中レッスンを開く|Abrir práctica enfocada|Abrir prática focada|打开专项练习|Ouvrir l’entraînement ciblé
Interview preparation|面接の準備|Preparación para entrevistas|Preparação para entrevistas|面试准备|Préparation aux entretiens
Travel problem-solving|旅行中のトラブル対応|Resolver problemas de viaje|Resolver problemas em viagens|处理旅行中的问题|Gérer les imprévus en voyage
Shopping and returns|買い物と返品の相談|Compras y devoluciones|Compras e devoluções|购物与退换货|Achats et retours
Overall placement|総合の推奨開始レベル|Nivel general de partida|Nível geral recomendado|综合起始等级|Niveau de départ global
Skill breakdown and personalised practice are included in Premium.|技能別の詳しい分析と個別の復習提案はPremiumで利用できます。|Premium incluye el análisis por habilidades y práctica personalizada.|O Premium inclui análise por habilidade e prática personalizada.|Premium 提供技能细分分析和个性化练习建议。|Premium comprend l’analyse par compétence et la pratique personnalisée.
Detailed corrections and personal practice are included in Premium.|詳しい添削と個別の練習提案はPremiumで利用できます。|Premium incluye correcciones detalladas y práctica personalizada.|O Premium inclui correções detalhadas e prática personalizada.|Premium 提供详细批改和个性化练习。|Premium comprend des corrections détaillées et de la pratique personnalisée.
View membership|会員プランを見る|Ver planes|Ver planos|查看会员方案|Voir les formules
This course placement covers reading, language use and listening. Writing and speaking are assessed separately.|この推奨開始レベルは読解・言語運用・聞き取りに基づきます。書く力と話す力は別に評価します。|Este nivel se basa en lectura, uso de la lengua y escucha. La escritura y la expresión oral se evalúan por separado.|Este nível considera leitura, uso da língua e escuta. Escrita e fala são avaliadas separadamente.|此课程等级基于阅读、语言运用和听力。写作与口语另行评估。|Ce niveau repose sur la lecture, l’usage de la langue et l’écoute. L’écrit et l’oral sont évalués séparément.
Free: one conversation per day, up to 7 minutes. All scenarios are available. Pauses and provider waits do not count. Daily allowance resets at 00:00 UTC.|無料会員は1日1セッション・最大7分。すべての場面を選べます。一時停止とAIの応答待ちは時間に含めません。利用枠は毎日UTC午前0時に更新されます。|Gratis: una conversación al día de hasta 7 minutos, con todos los escenarios. Las pausas y esperas de la IA no cuentan. El cupo se renueva a las 00:00 UTC.|Grátis: uma conversa por dia de até 7 minutos, em qualquer cenário. Pausas e espera pela IA não contam. O limite é renovado às 00:00 UTC.|免费会员每天可进行一次最长 7 分钟的对话，所有场景均可选。暂停和等待 AI 回复不计时。每日 UTC 00:00 重置。|Gratuit : une conversation par jour de 7 minutes maximum, tous scénarios disponibles. Les pauses et l’attente de l’IA ne comptent pas. Renouvellement à 00 h 00 UTC.
minutes remaining|分（残り時間）|minutos restantes|minutos restantes|分钟剩余|minutes restantes
Your conversation time is complete. Finish and get your review.|練習時間が終了しました。会話を終了してレビューを確認できます。|Se ha agotado el tiempo. Finaliza para ver tu revisión.|O tempo terminou. Finalize para ver sua avaliação.|对话时间已结束，请结束对话并查看反馈。|Le temps est écoulé. Terminez pour consulter votre bilan.
Your daily conversation is complete. Return tomorrow or view Premium.|本日の会話は終了しています。明日また練習するか、Premiumをご確認ください。|Ya has completado tu conversación diaria. Vuelve mañana o consulta Premium.|Você já concluiu a conversa do dia. Volte amanhã ou confira o Premium.|今天的对话已完成。请明天再来，或查看 Premium。|Votre conversation quotidienne est terminée. Revenez demain ou découvrez Premium.
Resume your daily conversation. A new session is available tomorrow.|本日の会話を再開してください。新しい会話は明日始められます。|Retoma tu conversación de hoy. Mañana podrás iniciar otra.|Retome a conversa de hoje. Uma nova sessão estará disponível amanhã.|请继续今天的对话。明天可开始新的会话。|Reprenez la conversation du jour. Une nouvelle session sera disponible demain.
Premium is required for scenario-focused practice.|場面別の集中レッスンはPremiumで利用できます。|La práctica por situaciones requiere Premium.|A prática por situações está disponível no Premium.|场景专项练习需要 Premium。|Les entraînements par situation nécessitent Premium.
Extended AI conversation|AI会話の利用枠を拡大|Más práctica de conversación con IA|Mais prática de conversa com IA|更多 AI 对话练习|Davantage de conversation avec l’IA
Detailed skill feedback|技能別の詳しいフィードバック|Comentarios detallados por habilidad|Feedback detalhado por habilidade|详细技能反馈|Retours détaillés par compétence

Listen to the recording and identify the practical details. Answer before opening the transcript.|音声から必要な情報を聞き取り、スクリプトを開く前に答えてください。|Escucha e identifica los detalles útiles. Responde antes de abrir la transcripción.|Ouça e identifique os detalhes importantes. Responda antes de abrir a transcrição.|听录音并找出实用信息，查看文字稿前请先作答。|Écoutez et repérez les informations utiles. Répondez avant d’ouvrir la transcription.
Identify the audience and the outcome you need.|誰に何を伝えたいかを明確にしましょう。|Identifica a quién te diriges y qué quieres conseguir.|Identifique com quem você fala e o resultado desejado.|明确沟通对象和希望达成的目的。|Identifiez votre interlocuteur et le résultat souhaité.
Use specific details and a suitable polite register.|具体的な情報を入れ、相手に合う丁寧さで伝えましょう。|Incluye detalles concretos y un tono de cortesía adecuado.|Inclua detalhes concretos e use um tom de cortesia adequado.|提供具体细节，并使用合适的礼貌表达。|Donnez des détails précis et adoptez un registre de politesse adapté.
Check that your response answers every part of the task.|課題で求められた内容がすべて入っているか確認しましょう。|Comprueba que respondes a todas las partes de la tarea.|Confira se sua resposta atende a todas as partes da tarefa.|检查回答是否涵盖题目的所有要求。|Vérifiez que votre réponse traite chaque partie de la consigne.
Write a follow-up email after an interview. Thank the interviewer, connect one real experience to the role, and ask a relevant question about the next step.|面接後のお礼のメールを書いてください。面接官への感謝、自分の経験と仕事内容のつながり、次の選考についての質問を入れましょう。|Escribe un correo tras una entrevista. Da las gracias, relaciona una experiencia real con el puesto y pregunta por el siguiente paso.|Escreva um e-mail após uma entrevista. Agradeça, relacione uma experiência real ao cargo e faça uma pergunta sobre a próxima etapa.|写一封面试后的邮件，感谢面试官，将一段真实经历与岗位联系起来，并询问下一步安排。|Rédigez un courriel après un entretien. Remerciez la personne, reliez une expérience réelle au poste et posez une question sur la suite.
Introduce yourself for this role. Explain one relevant experience, what you did and the result. End with a question for the interviewer.|応募する仕事に向けて自己紹介をしてください。関連する経験を一つ取り上げ、取り組んだことと結果を説明し、最後に面接官へ質問しましょう。|Preséntate para el puesto. Explica una experiencia relevante, lo que hiciste y el resultado. Termina con una pregunta al entrevistador.|Apresente-se para a vaga. Explique uma experiência relevante, o que você fez e o resultado. Termine com uma pergunta ao entrevistador.|针对应聘岗位做自我介绍，说明一段相关经历、你的行动和结果，最后向面试官提问。|Présentez-vous pour ce poste. Décrivez une expérience pertinente, vos actions et le résultat. Terminez par une question.
Write to your hotel. Your arrival time has changed. Explain the new time, ask about late check-in, and request confirmation.|ホテルへのメッセージを書いてください。到着時刻が変わったことと新しい時刻を伝え、遅い時間のチェックインが可能か確認しましょう。|Escribe al hotel. Tu hora de llegada ha cambiado. Indica la nueva hora, pregunta por la llegada tardía y pide confirmación.|Escreva ao hotel. Seu horário de chegada mudou. Informe o novo horário, pergunte sobre o check-in tardio e peça confirmação.|给酒店写消息，说明抵达时间有变，告知新的时间，询问能否晚入住并请对方确认。|Écrivez à l’hôtel. Votre heure d’arrivée a changé. Indiquez le nouvel horaire, demandez si une arrivée tardive est possible et sollicitez une confirmation.
Leave a message for the hotel. Explain your delayed arrival, give the new time, and ask how to collect your key.|ホテルに伝言を残してください。到着が遅れる理由と新しい時刻を伝え、鍵の受け取り方を尋ねましょう。|Deja un mensaje al hotel. Explica el retraso, indica la nueva hora y pregunta cómo recoger la llave.|Deixe uma mensagem para o hotel. Explique o atraso, informe o novo horário e pergunte como pegar a chave.|给酒店留言，解释延迟抵达，告知新的时间，并询问如何取钥匙。|Laissez un message à l’hôtel. Expliquez votre retard, indiquez la nouvelle heure et demandez comment récupérer la clé.
Write to a shop about a faulty item bought yesterday. Describe the fault, request an exchange or refund, and explain which solution you prefer.|昨日買った不良品について、お店にメッセージを書いてください。不具合を説明し、交換または返金を依頼して、希望する対応を伝えましょう。|Escribe a una tienda por un producto defectuoso comprado ayer. Describe el fallo, pide un cambio o reembolso e indica qué solución prefieres.|Escreva a uma loja sobre um produto com defeito comprado ontem. Descreva o defeito, peça troca ou reembolso e explique sua preferência.|就昨天买到的瑕疵商品给商店写消息，说明问题，申请换货或退款，并表达偏好。|Écrivez au magasin au sujet d’un article défectueux acheté hier. Décrivez le défaut, demandez un échange ou un remboursement et indiquez votre préférence.
Explain a problem with an item you bought. Describe when you bought it, give a specific fault, and politely request a suitable solution.|買った商品に問題があることを説明してください。いつ買ったかと具体的な不具合を伝え、希望する対応を丁寧に依頼しましょう。|Explica un problema con una compra. Di cuándo la hiciste, describe el defecto y pide una solución con cortesía.|Explique um problema com uma compra. Diga quando comprou, descreva o defeito e peça uma solução com educação.|说明购买的商品存在的问题，告知购买时间，描述具体故障，并礼貌地提出解决请求。|Expliquez un problème avec un article acheté. Précisez la date, décrivez le défaut et demandez poliment une solution.
When is the interview?|面接はいつですか。|¿Cuándo es la entrevista?|Quando é a entrevista?|面试是什么时候？|Quand a lieu l’entretien ?
What should the applicant prepare?|応募者は何を準備すればよいですか。|¿Qué debe preparar la persona candidata?|O que a pessoa candidata deve preparar?|应聘者应准备什么？|Que doit préparer la personne candidate ?
What happens after the introduction?|自己紹介の後は何をしますか。|¿Qué ocurre después de la presentación personal?|O que acontece após a apresentação pessoal?|自我介绍之后会做什么？|Que se passe-t-il après la présentation personnelle ?
Until what time is reception open?|フロントは何時まで開いていますか。|¿Hasta qué hora está abierta la recepción?|Até que horas a recepção fica aberta?|前台营业到几点？|Jusqu’à quelle heure la réception est-elle ouverte ?
How can a late guest get the key?|遅く到着した場合、どうやって鍵を受け取れますか。|¿Cómo se recoge la llave si se llega tarde?|Como pegar a chave ao chegar tarde?|晚到的客人如何取钥匙？|Comment récupérer la clé en cas d’arrivée tardive ?
What must the guest send?|宿泊者は何を送る必要がありますか。|¿Qué debe enviar el huésped?|O que o hóspede precisa enviar?|客人需要发送什么？|Que doit envoyer la personne hébergée ?
Why does the customer want a return?|返品を希望する理由は何ですか。|¿Por qué quiere devolver el producto?|Por que a cliente quer devolver o produto?|顾客为什么想退货？|Pourquoi la cliente souhaite-t-elle retourner l’article ?
What is needed for a refund?|返金には何が必要ですか。|¿Qué hace falta para el reembolso?|O que é necessário para o reembolso?|退款需要什么？|Que faut-il pour obtenir un remboursement ?
When will replacement stock arrive?|交換できる商品はいつ入荷しますか。|¿Cuándo llegarán más unidades?|Quando chegarão novas unidades?|替换商品何时到货？|Quand les nouveaux articles arriveront-ils ?
Tuesday at ten|火曜日の午前10時|El martes a las diez|Terça-feira às dez|周二十点|Mardi à dix heures
Thursday at two|木曜日の午後2時|El jueves a las dos|Quinta-feira às duas|周四两点|Jeudi à quatorze heures
Tuesday at two|火曜日の午後2時|El martes a las dos|Terça-feira às duas|周二两点|Mardi à quatorze heures
A signed contract|署名済みの契約書|Un contrato firmado|Um contrato assinado|已签署的合同|Un contrat signé
One example of teamwork|チームで協力した経験を一つ|Un ejemplo de trabajo en equipo|Um exemplo de trabalho em equipe|一个团队合作的例子|Un exemple de travail en équipe
A finished presentation|完成した発表資料|Una presentación terminada|Uma apresentação pronta|准备好的演示稿|Une présentation terminée
They accept the job immediately|すぐに採用を承諾する|Acepta el puesto de inmediato|Aceita a vaga imediatamente|立即接受工作|La personne accepte immédiatement le poste
They discuss salary only|給与についてだけ話す|Hablan solo del sueldo|Conversam apenas sobre salário|只讨论薪资|On parle uniquement du salaire
They discuss a practical situation|実際の仕事で起こりそうな場面について話す|Hablan de una situación práctica|Conversam sobre uma situação prática|讨论一个实际情境|On échange sur une situation pratique
Until eight|午後8時まで|Hasta las ocho|Até as oito|到八点|Jusqu’à vingt heures
Until ten|午後10時まで|Hasta las diez|Até as dez|到十点|Jusqu’à vingt-deux heures
All night|一晩中|Toda la noche|A noite toda|整晚|Toute la nuit
From another guest|ほかの宿泊者から受け取る|De otro huésped|Com outro hóspede|从其他客人处领取|Auprès d’un autre client
From the restaurant|レストランで受け取る|En el restaurante|No restaurante|在餐厅领取|Au restaurant
From a key box using a code|暗証番号を使って鍵のボックスから受け取る|De una caja de llaves con código|Em uma caixa de chaves com código|用密码从钥匙箱中领取|Dans une boîte à clés avec un code
Their booking number|予約番号|Su número de reserva|O número da reserva|预订编号|Son numéro de réservation
Their passport by post|郵送でパスポートを送る|Su pasaporte por correo postal|O passaporte pelo correio|邮寄护照|Son passeport par courrier postal
A new payment|新たな支払い|Un nuevo pago|Um novo pagamento|一笔新的付款|Un nouveau paiement
The colour is wrong|色が違う|El color no es correcto|A cor está errada|颜色不对|La couleur ne convient pas
The size is wrong|サイズが違う|La talla no es correcta|O tamanho está errado|尺码不对|La taille ne convient pas
The zip is broken|ファスナーが壊れている|La cremallera está rota|O zíper está quebrado|拉链坏了|La fermeture éclair est cassée
The receipt|レシート|El recibo|O recibo|购物小票|Le reçu
The original delivery driver|配達した運転手本人|El repartidor original|O entregador que fez a entrega|原来的送货司机|La personne qui a effectué la livraison
A membership card|会員カード|Una tarjeta de socio|Um cartão de associado|会员卡|Une carte de membre
Today|今日|Hoy|Hoje|今天|Aujourd’hui
Friday|金曜日|El viernes|Sexta-feira|星期五|Vendredi
Next month|来月|El próximo mes|No próximo mês|下个月|Le mois prochain
Compare the detail you chose with the information in the recording.|選んだ内容と音声で伝えられた情報を比べて確認しましょう。|Compara tu respuesta con la información de la grabación.|Compare sua resposta com as informações da gravação.|将所选细节与录音中的信息进行比较。|Comparez votre réponse aux informations de l’enregistrement.
1 week|1週間|1 semana|1 semana|1周|1 semaine
1 month|1ヶ月|1 mes|1 mês|1个月|1 mois
6 months|半年|6 meses|6 meses|半年|6 mois
Never|無期限|Sin caducidad|Sem prazo|永久有效|Sans expiration
Tester Premium|テスター用Premium|Premium de prueba|Premium de teste|测试者 Premium|Premium de test
Open exclusive courses in Learn|「学ぶ」で限定コースを開く|Abrir cursos exclusivos en Aprender|Abrir cursos exclusivos em Aprender|在学习页面打开专属课程|Ouvrir les cours exclusifs dans Apprendre
Back to courses|コース一覧へ|Volver a los cursos|Voltar aos cursos|返回课程列表|Retour aux cours
Type the sentence you hear.|聞こえた文を入力してください。|Escribe la frase que escuches.|Digite a frase que ouvir.|输入你听到的句子。|Écrivez la phrase que vous entendez.
Put the words in order to make a practical response.|単語を並べ替えて、場面に合う返答を作ってください。|Ordena las palabras para formar una respuesta útil.|Ordene as palavras para formar uma resposta útil.|将词语排序，组成符合情境的回答。|Remettez les mots dans l’ordre pour former une réponse adaptée.
Complete the missing word in this practical expression.|この表現の空欄に入る単語を入力してください。|Completa la palabra que falta en esta expresión.|Complete a palavra que falta nesta expressão.|补全这个实用表达中缺少的词。|Complétez le mot manquant dans cette expression.
Compare the words and word order with the recording.|音声と比べて、単語と語順を確認しましょう。|Compara las palabras y su orden con la grabación.|Compare as palavras e a ordem com a gravação.|对照录音检查用词和词序。|Comparez les mots et leur ordre avec l’enregistrement.
This order makes the request or response clear and natural.|この語順にすると、依頼や返答が自然に伝わります。|Este orden hace que la petición o respuesta sea clara y natural.|Essa ordem deixa o pedido ou a resposta claro e natural.|这个词序能让请求或回答清晰自然。|Cet ordre rend la demande ou la réponse claire et naturelle.
Use the complete expression from this lesson in context.|このレッスンで学んだ表現を、文脈に合わせて完成させましょう。|Completa la expresión de la lección según el contexto.|Complete a expressão da lição de acordo com o contexto.|根据语境补全本课所学的表达。|Complétez l’expression de la leçon en tenant compte du contexte.
Workplace communication|仕事でのやり取り|Comunicación en el trabajo|Comunicação no trabalho|职场沟通|Communication au travail
Handle problems living abroad|海外生活のトラブルに対応する|Resolver problemas al vivir en el extranjero|Resolver problemas morando no exterior|应对海外生活中的问题|Gérer les difficultés de la vie à l’étranger
When will the figures arrive?|数字の資料はいつ届きますか？|¿Cuándo llegarán las cifras?|Quando os números vão chegar?|数据什么时候到？|Quand les chiffres arriveront-ils ?
When is the revised deadline?|変更後の締め切りはいつですか？|¿Cuál es la nueva fecha de entrega?|Qual é o novo prazo?|调整后的截止时间是什么时候？|Quelle est la nouvelle échéance ?
Who will contact the client?|誰がお客様に連絡しますか？|¿Quién contactará con el cliente?|Quem vai falar com o cliente?|谁负责联系客户？|Qui contactera le client ?
Thursday morning|木曜日の午前中|El jueves por la mañana|Quinta-feira de manhã|星期四上午|Jeudi matin
Wednesday afternoon|水曜日の午後|El miércoles por la tarde|Quarta-feira à tarde|星期三下午|Mercredi après-midi
Friday morning|金曜日の午前中|El viernes por la mañana|Sexta-feira de manhã|星期五上午|Vendredi matin
Thursday afternoon|木曜日の午後|El jueves por la tarde|Quinta-feira à tarde|星期四下午|Jeudi après-midi
Friday afternoon|金曜日の午後|El viernes por la tarde|Sexta-feira à tarde|星期五下午|Vendredi après-midi
Monday morning|月曜日の午前中|El lunes por la mañana|Segunda-feira de manhã|星期一上午|Lundi matin
The whole team|チーム全員|Todo el equipo|Toda a equipe|整个团队|Toute l’équipe
The client|お客様|El cliente|O cliente|客户|Le client
Maya|マヤ|Maya|Maya|玛雅|Maya
What is the problem?|どのような問題ですか？|¿Cuál es el problema?|Qual é o problema?|出了什么问题？|Quel est le problème ?
When can the technician visit?|修理の人はいつ来られますか？|¿Cuándo puede venir el técnico?|Quando o técnico pode vir?|维修人员什么时候能来？|Quand le technicien peut-il venir ?
What should the tenant do before the visit?|訪問前に入居者がすることは何ですか？|¿Qué debe hacer el inquilino antes de la visita?|O que o inquilino deve fazer antes da visita?|租客在上门维修前需要做什么？|Que doit faire le locataire avant la visite ?
The heating is broken|暖房が故障している|La calefacción está averiada|O aquecimento está quebrado|暖气坏了|Le chauffage est en panne
A kitchen pipe is leaking|台所の配管が水漏れしている|Una tubería de la cocina pierde agua|Um cano da cozinha está vazando|厨房水管漏水|Un tuyau de la cuisine fuit
The front door is stuck|玄関のドアが開かない|La puerta de entrada está atascada|A porta de entrada está emperrada|大门卡住了|La porte d’entrée est bloquée
This evening|今日の夕方|Esta tarde|Hoje à noite|今天傍晚|Ce soir
Tuesday between two and four|火曜日の午後2時から4時|El martes entre las dos y las cuatro|Terça-feira entre duas e quatro|星期二下午两点到四点|Mardi entre deux et quatre heures
Clear the cupboard under the sink|流し台の下の棚を空にする|Vaciar el armario debajo del fregadero|Esvaziar o armário embaixo da pia|清空水槽下的柜子|Vider le placard sous l’évier
Buy a replacement pipe|交換用の配管を買う|Comprar una tubería de repuesto|Comprar um cano novo|购买替换水管|Acheter un tuyau de rechange
Leave the front door unlocked|玄関の鍵を開けたままにする|Dejar la puerta sin cerrar con llave|Deixar a porta destrancada|不锁大门|Laisser la porte d’entrée déverrouillée
Describe a household problem and its impact.|住まいの問題と困っていることを説明する。|Describe un problema doméstico y sus consecuencias.|Descreva um problema na moradia e seu impacto.|描述住房问题及其影响。|Décrivez un problème dans le logement et ses conséquences.
Discuss repair times and access.|修理の日時と入室方法を相談する。|Acuerda el horario y el acceso para la reparación.|Combine o horário e o acesso para o conserto.|商量维修时间和入户安排。|Convenez des horaires et des modalités d’accès pour la réparation.
Confirm responsibilities and the next step.|誰が何をするか、次の対応を確認する。|Confirma las responsabilidades y el siguiente paso.|Confirme as responsabilidades e o próximo passo.|确认各方责任和下一步安排。|Confirmez les responsabilités et la prochaine étape.
Write to a colleague about a delayed report. Explain the dependency, propose a revised deadline and agree who will update the client.|報告書の遅れについて同僚にメッセージを書いてください。何を待っているか説明し、新しい締め切りを提案して、お客様への連絡担当を決めましょう。|Escribe a un compañero sobre el retraso de un informe. Explica de qué depende, propón una nueva fecha y acordad quién avisará al cliente.|Escreva a um colega sobre o atraso de um relatório. Explique a dependência, proponha um novo prazo e combine quem vai avisar o cliente.|给同事写消息说明报告延期的原因，提出新的截止时间，并商定由谁通知客户。|Écrivez à un collègue au sujet du retard d’un rapport. Expliquez ce qui bloque, proposez une nouvelle échéance et convenez de qui préviendra le client.
Explain a project delay to a colleague. Offer a realistic deadline and agree who will contact the client.|プロジェクトの遅れを同僚に説明してください。実現できる締め切りを提案し、お客様に誰が連絡するか相談しましょう。|Explica a un compañero el retraso de un proyecto. Propón una fecha realista y acordad quién contactará con el cliente.|Explique a um colega o atraso de um projeto. Proponha um prazo realista e combine quem vai falar com o cliente.|向同事解释项目延期情况，提出可行的截止时间，并商定由谁联系客户。|Expliquez le retard d’un projet à un collègue. Proposez une échéance réaliste et convenez de qui contactera le client.
Write to your landlord about a leaking kitchen pipe. Describe when it started and its impact, give your availability for a repair and request confirmation.|台所の配管の水漏れについて大家さんにメッセージを書いてください。いつから、どんな支障があるか説明し、修理に立ち会える時間を伝えて確認をお願いしましょう。|Escribe al propietario sobre una fuga en la cocina. Explica cuándo empezó y sus consecuencias, indica cuándo puedes recibir al técnico y pide confirmación.|Escreva ao proprietário sobre um cano vazando na cozinha. Explique quando começou e o impacto, informe sua disponibilidade para o conserto e peça confirmação.|给房东写消息说明厨房水管漏水，交代开始时间及影响，提供可配合维修的时间并请求确认。|Écrivez au propriétaire au sujet d’une fuite dans la cuisine. Précisez depuis quand et ses conséquences, donnez vos disponibilités pour la réparation et demandez confirmation.
Call your landlord about a leaking kitchen pipe. Explain the problem, arrange access for a repair and confirm the next step.|台所の配管の水漏れについて大家さんに電話してください。状況を説明し、修理のための入室を相談して、次の対応を確認しましょう。|Llama al propietario por una fuga en la cocina. Explica el problema, acuerda el acceso para repararla y confirma el siguiente paso.|Ligue para o proprietário sobre um cano vazando na cozinha. Explique o problema, combine o acesso para o conserto e confirme o próximo passo.|致电房东说明厨房水管漏水，安排维修人员入户，并确认下一步处理。|Appelez le propriétaire pour une fuite dans la cuisine. Expliquez le problème, organisez l’accès pour la réparation et confirmez la prochaine étape.
`;
export const focusCopy=Object.fromEntries(rows.trim().split('\n').filter(Boolean).map(line=>{const [k,...v]=line.split('|');if(v.length!==5)throw Error('Focused practice translation missing: '+k);return [k,Object.fromEntries(['ja','es','pt','zh','fr'].map((l,i)=>[l,v[i]]))]}));

Object.assign(focusCopy,focusedLevelCopy);
for(const [base,translations] of Object.entries({...focusCopy}).filter(([key])=>/^(Write |Introduce |Leave |Explain |Call |Tell )/.test(key)))for(const level of Object.keys(levelRequirements)){const instruction=focusCopy[levelRequirements[level]];focusCopy[levelTaskPrompt(base,level)]=Object.fromEntries(Object.keys(translations).map(lang=>[lang,translations[lang]+' '+instruction[lang]]));}
