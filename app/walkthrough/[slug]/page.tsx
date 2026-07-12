import { notFound } from "next/navigation";
import { WalkthroughIndex } from "@/components/walkthrough/walkthrough-index";
import { projectBySlug } from "@/lib/projects";
import { outlineBySlug, projectOutlines } from "@/lib/walkthroughs";

export function generateStaticParams(){return projectOutlines.map(({slug})=>({slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const project=projectBySlug(slug);const outline=outlineBySlug(slug);if(!project||!outline)notFound();return <WalkthroughIndex project={project} outline={outline}/>}
