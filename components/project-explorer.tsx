"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, Check, Clock3, Search, SlidersHorizontal } from "lucide-react";
import { projects } from "@/lib/projects";
import { useJourney } from "@/lib/progress";
import { Header } from "./header";

export function ProjectExplorer() {
  const { state, bookmark } = useJourney();
  const [query, setQuery] = useState(""); const [difficulty, setDifficulty] = useState("All"); const [category, setCategory] = useState("All"); const [status, setStatus] = useState("All"); const [sort, setSort] = useState("Journey");
  const categories = ["All", ...Array.from(new Set(projects.map(p=>p.category)))];
  const list = useMemo(() => projects.map((p,index)=>({p,index})).filter(({p}) => {
    const projectStatus = state.completed.includes(p.slug) ? "Completed" : "Available";
    return (difficulty === "All" || p.difficulty === difficulty) && (category === "All" || p.category === category) && (status === "All" || status === projectStatus || (status === "Bookmarked" && state.bookmarks.includes(p.slug))) && `${p.title} ${p.description} ${p.framework}`.toLowerCase().includes(query.toLowerCase());
  }).sort((a,b)=>sort === "Duration" ? a.p.minutes-b.p.minutes : sort === "Difficulty" ? ["Easy","Medium","Hard"].indexOf(a.p.difficulty)-["Easy","Medium","Hard"].indexOf(b.p.difficulty) : a.index-b.index), [query,difficulty,category,status,sort,state]);
  return <main className="app-shell"><Header active="projects"/><section className="page-heading section-wrap"><span className="kicker">PROJECT LIBRARY</span><h1>Explore the journey</h1><p>Every project is open. Start anywhere, follow your curiosity, and learn at your own pace.</p></section>
    <section className="filters section-wrap"><label className="searchbox"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search projects, skills, frameworks…"/></label><select value={difficulty} onChange={e=>setDifficulty(e.target.value)} aria-label="Difficulty"><option>All</option><option>Easy</option><option>Medium</option><option>Hard</option></select><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Category">{categories.map(c=><option key={c}>{c}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value)} aria-label="Status">{["All","Available","Completed","Bookmarked"].map(c=><option key={c}>{c}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort"><option>Journey</option><option>Duration</option><option>Difficulty</option></select></section>
    <section className="section-wrap"><div className="results-title"><span><SlidersHorizontal/> {list.length} projects · all open</span><small>Progress and bookmarks are stored locally</small></div><div className="project-grid">{list.map(({p,index})=>{const done=state.completed.includes(p.slug); return <article className="project-card" key={p.slug} style={{"--node":p.color} as React.CSSProperties}><div className="project-art"><span>{String(index+1).padStart(2,"0")}</span><i/></div><button onClick={()=>bookmark(p.slug)} aria-label="Bookmark" className="bookmark"><Bookmark fill={state.bookmarks.includes(p.slug)?"currentColor":"none"}/></button><div className="project-card-body"><div className="tag-row"><span>{p.difficulty}</span><span>{p.category}</span></div><h2>{p.title}</h2><p>{p.description}</p><div className="card-meta"><span><Clock3/>{Math.round(p.minutes/6)/10}h</span><span>{p.steps} steps</span><span>{p.framework}</span></div><Link href={`/projects/${p.slug}`}>{done?<><Check/> Review project</>:"Start project →"}</Link></div></article>})}</div></section>
  </main>;
}
