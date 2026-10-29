/**
 * What it does: Renders the Home page with the cover banner, national summary strip, fuel mix chart, supply table, and facility cards.
 * Who uses it: Rendered by `frontend/src/App.jsx` at the `/` address.
 * What it talks to: Receives live grid data from `useGridTelemetry` hook and uses `HomeCoverCarousel` and `HomeFacilityCards`.
 */

import { useNavigate } from "react-router-dom";
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
import HomeCoverCarousel from "../components/ui/HomeCoverCarousel";
import HomeFacilityCards from "../components/ui/HomeFacilityCards";

export default function HomePage({
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
  handleSelectPlant,
}) {
  const navigate = useNavigate();

  return (
    <div>
      <HomeCoverCarousel />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Open Electricity Style Top Summary Strip */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                National Electricity Market & Telemetry Summary
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Design Benchmark: Open Electricity (openelectricity.org.au) • 5s
              Live Sync
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Total Generation
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono mt-0.5 block">
                {totalPower.toFixed(1)}{" "}
                <small className="text-xs font-normal text-slate-500">MW</small>
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Installed Capacity
              </span>
              <span className="text-2xl font-bold text-slate-900 font-mono mt-0.5 block">
                {totalCapacity.toFixed(0)}{" "}
                <small className="text-xs font-normal text-slate-500">MW</small>
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Grid Frequency
              </span>
              <span className="text-2xl font-bold text-emerald-700 font-mono mt-0.5 block">
                {currentFreq.toFixed(2)}{" "}
                <small className="text-xs font-normal text-slate-500">Hz</small>
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Weighted Cost
              </span>
              <span className="text-2xl font-bold text-[#1D4ED8] font-mono mt-0.5 block">
                ${weightedCostMwh}{" "}
                <small className="text-xs font-normal text-slate-500">
                  /MWh
                </small>
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Carbon Intensity
              </span>
              <span className="text-2xl font-bold text-slate-800 font-mono mt-0.5 block">
                {weightedCarbon}{" "}
                <small className="text-xs font-normal text-slate-500">
                  kg/MWh
                </small>
              </span>
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Renewables Share
              </span>
              <span className="text-2xl font-bold text-emerald-600 font-mono mt-0.5 block">
                {cleanEnergyShare}%
              </span>
            </div>
          </div>
        </div>

        {/* Open Electricity Style Two-Column Section: Stacked Diurnal Chart + Fuel Breakdown Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Generation by Fuel Technology (MW)
                </h3>
                <p className="text-xs text-slate-500">
                  Diurnal stacked generation profile across Coal, Gas CCGT, and
                  Solar PV
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#475569]" />
                  Coal
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#EA580C]" />
                  Gas
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
                  Solar
                </span>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mixHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#CBD5E1",
                      color: "#1E293B",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Coal"
                    stackId="1"
                    stroke="#334155"
                    fill="#475569"
                    fillOpacity={0.85}
                  />
                  <Area
                    type="monotone"
                    dataKey="Gas"
                    stackId="1"
                    stroke="#C2410C"
                    fill="#EA580C"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="Solar"
                    stackId="1"
                    stroke="#059669"
                    fill="#10B981"
                    fillOpacity={0.85}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Supply, Contribution & Marginal Cost
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  LIVE BREAKDOWN
                </span>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5">Source</th>
                    <th className="py-2.5 text-right">Power</th>
                    <th className="py-2.5 text-right">Share</th>
                    <th className="py-2.5 text-right">Cost ($/kWh)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-3 font-sans font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#475569]" />
                      Coal (Supercritical)
                    </td>
                    <td className="py-3 text-right text-slate-900 font-bold">
                      {coalPower.toFixed(1)} MW
                    </td>
                    <td className="py-3 text-right text-slate-600">
                      {((coalPower / totalPower) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-right text-slate-800">
                      ${computePlantCosts(plants[0]).variableCostKwh.toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#EA580C]" />
                      Gas (Combined Cycle)
                    </td>
                    <td className="py-3 text-right text-slate-900 font-bold">
                      {gasPower.toFixed(1)} MW
                    </td>
                    <td className="py-3 text-right text-slate-600">
                      {((gasPower / totalPower) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 text-right text-slate-800">
                      ${computePlantCosts(plants[1]).variableCostKwh.toFixed(4)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 font-sans font-semibold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
                      Solar PV (Utility)
                    </td>
                    <td className="py-3 text-right text-emerald-700 font-bold">
                      {solarPower.toFixed(1)} MW
                    </td>
                    <td className="py-3 text-right text-emerald-700">
                      {cleanEnergyShare}%
                    </td>
                    <td className="py-3 text-right text-emerald-700 font-bold">
                      ${computePlantCosts(plants[2]).variableCostKwh.toFixed(4)}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="border-t-2 border-slate-200 font-mono font-bold text-slate-900">
                  <tr>
                    <td className="pt-3 font-sans">Total Net System</td>
                    <td className="pt-3 text-right">
                      {totalPower.toFixed(1)} MW
                    </td>
                    <td className="pt-3 text-right">100.0%</td>
                    <td className="pt-3 text-right text-[#1D4ED8]">
                      ${(Number(weightedCostMwh) / 1000).toFixed(4)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Active AI Dispatch Recommendation:
              </span>
              <button
                onClick={() => navigate("/dashboard")}
                className="font-semibold text-[#1D4ED8] hover:underline cursor-pointer"
              >
                100% Solar Priority • View AI Advisor →
              </button>
            </div>
          </div>
        </div>

        <HomeFacilityCards
          plants={plants}
          telemetry={telemetry}
          onSelectFacility={(plantId) => {
            handleSelectPlant(plantId);
            navigate("/dashboard");
          }}
        />
      </div>
    </div>
  );
}

