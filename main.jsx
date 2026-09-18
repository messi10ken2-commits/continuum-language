import React, {useMemo, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BookOpen, CalendarDays, Check, ChevronRight, CirclePlay, Clock3, Flame, GraduationCap, Headphones, LayoutDashboard, MessageCircle, Mic2, NotebookPen, Search, Sparkles, Target, TrendingUp, Users, WandSparkles} from 'lucide-react';
import './styles.css';

const skills = [
  {name:'Listening', level:'B2−', score:74, delta:'+6', color:'#5b72f2'},
  {name:'Grammar', level:'B1', score:62, delta:'+9', color:'#f17c54'},
  {name:'Pronunciation', level:'B2', score:78, delta:'+4', color:'#21a77a'},
  {name:'Speaking', level:'B1+', score:69, delta:'+7', color:'#9a67e8'},
];
const issues = [
  {name:'Subjunctive', score:81, from:58, status:'Improving', color:'#ee6c4d'},
  {name:'Por vs. para', score:64, from:61, status:'Needs practice', color:'#e7a83a'},
  {name:'Articles', score:71, from:68, status:'Review', color:'#6178e9'},
];

function Ring({value, label}) {return <div className="ring" style={{'--p':`${value*3.6}deg`}}><div><b>{value}%</b><span>{label}</span></div></div>}
function Metric({item}) {return <div className="metric"><div className="metric-top"><span>{item.name}</span><b style={{color:item.color}}>{item.level}</b></div><div className="bar"><i style={{width:`${item.score}%`,background:item.color}}/></div><div className="metric-foot"><span>{item.score}/100</span><span className="up"><TrendingUp size={13}/> {item.delta}</span></div></div>}
function App(){
 const [role,setRole]=useState('learner'); const [tab,setTab]=useState('Overview'); const [done,setDone]=useState(false);
 const teacher=role==='teacher';
 const title=teacher?'Ken’s learning memory':'Good evening, Ken';
 const subtitle=teacher?'One continuous record—across self-study and every class.':'Your Spanish is moving. Here’s the clearest next step.';
 const nav=teacher?['Overview','Learning memory','Class notes','Assignments']:['Overview','Learn','My classes','Learning memory'];
 return <div className="app">
  <aside>
   <div className="brand"><div className="logo">C</div><span>Continuum<small>LEARN WITHOUT RESETTING</small></span></div>
   <nav>{nav.map((n,i)=>{const Icon=[LayoutDashboard,BookOpen,CalendarDays,NotebookPen][i];return <button className={tab===n?'active':''} onClick={()=>setTab(n)} key={n}><Icon size={19}/>{n}</button>})}</nav>
   <div className="side-card"><Sparkles size={20}/><b>{teacher?'AI class copilot':'Your memory travels'}</b><p>{teacher?'Capture patterns during class and turn them into targeted practice.':'Every teacher sees where you are—so you never start from zero.'}</p></div>
   <div className="profile"><div className="avatar">KI</div><span><b>Ken Ishizawa</b><small>{teacher?'Teacher view':'Spanish · B1+'}</small></span><ChevronRight size={17}/></div>
  </aside>
  <main>
   <header><div className="mobile-brand">Continuum</div><div className="search"><Search size={18}/><span>Search lessons, skills, notes…</span></div><div className="role"><button className={!teacher?'on':''} onClick={()=>setRole('learner')}>Learner</button><button className={teacher?'on':''} onClick={()=>setRole('teacher')}>Teacher</button></div></header>
   <div className="content">
    <section className="welcome"><div><span className="eyebrow">{teacher?'LEARNER  /  SPANISH':'WEDNESDAY · 16 SEPTEMBER'}</span><h1>{title}</h1><p>{subtitle}</p></div><button className="secondary"><CalendarDays size={17}/>{teacher?'Schedule class':'View plan'}</button></section>
    {!teacher && <section className="hero-card"><div className="hero-copy"><span className="pill"><WandSparkles size={14}/> Generated from your last class</span><h2>Make the subjunctive automatic</h2><p>Your teacher noticed hesitation after expressions of doubt. This 12-minute practice targets exactly that pattern.</p><div className="hero-meta"><span><Clock3 size={16}/>12 min</span><span><Target size={16}/>B1 → B1+</span><span><Flame size={16}/>+30 XP</span></div><button onClick={()=>setDone(!done)}><CirclePlay size={19}/>{done?'Practice completed':'Start targeted practice'}</button></div><div className="hero-art"><div className="bubble b1">Es posible que…</div><div className="bubble b2">venga ✓</div><div className="orb"><Sparkles size={42}/></div></div></section>}
    {teacher && <section className="teacher-alert"><div className="ai-icon"><Sparkles/></div><div><span className="eyebrow">AI CLASS INSIGHT</span><h2>Subjunctive accuracy improved, but spontaneous use still lags</h2><p>Ken scores 81% in exercises, yet used the indicative in 3 of 7 spontaneous speaking opportunities last class.</p></div><button onClick={()=>setDone(!done)}>{done?<><Check size={17}/>Assigned</>:<>Assign practice<ChevronRight size={17}/></>}</button></section>}
    <div className="grid">
     <section className="panel progress"><div className="panel-head"><div><span className="eyebrow">SHARED PROFICIENCY</span><h3>Current level profile</h3></div><button>Full report <ChevronRight size={15}/></button></div><div className="profile-level"><Ring value={69} label="B1+ overall"/><div className="skill-list">{skills.map(x=><Metric item={x} key={x.name}/>)}</div></div></section>
     <section className="panel streak"><div className="panel-head"><div><span className="eyebrow">MOMENTUM</span><h3>{teacher?'Engagement':'This week'}</h3></div></div><div className="streak-number"><Flame fill="#ff8a4b" color="#ff8a4b"/><b>12</b><span>day streak</span></div><div className="days">{['M','T','W','T','F','S','S'].map((d,i)=><span key={i} className={i<5?'hit':i===5?'today':''}>{i<5?<Check size={14}/>:d}</span>)}</div><div className="completion"><span>Homework completion <b>82%</b></span><div className="bar"><i style={{width:'82%'}}/></div></div></section>
     <section className="panel recurring"><div className="panel-head"><div><span className="eyebrow">LEARNING MEMORY</span><h3>Recurring patterns</h3></div><button>See history <ChevronRight size={15}/></button></div><div>{issues.map(i=><div className="issue" key={i.name}><div className="issue-name"><span style={{background:i.color}}/><b>{i.name}</b><small>{i.status}</small></div><div className="issue-score"><span>{i.from}%</span><ChevronRight size={14}/><b>{i.score}%</b><div className="mini"><i style={{width:`${i.score}%`,background:i.color}}/></div></div></div>)}</div></section>
     <section className="panel activity"><div className="panel-head"><div><span className="eyebrow">ONE CONTINUOUS TIMELINE</span><h3>Recent learning</h3></div></div><div className="timeline">
      <div><span className="event-icon ai"><Sparkles size={16}/></span><i/><article><b>AI practice · Subjunctive</b><p>18 questions · 81% accuracy</p><small>Today, 18:42</small></article></div>
      <div><span className="event-icon class"><Users size={16}/></span><i/><article><b>Class with María</b><p>Conversation: travel & authentic experiences</p><small>Yesterday, 19:00 · 4 insights captured</small></article></div>
      <div><span className="event-icon listen"><Headphones size={16}/></span><article><b>Listening practice</b><p>Airport vlog · B2− comprehension</p><small>14 Sep · 92% complete</small></article></div>
     </div></section>
    </div>
    {!teacher && <section className="class-cta"><div className="faces"><span>MA</span><span>JL</span><span>AR</span></div><div><b>Ready to turn practice into real conversation?</b><p>Your teacher sees this full learning memory before class.</p></div><button>Find a teacher <ChevronRight size={17}/></button></section>}
   </div>
  </main>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
