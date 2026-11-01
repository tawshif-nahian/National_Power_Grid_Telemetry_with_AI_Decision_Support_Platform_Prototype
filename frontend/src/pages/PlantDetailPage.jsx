/**
 * What it does: Renders the dedicated Plant Detail page (`/dashboard/:plantId`) with 8 live telemetry cards,
 *               AI supervisory advisory, CSV export, and 4 interactive Recharts visualizations.
 * Who uses it: Rendered by `frontend/src/App.jsx` at `/dashboard/:plantId`.
 * What it talks to: Calls `usePlantDetailTelemetry` hook (`Page -> Hook -> Service -> Supabase`) and chart components in `features/dashboard/components/`.
 */

import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Cpu } from "lucide-react";
import { usePlantDetailTelemetry } from "../features/dashboard/hooks/usePlantDetailTelemetry";
import LiveGenerationChart from "../features/dashboard/components/LiveGenerationChart";
import CapacityVsGenerationChart from "../features/dashboard/components/CapacityVsGenerationChart";
import TransmissionStabilityChart from "../features/dashboard/components/TransmissionStabilityChart";
import FuelAndShareDonutChart from "../features/dashboard/components/FuelAndShareDonutChart";
import CleanMetricCard from "../components/ui/CleanMetricCard";
import Reveal from "../components/ui/Reveal";

export default function PlantDetailPage({
  plants,
  telemetry,
  inventory,
  coalPower,
  gasPower,
  solarPower,
  isExporting,
  exportTelemetryCSV,
}) {
  const { plantId } = useParams();
  const navigate = useNavigate();

  const {
    plant,
    activeTelemetry,
    plantInventory,
    history,
    timeRange,
    setTimeRange,
    deltaF,
    seriesColorVar,
    aiAdvisory,
  } = usePlantDetailTelemetry({
    plantId,
    plants,
    telemetry,
    inventory,
  });

  if (!plant) return null;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Bar: Back to Plants + Station Header + Export CSV */}
      <Reveal maxTranslateY={70}>
        <div className="bg-surface border border-border p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5">
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold uppercase tracking-wider text-accent hover:text-accent-hover cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to plants
            </button>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
              {plant.name}
            </h1>
            <p className="text-xs font-mono text-text-secondary">
              {plant.plant_code} • {plant.fuel_type} • {plant.location} (
              {plant.substation_kv} kV Substation)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportTelemetryCSV(plant, 60)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>
            <span className="text-xs font-mono text-text-secondary bg-bg border border-border px-3 py-2 rounded-lg">
              {activeTelemetry
                ? new Date(activeTelemetry.timestamp).toLocaleTimeString()
                : "50.00 Hz Sync"}
            </span>
          </div>
        </div>
      </Reveal>

      {/* AI Supervisory Advisory Banner */}
      {aiAdvisory && (
        <Reveal maxTranslateY={75}>
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

      {/* 8 Live Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CleanMetricCard
          label="Active Power Output"
          value={
            activeTelemetry?.power_output_mw ??
            (plant.capacity_mw * 0.89).toFixed(1)
          }
          unit="MW"
        />
        <CleanMetricCard
          label="Substation Bus Voltage"
          value={activeTelemetry?.voltage_kv ?? plant.substation_kv}
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
            (plant.plant_code === "SRJ-SOLAR" ? "41.8" : "539.5")
          }
          unit="°C"
        />
        <CleanMetricCard
          label="Fuel Consumption Rate"
          value={
            activeTelemetry?.fuel_consumption_rate ??
            (plant.plant_code === "SRJ-SOLAR" ? "0.0" : "428.4")
          }
          unit={plant.plant_code === "SRJ-SOLAR" ? "Zero" : "Unit/h"}
        />
        <CleanMetricCard
          label="Thermal / PV Efficiency"
          value={
            activeTelemetry?.efficiency_pct ?? plant.design_efficiency_pct
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
            activeTelemetry?.carbon_intensity_kg ?? plant.carbon_factor_kg_mwh
          }
          unit="kg CO₂/MWh"
        />
      </div>

      {/* Chart 1: Live Generation Line/Area Chart with Time Range Switch */}
      <Reveal maxTranslateY={95}>
        <LiveGenerationChart
          history={history}
          plantName={plant.name}
          tableName={plant.table_name}
          seriesColorVar={seriesColorVar}
          timeRange={timeRange}
          onChangeTimeRange={setTimeRange}
        />
      </Reveal>

      {/* Charts 2, 3, and 4: Capacity vs Generation, Transmission Voltage/Freq, and Fuel/Output Share Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal maxTranslateY={95} delayOffsetPx={0}>
          <CapacityVsGenerationChart
            plant={plant}
            activeTelemetry={activeTelemetry}
            seriesColorVar={seriesColorVar}
          />
        </Reveal>

        <Reveal maxTranslateY={95} delayOffsetPx={35}>
          <TransmissionStabilityChart
            history={history}
            seriesColorVar={seriesColorVar}
          />
        </Reveal>

        <Reveal maxTranslateY={95} delayOffsetPx={70}>
          <FuelAndShareDonutChart
            plant={plant}
            plantInventory={plantInventory}
            coalPower={coalPower}
            gasPower={gasPower}
            solarPower={solarPower}
            seriesColorVar={seriesColorVar}
          />
        </Reveal>
      </div>
    </div>
  );
}

