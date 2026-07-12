"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Check, Clock3, Flame, Layers3 } from "lucide-react";
import type { Project } from "@/lib/projects";
import type { ProjectOutline } from "@/lib/walkthroughs";
import { useJourney } from "@/lib/progress";
import { WalkthroughNavbar } from "./walkthrough-navbar";

export function WalkthroughIndex({ project, outline }: { project: Project; outline: ProjectOutline }) {
  const { state } = useJourney(); const done = new Set(state.walkthroughSteps); const completed = outline.parts.flatMap(part=>part.steps).filter(step=>done.has(step.id)).length;
  return <main className="walkthrough-shell"><WalkthroughNavbar projectSlug={project.slug} projectTitle={project.title}/><div className="walk-index-wrap">
    <section className="walk-index-hero"><div><span className="walk-breadcrumb">ML JOURNEY / FULL WALKTHROUGH</span><h1>{project.title}</h1><p>{project.description}</p><div className="walk-index-meta"><span><Layers3/>{outline.parts.length} parts</span><span><BookOpen/>{outline.totalSteps} individual lessons</span><span><Clock3/>{Math.round(project.minutes/6)/10} estimated hours</span><span><Flame/>{outline.totalSteps*5} XP available</span></div></div><div className="walk-course-progress"><div className="walk-course-art"><Image src={`/project-art/${project.slug}.svg`} alt={`${project.title} project artwork`} fill priority/></div><strong>{Math.round(completed/outline.totalSteps*100)}%</strong><span>{completed} of {outline.totalSteps} complete</span><div className="progress"><i style={{width:`${completed/outline.totalSteps*100}%`}}/></div><Link href={`/walkthrough/${project.slug}/${outline.parts.flatMap(part=>part.steps).find(step=>!done.has(step.id))?.id ?? outline.parts[0].steps[0].id}`}>{completed?"Continue learning":"Start walkthrough"}<ArrowRight/></Link></div></section>
    <section className="walk-promise"><strong>No compressed chapters.</strong><p>Every source step is its own lesson with intuition, concepts, correctly rendered MathJax mathematics, implementation, tests, mistakes, and a checkpoint.</p></section>
    <div className="walk-parts">{outline.parts.map(part=><article key={part.id}><header><span>{String(part.order).padStart(2,"0")}</span><div><small>PART {part.order}</small><h2>{part.title}</h2><p>{part.description}</p></div><strong>{part.steps.filter(step=>done.has(step.id)).length}/{part.steps.length}</strong></header><div>{part.steps.map(step=><Link href={`/walkthrough/${project.slug}/${step.id}`} key={step.id}><span className={done.has(step.id)?"done":""}>{done.has(step.id)?<Check/>:String(step.order).padStart(3,"0")}</span><strong>{step.title.replaceAll("_"," ")}</strong><small>+{step.points} XP</small><ArrowRight/></Link>)}</div></article>)}</div>
  </div></main>;
}
