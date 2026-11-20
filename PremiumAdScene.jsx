import React from 'react';
import {BookOpenCheck,Check,MessageCircle,ShieldCheck,Sparkles,Star,Volume2} from 'lucide-react';
import './premium-ad-scene.css';

export default function PremiumAdScene({scene}){
 return <div className="premium-ad-scene" data-scene={scene} aria-hidden="true">
  <div className="premium-ad-landscape">
   <img src="/membership/premium-flow-v1.webp" alt=""/>
  </div>
  <div className="premium-ad-orbit"/>
  <div className="premium-ad-character">
   <img className="premium-ad-body" src="/companions-v2/capybara-body.webp" alt=""/>
   <img className="premium-ad-face" src="/companions-v2/capybara-head-happy.webp" alt=""/>
  </div>
  {scene===0&&<div className="premium-ad-props">
   <div className="premium-ad-bubble first"><MessageCircle/></div>
   <div className="premium-ad-bubble second"><Volume2/></div>
   <div className="premium-ad-bubble third"><i/><i/><i/></div>
  </div>}
  {scene===1&&<div className="premium-ad-props premium-ad-deck">
   <div className="premium-ad-card first"><BookOpenCheck/></div>
   <div className="premium-ad-card second"><span/><span/><span/></div>
   <div className="premium-ad-card third"><Check/></div>
  </div>}
  {scene===2&&<div className="premium-ad-props">
   <div className="premium-ad-shield"><ShieldCheck/></div>
   <div className="premium-ad-spark first"><Sparkles/></div>
   <div className="premium-ad-spark second"><Star/></div>
   <div className="premium-ad-spark third"><Sparkles/></div>
  </div>}
  {scene===3&&<div className="premium-ad-props">
   <div className="premium-ad-crown"><Star fill="currentColor"/></div>
   <div className="premium-ad-spark first"><Sparkles/></div>
   <div className="premium-ad-spark second"><Star/></div>
   <div className="premium-ad-spark third"><Sparkles/></div>
  </div>}
 </div>;
}
