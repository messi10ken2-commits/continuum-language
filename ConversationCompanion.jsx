import React from 'react';
import RiggedConversationCompanion from './RiggedConversationCompanion.jsx';
import {callCompanionKind} from './companion-call-models.mjs';

// Each species uses the approved capybara facial-motion contract. Changing
// companions remounts the renderer, aborting loads and disposing the old model.
export default function ConversationCompanion(props){
 const kind=callCompanionKind(props.kind);
 return <RiggedConversationCompanion {...props} kind={kind} key={kind}/>;
}
