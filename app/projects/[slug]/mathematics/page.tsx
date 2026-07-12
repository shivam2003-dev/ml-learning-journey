import { notFound } from "next/navigation";
import { ProjectMathematics } from "@/components/project-mathematics";
import { projectBySlug, projects } from "@/lib/projects";

export function generateStaticParams(){return projects.map(({slug})=>({slug}));}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const project=projectBySlug(slug);if(!project)notFound();return <ProjectMathematics project={project}/>;}
