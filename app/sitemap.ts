import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { projectOutlines } from "@/lib/walkthroughs";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://ml.shivam2003.com";
  return [
    { url: base, priority: 1 },
    { url: `${base}/dashboard`, priority: .8 },
    { url: `${base}/projects`, priority: .9 },
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, priority: .7 })),
    ...projects.flatMap((project) => [
      { url: `${base}/projects/${project.slug}/article`, priority: .7 },
      { url: `${base}/projects/${project.slug}/architecture`, priority: .7 },
    ]),
    ...projectOutlines.map((outline) => ({ url: `${base}/walkthrough/${outline.slug}`, priority: .8 })),
    ...projectOutlines.flatMap((outline) => outline.parts.flatMap((part) => part.steps.map((step) => ({
      url: `${base}/walkthrough/${outline.slug}/${step.id}`,
      priority: .6,
    })))),
  ];
}
