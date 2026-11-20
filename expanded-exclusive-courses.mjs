import {expandedFocusedContent} from './expanded-focused-content.mjs';
import {languageInfo} from './languages.mjs';
// SERVER ONLY: original exclusive practice, never imported by a client module.
const plain=text=>text.replace(/[\[\]]/g,''),chunk=text=>text.match(/\[([^\]]+)\]/)?.[1];
const specs={
 diplomacy:{title:'Workplace diplomacy',level:'B2',scene:'work',description:'Practise tactful disagreement, clarification and realistic boundaries.',guide:'Acknowledge the other view, identify the specific concern and offer a feasible next step. A softened request still needs a clear action.'},
 interview:{title:'Interview preparation',level:'B2',scene:'interview',description:'Explain your contribution, give evidence and ask useful questions.',guide:'Describe the situation, your own action and the outcome. Distinguish evidence of experience from unsupported claims about ability.'},
 housing:{title:'Housing: practical repairs and clear requests',level:'B1',scene:'housing',description:'Describe a problem, explain its impact and agree on access for a repair.',guide:'Name the fault and when it started. Offer a practical time for access and ask for confirmation without making assumptions about legal duties.'},
 travel:{title:'Travel: changes, keys and confirmation',level:'B1',scene:'travel',description:'Handle a delayed arrival and confirm the practical details.',guide:'Give the updated time, ask a specific question about access and confirm any cost. Do not assume late arrival automatically cancels a booking.'},
 listening:{title:'Listen beyond the first impression',level:'B2',scene:'listening',description:'Follow corrections, distinguish a possibility from a promise and interpret conditions.',guide:'Listen to the full message. A correction replaces an earlier detail; a conditional offer does not establish that the condition has already been met.'},
 register:{title:'Choose register with care',level:'B2',scene:'register',description:'Keep your intent clear while matching language to the relationship and setting.',guide:'Politeness, formality and certainty are separate choices. A familiar request may suit a friend, while a professional message needs explicit scope and an appropriate form of address.'},
 academic:{title:'Read research without overstating it',level:'C1',scene:'academic',description:'Distinguish observation, inference and causation in a hypothetical study.',guide:'The invented comparison below is language practice, not a real study. A higher score in a self-selected group does not establish that its schedule caused the difference.'},
 'idioms-1':{title:'Everyday idioms: perspective and relationships',level:'C1',scene:'living',description:'Interpret native expressions in context and recognise their social force.',guide:'Identify the figurative meaning and register. A vivid expression can be affectionate, critical or dismissive depending on the relationship; a proverb is a perspective, not a guarantee.'},
 'idioms-2':{title:'Idioms at work: judgement and collaboration',level:'C1',scene:'work',description:'Use native idioms and proverbs while keeping professional intentions precise.',guide:'Interpret the conventional meaning first. For an important agreement, use an explicit neutral paraphrase rather than assuming everybody shares the same image or implication.'}
};
const packs={};
const D=(language,key,text,guide)=>{(packs[language]||={})[key]={models:text.trim().split('\n').map(line=>{const [text,meaning]=line.split('~');if(!text?.includes('[')||!meaning)throw Error('Incomplete exclusive model');return {text,meaning};}),guide};};
D('fr','diplomacy',`
Je comprends votre point de vue, mais [je préférerais attendre la fin des tests].~I acknowledge the proposal while raising a concrete testing concern.
Pourriez-vous préciser [de quel vendredi il s'agit] ?~I ask which Friday the speaker means.
Je peux m'en charger [si nous déplaçons l'autre échéance].~I offer to take the task only if another deadline changes.
L'essai ne concernait que dix personnes ; [gardons des conclusions prudentes].~I caution against conclusions stronger than a small trial supports.`);
D('fr','listening',`
Le train ne partira pas de la voie deux, [mais de la voie cinq].~The corrected platform is five rather than two.
Cette baisse [pourrait être liée aux nouveaux horaires].~A possible association is suggested without establishing it.
Nous commencerons [à condition que le financement soit confirmé].~Starting depends on confirmed funding.
Le service est [retardé, mais pas annulé].~The service is delayed but still operates.`);
D('fr','register',`
[Tu peux me passer le dossier quand tu as un moment] ?~A familiar request to send a file when convenient.
[Pourriez-vous nous transmettre les pièces demandées] ?~A polite professional request for the required documents.
[Nous vous saurions gré de confirmer la portée de votre offre].~A formal written request to clarify the offer’s scope.
[Merci de nous prévenir si le calendrier change].~A clear professional request for notice of scheduling changes.`,'Tu is familiar; vous is polite singular or plural. Nous vous saurions gré is formal written courtesy, not an obligation to use elaborate language in every workplace.');
D('fr','academic',`
Dans une étude fictive de quatre semaines, [quarante adultes ont choisi eux-mêmes leur rythme de pratique].~The invented study used voluntary selection rather than random assignment.
Les vingt participants quotidiens ont obtenu [72 points en moyenne, contre 68 pour les vingt autres].~The observed mean-score difference was four points in this sample.
Le niveau initial n'a pas été mesuré et [aucun suivi ultérieur n'a été réalisé].~Missing baseline and follow-up data limit interpretation.
Ces résultats [suggèrent une association sans établir de causalité].~The observed association does not itself establish a causal effect.`);
D('fr','idioms-1',`
Il devait venir, mais il m'a [posé un lapin].~He failed to turn up for the arranged meeting.
Depuis son départ, j'ai un peu [le cafard].~I feel rather low or down since the departure.
Ce détail m'a [mis la puce à l'oreille].~The detail aroused my suspicion or alerted me to something.
Je ne trouve pas la réponse ; [je donne ma langue au chat].~I give up guessing and invite the answer.`, 'Poser un lapin can sound accusatory; le cafard here is an informal feeling of sadness, not a clinical diagnosis. Donner sa langue au chat belongs to guessing situations, not every difficult task.');
D('fr','idioms-2',`
Avant de signer, [mettons les points sur les i].~Let us make the important details explicit before signing.
Il essaie de [ménager la chèvre et le chou].~He tries to satisfy two potentially conflicting sides.
Ce petit revenu [met du beurre dans les épinards].~The extra income makes finances more comfortable.
Après ses excuses, nous avons décidé de [passer l'éponge].~We decided to forgive the incident and move on.`, 'Ménager la chèvre et le chou can imply an uneasy compromise. Passer l’éponge means forgiving or letting an incident go; it does not authorise concealing evidence or ignoring safety obligations.');
D('de','diplomacy',`
Ich verstehe Ihren Vorschlag, würde aber [das Ende der Tests abwarten].~I acknowledge the proposal while raising a concrete testing concern.
Könnten Sie präzisieren, [welchen Freitag Sie meinen] ?~I ask which Friday the speaker means.
Ich kann das übernehmen, [wenn wir die andere Frist verschieben].~I offer to take the task only if another deadline changes.
Am Versuch nahmen nur zehn Personen teil; [wir sollten vorsichtig urteilen].~I caution against conclusions stronger than a small trial supports.`);
D('de','listening',`
Der Zug fährt nicht von Gleis zwei, [sondern von Gleis fünf].~The corrected platform is five rather than two.
Der Rückgang [könnte mit den neuen Zeiten zusammenhängen].~A possible association is suggested without establishing it.
Wir beginnen [unter der Bedingung, dass die Finanzierung bestätigt wird].~Starting depends on confirmed funding.
Der Dienst ist [verspätet, aber nicht ausgefallen].~The service is delayed but still operates.`);
D('de','register',`
[Kannst du mir die Datei schicken, wenn du Zeit hast] ?~A familiar request to send a file when convenient.
[Könnten Sie uns die benötigten Unterlagen zusenden] ?~A polite professional request for the required documents.
[Wir wären Ihnen dankbar, wenn Sie den Umfang Ihres Angebots präzisieren könnten].~A formal written request to clarify the offer’s scope.
[Bitte informieren Sie uns, falls sich der Zeitplan ändert].~A clear professional request for notice of scheduling changes.`, 'Du is familiar; Sie is polite address and is capitalised. A courteous conditional softens a request but does not remove the need to identify the requested document or action.');
D('de','academic',`
In einer erfundenen vierwöchigen Studie [wählten vierzig Erwachsene ihren Übungsrhythmus selbst].~The invented study used voluntary selection rather than random assignment.
Die zwanzig täglich Übenden erreichten [durchschnittlich 72 Punkte, die übrigen zwanzig 68].~The observed mean-score difference was four points in this sample.
Das Ausgangsniveau wurde nicht gemessen, und [es gab keine spätere Nachuntersuchung].~Missing baseline and follow-up data limit interpretation.
Die Ergebnisse [deuten auf einen Zusammenhang hin, belegen aber keine Ursache].~The observed association does not itself establish a causal effect.`);
D('de','idioms-1',`
Bei dieser Erklärung [verstehe ich nur Bahnhof].~I cannot make sense of the explanation.
Die Datei lag direkt vor mir; ich hatte wohl [Tomaten auf den Augen].~I failed to notice something obvious.
Obwohl es schwerfiel, ist er [über seinen Schatten gesprungen].~He overcame an internal reluctance or inhibition.
Bei dem kleinen Fehler sollten wir [die Kirche im Dorf lassen].~We should keep a proportionate perspective on the minor mistake.`, 'Tomaten auf den Augen can sound mocking when directed at someone else. Die Kirche im Dorf lassen asks for proportion, not dismissal of a serious concern.');
D('de','idioms-2',`
Wir haben lange beraten; jetzt sollten wir [Nägel mit Köpfen machen].~We should now take decisive concrete action after discussion.
Mit dieser Annahme sind wir [auf dem Holzweg].~This assumption has led us in the wrong direction.
Mit ihrer Zusammenfassung hat sie [den Nagel auf den Kopf getroffen].~Her summary identified the point precisely.
Nach der schriftlichen Klärung ist dieser Streitpunkt [vom Tisch].~The disputed point is settled or no longer under discussion.`, 'Auf dem Holzweg is a critical assessment of an approach. Vom Tisch means no longer pending in this context; it does not guarantee that a concern can never recur.');
D('it','diplomacy',`
Capisco la proposta, ma [preferirei attendere la fine dei test].~I acknowledge the proposal while raising a concrete testing concern.
Potrebbe precisare [a quale venerdì si riferisce] ?~I ask which Friday the speaker means.
Posso occuparmene [se spostiamo l'altra scadenza].~I offer to take the task only if another deadline changes.
La prova riguardava solo dieci persone; [evitiamo conclusioni troppo forti].~I caution against conclusions stronger than a small trial supports.`);
D('it','listening',`
Il treno non parte dal binario due, [ma dal binario cinque].~The corrected platform is five rather than two.
Il calo [potrebbe essere legato ai nuovi orari].~A possible association is suggested without establishing it.
Cominceremo [a condizione che il finanziamento sia confermato].~Starting depends on confirmed funding.
Il servizio è [in ritardo, ma non è stato cancellato].~The service is delayed but still operates.`);
D('it','register',`
[Mi mandi il file quando hai un momento] ?~A familiar request to send a file when convenient.
[Potrebbe inviarci i documenti richiesti] ?~A polite professional request for the required documents.
[Le saremmo grati se potesse precisare l'ambito della Sua offerta].~A formal written request to clarify the offer’s scope.
[Ci avvisi se il calendario cambia], per favore.~A clear professional request for notice of scheduling changes.`, 'Tu uses second-person forms and Lei third-person forms. Polite capitalisation is a convention with variation; consistent clear wording matters more than mechanically capitalising every pronoun.');
D('it','academic',`
In uno studio ipotetico di quattro settimane, [quaranta adulti hanno scelto da soli il ritmo di pratica].~The invented study used voluntary selection rather than random assignment.
I venti partecipanti del gruppo quotidiano hanno ottenuto [una media di 72 punti, contro 68 per gli altri venti].~The observed mean-score difference was four points in this sample.
Il livello iniziale non è stato misurato e [non è stato svolto un controllo successivo].~Missing baseline and follow-up data limit interpretation.
I risultati [suggeriscono un'associazione senza dimostrare un nesso causale].~The observed association does not itself establish a causal effect.`);
D('it','idioms-1',`
È una sorpresa, quindi [acqua in bocca] !~Keep the surprise secret for now.
Ho confuso i due moduli: [ho preso un granchio].~I made a mistake or got the wrong idea.
Oggi dimentico tutto, [ho la testa fra le nuvole].~I am distracted or daydreaming today.
[Non vedo l'ora di] rivedervi.~I am eagerly looking forward to seeing you again.`, 'Acqua in bocca is a familiar request for secrecy, suitable for a harmless surprise, not a reason to suppress a report. Prendere un granchio admits a mistake rather than describing every setback.');
D('it','idioms-2',`
Prima di firmare, [mettiamo i puntini sulle i].~Let us make the important details explicit before signing.
Il tempo è poco, quindi [taglio corto].~I will keep this brief and get directly to the point.
Sul metodo siamo [sulla stessa lunghezza d'onda].~We share a similar understanding or approach.
Con queste risorse, non facciamo [il passo più lungo della gamba].~We should not commit beyond our available means.`, 'Tagliare corto can sound abrupt; signal your purpose politely. Essere sulla stessa lunghezza d’onda does not mean agreement on every detail.');
D('zh','diplomacy',`
我理解你的想法，不过[最好等测试完成再决定]。~I acknowledge the proposal while raising a concrete testing concern.
能否说明[你指的是哪个星期五]？~I ask which Friday the speaker means.
我可以接手，[前提是另一项截止时间能调整]。~I offer to take the task only if another deadline changes.
试用者只有十人，[结论还应保持谨慎]。~I caution against conclusions stronger than a small trial supports.`);
D('zh','listening',`
列车不是从二号站台出发，[而是五号站台]。~The corrected platform is five rather than two.
这次下降[可能与新的时间安排有关]。~A possible association is suggested without establishing it.
我们会开始，[但须先确认资金落实]。~Starting depends on confirmed funding.
这班车[只是晚点，并没有取消]。~The service is delayed but still operates.`);
D('zh','register',`
[你有空把文件发我一下吧]。~A familiar request to send a file when convenient.
[能否请您把所需材料发送给我们]？~A polite professional request for the required documents.
[烦请进一步说明贵方报价所涵盖的范围]。~A formal written request to clarify the offer’s scope.
[如时间安排有变，请及时告知]。~A clear professional request for notice of scheduling changes.`, '您 and 贵方 are respectful forms, but formality is conveyed by the whole sentence. A clear request with an appropriate tone is preferable to accumulating elaborate courtesy words.');
D('zh','academic',`
在一项虚构的四周研究中，[四十名成年人自行选择了练习安排]。~The invented study used voluntary selection rather than random assignment.
每天练习的二十人[平均得分为72分，另外二十人为68分]。~The observed mean-score difference was four points in this sample.
研究没有测量起点水平，[也没有开展后续追踪]。~Missing baseline and follow-up data limit interpretation.
这些结果[提示相关性，但不能证明因果关系]。~The observed association does not itself establish a causal effect.`);
D('zh','idioms-1',`
他越解释，我越[一头雾水]。~The explanation leaves me thoroughly confused.
看到图示后，我[豁然开朗]。~The illustration suddenly makes the idea clear.
听到这个荒唐的借口，我[哭笑不得]。~The absurd excuse leaves me unsure whether to laugh or be upset.
原本已经够好了，再加这些反而[画蛇添足]。~The unnecessary additions spoil something that was already sufficient.`, '哭笑不得 describes an awkward or absurd reaction, not simultaneous literal crying and laughing. 画蛇添足 criticises unnecessary additions; it does not mean all revision is harmful.');
D('zh','idioms-2',`
我们先[集思广益]，再决定方案。~We should pool ideas before choosing a plan.
先查清原因，才能[对症下药]。~Find the underlying cause so the response addresses the actual problem.
别省略必要步骤，[欲速则不达]。~Rushing by skipping necessary steps can undermine the goal.
趁问题还没出现，先做好准备，这是[未雨绸缪]。~Prepare in advance before a foreseeable difficulty occurs.`, '对症下药 is figurative here, not medical advice. 欲速则不达 warns against counterproductive haste, not every efficient method. Proverbs do not guarantee an outcome.');
D('ko','diplomacy',`
제안은 이해하지만 [시험이 끝날 때까지 기다리는 편이 좋겠습니다].~I acknowledge the proposal while raising a concrete testing concern.
[어느 금요일을 말씀하시는지 확인해 주시겠어요]？~I ask which Friday the speaker means.
[다른 마감을 조정하면 이 일을 맡을 수 있습니다].~I offer to take the task only if another deadline changes.
참여자가 열 명뿐이므로 [결론은 신중해야 합니다].~I caution against conclusions stronger than a small trial supports.`);
D('ko','listening',`
열차는 이 번이 아니라 [오 번 승강장에서 출발합니다].~The corrected platform is five rather than two.
감소가 [새 일정과 관련이 있을 수 있습니다].~A possible association is suggested without establishing it.
[자금이 확정되어야 시작합니다].~Starting depends on confirmed funding.
열차는 [지연됐지만 취소되지는 않았습니다].~The service is delayed but still operates.`);
D('ko','register',`
[시간 날 때 파일 좀 보내 줘].~A familiar request to send a file when convenient.
[필요한 자료를 보내 주실 수 있을까요]？~A polite professional request for the required documents.
[귀사 제안의 적용 범위를 구체적으로 밝혀 주시면 감사하겠습니다].~A formal written request to clarify the offer’s scope.
[일정이 바뀌면 알려 주십시오].~A clear professional request for notice of scheduling changes.`, 'Familiar 해-style requires an appropriate relationship. 해요-style is polite conversational and 합니다-style formal polite. Honorific -시- concerns the referent and is not merely a switch for making every word formal.');
D('ko','academic',`
가상의 사 주 연구에서 [성인 사십 명이 스스로 연습 방식을 골랐습니다].~The invented study used voluntary selection rather than random assignment.
매일 연습한 이십 명의 [평균은 72점, 나머지 이십 명은 68점이었습니다].~The observed mean-score difference was four points in this sample.
초기 수준을 측정하지 않았고 [이후 추적 조사도 없었습니다].~Missing baseline and follow-up data limit interpretation.
결과는 [연관성을 시사하지만 인과관계를 입증하지는 않습니다].~The observed association does not itself establish a causal effect.`);
D('ko','idioms-1',`
남의 말을 쉽게 믿는 편이라 [귀가 얇다는 말을 들어요].~I am described as easily swayed by what others say.
잔치 음식을 넉넉히 준비하는 걸 보니 [손이 크네요].~The person is generous or lavish in preparing food.
분위기가 바뀐 걸 금방 알다니 [눈치가 빠르네요].~The person quickly notices social cues or a change in atmosphere.
합격 소식도 없는데 계획부터 세우니 [김칫국부터 마시는 셈이에요].~Making plans before acceptance assumes a favourable result too soon.`, '귀가 얇다 can be critical, not praise for good hearing. 손이 크다 describes generosity or scale here, not hand size. 김칫국부터 마시다 warns against premature assumptions.');
D('ko','idioms-2',`
중요한 계약이니 [돌다리도 두들겨 보고 건너야죠].~Even something apparently safe deserves checking in an important matter.
다른 방식을 전혀 모르면 [우물 안 개구리가 될 수 있어요].~A narrow perspective can leave someone unaware of the wider world.
한 번에 완벽하길 바라지 마세요. [첫술에 배부르랴].~Do not expect complete success from the first attempt.
좋은 생각도 실행해야 쓸모가 있죠. [구슬이 서 말이라도 꿰어야 보배예요].~Valuable resources or ideas need organisation and action to become useful.`, '우물 안 개구리 can sound disparaging when aimed at someone. 첫술에 배부르랴 encourages realistic expectations; it is not an excuse to ignore feedback or necessary checks.');
D('ar','diplomacy',`
أتفهم المقترح، لكنني [أفضل انتظار اكتمال الاختبارات].~I acknowledge the proposal while raising a concrete testing concern.
هل يمكن توضيح [أي يوم جمعة تقصدون]؟~I ask which Friday the speaker means.
يمكنني تولي المهمة [إذا عدلنا الموعد الآخر].~I offer to take the task only if another deadline changes.
شملت التجربة عشرة أشخاص فقط؛ [فلنتحفظ في الاستنتاجات].~I caution against conclusions stronger than a small trial supports.`);
D('ar','listening',`
لا ينطلق القطار من الرصيف الثاني، [بل من الخامس].~The corrected platform is five rather than two.
الانخفاض [قد يكون مرتبطا بالمواعيد الجديدة].~A possible association is suggested without establishing it.
سنبدأ [شريطة تأكيد التمويل].~Starting depends on confirmed funding.
الخدمة [متأخرة وليست ملغاة].~The service is delayed but still operates.`);
D('ar','register',`
[هل ترسل الملف حين يتاح لك الوقت]؟~A less elaborate MSA request to send a file when convenient.
[هل يمكنكم إرسال الوثائق المطلوبة]؟~A polite professional request for the required documents.
[نرجو التكرم بتوضيح نطاق عرضكم].~A formal written request to clarify the offer’s scope.
[يرجى إبلاغنا إن تغير الجدول].~A clear professional request for notice of scheduling changes.`, 'All four models use Modern Standard Arabic with different degrees of elaboration. They are not labelled as regional dialect. Plural address can be courteous or genuinely plural depending on the setting.');
D('ar','academic',`
في دراسة افتراضية استمرت أربعة أسابيع، [اختار أربعون بالغا جدول ممارستهم بأنفسهم].~The invented study used voluntary selection rather than random assignment.
بلغ متوسط العشرين الذين تدربوا يوميا [72 نقطة، مقابل 68 للعشرين الآخرين].~The observed mean-score difference was four points in this sample.
لم يقس المستوى الأولي، [ولم تجر متابعة لاحقة].~Missing baseline and follow-up data limit interpretation.
تشير النتائج [إلى ارتباط، ولا تثبت أثرا سببيا].~The observed association does not itself establish a causal effect.`);
D('ar','idioms-1',`
ذهب للحصول على الموافقة، لكنه [عاد بخفي حنين].~He returned empty-handed without achieving what he sought.
تكررت المشكلة حتى [بلغ السيل الزبى].~Repeated problems have reached an intolerable point.
يحبه أصدقاؤه لأنه [خفيف الظل].~His friends find him amusing and pleasant company.
لا تصرح قبل التحقق؛ لا [تلق الكلام على عواهنه].~Do not speak carelessly without considering or checking what you say.`, 'These are expressions used in MSA with differing formality and intensity. بلغ السيل الزبى is emphatic and literary; خفيف الظل praises pleasant humour, not irresponsibility.');
D('ar','idioms-2',`
لإتمام العمل نحتاج إلى التعاون، فـ[يد واحدة لا تصفق].~Cooperation is needed; one person alone cannot accomplish the shared task.
اختر أسلوبك بحسب الجمهور، فـ[لكل مقام مقال].~Choose language suited to the situation and audience.
لنحتفظ باحتياطي قبل الأزمة؛ [درهم وقاية خير من قنطار علاج].~Preventive preparation is preferable to a much larger later remedy.
تنويع المصادر مهم؛ [لا تضع البيض كله في سلة واحدة].~Avoid concentrating all resources or dependence in a single option.`, 'These proverbs provide perspectives, not universal proofs. A figurative call for prevention is not medical guidance; discuss concrete risks and responsibilities in a formal plan.');

// Register practice for the original four learning languages.
D('en','register',`
[Can you send me the file when you get a minute]?~An informal request to a familiar colleague for a file when convenient.
[Could you send the requested documents by Friday, please]?~A polite professional request with a clear deadline.
[We would appreciate clarification of the scope of your proposal].~A formal written request to clarify what a proposal covers.
[Please let us know if the schedule changes].~A neutral professional request for notice of scheduling changes.`, 'Can you is natural between familiar colleagues; could you softens the request without making it formal by itself. We would appreciate suits formal correspondence. Please is polite but does not cancel an unrealistic demand. Match the deadline to the agreement.');
D('es','register',`
[¿Me pasas el archivo cuando tengas un momento]?~A familiar singular request for a file when convenient.
[¿Podría enviarme los documentos solicitados antes del viernes, por favor]?~A polite request using usted with a clear deadline before Friday.
[Le agradeceríamos que aclarara el alcance de su propuesta].~A formal written request to clarify what a proposal covers.
[Por favor, avísenos si cambia el horario].~A professional request addressed with usted for notice of scheduling changes.`, 'The first model uses tú; the other models use usted. Usted can express respect or distance, but its use varies by region and relationship. Conditional forms soften requests; they do not make the requested action optional if a deadline has already been agreed.');
D('pt','register',`
[Você me manda o arquivo quando tiver um tempinho]?~A familiar request in Brazilian Portuguese for a file when convenient.
[Você poderia me enviar os documentos solicitados até sexta-feira, por favor]?~A polite professional request with a deadline no later than Friday.
[Agradeceríamos um esclarecimento sobre o escopo da sua proposta].~A formal written request to clarify what a proposal covers.
[Por favor, nos avise se houver alguma mudança no cronograma].~A professional request for notice of scheduling changes.`, 'These models use Brazilian Portuguese. Você can be neutral as well as familiar; it does not correspond mechanically to informal address in every region. Poderia softens a request. O senhor and a senhora may add respectful distance in appropriate relationships, but are not required for every professional message.');
D('ja','register',`
[時間があるときにファイルを送ってくれる]？~A casual request to someone close for a file when convenient.
[金曜日までに必要な書類をお送りいただけますか]。~A polite professional request to receive the required documents by Friday.
[ご提案の範囲について、ご説明いただけますと幸いです]。~A formal written request to clarify what a proposal covers.
[予定に変更がありましたら、お知らせください]。~A polite professional request for notice of scheduling changes.`, 'The first model is casual and assumes familiarity. The other models use polite or honorific request forms suitable for professional communication. More elaborate honorifics do not automatically make a request considerate: give a realistic deadline and a specific action. Relationships within and outside an organisation also affect the choice.');

export const expandedExclusiveCourses=Object.entries({...expandedFocusedContent,en:null,es:null,pt:null,ja:null}).flatMap(([language,focused])=>Object.entries(specs).filter(([key])=>focused||key==='register').map(([key,spec])=>{
 const row=key==='interview'?focused.interview:key==='housing'?focused.living:key==='travel'?focused.travel:packs[language]?.[key];
 if(!row||row.models.length!==4)throw Error('Incomplete exclusive course: '+language+' '+key);
 const locale=languageInfo(language).locale,models=row.models.map(m=>({...m,native:plain(m.text),target:chunk(m.text)})),guide=row.guide||spec.guide;
 const questions=models.map((m,i)=>({type:i%2?'listening':'interpretation',prompt:'Choose the intended meaning in this situation.',context:i%2?'':m.native,...(i%2?{audio:m.native,audioLocale:locale}:{}),options:[m.meaning,...models.filter((_,j)=>j!==i).slice(0,2).map(x=>x.meaning)],answer:0,note:m.meaning+'. '+guide}));
 const sample=models[0],reorder=models[2],tokens=['zh','ja'].includes(language)?[...new Intl.Segmenter(language,{granularity:'word'}).segment(reorder.native)].map(x=>x.segment).filter(x=>x.trim()):reorder.native.split(/\s+/);
 questions.push({type:'typing',prompt:'Type the full sentence you hear.',context:'',audio:sample.native,audioLocale:locale,answer:sample.native,note:'Use the wording of the recording. '+guide});
 questions.push({type:'cloze',prompt:'Complete the model with the wording taught here.',context:models[1].native.replace(models[1].target,'____'),answer:models[1].target,note:'Recall the complete phrase in its context. '+guide});
 questions.push({type:'reorder',prompt:'Put the words in order to rebuild the model.',context:'',tokens:[...tokens].reverse(),separator:['zh','ja'].includes(language)?'':' ',answer:reorder.native,note:'Keep the expression and its grammatical connections intact. '+guide});
 questions.push({type:'choice',prompt:'Choose the response that expresses this intention: '+models[3].meaning,context:'',options:[models[3].native,models[0].native,models[1].native],answer:0,note:models[3].meaning+'. '+guide});
 return {id:`${language}-exclusive-v1-${key}`,language,locale,contentVersion:1,...spec,explanation:spec.guide,exampleNote:language==='ar'?'Models use Modern Standard Arabic; regional dialects are not presented as interchangeable.':'These are original authored practice models. AI studio audio is not an authenticated regional human recording.',examples:models.map(x=>x.native),...(key==='academic'?{reading:models.map(x=>x.native).join(' '),visualData:{daily:72,weekly:68,participants:40}}:{}),vocabulary:models.map(m=>({phrase:m.target,meaning:m.meaning})),breakdown:{steps:['Identify the situation, purpose and relationship.','Listen and compare the complete models before practising the form.','Choose wording that preserves the intended meaning and level of certainty.'],tables:[],pitfall:guide,examples:models.map(m=>[m.native,m.meaning])},questions:questions.map((q,i)=>{if(!q.options)return q;const offset=i%q.options.length;return {...q,options:[...q.options.slice(offset),...q.options.slice(0,offset)],answer:(q.options.length-offset)%q.options.length};})};
}));
