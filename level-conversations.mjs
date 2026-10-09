import {videoComprehension} from './video-comprehension.mjs';
// The questions and listening guide refer only to the source recording.
const definitions=[
  {
    "id": "es-conversation-v2-a2-morning",
    "chapter": "es-conversation-v2-a2-morning-chapter",
    "level": "A2",
    "language": "es",
    "locale": "es-ES",
    "title": "Follow a morning routine",
    "minutes": 15,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "obRbyVMIQLo",
      "poster": "/lesson-media/home.jpg",
      "alt": "Illustrative home scene for follow a morning routine",
      "source": "https://www.youtube.com/watch?v=obRbyVMIQLo",
      "credit": "Easy Spanish",
      "sourceTitle": "Pau's Morning Routine in Slow Spanish | Super Easy Spanish 108"
    }
  },
  {
    "id": "es-conversation-v2-b1-compliments",
    "chapter": "es-conversation-v2-b1-compliments-chapter",
    "level": "B1",
    "language": "es",
    "locale": "es-ES",
    "title": "Respond to a compliment",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "J8Bh7D7YXAc",
      "poster": "/lesson-media/city.jpg",
      "alt": "Illustrative city scene for respond to a compliment",
      "source": "https://www.youtube.com/watch?v=J8Bh7D7YXAc",
      "credit": "Easy Spanish",
      "sourceTitle": "Can a Compliment Change Your Day? (Intermediate Spanish Interviews)"
    }
  },
  {
    "id": "es-conversation-v2-b2-technology",
    "chapter": "es-conversation-v2-b2-technology-chapter",
    "level": "B2",
    "language": "es",
    "locale": "es-ES",
    "title": "Discuss how technology may change us",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "x21yJNitBBo",
      "poster": "/lesson-media/work.jpg",
      "alt": "Illustrative work scene for discuss how technology may change us",
      "source": "https://www.youtube.com/watch?v=x21yJNitBBo",
      "credit": "Easy Spanish",
      "sourceTitle": "How Will Technology Change Us? | Easy Spanish 278"
    }
  },
  {
    "id": "es-conversation-v2-c1-travel-motives",
    "chapter": "es-conversation-v2-c1-travel-motives-chapter",
    "level": "C1",
    "language": "es",
    "locale": "es-ES",
    "title": "Explore the motives behind travel",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "QMI9YegGels",
      "poster": "/lesson-media/travel.jpg",
      "alt": "Illustrative travel scene for explore the motives behind travel",
      "source": "https://www.youtube.com/watch?v=QMI9YegGels",
      "credit": "Easy Spanish",
      "sourceTitle": "Why Do You Travel? | Easy Spanish Podcast 200"
    }
  },
  {
    "id": "pt-conversation-v2-a2-morning",
    "chapter": "pt-conversation-v2-a2-morning-chapter",
    "level": "A2",
    "language": "pt",
    "locale": "pt-BR",
    "title": "Describe a morning in Portuguese",
    "minutes": 15,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "eHK8xPphBUg",
      "poster": "/lesson-media/home.jpg",
      "alt": "Illustrative home scene for describe a morning in portuguese",
      "source": "https://www.youtube.com/watch?v=eHK8xPphBUg",
      "credit": "Easy Portuguese",
      "sourceTitle": "Morning Routine in Slow Portuguese | Super Easy Portuguese 31"
    }
  },
  {
    "id": "pt-conversation-v2-b1-future",
    "chapter": "pt-conversation-v2-b1-future-chapter",
    "level": "B1",
    "language": "pt",
    "locale": "pt-BR",
    "title": "Talk about plans and uncertain futures",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "5130DLr_AkI",
      "poster": "/lesson-media/work.jpg",
      "alt": "Illustrative work scene for talk about plans and uncertain futures",
      "source": "https://www.youtube.com/watch?v=5130DLr_AkI",
      "credit": "Easy Portuguese",
      "sourceTitle": "How Brazilians Really Talk About the Future (B1)"
    }
  },
  {
    "id": "pt-conversation-v2-b2-reflections",
    "chapter": "pt-conversation-v2-b2-reflections-chapter",
    "level": "B2",
    "language": "pt",
    "locale": "pt-BR",
    "title": "Reflect on change and expectations",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "BWku_bXZjws",
      "poster": "/lesson-media/city.jpg",
      "alt": "Illustrative city scene for reflect on change and expectations",
      "source": "https://www.youtube.com/watch?v=BWku_bXZjws",
      "credit": "Easy Portuguese",
      "sourceTitle": "Brazilians Talk About Their 2024 and Expectations for the Year 2025 | Easy Portuguese 136"
    }
  },
  {
    "id": "pt-conversation-v2-c1-goals-values",
    "chapter": "pt-conversation-v2-c1-goals-values-chapter",
    "level": "C1",
    "language": "pt",
    "locale": "pt-BR",
    "title": "Evaluate goals, values and personal growth",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "ewP08J78Y9U",
      "poster": "/lesson-media/nature.jpg",
      "alt": "Illustrative nature scene for evaluate goals, values and personal growth",
      "source": "https://www.youtube.com/watch?v=ewP08J78Y9U",
      "credit": "Alexia & Foster, Carioca Connection",
      "sourceTitle": "Brazilian Blueprint for 2025 with Carioca Connection (Part 1)"
    }
  },
  {
    "id": "ja-conversation-v2-a2-everyday-talk",
    "chapter": "ja-conversation-v2-a2-everyday-talk-chapter",
    "level": "A2",
    "language": "ja",
    "locale": "ja-JP",
    "title": "Follow everyday Japanese exchanges",
    "minutes": 15,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "u8Z2Ec5y_9o",
      "poster": "/lesson-media/cafe.jpg",
      "alt": "Illustrative cafe scene for follow everyday japanese exchanges",
      "source": "https://www.youtube.com/watch?v=u8Z2Ec5y_9o",
      "credit": "Japanese with Shun",
      "sourceTitle": "【N5-N3】Easy Japanese Conversation with Miku Real Japanese (Miku)"
    }
  },
  {
    "id": "ja-conversation-v2-b1-travel",
    "chapter": "ja-conversation-v2-b1-travel-chapter",
    "level": "B1",
    "language": "ja",
    "locale": "ja-JP",
    "title": "Exchange travel experiences in Japanese",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "iBP4WWfcoyY",
      "poster": "/lesson-media/japan.jpg",
      "alt": "Illustrative japan scene for exchange travel experiences in japanese",
      "source": "https://www.youtube.com/watch?v=iBP4WWfcoyY",
      "credit": "Japanese with Shun",
      "sourceTitle": "【N5-N3】Japanese conversation with Sayuri Saying - Traveling in Japan / Japanese podcast for beginner"
    }
  },
  {
    "id": "ja-conversation-v2-b2-moving",
    "chapter": "ja-conversation-v2-b2-moving-chapter",
    "level": "B2",
    "language": "ja",
    "locale": "ja-JP",
    "title": "Weigh up a move",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "gnOOLxtSPLs",
      "poster": "/lesson-media/home.jpg",
      "alt": "Illustrative home scene for weigh up a move",
      "source": "https://www.youtube.com/watch?v=gnOOLxtSPLs",
      "credit": "Japanese with Shun",
      "sourceTitle": "【N3-N2】30Mins Intermediate Japanese Conversation with @harunonihongo / \"Moving\""
    }
  },
  {
    "id": "ja-conversation-v2-c1-implicit-meaning",
    "chapter": "ja-conversation-v2-c1-implicit-meaning-chapter",
    "level": "C1",
    "language": "ja",
    "locale": "ja-JP",
    "title": "Interpret subtext in a Japanese conversation",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "HvcSqYQYGOs",
      "poster": "/lesson-media/study.jpg",
      "alt": "Illustrative study scene for interpret subtext in a japanese conversation",
      "source": "https://www.youtube.com/watch?v=HvcSqYQYGOs",
      "credit": "Miku Real Japanese",
      "sourceTitle": "【Japanese conversation】with @JapanesewithShun"
    }
  },
  {
    "id": "en-conversation-v2-a2-daily-routine",
    "chapter": "en-conversation-v2-a2-daily-routine-chapter",
    "level": "A2",
    "language": "en",
    "locale": "en-GB",
    "title": "Talk through your daily routine",
    "minutes": 15,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "bq6GBbh3uhU",
      "poster": "/lesson-media/home.jpg",
      "alt": "Illustrative home scene for talk through your daily routine",
      "source": "https://www.youtube.com/watch?v=bq6GBbh3uhU",
      "credit": "BBC Learning English",
      "sourceTitle": "How to talk about your daily routine: Easy English Conversations 💬 Episode 4"
    }
  },
  {
    "id": "en-conversation-v2-b1-complaints",
    "chapter": "en-conversation-v2-b1-complaints-chapter",
    "level": "B1",
    "language": "en",
    "locale": "en-GB",
    "title": "Make a complaint politely",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "E3G-dsvZHGU",
      "poster": "/lesson-media/shopping.jpg",
      "alt": "Illustrative shopping scene for make a complaint politely",
      "source": "https://www.youtube.com/watch?v=E3G-dsvZHGU",
      "credit": "BBC Learning English",
      "sourceTitle": "When is it OK to complain? ☝️😠 | Practise your listening skills with Real Easy English"
    }
  },
  {
    "id": "en-conversation-v2-b2-conversation-skills",
    "chapter": "en-conversation-v2-b2-conversation-skills-chapter",
    "level": "B2",
    "language": "en",
    "locale": "en-GB",
    "title": "Explore the art of conversation",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "xGhbhWUqL-w",
      "poster": "/lesson-media/cafe.jpg",
      "alt": "Illustrative cafe scene for explore the art of conversation",
      "source": "https://www.youtube.com/watch?v=xGhbhWUqL-w",
      "credit": "BBC Learning English",
      "sourceTitle": "The art of conversation - 6 Minute English"
    }
  },
  {
    "id": "en-conversation-v2-c1-rhetoric",
    "chapter": "en-conversation-v2-c1-rhetoric-chapter",
    "level": "C1",
    "language": "en",
    "locale": "en-GB",
    "title": "Analyse persuasive advice about conversation",
    "minutes": 20,
    "conversation": {
      "provider": "youtube",
      "youtubeId": "R1vskiVDwl4",
      "poster": "/lesson-media/study.jpg",
      "alt": "Illustrative study scene for analyse persuasive advice about conversation",
      "source": "https://www.youtube.com/watch?v=R1vskiVDwl4",
      "credit": "TED",
      "sourceTitle": "Celeste Headlee: 10 ways to have a better conversation | TED"
    }
  }
];
const guide=['Read the question, then listen to its indicated section.','Replay to identify what the speakers actually say and why.','Choose the answer supported by the recording, then review the explanation.'];
export const levelConversationLessons=definitions.map(d=>({...d,specialist:true,curriculumVersion:2,exerciseVersion:'v3-video-20261009',skill:'Listening',explanation:'Understand the speakers’ statements, experiences and reasons in this recording.',example:d.conversation.youtubeId==='HvcSqYQYGOs'?'This short check covers the introduction only (0:14–1:05), where the available captions establish the topic and purpose. The rest of the conversation is optional.':d.conversation.youtubeId==='ewP08J78Y9U'?'These questions follow the episode’s discussion of personal goals. Its official transcript is linked with each question; exact YouTube timings are still being checked.':'Every question is based on this video. Read its time window and replay that section; watching the entire video is optional.',exampleLang:'en-US',conversation:{...d.conversation,watchTasks:guide,levelNote:d.level+' is the target level for the Continuum tasks, not an official rating of this video. Use replay and captions when available.',hint:'Answer from what you hear in the recording. Questions paraphrase the content; they are not verbatim quotations.'},questions:videoComprehension(d.conversation.youtubeId)}));
export const levelConversationChapters=levelConversationLessons.map(d=>({id:d.chapter,level:d.level,language:d.language,locale:d.locale,specialist:true,curriculumVersion:2,title:d.title,goal:d.explanation,kind:'Real conversations'}));
