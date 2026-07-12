import { notFound } from "next/navigation";
import { ProjectArchitecture } from "@/components/project-reading";
import { projectBySlug, projects } from "@/lib/projects";
export function generateStaticParams(){return projects.map(({slug})=>({slug}));}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const project=projectBySlug(slug);if(!project)notFound();return <ProjectArchitecture project={project}/>;}
