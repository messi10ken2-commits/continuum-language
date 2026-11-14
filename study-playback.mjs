// Detached Audio instances are not found by querySelector('audio'). Keep a
// tiny in-memory activity signal; no timer, heartbeat, identity or persistence.
const playing=new Set();
export function setStudyPlayback(owner,active){if(owner==null)return;if(active)playing.add(owner);else playing.delete(owner)}
export const studyPlaybackActive=()=>playing.size>0;
