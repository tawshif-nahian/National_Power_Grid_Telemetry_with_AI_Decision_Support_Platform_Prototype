/**
 * What it does: Renders the real-time supervisory Dashboard page showing station selector, AI advisory, 8 telemetry cards, and live chart.
 * Who uses it: Rendered by `frontend/src/App.jsx` at the `/dashboard` address.
 * What it talks to: Receives live telemetry state and actions from `useGridTelemetry` hook and renders `CleanMetricCard`.
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

export default function DashboardPage({
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
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Station Selector Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase text-slate-400 mr-1">
            Select Facility:
          </span>
          {plants.map((plant) => (
            <button
              key={plant.id}
              onClick={() => handleSelectPlant(plant.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedPlantId === plant.id
                  ? "bg-[#1D4ED8] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#1D4ED8]" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
          <span className="text-xs font-mono text-slate-500">
            {activeTelemetry
              ? new Date(activeTelemetry.timestamp).toLocaleTimeString()
              : "50.00 Hz Sync"}
          </span>
        </div>
      </div>

      {/* Minimalist AI Decision Banner */}
      {aiAdvisory && (
        <div className="bg-white border-l-4 border-l-[#1D4ED8] border border-slate-200 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-0.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#1D4ED8]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                AI Supervisory Advisory — {aiAdvisory.title}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {aiAdvisory.recommendation}
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded bg-blue-50 text-[#1D4ED8] border border-blue-200">
            Action: {aiAdvisory.action}
          </span>
        </div>
      )}

      {/* 8 Clean Telemetry Cards */}
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
          value={
            activeTelemetry?.temperature_c ??
            (selectedPlant.plant_code === "SRJ-SOLAR" ? "41.8" : "539.5")
          }
          unit="°C"
        />
        <CleanMetricCard
          label="Fuel Consumption Rate"
          value={
            activeTelemetry?.fuel_consumption_rate ??
            (selectedPlant.plant_code === "SRJ-SOLAR" ? "0.0" : "428.4")
          }
          unit={selectedPlant.plant_code === "SRJ-SOLAR" ? "Zero" : "Unit/h"}
        />
        <CleanMetricCard
          label="Thermal / PV Efficiency"
          value={
            activeTelemetry?.efficiency_pct ??
            selectedPlant.design_efficiency_pct
          }
          unit="%"
        />
        <CleanMetricCard
          label="Plant Load Factor (PLF)"
          value={activeTelemetry?.grid_load_pct ?? "89.4"}
          unit="%"
        />
        <CleanMetricCard
          label="Carbon Intensity"
          value={
            activeTelemetry?.carbon_intensity_kg ??
            selectedPlant.carbon_factor_kg_mwh
          }
          unit="kg CO₂/MWh"
        />
      </div>

      {/* Real-Time Power Trajectory Chart */}
      <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Real-Time Generation Output Trajectory (MW) — {selectedPlant.name}
            </h3>
            <p className="text-xs text-slate-500">
              Live 5-second time-series stream from PostgreSQL table{" "}
              <code className="text-[#1D4ED8]">{selectedPlant.table_name}</code>
            </p>
          </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
              <YAxis
                stroke="#64748B"
                domain={["auto", "auto"]}
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#CBD5E1",
                  color: "#0F172A",
                }}
              />
              <Line
                type="monotone"
                dataKey="power"
                stroke="#1D4ED8"
                strokeWidth={2.5}
                dot={{ fill: "#1D4ED8", r: 3 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

