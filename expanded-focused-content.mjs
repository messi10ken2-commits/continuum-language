import {examples} from './curriculum/authoring.mjs';
export const expandedFocusedContent={};
const D=(language,scene,simpleAudio,audio,text)=>{const models=examples(text);if(models.length!==4)throw Error('Incomplete focused model');(expandedFocusedContent[language]||={})[scene]={simpleAudio,audio,models};};
D('fr','interview','Votre entretien est mardi à quatorze heures. Préparez un exemple de travail en équipe. Après votre présentation, nous discuterons d’une situation pratique.','Votre entretien aura lieu mardi à quatorze heures. Nous vous demanderons un exemple de travail en équipe : expliquez le problème, votre action et le résultat. Après une courte présentation, nous discuterons d’une situation pratique. Vous n’avez pas besoin d’apporter un contrat signé.',`
Dans mon précédent poste, j'ai [coordonné une petite équipe].~I describe relevant coordination experience.~annulé toute collaboration;refusé toute tâche
Pour résoudre le problème, j'ai [réparti les tâches et vérifié les délais].~I explain the concrete steps I took.~ignoré les délais;laissé les tâches sans responsable
Cette expérience m'a appris [à demander un retour plus tôt].~I state a lesson learned from experience.~à éviter toute question;à rejeter tout avis
Comment évaluerez-vous [la réussite après trois mois] ?~I ask how success will be assessed after three months.~la couleur des murs;le prix du déjeuner`);
D('fr','travel','La réception ferme à vingt-deux heures. Après, prenez la clé dans la boîte avec le code. Envoyez votre numéro de réservation.','La réception reste ouverte jusqu’à vingt-deux heures. Si vous arrivez plus tard, vous pourrez prendre la clé dans une boîte avec un code. Envoyez votre numéro de réservation pour recevoir les instructions. Il n’est pas nécessaire de faire un nouveau paiement.',`
Mon train est retardé et j'arriverai [vers vingt-deux heures trente].~I give the revised arrival time, about ten thirty at night.~hier matin;à midi hier
Pourriez-vous m'expliquer [comment récupérer la clé] ?~I ask how to collect the key.~pourquoi supprimer la réservation;comment annuler toute aide
Voici [mon numéro de réservation].~I provide the booking reference.~un autre nom sans rapport;une demande d'annulation
Merci de confirmer [qu'aucun supplément ne sera demandé].~I ask for confirmation that no extra charge applies.~que je dois payer deux fois;que tout est annulé`);
D('fr','work','Les chiffres arriveront jeudi matin. Le rapport est reporté à vendredi après-midi. Maya préviendra le client aujourd’hui.','Les chiffres arriveront jeudi matin, nous ne pourrons donc pas finir le rapport mercredi. Fixons la nouvelle échéance à vendredi après-midi. Maya contactera le client aujourd’hui pour expliquer le changement. L’analyse pourra être terminée jeudi.',`
Les chiffres n'arriveront que [jeudi matin].~I explain when the missing figures will arrive.~hier midi;mardi dernier
Pourrions-nous livrer le rapport [vendredi après-midi] ?~I propose a realistic revised deadline.~mercredi dernier;hier matin
Je peux [terminer l'analyse jeudi].~I commit to finishing the analysis on Thursday.~ignorer les chiffres;arrêter tout travail
Pourriez-vous [prévenir le client aujourd'hui] ?~I ask a colleague to update the client today.~ne rien dire au client;annuler tout contact`);
D('fr','living','Un tuyau fuit dans la cuisine. Le technicien vient mardi entre quatorze et seize heures. Videz le placard sous l’évier.','Le propriétaire a prévu un technicien mardi entre quatorze et seize heures. Il réparera le tuyau qui fuit dans la cuisine. Avant sa visite, videz le placard sous l’évier. Vous n’avez pas besoin d’acheter de pièces.',`
Depuis hier, [un tuyau fuit sous l'évier].~I describe a leak under the sink that began yesterday.~la fenêtre ferme bien;le chauffage fonctionne
Le placard est mouillé et [je ne peux pas utiliser l'évier normalement].~I explain the practical impact of the leak.~tout est parfaitement sec;aucune réparation n'est nécessaire
Je peux être chez moi [mardi entre quatorze et seize heures].~I give my availability for a repair.~hier matin seulement;vendredi avant l'aube
Pourriez-vous [organiser la réparation et confirmer l'heure] ?~I request a repair and time confirmation.~annuler toute intervention;ignorer la fuite`);
D('de','interview','Ihr Gespräch ist am Dienstag um vierzehn Uhr. Bereiten Sie ein Beispiel für Teamarbeit vor. Nach Ihrer Vorstellung besprechen wir eine praktische Situation.','Ihr Vorstellungsgespräch findet am Dienstag um vierzehn Uhr statt. Bereiten Sie ein Beispiel für Teamarbeit vor: Beschreiben Sie Problem, Vorgehen und Ergebnis. Nach einer kurzen Vorstellung besprechen wir einen praktischen Fall. Einen unterschriebenen Vertrag müssen Sie nicht mitbringen.',`
In meiner vorherigen Stelle habe ich [ein kleines Team koordiniert].~I describe relevant coordination experience.~jede Zusammenarbeit beendet;alle Aufgaben abgelehnt
Zur Lösung habe ich [Aufgaben verteilt und Fristen geprüft].~I explain concrete steps I took.~alle Fristen ignoriert;niemandem eine Aufgabe zugeteilt
Dabei habe ich gelernt, [früher Rückmeldung einzuholen].~I state a lesson learned from experience.~jede Nachfrage zu vermeiden;alle Hinweise abzulehnen
Wie bewerten Sie [den Erfolg nach drei Monaten] ?~I ask how success will be assessed after three months.~die Farbe der Wände;den Preis des Mittagessens`);
D('de','travel','Die Rezeption schließt um zweiundzwanzig Uhr. Danach erhalten Sie den Schlüssel aus einer Box mit Code. Senden Sie Ihre Buchungsnummer.','Die Rezeption ist bis zweiundzwanzig Uhr besetzt. Bei späterer Ankunft bekommen Sie den Schlüssel über eine Schlüsselbox mit Code. Senden Sie bitte Ihre Buchungsnummer, damit wir die Anleitung schicken können. Eine weitere Zahlung ist nicht nötig.',`
Mein Zug hat Verspätung; ich komme [gegen halb elf abends] an.~I give my revised arrival time, about ten thirty at night.~gestern früh;gestern mittags
Könnten Sie erklären, [wie ich den Schlüssel bekomme] ?~I ask how to collect the key.~warum jede Hilfe verboten ist;wie ich alles absage
Hier ist [meine Buchungsnummer].~I provide the booking reference.~ein unverbundener Name;eine endgültige Absage
Bitte bestätigen Sie, [dass keine Zusatzkosten entstehen].~I ask for confirmation that no extra charge applies.~dass ich doppelt bezahlen muss;dass alles storniert ist`);
D('de','work','Die Zahlen kommen am Donnerstagmorgen. Die neue Frist ist Freitagnachmittag. Maya informiert den Kunden heute.','Die Zahlen kommen am Donnerstagmorgen, daher können wir den Bericht nicht am Mittwoch abschließen. Verschieben wir die Frist auf Freitagnachmittag. Maya informiert den Kunden heute über die Änderung. Die Analyse kann am Donnerstag fertig werden.',`
Die Zahlen kommen erst [am Donnerstagmorgen].~I explain when the missing figures arrive.~gestern mittags;am vergangenen Dienstag
Könnten wir den Bericht [am Freitagnachmittag] liefern ?~I propose a realistic revised deadline.~gestern früh;am vergangenen Mittwoch
Ich kann [die Analyse am Donnerstag abschließen].~I commit to finishing the analysis on Thursday.~alle Zahlen ignorieren;jede Arbeit einstellen
Könnten Sie [den Kunden heute informieren] ?~I ask a colleague to update the client today.~dem Kunden nichts sagen;jeden Kontakt abbrechen`);
D('de','living','In der Küche ist ein Rohr undicht. Der Techniker kommt am Dienstag zwischen vierzehn und sechzehn Uhr. Räumen Sie den Schrank unter der Spüle frei.','Der Vermieter hat für Dienstag zwischen vierzehn und sechzehn Uhr einen Techniker bestellt. Er repariert das undichte Küchenrohr. Räumen Sie vor dem Besuch den Schrank unter der Spüle frei. Ersatzteile müssen Sie nicht selbst kaufen.',`
Seit gestern [ist ein Rohr unter der Spüle undicht].~I describe a leak under the sink that began yesterday.~schließt das Fenster gut;läuft die Heizung problemlos
Der Schrank ist nass; [ich kann die Spüle nicht normal benutzen].~I explain the practical impact of the leak.~alles ist vollkommen trocken;eine Reparatur ist unnötig
Ich bin [am Dienstag zwischen vierzehn und sechzehn Uhr] zu Hause.~I give my availability for a repair.~nur gestern früh;am Freitag vor Sonnenaufgang
Könnten Sie [die Reparatur organisieren und die Uhrzeit bestätigen] ?~I request a repair and confirmation of the time.~jeden Besuch absagen;die undichte Stelle ignorieren`);
D('it','interview','Il colloquio è martedì alle quattordici. Prepari un esempio di lavoro di gruppo. Dopo la presentazione discuteremo una situazione pratica.','Il colloquio è martedì alle quattordici. Prepari un esempio di lavoro di gruppo: descriva il problema, le azioni e il risultato. Dopo una breve presentazione discuteremo un caso pratico. Non serve portare un contratto firmato.',`
Nel lavoro precedente ho [coordinato un piccolo gruppo].~I describe relevant coordination experience.~interrotto ogni collaborazione;rifiutato ogni compito
Per risolvere il problema ho [distribuito i compiti e verificato le scadenze].~I explain concrete steps I took.~ignorato le scadenze;lasciato tutto senza responsabili
L'esperienza mi ha insegnato [a chiedere un riscontro prima].~I state a lesson learned from experience.~a evitare ogni domanda;a rifiutare ogni consiglio
Come valuterete [il successo dopo tre mesi] ?~I ask how success will be assessed after three months.~il colore delle pareti;il prezzo del pranzo`);
D('it','travel','La reception chiude alle ventidue. Dopo, può prendere la chiave da una cassetta con codice. Invii il numero di prenotazione.','La reception resta aperta fino alle ventidue. Se arriva più tardi, può prendere la chiave da una cassetta con codice. Invii il numero di prenotazione per ricevere le istruzioni. Non occorre effettuare un nuovo pagamento.',`
Il treno è in ritardo e arriverò [verso le ventidue e trenta].~I give my revised arrival time, about ten thirty at night.~ieri mattina;ieri a mezzogiorno
Potrebbe spiegarmi [come ritirare la chiave] ?~I ask how to collect the key.~perché ogni aiuto è vietato;come cancellare tutto
Ecco [il mio numero di prenotazione].~I provide the booking reference.~un nome senza relazione;una disdetta definitiva
Confermi, per favore, [che non ci saranno supplementi].~I ask for confirmation that no extra charge applies.~che devo pagare due volte;che tutto è annullato`);
D('it','work','I dati arriveranno giovedì mattina. La nuova scadenza è venerdì pomeriggio. Maya informerà il cliente oggi.','I dati arriveranno giovedì mattina, quindi non possiamo finire il rapporto mercoledì. Spostiamo la scadenza a venerdì pomeriggio. Maya contatterà il cliente oggi per spiegare il cambiamento. L’analisi potrà essere completata giovedì.',`
I dati arriveranno solo [giovedì mattina].~I explain when the missing figures arrive.~ieri a mezzogiorno;martedì scorso
Potremmo consegnare il rapporto [venerdì pomeriggio] ?~I propose a realistic revised deadline.~ieri mattina;mercoledì scorso
Posso [finire l'analisi giovedì].~I commit to finishing the analysis on Thursday.~ignorare tutti i dati;interrompere ogni lavoro
Potresti [avvisare il cliente oggi] ?~I ask a colleague to update the client today.~non dire niente al cliente;interrompere ogni contatto`);
D('it','living','Un tubo perde in cucina. Il tecnico arriva martedì tra le quattordici e le sedici. Svuoti il mobile sotto il lavello.','Il proprietario ha organizzato la visita di un tecnico martedì tra le quattordici e le sedici. Riparerà il tubo della cucina che perde. Prima della visita, svuoti il mobile sotto il lavello. Non deve comprare pezzi di ricambio.',`
Da ieri [un tubo perde sotto il lavello].~I describe a leak under the sink that began yesterday.~la finestra chiude bene;il riscaldamento funziona
Il mobile è bagnato e [non posso usare normalmente il lavello].~I explain the practical impact of the leak.~tutto è completamente asciutto;non serve riparare nulla
Posso essere a casa [martedì tra le quattordici e le sedici].~I give my availability for a repair.~solo ieri mattina;venerdì prima dell'alba
Potrebbe [organizzare la riparazione e confermare l'ora] ?~I request a repair and confirmation of the time.~annullare ogni visita;ignorare la perdita`);
D('zh','interview','面试在星期二下午两点。请准备一个团队合作的例子。自我介绍后会讨论一个实际情境。','您的面试安排在星期二下午两点。请准备一个团队合作的例子，说明问题、采取的行动和结果。简短自我介绍后，我们会讨论一个实际情境，不需要带签好的合同。',`
上一份工作中，我[协调过一个小团队]。~I describe relevant coordination experience.~终止了所有合作;拒绝了所有任务
为了解决问题，我[分配任务并检查期限]。~I explain concrete steps I took.~忽略了所有期限;让每件事都无人负责
这次经历让我学会[更早征求反馈]。~I state a lesson learned from experience.~避免任何提问;拒绝所有建议
请问如何评估[三个月后的工作成效]？~I ask how success will be assessed after three months.~墙壁的颜色;午饭的价格`);
D('zh','travel','前台晚上十点关门。之后可以用密码从钥匙箱取钥匙。请发送预订号码。','前台开放到晚上十点。如果您更晚到，可以使用密码从钥匙箱领取钥匙。请发送预订号码，我们会提供详细说明，不需要再次付款。',`
火车晚点了，我会[晚上十点半左右到]。~I give my revised arrival time, about ten thirty at night.~昨天早上到;昨天中午到
请问[怎么领取钥匙]？~I ask how to collect the key.~为什么不许提供帮助;怎么取消所有安排
这是[我的预订号码]。~I provide the booking reference.~一个无关的姓名;一份最终取消通知
麻烦确认[不会收取额外费用]。~I ask for confirmation that no extra charge applies.~必须重复付款;所有安排都取消了`);
D('zh','work','数据星期四上午到。新的截止时间是星期五下午。玛雅今天联系客户。','数据星期四上午才会到，所以星期三无法完成报告。我们把截止时间改到星期五下午吧。玛雅今天会联系客户说明变化，分析可以在星期四完成。',`
数据要到[星期四上午]才来。~I explain when the missing figures arrive.~昨天中午;上星期二
报告能否改到[星期五下午]交？~I propose a realistic revised deadline.~昨天早上;上星期三
我可以[星期四完成分析]。~I commit to finishing the analysis on Thursday.~忽略全部数据;停止所有工作
你能否[今天通知客户]？~I ask a colleague to update the client today.~完全不告诉客户;中断全部联系`);
D('zh','living','厨房有水管漏水。维修人员星期二下午两点到四点之间来。请清空水槽下的柜子。','房东安排维修人员星期二下午两点到四点之间上门，修理厨房漏水的管道。来之前，请清空水槽下的柜子，不需要自己购买零件。',`
从昨天开始，[水槽下的管子就在漏水]。~I describe a leak under the sink that began yesterday.~窗户关得很好;暖气一直正常
柜子湿了，[水槽也没法正常使用]。~I explain the practical impact of the leak.~所有地方都很干燥;完全不需要维修
我[星期二下午两点到四点]可以在家。~I give my availability for a repair.~只在昨天早上;星期五天亮前
能否[安排维修并确认时间]？~I request a repair and time confirmation.~取消所有上门服务;忽略漏水问题`);
D('ko','interview','면접은 화요일 오후 두 시입니다. 팀 활동 사례를 준비해 주세요. 자기소개 후 실제 상황을 논의합니다.','면접은 화요일 오후 두 시에 있습니다. 팀 활동 사례를 준비해 문제, 행동, 결과를 설명해 주세요. 짧은 자기소개 후에는 실제 상황을 논의합니다. 서명한 계약서를 가져오실 필요는 없습니다.',`
이전 직장에서 [작은 팀을 조율했습니다].~I describe relevant coordination experience.~모든 협업을 중단했습니다;모든 과제를 거부했습니다
문제를 해결하려고 [업무를 나누고 기한을 확인했습니다].~I explain concrete steps I took.~모든 기한을 무시했습니다;모든 일을 방치했습니다
그 경험을 통해 [더 일찍 의견을 구하는 법을 배웠습니다].~I state a lesson learned from experience.~질문을 피하는 법을 배웠습니다;모든 조언을 거부했습니다
[삼 개월 후 성과는 어떻게 평가하나요]？~I ask how success will be assessed after three months.~벽은 무슨 색인가요;점심은 얼마인가요`);
D('ko','travel','프런트는 밤 열 시에 닫습니다. 그 뒤에는 비밀번호로 보관함에서 열쇠를 받으세요. 예약 번호를 보내 주세요.','프런트는 밤 열 시까지 운영합니다. 더 늦게 도착하시면 비밀번호로 열쇠 보관함에서 열쇠를 받으실 수 있습니다. 안내를 받으려면 예약 번호를 보내 주세요. 다시 결제하실 필요는 없습니다.',`
기차가 늦어서 [밤 열 시 반쯤 도착할 예정입니다].~I give my revised arrival time, about ten thirty at night.~어제 아침에 도착했습니다;어제 정오에 도착했습니다
[열쇠를 어떻게 받는지 알려 주시겠어요]？~I ask how to collect the key.~왜 모든 도움을 금지하셨나요;전부 어떻게 취소하나요
이것이 [제 예약 번호입니다].~I provide the booking reference.~관계없는 이름입니다;최종 취소 통보입니다
[추가 요금이 없는지 확인해 주세요].~I ask for confirmation that no extra charge applies.~두 번 결제하게 해 주세요;전부 취소해 주세요`);
D('ko','work','자료는 목요일 오전에 옵니다. 새 마감은 금요일 오후입니다. 마야가 오늘 고객에게 알립니다.','자료는 목요일 오전에 도착하므로 수요일에는 보고서를 끝낼 수 없습니다. 마감을 금요일 오후로 옮깁시다. 마야가 오늘 고객에게 변경을 설명합니다. 분석은 목요일에 끝낼 수 있습니다.',`
자료는 [목요일 오전에야] 도착합니다.~I explain when the missing figures arrive.~어제 정오에;지난 화요일에
보고서를 [금요일 오후에] 제출해도 될까요？~I propose a realistic revised deadline.~어제 아침에;지난 수요일에
제가 [목요일에 분석을 끝낼 수 있습니다].~I commit to finishing the analysis on Thursday.~자료를 전부 무시하겠습니다;모든 일을 중단하겠습니다
[오늘 고객에게 알려 주실 수 있나요]？~I ask a colleague to update the client today.~고객에게 아무 말도 하지 마세요;모든 연락을 끊어 주세요`);
D('ko','living','부엌 배관에서 물이 샙니다. 기사는 화요일 오후 두 시에서 네 시 사이에 옵니다. 싱크대 아래 수납장을 비워 주세요.','집주인이 화요일 오후 두 시에서 네 시 사이에 수리 기사를 예약했습니다. 부엌에서 물이 새는 배관을 고칩니다. 방문 전 싱크대 아래 수납장을 비워 주세요. 부품을 직접 살 필요는 없습니다.',`
어제부터 [싱크대 아래 배관에서 물이 샙니다].~I describe a leak under the sink that began yesterday.~창문이 잘 닫힙니다;난방이 잘됩니다
수납장이 젖어서 [싱크대를 제대로 쓸 수 없습니다].~I explain the practical impact of the leak.~모든 곳이 말라 있습니다;수리가 필요 없습니다
[화요일 오후 두 시부터 네 시까지] 집에 있을 수 있습니다.~I give my availability for a repair.~어제 아침에만;금요일 해 뜨기 전에
[수리를 예약하고 시간을 확인해 주시겠어요]？~I request a repair and time confirmation.~모든 방문을 취소해 주세요;물이 새는 것을 무시해 주세요`);
D('ar','interview','المقابلة يوم الثلاثاء في الثانية ظهرا. حضر مثالا عن العمل الجماعي. بعد التعريف بنفسك سنناقش موقفا عمليا.','مقابلتك يوم الثلاثاء في الثانية ظهرا. يرجى تحضير مثال عن العمل الجماعي، مع توضيح المشكلة وما فعلته والنتيجة. بعد تقديم قصير سنناقش موقفا عمليا. لا تحتاج إلى إحضار عقد موقع.',`
في عملي السابق، [نسقت فريقا صغيرا].~I describe relevant coordination experience.~أنهيت كل تعاون;رفضت كل مهمة
لحل المشكلة، [وزعت المهام وتحققت من المواعيد].~I explain concrete steps I took.~تجاهلت كل المواعيد;تركت كل مهمة بلا مسؤول
علمتني التجربة [طلب الملاحظات مبكرا].~I state a lesson learned from experience.~تجنب أي سؤال;رفض كل نصيحة
كيف ستقيمون [النجاح بعد ثلاثة أشهر]؟~I ask how success will be assessed after three months.~لون الجدران;سعر الغداء`);
D('ar','travel','يغلق الاستقبال في العاشرة مساء. بعد ذلك تؤخذ المفاتيح من صندوق برمز. أرسل رقم الحجز.','يبقى الاستقبال مفتوحا حتى العاشرة مساء. إن وصلت لاحقا، يمكنك أخذ المفتاح من صندوق باستعمال رمز. أرسل رقم الحجز لنرسل التعليمات. لا يلزم إجراء دفعة جديدة.',`
تأخر القطار، وسأصل [نحو العاشرة والنصف مساء].~I give my revised arrival time, about ten thirty at night.~أمس صباحا;أمس ظهرا
هل يمكن توضيح [كيفية استلام المفتاح]؟~I ask how to collect the key.~سبب منع كل مساعدة;كيفية إلغاء كل ترتيب
هذا [رقم حجزي].~I provide the booking reference.~اسم لا علاقة له;إلغاء نهائي
يرجى تأكيد [عدم وجود رسوم إضافية].~I ask for confirmation that no extra charge applies.~وجوب الدفع مرتين;إلغاء كل شيء`);
D('ar','work','تصل الأرقام صباح الخميس. الموعد الجديد للتقرير عصر الجمعة. ستبلغ مايا العميل اليوم.','ستصل الأرقام صباح الخميس، لذلك لا يمكن إنهاء التقرير يوم الأربعاء. لننقل الموعد النهائي إلى عصر الجمعة. ستتصل مايا بالعميل اليوم لشرح التغيير. يمكن إنهاء التحليل يوم الخميس.',`
لن تصل الأرقام إلا [صباح الخميس].~I explain when the missing figures arrive.~أمس ظهرا;الثلاثاء الماضي
هل يمكن تسليم التقرير [عصر الجمعة]؟~I propose a realistic revised deadline.~أمس صباحا;الأربعاء الماضي
أستطيع [إنهاء التحليل يوم الخميس].~I commit to finishing the analysis on Thursday.~تجاهل كل الأرقام;إيقاف كل عمل
هل يمكنك [إبلاغ العميل اليوم]؟~I ask a colleague to update the client today.~إخفاء كل شيء عن العميل;قطع كل اتصال`);
D('ar','living','هناك تسرب في أنبوب المطبخ. يأتي الفني الثلاثاء بين الثانية والرابعة ظهرا. أفرغ الخزانة تحت الحوض.','رتب المالك زيارة فني يوم الثلاثاء بين الثانية والرابعة ظهرا لإصلاح أنبوب المطبخ المتسرب. يرجى إفراغ الخزانة تحت الحوض قبل الزيارة. لا تحتاج إلى شراء قطع غيار.',`
منذ أمس، [يتسرب الماء من أنبوب تحت الحوض].~I describe a leak under the sink that began yesterday.~تغلق النافذة جيدا;تعمل التدفئة جيدا
الخزانة مبتلة، [ولا أستطيع استخدام الحوض كالمعتاد].~I explain the practical impact of the leak.~وكل شيء جاف تماما;ولا حاجة لأي إصلاح
يمكنني البقاء في المنزل [الثلاثاء بين الثانية والرابعة ظهرا].~I give my availability for a repair.~أمس صباحا فقط;الجمعة قبل الفجر
هل يمكن [ترتيب الإصلاح وتأكيد الوقت]؟~I request a repair and time confirmation.~إلغاء كل زيارة;تجاهل التسرب`);

export const focusedLevelExtensions={
 fr:{B1:'Merci de confirmer les détails par écrit pour éviter des interprétations différentes.',B2:'Cet arrangement dépend de la disponibilité du personnel et de la salle. Sinon, nous devrons attendre la semaine suivante.',C1:'Seules quelques personnes ont répondu. Certaines apprécient la souplesse, mais cet échantillon ne permet pas de conclure à une préférence majoritaire ni à un effet causal. Gardons provisoirement cet arrangement et recueillons des avis plus variés avant le bilan.'},
 de:{B1:'Bitte bestätigen Sie die Einzelheiten schriftlich, damit keine unterschiedlichen Auslegungen entstehen.',B2:'Diese Vereinbarung hängt davon ab, ob Personal und Raum verfügbar sind. Andernfalls müssen wir bis zur folgenden Woche warten.',C1:'Bisher haben nur wenige Personen geantwortet. Einige schätzen die Flexibilität, doch diese Stichprobe belegt weder eine Mehrheitsmeinung noch eine Ursache. Behalten wir die Regelung vorläufig bei und sammeln wir vor der Auswertung breitere Rückmeldungen.'},
 it:{B1:'Confermi i dettagli per iscritto, per favore, per evitare interpretazioni diverse.',B2:'L’accordo dipende dalla disponibilità del personale e della sala. Altrimenti dovremo aspettare la settimana successiva.',C1:'Finora hanno risposto poche persone. Alcune apprezzano la flessibilità, ma il campione non dimostra una preferenza maggioritaria né un effetto causale. Manteniamo provvisoriamente l’accordo e raccogliamo opinioni più ampie prima della valutazione.'},
 zh:{B1:'请以书面形式确认细节，避免双方理解不同。',B2:'这个安排以人员和房间都有空为前提，否则必须等到下周。',C1:'目前只有少数人回复。有些人喜欢弹性安排，但这个样本不能说明多数人的看法，也不能证明因果效果。建议暂时保留安排，收集更广泛的反馈后再评估。'},
 ko:{B1:'서로 다르게 이해하지 않도록 세부 사항을 서면으로 확인해 주세요.',B2:'이 약속은 직원과 방이 모두 가능해야 합니다. 그렇지 않으면 다음 주까지 기다려야 합니다.',C1:'지금까지 소수만 응답했습니다. 일부는 유연성을 좋아하지만 이 표본으로 다수의 선호나 인과 효과를 입증할 수는 없습니다. 잠정 유지하면서 더 폭넓은 의견을 모은 뒤 평가합시다.'},
 ar:{B1:'يرجى تأكيد التفاصيل كتابة لتجنب اختلاف الفهم بين الطرفين.',B2:'يتوقف هذا الترتيب على توافر الموظفين والغرفة. وإلا فعلينا الانتظار إلى الأسبوع التالي.',C1:'لم يرد حتى الآن إلا عدد قليل. يفضل بعضهم المرونة، لكن العينة لا تثبت رأي الأغلبية ولا أثرا سببيا. لنبق الترتيب مؤقتا ونجمع آراء أوسع قبل التقييم.'}
};
