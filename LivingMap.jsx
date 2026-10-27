import React,{useEffect,useRef,useState} from 'react';
import {Pause,Play,RotateCcw} from 'lucide-react';
import {t} from './interface-runtime.mjs';
import './living-map.css';
export default function LivingMap({chapters,width,height,districtWidth=width}){
 const completed=chapters.filter(c=>c.lessons.length&&c.completed===c.lessons.length).length,phase=Math.min(4,completed);
 const [paused,setPaused]=useState(false),[replay,setReplay]=useState(0),[entering,setEntering]=useState(false),previous=useRef(completed);
 useEffect(()=>{if(completed>previous.current){setReplay(n=>n+1);setEntering(true)}previous.current=completed;const timer=setTimeout(()=>setEntering(false),7000);return()=>clearTimeout(timer)},[completed]);
 const labels=['A world that grows with you','The station is restored','The café is open','The neighbourhood is blooming','Warm lights across your neighbourhood'];
 return <div className={'living-map phase-'+phase+(paused?' motion-paused':'')+(entering?' world-changing':'')} data-phase={phase}>
 <div className="living-map-dusk"/>
 <svg className="living-map-scenery" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" key={replay}>
 {Array.from({length:Math.max(1,Math.round(width/districtWidth))},(_,district)=>{const w=width/Math.max(1,Math.round(width/districtWidth)),x=district*w;return <g key={district} transform={`translate(${x} 0)`}>
 {phase>=4&&<g className="world-stars"><circle cx={w*.78} cy="32" r="11" fill="#fff1bd"/>{[.12,.28,.48,.66,.91].map((v,i)=><circle key={v} cx={w*v} cy={22+i%3*16} r="1.4" fill="#fff4cd"/>)}</g>}
 {phase>=1&&<g className="world-station" transform={`translate(${w*.06} ${height-105})`}>
 <ellipse cx="80" cy="91" rx="90" ry="12" fill="#292e3830"/><rect x="0" y="76" width="172" height="12" rx="3" fill="#afa493"/><rect x="14" y="25" width="137" height="52" fill="#ddd0ae" stroke="#867a68"/><path d="M4 27L37 5H127L162 27Z" fill="#69796f" stroke="#47594f" strokeWidth="2"/><path d="M12 30H153" stroke="#dbe1c5" strokeWidth="4"/>
 <rect className="world-door" x="67" y="42" width="23" height="35" rx="10" fill="#534e52"/>{[25,109,129].map(a=><rect className="world-window" key={a} x={a} y="43" width="12" height="20" rx="2" fill="#ffe3a0"/>)}<circle cx="80" cy="24" r="11" fill="#faf4d6" stroke="#766852"/><path d="M80 17V24L85 27" stroke="#5d655f" fill="none" strokeWidth="2"/>
 <path d="M-15 90H190M-15 97H190" stroke="#726e6c" strokeWidth="2"/>
 </g>}
 {phase>=2&&<g className="world-cafe" transform={`translate(${w*.61} ${height-91})`}>
 <rect x="0" y="12" width="105" height="65" rx="3" fill="#ead9bc" stroke="#9c826a"/><path d="M-8 14L17-1H88L112 14Z" fill="#8c786b"/>
 <rect className="world-door" x="42" y="40" width="19" height="37" rx="2" fill="#63564d"/>{[8,69].map(a=><rect className="world-window" x={a} y="40" width="27" height="22" fill="#ffdc93" key={a}/>)}
 <g className="cafe-awning"><path d="M-6 28H112L106 43H0Z" fill="#718f77"/>{[0,24,48,72,96].map(a=><path key={a} d={`M${a} 28h10l2 15h-14Z`} fill="#fff2d7"/>)}</g>
 <g transform="translate(12 67)"><path d="M-10 5H18M4 5V17" stroke="#715b4a" strokeWidth="3"/><path d="M-2-4H8V3H-2Z M8-3Q15-4 10 1" stroke="#fff7df" strokeWidth="2" fill="#decba5"/><path className="cafe-steam" d="M2-8q-5-5 0-10t0-10" fill="none" stroke="#fff9e4" strokeWidth="2"/></g>
 </g>}
 {phase>=3&&<g className="world-garden" transform={`translate(${w*.37} ${height-25})`}>
 <ellipse cx="20" cy="2" rx="46" ry="9" fill="#76956b99"/>{[-15,0,16,34,49].map((a,i)=><g className="world-flower" key={a} style={{animationDelay:i*.2+'s'}} transform={`translate(${a} 0)`}><path d="M0 0Q-6-12 0-24M0-8Q-14-19-10-8M0-11Q14-22 10-11" fill="#78976a" stroke="#5d875c" strokeWidth="2"/><g fill={i%2?'#e7b679':'#dc9fb3'}>{[0,72,144,216,288].map(deg=><ellipse key={deg} cx="0" cy="-29" rx="4" ry="6" transform={`rotate(${deg} 0 -24)`}/>)}</g><circle cy="-24" r="3" fill="#fff0b0"/></g>)}
 <g className="world-gardener"><circle cx="-35" cy="-37" r="6" fill="#d7ae8b"/><path d="M-39-30L-29-30L-25-13H-41Z" fill="#788e9b"/><path className="gardener-arm" d="M-30-26L-19-18L-8-24" stroke="#d7ae8b" strokeWidth="4" fill="none"/><path d="M-36-13L-39 0M-30-13L-27 0" stroke="#59616c" strokeWidth="4"/><circle cx="-6" cy="-27" r="5" fill="#e7b4c6"/></g>
 </g>}
 {phase>=4&&<g className="world-lamps">{[.05,.55,.94].map((v,i)=><g key={v} transform={`translate(${w*v} ${height-80-i%2*22})`}><circle className="lamp-halo" cy="-15" r="28" fill="#ffe2a450"/><path d="M0 0V55M-7 0H7L5-15H-5Z" stroke="#786c61" strokeWidth="3" fill="#ffe5a2"/><circle className="world-window" cy="-7" r="7" fill="#ffeab8"/></g>)}</g>}
 </g>})}
 {phase>=1&&<g className="world-train"><g transform={`translate(-155 ${height-13})`}><rect x="0" y="-31" width="145" height="29" rx="9" fill="#718c7e" stroke="#405e52" strokeWidth="2"/><path d="M4-13H141" stroke="#e9d5a9" strokeWidth="4"/>{[13,36,59,82,105].map(x=><rect className="world-window" key={x} x={x} y="-26" width="16" height="10" rx="2" fill="#ffe7b1"/>)}<path d="M134-26h6v10h-6Z" fill="#d5e1d8"/>{[21,55,96,129].map(x=><circle key={x} cx={x} cy="-1" r="4" fill="#45544c"/>)}</g></g>}
 </svg>
 <div className="living-map-controls" onPointerDown={e=>e.stopPropagation()}><span role="status" aria-live="polite">{t(labels[phase])}</span>{phase>0&&<><button type="button" onClick={()=>{setPaused(false);setReplay(n=>n+1)}} aria-label={t('Replay world restoration')}><RotateCcw size={14}/></button><button type="button" onClick={()=>setPaused(v=>!v)} aria-pressed={paused} aria-label={t(paused?'Resume map motion':'Pause map motion')}>{paused?<Play size={14}/>:<Pause size={14}/>}</button></>}</div>
 </div>
}
