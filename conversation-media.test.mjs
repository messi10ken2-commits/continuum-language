import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {lessonList,gradeLesson,isCurrentLessonDraft,getLessonVariant} from './course.mjs';
import {conversationLessons} from './conversation-course.mjs';
import {levelConversationLessons,levelConversationChapters} from './level-conversations.mjs';
import sources from './level-video-sources.json' with {type:'json'};
import {formatVideoTime,reviewedVideoCue} from './conversation-cues.mjs';
import {questionScene,photoFor} from './lesson-media.mjs';
const vite=await createServer({server:{middlewareMode:true},appType:'custom'});
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
try{
 const {default:SelfStudy}=await vite.ssrLoadModule('/SelfStudy.jsx');
 for(const l of lessonList){
  const props={language:l.language||'es',activeLesson:l.id,attempts:[],onStart(){},onExit(){},onComplete(){}};
  const render=()=>renderToStaticMarkup(React.createElement(SelfStudy,props));
  const intro=render();assert.ok(intro.includes(l.conversation?.provider==='youtube'?'class="conversation-embed"':l.conversation?'poster="/lesson-media/voa-':'<img'),l.id+' intro image');
  storage.set('continuumLessonDrafts',JSON.stringify({[l.id]:[]}));
  if(l.exerciseVersion)storage.set('continuumTestSeeds',JSON.stringify({[l.id]:l.exerciseVersion}));
  const exercise=render();assert.ok(exercise.includes(l.conversation?'Conversation video:':'Enlarge page image'),l.id+' practice visual');
  assert.ok(!exercise.includes('visual-focus'),l.id+' no recap answers in exercise');storage.clear();
 }
 for(const language of ['es','en','pt','ja']){
  storage.set('continuumCourseLevel'+(language==='es'?'':':'+language),'A1');
  const l=lessonList.find(l=>(l.language||'es')===language&&l.level==='A1');
  const renderScore=attempts=>renderToStaticMarkup(React.createElement(SelfStudy,{language,attempts,onStart(){},onExit(){},onComplete(){}}));
  assert.ok(!renderScore([{lesson:l.id,score:88}]).includes('100% achieved'),language+' nonperfect');
  assert.ok(renderScore([{lesson:l.id,score:75},{lesson:l.id,score:100}]).includes('100% achieved'),language+' retained perfect score');
 }
 for(const l of conversationLessons){
  assert.equal(gradeLesson(l.id,l.questions.map(q=>q.answer)).score,100);
  assert.ok(l.questions.every(q=>q.video&&!q.audio));
  if(l.conversation.provider==='youtube'){
   assert.match(l.conversation.youtubeId,/^[A-Za-z0-9_-]{11}$/);
   assert.equal(l.conversation.source,`https://www.youtube.com/watch?v=${l.conversation.youtubeId}`);
   assert.equal(l.conversation.phrases,undefined);
   assert.ok(l.questions.every(q=>!q.languagePractice));
   assert.ok(l.questions.every(q=>q.videoCue?.evidence||q.sourceReference?.evidence));
   const {default:Player}=await vite.ssrLoadModule('/ConversationVideo.jsx');
   const markup=renderToStaticMarkup(React.createElement(Player,{lesson:l}));
   assert.ok(markup.includes('strict-origin-when-cross-origin'));
   assert.ok(markup.includes('Open original video'));
   assert.ok(!markup.includes('Practice phrases'));
   assert.ok(!markup.includes('autoplay=1'));
   assert.ok(!markup.includes('Read the dialogue transcript'));
  }else{
   assert.ok(l.conversation.transcript.length>5);
   assert.ok(l.conversation.src.startsWith('https://voa-video-ns.akamaized.net/'));
  }
 }
 assert.deepEqual([...new Set(conversationLessons.map(l=>l.language))].sort(),['en','es','ja','pt']);
 assert.equal(levelConversationLessons.length,16);
 assert.equal(new Set(levelConversationLessons.map(l=>l.id)).size,16);
 assert.equal(new Set(levelConversationLessons.map(l=>l.conversation.youtubeId)).size,16);
 for(const language of ['en','es','ja','pt'])for(const level of ['A2','B1','B2','C1']){
  const matches=levelConversationLessons.filter(l=>l.language===language&&l.level===level);
  assert.equal(matches.length,1,`${language} ${level} video coverage`);
  const l=matches[0];
  assert.ok(levelConversationChapters.some(c=>c.id===l.chapter&&c.level===level&&c.language===language));
  assert.equal(l.questions.length,l.id.endsWith('-implicit-meaning')?4:l.id.endsWith('-goals-values')?6:8);
  assert.equal(l.conversation.watchTasks.length,3);
  assert.ok(l.conversation.levelNote.includes('not an official rating'));
  assert.equal(gradeLesson(l.id,l.questions.map(q=>(q.answer+1)%q.options.length)).score,0);
  for(const question of l.questions){
   assert.equal(new Set(question.options).size,3);
   assert.ok(question.options[question.answer]);
   assert.ok(question.note.trim(),l.id+' answer explanation');
  }
  assert.equal(sources.find(s=>s.id===l.conversation.youtubeId).rightsReview,'pending');
 }
 const {default:Discovery}=await vite.ssrLoadModule('/LessonMedia.jsx');
 for(const l of levelConversationLessons){
  const html=renderToStaticMarkup(React.createElement(Discovery,{lesson:l}));
  assert.ok(html.includes('Your listening guide'));
  assert.ok(html.includes(l.conversation.youtubeId));
 }
 const {ConversationQuestion}=await vite.ssrLoadModule('/ConversationVideo.jsx');
 assert.equal(formatVideoTime(362),'6:02');
 assert.equal(reviewedVideoCue({languagePractice:true,videoCue:{start:1,end:2,evidence:'test'}}),null);
 assert.equal(reviewedVideoCue({videoCue:{start:1,end:2}}),null);
 assert.equal(reviewedVideoCue({videoCue:{start:20,end:10,evidence:'test'}}),null);
 for(const l of conversationLessons)for(const q of l.questions){
  const html=renderToStaticMarkup(React.createElement(ConversationQuestion,{lesson:l,question:q}));
  assert.ok(!q.languagePractice);
  assert.ok(!html.includes('no video required'));
  const cue=reviewedVideoCue(q);
  if(cue){
   assert.ok(html.includes(`Listen at ${formatVideoTime(cue.start)}–${formatVideoTime(cue.end)}`));
   assert.ok(html.includes('Replay this section'));
   if(l.conversation.provider==='youtube')assert.ok(html.includes(`start=${cue.start}&amp;end=${cue.end}`));
  }else{
   assert.equal(l.conversation.youtubeId,'ewP08J78Y9U');
   assert.ok(q.sourceReference.evidence);
   assert.ok(html.includes('official episode transcript'));
   assert.ok(html.includes('timing is not yet verified'));
   assert.ok(!html.includes('&amp;start='));
  }
 }
 for(const l of conversationLessons.filter(l=>l.exerciseVersion)){
  assert.equal(isCurrentLessonDraft(l.id,[0],undefined),false,'legacy answers must not move to new questions');
  assert.equal(isCurrentLessonDraft(l.id,[0],l.exerciseVersion),true);
  assert.equal(isCurrentLessonDraft(l.id,l.questions.map(q=>q.answer),l.exerciseVersion),false);
  assert.equal(getLessonVariant(l.id,l.exerciseVersion),l);
  storage.set('continuumLessonDrafts',JSON.stringify({[l.id]:[0]}));
  const html=renderToStaticMarkup(React.createElement(SelfStudy,{language:l.language,activeLesson:l.id,attempts:[],onStart(){},onExit(){},onComplete(){}}));
  assert.ok(html.includes('Start practice'),'old draft returns to the introduction');
  storage.clear();
 }
 const lesson={title:'Past tense'};
 assert.equal(photoFor(questionScene(lesson,{prompt:'At the airport',options:['food','work'],answer:0})),photoFor(questionScene(lesson,{prompt:'At the airport',options:['food','work'],answer:1})));
 console.log(`PASS: images on introductions and exercises for all ${lessonList.length} activities; real-conversation grading and no answer-dependent photos.`);
}finally{await vite.close();delete globalThis.localStorage;}
