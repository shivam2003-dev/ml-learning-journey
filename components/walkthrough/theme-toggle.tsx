"use client";

import { Moon, Sun, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "anthropic" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => { const saved = localStorage.getItem("ml-walkthrough-theme") as Theme | null; const next = saved ?? "light"; setTheme(next); document.documentElement.dataset.learningTheme = next; }, []);
  const choose = (next: Theme) => { setTheme(next); localStorage.setItem("ml-walkthrough-theme", next); document.documentElement.dataset.learningTheme = next; };
  return <div className="walk-theme" aria-label="Site theme">
    <button className={theme === "light" ? "active" : ""} onClick={() => choose("light")} title="Light mode"><Sun/></button>
    <button className={theme === "anthropic" ? "active" : ""} onClick={() => choose("anthropic")} title="Anthropic theme"><Sparkles/></button>
    <button className={theme === "dark" ? "active" : ""} onClick={() => choose("dark")} title="Dark mode"><Moon/></button>
  </div>;
}
