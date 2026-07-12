"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, Check, ChevronDown, Clock3, Flame, Search, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { projects, totalMinutes } from "@/lib/projects";
import { useJourney } from "@/lib/progress";
import { Header } from "./header";
import { StatPill } from "./stat-pill";

export function Roadmap() {
  const { state, stats } = useJourney();
  const [zoom, setZoom] = useState(1);
  const current = Math.min(state.completed.length, projects.length - 1);
  const remaining = Math.max(0, totalMinutes - stats.hours * 60);

  return <main className="app-shell">
    <Header />
    <section className="hero section-wrap">
      <div className="eyebrow"><Sparkles size={14}/> YOUR MACHINE LEARNING ODYSSEY</div>
      <h1>Master Machine Learning.<br/><span>One Project at a Time.</span></h1>
      <p>A project-first path from classical algorithms to production AI systems. Build, learn, and leave a trail worth sharing.</p>
      <div className="hero-actions"><a className="button primary" href={`#project-${current}`}><Zap size={17}/> Continue Journey</a><Link className="button ghost" href="/projects"><Search size={17}/> Explore Projects</Link></div>
      <div className="stats-row" aria-label="Journey statistics">
        <StatPill icon={<Zap/>} label="CURRENT LEVEL" value={stats.level} tone="purple"/>
        <StatPill icon={<Sparkles/>} label="TOTAL XP" value={stats.xp.toLocaleString()} tone="blue"/>
        <StatPill icon={<Flame/>} label="DAY STREAK" value={`${stats.streak} days`} tone="orange"/>
        <StatPill icon={<Trophy/>} label="GLOBAL RANK" value="#12,847" tone="gold"/>
      </div>
    </section>

    <section className="journey section-wrap">
      <div className="section-title"><div><span className="kicker">THE PATH AHEAD</span><h2>Your Learning Journey</h2><p>Complete each project to unlock the next challenge.</p></div><div className="overall"><span>{state.completed.length} of {projects.length} completed</span><div className="progress"><i style={{ width: `${stats.completion}%` }}/></div><strong>{stats.completion}%</strong></div></div>
      <div className="map-tools"><button onClick={()=>setZoom(z=>Math.min(1.15,z+.05))} aria-label="Zoom in">+</button><button onClick={()=>setZoom(z=>Math.max(.85,z-.05))} aria-label="Zoom out">−</button><button onClick={()=>document.getElementById(`project-${current}`)?.scrollIntoView({behavior:"smooth",block:"center"})} aria-label="Center map">◎</button></div>
      <aside className="mini-map" aria-label="Roadmap mini map">{projects.map((project,index)=><a title={project.title} aria-label={`Jump to ${project.title}`} className={state.completed.includes(project.slug)?"complete":index===current?"current":""} href={`#project-${index}`} key={project.slug}/>)}</aside>
      <div className="roadmap" style={{ "--progress": `${Math.max(1, stats.completion)}%`, "--zoom":zoom } as React.CSSProperties}>
        <div className="road-line"/><div className="road-line done"/>
        {projects.map((project, index) => {
          const complete = state.completed.includes(project.slug);
          const active = index === current;
          const side = index % 2 === 0 ? "left" : "right";
          return <article id={`project-${index}`} key={project.slug} className={`road-item ${side} ${complete ? "complete" : active ? "current" : "unlocked"}`}>
            <div className="road-copy">
              <span className="project-number">PROJECT {String(index + 1).padStart(2, "0")}</span>
              <h3>{project.title}</h3><p>{project.description}</p>
              <div className="tag-row"><span>{project.difficulty}</span><span>{project.framework}</span><span><Clock3 size={12}/>{Math.round(project.minutes / 6) / 10}h</span></div>
              <Link href={`/projects/${project.slug}`} className="text-link">Start anywhere <span>→</span></Link>
            </div>
            <Link aria-label={`${project.title} ${complete ? "completed" : active ? "recommended — you are here" : "available"}`} href={`/projects/${project.slug}`} className="road-node" style={{ "--node": project.color } as React.CSSProperties}>
              <span className="node-ring"/><span className="node-core">{complete ? <Check/> : active ? <Zap/> : <Star/>}</span>
              {active && <span className="you-are-here">YOU ARE HERE</span>}
            </Link>
          </article>;
        })}
        <div className="finish"><span><Award/></span><strong>Mastery awaits</strong><small>Complete the journey</small></div>
      </div>
    </section>

    <section className="section-wrap insight-grid">
      <article className="glass-card"><span className="card-icon purple"><Zap/></span><div><small>LEARNING SCORE</small><strong>{Math.min(999, stats.xp + stats.skillPoints * 10)}</strong><p>Top 18% of learners</p></div><div className="ring" style={{ "--pct": `${Math.max(3, stats.completion)}%` } as React.CSSProperties}><span>{stats.completion}%</span></div></article>
      <article className="glass-card"><span className="card-icon orange"><Clock3/></span><div><small>TIME REMAINING</small><strong>{Math.ceil(remaining / 60)} hours</strong><p>At your current pace</p></div><ChevronDown/></article>
      <article className="glass-card"><span className="card-icon gold"><Trophy/></span><div><small>NEXT MILESTONE</small><strong>{Math.min(5, Math.ceil((state.completed.length + 1) / 5) * 5)} Projects</strong><p>{Math.max(0, 5 - state.completed.length % 5)} projects to go</p></div><Star/></article>
    </section>

    <footer><div className="section-wrap footer-inner"><span>ML Journey</span><p>Built for builders. Progress is saved locally in your browser.</p><a href="#top">Back to top ↑</a></div></footer>
  </main>;
}
