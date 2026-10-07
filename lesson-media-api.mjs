import es from './lesson-videos-es.json' with {type:'json'};
import en from './lesson-videos-en.json' with {type:'json'};
import pt from './lesson-videos-pt.json' with {type:'json'};
import ja from './lesson-videos-ja.json' with {type:'json'};
import manifest from './lesson-video-manifest.json' with {type:'json'};
const bundles={es,en,pt,ja};
export function videoRange(header,size){
 const m=/^bytes=(\d*)-(\d*)$/.exec(header||'');if(!m||(!m[1]&&!m[2]))return null;
 let start,end;
 if(!m[1]){const tail=Number(m[2]);if(!Number.isSafeInteger(tail)||tail<=0)return null;start=Math.max(0,size-tail);end=size-1;}
 else{start=Number(m[1]);end=m[2]?Number(m[2]):size-1;if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||end<start)return null;end=Math.min(end,size-1);}
 return {start,end};
}
export function handleLessonMedia(req,res,route){
 if(!route.startsWith('/api/lesson-video/'))return false;
 const m=/^\/api\/lesson-video\/visual-v1\/([a-zA-Z0-9-]+)\.mp4$/.exec(route),entry=m&&Object.hasOwn(manifest,m[1])&&manifest[m[1]];
 if(!entry){res.writeHead(404);res.end();return true;}
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return true;}
 const headers={'Content-Type':'video/mp4','Accept-Ranges':'bytes','Cache-Control':'public, max-age=31536000, immutable',ETag:`"${entry.sha256}"`,'X-Content-Type-Options':'nosniff'};
 if(req.headers['if-none-match']===headers.ETag){res.writeHead(304,headers);res.end();return true;}
 const bytes=Buffer.from(bundles[entry.language][m[1]],'base64');
 const rangeHeader=req.headers.range&&(!req.headers['if-range']||req.headers['if-range']===headers.ETag)?req.headers.range:null;
 if(rangeHeader){const range=videoRange(rangeHeader,bytes.length);if(!range){res.writeHead(416,{...headers,'Content-Range':`bytes */${bytes.length}`});res.end();return true;}
 const {start,end}=range;res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${bytes.length}`,'Content-Length':end-start+1});res.end(req.method==='HEAD'?undefined:bytes.subarray(start,end+1));return true;}
 res.writeHead(200,{...headers,'Content-Length':bytes.length});res.end(req.method==='HEAD'?undefined:bytes);return true;
}
