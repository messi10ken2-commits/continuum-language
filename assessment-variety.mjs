import {languageInfo} from './languages.mjs';
// Versioned, held-out assessment material: no lesson examples are used here.
// Every form has a different communicative situation, not just reordered answers.
const packs=[];
const lines=s=>s.trim().split('\n').map(x=>x.split('|'));
function P(level,form,texts,reading,listening){packs.push({level,form,texts:Object.fromEntries(lines(texts).map(([lang,passage,audio])=>[lang,{passage,audio}])),reading:lines(reading),listening:lines(listening)});}
P('A1',0,`en|My name is Eva. I work in a bakery. On Monday I start at seven. My brother works in a school.|Hello, Eva. This is Tom. Please bring two cups to the kitchen. The plates are already on the table. Thank you.
es|Me llamo Eva. Trabajo en una panadería. El lunes empiezo a las siete. Mi hermano trabaja en una escuela.|Hola, Eva. Soy Tom. Por favor, trae dos tazas a la cocina. Los platos ya están en la mesa. Gracias.
pt|Meu nome é Eva. Trabalho em uma padaria. Na segunda-feira começo às sete. Meu irmão trabalha em uma escola.|Oi, Eva. Aqui é o Tom. Por favor, traga duas xícaras para a cozinha. Os pratos já estão na mesa. Obrigado.
ja|私はエバです。パン屋で働いています。月曜日は七時に仕事を始めます。兄は学校で働いています。|エバさん、トムです。カップを二つ、台所に持ってきてください。お皿はもうテーブルの上にあります。ありがとう。`,
`Where does Eva work?|In a bakery|In a school|In a hospital|In a bank
When does she start on Monday?|At seven|At eight|At noon|At ten
Who works in a school?|Her brother|Her mother|Eva|Tom`,
`What should Eva bring?|Two cups|Two plates|A chair|Some bread
Where should she take them?|To the kitchen|To the garden|To school|To the shop
Where are the plates?|On the table|Under a chair|In a bag|By the door`);
P('A1',1,`en|The swimming pool is next to the park. It opens at nine on Saturday. Children pay three euros. Adults pay five euros.|Hi, Ben. My red bag is in your car. My keys are in the bag. Please bring it to my office, not to my house.
es|La piscina está al lado del parque. El sábado abre a las nueve. Los niños pagan tres euros. Los adultos pagan cinco euros.|Hola, Ben. Mi bolso rojo está en tu coche. Mis llaves están en el bolso. Por favor, tráelo a mi oficina, no a mi casa.
pt|A piscina fica ao lado do parque. No sábado abre às nove. As crianças pagam três euros. Os adultos pagam cinco euros.|Oi, Ben. Minha bolsa vermelha está no seu carro. Minhas chaves estão na bolsa. Por favor, traga a bolsa para o meu escritório, não para a minha casa.
ja|プールは公園の隣にあります。土曜日は九時に開きます。子どもは三ユーロ、大人は五ユーロです。|ベンさん、私の赤いかばんはあなたの車にあります。鍵はかばんの中です。家ではなく、事務所に持ってきてください。`,
`Where is the pool?|Next to the park|Inside the school|Behind the bank|Opposite the station
When does it open on Saturday?|At nine|At three|At five|At seven
How much does a child pay?|Three euros|Five euros|Nine euros|Nothing`,
`What colour is the bag?|Red|Blue|White|Black
Where are the keys?|In the bag|In the office|At home|On a table
Where should Ben take the bag?|To the office|To the house|To the park|To the pool`);
P('A1',2,`en|Room available: a small room in a house with two students. The room has a bed and a desk. There is no television. The bus stop is outside the house.|Good morning. The fruit shop is closed today. You can buy apples at the market near the bridge. The market closes at one.
es|Habitación disponible: una habitación pequeña en una casa con dos estudiantes. Tiene una cama y un escritorio. No hay televisión. La parada de autobús está delante de la casa.|Buenos días. La frutería está cerrada hoy. Pueden comprar manzanas en el mercado cerca del puente. El mercado cierra a la una.
pt|Quarto disponível: um quarto pequeno em uma casa com dois estudantes. O quarto tem uma cama e uma escrivaninha. Não tem televisão. O ponto de ônibus fica em frente à casa.|Bom dia. A loja de frutas está fechada hoje. Vocês podem comprar maçãs na feira perto da ponte. A feira fecha à uma.
ja|小さい部屋が空いています。この家には学生が二人住んでいます。部屋にはベッドと机があります。テレビはありません。バス停は家の前です。|おはようございます。果物屋は今日休みです。橋の近くの市場でりんごを買えます。市場は一時に閉まります。`,
`Who lives in the house?|Two students|A teacher and a child|Three nurses|One family
What is in the room?|A bed and a desk|A television and a sofa|Only a bed|Only a television
Where is the bus stop?|In front of the house|Behind the market|Near a bridge|Inside the station`,
`Which shop is closed?|The fruit shop|The bakery|The bookshop|The pharmacy
What can people buy at the market?|Apples|Books|Shoes|Medicine
When does the market close?|At one|At two|At ten|At six`);
P('A1',3,`en|Sam has a black cat called Luna. She sleeps on a chair in the afternoon. Sam gives her food in the morning and evening. She does not like milk.|Hello, this is the art club. Our class is on Tuesday in room six. Bring a pencil. We have paper here. See you on Tuesday.
es|Sam tiene una gata negra que se llama Luna. Duerme en una silla por la tarde. Sam le da comida por la mañana y por la noche. No le gusta la leche.|Hola, somos el club de arte. Nuestra clase es el martes en el aula seis. Traigan un lápiz. Tenemos papel aquí. Hasta el martes.
pt|Sam tem uma gata preta chamada Luna. Ela dorme em uma cadeira à tarde. Sam dá comida para ela de manhã e à noite. Ela não gosta de leite.|Olá, aqui é do clube de arte. Nossa aula é na terça-feira, na sala seis. Tragam um lápis. Temos papel aqui. Até terça.
ja|サムはルナという黒い猫を飼っています。ルナは午後、椅子の上で寝ます。サムは朝と夜に餌をあげます。ルナは牛乳が好きではありません。|美術クラブです。授業は火曜日、六番の教室です。鉛筆を持ってきてください。紙はこちらにあります。では、火曜日に。`,
`What colour is Luna?|Black|White|Brown|Grey
Where does she sleep in the afternoon?|On a chair|Under a bed|In a box|Outside
What does Luna dislike?|Milk|Her chair|Sam|Sleeping`,
`When is the class?|On Tuesday|On Thursday|On Monday|On Sunday
Which room is it in?|Room six|Room two|Room ten|Room four
What should participants bring?|A pencil|Paper|Paint|A chair`);
P('A2',0,`en|Nora wanted to cycle to the lake yesterday, but her bike had a flat tyre. She took the bus instead. She arrived before lunch and walked home with her cousin.|Your jacket repair is ready. We replaced the zip, but kept the original buttons. You can collect it after two today. We close at six, an hour earlier than usual.
es|Nora quería ir al lago en bicicleta ayer, pero tenía una rueda pinchada. Fue en autobús. Llegó antes de comer y volvió a casa a pie con su primo.|Su chaqueta ya está arreglada. Cambiamos la cremallera, pero conservamos los botones originales. Puede recogerla hoy después de las dos. Cerramos a las seis, una hora antes de lo habitual.
pt|Nora queria ir de bicicleta ao lago ontem, mas um pneu estava furado. Ela foi de ônibus. Chegou antes do almoço e voltou a pé com o primo.|Sua jaqueta está consertada. Trocamos o zíper, mas mantivemos os botões originais. Pode buscá-la hoje depois das duas. Fechamos às seis, uma hora mais cedo que o normal.
ja|ノラは昨日、自転車で湖に行きたかったのですが、タイヤがパンクしていました。それでバスで行きました。昼食前に着いて、帰りはいとこと歩いて帰りました。|上着の修理が終わりました。ファスナーを交換しましたが、ボタンは元のままです。今日は二時以降に受け取れます。いつもより一時間早く、六時に閉店します。`,
`Why did Nora change her transport?|Her bike had a problem|It was raining|The lake was closed|Her cousin had no bike
How did she reach the lake?|By bus|On foot|By car|By train
What did she do with her cousin?|Walked home|Repaired the bike|Had breakfast|Took a train`,
`What was replaced?|The zip|The buttons|The sleeves|The whole jacket
When can the jacket be collected?|After two today|Only tomorrow|Before two today|After seven today
What is unusual today?|The shop closes earlier|The shop opens earlier|Repairs are free|Collection is impossible`);
P('A2',1,`en|I ordered a blue lamp, but a green one arrived. Customer service offered a refund or a replacement. I chose a replacement because I still needed a lamp. They will collect the green one on Friday.|The cooking lesson has moved to the community hall because the café kitchen is too small. Bring a container to take your food home. Ingredients are included in the fee.
es|Pedí una lámpara azul, pero llegó una verde. Atención al cliente me ofreció un reembolso o un cambio. Elegí el cambio porque todavía necesitaba una lámpara. Recogerán la verde el viernes.|La clase de cocina será en el centro comunitario porque la cocina de la cafetería es demasiado pequeña. Traigan un recipiente para llevarse la comida. Los ingredientes están incluidos en el precio.
pt|Pedi uma luminária azul, mas chegou uma verde. O atendimento ofereceu reembolso ou troca. Escolhi a troca porque ainda precisava de uma luminária. Vão buscar a verde na sexta-feira.|A aula de culinária mudou para o centro comunitário porque a cozinha do café é pequena demais. Tragam um recipiente para levar a comida para casa. Os ingredientes estão incluídos no preço.
ja|青いランプを注文しましたが、緑のものが届きました。店は返金か交換を提案しました。まだランプが必要なので、交換を選びました。緑のものは金曜日に回収するそうです。|料理教室の会場は公民館に変わりました。カフェの台所が狭すぎるためです。作った料理を持ち帰る容器を持ってきてください。材料費は受講料に含まれています。`,
`What was wrong with the delivery?|The colour was wrong|The lamp was broken|Two lamps arrived|Nothing arrived
What solution did the customer choose?|A replacement|A refund|A repair|A discount on the green lamp
What will happen on Friday?|The green lamp will be collected|The customer will pay again|The shop will close|The customer will order a lamp`,
`Why did the lesson move?|The original kitchen was too small|The teacher was ill|The café closed permanently|The fee increased
What should participants bring?|A container|All ingredients|A cooker|A recipe book
What does the fee include?|Ingredients|Transport home|A new container|A restaurant meal`);
P('A2',2,`en|We planned to see a film at eight. When we arrived, that showing was full. We bought tickets for ten and had dinner nearby while we waited. The film was funny, but we got home late.|This is a reminder about your dental appointment tomorrow at eleven. Please arrive ten minutes early to complete a form. If you cannot come, call us today rather than tomorrow morning.
es|Queríamos ver una película a las ocho. Cuando llegamos, no quedaban entradas para esa sesión. Compramos entradas para las diez y cenamos cerca mientras esperábamos. La película fue divertida, pero llegamos tarde a casa.|Le recordamos su cita con el dentista mañana a las once. Llegue diez minutos antes para rellenar un formulario. Si no puede venir, llámenos hoy, no mañana por la mañana.
pt|Queríamos ver um filme às oito. Quando chegamos, a sessão estava lotada. Compramos ingressos para as dez e jantamos por perto enquanto esperávamos. O filme foi divertido, mas chegamos tarde em casa.|Lembramos que sua consulta com o dentista é amanhã às onze. Chegue dez minutos antes para preencher um formulário. Se não puder vir, ligue hoje, e não amanhã de manhã.
ja|八時から映画を見る予定でしたが、着いたときにはその回は満席でした。十時の回のチケットを買って、待っている間に近くで夕食を食べました。映画は面白かったですが、帰宅は遅くなりました。|明日は十一時から歯科の予約が入っています。用紙に記入していただくので、十分前にお越しください。来られない場合は、明日の朝ではなく今日中にお電話ください。`,
`Why did they see a later showing?|The earlier one was full|They missed the bus|The cinema opened late|They disliked the earlier film
What did they do while waiting?|Had dinner|Went home|Visited a friend|Bought groceries
How did they feel about the film?|They found it funny|They found it boring|They left before it started|They could not understand it`,
`What is scheduled for tomorrow?|A dental appointment|A job interview|A cooking class|A film
Why arrive early?|To complete a form|To pay for parking|To meet a friend|To choose a doctor
When should they call if cancelling?|Today|Tomorrow morning|After the appointment|Next week`);
P('A2',3,`en|A neighbour looked after my plants while I was away for a week. I left them by the window and wrote watering instructions. When I returned, they were healthy. I brought her some tea as a thank-you.|The walking group will meet at the station entrance, not the usual café. Wear comfortable shoes. We will eat lunch outside, so bring a sandwich. If it rains, we will visit the museum instead.
es|Una vecina cuidó mis plantas durante la semana que estuve fuera. Las dejé junto a la ventana y escribí instrucciones para regarlas. Cuando volví, estaban bien. Le traje té para darle las gracias.|El grupo de senderismo se reunirá en la entrada de la estación, no en la cafetería de siempre. Lleven zapatos cómodos. Comeremos fuera, así que lleven un bocadillo. Si llueve, iremos al museo.
pt|Uma vizinha cuidou das minhas plantas durante a semana em que viajei. Deixei as plantas perto da janela e escrevi instruções para regá-las. Quando voltei, estavam saudáveis. Trouxe chá para agradecer a ela.|O grupo de caminhada vai se encontrar na entrada da estação, não no café de sempre. Usem sapatos confortáveis. Vamos almoçar ao ar livre, então levem um sanduíche. Se chover, visitaremos o museu.
ja|一週間留守にしている間、近所の人が植物の世話をしてくれました。植物は窓際に置き、水やりの説明を書いておきました。帰ったときも元気だったので、お礼にお茶を渡しました。|散歩グループは、いつものカフェではなく駅の入口に集合します。歩きやすい靴で来てください。外で昼食を食べるので、サンドイッチを持ってきてください。雨の場合は博物館に行きます。`,
`Who cared for the plants?|A neighbour|A colleague|A gardener hired by the city|A relative
What did the writer leave?|Watering instructions|Train tickets|A shopping list|A key for the museum
Why did the writer give tea?|To say thank you|To ask for money|To apologise for damaged plants|To invite someone to travel`,
`Where is the meeting point?|The station entrance|The usual café|Inside the museum|A neighbour's house
Why bring a sandwich?|Lunch will be outdoors|The café only sells drinks|It is a gift for the guide|The walk ends before breakfast
What happens if it rains?|They visit a museum|They cancel every activity|They walk farther|They meet the next week`);
P('B1',0,`en|Our choir used to rehearse above a restaurant, where kitchen noise often interrupted us. The library has offered a quieter room, but it is available only on Thursdays. Most members prefer moving, although two will need to change their work shifts. We will try the new room for a month before deciding.|I have checked the volunteer rota. We have enough people to serve lunch, but nobody to wash up afterwards. I can stay until three if someone covers my morning shift. Please reply by tonight so we can confirm the arrangement.
es|Nuestro coro ensayaba encima de un restaurante, donde el ruido de la cocina nos interrumpía. La biblioteca ofrece una sala más tranquila, pero solo los jueves. La mayoría prefiere trasladarse, aunque dos personas tendrán que cambiar sus turnos de trabajo. Probaremos la sala un mes antes de decidir.|He revisado los turnos de voluntariado. Hay suficientes personas para servir la comida, pero nadie para lavar los platos después. Puedo quedarme hasta las tres si alguien cubre mi turno de la mañana. Respondan esta noche como muy tarde para confirmar el acuerdo.
pt|Nosso coral ensaiava em cima de um restaurante, onde o barulho da cozinha nos interrompia. A biblioteca ofereceu uma sala mais silenciosa, mas disponível apenas às quintas. A maioria prefere mudar, embora duas pessoas precisem trocar seus turnos de trabalho. Vamos experimentar a sala por um mês antes de decidir.|Conferi a escala de voluntários. Há gente suficiente para servir o almoço, mas ninguém para lavar a louça depois. Posso ficar até as três se alguém cobrir meu turno da manhã. Respondam até hoje à noite para confirmarmos o combinado.
ja|合唱団は以前、レストランの上で練習していましたが、台所の音でよく中断していました。図書館が静かな部屋を貸してくれますが、木曜日しか使えません。大半は移動に賛成ですが、二人は仕事のシフト変更が必要です。一か月試してから決めます。|ボランティアの当番表を確認しました。昼食を配る人は足りていますが、その後の皿洗いをする人がいません。誰かが私の午前の当番を代わってくれれば、三時まで残れます。調整を確定したいので、今夜までに返事をください。`,
`Why is the choir considering a move?|Noise disrupts rehearsals|The restaurant has closed|The choir needs a larger kitchen|The library will pay members
What drawback does the new room have?|Limited availability|No heating|A higher floor|Poor sound insulation
What is the group's next step?|A one-month trial|An immediate permanent move|Cancelling rehearsals|Waiting a year`,
`Which task still needs volunteers?|Washing up|Serving lunch|Buying ingredients|Opening the building
What condition does the speaker attach to staying?|Someone covers the morning shift|Lunch finishes before noon|The venue changes|Everyone stays until three
Why is a reply needed tonight?|To confirm the rota|To cancel lunch|To pay the staff|To reserve a restaurant`);
P('B1',1,`en|Mina joined an online photography course because she could study after work. She enjoyed the videos, but rarely received feedback on her pictures. She has now joined a local group that meets twice a month. It costs more, yet discussing her work with others makes it worthwhile.|The printer on the second floor is working again. However, large colour jobs should still go to reception because the new ink has not arrived. If your documents are confidential, wait beside the printer rather than asking someone to collect them.
es|Mina se apuntó a un curso de fotografía en línea porque podía estudiar después del trabajo. Le gustaron los vídeos, pero casi nunca recibió comentarios sobre sus fotos. Ahora se ha unido a un grupo local que se reúne dos veces al mes. Cuesta más, pero hablar de sus fotos con otros compensa el gasto.|La impresora de la segunda planta vuelve a funcionar. Sin embargo, los trabajos grandes en color deben seguir enviándose a recepción porque no ha llegado la tinta nueva. Si los documentos son confidenciales, espere junto a la impresora en lugar de pedir a otra persona que los recoja.
pt|Mina entrou em um curso de fotografia on-line porque podia estudar depois do trabalho. Gostou dos vídeos, mas quase nunca recebeu comentários sobre suas fotos. Agora participa de um grupo local que se reúne duas vezes por mês. Custa mais, mas discutir seu trabalho com outras pessoas compensa o gasto.|A impressora do segundo andar voltou a funcionar. Porém, trabalhos grandes em cores ainda devem ir para a recepção porque a tinta nova não chegou. Se os documentos forem confidenciais, espere ao lado da impressora em vez de pedir a alguém que os busque.
ja|ミナは仕事の後に勉強できるので、オンラインの写真講座を選びました。動画は気に入りましたが、自分の写真へのコメントはほとんどもらえませんでした。今は月二回集まる地域のグループに参加しています。費用は高くても、作品について話し合えるので価値があると感じています。|二階のプリンターは直りました。ただ、新しいインクがまだ届いていないので、大量のカラー印刷は引き続き受付に頼んでください。機密文書の場合は、他の人に回収を頼まず、プリンターのそばで待ってください。`,
`Why did Mina initially choose an online course?|It fitted around her job|It guaranteed a qualification|Her local group had closed|It provided a free camera
What was missing from that course?|Feedback on her work|Video lessons|Evening access|Photography topics
Why does she accept the higher cost now?|She values discussion of her work|She meets every day|The videos are longer|She no longer works`,
`What has changed?|The printer has been repaired|Reception has closed|All ink has arrived|The printer has moved
Which work should still go to reception?|Large colour jobs|Every single page|Only confidential letters|All black-and-white jobs
How should confidential documents be handled?|Stay by the printer|Ask any colleague to collect them|Leave them until evening|Send them to everyone`);
P('B1',2,`en|The residents hoped to turn an empty shop into a playroom. The owner agreed to lend it for six months, provided they paid the electricity bills. Before buying furniture, they will inspect the wiring. If repairs are expensive, they may use the school hall instead.|I am calling about your walking tour. The guide is ill, so another guide will lead it. The starting time is unchanged, but meet outside the castle gate because the main square is being used for a market. Your tickets remain valid.
es|Los vecinos querían convertir una tienda vacía en una sala de juegos. El propietario aceptó prestarla durante seis meses, siempre que pagaran la electricidad. Antes de comprar muebles, revisarán la instalación eléctrica. Si repararla resulta caro, quizá utilicen el salón de la escuela.|Llamo por su visita guiada a pie. El guía está enfermo y lo sustituirá otro. La hora de inicio no cambia, pero deben reunirse frente a la puerta del castillo porque hay un mercado en la plaza mayor. Sus entradas siguen siendo válidas.
pt|Os moradores queriam transformar uma loja vazia em sala de recreação. O dono aceitou emprestá-la por seis meses, desde que pagassem a eletricidade. Antes de comprar móveis, verificarão a instalação elétrica. Se o conserto for caro, talvez usem o salão da escola.|Estou ligando sobre seu passeio a pé. O guia está doente e outro vai substituí-lo. O horário de início não mudou, mas o encontro será no portão do castelo porque haverá uma feira na praça principal. Seus ingressos continuam válidos.
ja|住民は空き店舗を遊び場にしたいと考えています。所有者は、電気代を払うことを条件に六か月貸すことに同意しました。家具を買う前に配線を点検します。修理費が高ければ、代わりに学校のホールを使うかもしれません。|徒歩ツアーについてお電話しました。ガイドが病気のため、別のガイドが担当します。開始時刻は変わりませんが、広場で市場が開かれるので、集合場所は城の門の前になります。チケットはそのまま使えます。`,
`What must the residents pay for?|Electricity|Buying the shop|The owner's furniture|A six-year lease
Why inspect the wiring first?|Repair costs may affect their choice|The school requires new furniture|The owner has cancelled|They want to sell the building
What is their alternative?|The school hall|A restaurant kitchen|A new shop outside town|An outdoor pool`,
`Why is there a different guide?|The original guide is ill|The tour language changed|The tickets were wrong|The original guide is at the market
What changes for visitors?|The meeting place|The starting time|The ticket price|The tour date
What should visitors do with their tickets?|Use the existing ones|Buy new ones|Exchange them at the school|Request a refund before joining`);
P('B1',3,`en|When Leo began working from home, he missed conversations with colleagues. He tried working in cafés, but found it hard to concentrate. Now he shares a small office three mornings a week. He can discuss ideas there and do quiet work at home on the other days.|About Saturday's book exchange: please label any books you bring with the age group they suit. You do not need to bring a book to take one home. Leftover copies will go to a charity, unless you ask us to keep yours for collection.
es|Cuando Leo empezó a trabajar desde casa, echaba de menos hablar con sus compañeros. Probó trabajar en cafeterías, pero le costaba concentrarse. Ahora comparte una oficina pequeña tres mañanas por semana. Allí puede intercambiar ideas y los otros días trabaja tranquilamente en casa.|Sobre el intercambio de libros del sábado: indiquen en los libros que traigan para qué edades son adecuados. No hace falta traer uno para llevarse otro. Donaremos los sobrantes, salvo que nos pidan guardar los suyos para recogerlos.
pt|Quando Leo começou a trabalhar em casa, sentiu falta de conversar com os colegas. Tentou trabalhar em cafés, mas tinha dificuldade para se concentrar. Agora divide um pequeno escritório três manhãs por semana. Lá pode trocar ideias e nos outros dias faz o trabalho mais silencioso em casa.|Sobre a troca de livros de sábado: indiquem nos livros que trouxerem a faixa etária adequada. Não é preciso trazer um livro para levar outro. Os que sobrarem serão doados, a menos que peçam para reservarmos os seus para retirada.
ja|レオは在宅勤務を始めて、同僚との会話がなくなったことを寂しく感じました。カフェでも働いてみましたが、集中できませんでした。今は週三日の午前中、共同の小さな事務所を使っています。そこで意見交換をし、残りの日は家で静かに作業します。|土曜日の本の交換会についてです。持ってくる本には、対象年齢を書いてください。本を持参しなくても、持ち帰ることができます。残った本は寄付しますが、回収を希望する場合は、保管してほしいとお知らせください。`,
`What did Leo miss at home?|Conversations with colleagues|Café meals|A long commute|Having his own desk
Why did cafés not solve the problem?|He could not concentrate|They were all closed|They banned laptops|He had to work at night
How does his current arrangement help?|It combines interaction and quiet work|It removes all office costs|It lets him stop working at home entirely|It requires less work each week`,
`What label is requested?|Suitable age group|Original price|Owner's address|Date of purchase
Who can take a book?|People who bring no books too|Only people who donate two|Only children|Only registered authors
What happens to leftover books by default?|They are donated|They are destroyed|They are sold back to owners|They remain indefinitely`);
P('B2',0,`en|The museum's late opening attracted fewer visitors than forecast, yet those who came stayed longer and spent more in the café. Management calls the trial encouraging, though security costs have not been included in the published figures. The trustees will consider extending it only after a full cost review; low attendance alone will not settle the matter.|I support offering staff a travel allowance, but a flat payment would favour people who already have cheap journeys. Could we first check actual costs and access to transport? That would delay the launch, admittedly, yet it would make the scheme easier to justify to those receiving less.
es|La apertura nocturna del museo atrajo a menos visitantes de lo previsto, aunque se quedaron más tiempo y gastaron más en la cafetería. La dirección considera alentadora la prueba, pero las cifras publicadas no incluyen los gastos de seguridad. El patronato solo estudiará ampliarla tras revisar todos los costes; la baja asistencia no decidirá por sí sola.|Apoyo ofrecer una ayuda de transporte al personal, pero una cantidad fija favorecería a quienes ya gastan poco. ¿Podríamos comprobar primero los costes reales y el acceso al transporte? Eso retrasaría el inicio, lo admito, pero permitiría justificar mejor el sistema ante quienes reciban menos.
pt|A abertura noturna do museu atraiu menos visitantes que o previsto, mas eles ficaram mais tempo e gastaram mais no café. A direção considera o teste promissor, embora os números publicados não incluam os custos de segurança. O conselho só avaliará a ampliação após uma revisão completa dos custos; a baixa frequência, sozinha, não decidirá a questão.|Apoio oferecer auxílio-transporte à equipe, mas um valor fixo favoreceria quem já tem deslocamentos baratos. Poderíamos verificar primeiro os custos reais e o acesso ao transporte? Isso atrasaria o lançamento, reconheço, mas tornaria o sistema mais fácil de justificar a quem recebesse menos.
ja|博物館の夜間開館では、来館者数は予測を下回ったものの、滞在時間は長く、カフェでの支出も多かった。運営側は有望な試みと評価するが、公表された数値に警備費は含まれていない。理事会は全費用の検証後に延長を検討する方針で、来館者数だけでは判断しない。|通勤手当の導入には賛成ですが、一律の支給額では、もともと交通費が安い人ほど有利になります。まず実際の費用と交通手段を調べませんか。開始は遅れますが、支給額が少ない人にも制度を説明しやすくなるはずです。`,
`What supports management's optimism?|Longer visits and higher café spending|Attendance exceeding forecasts|Reduced security costs|Unanimous trustee approval
What limits the published evaluation?|Some costs are omitted|Visitor numbers were never counted|The café was closed|All figures are from another museum
What is the trustees' position?|Review full costs before considering extension|End the trial solely because attendance was low|Extend it without conditions|Ignore visitor spending`,
`What concerns the speaker about a flat allowance?|It may distribute benefits unfairly|It is impossible to administer|Nobody needs help with travel|It will prevent all car use
What do they propose first?|Check costs and transport access|Pay everyone the maximum|Cancel the scheme|Ask only high earners
What trade-off do they acknowledge?|A slower launch for a more defensible scheme|Higher speed at the expense of fairness|Lower costs but no evidence|Less access in exchange for more parking`);
P('B2',1,`en|A publisher plans to release textbooks digitally before printing them. Teachers welcome quicker corrections but worry that students with unreliable internet will struggle. The publisher has therefore promised downloadable editions. This addresses access during outages, although schools still question whether older devices can run the files.|The candidate's presentation was impressive. I am less convinced by the claim that she can manage a large team: the examples she gave involved only two assistants. I would not reject her on that basis, but I would ask for a second interview focused on conflict management rather than another presentation.
es|Una editorial planea publicar los manuales en formato digital antes de imprimirlos. Los profesores valoran la rapidez de las correcciones, pero temen problemas para alumnos con internet inestable. La editorial promete versiones descargables. Esto resuelve el acceso durante cortes, aunque los centros siguen dudando de su compatibilidad con dispositivos antiguos.|La presentación de la candidata fue excelente. Me convence menos que pueda dirigir un equipo grande: sus ejemplos solo incluían a dos ayudantes. No la descartaría por eso, pero pediría otra entrevista centrada en la gestión de conflictos, no otra presentación.
pt|Uma editora pretende lançar os livros didáticos em formato digital antes da impressão. Professores aprovam a rapidez das correções, mas temem dificuldades para alunos com internet instável. A editora prometeu versões para download. Isso resolve o acesso durante quedas, embora as escolas ainda questionem a compatibilidade com aparelhos antigos.|A apresentação da candidata foi excelente. Estou menos convencido de que consiga administrar uma equipe grande: os exemplos envolviam apenas dois assistentes. Não a descartaria por isso, mas pediria outra entrevista voltada à gestão de conflitos, em vez de mais uma apresentação.
ja|出版社は教科書を印刷前にデジタルで公開する予定だ。教員は迅速な訂正を歓迎する一方、通信が不安定な生徒への影響を懸念している。出版社はダウンロード版を提供すると約束した。通信障害中の利用には役立つが、古い端末で動くかという疑問は学校側に残っている。|候補者の発表は見事でした。ただ、大きなチームを管理できるという点はまだ判断できません。挙げた例では部下が二人だけだったからです。それだけで不採用にはしませんが、再度発表してもらうより、対立への対応を中心に追加面接をしたいです。`,
`What benefit do teachers recognise?|Corrections can be made quickly|All devices will be replaced|Printing becomes compulsory|Students need no equipment
Which concern does downloading address?|Access during internet outages|The price of older devices|Every compatibility problem|Teacher training shortages
What remains unresolved?|Whether older devices can use the files|Whether textbooks contain corrections|Whether the publisher exists|Whether teachers want printed errors`,
`What distinction does the speaker make?|Presentation skill versus evidence of leadership|Experience versus academic qualifications|Salary versus working hours|Confidence versus punctuality
What does the speaker recommend?|A targeted follow-up interview|Immediate rejection|Immediate appointment|Repeating the same presentation
How strong is the speaker's negative judgment?|A reservation needing further evidence|A final rejection|A claim of dishonesty|A denial that the presentation was good`);
P('B2',2,`en|The council's reusable-cup scheme reduced street litter near participating cafés. However, some customers report making extra car journeys to return cups because collection points close early. Campaigners still support the scheme but want returns accepted at supermarkets. They argue that convenience should be measured across the whole borrowing-and-returning process.|We could meet the delivery date by removing the optional reporting feature. That would not affect the core booking system, but the client specifically praised the reports in our demonstration. Before cutting anything, let us explain the choice between a later release and reduced scope, and get written agreement.
es|El sistema municipal de vasos reutilizables redujo la basura cerca de las cafeterías participantes. Sin embargo, algunos clientes hacen viajes extra en coche para devolverlos porque los puntos de recogida cierran temprano. Los activistas siguen apoyándolo, pero piden devoluciones en supermercados. La comodidad debe evaluarse en todo el proceso de préstamo y devolución.|Podríamos cumplir la fecha de entrega eliminando la función opcional de informes. No afectaría al sistema principal de reservas, pero el cliente elogió precisamente los informes en la demostración. Antes de quitar nada, expliquemos la elección entre retrasar la entrega o reducir las funciones y obtengamos su acuerdo por escrito.
pt|O sistema municipal de copos reutilizáveis reduziu o lixo perto dos cafés participantes. Porém, alguns clientes fazem viagens extras de carro para devolver os copos porque os pontos de coleta fecham cedo. Os ativistas continuam apoiando o sistema, mas pedem devoluções em supermercados. A conveniência deve ser avaliada em todo o processo de empréstimo e devolução.|Podemos cumprir o prazo de entrega retirando a função opcional de relatórios. Isso não afetaria o sistema principal de reservas, mas o cliente elogiou justamente os relatórios na demonstração. Antes de cortar algo, vamos explicar a escolha entre adiar a entrega e reduzir as funções, e obter um acordo por escrito.
ja|市の再利用カップ制度により、参加カフェの周辺ではごみが減った。しかし、返却所が早く閉まるため、返却だけのために車を使う客もいる。推進団体は制度を支持しつつ、スーパーでも返却できるよう求めている。便利さは借りる時だけでなく、返すまでの過程全体で評価すべきだという。|追加のレポート機能を外せば納期には間に合います。予約の基本機能には影響しませんが、実演ではそのレポートを特に評価されました。削る前に、納期を延ばすか機能を減らすかを説明し、書面で同意を得ましょう。`,
`What unintended consequence is reported?|Extra car trips to return cups|More disposable cups at every café|Supermarkets closing earlier|A ban on borrowing cups
What is the campaigners' stance?|Support with a practical modification|Complete rejection|Support only for disposable cups|Opposition to all collection points
What broader principle do they advocate?|Assess the whole user process|Measure only borrowing speed|Ignore customer journeys|Replace all cafés with supermarkets`,
`What would removing reports achieve?|Meet the delivery date|Improve the core system's accuracy|Guarantee client satisfaction|Expand the agreed scope
Why is cutting reports sensitive?|The client particularly valued them|They are legally required|They are the only working feature|They were never demonstrated
What should happen before the cut?|Explain the trade-off and obtain agreement|Remove it without notice|Cancel the whole project|Promise both options at no cost`);
P('B2',3,`en|A language school replaced fixed homework deadlines with weekly planning meetings. Completion rates rose, although teachers spent longer advising individuals. The director sees the extra time as an investment in independence. Some teachers disagree: without gradually reducing support, they say, the new system may simply replace one form of dependence with another.|The restaurant has offered us a private room without a hire fee, provided we order their set menu. It sounds cheaper than the other venue, but several guests have dietary restrictions. I suggest asking for suitable alternatives before we accept; a free room is little use if half the group cannot eat.
es|Una escuela de idiomas sustituyó las fechas fijas de entrega por reuniones semanales de planificación. Aumentó la entrega de tareas, aunque los profesores dedicaron más tiempo a orientar a cada alumno. La directora lo considera una inversión en autonomía. Algunos docentes discrepan: sin reducir poco a poco el apoyo, el sistema podría sustituir una dependencia por otra.|El restaurante nos ofrece una sala privada sin alquiler si pedimos su menú fijo. Parece más barato que el otro local, pero varios invitados tienen restricciones alimentarias. Sugiero preguntar por alternativas antes de aceptar; una sala gratis sirve de poco si la mitad del grupo no puede comer.
pt|Uma escola de idiomas substituiu os prazos fixos de tarefas por reuniões semanais de planejamento. A entrega de tarefas aumentou, mas os professores passaram mais tempo orientando cada aluno. A diretora vê esse tempo como investimento em autonomia. Alguns docentes discordam: sem reduzir gradualmente o apoio, o sistema pode apenas trocar uma dependência por outra.|O restaurante ofereceu uma sala privativa sem aluguel, desde que peçamos o menu fixo. Parece mais barato que o outro local, mas vários convidados têm restrições alimentares. Sugiro perguntar sobre alternativas antes de aceitar; uma sala grátis ajuda pouco se metade do grupo não puder comer.
ja|語学学校は固定の宿題締切をやめ、毎週の計画相談を導入した。提出率は上がったが、個別指導にかかる教員の時間も増えた。校長は自立への投資と評価する。一方、一部の教員は、支援を徐々に減らさなければ、依存の対象が変わるだけだと指摘している。|レストランは指定のコースを注文すれば、個室料を無料にしてくれます。別の会場より安そうですが、食事制限のある参加者が何人もいます。受ける前に代替メニューを聞きましょう。半数が食べられないなら、部屋が無料でもあまり意味がありません。`,
`What improved after the change?|Homework completion|Teachers' free time|Exam scores explicitly measured|School income
What do some teachers question?|Whether the support leads to independence|Whether meetings take place|Whether homework exists|Whether fixed deadlines are illegal
What change do those teachers imply is needed?|Gradually reduce support|Remove all homework immediately|Increase dependence on meetings|End individual feedback permanently`,
`What condition comes with the free room?|Ordering the set menu|Paying for a larger room|Bringing all food|Arriving after midnight
What could undermine the apparent saving?|Unsuitable food for some guests|The restaurant being too close|The room having windows|Too many menu alternatives
What is the proposed next step?|Check alternatives before accepting|Accept immediately|Reject every restaurant|Ask guests to skip dinner`);
P('C1',0,`en|A university reports that graduates who used its mentoring service earned more than non-users. The report credits mentoring with narrowing inequality, yet participation was voluntary and users had higher prior grades. These differences do not render the service worthless; they do weaken the causal claim. An evaluation that accounts for initial differences is needed before the observed earnings gap can justify expansion on equity grounds.|I would distinguish transparency from disclosure alone. Publishing every contract may look open, but if the documents are unsearchable and key terms are buried in annexes, meaningful scrutiny remains difficult. The proposal is a useful start; calling it full accountability, however, would give the appearance of completion to work that has barely begun.
es|Una universidad informa de que los graduados que utilizaron su servicio de mentoría ganan más que quienes no lo usaron. Atribuye al programa una reducción de la desigualdad, aunque la participación era voluntaria y los usuarios tenían mejores notas previas. Eso no vuelve inútil el servicio, pero debilita la afirmación causal. Antes de ampliar el programa por razones de equidad, hay que evaluar las diferencias iniciales.|Distinguiría la transparencia de la mera publicación. Publicar todos los contratos parece abierto, pero si los documentos no permiten búsquedas y las condiciones clave están enterradas en anexos, el control efectivo sigue siendo difícil. La propuesta es un buen comienzo; llamarla plena rendición de cuentas daría por terminado un trabajo que apenas empieza.
pt|Uma universidade relata que os formados que usaram seu serviço de mentoria ganham mais que os demais. Atribui ao programa a redução da desigualdade, embora a participação fosse voluntária e os usuários tivessem notas anteriores mais altas. Isso não torna o serviço inútil, mas enfraquece a alegação causal. Antes de ampliá-lo por razões de equidade, é preciso avaliar as diferenças iniciais.|Eu distinguiria transparência de mera divulgação. Publicar todos os contratos parece aberto, mas, se os documentos não permitem buscas e as condições-chave ficam escondidas em anexos, a fiscalização efetiva continua difícil. A proposta é um bom começo; chamá-la de prestação de contas plena daria por concluído um trabalho que mal começou.
ja|ある大学は、相談制度を利用した卒業生の収入が非利用者より高いと報告し、制度が格差縮小に貢献したとしている。しかし利用は任意で、利用者は以前の成績も高かった。この差は制度の無価値を意味しないが、因果関係の主張を弱める。公平性を根拠に拡大する前に、当初の違いを考慮した評価が必要だ。|透明性と単なる公開は区別すべきです。すべての契約を公開しても、検索できず重要な条件が付属資料に埋もれていれば、実質的な検証は難しいままです。提案は有意義な第一歩ですが、説明責任を完全に果たしたと呼ぶのは、始まったばかりの仕事を完了したように見せることになります。`,
`What most directly weakens the causal claim?|Participants differed before using the service|Graduates received salaries|The university collected any data|Mentoring was available on campus
What does the author explicitly avoid concluding?|That the service is worthless|That selection matters|That grades differed|That further evaluation is needed
What would strengthen the case for expansion?|An evaluation accounting for initial differences|Repeating the same earnings comparison|Removing non-users from the report|Equating participation with random assignment`,
`What distinction structures the argument?|Access to documents versus usable scrutiny|Public contracts versus private employment|Search tools versus paper costs|Secrecy versus banning annexes
How does the speaker assess the proposal?|A worthwhile but insufficient beginning|A fully completed reform|An entirely worthless action|A reason to stop publishing
Why object to calling it full accountability?|It could conceal the remaining work|It would make contracts searchable|It would remove all annexes|It admits too much uncertainty`);
P('C1',1,`en|The archive's new exhibition includes letters from ordinary residents, correcting an earlier emphasis on officials. Yet the curator cautions against calling the collection representative: literacy, preservation and donation have each filtered whose voices survived. The letters broaden the account without closing its gaps. Treating their vividness as proof of completeness would reproduce the very exclusion the exhibition seeks to expose.|The proposed exception is defensible in this case, where the applicant was demonstrably misinformed. My concern is not that fairness requires identical outcomes, but that we have not articulated a principle for distinguishing this case from the next. Approving it without recording that rationale may leave future applicants dependent on who happens to review their file.
es|La nueva exposición del archivo incluye cartas de vecinos corrientes y corrige el énfasis anterior en las autoridades. Aun así, la comisaria advierte que la colección no es representativa: la alfabetización, la conservación y las donaciones han filtrado las voces que sobrevivieron. Las cartas amplían el relato sin llenar todos sus vacíos. Confundir su viveza con exhaustividad reproduciría la exclusión que se pretende revelar.|La excepción propuesta es defendible aquí, pues se ha demostrado que el solicitante recibió información errónea. No me preocupa que la justicia exija resultados idénticos, sino que no hemos formulado un criterio para distinguir este caso del siguiente. Aprobarlo sin documentar ese razonamiento puede dejar a futuros solicitantes a merced de quien revise su expediente.
pt|A nova exposição do arquivo inclui cartas de moradores comuns, corrigindo a ênfase anterior nas autoridades. Ainda assim, a curadora adverte que a coleção não é representativa: alfabetização, preservação e doações filtraram as vozes que sobreviveram. As cartas ampliam o relato sem preencher todas as lacunas. Confundir sua vivacidade com completude reproduziria a exclusão que a exposição procura revelar.|A exceção proposta é defensável neste caso, pois ficou comprovado que o candidato recebeu informações erradas. Minha preocupação não é que a justiça exija resultados idênticos, mas que não formulamos um princípio para distinguir este caso do próximo. Aprovar sem registrar essa justificativa pode deixar futuros candidatos dependentes de quem analisar seus processos.
ja|公文書館の新展示は一般住民の手紙を取り入れ、従来の公職者中心の構成を改めた。ただし、識字率、保存状態、寄贈の有無が残された声を選別しているため、全体を代表するとは言えないと担当者は注意する。手紙は歴史像を広げても空白を埋め尽くさない。生々しさを網羅性の証拠と見なせば、展示が明らかにしようとする排除を再生産しかねない。|申請者が誤った説明を受けたことが確認されている以上、今回の例外は妥当でしょう。問題は公平なら同じ結果にすべきということではなく、次の案件と区別する原則を明示していない点です。理由を記録せず認めれば、今後の申請者の扱いは、たまたま誰が審査するかに左右されかねません。`,
`Why is representativeness questioned?|Several historical filters shaped the surviving letters|All letters were written by officials|The curator rejects personal testimony|The exhibition contains no originals
What does 'broaden without closing gaps' imply?|The contribution is valuable but incomplete|The new material adds nothing|Every missing voice is now recovered|The archive should discard older material
What error does the final sentence warn against?|Mistaking vivid evidence for complete coverage|Reading letters in chronological order|Including ordinary residents|Acknowledging preservation limits`,
`What is the speaker's main reservation?|The lack of a recorded distinguishing principle|The applicant's claim is disproved|All exceptions are inherently unfair|The reviewer has no authority
What do they accept?|This particular exception can be justified|Every applicant deserves the same exception|Documentation is unnecessary|Fairness means identical outcomes
What future risk is identified?|Inconsistent decisions between reviewers|Guaranteed rejection of every application|Excessively clear rules|Automatic approval by law`);
P('C1',2,`en|A retailer advertises its packaging as recyclable, a claim technically accurate for the material in isolation. In most areas it serves, however, sorting facilities cannot separate the laminated layers. Critics therefore challenge the implication of routine recovery rather than the laboratory finding itself. The dispute turns on the gap between a material's theoretical capacity and the infrastructure through which customers must dispose of it.|I am wary of framing this as a choice between expertise and public participation. Residents may identify constraints that specialists overlook, while technical assessment can test whether suggested solutions are feasible. Neither contribution substitutes for the other. A consultation held after all consequential choices are fixed would preserve the language of participation while stripping it of influence.
es|Una empresa anuncia que su envase es reciclable, lo que resulta técnicamente cierto si se considera el material de forma aislada. Sin embargo, en la mayoría de sus zonas de venta, las plantas no pueden separar las capas laminadas. Los críticos cuestionan la recuperación habitual que se da a entender, no el hallazgo de laboratorio. La disputa gira en torno a la distancia entre posibilidad teórica e infraestructura real.|Me preocupa presentarlo como una elección entre conocimientos técnicos y participación pública. Los vecinos pueden detectar limitaciones que los especialistas pasan por alto, y la evaluación técnica puede comprobar la viabilidad de las soluciones. Ninguna aportación sustituye a la otra. Consultar cuando todas las decisiones importantes están cerradas conservaría el lenguaje de la participación, pero le quitaría influencia.
pt|Uma empresa anuncia sua embalagem como reciclável, afirmação tecnicamente correta quando se considera o material isoladamente. Porém, na maioria das regiões atendidas, as instalações não conseguem separar as camadas laminadas. Os críticos questionam a ideia de recuperação rotineira sugerida, não a descoberta laboratorial. A disputa envolve a distância entre capacidade teórica e infraestrutura disponível.|Tenho receio de apresentar isso como uma escolha entre conhecimento técnico e participação pública. Moradores podem identificar limitações que especialistas ignoram, enquanto a avaliação técnica testa a viabilidade das soluções. Nenhuma contribuição substitui a outra. Consultar quando todas as decisões relevantes já estão fechadas preservaria a linguagem da participação, mas retiraria sua influência.
ja|小売業者は包装を再生可能と宣伝しており、素材単独で考えれば技術的には正しい。しかし販売地域の大半では、処理施設が積層部分を分離できない。批判は実験結果そのものではなく、日常的に再資源化されるという含意に向けられている。争点は素材の理論上の可能性と、消費者が利用できる処理設備の隔たりにある。|専門知識か住民参加かという二者択一には慎重であるべきです。住民は専門家が見落とす制約を指摘し、技術評価は提案の実現可能性を検証できます。互いに代わりにはなりません。重要な選択をすべて確定してから意見を聞いても、参加という言葉は残りますが、その影響力は失われます。`,
`What do the critics primarily challenge?|The practical implication conveyed by the claim|Whether the laboratory result exists|Whether packaging contains any material|The concept of recycling in principle
Why can a technically true claim mislead here?|Available facilities cannot usually realise the claimed potential|Laboratory findings are always false|Customers are required to run laboratories|Laminated layers never exist
Which revision best addresses the criticism?|Qualify the claim with local processing limitations|Repeat the word recyclable more prominently|Remove all information about disposal|Claim that collection guarantees recovery`,
`Which framing does the speaker reject?|Expertise and participation as mutually exclusive|Technical assessment as useful|Residents having local knowledge|Testing proposed solutions
What relationship do they propose?|Complementary contributions|Public opinion replacing all expertise|Experts excluding residents|Either contribution being sufficient alone
When would participation become merely nominal?|When meaningful decisions are already fixed|When residents identify constraints|When feasibility is examined|When proposals can still change`);
P('C1',3,`en|An employer interprets low take-up of its retraining fund as evidence that staff see little need to acquire new skills. Interviews suggest another reading: applications require a manager's endorsement, and some staff fear that requesting training will be taken as an admission of inadequacy. The fund may be generous on paper while its approval process suppresses demand. Increasing the budget alone would not necessarily remove that barrier.|The revised translation is more fluent, but fluency is not the only criterion here. The original deliberately leaves the narrator's responsibility ambiguous; adding an explicit motive resolves that uncertainty for the reader. We should ask whether the smoother version clarifies the wording or silently settles an interpretive question the author chose to leave open.
es|Una empresa interpreta el escaso uso de su fondo de formación como falta de interés del personal en adquirir competencias. Las entrevistas sugieren otra lectura: las solicitudes requieren el visto bueno de un superior y algunos temen que pedir formación parezca admitir incapacidad. El fondo puede ser generoso sobre el papel y, aun así, el procedimiento frenar la demanda. Aumentar el presupuesto no eliminaría necesariamente esa barrera.|La traducción revisada es más fluida, pero ese no es el único criterio. El original deja deliberadamente ambigua la responsabilidad del narrador; añadir un motivo explícito resuelve esa incertidumbre. Debemos preguntarnos si la versión más natural aclara la redacción o decide, sin decirlo, una cuestión interpretativa que el autor dejó abierta.
pt|Uma empresa interpreta o baixo uso do fundo de capacitação como falta de interesse dos funcionários em adquirir competências. As entrevistas sugerem outra leitura: os pedidos exigem aprovação da chefia e alguns temem que solicitar treinamento pareça admitir incapacidade. O fundo pode ser generoso no papel enquanto o processo inibe a demanda. Aumentar o orçamento não eliminaria necessariamente essa barreira.|A tradução revisada é mais fluente, mas esse não é o único critério. O original deixa deliberadamente ambígua a responsabilidade do narrador; acrescentar uma motivação explícita resolve essa incerteza. Devemos perguntar se a versão mais natural esclarece a redação ou decide silenciosamente uma questão interpretativa que o autor deixou aberta.
ja|企業は再研修基金の利用率の低さを、新しい技能への需要が乏しい証拠と捉えている。しかし聞き取り調査では、上司の承認が必要なため、研修希望が能力不足の告白と受け取られることを恐れる社員がいた。制度上の予算が十分でも、承認過程が需要を抑えている可能性がある。増額だけでその障壁が消えるとは限らない。|改訳は読みやすくなっていますが、それだけでは評価できません。原文は語り手の責任を意図的に曖昧にしています。動機を明記すれば、その不確かさは解消されます。滑らかな訳が表現を明確にしたのか、それとも作者が開いたままにした解釈の問題を、知らないうちに決着させたのかを問うべきです。`,
`What assumption underlies the employer's interpretation?|Low participation directly reflects low demand|All requests were approved|Staff prefer larger budgets|Training is compulsory
What alternative mechanism do interviews suggest?|Fear of negative judgment discourages applications|Staff have all required skills|The fund has no money|Managers must attend training first
What follows for policy?|Address approval barriers, not only funding|Double the budget and assume the issue is solved|End training because nobody needs it|Treat every non-user as unmotivated`,
`What is the speaker's concern about the revision?|It may remove deliberate ambiguity|It is less fluent than the original|It contains no narrator|It makes every word harder
What distinction is central?|Clarifying wording versus resolving interpretation|Literal spelling versus punctuation|Author identity versus publication date|Reader age versus reading speed
What stance toward fluency is implied?|Valuable, but not sufficient on its own|Always harmful|The sole measure of quality|Unrelated to translation`);
const usage={};
function U(lang,level,data){usage[lang+'-'+level]=lines(data);}
// Twelve independent items per band, allocated three per form.
U('en','A1',`My parents ___ from Canada.|are|is|am|be
Choose the question about a price.|How much is this notebook?|How many is this notebook?|Where much this notebook?|Who is this notebook?
There ___ a mirror in the bathroom.|is|are|am|have
Lena ___ to work by tram every day.|goes|go|going|to go
Choose a polite request for water.|Could I have some water, please?|I water could please.|You have water yesterday.|What water did?
We do not have ___ sugar.|any|many|a|an
___ your uncle live nearby?|Does|Do|Is|Are
The shoes are ___ the bed, on the floor beneath it.|under|above|into|through
Choose the plural sentence.|These boxes are heavy.|This boxes is heavy.|These box are heavy.|This box are heavy.
I am a nurse. This is ___ uniform.|my|me|I|mine's
Choose the invitation.|Would you like to join us?|You joined us yesterday.|I cannot join you.|Where did you join?
She ___ like cold weather.|does not|do not|is not|not does`);
U('en','A2',`We ___ dinner when the lights went out.|were cooking|cook|are cook|have cook
Choose a request for directions.|How do I get to the post office?|How much is the post office?|Who works yesterday?|When did you post it?
This suitcase is ___ than mine.|heavier|heavy|heaviest|more heavier
I have lived here ___ March.|since|for|during of|by since
Choose a completed past action.|I sent the parcel yesterday.|I send the parcel yesterday.|I have send the parcel yesterday.|I sending the parcel yesterday.
You ___ feed the animals. It is forbidden.|must not|do not have to|might|would like to
There is not ___ time to walk there.|enough|many|a few|several
Choose the offer of help.|Shall I carry that for you?|Did you carry it last year?|Why is it heavy?|I carried nothing yesterday.
If the shop is open, I ___ some bread.|will buy|bought|buying|would bought
Have you ___ ridden a horse?|ever|yet already|since|ago
Choose the plan already arranged.|We are meeting Jo at noon tomorrow.|We met Jo tomorrow.|We have meet Jo tomorrow.|We was meeting Jo tomorrow.
He left early ___ catch the last ferry.|to|for to|so that to|because to`);
U('en','B1',`By the time I arrived, the talk ___.|had started|has start|will starting|was start
Choose an indirect question.|Could you tell me where the exit is?|Could you tell me where is the exit?|Could you tell where the exit does?|Could you where tell the exit?
If I had a bigger kitchen, I ___ more often.|would cook|will cook|cooked will|had cook
She suggested ___ the appointment.|moving|to moving|move to|we moving
Choose the sentence describing a past habit.|We used to camp here every summer.|We use camped here every summer.|We were use to camp here.|We used camping here tomorrow.
The parcel ___ to the wrong address yesterday.|was delivered|has deliver|was delivering it|delivered was
I wish I ___ more time to practise.|had|have|will have|having
Choose a contrast without changing the meaning of 'despite the rain'.|Although it was raining, we went out.|Because it was raining, we stayed in.|Unless it rains, we stayed in.|It rained so we cancelled.
That is the woman ___ repaired my watch.|who|which|where|what
He denied ___ the window.|breaking|to break|breaks|was break
Choose a deduction from strong evidence.|The ground is wet; it must have rained.|The ground is wet; it must rain yesterday.|The ground is wet; it must raining.|The ground is wet; it has must rain.
I will call you as soon as I ___.|arrive|will arrive|would arrive|arrived tomorrow`);
U('en','B2',`Had I known about the closure, I ___ a different route.|would have taken|would take|had taken|will have taken
Choose a qualified disagreement.|I see the appeal, though the costs need closer scrutiny.|There are no costs under any circumstances.|I agree without any reservations.|The idea is unquestionably perfect.
The meeting was postponed ___ a lack of evidence.|owing to|despite|regardless of|in addition to
Not until the audit ended ___ the error.|did we notice|we noticed|we had noticed|we were noticing
Choose a sentence preserving 'not all'.|Not all applicants met the criteria.|No applicants met the criteria.|Every applicant met the criteria.|All applicants failed every criterion.
She would rather we ___ the figures before publishing.|checked|check|will check|are checking
The proposal is worth ___ further.|considering|to consider|considered|consider
Choose a counterfactual past regret.|I wish I had backed up the files.|I wish I will back up yesterday.|I wish I have back up the files.|I wish I am backed up yesterday.
The plan will proceed provided that funding ___.|is secured|had secured|is securing|has been securing
Rarely ___ such a detailed explanation.|have I heard|I have heard|I heard|I had heard
Choose a concession.|Even though it is costly, the service is valuable.|It is costly because it is worthless.|It is costly, so it cannot have value.|It is valuable only if it is free.
The data need ___ before any conclusion is drawn.|to be verified|to verify|verifying it|verified`);
U('en','C1',`The findings are suggestive, ___ conclusive.|albeit not|therefore fully|because always|unless entirely are
Choose the most appropriately hedged causal claim.|The policy may have contributed to the decline.|The policy alone unquestionably caused every change.|The timing proves causation beyond doubt.|No alternative explanation is possible.
Were the assumptions to change, the estimate ___ revising.|would need|will need|had needed|would have needed
Choose the meaning of 'The result is by no means inevitable'.|The result is not certain to occur.|The result cannot possibly occur.|The result has already occurred.|The result is guaranteed.
No sooner had the terms been agreed ___ a dispute arose.|than|when|that|then
Choose a formal reservation that acknowledges value.|The analysis is illuminating, notwithstanding its limited scope.|Its limited scope proves it entirely useless.|The scope is limited, so every claim is false.|The analysis settles all possible questions.
The report stops short of ___ liability.|admitting|to admit|admit to|was admitting
Choose the claim that distinguishes absence of evidence from evidence of absence.|The study detected no effect, but may have lacked sensitivity.|No detected effect proves no effect can exist.|The study proves the opposite effect must occur.|Undetected effects are always larger.
So substantial ___ that a revision became unavoidable.|were the discrepancies|the discrepancies were|had the discrepancies been|the discrepancies had been
Choose the meaning of 'subject to independent verification'.|Conditional on an independent check|Free from any need for checking|Already disproved independently|Unrelated to verification
The recommendation rests on the assumption ___ demand will remain stable.|that|what|which|whether
Choose a sentence that limits a claim to the available sample.|Within this sample, the pattern is consistent.|The pattern must apply universally.|No other population could differ.|The sample makes all further research redundant.`);
U('es','A1',`Mis hermanas ___ en Valencia.|viven|vive|vivo|vivís
Elige una pregunta sobre el precio.|¿Cuánto cuesta este cuaderno?|¿Dónde cuesta este cuaderno?|¿Quién cuesta este cuaderno?|¿Cuándo eres cuaderno?
En la cocina ___ una ventana.|hay|son|están|tienen
Yo ___ al trabajo en metro.|voy|va|vas|van
Elige una petición cortés.|Un vaso de agua, por favor.|El agua fue ayer.|¿Quién agua estás?|No existe ninguna petición.
La mochila es de Ana. Es ___ mochila.|su|sus|tus|nuestros
¿De dónde ___ ustedes?|son|sois|eres|somos
El gato está debajo ___ sofá.|del|al|el de|de al
Elige la frase en plural.|Estas flores son bonitas.|Esta flores es bonita.|Estos flor son bonito.|Estas flor es bonitas.
Nosotros no ___ café por la noche.|tomamos|toma|tomas|tomáis
Elige una invitación.|¿Quieres cenar con nosotros?|Cenamos ayer sin ti.|No quiero cenar.|¿Cuánto cuesta la cena?
Tengo ___ libro interesante.|un|una|unos|unas`);
U('es','A2',`Ayer ___ una carta a mi abuela.|escribí|escribo|escribiré|escribiendo
Elige una pregunta para pedir indicaciones.|¿Cómo llego a la farmacia?|¿Cuánto cuesta la farmacia?|¿Quién es ayer?|¿Por qué es una farmacia?
Esta maleta es más pesada ___ la tuya.|que|como|de que|a
Cuando llamaste, yo ___ la cena.|preparaba|prepararé|preparo mañana|preparando
Elige una acción terminada ayer.|Ayer compré una chaqueta.|Ayer compraré una chaqueta.|Ayer voy a comprar mañana.|Ayer estoy comprar.
No ___ tocar los cuadros; está prohibido.|se puede|hace falta|hay que|se quiere que
No tenemos ___ dinero para el taxi.|suficiente|muchos|unas|varios
Elige un ofrecimiento de ayuda.|¿Te ayudo con las bolsas?|¿Compraste bolsas ayer?|¿Cuánto cuestan las bolsas?|No quiero ayudarte.
Si hace buen tiempo, ___ al parque.|iremos|iríamos ayer|fuimos mañana|íbamos ayer
Nunca ___ probado ese plato hasta hoy.|he|ha|hemos|has
Elige un plan para mañana.|Mañana vamos a visitar a Luis.|Ayer visitamos mañana a Luis.|Mañana visitamos ayer a Luis.|Luis fue visitando ayer mañana.
Salí temprano ___ llegar a tiempo.|para|por de|porque de|aunque de`);
U('es','B1',`Cuando llegué, la conferencia ya ___.|había empezado|empezará|ha empezar|está empezar
Elige una petición indirecta.|¿Podrías decirme dónde está la salida?|¿Podrías dónde decir está salida la?|¿Decirme la salida podrías dónde es está?|¿Podrías está dónde decirme?
Si tuviera más espacio, ___ un piano.|compraría|compraré|compré mañana|comprando
Te recomiendo que ___ una copia.|guardes|guardas|guardarás|guardabas
Elige un hábito del pasado.|De niño iba al río todos los veranos.|De niño iré al río mañana.|De niño voy mañana al río.|De niño ir al río ayer.
El paquete ___ entregado ayer.|fue|ha|hubo|tuvo
Ojalá ___ más tiempo libre.|tuviera|tengo|tendré|tener
Elige la frase que expresa contraste.|Aunque llovía, salimos.|Como llovía, no salimos.|Llovía porque salimos.|Salimos para que lloviera.
Busco a la persona ___ reparó el reloj.|que|donde|cuyo el|cuanta
No creo que Marta ___ hoy.|venga|viene|vino|vendrá seguramente ayer
Elige una obligación.|Tenemos que presentar el formulario.|Quizá presentamos el formulario.|Ayer presentamos el formulario.|Nos gusta el formulario.
Te llamaré en cuanto ___.|llegue|llegaré|llegando|llegaba ayer`);
U('es','B2',`Si me lo hubieras avisado, ___ antes.|habría salido|saldría|había salido|haya salido
Elige una discrepancia matizada.|Entiendo la ventaja, aunque revisaría los costes.|Es perfecto sin ninguna duda.|Estoy totalmente de acuerdo.|No existen costes posibles.
La reunión se aplazó ___ la falta de pruebas.|debido a|aunque|a pesar que|porque de
No era que no ___, sino que necesitaba más tiempo.|quisiera|quería|querrá|quiere
Elige la negación parcial.|No todos los candidatos cumplen los requisitos.|Ningún candidato cumple los requisitos.|Todos cumplen sin excepción.|Todos incumplen todo.
Preferiría que ___ las cifras antes de publicar.|revisáramos|revisamos|revisaremos|hemos revisado
Por mucho que ___, no convencerás a todos.|insistas|insistes|insistirás|insistías
Elige un deseo imposible sobre el pasado.|Ojalá hubiera guardado una copia.|Ojalá guardaré ayer una copia.|Ojalá he guardar una copia.|Ojalá guardando ayer.
Seguiremos adelante con tal de que ___ financiación.|haya|hay|habrá|haber
De haberlo sabido, no ___ el contrato.|habría firmado|firmaría|había firmado|haya firmado
Elige una concesión.|Aun siendo caro, el servicio merece la pena.|Es caro porque no tiene valor.|Como es caro, no puede ser útil.|Solo vale si es gratis.
Los datos deben ___ antes de publicarse.|verificarse|verificar|verificado|verificaron`);
U('es','C1',`Los resultados son prometedores, ___ no concluyentes.|si bien|por tanto plenamente|puesto que siempre|así que necesariamente
Elige una atribución causal prudente.|La medida podría haber contribuido al descenso.|La medida explica por sí sola todos los cambios.|La coincidencia temporal demuestra causalidad.|Ninguna otra explicación es posible.
De cambiar los supuestos, ___ que revisar la estimación.|habría|habrá|hubo|había
¿Qué significa «El desenlace dista de ser inevitable»?|No es seguro que ocurra.|Es imposible que ocurra.|Ya ocurrió necesariamente.|Está garantizado.
Apenas se habían acordado los términos ___ surgió una disputa.|cuando|que|sino|para que
Elige una reserva formal que reconozca valor.|El análisis es esclarecedor, pese a su alcance limitado.|Su alcance limitado demuestra que no vale nada.|Toda afirmación es falsa por definición.|El análisis resuelve cualquier cuestión posible.
El informe se abstiene ___ atribuir responsabilidades.|de|a|por|en
Elige una interpretación cuidadosa.|No se detectó un efecto, pero el estudio pudo carecer de sensibilidad.|No detectar un efecto prueba que no puede existir.|El resultado demuestra necesariamente el efecto contrario.|Todo efecto no detectado es enorme.
Sean cuales ___ las razones, habrá que justificarlas.|fueren|fuera|fue|ser
¿Qué implica «sujeto a verificación independiente»?|Que depende de una comprobación independiente|Que no necesita comprobarse|Que ya se ha refutado|Que la verificación es irrelevante
La recomendación parte del supuesto ___ la demanda será estable.|de que|que|cuyo|de la que
Elige una conclusión limitada a la muestra.|En esta muestra se observa una pauta consistente.|La pauta se cumple universalmente sin excepción.|Ninguna población podría diferir.|No hace falta investigar nunca más.`);
U('pt','A1',`Meus irmãos ___ em Recife.|moram|mora|moro|moramos
Escolha uma pergunta sobre preço.|Quanto custa este caderno?|Onde custa este caderno?|Quem custa este caderno?|Quando é este caderno?
Na cozinha ___ uma janela.|há|são|estão|somos
Eu ___ ao trabalho de metrô.|vou|vai|vamos|vão
Escolha um pedido educado.|Um copo de água, por favor.|A água foi ontem.|Quem está água?|Água nunca existe.
A bolsa é da Ana. É a bolsa ___.|dela|dele|nosso|deles
De onde vocês ___?|são|é|somos|sou
O gato está embaixo ___ sofá.|do|ao|no de|de ao
Escolha a frase no plural.|Estas flores são bonitas.|Esta flores é bonita.|Estes flor são bonito.|Estas flor é bonitas.
Nós não ___ café à noite.|tomamos|toma|tomo|tomam
Escolha um convite.|Quer jantar com a gente?|Jantamos ontem sem você.|Não quero jantar.|Quanto custa o jantar?
Tenho ___ livro interessante.|um|uma|uns|umas`);
U('pt','A2',`Ontem ___ uma carta para minha avó.|escrevi|escrevo|escreverei|escrevendo
Escolha uma pergunta para pedir orientação.|Como chego à farmácia?|Quanto custa a farmácia?|Quem foi ontem?|Por que é uma farmácia?
Esta mala é mais pesada ___ a sua.|do que|como|de como|a que
Quando você ligou, eu ___ o jantar.|estava preparando|vou preparar|prepararei|estou preparar
Escolha uma ação concluída ontem.|Ontem comprei uma jaqueta.|Ontem comprarei uma jaqueta.|Ontem vou comprar amanhã.|Ontem estou comprar.
Você ___ tocar nos quadros. É proibido.|não pode|não precisa|deve|tem vontade de
Não temos dinheiro ___ para o táxi.|suficiente|suficientes|muitas|várias
Escolha uma oferta de ajuda.|Quer que eu carregue as sacolas?|Você comprou sacolas ontem?|Quanto custam as sacolas?|Não quero ajudar.
Se fizer bom tempo amanhã, ___ ao parque.|iremos|fomos|íamos ontem|indo
Ela mora aqui ___ três meses e continua morando.|há|daqui a|depois de|até daqui
Escolha um plano para amanhã.|Amanhã vamos visitar o Luís.|Ontem visitamos amanhã o Luís.|Amanhã visitamos ontem o Luís.|Luís foi ontem amanhã.
Saí cedo ___ chegar a tempo.|para|por de|porque de|embora de`);
U('pt','B1',`Quando cheguei, a palestra já ___.|tinha começado|começará|tem começar|está começar
Escolha um pedido indireto.|Você poderia me dizer onde fica a saída?|Você poderia onde dizer saída a fica?|Você dizer poderia fica saída onde a?|Você fica onde poderia dizer?
Se eu tivesse mais espaço, ___ um piano.|compraria|comprarei|comprei|comprando
Recomendo que você ___ uma cópia.|guarde|guarda|guardará|guardava
Escolha um hábito do passado.|Quando criança, eu ia ao rio todo verão.|Quando criança, irei ao rio amanhã.|Quando criança, vou amanhã ao rio.|Quando criança, ir ao rio ontem.
A encomenda ___ entregue ontem.|foi|tem|houve|teve
Espero que vocês ___ tempo para descansar.|tenham|têm|terão|tinham
Escolha a frase que expressa contraste.|Embora estivesse chovendo, saímos.|Como estava chovendo, ficamos em casa.|Choveu porque saímos.|Saímos para que chovesse.
Procuro a pessoa ___ consertou o relógio.|que|onde|cujo o|quanto
Não acredito que a Marta ___ hoje.|venha|vem|veio|virá certamente ontem
Escolha uma obrigação.|Precisamos apresentar o formulário.|Talvez apresentemos o formulário.|Ontem apresentamos o formulário.|Gostamos do formulário.
Ligo para você assim que eu ___.|chegar|chegarei|chegando|chegava`);
U('pt','B2',`Se você tivesse avisado, eu ___ antes.|teria saído|sairia|tinha saído|tenha saído
Escolha uma discordância com ressalva.|Entendo a vantagem, mas revisaria os custos.|É perfeito sem nenhuma dúvida.|Concordo inteiramente.|Não há custos possíveis.
A reunião foi adiada ___ falta de provas.|devido à|embora a|apesar que|porque de
Não era que ele não ___, mas precisava de mais tempo.|quisesse|queria|quererá|quer
Escolha a negação parcial.|Nem todos os candidatos cumprem os requisitos.|Nenhum candidato cumpre os requisitos.|Todos cumprem sem exceção.|Todos descumprem tudo.
Eu preferiria que nós ___ os números antes de publicar.|revisássemos|revisamos|revisaremos|revisar
Por mais que você ___, não convencerá todo mundo.|insista|insiste|insistirá|insistiu
Escolha um arrependimento sobre o passado.|Quem me dera ter guardado uma cópia.|Amanhã guardarei uma cópia.|Costumo guardar cópias.|Vou guardar uma cópia agora.
Prosseguiremos desde que ___ financiamento.|haja|há|haverá|haver
Caso eu ___ a proposta, avisarei.|aceite|aceito|aceitarei|aceitei
Escolha uma concessão.|Mesmo sendo caro, o serviço vale a pena.|É caro porque não vale nada.|Por ser caro, não pode ser útil.|Só vale se for gratuito.
Os dados precisam ___ antes da publicação.|ser verificados|verificar|verificados|verificam`);
U('pt','C1',`Os resultados são promissores, ___ não conclusivos.|embora|portanto plenamente|porque sempre|logo necessariamente
Escolha uma afirmação causal cautelosa.|A medida pode ter contribuído para a queda.|A medida explica sozinha todas as mudanças.|A coincidência temporal prova causalidade.|Nenhuma outra explicação é possível.
Se os pressupostos mudassem, ___ necessário rever a estimativa.|seria|será|foi|sendo
O que significa «O desfecho está longe de ser inevitável»?|Não é certo que aconteça.|É impossível que aconteça.|Já aconteceu necessariamente.|Está garantido.
Mal os termos tinham sido acordados, ___ surgiu uma disputa.|já|ainda não|nunca mais|de modo a
Escolha uma ressalva formal que reconheça valor.|A análise é esclarecedora, apesar de seu alcance limitado.|O alcance limitado prova que não vale nada.|Toda afirmação é falsa por definição.|A análise resolve qualquer questão possível.
O relatório se abstém ___ atribuir responsabilidades.|de|a|por de|em de
Escolha uma interpretação cuidadosa.|Não se detectou efeito, mas o estudo pode ter sido pouco sensível.|Não detectar efeito prova que nenhum pode existir.|O resultado prova necessariamente o efeito contrário.|Todo efeito não detectado é enorme.
Quaisquer que ___ as razões, será preciso justificá-las.|sejam|seja|são|ser
O que implica «sujeito a verificação independente»?|Que depende de uma checagem independente|Que não precisa de checagem|Que já foi refutado|Que a verificação é irrelevante
A recomendação parte do pressuposto ___ a demanda será estável.|de que|que|cujo|de qual
Escolha uma conclusão limitada à amostra.|Nesta amostra, observa-se um padrão consistente.|O padrão vale universalmente sem exceção.|Nenhuma população poderia diferir.|Nunca mais será necessário pesquisar.`);
U('ja','A1',`私は毎朝、パン___食べます。|を|に|へ|とで
値段を聞く文はどれですか。|このノートはいくらですか。|このノートはどこですか。|このノートは誰ですか。|このノートはいつですか。
台所に窓が___。|あります|います|ですいます|あるます
姉は毎日バス___会社に行きます。|で|を|が|もで
丁寧に水を頼む文はどれですか。|お水をください。|水は昨日でした。|水は誰ですか。|水に行きます。
これはアナさん___かばんです。|の|を|へ|がの
お国は___ですか。出身を教えてください。|どちら|いくら|何時|何個
猫は机の下に___。|います|あります|します|なりますだ
二つあることを表す文はどれですか。|りんごが二つあります。|りんごが二時あります。|りんごが二人います。|りんごが二つですいます。
私は夜、コーヒーを___。|飲みません|飲むません|飲まます|飲んません
誘う文はどれですか。|一緒に夕食を食べませんか。|昨日夕食を食べました。|夕食は食べたくないです。|夕食はいくらですか。
昨日は日曜日___。|でした|です明日|だます|でします`);
U('ja','A2',`昨日、祖母に手紙を___。|書きました|書きます明日|書くました|書きていました
道を聞く文はどれですか。|薬局へはどう行けばいいですか。|薬局はいくらですか。|薬局は誰でしたか。|薬局は何歳ですか。
このかばんは私のより___。|重いです|重いでした|重くです|重いだ
電話が来たとき、夕食を___。|作っていました|作ります明日|作るでした|作ったいます
昨日終わったことを表す文はどれですか。|昨日、上着を買いました。|昨日、明日買います。|昨日、買うました。|昨日、買いでした。
ここでは写真を___。禁止されています。|撮ってはいけません|撮らなくてもいいです|撮ったほうがいいです|撮りたいです
時間が___ので、タクシーに乗ります。|ない|なく|ありませんだ|なかったですだ
手伝いを申し出る文はどれですか。|荷物を持ちましょうか。|昨日荷物を買いましたか。|荷物はいくらですか。|手伝いたくありません。
明日晴れたら、公園に___。|行きます|行きました昨日|行くました|行ったます
私は一度も馬に___ことがありません。|乗った|乗ります|乗って|乗り
明日の予定を表す文はどれですか。|明日、友達に会う予定です。|昨日、明日会いました。|明日、会うでした。|昨日、会います明日。
間に合う___、早く出ました。|ように|そうで|だけどで|ながらに`);
U('ja','B1',`会場に着いたとき、講演はもう___。|始まっていました|始まります明日|始まるでした|始まってありますだ
控えめに場所を尋ねる文はどれですか。|出口がどこか教えていただけますか。|出口をどこ誰いただきますか。|出口がいくら教えますか。|出口のいつ何人ですか。
もっと広い部屋が___、ピアノを置きたいです。|あれば|あるときで|あってもので|ありながらで
忘れないように、メモを___。|取っておきます|取るおきます|取ったおきます|取ってありますだ
昔の習慣を表す文はどれですか。|子どものころ、毎夏川で泳いでいました。|子どものころ、明日泳ぎます。|子どものころ、泳ぐでした。|子どものころ、泳いでます明日。
この時計は祖父に___。祖父から私への贈り物です。|もらいました|あげました|くれました|差し上げました
もう少し時間が___と思います。|あったらいいな|あるならでした|あってもです|ありましたらだ
逆接を表す文はどれですか。|雨だったのに、試合は行われました。|雨だったので、試合は中止でした。|試合のために雨が降りました。|雨が降るように試合をしました。
これは父が___椅子です。|作った|作ります|作って|作ったの
最近、毎朝新聞を読む___しています。|ように|ためで|そうを|ことがで
義務を表す文はどれですか。|申込書を提出しなければなりません。|申込書を出したいです。|昨日申込書を出しました。|申込書が好きです。
駅に___、連絡してください。|着いたら|着きましたらだ|着いてからで|着くならでした`);
U('ja','B2',`知って___、別の道を選んだのに。|いれば|いたので|いるのに|いるため
相手を認めつつ反対する文はどれですか。|利点は分かりますが、費用は再検討が必要です。|欠点は一つもありません。|全面的に賛成します。|費用は絶対に発生しません。
証拠が不足している___、結論は見送られた。|ため|にもかかわらず|とはいえ|一方で
全員が賛成している___。反対する人もいる。|わけではない|に違いない|というものだ|はずだ
部分的な否定はどれですか。|応募者全員が条件を満たすわけではない。|条件を満たす応募者は一人もいない。|全員が例外なく条件を満たす。|全員がすべての条件に違反する。
公開する前に、数字を確認して___。相手への丁寧な依頼です。|いただけますか|差し上げますか|おりますか|参りますか
いくら説明して___、全員を納得させるのは難しい。|も|からには|ので|ため
過去への後悔を表す文はどれですか。|コピーを保存しておけばよかった。|明日コピーを保存する予定だ。|いつもコピーを保存している。|これからコピーを保存しよう。
資金が確保できる___、計画を進める。|ことを条件に|にもかかわらず|かどうかを問わず|わけではなく
今回の結果を___、方法を見直したい。|踏まえて|ものの|問わず|かねて
譲歩を表す文はどれですか。|高価ではあるが、利用する価値はある。|高価だから無価値だ。|高価なら役立つはずがない。|無料の場合にしか価値はない。
急な変更で、参加者を困らせる___がある。|おそれ|つもり|ところで|最中で`);
U('ja','C1',`有望な結果ではある___、決定的とは言えない。|ものの|からこそ|のみならず必ず|ことから当然
因果関係を慎重に述べる文はどれですか。|施策が減少に寄与した可能性はある。|変化のすべてが施策だけによる。|時期が一致すれば因果関係は確実だ。|別の説明は一切あり得ない。
前提が変わると___、推定を見直す必要がある。|すれば|しても|言っても|見なさず
「不可避とは言い難い」の意味はどれですか。|必ず起こるとは言えない。|絶対に起こらない。|すでに必ず起こった。|確実に起こる。
合意した___、新たな争点が浮上した。|矢先に|末にしか|最中には|うえでしか
価値を認めたうえで留保する文はどれですか。|示唆に富む分析だが、対象範囲には限界がある。|範囲が狭いので無価値に決まっている。|すべての主張が定義上誤っている。|あらゆる問題が完全に解決された。
新たな証拠を受け、方針を変更___。|せざるを得ない|しざるを得ない|するざるを得ない|してざるを得ない
証拠の不在を慎重に解釈する文はどれですか。|効果は検出されなかったが、検出力が不足していた可能性もある。|検出されなければ効果は絶対に存在しない。|必ず逆の効果があると証明された。|未検出の効果は常に巨大である。
理由の___、説明責任は免れない。|いかんを問わず|いかんに応じて|いかんによってのみ|いかん次第でのみ
「第三者の検証を条件とする」の意味はどれですか。|独立した確認を受ける必要がある。|確認は不要である。|すでに反証されている。|検証は関係がない。
この提言は、需要が安定するという前提___。|に立っている|に反している|に先立っている|に疑問を呈している
対象を標本内に限定した結論はどれですか。|この標本では一貫した傾向が見られる。|例外なく世界中に当てはまる。|他の集団でも違いはあり得ない。|追加調査は永久に不要だ。`);
export const varietyFormCount=4;
export function variedAssessmentItems(language,form){
 if(!Number.isInteger(form)||form<0||form>=varietyFormCount)throw Error('Unknown test form');
 const locale=languageInfo(language).locale;
 return packs.filter(p=>p.form===form).flatMap(p=>{
 const {passage,audio}=p.texts[language];
 const items=[...p.reading.map(q=>({q,skill:'Reading',passage})),...usage[language+'-'+p.level].slice(form*3,form*3+3).map(q=>({q,skill:'Language use'})),...p.listening.map(q=>({q,skill:'Listening',audio}))];
 return items.map(({q:[prompt,...options],...rest},i)=>{const offset=(form+i+['A1','A2','B1','B2','C1'].indexOf(p.level))%4;return {...rest,id:`v3-${language}-${form}-${p.level}-${i}`,level:p.level,locale,prompt,promptLang:rest.skill==='Language use'?locale:'en-US',optionsLang:rest.skill==='Language use'?locale:'en-US',options:[...options.slice(offset),...options.slice(0,offset)],answer:(4-offset)%4};});
 });
}
const production={
 A1:[['Write a short message to a new neighbour. Introduce yourself, say when you are at home and ask one simple question.','Introduce your room to a visitor. Describe three things and say which one you like.'],['Write to an art club. Say your name, which day you can come and ask what to bring.','Describe someone you live with or know well: their job, routine and one interest.'],['Write a simple notice about a lost bag. Describe its colour and contents, and say where to contact you.','Describe a shop near your home: its location, what it sells and when you visit.'],['Write an invitation to a meal. Say where and when, and ask your friend to bring something.','Talk about a pet or an animal you like. Describe it and explain a simple preference.']],
 A2:[['Write about a journey when your original plan changed. Explain the problem, what you did and the outcome.','Describe a useful item you bought recently. Explain why you chose it and how you use it.'],['Write to a shop about an incorrect delivery. Describe what you ordered, what arrived and the solution you want.','Describe a class or activity you tried. Say what happened and whether you would do it again.'],['Write to change an appointment. Explain why, suggest another day and ask for confirmation.','Describe an evening out that did not go exactly as planned. Explain the change and your feelings.'],['Write a thank-you message to someone who helped while you were away. Explain what they did and suggest a way to thank them.','Explain the arrangements for an outdoor activity, what to bring and what you will do if it rains.']],
 B1:[['Write to your choir or club about changing the meeting place. Explain the problem, compare two options and propose a trial.','Negotiate a volunteer rota change. Explain your availability, a condition and an alternative.'],['Write feedback about an online course. Explain its strengths, a missing feature and a practical improvement.','Compare studying alone with joining a local group. Give experiences and a reasoned preference.'],['Write to neighbours about using an empty space. Explain the proposed use, responsibilities and what must be checked first.','Explain a last-minute change to a guided visit. Reassure participants and give clear revised instructions.'],['Write to your manager proposing a mix of home and shared-office work. Explain benefits, a difficulty and a workable arrangement.','Explain rules for a community book exchange. Include who can participate and what happens to leftover books.']],
 B2:[['Write an evaluation of a museum evening trial: attendance was lower, spending per visitor higher, and security costs are unreported. Recommend next steps.','Propose a fair staff travel allowance. Compare a flat rate with needs-based support and address an objection.'],['Write to a publisher about digital textbooks. Weigh correction speed against access and device compatibility, and recommend safeguards.','Discuss how to evaluate a job candidate with excellent presentation skills but limited evidence of leadership. Propose follow-up questions.'],['Write a proposal to improve a reusable-cup scheme with inconvenient returns. Balance environmental goals and customer behaviour.','Explain a project trade-off to a client: meet the date with fewer features, or delay for the full scope. Recommend an agreed approach.'],['Write an argument about replacing homework deadlines with planning meetings. Consider completion, staff workload and learner independence.','Compare two venues for an event, including a free room conditional on a set menu. Weigh costs and guests’ dietary needs.']],
 C1:[['Write a critical briefing on a voluntary mentoring programme whose users earn more but had stronger prior results. Separate observation from causation and propose an evaluation.','Evaluate a transparency policy that publishes contracts in hard-to-search files. Distinguish disclosure from meaningful accountability.'],['Write an exhibition note explaining how personal letters broaden history while remaining shaped by literacy, preservation and donation. Avoid claiming representativeness.','Discuss how to justify an exceptional decision fairly. Distinguish equal treatment from identical outcomes and propose a consistent review principle.'],['Write a critique of a technically recyclable package that local facilities cannot process. Analyse the implied claim and recommend accurate wording.','Argue for a relationship between expertise and public participation that avoids a false choice. Explain when consultation becomes merely symbolic.'],['Write a briefing on low use of a generous training fund when manager approval may discourage applications. Evaluate explanations and propose targeted changes.','Evaluate a translation that improves fluency by making an ambiguous motive explicit. Discuss readability, interpretation and fidelity.']]
};
export function variedProductionPrompt(level,form,skill){return production[level][form][skill==='Writing'?0:1];}
