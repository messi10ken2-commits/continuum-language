// Snapshot coordinates inside the event handler: React clears currentTarget
// before a deferred state updater may run.
export function drawingPoint(event){
 const rect=event.currentTarget?.getBoundingClientRect();
 if(!rect?.width||!rect?.height)return null;
 const x=Math.round(Math.max(0,Math.min(300,(event.clientX-rect.left)*300/rect.width)));
 const y=Math.round(Math.max(0,Math.min(300,(event.clientY-rect.top)*300/rect.height)));
 return Number.isFinite(x)&&Number.isFinite(y)?`${x},${y}`:null;
}
export function beginStroke(event,setStrokes){
 if(event.isPrimary===false||(event.pointerType==='mouse'&&event.button!==0))return;
 const point=drawingPoint(event);if(!point)return;
 event.preventDefault();
 try{event.currentTarget.setPointerCapture(event.pointerId);}catch{return;}
 setStrokes(strokes=>[...strokes,[point]]);
}
export function moveStroke(event,setStrokes){
 if(!event.currentTarget?.hasPointerCapture(event.pointerId))return;
 const point=drawingPoint(event);if(!point)return;
 event.preventDefault();setStrokes(strokes=>strokes.map((stroke,index)=>index===strokes.length-1?[...stroke,point]:stroke));
}
export function endStroke(event){
 try{if(event.currentTarget?.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}catch{/* Already released by a touch cancellation. */}
}
