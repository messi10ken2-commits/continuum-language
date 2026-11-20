import {isCorrect} from './course.mjs';
// Review order follows first-pass order. First responses remain the scoring evidence.
export function endReviewIndices(lesson,answers){
 if(lesson.checkpoint||lesson.summaryTest||answers.length!==lesson.questions.length)return [];
 return lesson.questions.flatMap((q,i)=>isCorrect(q,answers[i])?[]:[i]);
}
export function lessonPosition(lesson,answers,reviewIndex=0){
 const missed=endReviewIndices(lesson,answers);
 return {reviewing:missed.length>0,index:missed.length?missed[reviewIndex]:answers.length,missed};
}
