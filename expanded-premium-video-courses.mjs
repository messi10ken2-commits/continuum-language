// SERVER ONLY: exclusive source catalog and answer keys.
import sources from './expanded-premium-video-sources.json' with {type:'json'};
import {buildExpandedVideo} from './expanded-video-course.mjs';
export const expandedPremiumVideoCourses=sources.map(buildExpandedVideo);
