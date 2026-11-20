// Count actual foreground practice, excluding voice setup and AI/audio waits.
export function conversationPracticeActive({visible,busy,error,mode,voiceState}){return visible&&!busy&&!error&&(mode==='text'||['speaking','listening'].includes(voiceState));}
