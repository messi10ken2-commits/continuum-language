import React from 'react';
import {t} from './interface-runtime.mjs';
import {conversationPartners} from './conversation-partners.mjs';
const labels={idle:'Ready when you are',connecting:'Opening microphone…',preparing:'Preparing voice…',speaking:'Your partner is speaking',listening:'Listening to you…',thinking:'Thinking…',paused:'Conversation paused',error:'Conversation paused',ready:'Ready for your review'};
export default function ConversationAvatar({state='idle',level=0,small=false,partner=conversationPartners.mira}){
 return <div className={`conversation-avatar photoreal ${small?'small':''} ${state}`} style={{'--voice-level':level}}>
  <div className="avatar-portrait"><img src={partner.image} alt={t('AI-generated conversation partner')} width="540" height="720" decoding="async"/><div className="avatar-photo-shade"/><span className="avatar-ai-label">AI</span>{!small&&<div className="avatar-photo-caption"><strong>{partner.name}</strong><small>{t('AI conversation partner')}</small></div>}</div>
  {!small&&<><span className="avatar-state" role="status"><i/>{t(labels[state]||labels.idle)}</span><div className="avatar-wave" aria-hidden="true">{[.45,.8,1,.65,.9,.5,.75].map((scale,i)=><i key={i} style={{'--bar-scale':scale}}/>)}</div></>}
 </div>;
}
