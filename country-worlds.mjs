export const countryWorlds={
 zh:{carLength:145,cars:3,pace:19,railY:730,paint:'#e5e4dc',band:'#267b80',coat:'#357b75',header:'50% 45%'},
 ko:{carLength:125,cars:3,pace:16,railY:760,paint:'#d9dfe5',band:'#285ba0',coat:'#9c667c',header:'62% 42%'},
 fr:{carLength:138,cars:2,pace:21,railY:635,paint:'#ece5da',band:'#417495',coat:'#a85d50',header:'50% 43%'},
 de:{carLength:118,cars:2,pace:17,railY:690,paint:'#ad3639',band:'#e9d9be',coat:'#41657a',header:'52% 48%'},
 ar:{carLength:130,cars:2,pace:23,railY:790,paint:'#e5d9bb',band:'#427858',coat:'#518579',header:'50% 42%'},
 it:{carLength:112,cars:2,pace:18,railY:790,paint:'#e8ddc4',band:'#547d5b',coat:'#9b6651',header:'56% 45%'}
};
export const countryWorldArt=language=>countryWorlds[language]?`/country-worlds/${language}/panorama.webp`:null;
