import {lessonList} from './course.mjs';
import {legacyInternationalLessons} from './international-course.mjs';
import {archivedExpandedVideoLessons} from './expanded-video-course.mjs';
// Historical lessons remain reachable from saved progress and need the same copy coverage.
export const localizationLessons=[...new Map([...lessonList,...legacyInternationalLessons,...archivedExpandedVideoLessons].map(l=>[l.id,l])).values()];
