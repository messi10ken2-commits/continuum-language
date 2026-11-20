import {u} from './authoring.mjs';
export const koUnits={A1:[
u('Introduce yourself in Korean','저 is a polite first-person pronoun. 저는 introduces a topic; 이름은...이에요/예요 gives a name. Use 이에요 after a final consonant and 예요 after a vowel.','Korean speech levels express relationships and setting; polite 해요-style is a useful starting point, not a universal style for every situation.',`
저는 안나[예요].~I am Anna.~이에요;이어요
저는 학생[이에요].~I am a student.~예요;가요
저는 이탈리아에서 [왔어요].~I come from Italy.~먹어요;읽어요
이름이 [뭐예요]？~What is your name in polite conversation?~몇 시예요;얼마예요`, `
저는 민수[예요]. 반가워요.~Minsu introduces himself and expresses pleasure at meeting.~이에요;가요
저는 서울에 [살아요].~I live in Seoul.~마셔요;읽어요`),
u('Identity, topic and descriptive predicates','은/는 marks a topic, with 은 after a consonant and 는 after a vowel. Descriptive predicates such as 바쁘다 conjugate directly; they do not take an English-style be verb.','A topic is not always the grammatical subject; 은/는 can also introduce contrast.',`
저[는] 교사예요.~As for me, I am a teacher.~은;을
이 사람[은] 제 친구예요.~This person is my friend.~는;를
오늘은 [추워요].~Today is cold.~추워예요;추워이에요
지금 [바빠요].~I am busy now.~바빠예요;바빠이에요`, `
제 동생[은] 학생이에요.~My younger sibling is a student.~는;를
이 가게는 [가까워요].~This shop is nearby.~가까워예요;가까워이에요`),
u('Present routines and object particles','Korean generally places the predicate at the end. 을 follows a consonant-final object; 를 follows a vowel-final object. 해요-style present forms depend on the stem.','Do not attach -요 directly to every dictionary form; learn the conjugated form with its stem.',`
저는 매일 차[를] 마셔요.~I drink tea every day.~을;는
아침에 한국어[를] 공부해요.~I study Korean in the morning.~을;은
금요일에 책[을] 읽어요.~I read a book on Friday.~를;는
우리는 저녁에 [일해요].~We work in the evening.~일하요;일하다요`, `
주말에 밥[을] 해요.~I cook rice or a meal at the weekend.~를;는
친구는 음악[을] 들어요.~My friend listens to music.~를;가`),
u('Listen to a café order','주세요 is a common polite request. 잔 counts cups or glasses; 개 is used for many items. 포장해 주세요 requests takeaway packaging.','One English please does not map to a single Korean word in every request; the predicate ending carries politeness too.',`
[차 한 잔] 주세요.~The customer requests one cup of tea.~커피 두 잔;주스 세 잔
커피에 [설탕은 넣지 마세요].~The coffee should have no sugar.~설탕을 많이 넣어 주세요;우유를 넣어 주세요
[포장해 주세요].~The order is to take away.~여기서 마실게요;내일 올게요
[계산해 주세요].~The customer requests payment of the bill.~메뉴 주세요;물 주세요`, `
저는 [물 한 잔] 주세요.~The customer wants a glass of water.~차 두 잔;커피 세 잔
[여기서 마실게요].~The customer will drink here.~포장해 주세요;내일 살게요`),
u('Ask where, when, who and how much','어디 asks where, 언제 when, 누구 who and 얼마 a price or amount. Polite questions often have the same ending as statements, with question intonation.','누가 combines 누구 with subject marking. 어디에 and 어디에서 have different common functions.',`
집이 [어디예요]？~Where is your home?~언제예요;얼마예요
수업이 [언제] 시작해요？~When does the class start?~누구;얼마
표가 [얼마예요]？~How much is the ticket?~누구예요;어디예요
[누가] 선생님이에요？~Who is the teacher?~언제;얼마`, `
이름이 [뭐예요]？~What is your name?~얼마예요;몇 시예요
도서관이 [어디에] 있어요？~Where is the library located?~언제;누가`),
u('Negation with 안, 없다 and 아니다','안 before many predicates forms a short negation. 없다 negates existence or possession; 아니다 negates a noun identity. With many 하다 action nouns, 안 commonly occurs before 하다.','안 바빠요 is not busy; 학생이 아니에요 is not a student; 시간이 없어요 is have no time.',`
저는 커피를 [안 마셔요].~I do not drink coffee.~못 봐요;다 마셔요
차가 [없어요].~I do not have a car.~있어요;많아요
저는 의사가 [아니에요].~I am not a doctor.~없어요;안이에요
오늘 [공부 안 해요].~I am not studying today.~공부 다 했어요;공부할 거예요`, `
시간이 [없어요].~I have no time.~있어요;남아요
이 음식은 [안 매워요].~This food is not spicy.~아주 매워요;매울 거예요`),
u('Food words and counters','Learn food words in practical phrases. 밥 can mean cooked rice or a meal. 달걀 and 계란 are both common words for egg.','Counters follow a noun and numeral in common patterns such as 사과 한 개; number forms vary with the counting system.',`
[밥] 주세요.~Please give me rice or a meal.~지도;신문~cooked rice or a meal
[물]을 마셔요.~I drink water.~책;신발~water
[사과] 한 개 주세요.~Please give me an apple.~의자;책상~apple
저는 [우유]를 마셔요.~I drink milk.~열쇠;표~milk
오늘은 [국수]를 먹어요.~Today I eat noodles.~연필;우산~noodles
[달걀] 두 개 주세요.~Please give me two eggs.~휴대폰;방~eggs`, `
아침에 [달걀]을 먹어요.~I eat eggs for breakfast.~열쇠;신문
[물] 한 잔 더 주세요.~Please give me another glass of water.~지도;책`),
u('Places and destinations','에 commonly marks a destination or location with 있다; 에서 commonly marks where an action happens. Learn place nouns together with these predicates.','도서관에 있어요 locates someone; 도서관에서 공부해요 describes studying there.',`
약을 사러 [약국]에 가요.~I go to the pharmacy to buy medicine.~공원;영화관~pharmacy
[도서관]에서 책을 읽어요.~I read in the library.~공항;식당~library
기차를 타러 [역]에 가요.~I go to the station to take a train.~부엌;침실~station
[은행]에서 일해요.~I work at a bank.~숲;바다~bank
채소를 사러 [시장]에 가요.~I go to the market to buy vegetables.~박물관;교실~market
[공원]에서 산책해요.~I walk in the park.~사무실;공항~park`, `
약을 사려면 [약국]에 가세요.~Go to the pharmacy to buy medicine.~영화관;체육관
영화를 보러 [영화관]에 가요.~I go to the cinema to see a film.~은행;약국`),
u('Polite greetings and thanks','안녕하세요 is a common polite greeting. 감사합니다 expresses thanks. 안녕히 가세요 addresses someone leaving; 안녕히 계세요 addresses someone staying.','The goodbye depends on who leaves, not simply whether the English translation is goodbye.',`
[안녕하세요], 선생님.~A polite greeting to a teacher.~잘 자요;안녕히 가세요
도와주셔서 [감사합니다].~I thank someone for helping.~모르겠습니다;아쉽습니다
저는 먼저 갈게요. [안녕히 계세요].~I say goodbye to someone staying as I leave.~안녕히 가세요;어서 오세요
손님이 떠나요. [안녕히 가세요].~I say goodbye to a departing guest.~안녕히 계세요;잘 먹겠습니다`, `
[어서 오세요].~A welcome to someone arriving.~안녕히 가세요;잘 자요
[죄송합니다], 길을 좀 물어봐도 될까요？~I courteously get attention to ask directions.~축하합니다;아쉽습니다`),
u('Repair understanding politely','다시 말씀해 주세요 asks for repetition politely. 조금 천천히 말씀해 주세요 requests slower speech. 못 알아들었어요 identifies a comprehension problem.','못 들었어요 means could not hear; 못 알아들었어요 means could not understand what was heard.',`
[다시 말씀해 주세요].~Please say it again, politely.~그만 가세요;말하지 마세요
[조금 천천히 말씀해 주세요].~Please speak a little more slowly.~빨리 떠나세요;내일 오세요
마지막 말을 [못 알아들었어요].~I did not understand the last words I heard.~동의했어요;다 썼어요
이 단어는 [무슨 뜻이에요]？~What does this word mean?~얼마예요;몇 시에 출발해요`, `
[적어 주세요].~Please write it down.~지워 주세요;숨겨 주세요
한국어로 [뭐라고 해요]？~How do you say it in Korean?~어디서 사요;언제 출발해요`),
u('Express everyday needs and states','배고파요 means hungry, 목말라요 thirsty and 졸려요 sleepy. 필요해요 expresses need. Korean descriptive predicates conjugate without a separate be verb.','필요해요 often takes a subject-marked needed item, as in 도움이 필요해요.',`
[배고파요].~I am hungry.~목말라요;졸려요
[목말라요].~I am thirsty.~배고파요;추워요
도움이 [필요해요].~I need help.~싫어요;없었어요
[졸려요]. 좀 쉬고 싶어요.~I am sleepy and want a rest.~기뻐요;알겠어요`, `
[추워요]. 창문을 닫아도 될까요？~I feel cold and ask whether I may close the window.~더워요;배고파요
지도가 [필요해요].~I need a map.~싫어요;아니에요`),
u('Clock times and everyday arrangements','Clock hours normally use native Korean numbers and minutes Sino-Korean numbers: 두 시 삼십 분. 반 means half past. 에 marks a time.','한 시, 두 시, 세 시, 네 시 use shortened native-number forms before 시.',`
오후 [세 시]에 만나요.~We meet at three in the afternoon.~여섯 시;열 시
수업은 [아홉 시 반]에 시작해요.~The class starts at nine thirty.~아홉 시 십 분;열 시 반
[월요일]에 서울에 가요.~I go to Seoul on Monday.~어제 저녁;작년 여름
[매일 아침] 운동해요.~I exercise every morning.~어제 한 번;내년에 한 번`, `
영화는 [저녁 여덟 시]에 시작해요.~The film begins at eight in the evening.~아침 여덟 시;오후 두 시
우리는 [두 시]에 출발해요.~We leave at two.~이십 시;열두 시`)
],A2:[
u('Past events with -았/었어요','Past polite forms use -았/었어요, with 해요 becoming 했어요. Stem contractions and irregular forms must be learned in context.','Past marking does not remove speech-level choices: 갔어요 is polite conversational, 갔습니다 formal polite.',`
어제 책을 [샀어요].~I bought a book yesterday.~사요;살 거예요
친구가 여덟 시에 [왔어요].~My friend came at eight.~와요;올 거예요
우리는 영화를 [봤어요].~We saw a film.~봐요;볼 거예요
보고서를 [썼어요].~I wrote the report.~써요;쓸 거예요`, `
오전에 이메일을 [보냈어요].~I sent an email this morning.~보내요;보낼 거예요
어제 은행에 [갔어요].~I went to the bank yesterday.~가요;갈 거예요`),
u('Arrange a meeting and propose another time','-을/ㄹ까요 invites a suggestion; 괜찮아요 checks suitability. 그러면 and 아니면 can lead into an alternative.','An ending such as -을까요 does not give every sentence the same meaning; use a complete contextual model.',`
토요일에 [만날까요]？~Shall we meet on Saturday?~만났어요;만나지 마세요
오후 세 시는 [괜찮아요]？~Is three in the afternoon suitable?~끝났어요;잊었어요
여섯 시에는 [약속이 있어요].~I have another appointment at six.~항상 한가해요;아무 일정도 없어요
[그러면] 일요일은 어때요？~I suggest Sunday following a scheduling problem.~이미 끝났으니;절대 안 되니까`, `
박물관 앞에서 [만나요].~Let us meet in front of the museum.~헤어졌어요;먹었어요
다섯 시로 [바꿀까요]？~Shall we change it to five?~끝났나요;잊었나요`),
u('Hear consonant contrasts and final sounds','Korean distinguishes plain, aspirated and tense consonants. Final consonants have restricted surface pronunciations and may link to a following vowel-initial syllable.','Romanisation is a reading aid, not an exact English sound equivalent. Use native audio for 달/탈/딸 and linked forms.',`
하늘에 [달]이 떠요.~The moon is in the sky; ㄷ contrasts with ㅌ and ㄸ.~탈;딸
[딸]이 학교에 가요.~The daughter goes to school; ㄸ is tense.~달;탈
공연에서 [탈]을 써요.~A mask is worn in the performance; ㅌ is aspirated.~달;딸
[옷이] 작아요.~The clothes are small; 옷이 is pronounced with linking, [오시].~옷도;옷만`, `
저는 [밥을] 먹어요.~I eat rice; 밥을 links as [바블].~밥도;밥만
이건 [꽃이에요].~This is a flower; 꽃이에요 begins [꼬치].~꽃도 있어요;꽃만 있어요`),
u('Follow directions politely','오른쪽/왼쪽으로 가세요 gives a direction. 쭉 가세요 means continue straight. 지나서 places an action after a landmark.','Distinguish the next intersection from this one. 으로 becomes 로 after a vowel or final ㄹ.',`
다리를 지나서 [오른쪽으로 가세요].~Go right after passing the bridge.~왼쪽으로 가세요;돌아가세요
광장까지 [쭉 가세요].~Continue straight to the square.~여기서 멈추세요;바로 돌아가세요
은행은 우체국 [맞은편에 있어요].~The bank is opposite the post office.~안에 있어요;옥상에 있어요
[다음 사거리]에서 도세요.~Turn at the next intersection.~지난 사거리;이 건물 안`, `
입구는 약국 [옆에 있어요].~The entrance is next to the pharmacy.~안에 있어요;지붕에 있어요
길을 [건너서] 왼쪽으로 가세요.~Cross the road, then go left.~건너지 말고;되돌아가서`),
u('Ask about past events and completion','Past questions can use the same -았/었어요 ending with question intonation. 다 and 끝내다 help specify completion.','벌써 asks about already; 아직 can signal not yet or still, depending on the predicate and negation.',`
어제 뭘 [샀어요]？~What did you buy yesterday?~살 거예요;사고 싶어요
언제 [도착했어요]？~When did you arrive?~도착할 거예요;도착하고 싶어요
열쇠를 어디에 [뒀어요]？~Where did you put the keys?~둘 거예요;두고 싶어요
일을 다 [끝냈어요]？~Have you finished all the work?~시작할 거예요;미룰 거예요`, `
아침을 [먹었어요]？~Have you eaten breakfast?~먹을 거예요;먹고 싶어요
어제 누가 [왔어요]？~Who came yesterday?~올 거예요;오고 싶어요`),
u('Past background and earlier habits','-고 있었어요 describes an activity in progress at a past reference time. -곤 했어요 can describe a repeated past habit. Descriptive predicates use their own past forms.','Not every English was...ing requires -고 있었어요. Distinguish an ongoing activity from a state.',`
제가 왔을 때 친구는 [요리하고 있었어요].~My friend was cooking when I arrived.~내일 요리할 거예요;이미 다 먹었어요
어릴 때 바다에 [가곤 했어요].~I used to go to the seaside as a child.~내일 갈 거예요;한 번도 안 갔어요
어제 여덟 시에는 [추웠어요].~It was cold at eight yesterday.~내일 더울 거예요;언제나 더워요
전화했을 때 모두 [회의하고 있었어요].~Everyone was in a meeting when I called.~내일 회의할 거예요;벌써 퇴근했어요`, `
그때 우리는 시골에 [살았어요].~We lived in the countryside then.~내년에 살 거예요;곧 이사할 거예요
제가 책을 읽고 있을 때 누가 문을 [두드렸어요].~Someone knocked while I was reading.~내일 두드릴 거예요;두드리고 싶어요`),
u('Hotel and accommodation words','Useful combinations include 예약하다, 방을 바꾸다, 열쇠를 받다 and 영수증을 받다. 객실 is a more formal word for a guest room.','숙박비에 아침 식사가 포함되어 있는지 explicitly asks whether breakfast is included; do not infer inclusion from a room booking alone.',`
[예약]이 있어요.~I have a reservation.~회의;숙제~reservation
[일인실]을 원해요.~I want a single room.~회의실;교실~single room
[열쇠]를 잃어버렸어요.~I lost the key.~수건;아침 식사~key
[수건] 한 장 더 주세요.~Please give me another towel.~영수증;지도~towel
[아침 식사]가 포함돼요？~Is breakfast included?~짐;열쇠~breakfast
[영수증] 주세요.~Please give me a receipt.~베개;칫솔~receipt`, `
제 [방]은 이 층에 있어요.~My room is on the second floor.~짐;아침 식사
김민수라는 이름으로 [예약]했어요.~I booked under Kim Minsu.~샤워;식사`),
u('Work and scheduling words','회의를 열다, 마감일을 지키다 and 계약서에 서명하다 are common practical combinations. A colleague is 동료.','마감일 is a deadline; 약속 is an appointment or promise depending on context.',`
[회의]는 아홉 시에 시작해요.~The meeting starts at nine.~영수증;짐~meeting
[마감일]은 금요일이에요.~The deadline is Friday.~프린터;열쇠~deadline
[계약서]를 읽었어요.~I read the contract document.~수건;베개~contract document
[동료]에게 물어볼게요.~I will ask a colleague.~가방;책상~colleague
먼저 [초안]을 보낼게요.~I will send a draft first.~아침 식사;열쇠~draft
[프린터]가 고장 났어요.~The printer is broken.~마감일;회의~printer`, `
[회의] 시간을 정해야 해요.~We need to set a meeting time.~베개;수건
[마감일] 전에 제출하세요.~Please submit before the deadline.~프린터;아침 식사`),
u('Suggest a plan without imposing it','-는 게 어때요 suggests an option; -을/ㄹ까요 invites joint consideration. -아/어도 돼요 expresses permission rather than necessarily a proposal.','Choose the ending for the communicative purpose; permission, suggestion and obligation differ.',`
기차를 타는 게 [어때요]？~How about taking the train?~끝났어요;금지예요
잠깐 [쉴까요]？~Shall we rest briefly?~쉬었어요;쉬지 마세요
이 길로 [가 볼까요]？~Shall we try going this way?~가지 마세요;갔었어요
같이 점심을 [먹을까요]？~Shall we have lunch together?~먹었어요;먹지 마세요`, `
밖에 앉는 게 [어때요]？~How about sitting outside?~끝났어요;없었어요
월요일로 [미루는 게 어때요]？~How about postponing until Monday?~이미 끝냈어요;취소됐어요`),
u('Accept, decline and offer help','좋아요 accepts a suggestion; 괜찮아요 can accept, reassure or decline depending on context. 제가 할게요 volunteers a commitment.','괜찮아요 alone can be ambiguous. Use a complete sentence to make an acceptance or refusal clear.',`
도와줄 수 있어요？ — [네, 도와드릴게요].~The reply agrees to help politely.~아니요, 못 해요;도와드릴 수 없어요
[죄송하지만] 오늘은 시간이 없어요.~I courteously decline because I am unavailable today.~물론 오늘은 언제든 좋아요;이미 다 확인했으니
[제가 할게요]. 먼저 쉬세요.~I volunteer while the other person rests.~저는 안 할래요;아무도 하지 마세요
[좋아요], 바로 보내 드릴게요.~I agree to send it immediately.~안 돼요;불가능해요`, `
오늘은 어렵고, [다음에 같이해요].~I decline today while suggesting another occasion.~오늘 꼭 하겠어요;다시는 만나지 마세요
[네, 쓰셔도 돼요].~I grant permission to use it.~절대 쓰지 마세요;사용하면 안 돼요`),
u('Frequency and recurring patterns','보통 means usually, 가끔 occasionally and 자주 often. 전혀...않다 or 한 번도...없다 can express a complete negative in suitable constructions.','항상 is always; 거의 항상 is almost always. Do not erase this qualification.',`
저는 [보통] 집에서 점심을 먹어요.~I usually eat lunch at home.~절대 안;평생 한 번만
영화를 [가끔] 봐요.~I occasionally watch films.~매일 빠짐없이;절대 안
저는 담배를 [전혀 피우지 않아요].~I do not smoke at all.~항상 피워요;자주 피워요
그는 [거의 항상] 제시간에 와요.~He almost always comes on time.~한 번만;절대 안`, `
우리는 [일주일에 한 번] 만나요.~We meet once a week.~한 시간에 한 번;일 년에 한 번
저는 [자주] 집에서 일해요.~I often work from home.~한 번도 안;평생 한 번만`),
u('Describe an outcome and express relief','결국 marks an eventual outcome; 다행히 introduces a fortunate circumstance and 아쉽게도 regret. 드디어 often signals an awaited result.','결국 may introduce a negative outcome too; it does not inherently mean success.',`
[결국] 식당을 찾았어요.~Eventually we found a restaurant.~시작하기 전에;매 순간
[다행히] 운전기사가 기다려 줬어요.~Fortunately the driver waited for us.~아쉽게도;불행히도
[아쉽게도] 가게가 닫혀 있었어요.~Unfortunately the shop was closed.~다행히도;원하던 대로
[드디어] 기차를 탔어요.~We finally boarded the train after waiting or effort.~한 번도 못;내년에야`, `
[다행히] 우산을 가져왔어요.~Fortunately I brought an umbrella.~아쉽게도;불행히도
[드디어] 답장이 왔어요.~The awaited reply has finally arrived.~아직 안;내년에야`)
],B1:[
u('Express purpose with -려고 and -도록','-으려고/려고 commonly expresses the subject’s intention. -도록 can express a goal or intended result, including one involving another person.','Do not confuse a purpose with an achieved result; restrictions vary with the construction and sentence ending.',`
발음을 [개선하려고] 매일 연습해요.~I practise every day to improve pronunciation.~개선했기 때문에;개선하지 않지만
입구를 [찾을 수 있도록] 지도를 보냈어요.~I sent the map so the recipient could find the entrance.~이미 찾았으니까;찾기 싫지만
차가 막히지 [않도록] 일찍 출발해요.~We leave early to avoid traffic delays.~않았으니까;않았지만
모두 [알아듣도록] 천천히 말해요.~I speak slowly so everyone understands.~이미 알아들었으니까;말하기 싫어서`, `
예약을 [확인하려고] 전화했어요.~I called to confirm the booking.~확인했기 때문에;취소했지만
잘 [보이도록] 불을 켜 두세요.~Leave the light on so it can be seen clearly.~보였기 때문에;보이지 않지만`),
u('Possibility and uncertain inference','-을/ㄹ 수도 있다 marks possibility. -을/ㄹ 것 같다 offers a cautious judgement; 반드시...것은 아니다 denies necessity.','A possible outcome is not a guarantee; retain qualifiers when paraphrasing.',`
아직 사무실에 [있을 수도 있어요].~They may still be in the office.~절대 없어요;있을 수 없어요
내일 비가 [올 것 같아요].~I think it may rain tomorrow.~절대 안 와요;올 수 없어요
비싸다고 반드시 좋은 [것은 아니에요].~Expensive does not necessarily mean good.~것이 분명해요;것만 가능해요
벌써 [출발했을 수도 있어요].~They may already have left.~절대 출발하지 않았어요;출발할 수 없어요`, `
그 방법이 항상 [효과적인 것은 아니에요].~The method is not always effective.~효과적인 것이 확실해요;효과적일 수밖에 없어요
조금 늦을 [수도 있어요].~I may be a little late.~수 없어요;일이 절대 없어요`),
u('Read causes, contrasts and additions','따라서 introduces a consequence; 그러나 marks contrast; 또한 adds another point. -기 때문에 gives a reason.','Read the relation between the complete propositions before choosing a connector.',`
다리가 닫혔어요. [따라서] 돌아가야 해요.~The bridge closure consequently requires a detour.~반대로 아무 영향 없이;그러나 길은 열려 있어서
비용은 높아요. [그러나] 더 믿을 만해요.~Higher cost is contrasted with greater reliability.~그 가격 때문에만;따라서 비용만으로
시간을 아껴요. [또한] 낭비도 줄여요.~Reduced waste is an additional benefit.~반대로;그 대신 전혀
자료가 [부족하기 때문에] 결정을 미뤘어요.~Insufficient material is the reason for postponement.~충분한데도;모이도록`, `
길이 잠겼어요. [그래서] 지나갈 수 없어요.~Flooding consequently prevents passage.~반대로 아무 문제 없이;그런데 길은 완전히 말라서
비가 [오는데도] 출발했어요.~We left despite the rain.~오도록;와서만`),
u('Write a clear practical request','State the problem, its impact and a concrete requested action. -아/어 주실 수 있을까요 makes a courteous request. Include a relevant deadline or booking reference.','Courtesy must not hide what action you want the reader to take.',`
예약에 문제가 있어 [문의드립니다].~I courteously state that I am enquiring about a booking problem.~모든 연락을 거부합니다;문제가 없음을 확정합니다
방을 [바꿔 주실 수 있을까요]？~I politely request a room change.~절대 바꾸지 마세요;이미 취소했습니다
가능하면 [내일까지 답변 부탁드립니다].~I request a response by tomorrow if possible.~영원히 답하지 마세요;모든 답변을 거절합니다
[도움에 감사드립니다].~I courteously thank the recipient for assistance.~연락하지 마세요;모든 협의를 거부합니다`, `
예약 내용을 [확인해 주시겠어요]？~I politely request verification of booking details.~모두 삭제하세요;아무것도 확인하지 마세요
방을 바꾸기 어렵다면 [수리도 괜찮습니다].~I offer repairs as an acceptable alternative.~모든 해결책을 거부합니다;다시 연락하지 마세요`),
u('Experience and continuing duration','-아/어 본 적이 있다 describes experience. -은/ㄴ 지 plus a duration describes time since an event; a continuing activity can use 계속 or -고 있다.','-은 지 is spaced in this elapsed-time construction; it is not the same as an indirect question ending -는지.',`
부산에 [가 본 적이 있어요].~I have been to Busan before.~내일 갈 거예요;한 번도 안 갔어요
이 음식을 [먹어 본 적이 있어요]？~Have you tried this food before?~내일 먹을 거예요;지금 만들고 있어요
여기 산 [지 삼 년 됐어요].~It has been three years since I began living here.~곳이 세 개예요;날이 내일이에요
저는 제주도에 [가 본 적이 없어요].~I have never been to Jeju.~자주 갔어요;내일 안 가요`, `
한국어를 배운 [지 여섯 달 됐어요].~It has been six months since I started learning Korean.~곳이 여섯 개예요;날은 내일이에요
그 영화를 [본 적이 있어요]？~Have you seen that film before?~내일 볼 거예요;지금 찍고 있어요`),
u('Earlier events and past sequencing','이미 and 벌써 can locate an event as completed before a past reference point. -기 전에 means before doing; -은/ㄴ 뒤에 after doing.','Korean does not require an English-style pluperfect in every past-before-past sentence. -았/었었- can add distance or discontinuity and is not merely a mandatory extra past.',`
제가 도착했을 때 이미 [떠났어요].~They had already left when I arrived.~내일 떠날 거예요;저를 기다리고 있었어요
이미 밥을 [먹어서] 배가 고프지 않았어요.~I was not hungry because I had already eaten.~먹도록;먹으려고
회의가 시작되기 [전에] 공지를 보냈어요.~I sent the notice before the meeting began.~위해서만;대신에만
나중에 주소가 바뀐 걸 [알았어요].~I later discovered that the address had changed.~내일 알 거예요;알고 싶어요`, `
전에 [잃어버린 책]을 찾았어요.~I found the book I had previously lost.~내일 살 책;한 번도 잃지 않은 책
전화했을 때 손님들은 [이미 도착했어요].~The guests had arrived by the time we called.~내일 올 거예요;아직 출발도 안 했어요`),
u('Plans, intentions and predictions','-을/ㄹ 거예요 commonly expresses a plan or prediction. -을/ㄹ 예정이에요 names an arrangement. -겠- can express intention or inference depending on context.','A speaker’s intention and a prediction about the weather are different uses even if English uses will for both.',`
내일 일찍 [출발할 거예요].~We will leave early tomorrow.~어제 출발했어요;지난주에 출발했어요
다음 달에 이사할 [예정이에요].~I am scheduled to move next month.~기억이 전혀 없어요;일이 이미 끝났어요
예보에 따르면 오후에 비가 [올 거예요].~The forecast predicts afternoon rain.~어제 왔어요;온 적이 없어요
도착하면 [전화할게요].~I commit to calling when I arrive.~전화했어요;전화하지 마세요`, `
다음 주에 서울에 [갈 예정이에요].~I plan to go to Seoul next week.~갔었어요;간 적이 없어요
제가 먼저 [확인하겠습니다].~I formally commit to checking first.~확인했습니다;확인하지 않았습니다`),
u('Hypothetical conditions with -으면 and -다면','-으/면 links a condition and result. -다면 can frame a supposition; time and context determine whether the scenario is realistic or unreal.','A conditional ending alone does not automatically establish an unreal past situation.',`
시간이 [있으면] 갈게요.~If I have time, I will go.~있었기 때문에;없는데도
제가 [안다면] 알려 드릴게요.~If I knew, I would tell you.~이미 말했으니까;모르고도 무조건
가까이 [살면] 걸어갈 수 있어요.~Living nearby would allow going on foot.~살았기 때문에만;산 뒤에만
괜찮으시면 내일 [만나요].~Let us meet tomorrow if it suits you.~어제 만났어요;다시는 만나지 마세요`, `
비가 [오면] 다음에 가요.~If it rains, let us go another time.~왔으니까만;오도록
번호를 안다면 [전화할 텐데요].~If I knew the number, I would call.~벌써 확실히 전화했어요;절대 연락하지 않을 거예요`),
u('Reformulate and verify an interpretation','다시 말해 and 즉 introduce reformulation. 제 말은 clarifies one’s own meaning; 제가 이해한 게 맞다면 checks an interpretation.','Preserve qualifications and conditions when restating another person’s point.',`
[다시 말해], 먼저 허가가 필요해요.~I restate that permission is needed first.~전혀 다른 이야기지만;정반대로
[즉], 이 가격에는 배송비가 없어요.~I paraphrase that delivery is excluded.~전혀 관계없이;정반대로 말하면
[제 말은] 서명이 하나 빠졌다는 거예요.~I clarify that a signature is missing.~제가 이미 끝낸 것은;제가 절대 부정하는 것은
[제가 이해한 게 맞다면], 주말에도 열죠？~I check whether I understood that it opens at weekends.~확인이 전혀 필요 없지만;무엇을 말하든 상관없이`, `
[이렇게 이해하면 될까요]？ 이 항목만 유료라는 거죠？~I check whether only this item carries a charge.~모든 것을 이미 증명했어요;아무 설명도 듣지 않겠어요
[쉽게 말하면], 시간이 더 필요해요.~I restate simply that more time is needed.~다른 주제로 넘어가면;모든 관계를 부정하면`),
u('Offer alternatives while preserving choice','아니면 offers an alternative; 대신 can mark substitution. 불편하시면 leaves room for the other person’s circumstances.','Otherwise as a consequence and another option are different relations; read the whole sentence.',`
[아니면] 온라인으로 이야기해도 돼요.~I offer an online conversation as an alternative.~무조건 강제로;절대 불가능하니까
[대신] 작은 방을 쓰는 건 어때요？~I suggest a smaller room instead.~똑같이 추가로만;전혀 바꾸지 않고
[불편하시면] 날짜를 바꿀 수 있어요.~I offer rescheduling if inconvenient.~이미 모두 끝났으니;아무리 싫어도 강제로
[다른 방법은] 일을 나눠서 하는 거예요.~I offer dividing the work as another method.~유일한 금지는;이미 확정된 결과는`, `
먼저 [시험 삼아 해 보는 건 어때요]？~I suggest a trial first.~절대 하지 마세요;이미 모두 끝났어요
화요일이 안 되면 [목요일도 괜찮아요].~Thursday is offered as a fallback.~다른 날은 모두 금지예요;모든 일이 끝났어요`),
u('Idioms for support and active help','손을 보태다 means lend practical help; 힘이 되어 주다 means provide support. 발 벗고 나서다 describes active, willing involvement.','손을 놓다 can mean stop working on something, not lend a hand. Do not infer meaning from 손 alone.',`
이삿짐 나르는 데 [손을 보태 주세요].~Please lend a hand with moving the boxes.~방해해 주세요;모른 척해 주세요
친구가 제게 [힘이 되어 줬어요].~My friend provided support.~짐만 떠넘겼어요;등을 돌렸어요
이웃들이 [발 벗고 나섰어요].~The neighbours willingly stepped in to help.~모두 외면했어요;중간에 포기했어요
모두가 [힘을 합쳤어요].~Everyone joined forces.~책임을 떠넘겼어요;연락을 끊었어요`, `
정리할 때 동료가 [손을 보탰어요].~A colleague lent a hand with tidying.~일을 방해했어요;모른 척했어요
어려울 때 [힘이 되어 줘서] 고마워요.~I thank someone for supporting me during difficulty.~등을 돌려서;짐을 떠넘겨서`),
u('Realisation and sudden insight','이제야 알겠다 marks finally understanding. 감을 잡다 means get a feel for something. 눈이 뜨이다 can describe gaining awareness or a new perspective.','감을 잡다 does not claim complete mastery; it often marks initial understanding or intuition.',`
설명을 듣고 [이제야 알겠어요].~The explanation finally makes it clear.~전혀 관심 없어요;다 잊었어요
예시를 보니 [감을 잡았어요].~The example helped me get a feel for it.~완전히 포기했어요;아무것도 못 봤어요
그 경험으로 새로운 세계에 [눈이 뜨였어요].~The experience opened my eyes to a new world.~관심이 완전히 사라졌어요;모든 기억을 잃었어요
뒤늦게 실수를 [깨달았어요].~I realised the mistake belatedly.~금지했어요;주문했어요`, `
두 번 읽고 [이제야 알겠어요].~I finally understand after reading twice.~전혀 상관없어요;잊어버렸어요
연습을 하니 조금 [감을 잡았어요].~Practice helped me get some feel for it.~완전히 포기했어요;아무것도 못 봤어요`)
],B2:[
u('Follow corrections in travel information','-이/가 아니라 rejects an earlier detail; 변경되다 signals a change. 지연 means delay, while 취소 means cancellation.','Use the corrected information and distinguish a changed platform from a cancelled service.',`
아홉 시가 아니라 [열 시에 출발합니다].~The corrected departure is ten.~아홉 시 그대로입니다;운행이 취소됐습니다
오늘은 임시로 [대전역에도 정차합니다].~There is a temporary additional stop at Daejeon today.~대전역은 지나칩니다;내년에만 정차합니다
열차는 [지연됐지만 취소되지는 않았습니다].~The service is delayed but not cancelled.~완전히 취소됐습니다;이미 일찍 도착했습니다
[다음 역에서] 갈아타세요.~Change at the next station.~이 역에서;지난 역에서`, `
승강장이 [오 번으로 변경됐습니다].~The new platform is five.~삼 번 그대로입니다;팔 번으로 바뀌었습니다
도착이 [열 시 반으로 늦춰졌습니다].~Arrival is postponed to ten thirty.~아홉 시로 앞당겨졌습니다;완전히 취소됐습니다`),
u('Hear reservations within agreement','원칙적으로 signals agreement in principle. 다만 introduces a reservation; -는다는 전제하에 makes the basis of agreement explicit.','A condition for support does not establish that the condition has already been met.',`
찬성합니다. [다만 비용은 제한해야 합니다].~Support is qualified by a requirement to limit cost.~비용은 아무 상관없습니다;어떤 제한도 필요 없습니다
[원칙적으로] 가능하지만 일정은 협의해야 합니다.~Broad agreement is given with timing still to discuss.~무조건;절대 불가능하게
서면 허가를 [받는다는 전제하에] 시작할 수 있습니다.~Written permission is the premise for starting.~받지 않아도 무조건;전부 끝난 뒤에만
아이디어는 좋지만 [근거가 아직 부족합니다].~The idea has merit but evidence remains insufficient.~모든 의문이 해결됐습니다;검토할 필요가 없습니다`, `
지지합니다. [다만 예산은 아직 확정되지 않았습니다].~Support is qualified by an unresolved budget.~예산은 이미 보장됐습니다;확인은 필요 없습니다
시험 운영은 좋지만 [중단할 방법도 마련해야 합니다].~A trial requires a way to discontinue it.~절대 중단할 수 없어야 합니다;아무 조건도 필요 없습니다`),
u('Unreal past conditions with -았/었더라면','-았/었더라면 frames a past alternative; -았/었을 텐데 or -았/었을 것이다 can express its hypothetical result.','The construction presents an unreal alternative; it does not report that the condition actually occurred.',`
그때 알았더라면 [전화했을 텐데요].~Had I known then, I would have called.~이미 분명히 전화했어요;내년에야 전화해요
일찍 나왔더라면 [기차를 탔을 거예요].~An earlier departure would have let us catch the train.~이미 분명히 탔어요;절대 타고 싶지 않아요
파일을 저장했더라면 [잃어버리지 않았을 텐데요].~Saving the file would have prevented the loss.~내일 처음 저장해요;일부러 이미 지웠어요
도와주지 않았더라면 [포기했을지도 몰라요].~Without the help, I might have given up.~확실히 성공했어요;내일 처음 시작해야 해요`, `
메시지를 읽었더라면 [답장했을 텐데요].~Reading the message would have led me to reply.~확실히 이미 답장했어요;답장을 금지했어요
조금 더 머물렀더라면 [만났을 거예요].~Staying longer would have let us meet.~분명히 이미 만났어요;다시는 만나고 싶지 않아요`),
u('Read concessions without reversing the conclusion','-지만 marks contrast; -더라도 presents a condition under which the conclusion still holds. -에도 불구하고 acknowledges an obstacle.','An actual concession and a hypothetical even-if condition are not identical.',`
표본이 작[지만] 참고할 가치는 있어요.~The sample is small but still has value.~도록;기 때문에만
수요가 줄[더라도] 예비 자원은 필요해요.~Resources remain necessary even if demand falls.~기 위해서;었기 때문에만
방법은 쓸 만하지만 [이상적이지는 않아요].~The method is usable but not ideal.~완벽해요;완전히 쓸모없어요
지연[에도 불구하고] 목표는 달성할 수 있어요.~The delay does not make the goal unreachable.~만을 위해서;만이 원인이므로`, `
가격이 오르[더라도] 바로 중단하지는 않아요.~A price increase would not cause immediate discontinuation.~도록;기 위해서만
보고서는 유용하지만 [결론은 더 검증해야 해요].~The report is useful but the conclusions need verification.~모든 결론은 확실해요;검토는 전혀 필요 없어요`),
u('Duration, ongoing activities and resulting states','-고 있다 commonly presents an ongoing activity; -아/어 있다 often describes a resulting state with suitable intransitive verbs. 계속 highlights continuity.','앉고 있어요 can describe sitting down in progress; 앉아 있어요 describes being seated. The constructions are not interchangeable.',`
우리는 계속 [논의하고 있어요].~We are continuing to discuss it.~논의를 끝냈어요;전혀 논의하지 않았어요
제가 왔을 때 아직 [일하고 있었어요].~They were still working when I arrived.~오래전에 퇴근했어요;내일 처음 시작해요
문이 [열려 있어요].~The door is in an open state.~잠겨 있어요;내일 열릴 거예요
학생들이 의자에 [앉아 있어요].~The students are seated on chairs.~내일 앉을 거예요;일어나서 나갔어요`, `
벌써 이십 분째 [기다리고 있어요].~I have already been waiting for twenty minutes.~내일 올 거예요;기다린 적이 없어요
벽에 그림이 [걸려 있어요].~A painting hangs on the wall as a resulting state.~내일 걸 거예요;그림이 없어요`),
u('Counterfactual conditions with present consequences','A past unreal condition can have a current hypothetical result, marked by 지금 and a suitable present-result form. Time references govern the interpretation of each clause.','Do not automatically make the result past just because the condition refers to a past decision.',`
그때 수락했더라면 [지금 거기서 일할 텐데요].~Accepting the past offer would mean working there now.~어제 분명히 그만뒀어요;내년에 처음 초대를 받아요
전에 배웠더라면 [지금 답할 수 있을 텐데요].~Earlier study would let me answer now.~어제 분명히 답했어요;영원히 답할 수 없어요
카드를 가져갔더라면 [어제 결제했을 텐데요].~Taking the card would have allowed payment yesterday.~내일 카드를 살 거예요;확실히 이미 결제했어요
지연되지 않았더라면 [벌써 도착했을 거예요].~Without the delay we would already have arrived.~내년에 출발해요;분명히 취소했어요`, `
저축했더라면 [지금 떠날 수 있을 텐데요].~Past saving would let us leave now.~어제 이미 돌아왔어요;영원히 못 떠나요
묻지 않았더라면 [아직 오류를 몰랐을 거예요].~Without asking, we would still be unaware of the error.~이미 모두 고쳤어요;내일 처음 오류가 생겨요`),
u('Weigh options and anticipate costs','장단점을 따지다 means weigh pros and cons. 감수하다 means accept a drawback or risk. 고려하다 takes a relevant factor into account.','감수하다 does not mean welcome or eliminate a risk; the drawback is accepted for another reason.',`
먼저 [장단점을 따져 봅시다].~Let us weigh advantages and disadvantages first.~무조건 승인합시다;모든 위험을 무시합시다
추가 비용을 [감수해야 해요].~We must accept an additional cost.~완전히 없앴어요;절대 지불하지 않아요
장기적인 영향을 [고려해야 해요].~Long-term effects should be considered.~숨겨야 해요;무시해야 해요
이 선택은 [양날의 검이에요].~The choice can have both benefits and harms.~아무 위험도 없어요;완전히 쓸모없어요`, `
결정 전에 [대안을 비교해요].~Compare alternatives before deciding.~보지도 않고 승인해요;모든 결과를 보장해요
어느 정도의 지연은 [감수해야 할 것 같아요].~We may need to accept some delay.~확실히 완전히 없앴어요;이미 불가능하게 만들었어요`),
u('Coordinate action and implement a decision','실행에 옮기다 puts a decision into practice; 착수하다 starts work. 진행 상황을 점검하다 reviews progress.','Starting implementation does not establish successful completion.',`
이제 계획을 [실행에 옮겨야 해요].~Now the plan must be implemented.~숨겨야 해요;금지해야 해요
먼저 [진행 상황을 점검합시다].~Let us review progress first.~모든 기록을 지웁시다;확인을 거부합시다
발표 전에 [팀과 조율해야 해요].~Coordinate with the team before announcing.~팀을 무시해야 해요;연락을 끊어야 해요
절차에 [착수했어요].~We have begun the procedure.~완전히 끝냈어요;모든 행동을 취소했어요`, `
부서마다 [역할을 분명히 해야 해요].~Responsibilities should be clear across departments.~정보를 숨겨야 해요;같은 실수를 반복해야 해요
행동하기 전에 [목표를 공유합시다].~Let us establish shared goals before acting.~소통을 거부합시다;사실을 바꿉시다`),
u('Idioms for pressure and difficult positions','진퇴양난 describes a dilemma. 발등에 불이 떨어지다 describes sudden urgency. 가볍게 넘기다 treats something lightly.','Idioms have register and intensity; a routine inconvenience may not justify an emphatic crisis expression.',`
두 요구 사이에서 [진퇴양난이에요].~I face a dilemma between two demands.~아무 걱정이 없어요;모든 게 쉬워요
마감이 앞당겨져 [발등에 불이 떨어졌어요].~The earlier deadline created sudden urgency.~할 일이 없어졌어요;모든 게 여유로워졌어요
위험을 [가볍게 넘기면 안 돼요].~The risk must not be dismissed lightly.~신중히 분석하면 안 돼요;명확히 말하면 안 돼요
급할수록 [침착해야 해요].~Greater urgency calls for composure.~무작정 서둘러야 해요;생각을 멈춰야 해요`, `
양쪽 부탁 때문에 [곤란한 처지에 놓였어요].~Competing requests put me in a difficult position.~아무 부담이 없어요;완전히 자유로워요
비판을 받아도 [침착함을 유지했어요].~They stayed composed under criticism.~화를 터뜨렸어요;당황해서 멈췄어요`),
u('Persist, reassess and recognise stalled progress','끝까지 버티다 describes persistence. 제자리걸음 means stalled progress. 방향을 틀다 changes direction; 포기하다 gives up.','Persistence and changing course can both be sensible; identify what the context recommends.',`
어려워도 [끝까지 버텨요].~Persist despite difficulty.~바로 포기해요;이미 끝났어요
협상이 [제자리걸음이에요].~The negotiations are making no progress.~잘 끝났어요;빠르게 진행돼요
이제 [방향을 틀어야 해요].~We now need to change direction.~모두 그대로 둬야 해요;수정을 금지해야 해요
아직 [포기하고 싶지 않아요].~I do not yet want to give up.~계속하고 싶지 않아요;노력하기 싫어요`, `
배울 때 [꾸준히 노력했어요].~They persisted steadily in learning.~바로 포기했어요;대충 넘겼어요
피드백이 없어 프로젝트가 [제자리걸음이에요].~The project is stalled without feedback.~빠르게 끝났어요;아무 장애도 없어요`)
],C1:[
u('Write a precise formal clarification request','Formal written requests can use -아/어 주시면 감사하겠습니다. Identify the document, uncertainty, requested action and response deadline.','An elaborate honorific ending does not compensate for missing factual details or an unclear request.',`
산정 기준을 [설명해 주시면 감사하겠습니다].~I courteously request the calculation basis.~설명하지 마시기 바랍니다;읽지 않고 동의합니다
[귀사의 제안과 관련하여] 두 가지를 확인하고자 합니다.~The writer formally refers to the company’s proposal.~전혀 관계없이;모든 연락을 거부한 뒤에
견적에 [어떤 서비스가 포함되는지 명시해 주십시오].~I request the exact included scope.~아무 정보도 주지 마십시오;모두 거부되었다고 단정합니다
계약 전에 [미해결 사항을 먼저 정리할 것을 제안합니다].~I propose resolving open matters before signing.~모든 모호함을 그대로 둡니다;침묵을 무조건 동의로 간주합니다`, `
추정치가 [어느 기간을 대상으로 하는지 밝혀 주시겠습니까]？~I request the estimate’s time scope.~검토를 전부 거부하시겠습니까;모든 근거를 삭제하시겠습니까
가능하시다면 [수요일까지 회신 부탁드립니다].~I courteously request a response by Wednesday.~영원히 답하지 마십시오;모두 끝난 뒤에만 답하십시오`),
u('Read implied reservations and tactful criticism','다소 의문이 남다 signals unresolved reservations. -다고 한다 reports another source; 적어도 출발점은 되다 concedes limited value.','A restrained formulation can communicate a substantive objection. Interpret it within the surrounding argument.',`
이 설명에는 [다소 의문이 남습니다].~The writer retains reservations about the explanation.~의문이 전혀 없습니다;최종 증명이 끝났습니다
일정이 [지나치게 낙관적인 듯합니다].~The schedule is tactfully criticised as overoptimistic.~위험이 전혀 없습니다;수정이 절대 필요 없습니다
적어도 [출발점은 됩니다].~Some limited initial value is conceded.~유일한 최종 해답입니다;아무 가치도 없습니다
이 결과는 [신중하게 받아들여야 합니다].~The result should be treated cautiously.~검토 없이 믿어야 합니다;반드시 전부 틀렸습니다`, `
답변은 [여러 의문을 남깁니다].~The response leaves several issues unresolved.~모든 의문을 없앴습니다;질문을 금지합니다
제안은 [논의할 여지가 있습니다].~The proposal remains open to discussion.~이미 무조건 확정됐습니다;논의가 금지됐습니다`),
u('Separate association, causation and evidential scope','-와 관련이 있다 describes association; -에 기인하다 attributes a cause. -라고 단정할 수 없다 limits a conclusion.','Co-occurrence alone does not establish causation; wording should match the evidence and study design.',`
감소는 [가격 상승과 관련이 있습니다].~The decline is associated with higher prices.~유일한 원인을 증명합니다;모든 관계를 부정합니다
지연은 [서버 장애에 기인합니다].~The server fault is identified as the cause.~서버와 전혀 무관합니다;단지 우연히 동시에 일어났습니다
자료는 [연관 가능성을 시사합니다].~The data suggest a possible association.~모든 원인을 증명합니다;모든 관계를 배제합니다
이것만으로 효과가 있었다고 [단정할 수 없습니다].~This alone does not justify a definite claim of effect.~최종 증명했습니다;영원히 불가능합니다`, `
연구 설계상 [인과관계를 추론하기 어렵습니다].~The design does not justify a causal inference.~유일한 원인을 확증합니다;모든 검토를 대체합니다
결론은 [이번 표본의 범위에 한정됩니다].~The conclusion is limited to this sample’s scope.~모든 사람에게 보장됩니다;모든 미래 상황에 적용됩니다`),
u('Synthesize evidence into a proportionate recommendation','한편 can introduce another consideration; 종합하면 connects a synthesis to a recommendation. Explicitly weigh benefits, limitations and remaining checks.','Explain how the evidence supports the proposed next step rather than merely listing competing statements.',`
비용은 줄지만 [검증 업무는 늘어납니다].~The synthesis balances lower costs against more verification work.~모든 부담도 사라집니다;아무 변화도 없습니다
[종합하면], 소규모 시범 운영을 권고합니다.~The recommendation follows from the overall analysis.~근거를 무시하면;분석과 전혀 관계없이
결과는 [단계적인 시험을 뒷받침합니다].~The findings support gradual testing.~항상 성공을 보장합니다;모든 관찰을 금지합니다
효익은 기대되지만 [일반화 가능성은 불확실합니다].~Benefit is plausible but generalisability remains uncertain.~모든 문제가 해결됐습니다;모든 상황에서 효과가 보장됩니다`, `
[독립적인 검증이 결과를 확인할 경우에만] 확대를 권고합니다.~Expansion requires independent confirmation.~모든 근거가 반박돼도;검토와 전혀 관계없이
[위험을 고려하면], 시범 단계는 타당해 보입니다.~Considering risks, a pilot appears defensible.~위험이 전혀 없다는 보장 때문에;모든 위험을 무시했으므로`),
u('Past inference, appearance and reported claims','-았/었나 보다 infers a past event from signs. -았/었다고 한다 reports a claim; -았/었을 수도 있다 leaves a possibility open.','An inference and an attributed report are not independently established facts. Keep their evidential strength distinct.',`
불이 꺼졌네요. [벌써 나갔나 봐요].~The speaker infers that the person has already left.~내일 처음 나가요;절대 못 나가요
확인되지 않은 보도에 따르면 [사임했다고 합니다].~Resignation is reported without independent confirmation.~내일 반드시 사임할 겁니다;사임은 정의상 불가능합니다
이제는 소식을 [받았을 수도 있어요].~They may have received the news by now.~내년에야 받게 돼요;절대 읽을 수 없어요
열쇠가 없으니 [혼자 들어갔을 리가 없어요].~The speaker rules out entering alone without a key.~내일 들어가야 해요;새 열쇠를 살 거예요`, `
길이 젖었어요. [비가 왔나 봐요].~The wet road supports an inference of past rain.~내일 처음 비가 와요;비가 온 적이 없어요
검증되지 않은 소식에 따르면 [회사가 제안을 철회했다고 합니다].~An unverified source reports the company’s withdrawal.~모든 제안은 언제나 불가능합니다;반드시 내일 철회합니다`),
u('Regret and unreal past wishes','-았/었어야 했는데 expresses a missed desirable action; -았/었더라면 좋았을 텐데 expresses regret about a past alternative.','Regret does not assert that the desired action happened. Distinguish it from a factual past narrative.',`
[미리 물어봤어야 했는데요].~I regret not having asked beforehand.~분명히 미리 물어봤어요;내일 처음 물을 거예요
경고를 [진지하게 받아들였어야 했어요].~I should have taken the warning seriously.~분명히 그렇게 했어요;전혀 신경 쓸 필요 없어요
[조금 더 머물렀더라면 좋았을 텐데요].~I wish I had stayed longer.~분명히 더 머물렀어요;내일 처음 도착해요
우리는 [마감일을 지켰어야 했어요].~We should have met the deadline.~분명히 제시간에 끝냈어요;내년에 날짜를 정해요`, `
[네 조언을 들었더라면 좋았을 텐데].~I wish I had followed your advice.~분명히 그대로 했어;절대로 듣지 않을 거야
먼저 주소를 [확인했어야 했어요].~I should have checked the address first.~분명히 확인했어요;내일 처음 주소를 받아요`),
u('Calibrate certainty and identify the source','현재 자료에 따르면 limits a claim to current evidence. -에 따르면 attributes a source; 그럴듯하지만 입증되지 않았다 distinguishes plausibility from proof.','An attributed or official statement can still need verification; source naming is not truth certification.',`
[현재 자료에 따르면], 추가 피해는 확인되지 않았습니다.~The statement is limited to current data.~영원히 피해가 없다고 보장합니다;자료와 무관하게
[담당 기관에 따르면], 공사는 유월에 시작됩니다.~The agency is the source of the June start.~아무 출처도 없이;모든 공지와 반대로
이 설명은 [그럴듯하지만 입증되지는 않았습니다].~The explanation is plausible but unproven.~최종적으로 반박됐습니다;의심 없이 증명됐습니다
이 연관성은 [아직 충분한 근거가 없습니다].~The association lacks sufficient support so far.~이미 최종 증명됐습니다;영원히 있을 수 없습니다`, `
[현재 징후로 미루어 보면], 절차가 바뀐 듯합니다.~Available signs support an inference of changed procedure.~영원불변의 법칙으로;아무 근거 없이
보고서는 [유의미한 증가를 입증하지 못했습니다].~The report did not establish a significant increase.~모든 증가를 확증했습니다;모든 미래 성장을 보장했습니다`),
u('Qualify scope and preserve negation','반드시...것은 아니다 denies necessity. -에 한해서 limits scope; -을/를 전제로 makes a premise explicit.','배제할 수 없다 leaves a possibility open; it does not prove that it occurred.',`
자료가 많다고 [반드시 편향이 줄어드는 것은 아닙니다].~More data do not necessarily reduce bias.~항상 편향이 사라집니다;모든 경우에 완벽합니다
이 비교는 [제한적인 참고 가치만 있습니다].~The comparison has limited interpretive value.~어디서나 절대적으로 유효합니다;모든 것을 증명합니다
확약은 [승인을 전제로 합니다].~The commitment depends on approval.~거부돼도 무조건 유효합니다;어떤 조건도 없습니다
결과를 [모든 집단에 바로 일반화할 수는 없습니다].~The result cannot simply be generalised to every population.~모두에게 효과를 보장합니다;아무 의미도 없습니다`, `
가정은 [엄격한 조건에서만 성립합니다].~The assumption holds only under strict conditions.~모든 경우에 성립합니다;아무 제한도 없습니다
제안은 [이 점에서는] 합리적입니다.~The proposal is reasonable in the specified respect.~모든 면에서 반드시;어떤 경우에도 안`),
u('Understatement and tactful criticism','다소 아쉽다 and 개선의 여지가 있다 can communicate criticism mildly. 설득력이 부족해 보이다 questions support for an argument.','Indirectness depends on context; use explicit wording when a precise instruction is needed.',`
이 일정은 [다소 아쉽습니다].~The schedule is tactfully judged less than satisfactory.~완벽합니다;무조건 승인됐습니다
논증에는 [개선의 여지가 있습니다].~The argument could be improved.~개선할 점이 전혀 없습니다;개선이 금지됐습니다
이 추론은 [설득력이 부족해 보입니다].~The inference appears insufficiently persuasive.~최종적으로 증명됐습니다;단순한 숫자입니다
답변이 [조금 더 충실했으면 좋겠습니다].~The response is tactfully criticised as needing more substance.~이미 완벽하게 끝났습니다;더 보충할 필요가 없습니다`, `
시간표가 [지나치게 낙관적이지 않나 싶습니다].~The speaker tactfully questions an overoptimistic schedule.~위험이 전혀 없다고 보장합니다;목표가 전혀 없다는 뜻입니다
그 말이 [큰 도움이 된 것 같지는 않습니다].~The speaker mildly questions the comment’s usefulness.~최대한 도움이 됐다고 확신합니다;모든 결론을 증명합니다`),
u('Adjust speech level and request register','해요-style is polite conversational; 합니다-style is formal polite. Familiar 해-style requires a relationship where it is appropriate. Honorific -시- concerns the referent, not simply sentence formality.','Do not use familiar endings with an unfamiliar adult merely because an English sentence sounds casual.',`
[관련 자료를 보내 주시기 바랍니다].~A formal professional request for relevant documents.~어떤 자료도 보내지 마십시오;자료는 전혀 관계없습니다
[시간 날 때 파일 좀 보내 줘].~A familiar request to send a file when available.~그 파일은 절대로 보내지 마십시오;파일은 이미 취소됐습니다
[변경 사항이 있으면 알려 주십시오].~A formal request for notice of changes.~아무 변화도 말하지 마십시오;모두 확인 없이 동의하십시오
[잠깐 봐 줄 수 있어요]？~A polite conversational request for a quick look.~아무것도 확인하지 마세요;모든 도움을 거절했어요`, `
[빠른 회신을 부탁드립니다].~A formal courteous request for a prompt reply.~영원히 답하지 마십시오;어떤 답변도 소용없습니다
[바뀌면 나한테 말해 줘].~A familiar request to be informed of changes.~무슨 일이 있어도 말하지 마십시오;모든 변화는 취소됐습니다`),
u('Everyday idioms: memory and decision-making','즉석에서 means on the spot; 기억나는 대로 means from recollection. 결정권을 쥐다 holds decision-making power. 한시름 놓다 feels relief from a major worry.','기억나는 대로 is not a guarantee of accuracy; it explicitly permits imperfect recollection.',`
준비 없이 [즉석에서] 설명했어요.~They explained it on the spot without preparation.~대본을 그대로 읽어서;몇 주 동안 외운 뒤에
숫자는 [기억나는 대로] 말할게요.~I will give the figures from recollection.~방금 확인한 표대로;눈앞의 자료 그대로
이 부서는 그분이 [결정권을 쥐고 있어요].~That person holds decision-making power in the department.~아무 권한도 없어요;누구도 몰라요
확인을 받고 [한시름 놓았어요].~The confirmation brought relief from a worry.~더 큰 걱정이 생겼어요;모든 새 책임을 떠안았어요
그 말이 [불쑥 튀어나왔어요].~The words came out suddenly without planning.~대본대로 낭독됐어요;한동안 묵독됐어요`, `
[즉석에서] 예를 들 수 있어요？~Can you give an example on the spot?~몇 주간 준비한 뒤에;대본을 읽으면서
이 선택의 [결정권은 누구에게 있어요]？~Who has decision-making authority over this choice?~누가 전혀 참여하지 않아요;누가 서류를 잃어버렸어요`),
u('Idioms and proverbs: reversal and concealed problems','판을 뒤집다 reverses the situation. 덮어 두다 suppresses an issue. 손바닥으로 하늘을 가릴 수 없다 says an obvious truth cannot be concealed by a futile attempt.','A proverb carries conventional cultural imagery; choose it for the actual situation rather than translating an English idiom word for word.',`
결정적인 증거가 [판을 뒤집었어요].~The decisive evidence reversed the situation.~모두 그대로 뒀어요;변화를 막았어요
불만을 그냥 [덮어 두면 안 돼요].~Complaints must not simply be suppressed.~공개적으로 논의하면 안 돼요;명확히 조사하면 안 돼요
[손바닥으로 하늘을 가릴 수는 없어요].~An obvious truth cannot be concealed by a futile attempt.~모든 진실은 영원히 감출 수 있어요;사실은 아무 의미가 없어요
수리비가 새 제품 값보다 비싸니 [배보다 배꼽이 더 큰 셈이에요].~A secondary cost outweighing the main purchase is disproportionate.~핵심에만 충실한 셈이에요;모든 문제가 해결된 셈이에요
그 경험 덕분에 [눈이 휘둥그레졌어요].~The experience left me wide-eyed with surprise.~전혀 놀라지 않았어요;미리 다 예상했어요`, `
기록을 지워도 [손바닥으로 하늘을 가릴 수는 없어요].~Deleting records cannot conceal the obvious truth.~사실을 영원히 숨길 수 있어요;아무 설명도 필요 없어요
새 증거가 [판을 뒤집었어요].~New evidence reversed the situation.~모든 것을 그대로 뒀어요;변화를 불가능하게 했어요`)
]};
