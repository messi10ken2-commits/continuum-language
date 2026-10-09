import {videoComprehension} from './video-comprehension.mjs';
// The questions and listening guide refer only to the source recording.
const definitions=[
  {
    "id": "es-conversation-v1-introductions",
    "chapter": "es-conversation-v1-introductions-chapter",
    "level": "A1",
    "language": "es",
    "locale": "es-ES",
    "title": "Introduce yourself in Spanish",
    "minutes": 15,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "JsGQizTuPSo",
      "poster": "/lesson-media/city.jpg",
      "alt": "Illustrative scene for conversation practice",
      "source": "https://www.youtube.com/watch?v=JsGQizTuPSo",
      "credit": "Easy Spanish"
    }
  },
  {
    "id": "pt-conversation-v1-introductions",
    "chapter": "pt-conversation-v1-introductions-chapter",
    "level": "A1",
    "language": "pt",
    "locale": "pt-BR",
    "title": "Introduce yourself in Brazilian Portuguese",
    "minutes": 15,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "3ggDuePqcAo",
      "poster": "/lesson-media/cafe.jpg",
      "alt": "Illustrative scene for conversation practice",
      "source": "https://www.youtube.com/watch?v=3ggDuePqcAo",
      "credit": "Easy Languages · Brazilian Portuguese"
    }
  },
  {
    "id": "ja-conversation-v1-slow-conversation",
    "chapter": "ja-conversation-v1-slow-conversation-chapter",
    "level": "A1",
    "language": "ja",
    "locale": "ja-JP",
    "title": "Follow a slow Japanese conversation",
    "minutes": 15,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "hySkqIAFRCs",
      "poster": "/lesson-media/japan.jpg",
      "alt": "Illustrative scene for conversation practice",
      "source": "https://www.youtube.com/watch?v=hySkqIAFRCs",
      "credit": "Japanese with Shun"
    }
  }
];
const guide=['Read the question, then listen to its indicated section.','Replay to identify what the speakers actually say and why.','Choose the answer supported by the recording, then review the explanation.'];
export const multilingualConversationLessons=definitions.map(d=>({...d,specialist:true,curriculumVersion:2,exerciseVersion:'v3-video-20261009',skill:'Listening',explanation:'Understand the speakers’ statements, experiences and reasons in this recording.',example:d.conversation.youtubeId==='HvcSqYQYGOs'?'This short check covers the introduction only (0:14–1:05), where the available captions establish the topic and purpose. The rest of the conversation is optional.':d.conversation.youtubeId==='ewP08J78Y9U'?'These questions follow the episode’s discussion of personal goals. Its official transcript is linked with each question; exact YouTube timings are still being checked.':'Every question is based on this video. Read its time window and replay that section; watching the entire video is optional.',exampleLang:'en-US',conversation:{...d.conversation,watchTasks:guide,levelNote:d.level+' is the target level for the Continuum tasks, not an official rating of this video. Use replay and captions when available.',hint:'Answer from what you hear in the recording. Questions paraphrase the content; they are not verbatim quotations.'},questions:videoComprehension(d.conversation.youtubeId)}));
export const multilingualConversationChapters=multilingualConversationLessons.map(d=>({id:d.chapter,level:d.level,language:d.language,locale:d.locale,specialist:true,curriculumVersion:2,title:d.title,goal:d.explanation,kind:'Real conversations'}));
