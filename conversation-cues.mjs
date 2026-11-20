// Only reviewed source sections may become a listening question's seek target.
export function formatVideoTime(seconds){
 if(!Number.isFinite(seconds)||seconds<0)return '';
 const n=Math.floor(seconds);return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`;
}
export function reviewedVideoCue(question){
 const cue=question?.videoCue;
 if(question?.languagePractice||!cue?.evidence||!Number.isInteger(cue.start)||!Number.isInteger(cue.end)||cue.start<0||cue.end<=cue.start)return null;
 return cue;
}
// Section starts are the chapters returned by the official YouTube watch page.
// Content was checked against the publisher's English transcript. These are
// section-level listening windows, not invented word-level occurrence times.
const evidence='YouTube chapter boundaries for R1vskiVDwl4, checked 2026-10-08; content checked against TED official English transcript (talk 2435).';
const items=[
 [0,90,'Conversation and polarisation','In this opening section, what relationship does the speaker draw between polarisation and listening?',['Greater division makes people less willing to hear other perspectives.','Greater division proves that everyone has become a better listener.','Listening is unnecessary whenever people share an opinion.'],0,'She connects increasing division and reluctance to compromise with a failure to listen.'],
 [90,178,'Conversational competence','How does the example about a school communication project function in the argument?',['It proves that screens should never be used in schools.','It supports the claim that sustained face-to-face conversation is an overlooked skill.','It shows that memorising notes guarantees a successful conversation.'],1,'The school example illustrates a neglected communication skill; it does not establish a universal ban on technology.'],
 [178,290,'Presence in conversation','What does the speaker mean by being present in a conversation?',['Preparing your next argument while the other person speaks.','Only putting your phone down, regardless of your thoughts.','Giving your attention to the current exchange rather than mentally being elsewhere.'],2,'Her advice extends beyond putting objects down: it includes mental attention.'],
 [290,362,'Learning from others','What attitude does the speaker recommend bringing to a conversation?',['Assume that the other person can teach you something.','Assume that your own opinion needs no examination.','Treat predictable disagreement as a reason to stop listening.'],0,'She recommends openness to learning and setting aside personal opinions while listening.'],
 [362,445,'Questions and flow','Why does the speaker favour open questions over suggesting a strong emotion in the question?',['Open questions prevent the other person from describing their feelings.','They let the other person describe the experience in their own terms.','They guarantee that every answer will be short.'],1,'A question that names a strong emotion can steer the answer; an open question leaves room for the speaker’s description.'],
 [445,527,'Experience and repetition','Why does the speaker warn against immediately comparing another person’s experience with your own?',['All experiences are interchangeable.','A conversation should always promote your achievements.','It can shift the focus away from the other person and overlook the individuality of their experience.'],2,'The warning is about making the exchange about yourself instead of attending to the other person’s experience.'],
 [527,554,'Relevant detail','What is the point of the advice about excessive detail in this section?',['Prioritise connection and relevant meaning over struggling to recall every date and name.','Never provide any specific information in a conversation.','Exact dates are the only information that matters to a listener.'],0,'The speaker contrasts peripheral details with learning about the person and what you share.'],
 [554,650,'Listening and attention','What explanation does the speaker offer for distraction while listening?',['Human beings cannot process spoken language at all.','Our ability to process language faster than someone speaks leaves room for the mind to wander.','Distraction proves that the speaker has nothing worth saying.'],1,'She links distraction to the gap between speaking and listening speeds, while emphasising that attention takes effort.']
];
export const timedTedQuestions=items.map(([start,end,label,prompt,options,answer,note])=>({prompt,options,answer,note,video:true,videoCue:{start,end,label,evidence,precision:'section'}}));

const voaEvidence='Official VOA MP4 used by this lesson; on-screen dialogue and teaching captions reviewed at 5-second intervals, 2026-10-08. Windows include the relevant turn; they are not word-level timings.';
export const voaQuestionCues={
 welcome:[
  [103,182,'Pete’s introduction and welcome'],[103,128,'Checking the name'],[167,177,'The street address'],[167,182,'Arrival at the apartment'],[82,104,'First-meeting greeting'],[60,83,'Introducing yourself'],[103,119,'Checking the spelling'],[30,40,'Confirming a name']
 ],
 neighbours:[
  [23,35,'Where Anna is from'],[53,73,'Names and apartments'],[53,73,'Names and apartments'],[58,70,'The roommate'],[98,109,'Calling Marsha'],[65,74,'Pete’s apartment'],[23,35,'Asking about origin'],[98,109,'The message for Marsha']
 ]
};
export function voaCue(key,index){
 const [start,end,label]=voaQuestionCues[key][index];return {start,end,label,evidence:voaEvidence,precision:'section'};
}
