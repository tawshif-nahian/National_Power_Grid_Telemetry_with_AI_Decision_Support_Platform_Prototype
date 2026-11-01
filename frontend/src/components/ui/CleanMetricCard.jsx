/**
 * What it does: Renders a single telemetry metric box showing a label, numeric value, and unit in the warm editorial palette.
 * Who uses it: Imported by `frontend/src/pages/DashboardPage.jsx` and `PlantDetailPage.jsx`.
 * What it talks to: Pure visual UI component wrapped in `Reveal` (does not talk to any backend or database).
 */

import Reveal from "./Reveal";

export default function CleanMetricCard({ label, value, unit }) {
  return (
    <Reveal>
      <div className="bg-surface border border-border p-5 rounded-xl">
        <span className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold block">
          {label}
        </span>
        <p className="text-2xl font-bold text-text-primary font-mono mt-1.5">
          {value !== undefined ? value : "—"}{" "}
          <span className="text-xs font-normal text-text-secondary">{unit}</span>
        </p>
      </div>
    </Reveal>
  );
}
