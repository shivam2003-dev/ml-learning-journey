"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import type { ProjectOutline } from "@/lib/walkthroughs";
import { useJourney } from "@/lib/progress";

export function WalkthroughSidebar({ outline, activeStep }: { outline: ProjectOutline; activeStep?: string }) {
  const { state } = useJourney(); const done = new Set(state.walkthroughSteps); const completed = outline.parts.flatMap(part => part.steps).filter(step => done.has(step.id)).length;
  return <aside className="walk-sidebar"><div className="walk-sidebar-head"><small>COURSE PROGRESS</small><strong>{completed} of {outline.totalSteps} lessons</strong><div className="progress"><i style={{width:`${completed/outline.totalSteps*100}%`}}/></div></div><nav>{outline.parts.map(part=><section key={part.id}><div className="walk-part-title"><span>PART {part.order}</span><strong>{part.title}</strong><small>{part.steps.filter(step=>done.has(step.id)).length}/{part.steps.length}</small></div>{part.steps.map(step=><Link className={`${activeStep===step.id?"active":""} ${done.has(step.id)?"complete":""}`} href={`/walkthrough/${outline.slug}/${step.id}`} key={step.id}><span>{done.has(step.id)?<Check/>:String(step.order).padStart(3,"0")}</span><em>{step.title.replaceAll("_"," ")}</em><ChevronRight/></Link>)}</section>)}</nav></aside>;
}
