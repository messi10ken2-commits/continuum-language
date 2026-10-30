// Data-driven UI is invisible to the JSX literal audit. Enumerate the public
// catalog fields that cards, workshop menus and saved records actually show.
import {pathToFileURL} from 'node:url';
import {premiumCourseSummary} from '../premium-courses.mjs';
import {premiumSkillSummary} from '../premium-skills.mjs';
import {skillTasks} from '../skills-content.mjs';
import {interfaceCopy} from '../interface-copy.mjs';
import {reviewedTranslation} from '../reviewed-interface-copy.mjs';
import {displayLocales} from './audit-display-coverage.mjs';
export function auditCatalogDisplay(){
 const sources=[...new Set([...premiumCourseSummary.flatMap(c=>[c.title,c.description]),...premiumSkillSummary.map(t=>t.title),...skillTasks.flatMap(t=>[t.title,t.topic])])].filter(Boolean);
 return {sources,missing:sources.flatMap(source=>{const locales=displayLocales.filter(l=>!(reviewedTranslation(source,l)||interfaceCopy[source]?.[l])?.trim());return locales.length?[{source,locales}]:[];})};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const result=auditCatalogDisplay();console.log(JSON.stringify({sources:result.sources.length,missing:result.missing},null,2));if(result.missing.length)process.exitCode=1;}
