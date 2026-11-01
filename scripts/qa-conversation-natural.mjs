// Real Chromium/WebKit media playback; only provider responses are synthetic.
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const engines=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const server=await createServer({server:{host:'127.0.0.1',port:0},appType:'custom'});
server.middlewares.use('/__conversation-natural',async(req,res)=>{res.setHeader('Content-Type','text/html');res.end(await server.transformIndexHtml('/__conversation-natural','<html><body><button id="run">Run voice checks</button><script type="module">import {ConversationVoiceLoop} from "/conversation-voice.mjs"; window.ConversationVoiceLoop=ConversationVoiceLoop;</script></body></html>'));});
await server.listen();const origin='http://127.0.0.1:'+server.httpServer.address().port;
try{for(const name of (process.env.QA_AUDIO_ENGINES||'chromium,webkit').split(',')){
 const browser=await engines[name].launch({headless:true,args:name==='chromium'?['--no-sandbox']:[]});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/__conversation-natural');await page.waitForFunction(()=>window.ConversationVoiceLoop);
  await page.evaluate(()=>{
   window.__result=null;
   document.querySelector('#run').onclick=async()=>{
    const loop=new window.ConversationVoiceLoop({host:window});loop.active=true;loop.epoch=1;
    let fetches=0,device=0,mode='normal';const notices=[];loop.onVoiceNotice=n=>notices.push(n);
    loop.speakDevice=async()=>device++;
    const context=new (window.AudioContext||window.webkitAudioContext)();loop.context=context;await context.resume();loop.player=new Audio();
    const bytes=new ArrayBuffer(44+9600),view=new DataView(bytes),str=(at,text)=>{for(let i=0;i<text.length;i++)view.setUint8(at+i,text.charCodeAt(i))};str(0,'RIFF');view.setUint32(4,bytes.byteLength-8,true);str(8,'WAVEfmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,24000,true);view.setUint32(28,48000,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,9600,true);for(let i=0;i<4800;i++)view.setInt16(44+i*2,Math.round(1500*Math.sin(i*.1)),true);
    loop.fetchImpl=async()=>{fetches++;if(mode==='transient'){mode='normal';return new Response('{}',{status:503});}if(mode==='quota')return new Response('{}',{status:429,headers:{'Retry-After':'60'}});return new Response(bytes.slice(0),{headers:{'Content-Type':'audio/wav'}});};
    try{
     for(let turn=0;turn<6;turn++){if(turn===2)mode='transient';await loop.speak('/audio/'+turn,1);if(loop.deviceVoice)throw Error('Natural voice was permanently downgraded');}
     mode='quota';let paused=false;try{await loop.speak('/quota',1);}catch(e){paused=/Natural voice/.test(e.message);}if(!paused)throw Error('Quota must pause rather than downgrade');
     mode='normal';await loop.speak('/quota',1);
     // A real media element still gets browser gesture recovery using the same
     // prepared bytes rather than making another provider/cache request.
     const play=loop.player.play.bind(loop.player);let blocked=true;loop.player.play=()=>blocked?(blocked=false,Promise.reject(new DOMException('Blocked','NotAllowedError'))):play();
     let blockedError=false;try{await loop.speak('/blocked',1);}catch{blockedError=true;}const preparedFetches=fetches;await loop.speak('/blocked',1);
     window.__result={device,selectedDevice:loop.deviceVoice,fetches,preparedFetches,reused:fetches===preparedFetches,paused,blockedError,reconnected:notices.includes('Reconnecting natural voice…')};
    }catch(e){window.__result={error:e.message};}finally{loop.stop();}
   };
  });
  await page.click('#run');await page.waitForFunction(()=>window.__result,{timeout:45000});const r=await page.evaluate(()=>window.__result);
  assert.ok(!r.error,JSON.stringify(r));assert.equal(r.device,0);assert.equal(r.selectedDevice,false);assert.ok(r.paused&&r.blockedError&&r.reused&&r.reconnected,JSON.stringify(r));assert.deepEqual(errors,[]);
  console.log('PASS '+name+': six natural-voice rallies, transient recovery, quota pause, natural recovery and prepared-media reuse; no automatic device speech.');
 }finally{await browser.close();}
}}finally{await server.close();}
