import {useEffect,useRef} from 'react';

// Pointer movement updates CSS once per frame, without React rerenders.
export function useLightMotion(){
 const root=useRef(null);
 useEffect(()=>{
  const element=root.current;
  if(!element)return;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView=false,frame=0,point=null;
  const reset=()=>{
   cancelAnimationFrame(frame);
   frame=0;
   point=null;
   element.style.removeProperty('--light-pointer-x');
   element.style.removeProperty('--light-pointer-y');
  };
  const sync=()=>{
   const enabled=inView&&!document.hidden&&!preference.matches&&!element.closest('[inert]');
   element.dataset.motion=enabled?'on':'off';
   if(!enabled)reset();
  };
  const observer=new IntersectionObserver(entries=>{
   inView=entries[0].isIntersecting;
   sync();
  });
  observer.observe(element);
  const inertObserver=new MutationObserver(sync);
  for(let node=element;node;node=node.parentElement){
   inertObserver.observe(node,{attributes:true,attributeFilter:['inert']});
  }
  const move=event=>{
   if(element.dataset.motion!=='on'||event.pointerType==='touch')return;
   const box=element.getBoundingClientRect();
   if(!box.width||!box.height)return;
   point={
    x:Math.max(-1,Math.min(1,(event.clientX-box.left)/box.width*2-1)),
    y:Math.max(-1,Math.min(1,(event.clientY-box.top)/box.height*2-1))
   };
   if(frame)return;
   frame=requestAnimationFrame(()=>{
    frame=0;
    element.style.setProperty('--light-pointer-x',point.x.toFixed(3));
    element.style.setProperty('--light-pointer-y',point.y.toFixed(3));
   });
  };
  element.addEventListener('pointermove',move);
  element.addEventListener('pointerleave',reset);
  document.addEventListener('visibilitychange',sync);
  preference.addEventListener('change',sync);
  sync();
  return()=>{
   observer.disconnect();
   inertObserver.disconnect();
   reset();
   element.removeEventListener('pointermove',move);
   element.removeEventListener('pointerleave',reset);
   document.removeEventListener('visibilitychange',sync);
   preference.removeEventListener('change',sync);
  };
 },[]);
 return root;
}
