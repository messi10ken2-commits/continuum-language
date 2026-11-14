const labels={
 en:['Reading','Listening','Immersive conversation','Chapter checkpoint'],
 es:['Lectura','Comprensión auditiva','Conversación inmersiva','Evaluación del capítulo'],
 pt:['Leitura','Compreensão oral','Conversa imersiva','Revisão do capítulo'],
 ja:['読解','聴解','没入型会話','チャプターチェック'],
 zh:['阅读','听力','沉浸式会话','章节测验'],
 ko:['읽기','듣기','몰입형 대화','챕터 평가'],
 fr:['Lecture','Compréhension orale','Conversation immersive','Bilan du chapitre'],
 de:['Lesen','Hörverstehen','Immersives Gespräch','Kapiteltest'],
 ar:['القراءة','الاستماع','محادثة تفاعلية','اختبار الفصل'],
 it:['Lettura','Ascolto','Conversazione immersiva','Verifica del capitolo']
};
export const immersiveStageTitle=(language,stage)=>labels[language][['reading','listening','roleplay','checkpoint'].indexOf(stage)];
