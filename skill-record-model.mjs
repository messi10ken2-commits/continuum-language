import {getSkillTask} from './skills-content.mjs';
// Server metadata keeps saved Premium records identifiable before their full
// task has been opened. Only known legacy Spanish tasks default to Spanish.
export const skillSubmissionTask=row=>getSkillTask(row?.task)||row?.taskInfo;
export function skillRecordsForLanguage(rows,language){return language?rows.filter(row=>{const task=skillSubmissionTask(row);return task&&(task.language||'es')===language;}):rows;}
