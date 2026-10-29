import recapManifest from './lesson-video-manifest.json' with {type:'json'};
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
 if(lesson.characters)return lesson.language==='ja'?'japan':'study';
 return 'study';
}
const contextPhotos={
 cooking:{alt:'People preparing a meal together in a kitchen',themes:['food','home','cafe']},
 friends:{alt:'Friends walking together along a park path',themes:['nature','city']},
 library:{alt:'A reader with a book beside library shelves',themes:['study']},
 'study-garden':{alt:'Two people studying books at an outdoor table',themes:['study','work']},
 market:{alt:'Shoppers browsing groceries in a market',themes:['food','shopping']},
 'reading-home':{alt:'A person reading a book on a sofa',themes:['home','study']},
 'reading-water':{alt:'A person reading beside the water',themes:['nature','study']},
 'market-clothes':{alt:'People browsing clothing stalls in an indoor market',themes:['shopping','city']},
 'airport-lounge':{alt:'Passengers seated in an airport waiting area',themes:['travel']}
};
const hash=value=>{let n=0;for(const c of String(value))n=(Math.imul(n,31)+c.charCodeAt(0))>>>0;return n;};
export function photoInfo(lesson={}){
 if(lesson.conversation?.poster)return {src:lesson.conversation.poster,alt:lesson.conversation.alt||'Conversation video'};
 const theme=themeFor(lesson),text=(lesson.sceneText||lesson.title||'').toLowerCase();
 if(theme==='station'&&!/airport|flight|boarding|aeroporto|aeropuerto|空港/.test(text))return {src:'/lesson-media/passenger-station-v3.webp',alt:'Passengers waiting beside a passenger train at Butterworth station, Malaysia'};
 let choices;
 if(/cook|kitchen|cozinh|cocin|料理|台所/.test(text))choices=['cooking','home'];
 else if(/read|book|library|livro|leitura|libro|biblioteca|読|図書/.test(text))choices=['library','reading-home','reading-water','study-garden'];
 else if(/airport|flight|boarding|aeroporto|aeropuerto|空港/.test(text))choices=['airport-lounge','travel'];
 else if(/clothes|shirt|dress|roupa|camisa|vestido|服/.test(text))choices=['market-clothes','shopping'];
 else if(/grocer|vegetable|market|mercado|野菜/.test(text))choices=['market','food'];
 else if(/walk|park|friend|caminh|passeio|amig|散歩|友達/.test(text))choices=['friends','nature'];
 else choices=[theme,...Object.entries(contextPhotos).filter(([,p])=>p.themes.includes(theme)).map(([id])=>id)];
 // Stable within a question, varied across the lesson; answer data is never used.
 const id=choices[hash(lesson.sceneKey||lesson.id||lesson.title)%choices.length];
 return contextPhotos[id]?{src:`/lesson-media/${id}-v2.jpg`,alt:contextPhotos[id].alt}:{src:`/lesson-media/${id}.jpg`,alt:mediaThemes[id].alt};
}
export const photoFor=lesson=>photoInfo(lesson).src;

export const hasLessonMedia=lesson=>!!lesson&&!lesson.checkpoint&&!lesson.summaryTest&&!lesson.conversation;
function authoredFrames(lesson,{all=false}={}){
 if(lesson.visualStory)return lesson.visualStory.frames;
 if(lesson.characters)return lesson.characters.slice(0,3).map(c=>({label:'Shape → sound',text:c.glyph,meaning:c.reading,note:c.meaning||'Connect the shape with its reading. Practise the full set below.',...(lesson.language!=='ja'?{audio:c.audio||c.glyph,lang:lesson.locale}:{})}));
 if(lesson.soundGuide)return lesson.soundGuide.pairs.slice(0,3).map(([a,b])=>({label:'Listen & compare',text:a,meaning:b,note:lesson.explanation}));
 if(lesson.vocabulary?.length)return lesson.vocabulary.slice(0,all?undefined:3).map(w=>({label:'Word → phrase',text:w.term,meaning:w.meaning,note:w.example||w.phrase}));
 if(lesson.expressions?.length)return lesson.expressions.slice(0,all?undefined:3).map(w=>({label:'Meaning → use',text:w.term,meaning:w.meaning,note:w.use||w.example}));
 if(lesson.breakdown?.examples?.length){const examples=lesson.breakdown.examples;return Array.from({length:3},(_,i)=>({label:['Notice the form','Connect the meaning','Apply the rule'][i],text:examples[i%examples.length][0],meaning:examples[i%examples.length][1],note:lesson.breakdown.steps?.[i]||lesson.breakdown.pitfall||lesson.explanation}));}
 return [{label:'Notice',text:lesson.example||lesson.title,meaning:'Read the model in context.',note:lesson.explanation},{label:'Understand',lang:'en-US',text:lesson.title,meaning:lesson.explanation,note:'What does the speaker want to communicate?'},{label:'Use it',text:lesson.example||lesson.title,meaning:'Change one detail and make this example your own.',note:'Then test your understanding in the exercises.'}];
}
// A recap contains actual authored examples, never a title voiced as target
// language or a repeated model padded out to three artificial steps.
export function visualFrames(lesson,options={}){
 const frames=authoredFrames(lesson,options);
 if(!lesson.visualStory&&!lesson.characters&&!lesson.soundGuide&&!lesson.vocabulary?.length&&!lesson.expressions?.length&&!lesson.breakdown?.examples?.length)
  return lesson.example?.trim()?[{label:'Example',text:lesson.example,lang:lesson.exampleLang}]:[];
 return frames.filter((frame,index)=>frames.findIndex(f=>f.text.trim()===frame.text.trim()&&f.meaning===frame.meaning)===index);
}
// Existing pre-rendered clips must still agree with their visible transcript.
// Keep compatible clips; do not advertise stale, repeated fallback recaps.
export const hasRecapVideo=lesson=>Object.hasOwn(recapManifest,lesson.id)&&JSON.stringify(visualFrames(lesson))===JSON.stringify(authoredFrames(lesson));
export const videoFor=lesson=>`/api/lesson-video/${mediaVersion}/${encodeURIComponent(lesson.id)}.mp4`;

// Use only the visible prompt to select context; never inspect the correct answer.
export function questionScene(lesson,question){
 if(lesson.conversation)return lesson;
 const theme=themeFor({title:question?.prompt});
 return {...lesson,sceneText:question?.prompt||lesson.title,sceneKey:question?.id||question?.prompt||lesson.id,...(theme==='study'?{}:{visualStory:{theme}})};
}
