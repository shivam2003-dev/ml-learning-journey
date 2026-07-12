"use client";

import Link from "next/link";
import { Activity, Award, BookOpen, Clock3, Flame, Medal, Star, Target, Trophy, Zap } from "lucide-react";
import { projects, totalMinutes } from "@/lib/projects";
import { useJourney } from "@/lib/progress";
import { Header } from "./header";
import { GitHubPanel } from "./github-panel";

export function Dashboard() {
  const { state, stats, setDailyGoal } = useJourney();
  const current = projects[Math.min(state.completed.length, projects.length - 1)];
  const recent = state.activity.slice(0, 5);
  const cats = Array.from(new Set(projects.map(p => p.category))).map(name => ({ name, total: projects.filter(p => p.category === name).length, done: projects.filter(p => p.category === name && state.completed.includes(p.slug)).length }));
  const days = Array.from({ length: 84 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 83 + i); const date = d.toISOString().slice(0, 10); return { date, count: state.activity.filter(a => a.at.slice(0, 10) === date).length }; });
  const achievements = [
    { name: "First Commit", hint: "Complete your first project", earned: state.completed.length >= 1, icon: <Zap/> },
    { name: "On Fire", hint: "Build a 3-day streak", earned: stats.streak >= 3, icon: <Flame/> },
    { name: "Explorer", hint: "Complete 5 projects", earned: state.completed.length >= 5, icon: <Medal/> },
    { name: "Centurion", hint: "Earn 10,000 XP", earned: stats.xp >= 10_000, icon: <Trophy/> },
  ];
  const velocity = state.completed.length ? Math.round(state.completed.length / Math.max(1, (Date.now() - new Date(state.startedAt).getTime()) / 604_800_000) * 10) / 10 : 0;

  return <main className="app-shell"><Header active="dashboard"/>
    <section className="page-heading section-wrap"><span className="kicker">COMMAND CENTER</span><h1>Your learning dashboard</h1><p>Momentum, mastery, and the next useful move.</p></section>
    <section className="section-wrap dashboard-stats">
      <article><Zap/><small>LEVEL</small><strong>{stats.level}</strong><div className="progress"><i style={{width:`${stats.levelXp/10}%`}}/></div><p>{1000-stats.levelXp} XP to next level</p></article>
      <article><Trophy/><small>PROJECTS</small><strong>{state.completed.length}<em> / {projects.length}</em></strong><p>{stats.completion}% complete</p></article>
      <article><Clock3/><small>HOURS INVESTED</small><strong>{stats.hours}</strong><p>{Math.ceil((totalMinutes-stats.hours*60)/60)} hours remaining</p></article>
      <article><Flame/><small>DAILY / WEEKLY STREAK</small><strong>{stats.streak}<em> days</em></strong><p>{stats.weeklyDays} active days this week</p></article>
    </section>
    <section className="section-wrap dashboard-grid">
      <article className="dash-card wide"><div className="card-heading"><div><small>LEARNING CALENDAR</small><h2>Consistency compounds</h2></div><span><Activity/> Last 12 weeks</span></div><div className="heatmap">{days.map(day=><i key={day.date} title={`${day.date}: ${day.count} activities`} data-level={Math.min(4,day.count)}/>)}</div><div className="heat-legend"><span>Less</span>{[0,1,2,3,4].map(i=><i key={i} data-level={i}/>)}<span>More</span></div></article>
      <article className="dash-card next-card"><small>CURRENT QUEST</small><div className="quest-orb" style={{"--node":current.color} as React.CSSProperties}><Target/></div><h2>{current.title}</h2><p>{current.subtitle}</p><Link className="button primary" href={`/projects/${current.slug}`}>Continue project →</Link></article>
      <article className="dash-card"><div className="card-heading"><div><small>DAILY GOAL</small><h2>{stats.todayMinutes} / {state.dailyGoal} minutes</h2></div><Target/></div><div className="progress large"><i style={{width:`${Math.min(100,stats.todayMinutes/state.dailyGoal*100)}%`}}/></div><div className="goal-options">{[15,30,60,90].map(goal=><button className={state.dailyGoal===goal?"active":""} onClick={()=>setDailyGoal(goal)} key={goal}>{goal}m</button>)}</div><p className="dash-note">Choose a sustainable target. Completing a project logs focused learning activity.</p></article>
      <article className="dash-card"><div className="card-heading"><div><small>LEARNING VELOCITY</small><h2>{velocity} projects / week</h2></div><Activity/></div><div className="velocity-chart">{[.3,.55,.4,.7,.52,.83,Math.min(1,.25+velocity/5)].map((height,i)=><i key={i} style={{height:`${height*100}%`}}/>)}</div><p className="dash-note">Based on progress since {new Date(state.startedAt).toLocaleDateString()}.</p></article>
      <article className="dash-card"><div className="card-heading"><div><small>SKILL TREE</small><h2>Category mastery</h2></div><span>{stats.skillPoints} points</span></div><div className="category-bars">{cats.slice(0,7).map(c=><div key={c.name}><span>{c.name}<b>{c.done}/{c.total}</b></span><div className="progress"><i style={{width:`${c.done/c.total*100}%`}}/></div></div>)}</div></article>
      <article className="dash-card"><div className="card-heading"><div><small>RECENT ACTIVITY</small><h2>Your latest wins</h2></div><Award/></div>{recent.length?<div className="activity-list">{recent.map((a,i)=>{const p=projects.find(p=>p.slug===a.slug)!;return <div key={a.at+i}><span><Star/></span><p><strong>{p.title}</strong><small>Completed · {new Date(a.at).toLocaleDateString()}</small></p><b>+{p.steps*20} XP</b></div>})}</div>:<div className="empty-state"><Award/><p>Your first achievement is waiting.</p><Link href={`/projects/${current.slug}`}>Start the journey</Link></div>}</article>
      <article className="dash-card wide"><div className="card-heading"><div><small>ACHIEVEMENTS</small><h2>Milestones that matter</h2></div><Award/></div><div className="achievement-grid">{achievements.map(a=><div className={a.earned?"earned":""} key={a.name}><span>{a.icon}</span><strong>{a.name}</strong><small>{a.earned?"Unlocked":a.hint}</small></div>)}</div></article>
      <article id="leaderboard" className="dash-card wide"><div className="card-heading"><div><small>LOCAL LEADERBOARD</small><h2>This week&apos;s builders</h2></div><Trophy/></div><div className="leaderboard">{[["AK","Aarav K.",8420],["MR","Maya R.",7960],["SK","You",stats.xp],["NI","Nikhil I.",3150]].sort((a,b)=>Number(b[2])-Number(a[2])).map((u,i)=><div className={u[1]==="You"?"you":""} key={String(u[1])}><b>#{i+1}</b><span>{u[0]}</span><strong>{u[1]}</strong><em>{Number(u[2]).toLocaleString()} XP</em></div>)}</div></article>
      <GitHubPanel repositories={state.repositories}/>
      <article className="dash-card wide"><div className="card-heading"><div><small>LATEST BLOGS</small><h2>Your project write-ups</h2></div><BookOpen/></div><div className="blog-cards">{projects.slice(Math.max(0,state.completed.length-3),Math.max(3,state.completed.length)).map(p=><a href={`https://ml.shivam2003.com/blog/${p.slug}`} target="_blank" rel="noreferrer" key={p.slug}><span style={{background:p.color}}/><small>{p.category}</small><strong>{p.title}</strong><em>Read project story →</em></a>)}</div></article>
    </section>
  </main>;
}
