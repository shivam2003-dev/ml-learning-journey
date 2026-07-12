import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
export default function sitemap(): MetadataRoute.Sitemap { const base = "https://ml.shivam2003.com"; return [{ url: base, priority: 1 }, { url: `${base}/dashboard`, priority: .8 }, { url: `${base}/projects`, priority: .9 }, ...projects.map(project => ({ url: `${base}/projects/${project.slug}`, priority: .7 }))]; }
