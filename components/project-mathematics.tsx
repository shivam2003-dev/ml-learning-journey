"use client";

import Link from "next/link";
import { MathJax } from "better-react-mathjax";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Binary, BookOpen, Braces, Calculator, Code2, Lightbulb, ShieldCheck, Sigma } from "lucide-react";
import type { Project } from "@/lib/projects";
import { buildMathTopics } from "@/lib/project-math";
import { Header } from "./header";

function Equation({ value }: { value: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <div className="math-equation" suppressHydrationWarning>{mounted ? <MathJax dynamic>{`\\[${value}\\]`}</MathJax> : <span>Loading equation…</span>}</div>;
}

function InlineEquation({ value }: { value: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <span suppressHydrationWarning>{mounted ? <MathJax dynamic inline>{`\\(${value}\\)`}</MathJax> : value}</span>;
}

export function ProjectMathematics({ project }: { project: Project }) {
  const topics = buildMathTopics(project);
  return <main className="app-shell reading-shell"><Header active="projects"/><article className="mathematics-page">
    <Link className="back" href={`/projects/${project.slug}`}><ArrowLeft/> Project overview</Link>
    <header className="math-hero"><div><span className="kicker">MATHEMATICS & VISUAL EXPLANATION</span><h1>{project.title}</h1><p>Derive the core equations slowly, attach every symbol to code, and verify the result with small numerical examples before scaling the implementation.</p><div className="article-meta"><span>{topics.length} mathematical chapters</span><span>MathJax rendered</span><span>Worked examples</span><span>Numerical stability</span></div></div><Sigma/></header>
    <nav className="math-toc"><strong>On this page</strong>{topics.map((topic,index)=><a href={`#math-${index+1}`} key={topic.title}>{index+1}. {topic.title}</a>)}</nav>
    <section className="math-reading-guide"><Lightbulb/><div><h2>How to study the mathematics</h2><p>Read each chapter in four passes: intuition, symbols, derivation, and implementation. Recalculate the worked example by hand. Then change one number and predict the direction of the result before running code.</p></div></section>
    {topics.map((topic,index)=><section className="math-topic" id={`math-${index+1}`} key={`${topic.title}-${index}`}>
      <header><span>{String(index+1).padStart(2,"0")}</span><div><small>FIRST-PRINCIPLES DERIVATION</small><h2>{topic.title}</h2></div></header>
      <div className="math-intuition"><BookOpen/><div><h3>Intuition before notation</h3><p>{topic.intuition}</p></div></div>
      <Equation value={topic.equation}/>
      <div className="math-symbols"><h3><Braces/> Symbol dictionary</h3><dl>{topic.symbols.map(([symbol,meaning])=><div key={symbol}><dt><InlineEquation value={symbol}/></dt><dd>{meaning}</dd></div>)}</dl></div>
      <div className="math-derivation"><h3><Binary/> Derive it one move at a time</h3><ol>{topic.derivation.map((step,stepIndex)=><li key={step}><span>{stepIndex+1}</span><p>{step}</p></li>)}</ol></div>
      <div className="math-visual" aria-label={`${topic.title} visual computation flow`}><div><small>INPUT</small><strong>Known quantities</strong></div><ArrowRight/><div><small>TRANSFORM</small><strong>{topic.title}</strong></div><ArrowRight/><div><small>CHECK</small><strong>Value, shape, invariant</strong></div></div>
      <div className="math-example"><Calculator/><div><h3>Worked numerical example</h3><p>{topic.workedExample}</p></div></div>
      <div className="math-code-bridge"><h3><Code2/> Translate the derivation into code</h3><ul>{topic.codeBridge.map((note)=><li key={note}>{note}</li>)}</ul></div>
      <aside><ShieldCheck/><div><strong>Numerical stability and correctness</strong><p>{topic.stability}</p></div></aside>
    </section>)}
    <div className="reading-actions"><Link href={`/projects/${project.slug}/article`}>Read the 10k-word article <ArrowRight/></Link><Link href={`/projects/${project.slug}/architecture`}>Study the architecture <ArrowRight/></Link><Link href={`/walkthrough/${project.slug}`}>Implement every step <ArrowRight/></Link></div>
  </article></main>;
}
