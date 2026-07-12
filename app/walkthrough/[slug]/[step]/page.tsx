import { notFound } from "next/navigation";
import { WalkthroughStep } from "@/components/walkthrough/walkthrough-step";
import { findStep, projectOutlines } from "@/lib/walkthroughs";

export function generateStaticParams(){return projectOutlines.flatMap(outline=>outline.parts.flatMap(part=>part.steps.map(step=>({slug:outline.slug,step:step.id}))))}
export default async function Page({params}:{params:Promise<{slug:string;step:string}>}){const {slug,step}=await params;const location=findStep(slug,step);if(!location)notFound();return <WalkthroughStep location={location}/>}
