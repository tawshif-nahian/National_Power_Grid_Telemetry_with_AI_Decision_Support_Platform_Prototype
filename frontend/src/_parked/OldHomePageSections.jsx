// Parked: not in the menu yet.
/**
 * What it does: Preserves the previous Home page sections ("National Electricity Market & Telemetry Summary",
 *               "Generation by Fuel Technology (MW)", and "Monitored Generation Facilities & Live Telemetry Overlay")
 *               that were replaced in Phase 3 Step 4.
 * Who uses it: Parked in `frontend/src/_parked/` per the "never delete code" rule.
 * What it talks to: Uses `computePlantCosts` from `../utils/costCalculations` and `HomeFacilityCards`.
 */

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { computePlantCosts } from "../utils/costCalculations";
import HomeFacilityCards from "../components/ui/HomeFacilityCards";

export default function OldHomePageSections({
  plants,
  telemetry,
  mixHistory,
  totalPower,
  totalCapacity,
  currentFreq,
  weightedCostMwh,
  weightedCarbon,
  cleanEnergyShare,
  coalPower,
  gasPower,
  solarPower,
  onSelectFacility,
}) {
  return (
    <div className="space-y-10">
      {/* 1. National Electricity Market & Telemetry Summary */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-online" />
            <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-text-primary">
              National Electricity Market & Telemetry Summary
            </h2>
          </div>
          <span className="text-xs font-mono text-text-secondary">
            Design Benchmark: Open Electricity (openelectricity.org.au) • 5s
            Live Sync
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold block">
              Total Generation
            </span>
            <span className="text-2xl font-bold text-text-primary font-mono mt-1 block">
              {totalPower.toFixed(1)}{" "}
              <small className="text-xs font-normal text-text-secondary">
                MW
              </small>
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold block">
              Installed Capacity
            </span>
            <span className="text-2xl font-bold text-text-primary font-mono mt-1 block">
              {totalCapacity.toFixed(0)}{" "}
              <small className="text-xs font-normal text-text-secondary">
                MW
              </small>
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold block">
              Grid Frequency
            </span>
            <span className="text-2xl font-bold text-status-online font-mono mt-1 block">
              {currentFreq.toFixed(2)}{" "}
              <small className="text-xs font-normal text-text-secondary">
                Hz
              </small>
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold block">
              Weighted Cost
            </span>
            <span className="text-2xl font-bold text-accent font-mono mt-1 block">
              ${weightedCostMwh}{" "}
              <small className="text-xs font-normal text-text-secondary">
                /MWh
              </small>
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold block">
              Carbon Intensity
            </span>
            <span className="text-2xl font-bold text-text-primary font-mono mt-1 block">
              {weightedCarbon}{" "}
              <small className="text-xs font-normal text-text-secondary">
                kg/MWh
              </small>
            </span>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-secondary font-semibold block">
              Renewables Share
            </span>
            <span className="text-2xl font-bold text-status-online font-mono mt-1 block">
              {cleanEnergyShare}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Generation by Fuel Technology (MW) + Supply Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-surface border border-border rounded-xl p-6">
          <h3 className="text-base font-heading font-bold text-text-primary mb-4">
            Generation by Fuel Technology (MW)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mixHistory}>
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
                <Area
                  type="monotone"
                  dataKey="Coal"
                  stackId="1"
                  stroke="var(--color-series-thermal)"
                  fill="var(--color-series-thermal)"
                />
                <Area
                  type="monotone"
                  dataKey="Gas"
                  stackId="1"
                  stroke="var(--color-series-gas)"
                  fill="var(--color-series-gas)"
                />
                <Area
                  type="monotone"
                  dataKey="Solar"
                  stackId="1"
                  stroke="var(--color-series-solar)"
                  fill="var(--color-series-solar)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface border border-border rounded-xl p-6">
          <h3 className="text-base font-heading font-bold text-text-primary mb-4">
            Supply, Contribution & Marginal Cost
          </h3>
          <p className="text-xs font-mono text-text-secondary">
            Coal: {coalPower.toFixed(1)} MW ($
            {computePlantCosts(plants[0]).variableCostKwh.toFixed(4)}/kWh) •
            Gas: {gasPower.toFixed(1)} MW • Solar: {solarPower.toFixed(1)} MW
          </p>
        </div>
      </div>

      {/* 3. Monitored Generation Facilities & Live Telemetry Overlay */}
      <HomeFacilityCards
        plants={plants}
        telemetry={telemetry}
        onSelectFacility={onSelectFacility}
      />
    </div>
  );
}

