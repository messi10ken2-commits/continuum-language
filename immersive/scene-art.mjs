// Illustrative settings for authored case studies; never derived from answers.
const topics={
 market:{scene:'market',photo:'/lesson-media/market-v2.jpg'},
 library:{scene:'study',original:'library',photo:'/lesson-media/library-v2.jpg'},
 tourism:{scene:'city',photo:'/lesson-media/city.jpg'},
 work:{scene:'work',photo:'/lesson-media/work.jpg'},
 food:{scene:'food',photo:'/lesson-media/cooking-v2.jpg'},
 heat:{scene:'nature',photo:'/lesson-media/nature.jpg'},
 archives:{scene:'study',original:'library',photo:'/lesson-media/library-v2.jpg'},
 research:{scene:'study',photo:'/lesson-media/study.jpg'},
 heritage:{scene:'culture',photo:'/passport-real/en-edinburgh-e23a9ea9f574.webp'}
};
const languages=['en','es','pt','ja','zh','ko','fr','de','ar','it'];
export function immersiveSceneArt(lesson,layout='photo'){
 const topic=topics[lesson?.immersive?.key]||topics.library;
 const language=languages.includes(lesson?.language)?lesson.language:'en';
 const scene=topic.original&&['en','es','pt','ja'].includes(language)?topic.original:topic.scene;
 return layout==='illustrated'?`/illustrated-lessons/${language}-${scene}.webp`:topic.photo;
}
