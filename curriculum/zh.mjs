import {u} from './authoring.mjs';
export const zhUnits={A1:[
u('Introduce yourself in Mandarin','我叫 introduces a name; 我来自 identifies origin and 我住在 identifies where you live. Mandarin verbs do not conjugate for grammatical person.','Use standard Mandarin with Simplified Chinese here. A shared written form does not imply identical pronunciation across Chinese varieties.',`
我[叫]安娜。~My name is Anna.~吃;买
我[来自]意大利。~I come from Italy.~喜欢;学习
我[住在]北京。~I live in Beijing.~喝;认识
你[叫什么名字]？~What is your name?~去哪儿买票;几点下班`, `
我[叫]李明，很高兴认识你。~Li Ming introduces himself and expresses pleasure at meeting.~买;喝
您[怎么称呼]？~How should I address you, politely?~什么时候出发;要几张票`),
u('Identity with 是 and adjective predicates','是 links a subject to a noun phrase. A simple adjective predicate commonly uses 很 without necessarily emphasising very. Adjectives do not require 是 in this pattern.','他很忙 is a normal statement that he is busy; 他是忙 is not the ordinary equivalent.',`
她[是]老师。~She is a teacher.~在;有
我[很忙]。~I am busy.~是忙;有忙
我们[是]同学。~We are classmates.~有;到
今天[很冷]。~Today is cold.~是冷;有冷`, `
他[是]我的朋友。~He is my friend.~有;到
这家店[很近]。~This shop is nearby.~是近;有近`),
u('Present routines and time placement','Mandarin commonly places a time expression before the verb, before or after the subject. Context or time words locate the event; the verb does not take person or tense endings.','Do not insert 了 mechanically whenever an English verb has a past form; it marks aspect or a changed situation in specific constructions.',`
我每天[喝茶]。~I drink tea every day.~买票;开车
她早上[学习中文]。~She studies Chinese in the morning.~去游泳;做晚饭
我们星期五[去图书馆]。~We go to the library on Fridays.~在家做饭;去机场
他晚上[看书]。~He reads in the evening.~打球;买菜`, `
我周末[做饭]。~I cook at weekends.~坐飞机;开会
他们下午[工作]。~They work in the afternoon.~睡觉;散步`),
u('Listen to a café order','我要 can state an order; 我想要 softens the request. 杯 is a common measure word for a drink. Listen for 要/不要 and 带走/在这里喝.','谢谢 and 请 help make service requests courteous; politeness is not conveyed by a single fixed formula in every context.',`
我想要[一杯茶]。~The customer wants a cup of tea.~一杯咖啡;一杯果汁
咖啡[不要糖]。~The coffee should have no sugar.~多加糖;加牛奶
这两杯[带走]。~The two drinks are to take away.~在这里喝;明天再买
请[买单]。~The customer asks to pay the bill.~给菜单;订位`, `
请给我[一杯水]。~The customer requests a glass of water.~一杯茶;一杯咖啡
我们[在这里喝]。~The customers will drink here.~全部带走;明天再来`),
u('Ask questions with 吗 and question words','Add 吗 to a statement to form a common yes/no question. Question words such as 谁、哪里、什么时候 stay in the position of the information sought.','Do not add 吗 automatically to a question already formed with a question word.',`
你是学生[吗]？~Are you a student?~谁;哪里
你住在[哪里]？~Where do you live?~什么时候;谁
[谁]是王老师？~Who is Teacher Wang?~哪里;多少
你[什么时候]有空？~When are you free?~谁;哪里`, `
这张票[多少钱]？~How much is this ticket?~谁;什么时候
你喜欢茶[吗]？~Do you like tea?~哪里;谁`),
u('Negation with 不 and 没有','不 commonly negates habits, intentions and states; 没有 negates possession and usually the occurrence or completion of an event. 没 is common before a verb.','Negating an event with 没 generally does not retain perfective 了 immediately after that verb.',`
我[不]喝咖啡。~I do not drink coffee.~没了;很
他[没有]车。~He does not have a car.~不是;不有
昨天我[没]去学校。~I did not go to school yesterday.~不曾经了;很
她[不是]医生。~She is not a doctor.~没有是;不有`, `
我[没有]时间。~I do not have time.~不是;不有
这个菜[不]辣。~This dish is not spicy.~没了;有`),
u('Food, quantities and measure words','Common combinations include 一碗米饭、一杯水 and 一个苹果. Measure words depend on the noun and the intended unit.','个 is common but is not a universal substitute for every measure word.',`
我要一碗[米饭]。~I want a bowl of cooked rice.~地图;报纸~cooked rice
请给我一杯[水]。~Please give me a glass of water.~书;鞋~water
我买了一个[苹果]。~I bought an apple.~椅子;桌子~apple
她喝[牛奶]。~She drinks milk.~钥匙;门票~milk
我们吃[面条]。~We eat noodles.~铅笔;雨伞~noodles
他买了两个[鸡蛋]。~He bought two eggs.~手机;房间~eggs`, `
早餐我吃一个[鸡蛋]。~I eat an egg for breakfast.~钥匙;房间
请再来一碗[米饭]。~Please bring another bowl of rice.~地图;报纸`),
u('Places and everyday destinations','Learn place words in useful sentences. 在 locates someone; 去 describes going to a destination.','在学校 can mean at school; 去学校 means go to school. The place noun alone does not indicate movement.',`
我去[药店]买药。~I go to the pharmacy to buy medicine.~公园;电影院~pharmacy
她在[图书馆]看书。~She reads in the library.~机场;餐厅~library
我们去[车站]坐火车。~We go to the station to take a train.~厨房;卧室~station
他在[银行]工作。~He works at a bank.~森林;海边~bank
我去[超市]买菜。~I go to the supermarket to buy groceries.~博物馆;教室~supermarket
他们在[公园]散步。~They walk in the park.~办公室;机场~park`, `
买药请去[药店]。~Go to the pharmacy to buy medicine.~电影院;体育馆
看电影我们去[电影院]。~We go to the cinema to watch a film.~银行;药店`),
u('Greetings, thanks and courteous attention','你好 is a general greeting; 您好 is respectful. 谢谢 expresses thanks; 不客气 acknowledges it. 不好意思 can get attention or apologise for a minor inconvenience.','您好 is not a grammatical plural of 你好. Actual greeting choices depend on relationship and context.',`
[您好]，王老师。~A respectful greeting to Teacher Wang.~晚安;再见
[谢谢]你的帮助。~I thank someone for help.~没关系;可惜
谢谢！——[不客气]。~The reply acknowledges thanks.~太贵了;不知道
[不好意思]，出口在哪里？~I courteously get attention to ask for the exit.~真可惜;没想到`, `
[早上好]，大家！~A morning greeting to everyone.~晚安;明天见
[再见]，星期一见。~A goodbye until Monday.~欢迎光临;请进`),
u('Repair understanding in conversation','请再说一遍 requests repetition; 请说慢一点 requests slower speech. 没听懂 means not having understood what was heard.','没听见 means not hearing it; 没听懂 means hearing without understanding. Distinguish the repair needed.',`
请[再说一遍]。~Please say it again.~马上离开;别再提了
请[说慢一点]。~Please speak a little more slowly.~走远一点;明天再来
我[没听懂]最后一句。~I did not understand the last sentence I heard.~不同意;已经写完
这个词[是什么意思]？~What does this word mean?~多少钱;几点出发`, `
请[写下来]，好吗？~Please write it down.~擦掉;藏起来
这个用中文[怎么说]？~How do you say this in Chinese?~在哪里买;几点开门`),
u('Needs and basic states','我饿了、我渴了 and 我累了 describe current states, often with a change-of-state 了. 需要 expresses need; 想 can express wanting or intention.','Sentence-final 了 does not itself mean past tense. 我饿了 often means I am hungry now.',`
我[饿了]。~I am hungry now.~渴了;困了
我[渴了]。~I am thirsty now.~饿了;冷了
我[需要]帮助。~I need help.~认识;参加
我[困了]，想休息。~I am sleepy and want a rest.~高兴了;明白了`, `
我[冷了]，能关窗吗？~I feel cold and ask whether the window can be closed.~热了;饿了
我们[需要]一张地图。~We need a map.~认识;欢迎`),
u('Clock times and arrangements','点 gives an hour and 分 gives minutes; 半 means half past. A time phrase normally precedes the action. 两点 uses 两 rather than 二 in ordinary clock reading.','下午三点 is three in the afternoon; 上午三点 is three in the morning. Do not drop the part of day when it matters.',`
我们[下午三点]见。~We meet at three in the afternoon.~上午三点;下午五点
课[九点半]开始。~The class begins at nine thirty.~九点一刻;十点半
我[星期一]去上海。~I go to Shanghai on Monday.~昨天晚上;明年夏天
她[每天早上]跑步。~She runs every morning.~昨天一次;明年一次`, `
电影[晚上八点]开始。~The film begins at eight in the evening.~早上八点;下午两点
我们[两点]出发。~We leave at two.~二十点;十二点`)
],A2:[
u('Completed events with perfective 了','Perfective 了 after a verb presents an event as bounded or completed in context. A time phrase can locate it in the past. Mandarin does not conjugate a verb into a past tense.','Do not add 了 to every past statement: habits, states and negated completed events follow other patterns.',`
昨天我[买了]一本书。~Yesterday I bought a book.~明天买;没买
她[喝了]一杯茶。~She drank a cup of tea.~不喝;明天喝
我们[看了]那部电影。~We watched that film.~没看;准备明天看
他[写完了]报告。~He finished writing the report.~还没写完;准备开始写`, `
上午我[发了]三封邮件。~I sent three emails this morning.~没发;明天发
她昨天[去了]银行。~She went to the bank yesterday.~没去;明天去`),
u('Arrange a meeting with alternatives','我们...吧 offers a suggestion; 你方便吗 checks availability. 要不 introduces an alternative in conversation.','吧 can soften a suggestion; it does not always mean a command or a question.',`
我们星期六见[吧]。~Let us meet on Saturday.~过;着
下午三点你[方便吗]？~Does three in the afternoon suit you?~已经走了吗;买了多少
六点我[有事]。~I have another commitment at six.~一直有空;已经同意
[要不]，我们改到星期天？~I suggest Sunday as an alternative.~既然已经结束;绝对不行`, `
我们在博物馆门口[见面吧]。~I suggest meeting at the museum entrance.~别再联系了;已经分手了
[你看五点怎么样]？~I ask whether five would suit.~你必须马上来;我们已经取消了`),
u('Hear Mandarin tones and changes in connected speech','Mandarin has four lexical tones and an unstressed neutral tone. Pinyin tone marks show lexical tones; actual connected speech includes third-tone sandhi and changes to 一 and 不 in specified contexts.','A neutral tone is not a fifth fixed pitch contour. Tone and segment pronunciation both distinguish words.',`
我想[买]一本书。~I want to buy a book; 买 mǎi is distinct from 卖 mài.~卖;埋
他在[卖]水果。~He is selling fruit; 卖 mài is distinct from 买 mǎi.~买;埋
这是我[妈妈]。~This is my mother; māma has a neutral second syllable.~马;骂
我[不去]。~I am not going; 不 before fourth-tone 去 is normally pronounced bú.~不来;不忙`, `
我想买[一件]衬衫。~Before fourth-tone 件, 一 is normally pronounced yí.~一杯;一本
[你好]，很高兴见到你。~The first of two consecutive third tones is normally realised with a rising contour.~明天;再见`),
u('Follow directions and landmarks','往右/左拐 gives a turn; 一直往前走 means continue straight. 过了...以后 places an action after passing a landmark.','Distinguish 左边 from 右边 and the next intersection from the current one.',`
过桥以后[往右拐]。~Turn right after crossing the bridge.~往左拐;往回走
[一直往前走]，到广场再停。~Continue straight to the square.~马上往回走;在这里停
银行在邮局[对面]。~The bank is opposite the post office.~里面;楼上
到[下一个路口]再拐。~Turn at the next intersection.~这个路口;上一个路口`, `
入口在药店[旁边]。~The entrance is next to the pharmacy.~里面;楼顶
[过马路]以后往左走。~Cross the road, then go left.~别过马路;回到原地`),
u('Ask about events and completion','了吗 asks about completion or a changed situation. 有没有 plus a verb asks whether an event occurred. Question words remain in their ordinary information position.','你去哪儿了 asks where someone went; 你要去哪儿 asks where they intend to go.',`
你昨天[买了什么]？~What did you buy yesterday?~明天买什么;想买什么
你[吃饭了吗]？~Have you eaten?~明天吃什么;想不想做饭
她[有没有来]？~Did she come?~明天来不来;想去哪儿
你把钥匙[放在哪儿了]？~Where did you put the keys?~明天放哪儿;要买几把`, `
你们[看完了吗]？~Have you finished watching or reading it?~明天看什么;想看多久
他昨天[什么时候到的]？~When did he arrive yesterday?~明天几点出发;想去哪儿`),
u('Past background, ongoing action and habitual situations','在 or 正在 before a verb can present an action in progress. Time expressions supply a past reference; 以前 and 那时候 introduce past habits or states.','着 often presents a continuing state or manner and is not interchangeable with 正在 for every activity.',`
我到的时候，她[正在做饭]。~She was cooking when I arrived.~明天做饭;已经吃完了
小时候，我[常常去海边]。~As a child I often went to the seaside.~明年去海边;只去过一次
昨天八点[很冷]。~It was cold at eight yesterday.~明天很热;从来不冷
他一边[走路]，一边打电话。~He walks while speaking on the phone.~已经睡着;明天出发`, `
我打电话时，他们[正在开会]。~They were in a meeting when I called.~明天才开会;已经散会很久了
那时候我们[住在乡下]。~We lived in the countryside at that time.~明年搬家;准备去城里`),
u('Hotel and accommodation vocabulary','Use practical combinations such as 预订房间、拿钥匙、要毛巾 and 开收据. 一间房 uses 间 as the room measure word.','订 and 定 overlap in some established spellings; use the taught booking expression rather than inferring a universal character rule.',`
我有[预订]。~I have a reservation.~会议;作业~reservation
我要一间[单人房]。~I want a single room.~双人房;会议室~single room
我丢了[钥匙]。~I lost the key.~毛巾;早餐~key
请再给我一条[毛巾]。~Please give me another towel.~收据;地图~towel
房费包括[早餐]吗？~Does the room price include breakfast?~行李;钥匙~breakfast
请给我[收据]。~Please give me a receipt.~枕头;牙刷~receipt`, `
我的[房间]在二楼。~My room is on the second floor.~行李;早餐
我用王明的名字做了[预订]。~I made the booking under Wang Ming.~毛巾;早餐`),
u('Work and scheduling vocabulary','Learn the nouns with useful verbs: 开会、赶截止日期、签合同 and 发草稿. 同事 is a colleague, not necessarily a friend.','截止日期 is a deadline; a meeting appointment is not automatically a deadline.',`
[会议]九点开始。~The meeting begins at nine.~收据;行李~meeting
[截止日期]是星期五。~The deadline is Friday.~打印机;钥匙~deadline
我读了[合同]。~I read the contract.~毛巾;枕头~contract
我问一下[同事]。~I will ask a colleague.~行李;桌子~colleague
我先发一份[草稿]。~I will send a draft first.~早餐;钥匙~draft
[打印机]坏了。~The printer is broken.~截止日期;会议~printer`, `
我们需要开个[会议]。~We need to hold a meeting.~枕头;收据
请在[截止日期]之前提交。~Please submit before the deadline.~打印机;早餐`),
u('Suggest a plan and invite an opinion','要不要 and ...怎么样 invite a choice. 可以 suggests a feasible option; 不如 can propose one option as preferable.','A suggestion should not silently become an order. Include room for an alternative when appropriate.',`
我们[要不要]坐火车？~I ask whether we should take the train.~必须马上;已经
去公园[怎么样]？~I invite an opinion about going to the park.~是不许的;已经结束
我们[可以]先休息一下。~I suggest that we can rest first.~从来不;已经没
[不如]试试这条路。~I suggest trying this route as a preferable option.~绝对不能;早就禁止`, `
我们坐外面[怎么样]？~I ask what the other person thinks of sitting outside.~已经结束;不准讨论
[要不要]一起吃午饭？~I invite someone to have lunch together.~必须立刻;已经吃完`),
u('Accept or decline a practical request','没问题 accepts or reassures; 当然可以 grants permission. 不好意思，我今天不方便 courteously explains unavailability.','方便 can mean available or convenient in context; it does not always refer to a physical facility.',`
你能帮忙吗？——[没问题]。~The reply agrees to help.~绝对不行;不许问
[当然可以]，你用我的手机吧。~I grant permission to use my phone.~绝对禁止;不能用
[不好意思]，我今天没空。~I courteously decline because I am busy.~太好了我答应;我已经确认
[我来吧]，你先休息。~I volunteer to do it while the other person rests.~我拒绝;谁都别做`, `
[改天吧]，我今天有事。~I suggest another day because I am busy today.~今天一定可以;永远不见
[好的]，我马上发给你。~I agree to send it immediately.~不可能;不许发`),
u('Frequency and recurring routines','通常 means usually; 偶尔 means occasionally; 从不 means never. A frequency phrase normally precedes the verb.','没去过 describes no experience of going; 从不去 describes a habitual pattern of never going.',`
我[通常]在家吃午饭。~I usually eat lunch at home.~从不;只吃过一次
她[偶尔]去看电影。~She occasionally goes to the cinema.~每天都;从不
我[从不]抽烟。~I never smoke.~总是;经常
他[几乎总是]准时到。~He almost always arrives on time.~从来不;只到过一次`, `
我们[每周一次]见面。~We meet once a week.~每小时一次;每年一次
我[经常]在家工作。~I often work from home.~从不;只做过一次`),
u('Tell the outcome and evaluate it','最后 gives an eventual outcome; 幸好 introduces a fortunate circumstance and 可惜 marks regret. 终于 often conveys reaching a long-awaited result.','最后 can simply mark sequence; 终于 typically carries a sense of effort, waiting or relief.',`
[最后]我们找到了一家餐厅。~Eventually we found a restaurant.~还没开始时;每一秒都
[幸好]司机等了我们。~Fortunately the driver waited for us.~可惜;遗憾的是
[可惜]商店已经关门了。~Unfortunately the shop had closed.~幸好;正如我们期待的好消息
我们[终于]赶上了火车。~We finally managed to catch the train.~从未;明天才`, `
[幸好]我带了伞。~Fortunately I brought an umbrella.~可惜;遗憾的是
他[终于]回信了。~He has at last replied after waiting.~一直没;明年才`)
],B1:[
u('Express purpose and intended benefit','为了 introduces a purpose; 好让 can introduce the intended benefit for another person. A purpose is a goal, not proof that the goal was achieved.','因为 gives a reason; 为了 gives an intended goal. Do not interchange them solely because English uses for.',`
我每天练习，[为了提高]发音。~I practise daily to improve pronunciation.~因为已经提高了;虽然不想提高
我把地图发给你，[好让你找到]入口。~I send the map so you can find the entrance.~因为你已经找到了;虽然你不需要找
我们早点出门，[以免堵车]。~We leave early to avoid being delayed by traffic.~因为已经到家;虽然从不出门
她说得很慢，[让大家都能听懂]。~She speaks slowly so everyone can understand.~证明所有人早就懂了;因为她拒绝说话`, `
我打电话是[为了确认]预约。~I call in order to confirm the appointment.~因为已经取消了;虽然不想确认
请把灯留着，[好让他看清]门牌。~Leave the light on so he can see the door number clearly.~因为他不需要看;证明他已经走了`),
u('Possibility and uncertainty','可能 and 也许 mark possibility. 不一定 denies certainty rather than possibility; 未必 is similar in more formal contexts.','不要 confuse 一定不, certainly not, with 不一定, not necessarily.',`
他[可能]还在办公室。~He may still be at the office.~肯定不;绝对不可能
她[不一定]有空。~She is not necessarily free.~肯定;一定
[也许]明天会下雨。~It may rain tomorrow.~绝对不会;肯定不
这个办法[未必]有效。~This approach is not necessarily effective.~必然;一定`, `
他们[可能]已经出发了。~They may already have left.~肯定没有;绝对不可能
贵的东西[不一定]更好。~Expensive things are not necessarily better.~必定;毫无例外地`),
u('Read reasons, contrasts and consequences','因此 introduces a consequence; 然而 marks contrast; 此外 adds another point. 根据 attributes a statement to a basis or source.','A connector governs the relationship between propositions, not merely the order in which they are printed.',`
桥封了，[因此]我们要绕路。~The bridge closure causes us to take a detour.~然而完全不受影响;相反
费用较高，[然而]服务更可靠。~The higher cost is contrasted with more reliable service.~因此只因为价格高;所以毫无例外
方案省时，[此外]还能减少浪费。~Reduced waste is an additional benefit.~相反;尽管完全没有好处
[由于]资料不全，会议推迟了。~Incomplete materials are the reason for postponement.~为了得到结果;尽管资料齐全`, `
路被淹了，[所以]我们过不去。~Flooding consequently prevents passage.~反而畅通无阻;与此同时毫无影响
[尽管]下着雨，我们还是出发了。~We left despite the rain.~仅仅因为;为了`),
u('Write a clear practical request','State the issue, its impact, a feasible requested action and a response time. 请问是否可以 softens a request without hiding its purpose.','A courteous opening alone is insufficient: the reader needs enough concrete detail to respond.',`
我写信是[想反映一个问题]。~I state that the message raises a problem.~确认没有任何问题;拒绝一切回复
请问[是否可以换一个房间]？~I politely ask whether a room change is possible.~为什么不许回答;为什么所有请求都已撤回
我希望[明天之前得到答复]。~I request an answer before tomorrow.~从此不再联系;取消所有反馈
[感谢您的协助]。~I close with thanks for assistance.~请不要回复;我拒绝协商`, `
能否请您[核实一下预订信息]？~I politely request verification of booking details.~删除所有记录;拒绝所有检查
如果不方便换房，[也可以安排维修]。~I offer repairs as an alternative to a room change.~就不许再联系;我已拒绝所有方案`),
u('Experience with 过 and continuing duration','Verb plus 过 can describe experience. Continuing situations can combine a duration with sentence-final 了, as in 我住在这里三年了.','Experiential 过 differs from perfective 了. A negative experience uses 没有...过, not a general 不...过 pattern.',`
我[去过]杭州。~I have been to Hangzhou.~明天去;从没去过
你[吃过]这个菜吗？~Have you ever eaten this dish?~明天吃;正在做
我[住在这里三年了]。~I have lived here for three years and still do.~明年才搬来;三年前就搬走了
她[没去过]成都。~She has never been to Chengdu.~去过很多次;明天不去`, `
我们[合作两年了]。~We have been working together for two years and still are.~两年前已经结束合作;明年才开始
你[看过]这部电影吗？~Have you seen this film before?~明天看;正在拍`),
u('Earlier events and past sequencing','已经 and 之前 can establish that one event preceded another. 到...的时候 sets a reference point. Mandarin does not need a dedicated pluperfect verb conjugation.','A past-before-past relation comes from context and sequencing, not a new verb ending.',`
我到的时候，她[已经走了]。~She had left by the time I arrived.~明天才走;正在等我
我不饿，因为[已经吃过饭了]。~I was not hungry because I had already eaten.~明天才吃;从来不吃
开会之前，我们[就发出了通知]。~We sent the notice before the meeting.~明天才发通知;会议结束后才发
后来我发现，地址[早就改了]。~I later discovered the address had changed long before.~明年才改;一直没改`, `
我找到那本[以前丢的书]了。~I found the book I had previously lost.~明天才买的书;从没丢过的书
打电话时，客人[已经到了]。~The guests had already arrived when we called.~明天才到;还没出发`),
u('Future plans and predictions','会 can mark a prediction; 打算 introduces intention and 准备 can signal a plan or preparation. Future time expressions can locate an unmarked verb in the future.','会 also expresses learned ability, as in 会游泳. Infer the function from the whole sentence.',`
明天我们[会早点出发]。~We will leave earlier tomorrow.~昨天已经出发;从未出发
我[打算]下个月搬家。~I intend to move next month.~昨天已经;从来不
天气预报说，下午[会下雨]。~The forecast predicts afternoon rain.~昨天下了雨;从来不下雨
她[准备]明年去留学。~She plans to study abroad next year.~早已完成了;从未考虑过`, `
下周我[去上海开会]。~I go to Shanghai for a meeting next week.~昨天开过会;去年就回来了
我[打算]先学会基础词汇。~I intend to learn the basic vocabulary first.~已经永远忘了;从来拒绝`),
u('Hypothetical conditions with 如果 and 就','如果...就... links a condition and result. 要是 is common in conversation. Unreal readings rely on context, modal expressions and time reference rather than subjunctive inflections.','如果 and 就 do not by themselves distinguish a real future possibility from an unreal past condition.',`
[如果]有时间，我就去。~If I have time, I will go.~因为已经;尽管肯定没有
[要是]我知道，就告诉你。~If I knew, I would tell you.~既然我已经说过;尽管我明确拒绝
如果住得近，我们[就可以走路去]。~Living nearby would let us go on foot.~早已坐飞机走了;绝对不能出门
如果你方便，[我们就明天见]。~We will meet tomorrow if it suits you.~我们昨天已经见过;我们从此不联系`, `
[如果]下雨，我们就改天去。~If it rains, we will go another day.~为了下雨;虽然从不下雨
要是有她的号码，我[就给她打电话]。~With her number, I would call her.~已经拒绝联系她;永远不会联系她`),
u('Reformulate and check understanding','也就是说 and 换句话说 introduce a restatement. 你的意思是...吗 checks an interpretation rather than claiming certainty.','Do not remove a qualification or condition when paraphrasing someone else.',`
[也就是说]，我们需要先申请。~I restate that an application is needed first.~换个完全无关的话题;正好相反
[换句话说]，这个价格不含运费。~I paraphrase that delivery is excluded.~因此与此毫无关系;不过事实完全相反
[你的意思是]今天不能交吗？~I check whether the intended meaning is that submission is impossible today.~我已经证明;禁止你再说
[如果我没理解错]，周末也开放。~I cautiously check the interpretation that it opens at weekends.~毫无疑问无须核实;不论你说什么`, `
[我这样理解对吗]：只有这一项收费？~I check whether only this item carries a charge.~我已证明一切;我拒绝了解
[简单地说]，还需要一份证明。~I summarise that one more supporting document is needed.~换个完全无关的话题;不承认任何关系`),
u('Offer alternatives and preserve choice','或者 offers alternatives; 要不 introduces a conversational suggestion. 如果不方便 leaves room for the other person’s circumstances.','否则 often means otherwise with a consequence, rather than a neutral list of options.',`
[或者]我们可以在线上谈。~I offer an online conversation as another option.~只能强制;绝不允许
[要不]先试一个月？~I suggest trying it for a month.~既然已经结束;绝对不能
[如果不方便]，我们可以改期。~I offer rescheduling if the arrangement is inconvenient.~既然一切已经完成;不管你怎么想都不许改
[另一个办法是]把工作分开做。~I suggest dividing the work as another option.~唯一的禁令是;已经证实的结果是`, `
[不如]先做个小测试。~I propose a small test as a preferable next step.~绝对禁止;已经完成
周二不行的话，[也可以周四]。~Thursday is offered as a fallback if Tuesday fails.~其他时间都不许;事情已经结束了`),
u('Idioms for support and participation','搭把手 means lend a hand; 出一份力 means contribute. 撑腰 means back someone, often against pressure, and can have positive or negative implications depending on the cause.','Use precise descriptions of responsibility in formal agreements instead of relying only on figurative language.',`
你能[搭把手]吗？~Can you lend a hand?~添点乱;泼冷水
这次活动大家都[出了一份力]。~Everyone contributed to the event.~袖手旁观;中途退出
有团队[撑腰]，她更有信心了。~The team’s backing gave her more confidence.~拆台;施压
他们在困难时[伸出了援手]。~They offered help in a difficult time.~落井下石;置之不理`, `
搬家的时候，邻居来[搭了把手]。~The neighbour helped with the move.~添了乱;泼了冷水
大家都愿意[出一份力]。~Everyone is willing to contribute.~袖手旁观;推卸责任`),
u('Idioms for realisation and sudden insight','恍然大悟 describes suddenly understanding; 茅塞顿开 emphasises a blockage in understanding being cleared. 原来如此 acknowledges a newly understood explanation.','These are established Chinese expressions, not literal translations of English images.',`
听完解释，我才[恍然大悟]。~The explanation made me suddenly understand.~毫不在意;拒绝相信
你的例子让我[茅塞顿开]。~Your example cleared up my understanding.~更加糊涂;无动于衷
[原来如此]，难怪门没开。~I now understand why the door was not open.~我早就拒绝;绝对不可能
我终于[意识到]地址写错了。~I finally realised the address was wrong.~保证过;寄出了`, `
看了第二遍，我才[恍然大悟]。~I understood suddenly on the second reading.~故意忘记;毫不关心
她终于[意识到]少了一份文件。~She finally realised a document was missing.~承诺过;删除了`)
],B2:[
u('Follow corrected travel information','不是...而是... replaces a rejected detail. 改为 gives a new arrangement. 延误 means delayed, while 取消 means cancelled.','Use the final corrected information, not the first platform or time mentioned.',`
列车不是九点开，[而是十点开]。~The corrected departure is ten.~仍然九点开;已经取消了
今天[临时停靠苏州站]。~There is an additional temporary stop at Suzhou today.~永不停靠苏州站;明年才到苏州
本次列车[延误，但没有取消]。~The service is delayed but not cancelled.~已经完全取消;已提前到达
请到[下一站]换车。~Change at the next station.~本站;上一站`, `
出发站台[改为五号]。~The new departure platform is five.~仍是三号;改为八号
到达时间[推迟到十点半]。~Arrival is postponed to ten thirty.~提前到九点;完全取消`),
u('Hear conditions within qualified support','原则上 signals broad agreement that may retain reservations. 前提是 and 只要 introduce conditions. 不过 introduces a contrast or limitation.','Conditional support is not unconditional approval; identify the condition and whether it has been met.',`
我同意，[前提是费用不超预算]。~Agreement requires keeping costs within budget.~不管费用多少;即使完全超支也没关系
[原则上]可以，不过时间还要商量。~Broad agreement is given with timing still to discuss.~无条件地;绝对不
方案不错，[但证据还不充分]。~The proposal has merit but evidence remains insufficient.~所有疑问都已解决;因此不需要核实
[只要得到书面许可]，我们就能开始。~Written permission is the condition for starting.~即使没有任何许可;等一切都结束以后`, `
我支持，[不过资金还没落实]。~Support is qualified by unresolved funding.~因为资金已经保证;所以不必再查
可以试行，[但必须保留退出机制]。~A trial is acceptable with an exit mechanism required.~而且不许退出;无需任何条件`),
u('Unreal past conditions and alternatives','要是当时...就...了 frames an unreal past alternative. 本来可以 marks a possibility that existed but was not necessarily realised. Mandarin has no subjunctive verb conjugation.','Use context to distinguish an unreal alternative from a report of what actually happened.',`
要是当时知道，我[就给你打电话了]。~Had I known then, I would have called you.~已经肯定打过了;明年才会打
要是早点出门，我们[就赶上车了]。~An earlier departure would have let us catch the service.~肯定已经赶上了;从来不想坐车
如果当时保存了文件，[就不会丢了]。~Saving the file then would have prevented the loss.~明天才会保存;已经主动删除了
没有你的帮助，我[可能早就放弃了]。~Without your help, I might have given up long before.~一定已经成功了;明天必须开始`, `
要是我读了那条消息，[就会回复了]。~Reading the message would have led me to reply.~已经确实回复了;从不允许回复
她[本来可以早点到]，但没赶上车。~She could have arrived earlier but missed the service.~已经按计划提前到了;从来没有出行的可能`),
u('Read concessions and their limits','虽然...但是... marks a concession; 即使...也... says the conclusion holds even under a hypothetical condition. 尽管 can acknowledge an actual difficulty.','Although and even if differ: an accepted fact is not the same as a hypothetical condition.',`
[虽然]样本很小，但结果仍有参考价值。~The small sample is conceded without dismissing all value.~因为只有;为了
[即使]需求下降，也需要保留储备。~The reserve remains necessary even if demand falls.~只有因为;为了让
办法可行，[但并不理想]。~The method is feasible but not ideal.~因此完美无缺;所以完全没用
[尽管]有所延误，目标仍能实现。~Delay does not make the objective unreachable.~仅仅由于;为了造成`, `
[即便]价格上涨，我们也不会立刻停用。~A price increase would not immediately lead to discontinuation.~只有因为;为了
报告有用，[但结论仍需验证]。~The report is useful with conclusions still requiring verification.~所以不必再核实;而且所有结论都已证明`),
u('Ongoing action, duration and continuing states','一直 highlights continuity; 还在 marks persistence at a reference time. 着 often describes an ongoing state, while 已经...完了 presents completion.','正在、着 and 一直 are not interchangeable progressive suffixes. Learn their actual constructions.',`
我们[一直在讨论]这个问题。~We have been discussing this issue continuously.~早就停止讨论了;从未讨论过
我到时，他[还在工作]。~He was still working when I arrived.~早就下班了;明天才开始
门[开着]。~The door is in an open state.~已经锁好了;明天才会开
她[已经写完报告了]。~She has completed the report.~还没开始写;明天才写`, `
我[已经等了二十分钟了]。~I have already been waiting for twenty minutes.~明天才会来;从没等过
墙上[挂着一幅画]。~A painting hangs on the wall as an ongoing state.~明天才会挂画;从来没有画`),
u('Mixed time references in counterfactuals','A past condition can lead to a hypothetical present result, as in 要是当时学了，现在就会了. 本来 should be interpreted with context, not as a fixed tense.','现在 locates a current result; 当时 or 昨天 locates a past one. Preserve the relation between them.',`
要是当时接受了邀请，[现在就在那儿工作了]。~Accepting the past invitation would mean working there now.~昨天肯定已离职;明年才会收到邀请
如果以前学过，[现在就能回答了]。~Earlier study would enable an answer now.~昨天肯定已回答;永远不可能回答
要是带了卡，[昨天就能付款了]。~Taking the card would have allowed payment yesterday.~明天才买卡;肯定已经付过款
没有那次延误，[我们早就到了]。~Without the delay, we would already have arrived.~我们明年才出发;我们肯定已经取消了`, `
要是之前存了钱，[现在就可以出发了]。~Past saving would let us leave now.~昨天肯定已到家;永远不能出门
要是没问，[错误可能还没被发现]。~Without asking, the error might still be undiscovered.~错误肯定已全部改正;明天才会发生错误`),
u('Weigh options and accept trade-offs','权衡利弊 means weigh advantages and disadvantages. 把...考虑进去 includes a factor; 付出代价 names a cost rather than necessarily a financial payment.','权衡 is a process of comparison, not automatic approval of either option.',`
我们需要[权衡利弊]。~We need to weigh advantages and disadvantages.~不经检查就同意;忽略一切风险
要把长期成本[考虑进去]。~Long-term costs should be taken into account.~全部隐瞒;彻底删除
这可能需要[付出额外的代价]。~This may involve an additional cost or sacrifice.~保证完全免费;消除所有风险
这个决定是[一把双刃剑]。~The decision can bring both benefits and harms.~毫无风险的保证;纯粹无用的工具`, `
先[比较两个方案的得失]，再决定。~Compare the gains and losses of both plans before deciding.~不看就同意全部条件;保证每个结果
计划中要[留出余地]。~The plan should leave room for adjustment.~排除所有调整;隐瞒所有内容`),
u('Coordinate action and put decisions into practice','落实 turns an arrangement into concrete action. 着手 initiates work; 梳理 reviews and organises details. 对齐目标 is common workplace language for aligning goals.','Beginning a procedure does not prove it has been completed or succeeded.',`
现在要把方案[落到实处]。~Now the plan must be put into concrete practice.~藏起来;彻底禁止
我们先[梳理一下进展]。~Let us review and organise the current progress.~删除所有记录;拒绝了解情况
发布前要[和团队协调]。~Coordinate with the team before release.~完全无视团队;断绝所有联系
我们已经[着手办理]了。~We have begun handling the process.~全部办完并归档;取消一切行动`, `
各部门需要[明确分工]。~Departments need clear allocation of responsibilities.~互相隐瞒;重复所有错误
先[统一对目标的理解]，再行动。~Reach a shared understanding of the goal before acting.~拒绝任何沟通;随意改变事实`),
u('Idioms for pressure and difficult positions','进退两难 describes a dilemma. 焦头烂额 describes being overwhelmed. 轻描淡写 can mean treating something briefly or understating it.','Choose wording suited to the severity and register; figurative pressure is not a diagnosis.',`
这个要求让我[进退两难]。~The request puts me in a difficult dilemma.~毫无顾虑;得心应手
最近的任务让我[焦头烂额]。~Recent tasks have left me overwhelmed.~无所事事;轻松自在
别把风险[轻描淡写]。~Do not understate the risk.~认真分析;清楚说明
越是紧急，越要[沉着冷静]。~Greater urgency calls for composure.~慌不择路;不加思考`, `
两边都有要求，我[左右为难]。~Conflicting demands leave me in a dilemma.~毫无压力;游刃有余
面对批评，她仍[沉着冷静]。~She remained composed under criticism.~勃然大怒;不知所措`),
u('Idioms for persistence and changing direction','坚持不懈 describes persistent effort. 半途而废 means abandon halfway. 停滞不前 means make no progress. 力挽狂澜 describes a forceful reversal of a grave situation.','力挽狂澜 is emphatic; it is excessive for a trivial routine change.',`
他学习时[坚持不懈]。~He persists steadily in his studies.~半途而废;敷衍了事
我们不想[半途而废]。~We do not want to give up halfway.~坚持到底;继续努力
谈判一直[停滞不前]。~The negotiations have made no progress.~进展顺利;圆满结束
关键时刻，她[力挽狂澜]。~At the critical moment she turned a grave situation around.~袖手旁观;维持原状`, `
遇到困难也要[坚持不懈]。~Persist despite difficulties.~半途而废;敷衍了事
缺少反馈，项目就会[停滞不前]。~Without feedback, the project may stall.~迅速完成;毫无阻碍`)
],C1:[
u('Write a precise formal clarification request','A formal request should identify its basis, specific uncertainty, requested action and response deadline. 烦请 softens a request; 就...作出说明 specifies the point needing explanation.','A formal tone should not obscure the practical action required. Avoid implying agreement merely because no answer has yet arrived.',`
[烦请说明]费用的计算依据。~I courteously ask for the basis of the fee calculation.~不许再解释;我已无条件同意
[关于贵方的方案]，我们有两点需要核实。~The writer formally identifies the proposal requiring checks.~与此毫无关系;在拒绝所有联系后
请明确[哪些服务包含在报价内]。~I request the exact included scope.~为什么不准提供任何信息;所有内容都已经被拒绝
建议[签约前先澄清未决事项]。~I propose resolving outstanding matters before signing.~把沉默当成全部同意;保留所有歧义不管`, `
能否请您[注明估算所涉及的时段]？~I politely request the estimate’s time scope.~拒绝所有核实;删除全部依据
烦请[于周三前回复]。~I courteously specify a Wednesday response deadline.~永远不要回复;全部结束后才回复`),
u('Read implied reservations and tactful criticism','尚有商榷余地 signals room for serious discussion or disagreement. 恐怕 softens an unwelcome judgement; 不无道理 concedes some merit without full endorsement.','Polite indirectness can carry a substantive objection. Do not treat every mild formulation as approval.',`
这个解释[尚有商榷余地]。~The explanation remains open to serious question.~已经完全证明;获得无条件赞同
这个时间表[恐怕过于乐观]。~The speaker tactfully questions the optimistic schedule.~已经保证没有风险;毫无疑问不需修改
你的意见[不无道理]。~Some merit is conceded to the opinion.~完全没有任何道理;全部内容都已证明
这个结果[需要谨慎看待]。~The result should be treated cautiously.~必须无条件接受;必然完全错误`, `
报告[仍留下若干疑问]。~The report leaves unresolved questions.~已经解决一切问题;不允许任何质疑
至少，这[是个可以讨论的起点]。~Some value as a starting point is acknowledged.~已是唯一最终答案;毫无任何价值`),
u('Distinguish association, causation and scope','相关 describes association; 导致 attributes causation. 在...范围内 limits scope; 尚不能据此断定 prevents a finding from being overstated.','Two variables changing together does not itself establish a causal relationship.',`
下降趋势[与价格上涨相关]。~The decline is associated with a price increase.~单独证明了唯一原因;排除了任何联系
延误[由服务器故障导致]。~The server failure is identified as the cause of the delay.~只是无关的同时发生;与服务器毫无关系
这些数据[提示可能存在联系]。~The data suggest a possible association.~证明了所有原因;否定了一切关系
[尚不能据此断定]政策产生了该效果。~The finding does not yet justify attributing the effect to policy.~已经毫无疑问证明;永远不可能出现`, `
研究设计[不支持因果推断]。~The study design does not support causal inference.~证明了唯一原因;取代了所有核查
结论仅适用于[本次样本所涵盖的范围]。~The conclusion is limited to the sample’s covered scope.~一切可能情况;所有未来地区`),
u('Synthesize evidence into a proportionate recommendation','一方面...另一方面... balances considerations. 综合来看 links a recommendation to preceding evidence. Name limitations and propose a proportionate next evaluation step.','A synthesis explains how findings and limits affect the conclusion rather than simply listing claims.',`
[一方面]成本下降，另一方面核查工作增加。~The synthesis balances lower costs against more verification.~毫无任何矛盾地;只有一个方面
[综合来看]，建议先开展小规模试点。~The recommendation follows from the overall analysis.~完全不看证据;无视全部结论
结果支持[逐步试行]。~The findings support gradual testing.~保证每次都成功;取消全部观察
效益值得期待，[但推广性仍不确定]。~Potential benefit is acknowledged with uncertain generalisability.~所以所有问题都已解决;因此任何场景都保证有效`, `
只有[独立核查确认结果后]，才建议扩大规模。~Expansion is conditional on independent confirmation.~完全不看核查结果;所有证据被推翻后
[权衡风险后]，试点阶段仍属合理。~Considering risks, a pilot remains defensible.~因为保证毫无风险;故意无视所有风险`),
u('Infer past events and attribute unconfirmed reports','想必 and 看来 can signal inference; 据称 attributes an unconfirmed claim. 不可能...过 can reject an alleged past occurrence. The verb itself does not acquire an inferential tense.','Attribution, inference and independently established fact have different evidential force.',`
灯灭了，她[想必已经走了]。~The speaker infers she has already left.~明天才打算走;永远不许走
[据称]，他已经读过报告。~It is claimed, without endorsement as fact, that he read the report.~已经无可争议地证实;按照绝对定义
时间过去这么久，她[应该已经收到消息了]。~The speaker infers she has probably received the message by now.~明年才会收到;从来不许读
他没有钥匙，[不可能自己进去过]。~The speaker rules out his having entered by himself without a key.~明天必须进去;准备买一把新钥匙`, `
路是湿的，[看来刚下过雨]。~The wet road supports an inference of recent rain.~明天肯定才下雨;从来没有下雨
[据未经证实的消息]，公司已撤回报价。~The withdrawal is attributed to an unverified report.~经最终证明毫无疑问;按照永远不变的定义`),
u('Regret and unreal past wishes','早知道...就...了 expresses regret about an unreal past alternative. 本应该 identifies a missed desirable or required action. 要是当时...就好了 expresses a wish about the past.','早知道 in this construction does not report that the person actually knew in advance.',`
[早知道我就问清楚了]。~I regret not having clarified it earlier.~我确实已经问清楚;我明天才会第一次问
我[本应该认真对待警告]。~I should have taken the warning seriously.~已经确实认真对待了;从来不需要留意
要是当时[多留一会儿就好了]。~I wish I had stayed a little longer then.~已经确实多留了;明天才会到
我们[本应该遵守截止日期]。~We should have observed the deadline.~已经毫无疑问按时完成;明年才会设定日期`, `
[早知道就听你的建议了]。~I regret not having followed your advice.~我确实已照做;我永远不会听
要是当时[先检查地址就好了]。~I wish I had checked the address first.~肯定已经检查过;明天必然才收到地址`),
u('Calibrate certainty and identify sources','根据现有资料 limits a claim to available material; 据...介绍 attributes it. 合理但尚未证实 separates plausibility from proof.','An official or named source can still require scrutiny; attribution is not a guarantee of truth.',`
[根据现有资料]，未发现其他损失。~The statement is limited to current available material.~保证永远没有损失;完全不看任何资料
[据主管部门介绍]，工程六月开工。~The department is the attributed source of the June start.~在没有任何来源的情况下;与所有公告完全相反
这个解释[合理但尚未证实]。~The explanation is plausible but unproven.~已被彻底推翻;已经毫无疑问证明
这种联系[目前尚无充分证据支持]。~The association currently lacks sufficient supporting evidence.~已被最终证明;永远不可能存在`, `
[从目前的迹象看]，程序已有变化。~Available signs support an inference of procedural change.~按照永远不变的法则;没有任何依据地
报告[未能证明增幅显著]。~The report did not establish a significant increase.~已经证明每次都大幅增加;保证了未来所有增长`),
u('Qualify scope and preserve negation','未必 and 不见得 deny necessity. 仅在...条件下 limits applicability. 以...为前提 makes a claim conditional.','不能排除 means cannot rule out; it does not mean proven. Preserve both negation and scope.',`
数据更多[未必意味着偏差更小]。~More data do not necessarily mean less bias.~必然保证没有偏差;每次都完全正确
这个比较[只有有限的参考价值]。~The comparison has limited interpretive value.~在任何场景都绝对有效;已经证明了一切
承诺[以获得批准为前提]。~The commitment depends on approval.~即使被否决也无条件有效;完全不需要批准
结果[不能直接推广到所有人群]。~The result cannot simply be generalised to every population.~在每个人身上都保证有效;没有任何意义`, `
假设[仅在严格条件下成立]。~The assumption holds only under strict conditions.~在一切情况下都成立;无须任何限制
建议[在这一点上]是合理的。~The recommendation is reasonable in the specified respect.~在任何方面都必然;在任何情况下都不`),
u('Understatement, euphemism and tactful criticism','不太理想 and 还有提升空间 can express criticism mildly. 恐怕站不住脚 questions the support for an argument.','Understatement requires context. Use explicit direct wording for instructions where misunderstanding would matter.',`
这个安排[不太理想]。~The arrangement is less than satisfactory.~完美无缺;已经无条件通过
论证[还有提升空间]。~The argument could be improved.~已经无可改进;不准再完善
这个推论[恐怕站不住脚]。~The inference appears insufficiently justified.~已经得到最终证明;只是一个普通数字
回答[还可以更周全一些]。~The response is tactfully criticised as incomplete.~已经彻底完整;不需要再补充`, `
时间表[未免过于乐观]。~The schedule is criticised as excessively optimistic.~保证绝无风险;完全没有目标
这个评论[帮助恐怕有限]。~The speaker mildly questions the comment’s usefulness.~已经提供了最大帮助;证明了所有结论`),
u('Match register to relationship and purpose','劳驾 and 烦请 are courteous but differ in setting and tone. 您 is respectful; 你 is ordinary singular address. Formal written requests should remain clear and natural.','Respectful wording is not achieved by mechanically replacing every 你 with 您; adjust the whole sentence.',`
[烦请将相关文件发送给我们]。~A courteous formal request for relevant documents.~不许发送任何文件;文件完全无关
[你有空把文件发我一下吧]。~A familiar request to send the file when available.~严禁发送该文件;文件已经撤销
[如有变动，请及时告知]。~A professional request for notice of changes.~任何变化都不许说;所有内容都应不看就确认
[能帮我看一眼吗]？~A conversational request for a quick check.~不得核实任何内容;已经拒绝所有帮助`, `
[盼您尽早回复]。~A courteous written request for a prompt reply.~请永远不要回复;任何回复都已无用
[有变化跟我说一声]。~A familiar request to be informed of changes.~不管发生什么都别说;所有变化都已经取消`),
u('Idioms and chengyu: decisions and spontaneous speech','脱口而出 means blurt out or say without thinking; 即兴发挥 means improvise. 拍板 means make the final decision. 凭印象 means relying on recollection rather than checking.','脱口而出 can suggest insufficient reflection; it is not a neutral equivalent of every spontaneous presentation.',`
她没有准备，完全[即兴发挥]。~She improvised without preparation.~照稿逐字朗读;背诵事先排练的内容
这个数字我只能[凭印象说]。~I can give the figure only from recollection.~照着表格念;依据刚核实的记录
最后由经理[拍板]。~The manager makes the final decision.~毫无权力地旁观;放弃所有发言权
他想都没想就[脱口而出]。~He blurted it out without thinking.~默读了很久;照着稿子背诵
事情解决后，我总算[松了一口气]。~Resolution lets me finally feel relieved.~更加焦虑;承担全部新责任`, `
没准备也能[即兴发挥]，很不容易。~Improvising without preparation is difficult.~逐字读稿;背诵排练的台词
这件事由谁[拍板]？~Who makes the final decision?~完全不参与;遗失了文件`),
u('Chengyu and proverbs: reversals and concealed problems','扭转乾坤 is an emphatic reversal of a difficult situation. 掩耳盗铃 describes self-deceiving concealment; 纸包不住火 says the truth cannot remain hidden. 本末倒置 means reversing priorities.','Proverbs and chengyu have conventional meanings and register. Do not treat each four-character phrase as an interchangeable business slogan.',`
关键证据帮助他们[扭转了局面]。~The key evidence helped reverse the situation.~维持了原样;阻止了一切改变
无视投诉无异于[掩耳盗铃]。~Ignoring complaints is criticised as self-deceiving concealment.~坦诚面对;公开调查
[纸包不住火]，真相迟早会出来。~The truth cannot remain concealed forever.~真相可以永远隐瞒;没有必要说明事实
只重包装不重质量，是[本末倒置]。~Prioritising packaging over quality reverses proper priorities.~抓住了根本;解决了核心问题
这番变化让我[大开眼界]。~The changes greatly broadened my perspective.~毫无感受;闭目不看`, `
想靠删记录掩盖错误，实在是[掩耳盗铃]。~Deleting records to conceal errors is self-deceiving.~公开调查;坦诚交代
别忘了，[纸包不住火]。~Remember that the truth cannot stay hidden.~所有秘密永远安全;一切事实都不重要`)
]};
