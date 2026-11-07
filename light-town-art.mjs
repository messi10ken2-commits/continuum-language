const root='/light-town/';
const regions=root+'regions/';

// Ground contact point and visible width [x, y, width], as percentages of the
// scene. Market stalls and seating sit along edges, leaving the bridge approaches clear.
const spanish={
 anchors:[[55,79,14],[24,60,8],[40,58,2.8],[26,66,8],[81,32,7],[48,51,10],[63,81,4.8],[34,66,8],[69,28,9]],
 companion:[13,98,25],
 pins:[[19,27],[46,21],[65,49],[82,22]]
};
const layouts={
 ar:{anchors:[[31,66,12],[29,60,7],[48,68,2.7],[65,84,9],[78,44,8],[58,60,13],[72,73,4.4],[18,74,12],[61,77,12]],companion:[21,96,17],pins:[[25,28],[51,28]]},
 ko:{anchors:[[33,65,13],[27,55,8],[52,57,3.8],[65,81,9],[80,39,8],[58,50,13],[75,60,4.8],[19,72,12],[82,55,12]],companion:[22,96,16],pins:[[31,30],[58,24]]},
 zh:{anchors:[[33,60,12],[28,51,8],[46,63,3.8],[65,87,9],[83,40,8],[56,49,13],[70,44,4.8],[17,66,12],[86,81,13]],companion:[23,80,15],pins:[[27,27],[60,30]]},
 en:{anchors:[[29,64,12],[17,59,8],[43,60,2.8],[62,79,9],[81,40,8],[57,55,13],[77,73,4.8],[18,73,12],[72,76,12]],companion:[23,96,17],pins:[[20,28],[49,29]]},
 fr:{anchors:[[31,72,11],[21,66,7],[44,64,2.6],[66,83,9],[83,37,8],[57,60,12],[78,78,4.5],[14,72,12],[86,81,13]],companion:[21,96,17],pins:[[22,30],[49,27]]},
 de:{anchors:[[29,72,13],[38,63,8],[47,61,2.8],[69,77,9],[84,41,8],[54,61,13],[75,86,4.5],[16,72,12],[84,83,12]],companion:[22,97,17],pins:[[23,31],[54,29]]},
 it:{anchors:[[27,65,13],[13,60,8],[48,60,3],[66,75,9],[79,38,8],[58,56,13],[78,85,4.8],[13,75,12],[83,79,12]],companion:[34,97,16],pins:[[22,27],[52,25]]},
 pt:{anchors:[[30,68,13],[43,58,7],[49,65,2.8],[69,78,9],[83,37,8],[57,57,13],[78,77,4.5],[17,74,12],[88,78,12]],companion:[19,95,16],pins:[[24,33],[54,31]]},
 ja:{anchors:[[31,64,13],[23,52,8],[51,59,3.7],[29,83,9],[81,40,8],[57,52,13],[76,81,4.5],[17,69,12],[87,80,12]],companion:[15,81,15],pins:[[24,32],[54,28]]},
};

export function townArt(language){
 const layout=layouts[language];
 const region=layout?language:'es';
 const stageCount=layout?2:4;
 return {
  ...(layout||spanish),
  stages:[regions+region+'-ground.webp',
   ...Array.from({length:stageCount-1},(_,i)=>regions+region+'-stage-'+(i+1)+'.webp'),
   layout?regions+region+'-town.webp':root+'diorama.webp']
 };
}

export function townRewardImage(language,item){
 const directory=layouts[language]&&item.art!=='rose-planter'?regions+language+'/':root;
 return directory+item.art+'.webp';
}
