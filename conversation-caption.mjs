// Keep the stored conversation intact; only its current utterance is staged.
export function currentConversationCaption(session){
 const index=(session?.messages?.length||0)-1,message=session?.messages?.[index];
 return message?{...message,index,key:JSON.stringify([session.id,index,message.role,message.text])}:null;
}
