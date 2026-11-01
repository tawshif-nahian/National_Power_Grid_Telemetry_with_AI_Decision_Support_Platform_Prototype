// Parked: not in the menu yet.
/**
 * What it does: Preserves the previous single-page Dashboard layout (with the top station selector bar)
 *               before it was split into `/dashboard` (3-plant zig-zag list) and `/dashboard/:plantId` (detail page) in Phase 3 Step 5.
 * Who uses it: Parked in `frontend/src/_parked/` per the "never delete code" rule.
 * What it talks to: Uses `CleanMetricCard` and `Reveal`.
 */

import { Download, Cpu } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CleanMetricCard from "../components/ui/CleanMetricCard";
import Reveal from "../components/ui/Reveal";

export default function OldDashboardPage({
  plants,
  selectedPlantId,
  selectedPlant,
  activeTelemetry,
  deltaF,
  history,
  aiAdvisory,
  isExporting,
  handleSelectPlant,
  exportTelemetryCSV,
}) {
  const seriesStroke =
    selectedPlant?.fuel_category === "Coal"
      ? "var(--color-series-thermal)"
      : selectedPlant?.fuel_category === "Gas"
        ? "var(--color-series-gas)"
        : "var(--color-series-solar)";

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-6">
      <Reveal>
        <div className="bg-surface border border-border p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-heading font-bold uppercase text-text-secondary mr-1">
              Select Facility:
            </span>
            {plants.map((plant) => (
              <button
                key={plant.id}
                onClick={() => handleSelectPlant(plant.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedPlantId === plant.id
                    ? "bg-accent text-white"
                    : "bg-bg text-text-primary border border-border hover:border-accent"
                }`}
              >
                {plant.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportTelemetryCSV(selectedPlant, 60)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-bg hover:bg-accent hover:text-white border border-border text-text-primary text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>
      </Reveal>

      {aiAdvisory && (
        <Reveal>
          <div className="bg-surface border-l-4 border-l-accent border border-border p-5 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-accent" />
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-text-primary">
                  AI Supervisory Advisory — {aiAdvisory.title}
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                {aiAdvisory.recommendation}
              </p>
            </div>
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded bg-bg text-accent border border-border">
              Action: {aiAdvisory.action}
            </span>
          </div>
        </Reveal>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CleanMetricCard
          label="Active Power Output"
          value={
            activeTelemetry?.power_output_mw ??
            (selectedPlant.capacity_mw * 0.89).toFixed(1)
          }
          unit="MW"
        />
        <CleanMetricCard
          label="Substation Bus Voltage"
          value={activeTelemetry?.voltage_kv ?? selectedPlant.substation_kv}
          unit="kV"
        />
        <CleanMetricCard
          label="Synchronous Frequency"
          value={activeTelemetry?.frequency_hz ?? "50.00"}
          unit={`Hz (Δf ${deltaF})`}
        />
        <CleanMetricCard
          label="Operating Temperature"
          value={activeTelemetry?.temperature_c ?? "539.5"}
          unit="°C"
        />
      </div>

      <Reveal>
        <div className="bg-surface border border-border p-6 rounded-xl">
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis
                  dataKey="time"
                  stroke="var(--color-text-secondary)"
                  fontSize={11}
                />
                <YAxis stroke="var(--color-text-secondary)" fontSize={11} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="power"
                  stroke={seriesStroke}
                  strokeWidth={2.5}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

