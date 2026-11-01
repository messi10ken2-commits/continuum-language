import {scenarioById} from './speaking-content.mjs';
// Use the supplied scenario goals rather than an unrelated generic fallback.
export function speakingGoal(session){
 const goals=scenarioById(session.scenario)?.goals||[];
 const index=goals.findIndex((_,i)=>!session.review?.goals?.[i]?.achieved||session.review.goals[i].assessed===false);
 return {goal:goals[index<0?0:index]||'',stretch:index<0};
}
export const speakingFeedbackVersion='verified-speaking-coaching-v1';
export const needsSpeakingFeedback=review=>review?.feedbackIntegrity!==speakingFeedbackVersion||review?.feedbackStatus!=='ready';
