/**
 * What it does: Renders a single white telemetry metric box showing a label, numeric value, and unit.
 * Who uses it: Imported by `frontend/src/pages/DashboardPage.jsx`.
 * What it talks to: Pure visual UI component (does not talk to any backend or database).
 */

export default function CleanMetricCard({ label, value, unit }) {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs">
      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
        {label}
      </span>
      <p className="text-xl font-bold text-slate-900 font-mono mt-1">
        {value !== undefined ? value : "--"}{" "}
        <span className="text-xs font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );
}

