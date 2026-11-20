import {questionLearningText} from './learning-text-protection.mjs';
import LessonText from './LessonText.jsx';
import {isInstructionContext} from './exercise-context.mjs';
import React from 'react';
import {questionContext,t,interfaceLanguage} from './interface-runtime.mjs';
import {questionPromptSource,visibleQuestionContext} from './question-presentation.mjs';
import './question-prompt.css';
export default function QuestionPrompt({question,lesson={},showCourseContext=false,children}){
 const language=lesson.language||lesson.locale?.slice(0,2)||'es',parts=questionPromptSource(question);
 const excerpt=visibleQuestionContext(question,showCourseContext);
 const direction=isInstructionContext(excerpt),translated=direction?questionContext(question):null;
 const context=excerpt?<blockquote lang={direction?undefined:lesson.locale} dir="auto">{direction?<LessonText text={excerpt} translated={translated!==excerpt?translated:undefined}/>:excerpt}</blockquote>:null;
 if(!parts)return <div className="question-prompt"><h1><LessonText text={question.prompt} language={language} translated={question.promptTranslations?.[interfaceLanguage()]}/></h1>{context}{children}</div>;
 const authored=question.promptTranslations?.[interfaceLanguage()],models=questionLearningText(question,language);
 const authoredBody=authored&&parts.translatedLines?authored.split('\n').slice(1).join('\n'):undefined;
 const renderBody=(body,translate=false)=>{const lines=body.split('\n');if(lines[0]===lesson.title||lines[0]===t(lesson.title,language))lines.shift();return lines.filter(Boolean).map((line,i)=>{const model=models.includes(line.trim());return <p dir="auto" lang={model?lesson.locale:undefined} className={/_{2,}|＿{2,}/.test(line)?'question-cloze':undefined} key={i}>{translate&&!model?<LessonText text={line} language={language}/>:line}</p>})};
 return <div className="question-prompt"><h1>{t(parts.instruction)}</h1>{parts.hint&&<p className="question-prompt-hint">{t(parts.hint)}</p>}{parts.context&&<p className="question-prompt-hint">{<LessonText text={parts.context} language={language}/>}</p>}{context}{children}<div className="question-prompt-context" lang={parts.learningText?lesson.locale:undefined}>{authoredBody?renderBody(authoredBody):renderBody(parts.body,!parts.learningText)}</div></div>;
}
