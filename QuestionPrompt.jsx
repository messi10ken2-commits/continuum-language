import React from 'react';
import {questionText,t,interfaceLanguage} from './interface-runtime.mjs';
import {questionPromptSource} from './question-presentation.mjs';
import './question-prompt.css';
export default function QuestionPrompt({question,lesson={},children}){
 const language=lesson.language||lesson.locale?.slice(0,2)||'es',parts=questionPromptSource(question);
 if(!parts)return <div className="question-prompt"><h1>{questionText(question,language)}</h1>{children}</div>;
 const authored=question.promptTranslations?.[interfaceLanguage()];
 let body=parts.learningText?parts.body:authored&&parts.translatedLines?authored.split('\n').slice(1).join('\n'):t(parts.body,language);
 const lines=body.split('\n');
 if(lines[0]===lesson.title||lines[0]===t(lesson.title,language))lines.shift();
 return <div className="question-prompt"><h1>{t(parts.instruction)}</h1>{parts.hint&&<p className="question-prompt-hint">{t(parts.hint)}</p>}{parts.context&&<p className="question-prompt-hint">{t(parts.context,language)}</p>}{children}<div className="question-prompt-context" lang={parts.learningText?lesson.locale:undefined}>{lines.filter(Boolean).map((line,i)=><p className={/_{2,}|＿{2,}/.test(line)?'question-cloze':undefined} key={i}>{line}</p>)}</div></div>;
}
