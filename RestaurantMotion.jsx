import React from 'react';
const size=([x,y,w,h])=>({left:x/19.2+'%',top:y/8.96+'%',width:w/19.2+'%',height:h/8.96+'%'});
export default function RestaurantMotion({motion}){
 const scale=motion.tableScale??1;
 return <>{motion.tables.flatMap(([x,y],table)=>[0,1].map(side=>{const view=side?'front':'back';return <span className="painted-diner" data-moving-object="diner" key={table+':'+side} style={{...size([x+(side?8:-30)*scale,y-(side?35:31)*scale,23*scale,32*scale]),'--diner-facing':side?-1:1,'--diner-period':(4.2+table*.6+side*.4)+'s','--diner-delay':(-table*1.7-side*2)+'s','--diner-hue':(table*12-16)+'deg'}}><img src={motion.dinerSprites[view].src} alt="" draggable="false"/></span>}))}
 {motion.tables.map(([x,y],i)=><span className="painted-table" key={i} data-fixed-furniture="true" style={size([x-36*scale,y-17*scale,72*scale,48*scale])}><img src={motion.tableSprite.src} alt="" draggable="false"/></span>)}</>;
}
