import type { ReactNode } from "react";
export function StatPill({ icon, label, value, tone = "blue" }: { icon: ReactNode; label: string; value: string | number; tone?: string }) {
  return <div className={`stat-pill ${tone}`}><span>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>;
}
