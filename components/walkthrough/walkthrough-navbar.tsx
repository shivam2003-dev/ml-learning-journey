import Link from "next/link";
import { ArrowLeft, BookOpen, Map, Search } from "lucide-react";
import { Logo } from "@/components/icons";
import { ThemeToggle } from "./theme-toggle";

export function WalkthroughNavbar({ projectSlug, projectTitle }: { projectSlug: string; projectTitle: string }) {
  return <header className="walk-navbar"><Link href="/"><Logo/></Link><nav><Link href={`/projects/${projectSlug}`}><ArrowLeft/> Project</Link><Link className="active" href={`/walkthrough/${projectSlug}`}><BookOpen/> Walkthrough</Link><Link href="/"><Map/> Roadmap</Link></nav><div className="walk-nav-end"><span>{projectTitle}</span><button aria-label="Search lessons"><Search/></button><ThemeToggle/></div></header>;
}
