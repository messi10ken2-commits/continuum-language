import {varietyCourses} from './premium-varieties.mjs';
import {academicCourses} from './premium-academic.mjs';
import {expandedPremiumCourses} from './premium-expansion.mjs';
import {premiumVideoCourses} from './premium-video-lessons.mjs';
// Server-only authored courses: answer keys are never bundled into the client.
const q=(prompt,context,options,answer,note)=>({prompt,context,options,answer,note});
export const premiumCourses=[
 {id:'en-workplace-diplomacy',language:'en',title:'Workplace diplomacy',description:'Practise tactful disagreement, clarification and boundaries.',examples:['I see your point. Could we also consider the longer-term cost?','I can take this on if we move the other deadline.'],questions:[
 q('Choose a tactful disagreement.','A colleague proposes launching tomorrow, but testing is unfinished.',['That makes sense, though I would be more comfortable after testing.','Your idea is obviously terrible.','Testing was finished yesterday.'],0,'The correct reply acknowledges the proposal before raising a specific concern.'),
 q('Choose the clearest request.','You do not know whether “Friday” means this week or next week.',['Could you clarify which Friday you mean?','Why are you always unclear?','Friday is a weekday.'],0,'Ask directly for the missing information without criticising the speaker.'),
 q('Choose a realistic boundary.','You can do the new task, but only if another deadline changes.',['I will do everything immediately.','I can take this on if we move the other deadline.','I refuse to work.'],1,'A conditional offer makes the constraint clear and leaves room to agree a plan.'),
 q('Choose the intended meaning.','Let’s not get carried away; the pilot involved only ten people.',['The pilot proves it works everywhere.','The speaker rejects all research.','The speaker wants more cautious conclusions.'],2,'The speaker warns against enthusiasm that goes beyond the available evidence.'),
 q('Choose an appropriate follow-up.','Your manager says “We should revisit the scope.”',['Which parts would you like us to reconsider?','I have visited the office.','We must stop every project.'],0,'Revisit means reconsider here; ask which part of the scope needs review.'),
 q('Choose a useful response.','A colleague says they are spread too thin.',['Could we decide which tasks to prioritise?','You should eat more.','Please speak more quietly.'],0,'Spread too thin refers to divided time or effort, so prioritising addresses the problem.') ]},
 {id:'pt-everyday-negotiation',language:'pt',title:'Everyday negotiation in Portuguese',description:'Make practical requests and clarify plans in Brazilian Portuguese.',examples:['Será que dá para remarcar para amanhã?','Não vou dar conta de tudo hoje.'],questions:[
 q('Choose the most useful reply.','Você não pode ir à reunião hoje.',['Será que dá para remarcar para amanhã?','A reunião já é uma fruta.','Eu nunca ouvi amanhã.'],0,'Será que dá para… makes a natural request. Remarcar means reschedule.'),
 q('Choose the intended meaning.','Não vou dar conta de tudo hoje.',['I cannot manage everything today.','I will open a bank account.','Everything happened yesterday.'],0,'Dar conta de means manage or cope with, not open an account.'),
 q('Choose the clearest request.','Você quer confirmar o preço antes de comprar.',['Quanto fica no total, com a entrega?','Quando você nasceu?','A entrega tem muitas cores.'],0,'Quanto fica no total asks for the final amount, including delivery here.'),
 q('Choose the most useful reply.','Seu amigo sugere um restaurante, mas você não come carne.',['Podemos escolher um lugar com opções vegetarianas?','Eu comi a rua.','O restaurante era amanhã.'],0,'State a practical alternative that respects your dietary needs.'),
 q('Choose the intended meaning.','A gente acabou pedindo comida.',['We ended up ordering food.','We are forbidden to order food.','We always cook at home.'],0,'Acabar + gerund expresses the eventual outcome. Acabou de pedir would mean has just ordered.'),
 q('Choose the most useful reply.','Você não ouviu o endereço direito.',['Pode repetir o nome da rua, por favor?','Pode mudar o meu nome?','Já ouvi todos os países.'],0,'Ask for the specific missing detail: the street name.') ]},
 {id:'es-natural-social-plans',language:'es',title:'Natural social plans in Spanish',description:'Clarify arrangements and use everyday expressions in context.',examples:['Me viene mejor el sábado.','¿Quedamos a las seis en la entrada?'],questions:[
 q('Choose the most useful reply.','No puedes quedar el viernes, pero sí el sábado.',['Me viene mejor el sábado. ¿Te va bien?','Viernes tiene siete colores.','Ya no existen los sábados.'],0,'Me viene mejor expresses that one option is more convenient.'),
 q('Choose the intended meaning.','Al final nos quedamos en casa.',['We ended up staying at home.','We arrived at the end of the house.','We are looking for a house.'],0,'Al final introduces the actual outcome of the plans.'),
 q('Choose the clearest request.','Sabes la hora, pero no el punto de encuentro.',['¿Dónde quedamos exactamente?','¿Cuántos años tienes?','¿Por qué existe el tiempo?'],0,'Ask for the precise meeting place, rather than repeating information you know.'),
 q('Choose the most useful reply.','Un amigo dice: “Estoy hasta arriba de trabajo”.',['Lo entiendo. Podemos dejarlo para otro día.','¿Trabajas en el techo?','Tienes que hablar más alto.'],0,'Estar hasta arriba de trabajo means being very busy with work, not being physically high up.'),
 q('Choose an appropriate follow-up.','Tu amiga propone salir, pero aún no ha dicho la hora.',['¿A qué hora te vendría bien?','¿Cuánto mide la hora?','¿Ya se terminó el año?'],0,'Te vendría bien asks politely which time would suit the person.'),
 q('Choose the intended meaning.','No me apetece salir hoy.',['I do not feel like going out today.','I am unable to leave the country.','I went out yesterday.'],0,'No me apetece expresses a current preference or lack of desire.') ]},
 {id:'ja-considerate-requests',language:'ja',title:'Considerate requests in Japanese',description:'Make requests and manage plans without losing clarity.',examples:['すみません、もう少しゆっくり話していただけますか。','今日は難しいので、明日でもいいですか。'],questions:[
 q('Choose the most useful reply.','相手の話すスピードが速くて、聞き取れません。',['もう少しゆっくり話していただけますか。','もう話しました。','私は速い電車です。'],0,'Make a specific polite request to slow down.'),
 q('Choose the most useful reply.','友達から誘われましたが、今日は予定があります。',['今日は予定があるんだ。また今度でもいい？','今日は昨日です。','予定を食べました。'],0,'Give a brief reason and offer another opportunity. This is a casual reply to a friend.'),
 q('Choose the intended meaning.','ちょっと確認してもいいですか。',['May I check something?','I have confirmed everything.','Do not check anything.'],0,'てもいいですか asks permission. ちょっと softens the request here.'),
 q('Choose the clearest request.','駅で会いますが、出口がわかりません。',['どの出口で待ち合わせますか。','出口は何歳ですか。','駅を飲みますか。'],0,'Ask which exit, the specific information needed to find the meeting point.'),
 q('Choose the most useful reply.','仕事を頼まれましたが、今日中には終わりません。',['明日の午前中まででもよろしいでしょうか。','全部終わりました。','今日は仕事ではありませんでした。'],0,'Propose a concrete feasible deadline rather than falsely saying the work is finished.'),
 q('Choose the intended meaning.','手が回らなくて、まだ返信できていません。',['I have been too busy to reply yet.','My hands cannot rotate.','I have already replied to everyone.'],0,'手が回らない refers to not having enough time or capacity to deal with something.') ]}
];
// Plausible alternatives test the communicative goal rather than spotting nonsense.
const distractors={
 en:[['I see your point. Could we finish testing before we launch?','I agree we should launch tomorrow and test afterwards.','The launch went well once we had completed testing.'],['Could we decide which tasks to prioritise?','Could we add another task before deciding our priorities?','Could you finish everything today without changing the plan?']],
 pt:[['Será que dá para remarcar para amanhã?','Vou confirmar minha presença na reunião de hoje.','Será que dá para começar a reunião de hoje mais cedo?'],['Pode repetir o nome da rua, por favor?','Pode confirmar a hora da reunião, por favor?','Pode me dizer o valor total, por favor?']],
 es:[['Me viene mejor el sábado. ¿Te va bien?','El viernes me va bien. ¿Quedamos entonces?','Este sábado no puedo. ¿Lo dejamos para el viernes?'],['I do not feel like going out today.','I cannot go out because I have another appointment.','I would rather go out than stay at home today.']],
 ja:[['もう少しゆっくり話していただけますか。','もう少し詳しく書いていただけますか。','もう少し大きな声で話していただけますか。'],['I have been too busy to reply yet.','I have decided not to reply to this message.','I replied, but the other person has not answered yet.']]
};
for(const c of premiumCourses){c.questions[0].options=distractors[c.language][0];c.questions[0].answer=0;c.questions[5].options=distractors[c.language][1];c.questions[5].answer=0;}
// Vary answer positions without changing authored meanings.
for(const course of premiumCourses)course.questions=course.questions.map((item,i)=>{const offset=i%item.options.length;return {...item,options:[...item.options.slice(offset),...item.options.slice(0,offset)],answer:(item.answer-offset+item.options.length)%item.options.length}});


// Mix recognition with production. Existing question IDs/order retain saved score compatibility.
for(const course of premiumCourses){
 const sample=course.examples[0];
 course.questions[1]={type:'typing',prompt:'Type the sentence you hear.',context:'',audio:sample,answer:sample,note:'Compare the words and word order with the recording.'};
 const sentence=course.examples[1];
 course.questions[2]={type:'reorder',prompt:'Put the words in order to make a practical response.',context:'',separator:course.language==='ja'?'':' ',tokens:(course.language==='ja'?sentence.split(/(?<=、)/).filter(Boolean):sentence.match(/\S+/g)).reverse(),answer:sentence,note:'This order makes the request or response clear and natural.'};
 const words=sample.match(/\S+/g),last=words.pop();
 course.questions[4]={type:'cloze',prompt:'Complete the missing word in this practical expression.',context:words.join(' ')+' ____',answer:last,note:'Use the complete expression from this lesson in context.'};
 course.questions[3]={...course.questions[3],type:'listening',audio:course.questions[3].context,context:''};
}
export function validCourseAnswer(q,a){return q.type==='typing'||q.type==='cloze'||q.type==='reorder'?typeof a==='string'&&a.trim().length>0&&a.length<=1500:Number.isInteger(a)&&!!q.options[a];}
const normalized=value=>value.normalize('NFKC').toLocaleLowerCase().replace(/[.,!?。、「」！？]/g,'').replace(/\s+/g,' ').trim();
export function gradeCourseAnswer(q,a){return typeof q.answer==='string'?typeof a==='string'&&[q.answer,...(q.acceptedAnswers||[])].some(expected=>normalized(a)===normalized(expected)):a===q.answer;}
export const courseAnswerText=q=>typeof q.answer==='string'?q.answer:q.options[q.answer];

premiumCourses.push(...expandedPremiumCourses,...premiumVideoCourses,...varietyCourses,...academicCourses);
export const premiumCourseSummary=premiumCourses.map(({id,language,title,description,level,scene,questions})=>({id,language,title,description,level,scene,questions:questions.length}));
