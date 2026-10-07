export const mediaVersion='visual-v1';
export const mediaThemes={
 cafe:{name:'Everyday conversations',alt:'A café interior with tables and warm lighting',color:'#b26038'},
 travel:{name:'Travel & discovery',alt:'An airplane wing above the clouds',color:'#39718e'},
 station:{name:'Getting around',alt:'A freight train on railway tracks',color:'#39718e'},
 city:{name:'Life in the city',alt:'Modern city buildings seen from street level',color:'#5660a2'},
 work:{name:'Working together',alt:'Colleagues working together around a table',color:'#47776e'},
 food:{name:'Food & daily life',alt:'Vegetables displayed in a grocery shop',color:'#537b46'},
 shopping:{name:'Shopping & choices',alt:'Clothes displayed inside a clothing shop',color:'#95647e'},
 study:{name:'Ideas & understanding',alt:'A person studying at a laptop',color:'#6460a6'},
 japan:{name:'Japanese in context',alt:'A brightly lit city street in Japan',color:'#916687'},
 nature:{name:'The world around us',alt:'A path through a green forest',color:'#4c7967'},
 home:{name:'Home & routines',alt:'A bright kitchen and dining space',color:'#987555'}
};
export function themeFor(lesson={}){
 if(lesson.visualStory)return lesson.visualStory.theme;
 const t=(lesson.title||'').toLowerCase();
 if(/café|cafe|coffee|restaurant|ordering|order a/.test(t))return 'cafe';
 if(/train|station|platform|transport/.test(t))return 'station';
 if(/travel|airport|flight|holiday|ticket|trip|hotel/.test(t))return 'travel';
 if(/food|quantity|counter|meal|grocery/.test(t))return 'food';
 if(/shop|clothes|buy|price/.test(t))return 'shopping';
 if(/work|job|meeting|deadline|report|professional/.test(t))return 'work';
 if(/environment|nature|weather/.test(t))return 'nature';
 if(/home|family|routine|day in|house/.test(t))return 'home';
 if(/town|city|direction|place|neighbou?r/.test(t))return 'city';
 if(lesson.characters)return 'japan';
 return 'study';
}
export const photoFor=lesson=>lesson.conversation?.poster||`/lesson-media/${themeFor(lesson)}.jpg`;
export const hasLessonMedia=lesson=>!!lesson&&!lesson.checkpoint&&!lesson.summaryTest&&!lesson.conversation;
export function visualFrames(lesson){
 if(lesson.visualStory)return lesson.visualStory.frames;
 if(lesson.characters)return lesson.characters.slice(0,3).map(c=>({label:'Shape → sound',text:c.glyph,meaning:c.reading,note:c.meaning||'Connect the shape with its reading. Practise the full set below.'}));
 if(lesson.soundGuide)return lesson.soundGuide.pairs.slice(0,3).map(([a,b])=>({label:'Listen & compare',text:a,meaning:b,note:lesson.explanation}));
 if(lesson.vocabulary?.length)return lesson.vocabulary.slice(0,3).map(w=>({label:'Word → phrase',text:w.term,meaning:w.meaning,note:w.example||w.phrase}));
 if(lesson.expressions?.length)return lesson.expressions.slice(0,3).map(w=>({label:'Meaning → use',text:w.term,meaning:w.meaning,note:w.use||w.example}));
 if(lesson.breakdown?.examples?.length){const examples=lesson.breakdown.examples;return Array.from({length:3},(_,i)=>({label:['Notice the form','Connect the meaning','Apply the rule'][i],text:examples[i%examples.length][0],meaning:examples[i%examples.length][1],note:lesson.breakdown.steps?.[i]||lesson.breakdown.pitfall||lesson.explanation}));}
 return [{label:'Notice',text:lesson.example||lesson.title,meaning:'Read the model in context.',note:lesson.explanation},{label:'Understand',lang:'en-US',text:lesson.title,meaning:lesson.explanation,note:'What does the speaker want to communicate?'},{label:'Use it',text:lesson.example||lesson.title,meaning:'Change one detail and make this example your own.',note:'Then test your understanding in the exercises.'}];
}
export const videoFor=lesson=>`/api/lesson-video/${mediaVersion}/${encodeURIComponent(lesson.id)}.mp4`;

// Use only the visible prompt to select context; never inspect the correct answer.
export function questionScene(lesson,question){
 if(lesson.conversation)return lesson;
 const theme=themeFor({title:question?.prompt});
 return theme==='study'?lesson:{...lesson,visualStory:{theme}};
}
