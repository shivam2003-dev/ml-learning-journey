"use client";

import Link from "next/link";
import { MathJax } from "better-react-mathjax";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Brain, Check, ChevronRight, Clipboard, Code2, Eye, Flame, FlaskConical, Lightbulb, ListChecks, Play, RotateCcw, Sparkles, Target, TriangleAlert } from "lucide-react";
import type { StepLocation } from "@/lib/walkthroughs";
import { buildStepLesson } from "@/lib/walkthroughs";
import { useJourney } from "@/lib/progress";
import { WalkthroughNavbar } from "./walkthrough-navbar";
import { WalkthroughSidebar } from "./walkthrough-sidebar";
import { ConceptDiagram } from "./concept-diagram";

function MathEquation({ equation }: { equation: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="mathjax-block" suppressHydrationWarning>
      {mounted ? <MathJax dynamic>{`\\[${equation}\\]`}</MathJax> : <span aria-hidden="true">Loading equation…</span>}
    </div>
  );
}

export function WalkthroughStep({ location }: { location: StepLocation }) {
  const lesson = buildStepLesson(location); const { state, toggleWalkthroughStep } = useJourney(); const complete = state.walkthroughSteps.includes(location.step.id);
  const [codeTab, setCodeTab] = useState<"starter"|"solution"|"tests">("starter"); const [copied,setCopied]=useState(false); const [quiz,setQuiz]=useState<number|null>(null); const [sidebar,setSidebar]=useState(true);
  const code = codeTab === "starter" ? lesson.starter : codeTab === "solution" ? lesson.solution : lesson.tests;
  const copy = async()=>{await navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),1000)};
  const finish=()=>{if(!complete)toggleWalkthroughStep(location.step.id)};
  return <main className="walkthrough-shell"><WalkthroughNavbar projectSlug={location.project.slug} projectTitle={location.project.title}/><div className={`walk-layout ${sidebar?"":"sidebar-closed"}`}>
    {sidebar&&<WalkthroughSidebar outline={location.outline} activeStep={location.step.id}/>}<button className="walk-sidebar-toggle" onClick={()=>setSidebar(value=>!value)}>{sidebar?"‹":"›"}</button>
    <article className="walk-lesson"><header className="walk-lesson-head"><div><Link href={`/walkthrough/${location.project.slug}`}>Full walkthrough</Link><ChevronRight/><span>Part {location.part.order}</span><ChevronRight/><span>Lesson {location.flatIndex+1}</span><h1>{lesson.label}</h1><p>{location.part.title}</p></div><div className="walk-lesson-reward"><Flame/><strong>+{location.step.points} XP</strong><span>Lesson {location.flatIndex+1} of {location.outline.totalSteps}</span></div></header>
      <div className="walk-reading">
        <section className="walk-objective"><Target/><div><small>LEARNING OBJECTIVE</small><h2>{lesson.objective}</h2><p>By the end, you will know what this function owns, why the larger system needs it, how its mathematics works, and how to prove your code is correct.</p></div></section>
        <section><div className="walk-section-title"><Brain/><div><small>01 · CONCEPT</small><h2>Understand the idea first</h2></div></div><p>{lesson.intuition}</p><div className="walk-why"><Lightbulb/><div><strong>Why this step exists</strong><p>{lesson.why}</p></div></div></section>
        <section><div className="walk-section-title"><Sparkles/><div><small>02 · INTUITION</small><h2>Build a mental picture</h2></div></div><p>Imagine data moving through a row of small, labelled boxes. This lesson builds exactly one box. The label tells us what may enter, the implementation tells us what happens inside, and the return value tells the next box what it may safely expect.</p><ConceptDiagram location={location}/><div className="walk-contract"><div><small>INPUT</small><strong>Documented values, shapes and types</strong></div><ArrowRight/><div><small>{location.step.title.toUpperCase()}</small><strong>One focused transformation</strong></div><ArrowRight/><div><small>OUTPUT</small><strong>A predictable, testable result</strong></div></div></section>
        <section className="walk-math"><div className="walk-section-title"><BookOpen/><div><small>03 · MATHEMATICS</small><h2>Derive it carefully</h2></div></div><p>The symbols below express the core relationship used in this part of the project. MathJax renders the equation so fractions, matrices, superscripts, and alignment remain readable.</p><MathEquation equation={lesson.equation}/><ol>{lesson.derivation.map((item,index)=><li key={item}><span>{index+1}</span><p>{item}</p></li>)}</ol><div className="math-note"><Lightbulb/><p>Do not memorize the symbols. Ask what each symbol represents in code, what shape it has, and which axis is reduced.</p></div></section>
        <section><div className="walk-section-title"><Code2/><div><small>04 · IMPLEMENTATION</small><h2>Turn the idea into code</h2></div></div><p>Start with the contract, implement the smallest correct behavior, and use tests before optimizing. Reveal the reference only after making a real attempt.</p><div className="walk-code"><header><div><button className={codeTab==="starter"?"active":""} onClick={()=>setCodeTab("starter")}>Starter</button><button className={codeTab==="solution"?"active":""} onClick={()=>setCodeTab("solution")}><Eye/> Reference solution</button><button className={codeTab==="tests"?"active":""} onClick={()=>setCodeTab("tests")}><FlaskConical/> Tests</button></div><button onClick={copy}><Clipboard/>{copied?"Copied":"Copy"}</button></header><pre><code>{code}</code></pre></div></section>
        <section><div className="walk-section-title"><ListChecks/><div><small>05 · VERIFY</small><h2>Prove it works</h2></div></div><div className="walk-test-grid"><article><Check/><strong>Normal case</strong><p>Use the smallest representative input and compare exact values.</p></article><article><TriangleAlert/><strong>Edge case</strong><p>Try empty, full, boundary, masked, or single-item input.</p></article><article><RotateCcw/><strong>Purity check</strong><p>Confirm whether inputs should stay unchanged and repeated calls are independent.</p></article></div><h3>Common mistakes</h3><ul className="walk-mistakes">{lesson.mistakes.map(item=><li key={item}><TriangleAlert/>{item}</li>)}</ul></section>
        <section className="walk-checkpoint"><small>KNOWLEDGE CHECK</small><h2>{lesson.quiz.question}</h2><div>{lesson.quiz.options.map((option,index)=><button className={quiz===index?(index===lesson.quiz.answer?"correct":"wrong"):""} onClick={()=>setQuiz(index)} key={option}><span>{String.fromCharCode(65+index)}</span>{option}{quiz===index&&index===lesson.quiz.answer&&<Check/>}</button>)}</div>{quiz!==null&&<p>{quiz===lesson.quiz.answer?"Correct. The contract tells every later lesson what it can safely rely on.":"Try again. Speed and final metrics matter later; correctness starts at the boundary."}</p>}</section>
        <section className={`walk-finish ${complete?"complete":""}`}><div>{complete?<Check/>:<Play/>}<span><small>{complete?"LESSON COMPLETE":"READY TO CONTINUE?"}</small><strong>{complete?`${location.step.points} XP earned`:"Mark this lesson complete"}</strong></span></div><button onClick={finish} disabled={complete}>{complete?"Completed":"Complete lesson"}</button></section>
        <nav className="walk-prev-next">{location.previous?<Link href={`/walkthrough/${location.project.slug}/${location.previous.id}`}><ArrowLeft/><span><small>PREVIOUS</small><strong>{location.previous.title.replaceAll("_"," ")}</strong></span></Link>:<span/>}{location.next?<Link onClick={finish} href={`/walkthrough/${location.project.slug}/${location.next.id}`}><span><small>NEXT LESSON</small><strong>{location.next.title.replaceAll("_"," ")}</strong></span><ArrowRight/></Link>:<Link href={`/walkthrough/${location.project.slug}`}><span><small>FINISHED</small><strong>Review walkthrough</strong></span><Check/></Link>}</nav>
      </div>
    </article>
  </div></main>;
}
