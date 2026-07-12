"use client";

import Link from "next/link";
import { BarChart3, Map, Search } from "lucide-react";
import { Logo } from "./icons";
import { ThemeToggle } from "./walkthrough/theme-toggle";

export function Header({ active = "roadmap" }: { active?: string }) {
  return <header className="topbar">
    <Link href="/"><Logo /></Link>
    <nav aria-label="Main navigation">
      <Link className={active === "roadmap" ? "active" : ""} href="/"><Map size={16}/> Roadmap</Link>
      <Link className={active === "dashboard" ? "active" : ""} href="/dashboard"><BarChart3 size={16}/> Dashboard</Link>
      <Link className={active === "projects" ? "active" : ""} href="/projects"><Search size={16}/> Projects</Link>
    </nav>
    <div className="profile"><ThemeToggle/><span className="profile-level">LVL 01</span><span className="avatar">SK</span></div>
  </header>;
}
