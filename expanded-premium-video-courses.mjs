// SERVER ONLY: exclusive source catalog, timing records and answer keys.
import sources from './expanded-premium-video-sources.json' with {type:'json'};
import timings from './expanded-premium-video-timings.json' with {type:'json'};
import {buildExpandedVideo,buildTimedExpandedVideo} from './expanded-video-course.mjs';
export const archivedExpandedPremiumVideoCourses=sources.map(buildExpandedVideo);
export const expandedPremiumVideoCourses=sources.map(s=>buildTimedExpandedVideo(s,timings.find(t=>t.youtubeId===s.youtubeId)));
