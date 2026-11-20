import {isCorrect} from './course.mjs';
// Keep first-attempt evidence for grading. A retry teaches, it does not overwrite it.
export function answerStep(lesson,question,choice,retrying=false,firstChoice=null){
 if(!isCorrect(question,choice)&&!retrying&&!lesson.checkpoint&&!lesson.summaryTest)return {retry:true,firstChoice:choice};
 return {retry:false,answer:retrying?firstChoice:choice};
}
