"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { projects } from "./projects";

export type JourneyState = {
  completed: string[];
  stepProgress: Record<string, number>;
  guideChapters: Record<string, number[]>;
  bookmarks: string[];
  notes: Record<string, string>;
  ratings: Record<string, number>;
  timeSpent: Record<string, number>;
  repositories: Record<string, string>;
  activity: { slug: string; at: string; type: "completed" | "started" }[];
  startedAt: string;
  dailyGoal: number;
};

const initialState: JourneyState = { completed: [], stepProgress: {}, guideChapters: {}, bookmarks: [], notes: {}, ratings: {}, timeSpent: {}, repositories: {}, activity: [], startedAt: new Date().toISOString(), dailyGoal: 30 };
const key = "ml-learning-journey-v1";

export function useJourney() {
  const [state, setState] = useState<JourneyState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const saved = localStorage.getItem(key); if (saved) setState({ ...initialState, ...JSON.parse(saved) }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(key, JSON.stringify(state)); }, [state, ready]);

  const complete = useCallback((slug: string) => setState((current) => {
    const done = current.completed.includes(slug);
    return {
      ...current,
      completed: done ? current.completed.filter((item) => item !== slug) : [...current.completed, slug],
      activity: done ? current.activity : [{ slug, at: new Date().toISOString(), type: "completed" as const }, ...current.activity].slice(0, 30),
    };
  }), []);
  const bookmark = useCallback((slug: string) => setState((current) => ({ ...current, bookmarks: current.bookmarks.includes(slug) ? current.bookmarks.filter((item) => item !== slug) : [...current.bookmarks, slug] })), []);
  const saveNote = useCallback((slug: string, note: string) => setState((current) => ({ ...current, notes: { ...current.notes, [slug]: note } })), []);
  const setStepProgress = useCallback((slug: string, steps: number) => setState((current) => ({ ...current, stepProgress: { ...current.stepProgress, [slug]: steps } })), []);
  const toggleGuideChapter = useCallback((slug: string, chapter: number) => setState((current) => {
    const done = current.guideChapters[slug] ?? [];
    const next = done.includes(chapter) ? done.filter(item => item !== chapter) : [...done, chapter];
    return { ...current, guideChapters: { ...current.guideChapters, [slug]: next } };
  }), []);
  const setRating = useCallback((slug: string, rating: number) => setState((current) => ({ ...current, ratings: { ...current.ratings, [slug]: rating } })), []);
  const setTimeSpent = useCallback((slug: string, minutes: number) => setState((current) => ({ ...current, timeSpent: { ...current.timeSpent, [slug]: minutes } })), []);
  const setRepository = useCallback((slug: string, repository: string) => setState((current) => ({ ...current, repositories: { ...current.repositories, [slug]: repository } })), []);
  const setDailyGoal = useCallback((minutes: number) => setState((current) => ({ ...current, dailyGoal: minutes })), []);

  const stats = useMemo(() => {
    const completedProjects = projects.filter((project) => state.completed.includes(project.slug));
    const xp = completedProjects.reduce((sum, project) => sum + project.steps * 20 + project.minutes, 0);
    const level = Math.floor(xp / 1000) + 1;
    const hours = Math.round(completedProjects.reduce((sum, project) => sum + project.minutes, 0) / 6) / 10;
    const dates = new Set(state.activity.map((item) => item.at.slice(0, 10)));
    let streak = 0; const day = new Date();
    while (dates.has(day.toISOString().slice(0, 10))) { streak++; day.setDate(day.getDate() - 1); }
    const today = new Date().toISOString().slice(0, 10);
    const todayMinutes = state.activity.filter(item => item.at.slice(0, 10) === today).length * 30;
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6);
    const weeklyDays = new Set(state.activity.filter(item => new Date(item.at) >= weekStart).map(item => item.at.slice(0, 10))).size;
    return { xp, level, levelXp: xp % 1000, hours, streak, weeklyDays, todayMinutes, completion: Math.round(state.completed.length / projects.length * 100), skillPoints: state.completed.length * 3, coins: state.completed.length * 120, stars: completedProjects.reduce((sum, p) => sum + (p.difficulty === "Hard" ? 3 : p.difficulty === "Medium" ? 2 : 1), 0) };
  }, [state]);

  return { state, ready, stats, complete, bookmark, saveNote, setStepProgress, toggleGuideChapter, setRating, setTimeSpent, setRepository, setDailyGoal };
}
