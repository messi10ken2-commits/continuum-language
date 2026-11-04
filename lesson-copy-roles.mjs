// Explicit authored guidance: never guess from the spelling/language of a model.
const instructionExamples=new Set([
 'Every question is based on this video. Read its time window and replay that section; watching the entire video is optional.',
 'These questions follow the episode’s discussion of personal goals. Its official transcript is linked with each question; exact YouTube timings are still being checked.',
 'This short check covers the introduction only (0:14–1:05), where the available captions establish the topic and purpose. The rest of the conversation is optional.',
 'Replay each suggested section, then answer from the recording.',
 'Choose the response that best fits the situation.',
 'Watch with the listening guide, then complete the source-focus checks.',
 'Take your time and use the explanations after each answer.',
 'The test uses different sentences from the learning examples.',
 'Questions cover every chapter at this level.',
 'Order a drink, choose a size and ask for the bill.',
 'Follow a travel update and check the new departure point.',
 'Explain a delay, propose a deadline and make a commitment.',
 'Weigh a benefit against a practical concern and suggest a trial.',
 'Distinguish a reported relationship from a causal conclusion.',
 'Recall the practical meaning, then check the conditions.',
 'Read or listen to the new situation, then choose the response that fits.',
 'Read the situation and choose the response that fits.',
 'Read the situation carefully and choose the response that fits its meaning. A new attempt may ask different questions.'
]);
export function isInstructionalExample(lesson){return !!lesson&&(lesson.exampleRole==='instruction'||!!(lesson.checkpoint||lesson.summaryTest||lesson.transferTest||lesson.conversation)&&(instructionExamples.has(lesson.example)||/^Take the [ABC][12] review when you are ready to check the whole level\.$/.test(lesson.example||'')));}
