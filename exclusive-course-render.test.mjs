import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';
import {premiumCourses} from './premium-courses.mjs';
const vite=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
try{
 const {ExclusiveCoursePlayer}=await vite.ssrLoadModule('/PremiumLessons.jsx');
 for(const course of premiumCourses){
  // The API withholds answers and feedback until the learner checks a response.
  const visible={...course,questions:course.questions.map(({answer,acceptedAnswers,note,...q})=>q)};
  const props={course:visible,user:{id:'synthetic-render-user'},onExit(){}};
  const intro=renderToStaticMarkup(React.createElement(ExclusiveCoursePlayer,props));
  assert.ok(intro.includes('lesson-intro-card'),course.id);assert.ok(intro.includes('Start practice'),course.id);
  const question=renderToStaticMarkup(React.createElement(ExclusiveCoursePlayer,{...props,initialDraft:{answers:[],checks:{},key:'synthetic-render-attempt'}}));
  assert.ok(question.includes('question-card'),course.id);assert.ok(question.includes('Check answer'),course.id);
  if(course.questions[0].audio){assert.ok(question.includes('Show transcript'),course.id);assert.ok(!question.includes('audio-transcript" open'),course.id);}
  if(course.scene==='varieties'){assert.ok(intro.includes('conjugation-scroll'),course.id);assert.ok(question.includes('not an authenticated regional recording'),course.id);}
 }
 console.log('PASS: all 28 exclusive-course intros and first questions render through the regular player with API-hidden answers, regional references and hidden listening transcripts.');
}finally{await vite.close();}
