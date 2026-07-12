"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Clipboard, Code2, Download, Gamepad2, Lightbulb, Play, Sparkles, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import type { Project } from "@/lib/projects";
import { getProjectGuide } from "@/lib/guides";
import { useJourney } from "@/lib/progress";

export function GuidedSolution({ project }: { project: Project }) {
  const guide = useMemo(() => getProjectGuide(project), [project]);
  const { state, toggleGuideChapter, setStepProgress } = useJourney();
  const done = state.guideChapters[project.slug] ?? [];
  const [open, setOpen] = useState(0);
  const [hint, setHint] = useState<number | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const guidedPercent = Math.round(done.length / guide.chapters.length * 100);
  const copy = async (code: string) => { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1200); };
  const download = () => { const blob = new Blob([guide.fullCode], { type: "text/plain" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = guide.filename; link.click(); URL.revokeObjectURL(url); };
  const finish = (index: number) => { toggleGuideChapter(project.slug, index); const nextCount = done.includes(index) ? done.length - 1 : done.length + 1; setStepProgress(project.slug, Math.round(project.steps * nextCount / guide.chapters.length)); if (!done.includes(index)) confetti({ particleCount: 45, spread: 50, origin: { y: .7 }, colors: [project.color, "#ffffff"] }); if (index < guide.chapters.length - 1) setOpen(index + 1); };

  return <section id="guided-solution" className="content-card guide-card" style={{ "--node": project.color } as React.CSSProperties}>
    <div className="guide-head"><span className="section-icon"><Gamepad2/></span><div><span className="kicker">GUIDED BUILD MODE</span><h2>Build it with me, step by step</h2><p>Easy words, working code, hints when you need them, and XP for every checkpoint.</p></div></div>
    <div className="guide-stats"><span><Sparkles/> {done.length * 100} guide XP</span><span><Trophy/> {done.length}/{guide.chapters.length} chapters</span><strong>{guidedPercent}%</strong></div><div className="progress large"><i style={{width:`${guidedPercent}%`}}/></div>
    <div className="guide-setup"><Code2/><div><strong>Before you start</strong><p>{guide.setup}. Create <code>{guide.filename}</code>, then complete the chapters in order.</p></div></div>
    <div className="guide-chapters">{guide.chapters.map((chapter,index)=>{const complete=done.includes(index);const expanded=open===index;return <article className={complete?"complete":""} key={chapter.title}>
      <button className="chapter-toggle" onClick={()=>setOpen(expanded?-1:index)}><span>{complete?<Check/>:index+1}</span><div><small>CHAPTER {String(index+1).padStart(2,"0")} · +100 XP · OPEN</small><strong>{chapter.title}</strong></div><ChevronDown className={expanded?"rotate":""}/></button>
      {expanded&&<div className="chapter-body"><div className="mission"><span>YOUR MISSION</span><p>{chapter.goal}</p></div><h3>First, understand it</h3><p>{chapter.explanation}</p><div className="analogy"><Sparkles/><div><strong>Think of it this way</strong><p>{chapter.analogy}</p></div></div><h3>Do these small jobs</h3><ul>{chapter.checklist.map(item=><li key={item}><Check/>{item}</li>)}</ul><div className="code-window"><div className="code-toolbar"><span><i/><i/><i/> {guide.filename}</span><button onClick={()=>copy(chapter.code)}><Clipboard/>{copied?"Copied":"Copy"}</button></div><pre><code>{chapter.code}</code></pre></div><div className="chapter-actions"><button className="hint-button" onClick={()=>setHint(hint===index?null:index)}><Lightbulb/> {hint===index?"Hide hint":"I need a hint"}</button><button className={`button primary ${complete?"done":""}`} onClick={()=>finish(index)}>{complete?<><Check/> Completed</>:<><Play/> Run checkpoint</>}</button></div>{hint===index&&<div className="hint-box"><Lightbulb/><p>{chapter.hint}</p></div>}</div>}
    </article>})}</div>
    <div className="guide-quiz"><span className="kicker">BOSS CHECKPOINT</span><h3>{guide.quiz.question}</h3><div>{guide.quiz.options.map((option,index)=><button className={answer===index?(index===guide.quiz.answer?"correct":"wrong"):""} onClick={()=>setAnswer(index)} key={option}><span>{String.fromCharCode(65+index)}</span>{option}{answer===index&&index===guide.quiz.answer&&<Check/>}</button>)}</div>{answer!==null&&<p className={answer===guide.quiz.answer?"quiz-good":"quiz-try"}>{answer===guide.quiz.answer?"Correct! +50 XP. ":"Not quite. Try again. "}{guide.quiz.explanation}</p>}</div>
    <div className="full-solution"><div><span className="kicker">FINAL IMPLEMENTATION</span><h3>Complete runnable solution</h3><p>Use this after trying the guided chapters. Reading a solution is useful; building it yourself is where the learning happens.</p></div><div><button className="button ghost" onClick={()=>copy(guide.fullCode)}><Clipboard/> Copy all</button><button className="button primary" onClick={download}><Download/> Download {guide.filename}</button></div></div><details><summary>Reveal full code</summary><div className="code-window"><pre><code>{guide.fullCode}</code></pre></div></details>
  </section>;
}
