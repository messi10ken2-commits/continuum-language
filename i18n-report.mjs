import {lessonList} from './course.mjs';
import {uiTranslationReport} from './base-language.mjs';
import {lessonTranslationDetails} from './lesson-localizations.mjs';
import {auditUiSources} from './ui-localization-audit.mjs';

const educational=lessonTranslationDetails(lessonList);
const candidates=await auditUiSources();
const report={ui:uiTranslationReport(),educational:Object.fromEntries(Object.entries(educational).map(([locale,missing])=>[locale,{missingCount:missing.length,missing}]))};
const output=process.argv.includes('--details')?report:{
 ui:Object.fromEntries(Object.entries(report.ui).map(([locale,value])=>[locale,{missingCount:value.missing.length,translated:value.translated,total:value.total}])),
 educational:Object.fromEntries(Object.entries(report.educational).map(([locale,value])=>[locale,{missingCount:value.missingCount}]))
};
output.sourceAudit={candidateCount:candidates.length,note:'Literal JSX text and accessibility labels requiring review; excludes dynamic strings. Target examples may be intentional.',...(process.argv.includes('--details')?{candidates}:{})};
console.log(JSON.stringify(output,null,2));
if(Object.values(report.ui).some(locale=>locale.missing.length))process.exitCode=1;
