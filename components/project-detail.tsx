"use client";

import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import { ArrowLeft, Bookmark, BookOpen, Check, Clock3, Code2, Download, ExternalLink, Github, Network, Play, Star, Trophy } from "lucide-react";
import type { Project } from "@/lib/projects";
import { projects } from "@/lib/projects";
import { useJourney } from "@/lib/progress";
import { Header } from "./header";

export function ProjectDetail({ project }: { project: Project }) {
  const { state, complete, bookmark, setStepProgress } = useJourney();
  const index = projects.findIndex((item) => item.slug === project.slug);
  const isComplete = state.completed.includes(project.slug);
  const isBookmarked = state.bookmarks.includes(project.slug);
  const progress = isComplete ? project.steps : Math.min(project.steps, state.stepProgress[project.slug] ?? 0);
  const percent = Math.round(progress / project.steps * 100);
  const toggleComplete = () => { complete(project.slug); if (!isComplete) confetti({ particleCount: 130, spread: 75, origin: { y: .65 }, colors: [project.color, "#ffd768", "#ffffff"] }); };

  return <main className="app-shell"><Header active="projects"/><div className="detail-wrap">
    <Link href="/" className="back"><ArrowLeft size={16}/> Back to roadmap</Link>
    <section className="detail-hero" style={{ "--node": project.color } as React.CSSProperties}>
      <div className="detail-art"><Image src={`/project-art/${project.slug}.svg`} alt={`${project.title} project artwork`} fill priority/><b>{project.framework}</b></div>
      <div className="detail-heading"><div className="eyebrow">PROJECT {String(index + 1).padStart(2, "0")} · {project.category}</div><h1>{project.title}</h1><p className="lead">{project.description}</p>
        <div className="tag-row"><span>{project.difficulty}</span><span><Clock3 size={13}/>{Math.round(project.minutes / 6) / 10} hours</span><span>{project.steps} steps</span></div>
        <div className="detail-actions"><button disabled={!isComplete && progress < project.steps} title={progress < project.steps ? "Finish all steps to complete this project" : undefined} onClick={toggleComplete} className={`button primary ${isComplete ? "done" : ""}`}>{isComplete ? <><Check/> Completed</> : <><Play/> Mark complete</>}</button><button className={`icon-button ${isBookmarked ? "selected" : ""}`} onClick={() => bookmark(project.slug)} aria-label="Bookmark project"><Bookmark fill={isBookmarked ? "currentColor" : "none"}/></button></div>
      </div>
    </section>
    <nav className="detail-nav"><a href="#overview">Overview</a><a href="#guided-solution">Guided solution</a><Link href={`/projects/${project.slug}/article`}>First-principles article</Link><Link href={`/projects/${project.slug}/mathematics`}>Mathematics</Link><Link href={`/projects/${project.slug}/architecture`}>Architecture</Link><a href="#progress">Progress</a></nav>
    <div className="detail-grid"><div className="detail-main">
      <section id="overview" className="content-card"><span className="section-icon"><BookOpen/></span><h2>Overview</h2><p>{project.description}</p><h3>What you&apos;ll learn</h3><div className="chip-list">{project.skills.map(skill=><span key={skill}><Check/> {skill}</span>)}</div></section>
      <section id="guided-solution" className="content-card walkthrough-launch"><span className="section-icon"><BookOpen/></span><span className="kicker">FULL WALKTHROUGH</span><h2>Learn every step on its own page</h2><p>This project is no longer compressed into a few chapters. Open the dedicated learning workspace for a lesson-by-lesson explanation with concepts, MathJax mathematics, code, tests, mistakes, checkpoints, and persistent navigation.</p><Link className="button primary" href={`/walkthrough/${project.slug}`}>Open {project.steps}-step walkthrough →</Link></section>
      <section id="progress" className="content-card"><span className="section-icon"><Check/></span><h2>Build progress</h2><div className="project-progress-heading"><strong>{progress} / {project.steps} steps</strong><b>{percent}%</b></div><div className="progress large"><i style={{width:`${percent}%`}}/></div><p>Move the tracker as you finish the original Deep-ML steps. Reaching 100% unlocks the completion action and certificate.</p><input className="step-slider" aria-label="Steps completed" type="range" min="0" max={project.steps} value={progress} onChange={e=>setStepProgress(project.slug,Number(e.target.value))}/><div className="phase-grid">{project.concepts.map((concept,i)=>{const threshold=Math.ceil(project.steps*(i+1)/project.concepts.length);return <button key={concept} className={progress>=threshold?"complete":""} onClick={()=>setStepProgress(project.slug,threshold)}><span>{progress>=threshold?<Check/>:i+1}</span><strong>{concept}</strong><small>Step {Math.max(1,threshold-Math.ceil(project.steps/project.concepts.length)+1)}–{threshold}</small></button>})}</div></section>
      <section id="architecture" className="content-card"><span className="section-icon"><Network/></span><h2>Architecture</h2><p>Work through the system one dependable layer at a time. Each stage feeds the next and remains independently testable.</p><div className="architecture">{project.concepts.map((concept,i)=><div key={concept}><span>{String(i+1).padStart(2,"0")}</span><strong>{concept}</strong>{i < project.concepts.length-1 && <i>→</i>}</div>)}</div></section>
      <section id="mathematics" className="content-card"><span className="section-icon">∑</span><h2>Mathematics & visual explanation</h2><p>Translate the core equations into code, validate intermediate tensors, and compare the implementation with a small numerical reference.</p><div className="formula">objective(θ) = data_term(θ) + λ · regularization(θ)</div><p className="muted">The exact objective evolves with each milestone. Keep a notebook of shapes, invariants, and numerical checks.</p></section>
    </div><aside>
      <section className="side-card"><h3>Project stack</h3><dl><dt>Framework</dt><dd>{project.framework}</dd><dt>Libraries</dt><dd>{project.libraries.join(", ")}</dd><dt>Difficulty</dt><dd>{project.difficulty}</dd><dt>Category</dt><dd>{project.category}</dd></dl></section>
      <section id="resources" className="side-card"><h3>Resources</h3><a href={project.source} target="_blank" rel="noreferrer"><Code2/> Original Deep-ML project <ExternalLink/></a><Link href={`/blog/${project.slug}`}><BookOpen/> Project research blog <ExternalLink/></Link><a href={`https://github.com/shivam2003-dev/ml-learning-journey/blob/main/implementations/${project.slug}/tutorial.ipynb`} target="_blank" rel="noreferrer"><BookOpen/> Executed Jupyter notebook <ExternalLink/></a><a href={`https://github.com/shivam2003-dev/ml-learning-journey/tree/main/implementations/${project.slug}`} target="_blank" rel="noreferrer"><Github/> Production implementation <ExternalLink/></a></section>
      <section className="side-card"><h3>Completion rewards</h3><div className="rewards"><span><Star/> +{project.steps * 20} XP</span><span><Trophy/> +{project.difficulty === "Hard" ? 3 : project.difficulty === "Medium" ? 2 : 1} stars</span></div></section>
      {isComplete&&<section className="side-card certificate"><Trophy/><h3>Project certificate</h3><p>Completed {new Date(state.activity.find(a=>a.slug===project.slug)?.at??Date.now()).toLocaleDateString()}</p><button onClick={()=>window.print()}><Download/> Save certificate</button></section>}
    </aside></div>
  </div></main>;
}
