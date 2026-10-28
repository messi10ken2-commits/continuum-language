import React,{useEffect,useRef,useState} from 'react';
import {livingMapTheme} from './living-map-model.mjs';
import {curvedTrainPose} from './train-curve.mjs';
import {buildRollingStock} from './rolling-stock.mjs';
import {createRollingStockRenderer} from './rolling-stock-webgl.mjs';
export default function CurveTrain({language,paused=false}){
 const clock=useRef(null),canvas=useRef(null),[fallback,setFallback]=useState(false),initial=curvedTrainPose(language,0);
 useEffect(()=>{
  const el=canvas.current;let renderer;try{renderer=createRollingStockRenderer(el)}catch{}if(!renderer){setFallback(true);return;}
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');let frame,last=-Infinity,visible=true,alive=true;
  function sample(time){if(!alive||!clock.current)return;const animation=clock.current?.getAnimations()[0],value=media.matches?0:Number(animation?.currentTime||0)/48000;
   if(time-last>=32){const model=buildRollingStock(language,value),b=model.bounds,w=Math.ceil(b.width*2/64)*64,h=Math.ceil(b.height*2/64)*64;if(el.width!==w)el.width=w;if(el.height!==h)el.height=h;
    Object.assign(el.style,{left:b.left/19.2+'%',top:b.top/8.96+'%',width:b.width/19.2+'%',height:b.height/8.96+'%'});renderer.draw(model);
    el.dataset.trainDistance=String(model.pose.distance);el.dataset.rendered='true';clock.current.dataset.trainProgress=String(value);last=time;
   }
   if(!paused&&!media.matches&&visible&&!document.hidden)frame=requestAnimationFrame(sample);
  }
  function restart(){cancelAnimationFrame(frame);sample(performance.now());}
  const observer=new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);restart();});observer.observe(clock.current);restart();media.addEventListener('change',restart);document.addEventListener('visibilitychange',restart);
  return()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();renderer.dispose();media.removeEventListener('change',restart);document.removeEventListener('visibilitychange',restart)};
 },[language,paused]);
 const art=livingMapTheme(language).motion.train,[x,y,w,h]=art.bounds;
 return <div ref={clock} className="painted-train-rig" data-train-progress="0"><canvas ref={canvas} className="painted-train-sprite" data-moving-object="train" data-renderer="rounded-rolling-stock" data-train-distance={initial.distance} data-rendered="false" style={{position:'absolute',display:fallback?'none':'block'}}/>{fallback&&<img src={art.src} alt="" draggable="false" style={{position:'absolute',left:x+'%',top:y+'%',width:w+'%',height:h+'%'}}/>}</div>;
}
