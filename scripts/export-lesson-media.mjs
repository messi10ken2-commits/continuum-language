import {writeFileSync,mkdirSync} from 'node:fs';
import {lessonList} from '../course.mjs';
import {visualFrames,themeFor,hasLessonMedia} from '../lesson-media.mjs';
mkdirSync('.media-build',{recursive:true});
writeFileSync('.media-build/catalog.json',JSON.stringify(lessonList.filter(hasLessonMedia).map(l=>({id:l.id,title:l.title,level:l.level,skill:l.skill,language:l.language||'es',theme:themeFor(l),frames:visualFrames(l)}))));
