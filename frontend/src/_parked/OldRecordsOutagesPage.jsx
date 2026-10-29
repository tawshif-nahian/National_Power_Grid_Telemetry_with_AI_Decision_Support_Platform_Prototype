// Parked: not in the menu yet.
/**
 * What it does: Preserves the original Historical Generation Archives & Outage Classification Matrix page from App.jsx.
 * Who uses it: Currently parked in `_parked/` so no code is deleted.
 * What it talks to: Uses `exportTelemetryCSV` callback passed from `useGridTelemetry`.
 */

import { useState } from "react";
import { Download } from "lucide-react";

export default function OldRecordsOutagesPage({
  outages,
  records,
  offlineCapacityMw,
  selectedPlant,
  exportTelemetryCSV,
}) {
  const [exportLimit, setExportLimit] = useState(60);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 p-6 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Historical Generation Archives & Outage Classification Matrix
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Forced vs. Planned station outages ({offlineCapacityMw} MW currently
            offline) and CSV dataset exporter.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={exportLimit}
            onChange={(e) => setExportLimit(Number(e.target.value))}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800"
          >
            <option value={50}>Latest 50 rows</option>
            <option value={200}>Latest 200 rows</option>
          </select>
          <button
            onClick={() => exportTelemetryCSV(selectedPlant, exportLimit)}
            className="px-4 py-1.5 bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-600">
          Outage Tracking Matrix (Forced vs. Planned)
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono">
            <tr>
              <th className="p-3.5">Facility & Unit</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Offline MW</th>
              <th className="p-3.5">Cause Code</th>
              <th className="p-3.5">Description</th>
              <th className="p-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {outages.map((o) => (
              <tr key={o.id}>
                <td className="p-3.5 font-semibold text-slate-900">
                  {o.plant_name} ({o.unit_identifier})
                </td>
                <td className="p-3.5 font-mono font-bold text-amber-700">
                  {o.outage_category}
                </td>
                <td className="p-3.5 font-mono font-bold text-rose-600">
                  {o.capacity_offline_mw} MW
                </td>
                <td className="p-3.5 font-mono text-slate-600">
                  {o.cause_code}
                </td>
                <td className="p-3.5 text-slate-600">{o.description}</td>
                <td className="p-3.5 font-mono font-bold text-slate-800">
                  {o.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 font-bold text-xs uppercase tracking-wider text-slate-600">
          Historical Daily Generation Milestones
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono">
            <tr>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Peak Demand</th>
              <th className="p-3.5">Total Energy</th>
              <th className="p-3.5">Avg Frequency</th>
              <th className="p-3.5">Avg Cost ($/kWh)</th>
              <th className="p-3.5">Milestone Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map((r) => (
              <tr key={r.id}>
                <td className="p-3.5 font-mono text-slate-900">
                  {r.record_date}
                </td>
                <td className="p-3.5 font-mono font-bold text-[#1D4ED8]">
                  {r.peak_demand_mw} MW
                </td>
                <td className="p-3.5 font-mono text-slate-700">
                  {r.total_generation_mwh} MWh
                </td>
                <td className="p-3.5 font-mono text-emerald-700">
                  {r.avg_frequency_hz} Hz
                </td>
                <td className="p-3.5 font-mono text-slate-800">
                  ${r.avg_generation_cost_usd_kwh}
                </td>
                <td className="p-3.5 text-slate-600">{r.milestone_note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

